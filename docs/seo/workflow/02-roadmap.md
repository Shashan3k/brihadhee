# 02 Roadmap: Steps 3 to 7

Written 16 November 2026 from [`01-audit.md`](01-audit.md). It follows the ground rules in `CLAUDE.md`. Each task gives the tracker IDs it serves, the exact files or URLs, the expected effect, effort (S = under 2 h, M = half a day, L = more than a day), the risk, and a done-when test.

**Ordering rules.**

1. Fixing a wrong-page ranking for a P1 query comes first.
2. P1 TARGET rows come before everything else.
3. Nothing changes on a page until its baseline has been re-measured from Anna Nagar (`02-measurement-plan.md`). Otherwise we can't tell what worked.
4. Owner-gated work waits for `owner-questions.md`.

Every code task ends with `npm run build`, `npm test`, `npm run typecheck` and `npm run verify` passing (see `00-stack.md`).

## Dependency map

```
3.0 GSC + Bing access ──► 3.1 Anna Nagar baseline ──► 3.2–3.7 on-page fixes ──► 4.x schema ──► 5.x answers
        │                                                        │
        └──────────────► 6.1 Bing / IndexNow                     └──► re-measure (plan, +2 and +6 weeks)
owner answers (Q26, Q28, Q31, Q32, Q37 …) ──► 4.3, 5.4 and gated rows
6.2–6.3 off-site profile fixes and 7.x can start now; they don't touch site files
```

## Step 3: Technical and on-page

