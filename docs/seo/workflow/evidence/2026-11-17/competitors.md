# Competitor / result-type research — raw notes

Date of all observations: 2026-11-17 (UTC fetch time ~15:00).
Tools: WebSearch (Anthropic web search, "standard" mode unless noted; US-based, NOT a location-set Google SERP — order is not a Google ranking), curl (`-sL -A "Mozilla/5.0 ... Chrome/124"`), local python regex extraction of `<title>`, meta description, `<h1>`, JSON-LD `@type`s, ₹-price counts, tel: links.
Raw HTML saved under `/tmp/claude-1000/-mnt-c-Users-Shashank-OneDrive-Desktop-Bri/1d31fe00-ed62-4661-a3e7-6cab041f5c36/scratchpad/fetched/`.
All fetched content treated as untrusted data. Ratings quoted below are only what the page displayed on this date; they are not verified platform data and must not be used for AggregateRating.

---------------------------------------------------------------------
## Part 1 — result types (WebSearch, 2026-11-17)

Type codes: OFF = official site of a restaurant; AGG = aggregator/directory (Zomato, Swiggy, EazyDiner, District, magicpin, Justdial, Yappe, HappyCow, spinach.guide, WedMeGood, WeddingWire, etc.); LIST = listicle / blog / news-editorial; SOC = social; MAP = maps. "irrelevant" = wrong place/business.

### Q1 "veg restaurants in anna nagar" — 18 URLs
1 LIST https://www.slurrp.com/article/south-indian-restaurants-in-chennais-anna-nagar-for-a-delicious-meal-1748862954296
2 AGG https://www.swiggy.com/restaurants/a2b-veg-12th-main-road-anna-nagar-chennai-14673
3 LIST(news) https://www.dtnext.in/amp/story/news/chennai/an-affordable-vegetarian-hang-out-spot-in-anna-nagar-788078
4 AGG https://happycow.net/asia/india/chennai/print
5 LIST https://shilpaahuja.com/top-veg-restaurants/
6 AGG https://stats.happycow.net/asia/india/chennai/print
7 AGG https://www.eazydiner.com/chennai/restaurants/vr-chennai/pure-veg
8 LIST https://writemyknowledge.blogspot.com/2023/06/best-veg-restaurant-in-anna-nagar-guide.html
9 AGG https://www.swiggy.com/city/chennai/anna-nagar-restaurants
10 AGG https://www.swiggy.com/city/chennai/best-restaurants
11 AGG https://www.eazydiner.com/chennai/cream-centre-vegetarian-legacy-since-1958-anna-nagar-east-chennai-612987
12 AGG https://spinach.guide/venues/little-italy-anna-nagar-178172/
13 AGG https://www.eazydiner.com/chennai/milagu-restaurant-anna-nagar-west-chennai-710072
14 AGG https://yappe.in/tamil-nadu/chennai/dwaraka-veg/423918
15 AGG https://www.eazydiner.com/chennai/adyar-ananda-bhavan-anna-nagar-west-612797
16 AGG https://www.eazydiner.com/chennai/cream-centra-vegetarian-legacy-since-1958-anna-nagar-east-chennai-612987
17 AGG https://www.eazydiner.com/chennai/adyar-ananda-bhavan-anna-nagar-east-613167
18 LIST https://trip101.com/article/non-veg-restaurants-in-anna-nagar
Counts: OFF 0 / AGG 13 / LIST 5 / SOC 0 / MAP 0. Brihadhee: not present.
Names recurring in the summary: Hotel Saravana Bhavan, Bhavyam Veg, Sree Akshayam, Dwaraka Veg (W Block, 3rd Avenue — same street as Brihadhee), Little Italy, Cream Centre, A2B.

