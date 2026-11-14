# Client confirmations (Step 0)

Updated 2026-11-11. Only items marked **Confirmed** may be used in copy, schema, `llms.txt` and meta tags.
**Section F (client direction W11, W12 and W13, 2026-11-11) supersedes the 5 and 6 November brief.** Where F disagrees with an earlier section, F wins.
Catering items are tracked in more detail in `docs/brihadhee-aeo-ops.md` (section 1) and `config/client-verification.json`.

Status key: **Confirmed** (written or recorded answer from the owner) | **Not confirmed**.
"Source" says where the current value on the site came from.

## A. Facts already given in the brief (treat as confirmed unless the owner says otherwise)

| Item | Value | Status | Source |
|---|---|---|---|
| Name | Brihadhee | Confirmed | brief |
| Address | New W-41 (Old W-124), 3rd Avenue, W Block, Anna Nagar East, Chennai, Tamil Nadu 600040 | Confirmed | brief |
| Landmarks | near Anna Tower and 3rd Avenue | Confirmed | brief |
| Phone and WhatsApp | +91 73587 14113 | Confirmed | brief |
| Email | brihadhee@gmail.com | Confirmed | brief |
| Vegetarian South Indian | yes | Confirmed by brief; **owner to confirm in writing** that no non-veg is served (the earlier notes in `Ho.md` left this open) | brief |
| Meal times | lunch and dinner (exact hours are NOT confirmed) | Confirmed | brief |
| Dine-in | yes | Confirmed | brief |
| Family-friendly | yes | Confirmed | brief |
| Alcohol | not served | Confirmed | brief (an earlier reservation listing also said no) |
| Known for | filter coffee, banana-leaf meals | Confirmed | brief |
| Menu items and prices (49 items, all vegetarian) | as in `src/data/menu.json` (from `final menu 13-07-2026.pdf`); prices quoted on the site are computed from it | Confirmed as the current menu; owner to confirm prices are final (item 7) | menu file |

## B. Needed from the client

| # | Item | Status | What the site does today | Needed answer |
|---|---|---|---|---|
| 1 | **Production domain**: custom domain (brihadhee.in / .com) or stay on a free host? Which is final? | Not confirmed | Two live copies: `shashan3k.github.io/brihadhee/` and `brihadhee.vercel.app`; canonical points to github.io | Final domain name; who controls DNS |
| 2 | **Opening hours** per day, afternoon break, holiday closures | Not confirmed | Hours hidden everywhere. Data file holds an unverified 11:00 to 23:00; an older source said 6:30 AM to 11 PM | Day-by-day hours |
| 3 | **Customizable dosas** (site copy softened on 2026-11-05; claim returns only after confirmation): available now? How it works (base, fillings, spice level)? Photo/video? | Not confirmed | Claimed in hero, About, meta description, schema, review summary, `llms.txt`, **and** listed as "Build Your Own Dosa · Coming soon" | Yes/No, and the exact way it works |
| 4 | **Value-Meal-Box**: how is it sold (pickup, Swiggy/Zomato, own delivery)? Areas? Name and menu? | Not confirmed | Shown as a "cloud kitchen" concept with two photos and no ordering detail | Sales channel, areas, menu |
| 5 | **Listings**: on Zomato, Swiggy, Magicpin, Justdial, EazyDiner? Links | Not confirmed | None linked (`sameAs` empty) | URLs |
| 6 | **Facilities**: table booking, parking, wheelchair access, AC, seating capacity, group/party seating | Not confirmed | Only dine-in and family-friendly stated | Y/N each, capacity |
| 7 | **Price range per person**; are on-site menu prices final? | Not confirmed | `priceRange` empty; 49 menu items show prices | Range and "prices final: Y/N" |
| 8 | **Brand spelling**: official spelling, Tamil spelling (பிரிஹதீ), common variants customers use | Not confirmed | "Brihadhee" and "பிரிஹதீ" used | Confirm both, list variants |
| 9 | **Catering**: offered? Events, min/max guests, area, menu formats, staff included, advance notice, price per plate, catering phone | Not confirmed | Fully gated; `/catering` not built | See the 10 questions in `docs/brihadhee-aeo-ops.md` |
| 10 | **Social profiles**: Instagram, Facebook, others | Not confirmed | None | URLs |
| 11 | **Photos** with permission to publish: real interior, food, exterior; captions | Not confirmed | 7 food photos, 2 meal-box photos, logo | Files plus written permission |
| 12 | **Parotta** on the menu daily? | Not confirmed | 7 parotta items on the menu; parotta search terms stay gated | Y/N |
| 13 | **Google rating and review count**: current figures from the verified Google Business Profile, and the date checked | Not confirmed | 4.2 from 857 reviews, date unknown (from an earlier screenshot) | Fresh numbers with date |
| 14 | **Pure vegetarian** in writing (see section A) | Not confirmed | "Vegetarian" used throughout | Yes/No |

