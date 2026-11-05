# Brihadhee — website

One-page website for **Brihadhee (பிரிஹதீ)**, a South Indian restaurant in
Anna Nagar East, Chennai. Built with [Astro](https://astro.build) as a static
site: no framework runtime, no backend, no third-party services.

- **Stack:** Astro 7, hand-written CSS with design tokens, ~4 KB of vanilla JS
- **Sections:** hero, about, menu, gallery + lightbox, reviews, visit (map +
  live open/closed indicator), contact, footer
- **Content:** one config file (`src/data/site.js`) plus a menu file
  (`src/data/menu.json`). No design code needs touching.

---

## Quick start

Requires **Node 22.23+** (Astro 7).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve the built site locally
```

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

### GitHub Pages

1. Push the repository to GitHub.
2. Settings → Pages → Source: **GitHub Actions**, then use the official
   `withastro/action` workflow.
3. Project pages (`username.github.io/repo`) are served from a sub-path. This
   site references assets with root-absolute paths (`/images/…`, `/fonts/…`),
   so either:
   - use a **custom domain** (recommended, and best for local SEO), or
   - set `base: "/repo-name"` in `astro.config.mjs` and change the image/font
     paths in `src/data/site.js`, `src/styles/global.css` and `src/layouts/Base.astro`.

### Before you publish

Update the live domain in **all four** places:

1. `site.url` in `src/data/site.js`
2. `site` in `astro.config.mjs`
3. `Sitemap:` line in `public/robots.txt`
4. `<loc>` in `public/sitemap.xml`

---

## 5. What to check before launch

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
