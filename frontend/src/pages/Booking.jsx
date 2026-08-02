import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, CalendarDays, Clock, Home as HomeIcon, User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import {
  PACKAGES, HOME_SIZES, RESIDENTIAL_PRICES, ADD_ONS, INCLUDED_ADDONS,
  RECURRING_OPTIONS, computeQuote,
} from "@/config/pricing";

const STEPS = ["Service", "Details", "When", "Contact", "Review"];
const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"];

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Booking() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const initialPkg = params.get("pkg") || "deluxe";

  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    package: initialPkg,
    home_size: "two_bed",
    add_ons: [],
    recurring: "one_time",
    date: todayPlus(2),
    time: "10:00 AM",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("mg_booking_v1");
    if (saved) {
      try { setState((s) => ({ ...s, ...JSON.parse(saved) })); } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("mg_booking_v1", JSON.stringify(state));
  }, [state]);

  const quote = useMemo(() => computeQuote({
    home_size: state.home_size, pkg: state.package,
    add_ons: state.add_ons, recurring: state.recurring,
  }), [state]);

  const set = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const toggleAddon = (k) => {
    if (INCLUDED_ADDONS[state.package]?.has(k)) return;
    set("add_ons", state.add_ons.includes(k)
      ? state.add_ons.filter((x) => x !== k)
      : [...state.add_ons, k]);
  };

  const validateStep = () => {
    if (step === 3) {
      const { customer_name, customer_email, customer_phone, address } = state;
      if (!customer_name || !customer_email || !customer_phone || !address) {
        toast.error("Please complete every field to continue.");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(customer_email)) {
        toast.error("Please enter a valid email.");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/bookings", {
        customer_name: state.customer_name,
        customer_email: state.customer_email,
        customer_phone: state.customer_phone,
        address: state.address,
        home_size: state.home_size,
        package: state.package,
        add_ons: state.add_ons,
        recurring: state.recurring,
        date: state.date,
        time: state.time,
        notes: state.notes || null,
      });
      localStorage.removeItem("mg_booking_v1");
      nav(`/booking/confirmation/${res.data.booking_id}`);
    } catch (e) {
      console.error(e);
      toast.error("We couldn't confirm your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-14 pb-32" data-testid="booking-page">
      <SEO title="Book a cleaning" description="Book your Regina cleaning in under two minutes." path="/booking" />
      <div className="eyebrow">Booking</div>
      <h1 className="font-serif text-4xl lg:text-6xl mt-4 leading-[1.02] tracking-tight">Design your cleaning.</h1>

      <div className="mt-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {/* progress */}
          <div className="flex items-center gap-2 flex-wrap mb-10" data-testid="booking-progress">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium duration-300 ${
                  i < step ? "bg-[#0F5132] text-white" : i === step ? "bg-[#0A1128] text-[#FDFBF7]" : "bg-[#0A1128]/8 text-[#0A1128]/50"
                }`} style={{ transitionProperty: "background-color, color" }}>
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className={`text-[12px] tracking-wide ${i === step ? "text-[#0A1128]" : "text-[#0A1128]/50"}`}>{label}</div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-[#0A1128]/12 mx-1" />}
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-8 lg:p-10">
            {step === 0 && (
              <div data-testid="step-service">
                <div className="font-serif text-3xl">Choose a package</div>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {PACKAGES.map((p) => (
                    <button key={p.key} onClick={() => set("package", p.key)} data-testid={`pkg-${p.key}`}
                      className={`text-left rounded-2xl p-6 border duration-300 ${state.package === p.key ? "border-[#D4AF37] bg-[#FDFBF7]" : "border-[#0A1128]/10 bg-white hover:border-[#0A1128]/25"}`}
                      style={{ transitionProperty: "border-color, background-color" }}>
                      <div className="font-serif text-2xl">{p.label}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#D4AF37]">{p.tagline}</div>
                      <div className="mt-4 font-serif text-3xl">${RESIDENTIAL_PRICES[state.home_size][p.key]}</div>
                      <div className="text-xs text-[#0A1128]/60">flat for {HOME_SIZES.find(h => h.key === state.home_size).label}</div>
                      <ul className="mt-5 pt-5 border-t border-[#0A1128]/8 space-y-2 text-[12.5px] text-[#0A1128]/75" data-testid={`pkg-${p.key}-includes`}>
                        {p.includes.map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="text-[#D4AF37]">·</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="mt-10 font-serif text-2xl">Frequency</div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {RECURRING_OPTIONS.map((r) => (
                    <button key={r.key} onClick={() => set("recurring", r.key)} data-testid={`freq-${r.key}`}
                      className={`rounded-full px-5 py-3 text-[13px] border duration-300 ${state.recurring === r.key ? "bg-[#0A1128] text-[#FDFBF7] border-[#0A1128]" : "border-[#0A1128]/12 hover:border-[#D4AF37]"}`}
                      style={{ transitionProperty: "background-color, color, border-color" }}>
                      {r.label}{r.discount ? ` · ${(r.discount*100)|0}% off` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div data-testid="step-details">
                <div className="font-serif text-3xl">Your home</div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {HOME_SIZES.map((h) => (
                    <button key={h.key} onClick={() => set("home_size", h.key)} data-testid={`size-${h.key}`}
                      className={`rounded-2xl p-4 text-left border duration-300 ${state.home_size === h.key ? "border-[#D4AF37] bg-[#FDFBF7]" : "border-[#0A1128]/10 hover:border-[#0A1128]/25"}`}
                      style={{ transitionProperty: "border-color, background-color" }}>
                      <HomeIcon className="w-4 h-4 text-[#D4AF37]" />
                      <div className="font-serif text-lg mt-2">{h.label}</div>
                      <div className="text-xs text-[#0A1128]/60">${RESIDENTIAL_PRICES[h.key][state.package]}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-10 font-serif text-2xl">Add-ons</div>
                <p className="text-xs text-[#0A1128]/60 mt-1">Items already included in your package are shown as included.</p>
                <div className="mt-4 grid md:grid-cols-2 gap-3">
                  {ADD_ONS.map((a) => {
                    const included = INCLUDED_ADDONS[state.package]?.has(a.key);
                    const selected = state.add_ons.includes(a.key);
                    return (
                      <button key={a.key} onClick={() => toggleAddon(a.key)} disabled={included} data-testid={`addon-${a.key}`}
                        className={`text-left rounded-2xl p-4 border duration-300 ${
                          included ? "border-[#0A1128]/8 bg-[#FDFBF7] cursor-default"
                          : selected ? "border-[#D4AF37] bg-[#FDFBF7]"
                          : "border-[#0A1128]/10 hover:border-[#0A1128]/25"
                        }`} style={{ transitionProperty: "border-color, background-color" }}>
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="font-serif text-lg">{a.name}</div>
                          <div className="text-sm">{included ? <span className="text-[#0F5132]">Included</span> : `$${a.price}`}</div>
                        </div>
                        <div className="text-xs text-[#0A1128]/60 mt-1">{a.note}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="step-when">
                <div className="font-serif text-3xl">Pick a date and time</div>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <label className="block">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60 mb-2 flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" /> Preferred date</div>
                    <input type="date" min={todayPlus(1)} value={state.date} onChange={(e) => set("date", e.target.value)} data-testid="booking-date"
                      className="w-full rounded-2xl border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37]" style={{ transitionProperty: "border-color" }} />
                  </label>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60 mb-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Arrival window</div>
                    <div className="grid grid-cols-3 gap-2">
                      {TIMES.map((t) => (
                        <button key={t} onClick={() => set("time", t)} data-testid={`time-${t.replace(/\s|:/g, "")}`}
                          className={`rounded-full py-2 text-[12px] border duration-300 ${state.time === t ? "bg-[#0A1128] text-[#FDFBF7] border-[#0A1128]" : "border-[#0A1128]/12 hover:border-[#D4AF37]"}`}
                          style={{ transitionProperty: "background-color, color, border-color" }}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div data-testid="step-contact">
                <div className="font-serif text-3xl">Where and who</div>
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {[
                    ["customer_name","Full name",User,"text"],
                    ["customer_email","Email",Mail,"email"],
                    ["customer_phone","Phone",Phone,"tel"],
                    ["address","Address in Regina",MapPin,"text"],
                  ].map(([k,label,Icon,type]) => (
                    <label key={k} className="block">
                      <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60 mb-2 flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{label}</div>
                      <input required type={type} value={state[k]} onChange={(e) => set(k, e.target.value)} data-testid={`field-${k}`}
                        className="w-full rounded-full border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37]" style={{ transitionProperty: "border-color" }} />
                    </label>
                  ))}
                </div>
                <label className="block mt-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60 mb-2">Notes for the team (optional)</div>
                  <textarea rows={3} value={state.notes} onChange={(e) => set("notes", e.target.value)} data-testid="field-notes"
                    className="w-full rounded-2xl border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37]" style={{ transitionProperty: "border-color" }} />
                </label>
              </div>
            )}

            {step === 4 && (
              <div data-testid="step-review">
                <div className="font-serif text-3xl">Review and confirm</div>
                <div className="mt-6 space-y-4 text-[14px]">
                  <div className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span className="text-[#0A1128]/60">Package</span><span>{PACKAGES.find(p=>p.key===state.package).label}</span></div>
                  <div className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span className="text-[#0A1128]/60">Home size</span><span>{HOME_SIZES.find(h=>h.key===state.home_size).label}</span></div>
                  <div className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span className="text-[#0A1128]/60">When</span><span>{state.date} · {state.time}</span></div>
                  <div className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span className="text-[#0A1128]/60">Address</span><span className="text-right">{state.address}</span></div>
                  <div className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span className="text-[#0A1128]/60">Contact</span><span className="text-right">{state.customer_name}<br/>{state.customer_email} · {state.customer_phone}</span></div>
                </div>
                <p className="mt-6 text-xs text-[#0A1128]/60">By confirming, you agree to our cancellation policy. We'll email your confirmation immediately.</p>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button onClick={back} disabled={step === 0} data-testid="btn-back"
                className="inline-flex items-center gap-2 rounded-full border border-[#0A1128]/12 px-6 py-3 text-[13px] tracking-wide disabled:opacity-30 hover:border-[#D4AF37] duration-300" style={{ transitionProperty: "border-color" }}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} data-testid="btn-next" className="inline-flex items-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-3 text-[13px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} data-testid="btn-confirm"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] text-[#0A1128] px-8 py-3 text-[13px] tracking-wide hover:bg-[#0A1128] hover:text-[#FDFBF7] duration-300 disabled:opacity-50" style={{ transitionProperty: "background-color, color" }}>
                  {submitting ? "Confirming…" : "Confirm booking"} <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start" data-testid="booking-summary">
          <div className="rounded-3xl bg-[#0A1128] text-[#FDFBF7] p-8">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37]">Live summary</div>
            <div className="mt-3 font-serif text-3xl">{PACKAGES.find(p=>p.key===state.package).label}</div>
            <div className="text-xs text-[#FDFBF7]/60 mt-1">{HOME_SIZES.find(h=>h.key===state.home_size).label}</div>

            <div className="mt-6 space-y-2 text-[13px] text-[#FDFBF7]/80">
              <div className="flex justify-between"><span>Base</span><span>${quote.base}</span></div>
              {quote.addOnLines.map((a) => (
                <div key={a.key} className="flex justify-between"><span>{a.name}</span><span>${a.price}</span></div>
              ))}
              <div className="flex justify-between border-t border-[#FDFBF7]/10 pt-2 mt-2"><span>Subtotal</span><span>${quote.subtotal.toFixed(2)}</span></div>
              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]"><span>Recurring discount</span><span>-${quote.discountAmount.toFixed(2)}</span></div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#FDFBF7]/10 flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[#FDFBF7]/60">Total</span>
              <span className="font-serif text-4xl text-[#D4AF37]" data-testid="summary-total">${quote.total.toFixed(2)}</span>
            </div>
            <p className="mt-4 text-[11px] text-[#FDFBF7]/50 leading-relaxed">CAD, taxes included where applicable. Flat rate. No hourly billing.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