## C. Decisions for the owner (not facts)

| Item | Status |
|---|---|
| Allow AI **training** crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot)? Search and user-fetch agents are separate. | Not decided |
| Show Google rating on the site, with a "last checked" date? | Not decided |
| Offer WhatsApp enquiry as the only form action, or add a stored form? | Not decided |

## D. How these are enforced in code (AEO build, 2026-11-05)

- Every fact lives in `src/data/facts.js` with `status`, `verifiedOn` and `source`. Reading a **pending** fact with `getFact()` fails the build.
- Pending today: **hours** (item 2), **price range per person** (item 7), **Google rating and count** (item 13; the rating badge and review card numbers are hidden until confirmed with a date), **customizable dosas** (item 3).
- `scripts/aeo-lint.mjs` also searches the built HTML for the text of each pending fact (for example "857", "open daily", "customizable dosas") and fails if one appears.
- To confirm a fact: update `src/data/facts.js` (status, value, `verifiedOn`, `source`), update this file, then run `npm run build && npm run validate`.

### FAQ questions skipped because facts are pending
| Question | Needs |
|---|---|
| What time does Brihadhee open and close? | hours (item 2) |
| Is Brihadhee open on weekends? | hours (item 2) |
| What is the price range per person? | price range (item 7) |

## E. Update from the client brief of 2026-11-05 (owner-confirmed)

These replace the earlier values above. All are in `src/data/facts.js` with `verifiedOn: 2026-11-05`.
Rows marked **Superseded (F)** were replaced by the client direction of 2026-11-11 (section F) and must not be used.

| Item | New value |
|---|---|
| Phone | **+91 94442 24999** (replaces +91 73587 14113 everywhere) |
| WhatsApp | **Pending**: the brief lists no WhatsApp number, so WhatsApp buttons are hidden |
| Address (exact wording) | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040. **Match this on the Google Business Profile.** |
| Hours | **Superseded (F)**: was Monday to Sunday, 6:30 AM to 11:00 PM |
| Late-night dining "up to 6:00 AM" | **Pending**: contradicts the 11:00 PM close; not published |
| Brand names | Brihadhee; also Brihadhee Hotels, Brihadhee Pure Veg Restaurant |
| Sub-brand | Beyond Curry by Brihadhee (North Indian meal boxes); how they are sold is still unconfirmed |
| Cuisine | 100% pure vegetarian: South Indian (Tirunelveli and Karaikudi specialties), North Indian, Indo-Chinese |
| Founders | Rakesh and Eashwer (an auditor and a lawyer by profession) |
| Price range | **Superseded (F)** for the tiffin framing: was ₹200 to ₹400 for two (tiffin); about ₹800 for a family meal. Schema `₹₹` stays. |
| Offers | **Superseded (F)** for the ₹80 Mini Tiffin and the budget tiffin from ₹24. Still current: 10% off walk-in dine-in; up to 40% off Monday to Thursday when pre-booked via Swiggy Dineout, EazyDiner or District. Re-check monthly. |
| Reservations | Yes, via the three booking apps |
| Customised dosas | Available now (how they are customised is not described yet) |
| Menu prices | **Superseded (F)**: the menu now follows `new menu.pdf` (received 2026-11-11, transcribed in `src/data/menu-canonical.ts`). The Mini Tiffin ₹80 is retired. |
| Signature items without a price | Customised Dosa, Summer in Tenkasi, Butter Biscuit Shake, outdoor filter coffee and tea counter |
| Catering | Confirmed: seemantham, gruhapravesam, ear piercing, betrothals, boutique weddings, birthdays; 50 to 1,500 guests; Chennai; live counters (customised dosa, Paanai Parotta, Nellai sodhi, Karaikudi Paneer Poppers); white-label or co-branded counters for event planners; per-plate pricing |
| Catering still pending | prep mode (cooked on site or delivered), staff and clean-up, advance notice, actual per-plate rates |
| AI training crawlers | Owner decision: allow GPTBot, ClaudeBot, Google-Extended |
| Still pending | Google rating and count (with date), WhatsApp number, parking |

