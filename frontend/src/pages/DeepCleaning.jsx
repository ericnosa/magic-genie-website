import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SPECIALTY } from "@/config/pricing";

const IMG = "/images/bathroom-team.jpg";

export default function DeepCleaning() {
  return (
    <div data-testid="deep-cleaning-page">
      <SEO title="Deep cleaning in Regina" description="Detailed deep clean for homes that need a full reset. Starting at $279 in Regina, SK." path="/deep-cleaning" />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="eyebrow">Deep clean</div>
          <h1 className="font-serif text-5xl lg:text-7xl mt-6 leading-[0.98] tracking-tight">The full reset your home has been waiting for.</h1>
          <p className="mt-6 text-[16px] text-[#0A1128]/70 max-w-xl leading-relaxed">
            Baseboards, blinds, vents, deep bathroom scale, inside appliances, and every corner that gets skipped on the weekly pass. Book once each season and the maintenance cleans that follow feel effortless.
          </p>
          <div className="mt-8 flex flex-wrap items-baseline gap-4">
            <span className="font-serif text-5xl">${SPECIALTY.deep_clean_starting}</span>
            <span className="text-[13px] text-[#0A1128]/60">flat starting rate · adjusted by home size</span>
          </div>
          <Link to="/booking?service=deep_clean" data-testid="deep-book" className="mt-10 inline-flex items-center rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-4 text-[13px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>
            Book a deep clean
          </Link>
        </div>
        <div className="lg:col-span-5">
          <img src={IMG} alt="Two Magic Genie team members in branded uniforms deep-cleaning a luxury bathroom" className="rounded-3xl w-full h-[520px] object-cover" />
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24">
        <div className="eyebrow">What we cover</div>
        <h2 className="font-serif text-4xl mt-4">Every surface, thoughtfully.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            ["Kitchens", ["Inside oven and stovetop", "Range hood and filter", "Fridge exterior and top", "Cabinet exteriors", "Backsplash detail"]],
            ["Bathrooms", ["Deep grout attention", "Descaled showerheads", "Under-sink and vanity interiors", "Tile and tub thoroughly reset"]],
            ["Living spaces", ["Baseboards and door frames", "Ceiling fans and vents", "Blinds dusted or damp-wiped", "Behind reachable furniture"]],
          ].map(([title, items]) => (
            <div key={title} className="rounded-3xl bg-white border border-[#0A1128]/8 p-8">
              <div className="font-serif text-2xl">{title}</div>
              <ul className="mt-4 space-y-2 text-[14px] text-[#0A1128]/75">
                {items.map((i) => <li key={i} className="flex gap-2"><span className="text-[#D4AF37]">·</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
