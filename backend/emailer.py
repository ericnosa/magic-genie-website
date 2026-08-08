"""Email delivery via Emergent-managed Resend proxy."""
import os
import logging
import httpx

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]


RECURRING_LABELS = {
    "one_time": "One time",
    "monthly":  "Monthly",
    "biweekly": "Biweekly",
    "weekly":   "Weekly",
}


async def send_email(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    payload = {
        "to": [to],
        "subject": subject,
        "html": html,
        "from_name": EMAIL_FROM_NAME,
    }
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"Email send failed to {to}: {e}")
        return False


def _line(label: str, value: str, muted: bool = False, accent: bool = False) -> str:
    color = "#93a1b0" if muted else ("#0F5132" if accent else "#0A1128")
    return (
        f'<tr>'
        f'<td style="padding:6px 0;color:#4a5567;font-size:14px;font-family:Arial,sans-serif;">{label}</td>'
        f'<td style="padding:6px 0;text-align:right;color:{color};font-size:14px;font-family:Arial,sans-serif;">{value}</td>'
        f'</tr>'
    )


def _breakdown_rows(quote: dict) -> str:
    """Itemized rows shared by customer + admin templates so numbers stay identical."""
    rows = []
    rows.append(_line(f'{quote["package_label"]} · {quote["home_size_label"]}', f'${quote["base_price"]}'))
    if quote["add_ons"]:
        for a in quote["add_ons"]:
            rows.append(_line(a["name"], f'${a["price"]}'))
    else:
        rows.append(
            '<tr><td colspan="2" style="padding:6px 0;color:#93a1b0;font-size:13px;'
            'font-family:Arial,sans-serif;font-style:italic;">No add-ons selected</td></tr>'
        )
    rows.append(
        '<tr><td colspan="2" style="padding:6px 0;border-top:1px solid rgba(10,17,40,0.08);"></td></tr>'
    )
    rows.append(_line("Subtotal", f'${quote["subtotal"]:.2f}'))
    if quote.get("discount_amount"):
        pct = int(round(quote.get("discount_rate", 0) * 100))
        rows.append(_line(f'Recurring discount ({pct}%)', f'-${quote["discount_amount"]:.2f}', accent=True))
    rows.append(_line("GST (5%)", f'${quote["gst"]:.2f}'))
    rows.append(_line("PST (6%)", f'${quote["pst"]:.2f}'))
    return "".join(rows)


