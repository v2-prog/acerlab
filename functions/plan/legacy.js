// /plan/legacy — Pages Function. Do not add plan/legacy.html; that twin 308-loops.
// ASSETS.fetch must use the pretty path. /plan-legacy.html is not an asset URL and 404s.
const ROOM = `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Legacy and succession — AcerLab</title>
  <meta name="description" content="Roles, flags and questions. Estate and non-estate assets.">
  <meta name="theme-color" content="#2F5D4F">
  <link rel="canonical" href="https://acer-9wy.pages.dev/plan/legacy/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/app.css">
</head>
<body data-page="legacy">
  <a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <aside class="sidebar"><a class="brand" href="/"><strong>AcerLab</strong><span>Household money and legacy — Australia only</span></a><nav class="nav" data-nav></nav></aside>
    <div class="main">
      <header class="top">
        <button class="menu-btn" type="button" data-open-nav aria-label="Open menu">Menu</button>
        <div class="crumb"><span data-crumb></span><b>Legacy and succession</b></div>
        <span style="flex:1"></span>
        <button class="exit-btn" type="button" data-exit hidden>Leave</button>
      </header>
      <main class="content" id="main" tabindex="-1"></main>
      <footer class="footer">General information only. Not personal financial, tax or legal advice. Review status: draft. Last reviewed 2026-10-04.</footer>
    </div>
  </div>
  <div id="drawer" class="drawer"><div class="scrim" data-close-nav></div><div class="panel"><a class="brand" href="/"><strong>AcerLab</strong><span>Australia only</span></a><nav class="nav" data-nav></nav></div></div>
  <script src="/calc.js"></script>
  <script src="/content.js"></script>
  <script src="/app.js"></script>
</body>
</html>
`;

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    url.pathname = "/plan-legacy";
    url.search = "";
    const asset = await context.env.ASSETS.fetch(url.toString());
    if (asset && asset.status === 200) {
      const headers = new Headers(asset.headers);
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      return new Response(asset.body, { status: 200, headers });
    }
  } catch (e) {}
  return new Response(ROOM, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
