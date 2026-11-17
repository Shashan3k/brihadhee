# PR: SEO / AEO / GEO for brihadhee.com (`seo-aeo-geo` → `main`)

**Do not merge until a human has reviewed this and checked the Vercel preview** (see "How to test"). Final review: [`09-final-review.md`](09-final-review.md). Plan after merge: [`10-30-60-90-plan.md`](10-30-60-90-plan.md).

## What changed

**Technical and on-page (Step 3)**
- The homepage title owns "Brihadhee Anna Nagar". The About title no longer competes for it.
- The `/menu/` hub owns "Brihadhee menu": branded anchors sitewide and a fuller title.
- Coffee Bar: the home H2 is "Brihadhee Coffee Bar, Anna Nagar", and About links to it.
- Catering hub: title targets "caterers"; the lead names marriage functions and birthday parties (gated on confirmed events).
- Dosa page wording: customizable, mix and match, personalised.
- Footer text link to home. Name spellings on About.
- Consistent "Pure Vegetarian" title case in catering headings. Book-a-table title leads with "Brihadhee Table Booking".

**Structured data (Step 4)**
- Restaurant `alternateName` uses only visible spellings. Added `logo` and `menu`. Removed `brand` (Beyond Curry, Q26) and `priceRange` (not shown on any page).
- FAQPage no longer emitted (`EMIT_FAQPAGE = false`; Google retired FAQ rich results on 7 May 2026). The visible Q&A is unchanged.
- Visible breadcrumbs that mirror each page's BreadcrumbList. The 404 page has no fake trail.
- Article `dateModified` is shown on the guide and What's New.
- **New build gate `scripts/schema-visible.mjs`** (run by `check:seo`). It checks: JSON-LD parses; schema.org 30.1 types and properties are valid for their type; URLs are absolute; there's no rating, review or award markup; and the Restaurant name, address, phone and hours are visible on the page. 12 unit tests.

**Answer blocks (Step 5)**
- Question H2s with 40–60-word answer-first leads on 31 of the 51 target blocks, covering all 171 ANSWERED prompts.
- Fact tables with "Last checked" dates for: Build Your Own Dosa; 50-guest catering; hours; address; phone; booking partners; sodhi meals; catering price factors; late dinner.
- Tamil terms explained (sodhi, ulundhu kali, paanai parotta), plus a one-line footer glossary.
- Short fact answers extended with verified detail.

