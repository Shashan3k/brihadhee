# Brihadhee parotta SEO and answer coverage

Reviewed 15 November 2026. This is an implemented local candidate; it has not been deployed. The repository uses **Astro static rendering**, so no Next.js migration or Next.js Image component was appropriate.

The new `/parotta-anna-nagar/` page gives visitors a focused comparison of seven verified parotta dishes, prices, vegetarian salna, directions and six direct answers. The full menu remains the price catalogue, and the dinner page retains its evening dining purpose. Phase 1 Corporate Catering source files and rendered main content are unchanged.

Search Console data and a verified current production crawl were unavailable. Rankings, impressions, clicks, CTR, Google-selected canonicals, indexed-page counts and field Core Web Vitals **cannot be established from repository code**. This work fixes an identifiable content and navigation gap; it does not establish that this gap was the sole cause of weak visibility.

## Audit findings and decisions

Priority describes the implementation or evidence need, not a measured ranking effect.

| Area | Evidence and finding | Decision / result |
|---|---|---|
| 1. Homepage relevance | The homepage already described vegetarian dining, location and parotta at dinner. It had no focused parotta destination. | Added a visible contextual link in the dinner section; preserved the homepage title and its broader restaurant purpose. |
| 2. Menu discoverability | `/menu/` was already reachable through navigation and contained the approved dish catalogue. Parotta guidance linked to the broader dinner page. | Added contextual links to the focused guide and stable HTML anchors for menu dishes. |
| 3. Parotta content | Details were spread between `/menu/#parotta`, the starters category and `/veg-dinner-anna-nagar/`. No dedicated route existed. | P1 content gap addressed with one useful guide covering six main-section dishes, Madras Bhel Parotta from starters, and a separately identified lunch combo. |
| 4. Titles and descriptions | Existing pages had distinct metadata; no evidence that blanket title rewrites were needed. | Added a unique natural title and description for parotta; all 18 existing page titles match the saved baseline. |
| 5. Heading hierarchy | Existing templates provide semantic headings. | New page has one H1, section H2s and dish H3s; generated HTML and browser checks pass. |
| 6. Internal links | The prior parotta intent was split between menu and dinner. | Five pages now link contextually to the guide: homepage, menu, dosa, dinner and FAQ hub. The guide links back to menu, directions, booking and dinner. |
| 7. Canonicals | Shared metadata already used the canonical `https://www.brihadhee.com` origin. | New page self-canonicalizes to `/parotta-anna-nagar/`. No existing URL or redirect was replaced. Production response headers remain unverified. |
| 8. Robots / indexing rules | Repository rules and built metadata do not block the intended public pages. | Existing rules retained; new guide is eligible in the local build. Eligibility is not proof of Google indexing. |
| 9. Sitemap | A new route needs explicit registration in this project's sitemap generator. | Added the guide; final sitemap has 18 candidate URLs. This is not an observed count of indexed URLs. |
| 10. Restaurant / Menu JSON-LD | A shared Restaurant and full Menu already existed. Dish nodes lacked reusable identities. | Added stable MenuItem IDs and URLs. The guide's ItemList reuses exactly the same dish objects as the Menu, with matching names, descriptions, prices and vegetarian diet. |
| 11. Duplication / cannibalization | Menu facts and dinner content overlapped, but no query/page data proved harmful cannibalization. The legacy mixed dosa/parotta route already redirects to dosa. | Kept distinct page purposes; moved three parotta FAQ owners from dinner to the guide. Retained the legacy redirect and added a contextual dosa-to-parotta link. Repeated factual prices are necessary catalogue information, not separate competing landing pages. |
| 12. Rendered HTML | Astro already pre-renders content. | Dish details, links and answers are in HTML before JavaScript. Browser navigation and native FAQ expansion passed with JavaScript disabled. |
| 13. Mobile usability | Requires rendered-page evidence rather than source inspection alone. | Checked 390, 768 and 1440 px layouts: no horizontal overflow, controls fit, logo images load, one H1 and seven dishes. Reviewed saved mobile and desktop screenshots. |
| 14. Images | No verified parotta photographs were found among available site assets. Existing food photographs depicted other dishes. | No substitute or fabricated dish image added. Existing logo dimensions and alt text remain valid. Real dish photography is an owner follow-up. |
| 15. Performance / CWV | Local mobile Lighthouse is available; live field data is not. Shared CSS has unused rules on individual pages. | New page adds no page-specific JavaScript or CSS dependency. Lab results are below. Homepage speed remains a follow-up; local cache/compression warnings do not prove production CDN problems. |
| 16. Local entity | Address, restaurant telephone, hours and landmarks are centralized in `entity-truth.ts`. Restaurant and catering contacts have distinct purposes. | Reused the same entity and restaurant contact. Anna Nagar East, 3rd Avenue, Chennai and Anna Nagar Tower Park are used where useful for a visit. |
| 17. Direct answers | Three useful parotta answers previously lived on dinner; generic hours/location/vegetarian questions already had owning pages. | Added six focused FAQs, including the three relocated questions. General facts also appear naturally in the guide's visit and salna sections without cloning the generic FAQ bank. |
| 18. Prior SEO/AEO/GEO work | Reviewed repository audits, keyword/route maps, answer coverage, measurement guidance, fact gates and the dated November audit evidence. | Updated working maps and generated reports. Historical crawl observations were not presented as current measurements. |

