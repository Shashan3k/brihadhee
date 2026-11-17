# Official guidance check for a single-location restaurant SEO change set

Verified 2026-11-17. Pages were fetched live with curl and converted to text. Two JS-only Bing pages were read differently, as noted. Raw copies are in `research/raw/`.
Labels: **ESTABLISHED** means documented Google or Bing behaviour, or behaviour documented by the vendor for third-party crawlers. **EXPERIMENTAL/UNDOCUMENTED** means announced, draft or not documented.
Quotes are verbatim and at most 25 words. "..." marks a cut.
"Date" is the page's own "Last updated" stamp. support.google.com help pages show none ("not shown").

---

## 1. Search Console Performance report

| Topic | URL | Verbatim quote | Date | Label |
|---|---|---|---|---|
| Property vs page aggregation | https://support.google.com/webmasters/answer/7576553 | "Data grouped by Queries, Countries, Devices, or Dates is aggregated by property. Data grouped by Pages or Search appearance is aggregated by page." | not shown | ESTABLISHED |
| Chart aggregation | same | "Data on the chart is aggregated by property. For example, if two results from the same site appear for one query, they count as a single impression" | not shown | ESTABLISHED |
| Average position | https://support.google.com/webmasters/answer/7042828 | "...the topmost position occupied by a link to your property or page in search results, averaged across all queries in which your property appeared." | not shown | ESTABLISHED |
| Position needs an impression | same | "A link must get an impression for its position to be recorded." | not shown | ESTABLISHED |
| Data goes to the canonical URL | same | "Click, impression, and position data are attributed to the canonical URL of the link." | not shown | ESTABLISHED |
| Anonymized queries | https://support.google.com/webmasters/answer/17011259 | "Some queries are omitted from the report to protect user privacy. These are called anonymized queries. They’re included in chart totals" (the page adds "unless a query filter is applied") | not shown | ESTABLISHED |
| Anonymized queries vs filters | https://support.google.com/webmasters/answer/17010575 | "the "match" and "does not match" totals may not add up to the unfiltered total, due to the omission of anonymized queries and data truncation." | not shown | ESTABLISHED |
| AI Overviews | https://support.google.com/webmasters/answer/7042828 | "An AI Overview occupies a single position in search results, and all links in the AI Overview are assigned that same position." Also: "Impression: Standard impression rules apply." | not shown | ESTABLISHED |
| AI Mode position | same | "Position in AI Mode follows the same methodology as a Google Search results page." | not shown | ESTABLISHED |
| AI Mode follow-up queries | same | "If a user asks a follow-up question within AI Mode, they are essentially performing a new query." | not shown | ESTABLISHED |
| Search Labs excluded | same | "Search Console doesn't include data from experiments in Search Labs" | not shown | ESTABLISHED |
| Where AI traffic is reported | https://developers.google.com/search/docs/appearance/ai-features | "they're reported on in the Performance report, within the "Web" search type." | 2025-12-10 | ESTABLISHED |
| **Separate Generative AI report: exists** | https://support.google.com/webmasters/answer/16984139 | "Note: As of August 31, 2026, we’ve rolled out these insights to all websites worldwide." | not shown | ESTABLISHED (new in 2026) |
| What the report covers | same | "The generative AI performance report includes impressions for the following generative AI capabilities on Google Search: AI Overviews / AI Mode" | not shown | ESTABLISHED |
| Metric shown | same | "The chart displays total impressions for your property over the selected time period." Dimensions: Pages, Countries, Dates, Devices. Filters: Web text-based or multimodal. | not shown | ESTABLISHED |
| Overlap with main report | same | "The generative AI performance report includes data from the Web search type in the Performance report (Search results)." | not shown | ESTABLISHED |
| Launch post | https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports | "dedicated views of your impressions within generative AI features on Search, such as AI Overviews and AI Mode" (posted Wednesday, June 3, 2026) | June 3, 2026 | ESTABLISHED |
| Clicks and position in the GenAI report | same | The help page and blog describe **impressions only**. The blog says "such as adding additional metrics over time." There is no documented clicks, CTR or position metric. | — | Absence documented. Treat clicks and position as **UNDOCUMENTED** for this report. |
| Report not visible | https://support.google.com/webmasters/answer/16984139 | "This usually happens when your site hasn't received enough impressions in generative AI features on Google Search." | not shown | ESTABLISHED |

