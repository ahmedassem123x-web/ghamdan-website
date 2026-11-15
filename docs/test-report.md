# Test Report — GTS Website v15 (Phase 8 QA)

**Build under test:** `~/workspace/ghamdan-website-v2/out/` — 231 HTML files, 58 MB,
built 2026-11-15 ~02:15 +03 (`npm run build` exit 0, `tsc --noEmit` exit 0, per
coordinator; QA did **not** re-run the build — see §6). Served locally with
`tools/serve.mjs` on `http://127.0.0.1:8321`. The live site
`https://ghamdan-website.vercel.app/` is the OLD build and was **not** probed.

**Probe:** `tools/probe.mjs` (Playwright headless-shell), run 2026-11-15
02:12–02:25 +03 (13.4 min). Full results: `docs/qa/probe-results.json`.

## 1. Headline numbers

| Metric | Result |
|---|---|
| Routes probed | **229** (228 locale + root; 231 HTML includes `404` + `_not-found`) |
| Non-200 responses | **0** |
| Console errors | **0** (desktop + mobile) |
| Failed requests (incl. HTTP ≥ 400) | **0** |
| Horizontal overflow, desktop 1440×900 | **0 px on all 229 routes** |
| Horizontal overflow, mobile 390×844 | **0 px on all 12 mobile pages** |
| Bad `wa.me` links | **0** (1,869 rendered wa.me links, all `967775800000`) |
| Total images rendered | 2,068 |
| Broken images (fast probe) | 6 desktop routes + 9 mobile pages — **all timing artifacts, see §2** |

## 2. Broken-image flags — investigated, NOT real

The fast probe flagged lazy `.webp` images as broken on `/ar|en|zh/products`
(`pump-flow.webp` ×6, `controller-unit.webp`, `pivot.webp`) and
`/ar|en|zh/solutions/pumping` (`pump-flow.webp` ×3), plus 9 mobile pages.
All flagged files exist on disk and are valid WebP
(e.g. `pump-flow.webp` 85,260 B, RIFF/WebP 1024×768).

Re-check (`/tmp/recheck-images.mjs`, slow stepwise scroll + up to 30 s wait
for every image to complete):

| Page | Viewport | Images | Broken after full wait |
|---|---|---|---|
| `/ar/products` | 1440×900 | 42 | **0** |
| `/ar/solutions/pumping` | 1440×900 | 17 | **0** |
| `/ar` | 390×844 | 13 | **0** |
| `/ar/products` | 390×844 | 42 | **0** |

Verdict: the probe's jump-scroll + 1.5 s wait is too short for lazy images
below the fold on this slow VM. **0 genuinely broken images.**

## 3. Content scans on the built output (re-verified statically, 231 HTML)

| Scan | Result |
|---|---|
| Visible text (scripts/styles stripped), `USD` | **0** |
| Visible text, `$` + digit | **0** |
| Visible text, `1997` | **0** |
| `Tajawal` / `Montserrat` in built HTML + CSS | **0 / 0** (built CSS `0sp_1edryv9fe.css`: Inter ×4, Plex Sans Arabic ×12, 9 `@font-face`, 9 woff2 refs) |
| `wa.me` occurrences | **1,872, all `967775800000`, 0 others** |
| Price-word contexts | 119 distinct contexts — **all** the approved inquiry-policy sentences (product / bundle / "agreed with the sales team" variants, ar + en + zh) |
| Unsourced phrase «طاقة اليوم لمستقبل أفضل» / "Today's energy for a better future" / «今日能源，共创更美好的未来» | **0 hits** in `out/` |
| Ref-01 badge «طاقة ومياه من أجل مستقبل أفضل» (must stay) | present, 1× on `/ar` |
| Internal CI codes in visible copy | **385 occurrences on 157 pages** — see defect D-8 (minor) |
| Sitemap | 225 URLs; missing only `/` (root redirect) and the 3 admin demo pages — correct |

## 4. Regression tests R-1–R-7 (from `docs/regression-test-report.md`)

