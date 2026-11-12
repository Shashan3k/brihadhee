# Google Business Profile (GBP) update guide: Brihadhee

> **Updated 2026-11-12**: categories, the 600-character description, Products/Services, WhatsApp on the main number, the Sunday conflict (step F) and refreshed Q&A prices. Earlier update 2026-11-11 for the client's direction (lunch and dinner only, 11 AM to 11 PM, no breakfast or tiffin, Build Your Own Dosa, corporate catering) and the new menu (`new menu.pdf`). If any line here disagrees with `src/data/entity-truth.ts` or `src/data/menu-canonical.ts`, those files win.

Prepared 2026-11-08 for the owner and marketing team. Do the steps **in order**. Sign in at business.google.com (or search "Brihadhee" in Google while signed in as the owner and use the edit panel). Write every change, with the date, in `docs/geo/presence-audit.csv`.

**Golden rule:** change a field only when the value is confirmed in `src/data/entity-truth.ts`. A wrong value hurts more than an empty one.

## What the profile shows today (seen 2026-11-05, public view)

| Field | Shown now | Problem | Fix |
|---|---|---|---|
| Name | BRIHADHEE (Tamil ப்ரிஹதீ) | Fine. Tamil spelling differs from our records (பிரிஹதீ) | Owner to confirm the Tamil spelling on the signboard |
| Phone | 073587 14113 | **Our confirmed number is +91 94442 24999** (Zomato, Magicpin, District, Apple Maps already use it) | Step E |
| Website | none ("Add website") | Biggest single gap: Google cannot connect the profile to www.brihadhee.com | Step E |
| Address | W-41 (Old No. W-124), 3rd Ave, W Block, Anna Nagar, 600040 | No "East", no "Main Road" | Step D |
| Category | South Indian restaurant | Correct primary; secondaries unknown | Step C |
| Hours | "Closes 11 pm"; **closed on Sundays** (seen 2026-11-09, AEO_GEO_STRATEGY.md A1) | The website says open every day; Google AI Mode repeats "closed on Sundays" | Step F: **owner must confirm Sunday first** |
| Rating | 4.2 from 857 reviews; 344 photos | Negative theme: price and service | Step P |
| Review topics | pottalam parotta (68), sodhi idiyappam (25), dosa (23), sambar (19) | Pottalam parotta is not on our website menu | Owner to confirm the dish |
| Buttons | Reserve a table, Order online | We don't know which partner each button opens | Step K |

---

## A. Resolve conflicts first

Agreed values (owner-confirmed, from `entity-truth.ts`). Correct every platform to match these.

| Field | Agreed value | Platforms that disagree today (seen 2026-11-05) |
|---|---|---|
| Name | Brihadhee | Apple Maps: "Brihadhee Pure Veg Restaurant"; Justdial: "Beyond Curry By Brihadhee" only |
| Address | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Main Road, Anna Nagar East, Chennai 600040 | Bing (no door number); Swiggy ("Plot No.41, 3Road Avenue"); Apple ("124, Block W"); Justdial ("18th Main Road") |
| Phone | +91 94442 24999 | **GBP** and Bing show 073587 14113 |
| Hours | **11:00 AM to 11:00 PM**, lunch and dinner only. Days: the website says every day; GBP says closed on Sundays. **Sunday status is the owner's call (owner-todo P1)** | Zomato, District, Apple: 11 AM–11 PM; Magicpin: 11:30 AM–2 PM; Justdial: till 10:45 PM |
| Veg status | 100% pure vegetarian | **EazyDiner says "veg and non veg"** |
| Price for two | Not a marketing angle (client). Listings disagree (Swiggy ₹800; Zomato/District/Magicpin ₹200; Justdial ₹450): leave GBP's price range as Google shows it until the owner gives one figure (**owner-todo P3**) | Swiggy Dineout, Zomato, EazyDiner, Justdial |
| Parking | **Not confirmed** | Swiggy says "Parking available"; EazyDiner says no parking. Owner must decide, then fix both |
| Cuisines | South Indian, Tirunelveli, Karaikudi, North Indian, Indo-Chinese, pure vegetarian | Fine |

