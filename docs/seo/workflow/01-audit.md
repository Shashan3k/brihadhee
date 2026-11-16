# 01 Audit: why Brihadhee ranks where it does

Audited 16 November 2026 on branch `seo-aeo-geo`. Read-only: no site file was changed.
Inputs: `Brihadhee_SEO_AEO_Ranking_Tracker.xlsx` (copy in `outputs/01a1e316-…/`, all three sheets), `docs/seo/keyword-tracker.csv`, `docs/seo/`, `docs/geo/`, the repo, and live fetches of https://www.brihadhee.com on 16 Nov 2026 (19 HTML pages, robots, both sitemaps, llms files, menu.json, 11 redirect probes, a 360 px mobile render of all 17 target pages).
Raw evidence (parsed HTML, headers, screenshots) is in the session scratchpad. It is not committed, so rerun the commands in `00-stack.md` to reproduce.

**Summary.** The live site is technically clean. All 18 sitemap URLs return 200, are self-canonical and indexable, and render on mobile. The 4 of 13 result and the three wrong-page rankings are mainly explained by three things:

1. **Google's index is still catching up.** The site launched on 4 Nov, and until the code fix reached production its pages declared `shashan3k.github.io` as canonical. GitHub Pages went off on 11 Nov, the current titles shipped on 14 Nov at 14:52, and the sample was taken about 36 hours later.
2. **The measurement isn't comparable.** Google reported the sample location as Kaniyakulam, not Chennai, and the evidence links are re-runnable search URLs rather than captures.
3. **Ranking signals are split.** The exact phrase "Brihadhee Anna Nagar" is only in the `/about/` title, "Coffee Bar" is in no title or H1, and the catering hub collects the most sitewide link and schema signals.

AI engines skip or misquote Brihadhee for related reasons. Bing did not index the domain (9 Nov). Third-party profiles carry stale facts and AI answers cite them first. And some site wording invites over-generalisation.

## 1. Top 10 findings, ranked by impact against effort