Live requests to the production site could not be completed from this environment: Node requests encountered DNS or connection-reset failures, a separate curl attempt also reset, and the deployment alias encountered certificate verification failure. The browsing tool could not retrieve the requested pages either. These observations are **inconclusive about public availability**. Independently verify production responses after an approved deployment.

## Page architecture and verified content

**Choice C: improve both the menu and a dedicated guide, with distinct intent.** Seven dish comparisons, verified preparation differences, local visit information and parotta questions justify one guide. No separate near-me, Anna Tower, kothu or “best” doorway pages were created.

| Page | Purpose |
|---|---|
| `/` | Restaurant introduction and normal discovery links to the menu and guide. |
| `/menu/` and `/menu/#parotta` | Full approved menu and prices. Individual dishes now have stable `#dish-...` anchors. |
| `/parotta-anna-nagar/` | Vegetarian parotta choices, salna distinctions, prices, visit information and direct answers. |
| `/veg-dinner-anna-nagar/` | Evening meal choices and hours; links to the parotta guide for detailed comparisons. |
| `/about/#find-us` | Detailed location, directions and contact ownership. |
| `/book-a-table/` | Existing table booking options. |

The new page title is **Vegetarian Parotta in Anna Nagar | Brihadhee Chennai**. Its H1 is **Vegetarian Parotta in Anna Nagar**. Sections cover vegetarian parotta varieties, vegetarian salna, finding the restaurant in Anna Nagar East, and frequently asked parotta questions. Directions and call actions are available near the introduction and in the visit section. Shared metadata supplies canonical, Open Graph and social metadata.

The approved source is `src/data/menu-canonical.ts`, transcribed from the client's `new menu.pdf` received 11 November 2026. The canonical file retains previously approved descriptions for unchanged dishes and leaves unverified descriptions empty. No price was estimated. Prices below exclude **5% GST**; parcel charges are extra. Availability on a particular visit should be confirmed with the restaurant.

| Confirmed dish | Price | Published preparation evidence |
|---|---:|---|
| Parotta Salna (2 pcs) | ₹120 | Flaky parottas with salna and thokku. |
| Special Kothu Parotta | ₹195 | Shredded parotta with paneer, mushroom and special masala. |
| Paanai Parotta | ₹270 | Parotta layered with salna, paneer and mushroom, slow-cooked in a sealed pot. Uses the established canonical spelling. |
| Madurai Salna Parotta | ₹210 | Parottas with spicy Madurai-style salna. |
| Chilli Parotta | ₹230 | Shredded parotta with onions, capsicum and sauces. |
| Special Pottalam Parotta | ₹230 | Name, price and vegetarian status verified. Preparation and ingredients are not documented; the page asks visitors to check with the restaurant. No invented recipe or schema description. |
| Madras Bhel Parotta | ₹245 | From starters: parotta pieces with Madras-style mixture and salna. |
| Kothu Parotta & Lemon Kothu Idiyappam Combo | ₹179 | Separately identified dine-in lunch-only combo; not counted as an additional standalone parotta variety. |

