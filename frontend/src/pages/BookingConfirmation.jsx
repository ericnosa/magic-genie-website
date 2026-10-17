import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { BUSINESS } from "@/config/business";

const tokenKey = (id) => `mg_booking_token_${id}`;

export default function BookingConfirmation() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [error, setError] = useState(false);
  const [needsProof, setNeedsProof] = useState(false);
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);

  // A booking reference is not proof of ownership, so the API asks for the token that was
  // issued with the booking, or for the email address the booking was placed with.
  const load = useCallback(async (withEmail) => {
    setChecking(true);
    try {
      let token = "";
      try { token = localStorage.getItem(tokenKey(id)) || ""; } catch { token = ""; }
      const r = await api.get(`/bookings/${id}`, {
        headers: token ? { "x-booking-token": token } : {},
        params: withEmail ? { email: withEmail } : undefined,
      });
      setB(r.data);
      setNeedsProof(false);
      setError(false);
    } catch (e) {
      if (e?.response?.status === 403) {
        setNeedsProof(true);
      } else {
        setError(true);
      }
    } finally {
      setChecking(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (needsProof) return (
    <div className="max-w-xl mx-auto px-6 py-32" data-testid="confirmation-gate">
      <SEO title="Confirm your email to view this booking" path={`/booking/confirmation/${id}`} />
      <div className="eyebrow">One quick check</div>
      <h1 className="font-serif text-4xl mt-4 leading-[1.05] tracking-tight">Confirm your email to view this booking.</h1>
      <p className="mt-4 text-[15px] text-[#0A1128]/70 leading-relaxed">
        For your privacy, a booking can only be opened by the person who made it. Enter the email
        address you booked with and we'll show your confirmation.
      </p>
      <form
        className="mt-8 flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => { e.preventDefault(); if (email.trim()) load(email.trim()); }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          data-testid="confirmation-email"
          className="flex-1 rounded-full border border-[#0A1128]/12 px-5 py-3 text-[14px] outline-none focus:border-[#D4AF37]"
        />
        <button
          type="submit"
          disabled={checking}
          data-testid="confirmation-email-submit"
          className="rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px] hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300 disabled:opacity-60"
          style={{ transitionProperty: "background-color, color" }}
        >
          {checking ? "Checking…" : "View my booking"}
        </button>
      </form>
      <p className="mt-6 text-xs text-[#0A1128]/60">
        Trouble getting in? Email {BUSINESS.email} with reference {id} and we'll sort it out.
      </p>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center" data-testid="confirmation-error">
      <div className="font-serif text-4xl">We couldn't find that booking.</div>
      <Link to="/booking" className="mt-6 inline-flex rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px]">Start again</Link>
    </div>
  );
  if (!b) return <div className="max-w-2xl mx-auto px-6 py-32 text-center text-[#0A1128]/60">Loading your confirmation…</div>;

  const q = b.quote;
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-20 pb-32" data-testid="confirmation-page">
      <SEO title={`Booking ${b.booking_id} confirmed`} path={`/booking/confirmation/${id}`} />
      <div className="rounded-full w-16 h-16 bg-[#0F5132] text-white flex items-center justify-center">
        <Check className="w-7 h-7" />
      </div>
      <div className="eyebrow mt-8">Confirmed</div>
      <h1 className="font-serif text-5xl lg:text-6xl mt-4 leading-[1.02] tracking-tight">Your cleaning is booked.</h1>
      <p className="mt-4 text-[16px] text-[#0A1128]/70 max-w-xl leading-relaxed">
        Save your reference below. We'll email a copy to {b.customer_email} shortly. To change anything, just reply to that email and a person will take care of it.
      </p>

      <div className="mt-10 rounded-3xl bg-white border border-[#0A1128]/8 p-8 lg:p-10">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#0A1128]/60">Reference</div>
            <div className="font-mono text-xl mt-1" data-testid="confirmation-ref">{b.booking_id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.24em] text-[#0A1128]/60">Total</div>
            <div className="font-serif text-4xl text-[#D4AF37] mt-1">${q.total.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-6 text-[14px]">
          <div>
            <div className="text-[#0A1128]/60 text-xs uppercase tracking-[0.2em] mb-1">Service</div>
            <div>{q.package_label} · {q.home_size_label}</div>
          </div>
          <div>
            <div className="text-[#0A1128]/60 text-xs uppercase tracking-[0.2em] mb-1">When</div>
            <div>{b.date} · {b.time}</div>
          </div>
          <div>
            <div className="text-[#0A1128]/60 text-xs uppercase tracking-[0.2em] mb-1">Address</div>
            <div>{b.address}</div>
          </div>
          <div>
            <div className="text-[#0A1128]/60 text-xs uppercase tracking-[0.2em] mb-1">Contact</div>
            <div>{b.customer_name}<br />{b.customer_phone}</div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px] hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>
          Back to home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/checklist" className="inline-flex items-center gap-2 rounded-full border border-[#0A1128]/12 px-6 py-3 text-[13px] hover:border-[#D4AF37] duration-300" style={{ transitionProperty: "border-color" }}>
          See what's included
        </Link>
      </div>
    </div>
  );
}
