# Fix Report — v15 Round 2 (D-1–D-12)

**Date:** 2026-11-15 (fix round executed ~03:40–04:10 +03)
**Build under test:** `~/workspace/ghamdan-website-v2/out/` — rebuilt in this round.
**Server for browser checks:** `http://127.0.0.1:8322` (fresh build; the old QA server on 8321 serving the pre-fix `out/` was killed first). The 8322 server was left running for the parent's probe re-run.
**Scope:** source fixes only. No upload, push, Vercel or repo changes (parent's step).

## Headline numbers

| Check | Result |
|---|---|
| `npm run build` | **exit 0, 231 HTML** (build ran `next build && node tools/fix-html-lang.mjs`) |
| `npx tsc --noEmit --incremental false` | **exit 0** |
| `<html lang/dir>` over all 231 HTML | **79 ar/rtl, 76 en/ltr, 76 zh/ltr — 0 wrong-locale attrs** |
| No-price scan (visible HTML, scripts stripped) | **USD 0, `$<digit>` 0, «1997» 0**; 115 price-word contexts, all the approved inquiry-policy sentences |
| `wa.me` in raw HTML | **1,872 — all `967775800000`, 0 others** |
| `(CI-*)` in built HTML (incl. RSC payloads) | **0** |
| Tajawal / Montserrat in built HTML + CSS | **0 / 0** |
| `wisenet-cameras` (p39) in built HTML | **0** (does not render anywhere) |
| Browser checks (`/tmp/verify-round2.mjs`) | **20/20 PASS** (run while Chromium worked) |
| Full probe (`tools/probe.mjs`, 229 routes) | **BLOCKED — Chromium SIGTRAP at launch (environment fault, see § "Blocked")** |
| Targeted probe (19 routes × 2 viewports) | **BLOCKED — same Chromium fault** |
| `out/` size | **53 MB** (was 58 MB — D-3 + D-4 removed ~5 MB) |

## Per-defect

### D-1 CRITICAL — `<html lang="ar" dir="rtl">` on ALL pages — FIXED
- **Change:** new `tools/fix-html-lang.mjs` (Node, no deps) + `package.json: build` is now `next build && node tools/fix-html-lang.mjs`. The script walks `out/`, rewrites ONLY the `<html …>` tag per path (`out/ar/**` + `ar.html` → `lang="ar" dir="rtl"`; `out/en/**` + `en.html` → `lang="en" dir="ltr"`; `out/zh/**` + `zh.html` → `lang="zh" dir="ltr"`; `index.html`, `404.html`, `_not-found/` keep the ar/rtl default). Idempotent; prints per-locale counts. Also updated the misleading comment in `src/app/layout.tsx` (it claimed lang/dir come from the `[locale]` segment — they cannot, the root layout sits above it).
- **Why post-build, not runtime:** static export has no request-time locale; this gives statically-correct attrs (SEO, no-JS, view-source) with zero runtime cost and no flash. No runtime fallback was needed.
- **Verify:** build output `fix-html-lang: 231 HTML files — ar: 79 files, 0 rewritten; en: 76 files, 76 rewritten; zh: 76 files, 76 rewritten`. Re-running the script rewrites 0 (idempotent). Grep over all 231 built HTML: `('ar','rtl') 79, ('en','ltr') 76, ('zh','ltr') 76`, 0 wrong. Browser: `document.documentElement.lang/dir` = `en/ltr` on /en and `zh/ltr` on /zh, desktop + mobile. Screenshots: `docs/qa/screenshots/v15-round2/d1-en-home-1440.png`, `d1-zh-home-1440.png` — EN home renders LTR (logo left, nav Home-first from the left, headline LTR).
- **Deploy note (for parent):** Vercel runs `npm run build`, so the post-build step is picked up automatically — **but confirm the Vercel build command is still `npm run build` at deploy time** (if it were ever changed to bare `next build`, the EN/ZH pages would ship ar/rtl again).

### D-2 CRITICAL — 58.5 px drawer sliver on EN/ZH mobile — FIXED (via D-1, no drawer code change needed)
- **Change:** none to `src/components/Header.tsx` — the component was already correct per-locale (`localeDir(locale)` picks `translate-x-full` for RTL / `-translate-x-full` for LTR, and `start-0` anchors to the document's inline-start). The sliver was caused purely by the wrong document `dir` (RTL on EN pages put the panel on the right, so `-translate-x-full` left 390 − 331.5 = 58.5 px visible).
- **Verify:** browser measurement on /en and /zh at 390 px — closed drawer panel rect `left=-331.5, right=0, w=332` (sliver = max(0, right) = **0 px**). Pixel scan of the left edge of both mobile screenshots: first non-white x = 0 is the header content itself, no drawer band. Screenshots: `d2-en-home-390.png`, `d2-zh-home-390.png`.

### D-3 MAJOR — 1,029,149 B logo emblem preloaded on every page — FIXED
- **Change:** `public/images/brand/gts-emblem-transparent.png` resized with PIL LANCZOS 1597×1621 → **473×480 px, 1,029,149 → 149,402 B** (−85%). Artwork untouched (no recolor/stretch/redraw); aspect ratio preserved. Display sizes are 44 px (header) / 120 px (footer), so 480 px is ≈2× largest display incl. retina.
- **Verify:** quality check at display sizes + 4× zoom (`/tmp/emblem-qa.png`, inspected): ring text legible at 120 px on white and navy; GTS clear at 44 px (embedded lines become texture, as the brand agent predicted — the HTML wordmark carries the name); 4× zoom edges clean, no ringing. Built `out/` emblem is 149,402 B.
- **Record:** regeneration path appended to `docs/brand-identity-lock.md` §10 (re-crop `(237,213)–(1834,1834)` + §4 flood-fill from `incoming/v15/gts-official-logo.jpg`, then resize to 473×480); §3 table row updated to the new size/bytes.

### D-4 MAJOR — ~4.24 MB dead assets in `out/` — FIXED
- **Change:** moved (never deleted) **31 files, 3,813,899 B** from `public/` to `docs/qa/removed-assets-2026-11-15/` (paths preserved relative to `public/`), with manifest `docs/qa/removed-assets-2026-11-15/MANIFEST.md` (each file + size + grep evidence):
  - 18 `.jpg` (6 heroes + 12 photos): 0 rendered refs — every image render passes through `webp()` (`src/lib/images.ts`, `.jpg` → `.webp`); every file has a `.webp` sibling that is the served file; QA Phase 8 verified 0 rendered `<img src=*.jpg>`.
  - `public/images/brand/gts-official-logo.jpg` (158,489 B): 0 src refs (only docs mentions + a Wordmark comment); master preserved at `incoming/v15/gts-official-logo.jpg` (SHA-256 `3a6c974d…e3cbb812`). Note: this makes the brand doc's "canonical vendored copy" path stale — recorded in `docs/brand-identity-lock.md` §10.
  - 12 stale WOFF2 (8 Tajawal + 4 Montserrat, ~229 KB): 0 references — no `@font-face` in `src/` (only comment mentions at `globals.css:134`, `Wordmark.tsx:21`); built CSS references Inter + IBM Plex Sans Arabic only.
  - **Kept:** `gts-emblem-on-white.png` (819,981 B) — referenced in `docs/brand-identity-lock.md` §3 as the fallback asset for contexts without alpha support (white surfaces only), which is the task's explicit keep condition.
- **Verify:** after rebuild, 0 of the moved files exist under `out/`; `out/images/` contains 0 `.jpg`; `out/fonts/` contains only the 9 Inter/Plex files; `out/` 58 → 53 MB.

### D-5 MAJOR — category breadcrumb first crumb is a sentence — FIXED
- **Change:** `src/app/[locale]/products/category/[slug]/page.tsx:71` — `t(pages.home.k38, l)` → `ui("nav.home", l)` (one line).
- **Verify:** all 24 category pages (8 categories × 3 locales) in built HTML — 0 contain the old sentence «أربع عائلات من الحلول المتكاملة…»; 8/8 per locale contain the home label («الرئيسية» / "Home" / "首页"). Browser: first breadcrumb crumb = "الرئيسية" on /ar, "Home" on /en. Screenshot: `d5-en-category-1440.png`.

### D-6 MINOR — WhatsApp float overlaps mobile sticky bar — FIXED
- **Change:** `src/components/WhatsAppFloat.tsx` (added marker class `whatsapp-float`), `src/components/StickyWhatsAppBar.tsx` (marker class `sticky-whatsapp-bar`), `src/app/globals.css` (appended rule): `@media (max-width: 767.5px) { body:has(.sticky-whatsapp-bar) .whatsapp-float { display: none; } }`. The sticky bar is the page's primary CTA on product/system pages below `md`, so the float hides while it is present. Desktop unaffected (sticky bar is `md:hidden`; rule is mobile-only). `:has()` is supported in all browsers shipping since 2023.
- **Verify (browser, 390 px, /ar product p01):** sticky bar visible, float `display: none`, `elementFromPoint` at the CTA centre hits the sticky `wa.me` anchor (tappable). Home guidance-bar "دليل الضخ" button tappable when scrolled to viewport centre. Screenshot: `d6-mobile-product-sticky-390.png` — sticky bar fully visible, no float over it. Honest note: on pages *without* a sticky bar the fixed float still sits over in-flow content at the viewport's bottom-right corner (standard fixed-button behaviour); the guidance-bar buttons are centred on mobile, so the float does not cover them when the bar is in view.

### D-7 MINOR — gallery caption rendered twice — FIXED
- **Change:** `src/components/Gallery.tsx` — removed the overlay caption `<span>` from both the single-image branch and the multi-image grid branch. Kept the caption line below the image (product page renders `copy.k3` under the Gallery) and the lightbox caption inside the dialog. Ref 06 shows a single caption; the line below is the kept rendering.
- **Verify:** 111/111 built product pages have exactly 1 visible caption occurrence; 0 overlay caption spans (`bg-navy/70`) remain in product pages. Browser `body.innerText` count = 1 on p01 (inverter), p15 (battery), p32 (pump). Screenshot: `d7-product-detail-1440.png` — image with no overlay, single caption line below.

### D-8 MINOR — internal `(CI-03…CI-10)` codes in public copy — FIXED
- **Change:** exact-token removal from rendered strings only — **104 tokens on 103 lines**: `src/data/pages.ts` (102 tokens) + `src/components/AdminClient.tsx:246` (2 tokens, ar + en). Regex removed ` (CI-NN)` / `(CI-NN)` and ` （CI-NN）` / `（CI-NN）`, leaving surrounding copy and punctuation untouched (e.g. «…قيد الاستلام (CI-06).» → «…قيد الاستلام.»). Deliberately left alone: all comment occurrences (incl. `pages.ts:4733`), docs, and non-rendered source — verified by audit: every other `(CI-*)` in `src/` sits inside a comment.
- **Verify:** 0 `(CI-` occurrences in all 231 built HTML files (visible text AND raw HTML incl. RSC payloads; was 385). Spot-check of 5 changed pages (product p01 ar/en, projects ar, support ar, terms ar — via built HTML diff of the changed strings): only the token is gone, no other text changed.

### D-9 MINOR — 18 agency pages have no `<h1>` — FIXED
- **Change:** `src/app/[locale]/agencies/[slug]/page.tsx` — the agency name `<span className="font-latin text-5xl …">` is now an `<h1>` with identical classes (agency's own name from existing data, no invented wording).
- **Verify:** all 18 built agency pages contain exactly one `<h1>`; browser check on /ar/agencies/deye: `h1 count=1, text="Deye"`. Screenshot: `d9-agency-deye-1440.png`.

### D-10 MINOR — `#0081FB` (3.80:1) small text in admin demo — FIXED
- **Change:** `src/components/AdminClient.tsx` — 8 small-text `text-primary` → `text-primary-hover` (`#0B70C9`, 5.03:1): login labels (L102, L106), table header class (L127), `text-sm` paragraph (L135), service title (L289), settings `dt` labels (L323, L327, L331). Large text kept on `text-primary` (h1 `text-h3` 28 px, h2 `text-h2` 36 px, `text-4xl` numerals) — 3.80:1 passes WCAG AA for large text.
- **Verify:** browser computed color of the admin login label «البريد الإلكتروني» = `rgb(11, 112, 201)` = `#0B70C9`. Public pages untouched: all remaining `text-primary` usages outside AdminClient are large text (step numerals `text-4xl/6xl`, 404 numeral `text-7xl`, `text-h1`); built CSS still defines `--color-primary:#0081fb`.

### D-11 MINOR — p39 (pending) has a "—" model value — NO CHANGE (sourced, recorded)
- **Decision:** left as-is. The catalogue xlsx confirms this is sourced reality, not a data error: sheet «الكتالوج الكامل» row 39 = `Wisenet, —, لا موديلات مؤكدة` ("no confirmed models"); sheet «ملخص الأقسام» = «قسم ثانوي منفصل عن الطاقة — لا موديلات مؤكدة بعد»; sheet «يحتاج تأكيد غمدان» asks Ghamdan for the models/recorders/prices and whether the section is even active. Inventing a model would violate the no-invented-text rule.
- **Verify:** p39 does not render anywhere — `wisenet-cameras` occurs 0 times in built HTML; product status is `pending` (no product page, no sitemap entry, excluded from the agency product list which filters `published`).

### D-12 MINOR — EN nav "Ready-made Systems" wraps at 1440 px — FIXED
- **Change:** `src/components/Header.tsx` — label NOT shortened: the AR label «الأنظمة الجاهزة» means exactly "Ready-made Systems", so shortening to "Systems" would mistranslate it. Fixed with CSS instead: `whitespace-nowrap` on every desktop nav item (links + Products button) and nav gap `gap-7` → `gap-5 xl:gap-7`.
- **Verify:** browser at 1440 px /en — all 7 nav items single-line, each `h=44` (Home, About, Products, Solutions, Ready-made Systems, Projects, Contact). A full overflow sweep is part of the blocked probe (see below); the EN home screenshot shows no visual overflow. Screenshot: `d12-en-nav-1440.png` (also visible in `d1-en-home-1440.png`).

## Regression checks (browser, while Chromium worked)
- Pumping 3D canvas renders on /en: `<canvas>` 1222×764 px present. Screenshot: `reg-pumping-3d-en-1440.png`.
- JS-disabled /ar home: content visible (`h1` present, body text 3,173 chars, 59 sections). Screenshot: `nojs-home-ar-1440.png`.
- Header readable at scroll 0 on /en + /zh: `background-color rgb(255,255,255)`, 76 px.

## Blocked — full + targeted probe (environment fault, NOT a site defect)
- `tools/probe.mjs` (229 routes) failed 3× at browser launch: `browserType.launch: Target page, context or browser has been closed … [pid] <process did exit: exitCode=null, signal=SIGTRAP>`. The targeted-probe fallback (`/tmp/targeted-probe.mjs`, 19 routes × 2 viewports) failed the same way three times. The Chromium binary itself runs `--version` fine but SIGTRAPs (exit 133, "Trace/breakpoint trap") on any real page load right now, including a direct `--dump-dom` run — the same flapping fault recorded 2026-11-14 (cleared on its own then). The browser verification in this same session (20/20 checks + admin colour check) ran fine ~40 minutes before the fault appeared, so the site was verified live while Chromium worked.
- **What this leaves unverified by a full sweep:** 229-route console errors / failed requests / overflow / broken images on the new build. Mitigations already in place: (a) the 20 browser checks above covered the changed surfaces on both viewports; (b) static scans cover prices, wa.me, CI codes, lang/dir, fonts, dead assets on all 231 pages; (c) the only source changes since the Phase 8 probe (which was 229 routes, 0 errors) are the 12 fixes above, all verified on their affected pages. **Recommendation: re-run `tools/probe.mjs` from the parent side once the environment recovers, before deploying.**

## Files changed (source)
- `tools/fix-html-lang.mjs` (new, D-1) · `package.json` (build script, D-1) · `src/app/layout.tsx` (comment, D-1)
- `src/app/[locale]/products/category/[slug]/page.tsx:71` (D-5)
- `src/app/[locale]/agencies/[slug]/page.tsx` (D-9)
- `src/components/Gallery.tsx` (D-7) · `src/components/Header.tsx` (D-12)
- `src/components/WhatsAppFloat.tsx`, `src/components/StickyWhatsAppBar.tsx`, `src/app/globals.css` (D-6)
- `src/data/pages.ts`, `src/components/AdminClient.tsx` (D-8, D-10)
- `public/images/brand/gts-emblem-transparent.png` (D-3, resized)
- `public/images/*` + `public/fonts/*` (D-4, 31 files moved — see manifest)
- `docs/brand-identity-lock.md` (§3 row + §10 note, D-3/D-4)
- `docs/qa/removed-assets-2026-11-15/MANIFEST.md` (new, D-4)

## Open items
1. **Re-run the full probe** (`tools/probe.mjs`, 229 routes) once Chromium recovers — blocked by the environment fault above, not by the site.
2. **Parent to confirm the Vercel build command is `npm run build`** at deploy time (D-1 depends on it).
3. p39 Wisenet models remain unconfirmed — needs Ghamdan's answer (client-input item, already in the register as CI-04-adjacent; the xlsx «يحتاج تأكيد غمدان» sheet asks for models/recorders/prices and whether the section is active at all).
4. `docs/brand-identity-lock.md` §1 still calls `public/images/brand/gts-official-logo.jpg` the "canonical vendored copy" — that file was moved to `docs/qa/removed-assets-2026-11-15/` in D-4; the master is `incoming/v15/gts-official-logo.jpg`. The §10 note records this, but §1's table was not rewritten (per the "append, do not rewrite" instruction for this round).
