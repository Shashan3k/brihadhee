# 09 Final review: branch `seo-aeo-geo` vs `main`

Reviewed 16 November 2026. Branch at `cfc7762` (36 commits on top of merge base `9f85356`). **Not merged, not deployed.**

## Verdict: SHIP AFTER FIXES. The fixes are done, and the branch is ready for a human sign-off and a Vercel preview check.

The review found **one rule break** and **one truth mismatch** that block shipping, plus a **claimed deliverable that wasn't rendering**. All three are fixed in small commits on the branch. One rule break (the Beyond Curry FAQ) predates the branch but would have shipped with it. Nothing left open is a code blocker: the open items are owner decisions about content already live on `main`, plus checks that need a network this machine can't reach.

**About independence.** The same assistant session wrote this work and ran this review, so it isn't a fully independent review. To reduce that bias:
1. The diff was also reviewed by the `code-review` skill, running as a separate agent without this session's reasoning. It reported 10 findings; all 10 are dispositioned below.
2. The `security-review` skill's analysis also ran as a fresh sub-agent.

A human reviewer should still read [`PR.md`](PR.md) and look at the preview before merging.

**Inputs reviewed:** `CLAUDE.md`; every file in `docs/seo/workflow/`; `git diff main...seo-aeo-geo`; the build checks. **`scripts/seo-check` doesn't exist.** The nearest equivalent, `scripts/check-seo.mjs`, runs as `npm run check:seo` inside `npm run build`, and the full `npm run check` chain (9 checks) was used.

## Checks and results

