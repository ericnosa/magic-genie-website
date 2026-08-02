import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { LogoMark } from "@/components/LogoMark";

const links = [
  { to: "/residential", label: "Residential" },
  { to: "/deep-cleaning", label: "Deep Clean" },
  { to: "/airbnb", label: "Airbnb" },
  { to: "/commercial", label: "Commercial" },
  { to: "/pricing", label: "Pricing" },
  { to: "/checklist", label: "Checklist" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#FDFBF7]/85 border-b border-[#0A1128]/5"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 group">
          <LogoMark size={40} testId="brand-logo-mark" />
          <span className="font-serif text-[24px] tracking-tight text-[#0A1128] leading-none hidden sm:inline">
            Magic Genie
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.to.replace(/\//g, "")}`}
              className={({ isActive }) =>
                `text-[13px] tracking-wide text-[#0A1128] hover:text-[#D4AF37] duration-200 ${
                  isActive ? "text-[#D4AF37]" : ""
                }`
              }
              style={{ transitionProperty: "color" }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={BUSINESS.phoneHref}
            data-testid="nav-phone"
            className="hidden md:flex items-center gap-2 text-[13px] text-[#0A1128] hover:text-[#D4AF37]"
            style={{ transitionProperty: "color" }}
          >
            <Phone className="w-4 h-4" />
            {BUSINESS.phone}
          </a>
          <Link
            to="/booking"
            data-testid="nav-book-now"
            className="hidden md:inline-flex items-center rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-[13px] tracking-wide hover:bg-[#D4AF37] hover:text-[#0A1128] duration-300"
            style={{ transitionProperty: "background-color, color" }}
          >
            Book Now
          </Link>
          <button
            aria-label="Open menu"
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 text-[#0A1128]"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden border-t border-[#0A1128]/5 bg-[#FDFBF7]"
          data-testid="mobile-nav-panel"
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-${l.to.replace(/\//g, "")}`}
                className="py-2 text-[15px] text-[#0A1128]"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <a href={BUSINESS.phoneHref} className="text-[15px] text-[#0A1128]">
                {BUSINESS.phone}
              </a>
              <Link
                to="/booking"
                className="rounded-full bg-[#0A1128] text-[#FDFBF7] px-6 py-3 text-center text-[13px] tracking-wide"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
