"""Backend tests for iteration 4 — /api/quote breakdown + booking persistence + email templates."""
import os
import sys
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback: read frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL"):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"

sys.path.insert(0, "/app/backend")


# ---------------- /api/quote math ----------------
class TestQuoteMath:
    def test_two_bed_deluxe_pet_hair_biweekly(self):
        r = requests.post(f"{API}/quote", json={
            "home_size": "two_bed", "package": "deluxe",
            "add_ons": ["pet_hair"], "recurring": "biweekly",
        }, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["subtotal"] == 264
        assert d["discount_amount"] == 26.40
        assert d["gst"] == 13.20
        assert d["pst"] == 15.84
        assert d["total"] == 266.64

    def test_studio_standard_one_time(self):
        r = requests.post(f"{API}/quote", json={
            "home_size": "studio", "package": "standard",
            "add_ons": [], "recurring": "one_time",
        }, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["subtotal"] == 119
        assert d["discount_amount"] == 0
        assert d["gst"] == 5.95
        assert d["pst"] == 7.14
        assert d["total"] == 132.09

    def test_default_two_bed_deluxe_no_addons(self):
        """Live Summary default — subtotal=249, gst=12.45, pst=14.94, total=276.39."""
        r = requests.post(f"{API}/quote", json={
            "home_size": "two_bed", "package": "deluxe",
            "add_ons": [], "recurring": "one_time",
        }, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["subtotal"] == 249
        assert d["gst"] == 12.45
        assert d["pst"] == 14.94
        assert d["total"] == 276.39


# ---------------- /api/bookings persistence ----------------
class TestBookingPersistence:
    def test_create_and_fetch_booking_has_tax_fields(self):
        payload = {
            "customer_name": "TEST_Iteration4",
            "customer_email": "test_it4@example.com",
            "customer_phone": "3065550000",
            "address": "123 TEST St, Regina",
            "home_size": "two_bed",
            "package": "deluxe",
            "add_ons": ["pet_hair"],
            "recurring": "biweekly",
            "date": "2026-02-15",
            "time": "10:00 AM",
            "notes": "TEST_Iteration4 - please ignore",
        }
        r = requests.post(f"{API}/bookings", json=payload, timeout=30)
        assert r.status_code in (200, 201), r.text
        body = r.json()
        assert "booking_id" in body
        # quote present in response
        q = body.get("quote") or body
        for k in ["subtotal", "discount_amount", "gst", "pst", "total"]:
            assert k in q, f"quote missing key {k}: {q}"
        assert q["subtotal"] == 264
        assert q["discount_amount"] == 26.40
        assert q["gst"] == 13.20
        assert q["pst"] == 15.84
        assert q["total"] == 266.64

        # Fetch and verify persistence
        bid = body["booking_id"]
        g = requests.get(f"{API}/bookings/{bid}", timeout=15)
        assert g.status_code == 200, g.text
        gq = g.json()["quote"]
        assert gq["subtotal"] == 264
        assert gq["discount_amount"] == 26.40
        assert gq["gst"] == 13.20
        assert gq["pst"] == 15.84
        assert gq["total"] == 266.64
        # no mongo _id leak
        assert "_id" not in g.json()


# ---------------- Email templates itemization ----------------
class TestEmailTemplates:
    def _sample_booking(self):
        from pricing import compute_quote
        q = compute_quote("two_bed", "deluxe", ["pet_hair"], "biweekly")
        return {
            "booking_id": "MG-TEST-123",
            "customer_name": "Jane Doe",
            "customer_email": "jane@example.com",
            "customer_phone": "3065551234",
            "address": "456 Test Blvd",
            "date": "2026-02-15",
            "time": "10:00 AM",
            "notes": "Please ring the bell.",
            "quote": q,
        }

    def test_customer_confirmation_itemization(self):
        os.environ.setdefault("EMERGENT_EMAIL_KEY", "test")
        os.environ.setdefault("EMAIL_FROM_NAME", "Test")
        from emailer import render_customer_confirmation
        b = self._sample_booking()
        html = render_customer_confirmation(b)
        # booking reference
        assert "MG-TEST-123" in html
        # package + home size label + base price
        assert "Deluxe Clean" in html
        assert "Two Bedroom" in html
        assert "$249" in html
        # add-on individual
        assert "Pet Hair Treatment" in html
        assert "$15" in html
        # subtotal, discount, gst, pst, total
        assert "Subtotal" in html and "$264.00" in html
        assert "Recurring discount" in html and "-$26.40" in html
        assert "GST (5%)" in html and "$13.20" in html
        assert "PST (6%)" in html and "$15.84" in html
        assert "Total" in html and "$266.64" in html
        # recurring frequency label
        assert "Biweekly" in html
        # notes present
        assert "Please ring the bell." in html

    def test_admin_notification_itemization(self):
        os.environ.setdefault("EMERGENT_EMAIL_KEY", "test")
        os.environ.setdefault("EMAIL_FROM_NAME", "Test")
        from emailer import render_admin_notification
        b = self._sample_booking()
        html = render_admin_notification(b)
        assert "MG-TEST-123" in html
        assert "Deluxe Clean" in html
        assert "Two Bedroom" in html
        assert "$249" in html
        assert "Pet Hair Treatment" in html
        assert "Subtotal" in html and "$264.00" in html
        assert "-$26.40" in html
        assert "$13.20" in html and "$15.84" in html
        assert "$266.64" in html
        assert "Biweekly" in html
        assert "Please ring the bell." in html

    def test_no_discount_hides_discount_line(self):
        from pricing import compute_quote
        from emailer import render_customer_confirmation
        q = compute_quote("studio", "standard", [], "one_time")
        b = {
            "booking_id": "MG-TEST-124",
            "customer_name": "John",
            "customer_email": "j@example.com",
            "customer_phone": "1",
            "address": "1 St",
            "date": "2026-02-15",
            "time": "10:00 AM",
            "notes": None,
            "quote": q,
        }
        html = render_customer_confirmation(b)
        assert "Recurring discount" not in html
        assert "No add-ons selected" in html