## F. Client direction W11, W12 and W13 (2026-11-11), supersedes the 5 and 6 November brief

Source: the client's voice notes W11 to W13 and the keyword plan built from them (`SEO_RANKING_STRATEGY.md`, `AEO_GEO_STRATEGY.md`). Recorded in `src/data/entity-truth.ts` (sources `KW` and `CLIENT`, `verifiedOn: 2026-11-11`) and `config/client-verification.json`.

### F1. Operating hours

| Item | Value | Status |
|---|---|---|
| Hours | **11:00 AM to 11:00 PM** (11:00 to 23:00) | Confirmed (W11) |
| Meal periods | **Lunch and dinner only** | Confirmed (W11) |
| Days open | Every day, Monday to Sunday | **Confirmed 2026-11-11** (section G) |

### F2. Hard-banned terms and concepts (zero exceptions)

None of these may appear anywhere on the site: page text, titles, meta tags, image alt text, URLs, JSON-LD, `/llms.txt`, `/llms-full.txt`, `/menu.json`, the sitemaps or the web manifest.

| Banned | Written forms blocked |
|---|---|
| Breakfast service | breakfast; காலை உணவு |
| The 6:30 AM opening | 6:30 AM, 06:30 |
| Tiffin and Mini Tiffin | tiffin, mini tiffin; டிபன், மினி டிபன் |
| The ₹80 Mini Tiffin combo, the ₹24 and ₹35 budget tiffin items, and value combos | the items are deleted from the data; "value combo" is blocked |
| Budget or cheap framing | budget, cheap, pocket-friendly, wallet-friendly, under ₹100, under ₹150, under ₹300 |
| "500+ dosa varieties" | 500 varieties, 500+ varieties (the menu lists 11 dosa items) |

Enforced by the hard-block section of `docs/seo/avoid-terms.txt` (checked by `scripts/aeo-lint.mjs` on every built surface) and by `RETIRED_TERMS` in `src/data/entity-truth.ts` (checked by `scripts/check-facts.mjs`). Both run in `npm run build`.

Not affected: regular dishes on the client's new menu that happen to cost ₹35 or ₹80 (Lemon Tea, Black Coffee, the Tomato Thokku dosa topping and Roti (Butter)). They stay on the menu exactly as printed in `new menu.pdf` (client decision, 2026-11-11). Copy never leads with a low "starting from" price.

### F3. Active brand pillars (lead every description in this order)

| # | Pillar | Fact in `entity-truth.ts` |
|---|---|---|
| 1 | 100% pure vegetarian South Indian restaurant | `dietary`, `typeLong`, `brandDescription` |
| 2 | Build-Your-Own Dosa | `knownFor`, `customizableDosas` |
| 3 | Nellai Special Sodhi Meals | `knownFor` |
| 4 | Paanai Parotta and Veg Kothu Parotta | `knownFor`; `restaurant_parotta_confirmed: true` |
| 5 | Corporate catering, 1,000+ meals a day | `corporateCatering` (client names stay pending: `corporateClients`) |
| 6 | End-to-end event catering, 50 to 1,500 guests | `catering.guests`, `eventService` |

