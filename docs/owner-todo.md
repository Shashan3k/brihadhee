# Owner to-do: facts and assets we still need

Updated 2026-11-08. When you confirm an item, send it in writing (WhatsApp or email is fine). The developer then updates `src/data/entity-truth.ts`, and the site, Google profile and listings can use it. **Until then, nothing on this list appears anywhere.** The build fails if it does.

## A. Already confirmed (no action, shown for reference)

Name Brihadhee · Tamil name பிரிஹதீ · 100% pure vegetarian · New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai 600040 · phone +91 94442 24999 · open Monday to Sunday 6:30 AM to 11:00 PM · ₹200–₹400 for two (tiffin), about ₹800 family meal · menu prices from `final menu 13-07-2026.pdf` · Mini Tiffin ₹80, budget tiffin from ₹24, Kothu combo ₹239 · offers: 10% walk-in, up to 40% pre-booking Mon–Thu · pre-booking on Swiggy Dineout, EazyDiner, District · catering 50–1,500 guests, Chennai, live counters, per-plate pricing · founders Rakesh and Eashwer · Beyond Curry by Brihadhee (North Indian meal boxes) · no alcohol · family-friendly · EazyDiner page URL and Instagram @brihadhee (from your brief, 2026-11-08) · locality: "Anna Nagar East" in the address, schema and GBP; "Anna Nagar" in body copy.

## B. Facts we need from you (priority order)

