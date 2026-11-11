# SEO / AEO / GEO baseline (Stage 1)

Captured 2026-11-06 against commit `2dc736c` (live on both hosts). No code was changed in Stage 1.

## 1. Framework and rendering

| Item | Finding |
|---|---|
| Framework | Astro 7.4.5, `output: "static"` (astro.config.mjs). Every route is pre-rendered to HTML at build time (SSG). |
| Client JS | One small bundle (about 7 KB) for progressive enhancement: menu tabs, mobile nav, gallery lightbox, scroll reveal, enquiry form. No framework runtime, no hydration. |
| Hosts | `shashan3k.github.io/brihadhee/` (GitHub Actions build, base `/brihadhee`) and `brihadhee.vercel.app` (Vercel Git integration, base `/`). Both serve the same commit. No `vercel.json`. |
| Canonical | Hard-coded `site.url = https://shashan3k.github.io/brihadhee` in `src/data/site.js`; both hosts declare the github.io URL as canonical. No custom domain in any config. |

## 2. Raw HTML (what a non-JS crawler sees)

Counted from the built `dist/` HTML (identical to the live responses), visible text only, scripts and styles removed.

| Route | Words | H1 | H2 | FAQ items (`<details>`) | Images | Heading skips |
|---|---|---|---|---|---|---|
| `/` | 2,810 | 1 | 10 | 24 | 13 (jpg/png) | none |
| `/menu/` | 1,185 | 1 | 12 | 0 | 2 (png logo) | none |
| `/best-dosa-parotta-anna-nagar/` | 1,077 | 1 | 7 | 5 | 3 | none |
| `/nellai-meals-south-indian-veg-anna-nagar/` | 721 | 1 | 6 | 5 | 3 | none |
| `/catering-services-chennai/` | 1,025 | 1 | 8 | 9 | 4 | none |
| `/event-planner-catering-partner/` | 825 | 1 | 8 | 4 | 4 | none |

Findings:
- **Nothing is client-only.** All 9 home-page menu panels (52 dishes) are in the static HTML; JS hides the inactive tabs after load. FAQ answers are in `<details>` (collapsed, but present in HTML). No `<noscript>` fallbacks are needed.
- **Hash anchors:** the home page uses 13 in-page `#` links (nav: `#visit`, `#contact`; hero: `#menu`). The content they point to is in the same HTML, so nothing is trapped. Inner pages link back with `/#visit` and `/#contact`.
- **Scroll reveal:** `.js .reveal { opacity: 0 }` until an IntersectionObserver fires. Non-JS crawlers see everything; JS-rendering crawlers get the text in the DOM, but screenshot-style previews may show faded sections.
- **Images:** JPG/PNG only, no WebP/AVIF; width and height are set on all images.
- **Map:** a Google Maps iframe (`maps?q=lat,long&output=embed`), not a `hasMap` link in schema.

## 3. Host and URL findings

| Check | github.io | vercel.app |
|---|---|---|
| All 6 routes, robots, sitemap, llms, llms-full | 200 | 200 |
| canonical | github.io (self) | github.io (other host) |
| og:image | `/brihadhee/images/og-image.jpg` (200) | `https://shashan3k.github.io/images/og-image.jpg` (**404**: wrong base path) |
| robots.txt honoured? | **No**: it is under `/brihadhee/`, not the host root | Yes (served at root) |
| sitemap URLs | github.io | github.io (other host) |

### Custom domain (added 2026-11-06)

`www.brihadhee.com` is connected to Vercel and serves the same build (Server: Vercel, HSTS on).

| URL | Result |
|---|---|
| `https://www.brihadhee.com/` | 200 |
| `https://brihadhee.com/` | 308 to `https://www.brihadhee.com/` |
| `http://www.brihadhee.com/`, `http://brihadhee.com/` | 308 to HTTPS www |
| `https://www.brihadhee.com/robots.txt`, `/menu/`, `/images/og-image.jpg`, `/icon-192.png` | 200 |
| `https://brihadhee.vercel.app/` | 200 (still a live duplicate, no redirect) |

The pages on www.brihadhee.com still declare `canonical` and `og:image` on `shashan3k.github.io`, so today Google is told the github.io copy is the original. Stage 2 must move every absolute URL to `https://www.brihadhee.com`.

## 4. Lighthouse (mobile, local Lighthouse 12, Chrome headless, against brihadhee.vercel.app)

Lighthouse 12.8.2, mobile form factor, simulated throttling, one run per route (expect a few points of run-to-run variance).