| # | Check | Result | Evidence |
|---|---|---|---|
| R-1 | C-1 header readable at scroll 0 | **PASS** | Desktop + mobile + tablet, ar/en/zh: header `background-color rgb(255,255,255)`, 76 px, pinned (`top: 0` after scroll), logo + nav dark/readable. Screenshots `desktop-home.png`, `mobile-home.png`, `tablet-home.png`. |
| R-2 | C-2 spec labels | **PASS** | Source identity rows correct for all 39 products; scripted sweep of **111/111** built product pages: 0 label/value/count mismatches, 0 empty, 0 "—". p28 two «السلامة» rows confirmed as the known flag (genuine values: "تبريد تلقائي" / "نظام إطفاء حريق"). Visual spot-check: p01 spec table renders brand/model/category/subcategory in order (`/tmp/spec-table2.jpg`, `screenshots/v15/desktop/full-desktop-product-detail.png`). p39 has a "—" model value in source but is pending/unpublished (D-11, data hygiene only). |
| R-3 | M-1 single-image gallery | **PASS** | Large 4:3 image on desktop + mobile + tablet; caption present; lightbox opens (backdrop + ‹ › + ×), Escape and × close it, body scroll restores. Multi-image grid path **NOT OBSERVABLE** (no product has 2+ images). Defects noted separately: caption duplicated (D-7), CI code in caption (D-8). |
| R-4 | M-2 hero treatment | **PASS** | Home: navy headline on bright sky, no navy overlay, white gradient scrim, navy WhatsApp pill (desktop + mobile). Projects: white text on 60% navy overlay, readable. Split heroes: text on white surface, photo unobscured. No page uses the old 25% navy overlay on home. |
| R-5 | Phrase + WhatsApp + breadcrumb | **PARTIAL** | Phrase removal PASS (0 hits); `/ar/products` has no eyebrow pill PASS; WhatsApp single-number PASS; **breadcrumb FAIL on category pages** — first crumb is the sentence "أربع عائلات من الحلول المتكاملة — اختر ما يناسب منزلك أو مزرعتك أو منشأتك." instead of "الرئيسية" (D-5, 24 pages). All other pages use `ui("nav.home")` correctly. |
| R-6 | Tokens | **PASS** | Headings navy `#102B46`, "Details" links + spec labels `#0B70C9`, illustrative badge navy 70%, projects label bar sky, step numerals `#0081FB` (large text only). Deprecated token aliases: **0 functional references** in `src/` (only historical comments in `globals.css:28-35`). Note D-10: `#0081FB` small text in the admin demo only. |
| R-7 | Data integrity | **PASS** | p30/p39: no product pages, no sitemap entries (only the Wisenet *agency* pages exist, correctly); archived bundle-4: no page, no links; LM PACK p22/p23/p26: brand "Shenzhen Kexin" ×25 on each detail page, 0 "EFORE", absent from the EFORE agency page; zero-count categories (panels, systems, storage-ci, cameras) render «لا توجد منتجات» honest empty states; no public prices; en/zh fall back to ar visibly. |

## 5. Interactions (browser-verified)

| Interaction | Result |
|---|---|
| Mega menu (desktop hover) | Opens, `aria-expanded=true`, all 8 categories + counts + 3 bundles visible; Escape closes (keyboard path and hover path both verified in re-test) |
| Burger / mobile drawer | Opens on mobile and on desktop (burger is always visible); role=dialog, backdrop, × button, Escape closes, focus trap + scroll lock in source; **EN/ZH mobile: 58.5 px drawer sliver visible when closed (D-2)** |
| Language switcher | `/ar` → click EN → `/en` (same page); 3-locale switcher present in header, drawer and footer; **`<html lang>` stays `ar` on `/en` (D-1)** |
| Lightbox | Opens, locks body scroll, Escape/× close, scroll restores |
| Product search / filters / tab strip | Tab strip renders All (37) + 8 categories with counts; strip is horizontally scrollable (`scrollWidth 2102` vs `clientWidth 1320`); filter dropdowns + search render; category count "عرض: 12 / 13" on inverters |
| Contact form | Renders (name / email / inquiry type / message / submit); submit path is WhatsApp handoff per spec (not exercised end-to-end — no external send in QA) |

## 6. What QA did NOT do

- Did **not** re-run `npm run build` or `tsc --noEmit` (build artefacts taken as
  delivered by the coordinator at 2026-11-15 ~02:15 +03; `out/` contents
  verified: 231 HTML, timestamps 23:09 UTC).
- Did **not** test on a real iPhone/Android (no device in hand; Ahmed's own
  phone test is decisive for real-device rendering).
- Did **not** deploy or touch the live site, GitHub, or Vercel (out of scope
  for Phase 8).
- Contact-form submit and WhatsApp deep links were not exercised end-to-end
  (no external send from QA).

## 7. Defects found (summary; full list in `docs/deployment-verification.md`)

- **D-1 CRITICAL** — `<html lang="ar" dir="rtl">` on ALL pages incl. `/en`, `/zh`
  (root layout reads `params.locale`, always undefined above the `[locale]`
  segment). 152 EN/ZH pages render as Arabic RTL.
- **D-2 CRITICAL (consequence of D-1)** — 58.5 px sliver of the closed mobile
  drawer visible on the left edge of every EN/ZH page below `lg`.
- **D-5 MAJOR** — category breadcrumb first crumb is a full sentence, not
  "الرئيسية" (24 pages).
- **D-6 MINOR** — WhatsApp float overlaps the mobile sticky WhatsApp bar
  (product pages) and the home guidance-bar button.
- **D-7 MINOR** — gallery caption rendered twice (overlay + line below).
- **D-8 MINOR** — internal `(CI-03…CI-10)` codes in public copy, 385× / 157 pages.
- **D-9 MINOR** — 18 agency pages have no `<h1>`.
- **D-10 MINOR** — `#0081FB` small text in the admin demo (fails AA normal text).
- **D-11 MINOR** — p39 (pending) has a "—" model value in source data.
- **D-12 MINOR** — EN desktop nav "Ready-made Systems" wraps to 2 lines at 1440 px.

Per-page weights, fonts, contrast, keyboard and alt-text measurements are in
`docs/performance-report.md`. Visual verdicts are in
`docs/visual-qa-report.md`. Motion/3D is in `docs/motion-qa-report.md`.
Release gates are in `docs/deployment-verification.md`.
