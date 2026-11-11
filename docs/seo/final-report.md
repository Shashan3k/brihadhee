# Brihadhee SEO / AEO / GEO: final report (Stages 1 to 3)

Date: 2026-11-11. Production URL: **https://www.brihadhee.com** (Vercel). GitHub Pages turned off 2026-11-11.

## 1. Skills found and used

| Skill | Path | Used for |
|---|---|---|
| `aeo` | `…/skills-plugin/…/skills/aeo/SKILL.md` | Stage 1 audit (`npx @canonry/aeo-audit@7`, run with owner approval): per-page AEO scores |
| `technical-seo-audit` | `…/skills/technical-seo-audit/SKILL.md` | Crawl, indexing, canonical, duplicate-host checks |
| `local-seo-audit` | `…/skills/local-seo-audit/SKILL.md` | NAP consistency, GBP checklist |
| `seo-geo-aeo` | `…/skills/seo-geo-aeo/SKILL.md` | GEO / AEO signal review (report format not used) |

No `.claude/skills/` or `.agents/skills/` directory exists in the repo or the user profile. The `claude-seo` and `claude-site-audit` plugins appeared later in the session and were not run.

## 2. Before and after

**Lighthouse, mobile** (baseline: Lighthouse 12.8.2 against brihadhee.vercel.app, 2026-11-06; final: same Lighthouse against the local production build via `npm run verify:lighthouse`, 2026-11-11). Lab numbers, single run each.

| Route | Perf before → after | A11y | SEO |
|---|---|---|---|
| `/` | 89 → 90 | 100 → 100 | 100 → 100 |
| `/menu/` | 97 → 99 | 100 → 100 | 100 → 100 |
| `/best-dosa-parotta-anna-nagar/` | 98 → 99 | 100 → 100 | 100 → 100 |
| `/catering-services-chennai/` | 97 → 98 | 100 → 100 | 100 → 100 |
| `/about/` | (new) → 98 | 100 | 100 |

**Raw HTML (no JavaScript), visible words**

| Route | Before | After | Q&As after |
|---|---|---|---|
| `/` | 2,810 | 2,261 | 7 |
| `/menu/` | 1,185 | 1,767 | 4 |
| `/best-dosa-parotta-anna-nagar/` | 1,077 | 1,254 | 5 |
| `/nellai-meals-south-indian-veg-anna-nagar/` | 721 | 747 | 5 |
| `/catering-services-chennai/` | 1,025 | 1,264 | 11 |
| `/event-planner-catering-partner/` | 825 | 865 | 4 |
| `/about/` | (new) | 608 | 4 |
| `/book-a-table/` | (new) | 313 | 0 |

**AEO audit tool** (before only): pages scored 71 to 79 / 100; sitemap mode scored 0 because the sitemap on www listed github.io URLs. Fixed: sitemap, canonicals, schema and llms files now all use https://www.brihadhee.com.

**Conflict resolution**

