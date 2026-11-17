# Owner questions and blocked items

Anything blocked goes here. Do not publish a gated item until the owner answers. Record each answer with the date and who gave it, then copy it into `docs/seo/client-confirmations.md`.

## A. Workflow blockers

| # | Opened | Step | Question or blocker | Needed from | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-11-16 | 00 | The ranking tracker `.xlsx` is not at `docs/seo/Brihadhee_SEO_AEO_Ranking_Tracker.xlsx`. A copy exists in `outputs/01a1e316-a4d5-7e91-98d3-6eba7dab1c9c/`. Is that copy current, and should it be moved to `docs/seo/`? | Owner | Open |
| 2 | 2026-11-16 | 00 | `keyword-tracker.csv` has 845 rows, while the workbook counts 242 mapped AEO prompts and about 546 SEO rows. Which file is the source of truth for new rows? **Update 01:** 546 SEO plus 299 AEO rows = 845, and every ID matches one-to-one with identical keyword, status, target and priority. 242 is the AEO rows that have a target page. Remaining question: which file gets edited first. | Owner | Open |
| 3 | 2026-11-16 | 00 | The CSV uses an `ANSWERED` status (171 rows) that the ground rules don't define, and has no `HOLD` status. **Update 01:** `HOLD` is used as a *priority* on 235 gated rows. Until told otherwise, treat `ANSWERED` as measure-only (the page already answers it) and priority `HOLD` as "never published until approved". | Owner | Open |
| 4 | 2026-11-16 | 01 | Search Console and Bing Webmaster Tools access. Needed for URL Inspection, the Google-selected canonical and query data, which are the main evidence for audit finding 1. | Owner or developer | Open |

## B. Owner approval pack (send on WhatsApp)

All 251 gated rows are covered: 191 OWNER_CONFIRMATION and 60 APPROVAL_GATED, of which 235 carry priority `HOLD`. They're grouped into 25 yes/no questions, and each row is in exactly one question. Q11–Q14, Q16, Q17, Q19 and Q21–Q24 keep the meaning they already have in the tracker and `config/seo-gates.ts`. Q25–Q38 are new.

"If yes, we publish" is the exact draft wording. Text in [brackets] must come from the owner's reply. Nothing goes live on a "no", and the related rows stay blocked or move to EXCLUDED.

### Message to copy

> Hi, quick yes/no questions for the website. Reply with the number and Yes/No (add a note where asked). Nothing goes live until you say yes.
> **Q11** Can the kitchen make some dishes without onion and garlic when a diner asks?
> **Q12** Can these be made without onion and garlic on request: plain dosa, ghee dosa, idli, idiyappam, coconut chutney, sambar? (Name any that cannot. Is a cleaned tawa used?)
> **Q13** May we call those dishes "Jain-friendly on request"? (Never "pure Jain".)
> **Q14** For Jain orders, can the kitchen also leave out root vegetables (potato, carrot, beetroot, radish)? May we say Jain and Marwari families can order this way?
> **Q16** Can catering offer a no onion no garlic menu, or a Jain menu, for weddings, functions and office lunches?
> **Q17** May we add a few Hindi or Hinglish lines to the website?
> **Q19** Do you accept catering enquiries on WhatsApp? Which number?
> **Q21** Is about ₹200–₹400 per person a fair typical spend for lunch or dinner?
> **Q22** May we describe Brihadhee as "premium"?
> **Q23** Do you cater Brahmin-style functions (seemantham, upanayanam, annadanam, homam)? May we name them? May we use the words "Brahmin", "Iyer" or "Iyengar"?
> **Q24** Is Brihadhee within a 10-minute walk of the Anna Nagar Ayyappan temple, and may we mention it?
> **Q25** Do you currently do delivery or takeaway through Swiggy or Zomato, and may we link them?
> **Q26** Is "Beyond Curry by Brihadhee" your own North Indian meal-box brand from the same kitchen, and should the website keep mentioning it?
> **Q27** Is there parking for cars or two-wheelers? (Say where.)
> **Q28** Should the Karthigai / Ayyappa mala page stay on the website? Do you run any special festival or fasting menu (Purattasi, Navaratri, Ekadashi, Chaturmas, Paryushan, Kartik Purnima)?
> **Q29** Can you cater a single event of 2,000 guests?
> **Q30** Do you cater banana-leaf service, outdoor venues, poojas and festivals, kitty parties and anniversaries?
> **Q31** Do you send serving staff with event catering?
> **Q32** Is 7 days' notice enough for 50 guests, and 30 days for a wedding? (Correct the numbers if not.)
> **Q33** Can a group of 10–15 sit together if they call ahead?
> **Q34** May we use the word "satvik" for dishes made without onion and garlic?
> **Q35** May we mention that diners come from Koyambedu, Arumbakkam, Villivakkam, Anna Nagar West Extension and near Anna Nagar Tower metro?
> **Q36** May we mention your Google rating? Please send a screenshot of the Google profile showing today's rating and review count.
> **Q37** May we publish one sample wedding menu (dishes only, no prices) from a past event?
> **Q38** Do you serve chapati with kurma? (The menu lists Chapathi Salna.)

