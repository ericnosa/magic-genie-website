import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SPECIALTY } from "@/config/pricing";

const IMG = "/images/oven-scrub.jpg";

export default function Airbnb() {
  return (
    <div data-testid="airbnb-page">
      <SEO title="Airbnb turnover cleaning in Regina" description="Reliable, five star Airbnb turnovers in Regina. From $79 per turnover, flat pricing, optional same day guarantee." path="/airbnb" />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="eyebrow">Airbnb turnover</div>
          <h1 className="font-serif text-5xl lg:text-7xl mt-6 leading-[0.98] tracking-tight">Turnovers your guests write reviews about.</h1>
          <p className="mt-6 text-[16px] text-[#0A1128]/70 max-w-xl leading-relaxed">
            Consistent linen presentation, restocked essentials, and a photographic finish standard. We run tight windows between one guest leaving and the next arriving without ever cutting corners.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-md">
            <div className="rounded-2xl border border-[#0A1128]/8 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60">Studio · 1 Bedroom</div>
              <div className="font-serif text-3xl mt-1">${SPECIALTY.airbnb.studio_1br.min}–${SPECIALTY.airbnb.studio_1br.max}</div>
              <div className="text-xs text-[#0A1128]/60">per turnover</div>
            </div>
            <div className="rounded-2xl border border-[#0A1128]/8 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-[#0A1128]/60">2+ Bedroom</div>
              <div className="font-serif text-3xl mt-1">${SPECIALTY.airbnb.two_plus.min}–${SPECIALTY.airbnb.two_plus.max}</div>
              <div className="text-xs text-[#0A1128]/60">per turnover</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#0A1128]/60">Optional same day guarantee: +${SPECIALTY.airbnb.same_day}.</p>
          <Link to="/booking?service=airbnb" data-testid="airbnb-book" className="mt-10 inline-flex items-center rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-4 text-[13px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>
            Book a turnover
          </Link>
        </div>
        <div className="lg:col-span-5">
          <img src={IMG} alt="Gloved hand scrubbing a stainless steel oven surface to a guest-ready finish" className="rounded-3xl w-full h-[520px] object-cover" />
        </div>
      </section>
    </div>
  );
}
