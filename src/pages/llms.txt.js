/** /llms.txt: summary of confirmed facts and key URLs (see src/lib/llms.js). */
import { buildLlms } from "../lib/llms.js";

export function GET() {
  return new Response(buildLlms({ full: false }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
