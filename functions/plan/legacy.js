/**
 * Cloudflare Pages Function: /plan/legacy → serve flat plan-legacy room.
 * Nested plan/legacy/index.html is not served by Pages; keep pretty URL via rewrite.
 */
export async function onRequest(context) {
  const target = new URL("/plan-legacy", context.request.url);
  return context.env.ASSETS.fetch(target.toString(), context.request);
}