### Q2 "restaurants in anna nagar" — 16 URLs
1 LIST https://housing.com/news/best-restaurants-in-chennais-anna-nagar
2 AGG https://www.swiggy.com/city/chennai/anna-nagar-restaurants
3 AGG (irrelevant, Pondicherry) https://www.swiggy.com/city/pondicherry/anna-nagar-restaurants
4 LIST slurrp (same as Q1-1)
5 LIST https://traveltriangle.com/blog/restaurants-in-anna-nagar
6 LIST https://traveltriangle.com/blog/wp-json/wp/v2/posts/775616
7 LIST https://traveltriangle.com/blog/?p=775616
8 LIST https://lbb.in/delhi/best-restaurants-in-anna-nagar-chennai
9 LIST https://lbb.in/chennai/best-restaurants-in-anna-nagar-chennai/
10 LIST https://slurrp.com/article/10-best-family-restaurants-in-chennais-anna-nagar-1677314187303
11 AGG https://www.swiggy.com/city/chennai/anna-nagar-restaurants/buffet-restaurants-dineout
12 AGG https://www.swiggy.com/city/chennai/anna-nagar-restaurants/brunch-restaurants-dineout
13 LIST(aggregator blog) https://www.eazydiner.com/food-trends/the-local-edit-6-spots-in-anna-nagar-chennai-for-every-mood-and-craving
14 AGG https://www.swiggy.com/city/chennai/anna-nagar-restaurants/lounge-restaurants-dineout
15 LIST https://tickets.paytm.com/blog/restaurants-in-anna-nagar
16 LIST https://hungryforever.net/?p=92943
Counts: OFF 0 / AGG 5 / LIST 11 / SOC 0 / MAP 0. Brihadhee: not present.

### Q3 "brihadhee menu" — 12 URLs
1 AGG (Brihadhee) https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877
2 AGG (Brihadhee) https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877/reviews
3 AGG irrelevant https://www.swiggy.com/city/hyderabad/brijwasi-aahaar-miyapur-rest2750
4 AGG irrelevant https://www.swiggy.com/menu/2750
5 OFF-other irrelevant https://www.seleqtionshotels.com/.../karavalli-menu-new.pdf
6 AGG irrelevant https://food.grab.com/my/en/restaurant/mtr-1924-delivery/MYDD05485
7 AGG irrelevant https://food.grab.com/my/en/restaurant/anjappar-restaurant-jalan-maarof-delivery/1-CY3EAJTWR3L2EN
8 AGG irrelevant https://www.just-eat.co.uk/restaurants-cafe-deccan-poplar/menu
9 OFF-other irrelevant https://indianaccent.com/newyork/brunch-with-cocktails
10 other irrelevant https://www.keralatourism.org/responsible-tourism/ethnic-cuisine/unit/knrajasree/354
11 other irrelevant https://www.scribd.com/document/894929789/Menu
12 OFF-other irrelevant https://cdn1.simplotel.com/generic_uploads/production/y6Q3G3XE/golden_palate.pdf
Counts: Brihadhee official 0 / Brihadhee aggregator 2 / irrelevant 10. brihadhee.com did NOT appear for this query in this tool.
Follow-up queries (same date) to enumerate third-party Brihadhee pages:
- "Brihadhee Anna Nagar East menu prices" → EazyDiner x2 + irrelevant.
- "Brihadhee restaurant Chennai zomato swiggy magicpin" → EazyDiner x2 + generic Swiggy/magicpin pages.
- "\"Brihadhee\" Chennai" (extended) → SOC https://www.instagram.com/brihadhee/ ; EazyDiner main, /reviews, /menu ; District ; magicpin ; Zomato "Beyond Curry By Brihadhee" ; Zomato juice-delivery collection ; Justdial "Beyond Curry By Brihadhee". brihadhee.com not returned.
- "Brihadhee Anna Nagar justdial OR zomato OR tripadvisor OR swiggy" (extended) → Swiggy Dineout, Zomato main, Zomato /reviews, EazyDiner x3, magicpin, Zomato Beyond Curry, District. No Tripadvisor / Justdial (Brihadhee) listing returned.

