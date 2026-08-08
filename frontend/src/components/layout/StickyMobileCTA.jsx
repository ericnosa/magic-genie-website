import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Small left-anchored pill CTA on mobile.
 *
 * Kept narrow (auto-width, left-4 anchored) so the bottom-right corner stays
 * free for the ElevenLabs Convai widget button, which mounts fixed at
 * bottom-right and was previously occluded by a full-width sticky bar.
 */
export function StickyMobileCTA() {
  const location = useLocation();
  if (location.pathname.startsWith("/booking")) return null;
  return (
    <div
      data-testid="sticky-mobile-cta"
      className="lg:hidden fixed bottom-4 left-4 z-40 backdrop-blur-xl bg-[#0A1128]/95 rounded-full shadow-[0_12px_36px_rgba(10,17,40,0.35)] border border-[#D4AF37]/20"
    >
      <Link
        to="/booking"
        className="flex items-center gap-2 pl-5 pr-5 py-3 text-[#FDFBF7] text-sm tracking-wide"
      >
        <span>Book</span>
        <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
      </Link>
    </div>
  );
}