Note: help answer 6155685 now redirects to 7576553. The old Performance help is split into six pages: 7576553, 17010961, 17011259, 17011165, 17011364 and 17010575.

## 2. Title links and snippets

| Topic | URL | Verbatim quote | Date | Label |
|---|---|---|---|---|
| Titles generated automatically | https://developers.google.com/search/docs/appearance/title-link | "[title link generation] is completely automated and takes into account both the content of a page and references to it that appear on the web" | 2025-12-10 | ESTABLISHED |
| Title sources | same | Google lists `<title>`, main visual title, `<h1>`, og:title, prominent text, page text, anchor text, inbound link text and WebSite structured data. | 2025-12-10 | ESTABLISHED |
| Keyword stuffing | same | "Title text like "Foobar, foo bar, foobars, foo bars" doesn't help the user, and this kind of keyword stuffing can make your results look spammy" | 2025-12-10 | ESTABLISHED |
| Boilerplate | same | "Long text in the <title> element that varies by only a single piece of information ("boilerplate" titles) is also bad" | 2025-12-10 | ESTABLISHED |
| Branding | same | "consider including just your site name at the beginning or end of each <title> element, separated from the rest of the text with a delimiter" | 2025-12-10 | ESTABLISHED |
| Language match | same | "If Google determines that a <title> element does not match the writing system or language of the page's primary content, we may choose a different text" | 2025-12-10 | ESTABLISHED |
| Recrawl time | same | "Google has to recrawl and reprocess the page to notice updates to these sources, which may take a few days to a few weeks." | 2025-12-10 | ESTABLISHED |
| Snippets come from the page | https://developers.google.com/search/docs/appearance/snippet | "Google primarily uses the content on the page to automatically determine the appropriate snippet." | 2026-04-20 | ESTABLISHED |
| Snippets vary by query | same | "Google Search might show different snippets for different searches." | 2026-04-20 | ESTABLISHED |
| Unique descriptions | same | "Identical or similar descriptions on every page of a site aren't helpful when individual pages appear in search results." | 2026-04-20 | ESTABLISHED |
| Keyword-list descriptions | same | "meta descriptions comprised of long strings of keywords ... are less likely to be displayed as a snippet." | 2026-04-20 | ESTABLISHED |
| Length | same | "There's no limit on how long a meta description can be, but the snippet is truncated in Google Search results as needed" | 2026-04-20 | ESTABLISHED |

## 3. Canonicalization, redirects, URL Inspection, sitemaps, recrawl