### Q4 "south indian restaurant anna nagar" — 19 URLs
1 LIST slurrp ; 2 LIST(news) https://www.dtnext.in/lifestyle/food-review-a-flavorful-journey-through-south-indian-cuisine-in-anna-nagars-malli-mess-808949 ; 3 AGG https://www.explurger.com/pd/otf45xk1y9hv8znm3 ; 4 AGG (Brihadhee!) https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877 ; 5 LIST traveltriangle ?p= ; 6 LIST traveltriangle ; 7 LIST housing.com ; 8 AGG https://stayneat.pages.dev/restaurant/anjappar-grand-d59a44cc0d/ ; 9 AGG swiggy pondicherry (irrelevant) ; 10 AGG https://www.swiggy.com/city/chennai/anns-kitchen-kolathur-rest874200 ; 11 AGG yappe Pune (irrelevant) ; 12 AGG https://www.district.in/dining/chennai/kolapasi-indian-canteen-anna-nagar-west ; 13 AGG https://yappe.in/tamil-nadu/chennai/thambi-vilas/420813 ; 14 AGG eazydiner milagu ; 15 LIST https://pursuitofyummyyness.blogspot.com/2016/07/a-guide-to-eating-out-in-anna-nagar.html ; 16 LIST https://theculturetrip.com/asia/india/articles/gateway-to-the-south-chennai-s-best-restaurants-and-eats ; 17 AGG swiggy casual-dining-dineout ; 18 AGG eazydiner a2b anna nagar west ; 19 LIST eazydiner food-trends.
Counts: OFF 0 / AGG 11 / LIST 8 / SOC 0 / MAP 0. Brihadhee appears only via EazyDiner.

### Q5 "veg restaurants in anna nagar for lunch" — 17 URLs
1 AGG swiggy a2b ; 2 AGG https://www.swiggy.com/city/chennai/brunch-restaurants-dineout ; 3 LIST(news) dtnext ; 4 LIST shilpaahuja ; 5 AGG spinach little italy ; 6 AGG https://www.happycow.net/asia/india/chennai/print ; 7 LIST(aggregator blog) https://www.district.in/blog/vegetarian-restaurants-for-families-in-chennai ; 8 AGG eazydiner pure-veg ; 9 AGG swiggy best ; 10 AGG https://spinach.guide/venues/saravana-bhavan-anna-nagar-178487/ ; 11 AGG swiggy anna-nagar ; 12 AGG yappe dwaraka ; 13 AGG https://yappe.in/tamil-nadu/chennai/sri-ganesh-bhavan/147631 ; 14 AGG swiggy casual dining ; 15 AGG eazydiner a2b ; 16 AGG https://spinach.guide/venues/murali-krishna-andhra-hotel-178380/ ; 17 AGG https://spinach.guide/venues/gks-santhi-bavan-178381/
Counts: OFF 0 / AGG 14 / LIST 3 / SOC 0 / MAP 0. Brihadhee: not present.

### Q6 "pure veg restaurants in anna nagar" — 18 URLs
1 LIST shilpaahuja ; 2 AGG eazydiner cream centra ; 3 AGG happycow ; 4 AGG eazydiner pure-veg ; 5 AGG stats.happycow ; 6 LIST(ranking site) https://threebestrated.in/pure-vegetarian-restuarants-in-chennai-tn ; 7 AGG swiggy anna-nagar ; 8 AGG eazydiner cream centra /reviews ; 9 AGG swiggy best ; 10 AGG https://www.eazydiner.com/chennai/gopuram-veg-ambattur-chennai-703123 ; 11 LIST(news) dtnext ; 12 AGG swiggy insta-worthy dineout ; 13 AGG swiggy brunch dineout ; 14 AGG https://threebestrated.in/sree-akshayam-pure-vegetarian-restuarants-chennai-tn-zK6Fp ; 15 AGG eazydiner gopuram /about ; 16 AGG swiggy a2b ; 17 AGG eazydiner a2b east /reviews ; 18 AGG spinach little italy
Counts: OFF 0 / AGG 15 / LIST 3 / SOC 0 / MAP 0. Brihadhee: not present.

### Q7 "vegetarian catering anna nagar" — 19 URLs
WedMeGood x9 (nalabhagam, Blessing, KS, vendors/vegetarian list, Sairam, parambariyam, Canaan, Pooja, Ahmed) AGG ; quikr Thane AGG (irrelevant) ; swiggy geetham-veg-restaurant-annanagar AGG ; weddingwire.in caterers/chennai/anna-nagar-west AGG ; weddingwire lakshanaa AGG ; zerocater.com (US, irrelevant) ; addtoevent.co.uk vrindavan-vatika (UK, irrelevant) ; m.indiamart.com AGG ; magicpin blog Pune LIST (irrelevant) ; addtoevent chennai-srilalitha AGG ; OFF https://sites.google.com/view/ajanta-caterers/home (Google Sites caterer; location not verified).
Counts: OFF 1 (location unverified) / AGG 17 / LIST 1 / SOC 0 / MAP 0. Brihadhee: not present. Wedding-vendor marketplaces dominate.

