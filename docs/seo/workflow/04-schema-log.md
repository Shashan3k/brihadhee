# 04 Schema log

Step 4, 16 November 2026, branch `seo-aeo-geo`. Not deployed.

## Sources checked first

- **Google Search Central structured-data changelog:** FAQ rich results stopped appearing on **7 May 2026**, and the FAQPage documentation was removed on **15 June 2026**.
- **Google local business docs:** `name` and `address` are required. `geo` (5+ decimals), `openingHoursSpecification`, `telephone` with country code, `servesCuisine`, `menu`, `priceRange`, `url` and `image` are recommended. `review` and `aggregateRating` are only for sites that review *other* businesses.
- **Google Article docs:** nothing is required. Recommended: `headline`, `image`, `datePublished`, `dateModified`, `author`. Dates in ISO 8601.
- **Google structured-data policies:** "Don't mark up content that is not visible to readers of the page."
- **schema.org vocabulary 30.1** (`schemaorg-current-https.jsonld`), vendored as a compact term list in `scripts/data/schemaorg-terms.json`: 939 classes, 546 enumeration members, 1,538 properties with their domains.

## Commits

| Commit | Change |
|---|---|
| `5c9b759` | Restaurant `alternateName` now lists only names shown on the site: பிரிஹதீ plus the spellings on `/about/` (Brihadee, Brihadhi, Brahadhee, Bruhadhee, பிரிஹாதீ), from one list (`NAME_SPELLINGS` in `src/data/site.js`) that also renders the About sentence. Removed "Brihadhee Hotels" and "Brihadhee Pure Veg Restaurant", which appear on no page. Added `logo` and Google's `menu` property. **Removed the Beyond Curry `brand`** until Q26. |
| `28f3225` | **FAQPage no longer emitted.** A new gate, `EMIT_FAQPAGE = false` in `config/seo-gates.ts`, makes `faqPageSchema()` return nothing. The visible Q&A is unchanged on every page (e.g. 11 on `/`, 9 on the catering hub). `aeo-lint`, `verify` check 4 and `validate-schema` now fail if FAQPage appears while the gate is off. The catering rule "visible FAQ questions must be confirmed targets" now runs on the visible questions; I confirmed it rejects an unapproved question. |
| `05cce98` | Article `dateModified` (2026-11-15) is now shown on the page. The guide showed only "Published 12 November 2026", and What's New said "Updated 12 November 2026". Both now read "Published 12 November 2026 · Updated 15 November 2026", from the same `pageContentUpdated()` value as the markup. |
| `bf75555` | **Visible breadcrumbs.** Every inner page marked up a BreadcrumbList that wasn't on the page. `Base.astro` now passes that node to a new `Breadcrumbs.astro`, rendered in `PageHeader`, `/menu/` and `/privacy/`, so the visible trail and the JSON-LD come from one source. The 404 page no longer has a trail pointing at the non-existent `/404/`. Checked at 360 px: the trail sits below the floating header (top 112 px, header bottom 85 px). |
| `608720d` | **New build test** `scripts/schema-visible.mjs`, run in `check:seo` and therefore in `npm run build`. It checks: <br>• every JSON-LD block parses and uses `@context` https://schema.org <br>• every node has an `@type` <br>• every type and property exists in schema.org 30.1 and sits on a type that accepts it <br>• URL properties are absolute https <br>• no AggregateRating, Review, Rating, `review` or `award(s)` <br>• the Restaurant's name, street, postal code, city, phone and hours appear in the visible text (scripts, styles and `<template>` excluded) <br>• every `alternateName` is visible on `/about/`. <br>Its unit tests (`scripts/schema-visible.test.mjs`, in `npm test`, 9 cases) prove each check fails on a broken page, including a real built home page with its phone changed. |
| `76c63c7` | Removed `priceRange` "₹₹". It's owner-verified, but no page shows it. |

## Per-page result (final build)

**Validator columns:**
- *Schema.org*: validator.schema.org with the built HTML posted.
- *Google rules*: offline check of Google's documented required and recommended properties for LocalBusiness, BreadcrumbList and Article.
- *Build test*: `schema-visible`, which covers all 20 pages, 92 nodes.

