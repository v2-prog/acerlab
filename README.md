# AcerLab

Quiet Australian instruments for family, land and purpose structures.

**Canonical site:** [https://acerlab.link](https://acerlab.link)

General information only. Not tax, legal or financial advice. Confirm with a registered tax agent and solicitor. Rules include 2026–28 announced reforms that may change.

A charity or community land trust with an asset lock cannot be a substitute for a family discretionary trust.

`earthacer.in` stays parked at Hostinger. Do not point it at this project.

## Public URLs

| Role | URL |
| --- | --- |
| Canonical | https://acerlab.link |
| www (redirects to apex) | https://www.acerlab.link |
| GitHub (this brand repo) | https://github.com/v2-prog/acerlab |
| GitHub (Cloudflare source) | https://github.com/v2-prog/structure-lab |
| GitHub Pages backup | https://v2-prog.github.io/structure-lab/ |

## Identity

| Layer | Account |
| --- | --- |
| Cloudflare Registrar / Pages | Amarwakara@gmail.com (zone `acerlab.link`) |
| GitHub push account | [v2-prog](https://github.com/v2-prog) |
| GitHub collaborator | [AmarWak](https://github.com/AmarWak) |
| AmarWak copy of the older lab | https://github.com/AmarWak/v2-prog-structure-lab |

There is no GitHub organisation named `amarwakara`. Source ships from `v2-prog` until a repo is transferred to AmarWak. Cloudflare (Registrar + Pages) is the Amarwakara account.

## Cloudflare Pages

Use **v2-prog/structure-lab**, branch `main` (already documented as the Pages project for this domain).

1. Workers & Pages → project → **v2-prog/structure-lab**, production branch `main`.
2. **Framework preset:** None.
3. **Build command:** empty.
4. **Output directory:** `/` (repository root).
5. Custom domains → `acerlab.link` and `www.acerlab.link`.
6. The zone is already on Cloudflare Registrar, so SSL is automatic.

`_redirects` sends `www` to apex, maps legacy `/lab/*` onto Structure Lab AU (`/labs/02-structure`), and rewrites every other path to `index.html` (SPA).

To point Pages at **v2-prog/acerlab** instead, create a new Pages project (or change the Git source) with the same Framework None / output `/` settings. Do not attach `earthacer.in`.

## GitHub Pages backup

`.github/workflows/pages.yml` deploys the repository root. Enable Pages (Settings → Pages → GitHub Actions) if the backup URL 404s.

Deep links work because `404.html` is a copy of the app shell. A runtime `<base href>` prefixes `/structure-lab/` or `/acerlab/` on `*.github.io`.

## What this is

A static SPA. No accounts, no backend, no cookies. Review records stay in `localStorage` on the visitor's device (`acerlab.review.*`).
