/**
 * Modular JSON-LD builders. Each function returns one self-contained node with
 * its own @context, so any combination can be emitted in a single <script>.
 *
 * Graph (stable @ids):
 *   Restaurant (#restaurant)       <- publisher of -> WebSite (#website)
 *   WebPage (<page>#webpage)       isPartOf WebSite; mainEntity points at the page's subject
 *                                  when modeled; breadcrumb links to a real trail on inner pages
 *   FAQPage (<page>#faq)           isPartOf its WebPage; built from the SAME data as the visible FAQ
 *   Service (#catering)           shared catering identity, provider -> Restaurant
 *   Service (<page>#service)      page-specific offer, related to #catering
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
import { site, ROUTES, hasHours, assetUrl, pageContentUpdated } from "../data/site.js";
import { getFact, factOr, RESTAURANT_ID, CATERING_ID, cateringContacts, toE164, BYO_DEFINITION } from "../data/entity-truth.ts";
import verification from "../../config/client-verification.json";
import { MENU_NOTES } from "../data/menu-canonical.ts";

import { faqItems } from "../data/faq.js";
import { CATERING_DIET } from "../../config/seo-gates.ts";

const CATERING_DIET_CAP = CATERING_DIET.charAt(0).toUpperCase() + CATERING_DIET.slice(1);

const CONTEXT = "https://schema.org";

const ids = {
  restaurant: RESTAURANT_ID,
  website: `${site.url}/#website`,
};
export const pageUrl = (path) => `${site.url}${path}`;
export const pageIds = (path) => ({
  webpage: `${pageUrl(path)}#webpage`,
  breadcrumb: `${pageUrl(path)}#breadcrumb`,
  faq: `${pageUrl(path)}#faq`,
});

/** Escape characters that HTML can interpret while reading a JSON-LD script. */
export function serializeJsonLd(graph) {
  return JSON.stringify(graph).replaceAll("<", "\\u003c");
}