Restaurant facts remain: Brihadhee, Anna Nagar East, Chennai; 3rd Avenue near Anna Nagar Tower Park; daily **11 AM–11 PM**, lunch and dinner; restaurant phone **+91 73587 14113**. The complete existing address remains in the shared footer/entity and the directions page. Catering keeps its separate contact and service identity.

## Answer coverage and structured data

The six visible FAQ questions cover where to get vegetarian parotta in Anna Nagar, whether Brihadhee serves parotta, where to get Paanai Parotta in Chennai, its preparation, veg kothu parotta in Anna Nagar, and vegetarian salna. The Paanai location, Paanai preparation and kothu questions moved from dinner to this route.

The other requested customer questions are answered in normal page content: varieties and prices in the dish list, vegetarian restaurant status in the salna section, and location, Anna Tower proximity and opening hours in the visit section. This avoids copying the location and hours FAQ bank from other pages. Native HTML `<details>` keeps answers usable without JavaScript.

The guide graph contains Restaurant, WebSite, WebPage, BreadcrumbList, ItemList and visible-content FAQPage. It references the existing restaurant ID `https://www.brihadhee.com/#restaurant`. Restaurant is already the specific local-business type; an extra competing LocalBusiness entity was unnecessary. MenuItem IDs point to real dish anchors on `/menu/`; the full Menu remains owned there. A build check now compares every guide dish against the approved source, visible text and full Menu node, including price, currency, diet and identity.

