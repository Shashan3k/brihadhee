/**
 * Native Tamil Q&As (அடிக்கடி கேட்கப்படும் கேள்விகள்) and one Tanglish Q&A, appended
 * after the English Q&As on /, /menu/dosa/, /menu/nellai-meals/,
 * /small-function-catering-chennai/ and /corporate-catering-chennai/, so the
 * one-Q&A-per-route and address-once rules (src/lib/answers.js qaRoute) cover
 * them too. Numbers come from the menu and entity-truth.ts; only the wording is
 * written here.
 *
 * Written the way people in Chennai ask and answer (AEO audit 2026-11-12, 4.6):
 * the first sentence answers the question directly, everyday words such as
 * ஹோட்டல், மீல்ஸ், கேட்டரிங் are kept, and nothing is a word-for-word translation.
 *
 * Rules kept in Tamil as in English: lunch and dinner only (never காலை உணவு:
 * "காலை 11 மணி" is the opening time, not a meal); no superlative claims in
 * answers (the question may ask "சிறந்த", the answer states facts); the Latin
 * "Brihadhee" sits beside பிரிஹதீ for entity matching; "100% சுத்த சைவ" describes
 * the restaurant only, catering is சைவ until the owner answers Q20
 * (config/seo-gates.ts IS_CATERING_PURE_VEG).
 *
 * No imports from catering.js (it imports this file through pages.js and faq.js).
 */
import { getFact, factOr } from "./entity-truth.ts";
import { qa } from "../lib/answers.js";
import { category, allItems, byo, summarise } from "../lib/menu-facts.js";
import { IS_CATERING_PURE_VEG, CATERING_MIN_GUESTS } from "../../config/seo-gates.ts";
import verification from "../../config/client-verification.json";

const TA = { lang: "ta" };
const NAME = getFact("nameTamil");
const BR = `${NAME} (Brihadhee)`;
const PV = "100% சுத்த சைவ";
/** Catering diet in Tamil: சைவ until Q20 is answered. */
const CD_TA = IS_CATERING_PURE_VEG ? "சுத்த சைவ" : "சைவ";
const hours = getFact("hours");
const rs = (n) => `₹${n}`;
const num = (n) => n.toLocaleString("en-IN");
const item = (n) => {
  const hit = allItems.find((i) => i.name === n);
  if (!hit) throw new Error(`[faq-ta] menu item "${n}" missing in menu-canonical.ts`);
  return hit;
};

