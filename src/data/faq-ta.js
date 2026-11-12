/**
 * Native Tamil Q&As (அடிக்கடி கேட்கப்படும் கேள்விகள்), two per page on /, /menu/dosa/,
 * /menu/nellai-meals/ and /corporate-catering-chennai/. Each page appends its
 * array after its English Q&As, so the one-Q&A-per-route and address-once rules
 * (src/lib/answers.js qaRoute) cover them too. Numbers come from the menu and
 * entity-truth.ts; only the Tamil wording is written here.
 *
 * Rules kept in Tamil as in English: lunch and dinner only (never காலை உணவு:
 * "காலை 11 மணி" is the opening time, not a meal); no superlative claims in
 * answers (the question may ask "சிறந்த", the answer states facts); the Latin
 * "Brihadhee" sits beside பிரிஹதீ for entity matching.
 *
 * No imports from catering.js (it imports this file through pages.js and faq.js).
 */
import { getFact, factOr } from "./entity-truth.ts";
import { qa } from "../lib/answers.js";
import { category, allItems, byo, summarise } from "../lib/menu-facts.js";
import verification from "../../config/client-verification.json";

const TA = { lang: "ta" };
const NAME = getFact("nameTamil");
const BR = `${NAME} (Brihadhee)`;
const PV = "100% சுத்த சைவ";
const hours = getFact("hours");
const rs = (n) => `₹${n}`;
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

/* ---- / ------------------------------------------------------------------- */
export const taHome = [
  qa(
    `${NAME} உணவகத்தின் நேரம் என்ன?`,
    `${BR} உணவகம் வாரத்தின் ஏழு நாட்களும் ${OPEN} முதல் ${CLOSE} வரை திறந்திருக்கும், இங்கு மதிய உணவும் இரவு உணவும் மட்டுமே வழங்கப்படுகின்றன. ` +
      `அண்ணா நகர் கிழக்கில் உள்ள இந்த ${PV} உணவகத்தில் ${appsTa} மூலம் மேசையை முன்பதிவு செய்யலாம்.`,
    { ...TA, id: "ta-timings" }
  ),
  qa(
    "அண்ணா நகரில் சிறந்த சைவ உணவகம் எது?",
    `அண்ணா நகரில் சைவ உணவகம் தேடுபவர்களுக்கு, ${BR} ஒரு ${PV} தென்னிந்திய உணவகம்: அதன் சமையலறையில் இறைச்சி, முட்டை, மீன் எதுவும் சமைக்கப்படுவதில்லை, மது பரிமாறப்படுவதில்லை. ` +
      `உங்கள் விருப்பப்படி தோசை, நெல்லை ஸ்பெஷல் சொதி மீல்ஸ் (${rs(sodhi.price)}), பானை பரோட்டா (${rs(paanai.price)}) ஆகியவற்றுக்காக இது அறியப்படுகிறது.`,
    { ...TA, id: "ta-veg-restaurant" }
  ),
];

/* ---- /menu/dosa/ ------------------------------------------------------------ */
export const taDosa = [
  qa(
    "அண்ணா நகரில் உங்கள் விருப்பப்படி தோசை (Build Your Own Dosa) எங்கு கிடைக்கும்?",
    `${BR} அண்ணா நகர் கிழக்கில் உள்ள ${PV} உணவகம்; இங்கே ${batters.length} வகை மாவுகளில் ஒன்றைத் தேர்ந்தெடுத்து, பொடி, ஸ்டஃபிங், நெய், வெண்ணெய் அல்லது எண்ணெய் சேர்த்து உங்கள் விருப்பப்படி தோசையை உருவாக்கலாம். ` +
      `${byo.suggestionCount} செஃப் பரிந்துரை காம்பினேஷன்களும் ${rs(byo.suggestionMin)} முதல் ${rs(byo.suggestionMax)} வரை கிடைக்கின்றன.`,
    { ...TA, id: "ta-byo-dosa" }
  ),
  qa(
    `${NAME}யில் தோசை விலை எவ்வளவு?`,
    `${BR} உணவகத்தில் ${dosa.count} வகை கிளாசிக் தோசைகள் ${rs(dosa.min)} முதல் ${rs(dosa.max)} வரை கிடைக்கின்றன, கல் தோசை முதல் நெய் மசாலா தோசை வரை. ` +
      `அண்ணா நகர் கிழக்கில் உள்ள இந்த ${PV} உணவகத்தில், உங்கள் விருப்பப்படி தோசைக்கான மாவு ${rs(batterR.min)} முதல் ${rs(batterR.max)} வரை; ஒவ்வொரு கூடுதல் பொருளுக்கும் தனி விலை.`,
    { ...TA, id: "ta-dosa-price" }
  ),
];

