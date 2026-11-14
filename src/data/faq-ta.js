/**
 * Tamil Q&As (அடிக்கடி கேட்கப்படும் கேள்விகள்) and Tanglish Q&As, appended
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
item("Paanai Parotta");
item("Kal Dosa (2 pcs)");
item("Ghee Masala Dosa");
const tnMeals = summarise(category("lunch").items.filter((i) => /TN Meals/.test(i.name)));
const apps = getFact("bookingLinks").map((b) => b.label);
const appsTa = `${apps.slice(0, -1).join(", ")} அல்லது ${apps.at(-1)}`;
const gstNote = "இந்த மெனு விலைகளில் GST சேர்க்கப்படவில்லை.";

/* ---- / ------------------------------------------------------------------- */
export const taHome = [
  qa(
    `${NAME} எத்தனை மணிக்குத் திறக்கும்?`,
    `${BR} அண்ணா நகர் கிழக்கில் தினமும் ${OPEN} முதல் ${CLOSE} வரை திறந்திருக்கும். மதிய உணவும் இரவு உணவும் மட்டுமே கிடைக்கும். ` +
      `${appsTa} மூலம் மேசைக்கு முன்பதிவு செய்யலாம்.`,
    { ...TA, id: "ta-timings" }
  ),
  qa(
    "அண்ணா நகரில் சைவ தென்னிந்திய உணவு எங்கு கிடைக்கும்?",
    `அண்ணா நகர் கிழக்கில் உள்ள ${BR} ஒரு ${PV} தென்னிந்திய உணவகம். ` +
      "விருப்பப்படி தேர்வு செய்து ஆர்டர் செய்யும் தோசை, நெல்லை ஸ்பெஷல் சொதி மீல்ஸ், பானை பரோட்டா ஆகியவை இங்குள்ள சிறப்பு உணவுகள்.",
    { ...TA, id: "ta-veg-restaurant" }
  ),
];

/* ---- /menu/dosa/ ------------------------------------------------------------ */
export const taDosa = [
  qa(
    "சென்னையில் என் விருப்பப்படி தோசை ஆர்டர் செய்ய முடியுமா?",
    `ஆம், சென்னை அண்ணா நகர் கிழக்கில் உள்ள ${BR} உணவகத்தில் உங்கள் விருப்பப்படி தோசை ஆர்டர் செய்யலாம். ` +
      "மெனுவிலிருந்து மாவு, பொடி, மேலே சேர்க்கும் பொருட்கள், உள்ளே வைக்கும் பூரணம், சுடுவதற்கு நெய், வெண்ணெய் அல்லது எண்ணெய் ஆகியவற்றைத் தேர்வு செய்யுங்கள். சமையலறையில் தோசையைச் சுட்டு உங்கள் மேசைக்குக் கொண்டு வருவார்கள்.",
    { ...TA, id: "ta-byo-dosa" }
  ),
  qa(
    `${NAME}யில் தோசை விலை எவ்வளவு?`,
    `${BR} மெனுவில் கல் தோசை முதல் நெய் மசாலா தோசை வரை ${dosa.count} வகை தோசைகள் ${rs(dosa.min)} முதல் ${rs(dosa.max)} வரை கிடைக்கும். ` +
      `உங்கள் விருப்பப்படி தோசை ஆர்டர் செய்தால், மாவின் அடிப்படை விலை ${rs(batterR.min)} முதல் ${rs(batterR.max)} வரை. மொத்த விலை நீங்கள் சேர்க்கும் பொருட்களைப் பொறுத்து மாறும். ${gstNote}`,
    { ...TA, id: "ta-dosa-price" }
  ),
  qa(
    "Anna Nagar la dosa customise panna mudiyuma?",
    "Aamaa, Anna Nagar East-la irukkura Brihadhee-la unga viruppappadi dosa order pannalaam. " +
      "Menu-la irundhu maavu, podi, toppings, filling choose pannunga. Ghee, butter illa oil-la roast panna sollalaam. Kitchen-la dosa suttu unga table-kku kondu varuvaanga.",
    { lang: "ta-Latn", id: "tanglish-byo-dosa" }
  ),
];

