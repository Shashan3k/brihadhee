# 11 Search Console baseline, production check and fixes (17 Nov 2026)

Branch `seo-aeo-geo`, plus a new local branch `hotfix/lead-function` cut from `origin/main`. Nothing was pushed, merged or deployed.

**Inputs**
- The Search Console export `brihadhee.com-Performance-on-Search-2026-11-17.zip`, kept in [`evidence/gsc/2026-11-12_to_2026-11-15/`](evidence/gsc/2026-11-12_to_2026-11-15/).
- Live fetches of https://www.brihadhee.com on 17 Nov, about 20:00–21:00 IST.
- Vercel's own Function builder (`@vercel/node` 31.0.1), run locally.
- Three research notes in [`evidence/2026-11-17/`](evidence/2026-11-17/): result types and competitors, official guidance, and listings.

**Status words used below.** They are never interchangeable.

| Word | Meaning |
|---|---|
| **Code** | Changed and committed locally |
| **Live** | Verified on production |
| **Indexed** | Google shows it in URL Inspection |
| **Improved** | A like-for-like Search Console comparison shows the change |

**Nothing from this step is Live, Indexed or Improved yet.**

## 1. The export, verified

All figures below were recomputed from the CSVs with `node scripts/gsc-segment.mjs <folder>`.

| Check | Result |
|---|---|
| Date rows | **Four only: 12, 13, 14 and 15 Nov 2026**, although `Filters.csv` says "Last 7 days". This is not a weekly or monthly trend. |
| Totals (`Chart.csv`, by property) | 33 clicks, 1,537 impressions, CTR 2.15%. Daily clicks were 13, 9, 9 and 2. Four days are too few to call a direction. |
| `brihadhee` | 22 clicks, 254 impressions, position 1.48 ✔ |
| `veg restaurants in anna nagar` | 0 clicks, 88 impressions, position 17.69 ✔ |
| `restaurants in anna nagar` | 0 clicks, 110 impressions, position 34.86 ✔ |
| `brihadhee menu` | 0 clicks, 78 impressions, position 3.28 ✔ |
| Mobile | 18 clicks, 1,450 impressions, position 13.84 ✔ |
| Desktop | 15 clicks, 80 impressions, CTR 18.75%. These are mostly brand searches. |
| Countries | India: 1,529 impressions, 33 clicks. Six other countries: 8 impressions. |
| Query-row coverage | 1,095 of 1,537 impressions (71%) and 28 of 33 clicks. The rest are anonymized queries, which count in the totals only. |
| Page rows | Pages are aggregated by page, so they add up to 1,690, more than the property total. That is expected, not an error. |
| Property type | The export lists both `http://www.` and `https://www.` URLs, so it is probably a Domain property. Unverified until someone with access confirms it. |

**What the export cannot tell us:** which URL appeared for which query. Search Console's Queries and Pages tabs are separate aggregates. One bound does follow from the arithmetic. Each search counts at most once for a given page, and `/` had 1,528 impressions against the property's 1,537. So **the homepage appeared in at least 99.4% of searches**. The query-plus-page view (section 9) is still needed before saying which page served which query.

### Segments (query rows only)

| Segment | Queries | Clicks | Impressions | CTR | Weighted position |
|---|---|---|---|---|---|
| Branded (brihadhee, brihadee, bradhi, bragathi, beyond curry) | 14 | 26 | 416 | 6.25% | 2.2 |
| **Non-branded** | 166 | **2** | 679 | **0.29%** | 22.4 |

The weighted position is an impression-weighted average of query averages, used for comparison only. Search Console defines position as the topmost position of any site link.

## 2. Keyword-to-page map (clusters from `scripts/gsc-segment.mjs`)

