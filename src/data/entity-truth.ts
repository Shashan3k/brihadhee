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
export interface PriceRange {
  schema: string;
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
const KW = "keyword plan from the Brihadhee team (client W11 to W13), revised 2026-11-11";
const D11 = "2026-11-11";
const CLIENT = "client direction W11 to W13 (SEO_RANKING_STRATEGY.md), 2026-11-11";
const B2B = "corporate and event catering brief confirmed by the Brihadhee team, 2026-11-12 (docs/seo/client-confirmations.md section H)";
const D12 = "2026-11-12";
const LISTINGS = "listing URLs from docs/geo/presence-audit.csv (seen 2026-11-05), confirmed as the restaurant's own profiles by the Brihadhee team, 2026-11-12";
const ZOMATO = "https://www.zomato.com/chennai/brihadhee-anna-nagar-east";
const SWIGGY_DINEOUT = "https://www.swiggy.com/restaurants/brihadhee-anna-nagar-chennai-1150652/dineout";
const EAZYDINER = "https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877";
const DISTRICT = "https://www.district.in/dining/chennai/brihadhee-anna-nagar-east";
const INSTAGRAM = "https://www.instagram.com/brihadhee";
const KW12 = "keyword plan of 12 November 2026 ('keyword (1).md'), with config/seo-gates.ts";
const PHONE_SWITCH = "owner direction 2026-11-12: +91 73587 14113 site-wide; +91 94442 24999 on the catering pages only";
const BLUEPRINT = "on-page SEO blueprint confirmed by the Brihadhee team, 2026-11-11 (docs/seo/client-confirmations.md section G)";

function verified<T>(value: T, source: string = BRIEF, verifiedOn: string = D5): Fact<T> {
  return { value, status: "verified", verifiedOn, source };
}
function unverified<T>(needs: string, probes: RegExp[] = []): Fact<T> {
  return { value: null, status: "unverified", verifiedOn: null, source: null, needs, probes };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* Catering scale (client W13), shared by the brand description, knownFor and the
 * catering facts so the numbers are typed once. */
const CORPORATE_DAILY_MEALS = 1000;
const EVENT_GUESTS = { min: 50, max: 1500 };
const num = (n: number): string => n.toLocaleString("en-IN");
const CORPORATE_SCALE = `${num(CORPORATE_DAILY_MEALS)}+ meals daily`;
const EVENT_SCALE = `${num(EVENT_GUESTS.min)}–${num(EVENT_GUESTS.max)} guests`;

/** Canonical production origin (owner, 2026-11-06). No trailing slash. */
export const SITE_ORIGIN = "https://www.brihadhee.com";
/** Date the site content was last reviewed; used for dateModified and sitemap lastmod. */
export const CONTENT_UPDATED = D12;

export const FACTS = {
  /* ---- Identity ---------------------------------------------------------- */
  name: verified("Brihadhee", "menu PDF, Google and Zomato listings, owner brief"),
  legalName: unverified<string>("registered legal name of the business"),
  nameTamil: verified("பிரிஹதீ", "original brief (Ho.md), owner brief"),
  alternateNames: verified(["Brihadhee Hotels", "Brihadhee Pure Veg Restaurant"]),
  subBrand: verified({ name: "Beyond Curry by Brihadhee", description: "North Indian meal boxes" }),
  type: verified("pure vegetarian restaurant"),
  /** Catering says "vegetarian" until the owner answers Q20 (config/seo-gates.ts IS_CATERING_PURE_VEG). */
  typeLong: verified("100% pure vegetarian South Indian restaurant and vegetarian caterer", KW12, D12),
  /** Core brand description, led by the client's pillars (W11 to W13). `short` is the
   *  default meta description, the Restaurant schema description and the footer line,
   *  so it stays within 160 characters; `long` leads the About section. */
  brandDescription: verified(
    {
      short:
        "Brihadhee: 100% pure veg South Indian restaurant in Anna Nagar East, Chennai, for build-your-own dosa, Nellai sodhi meals, Paanai Parotta and catering.",
      long:
        "Brihadhee is a 100% pure vegetarian South Indian restaurant in Anna Nagar East, Chennai, known for build-your-own dosa, " +
        "Nellai Special Sodhi Meals, Paanai Parotta, Veg Kothu Parotta, Karaikudi Paneer Poppers and filter coffee, served for lunch and dinner. " +
        `The same kitchen runs vegetarian corporate catering for ${num(CORPORATE_DAILY_MEALS)}+ meals a day and end-to-end vegetarian event catering ` +
        `for ${num(EVENT_GUESTS.min)} to ${num(EVENT_GUESTS.max)} guests.`,
    },
    CLIENT,
    D11
  ),
  dietary: verified("100% pure vegetarian", "owner brief; menu PDF lists no meat, egg or fish"),
  cuisine: verified(
    "100% pure vegetarian: South Indian with Tirunelveli (Nellai) and Karaikudi specialties, plus North Indian and Indo-Chinese"
  ),
  /** Lead cuisines from the 12 Nov keyword plan (section 5.1), then the rest of the menu. */
  cuisines: verified(["South Indian", "Tamil Vegetarian", "Tirunelveli (Nellai)", "Karaikudi", "North Indian", "Indo-Chinese"], KW12, D12),
  founders: verified({
    names: ["Rakesh", "Eashwer"],
    story:
      "Brihadhee was founded by Rakesh and Eashwer, an auditor and a lawyer by profession, out of a shared passion for authentic regional Tamil vegetarian food.",
  }),
  /** Recipe story (client confirmed; also the Instagram bio, Key.md). */
  recipeStory: verified("Tamil home-style food cooked from grandma's recipes", BLUEPRINT, D11),
  /** Name story (client confirmed). Always say the restaurant is not affiliated with the temple. */
  nameStory: verified(
    "The name Brihadhee is a tribute to the Brihadeeswarar Temple in Thanjavur and its Chola architecture. Brihadhee is a restaurant and is not affiliated with the temple.",
    BLUEPRINT,
    D11
  ),

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
  /** Neighbourhoods diners come from (Restaurant areaServed). Shanthi Colony and Aminjikarai border Anna Nagar East (keyword plan 3.10). */
  nearbyAreas: verified(
    ["Anna Nagar East", "Anna Nagar West", "Shanthi Colony", "Thirumangalam", "Shenoy Nagar", "Kilpauk", "Aminjikarai", "Mogappair"],
    KW12,
    D12
  ),
  /** Landmarks guests navigate from. Directions are Google Maps links from each one;
   *  no distance or travel time is stated (none is verified). */
  directionLandmarks: verified(
    [
      { label: "Anna Nagar Tower Park", query: "Anna Nagar Tower Park, Chennai" },
      { label: "Anna Nagar East Metro", query: "Anna Nagar East Metro Station, Chennai" },
      { label: "Roundana", query: "Anna Nagar Roundana, Chennai" },
      { label: "VR Mall", query: "VR Chennai mall, Anna Nagar" },
      { label: "Shanthi Colony", query: "Shanthi Colony, Anna Nagar, Chennai" },
      { label: "Thirumangalam", query: "Thirumangalam, Chennai" },
    ],
    BLUEPRINT,
    D11
  ),
  geo: verified<Geo>({ latitude: 13.0879662, longitude: 80.2178222 }, "Google Maps place URL (docs/geo/presence-audit.csv)", D6),
  mapUrl: verified(
    "https://www.google.com/maps/place/BRIHADHEE/@13.0879662,80.2178222,17z/data=!4m6!3m5!1s0x3a5265ec5076e09b:0xa0425a2bd8cf093c!8m2!3d13.0879662!4d80.2178222!16s%2Fg%2F11x16tzgsf",
    "Google Maps place URL (docs/geo/presence-audit.csv)",
    D6
  ),

  /* ---- Contact ----------------------------------------------------------- */
  /** Restaurant number on every page (owner direction 2026-11-12; it is also the Google profile number).
   *  The catering pages keep +91 94442 24999: config/client-verification.json enquiry_channels. */
  phone: verified("+91 73587 14113", PHONE_SWITCH, D12),
  whatsapp: verified("+91 73587 14113", PHONE_SWITCH, D12),
  email: verified("brihadhee@gmail.com", "repo since the first commit (owner to reconfirm)"),

  /* ---- Service ----------------------------------------------------------- */
  /* Client direction (W11, 2026-11-11): open 11 AM to 11 PM, lunch and dinner only.
   * The 6:30 AM opening and breakfast are retired (see RETIRED_TERMS). Open every day,
   * Monday to Sunday (client confirmed with the on-page blueprint, 2026-11-11), so
   * `days` drives the hours tables and openingHoursSpecification. */
  hours: verified<Hours>(
    {
      timeZone: "Asia/Kolkata",
      summary: "Open daily, 11:00 AM to 11:00 PM",
      short: "11:00 AM to 11:00 PM",
      opens: "11:00",
      closes: "23:00",
      days: DAYS.map((day) => ({ day, open: "11:00", close: "23:00" })),
    },
    BLUEPRINT,
    D11
  ),
  openDays: verified<string[]>(DAYS, BLUEPRINT, D11),
  lastOrderTime: unverified<string>("the last-order time before the 11 PM close", [/\blast orders?\s+(?:is|are|at|by|until)\s+\d/i]),
  mealTimes: verified("lunch and dinner", CLIENT, D11),
  dineIn: verified(true),
  familyFriendly: verified(true, "owner brief; Google profile notes (Ho.md)"),
  alcohol: verified("not served", "owner brief; reservation listing (Ho.md)"),
  acceptsReservations: verified({ value: true, how: "pre-booking through Swiggy Dineout, EazyDiner and District" }),
  /** Booking pages confirmed for linking. Swiggy Dineout and District URLs are not confirmed yet (named, not linked). */
  bookingLinks: verified(
    [
      { label: "Swiggy Dineout", url: SWIGGY_DINEOUT },
      { label: "EazyDiner", url: EAZYDINER },
      { label: "District", url: DISTRICT },
    ],
    LISTINGS,
    D12
  ),
  priceRange: verified({ schema: "₹₹" }, "owner brief; Zomato, District and EazyDiner list about ₹200 for two"),
  offers: verified<Offer[]>(
    [
      { id: "walk-in", name: "Walk-in dine-in discount", description: "10% off for walk-in dine-in" },
      {
        id: "pre-booking",
        name: "Pre-booking dine-in discount",
        description: "up to 40% off Monday to Thursday when you pre-book a table through Swiggy Dineout, EazyDiner or District",
      },
    ],
    "owner brief 2026-11-05; Mini Tiffin and budget tiffin retired by client direction 2026-11-11 (offers change; re-check monthly)",
    D11
  ),
  /** Client pillars in order (W11 to W13, docs/seo/client-confirmations.md section F3). */
  knownFor: verified(
    [
      "Build-Your-Own Dosa",
      "Nellai Special Sodhi Meals",
      "Paanai Parotta",
      "Karaikudi Paneer Poppers",
      "Filter Coffee",
      `Vegetarian Corporate Catering (${CORPORATE_SCALE})`,
      `End-to-End Vegetarian Event Catering (${EVENT_SCALE})`,
    ],
    CLIENT,
    D11
  ),
  customizableDosas: verified(true),

  /* ---- Catering ---------------------------------------------------------- */
  catering: verified<Catering>({
    guests: EVENT_GUESTS,
    area: "Chennai",
    liveCounters: ["Build Your Own Dosa", "Paanai Parotta", "Nellai Sodhi", "Karaikudi Paneer Poppers"],
    plannerModels: ["white-label live counters", "co-branded live counters"],
    pricing: "per-plate pricing, quoted for each menu",
  }),
  /** End-to-end event service (client W13): menu planning, cooking, service and setup. */
  eventService: verified("end-to-end service: menu planning, cooking, serving and setup", KW, D11),
  /** Corporate catering (client W13). Client names and headcounts need the client's permission. */
  corporateCatering: verified({ dailyCovers: CORPORATE_DAILY_MEALS, description: "daily corporate and office catering" }, KW, D11),
  corporateClients: unverified<string[]>("permission to name corporate clients and show their headcounts"),
  /** Corporate service areas (client confirmed). One "Areas we serve" section, never doorway pages. */
  corporateAreas: verified(
    ["Anna Nagar", "Ambattur Industrial Estate", "Guindy", "OMR", "Sholinganallur", "Siruseri", "Perungudi", "Taramani", "Tidel Park", "Ambit IT Park"],
    B2B,
    D12
  ),
  /** Corporate services (client confirmed). */
  corporateServices: verified(["daily office lunch supply", "bulk lunch catering", "employee meal programmes", "office parties and corporate events"], B2B, D12),
  /** How a corporate account starts (client confirmed). */
  corporateProcess: verified(
    [
      { title: "Enquiry and Headcount", text: "Tell us your office location, daily headcount, meal times, any dietary needs and when you want to start. Use the quote form, call or WhatsApp; the team calls you back to understand how your office eats." },
      { title: "Kitchen Tasting at Anna Nagar", text: "Your admin or HR team tastes the proposed menu at the Brihadhee kitchen in Anna Nagar East and sees where the food is cooked, before anything reaches your office." },
      { title: "Trial Week", text: "A one-week trial at your office, so your team can rate the food, the portions and the delivery timing before you commit. Feedback from the trial shapes the final menu." },
      { title: "Daily Rollout and Menu Rotation", text: "Daily service begins on a rotating menu, so your team does not eat the same lunch every day, with special days such as Nellai Special Sodhi Meals built into the cycle." },
    ],
    B2B,
    D12
  ),
  /** Food safety and punctuality (client confirmed). The licence number itself is pending (fssaiLicence). */
  foodSafety: verified(
    {
      licensed: true,
      points: [
        "Cooked in Brihadhee's FSSAI-licensed restaurant kitchen in Anna Nagar East",
        "100% pure vegetarian: no meat, egg or fish is cooked in the kitchen",
        "Packed in the kitchen for delivery to your office",
        "Delivered to an agreed time slot for each office",
      ],
    },
    B2B,
    D12
  ),
  fssaiLicence: unverified<string>("the 14-digit FSSAI licence number", [/\bFSSAI\s*(?:licen[cs]e)?\s*(?:no\.?|number|#)?\s*:?\s*\d{14}\b/i]),

  /* ---- Unverified: null until the owner confirms ------------------------- */
  /** Owner-supplied profiles only. Add Google Business Profile, Swiggy, Zomato, District,
   *  Justdial, Apple Maps and Bing Places URLs once the owner confirms each is theirs. */
  sameAs: verified<string[]>(
    [
      INSTAGRAM,
      "https://www.google.com/maps/place/BRIHADHEE/@13.0879662,80.2178222,17z/data=!4m6!3m5!1s0x3a5265ec5076e09b:0xa0425a2bd8cf093c!8m2!3d13.0879662!4d80.2178222!16s%2Fg%2F11x16tzgsf",
      ZOMATO,
      SWIGGY_DINEOUT,
      EAZYDINER,
      DISTRICT,
    ],
    LISTINGS,
    D12
  ),
  /* ---- Seasonal (Karthigai / Ayyappa mala): pending until the client confirms --- */
  noOnionGarlic: unverified<boolean>(
    "whether the kitchen cooks without onion and garlic on request (for Ayyappa mala devotees), at the restaurant and for catering",
    [/\b(?:no[- ]onion[,\s-]*(?:no[- ])?garlic|without onion(?: and| or|,)? garlic|onion[- ]and[- ]garlic[- ]free|jain food)\b/i]
  ),
  poojaCatering: unverified<boolean>(
    "whether Brihadhee caters Ayyappa poojas, bhajans and devotee groups (add \"pooja\" to confirmed_events)",
    [/\bpooja catering\b|\bcater(?:s|ing)?\s+(?:an?\s+|your\s+)?(?:ayyappa\s+)?(?:pooja|bhajan)s?\b/i]
  ),
  karthigaiSpecial: unverified<{ name: string; detail: string }>(
    "a Karthigai seasonal menu or offer: dish names, prices and dates",
    [/\bkarthigai\s+(?:special|menu|offer|thali)s?\b/i]
  ),
  /** Probes catch a parking claim, not the word: /faq/ says parking details are not published and to call. */
  parking: unverified<string>("whether parking is available, and where", [
    /\b(?:free|ample|valet|easy|dedicated|private|on[\s-]?site|own|with|has)\s+(?:car\s+|bike\s+|two[\s-]wheeler\s+)?parking\b/i,
    /\bparking\s+(?:is\s+|are\s+)?(?:available|provided|facility|facilities|spaces?|lot|area)\b/i,
  ]),
  googleRating: unverified<{ value: number; count: number; checkedOn: string }>(
    "current Google rating and review count from the verified Business Profile, with the date checked",
    [/\b857\b/, /\b4\.2\s*(?:★|stars?|\/\s*5|out of 5)/i, /google\s+(?:rating|reviews?)/i]
  ),
  lateNight: unverified<string>(
    "the late-night dining offer: the brief says 'up to 6:00 AM' but the restaurant closes at 11:00 PM",
    [/\b6(?::00)?\s*a\.?m\.?\b(?!\s*(?:to|–|-))/i, /late[- ]night/i]
  ),
  dosaVarietyCount500: unverified<number>("the '500+ dosa varieties' claim; the menu lists 11 dosa items", [/\b500\s*\+?\s*(?:varieties|types|kinds)/i]),
  costForTwo: unverified<string>(
    "the cost for two: listings disagree (Swiggy Dineout ₹800; Zomato, District and EazyDiner ₹200)",
    [/\bfor two\b/i]
  ),
};

export type FactKey = keyof typeof FACTS;

/**
 * Positioning the client has ruled out (W11 to W13, 2026-11-11). These words must not
 * appear in any title, heading, meta description, copy, schema, menu.json or llms file.
 * scripts/check-facts.mjs fails the build if one slips into public output.
 * Mirrors the hard-block section of docs/seo/avoid-terms.txt (read by aeo-lint.mjs).
 */
export const RETIRED_TERMS: { re: RegExp; why: string }[] = [
  { re: /\bbreakfasts?\b|காலை\s*உணவு/i, why: "breakfast service is retired" },
  { re: /\btiffins?\b|டிபன்/i, why: "tiffin and Mini Tiffin positioning is retired" },
  { re: /\b500[\s-]*\+?[\s-]*(?:dosa[\s-]+)?(?:varieties|types|kinds)\b/i, why: "'500 varieties' is not a client claim" },
  { re: /\b(?:cheap(?:er|est|ly)?|budget|pocket[\s-]*friendly|wallet[\s-]*friendly)\b/i, why: "price-led positioning is ruled out" },
  { re: /\bunder[\s-]*(?:₹|rs\.?|inr)[\s-]*(?:100|150|300)\b/i, why: "price-led positioning is ruled out" },
  { re: /\bvalue[\s-]+combos?\b/i, why: "price-led positioning is ruled out" },
  { re: /\b0?6[:.]30\s*a\.?m\b|\b06[:.]30\b/i, why: "the 6:30 AM opening is retired (open 11 AM to 11 PM)" },
];

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

/** "2026-11-12" -> "November 2026". */
export function monthYear(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** "2026-11-12" -> "12 November 2026". */
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "23:00" -> "11 PM", "11:30" -> "11:30 AM". */
export function clock(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h >= 12 ? "PM" : "AM"}`;
}

/** Opening and closing time from the verified hours: { open: "11 AM", close: "11 PM", range: "11 AM to 11 PM" }. */
export function openingTimes(): { open: string; close: string; range: string } {
  const h = getFact("hours");
  const open = clock(h.opens);
  const close = clock(h.closes);
  return { open, close, range: `${open} to ${close}` };
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
