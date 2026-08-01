import { SEO } from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  ["Do you charge by the hour?", "No. Every residential clean is a flat rate priced by home size and package. What you see on the pricing page is what you pay."],
  ["What areas do you serve?", "Regina, Saskatchewan. We are focused on one city so our teams and schedules stay tight."],
  ["Can I reschedule?", "Yes. Free reschedule up to 24 hours before your appointment. Inside 24 hours a 50 percent fee applies. No-shows are billed in full."],
  ["Are you insured and bonded?", "Yes. Every cleaner is background-checked, trained on our written checklist, and covered by our liability policy."],
  ["Do you bring supplies?", "Yes. All standard products and equipment. If you prefer plant-based, low-VOC products, add the eco-friendly upgrade at booking."],
  ["What if I'm not home?", "Many clients leave a key or a code. We treat every home with the same care whether you're there or not."],
  ["Do you offer same-day Airbnb turnovers?", "Yes. Add the same-day guarantee at booking for a small flat fee."],
  ["How is Fresh Start Clean different from Deep Clean?", "Fresh Start is our most comprehensive residential package, designed for move-in, move-out, and listing prep. Deep Clean is our standalone deep-reset service."],
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-20 pb-32" data-testid="faq-page">
      <SEO title="Frequently asked questions" description="Answers to the questions Regina customers ask most." path="/faq" />
      <div className="eyebrow">FAQ</div>
      <h1 className="font-serif text-5xl lg:text-6xl mt-6 leading-[1.02] tracking-tight">Answers to the questions we hear most.</h1>
      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map(([q,a], i) => (
          <AccordionItem value={`i${i}`} key={i} className="border-b border-[#0A1128]/10">
            <AccordionTrigger data-testid={`faq-${i}`} className="text-left font-serif text-xl py-6 hover:no-underline">{q}</AccordionTrigger>
            <AccordionContent className="text-[15px] text-[#0A1128]/75 leading-relaxed pb-6">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
