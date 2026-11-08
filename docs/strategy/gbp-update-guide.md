# Google Business Profile (GBP) update guide: Brihadhee

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
| Hours | "Closes 11 pm" | Opening time not seen | Step F |
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
| Hours | Monday to Sunday, 6:30 AM to 11:00 PM | Zomato, District, Apple: 11 AM–11 PM; Magicpin: 11:30 AM–2 PM; Justdial: till 10:45 PM |
| Veg status | 100% pure vegetarian | **EazyDiner says "veg and non veg"** |
| Price for two | ₹200–₹400 for tiffin; about ₹800 for a family meal | Swiggy ₹800; Zomato/District/Magicpin ₹200; Justdial ₹450 (these are close enough if the description explains both) |
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
- **Secondary (add only these, if they appear in Google's dropdown):**
  1. Vegetarian restaurant (confirmed: 100% pure veg)
  2. Breakfast restaurant (confirmed: opens 6:30 AM, tiffin)
  3. Family restaurant (confirmed: family-friendly)
  4. Caterer (confirmed: catering 50–1,500 guests)
  5. Indian restaurant
  6. Dosa restaurant / Tiffin centre, **only if Google offers that exact category**
- Skip "Chinese restaurant", "North Indian restaurant" and "Chettinad restaurant" for now; they dilute the pure veg South Indian signal. Revisit after day 90.
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
| Additional phone | +91 73587 14113 **only if** the owner confirms it is still answered; otherwise remove it |
| Website | `https://www.brihadhee.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile` |
| Menu link | `https://www.brihadhee.com/menu/?utm_source=google&utm_medium=organic&utm_campaign=gbp_menu` |
| Reservations link | `https://www.brihadhee.com/book-a-table/?utm_source=google&utm_medium=organic&utm_campaign=gbp_booking` (after the page is live; until then the EazyDiner link) |
| Order link | `https://www.brihadhee.com/order/` **only after** Swiggy/Zomato store links are confirmed |
| Social profiles | Instagram `https://www.instagram.com/brihadhee/`; YouTube only if @brihadheerestaurant is confirmed as yours; WhatsApp only after the number is confirmed |

Why UTM tags: they let Google Analytics show exactly how many visits come from the profile.

## F. Hours

- Regular hours: **Monday to Sunday, 6:30 AM to 11:00 PM.**
- "More hours" (breakfast, lunch, dinner, takeaway): add only if the owner gives exact times (for example, "Breakfast 6:30 AM to 11:30 AM"). Not confirmed yet.
- **Special hours:** before every festival (Karthigai Deepam, Christmas, New Year, Pongal, Tamil New Year, Deepavali), set special hours or confirm "open as usual". Google shows a warning on profiles with uncertain holiday hours.
- Do not publish the "up to 6 AM late-night" idea: it contradicts the 11 PM close.

## G. Business description (624 characters; limit 750)

Paste exactly:

> Brihadhee is a 100% pure vegetarian South Indian restaurant on 3rd Avenue, W-Block, Anna Nagar East, Chennai, near Anna Nagar Tower Park. We are known for customised dosas, Paanai Parotta, Nellai Special Sodhi Meals and filter coffee, with Tirunelveli (Nellai) and Karaikudi specialities. Breakfast starts at 6:30 AM with our Mini Tiffin combo for ₹80, and we serve lunch and dinner until 11 PM, every day. Families are welcome. Pre-book a table through Swiggy Dineout, EazyDiner or District. We also cater functions in Chennai for 50 to 1,500 guests, with live dosa, parotta and Nellai sodhi counters. Call +91 94442 24999.

Rules kept: no "best", no "No. 1", no "500+", no parking, no links (Google rejects URLs in descriptions), no keyword lists. Re-check monthly: if the Mini Tiffin price changes, update this text the same day.

## H. Services

Add (under "Services" or the restaurant service options Google shows):
- Dine-in ✔ (confirmed)
- Breakfast, Lunch, Dinner ✔ (confirmed)
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
| Serves breakfast / lunch / dinner | Yes | Confirmed |
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

1. In GBP, open **Menu → Edit menu**. Create 9 sections, same as the website: Starters, Tiffin Combos, Lunch & Meals, Dosa Varieties, Idly & Idiyappam, Parotta & Chapathi, Indian Gravies, Beverages, Traditional Sweets.
2. Enter every item with its price from `final menu 13-07-2026.pdf` (59 items; the list is in `src/data/menu-canonical.ts` and on www.brihadhee.com/menu/). One plain description line each, for example:
   - Mini Tiffin, ₹80: pongal, kesari, 2 idlis, masala dosa, vada, sambar and chutneys.
   - Nellai Special Sodhi Meals, ₹240: Tirunelveli-style vegetarian meal with sodhi.
   - Paanai Parotta, ₹260: signature parotta served in a clay pot.
3. Add a photo to the top 10 items (Mini Tiffin, Nellai Special Sodhi Meals, Paanai Parotta, Ghee Roast, Ghee Podi Dosa, Idiyappam Sodhi, Special Kothu Parotta, Karaikudi Paneer Poppers, Karuppatti Ulundhu Kali, Filter Coffee).
4. Set the menu link (step E).
5. When pottalam parotta and the signature drinks (Summer in Tenkasi, Butter Biscuit Smoothie) get confirmed prices, add them on GBP and the website the same day.
6. Monthly: compare GBP menu, website menu, Swiggy and Zomato menus. Remove discontinued items everywhere.

## K. Booking and ordering links

- "Reserve a table": check which partner the current button opens (tap it on a phone). Keep it if it is Swiggy Dineout, EazyDiner or District. EazyDiner page: `https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877`.
- Add our own `/book-a-table/` link as the reservation link once live (step E).
- "Order online": tap it and check where it goes. If it goes to a store the owner does not run, request removal through "Suggest an edit" or the GBP support form.

## L. Photos: 30 in the first 30 days, then 2–3 a week

Real photos only. No AI-generated food. No customer faces without permission. Natural light. File names describe the photo (for example `brihadhee-mini-tiffin-plate.jpg`). Location data inside the photo (EXIF) does not help rankings; Google strips it. Upload from the owner account so they show as "By owner".

| Set | Shots |
|---|---|
| Logo and cover | Logo (square, 720×720); cover = best dish spread or the storefront |
| Exterior (5) | Daytime storefront, evening storefront with lights, signboard close-up, entrance, view from the 3rd Avenue corner |
| Interior (4) | Family tables, group area, counter, outdoor filter coffee counter |
| Dishes (15) | Mini Tiffin, Nellai Special Sodhi Meals, Paanai Parotta, Ghee Roast, Ghee Podi Dosa, Madurai Malli Dosa, Navadhaniya Dosa, Idiyappam Sodhi, Ghee Mini Sambar Idly, Special Kothu Parotta, Madurai Salna Parotta, Karaikudi Paneer Poppers, Executive TN Meals, Karuppatti Ulundhu Kali, Filter Coffee |
| Action (4) | Dosa on the tawa, customised dosa being made, coffee pour, live counter at a function (with host permission) |
| People (2) | Staff at work (with permission), founders (optional) |
| Menu (1) | Current menu card |

## M. Videos (10 short clips, 15–30 seconds)

1. A dosa being made on the tawa. 2. A customised dosa from choice to plate. 3. Mini Tiffin being plated. 4. Nellai Sodhi meal being served. 5. Filter coffee pouring. 6. Walking in from the street to the table. 7. Morning breakfast rush at 6:30–8 AM. 8. A family table (with permission). 9. Takeaway packing (only if takeaway is confirmed). 10. Behind the scenes in the kitchen (if the owner agrees).

## N. Google Posts: 1–2 a week (4–6 a month)

Each post: one real photo, 100–200 words, "Anna Nagar East" once, one button. Use the 20 ideas in `docs/strategy/competitor-attack-plan.md` section 3.8. First four weeks:

| Week | Post | Button |
|---|---|---|
| 1 | Breakfast from 6:30 AM: the ₹80 Mini Tiffin (what's on the plate) | Call |
| 2 | Pre-book Monday to Thursday and save up to 40% (Offer post with start and end dates) | Book |
| 3 | Nellai Special Sodhi Meals: what a Tirunelveli meal is | Learn more → /menu/ |
| 4 | Live dosa and parotta counters for home functions, 50 to 1,500 guests | Call |

Example post (week 1):
> Breakfast at Brihadhee starts at 6:30 AM every day. Our Mini Tiffin plate is ₹80: pongal, kesari, 2 idlis, a masala dosa, vada, sambar and chutneys. Everything is 100% pure vegetarian. Find us on 3rd Avenue, W-Block, Anna Nagar East, near Anna Nagar Tower Park. Call +91 94442 24999.

Do not post reviews or testimonials. Do not post offers you cannot honour. Offer posts need real dates.

## O. Questions and answers (25)

Google has been reducing the Q&A section on Maps in favour of AI answers drawn from your description, reviews and website. If your profile still shows "Questions & answers", post these as the owner and answer them. Either way, the same answers are on the website, so Google's AI can read them there. Keep answers 40–60 words where possible.

| # | Question | Answer |
|---|---|---|
| 1 | Is Brihadhee pure vegetarian? | Yes. Brihadhee is a 100% pure vegetarian restaurant. No meat, egg or fish is cooked or served. Our menu covers South Indian tiffin, dosas, Tamil Nadu meals, parotta, North Indian gravies and filter coffee, with Tirunelveli (Nellai) and Karaikudi specialities. |
| 2 | What are your timings? | We are open every day, Monday to Sunday, from 6:30 AM to 11:00 PM, serving breakfast, lunch and dinner. Breakfast starts at 6:30 AM with our ₹80 Mini Tiffin. Please check this profile for special hours on festival days. |
| 3 | Where exactly are you? | New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Main Road, Anna Nagar East, Chennai 600040. We are near Anna Nagar Tower Park and the 3rd Avenue and 9th Street junction. Tap Directions on this profile for the route. |
| 4 | What is the Mini Tiffin? | Our Mini Tiffin is an ₹80 breakfast plate with pongal, kesari, 2 idlis, a masala dosa, vada, sambar and chutneys. It is a good way to try several South Indian tiffin items in one plate. Prices can change, so check our menu page. |
| 5 | Do you make customised dosas? | Yes. You can ask for your dosa to be customised. Our menu also lists 11 dosas, from Kal Dosa (₹95) to Ghee Masala Dosa (₹170), including Navadhaniya, Ragi, Pesarattu and Madurai Malli dosa. |
| 6 | What is Nellai Sodhi meals? | Nellai Special Sodhi Meals (₹240) is our Tirunelveli-style vegetarian meal served with sodhi, a mild coconut-milk stew from the Nellai region. We also serve Idiyappam Sodhi (₹180) for a lighter plate. |
| 7 | Can I book a table? | Yes. Pre-book on Swiggy Dineout, EazyDiner or District and get up to 40% off from Monday to Thursday. Walk-in guests get 10% off on dine-in. For a large group, please call +91 94442 24999. |
| 8 | Do you have offers? | Walk-in dine-in guests get 10% off. Pre-booking through Swiggy Dineout, EazyDiner or District gives up to 40% off from Monday to Thursday. Offers can change, so please check before you visit. |
| 9 | How much does it cost for two? | Tiffin for two costs about ₹200 to ₹400. A full family meal costs about ₹800. Menu prices range from ₹35 for lemon tea to ₹315 for our paneer gravies. |
| 10 | Is it good for families? | Yes. Brihadhee is family-friendly, 100% pure vegetarian and serves no alcohol. Families often order the Executive TN Meals, dosas and the Ghee Mini Sambar Idly (14 pieces) for children. |
| 11 | Do you serve filter coffee? | Yes. Filter coffee is ₹40. We also serve tea (plain, ginger or elaichi), lemon tea, black coffee and plain milk. |
| 12 | What are your specialities? | We are known for customised dosas, Paanai Parotta, Nellai Special Sodhi Meals and filter coffee, along with Karaikudi Paneer Poppers and Karuppatti Ulundhu Kali, a traditional palm-jaggery sweet. |
| 13 | What is Paanai Parotta? | Paanai Parotta (₹260) is our signature parotta dish served in a clay pot (paanai). (Chef to confirm the exact description before posting.) |
| 14 | Do you serve alcohol? | No. Brihadhee does not serve alcohol. |
| 15 | Do you do catering? | Yes. We cater pure vegetarian functions across Chennai for 50 to 1,500 guests, including baby showers, housewarmings, ear-piercing ceremonies, engagements, weddings and birthdays. Pricing is per plate, quoted for each menu. Call +91 94442 24999. |
| 16 | What live counters do you offer for events? | Customised Dosa, Paanai Parotta, Nellai Sodhi and Karaikudi Paneer Poppers live counters. Event planners can book them as white-label or co-branded counters. |
| 17 | What do you serve for lunch? | Mini Meals (₹140), Limited TN Meals (₹150), Executive TN Meals Unlimited (₹205), Nellai Special Sodhi Meals (₹240), and sambar, variety and curd rice (₹105 each). |
| 18 | Who runs Brihadhee? | Brihadhee was founded by Rakesh and Eashwer, an auditor and a lawyer by profession, out of a shared passion for authentic regional Tamil vegetarian food. |
| 19 | What is Beyond Curry by Brihadhee? | Beyond Curry by Brihadhee is our North Indian meal-box brand. (Owner to add how to order before posting.) |
| 20 | Are you connected to the Brihadeeswarar Temple? | No. Brihadhee is a restaurant in Anna Nagar East, Chennai, and is not connected to the Brihadeeswarar Temple in Thanjavur. |
| 21 | Which areas are you close to? | We are in Anna Nagar East, a short drive from Anna Nagar West, Shenoy Nagar, Kilpauk, Mogappair and Thirumangalam. |
| 22 | Do you have North Indian food? | Yes. We serve North Indian gravies such as Paneer Butter Masala, Aloo Gobi Masala and Nilgiris Dum Aloo (₹295–₹315), with chapathi and parotta. All 100% vegetarian. |
| 23 | Is there parking? | **Do not post until the owner confirms.** |
| 24 | Do you deliver? | **Do not post until Swiggy/Zomato links are confirmed.** |
| 25 | What is your WhatsApp number? | **Do not post until the WhatsApp number is confirmed.** |

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

1. Confirm the phone number to show (+91 94442 24999, and whether 73587 14113 still works).
2. Add the website with the UTM link.
3. Fix the address and check the pin at the entrance.
4. Set hours Monday to Sunday, 6:30 AM to 11 PM, and holiday hours for the next festival.
5. Add secondary categories (Vegetarian restaurant, Breakfast restaurant, Family restaurant, Caterer, Indian restaurant).
6. Paste the description from step G.
7. Tick the confirmed attributes; leave parking, delivery and accessibility off until confirmed.
8. Build the 59-item menu with prices.
9. Upload the first 15 photos and start the review QR cards.
10. Correct EazyDiner (non-veg error) and claim Apple Business Connect.