| Topic | URL | Verbatim quote | Date | Label |
|---|---|---|---|---|
| 301 vs 308 | https://developers.google.com/search/docs/crawling-indexing/301-redirects | "The 301 and 308 status codes mean that a page has permanently moved to a new location." Both are listed as "Permanent". | **2026-11-16** | ESTABLISHED |
| How permanent redirects are treated | same | "Googlebot follows the redirect, and the indexing pipeline uses the redirect as a signal that the redirect target should be canonical." | 2026-11-16 | ESTABLISHED |
| Temporary redirects | same | "the indexing pipeline doesn't use the redirect as a signal that the redirect target should be canonical." (302, 303, 307) | 2026-11-16 | ESTABLISHED |
| HTTPS preference | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls | "Google prefers HTTPS pages over equivalent HTTP pages as canonical, except when there are issues or conflicting signals" | 2026-07-10 | ESTABLISHED |
| Mistakes to avoid | same | "Avoid bad TLS/SSL certificates and HTTPS-to-HTTP redirects because they cause Google to prefer HTTP very strongly." | 2026-07-10 | ESTABLISHED |
| Signal strength | same | "Redirects: A strong signal..." / "rel="canonical" link annotations: A strong signal..." / "Sitemap inclusion: A weak signal" | 2026-07-10 | ESTABLISHED |
| Time for old URLs to drop | https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes | "a small to medium-sized website can take a few weeks for most pages to move, and larger sites take longer." | 2026-08-20 | ESTABLISHED |
| How long to keep redirects | same | "Keep the redirects for as long as possible, generally at least 1 year." | 2026-08-20 | ESTABLISHED |
| HTTP to HTTPS counts as a move | same | The page lists "URL changes from HTTP to HTTPS." as a URL-change move. | 2026-08-20 | ESTABLISHED |
| Indexed vs live test | https://support.google.com/webmasters/answer/9012289 | "This is not a live test. The results shown are from most recently indexed version of a page, not the live version on the web." | not shown | ESTABLISHED |
| Canonical only from indexed data | same | "the live test cannot predict whether or not the tested version will be considered canonical." | not shown | ESTABLISHED |
| On Google does not mean ranking | same | ""URL is on Google" doesn't guarantee that your page is appearing in Search results." | not shown | ESTABLISHED |
| Inspection quota | same | "There is a daily limit of inspection requests for each property that you own." Also: "There is a per-property daily limit of live inspections." | not shown | ESTABLISHED |
| Many URLs | same | "To request indexing of many new or updated pages, your best choice is to submit a sitemap, with the updated pages marked by <lastmod>." | not shown | ESTABLISHED |
| A sitemap is not a guarantee | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview | "...it doesn't guarantee that all the items in your sitemap will be crawled and indexed." | 2025-12-10 | ESTABLISHED |
| Request-indexing quota | https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl | "there's a quota for submitting individual URLs and requesting a recrawl multiple times for the same URL won't get it crawled any faster." | 2025-12-10 | ESTABLISHED |
| Crawl timing | same | "Crawling can take anywhere from a few days to a few weeks." | 2025-12-10 | ESTABLISHED |

The exact request-indexing quota number is not published on these pages. Do not state a number.

## 4. Local ranking (GBP help, "Tips to improve your local ranking on Google")

URL: https://support.google.com/business/answer/7091 (date not shown). Label: ESTABLISHED.

- "Local results are mainly based on relevance, distance, and popularity. Together, these factors help Google find the best match for customers’ searches."
  - **Wording note:** the intro says "popularity", but the third subheading is "**Prominence**". Checked in the raw HTML.
- "Relevance is how well a Business Profile matches what someone is searching for."
- "Distance refers to how far each business is from the customer who’s searching."
- "Prominence means how well-known a business is." / "This factor’s also based on info like how many websites link to your business and how many reviews you have."
- "There's no way to request or pay for a better local ranking on Google."
- "Businesses with complete and accurate info are more likely to show up in local search results."
- Category page https://support.google.com/business/answer/7249669: "The categories you select affect your local ranking on Google."

## 5. Google Business Profile guidelines and metrics

Main URL: https://support.google.com/business/answer/3038177 (date not shown). Label for everything in this section: ESTABLISHED.

**Business name**
- "Your name should reflect your business’s real-world name, as used consistently on your storefront, website, stationery, and as known to customers."
- "Including unnecessary information in your business name isn't permitted, and could result in the suspension of your Business Profile."
- Disallowed: marketing taglines, store codes, ®/™, all caps, hours, phone or URL, special characters or legal terms (unless shown on real-world signage), "Service or product information", "Location information", "Containment information", "Repeated Bilingual Names / Script Transliterations".

**Categories**
- "Do not use categories solely as keywords or to describe attributes of your business."
- "Select categories that complete the statement: "This business IS a" rather than "this business HAS a.""
- "Use as few categories as possible to describe your overall core business from the provided list."
- From 7249669: "Restaurants: Can add links for online orders, reservations, and menus. They can also add menu items directly."

**Menu link and menu URL**
- "Menu URLs can’t be direct links to third-party ordering or delivery services."
- "Sample menus that only list “popular items” (or similar excerpts) should not be submitted."
- "The menu should be representative of the items and services that are available for customers at the business."
- From https://support.google.com/business/answer/6218037: "You can add a single link that helps customers: Check a menu." Also: "Local business links are not available via the Business Profile API or spreadsheet upload."

