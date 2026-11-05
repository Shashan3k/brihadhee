/**
 * Modular JSON-LD builders. Each function returns one self-contained node with
 * its own @context, so any combination can be emitted in a single <script>.
 *
 * Entity graph:
 *   Restaurant  (#restaurant)  <- provider of ->  Service (/catering/#service)
 *   FAQPage     (page-level, `about` -> Restaurant)
 *
 * Nothing here reads config/client-verification.json directly; callers pass
 * already-gated data (see src/data/catering.js).
 */
import { site, hasHours, socialLinks } from "../data/site.js";

const CONTEXT = "https://schema.org";

export const ids = {
  restaurant: `${site.url}/#restaurant`,
  homeFaq: `${site.url}/#faq`,
  cateringPage: `${site.url}/catering/`,
  cateringService: `${site.url}/catering/#service`,
  cateringFaq: `${site.url}/catering/#faq`,
};

const e164 = (n) => `+${String(n).replace(/\D/g, "")}`;

/** Base Restaurant entity. Identical on every page that emits it. */
export function restaurantSchema() {
  const hours = hasHours
    ? site.hours.days
        .filter((d) => d.open && d.close)
        .map((d) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: d.day,
          opens: d.open,
          closes: d.close,
        }))
    : [];

  return {
    "@context": CONTEXT,
    "@type": "Restaurant",
    "@id": ids.restaurant,
    name: site.name,
    alternateName: site.nameTamil,
    description: site.shortDescription,
    url: `${site.url}/`,
    image: [site.media.hero.src, site.media.about.src, site.media.signature.src].map(
      (src) => new URL(src, site.url).href
    ),
    servesCuisine: "Vegetarian South Indian",
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(site.contact.phone ? { telephone: e164(site.contact.phone) } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(socialLinks.length ? { sameAs: socialLinks.map((s) => s.href) } : {}),
    hasMenu: `${site.url}/#menu`,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Dine-in", value: true },
      { "@type": "LocationFeatureSpecification", name: "Family friendly", value: true },
      { "@type": "LocationFeatureSpecification", name: "Vegetarian", value: true },
    ],
    // No AggregateRating: self-served ratings are not eligible for rich results.
  };
}

/**
 * Catering Service. Pass only confirmed values:
 *   areas: string[] from confirmed service_area
 *   phone: confirmed catering phone (or null to omit)
 * Never carries AggregateRating: there are no verified catering-specific reviews.
 */
export function cateringServiceSchema({ areas = [], phone = null } = {}) {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": ids.cateringService,
    serviceType: "Catering",
    name: "Vegetarian South Indian catering",
    url: ids.cateringPage,
    provider: { "@id": ids.restaurant },
    ...(areas.length
      ? { areaServed: areas.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(phone ? { telephone: e164(phone) } : {}),
  };
}

/** FAQPage for a page. `items` = [{ question, answer }]; returns null if empty. */
export function faqPageSchema(id, items) {
  if (!items?.length) return null;
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    "@id": id,
    about: { "@id": ids.restaurant },
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

/** Home page graph. */
export function homeSchema() {
  return [restaurantSchema(), faqPageSchema(ids.homeFaq, site.faqs)].filter(Boolean);
}

/** /catering graph: Restaurant (so the provider @id resolves in-page) + Service + FAQ. */
export function cateringPageSchema({ areas, phone, faqs }) {
  return [
    restaurantSchema(),
    cateringServiceSchema({ areas, phone }),
    faqPageSchema(ids.cateringFaq, faqs),
  ].filter(Boolean);
}