How to correct third-party listings:
- **EazyDiner:** use the "Claim/Contact" or partner support; send the pure veg confirmation and the menu PDF.
- **Apple Maps:** claim at Apple Business Connect (businessconnect.apple.com). Fix name, phone, hours, address.
- **Bing Places:** sign in at bingplaces.com and choose "Import from Google Business Profile" after GBP is fixed.
- **Swiggy / Zomato / District / Magicpin:** through the partner dashboard or partner support email; ask for phone, hours, address and amenities corrections.
- **Justdial:** claim the listing; fix address and "No Seating" for Beyond Curry; ask whether a "Brihadhee" listing should exist too.
- Keep screenshots before and after. Log them in `docs/geo/corrections-log.csv`.

## B. Business name

Keep exactly **Brihadhee** (sentence case or capitals, as on the signboard). Do **not** add "Pure Veg", "Restaurant", "Dosa" or "Anna Nagar" to the name; Google can suspend profiles for keyword-stuffed names. If the signboard itself reads "Brihadhee Pure Veg Restaurant", the owner can decide to match the signboard; tell the marketing team before changing.

## C. Categories

- **Primary: South Indian restaurant** (keep; it is already set and ranking). Do not switch the primary category during the first 90 days; a switch can drop rankings for weeks.
- **Secondary (add these four):**
  1. **Vegetarian restaurant** (confirmed: 100% pure veg)
  2. **Caterer** (confirmed: corporate catering for 1,000+ people a day; event catering for 50–1,500 guests)
  3. **Family restaurant** (confirmed: family-friendly)
  4. **Dosa restaurant**, **only if Google's dropdown offers this exact category.** Type "Dosa" in the category box; if nothing called "Dosa restaurant" appears, skip it. Never pick a near match such as "Tiffin centre" (tiffin positioning is retired) or "Breakfast restaurant" (no breakfast service).
- Do not add: Breakfast restaurant, Tiffin centre, Chinese restaurant, North Indian restaurant, Chettinad restaurant. They contradict the client direction or dilute the pure veg South Indian signal. Revisit after day 90.
- Week 1 task: from a Chennai phone, check the primary categories of the top 5 results for "pure veg restaurant Anna Nagar" and "South Indian restaurant Anna Nagar" and write them in `docs/geo/competitor-benchmark.csv`. If most winners use "Vegetarian restaurant" as primary, discuss a test with the owner after day 90.

## D. Address and location

Enter exactly (same as the website footer):

| GBP field | Value |
|---|---|
| Street address | New No. W-41, Old No. W-124, W-Block, 3rd Avenue |
| Address line 2 | Main Road, Anna Nagar East |
| City | Chennai |
| PIN code | 600040 |
| State | Tamil Nadu |

- Drag the map pin onto the **real entrance**. Our recorded point is 13.0879662, 80.2178222; stand at the entrance with the phone and check.
- Landmarks for directions text and posts: Anna Nagar Tower Park, the 3rd Avenue and 9th Street junction, Aadhaar Seva Kendra. Do not mention metro stations until someone walks the route and times it.
- **No service area** for the restaurant. (Catering covers Chennai, but adding a service area changes how Google treats a walk-in restaurant.)
- Google may ask for video verification after an address edit. Keep the signboard, the entrance and the kitchen ready to film.

## E. Phone, website and links

| Field | Value |
|---|---|
| Primary phone | **+91 94442 24999** |
| Additional phone | +91 73587 14113 **only if** the owner confirms it is still answered; otherwise remove it. **Which number Google shows as primary is owner-todo P2** |
| Website | `https://www.brihadhee.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile` |
| Menu link | `https://www.brihadhee.com/menu/?utm_source=google&utm_medium=organic&utm_campaign=gbp_menu` |
| Reservations link | `https://www.brihadhee.com/book-a-table/?utm_source=google&utm_medium=organic&utm_campaign=gbp_booking` (after the page is live; until then the EazyDiner link) |
| Order link | `https://www.brihadhee.com/order/` **only after** Swiggy/Zomato store links are confirmed |
| Social profiles | Instagram `https://www.instagram.com/brihadhee/`; YouTube only if @brihadheerestaurant is confirmed as yours |
| WhatsApp / chat | +91 94442 24999 (confirmed 2026-11-12: the main number takes WhatsApp) |

Why UTM tags: they let Google Analytics show exactly how many visits come from the profile.

## F. Hours

