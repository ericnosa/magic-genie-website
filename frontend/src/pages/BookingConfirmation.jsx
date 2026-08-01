import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { BUSINESS } from "@/config/business";

export default function BookingConfirmation() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${id}`).then((r) => setB(r.data)).catch(() => setError(true));
  }, [id]);

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
        Save your reference below. We'll email a copy to {b.customer_email} shortly. To change anything, call us at {BUSINESS.phone} or reply to the confirmation email.
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