`knownFor` (in order): Build-Your-Own Dosa, Nellai Special Sodhi Meals, Paanai Parotta, Karaikudi Paneer Poppers, Filter Coffee, Pure Veg Corporate Catering (1,000+ meals daily), End-to-End Event Catering (50 to 1,500 guests).

### F4. Earlier decisions this changes

| Earlier | Now |
|---|---|
| Section A: meal times confirmed, exact hours not confirmed | 11:00 AM to 11:00 PM confirmed (F1) |
| Section B item 2: older source said 6:30 AM to 11 PM | Retired; hours are 11:00 AM to 11:00 PM, days still pending |
| Section E: hours, tiffin price range, Mini Tiffin and budget tiffin offers, Mini Tiffin price | Superseded (rows marked in E) |
| Route map: corporate and office catering intent excluded by owner decision | Corporate catering is a client service (W13). "corporate catering", "office lunch catering" and "bulk catering" are off the avoid list; `/corporate-catering-chennai/` is a P1 route |
| Route map: `/menu/mini-tiffin/` and `/menu/tiffin/` planned | Dropped |

## G. On-page SEO blueprint (2026-11-11), confirmed by the Brihadhee team

Confirmed when the team supplied the on-page blueprint for the six restaurant pages. Recorded in `src/data/entity-truth.ts` with source `BLUEPRINT` and `verifiedOn: 2026-11-11`.

| Item | Value | Fact |
|---|---|---|
| Days open | Every day, Monday to Sunday, 11:00 AM to 11:00 PM (lunch and dinner). The site now shows day-by-day hours and emits `openingHoursSpecification` | `openDays`, `hours.days` |
| Recipe story | Tamil home-style food cooked from grandma's recipes (also the Instagram bio) | `recipeStory` |
| Name story | The name is a tribute to the Brihadeeswarar Temple in Thanjavur and its Chola architecture; Brihadhee is not affiliated with the temple. Replaces the llms.txt line that called the name "not connected" | `nameStory` |
| Direction landmarks | Anna Nagar Tower Park, Anna Nagar East Metro, Roundana, VR Mall, Shanthi Colony, Thirumangalam. Linked as Google Maps directions; no distance or travel time is stated | `directionLandmarks` |
| Build Your Own Dosa steps | The printed menu's 4 steps with guest-facing headings: Pick your base (batter), Finish with podi and toppings, Add fillings, Choose your roast (the menu's ghee, butter or oil "garnish"). No chutney or sambar choice is offered | `src/lib/menu-facts.js` `BYO_WORDING` |
| Ragi and navadhaniya dosa | Not separate menu items: made with the build-your-own batters Terracotta Canyon (ragi) and Pink Sea (beetroot and navadhaniyam) | `/menu/dosa/` |
| Reviews | No quotes, rating or count until dated, permissioned reviews are supplied; "What Guests Say" links to the Google Maps listing | `googleRating` stays pending |
| Still pending | Last-order time before the 11 PM close (`lastOrderTime`); the corporate catering page (links point to the corporate section of `/catering-services-chennai/` until it exists) | |

## H. Corporate and event catering brief (2026-11-12), confirmed by the Brihadhee team

Recorded in `src/data/entity-truth.ts` with source `B2B` and `verifiedOn: 2026-11-12`.