| # | Finding | Evidence | Impact | Effort | Fix (step) |
|---|---|---|---|---|---|
| 1 | **Index state, not on-page copy, is the main cause of the missing and wrong-page rankings.** Home and `/menu/` were live while they declared a `github.io` canonical. The pages that do rank (`/catering-services-chennai/`, `/menu/nellai-meals/`, `/about/`) are either newer or changed less. No Search Console evidence exists for any URL. | Launch commit `7431352` (2026-11-04). The canonical fix `5ea648d` (11-08) sat in code while live still served the old build (`docs/owner-todo.md:92`, `docs/seo/audit.md:26-39`). Pages turned off 11-11, `https://shashan3k.github.io/brihadhee/` now 404. Release `9a4fc23` 2026-11-14 14:52 changed the `/menu/` and catering titles (`docs/seo/implementation-report.md:66-68`). `/menu/nellai-meals/` was created 11-12 (`2c738f8`). GSC status is `NOT_VERIFIED` (`docs/seo/phase-progress.md:93`). | Very high: SEO-001, SEO-003, SEO-P03 and every P1 brand row | S (owner, with GSC access) | Step 3: URL Inspection plus request indexing for `/`, `/menu/` and the 16 other sitemap URLs. Record Google-selected canonical. Submit `/sitemap-index.xml` in GSC and Bing WMT |
| 2 | **The live sample can't serve as a local baseline.** Location was Kaniyakulam, not Anna Nagar or Chennai. "Evidence link" holds a re-runnable Google URL, not a capture. SEO-P03's ranking page is inferred from a breadcrumb. The ground rules need a URL, screenshot or pasted text. | xlsx `SEO rankings` rows 3 and 6–18, column L "Kaniyakulam, Tamil Nadu; signed-out desktop". Column M is `google.com/search?q=…&udm=14`. SEO-P03 note: "URL path is inferred from the Google breadcrumb". | High: SEO-001, SEO-P07 (both "Anna Nagar" queries on page 2) and every LOCATION_DEPENDENT row | S | `02-measurement-plan.md`: re-run from Anna Nagar with screenshots before judging any on-page change |
| 3 | **The exact brand + locality phrase lives on the wrong page.** "Brihadhee Anna Nagar" appears verbatim only in the `/about/` title ("Brihadhee Anna Nagar: Address, Timings & Contact"). Home is "Brihadhee \| Pure Veg South Indian Restaurant, Anna Nagar". **Coffee Bar** is in no title, H1 or URL. On home it's a short section (the 5th of 15 H2s) in a 3,010-word page. `/corporate-catering-chennai/` has its own `#coffee-bar` with 9 "Coffee Bar" mentions against 4 on home. A `#fragment` can never be a ranking URL. | Live titles (parsed 16 Nov). Term counts in visible main content: "Coffee Bar" home 4, corporate 9, about 0, menu 1. Home H2 list has "Coffee Bar" 5th of 15. Tracker targets `/#coffee-bar` (SEO-125, SEO-P03, SEO-P04) and `/corporate-catering-chennai/#coffee-bar` (SEO-P05). | High: SEO-P03 wrong page, SEO-125/P04 absent | S–M | Step 3: put "Anna Nagar" next to the brand in the home title and H1. Give the restaurant Coffee Bar one clear owner page and point the tracker at a URL, not a fragment. De-duplicate the corporate coffee section's wording |
| 4 | **The catering hub collects the strongest sitewide signals,** which helps it surface for the brand query. It gets 74 internal anchors (nav "Events" ×38, "Event Catering" ×19). Every catering page and the homepage carry a generic Service node "Brihadhee Catering" whose `url` is `/catering-services-chennai/`. For **vegetarian catering Anna Nagar** (SEO-P07, position 12), the hub's title and H1 say "Chennai" only. "Anna Nagar" appears just in the body (11×) and the targeted FAQ anchor. | Inbound-anchor count from 19 live pages. JSON-LD Service nodes on `/catering-services-chennai/` and its siblings. Title "Pure Veg Event & Wedding Catering in Chennai \| Brihadhee". | High: SEO-001, SEO-P07, SEO-P06, SEO-P09 | S | Step 3: home gets equal nav and footer weight with brand-plus-locality anchors. Step 4: one Service node per page with its own `url`. Catering hub H1 or lead names Anna Nagar East as the base |
| 5 | **The homepage doesn't open with an answer.** The first text after the H1 is "11 AM to 11 PM / Lunch & Dinner Only" (9 words), then the tagline "Nostalgic Tamil Food with a Modern Twist". No H2 is a question. There are 15 H2 topics, 3,010 words and 185 KB of HTML, of which 67 KB is inline CSS. | `aeo.py` lead extraction on live home. `/menu/dosa/` by contrast opens with a 48-word entity answer. | High for AEO (AI-0xx brand prompts) and moderate for SEO-002/007/008 | S | Step 5: a 40–60-word "What is Brihadhee?" lead under the H1, using facts already on the page |
| 6 | **Answer blocks are short or absent.** Only 4 of 17 target pages lead with 40+ words (`/menu/dosa/`, `/menu/nellai-meals/`, `/family-dining-anna-nagar/`, `/corporate-catering-chennai/`), and 7 pages have no H2 section that opens with a 40–60-word paragraph (table below). Q&A sits in FAQ blocks, which is fine for FAQPage, but the main sections rarely answer the heading directly. | Section scan of live HTML. 105 FAQ questions with no duplicates across pages (good). | Medium–high, AI citation | M | Step 5 |
| 7 | **P1 queries use words the target page never uses.** "caterers" (SEO-201, SEO-234), "marriage" (SEO-220), "party" (SEO-192) on `/catering-services-chennai/`. "customizable / customisable / personalised / mix and match / unique" (SEO-P02, SEO-059–062, SEO-064) on `/menu/dosa/`. Area names Annanagar, Aminjikarai, Kilpauk, Mogappair (SEO-262/267/268/271) target `/about/#find-us`, where none appear. | Term check of 288 TARGET/SUPPORTING rows against live visible text: 29 rows lack half or more of their terms. | Medium | S | Step 3: natural use in existing sentences. Area names only where a real direction or distance is verified |
| 8 | **Wording lets engines overstate claims.** "100% pure vegetarian" appears in about 54 places. Corporate pages say Brihadhee "cooks every corporate meal in its FSSAI-licensed, 100% pure vegetarian restaurant kitchen". The owner's 15 Nov approval covers catering "including externally sourced items", so an engine can merge the two into "all catering is cooked in-house". The 1,000 figure appears as "1,000+ people per day", "1,000 people daily", "1,000+ meals a day" and "1,000 meals a day". Before the 15 Nov approval, Gemini said "100% pure vegetarian catering" (`R_AEO.md`, 14 Nov). Only the seasonal page says some dishes contain onion or garlic, so "100% pure veg" elsewhere can be read as Jain or no-onion-no-garlic. | Live text counts. `src/data/entity-truth.ts` `foodSafety`. `docs/seo/client-confirmations.md` §L. `config/seo-gates.ts` `CORPORATE_DAILY_SCALE`. | Medium (accuracy) | S | Step 5: one canonical phrasing per fact. Owner Q16 and Q11 settle the scope |
| 9 | **Topics the ground rules gate are already live.** "Beyond Curry by Brihadhee" is the Restaurant `brand` in JSON-LD on all 20 pages, plus a homepage FAQ "What is Beyond Curry by Brihadhee?". `/seasonal/karthigai-ayyappa-pure-veg/` is a seasonal page. It does avoid fasting-menu claims ("Some dishes contain onion or garlic"). | `entity-truth.ts:127` marks `subBrand` verified. CLAUDE.md lists both topics as gated. | Medium (rules conflict) | S | Owner Q26 and Q28. No change until answered |
| 10 | **The tracker needs cleaning before it can drive work.** <br>• 9 duplicate keyword pairs: Nellai meals Chennai SEO-086/134, executive meals anna nagar 095/506, office lunch anna nagar 099/498, small party catering 205/222, baby shower catering 211/237, Jain catering 445/467, Jain wedding catering 447/473, Marwari wedding catering 457/474, live dosa counter wedding 462/475. <br>• 5 SOURCE_NOTE fragments: SEO-241 "the client mentioned 500", 242 "1", 243 "000 and 2", 258 a sentence of guidance, 398 "kothu is normally onion-based]". SEO-244 "000 as doable: …" is the remnant of the same split and duplicates SEO-R13. <br>• `HOLD` is a priority value on 235 rows, not a status. <br>• `ANSWERED` (171 AI rows) is undefined in the rules. <br>• 5 checked SEO rows target a `#fragment`, which Google reports at URL level. | `keyword-tracker.csv` and both xlsx sheets. All 845 IDs match one-to-one with identical keyword, status, target and priority, so the sheets don't conflict on those fields. The xlsx is outside `docs/seo/`. All 69 distinct target URLs and anchors exist live (0 broken). | Medium (prevents wrong work) | S | Step 3 housekeeping. Merge duplicates, drop fragments, map fragment targets to URL plus anchor for measurement |

