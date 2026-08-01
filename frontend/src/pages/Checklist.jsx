import { SEO } from "@/components/SEO";
import { PACKAGES } from "@/config/pricing";

export default function Checklist() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-32" data-testid="checklist-page">
      <SEO title="Cleaning checklist" description="Exactly what's included in every Magic Genie Services package." path="/checklist" />
      <div className="eyebrow">Checklist</div>
      <h1 className="font-serif text-5xl lg:text-6xl mt-6 leading-[1.02] tracking-tight max-w-3xl">What you get, room by room.</h1>
      <p className="mt-4 text-[16px] text-[#0A1128]/70 max-w-2xl leading-relaxed">Our teams work from a written checklist on every visit. This is the standard scope of each residential package.</p>

      <div className="mt-14 grid lg:grid-cols-3 gap-6">
        {PACKAGES.map((p) => (
          <div key={p.key} data-testid={`checklist-${p.key}`} className={`rounded-3xl bg-white p-8 border ${p.highlight ? "border-[#D4AF37]" : "border-[#0A1128]/8"}`}>
            <div className="font-serif text-3xl">{p.label}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] mt-2">{p.tagline}</div>
            <ul className="mt-6 space-y-3 text-[14px] text-[#0A1128]/80">
              {p.includes.map((line) => <li key={line} className="flex gap-2"><span className="text-[#D4AF37]">·</span>{line}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
