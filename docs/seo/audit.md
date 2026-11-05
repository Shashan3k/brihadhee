# Brihadhee SEO / AEO / GEO audit (Step 1)

Date: 2026-11-05. Scope: repository at commit `9627494` and the two live copies. Nothing was changed in code for this audit.
Competitor findings are in `docs/seo/competitor-benchmark.md`.

**What was and was not measured.** Source files, the built `dist/` HTML, live HTTP responses (curl) and the live HTML head were inspected. Core Web Vitals were **not measured** (no lab or field run was possible here); see section 7. Accessibility was reviewed from markup only, not with a screen reader or contrast tool.

**Input files.** The brief says the inputs are `docs/seo/Key.md` and `docs/seo/Catering_Keywords.md`. Neither exists. The single `Key.md` is in the repo root, is gitignored (so it is not in the repository or CI), and holds both the restaurant and catering tracks. Recommended: split it into the two files under `docs/seo/` and un-ignore them.

---

## 1. Routes, templates and files

| Item | State |
|---|---|
| Routes built | `/` only. `/catering/` exists in code ([src/pages/[slug].astro](../../src/pages/[slug].astro)) but is **not built** while `offer_catering` is false |
| Generated files | `sitemap.xml` (1 URL), `robots.txt`, `llms.txt` (all from `src/pages/*.js`) |
| Components | Nav, Hero, Services, About, MenuSection, Gallery, Reviews, Visit, Faq, Contact, Footer, CallBar |
| Redirects | None. No `vercel.json`, no `_redirects` |
| Deploy targets | GitHub Pages (workflow, builds with base `/brihadhee`) **and** Vercel (no config, builds with base `/`) |
| CI | `npm run build` then `npm run validate` (guardrail and schema validators) |
| Not present | `/menu`, `/faq`, `WebSite`, `WebPage`, `BreadcrumbList`, `Menu`/`MenuItem` schema |

## 2. Domain and canonical audit (highest impact)

Both copies serve the same page and both declare the **github.io** canonical:

| | github.io copy | vercel.app copy |
|---|---|---|
| URL | `shashan3k.github.io/brihadhee/` | `brihadhee.vercel.app` |
| canonical / og:url | `https://shashan3k.github.io/brihadhee/` | same (points at the other host) |
| og:image | `.../brihadhee/images/og-image.jpg` -> **200** | `https://shashan3k.github.io/images/og-image.jpg` -> **404** |
| robots.txt | at `/brihadhee/robots.txt` (200), but the host root `/robots.txt` is **404**, so crawlers ignore it | at the real root (200) and honoured, but its `Sitemap:` points to the other host |
| sitemap, llms.txt | under `/brihadhee/`, not at the host root | at the root |

Findings:
1. **Root cause:** `site.url` in `src/data/site.js` is a hard-coded string containing `/brihadhee`, while the Astro `base` changes per host (`/brihadhee` on GitHub Actions, `/` elsewhere). Any absolute URL built from `site.url` plus an asset path is wrong on the Vercel build (broken og:image, twitter:image, JSON-LD `image` URLs).
2. **Crawl signals on GitHub Pages are not reachable:** robots.txt, `llms.txt` and the sitemap are only honoured from the host root. A project page at `/brihadhee/` cannot serve them there.
3. **Split signals:** two public duplicates exist; Vercel serves a page that tells Google another host is canonical, so the Vercel copy will rarely be indexed, which is acceptable only as an interim.
4. **Preview deployments** on Vercel are indexable (no `X-Robots-Tag` or `noindex` for non-production).

Recommendation (to be decided in Step 2, depends on client item 1):
- Choose a **custom domain** (e.g. brihadhee.in) and attach it to **Vercel**: root-level `robots.txt`, `sitemap.xml`, `llms.txt`, real 301 redirects, and preview protection are available there.
- Retire GitHub Pages: after the custom domain is live, disable Pages (GitHub Pages cannot 301); until then keep canonical pointing at the final domain.
- Drive all absolute URLs from Astro's `site` (and `base` only if needed) instead of `site.url`; add a check to the schema validator that every absolute URL in the HTML resolves on the chosen domain.
- Redirect `brihadhee.vercel.app` to the custom domain.

