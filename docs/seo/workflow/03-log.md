# 03 Technical and on-page log

Step 3, 16 November 2026, branch `seo-aeo-geo`. Each change was built with `npm run build`, which runs every fact, SEO, compliance and link check, before its commit.

Final state:
- `npm test`: 21 of 21 passed.
- `npm run typecheck`: passed.
- `npm run verify`: all 8 checks passed (check 8 on the second run, the known preview start-up timeout on /mnt/c).
- 360 px mobile render of 11 changed pages: no horizontal overflow and one H1 each.

**Not deployed.** Live www.brihadhee.com is unchanged until these commits are merged and released.

## Changes

| # | Commit | Change | Files | Tracker IDs | Verification |
|---|---|---|---|---|---|
| 1 | `a979b6e` | The homepage owns the brand + locality phrase. The home title is now "Brihadhee Anna Nagar \| Pure Veg South Indian Dosa Restaurant" (60). The About title changed from "Brihadhee Anna Nagar: Address, Timings & Contact" to "Brihadhee Address, Timings & Contact \| Anna Nagar East" (54). The first home wording failed the compliance guard (the home title must pair Brihadhee with the full category or "dosa"), so "Dosa" was added. **17 Nov: reverted** to the live "Brihadhee \| Pure Veg South Indian Restaurant, Anna Nagar" after the first Search Console data (`e4356d4`, `11-gsc-baseline.md` §5). | `src/data/pages.js`, `src/pages/about.astro` | SEO-001, 002, 007, 008 (home). SEO-004, 009, 010 stay on `/about/`. | Build: 8/8 checks. `dist/index.html` `<title>` confirmed. |
| 2 | `7179e0e` | The `/menu/` hub owns "Brihadhee menu". Every link to `/menu/` from page headers, dish pages, dinner, the home menu section and spoke cards now says "Brihadhee menu and prices" or "Full Brihadhee menu with prices". The `/menu/` title is now "Brihadhee Menu and Prices \| Pure Veg, Anna Nagar East" (53). The Nellai page already linked to `/menu/` in its first screen. | `PageHeader.astro`, `MenuSection.astro`, `spokes.js`, `menu.astro`, `menu/dosa.astro`, `menu/nellai-meals.astro`, `veg-dinner-anna-nagar.astro` | SEO-003 | Build passed. Branded anchors found in `dist` on `/menu/nellai-meals/`, `/menu/dosa/` and `/`. |
| 3 | `a802863` | Coffee Bar. The home H2 is now "Brihadhee Coffee Bar, Anna Nagar". The About "Opening Hours" section links to `/#coffee-bar` with the anchor "Brihadhee Coffee Bar" (a verified fact: served during lunch and dinner). The corporate H2 "Coffee Bar for Office Events" stays as it is, since it serves a different query (SEO-P05). | `src/data/pages.js`, `src/pages/about.astro` | SEO-P03, SEO-125, SEO-P04, AI-298 | Build passed. H2 and About link confirmed in `dist`. |
| 4 | `7cc552f` | Catering hub. Title: "Pure Veg Wedding & Event Caterers in Chennai \| Brihadhee" (56). Description names "caterers" and "based in Anna Nagar East" (145). The lead now reads "weddings and marriage functions, birthday parties and family functions", conditional on the confirmed event list. | `src/data/catering.js` | SEO-P06, P07, P09, 192, 201, 220, 234 | Build passed. Title, description and lead confirmed in `dist`. |
| 5 | `c8d1e59` | Dosa vocabulary. One sentence in "How to Order a Customized Dosa": "Every step is customizable, so you mix and match the four choices into your own personalised dosa." | `src/data/pages.js` | SEO-P02, 059, 060, 061, 062 | Build passed. Sentence in `dist/menu/dosa/index.html`. |
| 6 | `23b7a48`, `4fedc63` | Footer text link "Brihadhee restaurant, Anna Nagar East" to `/` on every page. The About name section gets one sentence with the spellings Brihadee, Brihadhi, Brahadhee and Bruhadhee, and the Tamil பிரிஹாதீ in `lang="ta"`. The follow-up commit applies the section's paragraph style. | `src/components/Footer.astro`, `src/pages/about.astro` | SEO-001, 002, 008 (link). SEO-024–027 (variants). | Build passed. Internal links went from 1749 to 1769. Screenshot of About at 360 px checked. |
| 7 | `6cc5e9c` | Heading hygiene. Catering H1s and H2s now read "Pure Vegetarian" instead of the mixed "Pure vegetarian", via a heading-only `CDtitle`. Body copy unchanged. | `src/data/catering.js`, `src/data/spokes.js` | Catering pages (SEO-P06–P11) | Build passed. All 5 headings confirmed in `dist`. |
| 8 | `a752f3c` | `/book-a-table/` title changed from "Book a Table at Brihadhee, Anna Nagar East" (42) to "Brihadhee Table Booking \| Pure Veg Restaurant, Anna Nagar" (57). | `src/pages/book-a-table.astro` | SEO-018, 146, 147 | Build passed. |