### Detail: wording, rows unblocked and pages

| Q | If yes, we publish (draft) | Rows unblocked | Page that changes |
|---|---|---|---|
| Q11 | "Brihadhee can prepare selected dishes without onion or garlic on request. Ask staff which ones when you order, because some podis, chutneys and gravies contain them." | 37: SEO-344, 345, 347–361, 363–367, 419–421, 424, 425, 441; AI-190, 196, 204, 229, 239, 241, 265, 290, 293 | New no-onion-no-garlic page (`NoOnionNoGarlicPage.astro`, gate `ENABLE_NO_ONION_NO_GARLIC_CLUSTER`), `/menu/` FAQ, `/family-dining-anna-nagar/` |
| Q12 | "Made without onion or garlic on request: [plain dosa, ghee dosa, idli, idiyappam, coconut chutney, sambar]. Tell staff when you order." | 27: SEO-346, 362, 399, 400, R01–R03, R05–R12; AI-191, 197, 207, 208, 210–212, 214, 223, 231, 267, 268 | `/menu/dosa/` FAQ, `/menu/`, `/menu/nellai-meals/`, `config/seo-gates.ts` `NO_ONION_NO_GARLIC_DISHES` |
| Q13 | "Jain-friendly on request: [Q12 dishes], made without onion, garlic or root vegetables." (Needs Q11, Q12 and Q14 yes.) | 42: SEO-368–384, 423, 440, 442, R04; AI-192, 198–200, 202, 205, 206, 209, 213, 215, 218–221, 230, 232, 240, 242, 266, 291, 292 | No-onion-no-garlic page Jain section (`ENABLE_JAIN_FRIENDLY_CLAIMS`), `/family-dining-anna-nagar/` |
| Q14 | "For Jain orders the kitchen leaves out root vegetables. Jain and Marwari families can ask for these dishes when ordering." | 10: SEO-431–434, 436–439; AI-203, 269 | `/family-dining-anna-nagar/`, no-onion-no-garlic page |
| Q16 | "Brihadhee can plan a pure vegetarian catering menu without onion and garlic, or a Jain menu without root vegetables, for weddings, functions and office meals. Mention it when you ask for a quote." | 28: SEO-445–461, 465–467, 473, 474; AI-216, 224, 225, 227, 270, 294 | `/catering-services-chennai/`, `/small-function-catering-chennai/`, `/corporate-catering-chennai/` |
| Q17 | "Anna Nagar mein shuddh shakahari South Indian khana: Brihadhee, 3rd Avenue, W-Block. Roz 11 AM se 11 PM." (A short block, not a full Hindi page.) | 28: SEO-401–418, 435, 468–470; AI-233–238 | `/` and `/family-dining-anna-nagar/` FAQ block (`ENABLE_HINDI_COPY`) |
| Q19 | "Send your catering enquiry on WhatsApp to [number]." | 1: SEO-254 | `/catering-quote-chennai/` (`ENABLE_LIVE_WHATSAPP_QUOTE_FORM`, `QUOTE_WHATSAPP_NUMBER`) |
| Q21 | "Most diners spend about ₹[200]–₹[400] per person. Dine-in combos cost ₹129 to ₹199." (Restaurant only. No catering rates.) | 3: SEO-507; AI-042, 081 | `/menu/` FAQ |
| Q22 | "A premium pure veg South Indian restaurant in Anna Nagar East." | 4: SEO-508–510; AI-275 | `/family-dining-anna-nagar/` (`ENABLE_PREMIUM_WORDING`) |
| Q23 | "Pure vegetarian catering for seemantham, upanayanam, annadanam and homam." Community words only if explicitly approved. | 4: SEO-493–496 | `/catering-services-chennai/` (`ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS`) |
| Q24 | "About a [10]-minute walk from the Anna Nagar Ayyappan temple. Brihadhee opens at 11 AM." | 1: SEO-488 | `/family-dining-anna-nagar/` (`ENABLE_NAMED_TEMPLE`) |
| Q25 | "Order Brihadhee for delivery or takeaway on [Swiggy] and [Zomato]." | 10: SEO-019–021, 141–145; AI-040, 139 | `/`, `/faq/`, `/menu/` |
| Q26 | Yes: keep "Beyond Curry by Brihadhee is Brihadhee's brand for North Indian meal boxes." No: remove it from Restaurant `brand` and the home FAQ. | 1: SEO-023. Also decides the live schema in `src/lib/schema.js` / `entity-truth.ts` `subBrand` | `/` FAQ, JSON-LD on all pages |
| Q28 | Keep: the current Karthigai page. Festival menu: "[Festival] menu at Brihadhee, [dates]: [dishes]." No: unpublish the seasonal page. | 11: SEO-338, 339, 471, 472, 477–483 | `/seasonal/karthigai-ayyappa-pure-veg/`, new seasonal pages |
| Q27 | "Parking: [as described by the owner]." | 4: SEO-148; AI-039, 141, 175 | `/about/#find-us`, `/faq/` |
| Q29 | "Catering for 50 to 2,000 guests at a single event." | 2: SEO-244, R13 | `/catering-services-chennai/`, `config/seo-gates.ts` |
| Q30 | "Catering for banana-leaf meals, outdoor venues, poojas, festivals, kitty parties and anniversaries." | 8: SEO-209, 213–215, 238–240, 342 | `/catering-services-chennai/`, `/small-function-catering-chennai/#occasions` |
| Q31 | "Serving staff can be included. The quote lists how many staff and for how long." | 1: AI-248 (P1) | `/catering-quote-chennai/` |
| Q32 | "Book at least [7] days ahead for 50 guests and [30] days ahead for a wedding. Larger dates fill first." | 2: AI-165, 250 (both P1) | `/catering-services-chennai/`, `/small-function-catering-chennai/` FAQ |
| Q33 | "Groups of up to [15] can sit together. Call +91 73587 14113 to reserve." | 3: SEO-490; AI-133, 285 | `/family-dining-anna-nagar/`, `/book-a-table/` |
| Q34 | "Satvik-style choices made without onion and garlic, on request." (Needs Q11 yes.) | 13: SEO-388–397, 422; AI-201, 222 | No-onion-no-garlic page |
| Q35 | "Diners come from Koyambedu, Arumbakkam, Villivakkam and Anna Nagar West Extension. [Distance from Anna Nagar Tower metro]." | 6: SEO-263, 269, 270, 272, 277, 281 | `/about/#find-us` |
| Q36 | Visible text only: "Rated [x.x] on Google from [n] reviews (checked [date])." No AggregateRating schema. | 2: AI-034, 035 | `/` "What Guests Say" |
| Q37 | "A sample South Indian wedding lunch from a past Brihadhee event: [dishes]." (No prices. The Jain version needs Q16.) | 2: AI-166 (P1), AI-226 | `/catering-services-chennai/` |
| Q38 | "Chapathi with veg kurma, ₹[price]." | 1: SEO-119 | `/menu/` |

