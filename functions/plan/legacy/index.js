/**
 * Cloudflare Pages Function: /plan/legacy/ → serve flat plan-legacy room.
 * Nested plan/legacy/index.html is not served by Pages; keep pretty URL via ASSETS rewrite.
 * Force redeploy 2026-10-30T08:10Z AEDT — live hosts must return 200 for /plan/legacy/.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = new URL("/plan-legacy", url.origin);
  const assetResponse = await context.env.ASSETS.fetch(target.toString(), context.request);
  const headers = new Headers(assetResponse.headers);
  headers.set("X-AcerLab-Rewrite", "plan-legacy-2026-10-30-0810");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}
