/**
 * Brihadhee — single source of truth for business details.
 *
 * Everything in this file is safe to edit. Anything that was still marked
 * [TO CONFIRM] / [ADD] in the brief lives here and is empty by default.
 * Empty values are never printed to visitors: the matching button, row or
 * whole section is hidden automatically. Fill a value in and it appears.
 *
 * Colours and layout live in src/styles/global.css — you do not need to touch
 * design code to update the content.
 */

import verification from "../../config/client-verification.json";
import { getFact, factOr, isConfirmed, SITE_ORIGIN, absoluteUrl } from "./entity-truth.ts";
import { CATERING_MIN_GUESTS, ENABLE_NO_ONION_NO_GARLIC_CLUSTER } from "../../config/seo-gates.ts";
import { MENU } from "./menu-canonical.ts";

const BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/**
 * Page paths, in one place. Every internal link to these pages reads from here.
 * The catering routes exist only while offer_catering is true (see catering.js).
 */
export const ROUTES = {
  home: "/",
  menu: "/menu/",
  dosa: "/menu/dosa/",
  lunch: "/menu/nellai-meals/",
  dinner: "/veg-dinner-anna-nagar/",
  about: "/about/",
  book: "/book-a-table/",
  eventCatering: "/catering-services-chennai/",
  corporateCatering: "/corporate-catering-chennai/",
  plannerPartner: "/event-planner-catering-partner/",
  whatsNew: "/whats-new/",
  seasonal: "/seasonal/karthigai-ayyappa-pure-veg/",
  nellaiGuide: "/guides/what-are-nellai-meals/",
  /* 12 Nov keyword plan spokes (section 6). The gated one is built only when its
     gate in config/seo-gates.ts is on (or as a noindex draft in dev/preview). */
  smallFunctions: "/small-function-catering-chennai/",
  cateringQuote: "/catering-quote-chennai/",
  familyDining: "/family-dining-anna-nagar/",
  faq: "/faq/",
  noOnionNoGarlic: "/no-onion-no-garlic-anna-nagar/",
};
/** Site-relative href for a route (respects the build base path). */
export const href = (path) => `${BASE_URL}${path.replace(/^\//, "")}`;

/**
 * Responsive WebP for a photo in public/images (see scripts/optimize-images.mjs):
 * returns { src, srcset } for <img>. `width` is the full-size pixel width.
 */
export function responsive(name, width) {
  const widths = [480, 800].filter((w) => w < width);
  return {
    src: `${BASE_URL}images/${name}.webp`,
    srcset: [...widths.map((w) => `${BASE_URL}images/${name}-${w}.webp ${w}w`), `${BASE_URL}images/${name}.webp ${width}w`].join(", "),
  };
}

const address = getFact("address");

const geo = getFact("geo");

const fullAddress = [
  address.line1,
  address.line2,
  address.city,
  address.state,
  address.postalCode,
].filter(Boolean).join(", ");

const mapQuery = encodeURIComponent(fullAddress);
const mapPoint = `${geo.latitude},${geo.longitude}`;

