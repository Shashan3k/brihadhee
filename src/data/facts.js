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

const BRIEF = "client brief, 2026-11-05";
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

export const FACTS = {
  /* ---- Identity ------------------------------------------------------- */
  name: confirmed("Brihadhee"),
  nameTamil: confirmed("பிரிஹதீ"),
  alternateNames: confirmed([], "none confirmed yet; add only spellings the owner confirms"),
  type: confirmed("vegetarian South Indian restaurant"),
  cuisine: confirmed("Vegetarian South Indian"),

  /* ---- Location ------------------------------------------------------- */
  address: confirmed({
    line1: "New W-41 (Old W-124), 3rd Avenue",
    line2: "W Block, Anna Nagar East",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600040",
    country: "IN",
  }),
  landmarks: confirmed(["Anna Tower", "3rd Avenue and 9th Street", "Aadhaar Seva Kendra"]),
  geo: confirmed({ latitude: 13.0879396, longitude: 80.2178246 }),

  /* ---- Contact -------------------------------------------------------- */
  phone: confirmed("+91 73587 14113"),
  whatsapp: confirmed("+917358714113"),
  email: confirmed("brihadhee@gmail.com"),

  /* ---- Service -------------------------------------------------------- */
  mealTimes: confirmed("lunch and dinner"),
  dineIn: confirmed(true),
  familyFriendly: confirmed(true),
  alcohol: confirmed("not served"),
  knownFor: confirmed(["filter coffee", "banana-leaf meals"]),

  /* ---- Pending: do not render until the client confirms ----------------- */
  hours: pending("opening hours for every day, any afternoon break", [
    /\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)\s*(?:to|-|–|—)\s*\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)/i,
    /\bopen\s+(?:daily|every\s*day|now|on\s+weekends?)\b/i,
    /\bclos(?:es|ing)\s+(?:at|time)\b/i,
  ]),
  priceRange: pending("price range per person", [
    /price\s+range\s+per\s+person/i,
    /(?:₹|rs\.?)\s?\d+\s*(?:to|-|–)\s*(?:₹|rs\.?)?\s?\d+\s*(?:per\s+(?:person|head)|for\s+two)/i,
  ]),
  googleRating: pending(
    "current Google rating and review count from the verified Business Profile, with the date checked",
    [/\b857\b/, /\b4\.2\b/, /google\s+(?:rating|reviews?)/i]
  ),
  customizableDosas: pending(
    "whether customizable dosas are available now, and exactly how they work",
    [/customi[sz](?:e|able|ed)\s+dosas?/i, /build\s+your\s+own\s+dosa/i]
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
