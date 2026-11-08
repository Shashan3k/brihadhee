import { site } from "../data/site.js";
import { CONTENT_UPDATED } from "../data/entity-truth.ts";

/**
 * /sitemap-index.xml points to the page sitemap. The page sitemap
 * (src/pages/sitemap.xml.js) lists only built, indexable pages: drafts,
 * noindex pages and gated pages are never in it. When Tamil twins exist,
 * add their hreflang alternates in sitemap.xml.js.
 */
export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${site.url}/sitemap.xml</loc>
    <lastmod>${CONTENT_UPDATED}</lastmod>
  </sitemap>
</sitemapindex>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
