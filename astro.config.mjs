import { defineConfig } from "astro/config";

// Static site. Every page is pre-rendered to HTML at build time.
export default defineConfig({
  site: "https://shashan3k.github.io",
  base: process.env.GITHUB_ACTIONS === "true" ? "/brihadhee" : "/",
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
});
