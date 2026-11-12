/**
 * Contextual links inside copy. Text may contain [anchor text](/path/) and this
 * returns safe HTML: everything is escaped, and only site-relative links ("/..."
 * or "#...") become <a> elements, so copy can never inject markup or send
 * readers off-site. Used by ContentSection leads and the guides.
 */
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const LINK = /\[([^\]]+)\]\(((?:\/|#)[^)\s]*)\)/g;

export function linkify(text) {
  let out = "";
  let last = 0;
  for (const m of String(text).matchAll(LINK)) {
    out += escapeHtml(text.slice(last, m.index));
    out += `<a href="${escapeHtml(m[2])}">${escapeHtml(m[1])}</a>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(String(text).slice(last));
}

/** The same text with link markup removed (for meta tags, schema and word counts). */
export const plainText = (text) => String(text).replace(LINK, "$1");
