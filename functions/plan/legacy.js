// /plan/legacy — Pages 404s plan/legacy/index.html beside plan/index.html.
// Do not add plan/legacy.html; that twin 308-loops. Fetch the existing room.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = "/plan-legacy.html";
  const asset = await context.env.ASSETS.fetch(new Request(url.toString(), context.request));
  return new Response(asset.body, { status: asset.status, headers: asset.headers });
}