| Item | Value | Fact |
|---|---|---|
| WhatsApp | The main number **+91 94442 24999** also takes WhatsApp. WhatsApp buttons, the CTA bar and the form's WhatsApp action are on | `whatsapp` |
| Corporate service areas | Anna Nagar, Ambattur Industrial Estate, Guindy, OMR, Sholinganallur, Siruseri, Perungudi, Taramani, Tidel Park, Ambit IT Park. One "Areas We Serve" section; no doorway pages. Schema `areaServed` stays "Chennai" (config `service_area`) | `corporateAreas` |
| Corporate services | Daily office lunch supply, bulk lunch catering, employee meal programmes, office parties and corporate events | `corporateServices` |
| Corporate process | Enquiry and headcount, kitchen tasting at Anna Nagar, trial week, daily rollout on a rotating menu | `corporateProcess` |
| Food safety | FSSAI-licensed kitchen; 100% pure veg; packed in the kitchen; delivered to an agreed time slot | `foodSafety` |
| Still pending | The FSSAI licence number (the page says it is shared on request until supplied: `fssaiLicence`); corporate clients now named (section K); event catering staff and clean-up, prep mode and advance notice (config) | |
| Lead capture | Owner decision (closes section C, "stored form"): the form posts to `/api/lead` and is emailed through Resend; nothing is stored on the website | `api/lead.js` |

## I. AI-citation brief (2026-11-12)

| Item | Value | Where |
|---|---|---|
| Listing profiles | Instagram, Google Maps, Zomato, Swiggy Dineout, EazyDiner and District are the restaurant's own profiles (URLs from `docs/geo/presence-audit.csv`). They are in Restaurant `sameAs`, and Swiggy Dineout and District are now linked as booking partners | `sameAs`, `bookingLinks` |
| Q&A rules | One Q&A per route; the full address only in the first Q&A on each page; a visible "Last updated: Month YYYY" line from `CONTENT_UPDATED` | `src/lib/answers.js` `qaRoute()`, `scripts/aeo-lint.mjs` check 12 |
| Schema | One opening-hours node (every day, 11:00 to 23:00); no `makesOffer`; no ratings or reviews; `dateModified` on WebPage, FAQPage and Article only (it is not a Restaurant property); Service `Event catering` (with an offer catalogue: wedding, birthday, family function) and `Corporate catering`, `areaServed` Chennai | `src/lib/schema.js` |
| Still pending (seasonal page says "ask the team") | Cooking without onion and garlic on request (`noOnionGarlic`); Ayyappa pooja or bhajan catering (`poojaCatering`, also add `pooja` to `confirmed_events`); a Karthigai seasonal menu or offer (`karthigaiSpecial`). Each has a build probe, so the claim cannot appear until the fact is verified | `src/data/entity-truth.ts` |

## J. Phone numbers (owner direction, 2026-11-12)

| Item | Value | Where |
|---|---|---|
| Restaurant phone and WhatsApp | **+91 73587 14113** on every page, in the Restaurant schema, the footer and llms.txt (replaces +91 94442 24999 as the main number) | `entity-truth.ts` `phone`, `whatsapp` |
| Catering phone and WhatsApp | **+91 94442 24999** on the catering pages only (event, corporate, event planner, small functions, quote): header call button, page header, summary, mobile CTA bar, forms, FAQ answers and the catering Service schema. The footer keeps the restaurant number as the site-wide NAP | `config/client-verification.json` `enquiry_channels` (`is_different_from_restaurant: true`); `pageContact()` in `src/data/site.js` |
| To confirm | That +91 73587 14113 takes WhatsApp (the WhatsApp buttons now use it) | |

## K. Corporate clients (2026-11-14), sent by the Brihadhee team

| Item | Value | Where |
|---|---|---|
| Companies catered for | Aalam, Freehand, Pando, Bi3 Technologies, Nestlé, NDR, Selvarangam Hospitals, FRUTTA, Go Khana, HungerBox, Pro Chant, Prodapt, Stark Event Management. Names only: no headcounts, dates or contract details | `entity-truth.ts` `corporateClients` |
| Shown on | `/corporate-catering-chennai/`: a "Companies We Have Catered For" logo wall after the daily volume section, plus a "Clients" row in the summary table | `src/components/ClientLogos.astro`, `corporatePage.clients` in `src/data/catering.js` |
| Logos | One file per company in `public/images/clients/` (`<slug>.svg`, `.png` or `.webp`). A company without a logo file shows its name as a text tile | `ClientLogos.astro` `SLUGS` |
