/**
 * Modular JSON-LD builders. Each function returns one self-contained node with
 * its own @context, so any combination can be emitted in a single <script>.
 *
 * Graph (stable @ids):
 *   Restaurant (#restaurant)       <- publisher of -> WebSite (#website)
 *   WebPage (<page>#webpage)       isPartOf WebSite, about Restaurant, breadcrumb -> BreadcrumbList
 *   FAQPage (<page>#faq)           about Restaurant, dateModified, built from the SAME data as the visible FAQ
 *   Service (<page>#service)       provider -> Restaurant; "Event catering" (with an
 *                                  OfferCatalog, each Offer with eligibleQuantity >= 50
 *                                  guests) or "Corporate catering"; areaServed Chennai
 *   Restaurant.areaServed          the neighbourhoods diners come from (nearbyAreas)
 * Restaurant is already a schema.org FoodEstablishment subtype, so no second
 * FoodEstablishment node is emitted (it would read as a separate business).
 *   Article (/whats-new/#article)  author and publisher -> Restaurant, dated
 *
 * Deliberately absent: AggregateRating and review (self-served ratings earn no rich
 * result), makesOffer (offers change; they are shown on the pages with a checked
 * date), dateModified on the Restaurant (not a schema.org property of Restaurant;
 * freshness lives on WebPage, FAQPage and Article), and anything still pending in
 * entity-truth.ts. openingHoursSpecification comes from the verified hours: one
 * node, every day, 11:00 to 23:00.
 *
 * Facts come from src/data/entity-truth.ts through src/data/site.js; nothing is typed
 * here by hand.
 */
import { site, hasHours, assetUrl } from "../data/site.js";
import { getFact, factOr, CONTENT_UPDATED } from "../data/entity-truth.ts";

import { faqItems } from "../data/faq.js";
import { CATERING_DIET } from "../../config/seo-gates.ts";

const CATERING_DIET_CAP = CATERING_DIET.charAt(0).toUpperCase() + CATERING_DIET.slice(1);

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
  // One OpeningHoursSpecification per distinct time range (open daily 11:00 to 23:00 -> one node).
  const hours = [];
  if (hasHours) {
    for (const d of site.hours.days.filter((x) => x.open && x.close)) {
      const same = hours.find((h) => h.opens === d.open && h.closes === d.close);
      if (same) same.dayOfWeek.push(d.day);
      else hours.push({ "@type": "OpeningHoursSpecification", dayOfWeek: [d.day], opens: d.open, closes: d.close });
    }
  }
  const alternateNames = [getFact("nameTamil"), ...getFact("alternateNames")];
  const founders = factOr("founders");
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
    // Neighbourhoods diners come from (entity-truth.ts nearbyAreas). Catering areas live on the Service nodes.
    areaServed: getFact("nearbyAreas").map((name) => ({ "@type": "Place", name: `${name}, Chennai` })),
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
export function cateringServiceSchema({
  areas = [],
  phone = null,
  serviceType = "Event catering",
  offerCatalog = [],
  path = "/catering-services-chennai/",
  name = `Brihadhee ${CATERING_DIET_CAP} Event and Wedding Catering`,
  description = `End-to-end ${CATERING_DIET} event catering in Chennai for weddings, birthdays, housewarmings and family functions: menu planning, cooking, serving and setup, with live food counters.`,
  guests = null, // { min, max? }: guest count each catering offer is for (Offer.eligibleQuantity)
  audience = [
    { "@type": "Audience", audienceType: "Families planning functions" },
    { "@type": "BusinessAudience", audienceType: "Event management companies" },
  ],
} = {}) {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": `${pageUrl(path)}#service`,
    serviceType,
    name,
    description,
    url: pageUrl(path),
    provider: { "@id": ids.restaurant },
    audience,
    ...(areas.length
      ? { areaServed: areas.length === 1 ? { "@type": "City", name: areas[0] } : areas.map((name) => ({ "@type": "City", name })) }
      : {}),
    ...(offerCatalog.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offerCatalog.map((o) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: o.name, ...(o.description ? { description: o.description } : {}) },
              ...(guests
                ? {
                    eligibleQuantity: {
                      "@type": "QuantitativeValue",
                      minValue: guests.min,
                      ...(guests.max ? { maxValue: guests.max } : {}),
                      unitText: "guests",
                    },
                  }
                : {}),
            })),
          },
        }
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
    dateModified: CONTENT_UPDATED,
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

/**
 * Article for a dated page (/whats-new/, guides). Published by the Restaurant. A guide
 * passes `about` (topic names) and then only `mentions` the Restaurant; dateModified
 * follows CONTENT_UPDATED.
 */
export function articleSchema({ path, headline, description, datePublished, image, about = null }) {
  const pid = pageIds(path);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    "@id": `${pageUrl(path)}#article`,
    headline,
    description,
    datePublished,
    dateModified: CONTENT_UPDATED > datePublished ? CONTENT_UPDATED : datePublished,
    inLanguage: site.locale.replace("_", "-"),
    image: [assetUrl(image)],
    author: { "@id": ids.restaurant },
    publisher: { "@id": ids.restaurant },
    ...(about
      ? { about: about.map((name) => ({ "@type": "Thing", name })), mentions: { "@id": ids.restaurant } }
      : { about: { "@id": ids.restaurant } }),
    mainEntityOfPage: { "@id": pid.webpage },
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