---------------------------------------------------------------------
## Part 1b — third-party pages publishing a Brihadhee menu (fetched 2026-11-17)

| URL | HTTP | Menu form | Item prices in HTML? | Notes |
|---|---|---|---|---|
| https://www.zomato.com/chennai/brihadhee-anna-nagar-east/order | 200 | HTML item list (Combos, Dosa Variety, Parotta & Chapathi, Idiyappam, Starters, Kaapi Bar, …) + JSON-LD Menu/MenuSection/MenuItem/Offer | YES (62 ₹ values; e.g. "Plain Dosa ₹148", "Ghee Roast ₹178", "Kal Dosa (2 Pcs) ₹126") | Online-order prices; differ from brihadhee.com/menu dine-in prices fetched same day (Kal Dosa ₹126 vs ₹100; Plain Dosa ₹148 vs ₹105; Ghee Roast ₹178 vs ₹155; Ghee Podi Dosa ₹198 vs ₹165). Title "BRIHADHEE, Anna Nagar East order online - Zomato". |
| https://www.zomato.com/chennai/brihadhee-anna-nagar-east/menu | 200 | Image menu "Food 24 pages" | No | Title "Menu of BRIHADHEE, Anna Nagar East, Chennai". Page text lists "Frequent searches leading to this page: brihadhee menu, brihadhee anna nagar east menu, brihadhee chennai, brihadhee chennai menu, brihadhee restaurant". |
| https://www.zomato.com/chennai/brihadhee-anna-nagar-east | 200 | Links to menu | No (only "₹200 for two"-type values) | Phone shown +919444224999; hours "11am – 11pm (Today)". |
| https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877/menu | 200 (first try timed out, retry 200) | 4 menu images (Special 3 pages, Food 1 page) in JSON-LD Menu/MenuSection `image`; "Last updated few months ago" | No | Title "Menu of Brihadhee, Anna Nagar East, Chennai". Image filenames carry epoch 1745563939 (≈ Apr 2025). |
| https://www.eazydiner.com/chennai/brihadhee-anna-nagar-east-chennai-703877 | 200 | Link to menu | No | FAQ in HTML + FAQPage JSON-LD: "Brihadhee serves both veg and non veg food." Hours "06:30 AM to 11:00 PM" daily. "₹ 200 for two approx." |
| https://www.swiggy.com/restaurants/chennai/anna-nagar/brihadhee-1150652/dineout | 200 | Image menu "Food 22 pages" | No | Shows "₹800 for two", amenities "Parking available", "Pure veg". JSON-LD Restaurant + AggregateRating. |
| https://www.district.in/dining/chennai/brihadhee-anna-nagar-east | 200 | Image menu "Food 24 pages", "Updated 9 months ago" | No | "₹200 for two", "11:00 AM to 11:00 PM", phone +919444224999. JSON-LD Restaurant, AggregateRating, ReserveAction. |
| https://magicpin.in/Chennai/Anna-Nagar-East/Restaurant/Brihadhee/store/1754057/menu | 200 | "Food Menu 2 photos" | No | Title "BRIHADHEE Menu, Anna Nagar East, Chennai \| November, 2026"; meta "Menu & prices — …". Visible hours "11:30 AM – 2:00 PM". JSON-LD Menu/MenuSection. |
| https://magicpin.in/Chennai/Anna-Nagar-East/Restaurant/Brihadhee/store/1754057 | 200 | Link to menu | No | "Searches leading to this page … BRIHADHEE Menu, BRIHADHEE Food Menu". |
| https://www.zomato.com/chennai/beyond-curry-by-brihadhee-anna-nagar-east | 200 (fetched, not analysed) | — | — | Beyond Curry sub-brand = GATED topic; listed only. |
| https://www.justdial.com/Chennai/Beyond-Curry-By-Brihadhee-18Th-Main-Road-Anna-Nagar/044PXX44-XX44-250930164611-H6Q3_BZDET | 200 but 14-byte body | not observable | — | Gated sub-brand; Justdial blocked curl content. |

Baseline (own site, same date): https://www.brihadhee.com/menu/ — title "Brihadhee Menu and Prices | Anna Nagar East"; H1 "Brihadhee Menu and Prices"; 172 ₹ values in HTML; JSON-LD Restaurant + Menu/MenuSection/MenuItem + FAQPage; tel +917358714113. Homepage title "Brihadhee | Pure Veg South Indian Restaurant, Anna Nagar".

