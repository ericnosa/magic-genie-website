import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PACKAGES, RESIDENTIAL_PRICES, HOME_SIZES, ADD_ONS, RECURRING_OPTIONS, SPECIALTY, MIN_ONE_TIME, MIN_RECURRING } from "@/config/pricing";

export default function Pricing() {
  return (
    <div data-testid="pricing-page">
      <SEO title="Transparent flat pricing" description="Every service, every add-on, every discount. Priced flat in CAD for Regina, Saskatchewan homes and hosts." path="/pricing" />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="eyebrow">Pricing</div>
        <h1 className="font-serif text-5xl lg:text-7xl mt-6 leading-[0.98] tracking-tight max-w-3xl">The price you see is the price you pay.</h1>
        <p className="mt-6 text-[16px] text-[#0A1128]/70 max-w-2xl leading-relaxed">
          Flat rates by home size. Add-ons priced individually. Recurring discounts applied automatically at booking. Minimum booking ${MIN_ONE_TIME} CAD one-time, ${MIN_RECURRING} CAD on a recurring plan.
        </p>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16">
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
                    <td key={p.key} className="p-5 font-serif text-lg">${RESIDENTIAL_PRICES[s.key][p.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-10">
          <div className="eyebrow">Specialty</div>
          <h2 className="font-serif text-3xl mt-3">Beyond residential</h2>
          <ul className="mt-6 space-y-4 text-[15px]">
            <li className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span>Deep cleaning</span><span className="font-serif text-lg">From ${SPECIALTY.deep_clean_starting}</span></li>
            <li className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span>Airbnb · Studio / 1BR</span><span className="font-serif text-lg">${SPECIALTY.airbnb.studio_1br.min}–${SPECIALTY.airbnb.studio_1br.max}</span></li>
            <li className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span>Airbnb · 2BR+</span><span className="font-serif text-lg">${SPECIALTY.airbnb.two_plus.min}–${SPECIALTY.airbnb.two_plus.max}</span></li>
            <li className="flex justify-between border-b border-[#0A1128]/8 pb-3"><span>Same day Airbnb guarantee</span><span className="font-serif text-lg">+${SPECIALTY.airbnb.same_day}</span></li>
            <li className="flex justify-between"><span>Commercial</span><span className="font-serif text-lg">Custom quote</span></li>
          </ul>
        </div>

        <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-10">
          <div className="eyebrow">Add-ons</div>
          <h2 className="font-serif text-3xl mt-3">Choose exactly what you need</h2>
          <ul className="mt-6 space-y-3 text-[14px]">
            {ADD_ONS.map((a) => (
              <li key={a.key} className="flex justify-between gap-4 border-b border-[#0A1128]/8 pb-3 last:border-0">
                <div>
                  <div>{a.name}</div>
                  <div className="text-[12px] text-[#0A1128]/55">{a.note}</div>
                </div>
                <div className="font-serif text-lg whitespace-nowrap">{a.range || `$${a.price}`}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24 grid lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-[#0A1128] text-[#FDFBF7] p-10">
          <div className="eyebrow">Recurring discounts</div>
          <h2 className="font-serif text-3xl mt-3">Book on a rhythm, save automatically</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            {RECURRING_OPTIONS.filter(r => r.discount > 0).map((r) => (
              <li key={r.key} className="flex justify-between border-b border-[#FDFBF7]/10 pb-3">
                <span>{r.label}</span>
                <span className="font-serif text-lg text-[#D4AF37]">{(r.discount * 100).toFixed(0)}% off</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-10">
          <div className="eyebrow">Booking policies</div>
          <h2 className="font-serif text-3xl mt-3">Clear, fair, human</h2>
          <ul className="mt-6 space-y-3 text-[14px] text-[#0A1128]/80 leading-relaxed">
            <li>Minimum booking of ${MIN_ONE_TIME} CAD one-time, or ${MIN_RECURRING} CAD on a recurring plan.</li>
            <li>Free reschedule up to 24 hours ahead of the appointment.</li>
            <li>Reschedules inside 24 hours are charged at 50 percent of the booking.</li>
            <li>No-shows are charged in full.</li>
            <li>Exceptionally large or complex homes may be manually reviewed before final confirmation.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32 text-center">
        <Link to="/booking" data-testid="pricing-cta-book" className="inline-flex items-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-10 py-4 text-[14px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>Start booking</Link>
      </section>
    </div>
  );
}
