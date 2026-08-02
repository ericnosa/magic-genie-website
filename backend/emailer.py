"""Email delivery via Emergent-managed Resend proxy."""
import os
import logging
import httpx

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]


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


def render_customer_confirmation(booking: dict) -> str:
    """Elegant HTML confirmation email, inline CSS, table layout."""
    quote = booking["quote"]
    address = booking["address"]
    addons_html = "".join([
        f'<tr><td style="padding:6px 0;color:#4a5567;font-size:14px;">{a["name"]}</td>'
        f'<td style="padding:6px 0;text-align:right;color:#0A1128;font-size:14px;">${a["price"]}</td></tr>'
        for a in quote["add_ons"]
    ]) or '<tr><td colspan="2" style="padding:6px 0;color:#93a1b0;font-size:14px;">No add-ons</td></tr>'

    discount_row = ""
    if quote["discount_amount"]:
        discount_row = (
            f'<tr><td style="padding:8px 0;color:#4a5567;font-size:14px;">'
            f'Recurring discount ({int(quote["discount_rate"]*100)}%)</td>'
            f'<td style="padding:8px 0;text-align:right;color:#0F5132;font-size:14px;">'
            f'-${quote["discount_amount"]:.2f}</td></tr>'
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
          <tr><td style="padding:6px 0;color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">Service</td></tr>
          <tr><td style="padding:2px 0 14px;color:#0A1128;font-size:16px;font-family:Georgia,serif;">{quote["package_label"]} · {quote["home_size_label"]}</td></tr>
          <tr><td style="padding:6px 0;color:#93a1b0;letter-spacing:0.16em;font-size:10px;text-transform:uppercase;font-family:Arial,sans-serif;">Address</td></tr>
          <tr><td style="padding:2px 0 6px;color:#0A1128;font-size:16px;font-family:Georgia,serif;">{address}</td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(10,17,40,0.08);padding-top:20px;">
          <tr><td style="padding:8px 0;color:#4a5567;font-size:14px;">{quote["package_label"]}</td>
              <td style="padding:8px 0;text-align:right;color:#0A1128;font-size:14px;">${quote["base_price"]}</td></tr>
          {addons_html}
          {discount_row}
          <tr><td style="padding:16px 0 0;color:#0A1128;font-size:16px;border-top:1px solid rgba(10,17,40,0.08);font-family:Georgia,serif;"><strong>Total</strong></td>
              <td style="padding:16px 0 0;text-align:right;color:#D4AF37;font-size:22px;border-top:1px solid rgba(10,17,40,0.08);font-family:Georgia,serif;"><strong>${quote["total"]:.2f} CAD</strong></td></tr>
        </table>

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
    return f"""
<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;">
  <tr><td>
    <h2 style="color:#0A1128;margin:0 0 4px;">New booking received</h2>
    <p style="color:#93a1b0;margin:0 0 20px;font-size:13px;">Reference {booking["booking_id"]}</p>
    <p style="color:#0A1128;font-size:14px;line-height:1.7;margin:0;">
      <strong>Customer:</strong> {booking["customer_name"]}<br/>
      <strong>Email:</strong> {booking["customer_email"]}<br/>
      <strong>Phone:</strong> {booking["customer_phone"]}<br/>
      <strong>Address:</strong> {booking["address"]}<br/>
      <strong>Service:</strong> {quote["package_label"]} · {quote["home_size_label"]}<br/>
      <strong>Date:</strong> {booking["date"]} at {booking["time"]}<br/>
      <strong>Recurring:</strong> {booking["quote"]["recurring"]}<br/>
      <strong>Total:</strong> ${quote["total"]:.2f} CAD
    </p>
    <p style="color:#4a5567;font-size:13px;margin-top:20px;">
      Notes: {booking.get("notes") or "None"}
    </p>
  </td></tr>
</table>
</body></html>
"""
