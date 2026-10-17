# AcerLab

Household money and legacy notebook for Australia. Static files so Cloudflare Pages can publish with no build.

General information only. Not personal financial, tax or legal advice.

- Repo: https://github.com/v2-prog/acerlab
- Pages project: acer-9wy (also acerlab-project)
- Live: https://acer-9wy.pages.dev and https://cocoblack.org
- Structure Lab (land and trusts) stays on https://acerlab.link

## Cloudflare

Workers and Pages, Git source v2-prog/acerlab, branch main.
Framework preset: None. Build command empty. Output directory /.

`/plan/legacy` and `/plan/legacy/` are rewritten (200) to `/plan-legacy` (plan-legacy.html) via Pages Function (primary) and `_redirects` (fallback). Do not add plan/legacy.html or a plan/legacy/ directory index — nested indexes under plan/ are not served by Cloudflare Pages and cause 404s. No flat .html twins for onboarding, plan, or tools.

Last force redeploy: 2026-10-18.
