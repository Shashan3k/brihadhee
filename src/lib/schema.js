/**
 * Modular JSON-LD builders. Each function returns one self-contained node with
 * its own @context, so any combination can be emitted in a single <script>.
 *
 * Graph (stable @ids):
 *   Restaurant (#restaurant)       <- publisher of -> WebSite (#website)
 *   WebPage (<page>#webpage)       isPartOf WebSite, about Restaurant, breadcrumb -> BreadcrumbList
 *   FAQPage (<page>#faq)           about Restaurant, built from the SAME data as the visible FAQ
 *   Service (/catering/#service)   provider -> Restaurant (only when catering is confirmed)
 *
 * Deliberately absent: AggregateRating (self-served ratings earn no rich result),
 * Menu / MenuItem (menu prices are not confirmed final), openingHoursSpecification
 * and priceRange (pending facts: they appear only once confirmed).
 *
 * Facts come from src/data/entity-truth.ts through src/data/site.js; nothing is typed
 * here by hand.
 */
import { site, hasHours, assetUrl } from "../data/site.js";
import { getFact, factOr, FACTS, CONTENT_UPDATED } from "../data/entity-truth.ts";

const FACTS_DATE = (key) => FACTS[key].verifiedOn;
import { faqItems } from "../data/faq.js";

const CONTEXT = "https://schema.org";

export const ids = {
  restaurant: `${site.url}/#restaurant`,
  website: `${site.url}/#website`,
  cateringService: `${site.url}/catering-services-chennai/#service`,
};
export const pageUrl = (path) => `${site.url}${path}`;
export const pageIds = (path) => ({
  webpage: `${pageUrl(path)}#webpage`,
  breadcrumb: `${pageUrl(path)}#breadcrumb`,
  faq: `${pageUrl(path)}#faq`,
});

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
  const alternateNames = [getFact("nameTamil"), ...getFact("alternateNames")];
  const founders = factOr("founders");
  const offers = factOr("offers", []);
  const reservations = factOr("acceptsReservations");
  const subBrand = factOr("subBrand");
  const sameAs = factOr("sameAs", []);

  return {
    "@context": CONTEXT,
    "@type": "Restaurant",
    "@id": ids.restaurant,
    name: getFact("name"),
    alternateName: alternateNames,
    description: site.shortDescription,
    url: `${site.url}/`,
    image: [site.media.hero.src, site.media.about.src, site.media.signature.src].map(
      (src) => assetUrl(src)
    ),
    servesCuisine: getFact("cuisines"),
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    hasMap: getFact("mapUrl"),
    telephone: e164(getFact("phone")),
    email: getFact("email"),
    ...(sameAs.length ? { sameAs } : {}),
    hasMenu: pageUrl("/menu/"),
    ...(reservations?.value ? { acceptsReservations: true } : {}),
    ...(founders
      ? { founder: founders.names.map((name) => ({ "@type": "Person", name })) }
      : {}),
    ...(subBrand
      ? { brand: { "@type": "Brand", name: subBrand.name, description: subBrand.description } }
      : {}),
    ...(offers.length
      ? {
          makesOffer: offers.map((o) => ({
            "@type": "Offer",
            name: o.name,
            description: o.description,
            ...(o.price ? { price: String(o.price), priceCurrency: "INR" } : {}),
            validFrom: FACTS_DATE("offers"),
          })),
        }
      : {}),
    amenityFeature: [
      ...(getFact("dineIn")
        ? [{ "@type": "LocationFeatureSpecification", name: "Dine-in", value: true }]
        : []),
      ...(getFact("familyFriendly")
        ? [{ "@type": "LocationFeatureSpecification", name: "Family friendly", value: true }]
        : []),
      { "@type": "LocationFeatureSpecification", name: "Vegetarian", value: true },
    ],
  };
}

export function webSiteSchema() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": ids.website,
    url: `${site.url}/`,
    name: getFact("name"),
    inLanguage: site.locale.replace("_", "-"),
    publisher: { "@id": ids.restaurant },
  };
}

/**
 * WebPage + BreadcrumbList for one page.
 *   crumbs: [{ name, path }] from the home page down to this page.
 */