| Area | Method | Result |
|---|---|---|
| Build | `npm run build` (9 checks: guardrails, facts, schema, schema-visible, AEO lint, check-seo, compliance, links, link matrix) | **Pass** after the fixes |
| Tests and types | `npm test`, `npm run typecheck` | **33/33 pass**, typecheck passes |
| End-to-end | `npm run verify` | Checks 1–7 pass. Check 8 (preview server) times out: the server needs about 40 s to start on /mnt/c and the script waits 30 s. Run by hand against a preview started separately: **18 pages, 7 site files and 2 markdown fetches, all 200.** |
| SEO regressions | Built `main` in a separate worktree and compared all 20 HTML pages with the branch | Same 20 pages. Canonicals and robots meta unchanged. **robots.txt and sitemap-index.xml identical.** sitemap.xml changes only `<lastmod>`, as fixed below. No duplicate titles. `vercel.json`, `robots.txt.js`, `sitemap*.js` and `astro.config.mjs` untouched on the branch. |
| Page weight | Total HTML bytes, main vs branch | **−0.7%** (2,172 → 2,157 KB), mostly from removing FAQPage JSON-LD. Largest single growth **+2.6%** (`/about/`, the new #facts section). No new scripts or images. |
| Anchors | Every tracker `primary_url` and `#anchor` against the build | **566/566 resolve.** The page exists, is self-canonical, indexable and in the sitemap, and the anchor id is present. |
| Rule breaks | Scan of visible text, JSON-LD, llms.txt, llms-full.txt and menu.json for every gated, EXCLUDED and superlative term in CLAUDE.md | 1 blocker (Beyond Curry, fixed). 5 pre-existing items for the owner (R1–R5). **No** 2,000-guest, onion/garlic-free, Jain, satvik, Brahmin, premium, Hindi, rating or award text, and no catering rates. |
| Truth | Facts on pages and schema vs `entity-truth.ts`, `client-verification.json`, `client-confirmations.md` and the menu. Automated checks: `schema-visible`, verify 2/3/6, aeo-lint, check-facts. | 1 mismatch (catering phone date, fixed). Menu prices, NAP, hours, capacity and scale all match their sources. |
| Mobile | 360 px render of the 8 pages changed in this review | No horizontal overflow, one H1 each |
| AEO sample | 15 ANSWERED prompts, random seed 20261116, first 60 words of the target section | **13 answered, 2 partly answered** (AI-254 lunch combos, AI-142 groups). Both fixed. |
| robots / llms / facts agreement | Cross-check of name, phones, hours, lunch and dinner, catering range, area, 1,000+ scale, postcode and facts link | **All agree.** robots.txt allows every crawler (no `Disallow`) and links the sitemap. llms.txt links `/about/#facts`. |
| Security | `security-review` skill (fresh sub-agent) | **No findings.** The only new HTML sink is `linkify()`, which escapes all text and allows only `/` and `#` links, and its inputs are build-time constants. Nothing new reads request data. `api/`, `vercel.json` and CI are unchanged. |

## Fixed in this review (one commit each)

| Commit | Finding | Severity | Fix |
|---|---|---|---|
| `f8fc5a4` | **Truth:** #facts said "Catering phone · confirmed **11** November 2026"; the owner's phone decision is dated **12** November (`client-confirmations.md` §J). The catering row also stamped everything "confirmed 15 Nov", although the range and area were confirmed on 11 Nov. | Blocker | Date taken from `FACTS.phone.verifiedOn`. The catering row shows "range and area confirmed 11 Nov; pure vegetarian wording approved 15 Nov". |
| `c473761` | **Rule break (pre-existing):** the home FAQ and llms-full.txt published "What is Beyond Curry by Brihadhee?", which CLAUDE.md gates under Q26. Found independently by this review and by `code-review`. | Blocker | New gate `ENABLE_SUB_BRAND = false` (Q26). The FAQ is hidden and appears in the build's gate summary. |
| `13a2488` | **Claimed but not shipped:** the Step 5 Build Your Own Dosa fact table and "Last checked" line never rendered (the component didn't accept the props). | Blocker (accuracy of deliverables) | `BuildYourOwnDosa` accepts `facts` and `checked` as plain text. All other Step 5/6 tables and dates re-checked: they render. The Step 5 log is corrected. |
| `d2d5a89` | **Test weakness** (code-review): `schema-visible` counted hidden or `.visually-hidden` text as visible; its hours regex matched "2 PM" inside "12 PM"; its phone regex could merge the postcode with the number. | High (the build gate could pass wrong data) | Reuses the `aeo-rules` reader, which already excludes hidden content. Digit boundaries on hours. Indian number shapes compared on their last 10 digits. **3 new tests**, one per case. |
| `f57ecef` | **Gate-dependent wording** (code-review): event lists could read "…, family functions" if a gate changed; the end-to-end lead promised weddings unconditionally; the #facts row had no `service_area` fallback and always showed the corporate figure; the brand line hardcoded the diet word; "four choices" and two dates were hardcoded; two doc comments were displaced. | Medium (latent) | Lists built with `joinNatural` from confirmed events. Fallbacks and gates added. `CATERING_DIET`, `byo.steps.length`, `MENU_SOURCE`, `FACTS_LAST_CONFIRMED` and the new `CATERING_CONFIRMED` used. Doc comments restored. |
| `d04d95d` | **SEO freshness:** sitemap `<lastmod>` and `dateModified` didn't move although 13 pages changed materially (the guide said "Updated 15 Nov" after a 16 Nov change). | Medium | A 16 Nov revision date for the 13 changed pages. Footer-only pages keep their dates. |
| `9ccc11b` | **AEO:** AI-254 (lunch combos) and AI-142 (groups) were only partly answered in the first 60 words | Low | The Nellai intro names the dine-in combos (₹129–₹199); the family intro says to call for group seating. |
| `cfc7762` | Docs: Step 5 log correction; owner items R1–R5 | — | — |

**code-review findings not changed (with reason):**
- `CDtitle` is defined twice (`catering.js`, `spokes.js`): style only, both derive from the same gate.
- `menu.astro` recomputes the min and max price that `faq.js` also computes: the same data, the same result, checked by the AEO lint.

## Open items (not code blockers)

| # | Item | Owner | Where tracked |
|---|---|---|---|
| 1 | Owner decisions on live, pre-existing content: Beyond Curry (now hidden), the "best dosa" Q&A, the paper-roast clarification, the seasonal page, the Swiggy/Zomato/delivery answers | Owner | `owner-questions.md` §C (R1–R5), Q25, Q26, Q28 |
| 2 | 25 owner approval questions (251 gated tracker rows); P1 first: Q31, Q32, Q37 | Owner | `owner-questions.md` §B, drafts in `05-gated-drafts.md` |
| 3 | **Google Rich Results Test** not run: the code-input test needs a Google sign-in, and these changes aren't live. The Schema.org validator gave 0 errors and 0 warnings on all 20 pages (Step 4), and the offline Google-property check passes. | Developer, on the Vercel preview | `04-schema-log.md` |
| 4 | **Live crawler user-agent test** not run: this machine's network administrator blocks brihadhee.com (an "ICTS" block page). Also check that the Vercel Firewall "AI bots" rules are off or log-only. | Developer or owner, on another network | `06-geo-log.md` |
| 5 | **Core Web Vitals** not measured: PageSpeed Insights quota was exhausted. HTML shrank 0.7% and no assets were added, so a regression is unlikely but unproven. | Developer | Roadmap 3.9 |
| 6 | `verify` check 8 waits 30 s for the preview server, which needs about 40 s on /mnt/c (works in CI) | Developer (optional: raise the wait to 60 s) | This file |
| 7 | Search Console, Bing, GBP, Instagram and other off-site fixes | Owner | `07-offsite/`, `10-30-60-90-plan.md` |
| 8 | Content was dated 16 Nov 2026. If the release is much later, set `SEO_AEO_GEO_REVISION` in `src/data/site.js` to the release date. | Developer | `PR.md` |

## Before merging (preview checklist)

1. Open the Vercel preview of the branch: home, `/about/#facts`, `/menu/dosa/#how-it-works`, `/small-function-catering-chennai/#from-50-guests`.
2. Run Google Rich Results Test on those preview URLs (expect: LocalBusiness/Restaurant, Breadcrumbs, Article on the guide).
3. From a network that can reach the site, run the crawler user-agent test in `06-geo-log.md`.
4. Merge, deploy, then follow `10-30-60-90-plan.md` action 1 (Search Console re-indexing).
