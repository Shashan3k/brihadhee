import { site } from "../data/site.js";
import { CONTENT_UPDATED } from "../data/entity-truth.ts";
import verification from "../../config/client-verification.json";

// Generated at build time. /catering is listed only once catering is confirmed.
export function GET() {
  // lastmod = date the content was last reviewed (matches WebPage.dateModified).
  const today = CONTENT_UPDATED;
  const urls = [
    { loc: `${site.url}/`, priority: "1.0" },
    { loc: `${site.url}/menu/`, priority: "0.9" },
    { loc: `${site.url}/about/`, priority: "0.8" },
    { loc: `${site.url}/book-a-table/`, priority: "0.8" },
    { loc: `${site.url}/best-dosa-parotta-anna-nagar/`, priority: "0.9" },
    { loc: `${site.url}/nellai-meals-south-indian-veg-anna-nagar/`, priority: "0.8" },
    ...(verification.offer_catering === true
      ? [
          { loc: `${site.url}/catering-services-chennai/`, priority: "0.9" },
          { loc: `${site.url}/event-planner-catering-partner/`, priority: "0.8" },
        ]
      : []),
  ];
  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
