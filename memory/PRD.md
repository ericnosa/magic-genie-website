# Magic Genie Services · PRD

## Problem statement (verbatim key requirements)
Rebuild Magic Genie Services into the benchmark premium cleaning company website in the Canadian market. Service area: **Regina, Saskatchewan only.** Flat pricing only, never hourly. Luxury hospitality feel. Booking should feel like a five-star hotel booking. Instant confirmation, admin/staff/portal workflows deferred to later phases.

## User personas
- **Regina homeowner** browsing on mobile, wants to book a Standard/Deluxe/Fresh Start cleaning at a visible flat price in under two minutes.
- **Regina Airbnb host** needing reliable per-turnover cleaning with same-day option.
- **Regina business/office manager** requesting a commercial quote.

## Tech stack
- Frontend: React 19 (CRA) + Tailwind + shadcn/ui + react-helmet-async + framer-motion + sonner
- Backend: FastAPI + Motor (MongoDB) + httpx (Emergent Resend proxy)
- SEO: react-helmet-async + JSON-LD LocalBusiness + sitemap.xml + robots.txt
- No user auth (public site only in Phase 1).

## Core requirements (static)
- Single-source pricing config (`/app/backend/pricing.py` mirrors `/app/frontend/src/config/pricing.js`).
- Single-source business/service-area config (`/app/frontend/src/config/business.js`).
- All prices in CAD, flat, published on Pricing page.
- Regina, Saskatchewan is the only city referenced anywhere.
- Copy: no em dashes as sentence connectors, no rule-of-three cadence, no inflated promotional language.
- Every interactive element has a `data-testid`.

## What's been implemented (2026-08-01)
- Design system (Cormorant Garamond serif + Manrope sans, warm ivory / deep navy / champagne gold palette).
- Layout: Navbar (sticky glassmorphism, mobile menu), Footer, StickyMobileCTA.
- Pages: Home, Residential, Deep Cleaning, Airbnb, Commercial (quote form), Pricing (full table + add-ons + discounts + policies), Booking (5-step flow with live summary sidebar + autosave), Booking Confirmation, About, FAQ (shadcn accordion), Checklist, Contact (form), Privacy, Terms, 404.
- Backend endpoints:
  - `GET /api/` — health
  - `GET /api/pricing` — pricing snapshot
  - `POST /api/quote` — server-side quote calc
  - `POST /api/bookings` — create booking (MG-XXXXXX ref, server recalculates total, persists to Mongo)
  - `GET /api/bookings/{id}` — fetch booking
  - `POST /api/contact` — general + commercial quote requests
- Email templates (customer confirmation + admin notification) via Emergent Resend proxy.
- SEO: helmet meta tags, LocalBusiness JSON-LD on home, sitemap.xml, robots.txt.
- Full backend + frontend automated testing passed (booking flow E2E validated).

## Known limitation
- **Email delivery**: the Emergent Resend proxy returns 422 "undeliverable_recipient" for every recipient with the current placeholder `EMERGENT_EMAIL_KEY`. Code is correct per playbook; the platform proxy needs the app to be claimed/provisioned before it stops pre-blocking recipients. Booking creation is unaffected — the confirmation page carries the reference, address, time, and total.

## Deferred (P1) — build after Phase 2 sign-off
- Google Calendar event creation on booking confirm.
- Booking reminders (T-24h) via cron.
- Customer portal (past/upcoming bookings, receipts, saved addresses, recurring management).
- Admin dashboard (bookings, customers, pricing config, calendar, discounts).
- Admin manual approve/decline/request-changes workflow.
- Staff portal (today's jobs, checklist, photos, arrival/completion).
- Testimonials / Google Reviews integration.

## Recently completed (2026-08-01, session 2)
- **Pre-render pipeline for SEO-critical routes** — `/app/frontend/scripts/prerender.js` boots a minimal static server on the built folder, uses Puppeteer to snapshot Home, Residential, Deep Cleaning, Airbnb, Commercial, and Pricing to per-route `index.html` files with real content + helmet meta. Wired into `yarn build` so it runs automatically on every production build. Root route is snapshotted last so the SPA fallback for other routes always uses the empty shell.
- **Cleaner-in-action photography** — swapped the About page portrait and Home page team photo for two active-cleaning shots (mopping, gloved surface detailing) from Unsplash.

## Deferred (P2)
- Payments (Stripe with Crypto option).
- Multi-city expansion (config change only per SSOT architecture).
- Google review request email post-visit.
- Analytics dashboard.
