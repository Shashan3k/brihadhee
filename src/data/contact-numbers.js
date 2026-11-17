/**
 * Phone numbers for code that Vercel bundles outside the Astro build (api/lead.js).
 *
 * Keep this file plain JavaScript and never import a .ts file from it.
 * Vercel's Node builder compiles each .ts dependency of a Function to .js but
 * leaves `.ts` import specifiers unchanged, so a Function that imports
 * entity-truth.ts cannot load (FUNCTION_INVOCATION_FAILED on every request).
 * That broke /api/lead from the 14 Nov 2026 release until this module existed.
 * scripts/check-functions.mjs fails the build if a Function imports a .ts file again.
 *
 * Single source: entity-truth.ts imports DINING_PHONE and toE164 from here, so
 * the dining number is typed once. The catering number stays in
 * config/client-verification.json; cateringPhone() applies the same rule as
 * cateringContacts() in entity-truth.ts, and scripts/lead.test.mjs keeps the two equal.
 */
import verification from "../../config/client-verification.json" with { type: "json" };

/** Restaurant number for every page (owner direction 2026-11-12). Also the WhatsApp number. */
export const DINING_PHONE = "+91 73587 14113";

/** Format a verified international phone number for links and structured data. */
export function toE164(phone) {
  return `+${phone.replace(/\D/g, "")}`;
}

/** Catering call number, or null when catering or its channel is not confirmed. */
export function cateringPhone() {
  const { offer_catering, enquiry_channels: channels } = verification;
  if (!offer_catering || !channels || typeof channels.is_different_from_restaurant !== "boolean") return null;
  return channels.phone || (channels.is_different_from_restaurant ? null : DINING_PHONE);
}
