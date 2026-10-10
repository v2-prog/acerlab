export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  url.pathname = '/plan-legacy';
  const assetReq = new Request(url.toString(), request);
  const asset = await env.ASSETS.fetch(assetReq);
  if (asset.status === 200) return asset;
  return new Response('<!DOCTYPE html><html><head><title>Legacy and succession — AcerLab</title></head><body><main><h1>Legacy and succession</h1></main><footer>General information only. Not personal financial, tax or legal advice. Review status: draft. Last reviewed 2026-10-04.</footer></body></html>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
