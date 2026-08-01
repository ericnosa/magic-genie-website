import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BUSINESS } from "@/config/business";
import { api } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", { ...form, kind: "general" });
      setSent(true);
      toast.success("Thanks. We'll be in touch.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-32 grid lg:grid-cols-12 gap-12" data-testid="contact-page">
      <SEO title="Contact" description="Reach Magic Genie Services in Regina, Saskatchewan." path="/contact" />
      <div className="lg:col-span-5">
        <div className="eyebrow">Contact</div>
        <h1 className="font-serif text-5xl lg:text-6xl mt-6 leading-[1.02] tracking-tight">We're a phone call away.</h1>
        <p className="mt-6 text-[15px] text-[#0A1128]/70 max-w-md leading-relaxed">
          For a same-day answer, call or email. For booking, use the booking page and confirm in under two minutes.
        </p>
        <ul className="mt-10 space-y-4 text-[15px]">
          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#D4AF37]" /><a href={BUSINESS.phoneHref} className="hover:text-[#D4AF37]">{BUSINESS.phone}</a></li>
          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#D4AF37]" /><a href={BUSINESS.genieAssistHref} className="hover:text-[#D4AF37]">Genie Assist · {BUSINESS.genieAssist}</a></li>
          <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#D4AF37]" /><a href={BUSINESS.emailHref} className="hover:text-[#D4AF37]">{BUSINESS.email}</a></li>
          <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#D4AF37]" />{BUSINESS.serviceArea.display}</li>
        </ul>
      </div>
      <div className="lg:col-span-7">
        <div className="rounded-3xl bg-white border border-[#0A1128]/8 p-8 lg:p-10">
          {sent ? (
            <div data-testid="contact-thank-you">
              <div className="font-serif text-3xl">Thank you.</div>
              <p className="mt-2 text-[14px] text-[#0A1128]/70">Your message is with the team. We'll reply within one business day.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="font-serif text-3xl">Send us a message</div>
              {["name","email","phone"].map((f) => (
                <input key={f} required={f !== "phone"} type={f === "email" ? "email" : "text"} data-testid={`contact-${f}`}
                  placeholder={f === "name" ? "Your name" : f === "email" ? "Email" : "Phone (optional)"}
                  value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full rounded-full border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37]" style={{ transitionProperty: "border-color" }} />
              ))}
              <textarea required rows={5} data-testid="contact-message" placeholder="How can we help?"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-2xl border border-[#0A1128]/12 px-5 py-3 text-[14px] focus:outline-none focus:border-[#D4AF37]" style={{ transitionProperty: "border-color" }} />
              <button type="submit" disabled={loading} data-testid="contact-submit"
                className="rounded-full bg-[#0A1128] text-[#FDFBF7] px-8 py-3 text-[13px] hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300 disabled:opacity-50" style={{ transitionProperty: "background-color, color" }}>
                {loading ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
