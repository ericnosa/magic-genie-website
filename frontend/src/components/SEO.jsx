import { Helmet } from "react-helmet-async";
import { BUSINESS } from "@/config/business";

export function SEO({ title, description, path = "/", jsonLd, image }) {
  const url = `${BUSINESS.siteUrl}${path}`;
  const fullTitle = title
    ? `${title} · ${BUSINESS.name}`
    : `${BUSINESS.name} · ${BUSINESS.brandLine}`;
  const desc =
    description ||
    "Premium residential, Airbnb, deep, and commercial cleaning in Regina, Saskatchewan. Flat pricing, instant online booking, professional teams.";
  const ogImage =
    image ||
    "https://images.unsplash.com/photo-1682888813913-e13f18692019?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HouseholdCleaningService",
    name: BUSINESS.name,
    url: BUSINESS.siteUrl,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    areaServed: {
      "@type": "City",
      name: `${BUSINESS.serviceArea.city}, ${BUSINESS.serviceArea.region}`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.serviceArea.city,
      addressRegion: BUSINESS.serviceArea.regionCode,
      addressCountry: "CA",
    },
    priceRange: "$$",
  };
}
