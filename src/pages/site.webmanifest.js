/** Web app manifest, generated so icon paths follow the build's base path. */
import { getFact } from "../data/entity-truth.ts";

export function GET() {
  const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const manifest = {
    name: `${getFact("name")}, pure vegetarian restaurant, ${getFact("street")}`,
    short_name: getFact("name"),
    description: `${getFact("typeLong")} in Anna Nagar East, Chennai.`,
    start_url: base,
    scope: base,
    display: "standalone",
    background_color: "#FBF5E9",
    theme_color: "#FBF5E9",
    lang: "en-IN",
    icons: [
      { src: `${base}icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${base}icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${base}icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