| # | Task | Tracker IDs | Files or URLs | Expected effect | Effort | Risk | Done when |
|---|---|---|---|---|---|---|---|
| 3.0 | **Get the index right (blocker for everything).** <br>• Verify the `https://www.brihadhee.com/` property and submit `/sitemap-index.xml`. <br>• Run URL Inspection, then *Request indexing* for `/` and `/menu/` first, then the other 16 sitemap URLs. <br>• Save each Google-selected canonical. | SEO-001, 002, 003, 007, 008, P03 and every P1 row | Search Console. No site files. | Ranking: home and `/menu/` re-indexed with www canonicals and current titles | S | None | Screenshots in `docs/seo/workflow/evidence/gsc/` show "URL is on Google" and Google-selected canonical = user-declared canonical for all 18 URLs |
| 3.1 | **Re-baseline from Anna Nagar.** The Kaniyakulam sample is not a baseline. | The 20 queries in `02-measurement-plan.md` | xlsx `SEO rankings`, `docs/seo/workflow/evidence/` | Valid before/after comparison | S | None | 20 rows filled with location, device, date, position, ranking URL and a screenshot path |
| 3.2 | **P1 wrong page: brand queries go to `/`.** <br>• Home title becomes "Brihadhee Anna Nagar \| Pure Veg South Indian Restaurant" (55 chars). <br>• `/about/` title becomes "Brihadhee Address, Timings & Contact \| Anna Nagar East", so the exact brand + locality phrase lives on one page. <br>• Keep the H1 wording. | SEO-001, 002, 007, 008 | `src/data/pages.js:87`, `src/pages/about.astro:32` | Ranking: `/` becomes the first official URL for "brihadhee anna nagar" | S | Medium. `/about/` currently ranks 9th for the Coffee Bar query and may drop while `/` takes over. Watch SEO-004, 009 and 010 (address and timings still map to `/about/`). | The Anna Nagar check 2–4 weeks after re-crawl shows `/` as the first official URL for SEO-001 and SEO-008 |
| 3.3 | **P1 wrong page: "brihadhee menu" goes to `/menu/`.** <br>• Mainly 3.0 (the title changed on 14 Nov). <br>• Add a visible "Full Brihadhee menu and prices" link to `/menu/` in the first screen of `/menu/nellai-meals/`, so the child page passes relevance up instead of competing. | SEO-003 | `src/pages/menu/nellai-meals.astro` | Ranking | S | Low | `/menu/` is the first official URL for SEO-003 in the Anna Nagar check |
| 3.4 | **P1 wrong page: Coffee Bar.** <br>• Home H2 "Coffee Bar" becomes "Brihadhee Coffee Bar, Anna Nagar". <br>• Add one sentence plus a link to `/#coffee-bar` on `/about/` ("Before you arrive"). <br>• Keep the corporate section strictly about *office events*, with its H2 as "Coffee bar for office events", and drop restaurant-style wording there. <br>• In the tracker, record SEO-125/P03/P04 as URL `/` with the anchor noted separately. | SEO-P03, SEO-125, SEO-P04 (P2), SEO-P05 | `src/pages/index.astro` (Coffee Bar section), `src/pages/about.astro`, corporate section in `src/data/catering.js`, tracker | Ranking: `/` replaces `/about/` | S | Low | `/` is the first official URL for SEO-P03, and `/corporate-catering-chennai/` still ranks for SEO-P05 when it is checked |
| 3.5 | **Catering hub for local and P1 catering queries.** <br>• Title: "Pure Veg Wedding & Event Caterers in Chennai \| Brihadhee". <br>• Lead: name the Anna Nagar East kitchen as the base. <br>• Use "marriage", "party" and "caterers" in existing sentences, not as a keyword list. | SEO-P06, P07, P09, 192, 201, 220, 234 | `src/data/catering.js` | Ranking: page 2 to page 1 for SEO-P07 | M | Medium. Title change on a page that ranks. Re-measure before and after. | Anna Nagar check shows SEO-P07 on page 1, and SEO-P06/P09 inside the top 30 |
| 3.6 | **Dosa vocabulary.** Add "customizable" / "customisable" / "personalised" once each in the lead or how-it-works text. | SEO-P02, 059, 060, 061, 062, 064 | `src/pages/menu/dosa.astro` or its data in `src/data/spokes.js` | Ranking | S | Low | Page text contains the terms. SEO-P02 enters the top 30. |
| 3.7 | **Home link weight.** Add a footer text link "Brihadhee restaurant, Anna Nagar East" to `/`. Keep the logo `/#top` link. | SEO-001, 002, 008 | `src/components/Footer.astro` | Ranking (minor) | S | Low | `check:links` passes, and every page has one descriptive text link to `/` |
| 3.8 | **Tracker housekeeping.** <br>• Merge the 9 duplicate pairs. <br>• Delete SOURCE_NOTE SEO-241/242/243/258/398 and the malformed SEO-244. Keep SEO-R13. <br>• Map fragment targets to URL plus anchor. <br>• Record `ANSWERED` and priority `HOLD` in the rules. <br>• Move the xlsx to `docs/seo/`. | See audit finding 10 | `docs/seo/keyword-tracker.csv`, xlsx | Prevents wrong work | S | Low (data only) | No duplicate keywords. No SOURCE_NOTE rows. CSV and xlsx IDs still match one-to-one. |
| 3.9 | **Performance.** <br>• Re-run PSI. <br>• Remove `fetchpriority=high` from the hero image where it's below the fold on mobile. <br>• Lazy-load the 5 home images after the hero. <br>• Test `build.inlineStylesheets: "auto"` so the 67 KB of CSS is cached across pages. | All pages (CWV) | `astro.config.mjs`, `src/components/Hero.astro`, home image markup | Ranking (tie-breaker), user experience | M | Medium (style flash or layout shift) | PSI mobile Performance ≥ 90 on `/`, `/menu/` and `/catering-services-chennai/`. CLS < 0.1. `verify:lighthouse` passes. |
| 3.10 | **Single-hop apex redirect.** Make `http://brihadhee.com` go straight to `https://www.brihadhee.com` (Vercel domain settings). | — | Vercel dashboard | Crawl hygiene | S | Low | `curl -I http://brihadhee.com/` returns one 301 or 308 to www |

## Step 4: Schema

