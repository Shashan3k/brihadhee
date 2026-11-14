# Brihadhee AEO Results

**Reporting date:** 14 November 2026

**Recorded result:** Google AI Overview recommended Brihadhee in Anna Nagar for the unbranded search **“where can I build my own dosa in Chennai”** on **12 November 2026**. The answer showed Instagram as its source and displayed an outdated restaurant number. The current restaurant number is **+91 73587 14113**. The official page for that query is [Build Your Own Dosa at Brihadhee](https://www.brihadhee.com/menu/dosa/). [Original AEO audit](docs/audits/2026-11-12/AEO-AUDIT.md#live-answer-engine-tests)

| Exact search query | Search surface | Date | Observed result |
|---|---|---|---|
| where can I build my own dosa in Chennai | Google AI Overview | 12 Nov 2026 | **Brihadhee recommended.** Instagram was the visible citation. The official website was uncited. |
| Tell me about Brihadhee restaurant in Anna Nagar Chennai. Is it worth visiting? | Google AI Mode | 9 Nov 2026 | **Brihadhee mentioned and brihadhee.com cited.** This was a branded query. The answer incorrectly said the restaurant was closed on Sundays. |
| Where can I build my own dosa in Chennai? | Google AI Mode | 9 Nov 2026 | The response omitted Brihadhee. |
| Where can I build my own dosa in Chennai? Please search the web and cite sources. | ChatGPT web search | 12 Nov 2026 | The response omitted Brihadhee. |
| Where can I build my own dosa in Chennai? | ChatGPT | Screenshot shared 14 Nov 2026 | **Brihadhee was absent from the three visible recommendations.** ChatGPT listed Dosa.in Sowcarpet, Live Dosa in Sholinganallur, and Dosa Delights in Nanganallur. |
| best pure veg restaurant in anna nagar | Google AI Overview | 9 Nov 2026 | The response omitted Brihadhee. |
| Recommend a pure veg corporate caterer in Chennai that can handle 1,000 people a day | Google AI Mode | 9 Nov 2026 | The response omitted Brihadhee. |

[9 November test log](docs/geo/visibility-log.csv) · [12 November AEO audit](docs/audits/2026-11-12/AEO-AUDIT.md#live-answer-engine-tests)

The ChatGPT screenshot shows the exact question without a request to search or cite sources. It cuts off below the three recommendations. The full answer, test location, search mode, and cited source URLs remain unverified. The visible answer treats choosing toppings and cooking the dosa yourself as separate intents. Brihadhee serves the first intent: diners choose their options and the kitchen cooks the dosa. [Official dosa page](https://www.brihadhee.com/menu/dosa/)

**Current status:** The November 12 result records one AI recommendation. A numbered Google organic or Maps position and a sustained AI appearance remain unverified. Google challenged the November 14 recheck before it displayed results. The **63/100** audit score and **85/100** remediation self-assessment measure website answer quality. [AEO remediation](docs/audits/2026-11-12/AEO-REMEDIATION.md)

## All-query coverage and implementation

Reviewed the 66-row AEO query set, the 93-row GEO panel, and sections 4.1–4.9 of the original keyword brief. The [coverage sheet](docs/seo/aeo-coverage.csv) records 259 distinct entries after collapsing capitalization and terminal question-mark variants. It retains historical panel IDs. Its dispositions concern Brihadhee’s content.

| Site disposition | Queries | Meaning |
|---|---:|---|
| Answered | 150 | An existing page provides a relevant answer or publishes the specific Brihadhee facts an answer can cite. |
| Track only | 37 | Measure real discovery, subjective comparisons, or recommendations using engine evidence. The mapped page provides relevant facts where available. |
| Location dependent | 9 | Use local time and actual search location when testing. |
| Owner confirmation | 14 | Examples include parking, delivery, group capacity, exact lead times and catering staffing. Use the verified contact while these details are pending. |
| Approval gated | 49 | The brief includes dietary, ingredient, preparation, catering-purity, or language claims that cannot be published without the required evidence. The existing gates remain active. |

The release candidate now leads with **Brihadhee in Anna Nagar East, Chennai** and the ordering choices in the first paragraph of the dosa page. The menu locates filter coffee near Anna Nagar Tower Park and adds Tamil answers for filter coffee and parotta using current menu data. It links to the existing dinner section for both parotta dishes. The corporate FAQ answers who Brihadhee has catered for with approved examples. The visible FAQs and structured data come from the same source.

The build, eight verification groups, typecheck and all 12 lead tests passed. All 211 populated target links in the coverage sheet resolved to generated pages and anchors. The three revised pages were readable without JavaScript at 360, 390 and 1440 pixels.

### Public checks on 14 November, around 4:48 PM IST

All 17 sitemap pages returned 200, had a www self-canonical and one H1, had parseable JSON-LD, and had no noindex directive. The public robots file allowed Googlebot, Bingbot and OAI-SearchBot. Requests to the dosa page with each of those user-agent strings returned 200. The site checks establish technical accessibility from the test environment. Crawler fetch history and Google’s index status require their own evidence.

| Surface | Exact dosa question | Outcome |
|---|---|---|
| Google AI Overview | Submitted in a fresh signed-out browser with India settings | Google showed an unusual-traffic challenge. |
| Google AI Mode | Submitted in a separate fresh signed-out session | Google showed the same challenge. |
| ChatGPT Search | Opened a fresh signed-out session to run it | HTTP 403 before prompt entry. |
| Perplexity | Opened the public search URL with the question | HTTP 403. |
| Gemini Flash-Lite | Completed a signed-out answer with a web-search indicator | Brihadhee was absent from the recommendations. No official-site link was visible in the captured answer. |

Chennai as the actual search location was unverified. The nine core prompts were also submitted in separate signed-out Gemini Flash-Lite sessions. Six answers completed, five with a visible search indicator. One of those five mentioned Brihadhee. None displayed a verifiable official-site URL in the captured answer. Three prompts produced no completed answer in the session. These are observations from one pass.

| Panel ID | Gemini result |
|---|---|
| 65 · Build your own dosa | Search indicated. Brihadhee omitted. |
| 86 · What makes Brihadhee different | No completed answer. |
| 87 · What are Nellai meals | Search indicated. General Tirunelveli meal explanation. |
| 88 · Vegetarian catering in Anna Nagar | Search indicated. Brihadhee omitted from the recommendations. |
| 89 · Does Brihadhee cater for 50 guests | Search indicated. **Brihadhee mentioned**, with the correct 50–1,500 single-event range. The answer also used “100% pure vegetarian catering,” which exceeds the approved scope. No source URL for that claim was captured. |
| 90 · How does corporate catering work | No completed answer. |
| 91 · How can I request a catering quote | General answer, web use unverified. |
| 92 · Where is Brihadhee located | No completed answer. |
| 93 · How can I book a table | Search indicated. General booking advice. |

The other queries retain their historical results where recorded. Their current engine results remain unverified. The District listing includes a customer review that describes customized dosa and an older tiffin reference. Keep the customer posts intact and verify the owner-managed description, phone and menu. [District listing](https://www.district.in/dining/chennai/brihadhee-anna-nagar-east)

### Post-deployment check on 14 November, around 5:13 PM IST

The approved release `e5c31ca` passed GitHub checks and Vercel deployment. The updated copy was verified in production HTML for the dosa, menu, corporate catering, event catering and event planner pages. In two fresh signed-out Gemini Flash-Lite sessions with a visible search indicator, Brihadhee was again absent for the dosa query and present for the 50-guest query. Gemini repeated the unapproved catering-wide purity claim. Neither captured answer showed an official-site URL. The retest verifies what the engine returned at that time. It does not establish that Gemini fetched the updated pages. [GitHub checks](https://github.com/Shashan3k/brihadhee/actions/runs/43591279430) · [Vercel deployment](https://vercel.com/shashank33ks-4461s-projects/brihadhee/2mGespJRzkVtHfEHz7xy4pCeRFPj)

**Owner listing action:** Check Instagram’s Bio, Contact field, link in bio, and owner-created Highlights or pinned posts for the retired restaurant number. Use **+91 73587 14113** for dining. In Google Business Profile, verify Contact, the website and current menu links, and all seven days of dining hours. Where the platform supports it, describe the offer as “Build your own dosa at Brihadhee in Anna Nagar East, Chennai. Choose your batter, podi and toppings, filling, and roast. Our kitchen cooks it to order.” Link to the official dosa page from a relevant post or menu reference. [Platform checklist](docs/seo/local-seo-owner-action-plan.md)

**Next check:** Inspect the five updated canonicals in Search Console. Start with the dosa and event catering pages, log Google’s selected canonical and last crawl, and request indexing once for materially revised pages if needed. Repeat the exact query from Chennai in Google AI Overview and in a fresh ChatGPT session. Capture the full responses, whether each names Brihadhee, any official-site citation, and any phone number shown. Run an explicit ChatGPT web-search prompt separately. [Repeatable test checklist](docs/seo/ai-answer-testing.md)