/** Base Restaurant entity. Identical on every page that emits it. */
export function restaurantSchema() {
  // One OpeningHoursSpecification per distinct time range (open daily 11:00 to 23:00 -> one node).
  const hours = [];
  if (hasHours) {
    for (const d of site.hours.days.filter((x) => x.open && x.close)) {
      const same = hours.find((h) => h.opens === d.open && h.closes === d.close);
      const day = `${CONTEXT}/${d.day}`;
      if (same) same.dayOfWeek.push(day);
      else hours.push({ "@type": "OpeningHoursSpecification", dayOfWeek: [day], opens: d.open, closes: d.close });
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
    description: `${getFact("name")} is a ${getFact("typeLong")} on ${getFact("street")}, ${site.address.city}. It serves ${getFact("mealTimes")}.`,
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
    telephone: toE164(getFact("phone")),
    email: getFact("email"),
    ...(sameAs.length ? { sameAs } : {}),
    hasMenu: pageUrl(ROUTES.menu),
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
export function webPageSchemas({ path, title, description, crumbs, primaryEntityId, faqId, subjectId = ids.restaurant }) {
  const pid = pageIds(path);
  const hasTrail = crumbs.length > 1;
  const webpage = {
    "@context": CONTEXT,
    "@type": "WebPage",
    "@id": pid.webpage,
    url: pageUrl(path),
    name: title,
    description,
    inLanguage: site.locale.replace("_", "-"),
    isPartOf: { "@id": ids.website },
    about: { "@id": subjectId },
    ...(primaryEntityId ? { mainEntity: { "@id": primaryEntityId } } : {}),
    ...(faqId ? { hasPart: { "@id": faqId } } : {}),
    ...(hasTrail ? { breadcrumb: { "@id": pid.breadcrumb } } : {}),
    dateModified: pageContentUpdated(path),
  };
  if (!hasTrail) return [webpage];

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
 * Never carries AggregateRating: there are no verified catering-specific reviews.
 */
export function cateringServiceSchema({
  areas = [],
  serviceType = "Event catering",
  offerCatalog = [],
  path = "/catering-services-chennai/",
  name = `Brihadhee ${CATERING_DIET_CAP} Event and Wedding Catering`,
  description = `${CATERING_DIET_CAP} event and wedding catering in Chennai with regional menus and live counters. Agree the requested services in the quote.`,
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
    isRelatedTo: { "@id": CATERING_ID },
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
    ...cateringChannel(),
  };
}

function cateringChannel() {
  const { phone } = cateringContacts();
  if (!phone) return {};
  return {
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: {
        "@type": "ContactPoint",
        contactType: "catering enquiries",
        telephone: toE164(phone),
      },
    },
  };
}

function cateringEntitySchema() {
  const areas = verification.service_area ?? [];
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": CATERING_ID,
    name: `${getFact("name")} Catering`,
    serviceType: `${CATERING_DIET_CAP} catering`,
    description: `${getFact("name")} offers ${CATERING_DIET} catering for events and offices.`,
    url: pageUrl(ROUTES.eventCatering),
    provider: { "@id": ids.restaurant },
    ...(areas.length
      ? { areaServed: areas.map((name) => ({ "@type": "City", name })) }
      : {}),
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
    dateModified: pageContentUpdated(path),
    about: { "@id": ids.restaurant },
    isPartOf: { "@id": pid.webpage },
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
 * follows the route's content revision.
 */
export function articleSchema({ path, headline, description, datePublished, image, about = null }) {
  const pid = pageIds(path);
  const dateModified = pageContentUpdated(path);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    "@id": `${pageUrl(path)}#article`,
    headline,
    description,
    datePublished,
    dateModified: dateModified > datePublished ? dateModified : datePublished,
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
  const primaryContent = extras.find((node) => ["Menu", "Service", "Article"].includes(node?.["@type"]));
  const isCateringPage = verification.offer_catering === true && (primaryContent?.["@type"] === "Service" || path === ROUTES.cateringQuote);
  const includeCatering = isCateringPage || (path === ROUTES.home && verification.offer_catering === true);
  const subjectId = isCateringPage ? (primaryContent?.["@id"] ?? CATERING_ID) : ids.restaurant;
  const isRestaurantPage = [ROUTES.home, ROUTES.about, ROUTES.book].includes(path);
  const primaryEntityId = primaryContent?.["@id"] ?? (isRestaurantPage || isCateringPage ? subjectId : null);
  const faq = extras.find((node) => node?.["@type"] === "FAQPage");
  return [
    restaurantSchema(),
    webSiteSchema(),
    ...webPageSchemas({ path, title, description, crumbs, primaryEntityId, faqId: faq?.["@id"], subjectId }),
    ...extras.map((node) => node === faq ? { ...faq, about: { "@id": subjectId } } : node),
    ...(includeCatering ? [cateringEntitySchema()] : []),
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
 * Menu / MenuSection / MenuItem for /menu/, generated from the same data as the page.
 * Build-your-own options show the batter price or the price of one add-on.
 * Signature extras without a listed price are MenuItems without an offer.
 */
export function menuSchema({ categories, extras = [], byo = null }) {
  const path = ROUTES.menu;
  return {
    "@context": CONTEXT,
    "@type": "Menu",
    "@id": `${pageUrl(path)}#menu`,
    url: pageUrl(path),
    name: `${getFact("name")} menu`,
    description: `${MENU_NOTES.gst} ${MENU_NOTES.parcel}`,
    inLanguage: site.locale.replace("_", "-"),
    mainEntityOfPage: { "@id": pageIds(path).webpage },
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
              description: BYO_DEFINITION,
              hasMenuSection: [
                ...byo.steps.map((step) => ({
                  "@type": "MenuSection",
                  name: `Step ${step.step}: ${step.label}`,
                  hasMenuItem: step.options.map((option) => ({
                    "@type": "MenuItem",
                    name: option.name,
                    ...(option.note ? { description: option.note } : {}),
                    suitableForDiet: "https://schema.org/VegetarianDiet",
                    offers: {
                      "@type": "Offer",
                      price: String(option.price),
                      priceCurrency: "INR",
                      ...(step.step > 1 ? { description: "Add-on price for Build Your Own Dosa." } : {}),
                    },
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