### Technical checks (C)

| Check | Result | Evidence |
|---|---|---|
| robots.txt | Pass. `User-agent: *` Allow, plus explicit Allow for Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User and Google-Extended. Sitemap line present. | `https://www.brihadhee.com/robots.txt` |
| sitemap | Pass. The index points to one sitemap with 18 URLs, all 200, self-canonical and indexable. `/privacy/` (noindex) is correctly excluded. | `/sitemap-index.xml`, `/sitemap.xml` |
| Canonicals | Pass. Every page self-canonical on `https://www.brihadhee.com/…/`. | Parsed `<link rel=canonical>` |
| Redirects | Apex takes 2 hops: `http://brihadhee.com/` 308 → `https://brihadhee.com/` 308 → www. `brihadhee.vercel.app` 301 to www. Legacy `/best-dosa-parotta-anna-nagar/` 301 to `/menu/dosa/`. Low priority. | curl probes |
| Duplicate 200s | `/menu`, `/about` (no slash) and `/index.html` return 200 with a canonical to the slash URL. Acceptable. Watch them in GSC (already in `implementation-report.md` P2). | curl probes |
| Status codes | All 18 sitemap pages 200. Unknown paths and `/catering/` 404. `/MENU/` 404. | curl |
| noindex | Only `/privacy/`. `*.vercel.app` gets `X-Robots-Tag: noindex` (`vercel.json`). | Headers |
| hreflang | Not applicable. Tamil and Tanglish answers are inline FAQ blocks on English URLs, with no separate language pages. | No `hreflang` on any page |
| Mobile | Pass. No horizontal overflow at 360 px on all 17 pages, 17 px base font, H1 above the fold. | Playwright and Chromium render |
| Core Web Vitals | **Not measured.** PageSpeed Insights returned "quota exceeded" on 16 Nov and there's no CrUX field data on record. Risks: 67 KB of inline CSS repeated on every page (no cross-page cache), 185 KB home HTML, 6 eager images on home, and `hero.webp` (72 KB, 1600×1200) marked `fetchpriority=high` although it renders below the fold at 360 px. | Live HTML. Re-run PSI in Step 3 |
| Images | All `<img>` have alt text. WebP 33–72 KB, with JPG fallbacks 53–114 KB. | Live HTML and curl sizes |
| Headings | One H1 per page, H2 present, no skipped levels. | `npm run verify` check 1 and the live parse |
| Link depth | All 18 indexable pages are 1 click from home (global nav). | BFS over live links |

### Entity and NAP (D)