| Cluster | Page meant to answer it | Impressions | Clicks | Weighted position | Pages listed for that URL in the export |
|---|---|---|---|---|---|
| Veg restaurant in Anna Nagar | `/` | 319 | 1 | 17.7 | `/` (1,528 impressions) |
| Brand: name and location | `/` | 312 | 26 | 1.5 | `/` |
| Restaurants in Anna Nagar (any cuisine) | `/`, low fit (list intent; Maps decides) | 223 | 0 | 35.4 | `/` |
| Brand: menu | `/menu/` | 79 | 0 | 3.3 | `/menu/` (99 impressions, position 4.18) |
| Lunch and meals | `/menu/nellai-meals/` | 44 | 1 | 12.7 | **none**. The redirected legacy URL `/nellai-meals-south-indian-veg-anna-nagar/` got 3 impressions. |
| South Indian restaurant | `/` | 37 | 0 | 11.3 (4.2–8 for the Anna Nagar phrasings) | `/` |
| Brand: reviews, photos, offers | `/` (reviews link out to Google Maps) | 25 | 0 | 8.4 | `/` |
| Near me | `/`, Business Profile | 10 | 0 | 5.8 | – |
| Dosa | `/menu/dosa/` | 9 | 0 | 9.7 | **none** |
| Not a fit: non-veg or other cuisines | none | 10 | 0 | 31.5 | – |
| Not a fit: breakfast or tiffin | none (lunch and dinner only) | 7 | 0 | 9.1 | – |
| Family | `/family-dining-anna-nagar/` | 3 | 0 | 52.0 | **none** |
| Parotta | `/parotta-anna-nagar/` | 2 | 0 | 11.0 | **none** |

Catering has no queries in this window. Its pages had 5 impressions in total.

**Probable AI-feature rows (unverified).** Several one-impression queries sit at exactly position 1.0 and read like conversational or follow-up prompts: "give me more option", "do any restaurants have deals today", "best veg restaurants in anna nagar with price", "meals under 200". Search Console gives every link in an AI Overview the Overview's single position, and it counts an AI Mode follow-up as a new query (help 7042828). These rows are consistent with Brihadhee being cited in AI features for price-qualified questions. The export can't confirm it: the Search appearance file is empty, and AI Mode is mixed into Web. The Generative AI report (impressions only, all sites since 31 Aug 2026) is the place to check.

## 3. What production is (verified 17 Nov)

| Item | Finding |
|---|---|
| Deployed code | `origin/main` at `69d9e42` (client logos, new favicon). `last-modified: Tue, 17 Nov 2026 14:55:57 GMT`. **None of this branch's 37 commits are live.** The export therefore measures `main`, not the branch work: live HTML still has FAQPage JSON-LD, "Beyond Curry" on the homepage and no `#facts` section. |
| Branch vs live | Local `main` was 7 commits behind `origin/main`. `git merge-tree origin/main seo-aeo-geo` merges **cleanly**. |
| Status, canonical, robots | All 18 sitemap URLs return 200, are self-canonical and `index, follow`. `/privacy/` is excluded. |
| Redirects | `http://www.` 308 → `https://www.`. The apex takes 2 hops (308, 308) to www. The legacy `/nellai-meals-south-indian-veg-anna-nagar/` 301 → `/menu/nellai-meals/`. HSTS is 2 years. The `http://` and legacy rows in Search Console are therefore Google catching up, not live faults. Google treats 301 and 308 alike and says a move can take weeks. |
| Crawler user agents | 200 on `/`, `/menu/`, `/about/` and `/llms.txt` for Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, GPTBot (one timeout, 200 on retry), PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot and Claude-User. This tests user-agent rules only, not IP-verified bot rules in the Vercel Firewall. |
| **Enquiry forms** | **`/api/lead` returns 500 `FUNCTION_INVOCATION_FAILED` for every request.** That includes GET (which should be 405) and an empty POST (which should be 422). Every catering-quote and enquiry form submission fails. Section 5 has the cause. |
| **Analytics** | **None loads.** GA4 and Meta Pixel are fully coded, including `click_call`, `click_whatsapp`, `directions_click`, `book_table_click`, `catering_quote_submit` and `restaurant_enquiry_submit`, but they load only when `PUBLIC_GA4_ID` or `PUBLIC_META_PIXEL_ID` is set in Vercel, and live HTML has neither. **No enquiry, call or WhatsApp click can be counted today.** |
| Core Web Vitals | **Not measured.** The public PageSpeed API returned 429 (daily quota) again. There's no API key on this machine. |
| Page weight | `public/images/clients/nestle.png` is **1,160 KB** (1582×994). It's shown about 61 px tall in the strip near the top of `/corporate-catering-chennai/`, live since 17 Nov. |

