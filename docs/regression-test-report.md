# Regression Test Report — GTS Website v2 (v15 Phase 5, DRAFT)

**Status:** DRAFT for the Phase 8 QA agent to execute. **Phase 5 did NOT execute
these checks visually** — no build was run in Phase 5 (the coordinator runs the
single build after integration) and no screenshots were captured. Everything
below is *what to check and where*, with the source anchors Phase 5 verified at
code level. Do not mark any item PASS until it is observed in the built site.

**Prerequisites:** coordinator build green (`npm run build`, 231 HTML files
expected: 228 locale routes + root + 404 + `_not-found`); site served from the
build output / staging URL. Viewports: desktop 1440×900 and mobile 390×844
(minimum); also 820px (sidebar/tab breakpoint) where noted.

## R-1 · C-1 — Invisible homepage header (fixed 2026-11-14, re-verify every build)

**History:** the home header rendered white-on-white at scroll 0 (transparent
header over a bright hero). Fix: header is always opaque white + sticky.

**Source anchor:** `src/components/Header.tsx:117` —
`className="site-header sticky top-0 z-50 bg-surface …"` (opaque surface,
`site-header--scrolled` variant on scroll). Comment at `:40`: "always opaque
white, sticky".

**Checks (Phase 8):**
1. `/ar` at scroll 0, desktop 1440×900: header bar is solid white; logo,
   nav links, language selector and WhatsApp action are all dark/readable;
   no hero image shows through the bar. Screenshot at scroll 0.
2. Same at mobile 390×844 (burger/drawer closed): header readable, no overlap.
3. Scroll to 500px and to page bottom: header stays pinned, stays opaque,
   no flicker or transparency on scroll.
4. Repeat 1–3 on `/en` and `/zh`.
5. Confirm the ref-01 transparent header was NOT reintroduced (that is a
   deliberate deviation — ADR-03 — do not "fix" it back).

**Pass criteria:** header readable at scroll 0 on all locales/viewports;
opaque at every scroll position. **Fail:** any white-on-white text, any hero
bleed-through, any transparent state.

## R-2 · C-2 — Product specification labels shifted (fixed 2026-11-14, re-verify every data change)

**History:** one extra key at the top of the per-product copy blocks shifted
every spec label one slot down in 33 of 37 blocks. Fix (2026-11-14): the
CI-02 specs note was dropped and blocks renumbered; verified 37/37 blocks and
111/111 localized product pages.

