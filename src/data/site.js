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

const BASE_URL = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const address = {
  line1: "New W-41 (Old W-124), 3rd Avenue",
  line2: "W Block, Anna Nagar East",
  city: "Chennai",
  state: "Tamil Nadu",
  postalCode: "600040",
  country: "IN",
};

const geo = {
  latitude: 13.0879396,
  longitude: 80.2178246,
};

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
  name: "Brihadhee",
  nameTamil: "பிரிஹதீ",
  tagline: "Vegetarian South Indian flavours, served the traditional way.",
  subTagline:
    "Customizable dosas, banana-leaf meals and filter coffee in the heart of Anna Nagar East.",
  shortDescription:
    "Brihadhee is a vegetarian South Indian restaurant in Anna Nagar East, Chennai — known for customizable dosas, traditional filter coffee and banana-leaf meals.",
  longDescription:
    "Brihadhee is a vegetarian South Indian restaurant in Anna Nagar, Chennai. It serves South Indian favourites including customizable dosas, meals and traditional tumbler drinks.",

  /* ---- Contact (all optional — empty hides the control) ---------------- */
  contact: {
    phone: "+91 73587 14113", // enables Call buttons
    whatsapp: "+917358714113", // enables WhatsApp enquiry
    email: "brihadhee@gmail.com", // enables the enquiry form fallback
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
  landmarks: ["Near Anna Tower", "3rd Avenue & 9th Street", "Near Aadhaar Seva Kendra"],

  /* ---- Hours ---------------------------------------------------------- */
  /* Owner-provided hours: 11:00 AM – 11:00 PM daily. Still to be confirmed
     against the Google Business Profile before launch.
     Set `verified: false` to hide the hours table and Open/Closed badge. */
  hours: {
    verified: false,
    timeZone: "Asia/Kolkata",
    summary: "Open daily · 11:00 AM – 11:00 PM",
    days: [
      { day: "Monday", open: "11:00", close: "23:00" },
      { day: "Tuesday", open: "11:00", close: "23:00" },
      { day: "Wednesday", open: "11:00", close: "23:00" },
      { day: "Thursday", open: "11:00", close: "23:00" },
      { day: "Friday", open: "11:00", close: "23:00" },
      { day: "Saturday", open: "11:00", close: "23:00" },
      { day: "Sunday", open: "11:00", close: "23:00" },
    ],
  },

  /* ---- Social proof --------------------------------------------------- */
  rating: {
    value: 4.2,
    count: 857,
    source: "Google",
  },
  reviewSummary:
    "Diners describe delicious, authentic South Indian food, unique customizable dosas and a relaxed, family-friendly room.",
  reviewHighlights: [
    "Customizable dosas",
    "Vegetarian South Indian",
    "Family-friendly",
  ],
  // [ADD] 3–5 genuine testimonials (with permission), then delete the empty
  // array. Shape: { quote, name, meta }
  testimonials: [],

  /* ---- Answer-ready FAQs (only confirmed facts) ---------------------- */
  faqs: [
    {
      question: "Is Brihadhee a vegetarian restaurant?",
      answer: "Yes. Brihadhee serves vegetarian South Indian food.",
    },
    {
      question: "Where is Brihadhee located?",
      answer:
        "Brihadhee is at New W-41 (Old W-124), 3rd Avenue, W Block, Anna Nagar East, Chennai, Tamil Nadu 600040.",
    },
    {
      question: "Is Brihadhee family-friendly?",
      answer:
        "Yes. Brihadhee welcomes families, children and group outings for lunch and dinner.",
    },
    {
      question: "Does Brihadhee serve filter coffee?",
      answer:
        "Yes. Filter coffee is listed on Brihadhee's menu.",
    },
    {
      question: "What is the address of Brihadhee in Anna Nagar?",
      answer:
        "New W-41 (Old W-124), 3rd Avenue, W Block, Anna Nagar East, Chennai, Tamil Nadu 600040.",
    },
    {
      question: "Which restaurant near Anna Tower serves South Indian meals?",
      answer:
        "Brihadhee is a vegetarian South Indian restaurant near Anna Tower and 3rd Avenue, serving lunch and dinner.",
    },
    {
      question: "Can I find banana leaf meals in Anna Nagar?",
      answer:
        "Yes. Brihadhee serves meals on banana leaf at its Anna Nagar East restaurant.",
    },
  ],

  /* ---- Good for / amenities ------------------------------------------- */
  /* Only confirmed details are listed. Add more entries once confirmed. */
  amenities: [
    { label: "Dine-in", detail: "Lunch and dinner" },
    { label: "Families welcome", detail: "Kids and group outings" },
    { label: "Alcohol", detail: "Not served" },
    { label: "Cuisine", detail: "Vegetarian South Indian" },
  ],
  priceGuide: "",
  priceRange: "",

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
      src: `${BASE_URL}images/interior-illustration.svg`,
      width: 1200,
      height: 900,
      alt: "Illustration of a warm South Indian dining room, not a photograph of Brihadhee",
    },
    signature: {
      src: `${BASE_URL}images/dosa.jpg`,
      width: 1200,
      height: 900,
      alt: "Crisp dosa served with chutneys",
    },
    coffee: {
      src: `${BASE_URL}images/coffee.jpg`,
      width: 1000,
      height: 1000,
      alt: "Frothy South Indian drink served in a steel tumbler and davara",
    },
    gallery: [
      {
        src: `${BASE_URL}images/dosa.jpg`,
        width: 1200,
        height: 900,
        alt: "Golden dosa served with chutneys on a banana leaf",
        caption: "Crisp dosa with chutneys",
      },
      {
        src: `${BASE_URL}images/interior-illustration.svg`,
        width: 1200,
        height: 900,
        alt: "Illustration of a South Indian dining room; this is not a photograph of Brihadhee",
        caption: "Dining room illustration",
      },
      {
        src: `${BASE_URL}images/coffee.jpg`,
        width: 1000,
        height: 1000,
        alt: "Frothy South Indian drink served in a steel tumbler and davara",
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
      poster: `${BASE_URL}images/interior-illustration.svg`,
      caption: "Restaurant video",
    },
  },

  /* ---- Navigation ----------------------------------------------------- */
  catering: {
    dailyVolume: "800–900 people per day [CONFIRM exact figure before publishing]",
    founders: [],
    clients: [
      "Aalam",
      "Freehand",
      "Pando",
      "Bi3 Technologies",
      "Nestle",
      "NDR",
      "Selvarangam Hospitals",
      "FRUTTA",
      "Go Khana",
      "Hunger Box",
      "Pro Chant",
      "Prodapt",
      "Stark Event Management",
    ],
  },

  navigation: [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Visit", href: "#visit" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  /* ---- SEO ------------------------------------------------------------ */
  url: "https://shashan3k.github.io/brihadhee",
  locale: "en_IN",
  areaServed: "Anna Nagar, Chennai",
  keywords: [
    "Brihadhee restaurant Anna Nagar",
    "South Indian restaurant Anna Nagar",
    "vegetarian restaurant Anna Nagar",
    "vegetarian South Indian restaurant Chennai",
    "dosa restaurant Anna Nagar",
    "filter coffee Anna Nagar",
    "family restaurant Anna Nagar East",
    "best South Indian restaurant Anna Nagar",
    "best vegetarian restaurant Anna Nagar",
    "best dosa in Anna Nagar",
    "customizable dosa Anna Nagar",
    "banana leaf meals Anna Nagar",
    "vegetarian dining near 3rd Avenue Anna Nagar",
    "South Indian restaurant near Anna Tower",
    "affordable South Indian meals in Anna Nagar",
  ],
  ogImage: {
    src: `${BASE_URL}images/og-image.jpg`,
    width: 1200,
    height: 630,
    alt: "Brihadhee — vegetarian South Indian restaurant in Anna Nagar, Chennai",
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
