import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PACKAGES, RESIDENTIAL_PRICES, HOME_SIZES } from "@/config/pricing";

const HERO =
  "https://images.unsplash.com/photo-1682888813913-e13f18692019?crop=entropy&cs=srgb&fm=jpg&w=1800&q=85";

export default function Residential({ defaultPackage }) {
  return (
    <div data-testid="residential-page">
      <SEO
        title="Residential cleaning in Regina"
        description="Standard, Deluxe, and Fresh Start residential cleaning packages. Flat pricing by home size. Regina, Saskatchewan."
        path="/residential"
      />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="eyebrow">Residential</div>
        <h1 className="font-serif text-5xl lg:text-7xl mt-6 tracking-tight leading-[0.98] max-w-3xl">
          Three packages. Every home covered.
        </h1>
        <p className="mt-6 text-[16px] text-[#0A1128]/70 max-w-2xl leading-relaxed">
          Book what fits the day. Standard for regularly kept homes. Deluxe for hosting weeks. Fresh Start for move-ins, listings, and turnovers.
        </p>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <img src={HERO} alt="Bright home interior" className="rounded-3xl w-full h-[420px] object-cover" />
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((p) => (
            <div key={p.key}
                 data-testid={`res-pkg-${p.key}`}
                 className={`rounded-3xl bg-white p-10 border ${p.highlight ? "border-[#D4AF37]" : "border-[#0A1128]/8"}`}>
              <div className="font-serif text-3xl">{p.label}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] mt-2">{p.tagline}</div>
              <p className="mt-4 text-[14px] text-[#0A1128]/70 leading-relaxed">{p.description}</p>
              <ul className="mt-6 space-y-2 text-[13.5px] text-[#0A1128]/75">
                {p.includes.map((line) => (
                  <li key={line} className="flex gap-2"><span className="text-[#D4AF37]">·</span> {line}</li>
                ))}
              </ul>
              <Link to={`/booking?pkg=${p.key}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px] hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300"
                    style={{ transitionProperty: "background-color, color" }}>
                Book {p.label} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24">
        <div className="eyebrow">Full pricing table</div>
        <h2 className="font-serif text-4xl mt-4 mb-10">Prices by home size</h2>
        <div className="rounded-3xl border border-[#0A1128]/8 overflow-hidden bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FDFBF7]">
                <th className="p-5 text-xs uppercase tracking-[0.2em] text-[#0A1128]/60">Home size</th>
                {PACKAGES.map((p) => (
                  <th key={p.key} className="p-5 text-xs uppercase tracking-[0.2em] text-[#0A1128]/60">{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOME_SIZES.map((s) => (
                <tr key={s.key} className="border-t border-[#0A1128]/8">
                  <td className="p-5 font-serif text-lg">{s.label}</td>
                  {PACKAGES.map((p) => (
                    <td key={p.key} className="p-5 font-serif text-lg">
                      ${RESIDENTIAL_PRICES[s.key][p.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-[#0A1128]/60">
          Prices shown are flat CAD rates for the standard scope of each package. Exceptionally large or complex homes may receive a manual review before final confirmation.
        </p>
      </section>
    </div>
  );
}
