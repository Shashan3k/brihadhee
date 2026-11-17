# Brihadhee public listing spot-check, 2026-11-17

Checked 2026-11-17, about 20:15 to 20:40 IST. Read-only: no logins, no submissions, no contact, no repo edits.
Method: `curl -sL --compressed` with a desktop Chrome user agent and `Accept-Language: en-IN`, then grep of the server-rendered HTML (visible text and embedded JSON / JSON-LD). WebFetch was used only for Instagram and HappyCow, after curl failed. WebSearch was used to look for magicpin, Justdial, Tripadvisor, HappyCow, Bing and Apple pages; it found none of them, so known URLs were taken from earlier repo notes (`docs/geo/*`, `docs/audits/2026-11-12/*`).
Raw HTML saved in `/tmp/claude-1000/-mnt-c-Users-Shashank-OneDrive-Desktop-Bri/1d31fe00-ed62-4661-a3e7-6cab041f5c36/scratchpad/dl/`.

Approved values (from the caller, sourced from /about/#facts):
- Name: Brihadhee
- Address: New No. W-41, Old No. W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Tamil Nadu 600040
- Dining phone: +91 73587 14113. Catering phone: +91 94442 24999 (catering only)
- Hours: every day, 11 AM to 11 PM; lunch and dinner only, no breakfast
- Food: pure vegetarian
- Website: https://www.brihadhee.com/ ; menu: /menu/

Status key: MATCHES / WRONG (value) / NOT OBSERVABLE. "WRONG (missing)" means the field is observable and empty.

Docs note: `docs/geo/corrections-log.csv` row 4 (2026-11-12) and `docs/seo-baseline.md` line 116 treat +91 94442 24999 as the confirmed primary phone. The approved facts used here treat it as catering-only, so those repo notes now disagree with the approved facts.

---

## 1. Zomato
URL: https://www.zomato.com/chennai/brihadhee-anna-nagar-east. HTTP 200, server-rendered, observable.
- Name: "BRIHADHEE". MATCHES (upper case).
- Address: "New W-41, Old W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai", postalCode "600040". MATCHES.
- Phone: `tel:+919444224999`; JSON `"phoneStr":"+919444224999"`; JSON-LD `"telephone":"+919444224999"`. WRONG: catering number shown as the only call number. No 73587 14113.
- Hours: "11am – 11pm (Today)"; JSON `"opening_hours":[{"timing":"11am – 11pm","days":"Mon-Sun"}]`. MATCHES.
- Meal tags: highlights include "Dinner", "Lunch", "Breakfast", and also "Brunch". WRONG ("Breakfast"; "Brunch" is questionable).
- Veg: highlights "Vegetarian only" and "Vegetarian friendly". MATCHES.
- Website link: no brihadhee.com anywhere in the page. WRONG (missing).
- Other (gated topics, recorded only): "Home delivery", "Takeaway available". Rating in the page JSON is 3.9 (not used).

## 2. Swiggy Dineout
URL: https://www.swiggy.com/restaurants/brihadhee-anna-nagar-chennai-1150652/dineout, which redirects to https://www.swiggy.com/restaurants/chennai/anna-nagar/brihadhee-1150652/dineout. HTTP 200, observable.
- Name: "Brihadhee". MATCHES.
- Address: Location widget "Plot No.41, 3Road Avenue, W Block, Anna Nagar, Chennai, Tamil Nadu"; JSON-LD streetAddress "Anna Nagar, Chennai", postalCode "600040". WRONG (same as before).
- Phone: JSON-LD `"telephone":"+91-9444224999"`; "Trying to reach the outlet?" dialer `"text":"9444224999"`. WRONG: catering number shown as the outlet number. Not on the earlier issue list; new finding (or not recorded before).
- Hours: Monday to Sunday "11AM - 11PM"; masthead "till 11PM". MATCHES.
- Veg: Amenities "Pure veg" (also a "Pure veg" chip). MATCHES.
- Cuisine: servesCuisine ["South Indian","North Indian"], "₹800 for two". Recorded only.
- Website: none. WRONG (missing).
- Other (gated topic): Amenities "Parking available". This conflicts with the parking gate; flag for the owner.

## 3. EazyDiner
URL: https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877. HTTP 200, observable.
- Name: "Brihadhee". MATCHES.
- Address: "New no-W, 41( Old no-W 124, 3rd Ave, W Block, Anna Nagar, Chennai"; locality "Anna Nagar East, Chennai"; postalCode "600040". MATCHES in substance, but the punctuation is garbled and "Ward 100, Main Road" is missing.
- Phone: JSON-LD `"telephone":"786 100 4444"`. The same number is in EazyDiner's own site footer, so it is the platform's line. No restaurant number is shown. WRONG (platform number in the restaurant schema; restaurant numbers not shown).
- Hours: header "Open till 11:00 PM". FAQ: "MONDAY: 06:30 AM to 11:00 PM ... SUNDAY: 06:30 AM ...". JSON-LD opens "06:30", closes "23:00" every day. WRONG (06:30 AM opening, same as before).
- Veg: FAQ "Brihadhee is pure vegetarian restaurant?" answered "Brihadhee serves both veg and non veg food." (visible text and FAQPage JSON-LD). WRONG (same as before).
- Website: none. WRONG (missing).

## 4. District (Zomato)
URL: https://www.district.in/dining/chennai/brihadhee-anna-nagar-east. HTTP 200, observable (the page shows a JS warning, but the main content is server-rendered).
- Name: "BRIHADHEE". MATCHES.
- Address: "New W-41, Old W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai". MATCHES. (The JSON-LD has no postalCode.)
- Phone: Call button `tel:+919444224999`; Location card "+919444224999"; JSON-LD telephone the same. WRONG (catering number as the dining call number, same as before).
- Hours: "Open • 11:00 AM to 11:00 PM"; Operating hours modal "11 AM - 11 PM" Monday to Sunday; JSON-LD 11:00 to 23:00. MATCHES.
- Offers: "FLAT 15% OFF / From 7:00 PM, today / 15 slots left" and "FLAT 15% OFF / No booking required / 12:00 PM, 20 Nov / 2000 slots left". The server HTML contains no "6 PM", "6 AM", "18:00" or "06:00". The earlier "6 PM–6 AM" window was not seen, but the full validity window of each offer is not shown in the HTML. NOT OBSERVABLE (window); the old value is not visible.
- Veg: no veg or non-veg tag on the listing (only reviews mention veg). NOT OBSERVABLE.
- Cuisines: "South Indian, North Indian, Indo-Chinese". Recorded only.
- Website: none. WRONG (missing).

## 5. magicpin
WebSearch did not surface the page. The URL comes from repo notes: https://magicpin.in/Chennai/Anna-Nagar-East/Restaurant/Brihadhee/store/1754057/. HTTP 200, observable.
- Name: "BRIHADHEE". MATCHES.
- Address: "New W-41, Old W-124, W-Block, 3rd Avenue, Ward 100, Main Road, Anna Nagar East, Chennai, Anna Nagar East, Chennai". MATCHES (the locality is repeated and there is no PIN).
- Phone: "+919444224999" (Phone field and JSON-LD). WRONG (same as before). Page also says "✓ Verified listing" and "Claim listing".
- Hours: visible "Open now · 11:30 AM – 2:00 PM" (shown three times). JSON-LD openingHoursSpecification has 11:30–14:00 and 18:30–21:00 every day; openingHours "Mo 11:30:00-21:00:00" and so on. WRONG (same as before; split 11:30–2 and 6:30–9 PM).
- Veg: no veg tag. NOT OBSERVABLE.
- Website: none. WRONG (missing).

## 6. Justdial: "Brihadhee"
WebSearch did not surface it. The URL is from repo notes; the non-AMP URL returned an empty `<HTML></HTML>` (30 bytes).
AMP URL: https://www.justdial.com/Chennai/Brihadhee-Anna-Nagar/044PXX44-XX44-250327220223-I8G9_BZDET/amp. HTTP 200, observable.
- Name: "Brihadhee". MATCHES. A Brihadhee listing does exist. The earlier note "only Beyond Curry listed" no longer holds, at least on the AMP page.
- Address: "New Now, 41( Old Now 124, 3rd Avenue, W Block, Anna Nagar, Chennai-600040, Tamil Nadu". WRONG (minor: "New Now"/"Old Now" typos, "Anna Nagar" without East, no Ward 100 / Main Road). No "18th Main Road".
- Phone: hidden behind the "Call Now" / "WhatsApp" buttons; no number in the HTML. NOT OBSERVABLE.
- Hours: "Open Now : until 11:00 pm"; JSON-LD 11:00 am to 11:00 pm Monday to Sunday. MATCHES. But the boilerplate says "we're here to serve you at breakfast, lunch, and dinner". WRONG on meal service (breakfast). The "Dining Options" block lists only "Dinner", "Lunch".
- Veg: "Special Offerings: Vegan Options Available, Veg Options Available". There is no pure-veg flag and no "Non Veg" category in "Also listed in" (Restaurants, South Indian Restaurants, Inexpensive ...). NOT OBSERVABLE as pure veg; "Veg Options Available" suggests a mixed menu.
- Website: "Website + Add Website". WRONG (missing).
- Other: Type "Delivery", Services "Home Delivery" (gated topic). 964 ratings, 4.1. Recorded only.

## 7. Justdial: "Beyond Curry By Brihadhee" (gated sub-brand; record only)
The non-AMP URL returned an empty body. AMP: https://www.justdial.com/Chennai/Beyond-Curry-By-Brihadhee-18Th-Main-Road-Anna-Nagar/044PXX44-XX44-250930164611-H6Q3_BZDET/amp. HTTP 200.
- Address: "New W41, Old W124, W Block, 3rd Avenue, Ward 100, 18th Main Road-Anna Nagar, Main Road, Anna Nagar, Chennai-600040". WRONG ("18th Main Road" still present, same as before).
- Hours: "11:15 am - 3:45 pm | 6:00 pm - 10:45 pm" every day; "Open Now : until 10:45 pm". Does not match the Brihadhee hours. It may be legitimate for a delivery brand, but needs the owner (Q26).
- Cuisines: Chinese, South Indian, North Indian. Seating: "No Seating". Type: "Delivery". Boilerplate mentions breakfast. Phone hidden (NOT OBSERVABLE). Website "+ Add Website".

## 8. Instagram @brihadhee
URL: https://www.instagram.com/brihadhee/. curl returned HTTP 200 but an error shell (`"pageID":"httpErrorPage"`, PolarisErrorRoot). NOT OBSERVABLE via curl.
WebFetch (Anthropic fetcher; the text comes from a summarizer model, so it is not a raw capture and is lower confidence):
- Bio: "Pure Veg South Indian 🍽️", "Anna Nagar, Chennai", "Tamil Nadu's Traditional Flavours", "Elevated with a Modern Touch". Veg MATCHES.
- Phone: "📞 Order Now: 95661 35405". The first WebFetch pass said this is in a post caption and that the bio ☎️ has no number after it. WRONG (95661 35405 still visible, apparently in a post caption; date unknown).
- Also: "🛵 Also available on Swiggy & Zomato!" (gated topic).
- Website: "No linktr.ee, brihadhee.com, or wa.me links appear". WRONG (missing), with the same confidence caveat.
- Hours / address: none shown beyond "Anna Nagar, Chennai". NOT OBSERVABLE.
- 9,634 followers; verified badge reported.

## 9. Apple Maps
WebSearch did not surface it. The URL is from repo notes: https://maps.apple.com/place?place-id=I82B4573996F8BD50. HTTP 200, observable.
- Name: "Brihadhee Pure Veg Restaurant". WRONG (name differs from "Brihadhee"); "Claim This Place" is shown.
- Address: "41/124, Opposite Sea Shell, 3rd Avenue, W Block, Anna Nagar, Chennai, Tamil Nadu, 600040, India". MATCHES in substance (new/old number, 3rd Avenue, W Block, 600040). "Anna Nagar" has no East, and the landmark "Opposite Sea Shell" is not owner-verified.
- Phone: displayed "+91 9444224999" (tel link). The page JSON also has `"altTelephone":["+917358714113"]`, which is not displayed. WRONG (catering number as the primary call number).
- Hours: "Every Day 11:00 am – 11:00 pm". MATCHES.
- Veg: name contains "Pure Veg"; "Good to Know" lists "Vegetarian Options", "Vegan Options". MATCHES (the name says pure veg).
- Meal tags: "Lunch" only; no breakfast. "Takeaway" tag (gated). Ratings come from Zomato (4.0, 1,568).
- Website: none. WRONG (missing).

## 10. Bing Places
https://www.bing.com/maps/search?q=Brihadhee+Anna+Nagar+Chennai&... HTTP 200, but the business card is JS-rendered: no phone, address or hours in the HTML. The Bing web SERP returned unrelated results to curl. WebSearch found no Bing Places page. NOT OBSERVABLE.

## 11. Tripadvisor
https://www.tripadvisor.in/Search?q=Brihadhee%20Chennai. HTTP 200, but the results are client-rendered (shell only, robots noindex). WebSearch found no Tripadvisor Brihadhee page. NOT OBSERVABLE; no public page found.

## 12. HappyCow
https://www.happycow.net/asia/india/chennai/ returned a 212-byte Incapsula challenge (curl and WebFetch both got empty content). WebSearch found no Brihadhee HappyCow listing. NOT OBSERVABLE; no page found.

---

## Earlier issues: status today
| Earlier issue (5–16 Nov) | Today |
|---|---|
| Zomato dining call number +91 94442 24999 | Still present |
| District dining call number +91 94442 24999 | Still present |
| magicpin dining call number +91 94442 24999 | Still present |
| Zomato "Breakfast" tag | Still present (also "Brunch") |
| District offer window "6 PM–6 AM" | Not seen; offer cards now show "From 7:00 PM, today" / "12:00 PM, 20 Nov"; full window not in HTML, so NOT OBSERVABLE |
| Swiggy Dineout address "Plot No.41, 3Road Avenue" | Still present |
| magicpin hours "11:30 AM – 2:00 PM" | Still present (schema adds 6:30–9 PM) |
| EazyDiner "serves both veg and non veg" | Still present |
| EazyDiner hours 06:30 AM | Still present |
| Instagram +91 95661 35405 | Still present (WebFetch only; in a post caption) |
| Justdial: only "Beyond Curry By Brihadhee", "18th Main Road" | Partly changed: a "Brihadhee" listing is now reachable (AMP). The Beyond Curry listing still says "18th Main Road" |

New findings not on the earlier list:
- Swiggy Dineout also uses 94442 24999 as the outlet number.
- Swiggy Dineout "Parking available" (gated topic).
- Apple Maps primary phone is 94442 24999. 73587 14113 appears only as a hidden altTelephone.
- EazyDiner schema telephone is EazyDiner's own 786 100 4444.
- Justdial Brihadhee boilerplate says "breakfast, lunch, and dinner", and its address has typos ("New Now").
- No listing checked links to brihadhee.com.