| Page | Top-level types | Schema.org validator | Google rules (offline) | Notes |
|---|---|---|---|---|
| `/` | Restaurant, WebSite, WebPage, Service (`#catering`) | 0 errors, 0 warnings | Pass | No breadcrumb (home). FAQPage off. |
| `/about/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 | Pass | Spelling variants visible here |
| `/book-a-table/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 † | Pass | `acceptsReservations: true`: the page books through Swiggy Dineout, EazyDiner and District |
| `/menu/` | + Menu (MenuSection, MenuItem, Offer) | 0 / 0 | Pass | Every item and price is visible (`verify` check 3) |
| `/menu/dosa/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 † | Pass | |
| `/menu/nellai-meals/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 | Pass | |
| `/parotta-anna-nagar/` | + ItemList of MenuItem with Offer | 0 / 0 | Pass | 7 visible dishes and prices |
| `/veg-dinner-anna-nagar/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 | Pass | |
| `/family-dining-anna-nagar/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 | Pass | |
| `/faq/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 † | Pass | |
| `/guides/what-are-nellai-meals/` | + Article | 0 / 0 | Pass | Article: headline = H1, image, datePublished 2026-11-12, dateModified 2026-11-15 (visible), author and publisher = Restaurant |
| `/whats-new/` | + Article | 0 / 0 † | Pass | Same Article pattern |
| `/seasonal/karthigai-ayyappa-pure-veg/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 | Pass | Page itself is gated (Q28), so its content is unchanged |
| `/catering-services-chennai/` | + Service (`#service`, Event catering), Service (`#catering`) | 0 / 0 † | Pass | `areaServed` Chennai. Provider = Restaurant `@id`. OfferCatalog without prices. |
| `/corporate-catering-chennai/` | + Service (Corporate catering), Service (`#catering`) | 0 / 0 | Pass | Same |
| `/small-function-catering-chennai/` | + Service (Event catering), Service (`#catering`) | 0 / 0 | Pass | Offers carry `eligibleQuantity` min 50 guests, no price |
| `/event-planner-catering-partner/` | + Service (Event catering), Service (`#catering`) | 0 / 0 † | Pass | |
| `/catering-quote-chennai/` | + Service (`#catering`) | 0 / 0 | Pass | The quote page's subject is the shared catering Service |
| `/privacy/` | Restaurant, WebSite, WebPage, BreadcrumbList | 0 / 0 † | Pass | noindex |
| `/404.html` | Restaurant, WebSite, WebPage | 0 / 0 | Pass | No trail |

† Validated with 0 errors and 0 warnings on the build at `608720d`. The re-run on the final build (`76c63c7`, which only removes `priceRange`) was throttled by validator.schema.org (HTTP 405 after about 25 requests), so these 7 pages weren't re-checked. Removing a property can't add an error, and the offline vocabulary and domain test passes on all 20 final pages.

**Google Rich Results Test was not run.** The code-input test now returns "Something went wrong. Log in and try again" without a Google sign-in, and the changes aren't live for the URL test. Re-run it on the live URLs after deploy: home, `/menu/`, the guide, the catering hub and `/about/`.

## Warnings and their reasons

| Item | Reason it stays |
|---|---|
| The Restaurant node is emitted on every page | One sitewide entity with a stable `@id`. Its name, address, phone and hours are visible on every page (enforced by `schema-visible`). Founders, email and spelling variants are visible on `/about/`. |
| `menu` is superseded by `hasMenu` in schema.org | Google's local business documentation still names `menu`. Both point to `/menu/`, and the test allowlists only this case. |
| Article dates are dates without a time or timezone | Valid ISO 8601. The site records the day, not the time, so adding one would be invented. |
| Article `author` is the Restaurant (an Organization), by `@id` | Google allows Organization authors. The `@id` resolves to a named node in the same graph. No person authored the guide. |
| Menu, MenuItem and Service have no Google rich result | Valid schema.org, and they describe visible content for AI and other parsers. Kept for entity clarity, not for SERP features. |
| `amenityFeature` "Vegetarian" and the description "100% pure vegetarian" | The site already says this on every restaurant page (`RESTAURANT_DIET`). Catering wording follows Q20. |
| FAQPage off | Google retired the feature. The visible Q&A remains for users and answer engines. Set `EMIT_FAQPAGE = true` to restore it; every check still validates it when present. |

## Not done, with reason

- **Roadmap 4.1 (emit the shared `#catering` node only on the hub).** Tried and reverted. The repo's validator requires each page's graph to be self-contained: every referenced `@id` must resolve on the page, and catering pages must carry the shared entity. The node's `url` correctly identifies the hub, and every catering page already has its own Service with its own `url`. The ranking benefit was a guess, so the deliberate integrity rule stays.
- **Beyond Curry on the page.** The schema no longer names it, but the homepage FAQ "What is Beyond Curry by Brihadhee?" is still visible. That's a content decision for Q26 (`owner-questions.md`).
- **`verify` check 8 (preview server).** It timed out on three runs: the preview server measured 40 s to start on /mnt/c, and the script waits 30 s. The same checks were run by hand against a running preview server: all 18 sitemap pages plus robots, both sitemaps, both llms files, `menu.json` and the manifest returned 200, the llms files also with `Accept: text/markdown`, and robots links the sitemap. Checks 1–7 pass.

## Final verification

- `npm run build`: all checks pass, including the new `schema-visible` (92 nodes on 20 pages).
- `npm test`: 30 of 30 passed (21 existing plus 9 new).
- `npm run typecheck`: passed.
- `npm run verify`: checks 1–7 pass. Check 8 was done by hand, as above.

## Skills used

`claude-seo:seo-schema` was loaded: its type-status table and generation rules. It confirmed the FAQ retirement, which I then checked against Google's changelog. `claude-seo:seo-local` (entity and NAP) and `claude-seo:seo-technical` (build gate) also apply. Their checks are covered by `schema-visible` and the existing `verify` NAP check; those skill files were not loaded.
