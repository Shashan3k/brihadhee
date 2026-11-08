/**
 * Brihadhee: entity truth (single source of truth for NAP and business facts).
 *
 * Every page, meta tag, JSON-LD node, sitemap entry, llms file and verify
 * script reads from here (directly or through src/data/site.js).
 *
 * Rules
 *  - status "verified": two agreeing sources, or an owner decision recorded
 *    in the repo (docs/seo-baseline.md section 6 and 7).
 *  - status "unverified": value is null. getFact() throws on it, so it can
 *    never reach a page, schema block or llms file by accident.
 *  - Unverified facts carry `probes`: text patterns the verify scripts search
 *    for in built HTML to catch a value that slipped in another way.
 *
 * Plain TypeScript with erasable syntax only, so Node can import this file
 * directly in scripts (type stripping) and Astro/Vite can bundle it.
 */

export type Status = "verified" | "unverified";

export interface Fact<T> {
  value: T | null;
  status: Status;
  verifiedOn: string | null;
  source: string | null;
  needs?: string;
  probes?: RegExp[];
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface Geo {
  latitude: number;
  longitude: number;
}
export interface Hours {
  timeZone: string;
  summary: string;
  short: string;
  opens: string;
  closes: string;
  days: { day: string; open: string; close: string }[];
}
export interface Offer {
  id: string;
  name: string;
  price?: number;
  description: string;
}
export interface Catering {
  guests: { min: number; max: number };
  area: string;
  liveCounters: string[];
  plannerModels: string[];
  pricing: string;
}

const BRIEF = "owner brief recorded in the repo, 2026-11-05";
const D5 = "2026-11-05";
const D6 = "2026-11-06";

function verified<T>(value: T, source: string = BRIEF, verifiedOn: string = D5): Fact<T> {
  return { value, status: "verified", verifiedOn, source };
}
function unverified<T>(needs: string, probes: RegExp[] = []): Fact<T> {
  return { value: null, status: "unverified", verifiedOn: null, source: null, needs, probes };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Canonical production origin (owner, 2026-11-06). No trailing slash. */
export const SITE_ORIGIN = "https://www.brihadhee.com";
/** Date the site content was last reviewed; used for dateModified and sitemap lastmod. */
export const CONTENT_UPDATED = D6;

export const FACTS = {
  /* ---- Identity ---------------------------------------------------------- */
  name: verified("Brihadhee", "menu PDF, Google and Zomato listings, owner brief"),
  legalName: unverified<string>("registered legal name of the business"),
  nameTamil: verified("பிரிஹதீ", "original brief (Ho.md), owner brief"),
  alternateNames: verified(["Brihadhee Hotels", "Brihadhee Pure Veg Restaurant"]),
  subBrand: verified({ name: "Beyond Curry by Brihadhee", description: "North Indian meal boxes" }),
  type: verified("pure vegetarian restaurant"),
  typeLong: verified("pure vegetarian South Indian restaurant and caterer"),
  dietary: verified("100% pure vegetarian", "owner brief; menu PDF lists no meat, egg or fish"),
  cuisine: verified(
    "100% pure vegetarian: South Indian with Tirunelveli (Nellai) and Karaikudi specialties, plus North Indian and Indo-Chinese"
  ),
  cuisines: verified(["South Indian", "Tirunelveli", "Karaikudi", "North Indian", "Indo-Chinese", "Pure Vegetarian"]),
  founders: verified({
    names: ["Rakesh", "Eashwer"],
    story:
      "Brihadhee was founded by Rakesh and Eashwer, an auditor and a lawyer by profession, out of a shared passion for authentic regional Tamil vegetarian food.",
  }),

  /* ---- Location ---------------------------------------------------------- */
  address: verified<Address>(
    {
      line1: "New No. W-41, Old No. W-124, W-Block, 3rd Avenue",
      line2: "Ward 100, Main Road, Anna Nagar East",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600040",
      country: "IN",
    },
    "owner brief; Zomato and Magicpin show the same wording"
  ),
  street: verified("3rd Avenue, W-Block, Anna Nagar East", "derived from the verified address"),
  landmarks: verified(["Anna Nagar Tower Park", "3rd Avenue and 9th Street", "Aadhaar Seva Kendra"], "Ho.md (Google map), owner brief"),
  nearbyAreas: verified(["Anna Nagar East", "Anna Nagar West", "Shenoy Nagar", "Kilpauk", "Mogappair", "Thirumangalam"]),
  geo: verified<Geo>({ latitude: 13.0879662, longitude: 80.2178222 }, "Google Maps place URL (docs/geo/presence-audit.csv)", D6),
  mapUrl: verified(
    "https://www.google.com/maps/place/BRIHADHEE/@13.0879662,80.2178222,17z/data=!4m6!3m5!1s0x3a5265ec5076e09b:0xa0425a2bd8cf093c!8m2!3d13.0879662!4d80.2178222!16s%2Fg%2F11x16tzgsf",
    "Google Maps place URL (docs/geo/presence-audit.csv)",
    D6
  ),

  /* ---- Contact ----------------------------------------------------------- */
  phone: verified("+91 94442 24999", "owner brief; Zomato, Magicpin, District and Apple Maps listings"),
  whatsapp: unverified<string>("which number takes WhatsApp enquiries (the old +91 73587 14113 is no longer listed)", [/\b73587\s?14113\b/]),
  email: verified("brihadhee@gmail.com", "repo since the first commit (owner to reconfirm)"),

  /* ---- Service ----------------------------------------------------------- */
  hours: verified<Hours>(
    {
      timeZone: "Asia/Kolkata",
      summary: "Open daily, 6:30 AM to 11:00 PM",
      short: "6:30 AM to 11:00 PM",
      opens: "06:30",
      closes: "23:00",
      days: DAYS.map((day) => ({ day, open: "06:30", close: "23:00" })),
    },
    "owner brief; original reservation listing (Ho.md)"
  ),
  mealTimes: verified("breakfast, lunch and dinner"),
  dineIn: verified(true),
  familyFriendly: verified(true, "owner brief; Google profile notes (Ho.md)"),
  alcohol: verified("not served", "owner brief; reservation listing (Ho.md)"),
  acceptsReservations: verified({ value: true, how: "pre-booking through Swiggy Dineout, EazyDiner and District" }),
  /** Booking pages confirmed for linking. Swiggy Dineout and District URLs are not confirmed yet (named, not linked). */
  bookingLinks: verified(
    [{ label: "EazyDiner", url: "https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877" }],
    "master brief from the Brihadhee team, 2026-11-08",
    "2026-11-08"
  ),
  priceRange: verified({
    schema: "₹₹",
    text: "₹200 to ₹400 for two for tiffin, and about ₹800 for a full family meal",
  }),
  offers: verified<Offer[]>(
    [
      { id: "mini-tiffin", name: "Mini Tiffin combo", price: 80, description: "Pongal, kesari, 2 idlis, masala dosa, vada, sambar and chutneys for ₹80" },
      { id: "budget-tiffin", name: "Budget tiffin options", price: 24, description: "budget tiffin options from ₹24" },
      { id: "walk-in", name: "Walk-in dine-in discount", description: "10% off for walk-in dine-in" },
      {
        id: "pre-booking",
        name: "Pre-booking dine-in discount",
        description: "up to 40% off Monday to Thursday when you pre-book a table through Swiggy Dineout, EazyDiner or District",
      },
    ],
    "owner brief 2026-11-05; Mini Tiffin and budget tiffin kept by owner decision 2026-11-06 (offers change; re-check monthly)",
    D6
  ),
  knownFor: verified(["customised dosas", "Paanai Parotta", "Nellai Special Sodhi Meals", "filter coffee"]),
  customizableDosas: verified(true),

  /* ---- Catering ---------------------------------------------------------- */
  catering: verified<Catering>({
    guests: { min: 50, max: 1500 },
    area: "Chennai",
    liveCounters: ["Customised Dosa", "Paanai Parotta", "Nellai Sodhi", "Karaikudi Paneer Poppers"],
    plannerModels: ["white-label live counters", "co-branded live counters"],
    pricing: "per-plate pricing, quoted for each menu",
  }),

  /* ---- Unverified: null until the owner confirms ------------------------- */
  /** Owner-supplied profiles only. Add Google Business Profile, Swiggy, Zomato, District,
   *  Justdial, Apple Maps and Bing Places URLs once the owner confirms each is theirs. */
  sameAs: verified<string[]>(
    ["https://www.instagram.com/brihadhee", "https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877"],
    "master brief from the Brihadhee team (sections 9 and 14), 2026-11-08",
    "2026-11-08"
  ),
  parking: unverified<string>("whether parking is available, and where", [/\bparking\b/i]),
  googleRating: unverified<{ value: number; count: number; checkedOn: string }>(
    "current Google rating and review count from the verified Business Profile, with the date checked",
    [/\b857\b/, /\b4\.2\s*(?:★|stars?|\/\s*5|out of 5)/i, /google\s+(?:rating|reviews?)/i]
  ),
  lateNight: unverified<string>(
    "the late-night dining offer: the brief says 'up to 6:00 AM' but the restaurant closes at 11:00 PM",
    [/\b6(?::00)?\s*a\.?m\.?\b(?!\s*(?:to|–|-))/i, /late[- ]night/i]
  ),
  dosaVarietyCount500: unverified<number>("the '500+ dosa varieties' claim; the menu lists 11 dosa items", [/\b500\s*\+?\s*(?:varieties|types|kinds)/i]),
};

export type FactKey = keyof typeof FACTS;

/* ---- Accessors ------------------------------------------------------------ */

export function isConfirmed(key: FactKey): boolean {
  const f = FACTS[key] as Fact<unknown>;
  if (!f) throw new Error(`[entity-truth] unknown fact "${String(key)}"`);
  return f.status === "verified";
}
export const isVerified = isConfirmed;

/** Value of a verified fact. Throws (failing the build) for an unverified fact. */
export function getFact<K extends FactKey>(key: K): NonNullable<(typeof FACTS)[K]["value"]> {
  const f = FACTS[key] as Fact<unknown>;
  if (!f) throw new Error(`[entity-truth] unknown fact "${String(key)}"`);
  if (f.status !== "verified" || f.value === null) {
    throw new Error(
      `[entity-truth] "${String(key)}" is UNVERIFIED and cannot be rendered. Owner must confirm: ${f.needs}. ` +
        `Update src/data/entity-truth.ts and docs/seo-baseline.md, or gate the content with isVerified("${String(key)}").`
    );
  }
  return f.value as NonNullable<(typeof FACTS)[K]["value"]>;
}

/** Value if verified, otherwise the fallback (never throws). */
export function factOr<K extends FactKey, F>(key: K, fallback: F): NonNullable<(typeof FACTS)[K]["value"]> | F {
  return isConfirmed(key) ? (FACTS[key].value as NonNullable<(typeof FACTS)[K]["value"]>) : fallback;
}

export function pendingFacts(): { key: string; needs: string; probes: RegExp[] }[] {
  return Object.entries(FACTS)
    .filter(([, f]) => (f as Fact<unknown>).status !== "verified")
    .map(([key, f]) => ({ key, needs: (f as Fact<unknown>).needs ?? "", probes: (f as Fact<unknown>).probes ?? [] }));
}
export const unverifiedFacts = pendingFacts;

/* ---- Formatted helpers ---------------------------------------------------- */

export function addressLine(): string {
  const a = getFact("address");
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.postalCode}`;
}

/** "A, B and C"; uses semicolons when an item itself contains " and ". */
export function landmarkSentence(): string {
  const l = getFact("landmarks");
  if (l.length <= 1) return l.join("");
  return l.some((x) => / and /.test(x))
    ? `${l.slice(0, -1).join("; ")}; and ${l[l.length - 1]}`
    : `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}`;
}

/** Absolute URL on the canonical origin. `path` must start with "/". */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}
