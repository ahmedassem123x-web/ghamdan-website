# Client Input Register — Ghamdan (GTS) Website v2 (v15)

**Status:** DRAFT — Phase 5 (2026-11-15, Asia/Aden). **Owner:** coordinator / Ahmed.
**Rule (v15 §2.6, §3):** nothing listed here is invented. Until an item arrives,
the site keeps its honest empty state / stand-in labelling. No item on this
register blocks the build; items marked BLOCKER block only the feature named.

**Numbering note — open conflict:** the in-source strings and this brief call
real product photos **CI-06** (`src/data/pages.ts` productDetail k3 caption;
`docs/site-map.md` downloads row), while `docs/content-data-model.md` §8 and
`docs/visual-gap-analysis.md` D-4 call the same photos **CI-01**. This register
uses **CI-06** (in-source + brief) and flags the clash — the coordinator should
renumber once and update the three docs + the two in-source comments. Do not
silently renumber in one place only.

## Open inputs

| # | Needed from the client | Blocks / affects | Current state (source) | Priority |
|---|---|---|---|---|
| CI-06a | **Real product photos** — one per product (37 published) | M-4 repeated imagery; per-product image mapping; overview block currently reuses `villa-roof.jpg` on all 37 product pages | 12 stand-in photos in `public/images/photos/` (24 files: 12 .jpg + 12 .webp); products use only 4 (`battery-storage` ×16, `inverter-unit` ×13, `pump-flow` ×7, `controller-unit` ×1). Every product page captions the photo as illustrative, real photo pending (`src/data/pages.ts` productDetail k3; `src/data/products.ts` header) | HIGH |
| CI-06b | **Manufacturer datasheets + verified specifications** (PDFs) | Downloads centre; product-detail datasheet button (correctly hidden until files exist) | No datasheet files exist; no `datasheet` field populated. Downloads page renders honest empty state (`src/app/[locale]/downloads/page.tsx`); no button rendered on product pages (visual-gap D-6) | HIGH |
| CI-03 | **Bundle detailed component lists — final approval** | Bundle pages' component detail; bundle-3's 16 kWh battery brand is unconfirmed, so no battery product is linked; bundle-4's 8×360 W panels have no catalogue product | `componentProductIds` link only identified products (b1: p02+p14; b2: p02+p24; b3: p03 only; b4: p12+p29). Open questions in `bundles.ts` `openConfirmation` + `pages.ts` systems copy | MEDIUM |
| CI-04 | **Agency status for EFORE / MUST / Jntech / Hanwha Q-Cells / Wisenet** — official agent vs. carried brand | Agency pages' representation wording | Only Deye is confirmed official agent in Yemen. Other five are "brands we carry" until approval (`src/data/agencies.ts` header + `pages.ts` agencies copy) | MEDIUM |
| CI-07 | **Approved projects** (name, photos, location, date, results — with consent to publish) **+ news content** | Projects listing (honest empty state today); project-detail template stays unwired (ADR-04); news page (0 articles) | No `Project` records exist. `pages.projects` is the empty state; `approvedProjects` is intentionally empty; `ProjectDetailTemplate.tsx` is a labelled preview only | MEDIUM |
| CI-08 | **Unified warranty text** (single approved wording; duration only if approved) | Support page + product-detail warranty line | `siteSettings.warranty.status = "pending_client_approval"`; no duration published anywhere (`src/data/settings.ts`) | HIGH |
| CI-09 | **Chinese (zh) human review** — competent reviewer, never machine translation | zh pages' correctness; zh fallback notice | zh gaps on published products: 317 fields (all 37 names, all 36 overviews, all 37 subcategories, all 8 benefit strings, all 199 spec labels). `t()` falls back to ar; `ZhNotice` flags the fallback. en gaps: 280 fields (spec labels 199, overviews 36, subcategories 37, benefits 8; names complete) | MEDIUM |
| CI-10 | **Privacy / Terms legal approval** (Ghamdan + legal counsel) | Legal pages' binding status | Both pages carry "Draft pending approval (CI-10)" — no clause binding before review (`src/data/pages.ts` legal copy) | LOW |
| CI-13 | **Per-product availability** (confirmed per product) | Availability line on product cards/detail (currently omitted for all products) | `ProductCard.tsx` header comment: no availability line unless confirmed per CI-13 | LOW |
| CI-17 | **SVG master logo** (vector version of the official emblem) — nice-to-have | Crisp logo scaling; favicon derivation | Official logo IS in `public/images/brand/` since Phase 3 (`gts-official-logo.jpg` 2048×2048 + `gts-emblem-on-white.png` + `gts-emblem-transparent.png`). Wordmark integration done (ADR-11/D-3). Only the vector master is missing | LOW (nice-to-have) |
| — | **Favicon decision** | Browser tab / bookmark icon | Live favicon is a placeholder: `public/favicon.svg` (navy rounded square, letter «غ», red dot `#E10600` — the retired wordmark red). No `icons` field in `src/app/layout.tsx` metadata. Decision needed: keep «غ» mark, or derive an official-mark favicon from the emblem PNGs (client/Ahmed approval) | LOW |
| — | **Ground-level solar-farm hero** (ref 05) | Projects hero fidelity | Implemented `hero-solar-farm.jpg` is **aerial**; ref 05 is ground-level (ADR-02, visual-gap P-2). No ground-level asset exists — needs a new AI-generated image to match or a client photo | MEDIUM |
| — | **Home hero villa+sea subject** (ref 01) | Home hero fidelity (ADR-03 / D-1) | Home uses `hero-villa-mountains.jpg` (villa + mountains); ref 01 subject is villa + **sea**. `hero-villa-sea.jpg` exists but belongs on About (ref 02). Needs a new asset or a client decision (visual-gap H-2) | MEDIUM |
| — | **Internal price data** (sales/WhatsApp only) | WhatsApp sales workflow | Never public. No internal price store exists in the site; prices stay in the sales team's WhatsApp workflow (v15 §3.1) | STANDING |
| D-1 | **Decision: ref-01 hero treatment** (ADR-03) — black headline on bright sky vs. white copy on overlay | Home hero final look | OPEN. Phase 4 implemented navy headline + white gradient scrim over the sky (measured, visual-gap §1.1). Needs Ahmed's confirmation + contrast check on the final image | DECISION |
| D-5 | **Decision: marquee styling** — navy bg/white text (live) vs. ref white bg/black text | Home marquee | OPEN (Phase 3). Live keeps navy; not changed unilaterally | DECISION |
| D-7 | **Decision: `/industries` route** (v15 §5.1/§6.10 lists it; no route/data exists) | Whether the route exists at all | Needs approved industry content — never invented | DECISION |

## Closed / resolved by Phase 5 (no longer awaiting input)

| # | Item | How it closed |
|---|---|---|
| D-8 / ADR-06 | Verified source for the hero phrase «طاقة اليوم لمستقبل أفضل» | **Closed by removal, not by sourcing.** No source was found; Phase 5 (2026-11-15) removed the phrase from `src/data/pages.ts` catalog k1 (all 3 locales), removed the `/products` hero eyebrow, and re-pointed the category-page breadcrumb to `ui("category.allProducts")`. The distinct ref-01 badge «طاقة ومياه من أجل مستقبل أفضل» (`pages.ts:33`) is reference sample copy, not GTS copy — untouched. |
| CI-02 | Specs-note key (C-2 root cause) | Resolved by the C-2 fix (2026-11-14): CI-02 note dropped, productDetail blocks renumbered to k1..k16. Phase 5 re-verified: 37/37 blocks contiguous, 0 CI-02 notes, 0 k17 keys. |

## What this register does NOT contain

- Anything already delivered (fonts, tokens, logo raster files, hero images on disk).
- Internal commercial details (bundles' internal prices stay WhatsApp-only and are not in this repo's public data).
- Track B (CMS / 301s / SEO / deployment) — separately scoped, not a client input.