/* ---- /menu/nellai-meals/ ---------------------------------------------------- */
export const taNellai = [
  qa(
    "அண்ணா நகரில் நெல்லை மீல்ஸ் எங்கு கிடைக்கும்?",
    `அண்ணா நகர் கிழக்கில் உள்ள ${BR} உணவகத்தில் தினமும் ${OPEN} முதல் மதிய உணவாக நெல்லை ஸ்பெஷல் சொதி மீல்ஸ் கிடைக்கும். ` +
      `வாழை இலையில் சாதம், தேங்காய்ப்பால் சொதி, சாம்பார், ரசம், கூட்டு, பொரியல், கருப்பட்டி உளுந்தங்களி உள்ளிட்டவை பரிமாறப்படுகின்றன. மெனு விலை ${rs(sodhi.price)}. ${gstNote}`,
    { ...TA, id: "ta-nellai-meals" }
  ),
  qa(
    "அண்ணா நகரில் சுத்த சைவ மதிய உணவு எங்கு கிடைக்கும்?",
    `${BR} உணவகத்தில் அண்ணா நகர் கிழக்கில் தினமும் ${OPEN} முதல் ${PV} மதிய உணவு கிடைக்கும். ` +
      `நெல்லை ஸ்பெஷல் சொதி மீல்ஸும் தமிழ்நாடு மீல்ஸும் உள்ளன. தமிழ்நாடு மீல்ஸ் விலை ${rs(tnMeals.min)} முதல் ${rs(tnMeals.max)} வரை. ${gstNote} மதிய காம்போக்கள் உணவகத்தில் அமர்ந்து சாப்பிடுபவர்களுக்கு மட்டும்.`,
    { ...TA, id: "ta-veg-lunch" }
  ),
  qa(
    "Nellai meals Chennai-la enga kidaikkum?",
    "Chennai Anna Nagar East-la irukkura Brihadhee-la Nellai Special Sodhi Meals lunch-kku kidaikkum. " +
      "Saadham, thengaai paal sodhi, kootu, poriyal, karuppatti ulundhu kali ellaam vaazhai ilai-la serve pannuvaanga.",
    { lang: "ta-Latn", id: "tanglish-nellai-meals" }
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
          "சென்னை அண்ணா நகரில் சைவ கேட்டரிங் எங்கு கிடைக்கும்?",
          `அண்ணா நகர் கிழக்கில் உள்ள ${BR} சென்னையில் ${CD_TA} விழா கேட்டரிங் வழங்குகிறது. ` +
            `${smallEventsTa.join(", ")} போன்ற விழாக்களுக்கு மெனுவையும் பரிமாறும் ஏற்பாடுகளையும் குழுவுடன் பேசுங்கள். விலையுடன் எந்தெந்த சேவைகள் சேரும் என்பதை உறுதி செய்துகொள்ளுங்கள்.`,
          { ...TA, id: "ta-veg-catering" }
        ),
        qa(
          `${CATERING_MIN_GUESTS} பேர் கலந்துகொள்ளும் விழாவுக்கு ${NAME} கேட்டரிங் செய்யுமா?`,
          `ஆம், ${BR} சென்னையில் ஒரு விழாவுக்கு ${CATERING_MIN_GUESTS} முதல் ${num(verification.max_guests)} விருந்தினர்கள் வரை ${CD_TA} கேட்டரிங் செய்கிறது. ` +
            "விழா வகை, இடம், தோராயமான விருந்தினர் எண்ணிக்கை ஆகியவற்றைப் படிவத்தில் அனுப்புங்கள். தேதி தெரிந்தால் அதையும் சேர்க்கலாம். மெனு, தேவையான சேவைகள், ஒரு தட்டுக்கான விலை ஆகியவற்றைப் பற்றிக் குழுவுடன் பேசலாம்.",
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
        `${NAME} அலுவலகங்களுக்கு எப்படி கேட்டரிங் செய்கிறது?`,
        `${BR} சென்னையில் அலுவலகங்களுக்கு ${CD_TA} மதிய உணவு வழங்குகிறது. தினசரி உணவு வேண்டுமென்றால் அலுவலகப் பகுதி, உணவு எண்ணிக்கை, நாட்கள், நேரம் ஆகியவற்றைத் தெரிவியுங்கள். ` +
          "மெனுவைச் சுவைத்துப் பார்ப்பதற்கும், ஒரு வாரம் உணவு பெற்றுப் பார்ப்பதற்கும் குழுவுடன் பேசலாம். ஒரு நாளுக்குப் பேக் செய்த மதிய உணவு வேண்டுமா அல்லது அலுவலக விழாவில் பரிமாறும் சேவை வேண்டுமா என்பதையும் தெரிவிக்கலாம்.",
        { ...TA, id: "ta-corporate" }
      ),
      qa(
        `${NAME} எந்தெந்த பகுதிகளில் கார்ப்பரேட் கேட்டரிங் செய்கிறது?`,
        `${BR} அண்ணா நகர் கிழக்கில் உள்ள சமையலறையிலிருந்து சென்னையின் ${corpAreas.length} பகுதிகளில் உள்ள அலுவலகங்களுக்கு உணவு வழங்குகிறது. ` +
          `${corpAreas.map((a) => AREAS_TA[a]).join(", ")} ஆகிய பகுதிகள் இதில் அடங்கும்.`,
        { ...TA, id: "ta-corporate-areas" }
      ),
    ]
  : [];
