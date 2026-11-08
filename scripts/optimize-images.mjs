#!/usr/bin/env node
/**
 * Generates WebP versions of the site photos in public/images:
 *   <name>.webp        full width (same pixel size as the JPG)
 *   <name>-480.webp    480 px wide
 *   <name>-800.webp    800 px wide (only when the source is wider)
 * The JPGs stay for the Open Graph image and as the source of truth.
 * Re-run after replacing a photo:  node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DIR = resolve(import.meta.dirname, "..", "public", "images");
const WIDTHS = [480, 800];
const SKIP = new Set(["og-image.jpg"]);

for (const file of readdirSync(DIR)) {
  if (!/\.(jpe?g|png)$/i.test(file) || SKIP.has(file)) continue;
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const src = join(DIR, file);
  const { width } = await sharp(src).metadata();
  await sharp(src).webp({ quality: 78 }).toFile(join(DIR, `${base}.webp`));
  for (const w of WIDTHS) {
    if (w >= width) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 76 }).toFile(join(DIR, `${base}-${w}.webp`));
  }
  console.log(`${file} (${width}px) -> ${base}.webp + ${WIDTHS.filter((w) => w < width).map((w) => `${w}w`).join(", ")}`);
}
