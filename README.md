# AcerLab

Household money and legacy notebook for Australia. Static files so Cloudflare Pages can publish with no build.

**General information only. Not personal financial, tax or legal advice.**

Git: https://github.com/v2-prog/acerlab
Cloudflare Pages origin: https://acerlab.pages.dev
Structure Lab (land and trusts) stays in https://github.com/v2-prog/structure-lab and on https://acerlab.link until that project is switched.

## Cloudflare

1. Workers & Pages → the project named `acerlab` → Connect to Git → **v2-prog/acerlab**, branch `main`.
2. Framework preset: None. Build command: empty. Output directory: `/`.
3. `wrangler.toml` sets `pages_build_output_dir = "."`.

Clean paths such as `/plan/legacy` are rewritten in `_redirects`.

## What is encoded

- Audiences, philosophy and information architecture from the product brief
- Eight purpose buckets with editable ranges, not a hard-coded split
- Nine-stage journey, including legacy and the Australian estate / non-estate panel
- Advice-state classifier with hardship and discreet-mode rules
- Browser calculators (educational estimates)
- Support directory links to official home pages (verify before publish)
- On-device storage only. No accounts. No database.

A Next.js + Prisma build is the later licensed product. This repo is the Pages-ready information layer.