export function webPageSchemas({ path, title, description, crumbs }) {
  const pid = pageIds(path);
  const webpage = {
    "@context": CONTEXT,
    "@type": "WebPage",
    "@id": pid.webpage,
    url: pageUrl(path),
    name: title,
    description,
    inLanguage: site.locale.replace("_", "-"),
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.restaurant },
    breadcrumb: { "@id": pid.breadcrumb },
    dateModified: CONTENT_UPDATED,
  };
  const breadcrumb = {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    "@id": pid.breadcrumb,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: pageUrl(c.path),
    })),
  };
  return [webpage, breadcrumb];
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
    name: "Brihadhee Pure Veg Event and Wedding Catering",
    description:
      "Pure vegetarian catering for corporate offices, family functions, weddings and event management companies, with regional menus, live food counters and end-to-end event service.",
    url: pageUrl("/catering-services-chennai/"),
    provider: { "@id": ids.restaurant },
    audience: [
      { "@type": "Audience", audienceType: "Families planning functions" },
      { "@type": "BusinessAudience", audienceType: "Event management companies" },
    ],
    ...(areas.length
      ? { areaServed: areas.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(phone ? { telephone: e164(phone) } : {}),
  };
}

/** FAQPage for a page. `items` = [{ question, answer, lang? }]; returns null if empty. */
export function faqPageSchema(path, items) {
  if (!items?.length) return null;
  const pid = pageIds(path);
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    "@id": pid.faq,
    about: { "@id": ids.restaurant },
    mainEntityOfPage: { "@id": pid.webpage },
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      ...(i.lang && i.lang !== "en" ? { inLanguage: i.lang } : {}),
      acceptedAnswer: {
        "@type": "Answer",
        text: i.answer,
        ...(i.lang && i.lang !== "en" ? { inLanguage: i.lang } : {}),
      },
    })),
  };
}

/** Graph for a page: Restaurant + WebSite + WebPage + BreadcrumbList (+ extras). */
export function pageGraph({ path, title, description, crumbs, extras = [] }) {
  return [
    restaurantSchema(),
    webSiteSchema(),
    ...webPageSchemas({ path, title, description, crumbs }),
    ...extras,
  ].filter(Boolean);
}

export const HOME_CRUMBS = [{ name: "Home", path: "/" }];

/** Home page graph: the FAQPage is built from the same data as the visible FAQ. */
export function homeSchema({ title, description }) {
  return pageGraph({
    path: "/",
    title,
    description,
    crumbs: HOME_CRUMBS,
    extras: [faqPageSchema("/", faqItems)],
  });
}

/**
 * Menu / MenuSection / MenuItem for /menu, generated from menu-canonical.ts.
 * Prices come straight from the data (confirmed current on 2026-11-05).
 * Signature extras without a listed price are MenuItems without an offer.
 */
export function menuSchema({ categories, extras = [], byo = null }) {
  return {
    "@context": CONTEXT,
    "@type": "Menu",
    "@id": `${pageUrl("/menu/")}#menu`,
    name: `${getFact("name")} menu`,
    inLanguage: site.locale.replace("_", "-"),
    hasMenuSection: [
      ...categories.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        ...(c.blurb ? { description: c.blurb } : {}),
        hasMenuItem: c.items.map((i) => ({
          "@type": "MenuItem",
          name: i.name,
          ...(i.description ? { description: i.description } : {}),
          suitableForDiet: "https://schema.org/VegetarianDiet",
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "INR" },
        })),
      })),
      ...(byo
        ? [
            {
              "@type": "MenuSection",
              name: "Build Your Own Dosa",
              description: "Pick one batter, then add toppings, a stuffing and a garnish.",
              hasMenuSection: [
                ...byo.steps.map((s) => ({
                  "@type": "MenuSection",
                  name: `${s.step}. ${s.name}`,
                  hasMenuItem: s.options.map((o) => ({
                    "@type": "MenuItem",
                    name: o.name,
                    ...(o.note ? { description: o.note } : {}),
                    suitableForDiet: "https://schema.org/VegetarianDiet",
                    offers: { "@type": "Offer", price: String(o.price), priceCurrency: "INR" },
                  })),
                })),
                {
                  "@type": "MenuSection",
                  name: "Chef's suggestions",
                  hasMenuItem: byo.suggestions.map((d) => ({
                    "@type": "MenuItem",
                    name: d.name,
                    description: d.build.join(", "),
                    suitableForDiet: "https://schema.org/VegetarianDiet",
                    offers: { "@type": "Offer", price: String(d.price), priceCurrency: "INR" },
                  })),
                },
              ],
            },
          ]
        : []),
      ...(extras.length
        ? [
            {
              "@type": "MenuSection",
              name: "Signature specials",
              hasMenuItem: extras.map((e) => ({
                "@type": "MenuItem",
                name: e.name,
                description: e.note,
                suitableForDiet: "https://schema.org/VegetarianDiet",
              })),
            },
          ]
        : []),
    ],
  };
}
