// SINGLE SOURCE OF TRUTH — Magic Genie Services pricing.
// Backend /app/backend/pricing.py mirrors these exact values. Update both together.

export const HOME_SIZES = [
  { key: "studio",     label: "Studio" },
  { key: "one_bed",    label: "One Bedroom" },
  { key: "two_bed",    label: "Two Bedroom" },
  { key: "three_bed",  label: "Three Bedroom" },
  { key: "four_plus",  label: "Four+ Bedrooms" },
];

export const PACKAGES = [
  {
    key: "standard",
    label: "Standard Clean",
    tagline: "For regularly maintained homes.",
    description:
      "A thorough clean throughout every room your team lives in. Kitchens, bathrooms, bedrooms, and shared spaces returned to a fresh baseline.",
    includes: [
      "Full kitchen surfaces, sinks, and countertops",
      "Bathrooms scrubbed, mirrors polished, fixtures shined",
      "Bedrooms dusted, tidied, and made ready",
      "Floors vacuumed and mopped throughout",
      "High-touch surfaces sanitized",
      "Trash removed, linens straightened",
    ],
    highlight: false,
  },
  {
    key: "deluxe",
    label: "Deluxe Clean",
    tagline: "Best Value.",
    description:
      "Everything in Standard, plus the deeper touches most homes only get a few times a year. The right choice for a home that hosts.",
    includes: [
      "Everything in Standard Clean",
      "Inside refrigerator cleaning",
      "Inside oven cleaning",
      "Interior window cleaning",
    ],
    highlight: true,
  },
  {
    key: "fresh_start",
    label: "Fresh Start Clean",
    tagline: "Most Comprehensive.",
    description:
      "Built for moving in, moving out, listing prep, and turnover moments. Every corner receives detailed attention.",
    includes: [
      "Everything in Standard Clean",
      "Inside refrigerator cleaning",
      "Inside oven cleaning",
      "Inside dishwasher cleaning",
      "Interior spot cleaning",
      "Baseboard cleaning",
      "Cabinet exterior cleaning",
    ],
    highlight: false,
  },
];

export const RESIDENTIAL_PRICES = {
  studio:    { standard: 119, deluxe: 169, fresh_start: 229 },
  one_bed:   { standard: 149, deluxe: 209, fresh_start: 279 },
  two_bed:   { standard: 189, deluxe: 249, fresh_start: 329 },
  three_bed: { standard: 239, deluxe: 309, fresh_start: 399 },
  four_plus: { standard: 299, deluxe: 379, fresh_start: 479 },
};

export const ADD_ONS = [
  { key: "eco_products",     name: "Eco Friendly Product Upgrade", price: 20, note: "Plant based products with low chemical emissions throughout." },
  { key: "inside_fridge",    name: "Inside Refrigerator Cleaning", price: 25, note: "Included in Deluxe and Fresh Start." },
  { key: "inside_oven",      name: "Inside Oven Cleaning",         price: 25, note: "Included in Deluxe and Fresh Start." },
  { key: "interior_windows", name: "Interior Window Cleaning",     price: 40, note: "Included in Deluxe.", range: "$30–$50" },
  { key: "inside_cabinets",  name: "Inside Cabinet Cleaning",      price: 20, note: "Included in Fresh Start." },
  { key: "laundry",          name: "Laundry (One Load)",           price: 15, note: "Wash, dry, and fold one load." },
  { key: "pet_hair",         name: "Pet Hair Treatment",           price: 15, note: "Extra passes on upholstery and floors." },
  { key: "minor_appliances", name: "Minor Appliance Cleaning",     price: 15, note: "Microwave, toaster, coffee maker." },
  { key: "hood_extractor",   name: "Hood and Extractor Cleaning",  price: 15, note: "Range hood surfaces and filter face." },
];

// Add-ons already covered by a package (visually disabled during selection).
export const INCLUDED_ADDONS = {
  standard: new Set(),
  deluxe: new Set(["inside_fridge", "inside_oven", "interior_windows"]),
  fresh_start: new Set(["inside_fridge", "inside_oven", "interior_windows", "inside_cabinets"]),
};

export const RECURRING_OPTIONS = [
  { key: "one_time", label: "One-time", discount: 0 },
  { key: "monthly",  label: "Monthly",  discount: 0.05 },
  { key: "biweekly", label: "Biweekly", discount: 0.10 },
  { key: "weekly",   label: "Weekly",   discount: 0.15 },
];

export const SPECIALTY = {
  // The bookable deep clean is the Fresh Start package; its cheapest size (studio) is
  // $229, so $279 advertised a price the booking flow could not sell.
  deep_clean_starting: 229,
  airbnb: {
    // $79 for a turnover left roughly $10 of contribution on a two-hour job.
    studio_1br: { min: 119, max: 139 },
    two_plus:   { min: 149, max: 189 },
    same_day: 25,
  },
};

// A one-time job has to carry its own acquisition cost; a recurring job does not.
export const MIN_ONE_TIME = 139;
export const MIN_RECURRING = 119;
// Kept so existing imports keep working.
export const MIN_BOOKING = MIN_ONE_TIME;

export const POLICIES = {
  reschedule_window_hours: [24, 48],
  late_reschedule_charge: 0.5,
  no_show_charge: 1.0,
};

// ------- calculation -------
export const TAX = { gst: 0.05, pst: 0.06 };

export function computeQuote({ home_size, pkg, add_ons = [], recurring = "one_time", minFloor = null }) {
  const base = RESIDENTIAL_PRICES[home_size]?.[pkg] ?? 0;
  const included = INCLUDED_ADDONS[pkg] ?? new Set();
  const addOnLines = add_ons
    .filter((k) => !included.has(k))
    .map((k) => ADD_ONS.find((a) => a.key === k))
    .filter(Boolean);
  const addOnTotal = addOnLines.reduce((s, a) => s + a.price, 0);
  const subtotal = base + addOnTotal;
  const discount = RECURRING_OPTIONS.find((r) => r.key === recurring)?.discount ?? 0;
  const discountAmount = +(subtotal * discount).toFixed(2);
  const discountedSubtotal = +(subtotal - discountAmount).toFixed(2);
  // Saskatchewan taxes are charged on the DISCOUNTED subtotal - the amount the customer
  // actually pays. Charging them on the pre-discount subtotal overcharged every discounted
  // booking. Round each tax to the cent BEFORE summing so the displayed total is exact.
  const minPreTax = minFloor ?? (recurring === "one_time" ? MIN_ONE_TIME : MIN_RECURRING);
  const taxableBase = +Math.max(discountedSubtotal, minPreTax).toFixed(2);
  const minimumApplied = taxableBase !== discountedSubtotal;
  const gst = +(taxableBase * TAX.gst).toFixed(2);
  const pst = +(taxableBase * TAX.pst).toFixed(2);
  const total = +(taxableBase + gst + pst).toFixed(2);
  return { base, addOnLines, addOnTotal, subtotal, discountedSubtotal, taxableBase, minimumApplied,
           discount, discountAmount, gst, pst, total };
}