**Entity and GEO (Step 6)**
- One phrasing per fact: "1,000+ meals a day"; hours "11 AM to 11 PM" everywhere.
- The footer brand line no longer ties "100% pure veg" to catering (the likely source of Gemini's overreach). Event catering no longer implies every item is cooked in-house.
- New **`/about/#facts`** section: verified facts, each with its own date. Linked from the footer and every at-a-glance box.
- llms.txt and llms-full.txt: catering range and area, a facts link, visible spellings, no sub-brand.

**Final review fixes**
- Catering phone date corrected to 12 Nov.
- Beyond Curry FAQ gated (`ENABLE_SUB_BRAND = false`).
- The dosa fact table now renders.
- `schema-visible` hardened: hidden text, hour boundaries, phone shapes.
- Gate-safe catering wording.
- Sitemap `lastmod` set to 16 Nov for the 13 changed pages.
- Two partial answers completed.

**Unchanged:** `vercel.json` (redirects, headers), `robots.txt.js`, sitemap generators, `astro.config.mjs`, `api/`, CI workflow, menu data and prices. No new pages and no new dependencies.

**Docs added:** `CLAUDE.md` (ground rules); `docs/seo/workflow/00`–`09`, `PR.md`, `owner-questions.md`, `05-gated-drafts.md`, `07-offsite/*`; `docs/geo/claims-watchlist.md`.

## Tracker IDs served

| Area | IDs |
|---|---|
| Wrong-page fixes (P1) | SEO-001, SEO-002, SEO-003, SEO-007, SEO-008, SEO-P03, SEO-125, SEO-P04 |
| Catering hub and vocabulary | SEO-P06, SEO-P07, SEO-P09, SEO-192, SEO-201, SEO-220, SEO-234 |
| Dosa vocabulary | SEO-P02, SEO-059, SEO-060, SEO-061, SEO-062 |
| Booking | SEO-018, SEO-146, SEO-147 |
| Name variants | SEO-024, SEO-025, SEO-026, SEO-027 |
| Answer blocks | All 171 ANSWERED AI prompts, listed by block in `05-aeo-log.md`, including recorded failures AI-058 and AI-062 and partial fixes AI-254 and AI-142 |
| Location-dependent | AI-023, AI-026, AI-027, AI-177, AI-178, AI-179, AI-180, AI-181, AI-182, AI-284 |
| Gated, not published | 251 rows (191 OWNER_CONFIRMATION, 60 APPROVAL_GATED) → `owner-questions.md`, `05-gated-drafts.md`. AI-144 (Beyond Curry) is now hidden. |

## Release order (added 17 Nov 2026)

Search Console data and a production check on 17 Nov changed what has to ship first. Details: [`11-gsc-baseline.md`](11-gsc-baseline.md).

1. **Ship `hotfix/lead-function` to `main` first.** It's 2 commits on `origin/main`: the `/api/lead` fix and the logo compression. Production `/api/lead` has returned 500 on every request since the 14 Nov release, so no enquiry form works. After the deploy:
   - `curl -i https://www.brihadhee.com/api/lead` must return **405**;
   - one owner-approved test enquiry must arrive by email (`owner-questions.md` D1, D2).
2. **Bring this branch up to date.** It is 7 commits behind `origin/main` (client logos, favicons).
   1. Stash this checkout's uncommitted duplicate files (`owner-questions.md` D10).
   2. Run `git merge main` once the hotfix is on `main` (or `git merge hotfix/lead-function` before that).
   3. Exactly two files conflict, `package.json` and `src/data/entity-truth.ts`. Each side holds the same lead fix in a different context, and `origin/main` never otherwise changed either file. Resolve with `git checkout --ours -- package.json src/data/entity-truth.ts`, then `git add` both.

   This exact merge was tested on 17 Nov in a throwaway worktree. The result equals this branch plus `origin/main`'s logo and favicon files. Tests, typecheck and the full build pass on it (`11-gsc-baseline.md` §6).
3. If the release date isn't 16 Nov, set `SEO_AEO_GEO_REVISION` in `src/data/site.js` to the release date, so `<lastmod>` and `dateModified` are true.
4. Preview checks below, then merge and deploy. Afterwards, run `owner-questions.md` D4 (URL Inspection and request indexing) and D9 (IndexNow).

## How to test

Local (Node 22+ that can import `.ts` files; see `00-stack.md`):

```bash
npm ci
npm test            # 34 tests, including scripts/schema-visible.test.mjs and the phone parity test
npm run typecheck
npm run build       # astro build plus 10 checks (check:functions first); must print 10 ✔ and no ✖
npm run verify      # 8 groups; on slow disks check 8 may time out, so re-run
```

On the Vercel preview of this branch:
1. **/** — title "Brihadhee | Pure Veg South Indian Restaurant, Anna Nagar" (the live wording, kept on 17 Nov; see `11-gsc-baseline.md`). The at-a-glance box has a "Prices" row: "Dishes ₹35 to ₹315 on the current menu, meals ₹150 to ₹240, before 5% GST". H2 "Brihadhee Coffee Bar, Anna Nagar". No "Beyond Curry" FAQ. The footer has "Verified Brihadhee facts" and the glossary line.
2. **/about/#facts** — 10 rows, each with a date. Catering phone "confirmed 12 November 2026". "Facts last confirmed with the owner: 15 November 2026".
3. **/menu/dosa/#how-it-works** — question H2, a 51-word lead, a fact table, "Last checked: 11 November 2026".
4. **/small-function-catering-chennai/#from-50-guests** — "Yes. Brihadhee caters pure vegetarian functions in Chennai from 50 guests, and up to 1,500…", fact table, "Last checked: 15 November 2026". Nothing about staff, lead time or Jain.
5. Breadcrumbs on every inner page. None on the home page.
6. `/sitemap.xml` — 13 URLs with `<lastmod>2026-11-16</lastmod>`. `/robots.txt` — unchanged.
7. `/llms.txt` — the catering line reads "50 to 1,500 guests across Chennai, and 1,000+ corporate meals a day", with a link to `/about/#facts`.
8. Google Rich Results Test on `/`, `/about/` and `/guides/what-are-nellai-meals/`: Restaurant (LocalBusiness), Breadcrumb, Article. No errors.
9. From a network that can reach the site, run the crawler user-agent test in `06-geo-log.md`. (Run against production on 17 Nov: all ten agents got 200.)
10. `curl -i <preview>/api/lead` returns **405** (not 500), and a POST with `{}` returns 422.

## Rollback

- **Lead hotfix:** if `/api/lead` misbehaves after the hotfix, promote the previous deployment. Note that it also failed before the hotfix: rolling back restores the 500, not a working form.
- **Whole release:** in Vercel, Deployments → previous production deployment → *Promote to Production* (instant). In git, revert the merge commit (`git revert -m 1 <merge-sha>`).
- **Without a redeploy of other changes:**
  - **FAQPage markup:** set `EMIT_FAQPAGE = true` in `config/seo-gates.ts`; all checks validate it when present.
  - **Beyond Curry FAQ:** set `ENABLE_SUB_BRAND = true` (only after Q26 is a yes).
- **Single changes:** each change is its own commit; `git log main..seo-aeo-geo` lists them, and `git revert <sha>` undoes one. The build gate (`schema-visible`) can be skipped in an emergency by removing it from `check:seo` in `package.json`. Restore it afterwards.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