**Website URL**
- "provide a website that represents your individual business location."
- "Do not provide phone numbers or URLs that redirect or "refer" users to landing pages or phone numbers other than those of the actual business"

**Business description**
- Must not "Focus on special promotions, prices, and offer sales". Google's own disallowed example: "Best bagels in town for $5!"
- "Display links. No links of any type are allowed."

**Hours**
- "Restaurants: Use the hours when diners can sit down and dine in your restaurant. Otherwise, use takeout hours."
- "You may also specify special hours for particular days, like holidays or special events."
- Special hours, https://support.google.com/business/answer/6303076: "You can set special hours if your business temporarily adjusts its hours of operation or remains closed for up to 6 days in a row."
- Same page: "It's a good idea to confirm your hours for official holidays, even if they’re the same as your regular hours."
- Restaurant setup guide, https://support.google.com/business/answer/14189260: "For specific services your business offers such as delivery, takeout, drive through and pickup, set more hours."

**Performance metrics** (https://support.google.com/business/answer/9918094)
- "Performance data is available only for verified Business Profiles."
- "Performance data includes views, searches, and actions from both organic search results and Google Ads."
- Metrics: Interactions, Searches, Views, Directions, Calls, Website clicks, Messages, Bookings, Booking clicks (hotels only), Products, Menus, Offers. "Only metrics that apply to your business appear."
- "Calls: The number of times a customer clicked on the call button on your Business Profile."
- "Website clicks: The number of times people clicked on the website link on your Business Profile."
- "Directions: How many people asked for directions to your business."
- "Menus: The number of times people clicked on the menu content per user, per day. It includes menu photos, menu links, and structured menu data"
- "The searches metric is updated at the start of each month. It might take up to 5 days to show up."
- "Views" counts unique visitors: "A person can only be counted once a day."

## 6. Structured data

**LocalBusiness / Restaurant.** URL: https://developers.google.com/search/docs/appearance/structured-data/local-business (2026-09-08). Label: ESTABLISHED.
- "Use the most specific LocalBusiness sub-type possible; for example, Restaurant, DaySpa, HealthClub, and so on."
- **Required:** `address` (PostalAddress) and `name`.
- **Recommended (Google-supported):**
  - `aggregateRating` and `review` ("only recommended for sites that capture reviews about other local businesses")
  - `department`
  - `geo` ("The precision must be at least 5 decimal places.")
  - `menu`: "For food establishments, the fully-qualified URL of the menu."
  - `openingHoursSpecification` (opens, closes, dayOfWeek, validFrom, validThrough)
  - `priceRange`: "This field must be shorter than 100 characters."
  - `servesCuisine`: "The type of cuisine the restaurant serves."
  - `telephone`: "Be sure to include the country code and area code"
  - `url`: "The fully-qualified URL of the specific business location. The URL must be a working link."
- **`acceptsReservations` and `hasMenu` do not appear anywhere on Google's page** (0 matches each). They are valid schema.org properties, but no Google feature uses them. Label: **UNDOCUMENTED** for Google. They are harmless, but claim no benefit.
- "Restaurant carousel is currently limited to a small set of restaurant providers."
- The AI features page lists among best practices: "Making sure your structured data matches the visible text on the page".

**Review snippets and self-serving reviews.** URL: https://developers.google.com/search/docs/appearance/structured-data/review-snippet (2026-09-08). Label: ESTABLISHED.
- "If the entity that's being reviewed controls the reviews about itself, their pages ... are ineligible for star review feature." This applies to pages using LocalBusiness or any other Organization type.
- This includes reviews shown "...either directly in their structured data or through an embedded third-party widget (for example, Google Business reviews or Facebook reviews widget)."
- "Don't aggregate reviews or ratings from other websites."
- "Don't include fake or undisclosed incentivized reviews". This guideline was added 2026-07-24 according to the updates log.

**FAQ rich results.** URL: https://developers.google.com/search/updates (2026-11-12). The old FAQPage doc URL now redirects to `#removing-faq-rich-result`. Label: ESTABLISHED (the feature is removed).
- June 15, 2026: "The FAQ rich result feature is no longer shown in Google Search results, as announced in the changelog entry in May 2026."
- May 8, 2026: "This feature will no longer appear in Google Search starting May 7, 2026."

## 7. AI features (AI Overviews, AI Mode), llms.txt and Google-Extended

| Topic | URL | Verbatim quote | Date | Label |
|---|---|---|---|---|
| Nothing extra needed | https://developers.google.com/search/docs/appearance/ai-features | "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary." | 2025-12-10 | ESTABLISHED |
| Eligibility | same | "a page must be indexed and eligible to be shown in Google Search with a snippet" | 2025-12-10 | ESTABLISHED |
| No special files or markup | same | "You don't need to create new machine readable files, AI text files, or markup to appear in these features." | 2025-12-10 | ESTABLISHED |
| Snippet controls apply | same | "To limit the information shown from your pages in Search, use nosnippet, data-nosnippet, max-snippet, or noindex controls." | 2025-12-10 | ESTABLISHED |
| Keep GBP current | same | "Checking that your Merchant Center and Business Profile information is up-to-date" | 2025-12-10 | ESTABLISHED |
| llms.txt | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide | "Doing so will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them." (added 2026-06-15) | 2026-07-10 | ESTABLISHED (Google ignores it). Any benefit elsewhere is **UNDOCUMENTED**. |
| Structured data and AI | same | "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add." | 2026-07-10 | ESTABLISHED |
| Local businesses | same | "...Google Business Profiles can help your products and services to be visible in both AI responses and other Google Search results." | 2026-07-10 | ESTABLISHED |
| Mentions | same | "seeking inauthentic "mentions" across the web isn't as helpful as it might seem." | 2026-07-10 | ESTABLISHED |
| Google-Extended scope | https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers (moved from /search/docs/crawling-indexing/google-common-crawlers) | Covers training of Gemini models "and for grounding ... in Gemini Apps and Grounding with Google Search on Vertex AI." | 2026-10-30 | ESTABLISHED |
| Google-Extended and Search | same | "Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search." | 2026-10-30 | ESTABLISHED |
| **The actual AI Overviews / AI Mode opt-out** | https://support.google.com/webmasters/answer/16908024 | Search generative AI control. Option: "Exclude my site's links and content from Search generative AI features" means "You won't receive any traffic or impressions from these features." Rolled out to all sites August 31, 2026. | not shown | ESTABLISHED (new) |
| Control and ranking | same | "this control isn't used as a ranking or inclusion signal affecting other parts of Search." | not shown | ESTABLISHED |
| Control vs Google-Extended | same | "This control doesn't affect AI training; to limit training of the models used to generate responses in Search generative AI features, use Google-Extended." | not shown | ESTABLISHED |
| AIPREF | common-crawlers page | "Google intends to support the AIPREF shared machine-readable training preference signal ... in early 2027." | 2026-10-30 | **EXPERIMENTAL** |

Reading these together: Google-Extended controls training and Gemini Apps / Vertex grounding. It does not control appearing in AI Overviews or AI Mode. The Search Console control does that. The AI features page (2025-12-10) predates that control and still calls Googlebot robots.txt "the control". The Search Console help page is newer.

## 8. AI crawlers (vendor documentation)

| Bot | URL | Verbatim quote | Date | Purpose | Label |
|---|---|---|---|---|---|
| OAI-SearchBot | https://developers.openai.com/api/docs/bots (redirect from platform.openai.com/docs/bots) | "OAI-SearchBot is for search." / "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links." | not shown | Search | ESTABLISHED (vendor-documented) |
| GPTBot | same | "Disallowing GPTBot indicates a site’s content should not be used in training generative AI foundation models." | not shown | Training | ESTABLISHED (vendor) |
| ChatGPT-User | same | "Because these actions are initiated by a user, robots.txt rules may not apply. ChatGPT-User is not used to determine whether content may appear in Search." | not shown | User-triggered fetch | ESTABLISHED (vendor) |
| (all OpenAI bots) | same | "Each setting is independent of the others" / "it can take ~24 hours from a site’s robots.txt update" | not shown | — | ESTABLISHED (vendor) |
| ClaudeBot | https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler | "When a site restricts ClaudeBot access, it signals that the site's future materials should be excluded from our AI model training datasets." | metadata lastUpdatedDate 2026-11-04 | Training | ESTABLISHED (vendor) |
| Claude-SearchBot | same | "Disabling Claude-SearchBot on your site prevents our system from indexing your content for search optimization, which may reduce your site's visibility" | 2026-11-04 | Search | ESTABLISHED (vendor) |
| Claude-User | same | "Disabling Claude-User on your site prevents our system from retrieving your content in response to a user query" | 2026-11-04 | User-triggered fetch | ESTABLISHED (vendor) |
| Anthropic AI-training preference signal | same | "As of October 30, 2026, Anthropic has begun recognizing a machine-readable signal ..." It is based on the IETF aipref draft, "rolling this out ... over time". | 2026-11-04 | — | **EXPERIMENTAL** |
| PerplexityBot | https://docs.perplexity.ai/docs/resources/perplexity-crawlers (redirect from /guides/bots) | "PerplexityBot is designed to surface and link websites in search results on Perplexity. It is not used to crawl content for AI foundation models." | dateModified 2026-11-12 | Search | ESTABLISHED (vendor) |
| Perplexity-User | same | "It is not used for web crawling or to collect content for training AI foundation models." / "Since a user requested the fetch, this fetcher generally ignores robots.txt rules." | 2026-11-12 | User-triggered fetch | ESTABLISHED (vendor) |

For a robots.txt plan: allowing OAI-SearchBot, Claude-SearchBot and PerplexityBot keeps the site eligible for those AI search products. GPTBot, ClaudeBot and Google-Extended are the training controls. User-triggered fetchers may ignore robots.txt.

## 9. Bing

| Topic | URL | Verbatim quote | Date | Label |
|---|---|---|---|---|
| IndexNow recommended | https://www.bing.com/webmasters/help/URL-Submission-62f2860b (page is JS-rendered; text read from its own content endpoint https://www.bing.com/webmasters/api/help/htmlcontent?ArticleId=62f2860b) | "Bing recommends using IndexNow for faster, automated URL submission across participating search engines." | not shown | ESTABLISHED |
| Manual quota | same | "Submit up to 10,000 URLs per domain per day." / "Quota resets daily at midnight UTC." | not shown | ESTABLISHED |
| No speed-up from repeats | same | "Repeated manual submissions do not accelerate indexing." | not shown | ESTABLISHED |
| Not a guarantee | same | "Bing may choose not to index specific URLs if they do not meet its selection criteria." | not shown | ESTABLISHED |
| API future | same | "This API may be deprecated in the future as Microsoft transitions toward broader IndexNow adoption." | not shown | ESTABLISHED |
| Sitemaps | same | "Sitemaps are typically read once per day and help Bing discover new or updated content" | not shown | ESTABLISHED |
| IndexNow setup | https://www.bing.com/indexnow/getstarted | "An API key is needed to match the ownership of the domain with submitted URLs." / "Host your UTF-8 key file in either the root of your website or other location within your host" | not shown | ESTABLISHED |
| IndexNow is not a guarantee; Google is not a participant | https://www.indexnow.org/faq (protocol site linked from bing.com/indexnow; not on the strict primary list) | "Submitting a URL does not guarantee immediate indexing." The participating endpoints listed are Amazon, Bing, Naver, Seznam.cz, Yandex and Yep. Google is not listed. | not shown | ESTABLISHED for Bing. Any Google IndexNow use is **UNDOCUMENTED**. |
| Bing Places import from GBP | https://www.bing.com/forbusiness/help/syncGoogleBusinessProfile (JS page, rendered with headless Chromium) | "If your business is already verified in Google Business Profile, Bing automatically verifies the imported listing." / "...the standard publishing process, which typically takes 7-12 days." | not shown | ESTABLISHED |
| Sync caveats | same | "Syncing may create duplicate listings, especially if a listing already exists on Bing." / "Some fields and attributes may not sync exactly between platforms, including categories and Google UTM tags." | not shown | ESTABLISHED |
| Editing linked listings | same | "Direct editing isn't currently available in the Bing Places for Business dashboard for listings linked to a Google Business Profile." Sync options: weekly, biweekly or monthly. | not shown | ESTABLISHED |
| Bing blog | https://blogs.bing.com/search/2025/10/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research/ | "The new import flow is faster, more reliable, and better at preserving key attributes like business name, hours, and contact details." Bing Places is moving to www.bing.com/forbusiness. | Oct 3, 2025 | ESTABLISHED |

## Fetch problems

- https://int.bingplaces.com/Home/MoreFAQ: connection failed (HTTP 000). Not used.
- Bing help pages return an empty JS shell to plain fetchers. The text came from Bing's own content endpoint and from headless rendering, both on bing.com.
- Nothing in this file is filled in from memory.

## Implications for a restaurant site (derived only from the quotes above)

1. **No AI-only files or markup for Google.** Do not add llms.txt or "AI schema" expecting a Google benefit. Google ignores llms.txt, and AI Overviews and AI Mode only need an indexed, snippet-eligible page. Do not add nosnippet or tight max-snippet to pages that should appear in AI features.
2. **Titles and descriptions.** Write one distinct `<title>` per page, with the site name only at the start or end after a delimiter. No repeated keywords and no boilerplate. Meta descriptions should be page-specific summaries, not keyword lists. Expect Google to rewrite both.
3. **Redirects and canonicals.** Use server-side 301 or 308; Google treats them the same. Keep them at least a year. Redirect HTTP to HTTPS and never HTTPS to HTTP. Expect a few weeks before old URLs are replaced. Check the canonical in the indexed URL Inspection result, not the live test. Use a sitemap with `<lastmod>` instead of repeated Request Indexing, which is quota-limited and does not crawl faster.
4. **Schema.** Use `Restaurant` with `name` and `address`, plus `menu` (URL), `servesCuisine`, `openingHoursSpecification`, `telephone`, `url`, `geo` (at least 5 decimals) and `priceRange` (under 100 characters). Match the visible text. Google does not document `acceptsReservations` or `hasMenu`. Do not use AggregateRating or Review markup about the restaurant on its own site, including embedded GBP widgets. Do not expect FAQ rich results; the feature has been gone since 2026-05-07.
5. **GBP.** Use the real-world name only: no keywords, locality, taglines or repeated bilingual names. Pick categories that complete "IS a", not keywords. Link the full menu on the site, never a delivery or ordering URL directly. Use a website URL for this location. Set hours to dine-in hours and add special hours for holidays. No links or "best"-style promo in the description.
6. **Measurement.**
   - Search Console: average position is the topmost position. Property and page totals differ. Query rows exclude anonymized queries.
   - An AI Overview counts as one position. AI Mode follow-ups count as new queries.
   - The Generative AI report shows impressions only, so do not report AI clicks or positions from it.
   - GBP metrics are calls, website clicks, directions and menus. They include Ads activity and apply only to verified profiles.
7. **Crawlers.**
   - Allow OAI-SearchBot, Claude-SearchBot and PerplexityBot to keep AI search eligibility.
   - GPTBot, ClaudeBot and Google-Extended are training controls. Blocking Google-Extended does not affect Google Search.
   - To leave AI Overviews and AI Mode, use the Search Console Search generative AI control, not robots.txt for Google-Extended.
8. **Bing.**
   - Set up IndexNow with a key file at the root. Google does not participate in IndexNow, so keep the Google sitemap.
   - Fix data in GBP before syncing to Bing Places. Watch for duplicates and for categories that do not carry over. Linked listings can't be edited in Bing.
