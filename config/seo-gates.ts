/**
 * SEO client-verification gates (keyword plan of 12 November 2026, section 8).
 *
 * Content in the 12 November keyword plan that makes a kitchen, dietary or
 * operational claim stays OFF until the owner answers the matching question in
 * writing. Each flag below names its question. To turn one on:
 *   1. get the owner's written answer,
 *   2. flip the flag (and fill the list or value next to it),
 *   3. record it in docs/seo/client-confirmations.md,
 *   4. run `npm run build`: scripts/verify-seo-compliance.ts fails the build if a
 *      flag is on without the facts it needs, or off while its claim is published.
 *
 * Read by the pages (src/data/spokes.js, src/data/catering.js, src/data/pages.js),
 * the sitemap, llms.txt, the nav, and the checks in scripts/. Plain TypeScript with
 * erasable syntax only, so Node can import it directly (type stripping) and
 * Astro/Vite can bundle it. No imports: this file is the root of the gate graph.
 */

/* ---- Dietary and positioning -------------------------------------------- */

/** The restaurant is 100% pure vegetarian (owner brief; menu lists no meat, egg or fish). */
export const IS_RESTAURANT_PURE_VEG = true;

/**
 * Q20: may catering copy say "pure veg"? The Wf call says one non-veg item could be
 * arranged from elsewhere for a very large order, so catering copy says
 * "vegetarian catering" until the owner confirms. The kitchen itself stays a
 * "100% pure vegetarian kitchen" (that is a verified fact about the kitchen).
 */
export const IS_CATERING_PURE_VEG = false;

/** Q11 to Q14: the no-onion-no-garlic page, its FAQ and nav link (keyword plan 3.15a, 3.15c, 3.15d, 3.16, 4.8). */
export const ENABLE_NO_ONION_NO_GARLIC_CLUSTER = false;
/**
 * Q12: dishes the kitchen confirms it can make without onion and garlic, dish by dish
 * (including podi, sambar powder, tadka, shared tawa and ghee). Must be non-empty
 * before ENABLE_NO_ONION_NO_GARLIC_CLUSTER is turned on.
 */
export const NO_ONION_NO_GARLIC_DISHES: readonly string[] = [];
/** Q12: "on request" or "always available". Leave null until confirmed. */
export const NO_ONION_NO_GARLIC_AVAILABILITY: "on request" | "always available" | null = null;

/**
 * Q13 and Q14: Jain-friendly wording (keyword plan 3.15b). Never "pure Jain",
 * "100% Jain", "strictly Jain" or "Jain certified" (section 7), even when on.
 * Needs ENABLE_NO_ONION_NO_GARLIC_CLUSTER.
 */
export const ENABLE_JAIN_FRIENDLY_CLAIMS = false;

/** Q17: Hindi (Hinglish and Devanagari) copy on the website. Tamil is already approved. */
export const ENABLE_HINDI_COPY = false;

/**
 * Q23: Brahmin-style religious functions (upanayanam, seemantham, annadanam, homam;
 * keyword plan 3.18). Until then baby showers are called "valaikaapu", the general
 * Tamil term, and none of these words appear on the site.
 */
export const ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS = false;

/** Q22: may the site call Brihadhee "premium"? */
export const ENABLE_PREMIUM_WORDING = false;

/* ---- Catering enquiry ---------------------------------------------------- */

/**
 * Q19: the quote form sends a formatted WhatsApp message to the office. Until the
 * office WhatsApp number is confirmed, the quote builder posts to /api/lead (emailed
 * to the team), and the page offers call and the restaurant's own WhatsApp instead.
 */
export const ENABLE_LIVE_WHATSAPP_QUOTE_FORM = false;
/** Q19: the office WhatsApp number that receives quotes, e.g. "+91 9xxxx xxxxx". */
export const QUOTE_WHATSAPP_NUMBER: string | null = null;

/** Hard floor (client, Wf call). Never mention a catering headcount under this. */
export const CATERING_MIN_GUESTS = 50;

/** Corporate catering scale (client W13). Must match entity-truth.ts corporateCatering. */
export const CORPORATE_DAILY_SCALE = "1,000+ people served every day";
export const CORPORATE_DAILY_COVERS = 1000;

/* ---- Restaurant ------------------------------------------------------------ */

/** Confirmed hours (client W11). Must match entity-truth.ts hours (11:00 to 23:00). */
export const CONFIRMED_HOURS = "11:00 AM – 11:00 PM";
export const CONFIRMED_OPENS = "11:00";
export const CONFIRMED_CLOSES = "23:00";
/** Meal framing used on the home page and in llms.txt. */
export const MEAL_FRAMING = "Lunch & Dinner Only";

/**
 * Q24: name a nearby temple on the family dining page. Until confirmed, the page says
 * "after a morning temple visit" and names no temple, distance or temple timing.
 */
export const ENABLE_NAMED_TEMPLE = false;
export const NEARBY_TEMPLE: { name: string; where: string } | null = null;

/* ---- The one permitted mention of a retired service ----------------------- */

/**
 * Keyword plan 4.2 and 4.7: one FAQ answers "Does Brihadhee serve breakfast?" with
 * "No ... lunch and dinner only", to correct listings that still show a morning
 * opening. This exact question is the ONLY place the word may appear; the answer
 * itself never repeats it. The checks (check-facts, aeo-lint, verify-seo-compliance)
 * remove exactly this string before scanning, nothing else.
 */
export const NEGATIVE_FAQ_QUESTION = "Does Brihadhee serve breakfast?";
/** Anchor id for that FAQ item (the default id would put the word into a URL fragment). */
export const NEGATIVE_FAQ_ID = "meal-times";

/** Remove the permitted negative FAQ question from text before a retired-term scan. */
export function stripPermittedNegatives(text: string): string {
  return text.split(NEGATIVE_FAQ_QUESTION).join(" ");
}

/* ---- Summary ------------------------------------------------------------------ */

/**
 * Gate -> owner question, printed by scripts/verify-seo-compliance.ts.
 * Gated pages render in `astro dev`, or in a build with SEO_GATES_PREVIEW=1, as
 * noindex drafts with a banner, so the owner can review the copy before answering.
 * A normal production build never contains them while their gate is off.
 */
export const GATE_SUMMARY = {
  IS_CATERING_PURE_VEG: "Q20",
  ENABLE_NO_ONION_NO_GARLIC_CLUSTER: "Q11-Q14",
  ENABLE_JAIN_FRIENDLY_CLAIMS: "Q13-Q14",
  ENABLE_HINDI_COPY: "Q17",
  ENABLE_LIVE_WHATSAPP_QUOTE_FORM: "Q19",
  ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS: "Q23",
  ENABLE_PREMIUM_WORDING: "Q22",
  ENABLE_NAMED_TEMPLE: "Q24",
} as const;

/** "vegetarian" until Q20 is answered, then "pure vegetarian". */
export const CATERING_DIET = IS_CATERING_PURE_VEG ? "pure vegetarian" : "vegetarian";