- Regular hours: **11:00 AM to 11:00 PM**.
- **Sunday: do not edit until the owner confirms (owner-todo P1).** GBP currently shows **closed on Sundays**, while the website (from the 2026-11-11 blueprint) says open every day, Monday to Sunday. Google's AI repeats the GBP version. One of them is wrong:
  - If the restaurant **is open on Sundays**: set Sunday 11:00 AM–11:00 PM on GBP the same day, then re-run the Sunday prompt in the query panel a week later.
  - If it **is closed on Sundays**: tell the developer the same day. The website, schema (`openingHoursSpecification`), `/about/` Q&A "Is Brihadhee open on Sundays?" and llms.txt must change, or every AI answer will keep contradicting itself.
- "More hours": lunch and dinner only if the owner gives exact times. Never add breakfast.
- **Special hours:** before every festival (Karthigai Deepam, Christmas, New Year, Pongal, Tamil New Year, Deepavali), set special hours or confirm "open as usual". Google shows a warning on profiles with uncertain holiday hours.
- Do not publish the "up to 6 AM late-night" idea: it contradicts the 11 PM close.

## G. Business description (600 characters; limit 750)

Paste exactly:

> Brihadhee is a 100% pure vegetarian South Indian restaurant and caterer in Anna Nagar East, Chennai, serving lunch and dinner from 11 AM to 11 PM. Our signature is build-your-own dosa: choose your batter, roast, fillings and podi, and we cook it to order. At lunch, try Tirunelveli-style Nellai Special Sodhi Meals and Tamil home-style dishes from our grandmother's recipes. Dinner favourites include paanai parotta, veg kothu parotta and idiyappam. Brihadhee also provides pure veg corporate catering (1,000+ meals daily) and end-to-end catering for weddings, birthdays and functions across Chennai.

