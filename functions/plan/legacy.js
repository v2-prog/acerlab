/**
 * Cloudflare Pages Function: /plan/legacy → serve flat plan-legacy room.
 * Nested plan/legacy/index.html is not served by Pages; keep pretty URL via ASSETS rewrite.
 */
export async function onRequest(context) {
  const target = new URL("/plan-legacy", context.request.url);
  const response = await context.env.ASSETS.fetch(target.toString(), context.request);
  // Ensure no cache of the 404; return the asset response as-is.
  return response;
}
