import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center" data-testid="not-found-page">
      <SEO title="Page not found" path="/404" />
      <div className="eyebrow">404</div>
      <h1 className="font-serif text-6xl mt-4 tracking-tight">We couldn't find that page.</h1>
      <p className="mt-4 text-[15px] text-[#0A1128]/70">The link may be old or mistyped. Head back home or start a booking.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/" className="rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px]">Home</Link>
        <Link to="/booking" className="rounded-full border border-[#0A1128]/12 px-6 py-3 text-[13px]">Book a cleaning</Link>
      </div>
    </div>
  );
}
