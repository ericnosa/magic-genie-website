import { useState } from "react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { BUSINESS } from "@/config/business";

const SPACES = [
  {
    src: "/images/office-desks.jpg",
    label: "Open-plan offices",
    alt: "Modern open-plan office with desks, monitors, and a whiteboard",
  },
  {
    src: "/images/reception-lounge.jpg",
    label: "Reception lounges",
    alt: "Bright reception lounge with soft seating and natural light",
  },
  {
    src: "/images/skylight-living.jpg",
    label: "Shared interiors",
    alt: "Bright residential-style shared interior with natural light",
  },
];

export default function Commercial() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", { ...form, kind: "commercial_quote" });
      setSent(true);
      toast.success("Request received. We'll be in touch within one business day.");
    } catch (err) {
      toast.error("Something went wrong. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="commercial-page">
      <SEO title="Commercial cleaning in Regina" description="Tailored commercial cleaning for offices, clinics, retail, and studios in Regina, Saskatchewan." path="/commercial" />

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <div className="eyebrow">Commercial</div>
          <h1 className="font-serif text-5xl lg:text-6xl mt-6 leading-[1.02] tracking-tight">A cleaning partner your team stops thinking about.</h1>
          <p className="mt-6 text-[16px] text-[#0A1128]/70 leading-relaxed max-w-xl">
            Offices, clinics, retail spaces, studios, and shared work environments across Regina. We build a schedule around your operating hours, produce a written scope, and staff the same team weekly so nothing slips.
          </p>
          <ul className="mt-8 space-y-3 text-[14px] text-[#0A1128]/75 max-w-lg">
            {["Daily, weekly, and monthly programs", "Post-hours or pre-open service windows", "Restocking of consumables on request", "Written scope and quality checklist per site"].map(x => (
              <li key={x} className="flex gap-2"><span className="text-[#D4AF37]">·</span>{x}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-8 lg:p-10">
            <div className="font-serif text-3xl">Request a custom quote</div>
            <p className="mt-2 text-[13px] text-[#0A1128]/60">Tell us about your space. We'll reply within one business day.</p>
            {sent ? (
              <div data-testid="commercial-thank-you" className="mt-8 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/40 p-6">
                <div className="font-serif text-2xl">Thank you.</div>
                <p className="text-[14px] text-[#0A1128]/70 mt-2">
                  Your request is with the team. We'll be in touch shortly at {form.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                {["name","email","phone"].map((f) => (
                  <input key={f} required={f !== "phone"} type={f === "email" ? "email" : "text"}
                    data-testid={`commercial-${f}`}
                    placeholder={f === "name" ? "Your name" : f === "email" ? "Email" : "Phone (optional)"}
                    value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className="w-full rounded-full border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37] duration-200" style={{ transitionProperty: "border-color" }} />
                ))}
                <textarea required rows={5} data-testid="commercial-message" placeholder="What kind of space, size, and cadence?"
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-2xl border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37] duration-200" style={{ transitionProperty: "border-color" }} />
                <button type="submit" disabled={loading} data-testid="commercial-submit"
                  className="rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-3 text-[13px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300 disabled:opacity-50" style={{ transitionProperty: "background-color, color" }}>
                  {loading ? "Sending…" : "Send request"}
                </button>
                <div className="text-xs text-[#0A1128]/50 pt-2">Or call {BUSINESS.phone}.</div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* DEDICATED ACCOUNT MANAGER */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24" data-testid="account-manager-section">
        <div className="grid lg:grid-cols-12 gap-10 items-center rounded-3xl bg-white border border-[#0A1128]/8 overflow-hidden">
          <div className="lg:col-span-6 order-2 lg:order-1 p-10 lg:p-14">
            <div className="eyebrow">Dedicated account manager</div>
            <h2 className="font-serif text-4xl mt-4 leading-[1.05]">One point of contact. Every visit accounted for.</h2>
            <p className="mt-5 text-[15px] text-[#0A1128]/75 leading-relaxed">
              Every commercial account is paired with a named account manager who owns your schedule, quality reports, and any changes to scope. No ticket queues, no reroute through general support. Reach them directly by phone or email during business hours, and expect a same-day reply on anything urgent.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] text-[#0A1128]/75">
              {[
                "Same named person for scheduling, billing, and quality issues",
                "Monthly walk-through and written condition summary",
                "Rapid response on urgent asks during business hours",
                "Discreet substitutions when your regular team is off",
              ].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-[#D4AF37]">·</span>{x}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 h-[320px] lg:h-[520px] relative">
            <img
              src="/images/headset-office.jpg"
              alt="Magic Genie account manager wearing a headset at her desk, coordinating a client schedule"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              data-testid="account-manager-image"
            />
          </div>
        </div>
      </section>

      {/* SPACES WE CARE FOR */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32" data-testid="spaces-gallery">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-10">
          <div className="lg:col-span-7">
            <div className="eyebrow">Spaces we care for</div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-4 tracking-tight leading-[1.05]">Environments already under our care in Regina.</h2>
          </div>
          <p className="lg:col-span-5 text-[14px] text-[#0A1128]/65 leading-relaxed">
            A short look at the kinds of interiors we service. These photographs are examples of the space types themselves, not visits in progress.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {SPACES.map((s) => (
            <figure key={s.src} className="group rounded-3xl overflow-hidden bg-white border border-[#0A1128]/8" data-testid={`space-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] duration-700"
                  style={{ transitionProperty: "transform" }}
                />
              </div>
              <figcaption className="px-6 py-5 flex items-center justify-between">
                <span className="font-serif text-lg text-[#0A1128]">{s.label}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#0A1128]/45">Example space</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
