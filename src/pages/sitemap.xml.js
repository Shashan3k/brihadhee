import { site } from "../data/site.js";
import verification from "../../config/client-verification.json";

// Generated at build time. /catering is listed only once catering is confirmed.
export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${site.url}/`, priority: "1.0" },
    { loc: `${site.url}/menu/`, priority: "0.9" },
    ...(verification.offer_catering === true
      ? [{ loc: `${site.url}/catering/`, priority: "0.8" }]
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
