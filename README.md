# AcerLab

Household money and legacy navigator — Australia only.

- **Live:** https://cocoblack.org/ and https://acer-9wy.pages.dev/
- **Source:** this repo, branch `main`
- **Cloudflare Pages project:** acer-9wy

## Rooms

Top-level rooms use directory indexes only (`/onboarding/`, `/plan/`, `/tools/`). Do **not** add matching flat `.html` twins or Cloudflare will 308-loop.

`/plan/legacy` and `/plan/legacy/` are served by a Pages Function (`functions/plan/legacy.js` and `functions/plan/legacy/index.js`) that `ASSETS.fetch`es the flat `/plan-legacy` room. `_redirects` provides a 200 rewrite fallback. Nested static indexes under `plan/` are not served by Pages.

## Draft notice

The line “General information only. Not personal financial, tax or legal advice. Review status: draft. Last reviewed 2026-10-04.” must appear **only** in the footer of each room.

## Deploy note

If `/plan/legacy` still 404s after a push, open the Cloudflare Pages dashboard for **acer-9wy** and run **Retry deployment** / **Redeploy**. Git auto-deploy has been unreliable for this project.

Force-redeploy trigger 2026-10-19T08:12Z — live hosts (cocoblack.org and acer-9wy.pages.dev) still return 404 for /plan/legacy until manual redeploy.