| Route | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| `/` | **89** | 100 | 96 | 100 | **3.3 s** | 0.001 | 160 ms | 1.8 s |
| `/menu/` | 97 | 100 | 96 | 100 | 2.5 s | 0 | 80 ms | 1.6 s |
| `/best-dosa-parotta-anna-nagar/` | 98 | 100 | 96 | 100 | 2.3 s | 0 | 0 ms | 1.6 s |
| `/nellai-meals-south-indian-veg-anna-nagar/` | 98 | 100 | 96 | 100 | 2.4 s | 0.013 | 50 ms | 1.5 s |
| `/catering-services-chennai/` | 97 | 100 | 96 | 100 | 2.3 s | 0 | 60 ms | 1.4 s |
| `/event-planner-catering-partner/` | 95 | 100 | 96 | 100 | 2.7 s | 0.026 | 60 ms | 1.9 s |

- Home LCP element is the H1 (`.hero__title`, web-font text), not the hero image. Lighthouse estimates 114 KiB from modern image formats and 358 KiB from responsive image sizes on `/`.
- Best practices 96 everywhere: one console error, `site.webmanifest` hard-codes `/brihadhee/icon-192.png`, which is a **404 on Vercel**.
- Field (CrUX) data: not checked. These are lab numbers only.

## 5. AEO audit (`npx @canonry/aeo-audit@7`, run 2026-11-06 with owner approval)

**Sitemap mode failed as a baseline:** the sitemap served on www.brihadhee.com lists `shashan3k.github.io/brihadhee/...` URLs. After origin rewriting they became `www.brihadhee.com/brihadhee/...`, which are all 404, so every page scored 0. This confirms the sitemap must be regenerated for the www domain in Stage 2.

Single-URL audits against `https://www.brihadhee.com` (with `--include-geo`):

| Route | Score /100 | Lowest factors |
|---|---|---|
| `/` | 79 | Definition blocks 38, E-E-A-T 40, Citations 42, Freshness 47 |
| `/menu/` | **71** | FAQ content 0, Definition blocks 20, Citations 30, E-E-A-T 40, Freshness 47, Extractability 55, Schema completeness 60, Structured data 64 |
| `/best-dosa-parotta-anna-nagar/` | 75 | Definition blocks 20, Citations 30, E-E-A-T 40, Freshness 47 |
| `/nellai-meals-south-indian-veg-anna-nagar/` | 76 | Citations 30, E-E-A-T 40, Freshness 47, Definition blocks 50, Extractability 53 |
| `/catering-services-chennai/` | 78 | Definition blocks 20, Citations 30, E-E-A-T 40, Freshness 47 |
| `/event-planner-catering-partner/` | 79 | Citations 30, E-E-A-T 40, Freshness 47, Definition blocks 50, Extractability 60 |

Strong on every route: schema validity 100, AI crawler access 100, named entities 100, snippet eligibility 100, AI access files 98, technical SEO 92 to 100, geographic signals 92 to 100.

Tool findings worth acting on (Stage 2):
- **Freshness:** no `dateModified` in schema; sitemap `lastmod` does not match the audited URL (wrong domain in the sitemap).
- **Citations:** no `sameAs` in schema (no owner-confirmed profiles yet).
- **Schema completeness:** "Organization schema 29% complete": the Beyond Curry `subOrganization` node is thin.
- **/menu/:** no FAQ block and no answer-first text.
- **E-E-A-T:** the tool wants Person schema and reviews. Founders are already nested as `founder` Persons. The tool also suggests AggregateRating; **not followed**, because self-served ratings are ineligible for local businesses and your rules exclude them.

## 6. Entity lock table

**Price source of truth (owner, 2026-11-06): the menu PDF `final menu 13-07-2026.pdf`.** This replaces an earlier same-day answer that the brief prices win.

Status: **verified** = two agreeing sources, or an owner-confirmed brief recorded in the repo; **conflict** = sources disagree; **unverified** = no usable source (set to null in Stage 2).
Sources: `facts.js` = `src/data/facts.js` (client brief, 2026-11-05); `PDF` = `final menu 13-07-2026.pdf`; `Ho.md` = original brief (from the Google profile screenshot and a reservation listing); `presence` = `docs/geo/presence-audit.csv` (third-party listings seen 2026-11-05, not independently re-checked).

