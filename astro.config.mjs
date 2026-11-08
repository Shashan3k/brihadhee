import { defineConfig } from "astro/config";

// Static site. Every page is pre-rendered to HTML at build time.
export default defineConfig({
  // Canonical production origin (custom domain on Vercel). The GitHub Pages
  // copy builds with base "/brihadhee" but still declares this origin as canonical.
  site: "https://www.brihadhee.com",
  base: process.env.GITHUB_ACTIONS === "true" ? "/brihadhee" : "/",
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
  compressHTML: true,
});