| # | Question | Why it matters | Where it will be used |
|---|---|---|---|
| 1 | **Which phone should Google show?** Your Google profile shows 073587 14113; the site and most listings use 94442 24999. Is 73587 14113 still answered? | Wrong phone on Google = lost calls | GBP, Bing, website |
| 2 | **WhatsApp number** for enquiries (if any), and who will reply within a working day | Turns on WhatsApp buttons and the enquiry form's WhatsApp option | Website, GBP social link |
| 3 | **Parking:** is there parking? Where, how many cars/bikes, free or paid? | Swiggy says "Parking available", EazyDiner says no. We must fix one | Website FAQ, GBP attribute, listings |
| 4 | **"500+ dosa varieties":** how is it counted? Please send the list of batters, fillings, podis and toppings for the customised dosa | Biggest marketing claim; can't use it without proof | Dosa page, positioning, GBP |
| 5 | **Customised dosa:** what can a guest choose (exact options)? | Needed for the customised dosa page and FAQ | Dosa page |
| 6 | **Pottalam parotta:** is it on the menu? Price and description? 68 Google reviews mention it, but it is not in the menu PDF | Proven demand, missing page | Menu, dish page, GBP menu |
| 7 | **Swiggy and Zomato delivery store links** (if you deliver), and which "Order online" partner the Google button should open | Order page and delivery FAQ | /order/, GBP |
| 8 | **Swiggy Dineout and District booking page links** (we have EazyDiner only) | More booking buttons | /book-a-table/ |
| 9 | **Takeaway:** available? Any packing charge? | GBP service option | GBP, website |
| 10 | **Late-night service:** the brief mentioned "up to 6 AM", but you close at 11 PM. Is there any late-night offer at all? | Cannot publish until resolved | — |
| 11 | **Google rating** you are happy for us to quote (we'd take it from your GBP with the date) | Optional; quoting ratings has rules | — |
| 12 | **FSSAI licence number** (and a photo of the certificate) | Trust line on About page | /about/ |
| 13 | **Legal (registered) business name** | Schema legalName | Schema |
| 14 | **Email:** is brihadhee@gmail.com correct and checked daily? | Privacy page and contact | Website |
| 15 | **Payments accepted** (UPI, cards, cash) | GBP attributes | GBP |
| 16 | **Air-conditioning, wheelchair access** (step-free entrance? accessible toilet?), Wi-Fi | GBP attributes | GBP |
| 17 | **Largest group** you can seat together; any group booking rules | Group dining page | /events/group-dining/ |
| 18 | **Breakfast hours** (when does tiffin stop? when do meals start?) | GBP "more hours", tiffin page | GBP, menu |
| 19 | **Signature drink prices:** Summer in Tenkasi, Butter Biscuit Smoothie (the PDF prices don't read clearly) | Menu completeness | Menu |
| 20 | **Executive TN Meals (Unlimited):** what exactly is unlimited? | Meals FAQ | Menu |
| 21 | **Paanai Parotta and sodhi:** one or two sentences from the chef on how each is made | Guides and FAQ (no invented recipes) | Guides |
| 22 | **Beyond Curry:** how do customers order (app, phone, walk-in)? | Home FAQ | Home |
| 23 | **Which listings and social profiles are yours?** Google Maps, Instagram @brihadhee (now linked in schema and footer, from your brief), YouTube @brihadheerestaurant (yours?), Facebook (exists?), Zomato, Swiggy, Magicpin, District, EazyDiner, Justdial, Apple Maps | `sameAs` links in schema help Google and AI tie them together | Schema, footer |
| 24 | **Signboard Tamil spelling:** பிரிஹதீ (our records) or ப்ரிஹதீ (Google)? | Consistency | GBP, site |
| 25 | **Walking times** from Anna Nagar Tower, Anna Nagar East metro and Anna Nagar Tower metro (someone walks and times it) | Location page directions | /location/ |
| 26 | **Nearby temples / hospitals / offices** you'd like us to mention (only real, nearby ones) | Location-aware content | Guides, posts |
| 27 | **Spelling variants** people use for your name (we used Brihadhi, Brihadee, Bruhadhee, Brahadhee in the footer; correct?) | Name-collision defence | Footer |

## C. Assets we need

| # | Asset | Detail |
|---|---|---|
| 1 | **30–40 real photos** | List in `docs/strategy/gbp-update-guide.md`, step L. Exterior day/evening, signboard, interior, 15 signature dishes, action shots, staff (with permission). No AI images |
| 2 | **10 short videos** (15–30 s) | List in the GBP guide, step M |
| 3 | **Founders' story** in your words (150–300 words) and an optional photo | About page, press pitches |
| 4 | **Tamil copy** for a Tamil home page, written by a person (not machine-translated) | `/ta/` page; not built until we have it |
| 5 | **Guest reviews with written permission** to show on the website (at least 5, with first name and date) | `/reviews/` page; Review schema only after 5 genuine ones |
| 6 | **Current menu PDF** whenever prices change | Prices on site, GBP, menu.json |
| 7 | **Logo files** (SVG or large PNG) | GBP logo, press kit |

## D. Decisions we need

| # | Decision | Our recommendation |
|---|---|---|
| 1 | Analytics: turn on Google Analytics 4? (needs a GA4 property; the privacy page updates itself) | Yes |
| 2 | IndexNow: create a key so Bing picks up changes faster | Yes |
| 3 | Monthly budget for photos, Reels and creators (see the plan, section 4) | ₹30,000–₹60,000 a month for 90 days |
| 4 | Who replies to Google reviews within 48 hours | Manager, with owner on negative ones |
| 5 | Review QR cards on tables and bills | Yes, this week |

## E. Website hosting (do this first)

| # | Action | Who | Why |
|---|---|---|---|
| 1 | **Deploy the current code to Vercel.** The live www.brihadhee.com still serves an old build whose canonical points to `shashan3k.github.io/brihadhee/` and carries a stuffed `meta keywords` tag. Both are fixed in the code but not live. | Developer | Google may treat the GitHub copy as the original |
| 2 | **Turn off GitHub Pages:** GitHub repo > Settings > Pages > Source: None (or make the repo private). The workflow no longer publishes to Pages, but the last published copy stays up until Pages is switched off. | Repo owner | Removes the duplicate site |
| 3 | After both, in Search Console: URL Inspection on `https://www.brihadhee.com/` and confirm "Google-selected canonical" is the www URL | Developer | Confirms the fix took |