| Fact | Site (live) | Off-site and AI (from docs) |
|---|---|---|
| Name | "Brihadhee" (Tamil பிரிஹதீ). `alternateName` also has "Brihadhee Hotels" and "Brihadhee Pure Veg Restaurant". Misspellings (SEO-024–027) are rightly not on the page. | Consistent |
| Address | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Anna Nagar East, Chennai 600040. Geo 13.0879662, 80.2178222. | Bing had an incomplete street and Apple had an old-number-only card (`docs/seo/local-seo-owner-action-plan.md`) |
| Dining phone | +91 73587 14113 (217 mentions in HTML and schema) | **Google AI Overview on 12 Nov gave +91 95661 35405, sourced from Instagram** (`docs/audits/2026-11-12/AEO-AUDIT.md`). That number appears nowhere on the live site. Zomato showed the catering number as the dining call. |
| Catering phone | +91 94442 24999 (95 mentions). The homepage careers line also shows Rakesh +91 83003 19370. | — |
| Hours | 11 AM to 11 PM daily, lunch and dinner only. One "11 AM–11 PM" dash variant. | EazyDiner shows 6:30 AM. AI Mode said "closed on Sundays" (9 Nov). The brand panel snippet said "Open daily from 6:30 AM" (`docs/geo/visibility-log.csv`). |
| Sub-brand | "Beyond Curry by Brihadhee" in Restaurant `brand`, all pages | Justdial lists it as a separate delivery brand at the same address (tracker SEO-023) |
| sameAs | Instagram, Google Maps place, plus listing URLs | — |
| Ratings | No AggregateRating or Review markup. The home "What Guests Say" section links to Google Maps instead of quoting reviews. Compliant. | — |

### AEO and GEO readiness (E)

- **AI crawlers.** All are allowed, and none is blocked. `llms.txt` and `llms-full.txt` return 200.
- **Bing visibility.** On 9 Nov, brihadhee.com was not found in Bing (`docs/geo/visibility-log.csv`, A7). Copilot and Bing-grounded answers can't cite it until Bing indexes it.
- **Why answers skip or misquote Brihadhee:**
  1. The domain is 12 days old, and Google has re-crawled only part of it (finding 1).
  2. "Best X in Anna Nagar" answers are built from Business Profile cards (AI Overview A2: eight cards, Brihadhee absent). Those depend on GBP review and category signals, not the website. The rows are TRACK_ONLY.
  3. Third-party sources with stale facts (Instagram number, breakfast, 6:30 AM, Sunday closure) outrank the site as citations.
  4. The wording risks in finding 8.

## 2. The 17 target pages (both sheets)

Rows = tracker rows mapped to the page (SEO / AI). P1T = P1 TARGET rows. Lead = words in the first paragraph after the H1. 40–60 = H2 sections whose first paragraph is 40–60 words. Live = the 16 Nov sample (Kaniyakulam, so not comparable for local queries).