**Source anchors:** `src/data/products.ts` — each product's `specs` array
(identity rows first: brand / model / category / subcategory, then one row
per verified xlsx fragment); `src/data/pages.ts` `productDetail` — all 37
blocks k1..k16, contiguous, 0 CI-02 notes, 0 k17 keys (Phase 5 re-verified
by script, 2026-11-15); `src/components/ui.tsx:179` `SpecTable` (renders
the data's real labels/values, never "—").

**Checks (Phase 8):**
1. **Data check (before visual):** re-run the Phase 5 validation — slug
   uniqueness, identity-row order/values per product (spec[0] brand,
   spec[1] model, spec[2] category, spec[3] subcategory must equal the
   record), no empty labels/values, no duplicate labels, productDetail
   k1..k16 contiguous. Any failure blocks the visual pass.
2. **Built-HTML check:** for all 37 published products × 3 locales
   (111 pages), the spec table's first four rows read brand / model /
   category / subcategory with the values from the record. Spot-check at
   minimum: p01 (Deye 5kW), p14 (battery), p22 (Shenzhen Kexin LM PACK),
   p28 (see known-flag below), p31 (pump), p38 (controller); full sweep
   preferred (scripted text extraction, as in the 2026-11-14 verification).
3. **Known flag — NOT a new C-2:** p28 (`efore-outdoor-ess-system-145kwh-2-1mwh`,
   `products.ts:1638,1644`) has TWO spec rows labelled «السلامة» —
   "تبريد تلقائي" and "نظام إطفاء حريق". Both values are genuine verified
   fragments; the label repeats. Expect the duplicate label on that page;
   do not file it as a shifted-label regression. (Data fix, if any, needs a
   sourced label — never invent one.)

**Pass criteria:** 37/37 blocks × 111/111 pages correct; no shifted, empty,
or "—" labels. **Fail:** any label/value mismatch, any missing row.

## R-3 · M-1 — Single product image displayed as tiny thumbnails (fixed 2026-11-14)

**History:** a single product image rendered as a ~130px thumbnail in a
mostly empty grid. Fix: one image renders large (full-width, 4:3);
thumbnail grid + lightbox apply only with 2+ images.

**Source anchor:** `src/components/Gallery.tsx` — `single = items.length === 1`
branch (large 4:3 button, caption overlay) vs. multi branch (grid). All 37
published products have exactly 1 image in data, so every product page
exercises the single branch.

**Checks (Phase 8):**
1. Product detail page (e.g. `/ar/products/deye-sun-sg04lp1-6kw`), desktop +
   mobile: the product photo fills the gallery column at 4:3 — large, not a
   small thumbnail; no empty grid cells; no thumbnail strip below it.
2. Click the image: lightbox opens (single image, arrows are no-ops);
   Escape and the × button close it; body scroll restores.
3. The illustrative caption («صورة توضيحية…», productDetail k3) is visible
   under/over the image.
4. Note (not a fail): the same single image is rendered a second time
   beside the spec table (§3.6 layout) — that duplication is by design in
   the current page, not an M-1 regression.
5. Multi-image path: no product currently has 2+ images, so the grid branch
   cannot be observed on a product page — do not mark it PASS without a
   fixture; record as NOT OBSERVABLE.

**Pass criteria:** large 4:3 image, caption present, lightbox open/close
works. **Fail:** thumbnail-sized rendering, empty grid, missing caption.

## R-4 · M-2 — Homepage hero too dark (fixed 2026-11-14; treatment changed again in Phase 4)

**History:** M-2 reduced a 55% navy overlay to 25%. Phase 4 then resolved
ADR-03 differently: the home hero now uses a navy headline + dark copy over
the sky with a **white gradient scrim** (never a navy overlay) — measured
in `docs/visual-gap-analysis.md` §1.1 (headline zone 8.80:1 navy-on-sky
median, 5.26:1 p10 — AA pass; supporting-copy zone fails bare, hence the
scrim). The Projects hero (`full-left`) keeps a measured **60% navy overlay**
(§1.2, white-on-photo 7.32:1). Split heroes put text on a white surface —
no overlay question.

**Source anchors:** `src/components/Hero.tsx` — `darkText` prop (home,
`variant="center"`), `full-left` variant (projects), split variants
(`side-left` / `side-right` / `split`); `src/app/[locale]/page.tsx` (home
hero wiring); `src/app/[locale]/projects/page.tsx` (full-left wiring).

**Checks (Phase 8):**
1. Home `/ar`, desktop 1440×900 + mobile 390×844: headline is **navy on
   bright sky** (no navy overlay darkening the photo); supporting copy sits
   on the white gradient scrim and is readable; the single navy WhatsApp
   pill is visible. Screenshot both viewports.
2. Projects `/ar/projects`: white text top-left over the solar-farm photo
   with the 60% navy overlay — readable, not washed out, not pitch-black.
3. Split-hero pages (`/about`, `/solutions`, `/products`, `/contact`,
   `/products/category/*`, `/solutions/pumping`): text sits on a white
   surface; photo is unobscured on its side.
4. Confirm NO page still uses the old 25% navy overlay on the home hero.
5. ADR-03 is still OPEN (black-on-bright vs. current treatment) — QA
   checks the *implemented* treatment against §1.1 measurements; the open
   decision itself is not a QA fail.

**Pass criteria:** home headline + copy readable on both viewports (AA
contrast in the headline zone); projects overlay readable; split heroes
clean. **Fail:** white-on-photo without overlay/scrim, navy overlay on
home, unreadable copy at mobile crop.

## R-5 · Phrase removal + WhatsApp single-source (Phase 5, verify in built HTML)

1. **Phrase:** 0 hits in the built output for «طاقة اليوم لمستقبل أفضل» /
   "Today's energy for a better future" / «今日能源，共创更美好的未来» in
   all locales (Phase 5 verified 0 hits in `src/`; the coordinator checks
   `out/`). The distinct ref-01 badge «طاقة ومياه من أجل مستقبل أفضل»
   (`/ar` home hero) MUST still be present — it is different copy.
2. **Eyebrow removed:** `/ar/products` hero has NO eyebrow pill; the hero
   title is the catalogue title («دليل منتجات الطاقة الشمسية…») and the
   hero image alt uses the same title.
3. **WhatsApp:** every rendered `wa.me` link points to `967775800000`
   (one number); product/system/category/support/guidance/contact messages
   carry their context (name, model, page URL, locale). Spot-check: product
   page CTA, catalogue CTA banner, contact method cards, contact-form
   success handoff, sticky WhatsApp bar.
4. **Breadcrumb:** `/ar/products/category/inverters` breadcrumb reads
   Home / «جميع المنتجات» / category name (the old catalog-k1 label is gone).

## R-6 · Tokens (Phase 5 migration — visual spot-check)

1. Product cards (grids, related lists): headings/labels navy `#102B46`
   (not bright blue); "Details" link and spec labels in `#0B70C9`
   (`text-primary-hover`); illustrative badge on navy 70%.
2. Projects index template preview: label bar sky `#DDF5FC`, headings navy,
   step numerals bright blue `#0081FB`, dot markers `#0B70C9`.
3. **Not yet migrated (expected, do not file as Phase 5 regressions):**
   `AdminClient.tsx`, `layout.tsx`, `not-found.tsx`, root `page.tsx` still
   use deprecated aliases (`bg-bg`, `bg-accent-soft`, `text-accent`,
   `danger`, `primary-deep`, `sky-light`) — the aliases in `globals.css`
   must NOT be deleted until those files are migrated by their owner.
   The 404 page button renders bright blue (`bg-primary`) with a
   `hover:bg-primary-deep` hover — pre-existing, outside Phase 5 ownership.

## R-7 · Data-integrity spot-checks (re-run on every data change)

- Pending products p30 (Hanwha Q-Cells) and p39 (Wisenet): no page, no
  image, absent from search, filters, sitemap and related lists.
- Archived bundle-4 (Ramadan): no page, no links.
- LM PACK products p22/p23/p26 show brand "Shenzhen Kexin" everywhere
  (card, detail, agency lists) and are NOT under the EFORE agency.
- Zero-count categories (panels, systems, storage-ci, cameras) render
  honest empty states, never 404s.
- No public prices anywhere (approved inquiry-policy sentence only).
- Locale fallback: en/zh product pages fall back to ar where a field has
  no translation (spec labels are ar-only: 199/199) — the fallback must be
  identifiable, never presented as a translation.

## Execution log (Phase 8 fills in)

| # | Check | Date | Executor | Result | Evidence |
|---|---|---|---|---|---|
| R-1 | C-1 header | | | | |
| R-2 | C-2 spec labels | | | | |
| R-3 | M-1 gallery | | | | |
| R-4 | M-2 hero | | | | |
| R-5 | Phrase + WhatsApp | | | | |
| R-6 | Tokens | | | | |
| R-7 | Data integrity | | | | |
