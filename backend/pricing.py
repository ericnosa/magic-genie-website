"""Pricing configuration — mirrors /app/frontend/src/config/pricing.js.

This is the ONLY place pricing lives on the backend. Keep values in lockstep
with the frontend pricing.js. Any change must be made in both files.
"""

RESIDENTIAL = {
    "studio":     {"standard": 119, "deluxe": 169, "fresh_start": 229},
    "one_bed":    {"standard": 149, "deluxe": 209, "fresh_start": 279},
    "two_bed":    {"standard": 189, "deluxe": 249, "fresh_start": 329},
    "three_bed":  {"standard": 239, "deluxe": 309, "fresh_start": 399},
    "four_plus":  {"standard": 299, "deluxe": 379, "fresh_start": 479},
}

ADD_ONS = {
    "eco_products":       {"name": "Eco Friendly Product Upgrade",  "price": 20},
    "inside_fridge":      {"name": "Inside Refrigerator Cleaning",  "price": 25},
    "inside_oven":        {"name": "Inside Oven Cleaning",          "price": 25},
    "interior_windows":   {"name": "Interior Window Cleaning",      "price": 40},
    "inside_cabinets":    {"name": "Inside Cabinet Cleaning",       "price": 20},
    "laundry":            {"name": "Laundry (One Load)",            "price": 15},
    "pet_hair":           {"name": "Pet Hair Treatment",            "price": 15},
    "minor_appliances":   {"name": "Minor Appliance Cleaning",      "price": 15},
    "hood_extractor":     {"name": "Hood and Extractor Cleaning",   "price": 15},
}

# Add-ons already included in Deluxe / Fresh Start
INCLUDED_ADDONS = {
    "deluxe":      {"inside_fridge", "inside_oven", "interior_windows"},
    "fresh_start": {"inside_fridge", "inside_oven", "interior_windows",
                    "inside_cabinets"},  # cabinet exterior handled inside package scope
}

RECURRING_DISCOUNTS = {
    "one_time":   0.00,
    "monthly":    0.05,
    "biweekly":   0.10,
    "weekly":     0.15,
}

DEEP_CLEAN_STARTING = 279
AIRBNB_RANGES = {
    "studio_1br": {"min": 79,  "max": 99},
    "two_plus":   {"min": 109, "max": 139},
}
AIRBNB_SAME_DAY = 25
# A one-time job has to carry its own acquisition cost; a recurring job does not.
MIN_ONE_TIME = 139
MIN_RECURRING = 119
# Kept so existing imports and the /api/pricing response keep working.
MIN_BOOKING = MIN_ONE_TIME

# Saskatchewan sales taxes (applied on subtotal, per booking spec).
GST_RATE = 0.05
PST_RATE = 0.06

HOME_SIZE_LABELS = {
    "studio": "Studio",
    "one_bed": "One Bedroom",
    "two_bed": "Two Bedroom",
    "three_bed": "Three Bedroom",
    "four_plus": "Four+ Bedrooms",
}

PACKAGE_LABELS = {
    "standard": "Standard Clean",
    "deluxe": "Deluxe Clean",
    "fresh_start": "Fresh Start Clean",
}


def compute_quote(home_size: str, package: str, add_ons: list[str],
                  recurring: str = "one_time", min_pre_tax=None) -> dict:
    """Server-side quote calculation. Returns line items + totals."""
    base = RESIDENTIAL[home_size][package]
    included = INCLUDED_ADDONS.get(package, set())

    add_on_lines = []
    add_on_total = 0
    for key in add_ons:
        if key in included or key not in ADD_ONS:
            continue
        add_on_lines.append({
            "key": key,
            "name": ADD_ONS[key]["name"],
            "price": ADD_ONS[key]["price"],
        })
        add_on_total += ADD_ONS[key]["price"]

    subtotal = base + add_on_total
    discount_rate = RECURRING_DISCOUNTS.get(recurring, 0)
    discount_amount = round(subtotal * discount_rate, 2)
    discounted_subtotal = round(subtotal - discount_amount, 2)
    # Saskatchewan taxes are charged on the DISCOUNTED subtotal - the amount the customer
    # actually pays for the service. Charging them on the pre-discount subtotal overcharged
    # every discounted booking and made GST remitted differ from GST collected.
    # Round each tax to the cent before summing so the booking page and the confirmation
    # email always agree.
    if min_pre_tax is None:
        min_pre_tax = MIN_ONE_TIME if recurring == "one_time" else MIN_RECURRING
    floor = min_pre_tax
    taxable_base = round(max(discounted_subtotal, floor), 2)
    minimum_applied = taxable_base != discounted_subtotal
    gst = round(taxable_base * GST_RATE, 2)
    pst = round(taxable_base * PST_RATE, 2)
    total = round(taxable_base + gst + pst, 2)

    return {
        "home_size": home_size,
        "home_size_label": HOME_SIZE_LABELS[home_size],
        "package": package,
        "package_label": PACKAGE_LABELS[package],
        "base_price": base,
        "add_ons": add_on_lines,
        "add_on_total": add_on_total,
        "subtotal": subtotal,
        "discounted_subtotal": discounted_subtotal,
        "taxable_base": taxable_base,
        "minimum_applied": minimum_applied,
        "recurring": recurring,
        "discount_rate": discount_rate,
        "discount_amount": discount_amount,
        "gst": gst,
        "pst": pst,
        "total": total,
    }
