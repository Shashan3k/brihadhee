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

const BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

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
  tagline: "Regional Tamil vegetarian food, from Nellai sodhi to Paanai Parotta.",
  subTagline:
    `Build-your-own dosas, Paanai Parotta, Nellai Special Sodhi Meals and filter coffee on ${getFact("street")}, for ${getFact("mealTimes")}, ${getFact("hours").short}.`,
  shortDescription:
    "Brihadhee is a pure vegetarian restaurant and caterer in Anna Nagar East, Chennai, known for build-your-own dosas, Paanai Parotta and Nellai sodhi meals.",
  // Entity sentence reused on the page body.
  entitySentence:
    `${getFact("name")} is a pure vegetarian restaurant on ${getFact("street")}, Chennai ${getFact("address").postalCode}, near ${getFact("landmarks")[0]}.`,
  longDescription:
    "Brihadhee is a pure vegetarian restaurant in Anna Nagar East, Chennai, serving South Indian food with Tirunelveli (Nellai) and Karaikudi specialties, plus North Indian and Indo-Chinese dishes.",

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
  navigation: [
    { label: "Menu", href: `${BASE_URL}menu/` },
    { label: "Dosa & Parotta", href: `${BASE_URL}best-dosa-parotta-anna-nagar/` },
    { label: "Nellai Meals", href: `${BASE_URL}nellai-meals-south-indian-veg-anna-nagar/` },
    ...(verification.offer_catering === true
      ? [
          { label: "Catering", href: `${BASE_URL}catering-services-chennai/` },
          { label: "Event Planners", href: `${BASE_URL}event-planner-catering-partner/` },
        ]
      : []),
    { label: "About", href: `${BASE_URL}about/` },
    { label: "Contact", href: "#contact" },
  ],

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

/** Absolute canonical URL for a local asset src (strips the build base path). */
export const assetUrl = (src) => absoluteUrl(`/${src.startsWith(BASE_URL) ? src.slice(BASE_URL.length) : src.replace(/^\//, "")}`);

export const ogImageUrl = assetUrl(site.ogImage.src);