Total: 37 + 27 + 42 + 10 + 28 + 28 + 1 + 3 + 4 + 4 + 1 + 10 + 1 + 11 + 4 + 2 + 8 + 1 + 2 + 3 + 13 + 6 + 2 + 2 + 1 = **251**.

**Send first:** Q26 and Q28 (live pages already depend on them), Q31, Q32 and Q37 (the only P1 rows), then Q11–Q14 and Q16 (125 rows between them, but they all depend on one kitchen conversation).

## C. Raised in the final review (16 Nov 2026)

These items are already live on `main`; this branch didn't introduce them. Each needs an owner or SEO-lead decision, not a code fix.

| # | Item | Where | Question | Default until answered |
|---|---|---|---|---|
| R1 | **Beyond Curry FAQ** ("What is Beyond Curry by Brihadhee?") | Home FAQ, `llms-full.txt` | Same as **Q26**. The review hid it behind `ENABLE_SUB_BRAND = false` (commit `c473761`), because CLAUDE.md gates the sub-brand. Turn it on only after Q26 is a yes. | Hidden |
| R2 | **"Which restaurant serves the best dosa in Anna Nagar?"** Q&A | `/menu/dosa/` FAQ, `llms-full.txt` | The question targets a TRACK_ONLY query (AI-001) and uses "best". The answer makes no "best" claim; it lists the dosas and prices. Keep it as a factual answer, or remove it to keep TRACK_ONLY strictly measure-only? | Kept (the answer is factual) |
| R3 | **"What is the difference between ghee roast, paper roast and podi dosa?"** | `/menu/dosa/` FAQ | It mentions paper roast (EXCLUDED) only to say the menu doesn't list it, which stops engines inventing one. Keep the clarification, or drop the question? | Kept |
| R4 | **Seasonal page** (`/seasonal/karthigai-ayyappa-pure-veg/`) | Live page | Same as **Q28**. It mentions the 41-day Ayyappa mala vratham and lists dishes with onion or garlic. It claims no fasting menu, but "seasonal or fasting menus" are gated. Keep the page live? | Live, unchanged |
| R5 | **"Is Brihadhee on Swiggy or Zomato? Yes…"** and **"Does Brihadhee deliver food?"** (tells visitors to call; "Parcel charges are extra") | `/faq/`, `llms-full.txt` | Swiggy, Zomato, delivery and takeaway are gated (**Q25**). The answers state verified listings and tell visitors to call, and make no delivery claim. Confirm this wording may stay. | Kept |