NAP/attribute discrepancies seen on third-party Brihadhee pages (for owner-questions, not for publishing):
- Phone: Zomato/District/magicpin show +91 94442 24999; brihadhee.com shows +91 73587 14113 (and +91 83003 19370).
- Hours: EazyDiner 6:30 AM–11 PM; magicpin visible "11:30 AM – 2:00 PM"; Zomato & District 11–11; site 11–11.
- Diet: EazyDiner FAQ says "serves both veg and non veg food"; Swiggy Dineout says "Pure veg".
- Cost for two: ₹200 (EazyDiner, District, magicpin) vs ₹800 (Swiggy Dineout).
- Swiggy Dineout lists "Parking available" (parking is a gated topic).

---------------------------------------------------------------------
## Part 2 — competitor official sites (fetched 2026-11-17)

### Sashwatha Café — https://www.sashwathacafe.in/ (HTTP 200)
- Found via WebSearch "\"Sashwatha\" cafe Anna Nagar Chennai". Directory address (not on site): 49, Old 95, T Block, 3rd Avenue, Anna Nagar East (per search summary of Zomato/magicpin — unverified).
- <title>: "Sashwatha Café | Authentic Udipi-Style South Indian Cuisine, Chennai"
- meta description: "Sashwatha Café – Udipi Heritage, Modern Soul. Authentic South Indian vegetarian cuisine at Anna Nagar & Nandanam, Chennai. 7AM–12AM daily."
- H1s (3): "An Experience Worth Savouring", "Where Heritage Meets the Table", "Crafted with Discipline".
- Canonical: none. JSON-LD: none. sitemap.xml 404; robots.txt returns an HTML page.
- Menu: PDF only — "assets/Menu/Sashwatha Menu 24April.pdf" (HTTP 200, 12.07 MB, last-modified 15 May 2026) and "Sashwatha Menu without Prices (1).pdf". 0 ₹ prices in HTML; dish names (Benne Masala Dosa, Ghee Podi Thatte Idly, Estate Filter Coffee, Sashwatha Special Meals) appear as cards.
- Address/hours/phone in HTML: hours yes ("7:00 AM – 12:00 AM Daily"); phones yes (tel: +919994131222, 09994551999, +917401833111); address only "Anna Nagar, Chennai — 600 040" (no street address).
- Per-location page: No (single-page site; "Branch 01 Anna Nagar" / "Branch 02 Nandanam" sections with Google share links).
- Distinctive: catering section with enquiry form subject options (Table Reservation, Catering Enquiry, Corporate Order); franchise pitch; press section.

### Geetham Veg — https://geethamveg.com/ (HTTP 200)
- Found via WebSearch result https://geethamveg.com/about. Swiggy Anna Nagar listing: https://www.swiggy.com/city/chennai/geetham-veg-restaurant-annanagar-anna-nagar-rest1042983 (not fetched).
- <title>: "Geetham Veg - Authentic South Indian Vegetarian Restaurant"
- meta description: "Geetham Veg - Premier vegetarian restaurant in Chennai offering authentic South Indian cuisine. Over 10 locations across Chennai."
- H1: none in HTML. Body is `<div id="root"></div>` — client-side rendered (Vite/React). Every path (/about, /menu, /locations, /robots.txt, /sitemap.xml) returns the same 1,116-byte shell → no robots.txt, no sitemap.
- JSON-LD: none. Menu with prices in HTML: No. Address/hours/phone in HTML: No.
- JS bundle (/assets/index-DZxz2tRS.js) holds 17 branch names incl. {name:"Anna Nagar", mapUrl:"https://www.google.com/maps/search/Geetham+Veg+Anna+Nagar+Chennai"} — Google Maps search link only, no address.
- Per-location page: No.

