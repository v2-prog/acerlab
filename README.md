# AcerLab Navigator

Financial literacy + cohabitation / eco-village navigator. Companion notebook to [Structure Lab AU](https://github.com/v2-prog/structure-lab).

**Australia only. General education, not advice.**

Canonical product family: Structure Lab AU · Earth Acer · Ever Earth Acre · workshop voice Doug’s Lab AU.

This repo (`v2-prog/acerlab`) now holds the Navigator rooms. Structure Lab AU (trusts, CGT flags, nineteen structures) stays in `v2-prog/structure-lab` and on https://acerlab.link until you switch the Cloudflare Git source.

## What this is

A static multi-room notebook. Not a store, not a blog, not a booking site. No accounts. No lead-capture. Calculators stay in the browser.

### Learn

1. Home — two-door decision screen  
2. Money literacy hub  
3. Budget studio  
4. Wage & tax structure (sketch only)  
5. Savings & investing  
6. Debt literacy  
7. Glossary  
8. Progress (this device only)

### Live

9. Shared living hub  
10. Legal structures (TIC + deed, strata, company title, co-op, CLT, association)  
11. Zoning pathway — drafts a council email, does not determine anything  
12. Building-code questions  
13. Shared money / levies  
14. Resource directory  
15. Checklists and sketch cases  
16. Treasurer desk — local pass-phrase, local extras, anonymised open-counts on this browser

## Prompt adjustments made while building

- Jurisdiction pack is Australia-only (ACT default), matching Structure Lab — not a generic multi-country zoning engine.
- No server-side member database. Progress and treasurer extras stay on-device.
- Wage module is labelled a sketch (marginal rates + Medicare levy only). Caps shown as FY2025–26 illustrations.
- Zoning output is a council-email draft, not a determination.
- Asset-lock warning is repeated: a CLT/charity is not a family discretionary trust.
- Admin engagement is anonymised page-open counts in this browser, not a group analytics product.
- Multi-page rooms (not a hash SPA) so Cloudflare Pages can serve each file with Framework: None.
- Brand tokens copied from Structure Lab AU (paper, forest green, Newsreader / IBM Plex).

## Cloudflare Pages

1. Workers & Pages → Create → Connect to Git → **v2-prog/acerlab**, branch `main`.
2. Framework preset: None. Build command: empty. Output directory: `/`.
3. Custom domain: attach `coeconomics.com` once that zone is on the same Cloudflare account (Amarwakara@gmail.com).
4. Do not attach `earthacer.in` (parked at Hostinger).

If https://acerlab.link should keep serving Structure Lab, leave that project pointed at `v2-prog/structure-lab` and give this project its own hostname (`navigator.acerlab.link` or `coeconomics.com`).

## Local

Open `index.html`, or:

```
python3 -m http.server 8080
```

## Files

- `index.html` and the room `*.html` files
- `app.css` — brand
- `data.js` — copy, caps, structures, directory
- `app.js` — nav, calculators, treasurer desk
- `_headers` / `_redirects` / `wrangler.toml` — Pages hints
