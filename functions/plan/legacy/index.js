/**
 * Cloudflare Pages Function: /plan/legacy/ → serve flat plan-legacy room.
 * Nested plan/legacy/index.html is not served by Pages; keep pretty URL via ASSETS rewrite.
 * Updated 2026-10-17 to force redeploy so live hosts serve the rewrite.
 */
export async function onRequest(context) {
  const target = new URL("/plan-legacy", context.request.url);
  const assetResponse = await context.env.ASSETS.fetch(target.toString(), context.request);
  const response = new Response(assetResponse.body, assetResponse);
  response.headers.set("X-AcerLab-Rewrite", "plan-legacy-2026-10-17");
  return response;
}
