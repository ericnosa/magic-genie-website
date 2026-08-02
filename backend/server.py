from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from pricing import (
    RESIDENTIAL, ADD_ONS, INCLUDED_ADDONS, RECURRING_DISCOUNTS,
    HOME_SIZE_LABELS, PACKAGE_LABELS, compute_quote, MIN_BOOKING,
)
from emailer import send_email, render_customer_confirmation, render_admin_notification

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Magic Genie Services API")
api_router = APIRouter(prefix="/api")


@app.get("/health")
async def health():
    """Kubernetes-friendly liveness probe."""
    return {"status": "ok"}

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class QuoteRequest(BaseModel):
    home_size: str
    package: str
    add_ons: list[str] = []
    recurring: str = "one_time"


class BookingCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    customer_email: EmailStr
    customer_phone: str = Field(min_length=7, max_length=30)
    address: str = Field(min_length=5, max_length=300)
    home_size: str
    package: str
    add_ons: list[str] = []
    recurring: str = "one_time"
    date: str  # ISO date yyyy-mm-dd
    time: str  # e.g. "9:00 AM"
    notes: Optional[str] = None


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    message: str = Field(min_length=5, max_length=2000)
    kind: str = "general"  # or "commercial_quote"


# ---------- Helpers ----------
def _new_booking_id() -> str:
    # Human-readable reference like MG-XXXXXX
    return "MG-" + uuid.uuid4().hex[:6].upper()


def _validate_selection(home_size: str, package: str, recurring: str):
    if home_size not in RESIDENTIAL:
        raise HTTPException(400, f"Invalid home_size: {home_size}")
    if package not in PACKAGE_LABELS:
        raise HTTPException(400, f"Invalid package: {package}")
    if recurring not in RECURRING_DISCOUNTS:
        raise HTTPException(400, f"Invalid recurring: {recurring}")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Magic Genie Services", "status": "ok"}


@api_router.get("/pricing")
async def get_pricing():
    """Read-only pricing snapshot for clients that want to fetch instead of bundle."""
    return {
        "residential": RESIDENTIAL,
        "add_ons": ADD_ONS,
        "included_addons": {k: list(v) for k, v in INCLUDED_ADDONS.items()},
        "recurring_discounts": RECURRING_DISCOUNTS,
        "home_size_labels": HOME_SIZE_LABELS,
        "package_labels": PACKAGE_LABELS,
        "min_booking": MIN_BOOKING,
    }


@api_router.post("/quote")
async def quote(req: QuoteRequest):
    _validate_selection(req.home_size, req.package, req.recurring)
    return compute_quote(req.home_size, req.package, req.add_ons, req.recurring)


@api_router.post("/bookings")
async def create_booking(req: BookingCreate):
    _validate_selection(req.home_size, req.package, req.recurring)
    q = compute_quote(req.home_size, req.package, req.add_ons, req.recurring)

    booking_id = _new_booking_id()
    now_iso = datetime.now(timezone.utc).isoformat()
    doc = {
        "booking_id": booking_id,
        "customer_name": req.customer_name,
        "customer_email": req.customer_email,
        "customer_phone": req.customer_phone,
        "address": req.address,
        "date": req.date,
        "time": req.time,
        "notes": req.notes,
        "quote": q,
        "status": "confirmed",
        "created_at": now_iso,
    }
    await db.bookings.insert_one({**doc})  # motor mutates dict, so pass copy

    # Fire emails (best-effort, non-blocking failures do not break booking).
    owner_email = os.environ.get("OWNER_EMAIL")
    try:
        await send_email(
            to=req.customer_email,
            subject=f"Your Magic Genie booking is confirmed · {booking_id}",
            html=render_customer_confirmation(doc),
            reply_to=owner_email,
        )
    except Exception as e:
        logger.error(f"Customer email failed: {e}")
    if owner_email:
        try:
            await send_email(
                to=owner_email,
                subject=f"New booking · {booking_id} · {req.customer_name}",
                html=render_admin_notification(doc),
                reply_to=req.customer_email,
            )
        except Exception as e:
            logger.error(f"Admin email failed: {e}")

    doc.pop("_id", None)
    return doc


@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    doc = await db.bookings.find_one({"booking_id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc


@api_router.post("/contact")
async def create_contact(req: ContactCreate):
    now_iso = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "message": req.message,
        "kind": req.kind,
        "created_at": now_iso,
    }
    await db.contacts.insert_one({**doc})

    owner_email = os.environ.get("OWNER_EMAIL")
    if owner_email:
        subject = ("New commercial quote request" if req.kind == "commercial_quote"
                   else "New contact message")
        html = f"""
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h3 style="color:#0A1128;">{subject}</h3>
          <p><strong>From:</strong> {req.name} &lt;{req.email}&gt;<br/>
             <strong>Phone:</strong> {req.phone or 'Not provided'}</p>
          <p style="white-space:pre-wrap;color:#4a5567;">{req.message}</p>
        </div>
        """
        try:
            await send_email(owner_email, f"{subject} · {req.name}", html, reply_to=req.email)
        except Exception as e:
            logger.error(f"Contact email failed: {e}")

    return {"status": "received", "id": doc["id"]}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