Every claim is a confirmed fact in `src/data/entity-truth.ts` (hours, pure veg, Build Your Own Dosa, Nellai meals, grandma's recipes, corporate scale, event catering). "Roast" means the ghee, butter or oil choice on the menu. Rules kept: no "best", no "No. 1", no "500+", no breakfast or tiffin, no prices, no parking, no phone number or links (Google rejects URLs and discourages contact details in descriptions), no keyword lists. Re-check monthly and whenever the menu changes.

## H. Products and services

### H1. Products / Services entries (add all five)

In GBP, open **Edit profile → Products** (or **Services** if Google shows that tab for the profile). Add each entry with a photo, the description below, the category in brackets, and the button "Learn more" pointing to the page with UTM tags (`?utm_source=google&utm_medium=organic&utm_campaign=gbp_product`). Leave the price empty for catering (quoted per plate).

| Name | Description (paste) | Price | Link |
|---|---|---|---|
| Build Your Own Dosa | Choose one of 5 batters, then add podi and toppings, a filling and your roast in ghee, butter or oil. 10 chef's combinations are on the menu too. Lunch and dinner, 11 AM to 11 PM. | Batters ₹120–₹145; add-ons extra | /menu/dosa/ |
| Nellai Special Sodhi Meals | Tirunelveli-style banana-leaf lunch built around sodhi, a coconut milk stew, with rice, sambar, rasam, kootu, poriyal and karuppatti ulundhu kali. Served from 11 AM. | ₹240 | /menu/nellai-meals/ |
| Paanai Parotta & Dinner | Paanai Parotta, veg kothu parotta, idiyappam and Karaikudi Paneer Poppers, served every evening until 11 PM. 100% pure vegetarian. | Paanai Parotta ₹270 | /veg-dinner-anna-nagar/ |
| Pure Veg Corporate Catering (1,000+ Daily) | Daily office lunches, bulk meals, employee meal programmes and office events across Chennai, for more than 1,000 people every day. Kitchen tasting and a trial week before you start. | Per plate, on quote | /corporate-catering-chennai/ |
| End-to-End Event & Wedding Catering | Menu planning, cooking, serving and setup for weddings, birthdays, housewarmings and family functions, 50 to 1,500 guests, with live dosa, parotta and Nellai sodhi counters. | Per plate, on quote | /catering-services-chennai/ |

Prices come from `src/data/menu-canonical.ts`; update them here and on GBP the same day the menu changes.

### H2. Service options

Add (under "Services" or the restaurant service options Google shows):
- Dine-in ✔ (confirmed)
- Lunch, Dinner ✔ (confirmed). Breakfast ✘ (not served; untick it if Google shows it)
- Table reservations ✔ (pre-booking via Swiggy Dineout, EazyDiner, District)
- Catering ✔ (confirmed, 50–1,500 guests, Chennai)
- Filter coffee ✔ (on the menu)
- Takeaway: **owner to confirm**
- Delivery: **only after Swiggy/Zomato links are confirmed**

## I. Attributes

Tick only what is true. Re-check every quarter.

| Attribute | Set to | Status |
|---|---|---|
| Dine-in | Yes | Confirmed |
| Serves lunch / dinner | Yes; breakfast No | Confirmed 2026-11-11 |
| Vegetarian options / Vegetarian | Yes | Confirmed (100% veg) |
| Good for kids / Family-friendly | Yes | Confirmed |
| Accepts reservations | Yes | Confirmed (partner pre-booking) |
| Serves alcohol | Leave off | Confirmed: no alcohol |
| Takeaway | ? | Owner to confirm |
| Delivery | ? | Gated on Swiggy/Zomato |
| Air-conditioned | ? | EazyDiner says yes; owner to confirm |
| Wheelchair-accessible entrance / seating / toilet | ? | Only if someone checks for a step-free entrance |
| Parking (free/paid/street) | ? | **Gated:** owner must confirm |
| Payments: UPI / cards / NFC | ? | Owner to confirm what the counter accepts |
| Wi-Fi | ? | Owner to confirm |
| Good for groups | ? | Owner to confirm the largest table size |

## J. Menu

1. In GBP, open **Menu → Edit menu**. Create the same 12 sections as the website menu (`src/data/menu-canonical.ts`, from `new menu.pdf`): Starters, Lunch, Dine-in Combos (lunch only), Dosa Variety, Idly & Mini Idly, Idiyappam, Parotta & Chapathi, Rice, Indian Breads, Indian Gravies, Beverages, Brihadhee Signatures, plus a Build Your Own Dosa section.
2. Enter every item with its price from `new menu.pdf` (80 items; the list is in `src/data/menu-canonical.ts` and on www.brihadhee.com/menu/). One plain description line each, for example:
   - Kothu Parotta & Lemon Kothu Idiyappam Combo, ₹179 (lunch only).
   - Nellai Special Sodhi Meals, ₹240: Tirunelveli-style vegetarian meal with sodhi.
   - Paanai Parotta, ₹270: parotta layered with salna, paneer and mushroom, slow-cooked in a sealed pot (dum style).
3. Add a photo to the top 10 items (a Build Your Own Dosa chef's suggestion, Nellai Special Sodhi Meals, Paanai Parotta, Ghee Roast, Ghee Podi Dosa, Idiyappam Sodhi, Special Kothu Parotta, Special Pottalam Parotta, Karaikudi Paneer Poppers, Filter Coffee).
4. Set the menu link (step E).
5. When pottalam parotta and the signature drinks (Summer in Tenkasi, Butter Biscuit Smoothie) get confirmed prices, add them on GBP and the website the same day.
6. Monthly: compare GBP menu, website menu, Swiggy and Zomato menus. Remove discontinued items everywhere.

## K. Booking and ordering links

- "Reserve a table": check which partner the current button opens (tap it on a phone). Keep it if it is Swiggy Dineout, EazyDiner or District. EazyDiner page: `https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877`.
- Add our own `/book-a-table/` link as the reservation link once live (step E).
- "Order online": tap it and check where it goes. If it goes to a store the owner does not run, request removal through "Suggest an edit" or the GBP support form.

## L. Photos: 30 in the first 30 days, then 2–3 a week

Real photos only. No AI-generated food. No customer faces without permission. Natural light. File names describe the photo (for example `brihadhee-build-your-own-dosa.jpg`). Location data inside the photo (EXIF) does not help rankings; Google strips it. Upload from the owner account so they show as "By owner".

| Set | Shots |
|---|---|
| Logo and cover | Logo (square, 720×720); cover = best dish spread or the storefront |
| Exterior (5) | Daytime storefront, evening storefront with lights, signboard close-up, entrance, view from the 3rd Avenue corner |
| Interior (4) | Family tables, group area, counter, outdoor filter coffee counter |
| Dishes (15) | Build Your Own Dosa (chef's suggestion), Nellai Special Sodhi Meals, Paanai Parotta, Ghee Roast, Ghee Podi Dosa, Madurai Malli Dosa, Special Pottalam Parotta, Idiyappam Sodhi, Ghee Mini Sambar Idly, Special Kothu Parotta, Madurai Salna Parotta, Karaikudi Paneer Poppers, Executive TN Meals, Karuppatti Ulundhu Kali, Filter Coffee |
| Action (4) | Dosa on the tawa, Build Your Own Dosa being made, coffee pour, live counter at a function (with host permission) |
| People (2) | Staff at work (with permission), founders (optional) |
| Menu (1) | Current menu card |

## M. Videos (10 short clips, 15–30 seconds)

1. A dosa being made on the tawa. 2. Build Your Own Dosa from choice to plate. 3. A Dine-in Combo at lunch. 4. Nellai Sodhi meal being served. 5. Filter coffee pouring. 6. Walking in from the street to the table. 7. The lunch rush. 8. A family table (with permission). 9. Takeaway packing (only if takeaway is confirmed). 10. Behind the scenes in the kitchen (if the owner agrees).

## N. Google Posts: 1–2 a week (4–6 a month)

Each post: one real photo, 100–200 words, "Anna Nagar East" once, one button. Use the 20 ideas in `docs/strategy/competitor-attack-plan.md` section 3.8. First four weeks:

| Week | Post | Button |
|---|---|---|
| 1 | Build Your Own Dosa: pick a batter (from ₹120), toppings, a stuffing and a garnish | Call |
| 2 | Pre-book Monday to Thursday and save up to 40% (Offer post with start and end dates) | Book |
| 3 | Nellai Special Sodhi Meals: what a Tirunelveli meal is | Learn more → /menu/ |
| 4 | Live dosa and parotta counters for home functions, 50 to 1,500 guests | Call |

Example post (week 1):
> Build your own dosa at Brihadhee: pick one of 5 batters, from Golden Hour (classic rice, ₹120) to Pink Sea (beetroot and navadhaniyam, ₹145), then add toppings, a stuffing and a garnish. Or order a chef's suggestion such as Mylapore Maama (₹180). Everything is 100% pure vegetarian. Find us on 3rd Avenue, W-Block, Anna Nagar East, near Anna Nagar Tower Park, 11 AM to 11 PM. Call +91 94442 24999.

Do not post reviews or testimonials. Do not post offers you cannot honour. Offer posts need real dates.

## O. Questions and answers (25)

Google has been reducing the Q&A section on Maps in favour of AI answers drawn from your description, reviews and website. If your profile still shows "Questions & answers", post these as the owner and answer them. Either way, the same answers are on the website, so Google's AI can read them there. Keep answers 40–60 words where possible.

| # | Question | Answer |
|---|---|---|
| 1 | Is Brihadhee pure vegetarian? | Yes. Brihadhee is a 100% pure vegetarian restaurant. No meat, egg or fish is cooked or served. Our menu covers dosas, Build Your Own Dosa, Tamil Nadu meals, parotta, North Indian gravies and filter coffee, with Tirunelveli (Nellai) and Karaikudi specialities. |
| 2 | What are your timings? | We are open from 11 AM to 11 PM and serve lunch and dinner. We do not serve breakfast. Please check this profile for special hours on festival days. |
| 3 | Where exactly are you? | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Main Road, Anna Nagar East, Chennai 600040. We are near Anna Nagar Tower Park and the 3rd Avenue and 9th Street junction. Tap Directions on this profile for the route. |
| 4 | Do you serve breakfast? | No. Brihadhee serves lunch and dinner only, from 11 AM to 11 PM. |
| 5 | Can I build my own dosa? | Yes. Pick one of 5 batters (₹120 to ₹145), then add toppings, a stuffing and a garnish, or order one of 10 chef's suggestions (₹180 to ₹260). Our menu also lists 8 classic dosas, from Kal Dosa (₹100) to Ghee Masala Dosa (₹175). |
| 6 | What is Nellai Sodhi meals? | Nellai Special Sodhi Meals (₹240) is our Tirunelveli-style vegetarian meal served with sodhi, a mild coconut-milk stew from the Nellai region. We also serve Idiyappam Sodhi (₹180) for a lighter plate. |
| 7 | Can I book a table? | Yes. Pre-book on Swiggy Dineout, EazyDiner or District and get up to 40% off from Monday to Thursday. Walk-in guests get 10% off on dine-in. For a large group, please call +91 94442 24999. |
| 8 | Do you have offers? | Walk-in dine-in guests get 10% off. Pre-booking through Swiggy Dineout, EazyDiner or District gives up to 40% off from Monday to Thursday. Offers can change, so please check before you visit. |
| 9 | What do dishes cost? | Every dish and price is on www.brihadhee.com/menu/ (prices exclude 5% GST). Lunch meals are ₹150 to ₹240, classic dosas ₹100 to ₹175, and build-your-own dosa batters ₹120 to ₹145. |
| 10 | Is it good for families? | Yes. Brihadhee is family-friendly, 100% pure vegetarian and serves no alcohol. Families often order the Executive TN Meals, dosas and the Ghee Mini Sambar Idly (14 pieces) for children. |
| 11 | Do you serve filter coffee? | Yes. Filter coffee is ₹45. We also serve tea, lemon tea, black coffee and plain milk. |
| 12 | What are your specialities? | We are known for Build Your Own Dosa, Paanai Parotta, Nellai Special Sodhi Meals and filter coffee, along with Karaikudi Paneer Poppers and Karuppatti Ulundhu Kali, a traditional palm-jaggery sweet. |
| 13 | What is Paanai Parotta? | Paanai Parotta (₹270) is parotta layered with rich salna, paneer and mushroom, slow-cooked in a sealed pot (dum style). It is one of our dinner favourites. |
| 14 | Do you serve alcohol? | No. Brihadhee does not serve alcohol. |
| 15 | Do you do catering? | Yes. We cater pure vegetarian functions across Chennai for 50 to 1,500 guests, including baby showers, housewarmings, ear-piercing ceremonies, engagements, weddings and birthdays. Pricing is per plate, quoted for each menu. Call +91 94442 24999. |
| 16 | What live counters do you offer for events? | Build Your Own Dosa, Paanai Parotta, Nellai Sodhi and Karaikudi Paneer Poppers live counters. Event planners can book them as white-label or co-branded counters. |
| 17 | What do you serve for lunch? | Limited TN Meals (₹150), Executive TN Meals Unlimited (₹205), Nellai Special Sodhi Meals (₹240) and Karuppatti Ulundhu Kali (₹100), plus lunch-only dine-in combos. Lunch is Tamil home-style food from our grandmother's recipes. |
| 18 | Who runs Brihadhee? | Brihadhee was founded by Rakesh and Eashwer, an auditor and a lawyer by profession, out of a shared passion for authentic regional Tamil vegetarian food. |
| 19 | What is Beyond Curry by Brihadhee? | Beyond Curry by Brihadhee is our North Indian meal-box brand. (Owner to add how to order before posting.) |
| 20 | Are you connected to the Brihadeeswarar Temple? | The name Brihadhee is a tribute to the Brihadeeswarar Temple in Thanjavur and its Chola architecture. Brihadhee is a restaurant and is not affiliated with the temple. |
| 21 | Which areas are you close to? | We are in Anna Nagar East, a short drive from Anna Nagar West, Shenoy Nagar, Kilpauk, Mogappair and Thirumangalam. |
| 22 | Do you have North Indian food? | Yes. We serve North Indian gravies such as Paneer Butter Masala, Aloo Gobi Masala and Nilgiris Dum Aloo (₹295–₹315), with chapathi and parotta. All 100% vegetarian. |
| 23 | Is there parking? | **Do not post until the owner confirms.** |
| 24 | Do you deliver? | **Do not post until Swiggy/Zomato links are confirmed.** |
| 25 | What is your WhatsApp number? | WhatsApp us on +91 94442 24999 for tables, catering quotes and enquiries. |

## P. Reviews

**Asking (every day):**
- Get the review link: GBP → "Ask for reviews" → copy the short link. Make a QR code from it.
- Put the QR on every table card and on the printed bill. Staff line at billing: *"If you enjoyed it, a Google review really helps us. It takes a minute: just scan this."*
- WhatsApp follow-up after catering or large bookings (only to people who shared their number with us): *"Thank you for choosing Brihadhee. If you have a minute, we'd value your honest Google review: [link]."*
- Never offer a discount, free item or contest for reviews. Never ask for 5 stars. Never ask only happy guests (that is "review gating" and breaks Google's policy). Never write reviews for ourselves or ask staff/family to.

**Replying (within 48 hours, every review):**
- Positive: *"Thank you, [name]. We're happy the [dish they named] made your visit. See you again at Brihadhee, Anna Nagar."*
- Neutral: *"Thank you for the honest feedback, [name]. We want to get the [specific point] right next time. Please call us on +91 94442 24999 so we can make it better."*
- Negative (price or service, today's main theme): *"[Name], we're sorry the service fell short and that the meal didn't feel worth the price. That isn't the experience we want for you. Please call +91 94442 24999 and ask for the manager so we can understand what happened and make it right."* Then actually follow up and fix the cause.
- Never argue, never share the guest's order details publicly, never use the same reply twice in a row, never stuff keywords.
- Fake or spam reviews: flag through "Report review"; keep a screenshot and date.

## Q. Messaging

Google ended Business Messages (chat) on GBP in 2024, so there is no chat to switch on. Use the phone number, and add WhatsApp as a social link only after the number is confirmed and someone will answer within a working day.

## R. Weekly checklist (every Monday, 30 minutes)

- [ ] Publish 1 post (calendar in section N)
- [ ] Upload 2–3 new photos
- [ ] Reply to every new review
- [ ] Answer any new Q&A
- [ ] Check this week's hours, especially before festivals
- [ ] Tap Call, Website, Directions, Reserve and Order: all still work?
- [ ] Note calls, directions, website clicks and searches from Performance into the KPI sheet

## S. Monthly checklist (first Monday)

- [ ] Compare GBP with Swiggy, Zomato, EazyDiner, District, Justdial, Magicpin, Apple Maps, Bing, Instagram and the website: name, address, phone, hours, veg status, menu, prices
- [ ] Update the review count, rating and reply rate in the KPI sheet
- [ ] Check the local pack for the 11 priority local queries from the restaurant and from 2 km away
- [ ] Update the description if any offer or price changed
- [ ] Search Google Maps for "Brihadhee", "Brihadhee restaurant", "Brihadhee veg" and "Beyond Curry Brihadhee" to catch duplicates

## T. Local ranking levers (what actually moves the map)

- **Relevance:** right categories, complete services and attributes, a specific description, and a dish-level menu with prices.
- **Distance:** we cannot change where the searcher stands. We make sure Google knows exactly where we are (correct pin, consistent address, landmarks in posts and on the website).
- **Prominence:** reviews (steady flow, dish-specific), consistent citations, the website link, press and creator mentions, and YouTube videos.
- **Engagement:** calls, direction requests, website clicks, photo views and bookings. Good photos and posts drive these.

## U. Duplicates and spam

1. In Google Maps search "Brihadhee Anna Nagar", "Brihadhee restaurant", "Brihadhee veg", "Brihadhee Pure Veg" and "Beyond Curry by Brihadhee".
2. If a second Brihadhee listing exists at the same address: open it → "Suggest an edit" → "Close or remove" → "Duplicate of another place". If the owner controls it, merge through GBP support instead.
3. Do **not** create a separate profile for Beyond Curry unless it has its own signboard, staff and customer entrance; delivery-only brands at the same address break Google's guidelines.
4. Report fake listings or spam with the flag option. Keep records.

---

## Order of work for the owner (do these this week)

1. **Answer the five open owner confirmations first** (`docs/owner-todo.md`, section P): Sunday opening, primary phone on GBP, cost for two, corporate client names and FSSAI number, parking.
2. Add the website with the UTM link.
3. Fix the address and check the pin at the entrance.
4. Set hours 11 AM to 11 PM. **Sunday only after the owner confirms** (step F), and holiday hours for the next festival (Karthigai Deepam).
5. Add the secondary categories from step C: Vegetarian restaurant, Caterer, Family restaurant, and Dosa restaurant only if Google offers it. Not Breakfast restaurant.
6. Paste the description from step G.
7. Add the five Products/Services entries from step H1.
8. Tick the confirmed attributes; leave parking, delivery and accessibility off until confirmed.
9. Build the 80-item menu with prices from `new menu.pdf`.
10. Upload the first 15 photos and start the review QR cards.
11. Work through the listing tickets in `docs/geo/corrections-log.csv` (EazyDiner, Zomato, Swiggy Dineout, Justdial, Instagram) and claim Apple Business Connect.
