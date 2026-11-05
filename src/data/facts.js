/**
 * Brihadhee: the single source of facts.
 *
 * Pure ESM with no Vite or Astro imports, so Node scripts (scripts/aeo-lint.mjs)
 * can import it. Every page, meta tag, FAQ, schema block and generated file
 * reads from here (directly or through src/data/site.js).
 *
 * Each fact: { value, status: "confirmed" | "pending", verifiedOn, source }.
 *  - Read a fact with getFact(key). Reading a PENDING fact throws, which fails
 *    the build with a message naming the fact and what the client must confirm.
 *  - Gate optional content with isConfirmed(key).
 *  - Pending facts carry `probes` (regexes) that scripts/aeo-lint.mjs searches
 *    for in the built HTML, to catch a pending fact that reached a page by
 *    another route (for example text typed into a component).
 */

const BRIEF = "client brief (owner-confirmed), 2026-11-05";
const DATE = "2026-11-05";

const confirmed = (value, source = BRIEF, verifiedOn = DATE) => ({
  value,
  status: "confirmed",
  verifiedOn,
  source,
});

const pending = (needs, probes = []) => ({
  value: null,
  status: "pending",
  verifiedOn: null,
  source: null,
  needs,
  probes,
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const FACTS = {
  /* ---- Identity ------------------------------------------------------- */
  name: confirmed("Brihadhee"),
  nameTamil: confirmed("பிரிஹதீ"),
  alternateNames: confirmed(["Brihadhee Hotels", "Brihadhee Pure Veg Restaurant"]),
  subBrand: confirmed({
    name: "Beyond Curry by Brihadhee",
    description: "North Indian meal boxes",
  }),
  type: confirmed("pure vegetarian restaurant"),
  typeLong: confirmed("pure vegetarian South Indian restaurant and caterer"),
  cuisine: confirmed(
    "100% pure vegetarian: South Indian with Tirunelveli (Nellai) and Karaikudi specialties, plus North Indian and Indo-Chinese"
  ),
  cuisines: confirmed([
    "South Indian",
    "Tirunelveli",
    "Karaikudi",
    "North Indian",
    "Indo-Chinese",
    "Pure Vegetarian",
  ]),
  founders: confirmed({
    names: ["Rakesh", "Eashwer"],
    story:
      "Brihadhee was founded by Rakesh and Eashwer, an auditor and a lawyer by profession, out of a shared passion for authentic regional Tamil vegetarian food.",
  }),

  /* ---- Location ------------------------------------------------------- */
  address: confirmed({
    line1: "New No. W-41, Old No. W-124, W-Block, 3rd Avenue",
    line2: "Ward 100, Main Road, Anna Nagar East",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600040",
    country: "IN",
  }),
  landmarks: confirmed(["Anna Nagar Tower Park", "3rd Avenue and 9th Street", "Aadhaar Seva Kendra"]),
  nearbyAreas: confirmed([
    "Anna Nagar East",
    "Anna Nagar West",
    "Shenoy Nagar",
    "Kilpauk",
    "Mogappair",
    "Thirumangalam",
  ]),
  geo: confirmed({ latitude: 13.0879396, longitude: 80.2178246 }),

  /* ---- Contact -------------------------------------------------------- */
  phone: confirmed("+91 94442 24999"),
  whatsapp: pending("which number takes WhatsApp enquiries (the old +91 73587 14113 is no longer listed)", [
    /\b73587\s?14113\b/,
  ]),
  email: confirmed("brihadhee@gmail.com"),

  /* ---- Service -------------------------------------------------------- */
  hours: confirmed({
    timeZone: "Asia/Kolkata",
    summary: "Open daily, 6:30 AM to 11:00 PM",
    days: DAYS.map((day) => ({ day, open: "06:30", close: "23:00" })),
  }),
  mealTimes: confirmed("breakfast, lunch and dinner"),
  dineIn: confirmed(true),
  familyFriendly: confirmed(true),
  alcohol: confirmed("not served"),
  acceptsReservations: confirmed({
    value: true,
    how: "pre-booking through Swiggy Dineout, EazyDiner and District",
  }),
  priceRange: confirmed({
    schema: "₹₹",
    text: "₹200 to ₹400 for two for tiffin, and about ₹800 for a full family meal",
  }),
  offers: confirmed(
    [
      {
        id: "mini-tiffin",
        name: "Mini Tiffin combo",
        price: 80,
        description: "Pongal, kesari, 2 idlis, masala dosa, vada, sambar and chutneys for ₹80",
      },
      {
        id: "budget-tiffin",
        name: "Budget tiffin options",
        price: 24,
        description: "budget tiffin options from ₹24",
      },
      {
        id: "walk-in",
        name: "Walk-in dine-in discount",
        description: "10% off for walk-in dine-in",
      },
      {
        id: "pre-booking",
        name: "Pre-booking dine-in discount",
        description:
          "up to 40% off Monday to Thursday when you pre-book a table through Swiggy Dineout, EazyDiner or District",
      },
    ],
    "client brief, 2026-11-05 (offers change; re-check monthly)"
  ),
  knownFor: confirmed([
    "customised dosas",
    "Paanai Parotta",
    "Nellai Special Sodhi Meals",
    "filter coffee",
  ]),
  signatureExtras: confirmed([
    { name: "Customised Dosa", note: "dosa made to your choice at the table" },
    { name: "Summer in Tenkasi", note: "signature drink" },
    { name: "Butter Biscuit Shake", note: "signature shake" },
    { name: "Outdoor filter coffee and tea counter", note: "dedicated counter at the restaurant" },
  ]),
  customizableDosas: confirmed(true),

  /* ---- Catering ------------------------------------------------------- */
  catering: confirmed({
    guests: { min: 50, max: 1500 },
    area: "Chennai",
    liveCounters: ["Customised Dosa", "Paanai Parotta", "Nellai Sodhi", "Karaikudi Paneer Poppers"],
    plannerModels: ["white-label live counters", "co-branded live counters"],
    pricing: "per-plate pricing, quoted for each menu",
  }),

  /* ---- Pending: do not render until the client confirms ----------------- */
  googleRating: pending(
    "current Google rating and review count from the verified Business Profile, with the date checked",
    [/\b857\b/, /\b4\.2\b/, /google\s+(?:rating|reviews?)/i]
  ),
  lateNight: pending(
    "the late-night dining offer: the brief says 'up to 6:00 AM' but the restaurant closes at 11:00 PM",
    [/\b6(?::00)?\s*a\.?m\.?\b(?!\s*(?:to|–|-))/i, /late[- ]night/i]
  ),
};

/* ---- Accessors ---------------------------------------------------------- */

export function isConfirmed(key) {
  const f = FACTS[key];
  if (!f) throw new Error(`[facts] unknown fact "${key}"`);
  return f.status === "confirmed";
}

/** Value of a confirmed fact. Throws (failing the build) for a pending fact. */
export function getFact(key) {
  const f = FACTS[key];
  if (!f) throw new Error(`[facts] unknown fact "${key}"`);
  if (f.status !== "confirmed") {
    throw new Error(
      `[facts] "${key}" is PENDING and cannot be rendered. Client must confirm: ${f.needs}. ` +
        `Confirm it in src/data/facts.js (status, value, verifiedOn, source) and docs/seo/client-confirmations.md, ` +
        `or gate the content with isConfirmed("${key}").`
    );
  }
  return f.value;
}

/** Value if confirmed, otherwise the fallback (never throws). */
export function factOr(key, fallback = null) {
  return isConfirmed(key) ? FACTS[key].value : fallback;
}

export const pendingFacts = () =>
  Object.entries(FACTS)
    .filter(([, f]) => f.status !== "confirmed")
    .map(([key, f]) => ({ key, needs: f.needs, probes: f.probes ?? [] }));

/* ---- Derived, formatted helpers (still pure) ---------------------------- */

export const addressLine = () => {
  const a = getFact("address");
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.postalCode}`;
};

/** "A, B and C"; uses semicolons when an item itself contains " and ". */
export const landmarkSentence = () => {
  const l = getFact("landmarks");
  if (l.length <= 1) return l.join("");
  const sep = l.some((x) => / and /.test(x)) ? "; " : ", ";
  return sep === "; "
    ? `${l.slice(0, -1).join(sep)}; and ${l[l.length - 1]}`
    : `${l.slice(0, -1).join(sep)} and ${l[l.length - 1]}`;
};