## 4. Three most likely causes of weak non-branded visibility

1. **Google surfaces almost only the homepage. Inner pages look unindexed or unranked.**
   - Evidence: `/` was in at least 1,528 of 1,537 searches.
   - 11 of the 18 sitemap URLs had **zero** impressions. That includes pages whose topics appear in the export: lunch (44 impressions went to `/` or nowhere), dosa, parotta, family and dinner.
   - A redirected legacy URL and the `http://` homepage still collected 37 impressions, so Google's index still reflects older URL states.
   - The export has no rows before 12 Nov, the day after the github.io copy (which the pages declared as canonical until the fix reached production) was turned off. That fits impressions previously going to the old canonical, but it is not proven.
   - **Confidence: medium-high** that the inner pages aren't competing. The root cause needs the Page Indexing report and URL Inspection (section 9).
2. **Local results are decided by the Business Profile and directories, and Brihadhee's off-site entity is inconsistent and unlinked.**
   - Evidence: Google's local ranking help names relevance, distance and prominence (reviews and links).
   - For six local queries, WebSearch on 17 Nov returned no restaurant's own site; 71–88% of results were aggregators or listicles. That isn't a Google results page, so it shows result *types*, not Google rankings.
   - The 17 Nov listing check found:
     - no listing links to brihadhee.com;
     - none shows +91 73587 14113 as its call number;
     - EazyDiner says "serves both veg and non veg food" and opens at 06:30;
     - magicpin shows 11:30 AM–2:00 PM;
     - Swiggy Dineout has a wrong address.
   - **Confidence: medium.** No Business Profile data or Anna Nagar SERP capture exists yet.
3. **The largest generic cluster doesn't fit a single pure-veg restaurant, and the clusters that do fit already do better.**
   - "Restaurants in Anna Nagar (any cuisine)" is 223 impressions at 35.4. It is list intent, and many of those searchers want non-veg. Another 17 impressions are non-veg, other-cuisine or breakfast searches.
   - The qualified clusters rank better: South Indian Anna Nagar phrasings at 4.2–8, lunch 12.7, veg restaurant 17.7.
   - So the 0.29% non-branded CTR partly reflects unwinnable impressions. The KPI should track qualified clusters (section 8).
   - **Confidence: high for the arithmetic, medium for the interpretation.**

Not a cause: on-page relevance of the homepage. Its title, H1 and lead already say "Pure Veg South Indian Restaurant … Anna Nagar (East)". The technical state is clean (section 3).

## 5. Fixes made in this step

| Commit | Branch | What and why | Status |
|---|---|---|---|
| `e973d94` | seo-aeo-geo | **`/api/lead` fix.** Production's Function fails to load. Vercel's builder compiles `src/data/entity-truth.ts` to `.js` but keeps the `.ts` import specifier in `api/lead.js`, so the bundle throws `ERR_MODULE_NOT_FOUND`. I reproduced this with `@vercel/node` on a clean export of `origin/main`. It started with the 14 Nov release (`9a4fc23`, the first version that imports `.ts`); the 12 Nov version bundles and loads. The fix adds `src/data/contact-numbers.js` (plain JS, the dining number is still typed once) and points `api/lead.js` at it. `scripts/check-functions.mjs` now runs in `npm run check`, so Vercel's build fails if a Function reaches a `.ts` import again. A new test keeps the numbers equal to `entity-truth.ts`. | Code |
| `ce535e4` | **hotfix/lead-function** (from `origin/main`) | The same fix applied to `origin/main`. A cherry-pick conflicts in `entity-truth.ts` only because the branch also edits that file. **Ship this first; it doesn't need the SEO branch.** | Code |
| `4de5d17` | hotfix/lead-function | `nestle.png` 1,160 KB → 10 KB (400×251, 256-colour dithered, visually unchanged at display size). It goes on the hotfix branch because the file is tracked only on `origin/main`. | Code |
| `e4356d4` | seo-aeo-geo | **Homepage title kept as live:** "Brihadhee \| Pure Veg South Indian Restaurant, Anna Nagar". Step 3 (`a979b6e`) had renamed it "…South Indian Dosa Restaurant" on the strength of the Kaniyakulam sample, which `01-audit.md` rules out as a baseline. The live wording now has real data: positions 1–2.6 for brand plus Anna Nagar, 4.2–8 for South Indian Anna Nagar phrasings. **Price row** added to the homepage at-a-glance box: "Dishes ₹35 to ₹315 on the current menu, meals ₹150 to ₹240, before 5% GST". This is the FAQ's wording, computed from `menu-canonical.ts`. It answers the price-qualified searches that reach the homepage. | Code |
| `ebde095` | seo-aeo-geo | The export saved as evidence; `scripts/gsc-segment.mjs`; 8 dated listing rows in `docs/geo/corrections-log.csv`. One of those rows supersedes the 12 Nov "confirmed primary" note on +91 94442 24999, which predates owner direction J. | Code |

