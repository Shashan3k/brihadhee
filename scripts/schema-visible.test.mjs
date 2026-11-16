/**
 * Tests for scripts/schema-visible.mjs: each check must fail on a broken fixture,
 * and a correct page must pass. Runs with `npm test` (node --test).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseJsonLd, vocabularyProblems, restaurantVisibilityProblems, visibleText, clockForms } from "./schema-visible.mjs";

const restaurant = {
  "@type": "Restaurant",
  "@id": "https://www.example.com/#restaurant",
  name: "Brihadhee",
  url: "https://www.example.com/",
  telephone: "+917358714113",
  address: {
    "@type": "PostalAddress",
    streetAddress: "New No. W-41, W-Block, 3rd Avenue, Anna Nagar East",
    addressLocality: "Chennai",
    postalCode: "600040",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => `https://schema.org/${d}`),
      opens: "11:00",
      closes: "23:00",
    },
  ],
};
const VISIBLE =
  "<p>Brihadhee</p><address>New No. W-41, W-Block, 3rd Avenue<br>Anna Nagar East<br>Chennai, Tamil Nadu 600040</address>" +
  "<p>Call +91 73587 14113. Open daily, 11:00 AM to 11:00 PM.</p>";
const page = (nodes, body = VISIBLE) =>
  `<html><head><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": nodes })}</script></head><body>${body}</body></html>`;
const check = (html) => {
  const { nodes, problems } = parseJsonLd(html);
  return [...problems, ...vocabularyProblems(nodes), ...restaurantVisibilityProblems(nodes, visibleText(html))];
};

test("a correct Restaurant page passes", () => {
  assert.deepEqual(check(page([restaurant])), []);
});

test("JSON that does not parse fails", () => {
  const problems = check(`<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Restaurant",}</script>${VISIBLE}`);
  assert.ok(problems.some((p) => p.includes("does not parse")), problems.join("\n"));
});

test("unknown types and properties, and properties on the wrong type, fail", () => {
  const problems = check(page([restaurant, { "@type": "Resturant", name: "x" }, { "@type": "Article", headline: "x", servesCuisine: "Tamil", colour: "red" }]));
  assert.ok(problems.some((p) => p.includes('unknown schema.org type "Resturant"')), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("servesCuisine: not a property of Article")), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("colour: unknown schema.org property")), problems.join("\n"));
});

test("rating, review and award markup fail", () => {
  const problems = check(page([{ ...restaurant, award: "Best dosa", aggregateRating: { "@type": "AggregateRating", ratingValue: 4.2, reviewCount: 10 } }]));
  assert.ok(problems.some((p) => p.includes("AggregateRating markup is not allowed")), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("award: not allowed")), problems.join("\n"));
});

test("relative URLs fail", () => {
  const problems = check(page([{ ...restaurant, url: "/" }]));
  assert.ok(problems.some((p) => p.includes('"/" is not an absolute https URL')), problems.join("\n"));
});

test("a phone, street or hours that differ from the page fail", () => {
  const wrong = {
    ...restaurant,
    telephone: "+919566135405",
    address: { ...restaurant.address, streetAddress: "12 Second Avenue, Anna Nagar West" },
    openingHoursSpecification: [{ ...restaurant.openingHoursSpecification[0], opens: "06:30" }],
  };
  const problems = check(page([wrong]));
  assert.ok(problems.some((p) => p.includes("telephone +919566135405 is not visible")), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("streetAddress")), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("opening hours 06:30–23:00")), problems.join("\n"));
});

test("markup in scripts or templates does not count as visible", () => {
  const hidden = `<template><p>${VISIBLE}</p></template><script>var t = "+91 73587 14113 11 AM to 11 PM daily";</script><p>Brihadhee</p>`;
  const problems = check(page([restaurant], hidden));
  assert.ok(problems.some((p) => p.includes("telephone")), problems.join("\n"));
  assert.ok(problems.some((p) => p.includes("opening hours")), problems.join("\n"));
});

test("clock forms cover both visible styles", () => {
  assert.deepEqual(clockForms("11:00"), ["11 AM", "11:00 AM"]);
  assert.deepEqual(clockForms("23:00"), ["11 PM", "11:00 PM"]);
  assert.deepEqual(clockForms("12:30"), ["12:30 PM"]);
});

const built = join(resolve(import.meta.dirname, ".."), "dist", "index.html");
test("the built home page passes, and fails once its phone is changed", { skip: !existsSync(built) && "dist/ not built" }, () => {
  const html = readFileSync(built, "utf8");
  assert.deepEqual(check(html), []);
  const tampered = html.replace(/"telephone":"\+917358714113"/, '"telephone":"+919566135405"');
  assert.notEqual(tampered, html, "fixture: the Restaurant telephone was not found in dist/index.html");
  assert.ok(check(tampered).some((p) => p.includes("telephone +919566135405 is not visible")));
});