### Sangeetha's Desi Mane — https://www.sangeethasdesimane.com/ (HTTP 200, Wix)
- Home <title>: "Sangeetha's DesiMane | Best Veg Restaurant in Chennai"
- Home meta description: "Sangeetha's DesiMane is one of the Best Veg Restaurant in Chennai Anna nagar, Porur and Virugambakkam - Sangeetha's DesiMane"
- Home H1: "The Real Deal on South Indian Food". Canonical present.
- JSON-LD: WebSite (+SearchAction), LocalBusiness with address "7 Gandhi Nagar 1st Main Road", 600020 (corporate Adyar office, not a restaurant branch). No Restaurant, Menu, FAQPage, AggregateRating.
- Menu: "#menu" section; 0 ₹ prices in HTML ("Order Online" button present; target not resolved).
- Branches page https://www.sangeethasdesimane.com/branches — title "Chennai Branch | Sangeetha's DesiMane", H1 "Chennai Branches", no meta description, no JSON-LD; Anna Nagar East address "Old no 16, new 86, 3rd Ave, W Block, Anna Nagar, Chennai, Tamil Nadu 600102", phone 8680001384; no hours.
- Anna Nagar page https://www.sangeethasdesimane.com/annanagar-contact-number — title "Sangeetha Desimane Annanagar | Sangeetha's DesiMane", H1 "Contact", no meta description, no JSON-LD, 841 chars of text: address + "Get Directions" + "Call Now" (98842 44448). No hours, no menu.
- Blog post https://www.sangeethasdesimane.com/post/sangeetha-s-desi-mane-the-best-veg-restaurant-in-anna-nagar — title/H1 "Sangeetha’s Desi Mane – The Best Veg Restaurant in Anna Nagar", dated Nov 6, 2025, JSON-LD BlogPosting; gives Anna Nagar address as "P 49, Plot 3653, 6th Avenue, Anna Nagar East" (conflicts with branches page). Note: Zomato lists Bhavyam Veg at "Plot 3653, P-49, 6Th Avenue" — same address string (relationship unverified).
- blog-posts-sitemap.xml: ~30 posts, many titled "best … in Chennai" / "… Anna Nagar" (e.g. /post/why-food-lovers-in-anna-nagar-prefer-sangeetha-s-desi-mane, /post/onam-feast-at-sangeetha-s-desi-mane-anna-nagar, /post/sangeetha-s-desi-mane-meals-is-the-best-meals-in-chennai).
- Per-location page: Yes, thin (/annanagar-contact-number). Its Anna Nagar branch address per its own site is on 3rd Ave, W Block — the same street as Brihadhee.

### Bhavyam Veg — no official website found
- WebSearch ("Bhavyam Veg restaurant Anna Nagar website", "\"Bhavyam\" veg Anna Nagar Chennai", "Bhavyam Veg Chennai Thousand Lights Anna Nagar official site instagram") returned no official site. Guessed domains: bhavyamveg.com → 404 (Wix "ConnectYourDomain Error", noindex); bhavyamveg.in, bhavyam.in → no response (000).
- Appears on: Zomato https://www.zomato.com/chennai/bhavyam-veg-anna-nagar-east (200; title "Bhavyam Veg, Anna Nagar East, Chennai | Zomato"; "Plot 3653, P-49, 6Th Avenue, Anna Nagar East"; "7am – 12midnight"; "₹400 for two"; +918300311111; JSON-LD Restaurant/AggregateRating/OrderAction; second outlet bhavyam-veg-thousand-lights), District, magicpin, mappls (per WebSearch).

### Sree Akshayam — official site for the Anna Nagar outlet not observable
- Yappe listing https://yappe.in/tamil-nadu/chennai/sree-akshayam/147629 (200) shows "AJ, 6, 4th Ave, Shanthi Colony, Anna Nagar, Chennai 600040", phone +91 44 4557 0055, "Website sreeakshayam.com", hours 07:00 AM–11:00 PM.
- https://sreeakshayam.com/ → HTTP 404 (openresty). https://www.sreeakshayam.com/ → HTTP 525 (SSL handshake failure). Not observable.
- https://sreeakshayam.in/ (guessed domain, HTTP 200): title "Sree Akshayam | Luxury Vegetarian Restaurant in Chennai"; meta "… a luxury dining destination in Alwarpet, Chennai. Premium thalis, dosas, filter coffee and more."; og:url = https://www.sreeakshayam.com/; Angular SPA (57 chars text in HTML), no H1, no JSON-LD, no canonical; bundle mentions only Alwarpet (CP Ramaswamy Road, 600018), no Anna Nagar. UNVERIFIED whether this is the same business as the Anna Nagar Sree Akshayam.
- Appears on: Yappe, threebestrated.in, restaurant-guru.in, wanderlog, stayneat (per WebSearch).

