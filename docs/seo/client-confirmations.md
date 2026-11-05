# Client confirmations (Step 0)

Updated 2026-11-05. Only items marked **Confirmed** may be used in copy, schema, `llms.txt` and meta tags.
Catering items are tracked in more detail in `docs/brihadhee-aeo-ops.md` (section 1) and `config/client-verification.json`.

Status key: **Confirmed** (written or recorded answer from the owner) | **Not confirmed**.
"Source" says where the current value on the site came from.

## A. Facts already given in the brief (treat as confirmed unless the owner says otherwise)

| Item | Value | Status | Source |
|---|---|---|---|
| Name | Brihadhee | Confirmed | brief |
| Address | New W-41 (Old W-124), 3rd Avenue, W Block, Anna Nagar East, Chennai, Tamil Nadu 600040 | Confirmed | brief |
| Landmarks | near Anna Tower and 3rd Avenue | Confirmed | brief |
| Phone and WhatsApp | +91 73587 14113 | Confirmed | brief |
| Email | brihadhee@gmail.com | Confirmed | brief |
| Vegetarian South Indian | yes | Confirmed by brief; **owner to confirm in writing** that no non-veg is served (the earlier notes in `Ho.md` left this open) | brief |
| Meal times | lunch and dinner (exact hours are NOT confirmed) | Confirmed | brief |
| Dine-in | yes | Confirmed | brief |
| Family-friendly | yes | Confirmed | brief |
| Alcohol | not served | Confirmed | brief (an earlier reservation listing also said no) |
| Known for | filter coffee, banana-leaf meals | Confirmed | brief |
| Menu items and prices (49 items, all vegetarian) | as in `src/data/menu.json` (from `final menu 13-07-2026.pdf`); prices quoted on the site are computed from it | Confirmed as the current menu; owner to confirm prices are final (item 7) | menu file |

## B. Needed from the client

| # | Item | Status | What the site does today | Needed answer |
|---|---|---|---|---|
| 1 | **Production domain**: custom domain (brihadhee.in / .com) or stay on a free host? Which is final? | Not confirmed | Two live copies: `shashan3k.github.io/brihadhee/` and `brihadhee.vercel.app`; canonical points to github.io | Final domain name; who controls DNS |
| 2 | **Opening hours** per day, afternoon break, holiday closures | Not confirmed | Hours hidden everywhere. Data file holds an unverified 11:00 to 23:00; an older source said 6:30 AM to 11 PM | Day-by-day hours |
| 3 | **Customizable dosas** (site copy softened on 2026-11-05; claim returns only after confirmation): available now? How it works (base, fillings, spice level)? Photo/video? | Not confirmed | Claimed in hero, About, meta description, schema, review summary, `llms.txt`, **and** listed as "Build Your Own Dosa · Coming soon" | Yes/No, and the exact way it works |
| 4 | **Value-Meal-Box**: how is it sold (pickup, Swiggy/Zomato, own delivery)? Areas? Name and menu? | Not confirmed | Shown as a "cloud kitchen" concept with two photos and no ordering detail | Sales channel, areas, menu |
| 5 | **Listings**: on Zomato, Swiggy, Magicpin, Justdial, EazyDiner? Links | Not confirmed | None linked (`sameAs` empty) | URLs |
| 6 | **Facilities**: table booking, parking, wheelchair access, AC, seating capacity, group/party seating | Not confirmed | Only dine-in and family-friendly stated | Y/N each, capacity |
| 7 | **Price range per person**; are on-site menu prices final? | Not confirmed | `priceRange` empty; 49 menu items show prices | Range and "prices final: Y/N" |
| 8 | **Brand spelling**: official spelling, Tamil spelling (பிரிஹதீ), common variants customers use | Not confirmed | "Brihadhee" and "பிரிஹதீ" used | Confirm both, list variants |
| 9 | **Catering**: offered? Events, min/max guests, area, menu formats, staff included, advance notice, price per plate, catering phone | Not confirmed | Fully gated; `/catering` not built | See the 10 questions in `docs/brihadhee-aeo-ops.md` |
| 10 | **Social profiles**: Instagram, Facebook, others | Not confirmed | None | URLs |
| 11 | **Photos** with permission to publish: real interior, food, exterior; captions | Not confirmed | 7 food photos, 2 meal-box photos, logo | Files plus written permission |
| 12 | **Parotta** on the menu daily? | Not confirmed | 7 parotta items on the menu; parotta search terms stay gated | Y/N |
| 13 | **Google rating and review count**: current figures from the verified Google Business Profile, and the date checked | Not confirmed | 4.2 from 857 reviews, date unknown (from an earlier screenshot) | Fresh numbers with date |
| 14 | **Pure vegetarian** in writing (see section A) | Not confirmed | "Vegetarian" used throughout | Yes/No |