/* ---- /menu/nellai-meals/ ---------------------------------------------------- */
export const taNellai = [
  qa(
    "அண்ணா நகரில் நெல்லை சொதி மீல்ஸ் எங்கு கிடைக்கும்?",
    `${BR} என்ற ${PV} உணவகத்தில், அண்ணா நகர் கிழக்கில், நெல்லை ஸ்பெஷல் சொதி மீல்ஸ் ${rs(sodhi.price)}-க்கு தினமும் ${OPEN} முதல் மதிய உணவாகக் கிடைக்கும். ` +
      "வாழை இலையில் சாதம், சொதி, சாம்பார், ரசம், கூட்டு, பொரியல், கருப்பட்டி உளுந்தங்களி ஆகியவற்றுடன் இந்த திருநெல்வேலி பாணி மீல்ஸ் பரிமாறப்படுகிறது.",
    { ...TA, id: "ta-nellai-meals" }
  ),
  qa(
    "அண்ணா நகரில் சுத்த சைவ மதிய உணவு எங்கு கிடைக்கும்?",
    `${BR} அண்ணா நகர் கிழக்கில் தினமும் ${OPEN} முதல் ${PV} மதிய உணவு வழங்குகிறது: நெல்லை ஸ்பெஷல் சொதி மீல்ஸ், தமிழ்நாடு மீல்ஸ் (${rs(tnMeals.min)} முதல் ${rs(tnMeals.max)} வரை) ஆகியவை உள்ளன. ` +
      "இந்த மதிய உணவு பாட்டியின் சமையல் முறைப்படி தயாரிக்கப்படும் வீட்டு பாணி தமிழ் உணவு; டைன்-இன் காம்போக்கள் மதிய நேரத்தில் மட்டும் கிடைக்கும்.",
    { ...TA, id: "ta-veg-lunch" }
  ),
];

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
const corporate = verification.offer_catering === true ? factOr("corporateCatering", null) : null;
const corpAreas = factOr("corporateAreas", []);
for (const a of corpAreas) if (!AREAS_TA[a]) throw new Error(`[faq-ta] no Tamil name for corporate area "${a}"`);

export const taCorporate = corporate
  ? [
      qa(
        "சென்னையில் நிறுவனங்களுக்கு சைவ கேட்டரிங் (Corporate Catering) யார் செய்கிறார்கள்?",
        `அண்ணா நகர் கிழக்கில் உள்ள ${PV} உணவகமான ${BR}, சென்னை முழுவதும் நிறுவனங்களுக்கு கேட்டரிங் செய்து, தினமும் ${corporate.dailyCovers.toLocaleString("en-IN")}-க்கும் மேற்பட்டவர்களுக்கு உணவு வழங்குகிறது. ` +
          "தினசரி அலுவலக மதிய உணவு, மொத்த உணவு ஆர்டர்கள், ஊழியர் உணவுத் திட்டங்கள், அலுவலக விழாக்கள் ஆகியவை இதில் அடங்கும்; தொடங்கும் முன் சுவைச் சோதனையும் ஒரு வார சோதனை ஓட்டமும் உண்டு.",
        { ...TA, id: "ta-corporate" }
      ),
      qa(
        `${NAME} எந்தெந்த பகுதிகளில் கார்ப்பரேட் கேட்டரிங் செய்கிறது?`,
        `${BR} அண்ணா நகர் கிழக்கில் உள்ள தனது ${PV} சமையலறையிலிருந்து சென்னையின் ${corpAreas.length} பகுதிகளில் உள்ள அலுவலகங்களுக்கு கார்ப்பரேட் கேட்டரிங் செய்கிறது. ` +
          `அவை: ${corpAreas.map((a) => AREAS_TA[a]).join(", ")}.`,
        { ...TA, id: "ta-corporate-areas" }
      ),
    ]
  : [];