**Deliberately not done, with reasons:**
- **No new pages:** no Anna Nagar variant pages and no "best" pages. Existing pages already map to every qualified cluster; they need indexing, not duplicates.
- **No homepage copy rewrite.** Relevance isn't the bottleneck (cause 1).
- **No change to `/menu/` metadata for "brihadhee menu".** Its title and description already say "Brihadhee Menu and Prices / menu with prices". No Google snippet could be captured (no SERP access), and the query-to-URL mapping is unknown. Third-party Brihadhee menus are image-only, except Zomato's order page, whose prices are higher than the dine-in menu. The levers are the Business Profile menu link and a query-plus-page export.
- **No llms.txt changes.** Google says it ignores the file.
- **No FAQ markup.** FAQ rich results ended on 7 May 2026, and the branch already drops FAQPage.
- **No `priceRange` schema.** It would sit on all 20 pages while the range shows on three.
- **No AggregateRating** (CLAUDE.md).
- **No line about Zomato's higher prices.** It touches gated delivery and Zomato topics (Q25).
- **No trailing-slash or apex redirect change.** There's no evidence of harm; the apex chain is two hops.

## 6. Verification

Commands were run with the official Node v24.22.3; WSL's Node can't load `.ts` files.

| Check | seo-aeo-geo (working tree) | hotfix/lead-function |
|---|---|---|
| `npm test` | **34/34 pass** (33 before, plus the new phone parity test) | lead tests **13/13 pass** |
| `npm run typecheck` (`tsc --noEmit`) | **pass** | **pass** |
| `npm run build` (Astro + 10 checks: functions, guardrails, facts, schema, schema-visible, AEO lint, check-seo, compliance, links, link matrix) | **pass** | **pass** |
| `check:functions` on production code | **fails as expected** ("api/lead.js imports ../src/data/entity-truth.ts") | – |
| Vercel bundle of `api/lead.js`, executed | **GET 405, `{}` POST 422, valid lead without email env 503 + `tel:+919444224999`** | **same** |
| Vercel bundle of production `api/lead.js` | `ERR_MODULE_NOT_FOUND` (matches the live 500) | – |
| Built homepage | Title restored; og:title matches; H1 unchanged; price row equals the FAQ and `/menu/` | – |
| 360 px render of the homepage | 0 px horizontal overflow | – |
| `npm run verify` | **Not run this step.** It needs the preview server (`09-final-review.md` open item 6). The build runs all 10 checks. | – |
| Rich Results Test, PageSpeed, CrUX, live crawler tests from Google's IPs | **Not run.** They need a deploy, a Google sign-in or an API key. | – |

**Release candidate.** In a throwaway detached worktree (nothing committed, no branch moved), I merged `hotfix/lead-function` into `seo-aeo-geo` and resolved the two expected conflicts (`package.json`, `entity-truth.ts`) with the branch side. The result differs from `seo-aeo-geo` only by `origin/main`'s logo and favicon files and the 10 KB Nestlé logo. On it:
- `npm test`: 34/34. One test skips until `dist/` exists, then passes.
- Typecheck: pass.
- `npm run build`: all 10 checks pass.
- `dist/images/clients/nestle.png` is 10,352 bytes.

## 7. Priority matrix