## 3. On-page audit (home page)

| Element | Current | Issue |
|---|---|---|
| Title | "Brihadhee \| Vegetarian South Indian Restaurant, Anna Nagar" (58 chars) | The brief's suggested title is 68 chars and will truncate in results; keep short or add "Chennai" at about 66 chars. Decision needed |
| Meta description | 158 chars, no hours | OK |
| H1 | "Brihadhee" + sub-line "Vegetarian South Indian restaurant in Anna Nagar" | Lacks "East" and "Chennai" versus the brief's H1 |
| Headings | one H1; H2s: services, about, menu, gallery, reviews, visit, FAQ, contact | Footer headings already converted to labels. Menu items use H4 under H3 categories (fine) |
| Canonical | present, wrong host on Vercel copy only in the sense of duplicate | See section 2 |
| `lang` | `en-IN` on `<html>` | Tamil is marked `lang="ta"` on one element only (hero name). Tamil also appears in meta keywords, `alternateName` |
| Meta `keywords`, `ICBM`, `geo.*` | present | Ignored by Google; recommend removing (keep `geo` in schema) |
| OG/Twitter | complete | og:image 404 on Vercel copy |
| Internal links | anchors only (`#menu`, `#visit`, ...); no broken anchors | No crawlable second page |
| Alt text | descriptive and specific | `lightbox-image` has empty alt (decorative target, acceptable). Same photos reused (meals.jpg, coffee.jpg appear more than once) |

## 4. Structured data (source: `src/lib/schema.js`, validated by `npm run validate`)

Emitted: `Restaurant` (name, alternateName, address, geo, E.164 telephone, email, servesCuisine, image, hasMenu, amenityFeature) and `FAQPage` (7 Q&A, `about` -> Restaurant). Passes the local validator.

Gaps against the brief:
- Missing: `WebSite`, `WebPage`, `BreadcrumbList`, `priceRange` (no confirmed value), `openingHoursSpecification` (correctly omitted), `sameAs` (no URLs), `Menu`/`MenuItem` (prices not confirmed final).
- `hasMenu` points to an in-page anchor (`/#menu`), not a menu page.
- `description` and FAQ contain the unconfirmed "customizable dosas" claim (via `shortDescription`).
- `AggregateRating` is correctly absent.
- Not yet checked in Google's Rich Results Test or the Schema Markup Validator (needs the live URL). Result must go to `docs/seo/schema-validation.md`.

## 5. Claims not backed by Step 0

| Claim | Where | Status |
|---|---|---|
| "customizable dosas" | hero sub-line, About highlight, `shortDescription` (meta, OG, Twitter, schema), `longDescription`, `reviewSummary`, `reviewHighlights`, `llms.txt` "Known for" | **Contradicts** the Services card "Build Your Own Dosa · Coming soon"; the menu has no such item. Unconfirmed |
| 4.2 rating and 857 reviews | Reviews section and hero badge | Source and date unknown (earlier screenshot). No "last checked" date |
| Hero rating stars | hero badge shows `★★★★★` as plain text | **Five full stars for a 4.2 rating.** The Reviews section uses accurate partial stars (`Stars.astro`); the hero does not |
| "Freshly made" | hero tag, About text | Unconfirmed |
| "lunch and dinner" | FAQ answer (family-friendly, nearby-restaurant) | Implies hours; unconfirmed |
| Family-friendly, kids welcome | FAQ, review card, schema amenities | Came from the Google profile notes; owner has not confirmed |
| "Value-Meal-Box" / "cloud kitchen" | Services | How it is sold is unknown; no ordering path |
| Prices (49 items) | menu | Price final? unconfirmed |
| Vegetarian only | site-wide | Brief says yes; earlier notes left it open; get it in writing |
| Opening hours | hidden (`verified: false`), but the data file holds 11:00 to 23:00 | A different source says 6:30 AM to 11 PM; unresolved |

My own earlier work added "Known for: customizable dosas" to `llms.txt`; that line needs the same fix.

## 6. NAP, hours and price: consistency

