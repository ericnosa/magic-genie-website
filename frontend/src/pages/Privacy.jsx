import { SEO } from "@/components/SEO";
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-20 pb-32" data-testid="privacy-page">
      <SEO title="Privacy policy" path="/privacy" />
      <div className="eyebrow">Legal</div>
      <h1 className="font-serif text-5xl mt-4 tracking-tight">Privacy Policy</h1>
      <div className="prose mt-8 text-[15px] text-[#0A1128]/80 leading-relaxed space-y-4">
        <p>Magic Genie Services collects only the information required to schedule and deliver your cleaning: name, email, phone, service address in Regina, and any notes you provide at booking.</p>
        <p>We do not sell your data. Booking data is stored securely and used to coordinate your appointment, send confirmations and reminders, and follow up after the visit.</p>
        <p>If you would like your booking history removed, email us at info@magicgenieservices.ca and we will remove it within seven business days.</p>
        <p>Website analytics, when enabled, are anonymized and used only to improve the site.</p>
      </div>
    </div>
  );
}
