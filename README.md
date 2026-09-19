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
| Cloudflare preview (after first deploy) | https://acerlab.pages.dev |
| GitHub (Cloudflare source) | https://github.com/v2-prog/structure-lab |
| GitHub (brand repo, same files) | https://github.com/v2-prog/acerlab |
| GitHub Pages backup | https://v2-prog.github.io/structure-lab/ |

## Identity

| Layer | Account | Status |
| --- | --- | --- |
| Cloudflare Registrar / Pages | **Amarwakara@gmail.com** (zone `acerlab.link`) | This is the production host. |
| GitHub login `amarwakara` | [github.com/amarwakara](https://github.com/amarwakara) | **Unclaimed.** No user or organisation exists. GitHub cannot create that login from here. |
| GitHub push account (connected) | [v2-prog](https://github.com/v2-prog) | Ships this static export until the handle is claimed and the repos are transferred. |
| GitHub personal login | [AmarWak](https://github.com/AmarWak) | Admin invite pending on both repos. Accept at [github.com/v2-prog/structure-lab/invitations](https://github.com/v2-prog/structure-lab/invitations). |
| Older AmarWak copy | https://github.com/AmarWak/v2-prog-structure-lab | Left in place. Not the Cloudflare source. |

### Claim `github.com/amarwakara`

GitHub usernames are unique and can only be taken from a GitHub account screen — not from Cloudflare, and not from this repo.

1. Sign in as [AmarWak](https://github.com/AmarWak) **or** [v2-prog](https://github.com/v2-prog).
2. Settings → Account → **Change username** → `amarwakara`.
   - Or: New organisation → name `amarwakara` (free) → transfer these two repos into it.
3. After the handle exists, transfer **v2-prog/structure-lab** and **v2-prog/acerlab** onto it.
4. In Cloudflare Pages, reconnect Git if the repo owner changed.

Until then, Cloudflare Git should connect to **v2-prog/structure-lab** (AmarWak can do this once the admin invite is accepted).

## Cloudflare Pages (Amarwakara@gmail.com)

The GitHub repo is already the built site. Cloudflare must not run `npm`.

1. Log into Cloudflare as **Amarwakara@gmail.com**.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorise GitHub as **v2-prog** (or **AmarWak** after accepting the invite).
4. Select **v2-prog/structure-lab**, production branch `main`.
5. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Output directory:** `/`
6. Save and deploy. First URL: `https://acerlab.pages.dev`.
7. **Custom domains** → add `acerlab.link` and `www.acerlab.link`. Cloudflare will write the DNS records on this zone. SSL is automatic (Registrar + Pages on the same account).
8. Confirm `www` 301s to the apex. `_redirects` already does that.

Do not add `earthacer.in`. Do not add a `CNAME` file in this repo (that would steal the domain for GitHub Pages).

`wrangler.toml` names the project `acerlab` and sets `pages_build_output_dir = "."` so a later Wrangler deploy uses the repo root as the already-built output.

## GitHub Pages backup

`.github/workflows/pages.yml` deploys the repository root. Enable Pages (Settings → Pages → GitHub Actions) if the backup URL 404s.

Deep links work because `404.html` is a copy of the app shell. A runtime `<base href>` prefixes `/structure-lab/` or `/acerlab/` on `*.github.io`.

Note: [v2-prog.github.io](https://github.com/v2-prog/v2-prog.github.io) still has a leftover `earthacer.in` GitHub Pages domain, so `v2-prog.github.io/structure-lab/` currently 301s to the parked Hostinger zone. Do not change Hostinger. After `amarwakara` is claimed, the backup can live at `amarwakara.github.io` without touching `earthacer.in`.

## What this is

A static SPA. No accounts, no backend, no cookies. Review records stay in `localStorage` on the visitor's device (`acerlab.review.*`).
