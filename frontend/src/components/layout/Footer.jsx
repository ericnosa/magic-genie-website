import { Link } from "react-router-dom";
import { BUSINESS } from "@/config/business";

export function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#0A1128] text-[#FDFBF7] mt-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid gap-12 lg:grid-cols-4">
        <div>
          <div className="font-serif text-3xl leading-none tracking-tight">Magic Genie</div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37] mt-2">
            Services · Regina
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[#FDFBF7]/70 max-w-xs">
            Premium cleaning built around calm homes, transparent pricing, and a team that treats every visit like the first impression.
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37]">Services</div>
          <ul className="mt-5 space-y-3 text-sm text-[#FDFBF7]/80">
            <li><Link to="/residential" className="hover:text-[#D4AF37]">Residential Cleaning</Link></li>
            <li><Link to="/deep-cleaning" className="hover:text-[#D4AF37]">Deep Cleaning</Link></li>
            <li><Link to="/airbnb" className="hover:text-[#D4AF37]">Airbnb Turnover</Link></li>
            <li><Link to="/commercial" className="hover:text-[#D4AF37]">Commercial</Link></li>
            <li><Link to="/pricing" className="hover:text-[#D4AF37]">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37]">Company</div>
          <ul className="mt-5 space-y-3 text-sm text-[#FDFBF7]/80">
            <li><Link to="/about" className="hover:text-[#D4AF37]">About</Link></li>
            <li><Link to="/faq" className="hover:text-[#D4AF37]">FAQ</Link></li>
            <li><Link to="/checklist" className="hover:text-[#D4AF37]">Cleaning Checklist</Link></li>
            <li><Link to="/contact" className="hover:text-[#D4AF37]">Contact</Link></li>
            <li><Link to="/booking" className="hover:text-[#D4AF37]">Book a Cleaning</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37]">Contact</div>
          <ul className="mt-5 space-y-3 text-sm text-[#FDFBF7]/80">
            <li>{BUSINESS.serviceArea.display}</li>
            <li><a href={BUSINESS.phoneHref} className="hover:text-[#D4AF37]">{BUSINESS.phone}</a></li>
            <li><a href={BUSINESS.emailHref} className="hover:text-[#D4AF37]">{BUSINESS.email}</a></li>
            <li className="pt-2 text-[#FDFBF7]/50">{BUSINESS.hours.weekdays}</li>
            <li className="text-[#FDFBF7]/50">{BUSINESS.hours.weekend}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#FDFBF7]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FDFBF7]/50">
          <div>© {new Date().getFullYear()} Magic Genie Services. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#D4AF37]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
