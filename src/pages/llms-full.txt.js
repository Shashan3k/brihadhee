/** /llms-full.txt: the whole business in one file, full menu included (see src/lib/llms.js). */
import { buildLlms } from "../lib/llms.js";

export function GET() {
  return new Response(buildLlms({ full: true }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