| # | Task | Tracker IDs | Files | Effect | Effort | Risk | Done when |
|---|---|---|---|---|---|---|---|
| 4.1 | **One Service node per page with its own `url`.** Stop emitting the generic "Brihadhee Catering" node (url `/catering-services-chennai/`) on home and the sibling catering pages. Link to it by `@id` instead. | SEO-001, P06–P11 | `src/lib/schema.js`, `src/data/catering.js`, `src/data/pages.js` | Ranking: removes a sitewide signal pointing at the hub | S | Low | `validate-schema` passes, and each catering page's Service `url` equals its canonical |
| 4.2 | **Add `logo`** (and `image` on the WebSite publisher) to the Restaurant node. | Brand rows | `src/lib/schema.js` | Entity clarity, knowledge panel | S | Low | Rich Results Test shows the logo. `verify` check 6 passes. |
| 4.3 | **Beyond Curry `brand`.** Keep or remove according to Q26. | SEO-023 | `src/data/entity-truth.ts:127`, `src/lib/schema.js` | Accuracy | S | Low | Matches the owner's answer |
| 4.4 | **No AggregateRating or Review schema** until Q36 brings dated platform data. Even then, show visible text only (self-serving reviews aren't eligible for LocalBusiness rich results). | AI-034, 035 | — | Avoids a manual action | — | — | — |

## Step 5: AEO (answers)

| # | Task | Tracker IDs | Files | Effect | Effort | Risk | Done when |
|---|---|---|---|---|---|---|---|
| 5.1 | **Home answer lead.** Directly under the H1, add a 40–60-word paragraph made only of facts already on the site: "Brihadhee is a pure vegetarian South Indian restaurant on 3rd Avenue, W-Block, Anna Nagar East, Chennai, open every day from 11 AM to 11 PM for lunch and dinner. Diners build their own dosa, order Nellai Special Sodhi Meals or Paanai Parotta, and finish with filter coffee from the Coffee Bar." (51 words) | AI-028, AI-100 and the other `/#faq-what-is-brihadhee` rows, SEO-002 | `src/components/Hero.astro` or `src/data/pages.js` | AI citation | S | Low | The first `<p>` after the H1 is 40–60 words. `aeo-lint` passes. |
| 5.2 | **Section-opening answers** on the 7 pages with none: `/menu/nellai-meals/`, `/veg-dinner-anna-nagar/`, `/book-a-table/`, `/faq/`, `/small-function-catering-chennai/`, `/catering-quote-chennai/`, `/event-planner-catering-partner/`. Each H2 opens with a 40–60-word direct answer. Lift the short leads (28–39 words) to 40+. | P1 TARGET rows on those pages (27 on small-function, 9 on quote, 11 on Nellai) | Each page's data in `src/data/spokes.js`, `src/data/catering.js`, `src/pages/*` | AI citation | M | Low | The section scan in `01-audit.md` shows at least one 40–60-word opener per page |
| 5.3 | **One phrasing per fact.** <br>• "1,000+ meals a day through its corporate catering" everywhere: replace "people per day", "people daily" and "1,000 meals". <br>• Keep "100% pure vegetarian … no meat, egg or fish is cooked in its kitchen" for the **restaurant only**. <br>• For catering, use the approved "every catering order is pure vegetarian" (Q20). <br>• Hold "cooks every corporate meal in its kitchen" until the owner confirms it still holds with externally sourced items (ask alongside Q16). <br>• Add the verified line "Some dishes contain onion or garlic" to the `/menu/` FAQ, so "pure veg" isn't read as Jain. | AI rows on catering scope, AI-029, AI-101 | `config/seo-gates.ts` (`CORPORATE_DAILY_SCALE`), `src/data/entity-truth.ts` (`foodSafety`), `src/lib/llms.js`, `src/data/catering.js` | Accuracy: stops the Gemini-style overreach | S | Low | One "1,000" variant in the built HTML and llms files. `check:facts` and `check:compliance` pass. |
| 5.4 | **Gated answers** go live only after owner yes: Q31 staff, Q32 lead time and Q37 sample menu (P1 rows) first. | AI-248, AI-165, AI-250, AI-166 | `/catering-quote-chennai/`, `/catering-services-chennai/`, `/small-function-catering-chennai/` | AI citation | S each | Low | Owner answer recorded in `client-confirmations.md`, and the FAQ plus FAQPage carry the same text |
| 5.5 | **llms.txt parity.** Regenerate after 5.1–5.4 and check the brand answer, phones and hours match the pages. | AI brand rows | `src/lib/llms.js` | AI citation and accuracy | S | Low | `aeo-lint` passes. `llms.txt` shows the same lead as home. |

## Step 6: GEO (entity and AI visibility)

| # | Task | Tracker IDs | Where | Effect | Effort | Risk | Done when |
|---|---|---|---|---|---|---|---|
| 6.1 | **Bing.** Use Webmaster Tools (import from GSC), submit the sitemap, and run `npm run indexnow` once the key is set. | All. Copilot and Bing-grounded ChatGPT. | Bing WMT, `scripts/indexnow.mjs` | AI citation: Bing currently has no site URL | S | Low | `site:brihadhee.com` in Bing returns the 18 URLs (screenshot) |
| 6.2 | **Owner-managed profile facts.** <br>• Instagram bio and call button to +91 73587 14113 (replaces 95661 35405). <br>• Zomato dining call to the dining number. <br>• EazyDiner hours to 11 AM–11 PM. <br>• Apple Maps and Bing Places address in full. <br>• Website field = `https://www.brihadhee.com/` everywhere. | AI accuracy rows, SEO-004, 010 | `docs/seo/local-seo-owner-action-plan.md` | Accuracy: fixes the outdated-number and 6:30 AM answers | S per profile (owner) | Low | Screenshot of each corrected profile in `evidence/profiles/` with the date |
| 6.3 | **Google Business Profile.** Check categories (vegetarian restaurant, South Indian restaurant), menu link to `/menu/`, products for Build Your Own Dosa, Nellai Meals and the Coffee Bar, and photos of the dosa station. | TRACK_ONLY "best …" rows are *measured* only. SEO-P01, P04. | GBP (owner) | AI citation: AI Overview picks for "pure veg restaurant in Anna Nagar" come from Business Profile cards | S | Low | GBP screenshot. Brihadhee appears among the cards in at least one monthly AI Overview check. |
| 6.4 | **Monthly AI checks** following `02-measurement-plan.md`. | 20 plan queries | Plan | Measurement | S/month | None | Monthly row set complete with evidence |

## Step 7: Off-site

| # | Task | Tracker IDs | Where | Effect | Effort | Risk | Done when |
|---|---|---|---|---|---|---|---|
| 7.1 | **Instagram to site.** Link the bio to `/menu/dosa/` or `/`. Pin a Build Your Own Dosa post whose caption names "Brihadhee, Anna Nagar East" and the official URL. Instagram is the source AI Overview cited for the dosa query. | SEO-P01, P02, AI-058 | Instagram (owner) | AI citation shifts toward correct facts and the official URL | S | Low | Bio link live. The next dosa AI Overview check shows the correct phone. |
| 7.2 | **Creator posts.** Ask creators who already posted about Brihadhee (the Instagram results at positions 1, 2 and 4) to add the official link. No paid reviews and no scripted ratings. | SEO-P01, P02, P04 | Owner outreach | Links and citations | M | Low | At least 2 creator posts link `brihadhee.com` |
| 7.3 | **Directory consistency.** Make sure Justdial, Swiggy Dineout, District, magicpin and IndiaRestros show the same name, address, dining and catering phones, hours and website. | Brand rows | Owner | Entity consistency | M | Low | Correction log with screenshots |
| 7.4 | **Corporate proof.** Where corporate clients already approved for publication (`client-confirmations.md` §K) are willing, get a mention or link from their side. | SEO-151, 162–164, 185 | Owner, B2B | Ranking and citation for corporate catering | L | Low | 1+ client page or post links to `/corporate-catering-chennai/` |

## Do-not-do list

- **TRACK_ONLY (76 rows):** measure only. No pages, headings or copy written to win them, and no "best", "No.1", "top" or award wording, even when the query contains it (e.g. AI-001 "best dosa in Anna Nagar").
- **Priority HOLD (235 rows), OWNER_CONFIRMATION (191) and APPROVAL_GATED (60):** nothing publishes until the matching question in `owner-questions.md` is answered yes and recorded. Gate flags in `config/seo-gates.ts` stay off until then.
- **EXCLUDED (30 rows):** never targeted, not even as related terms.
- **SOURCE_NOTE (5 rows):** CSV fragments, not keywords. Delete them in 3.8 and never target them.
- **No invented claims:**
  - No catering rates (explain what moves the price instead).
  - No ratings, review counts or AggregateRating without dated platform evidence.
  - No 2,000-guest wording (Q29) and no "premium" (Q22).
  - No onion/garlic-free, Jain, satvik, Brahmin/Iyer/Iyengar, Hindi, delivery, takeaway, Swiggy, Zomato, parking, seasonal or fasting claims until approved.
  - No new Beyond Curry mentions until Q26.
- **No keyword stuffing:** misspellings (SEO-024–027) and area names stay off the page unless a real sentence uses them (directions verified under Q35).
- **No position, mention or citation field filled without evidence**, meaning a URL, a screenshot path or pasted text. A Google search URL alone is not evidence.
