// /plan/legacy is not a static room on this Pages project.
// Do not add plan/legacy.html — that twin 308-loops with the directory index.
// 308 to the existing plan-legacy room. Absolute Location avoids a self-redirect.
export function onRequest(context) {
  const url = new URL(context.request.url);
  url.pathname = "/plan-legacy";
  url.search = "";
  return new Response(null, {
    status: 308,
    headers: {
      Location: url.toString(),
      "Cache-Control": "no-store"
    }
  });
}