Name, address and phone are read from one file (`src/data/site.js`) by every component, meta tag, schema node and generated file, so **no on-site mismatches** were found. Differences with other sources:
- Address wording: older notes say "W-41 (Old No. W-124)"; the site says "New W-41 (Old W-124)". Match the Google Business Profile.
- Hours: `site.js` 11:00 to 23:00 (unverified) versus 6:30 AM to 11 PM in an older listing.
- Price range: `Key.md` says ₹200 to ₹400; the data file has none (`priceRange` empty).
- Phone is shown as `+91 73587 14113` and linked as `+917358714113` (same number, two formats; fine).

## 7. Performance and accessibility (static review only)

- Hero image is eager with `fetchpriority="high"`, width/height set, 114 KB (after compression). Other images are lazy with dimensions. Total JS about 7 KB, CSS about 44 KB, three fonts preloaded. Static signals suggest low LCP, CLS and INP risk, but **nothing was measured**. Run PageSpeed Insights on the final URL (mobile) and record LCP, INP, CLS.
- Image formats: JPG/PNG only (no AVIF/WebP). File names are generic (`hero.jpg`, `meals.jpg`).
- `interior-illustration.svg` is unused but still deployed.
- Sticky bottom bar (CallBar) appears after scroll; whether it causes layout shift was not tested.
- Accessibility basics present: skip link, `aria-label`s, decorative icons hidden, form labels, `aria-hidden` stars. Not tested: contrast ratios, keyboard focus order, screen-reader behaviour.

## 8. Crawling and AI access

- `robots.txt` allows everything and lists 8 AI agents explicitly. **Correction to my earlier work:** that list includes training-related agents (`ClaudeBot`, `Google-Extended`). The brief treats training crawlers as an owner decision, so they should be removed from the explicit list until decided (the `*` rule still allows them unless the owner chooses otherwise). Record the decision in `docs/seo/ai-crawler-policy.md`.
- `llms.txt` is generated from confirmed facts but carries the "customizable dosas" line (see section 5).
- `sitemap.xml` lists one URL; `lastmod` is the build date on every build, which overstates freshness. Use a real content-change date.
- Sitemap not yet submitted to Search Console or Bing Webmaster Tools; the final domain is not verified in either.

## 9. Local and reviews

- Google Business Profile, directory consistency and review process are not code; see the checklist to be written in Step 7 and `docs/brihadhee-aeo-ops.md` (disputes for the EazyDiner and Justdial veg/non-veg tags).
- No testimonials on the site (`testimonials: []`).

## 10. Prioritised findings

| # | Severity | Finding | Fix (step) |
|---|---|---|---|
| 1 | High | Duplicate hosts, hard-coded `site.url`, og:image 404 on Vercel, root-level crawl files unreachable on GitHub Pages | Step 2 (needs client item 1) |
| 2 | High | "Customizable dosas" claimed in 7 source locations while "coming soon" and absent from the menu | **Done 2026-11-05: softened everywhere, "Build Your Own Dosa" line removed, guardrail added (`customizable_dosas_confirmed`)** |
| 3 | High | Hero badge shows 5 full stars for 4.2; no "last checked" date | Step 2/4 |
| 4 | Medium | Single route; no crawlable `/menu` | Step 3 |
| 5 | Medium | Schema missing WebSite/WebPage/BreadcrumbList, priceRange, sameAs | Step 5 |
| 6 | Medium | H1 and title do not include "Chennai"/"East" (title length trade-off) | Step 4, decision needed |
| 7 | Medium | Training-crawler agents explicitly allowed in robots.txt | Step 6 |
| 8 | Medium | Vercel preview deployments indexable | Step 2 |
| 9 | Low | Meta keywords, ICBM, geo tags | Step 2 |
| 10 | Low | JPG/PNG only, generic file names, unused SVG, no PageSpeed numbers | Step 8 |
| 11 | Low | Unconfirmed minor claims ("freshly made", lunch and dinner, family-friendly) | Step 4 |

## 11. Questions to resolve before Step 2

1. Which domain is final (custom domain or stay free)? This decides the canonical, the host and the redirect plan.
2. Customizable dosas: confirm and describe, or soften everywhere?
3. Title and H1: keep the shorter title, or use the brief's longer one?
4. Train crawlers: allow or block?
