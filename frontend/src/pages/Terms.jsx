import { SEO } from "@/components/SEO";
export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-20 pb-32" data-testid="terms-page">
      <SEO title="Terms of service" path="/terms" />
      <div className="eyebrow">Legal</div>
      <h1 className="font-serif text-5xl mt-4 tracking-tight">Terms of Service</h1>
      <div className="prose mt-8 text-[15px] text-[#0A1128]/80 leading-relaxed space-y-4">
        <p>By booking a cleaning with Magic Genie Services you agree to our flat pricing, cancellation, and rescheduling policies as published on the pricing page.</p>
        <p>Minimum booking is $99 CAD. Free reschedule up to 24 hours ahead. Reschedules inside 24 hours are billed at 50 percent. No-shows are billed in full.</p>
        <p>Exceptionally large or unusually complex homes may receive manual review before final confirmation.</p>
        <p>We provide service exclusively within Regina, Saskatchewan.</p>
      </div>
    </div>
  );
}