## D. Actions from the Search Console step (17 Nov 2026)

Evidence is in [`11-gsc-baseline.md`](11-gsc-baseline.md). Every step below needs an account login or owner approval, so none of it has been done. Tick each one only with a dated screenshot in `evidence/`.

| # | Do first? | Action (exact values) | Who | Status |
|---|---|---|---|---|
| D1 | **Yes, today** | **Approve and deploy `hotfix/lead-function` to production.** It fixes `/api/lead`, which returns 500 `FUNCTION_INVOCATION_FAILED` on every request, so **no website enquiry has reached you since the 14 Nov release.** It also shrinks the 1.16 MB Nestlé logo. It's 2 commits on top of `origin/main`. After the deploy: `curl -i https://www.brihadhee.com/api/lead` must return **405**, not 500. | Owner approves; developer deploys | Open |
| D2 | Yes | In Vercel → Project → Settings → Environment Variables (Production), confirm that **`RESEND_API_KEY`** and **`LEAD_TO_EMAIL`** are set, and that **`LEAD_FROM_EMAIL`** uses a sender on a domain verified in Resend. Without it, Resend's test sender only delivers to the Resend account owner. Then submit **one** test enquiry on `/catering-quote-chennai/` and confirm the email arrives. Also check Vercel → Logs for `/api/lead` since 14 Nov, to see how many submissions failed. | Owner or developer | Open |
| D3 | Yes | **Turn on GA4.** Create a GA4 property with a web stream for `https://www.brihadhee.com`. Put the `G-…` ID in Vercel as **`PUBLIC_GA4_ID`** (Production) and redeploy; the privacy page updates itself. In GA4 → Admin → Events, mark these as key events: `catering_quote_submit`, `restaurant_enquiry_submit`, `click_call`, `click_whatsapp`, `directions_click`, `book_table_click`. Link GA4 to Search Console. | Owner | Open |
| D4 | Yes | **Search Console.** Confirm the property type (the export lists `http://` and `https://` URLs, so probably a Domain property). Add the developer as a user. Submit `https://www.brihadhee.com/sitemap-index.xml`. After the SEO branch deploys, run URL Inspection and *Request indexing* for `/`, `/menu/`, `/menu/nellai-meals/`, `/menu/dosa/`, `/parotta-anna-nagar/`, `/veg-dinner-anna-nagar/`, `/family-dining-anna-nagar/`, `/about/`, `/catering-services-chennai/` and `/corporate-catering-chennai/` (there's a quota; repeat requests don't help). Screenshot "URL is on Google" and the **Google-selected canonical** for each. | Owner + developer | Open (replaces A4) |
| D5 | Yes | **Send these exports:** (a) Performance, last 28 days compared with the previous 28 days, Country = India, Web. (b) The Queries tab filtered to Page = `https://www.brihadhee.com/`, then to Page = `https://www.brihadhee.com/menu/`. (c) Page indexing, indexed and not-indexed lists with reasons. (d) Sitemaps report screenshot. (e) Generative AI report by page and date. | Owner | Open |
| D6 | Yes | **Business Profile:** set the website link to exactly `https://www.brihadhee.com/` (Search Console shows `http://www.brihadhee.com/` collecting impressions; an `http://` link on the profile is one possible source, so check it) and the menu link to `https://www.brihadhee.com/menu/` (Google's rules forbid a delivery-app link there). Everything else is in `07-offsite/google-business-profile.md`. | Owner | Open |
| D7 | After D6 | **Listings** (seen 17 Nov; rows dated 2026-11-17 in `docs/geo/corrections-log.csv`): <br>• EazyDiner "serves both veg and non veg food" → pure vegetarian; 06:30 AM → 11 AM. <br>• Zomato, District, magicpin, Swiggy Dineout, Apple Maps call number +91 94442 24999 → +91 73587 14113. <br>• magicpin hours 11:30 AM–2:00 PM → 11 AM–11 PM. <br>• Swiggy Dineout address "Plot No.41, 3Road Avenue" → full address. <br>• Zomato "Breakfast"/"Brunch" → lunch and dinner. <br>• Apple Maps name "Brihadhee Pure Veg Restaurant" → Brihadhee. <br>• Justdial "Brihadhee" address typos and "+ Add Website" → add `https://www.brihadhee.com/`. <br>• Every listing: add the website. | Owner | Open |
| D8 | With D7 | **Confirm the listing call number.** Direction J (12 Nov) made +91 73587 14113 the website's main number. An older 12 Nov note in `corrections-log.csv` and `docs/seo-baseline.md` line 116 still call +91 94442 24999 "primary". Should every listing show 73587 14113 for the restaurant, with 94442 24999 only as a catering line? | Owner | Open |
| D9 | Within 7 days | **Bing:** import the site from Search Console into Bing Webmaster Tools and submit the sitemap. Set **`INDEXNOW_KEY`** in Vercel (8–128 letters, digits or dashes) and redeploy. After each deploy, run `INDEXNOW_KEY=<key> npm run indexnow`. Import Bing Places from the Business Profile only after D6 is done; then check for duplicate listings. | Developer + owner | Open |
| D10 | Before merging the SEO branch | This checkout has **uncommitted copies** of `origin/main`'s client-logo and favicon changes, plus one local edit in `src/layouts/Base.astro` (the `favicon.ico` link removed). Before merging `origin/main` into `seo-aeo-geo`, stash only those files, so the merge isn't blocked and the unrelated audio files and `outputs/` stay put: `git stash push -u -m "logo dup + Base favicon" -- src/components/ClientLogos.astro ':(literal)src/pages/[slug].astro' src/layouts/Base.astro public/apple-touch-icon.png public/favicon-96x96.png public/favicon.ico public/icon-192.png public/icon-512.png public/images/clients docs/seo/client-logo-sources.md`. Then run `git merge origin/main` (checked: no conflicts). Bring back the `Base.astro` edit only if it's still wanted: `git checkout stash@{0} -- src/layouts/Base.astro`. Don't reset; stashing loses nothing. | Developer | Open |