| Field | Value | Source | Status |
|---|---|---|---|
| Legal (registered) name | none found | none | unverified |
| Brand name | Brihadhee | facts.js, PDF ("brihadhee"), Google and Zomato listings | verified |
| Alternate names | Brihadhee Hotels; Brihadhee Pure Veg Restaurant | facts.js; Apple Maps shows "Brihadhee Pure Veg" | verified |
| Tamil name | பிரிஹதீ | Ho.md, facts.js | verified |
| Dietary status | 100% pure vegetarian | facts.js; PDF has no meat, egg or fish items | verified (EazyDiner says "veg and non-veg": wrong) |
| Address | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040 | facts.js; Zomato and Magicpin show the same wording; Ho.md "W-41 (Old No. W-124), 3rd Avenue, W Block, Anna Nagar" | verified (Justdial shows "18th Main Road" for the Beyond Curry listing: wrong) |
| Pincode | 600040 | facts.js; Apple Maps | verified |
| Lat / long | 13.0879662, 80.2178222 | Google Maps place URL (presence) | verified for GBP; site uses 13.0879396, 80.2178246 (origin undocumented, about 3 m away): **conflict, minor** |
| Phone | +91 94442 24999 | facts.js; Zomato, Magicpin, District, Apple Maps (presence) | verified |
| Old number +91 73587 14113 | WhatsApp link only (`wa.me/917358714113`) | presence | unverified (still in `docs/geo`) |
| WhatsApp | none | none | unverified |
| Email | brihadhee@gmail.com | site.js since the first commit; origin undocumented | unverified (confirm) |
| Hours | Monday to Sunday, 6:30 AM to 11:00 PM | facts.js; Ho.md reservation listing | verified |
| Late-night "up to 6:00 AM" | none | brief only, contradicts the 11 PM close | unverified |
| Price range | ₹200 to ₹400 for two (tiffin); about ₹800 for a family meal | facts.js | **conflict**: Ho.md Google says ₹200 to ₹400 *per person*; reservation listing about ₹200 for two; listings range ₹200 to ₹800 |
| Parking | none | Ho.md "not available (reservation listing), TO CONFIRM" | unverified |
| Landmarks | Anna Tower (Anna Nagar Tower Park); 3rd Avenue and 9th Street; Aadhaar Seva Kendra | Ho.md (Google map screenshot), facts.js | verified |
| Menu sections | 9 in menu.json: Starters, Tiffin Combos, Lunch & Meals, Dosa Varieties, Idly & Idiyappam, Parotta & Chapathi, Indian Gravies, Beverages, Traditional Sweets | menu.json | partial: the PDF has more items (Indo-Chinese, Veg 65, Poori, Sodhi Idly, Podi Idli, signature drinks) that menu.json lacks |
| Other dish prices | 8 items spot-checked against the PDF and matching: Gun Powder Idly 245, Poricha Salna Idly 255, Kal Dosa 95, Plain Dosa 100, Ghee Roast 150, Ghee Podi Dosa 160, Rava Dosa 125, Ghee Masala Dosa 170 | PDF, menu.json | verified for those 8; the remaining items were not individually re-checked |
| Nellai Spl Sodhi Meals | ₹240 | PDF | verified: owner decision 2026-11-06, menu PDF is correct (site currently shows ₹299 from the brief; fix in Stage 2) |
| Karaikudi Paneer Poppers | ₹290 | PDF | verified: owner decision 2026-11-06, menu PDF is correct (site shows ₹410; fix in Stage 2) |
| Karupatti Ulundhu Kali | ₹250 | PDF | verified: owner decision 2026-11-06, menu PDF is correct (site shows ₹125; fix in Stage 2) |
| Mini Tiffin ₹80; Kothu Parotta & Lemon Kothu Idiyappam Combo ₹239; budget tiffin from ₹24 | brief only | facts.js | verified: owner confirmed on 2026-11-06 to keep these, although they are not in the menu PDF |
| Customised dosa | available | brief only; not in PDF | unverified by menu (no description of how it works) |
| "500+ dosa varieties" | none | no source; menu has 11 dosa items | unverified: do not use |
| Signature drinks | Summer in Tenkasi; Butter Biscuit **Smoothie** (brief says "Shake") | PDF | verified names; prices exist in the PDF but text extraction scrambles them, so they need manual transcription |
| Catering | events (seemantham, gruhapravesam, ear piercing, betrothals, boutique weddings, birthdays); 50 to 1,500 guests; Chennai; live counters; per-plate pricing | facts.js / brief only | verified by brief only; per-plate rates, prep mode, staff, advance notice unverified |
| Beyond Curry by Brihadhee | North Indian meal boxes | brief; Justdial listing exists | verified name; how it is sold unverified |
| Founders | Rakesh and Eashwer | brief only | verified by brief only |
| Google rating | 4.2 from 857 reviews | Ho.md, undated | unverified (Swiggy 4.2 / 843 and Zomato 3.9 / 110 seen 2026-11-05) |
| sameAs | none owner-confirmed | candidates: Google Maps place URL, Zomato, Swiggy Dineout, Magicpin, EazyDiner, District, Apple Maps | unverified (owner must confirm which listings are theirs; Instagram/Facebook unknown) |

