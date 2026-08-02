import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const IMG = "/images/about-team-desk.jpg";

export default function About() {
  return (
    <div data-testid="about-page">
      <SEO title="About Magic Genie Services" description="Built in Regina to raise the bar for what a cleaning company can be." path="/about" />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6">
          <div className="eyebrow">About</div>
          <h1 className="font-serif text-5xl lg:text-7xl mt-6 leading-[0.98] tracking-tight">Where exceptional cleaning meets hospitality.</h1>
          <p className="mt-6 text-[16px] text-[#0A1128]/75 leading-relaxed max-w-lg">
            Magic Genie was built to give Regina homes and hosts a cleaning company that acts like a hospitality brand: consistent, quiet, on time, and priced up front.
          </p>
          <p className="mt-4 text-[15px] text-[#0A1128]/70 leading-relaxed max-w-lg">
            We work one city, well. Our teams are insured, trained on written checklists, and dispatched from a single Regina hub. No franchise chaos. No hourly meter.
          </p>
        </div>
        <div className="lg:col-span-6">
          <img src={IMG} alt="Magic Genie team member in branded uniform cleaning a desk in a modern office with the Magic Genie logo illuminated on the wall behind" className="rounded-3xl w-full h-[560px] object-cover" />
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-24 grid md:grid-cols-3 gap-6">
        {[
          ["Local roots", "We live in Regina. We work in Regina. Our schedule is built around Saskatchewan seasons and Saskatchewan homes."],
          ["Written standards", "Every visit runs on the same checklist. The same rooms get the same attention every time."],
          ["Transparent by design", "Prices published, add-ons published, policies published. Nothing negotiated at the door."],
        ].map(([t,p]) => (
          <div key={t} className="rounded-3xl bg-white border border-[#0A1128]/8 p-8">
            <div className="font-serif text-2xl">{t}</div>
            <p className="mt-3 text-[14px] text-[#0A1128]/75 leading-relaxed">{p}</p>
          </div>
        ))}
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-32 text-center">
        <Link to="/booking" className="inline-flex rounded-full bg-[#0A1128] text-[#FDFBF7] px-10 py-4 text-[14px] hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300" style={{ transitionProperty: "background-color, color" }}>
          Book your first cleaning
        </Link>
      </section>
    </div>
  );
}
