"""Booking access guard — the reference alone must not open a booking.

GET /api/bookings/{booking_id} used to be open to anyone. "MG-" + 6 hex characters is only
~16.7M possibilities, so an unauthenticated lookup let someone walk the space and read customer
name, email, phone and address. It now requires the booking's own access token, or the email
address the booking was placed with.

This runs in-process against the real route code: motor, resend and email-validator are stubbed so
it needs no MongoDB and no network. Run it directly:

    python backend/tests/test_booking_access_guard.py
"""
import os
import sys
import types
import json
import pathlib

BACKEND = pathlib.Path(__file__).resolve().parents[1]

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "mgs_test")
for _k in ("EMERGENT_EMAIL_KEY", "EMERGENT_LLM_KEY", "RESEND_API_KEY",
           "EMAIL_FROM", "EMAIL_FROM_NAME", "OWNER_EMAIL"):
    os.environ.setdefault(_k, "test_value")

sys.path.insert(0, str(BACKEND))

# --- stub motor: its only job here is to hand back a fake collection ---
BOOKINGS = {}


class FakeCollection:
    async def find_one(self, query, projection=None):
        doc = BOOKINGS.get(query.get("booking_id"))
        return dict(doc) if doc else None

    async def insert_one(self, doc):
        BOOKINGS[doc["booking_id"]] = json.loads(json.dumps(doc, default=str))
        return types.SimpleNamespace(inserted_id="stub")

    async def update_one(self, *args, **kwargs):
        return types.SimpleNamespace(modified_count=0)


class FakeDB:
    def __init__(self):
        self.bookings = FakeCollection()

    def __getitem__(self, key):
        return self


class FakeClient:
    def __init__(self, *args, **kwargs):
        self._db = FakeDB()

    def __getitem__(self, key):
        return self._db


_motor = types.ModuleType("motor")
_motor_asyncio = types.ModuleType("motor.motor_asyncio")
_motor_asyncio.AsyncIOMotorClient = FakeClient
_motor.motor_asyncio = _motor_asyncio
sys.modules["motor"] = _motor
sys.modules["motor.motor_asyncio"] = _motor_asyncio

# --- stub resend so emailer imports ---
_resend = types.ModuleType("resend")


class _Emails:
    def __init__(self, *args, **kwargs):
        pass

    def send(self, *args, **kwargs):
        return types.SimpleNamespace(id="stub")


_resend.Emails = _Emails
sys.modules.setdefault("resend", _resend)

# --- stub email_validator so pydantic's EmailStr loads without pip ---
_ev = types.ModuleType("email_validator")


class _EmailNotValidError(ValueError):
    pass


def _validate_email(email, *args, **kwargs):
    value = str(email)
    if "@" not in value:
        raise _EmailNotValidError("invalid")
    local, _, domain = value.partition("@")
    return types.SimpleNamespace(local_part=local, domain=domain, name=None,
                                 normalized=value, normalized_email=value)


_ev.validate_email = _validate_email
_ev.EmailNotValidError = _EmailNotValidError
_ev.__version__ = "2.2.0"
sys.modules["email_validator"] = _ev

import importlib.metadata as _md  # noqa: E402
_orig_version = _md.version
_md.version = lambda name: "2.2.0" if name in ("email-validator", "email_validator") else _orig_version(name)

import server  # noqa: E402
from starlette.testclient import TestClient  # noqa: E402

client = TestClient(server.app)


def _seed():
    BOOKINGS.clear()
    BOOKINGS["MG-AAAAAA"] = {
        "booking_id": "MG-AAAAAA", "access_token": "tok_abc123",
        "customer_name": "Ada Lovelace", "customer_email": "Ada@Example.com",
        "customer_phone": "3065550000", "address": "1 Test Ave",
    }
    # a booking made before the guard existed: no token on it
    BOOKINGS["MG-LEGACY"] = {
        "booking_id": "MG-LEGACY", "customer_name": "Old Booking",
        "customer_email": "old@example.com", "address": "2 Test Ave",
    }


def test_reference_alone_is_refused():
    _seed()
    r = client.get("/api/bookings/MG-AAAAAA")
    assert r.status_code == 403, r.text
    assert "Ada" not in r.text


def test_guessing_is_refused():
    _seed()
    assert client.get("/api/bookings/MG-AAAAAA", headers={"x-booking-token": "nope"}).status_code == 403
    assert client.get("/api/bookings/MG-AAAAAA", params={"email": "attacker@example.com"}).status_code == 403
    assert client.get("/api/bookings/MG-AAAAAA", params={"t": "nope"}).status_code == 403


def test_owner_gets_in():
    _seed()
    r = client.get("/api/bookings/MG-AAAAAA", headers={"x-booking-token": "tok_abc123"})
    assert r.status_code == 200
    assert r.json()["customer_name"] == "Ada Lovelace"
    assert client.get("/api/bookings/MG-AAAAAA", params={"t": "tok_abc123"}).status_code == 200
    # email comparison must not be case sensitive
    assert client.get("/api/bookings/MG-AAAAAA", params={"email": "ada@example.COM"}).status_code == 200


def test_legacy_bookings_without_a_token():
    _seed()
    assert client.get("/api/bookings/MG-LEGACY").status_code == 403
    assert client.get("/api/bookings/MG-LEGACY", params={"email": "old@example.com"}).status_code == 200


def test_unknown_reference_is_404():
    _seed()
    assert client.get("/api/bookings/MG-ZZZZZZ", params={"email": "a@b.com"}).status_code == 404


def test_new_booking_is_issued_a_token():
    _seed()
    r = client.post("/api/bookings", json={
        "customer_name": "Grace Hopper", "customer_email": "grace@example.com",
        "customer_phone": "3065550001", "address": "9 Test Ave",
        "home_size": "two_bed", "package": "deluxe", "add_ons": [], "recurring": "one_time",
        "date": "2026-12-20", "time": "10:00 AM",
    })
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["booking_id"].startswith("MG-")
    assert len(str(body["access_token"])) == 32
    assert BOOKINGS[body["booking_id"]]["access_token"] == body["access_token"]
    # 2-bed Deluxe one-time, priced on the discounted subtotal
    assert body["quote"]["total"] == 276.39, body["quote"]
    # and the new booking obeys the same guard
    assert client.get(f"/api/bookings/{body['booking_id']}",
                      headers={"x-booking-token": body["access_token"]}).status_code == 200
    assert client.get(f"/api/bookings/{body['booking_id']}").status_code == 403


def _main():
    tests = [(n, f) for n, f in sorted(globals().items())
             if n.startswith("test_") and callable(f)]
    failed = []
    for name, fn in tests:
        try:
            fn()
            print(f"  PASS  {name}")
        except AssertionError as e:
            print(f"  FAIL  {name}  {e}")
            failed.append(name)
        except Exception as e:
            print(f"  ERROR {name}  {type(e).__name__}: {e}")
            failed.append(name)
    print()
    print(f"{len(tests) - len(failed)} passed, {len(failed)} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(_main())