## 7. Owner decisions for Stage 2 (2026-11-06)

| Decision | Answer |
|---|---|
| Canonical production URL | `https://www.brihadhee.com` (custom domain on Vercel) |
| Price source of truth | Menu PDF (`final menu 13-07-2026.pdf`); brief prices for the three conflicting dishes are dropped |
| Mini Tiffin ₹80, Kothu combo ₹239, budget tiffin from ₹24 | Keep (owner-confirmed, not in the PDF) |
| TypeScript | Yes: add as a dev dependency for `entity-truth.ts`, `menu-canonical.ts` and `tsc --noEmit` |
| Run `npx @canonry/aeo-audit@7` | Yes: run on 2026-11-06, results in section 5 |
| Google Maps screenshot | Pending |
| Turn off the GitHub Pages deploy | No: keep it running. Both builds will declare `https://www.brihadhee.com` as canonical, so the github.io copy consolidates to www instead of competing |

## 8. Facts updated from the keyword plan (2026-11-11)

Source: `keyword.md`, revised 11 November 2026 (client conversations W11 to W13). Applied in `src/data/entity-truth.ts`, `menu-canonical.ts` and `config/client-verification.json`.

| Fact | Before | Now | Status |
|---|---|---|---|
| Hours | Hidden (6:30 AM retired in commit 938800a) | **11:00 AM to 11:00 PM**, shown on every page and in llms files | verified |
| Open days, last order | Not shown | Still not shown: no day table, no Sunday claim, no `openingHoursSpecification` | unverified (`openDays`) |
| Meal periods | Lunch and dinner | Unchanged; breakfast, tiffin and 6:30 AM stay blocked by `RETIRED_TERMS` | verified |
| Dosa positioning | "Customised dosa" | **Build your own dosa** (page, Q&A, live counter, menu signature) | verified; "thousands of combinations" not used until approved |
| Corporate catering | Banned (old client decision) | **Daily corporate and office catering, more than 1,000 people every day**; ban lifted in guardrails and avoid list | verified; client names and headcounts unverified (`corporateClients`) |
| Event catering | Events list | Adds **get-togethers** and **end-to-end service** (menu planning, cooking, serving, setup) | verified |
| Filter coffee counter | Claimed | Removed (keyword plan marks it "confirm it is current") | unverified |
| Pure veg | Verified | Unchanged; keyword plan still lists it as a client question | verified (owner brief + menu PDF), reconfirm |
| Marwari / Jain / no onion no garlic | n/a | Not on the site yet: only in `keyword.md` until the kitchen level is confirmed | unverified |

## 9. New menu (2026-11-11)

Price source of truth is now **`new menu.pdf`** (identical file to `table  menu.pdf`; image-only, transcribed by hand and checked column by column). It replaces `final menu 13-07-2026.pdf` and the brief prices. Canonical data: `src/data/menu-canonical.ts`.

- 80 dishes in 12 sections: Starters, Lunch, Dine-in Combos (lunch only), Dosa Variety, Idly & Mini Idly, Idiyappam, Parotta & Chapathi, Rice, Indian Breads, Indian Gravies, Beverages, Brihadhee Signatures. Dishes with two or three prices (Gobi/Paneer, Plain/Butter/Garlic) are listed as separate items.
- Build Your Own Dosa: 5 batters (₹120 to ₹145), 6 toppings, 4 stuffings, 5 garnishes, 10 chef's suggestions (₹180 to ₹260). Shown on `/menu/` and the dosa page, in Menu JSON-LD, `menu.json` and the llms files.
- Removed (not on the new menu): Mini Meals, Sambar Rice, Variety Rice, Curd Rice, Ragi Dosa, Navadhaniya Dosa, Pesarattu Dosa.
- Notable price changes: Karaikudi Paneer Poppers ₹280, Karuppatti Ulundhu Kali ₹100, Paanai Parotta ₹270, Kothu Parotta & Lemon Kothu Idiyappam Combo ₹179, Filter Coffee ₹45.
- Menu notes now shown: prices exclude 5% GST, parcel charges extra, preparation up to 10 minutes.
- **To confirm with the owner:** Coimbatore Mappillai is printed at ₹215 but its parts add up to ₹225 (site shows the printed ₹215). The menu spells "Pannai Parotta" and "Phulkha"; the site uses "Paanai" and "Phulka". New dishes have no description yet.