| # | Issue | Impact | Effort | Confidence | Risk | Dependency | Action taken |
|---|---|---|---|---|---|---|---|
| 1 | Enquiry forms fail (`/api/lead` 500) | Very high: every web enquiry since 14 Nov | S | High (reproduced) | Low | Deploy approval; Resend env vars set | **Fixed in code** on both branches; hotfix branch ready |
| 2 | No analytics, so no enquiry or click measurement | High | S | High | Low (the privacy page updates itself) | GA4 property ID in Vercel | Code already present; exact steps in §9 |
| 3 | Inner pages get no impressions (index or consolidation lag) | Very high | S | Medium-high | Low | Search Console access | URL list and exports specified; technical state verified clean |
| 4 | Branch not live, 7 commits behind `origin/main` | High (gated Beyond Curry FAQ still live) | S | High | Medium (37-commit diff) | Owner approval | Clean merge verified; release order in `PR.md` |
| 5 | Listings: wrong numbers, hours, veg claim, address; no website link | High for local and AI accuracy | M | High (seen 17 Nov) | Low | Owner logins | Correction list refreshed (§9, `nap-and-profile-fixes.md`) |
| 6 | Business Profile website/menu link, categories, hours | High for Maps and "brihadhee menu" | S | Medium | Low | Owner | Values in `07-offsite/google-business-profile.md`; check the website link isn't `http://` |
| 7 | Branch renamed a homepage title that is working | Medium | S | Medium | Low | – | **Reverted to the live wording** |
| 8 | Price answer buried below the fold | Low–medium | S | Medium | Low | – | **Price row added** |
| 9 | 1.16 MB logo on the corporate page | Medium (mobile weight) | S | High | Low | Deploy | **Compressed** on the hotfix branch |
| 10 | Bing coverage unknown; IndexNow key not set | Medium (Copilot, ChatGPT search) | S | Medium | Low | `INDEXNOW_KEY`, Bing Webmaster Tools | Steps in §9 |
| 11 | Core Web Vitals unmeasured | Medium | S | – | – | PSI key or quota | Not done (quota) |
| 12 | "restaurants in anna nagar" at 35 | Low (low fit) | L | Medium | Medium if chased with thin pages | – | **Deprioritised**; Maps and profile work instead |

## 8. KPIs this baseline supports

The 30/60/90 plan in `10-30-60-90-plan.md` uses this file's clusters. Compare only complete, equal periods, India, web search, with `scripts/gsc-segment.mjs <new> <old>`. The 12–15 Nov export is a reference, not a comparable baseline. The first comparable baseline is the 7-day pull due on 24 Nov (16–22 Nov).

## 9. Exports, owner and account actions

See `owner-questions.md` §D for the exact list. Summary:
1. Ship `hotfix/lead-function`.
2. Confirm the Resend env vars, then send one test enquiry.
3. Set `PUBLIC_GA4_ID` and mark the key events.
4. Run Search Console URL Inspection and the exports below.
5. Correct the Business Profile and the listings.
6. Set up Bing Webmaster Tools and `INDEXNOW_KEY`.

**Search Console exports needed:**
- (a) Performance, last 28 days vs previous 28 days, Country = India, Search type = Web.
- (b) The Queries tab with **Page = `https://www.brihadhee.com/`**, then again with **Page = `https://www.brihadhee.com/menu/`**. That's the query-plus-page view.
- (c) Page indexing: the indexed and not-indexed lists with reasons.
- (d) URL Inspection for the 18 sitemap URLs, recording "URL is on Google" and the Google-selected canonical.
- (e) The Sitemaps report.
- (f) The Generative AI report by page and date.

## Skills used

- **`claude-seo:seo-google`** (Search Console, PageSpeed, CrUX): loaded. Its runtime is not set up and there are no credentials, so no Google API data was collected.
- **The other SEO, AEO, GEO and local SEO skills** (`claude-seo:*`, `anthropic-skills:local-seo-audit`, `aeo`, `seo-geo-aeo`): available but not loaded. Their checks were done directly instead: live crawl, schema and robots inspection, crawler user-agent tests, listing NAP checks, result-type research, and official-guidance verification. No skill output is claimed.