| Topic | Third-party / old value | Resolved value | Source in the repo |
|---|---|---|---|
| Veg status | EazyDiner FAQ: veg and non-veg | 100% pure vegetarian | `src/data/entity-truth.ts` (`dietary`); menu PDFs list no meat, egg or fish |
| Address | Justdial: "18th Main Road" (Beyond Curry listing) | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai 600040 | `entity-truth.ts` (`address`) |
| Phone | GBP reportedly 073587 14113 | +91 94442 24999 | `entity-truth.ts` (`phone`); owner to confirm which number GBP shows (`docs/owner-todo.md` #1) |
| Hours | 6:30 AM (EazyDiner, old brief) | 11 AM to 11 PM, lunch and dinner only | `entity-truth.ts` (`hours`, `mealTimes`) |
| Pricing | ₹200 to ₹800 for two across listings | No cost-for-two claim; dish prices only | `entity-truth.ts` (`costForTwo` unverified) |
| Menu | old PDF, brief prices | 80 dishes + Build Your Own Dosa from `new menu.pdf` | `src/data/menu-canonical.ts` |
| Dosa claim | "500 varieties" (Instagram) | Build Your Own Dosa | `menu-canonical.ts` (`BUILD_YOUR_OWN_DOSA`); "500" blocked by a probe |

## 3. Unverified / needs owner confirmation

Not shown anywhere on the site, schema or llms files; the build fails if they appear (`entity-truth.ts` probes, `RETIRED_TERMS`).

1. Which days the restaurant opens, and the last-order time (`openDays`)
2. WhatsApp number (`whatsapp`); which phone Google Business Profile shows
3. Parking (`parking`)
4. Google rating and review count with a date (`googleRating`)
5. Cost for two (`costForTwo`)
6. Late-night dining claim (`lateNight`)
7. Corporate client names and headcounts (`corporateClients`)
8. Registered legal name (`legalName`)
9. Pure-veg wording for catering; Beyond Curry relationship; filter coffee counter
10. Coimbatore Mappillai: printed ₹215, parts add up to ₹225
11. Descriptions for new dishes (Pottalam Parotta, Kongu Nei Varuval, signature drinks and others)
12. Jain / no-onion-no-garlic options (see `keyword.md` 3.15): what the kitchen can do
13. Google-Extended: robots.txt allows it per the 2026-11-05 owner decision (`docs/seo/ai-crawler-policy.md`); reconfirm

## 4. Routes and files

Route map: `docs/seo/route-map.md`. All routes are static HTML (Astro `output: "static"`).

Key files: `src/data/entity-truth.ts`, `src/data/menu-canonical.ts`, `src/lib/schema.js`, `src/lib/answers.js`, `src/lib/llms.js`, `src/components/BuildYourOwnDosa.astro`, `src/pages/about.astro`, `src/pages/robots.txt.js`, `src/pages/sitemap*.xml.js`, `src/pages/llms*.txt.js`, `src/pages/menu.json.js`, `vercel.json`, `scripts/verify-seo-aeo-geo.mjs`, `.github/workflows/check.yml`.

## 5. Terminal output (2026-11-11)

`npm run build` (astro build, then the check suite):

```
> brihadhee@1.0.0 check:facts
✔ SEO guardrails passed (13 file(s) scanned)
✔ check:facts passed (17 file(s), 9 pending fact(s) guarded)
> brihadhee@1.0.0 check:seo
✔ Schema valid: 50 JSON-LD node(s) on 10 page(s) (incl. catering pages)
✔ AEO lint passed (10 page(s)). Report: docs\seo\aeo-lint-report.md
✔ check:seo passed (9 page(s), 8 in sitemap, 0 warning(s))
> brihadhee@1.0.0 check:links
✔ check:links passed (464 internal link(s) on 10 page(s); 5 external not fetched (use --external))
build exit=0
```

`npx tsc --noEmit`: `tsc exit=0`. Lint: **no linter is configured** in this repo (not run).

`node scripts/verify-seo-aeo-geo.mjs --lighthouse`:

```
  Lighthouse /: Performance 90, Accessibility 100, SEO 100
  Lighthouse /menu/: Performance 99, Accessibility 100, SEO 100
  Lighthouse /best-dosa-parotta-anna-nagar/: Performance 99, Accessibility 100, SEO 100
  Lighthouse /catering-services-chennai/: Performance 98, Accessibility 100, SEO 100
  Lighthouse /about/: Performance 98, Accessibility 100, SEO 100

verify-seo-aeo-geo: 10 pages (8 indexable), 80 dishes
  ✔ 1 Headings
  ✔ 2 NAP in HTML
  ✔ 3 Menu in HTML
  ✔ 4 Q&A
  ✔ 5 Meta
  ✔ 6 JSON-LD
  ✔ 7 Links & images
  ✔ 8 Preview server
  ✔ 9 Lighthouse

✔ All checks passed
exit=0
```

The verify script was also run against a deliberately broken copy of the build (wrong price, second H1, broken link, image without alt, wrong schema phone, "parking" claim): it reported all six and exited 1.

## 6. Known limits

- `llms.txt` and `llms-full.txt` are low-cost extras; no major engine has confirmed it reads them.
- Google shows FAQ rich results only for a small set of sites; FAQPage is kept for machine readability, not for a snippet.
- Lighthouse numbers are lab runs on a local build; field data (CrUX) needs real traffic. Home performance (90) is at the threshold; the LCP element is the web-font H1.
- IndexNow is wired (`scripts/indexnow.mjs`, key route) but needs `INDEXNOW_KEY` set in Vercel and a ping after each deploy; Google does not use IndexNow.
- No ranking or AI-citation outcome is guaranteed; off-page signals (GBP, reviews, listings) matter as much as the site.

## 7. Off-page playbook (in order)

Detailed guides: `docs/strategy/gbp-update-guide.md` (updated 2026-11-11), `docs/search-console-setup.md`, `docs/brihadhee-aeo-ops.md`, `docs/geo/`.

1. **Google Business Profile (week 1).** Primary category: South Indian restaurant (keep). Secondary: Vegetarian restaurant, Family restaurant, Caterer, Indian restaurant (not Breakfast restaurant). Hours 11 AM to 11 PM on confirmed days. Phone +91 94442 24999 (confirm). Website https://www.brihadhee.com. Description from the guide. Untick breakfast.
2. **Menu and photos (week 1 to 2).** Enter the 12 sections and Build Your Own Dosa in GBP Menu with the `new menu.pdf` prices. Upload 20+ real photos: dosas being built, Paanai Parotta, Nellai sodhi meal, interior, exterior, catering live counters.
3. **Q&A seeding (week 2).** Post the guide's 16 Q&As as the owner: pure veg, timings, no breakfast, Build Your Own Dosa, catering, location.
4. **Catering service area (week 2).** Add "Catering" services and service area Chennai; describe corporate catering (1,000+ people a day) and end-to-end events.
5. **Listing corrections (weeks 2 to 4).** EazyDiner: remove non-veg, set 11 AM to 11 PM. Justdial: fix the Beyond Curry address and non-veg tags. Swiggy Dineout and District: hours, pure veg, menu. Attach as evidence: the menu PDF, a storefront photo, the GBP link and https://www.brihadhee.com/about/. Log each request in `docs/geo/corrections-log.csv`.
6. **Search Console and Bing Webmaster Tools (week 1).** Verify https://www.brihadhee.com, submit `/sitemap-index.xml`, request indexing of the 8 pages, request removal of old `shashan3k.github.io/brihadhee/` URLs. Set `INDEXNOW_KEY` in Vercel and run `npm run indexnow` after deploys.
7. **Reviews (ongoing).** Table and bill QR card to the Google review link; no incentives, no gating, no scripted wording. Reply to every review within 48 hours.
8. **Measurement (30 / 60 / 90 days, against `docs/seo-baseline.md`).**
   - Day 30: GBP calls, direction requests and searches; Search Console impressions for "pure veg restaurant Anna Nagar", "build your own dosa", "Nellai meals"; listing corrections done.
   - Day 60: queries and clicks per page; review count and rating trend; first AI-answer checks (`docs/seo/aeo-accuracy-log.csv`).
   - Day 90: re-run `npm run verify:lighthouse` and the AEO audit tool and compare with the baseline; re-check the 18 AEO prompts across ChatGPT, Perplexity, Gemini and Google AI.