No reviews, aggregate ratings, awards, rankings or customer endorsements were added. Structured data describes actual content; it does not guarantee a search appearance. See [Google's Local Business structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Existing `llms.txt` and its full variant now include the guide and its current answer set. This is an accurate additional discovery surface, not a guaranteed ranking signal. The implementation relies on accessible pages, useful text, crawlable links and consistent facts. Google's AI search guidance also centers ordinary SEO eligibility and helpful content, without requiring special AI markup: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

## Keyword ownership

All nine requested terms have one primary destination: `https://www.brihadhee.com/parotta-anna-nagar/`. “Best” phrases are research and measurement targets only; none is asserted as a business ranking.

| Target query | Primary route | Measurement note |
|---|---|---|
| best parotta in Anna Nagar | `/parotta-anna-nagar/` | Main target; independent search outcomes determine ranking. |
| best veg parotta in Anna Nagar | `/parotta-anna-nagar/` | Track separately and within the vegetarian parotta cluster. |
| best parotta in Anna Nagar East | `/parotta-anna-nagar/` | Local qualifier; no separate location page. |
| best vegetarian parotta in Chennai | `/parotta-anna-nagar/` | Wider city intent; no unverified citywide superiority claim. |
| best kothu parotta in Anna Nagar | `/parotta-anna-nagar/` | Supported by the verified Special Kothu Parotta offering. |
| veg parotta near me | `/parotta-anna-nagar/` | Results depend on the searcher's location; record the location for manual observations. |
| parotta restaurant in Anna Nagar | `/parotta-anna-nagar/` | Local restaurant discovery. |
| parotta near Anna Tower | `/parotta-anna-nagar/` | Supported by the confirmed landmark. |
| South Indian parotta in Anna Nagar | `/parotta-anna-nagar/` | Local cuisine intent. |

The full menu supports item/price lookups. Dinner-specific searches stay on the dinner page. Paanai, salna and general parotta questions point to the guide. The working keyword tracker now contains 845 data rows, including eight newly added secondary targets; the answer-coverage file retains its 299 rows. Existing approval-gated topics and unrelated keywords were preserved.

## Actual verification

| Check | Result |
|---|---|
| `npm run build` | Passed: 20 pages generated and all chained checks passed. Log: `build-and-check.log`. |
| Project facts/claim checks | Passed: 23 files in SEO guardrails; 27 files in fact checks; 11 pending facts remain guarded. |
| Structured data validation | Passed: 110 JSON-LD nodes across 20 pages, including the new dish identity comparisons. |
| AEO lint and SEO checks | Passed: AEO checked 20 pages; SEO checked 19 pages, 18 sitemap entries, zero warnings. |
| Compliance checks | Passed: 28 files, 35 content rules and seven gated-claim rules. |
| Internal links | Passed: 1,748 internal links across 20 pages; 13 priority pages meet the three-source-page rule. The new guide has five contextual source pages. |
| `npm run typecheck` | Passed (`tsc --noEmit`, the repository's configured scope). |
| `npm test` | Passed: 21 tests, zero failures. |
| `node scripts/verify-seo-aeo-geo.mjs --no-server` | Passed: generated-page, menu, metadata, entity, Q&A, schema, link and image checks. |
| Responsive/browser QA | Passed at 390, 768 and 1440 px; no-JavaScript content, navigation and FAQ interaction passed. No page JavaScript errors observed. |
| Corporate Catering regression | Saved source hashes and rendered `<main>` match. Navigation, previous/next controls, keyboard navigation and reduced motion passed at 390 and 1440 px. |
| Existing title regression | All 18 previously recorded page titles preserved. |
| Diff hygiene | `git -c core.whitespace=cr-at-eol diff --check` passed, accounting for the repository's existing Windows line endings. |

The project has no separate generic ESLint script; its AEO lint, facts, compliance and SEO validators ran through `npm run build`. External links were not certified: the internal-link command explicitly skipped fetching 22 external destinations. Production redirects, CDN behavior, Search Console indexing and Google's hosted structured-data tools remain external checks.

Local mobile Lighthouse results are recorded in `lighthouse-results.json`. These are single lab runs with Lighthouse 13.3.0, simulated mobile throttling and 4× CPU slowdown, served from an uncompressed local static server. They are not production field measurements, ranking scores or proof of accessibility for every user.

| Page | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 82 | 100 | 100 | 3.85 s | 0 | 195 ms |
| Full menu | 94 | 100 | 100 | 2.72 s | 0 | 151 ms |
| Parotta guide | 98 | 100 | 100 | 2.44 s | 0 | 53 ms |

Shared CSS and small logo-image savings remain lab opportunities. The homepage's loading result warrants follow-up using a production network trace and field evidence. Compression/cache findings are affected by the local server; they were not used to justify changing unrelated production configuration or the Phase 1 stylesheet. TBT is a lab metric, **not INP**. LCP, INP and CLS field data should be evaluated separately when available, as described in [web.dev's Core Web Vitals guidance](https://web.dev/articles/vitals).

## Remaining external actions and indexing checklist

No production deployment, Search Console submission or Google Business Profile edit was performed.

The owner should supply authentic photos of the actual parotta dishes and confirm Special Pottalam Parotta's ingredients/preparation before more detail is published. Keep the central menu current as prices or availability change. Photography can then be sized, compressed, given factual alt text and attached to the corresponding dish without implying popularity or awards.

For Google Business Profile, compare the public name, address, map pin, restaurant phone, daily and special hours, menu URL, website and actual categories against the approved facts. Add real current dish photos and menu information where appropriate. Encourage genuine customer feedback without incentives or prescribed claims. GBP access was unavailable; no changes were made. Local visibility also depends on relevance, distance and prominence, beyond an on-site page: [Google's local ranking guidance](https://support.google.com/business/answer/7091).

After an authorized deployment, the site/Search Console owner should complete this checklist:

- [ ] Confirm the approved commit is deployed and the new canonical page returns HTTP 200 from an independent network. Verify HTTPS, apex/www and trailing-slash redirects without loops.
- [ ] Check the actual response for restrictive `X-Robots-Tag`, meta robots or robots.txt rules. Confirm visible dish content, canonical and Open Graph URL in the deployed HTML.
- [ ] Confirm `https://www.brihadhee.com/sitemap.xml` includes the new canonical once, and excludes redirect and intentionally non-indexed URLs. The local candidate contains 18 eligible sitemap entries.
- [ ] Use a verified `brihadhee.com` Domain property or the matching `https://www.brihadhee.com/` URL-prefix property. Check manual actions and security issues before attributing a problem solely to content.
- [ ] Inspect the new URL and compare the indexed result with **Test live URL**. Review crawl permissions, fetch status and rendered content. Once indexed, check that Google's selected canonical agrees with the declared canonical.
- [ ] Run Google's Rich Results Test for supported markup and a schema validator for the ItemList/MenuItem graph. Inspect names, prices, identity and visible-content agreement; do not expect an ItemList or restaurant FAQ enhancement merely because JSON-LD parses.
- [ ] Request indexing once for the ready canonical page and submit or resubmit the sitemap where needed. Record the request and submission dates; submission is not confirmation of indexing.
- [ ] Inspect the menu and dinner pages after their next crawl to confirm their changed links and answer ownership are visible. Review the Page indexing report for exclusions, duplicates and discovered/crawled-but-not-indexed cases.
- [ ] Export the baseline and subsequent performance windows described below. Track the new URL alongside the menu and dinner URLs to observe which page receives each query.
- [ ] Record actual indexed URLs and field Core Web Vitals when data is available. Low-traffic URLs may lack sufficient field samples; report that explicitly.

The indexed and live inspection reports answer different questions; a successful live test does not guarantee indexing. [Google URL Inspection documentation](https://support.google.com/webmasters/answer/9012289) explains these limits and canonical inspection.

## 30/60/90-day measurement plan

Day 0 is the actual authorized deployment date, not this report date. Before publishing, export the most recent 28 complete days of available Search Console data. Use Web search, India, and separate mobile/desktop views; also retain an unfiltered site total for context. Keep query and page filters consistent. Record later menu, site, GBP or campaign changes so they do not get mistaken for effects of this page alone.

| Metric | Definition and recording |
|---|---|
| Search impressions | GSC impressions for each of the nine exact targets, a broader parotta/porotta query family, and the relevant pages. Keep brand and non-brand clusters separate. |
| Organic clicks | GSC clicks in the same windows, query filters and device segments. Compare the guide, full menu and dinner page plus their combined cluster. |
| CTR | Clicks divided by impressions for the selected window/filter. Use the combined totals; do not average row percentages. Compare similar query and position groups before changing snippets. |
| Average query position | GSC average position for the same queries and segments. Treat it as a diagnostic average over impressions, not a single fixed local rank or a promised target. |
| Indexed pages | Observed indexed canonical URLs from URL Inspection/Page indexing, with date and exclusion reason. Record the guide's state separately from the site's total and from the 18 sitemap candidates. |
| AI answers | A separate fixed prompt panel per available engine: Google AI surfaces, ChatGPT Search, Gemini and Perplexity. Record date, engine/mode, locale, exact prompt, brand mention, linked citation URL and factual accuracy. Preserve evidence; record unavailable or failed attempts separately. |

Search Console query exports can omit anonymized or sparse queries, so query rows may not sum to page/site totals. Preserve the distinction and avoid claiming zero demand from a missing query row. Use [Google's performance report guidance](https://support.google.com/webmasters/answer/7576553) when interpreting totals and filters.

For the AI panel, use the nine target phrases plus the six published parotta questions. Run the same available panel at baseline and each review; use fresh sessions and the same locale/mode. Report **mention rate = responses mentioning Brihadhee / successfully collected responses** and **citation rate = responses linking Brihadhee / successfully collected responses**, by engine. Keep citation accuracy and broken/wrong links as separate fields. These controlled observations are variable samples, not a search ranking or a measure of every user's answers. Google AI-related traffic reported within Web search should not be relabeled as separately attributable AI traffic without supporting data.

| Review | Work and comparison | Decision rule |
|---|---|---|
| Day 30 | Confirm fetch/index/canonical status; compare the first complete 28-day post-release window with the pre-release window. Record impressions, clicks, CTR, position, indexed pages and the separate AI panel. | If the guide is not indexed, investigate the reported exclusion and production fetch evidence before rewriting content. If indexed with sparse data, retain the baseline and collect more evidence. |
| Day 60 | Compare a second complete 28-day window against both baseline and the prior window. Review query-to-page distribution, device results, real photo availability, CTR by query/position group and factual accuracy of AI citations. | If relevant impressions grow but clicks lag at comparable positions, review title/snippet fit and intent. If menu and guide alternate for the same queries, inspect their actual value and signals before consolidating; multiple URLs alone do not prove harm. |
| Day 90 | Compare the latest complete 28-day window with baseline and both prior windows. Review sustained cluster clicks, query coverage, indexed URLs, field CWV if available, and separate per-engine mention/citation observations. | Keep improvements supported by sustained data. If visibility remains weak despite eligibility and useful content, investigate local prominence, GBP accuracy, competitive relevance and customer evidence; do not mass-produce pages. Plan the next bounded change with a dated baseline. |

The working hypothesis is that a clearer parotta destination and consistent links improve discovery and query matching. A canonical/indexing failure, no relevant impressions after crawl, or query evidence favoring the existing menu would require revisiting that explanation. No first-page, ranking, traffic or AI-citation outcome is guaranteed.

## Files changed or created in this parotta phase

Paths below are relative to the repository root. Existing unrelated working-tree files were left alone.

| File | Status / purpose |
|---|---|
| `src/data/parotta.js` | Created: verified dish selection and six owned answers. |
| `src/pages/parotta-anna-nagar.astro` | Created: static guide and page graph. |
| `src/data/site.js` | Modified: route and reviewed-page registration. |
| `src/data/pages.js` | Modified: home/dinner links, relocated parotta FAQs and clearer remaining dinner answer. |
| `src/data/spokes.js` | Modified: FAQ hub discovery link. |
| `src/lib/schema.js` | Modified: reusable MenuItem IDs/anchors, dish ItemList, primary-content relationship. |
| `src/lib/llms.js` | Modified: guide directory entry and canonical parotta answers. |
| `src/pages/menu.astro` | Modified: guide links and actual dish anchor IDs. |
| `src/pages/menu/dosa.astro` | Modified: contextual guide link and route comment. |
| `src/pages/veg-dinner-anna-nagar.astro` | Modified: contextual guide link and ownership comment. |
| `src/pages/sitemap.xml.js` | Modified: canonical route inclusion. |
| `scripts/check-internal-links.mjs` | Modified: include guide in priority-page linking checks. |
| `scripts/validate-schema.js` | Modified: validate dish-list content/identity against the menu. |
| `docs/seo/keyword-to-page-map.md` | Modified: parotta ownership and removal from a broader mixed cluster. |
| `docs/seo/route-map.md` | Modified: new route, intent and schema mapping. |
| `docs/seo/keyword-tracker.csv` | Modified: updated relevant targets and eight secondary-query rows. |
| `docs/seo/aeo-coverage.csv` | Modified: relevant answer targets now use the guide. |
| `docs/seo/aeo-lint-report.md` | Regenerated: current answer/claim validation. |
| `docs/seo/internal-link-matrix.md` | Regenerated: current contextual-link evidence. |
| `docs/audits/2026-11-15-parotta/baseline.json` | Created: original titles and Phase 1 source/rendered-content hashes. |
| `docs/audits/2026-11-15-parotta/verify-browser.mjs` | Created: repeatable loopback/headless browser QA with optional Lighthouse. |
| `docs/audits/2026-11-15-parotta/browser-results.json` | Created: final browser/regression results. |
| `docs/audits/2026-11-15-parotta/lighthouse-results.json` | Created: dated lab scores, metrics and limitations evidence. |
| `docs/audits/2026-11-15-parotta/build-and-check.log` | Created: final build and chained validation output. |
| `docs/audits/2026-11-15-parotta/parotta-390.png` | Created: mobile screenshot. |
| `docs/audits/2026-11-15-parotta/parotta-768.png` | Created: tablet screenshot. |
| `docs/audits/2026-11-15-parotta/parotta-1440.png` | Created: desktop screenshot. |
| `docs/audits/2026-11-15-parotta/PAROTTA-SEO-REPORT.md` | Created: findings, implementation inventory, verification and measurement plan. |

The earlier Phase 1 changes remain in `src/data/catering.js`, `src/pages/[slug].astro`, `src/components/CorporateShowcase.astro` and `src/styles/global.css`. These may appear in the overall working-tree diff, but this parotta phase did not edit them. Their hashes and the corporate page's main content match the saved baseline.

The browser harness uses already installed Puppeteer, Chrome and optional Lighthouse paths supplied as arguments, starts only a local `127.0.0.1:4331` static server, uses an isolated headless profile and closes it afterward. No dependency or lockfile was changed, no customer forms were submitted, and no production action was performed.