| Page | Rows (SEO/AI) | P1T | Title (live) | Lead | 40–60 | Live sample | Main issue | Step |
|---|---|---|---|---|---|---|---|---|
| `/` | 42/35 | 9 | Brihadhee \| Pure Veg South Indian Restaurant, Anna Nagar | 9 | 3/15 | SEO-001 lost to catering (11, p2). SEO-P03/P04 Coffee Bar absent. | Index state. No answer lead. 15 topics. | 3, 5 |
| `/menu/` | 10/13 | 1 | Brihadhee Menu and Prices \| Anna Nagar East | 38 | 1/16 | SEO-003 lost to Nellai page (7, p1) | Index state: title changed 14 Nov from "Brihadhee Menu \| Dosa, Nellai Meals & Parotta, Anna Nagar" | 3 |
| `/menu/dosa/` | 40/28 | 19 | Build Your Own Dosa in Chennai \| Brihadhee, Anna Nagar | 48 | 1/9 | SEO-P01/P02 absent in top 30. Instagram posts at #2 and #4. | Lacks "customizable/customisable" wording. Off-site posts outrank. | 3, 7 |
| `/menu/nellai-meals/` | 39/19 | 11 | Veg Lunch & Nellai Meals in Anna Nagar \| Brihadhee | 40 | 0/8 | Ranks for "brihadhee menu" | Good page but takes the menu query. Needs a stronger link back to `/menu/`. | 3 |
| `/parotta-anna-nagar/` | 15/9 | 4 | Vegetarian Parotta in Anna Nagar \| Brihadhee Chennai | 39 | 1/4 | not checked | Lead 1 word short of 40 | 5 |
| `/veg-dinner-anna-nagar/` | 13/8 | 1 | Veg Dinner in Anna Nagar, Open Till 11 PM \| Brihadhee | 38 | 0/8 | not checked | No section answers | 5 |
| `/family-dining-anna-nagar/` | 20/18 | 0 | Pure Veg Family Restaurant in Anna Nagar \| Brihadhee | 49 | 1/8 | not checked | Group seating (Q33) and premium (Q22) gated | 5 |
| `/about/` | 22/29 | 3 | Brihadhee Anna Nagar: Address, Timings & Contact | 31 | 1/8 | Ranks for Coffee Bar (9, p1) | Only page with the exact brand+locality phrase. Area names missing. | 3 |
| `/book-a-table/` | 3/6 | 3 | Book a Table at Brihadhee, Anna Nagar East | 34 | 0/3 | not checked | Thin (604 words), acceptable for intent | 5 |
| `/faq/` | 0/22 | 0 | Brihadhee FAQ: Timings, Dosa, Catering \| Anna Nagar | 39 | 0/3 | not checked | Hub of links. Q&A lives on topic pages. | 5 |
| `/guides/what-are-nellai-meals/` | 5/6 | 1 | What Are Nellai Meals? Sodhi, Ulundhu Kali, Tirunelveli Food | 39 | 4/7 | not checked | Best AEO structure on the site (5 question H2s) | — |
| `/seasonal/karthigai-ayyappa-pure-veg/` | 4/0 | 0 | Karthigai & Ayyappa Mala Pure Veg Food, Chennai \| Brihadhee | 35 | 4/7 | not checked | Seasonal topic is gated (Q28) | owner |
| `/catering-services-chennai/` | 36/16 | 30 | Pure Veg Event & Wedding Catering in Chennai \| Brihadhee | 37 | 1/12 | Wins SEO-001. SEO-P07 at 12 (p2). SEO-P06/P09 absent. | No "Anna Nagar" in title or H1. No "caterers / marriage / party". | 3, 4 |
| `/corporate-catering-chennai/` | 38/13 | 22 | Pure Veg Corporate Catering in Chennai \| Brihadhee | 40 | 1/14 | SEO-P05/P10 absent | 2,821 words. Coffee Bar overlap with home. Four "1,000" variants. | 3, 5 |
| `/small-function-catering-chennai/` | 27/13 | 27 | Small Function Catering in Chennai, 50+ Guests \| Brihadhee | 38 | 0/8 | SEO-P08 absent | No section answers. Lead time (Q32) gated. | 5 |
| `/catering-quote-chennai/` | 9/7 | 9 | Catering Quote in Chennai for 50+ Guests \| Brihadhee | 28 | 0/6 | not checked | Lead is an instruction, not an answer. Staff (Q31) gated. | 5 |
| `/event-planner-catering-partner/` | 1/0 | 0 | Catering Partner for Event Planners in Chennai \| Brihadhee | 37 | 0/8 | SEO-P11 absent | One tracker row only | 5 |

## 3. Blocked by owner confirmation

These 251 rows can't be targeted or published until the owner answers: 191 OWNER_CONFIRMATION and 60 APPROVAL_GATED. There are no HOLD-status rows; `HOLD` is the *priority* on 235 of them. They are grouped into 25 yes/no questions in [`owner-questions.md`](owner-questions.md). The ones affecting live pages or this audit's fixes:

- **Q26 Beyond Curry** and **Q28 seasonal pages.** Both are already live although the ground rules gate them (finding 9).
- **Q16 catering diet scope and Q11 no onion or garlic.** These settle the "100% pure veg" and "cooks every meal in our kitchen" wording (finding 8).
- **Q31 service staff and Q32 booking lead time.** These are the only gated rows with P1 priority (AI-248, AI-165, AI-250), plus AI-166 (Q37 sample wedding menu).
- **Q36 ratings.** A dated platform screenshot is needed before any rating is mentioned. No AggregateRating schema until then.
- **Q35 nearby areas.** These unblock the area-name rows that finding 7 cannot fix without verified directions.

No work is proposed on TRACK_ONLY, HOLD-priority or EXCLUDED rows beyond measuring them.

## Skills used

`anthropic-skills:xlsx` was loaded and used to read all three sheets (cached values). The technical, schema, content and performance checks followed the `claude-seo` audit dimensions (crawlability, indexability, canonicals, schema validity, E-E-A-T and answer-first content, CWV risk), run as scripts against the live HTML. Those skill files were not loaded separately. PageSpeed Insights could not be used (daily quota exceeded).