/** "11:00" -> "காலை 11 மணி", "23:00" -> "இரவு 11 மணி". */
function taClock(t) {
  const [h, m] = t.split(":").map(Number);
  const part = h < 12 ? "காலை" : h < 16 ? "மதியம்" : h < 19 ? "மாலை" : "இரவு";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${part} ${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} மணி`;
}
const OPEN = taClock(hours.opens);
const CLOSE = taClock(hours.closes);

const dosa = category("dosa");
const batters = byo.steps.find((s) => s.name === "Batter").options;
const batterR = summarise(batters);
const sodhi = item("Nellai Special Sodhi Meals");
const paanai = item("Paanai Parotta");
item("Kal Dosa (2 pcs)");
item("Ghee Masala Dosa");
const tnMeals = summarise(category("lunch").items.filter((i) => /TN Meals/.test(i.name)));
const apps = getFact("bookingLinks").map((b) => b.label);
const appsTa = `${apps.slice(0, -1).join(", ")} அல்லது ${apps.at(-1)}`;
const byoR = `${rs(byo.suggestionMin)} முதல் ${rs(byo.suggestionMax)}`;

/* ---- / ------------------------------------------------------------------- */
export const taHome = [
  qa(
    `${NAME} எத்தனை மணிக்கு திறந்திருக்கும்?`,
    `${BR} தினமும் ${OPEN} முதல் ${CLOSE} வரை திறந்திருக்கும்; மதிய உணவும் இரவு உணவும் மட்டுமே கிடைக்கும். ` +
      `அண்ணா நகர் கிழக்கில் உள்ள இந்த உணவகத்தில் ${appsTa} மூலம் மேசையை முன்பதிவு செய்யலாம்.`,
    { ...TA, id: "ta-timings" }
  ),
  qa(
    "அண்ணா நகரில் சிறந்த சைவ ஹோட்டல் எது?",
    `அண்ணா நகர் கிழக்கில் உள்ள ${BR} ஒரு ${PV} தென்னிந்திய ஹோட்டல்: இங்கே இறைச்சி, முட்டை, மீன் எதுவும் சமைப்பதில்லை, மதுவும் கிடையாது. ` +
      `நீங்களே கஸ்டமைஸ் செய்யும் தோசை, நெல்லை ஸ்பெஷல் சொதி மீல்ஸ் (${rs(sodhi.price)}), பானை பரோட்டா (${rs(paanai.price)}) இங்கே தனிச்சிறப்பு.`,
    { ...TA, id: "ta-veg-restaurant" }
  ),
];

/* ---- /menu/dosa/ ------------------------------------------------------------ */
export const taDosa = [
  qa(
    "அண்ணா நகரில் உங்கள் விருப்பப்படி தோசை (Build Your Own Dosa) எங்கு கிடைக்கும்?",
    `அண்ணா நகர் கிழக்கில் உள்ள ${BR} உணவகத்தில் மாவு, பொடி, ஸ்டஃபிங், நெய், வெண்ணெய் அல்லது எண்ணெய் ரோஸ்ட் எல்லாவற்றையும் நீங்களே தேர்ந்தெடுக்கலாம்; சமையலறையில் சுட்டு உங்கள் மேசைக்குக் கொண்டு வருவார்கள். ` +
      `இது நீங்களே சுடும் சுய சேவை கவுண்டர் அல்ல; ${batters.length} வகை மாவு ${rs(batterR.min)} முதல் ${rs(batterR.max)} வரை, ${byo.suggestionCount} செஃப் காம்பினேஷன்கள் ${byoR} வரை.`,
    { ...TA, id: "ta-byo-dosa" }
  ),
  qa(
    `${NAME}யில் தோசை விலை எவ்வளவு?`,
    `${BR} உணவகத்தில் ${dosa.count} கிளாசிக் தோசைகள் ${rs(dosa.min)} முதல் ${rs(dosa.max)} வரை கிடைக்கின்றன, கல் தோசை முதல் நெய் மசாலா தோசை வரை. ` +
      `உங்கள் விருப்பப்படி தோசைக்கு மாவு ${rs(batterR.min)} முதல் ${rs(batterR.max)} வரை; ஒவ்வொரு கூடுதல் பொருளுக்கும் தனி விலை.`,
    { ...TA, id: "ta-dosa-price" }
  ),
  qa(
    "Anna Nagar la dosa customise panna mudiyuma?",
    `Aamaa, Anna Nagar East la irukura Brihadhee la batter, podi, filling, roast ellaam neenga choose pannalaam; kitchen la fresh-aa suttu unga table-ku kondu varuvaanga. ` +
      `Idhu self-service counter illa: ${batters.length} batter ${rs(batterR.min)} to ${rs(batterR.max)}, ${byo.suggestionCount} chef combos ${rs(byo.suggestionMin)} to ${rs(byo.suggestionMax)}.`,
    { lang: "ta-Latn", id: "tanglish-byo-dosa" }
  ),
];

/* ---- /menu/nellai-meals/ ---------------------------------------------------- */
export const taNellai = [
  qa(
    "அண்ணா நகரில் நெல்லை மீல்ஸ் எங்கு கிடைக்கும்?",
    `அண்ணா நகர் கிழக்கில் உள்ள ${BR} உணவகத்தில் நெல்லை ஸ்பெஷல் சொதி மீல்ஸ் ${rs(sodhi.price)}-க்கு தினமும் ${OPEN} முதல் மதிய உணவாகக் கிடைக்கும். ` +
      "வாழை இலையில் சாதம், சொதி, சாம்பார், ரசம், கூட்டு, பொரியல், கருப்பட்டி உளுந்தங்களி என திருநெல்வேலி பாணியில் பரிமாறப்படுகிறது.",
    { ...TA, id: "ta-nellai-meals" }
  ),
  qa(
    "அண்ணா நகரில் சுத்த சைவ மதிய உணவு எங்கு கிடைக்கும்?",
    `${BR}, அண்ணா நகர் கிழக்கில் தினமும் ${OPEN} முதல் ${PV} மதிய உணவு வழங்குகிறது: நெல்லை ஸ்பெஷல் சொதி மீல்ஸ், தமிழ்நாடு மீல்ஸ் (${rs(tnMeals.min)} முதல் ${rs(tnMeals.max)} வரை). ` +
      "பாட்டியின் சமையல் முறையில் செய்யும் வீட்டு பாணி தமிழ் உணவு இது; டைன்-இன் காம்போக்கள் மதிய நேரத்தில் மட்டும்.",
    { ...TA, id: "ta-veg-lunch" }
  ),
];

/* ---- /small-function-catering-chennai/ --------------------------------------- */
const EVENTS_TA = {
  birthday: "பிறந்தநாள்",
  housewarming: "கிரகப்பிரவேசம்",
  baby_shower: "வளைகாப்பு",
  engagement: "நிச்சயதார்த்தம்",
  ear_piercing: "காது குத்து",
  get_together: "குடும்ப ஒன்றுகூடல்",
  wedding: "திருமணம்",
  small_wedding: "சிறிய திருமணம்",
  house_function: "வீட்டு விழா",
  pooja: "பூஜை",
  small_events: "சிறு விழாக்கள்",
};
const cateringOn = verification.offer_catering === true;
const confirmedEvents = cateringOn ? (verification.confirmed_events ?? []) : [];
for (const id of confirmedEvents) if (!EVENTS_TA[id]) throw new Error(`[faq-ta] no Tamil name for catering event "${id}"`);
const smallEventsTa = ["birthday", "housewarming", "baby_shower", "engagement"].filter((id) => confirmedEvents.includes(id)).map((id) => EVENTS_TA[id]);
const evs = cateringOn ? factOr("eventService", null) : null;

export const taSmallFunctions =
  cateringOn && Number.isFinite(verification.max_guests) && smallEventsTa.length && evs
    ? [
        qa(
          "சென்னையில் சிறந்த சைவ கேட்டரிங் எது?",
          `அண்ணா நகர் கிழக்கில் உள்ள ${BR}, சென்னை முழுவதும் ${CATERING_MIN_GUESTS} முதல் ${num(verification.max_guests)} விருந்தினர்கள் வரையிலான விழாக்களுக்கு ${CD_TA} கேட்டரிங் செய்கிறது. ` +
            `${smallEventsTa.join(", ")} போன்ற விழாக்களுக்கு மெனு திட்டமிடல், சமையல், பரிமாறுதல், அமைப்பு எல்லாவற்றையும் ஒரே குழு கவனிக்கிறது; விலை ஒவ்வொரு விழாவுக்கும் தனியாகச் சொல்லப்படும்.`,
          { ...TA, id: "ta-veg-catering" }
        ),
        qa(
          `${CATERING_MIN_GUESTS} பேர் விழாவுக்கு ${NAME} கேட்டரிங் செய்யுமா?`,
          `ஆம், ${BR} குறைந்தபட்சம் ${CATERING_MIN_GUESTS} விருந்தினர்கள் உள்ள விழாக்களுக்கு ${CD_TA} கேட்டரிங் செய்கிறது. ` +
            "விழா வகை, மதியமா இரவா, விருந்தினர் எண்ணிக்கை, கட்டாயம் வேண்டிய உணவுகள் ஆகியவற்றை quote படிவத்தில் அனுப்பினால், குழு உங்களை அழைத்து மெனுவும் ஒரு தட்டுக்கான விலையும் சொல்லும்.",
          { ...TA, id: "ta-catering-50" }
        ),
      ]
    : [];

/* ---- /corporate-catering-chennai/ ------------------------------------------- */
const AREAS_TA = {
  "Anna Nagar": "அண்ணா நகர்",
  "Ambattur Industrial Estate": "அம்பத்தூர் தொழிற்பேட்டை",
  Guindy: "கிண்டி",
  OMR: "ஓஎம்ஆர்",
  Sholinganallur: "சோழிங்கநல்லூர்",
  Siruseri: "சிறுசேரி",
  Perungudi: "பெருங்குடி",
  Taramani: "தரமணி",
  "Tidel Park": "டைடல் பார்க்",
  "Ambit IT Park": "ஆம்பிட் ஐடி பார்க்",
};
const corporate = cateringOn ? factOr("corporateCatering", null) : null;
const corpAreas = factOr("corporateAreas", []);
for (const a of corpAreas) if (!AREAS_TA[a]) throw new Error(`[faq-ta] no Tamil name for corporate area "${a}"`);

export const taCorporate = corporate
  ? [
      qa(
        "சென்னையில் நிறுவனங்களுக்கு சைவ கேட்டரிங் (Corporate Catering) யார் செய்கிறார்கள்?",
        `அண்ணா நகர் கிழக்கில் உள்ள ${BR}, சென்னை முழுவதும் அலுவலகங்களுக்கு ${CD_TA} கேட்டரிங் செய்து, தினமும் ${num(corporate.dailyCovers)}-க்கும் மேற்பட்டவர்களுக்கு உணவு வழங்குகிறது. ` +
          "தினசரி அலுவலக மதிய உணவு, மொத்த ஆர்டர்கள், ஊழியர் உணவுத் திட்டங்கள், அலுவலக விழாக்கள் எல்லாம் உண்டு; தொடங்கும் முன் சுவைச் சோதனையும் ஒரு வார சோதனை ஓட்டமும் நடக்கும்.",
        { ...TA, id: "ta-corporate" }
      ),
      qa(
        `${NAME} எந்தெந்த பகுதிகளில் கார்ப்பரேட் கேட்டரிங் செய்கிறது?`,
        `${BR} அண்ணா நகர் கிழக்கில் உள்ள தனது சமையலறையிலிருந்து சென்னையின் ${corpAreas.length} பகுதிகளில் உள்ள அலுவலகங்களுக்கு கார்ப்பரேட் கேட்டரிங் செய்கிறது. ` +
          `அவை: ${corpAreas.map((a) => AREAS_TA[a]).join(", ")}.`,
        { ...TA, id: "ta-corporate-areas" }
      ),
    ]
  : [];
