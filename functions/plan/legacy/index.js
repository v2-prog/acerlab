// /plan/legacy/ — same room as functions/plan/legacy.js. No flat plan/legacy.html twin.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = "/plan-legacy.html";
  const asset = await context.env.ASSETS.fetch(new Request(url.toString(), context.request));
  return new Response(asset.body, { status: asset.status, headers: asset.headers });
}