export const site = {
  /* ---- Identity ------------------------------------------------------- */
  name: getFact("name"),
  nameTamil: getFact("nameTamil"),
  // Hero tagline and featured dishes (client direction, 2026-11-13). Hero.astro shows the
  // features "on 3rd Avenue" (the street fact), next to the hours and meal framing.
  tagline: "Nostalgic Tamil Food with a Modern Twist",
  heroFeatures: ["Customized Dosa", "Paanai Parotta", "Nellai Special Sodhi Meals", "Coffee Bar"],
  // Core brand description, led by the client pillars (entity-truth.ts brandDescription).
  shortDescription: getFact("brandDescription").short,
  // Entity sentence reused on the page body.
  entitySentence:
    `${getFact("name")} is a pure vegetarian restaurant on ${getFact("street")}, Chennai ${getFact("address").postalCode}, near ${getFact("landmarks")[0]}.`,
  longDescription: getFact("brandDescription").long,

  /* ---- Contact (all optional — empty hides the control) ---------------- */
  contact: {
    phone: getFact("phone"), // enables Call buttons
    whatsapp: factOr("whatsapp", ""), // enables WhatsApp enquiry
    email: getFact("email"), // enables the enquiry form fallback
  },

  /* ---- Location ------------------------------------------------------- */
  address,
  geo,
  fullAddress,
  maps: {
    // Public Google Maps links built from the coordinates above. Replace with
    // the exact place URL from your Business Profile if you have one.
    directions: `https://www.google.com/maps/dir/?api=1&destination=${mapPoint}`,
    embed: `https://www.google.com/maps?q=${mapPoint}&z=17&output=embed`,
  },
  landmarks: getFact("landmarks").map((l) => `Near ${l}`),

  /* ---- Hours ---------------------------------------------------------- */
  /* Hours are a verified fact (src/data/entity-truth.ts). Until the owner confirms
     them nothing is rendered. When confirmed, set the fact's value to
     { timeZone, summary, days: [{ day, open: "HH:MM", close: "HH:MM" }] }. */
  hours: isConfirmed("hours")
    ? { verified: true, ...getFact("hours") }
    : { verified: false, timeZone: "Asia/Kolkata", summary: "", days: [] },

  /* ---- Social proof --------------------------------------------------- */
  // Pending fact: shown only once the Google rating and count are confirmed
  // with a date. Shape: { value, count, source: "Google", checkedOn: "YYYY-MM-DD" }
  rating: isConfirmed("googleRating") ? getFact("googleRating") : null,
  // Real, dated, permissioned reviews only (never paraphrased or unattributed).
  // Shape: { quote, name, meta } where meta is e.g. " · Google review, 2026-11-20"
  testimonials: [],

  /* ---- Good for / amenities ------------------------------------------- */
  /* Only confirmed details are listed. Add more entries once confirmed. */
  amenities: [
    { label: "Dine-in", detail: "Lunch and dinner" },
    { label: "Families welcome", detail: "Kids and group outings" },
    { label: "Alcohol", detail: "Not served" },
    { label: "Cuisine", detail: "100% pure vegetarian" },
  ],
  priceRange: factOr("priceRange")?.schema ?? "",

  /* ---- Social handles (empty hides the link) -------------------------- */
  social: {
    instagram: "https://www.instagram.com/brihadhee", // owner brief 2026-11-08
    facebook: "", // [ADD] full URL
  },

  /* ---- Images --------------------------------------------------------- */
  /* Replace the files in /public/images with the same names. See README for
     the recommended pixel sizes. */
  media: {
    hero: {
      ...responsive("hero", 1600),
      width: 1600,
      height: 1200,
      alt: "Crisp South Indian dosa served with sambar and chutneys on a banana leaf",
    },
    /* Hero slideshow (Hero.astro, src/scripts/main.js). Slide 1 is `hero` above (the
       LCP image); it plays automatically and shows the first slide without JavaScript.
       Every alt must differ from the other photos on the home page (aeo-lint check 7). */
    heroSlides: [
      {
        ...responsive("dosa", 1200),
        width: 1200,
        height: 900,
        alt: "Golden dosa on a banana-leaf tray with sambar and chutney bowls",
      },
      {
        ...responsive("meals", 1200),
        width: 1200,
        height: 900,
        alt: "Thali of rice, papad and small bowls of curries on a banana leaf",
      },
      {
        ...responsive("idiyappam", 1200),
        width: 1200,
        height: 900,
        alt: "Idiyappam on a banana leaf with a bowl of coconut milk and two clay pots",
      },
      {
        ...responsive("coffee", 1000),
        width: 1000,
        height: 1000,
        alt: "Steel tumbler of frothy South Indian drink resting in its davara",
      },
      {
        ...responsive("sweets", 1200),
        width: 1200,
        height: 900,
        alt: "Chocolate sauce being poured over a dessert in a brass bowl",
      },
    ],
    about: {
      ...responsive("meals", 1200),
      width: 1200,
      height: 900,
      alt: "South Indian meal served on a banana leaf with rice, papad and sides",
    },
    signature: {
      ...responsive("dosa", 1200),
      width: 1200,
      height: 900,
      alt: "A crisp golden dosa with chutneys and sambar",
    },
    coffee: {
      ...responsive("coffee", 1000),
      width: 1000,
      height: 1000,
      alt: "Steel tumbler and davara holding a frothy South Indian drink",
    },
    gallery: [
      {
        ...responsive("dosa", 1200),
        width: 1200,
        height: 900,
        alt: "Dosa with chutneys served on a banana leaf at the table",
        caption: "Crisp dosa with chutneys",
      },
      {
        ...responsive("coffee", 1000),
        width: 1000,
        height: 1000,
        alt: "Close view of a frothy South Indian drink in a steel tumbler and davara",
        caption: "A frothy tumbler drink",
      },
      {
        ...responsive("meals", 1200),
        width: 1200,
        height: 900,
        alt: "South Indian meal served on a round banana leaf",
        caption: "South Indian meals",
      },
      {
        ...responsive("idiyappam", 1200),
        width: 1200,
        height: 900,
        alt: "Idiyappam served with coconut milk on a banana leaf",
        caption: "Idiyappam with coconut milk",
      },
      {
        ...responsive("sweets", 1200),
        width: 1200,
        height: 900,
        alt: "Dessert served in a brass bowl with chocolate sauce poured over it",
        caption: "Dessert with chocolate sauce",
      },
    ],
    // [ADD] The 29-second video lives in /public/video. Add the file name here
    // (e.g. "/video/brihadhee.mp4") and the gallery card appears automatically.
    video: {
      src: "",
      poster: `${BASE_URL}images/hero.jpg`,
      caption: "Restaurant video",
    },
  },

  /* ---- Navigation ----------------------------------------------------- */
  /* Primary navigation (client direction, 2026-11-13). An item with `children` renders
     as a dropdown (Nav.astro). Menu: "All Menu" opens /menu/, which lists every category
     and dish on one page; the category links jump to their section there. There is no
     separate "Dinner" entry. The footer has its own list (footerLinks below). */
  navigation: [
    {
      label: "Menu",
      children: [
        { label: "All Menu", href: href(ROUTES.menu) },
        { label: "Customized Dosa", href: href(ROUTES.dosa) },
        { label: "Lunch & Nellai Meals", href: href(ROUTES.lunch) },
        // Every other menu category, Starters first. "Lunch" is covered by the link above.
        ...[...MENU.filter((c) => c.id === "starters"), ...MENU.filter((c) => !["starters", "lunch"].includes(c.id))].map((c) => ({
          label: c.name,
          href: `${href(ROUTES.menu)}#${c.id}`,
          group: "categories",
        })),
      ],
    },
    ...(verification.offer_catering === true
      ? [
          {
            label: "Catering",
            children: [
              ...(isConfirmed("corporateCatering") ? [{ label: "Corporate", href: href(ROUTES.corporateCatering) }] : []),
              { label: "Events", href: href(ROUTES.eventCatering) },
              { label: "Small Functions", href: href(ROUTES.smallFunctions) },
            ],
          },
        ]
      : []),
    ...(ENABLE_NO_ONION_NO_GARLIC_CLUSTER ? [{ label: "No Onion, No Garlic", href: href(ROUTES.noOnionNoGarlic) }] : []),
    { label: "Visit & Contact", href: href(ROUTES.about) },
  ],

  /* Footer "Explore" links: the money pages by name (the header dropdowns are shorter). */
  footerLinks: [
    { label: "Menu", href: href(ROUTES.menu) },
    { label: "Customized Dosa", href: href(ROUTES.dosa) },
    { label: "Lunch & Nellai Meals", href: href(ROUTES.lunch) },
    { label: "Dinner", href: href(ROUTES.dinner) },
    ...(verification.offer_catering === true
      ? [
          ...(isConfirmed("corporateCatering") ? [{ label: "Corporate Catering", href: href(ROUTES.corporateCatering) }] : []),
          { label: "Event Catering", href: href(ROUTES.eventCatering) },
          { label: `Small Functions (${CATERING_MIN_GUESTS}+ Guests)`, href: href(ROUTES.smallFunctions) },
          { label: "Get a Catering Quote", href: href(ROUTES.cateringQuote) },
          { label: "Event Planner Partner", href: href(ROUTES.plannerPartner) },
        ]
      : []),
    ...(ENABLE_NO_ONION_NO_GARLIC_CLUSTER ? [{ label: "No Onion, No Garlic", href: href(ROUTES.noOnionNoGarlic) }] : []),
    { label: "Visit & Contact", href: href(ROUTES.about) },
    { label: "Careers", href: "#careers" },
  ],

  /* ---- Careers (home page, client direction 2026-11-13) ----------------- */
  /* The restaurant number, plus Rakesh once his number is confirmed (entity-truth.ts
     careersContact; until then his line is hidden, never shown empty). */
  careers: {
    title: "For a career opportunity in Brihadhee",
    contacts: [
      { label: "Restaurant", phone: getFact("phone") },
      ...(isConfirmed("careersContact") ? [{ label: getFact("careersContact").name, phone: getFact("careersContact").phone }] : []),
    ],
  },

  /* ---- SEO ------------------------------------------------------------ */
  // Canonical origin for canonical, og:url, schema @ids, sitemap and llms files.
  url: SITE_ORIGIN,
  locale: "en_IN",
  areaServed: "Anna Nagar, Chennai",
  ogImage: {
    src: `${BASE_URL}images/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: "Brihadhee, pure vegetarian restaurant in Anna Nagar East, Chennai",
  },
};

/* ---- Derived helpers (used by components; no need to edit) ------------- */

export const hasPhone = Boolean(site.contact.phone);
export const hasWhatsApp = Boolean(site.contact.whatsapp);
export const hasEmail = Boolean(site.contact.email);
/** Day-by-day hours (table, Open/Closed badge, openingHoursSpecification). Needs openDays verified. */
export const hasHours = site.hours.verified && site.hours.days.length > 0;
/** Opening time range is known (shown as text even before the days are confirmed). */
export const hasHoursText = site.hours.verified && Boolean(site.hours.summary);
export const hasVideo = Boolean(site.media.video.src);
export const socialLinks = Object.entries(site.social)
  .filter(([, href]) => Boolean(href))
  .map(([key, href]) => ({ key, href }));

export const telHref = hasPhone
  ? `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`
  : "";

export const whatsappHref = hasWhatsApp
  ? `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`
  : "";

export const emailHref = hasEmail ? `mailto:${site.contact.email}` : "";

/**
 * Phone and WhatsApp for the page being rendered. The catering pages set
 * Astro.locals.contact to the catering numbers (src/pages/[slug].astro); every
 * other page gets the restaurant's. Used by the header call button, page header,
 * summary box, mobile CTA bar and the quote forms. The footer always shows the
 * restaurant's own NAP.
 */
export const restaurantContact = {
  phone: site.contact.phone,
  whatsapp: site.contact.whatsapp,
  telHref,
  whatsappHref,
  hasPhone,
  hasWhatsApp,
};
export const pageContact = (astro) => astro?.locals?.contact ?? restaurantContact;

/** Google Maps directions from a named place (origin) to the restaurant. */
export const directionsFrom = (origin) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${site.geo.latitude},${site.geo.longitude}`;

/** Absolute canonical URL for a local asset src (strips the build base path). */
export const assetUrl = (src) => absoluteUrl(`/${src.startsWith(BASE_URL) ? src.slice(BASE_URL.length) : src.replace(/^\//, "")}`);

export const ogImageUrl = assetUrl(site.ogImage.src);
