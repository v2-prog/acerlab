export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = '/plan-legacy';
  // Force the rewrite so the pretty URL serves the flat room without a directory index or 308 loop.
  const rewritten = new Request(url.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: 'manual'
  });
  return context.env.ASSETS.fetch(rewritten);
}