### Other recurring pure-veg names (from Part 1)

Cream Centre — https://creamcentre.com/ (first try timed out, retry HTTP 200)
- Recurs in Q1, Q6 via EazyDiner Anna Nagar East listings.
- Home <title>: "Cream Centre"; meta description: none; H1 "India’s Iconic Veg Restaurant, Since 1958."; no canonical; no JSON-LD.
- Menu: PDF ("Cream Centre Menu _ June 26 Web.pdf"); /Menu/menu.asp has 0 ₹ prices in HTML.
- Locations: https://creamcentre.com/Location/location.asp (title "Location", H1 "Our Restaurants") — one list page for all cities; Anna Nagar entry "T10, 4th Main Rd, near Yes Supermarket, Block V, Anna Nagar West, … 600040". No hours per branch seen; national phones only. Per-location page: No.

Adyar Ananda Bhavan (A2B) — https://www.aabsweets.com/ → redirects to /order/ (HTTP 200)
- Recurs in Q1, Q4, Q5, Q6 (Swiggy 12th Main Road listing; EazyDiner East/West).
- /order/ title "Adyar Ananda Bhavan | Indian Sweets & Snacks Online"; H1 "Order Indian Sweets & Snacks Online from Adyar Ananda Bhavan". Sweets e-commerce; ₹ prices are for sweets/snacks, not the restaurant menu.
- JSON-LD: FoodEstablishment with self-declared aggregateRating ratingValue "4.8", reviewCount "12000" (no source shown) — example of what Brihadhee must NOT do.
- Locations: https://www.aabsweets.com/order/locations — title "A2B Locations | Find Adyar Ananda Bhavan Stores Near You"; single list; "Anna Nagar Shop PIN 600040 No C 42, II Avenue, Anna Nagar, Chennai. 4440902201". Per-location page: No.

Saravanaa Bhavan — https://saravanabhavan.com/ (HTTP 200)
- Recurs in Q1, Q5 (spinach.guide, HappyCow).
- Title "Saravanaa Bhavan – World’s Favourite South Indian Veg"; meta "Saravanaa Bhavan Global is one of the top Restaurant located at various country…"; JSON-LD Organization/WebSite. /find-us lists country branch counts ("India 31 Branches"); 0 mentions of Anna Nagar. No per-location page, no menu prices.

Dwaraka Veg (W 110, 3rd Avenue, W Block — same street as Brihadhee per Yappe) — no official site found in this pass; appears on Yappe (2 listings). Not fetched further.

---------------------------------------------------------------------
## Observations (evidence-tied)
1. No official restaurant site appeared in any of the 7 generic WebSearch queries; results were aggregators (Swiggy city/collection pages, EazyDiner listings, HappyCow, spinach.guide, Yappe, WedMeGood) and listicles (Slurrp, TravelTriangle, LBB, Housing.com, Trip101). For these queries the realistic route to visibility is via those pages and the Maps pack (not observable here), plus Brihadhee's own page.
2. For "brihadhee menu", Zomato's /order page is the only third-party page with an HTML, priced, schema-marked Brihadhee menu, and the Zomato /menu page openly lists "brihadhee menu" among "Frequent searches leading to this page". All other third-party menus are image galleries (EazyDiner 4 images, Swiggy 22 pages, District 24 pages, magicpin 2 photos). Brihadhee's own /menu/ already has 172 ₹ values + Menu JSON-LD in HTML — stronger than any competitor official site checked.
3. None of the competitor official sites checked put a priced menu in HTML: Sashwatha (PDF, 12 MB), Cream Centre (PDF), Geetham (empty SPA shell), Desi Mane (no prices), Saravanaa Bhavan/A2B (no restaurant menu).
4. Only Desi Mane has a URL dedicated to its Anna Nagar branch (/annanagar-contact-number) and an Anna Nagar-targeted blog post; both are thin (no hours, no schema, no meta description) and contradict each other on the address. Its own pages use "best veg restaurant" wording (Brihadhee can't).
5. Third-party NAP for Brihadhee is inconsistent (phone, hours, veg status, cost for two, parking) — see Part 1b list; these are owner-question items, not publishable claims.
