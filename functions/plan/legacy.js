/**
 * Cloudflare Pages Function: /plan/legacy → serve flat plan-legacy room.
 * Nested plan/legacy/index.html is not served by Pages; keep pretty URL via ASSETS rewrite.
 * Force redeploy 2026-10-18 so live acer-9wy.pages.dev and cocoblack.org pick up the rewrite.
 */
export async function onRequest(context) {
  const target = new URL("/plan-legacy", context.request.url);
  const assetResponse = await context.env.ASSETS.fetch(target.toString(), context.request);
  const response = new Response(assetResponse.body, assetResponse);
  response.headers.set("X-AcerLab-Rewrite", "plan-legacy-2026-10-18");
  response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return response;
}