## C. Decisions for the owner (not facts)

| Item | Status |
|---|---|
| Allow AI **training** crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot)? Search and user-fetch agents are separate. | Not decided |
| Show Google rating on the site, with a "last checked" date? | Not decided |
| Offer WhatsApp enquiry as the only form action, or add a stored form? | Not decided |

## D. How these are enforced in code (AEO build, 2026-11-05)

- Every fact lives in `src/data/facts.js` with `status`, `verifiedOn` and `source`. Reading a **pending** fact with `getFact()` fails the build.
- Pending today: **hours** (item 2), **price range per person** (item 7), **Google rating and count** (item 13; the rating badge and review card numbers are hidden until confirmed with a date), **customizable dosas** (item 3).
- `scripts/aeo-lint.mjs` also searches the built HTML for the text of each pending fact (for example "857", "open daily", "customizable dosas") and fails if one appears.
- To confirm a fact: update `src/data/facts.js` (status, value, `verifiedOn`, `source`), update this file, then run `npm run build && npm run validate`.

### FAQ questions skipped because facts are pending
| Question | Needs |
|---|---|
| What time does Brihadhee open and close? | hours (item 2) |
| Is Brihadhee open on weekends? | hours (item 2) |
| What is the price range per person? | price range (item 7) |

## E. Update from the client brief of 2026-11-05 (owner-confirmed)

These replace the earlier values above. All are in `src/data/facts.js` with `verifiedOn: 2026-11-05`.

| Item | New value |
|---|---|
| Phone | **+91 94442 24999** (replaces +91 73587 14113 everywhere) |
| WhatsApp | **Pending**: the brief lists no WhatsApp number, so WhatsApp buttons are hidden |
| Address (exact wording) | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040. **Match this on the Google Business Profile.** |
| Hours | Monday to Sunday, 6:30 AM to 11:00 PM |
| Late-night dining "up to 6:00 AM" | **Pending**: contradicts the 11:00 PM close; not published |
| Brand names | Brihadhee; also Brihadhee Hotels, Brihadhee Pure Veg Restaurant |
| Sub-brand | Beyond Curry by Brihadhee (North Indian meal boxes); how they are sold is still unconfirmed |
| Cuisine | 100% pure vegetarian: South Indian (Tirunelveli and Karaikudi specialties), North Indian, Indo-Chinese |
| Founders | Rakesh and Eashwer (an auditor and a lawyer by profession) |
| Price range | ₹200 to ₹400 for two (tiffin); about ₹800 for a family meal; schema `₹₹` |
| Offers | ₹80 Mini Tiffin; budget tiffin from ₹24; 10% off walk-in dine-in; up to 40% off Monday to Thursday when pre-booked via Swiggy Dineout, EazyDiner or District. Re-check monthly. |
| Reservations | Yes, via the three booking apps |
| Customised dosas | Available now (how they are customised is not described yet) |
| Menu prices | Nellai Special Sodhi Meals ₹299, Karaikudi Paneer Poppers ₹410; added Mini Tiffin ₹80, Kothu Parotta & Lemon Kothu Idiyappam Combo ₹239, Karupatti Ulundhu Kali ₹125 |
| Signature items without a price | Customised Dosa, Summer in Tenkasi, Butter Biscuit Shake, outdoor filter coffee and tea counter |
| Catering | Confirmed: seemantham, gruhapravesam, ear piercing, betrothals, boutique weddings, birthdays; 50 to 1,500 guests; Chennai; live counters (customised dosa, Paanai Parotta, Nellai sodhi, Karaikudi Paneer Poppers); white-label or co-branded counters for event planners; per-plate pricing |
| Catering still pending | prep mode (cooked on site or delivered), staff and clean-up, advance notice, actual per-plate rates |
| AI training crawlers | Owner decision: allow GPTBot, ClaudeBot, Google-Extended |
| Still pending | Google rating and count (with date), WhatsApp number, parking |
