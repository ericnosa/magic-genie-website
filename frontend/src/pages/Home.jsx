import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock, Sparkles, Award } from "lucide-react";
import { SEO, localBusinessJsonLd } from "@/components/SEO";
import { PACKAGES, RESIDENTIAL_PRICES } from "@/config/pricing";
import { BUSINESS } from "@/config/business";
import { useReveal } from "@/hooks/useReveal";
import { LogoMark } from "@/components/LogoMark";

const HERO_IMG =
  "https://images.unsplash.com/photo-1682888813913-e13f18692019?crop=entropy&cs=srgb&fm=jpg&w=2000&q=85";
const KITCHEN_IMG =
  "https://images.unsplash.com/photo-1756079664354-34944e001f6d?crop=entropy&cs=srgb&fm=jpg&w=1400&q=85";
const BEDROOM_IMG =
  "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?crop=entropy&cs=srgb&fm=jpg&w=1400&q=85";
const CLEANER_IMG =
  "/images/three-cleaners.jpg";

export default function Home() {
  const ref = useReveal();
  return (
    <div ref={ref} data-testid="home-page">
      <SEO
        title="Premium cleaning in Regina, SK"
        description="Book Regina's premium home, Airbnb, deep, and commercial cleaning. Transparent flat pricing, elegant service, professional teams."
        path="/"
        jsonLd={localBusinessJsonLd()}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-24 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative z-10">
            <LogoMark size={88} animate testId="home-hero-logo" className="mb-8" />
            <div className="eyebrow">Regina · Saskatchewan</div>
            <h1 className="font-serif tracking-tight leading-[0.98] text-[#0A1128] text-5xl sm:text-6xl lg:text-7xl mt-6">
              A cleaning service that treats your home like a five-star suite.
            </h1>
            <p className="mt-8 text-[17px] leading-relaxed text-[#0A1128]/70 max-w-lg">
              Flat pricing you can see before booking. Trained teams. Calm, thoughtful work that leaves a home feeling genuinely cared for.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                data-testid="hero-book-now"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-4 text-[14px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300"
                style={{ transitionProperty: "background-color, color" }}
              >
                Book a cleaning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                data-testid="hero-see-pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#0A1128]/15 text-[#0A1128] px-8 py-4 text-[14px] tracking-wide hover:border-[#D4AF37] hover:text-[#D4AF37] duration-300"
                style={{ transitionProperty: "border-color, color" }}
              >
                View exact pricing
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg">
              {[
                { icon: ShieldCheck, k: "Insured", v: "Bonded team" },
                { icon: Clock, k: "24hr", v: "Free reschedule" },
                { icon: Sparkles, k: "Flat", v: "No hourly fees" },
                { icon: Award, k: "5★", v: "Regina service" },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k}>
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                  <div className="mt-2 font-serif text-lg text-[#0A1128]">{k}</div>
                  <div className="text-xs text-[#0A1128]/60">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(10,17,40,0.15)]">
              <img
                src={HERO_IMG}
                alt="Luxury bright kitchen professionally cleaned"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-[#FDFBF7]/85 border border-[#0A1128]/5 rounded-2xl p-5">
                <div className="eyebrow">Starting</div>
                <div className="mt-1 font-serif text-3xl text-[#0A1128]">$119 CAD</div>
                <div className="text-xs text-[#0A1128]/60">Studio · Standard Clean · flat rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGE COMPARISON */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 reveal">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-7">
            <div className="eyebrow">Three ways to book</div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-4 tracking-tight leading-[1.05]">
              Choose the depth of clean your home needs today.
            </h2>
          </div>
          <p className="lg:col-span-5 text-[15px] leading-relaxed text-[#0A1128]/70">
            Every package is priced flat by home size. What you see is what you pay. Add-ons stack transparently on the booking screen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.key}
              data-testid={`home-package-${pkg.key}`}
              className={`relative rounded-3xl p-8 lg:p-10 bg-white border ${
                pkg.highlight ? "border-[#D4AF37]" : "border-[#0A1128]/8"
              } hover:-translate-y-1 duration-500 hover:shadow-[0_20px_50px_rgba(10,17,40,0.10)]`}
              style={{ transitionProperty: "transform, box-shadow" }}
            >
              {pkg.highlight && (
                <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  {pkg.tagline}
                </div>
              )}
              <div className="font-serif text-3xl">{pkg.label}</div>
              <p className="mt-3 text-[14px] text-[#0A1128]/70 leading-relaxed">
                {pkg.description}
              </p>
              <div className="mt-8 hairline pt-6 flex items-baseline gap-2">
                <div className="font-serif text-4xl text-[#0A1128]">
                  ${RESIDENTIAL_PRICES.two_bed[pkg.key]}
                </div>
                <div className="text-xs text-[#0A1128]/60">two-bedroom · flat</div>
              </div>
              <ul className="mt-6 space-y-2 text-[13.5px] text-[#0A1128]/75">
                {pkg.includes.slice(0, 5).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-[#D4AF37]">·</span> {line}
                  </li>
                ))}
              </ul>
              <Link
                to={`/booking?pkg=${pkg.key}`}
                data-testid={`home-select-${pkg.key}`}
                className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] tracking-wide ${
                  pkg.highlight
                    ? "bg-[#D4AF37] text-[#0A1128] hover:bg-[#0A1128] hover:text-[#FDFBF7]"
                    : "bg-[#0A1128] text-[#FDFBF7] hover:bg-[#D4AF37] hover:text-[#0A1128]"
                } duration-300`}
                style={{ transitionProperty: "background-color, color" }}
              >
                Select {pkg.label} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGERY STORY */}
      <section className="bg-[#0A1128] text-[#FDFBF7] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="eyebrow">Every visit</div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-4 tracking-tight leading-[1.05]">
              A calm arrival. A quiet, methodical clean. A home that welcomes you back.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[#FDFBF7]/70 max-w-md">
              Uniformed, insured teams. Consistent supplies. Written checklists. No rushing, no upsells at the door.
            </p>
            <Link
              to="/checklist"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#FDFBF7]/25 px-6 py-3 text-[13px] tracking-wide hover:border-[#D4AF37] hover:text-[#D4AF37] duration-300"
              style={{ transitionProperty: "border-color, color" }}
            >
              See what's included
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <img src={KITCHEN_IMG} alt="Luxury bathroom" loading="lazy" className="rounded-2xl w-full h-72 object-cover" />
            <img src={BEDROOM_IMG} alt="Hotel style bedroom" loading="lazy" className="rounded-2xl w-full h-72 object-cover mt-8" />
            <img src={CLEANER_IMG} alt="A three-person Magic Genie team actively cleaning a bright living room together" loading="lazy" className="rounded-2xl w-full h-72 object-cover col-span-2" />
          </div>
        </div>
      </section>

      {/* SERVICES QUICK NAV */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 reveal">
        <div className="eyebrow">Services</div>
        <h2 className="font-serif text-4xl lg:text-5xl mt-4 tracking-tight leading-[1.05] max-w-3xl">
          Everything Regina homes and hosts need. Priced clearly, booked instantly.
        </h2>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { to: "/residential", h: "Residential", p: "From $119. Three packages." },
            { to: "/deep-cleaning", h: "Deep Clean", p: "Starting at $279." },
            { to: "/airbnb", h: "Airbnb Turnover", p: "$79 to $139 per turnover." },
            { to: "/commercial", h: "Commercial", p: "Tailored quote for your space." },
          ].map((s) => (
            <Link
              key={s.to}
              to={s.to}
              data-testid={`services-quick-${s.to.slice(1)}`}
              className="group rounded-3xl bg-white border border-[#0A1128]/8 p-8 hover:-translate-y-1 hover:border-[#D4AF37] duration-500"
              style={{ transitionProperty: "transform, border-color" }}
            >
              <div className="font-serif text-2xl">{s.h}</div>
              <div className="mt-2 text-[13px] text-[#0A1128]/60">{s.p}</div>
              <div className="mt-6 inline-flex items-center gap-2 text-[13px] text-[#D4AF37]">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST BLOCK */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24 reveal">
        <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-10 lg:p-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="eyebrow">The Magic Genie promise</div>
            <h3 className="font-serif text-3xl lg:text-4xl mt-4 leading-[1.1]">
              If a room ever falls short, we return within 48 hours and set it right.
            </h3>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 text-[14px] text-[#0A1128]/75 leading-relaxed">
            <div>
              <div className="font-serif text-xl text-[#0A1128]">Insured and bonded</div>
              <p className="mt-2">Every cleaner is background-checked, trained on our written checklists, and covered end to end.</p>
            </div>
            <div>
              <div className="font-serif text-xl text-[#0A1128]">Flat pricing, always</div>
              <p className="mt-2">You see the exact price before you book. No hourly meter, no surprises after the visit.</p>
            </div>
            <div>
              <div className="font-serif text-xl text-[#0A1128]">Reschedule freely</div>
              <p className="mt-2">Life shifts. Move your booking up to 24 hours ahead with no fee.</p>
            </div>
            <div>
              <div className="font-serif text-xl text-[#0A1128]">Local to Regina</div>
              <p className="mt-2">We work one city, well. Same teams. Same standards. Same neighbourhoods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32 text-center reveal">
        <div className="eyebrow">Ready when you are</div>
        <h2 className="font-serif text-4xl lg:text-6xl mt-4 tracking-tight leading-[1.02] max-w-3xl mx-auto">
          Book your next cleaning in under two minutes.
        </h2>
        <Link
          to="/booking"
          data-testid="footer-cta-book"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#0A1128] text-[#FDFBF7] px-10 py-4 text-[14px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300"
          style={{ transitionProperty: "background-color, color" }}
        >
          Start booking <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="mt-6 text-xs text-[#0A1128]/50">
          Or call {BUSINESS.phone}
        </div>
      </section>
    </div>
  );
}
