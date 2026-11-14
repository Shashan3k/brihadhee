import { defineConfig } from "astro/config";
import { SITE_ORIGIN } from "./src/data/entity-truth.ts";

// Static site. Every page is pre-rendered to HTML at build time.
export default defineConfig({
  // Canonical production origin (custom domain on Vercel). GitHub Pages was turned
  // off on 2026-11-11, so every build (Vercel, CI, local) uses the root base path.
  site: SITE_ORIGIN,
  base: "/",
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
});
