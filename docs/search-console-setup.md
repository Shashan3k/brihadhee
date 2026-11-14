# Search Console, Bing Webmaster Tools and IndexNow setup

For www.brihadhee.com. About 30 minutes. Needs access to the domain's DNS settings (where brihadhee.com was bought, or Vercel DNS if the domain uses Vercel nameservers).

## 1. Google Search Console (domain property)

1. Go to https://search.google.com/search-console and sign in with the Google account that owns the Business Profile.
2. **Add property → Domain** → type `brihadhee.com` (no https, no www). A domain property covers www, non-www, http and https together.
3. Google shows a TXT record like `google-site-verification=abc123…`. Copy it.
4. Add it as a **TXT record** on the root (`@`) of brihadhee.com in your DNS panel (Vercel: Project → Settings → Domains → brihadhee.com → DNS records, or your registrar).
5. Back in Search Console, click **Verify**. DNS can take a few minutes to an hour; retry if it fails.
6. **Users and permissions:** add the marketing lead as "Full" user. Keep the owner as "Owner".

## 2. Submit the sitemap

1. Search Console → **Sitemaps** → enter `sitemap-index.xml` → Submit.
2. Status should become "Success" within a day. It lists the indexable pages (drafts, noindex and privacy pages are left out on purpose).

## 3. Inspect the canonical URLs

Use the 17-URL inventory in the [implementation report](seo/implementation-report.md#release-candidate-route-inventory). Start with the homepage, `/menu/`, `/menu/dosa/`, `/menu/nellai-meals/`, and the catering and booking pages. Record the indexed and live results separately. Request indexing selectively for new or substantially changed canonical pages after checking their live eligibility. Inspect retired paths only to verify their redirects. [URL Inspection help](https://support.google.com/webmasters/answer/9012289)

## 4. Check these reports weekly

- **Performance → Search results:** filter queries containing "brihadhee" (brand), and track the 20 priority keywords from `docs/strategy/competitor-attack-plan.md` section 6.2.
- **Page indexing:** compare individual sitemap URLs with the indexed and excluded rows. Review "Crawled – currently not indexed" and duplicate classifications with URL-level evidence.
- **Enhancements / Rich results:** breadcrumbs and applicable structured-data errors. The site’s matching FAQ markup describes visible content. Google retired FAQ rich results. [Google Search updates](https://developers.google.com/search/updates#may-2026)
- **Links:** new referring sites (KPI: referring domains).
- **Search generative AI setting:** leave on "Include" so Brihadhee stays eligible for AI Overviews and AI Mode.

## 5. Old hosts

`vercel.json` has the project-host redirect correction. The 14 November release audit still received 200 from the public Vercel alias. Confirm the root and a subpage redirect after the candidate is deployed. GitHub Pages was retired. Record the current response if an old URL is still discovered. [Release checklist](seo/implementation-report.md#deployment-verification-checklist)

## 6. Bing Webmaster Tools (also feeds Copilot, DuckDuckGo and ChatGPT's Bing results)

1. Go to https://www.bing.com/webmasters and sign in.
2. Choose **Import from Google Search Console**. It copies the verified site and sitemap in one step.
3. If import is not possible: add `https://www.brihadhee.com`, verify with the DNS CNAME/TXT option, then submit `https://www.brihadhee.com/sitemap-index.xml` under Sitemaps.
4. Check **URL Inspection** for the home page.

## 7. IndexNow (instant pings to Bing, Yandex and others)

1. Generate a key at https://www.bing.com/indexnow/getstarted (or any 32-character string of letters and numbers).
2. Vercel → Project → Settings → Environment Variables → add `INDEXNOW_KEY` = your key (Production). Redeploy.
3. Check `https://www.brihadhee.com/<your-key>.txt` shows the key.
4. After each deploy with new or changed pages, from the project folder:
   ```bash
   INDEXNOW_KEY=<your-key> npm run indexnow
   ```
   or only the changed pages: `INDEXNOW_KEY=<your-key> npm run indexnow -- /menu/ /book-a-table/`
   To check first without sending anything: `INDEXNOW_KEY=<your-key> npm run indexnow -- --dry-run` prints the exact payload (every URL in `dist/sitemap.xml`).
5. Google does not use IndexNow. Use URL inspection in Search Console for Google.

## 8. Google Analytics 4

1. https://analytics.google.com → Admin → Create property "Brihadhee website" (India, INR, Asia/Kolkata) → Web stream for `https://www.brihadhee.com`.
2. Copy the Measurement ID (`G-…`) into Vercel as `PUBLIC_GA4_ID` and redeploy. The privacy page updates itself.
3. Admin → Events: verify `catering_quote_submit` and `restaurant_enquiry_submit` before marking the submission events as key events. Keep Call, WhatsApp and booking clicks as intent signals in reporting. [Measurement plan](seo/measurement-plan.md)
4. Link GA4 to Search Console (Admin → Product links → Search Console links).

The release candidate sends `book_table_view_click` for an internal booking-page link and `book_table_click` for a partner handoff. `catering_quote_submit` and `restaurant_enquiry_submit` record accepted submissions in their respective forms. See the measurement plan for proxy versus confirmed-outcome definitions and the cutover note.
