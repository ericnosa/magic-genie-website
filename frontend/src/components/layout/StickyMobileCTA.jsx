import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
  const location = useLocation();
  if (location.pathname.startsWith("/booking")) return null;
  return (
    <div
      data-testid="sticky-mobile-cta"
      className="lg:hidden fixed bottom-4 inset-x-4 z-40 backdrop-blur-xl bg-[#0A1128]/95 rounded-full shadow-[0_12px_36px_rgba(10,17,40,0.35)] border border-[#D4AF37]/20"
    >
      <Link
        to="/booking"
        className="flex items-center justify-between px-6 py-4 text-[#FDFBF7]"
      >
        <span className="text-sm tracking-wide">Book your cleaning</span>
        <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm">
          Start <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
}