def render_customer_confirmation(booking: dict) -> str:
    quote = booking["quote"]
    address = booking["address"]
    recurring_label = RECURRING_LABELS.get(quote.get("recurring", "one_time"), "One time")
    notes_block = ""
    if booking.get("notes"):
        notes_block = (
            f'<div style="margin-top:22px;padding:16px 20px;background:#FDFBF7;'
            f'border-left:3px solid #D4AF37;border-radius:6px;">'
            f'<div style="color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;'
            f'font-family:Arial,sans-serif;margin-bottom:6px;">Notes for the team</div>'
            f'<div style="color:#0A1128;font-size:14px;line-height:1.55;font-family:Arial,sans-serif;'
            f'white-space:pre-wrap;">{booking["notes"]}</div></div>'
        )

    return f"""
<!doctype html>
<html><body style="margin:0;padding:0;background:#FDFBF7;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF7;padding:48px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(10,17,40,0.08);">
      <tr><td style="background:#0A1128;padding:36px 40px;text-align:left;">
        <div style="color:#D4AF37;letter-spacing:0.24em;font-size:11px;text-transform:uppercase;font-family:Arial,sans-serif;">Magic Genie Services</div>
        <h1 style="color:#FDFBF7;font-size:28px;margin:14px 0 0;font-weight:400;">Your booking is confirmed.</h1>
      </td></tr>
      <tr><td style="padding:36px 40px;">
        <p style="color:#0A1128;font-size:16px;line-height:1.7;margin:0 0 24px;font-family:Georgia,serif;">
          Hello {booking["customer_name"]},
        </p>
        <p style="color:#4a5567;font-size:15px;line-height:1.7;margin:0 0 28px;font-family:Arial,sans-serif;">
          Thank you for choosing Magic Genie Services. Your cleaning appointment is confirmed. A team member will arrive at the scheduled time below.
        </p>

        <div style="background:#FDFBF7;border:1px solid rgba(10,17,40,0.06);border-radius:12px;padding:22px 24px;margin:0 0 24px;">
          <div style="color:#93a1b0;letter-spacing:0.2em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:6px;">Booking Reference</div>
          <div style="color:#0A1128;font-size:20px;font-family:'Courier New',monospace;letter-spacing:0.08em;">{booking["booking_id"]}</div>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="padding:6px 0;color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">Appointment</td></tr>
          <tr><td style="padding:2px 0 14px;color:#0A1128;font-size:16px;font-family:Georgia,serif;">{booking["date"]} at {booking["time"]}</td></tr>
          <tr><td style="padding:6px 0;color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">Frequency</td></tr>
          <tr><td style="padding:2px 0 14px;color:#0A1128;font-size:16px;font-family:Georgia,serif;">{recurring_label}</td></tr>
          <tr><td style="padding:6px 0;color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">Address</td></tr>
          <tr><td style="padding:2px 0 6px;color:#0A1128;font-size:16px;font-family:Georgia,serif;">{address}</td></tr>
        </table>

        <div style="color:#93a1b0;letter-spacing:0.2em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;margin:8px 0 8px;">Price breakdown</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(10,17,40,0.08);padding-top:12px;">
          {_breakdown_rows(quote)}
          <tr><td style="padding:16px 0 0;color:#0A1128;font-size:16px;border-top:1px solid rgba(10,17,40,0.08);font-family:Georgia,serif;"><strong>Total</strong></td>
              <td style="padding:16px 0 0;text-align:right;color:#D4AF37;font-size:22px;border-top:1px solid rgba(10,17,40,0.08);font-family:Georgia,serif;"><strong>${quote["total"]:.2f} CAD</strong></td></tr>
        </table>

        {notes_block}

        <p style="color:#4a5567;font-size:13px;line-height:1.7;margin:32px 0 0;font-family:Arial,sans-serif;">
          Need to reschedule? Just reply to this email or call us at 236 506 9800. Free rescheduling is available up to 24 hours before your appointment.
        </p>
      </td></tr>
      <tr><td style="background:#FDFBF7;padding:24px 40px;text-align:center;border-top:1px solid rgba(10,17,40,0.06);">
        <div style="color:#93a1b0;font-size:12px;font-family:Arial,sans-serif;">Magic Genie Services · Regina, Saskatchewan</div>
        <div style="color:#93a1b0;font-size:12px;font-family:Arial,sans-serif;margin-top:4px;">236 506 9800 · info@magicgenieservices.ca</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>
"""


def render_admin_notification(booking: dict) -> str:
    quote = booking["quote"]
    recurring_label = RECURRING_LABELS.get(quote.get("recurring", "one_time"), "One time")
    notes = booking.get("notes") or "None"
    return f"""
<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;">
  <tr><td>
    <h2 style="color:#0A1128;margin:0 0 4px;">New booking received</h2>
    <p style="color:#93a1b0;margin:0 0 20px;font-size:13px;font-family:'Courier New',monospace;">Reference {booking["booking_id"]}</p>
    <p style="color:#0A1128;font-size:14px;line-height:1.7;margin:0 0 20px;">
      <strong>Customer:</strong> {booking["customer_name"]}<br/>
      <strong>Email:</strong> {booking["customer_email"]}<br/>
      <strong>Phone:</strong> {booking["customer_phone"]}<br/>
      <strong>Address:</strong> {booking["address"]}<br/>
      <strong>Date:</strong> {booking["date"]} at {booking["time"]}<br/>
      <strong>Frequency:</strong> {recurring_label}
    </p>
    <div style="color:#93a1b0;letter-spacing:0.2em;font-size:10px;text-transform:uppercase;margin:6px 0 6px;">Price breakdown</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(10,17,40,0.08);padding-top:8px;">
      {_breakdown_rows(quote)}
      <tr><td style="padding:12px 0 0;color:#0A1128;font-size:15px;border-top:1px solid rgba(10,17,40,0.08);"><strong>Total</strong></td>
          <td style="padding:12px 0 0;text-align:right;color:#0A1128;font-size:15px;border-top:1px solid rgba(10,17,40,0.08);"><strong>${quote["total"]:.2f} CAD</strong></td></tr>
    </table>
    <p style="color:#4a5567;font-size:13px;margin-top:20px;">
      <strong>Notes:</strong> {notes}
    </p>
  </td></tr>
</table>
</body></html>
"""
