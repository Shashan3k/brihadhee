# Brihadhee — website

One-page website for **Brihadhee (பிரிஹதீ)**, a South Indian restaurant in
Anna Nagar East, Chennai. Built with [Astro](https://astro.build) as a static
site: no framework runtime, no backend, no third-party services.

- **Stack:** Astro 7, hand-written CSS with design tokens, ~4 KB of vanilla JS
- **Sections:** hero, about, menu, gallery + lightbox, reviews, visit (map +
  live open/closed indicator), contact, footer
- **Content:** business facts in `src/data/entity-truth.ts` (single source of
  truth), menu and prices in `src/data/menu-canonical.ts` (from the menu PDF).
  `src/data/site.js` reads from them. No design code needs touching.
- **Strategy docs:** `docs/strategy/competitor-attack-plan.md` (competitors,
  positioning, 90-day plan, KPIs) and `docs/strategy/gbp-update-guide.md`
  (Google Business Profile, step by step). Owner checklist: `docs/owner-todo.md`.

---

## Quick start

Requires **Node 22.23+** (Astro 7).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro build + all quality gates (fails on any problem)
npm run preview   # serve the built site locally
```

### Quality gates (run automatically by `npm run build`)

| Command | What it fails on |
|---|---|
| `npm run check:facts` | An unconfirmed fact or placeholder (TODO, undefined, null, "500+ varieties", "parking"…) in any HTML, llms.txt, robots.txt, sitemap or menu.json. Unconfirmed facts in `entity-truth.ts` also make `getFact()` throw, so `astro build` itself stops first |
| `npm run check:seo` | Invalid or mismatched JSON-LD, FAQ text not matching the page, NAP differences, missing/duplicate titles or descriptions, not exactly one H1, wrong canonical, sitemap vs noindex mismatches, orphan pages, robots.txt sitemap line, non-reciprocal hreflang |
| `npm run check:links` | A broken internal link, asset or #anchor. `npm run check:links:external` also requests external links (warnings only) |
| `npm run check:compliance` | `scripts/verify-seo-compliance.ts`: any term on the 12 November keyword plan's do-not-use list (section 7: breakfast and tiffin, dosa counts, cheap/budget/value meal, rupee per-plate rates, Jain overclaims, non-veg catering, headcounts under 50) in `dist/` or `public/`; any claim behind an off gate in `config/seo-gates.ts`; gate values that disagree with `entity-truth.ts`, the catering config or `src/lib/lead.js`; a home page title, H1 or meta tag that does not pair "Brihadhee" with its category |

`npm run build:site` builds without the gates (for quick local previews only).

### Environment variables (set in Vercel → Settings → Environment Variables)

See `.env.example`. All are optional; the site works without them.

| Variable | What it does |
|---|---|
| `PUBLIC_GA4_ID` | Google Analytics 4 measurement ID (`G-XXXXXXX`). Unset = no analytics and the privacy page says so |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel ID (digits only) for Instagram/Facebook ads. Sends PageView plus Contact (call, WhatsApp), FindLocation, Schedule and Lead (enquiry form). Unset = no Meta tracking and the privacy page says so |
| `INDEXNOW_KEY` | IndexNow key (8–128 letters, numbers or dashes). Builds `/<key>.txt` and lets `npm run indexnow` ping Bing/Yandex |

### Client-verification gates (`config/seo-gates.ts`)

Keyword clusters from the 12 November plan that make a kitchen or dietary claim stay off until the owner answers the matching question (section 8 of the plan, and `docs/owner-todo.md` section Q):

| Gate | Question | What it turns on |
|---|---|---|
| `IS_CATERING_PURE_VEG` | Q20 | "pure veg" in catering copy (until then: "vegetarian catering"; the kitchen stays "100% pure vegetarian") |
| `ENABLE_NO_ONION_NO_GARLIC_CLUSTER` + `NO_ONION_NO_GARLIC_DISHES` | Q11 to Q14 | `/no-onion-no-garlic-anna-nagar/`, its nav link, sitemap and llms entry |
| `ENABLE_JAIN_FRIENDLY_CLAIMS` | Q13, Q14 | the Jain-friendly section and FAQ on that page (never "pure Jain") |
| `ENABLE_HINDI_COPY` | Q17 | Hindi and Hinglish lines on that page |
| `ENABLE_LIVE_WHATSAPP_QUOTE_FORM` + `QUOTE_WHATSAPP_NUMBER` | Q19 | the quote builder hands off to WhatsApp (until then it posts to `/api/lead`) |
| `ENABLE_BRAHMIN_RELIGIOUS_FUNCTIONS` | Q23 | seemantham, upanayanam, annadanam, homam wording |
| `ENABLE_PREMIUM_WORDING` | Q22 | "premium" |
| `ENABLE_NAMED_TEMPLE` + `NEARBY_TEMPLE` | Q24 | naming a temple on `/family-dining-anna-nagar/` |

Flip a gate only with the owner's written answer, record it in `docs/seo/client-confirmations.md`, and run `npm run build`: the compliance check fails if a gate is on without the facts it needs. To review a gated page before it goes live, run `npm run dev` and open it (it renders as a noindex draft with a banner), or build with `SEO_GATES_PREVIEW=1` into a scratch `--outDir`; never deploy that build.

The one permitted mention of a retired service is the exact question "Does Brihadhee serve breakfast?" on `/faq/` (`NEGATIVE_FAQ_QUESTION`), answered "No ... lunch and dinner only". Every other use still fails the build.

### Confirming a new fact

1. Get the owner's written confirmation.
2. In `src/data/entity-truth.ts`, change the fact from `unverified(...)` to `verified(value, "source", "YYYY-MM-DD")`.
3. Record it in `docs/seo-baseline.md` (section 6) and tick it in `docs/owner-todo.md`.
4. Run `npm run build`. If copy elsewhere still needs the fact, the gates tell you where.

### Changing a price or adding a dish

Edit `src/data/menu-canonical.ts` (prices must match the latest menu PDF). Every price on the site, the schema, llms.txt and menu.json updates from that file. Update the GBP menu the same day (`docs/strategy/gbp-update-guide.md`, step J).

### Adding a dish page or guide

1. Create `src/pages/<path>.astro` by copying `src/pages/book-a-table.astro` (simple page) or `src/pages/about.astro` (page with FAQ).
2. Use only `getFact()` values and `menu-facts.js` helpers, never hand-typed prices or hours.
3. Add the URL to `src/pages/sitemap.xml.js` and link to it from at least one other page (the orphan check fails otherwise).
4. Q&As go in `src/data/faq.js` or `src/data/pages.js` through `qa()`, one page per question.
5. `npm run build`, then request indexing in Search Console (`docs/search-console-setup.md`).

### Publishing

Push to `main`. Vercel builds www.brihadhee.com (it runs `npm run build`, so a failed gate blocks the deploy) and GitHub Actions (`.github/workflows/check.yml`) runs the same build and checks on every push and pull request. Nothing is published to GitHub Pages. After a deploy with new or changed pages, run `INDEXNOW_KEY=… npm run indexnow` (or pass paths: `npm run indexnow -- /menu/`).

### UTM links for outside profiles

Use these exact links so Google Analytics can tell where visits come from:

| Where | Link |
|---|---|
| Google Business Profile website | `https://www.brihadhee.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile` |
| GBP menu link | `https://www.brihadhee.com/menu/?utm_source=google&utm_medium=organic&utm_campaign=gbp_menu` |
| GBP reservation link | `https://www.brihadhee.com/book-a-table/?utm_source=google&utm_medium=organic&utm_campaign=gbp_booking` |
| Instagram bio | `https://www.brihadhee.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Swiggy / Zomato / District / EazyDiner "website" fields | `https://www.brihadhee.com/?utm_source=<platform>&utm_medium=referral&utm_campaign=listing` |
| YouTube descriptions | `https://www.brihadhee.com/?utm_source=youtube&utm_medium=video&utm_campaign=<video-slug>` |

---

## 1. Fill in the business details

Open **`src/data/site.js`** and fill the values listed below. Empty values are
never shown to visitors — the related button, row or section simply stays
hidden, so nothing half-finished ever appears on the live site.

| What | Field | Effect when filled |
|---|---|---|
| Phone | `contact.phone` | Adds "Call now" to the sticky header, hero, visit section and mobile action bar; adds `telephone` to the structured data |
| WhatsApp | `contact.whatsapp` | Adds a WhatsApp button in Contact; the enquiry form sends through WhatsApp |
| Email | `contact.email` | Adds an email link; enables the enquiry form when no WhatsApp is set |
| Pin code | `address.postalCode` | Appended to the address and the map query |
| Google Maps link | `maps.directions`, `maps.embed` | Currently generated from the address — replace with the exact place URL if you have one |
| Hours | `hours.days`, `hours.summary` | Drives the hours table and the Open now / Closed badge |
| Testimonials | `testimonials` | Adds review cards (array of `{ quote, name, meta }`) |
| Social | `social.instagram`, `social.facebook` | Adds footer icon links (full URLs) |
| Photos | `media.*` | See section 3 |

> **Hours need checking before launch.** The site ships with 11:00 AM – 11:00 PM
> daily, provided by the owner but not yet confirmed against the Google
> Business Profile (and any afternoon break). Edit `hours.days`. Set
> `hours.verified: false` to hide the hours table and the badge entirely until
> they are confirmed.

### Logo and favicon

- The supplied logo is now used in `Nav.astro` and `Footer.astro` from
  `public/images/logo.png`. Replace that file if the client provides a higher
  resolution transparent logo.
- `public/favicon.svg` and `public/icon-192.png` / `icon-512.png` are the
  generated kolam mark. To use the real logo, replace those three files
  (keep the names) and update `public/site.webmanifest` if the sizes change.

---

## 2. Replace the menu

Edit **`src/data/menu.json`**. Structure:

```json
{
  "isSample": true,
  "categories": [
    {
      "id": "dosa",
      "name": "Dosa Varieties",
      "blurb": "One line shown under the category name.",
      "items": [
        {
          "name": "Ghee Roast Dosa",
          "description": "Short description.",
          "price": 180,
          "diet": "veg",
          "tags": ["Signature"]
        }
      ]
    }
  ]
}
```

- `diet` is `"veg"` or `"nonveg"` — this drives the green/red mark and the
  legend. (Whether the kitchen serves non-veg is still unconfirmed; the sample
  data is vegetarian only.)
- `tags` is optional (`[]` to hide), e.g. `"Signature"`, `"Chef's special"`.
- `price` is a number; the ₹ symbol comes from `currency`.
- `isSample: true` shows the "Preview menu" note above the tabs. **Set it to
  `false` once the real menu is in place** — that removes the note.
- Category `id` values must be unique and URL-safe (they become DOM ids).

The menu is fully present in the HTML, so search engines and visitors without
JavaScript still see every category. JavaScript only upgrades it to tabs.

---

## 3. Update the photos

Production images live in **`public/images/`**. The original WhatsApp photo
exports are kept outside the deployed folder; copy only selected, optimized
photos into `public/images/` and update `src/data/site.js` with their actual
subject, dimensions, alt text and caption. Do not infer a photo's subject from
its filename.

| File | Used for | Recommended size | Notes |
|---|---|---|---|
| `hero.jpg` | Hero image | 1600 × 1200 (4:3) | Use a real restaurant or food photo |
| `interior-illustration.svg` | About + gallery | 1200 × 900 viewBox | Clearly labeled illustration; not a photo of the restaurant |
| `dosa.jpg` | About + gallery | 1200 × 900 | Real dosa photo |
| `coffee.jpg` | About card + gallery | 1000 × 1000 (square) | Real coffee photo |
| `meals.jpg` | Gallery | 1200 × 900 | Real meal photo |
| `meal-box-rice.jpg` | Cloud Kitchen | 1200 × 1200 | Supplied meal-box photo, rice and spiced rice |
| `meal-box-roti.jpg` | Cloud Kitchen | 1200 × 1200 | Supplied meal-box photo, flatbreads and curry |
| `tiffin.jpg` | Gallery | 1200 × 900 | Real tiffin/dosa photo |
| `sweets.jpg` | Gallery | 1200 × 900 | Real dessert photo |
| `og-image.jpg` | WhatsApp/Facebook/Twitter link preview | 1200 × 630 | Brand artwork with the logo/name |

Practical tips:

- Export JPEG at quality ~80–88 and keep each photo under ~350 KB where possible.
- Alt text and captions in `src/data/site.js` must describe the actual image. Label
  artwork as an illustration; never present it as a photo of Brihadhee or a dish.
- Width/height attributes come from `media.*.width/height`; keep them aligned
  with the image dimensions to avoid layout shift.
- Gallery labels are separate HTML captions. Never bake filenames or replacement
  instructions into the image itself.
- To regenerate text-free fallback illustrations (only missing files are created):
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/generate-placeholders.ps1
  ```

### Video

The 29-second video from the Business Profile is not included. Put the file in
`public/video/` (e.g. `public/video/brihadhee.mp4`), then set:

```js
// src/data/site.js
media: { video: { src: "/video/brihadhee.mp4", poster: "/images/interior.jpg", … } }
```

The gallery card appears automatically (with `preload="none"`, so it costs
nothing until played). Keep it under ~10 MB, H.264 MP4, muted-friendly.

---

## 4. Deploy

The build is plain static files in `dist/`. Any static host works.

### Netlify

- Connect the repository, or drag the `dist/` folder into the Netlify UI.
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: set `NODE_VERSION=22` in site settings if the default is older.

### Vercel

- Import the repository. Vercel detects Astro automatically.
- Framework preset: **Astro** — build `npm run build`, output `dist`.
- No server functions are used, so everything is served as static files.

### GitHub Pages: do not use

An old copy was published at `shashan3k.github.io/brihadhee`, which competed with
www.brihadhee.com in search. The workflow no longer deploys there. Keep Pages
switched off (Settings > Pages > Source: None) so only the custom domain is public.

### Before you publish

The live domain is `https://www.brihadhee.com`. It is set in two places: `SITE_ORIGIN` in `src/data/entity-truth.ts` (canonical, schema, sitemap, robots, llms, menu.json) and `site` in `astro.config.mjs`. robots.txt, sitemaps, llms files and menu.json are generated at build time; never hand-edit them.

---

## 5. What to check before launch

> The current, owner-specific list lives in `docs/owner-todo.md`. The list below is the original launch checklist.

- [ ] Phone, WhatsApp and email added (`site.js`)
- [ ] Opening hours verified (and any afternoon break handled)
- [ ] Price range checked — the site shows "₹200 – ₹400 per person" (Google);
      the research notes also mention a "₹200 for two" figure, so confirm which
      is current and edit `priceGuide` / `priceRange` if needed
- [ ] Real menu in `menu.json`, `isSample` set to `false`
- [ ] Real photos in `public/images/`, alt text updated
- [ ] Logo + favicon/app icons replaced
- [ ] Instagram / Facebook links added
- [ ] 3–5 real testimonials added (with permission)
- [ ] Pin code added
- [ ] Parking and payment details confirmed — then add them to `amenities`
      in `site.js` (they are deliberately omitted until confirmed)
- [ ] Domain updated in the four places above
- [ ] Google Business Profile links to the new site

---

## Project structure

```
public/
  fonts/            self-hosted woff2 (Fraunces, Instrument Sans, Noto Sans Tamil)
  images/           photos + placeholders + og image
  favicon.svg       kolam mark
  icon-192.png      app icon
  icon-512.png      app icon
  robots.txt
  sitemap.xml
  site.webmanifest
scripts/
  generate-placeholders.ps1
src/
  components/       Nav, Hero, About, MenuSection, Gallery, Reviews, Visit,
                    Contact, Footer, CallBar, KolamDivider, Stars, Icon
  data/
    site.js         all business details + feature flags
    menu.json       menu content
  layouts/Base.astro   <head>, SEO tags, JSON-LD
  pages/index.astro    the single page
  scripts/main.js      nav, tabs, lightbox, opening-hours, form
  styles/global.css    design tokens + all styles
astro.config.mjs
```

---

## How it works

- **No backend.** The enquiry form composes a message and opens WhatsApp
  (`wa.me/…`) or the visitor's email app (`mailto:`). Nothing is stored.
- **Open now / Closed** is computed in the browser from the `hours` array using
  the `Asia/Kolkata` time zone, so it is correct even for visitors abroad. It
  also highlights today's row. Without JavaScript the hours table is still
  readable; only the badge is hidden.
- **Menu tabs** are progressive: every category is in the HTML, and the tab
  interface is applied on top. Arrow keys, Home and End work; the tablist
  follows the ARIA tabs pattern.
- **Gallery** opens a native `<dialog>` lightbox with keyboard arrows, Escape,
  and focus returned to the thumbnail on close.
- **Scroll reveals** are disabled under `prefers-reduced-motion: reduce`, and
  the page prints cleanly.
- **SEO:** title/description/Open Graph/Twitter tags, `Restaurant` JSON-LD
  (address, opening hours, aggregate rating, cuisine, price range), sitemap,
  robots, manifest and a canonical URL. No third-party platform URLs appear in
  the markup or structured data.
