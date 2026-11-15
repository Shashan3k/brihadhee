/** Local release QA. Pass an installed Puppeteer module file and Chrome executable.
 * Serves only dist on loopback, uses a fresh headless profile, never submits forms.
 * node verify-browser.mjs <puppeteer-module> <chrome-executable> [lighthouse-module]
 */
import { createServer } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "../../..");
const dist = resolve(root, "dist");
const results = { checkedAt: new Date().toISOString(), viewports: [], tests: [], consoleErrors: [] };
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
const server = createServer(async (request, response) => {
  try {
    let file = resolve(dist, `.${decodeURIComponent(new URL(request.url, "http://localhost").pathname)}`);
    if (file !== dist && !file.startsWith(dist + sep)) throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "text/plain" });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise((done) => server.listen(4331, "127.0.0.1", done));
const origin = "http://127.0.0.1:4331";
const { default: puppeteer } = await import(pathToFileURL(resolve(process.argv[2])).href);
let browser;
try {
  browser = await puppeteer.launch({ executablePath: process.argv[3], headless: true });
  const page = await browser.newPage();
  page.on("pageerror", (error) => results.consoleErrors.push(error.message));
  for (const width of [390, 768, 1440]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 1000, deviceScaleFactor: 1 });
    await page.goto(`${origin}/parotta-anna-nagar/`, { waitUntil: "networkidle0" });
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth, width: document.documentElement.scrollWidth,
      h1: document.querySelectorAll("h1").length,
      dishes: document.querySelectorAll("#parotta-menu .menu-page__item").length,
      canonical: document.querySelector('link[rel="canonical"]').href,
      images: [...document.images].map((image) => ({ loaded: image.complete && image.naturalWidth > 0, hasSize: image.hasAttribute("width") && image.hasAttribute("height"), alt: image.alt })),
      allControlsFit: [...document.querySelectorAll("main .btn")].every((button) => button.getBoundingClientRect().right <= window.innerWidth),
    }));
    assert.equal(layout.width, width, `Horizontal page overflow at ${width}px`);
    assert.equal(layout.h1, 1);
    assert.equal(layout.dishes, 7);
    assert.equal(layout.canonical, "https://www.brihadhee.com/parotta-anna-nagar/");
    assert.ok(layout.images.every((image) => image.loaded && image.hasSize));
    assert.ok(layout.allControlsFit);
    results.viewports.push({ width, ...layout });
    await page.screenshot({ path: resolve(import.meta.dirname, `parotta-${width}.png`), fullPage: true });
  }
  await page.setJavaScriptEnabled(false);
  await page.goto(`${origin}/`, { waitUntil: "networkidle0" });
  await Promise.all([page.waitForNavigation(), page.click('main a[href="/parotta-anna-nagar/"]')]);
  assert.ok(page.url().endsWith("/parotta-anna-nagar/"));
  const noJs = await page.$eval("main", (main) => main.textContent);
  assert.ok(noJs.includes("Special Pottalam Parotta") && noJs.includes("Where can I get veg kothu parotta"));
  await page.click("#faq details summary");
  assert.equal(await page.$eval("#faq details", (details) => details.open), true);
  results.tests.push("Home link, dish content and native FAQ work without JavaScript");
  await page.goto(`${origin}/menu/`, { waitUntil: "networkidle0" });
  await Promise.all([page.waitForNavigation(), page.click('#parotta a[href="/parotta-anna-nagar/"]')]);
  assert.ok(page.url().endsWith("/parotta-anna-nagar/"));
  results.tests.push("Visible menu section link reaches the parotta page");

  await page.setJavaScriptEnabled(true);
  await page.goto(`${origin}/`, { waitUntil: "networkidle0" });
  await page.click('.nav__links details:nth-of-type(2) summary');
  await Promise.all([page.waitForNavigation(), page.click('.nav__links a[href="/corporate-catering-chennai/"]')]);
  assert.ok(page.url().endsWith("/corporate-catering-chennai/"));
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 1000 });
    await page.goto("about:blank");
    await page.goto(`${origin}/corporate-catering-chennai/#catering-presentation`, { waitUntil: "networkidle0" });
    assert.equal(await page.$eval("[data-showcase-prev]", (button) => button.disabled), true);
    await page.click("[data-showcase-next]");
    await page.waitForFunction(() => document.querySelector("[data-showcase-count]").textContent === "2 / 4");
    await page.focus("[data-showcase-track]");
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("[data-showcase-count]").textContent === "3 / 4");
    await page.click("[data-showcase-prev]");
    await page.waitForFunction(() => document.querySelector("[data-showcase-count]").textContent === "2 / 4");
    assert.equal(await page.$eval("[data-showcase-track]", (track) => getComputedStyle(track).scrollBehavior), "auto");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    results.tests.push(`Corporate navigation, carousel buttons, keyboard and reduced motion at ${width}px`);
  }
  const baseline = JSON.parse(await readFile(resolve(import.meta.dirname, "baseline.json"), "utf8"));
  const hash = (data) => createHash("sha256").update(data).digest("hex");
  for (const [file, expected] of Object.entries(baseline.sourceHashes)) assert.equal(hash(await readFile(resolve(root, file))), expected, `Phase 1 changed: ${file}`);
  const corporateHtml = await readFile(resolve(dist, "corporate-catering-chennai/index.html"), "utf8");
  assert.equal(hash(corporateHtml.match(/<main.*?<\/main>/s)[0]), baseline.corporateMain);
  results.tests.push("Phase 1 source hashes and rendered corporate main content unchanged");
  for (const original of baseline.pages) {
    const html = await readFile(resolve(dist, `.${original.path}`, "index.html"), "utf8");
    assert.equal(html.match(/<title>(.*?)<\/title>/s)?.[1], original.title, `Existing title changed: ${original.path}`);
  }
  results.tests.push("All 18 existing page titles preserved");
  assert.deepEqual(results.consoleErrors, []);
  results.passed = true;
  if (process.argv[4]) {
    const { default: lighthouse } = await import(pathToFileURL(resolve(process.argv[4])).href);
    const lab = [];
    for (const route of ["/", "/menu/", "/parotta-anna-nagar/"]) {
      const { lhr } = await lighthouse(origin + route, {
        port: Number(new URL(browser.wsEndpoint()).port),
        logLevel: "error", onlyCategories: ["performance", "accessibility", "seo"],
      });
      lab.push({ route, fetchTime: lhr.fetchTime, version: lhr.lighthouseVersion,
        formFactor: lhr.configSettings.formFactor, throttling: lhr.configSettings.throttling,
        scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score * 100])),
        metrics: Object.fromEntries(["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time", "first-contentful-paint", "total-byte-weight"].map((key) => [key, lhr.audits[key]?.numericValue])),
        warnings: lhr.runWarnings,
        findings: Object.values(lhr.audits).filter((audit) => audit.score !== null && audit.score < 1).map(({ id, title, score, displayValue }) => ({ id, title, score, displayValue })),
      });
    }
    await writeFile(resolve(import.meta.dirname, "lighthouse-results.json"), JSON.stringify(lab, null, 2) + "\n");
    results.tests.push("Mobile Lighthouse audit completed for home, menu and parotta");
  }
} catch (error) {
  results.passed = false;
  results.error = error.stack;
  process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
  await writeFile(resolve(import.meta.dirname, "browser-results.json"), JSON.stringify(results, null, 2) + "\n");
  console.log(JSON.stringify(results, null, 2));
}