## Technical checks (all on the final build)

| Requirement | Result |
|---|---|
| Every tracker target URL and `#anchor` resolves | **Pass: 566 of 566** targeted rows. Each built page exists, is self-canonical, has no noindex and is listed in `sitemap.xml`. Every anchor id is present, and each sits on a `<section>` with an H2 or an FAQ `<details>` with an H3. |
| Titles and descriptions | All 17 target pages have unique titles of 50–60 characters and descriptions of 136–154. |
| One H1, no skipped levels | Pass (`verify` check 1 and the 360 px render) |
| Mobile | Pass. No horizontal overflow at 360 px on the 11 changed pages. |
| Alt text | Pass. Every `<img>` has alt (`verify` check 7). |
| Catering ↔ quote links | Already in place. Each of the 4 catering pages links to `/catering-quote-chennai/` 1–6 times, and the quote page links back 2–5 times. |
| Home → `/menu/` → dish pages | In place: home links to `/menu/`, and `/menu/` links to `/menu/dosa/`, `/menu/nellai-meals/` and `/parotta-anna-nagar/`. |

## Skipped, with reason

| Item | Reason |
|---|---|
| robots.txt | No technical issue found. The AI-crawler rules are left for Step 6, as instructed. |
| sitemap.xml | Already correct: 18 canonical 200 URLs, with `/privacy/` excluded. |
| Apex redirect chain (`http://brihadhee.com` takes 2 hops) | It's a Vercel domain setting, not repo code. Owner or developer, in the Vercel dashboard (roadmap 3.10). |
| No-slash duplicates (`/menu`, `/about`, `/index.html` return 200) | Each declares the slash URL as canonical. Changing Vercel routing is riskier and the implementation report says to watch GSC first. |
| Hero `fetchpriority="high"` and lazy loading | **Audit correction:** the "6 eager images" on home were wrong. Slides 2–6 sit in `<template>` and aren't fetched at load. The first slide is the likely desktop LCP image, so changing its priority without Lighthouse data would be a guess. |
| `inlineStylesheets: "always"` → `"auto"` | Needs before and after Lighthouse numbers. PSI hit its quota on 16 Nov. `astro.config.mjs` also has unrelated uncommitted line-ending changes. |
| Image weight | Already WebP with srcset, 33–72 KB. Nothing to change. |
| hreflang | No translated pages exist, so none was added. |
| "customisable" / "customisation" (SEO-061, 062) British spellings, and "unique" (SEO-064) | Google treats the s/z spellings as equivalent, and adding both would read as stuffing. "Unique dosa" is a comparative claim, so it was left out. |
| Area names (SEO-262 Annanagar, 267 Aminjikarai, 268 Kilpauk, 271 Mogappair) on `/about/#find-us` | Directions and distances aren't verified. Waiting on Q35 or verified directions. |
| Spelling variants in alt text | Alt text describes images. Variants went in the About text instead, which is more natural. |
| Schema (roadmap 4.x) and answer blocks (5.x) | Out of scope for Step 3. |

## Tracker issues logged (site not changed for these)

- `/catering-services-chennai/#faq-does-brihadhee-cater-outside-anna-nagar` resolves, but the question under it now reads "Where can I find vegetarian catering in Anna Nagar?". The id is an older slug. Keep it, since it's referenced by SEO-P07 and one other row.
- Five P1 rows target fragments (`/#coffee-bar`, `/menu/dosa/#how-it-works` and others). Google reports at URL level, so measure the URL and note the anchor. See `03-page-proposals.md` P-01.
- Duplicates, SOURCE_NOTE fragments, priority `HOLD` and the `ANSWERED` status are as listed in `01-audit.md` finding 10. The tracker was not edited in this step.

## Next

1. Merge and release.
2. Search Console URL Inspection for `/`, `/menu/`, `/about/`, `/catering-services-chennai/` and `/book-a-table/` (changed titles).
3. Measure from Anna Nagar 2 weeks later (`02-measurement-plan.md`).
