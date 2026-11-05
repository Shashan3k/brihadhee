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
import { getFact, factOr, isConfirmed } from "./facts.js";

const BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

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
    "Customised dosas, Paanai Parotta, Nellai Special Sodhi Meals and filter coffee on 3rd Avenue, Anna Nagar East. Open daily from 6:30 AM.",
  shortDescription:
    "Brihadhee is a pure vegetarian restaurant and caterer in Anna Nagar East, Chennai, known for customised dosas, Paanai Parotta and Nellai Special Sodhi Meals.",
  // Entity sentence reused on the page body.
  entitySentence:
    "Brihadhee is a pure vegetarian restaurant on 3rd Avenue, W-Block, Anna Nagar East, Chennai 600040, near Anna Nagar Tower Park.",
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
  /* Hours are a PENDING fact (src/data/facts.js). Until the owner confirms
     them nothing is rendered. When confirmed, set the fact's value to
     { timeZone, summary, days: [{ day, open: "HH:MM", close: "HH:MM" }] }. */
  hours: isConfirmed("hours")
    ? { verified: true, ...getFact("hours") }
    : { verified: false, timeZone: "Asia/Kolkata", summary: "", days: [] },

  /* ---- Social proof --------------------------------------------------- */
  // Pending fact: shown only once the Google rating and count are confirmed
  // with a date. Shape: { value, count, source: "Google", checkedOn: "YYYY-MM-DD" }
  rating: isConfirmed("googleRating") ? getFact("googleRating") : null,
  reviewSummary:
    "Diners describe delicious, authentic South Indian food and a relaxed, family-friendly room.",
  reviewHighlights: [
    "Dosas and filter coffee",
    "Vegetarian South Indian",
    "Family-friendly",
  ],
  // [ADD] 3–5 genuine testimonials (with permission), then delete the empty
  // array. Shape: { quote, name, meta }
  testimonials: [],

  /* ---- Good for / amenities ------------------------------------------- */
  /* Only confirmed details are listed. Add more entries once confirmed. */
  amenities: [
    { label: "Dine-in", detail: "Breakfast, lunch and dinner" },
    { label: "Open daily", detail: "6:30 AM to 11:00 PM" },
    { label: "Families welcome", detail: "Kids and group outings" },
    { label: "Alcohol", detail: "Not served" },
    { label: "Cuisine", detail: "100% pure vegetarian" },
  ],
  priceGuide: factOr("priceRange")?.text ?? "",
  priceRange: factOr("priceRange")?.schema ?? "",

  /* ---- Social handles (empty hides the link) -------------------------- */
  social: {
    instagram: "", // handle unconfirmed
    facebook: "", // [ADD] full URL
  },

  /* ---- Images --------------------------------------------------------- */
  /* Replace the files in /public/images with the same names. See README for
     the recommended pixel sizes. */
  media: {
    hero: {
      src: `${BASE_URL}images/hero.jpg`,
      width: 1600,
      height: 1200,
      alt: "Crisp South Indian dosa served with sambar and chutneys on a banana leaf",
    },
    about: {
      src: `${BASE_URL}images/meals.jpg`,
      width: 1200,
      height: 900,
      alt: "South Indian meal served on a banana leaf with rice, papad and sides",
    },
    signature: {
      src: `${BASE_URL}images/dosa.jpg`,
      width: 1200,
      height: 900,
      alt: "A crisp golden dosa with chutneys and sambar",
    },
    coffee: {
      src: `${BASE_URL}images/coffee.jpg`,
      width: 1000,
      height: 1000,
      alt: "Steel tumbler and davara holding a frothy South Indian drink",
    },
    gallery: [
      {
        src: `${BASE_URL}images/dosa.jpg`,
        width: 1200,
        height: 900,
        alt: "Dosa with chutneys served on a banana leaf at the table",
        caption: "Crisp dosa with chutneys",
      },
      {
        src: `${BASE_URL}images/coffee.jpg`,
        width: 1000,
        height: 1000,
        alt: "Close view of a frothy South Indian drink in a steel tumbler and davara",
        caption: "A frothy tumbler drink",
      },
      {
        src: `${BASE_URL}images/meals.jpg`,
        width: 1200,
        height: 900,
        alt: "South Indian meal served on a round banana leaf",
        caption: "South Indian meals",
      },
      {
        src: `${BASE_URL}images/tiffin.jpg`,
        width: 1200,
        height: 900,
        alt: "Idiyappam served with coconut milk on a banana leaf",
        caption: "Idiyappam with coconut milk",
      },
      {
        src: `${BASE_URL}images/sweets.jpg`,
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
    { label: "Visit", href: "#visit" },
    { label: "Contact", href: "#contact" },
  ],

  /* ---- SEO ------------------------------------------------------------ */
  url: "https://shashan3k.github.io/brihadhee",
  locale: "en_IN",
  areaServed: "Anna Nagar, Chennai",
  /* Canonical target clusters (see Key.md). Gated terms only appear once the
     owner confirms them in config/client-verification.json. */
  keywords: [
    "Brihadhee Anna Nagar",
    "pure veg restaurant Anna Nagar East",
    "South Indian restaurant Anna Nagar",
    "veg hotel Anna Nagar",
    "அண்ணா நகர் சைவ உணவகம்",
    "customised dosa Anna Nagar",
    "Paanai Parotta Chennai",
    "Nellai sodhi meals Chennai",
    "mini tiffin Anna Nagar",
    "filter coffee Anna Nagar",
    ...(verification.offer_catering === true ? ["pure veg catering Chennai"] : []),
  ],
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
export const hasHours = site.hours.verified && site.hours.days.length > 0;
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

export const ogImageUrl = new URL(site.ogImage.src, site.url).href;
