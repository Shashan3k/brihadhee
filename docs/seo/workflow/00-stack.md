# 00 Stack and commands

Written 2026-11-16 on branch `seo-aeo-geo`. No site code was changed in this step.

## Stack

| Item | Value | Source |
| --- | --- | --- |
| Framework | Astro ^7.4.5, `output: "static"`, ESM, TypeScript ^5.9 | `package.json`, `astro.config.mjs` |
| Rendering | Every page pre-rendered to static HTML in `dist/`, no server runtime | `astro.config.mjs` |
| Site origin | `SITE_ORIGIN` from `src/data/entity-truth.ts` (https://www.brihadhee.com), `base: "/"` | `astro.config.mjs` |
| Hosting | Vercel, custom domain www.brihadhee.com. apex and `brihadhee.vercel.app` 301 to www. `*.vercel.app` gets `X-Robots-Tag: noindex`. GitHub Pages was turned off 2026-11-11 | `vercel.json`, `.github/workflows/check.yml` |
| CI | GitHub Actions on push to main and PRs: Node 22, `npm ci`, `npm test`, `npm run build`, `npm run verify`. It never deploys | `.github/workflows/check.yml` |
| Pages | Astro files in `src/pages/` (20 built pages, 18 indexable, 80 dishes). Includes `[slug].astro` for dynamic pages, `menu/`, `guides/`, `seasonal/` | `src/pages` |
| Sitemap | Hand-written endpoints `src/pages/sitemap.xml.js` and `sitemap-index.xml.js`, not `@astrojs/sitemap` | `src/pages` |
| robots.txt | `src/pages/robots.txt.js`. Allows `*` plus an explicit list of AI agents, links `sitemap-index.xml`. Policy in `docs/seo/ai-crawler-policy.md` | `src/pages/robots.txt.js` |
| AI files | `llms.txt.js`, `llms-full.txt.js`, `menu.json.js`, `site.webmanifest.js`, `[indexnowKey].txt.js` | `src/pages` |
| Facts and menu data | `src/data/entity-truth.ts`, `src/data/menu-canonical.ts`, `src/data/site.js`. Checks compare built HTML and JSON-LD to these | `scripts/verify-seo-aeo-geo.mjs` |
| Gates | `config/seo-gates.ts` feature gates (catering pure veg on; onion/garlic-free, Jain, Hindi, Brahmin, premium, named temple, live WhatsApp quote form off) | build output |

## Commands (all confirmed 2026-11-16)

| Purpose | Command | Result |
| --- | --- | --- |
| Install | `npm ci` | not rerun, `node_modules` present |
| Dev | `npm run dev` | not run, see WSL note |
| Build (site + all checks) | `npm run build` | passed, about 85 s |
| Build only | `npm run build:site` | covered by the line above |
| All checks on existing `dist/` | `npm run check` | passed inside build |
| Tests | `npm test` | 21 of 21 passed |
| Typecheck | `npm run typecheck` | passed |
| End-to-end SEO/AEO/GEO gate | `npm run verify` | all 8 checks passed |
| Lighthouse (local only) | `npm run verify:lighthouse` | not run |
| External link check | `npm run check:links:external` | not run |

Checks inside `npm run check`: `check:facts` (guardrails, facts), `check:seo` (schema, AEO lint, SEO), `check:compliance` (gated-claim rules), `check:links` (internal links, link matrix).

## Known quirks

- **Side effects of the build:** `aeo-lint.mjs` and `check-internal-links.mjs` rewrite `docs/seo/aeo-lint-report.md` and `docs/seo/internal-link-matrix.md` (a date line). Run `git checkout -- <file>` for those two unless the content really changed.
- **WSL:** `node_modules` was installed on Windows. The Linux native bindings (rolldown, lightningcss, satteri, astro compiler) have been added to it and are present. WSL's `/usr/bin/node` (v24.19) cannot import `.ts` files, so the checks fail with `ERR_UNKNOWN_FILE_EXTENSION`. Use an official Node 24 tarball first on PATH. `process.features.typescript` must not be `false`. This session used Node v24.22.3 from an earlier scratchpad copy that may be cleaned up. CI (Node 22) and Vercel are unaffected.
- **Preview server:** the first `npm run verify` can fail check 8 ("preview server did not start on port 4329") because the server is slow to start on /mnt/c. Stop it with `node node_modules/astro/bin/astro.mjs preview stop` and rerun. It passed on the rerun.
- `astro dev` does not start within 30 s on /mnt/c. To view pages, build and serve `dist/` with `python3 -m http.server`.
- Many tracked files use CRLF. Edit byte-preserving or restore line endings, or the diff shows whole files.
- The working tree already had uncommitted changes at the start of this step (modified docs, `astro.config.mjs`, `robots.txt.js`, `Offers.astro`, `menu-canonical.ts` and others). They are not part of the workflow-setup commit.

## Tracker inputs read

| File | State |
| --- | --- |
| `docs/seo/Brihadhee_SEO_AEO_Ranking_Tracker.xlsx` | **Missing at this path.** A copy is at `outputs/01a1e316-a4d5-7e91-98d3-6eba7dab1c9c/Brihadhee_SEO_AEO_Ranking_Tracker.xlsx`. Its sheets are `SEO rankings`, `AEO tracking`, `Observed results` |
| `docs/seo/keyword-tracker.csv` | Read. 845 data rows. Status counts: TARGET 268, OWNER_CONFIRMATION 191, ANSWERED 171, TRACK_ONLY 76, APPROVAL_GATED 60, EXCLUDED 30, LOCATION_DEPENDENT 24, SUPPORTING_VARIANT 20, SOURCE_NOTE 5. No HOLD rows |
| `docs/seo/search-visibility-report.md` | Read. No confirmed Google organic position for brihadhee.com. One dated AI Overview recommendation (12 Nov, dosa query) |
| `docs/geo/visibility-log.csv` | Read. 7 rows from 9 Nov 2026 |
| `R_AEO.md` | Read. Results as of 14 Nov 2026, with 15 Nov owner approval of pure vegetarian catering |
