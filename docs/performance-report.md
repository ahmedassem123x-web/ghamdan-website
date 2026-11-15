# Performance & Accessibility Report — GTS Website v15 (Phase 8)

**Build under test:** `~/workspace/ghamdan-website-v2/out/` (58 MB, built
2026-11-15 ~02:15 +03), served locally on `http://127.0.0.1:8321` with the
project's plain Node static server (no gzip/brotli). All transfer numbers
below are therefore **worst-case local numbers**; Vercel serves compressed
assets in production, which will reduce JS/CSS/HTML substantially. Image and
font bytes are unaffected by that caveat.

## 1. Per-page weight (desktop 1440×900, after full scroll, all resources)

| Page | Total transfer | JS | Images | CSS+fonts* |
|---|---|---|---|---|
| Home `/ar` | 4,525 KB | 865 KB | 569 KB | 235 KB |
| About | 4,291 KB | 850 KB | 450 KB | 235 KB |
| Solutions | 4,509 KB | 850 KB | 506 KB | 235 KB |
| Products | 5,268 KB | 853 KB | 436 KB | 235 KB |
| Projects | 3,974 KB | 838 KB | 120 KB | 235 KB |
| Product detail | 4,143 KB | 842 KB | 282 KB | 235 KB |
| Contact | 3,978 KB | 838 KB | 141 KB | 235 KB |
| Category (inverters) | 4,433 KB | 842 KB | 345 KB | 235 KB |
| Pumping | 5,334 KB | 1,581 KB | 799 KB | 235 KB |
| Systems (bundle-1) | 4,052 KB | 843 KB | 119 KB | 235 KB |

\* "CSS+fonts": the built CSS file is 52 KB; fonts loaded via `@font-face`
are reported by the browser under the `css` initiator type, so the 235 KB is
CSS + webfonts combined. Resource counts: 95–145 per page.

**Biggest single contributors**
- **Logo emblem `gts-emblem-transparent.png`: 1,029,149 B, preloaded on every
  page** (`<link rel="preload" as="image">`), displayed at 43×44 px (header)
  and 118×120 px (footer). ~1 MB of the ~4–5 MB per page is this one file.
  **D-3 (MAJOR):** resize/optimise to ~240 px (PNG or WebP, expected
  ~20–40 KB).
- **JS ~840–865 KB/page** (uncompressed, local server). Pumping is 1,581 KB
  because the three.js chunk (`3-d1rft_59n9h.js`, 743 KB) loads there only —
  correctly scoped by dynamic import; no other page loads it.
- **Dead assets shipped in `out/images/` (~4.24 MB of 7.48 MB):** 19 `.jpg`
  files (3.42 MB) with **0 rendered `<img src>`** (all rendered images are
  `.webp`/`.png`); `gts-emblem-on-white.png` 820 KB (0 references);
  `gts-official-logo.jpg` 158 KB (0 references). **D-4 (MAJOR).**
- Largest rendered images: heroes ~150 KB `.webp` each; photos 32–145 KB
  `.webp`; the emblem 1,029 KB `.png`.

## 2. Images

- Rendered formats: `.webp` everywhere except the emblem (`.png`).
- Lazy loading: 1,320 of 2,055 `<img>` lazy; the 735 without `loading="lazy"`
  are the emblem (684), heroes and category-hero images — all above the fold,
  correct.
- `fetchPriority="high"` on hero images; `loading="lazy"` on all below-fold
  images. Verified: 0 genuinely broken images (see `docs/test-report.md` §2).

## 3. Fonts

- Vendored: Inter (latin variable) + IBM Plex Sans Arabic 400/500/600/700
  (arabic + latin), 9 WOFF2, `font-display: swap` ×9.
- **Computed fonts verified in the browser:** `body` and `h1` resolve to
  `"IBM Plex Sans Arabic", "Noto Sans SC", "PingFang SC", "Microsoft YaHei",
  system-ui, sans-serif`; loaded faces: Inter 400/700, Plex 400/600/700.
  0 Tajawal/Montserrat references in built CSS/HTML.
- No `<link rel="preload" as="font">` — preloading Plex 400/700 would shave
  first-paint font swap (minor).
- Chinese: no CJK webfont (documented fallback stack); no tofu boxes
  observed on the ZH mobile screenshot.
- Stale files: `public/fonts/` still ships Tajawal (8 files, ~77 KB) and
  Montserrat (4 files, ~152 KB) WOFF2s into `out/fonts/` — unreferenced dead
  weight, part of D-4.

## 4. Contrast (computed WCAG ratios from token values)

| Pair | Ratio | Verdict |
|---|---|---|
| Button fill `#0B70C9` on white (primary actions) | **5.03:1** | AA pass (normal text) |
| White on `#0B70C9` | 5.03:1 | AA pass |
| Navy `#102B46` on white / white on navy | 14.42:1 | AA pass |
| Text-secondary `#5A6470` on white | 6.01:1 | AA pass |
| Text-muted `#6B7280` on white | 4.83:1 | AA pass |
| Primary `#0081FB` on white | 3.80:1 | Large text / UI only (3:1) — public usage is large text only (step numerals text-4xl/6xl, 404 numeral, H1): **PASS** |
| `#0B70C9` on sky `#DDF5FC` | 4.44:1 | Just under 4.5 for normal text; used for large/bold text on sky: PASS as large text |
| Navy on sky `#DDF5FC` | 12.73:1 | AA pass |
| Home hero headline (navy on sky, measured in gap analysis §1.1) | 8.80:1 median / 5.26:1 p10 | AA pass (white gradient scrim behind copy zone) |
| Projects hero (white on 60% navy overlay, gap analysis §1.2) | 7.32:1 | AA pass |

**D-10 (MINOR):** `#0081FB` is used for *small* text in the admin demo
(`AdminClient.tsx`: `text-sm` labels, table headers, `dt` elements) — 3.80:1
fails AA for normal text. The admin is a localStorage-only demo, but it ships
in the public build.

## 5. Keyboard navigation

- Tab order on `/ar` (desktop): TopBar email → phone → Facebook → Instagram
  → logo → الرئيسية → من نحن → المنتجات (button) → حلولنا → الأنظمة الجاهزة
  → مشاريعنا → تواصل معنا — logical, matches visual order.
- Focus visible: **2 px solid `#0081FB` outline, 2 px offset** on every
  focused element (measured on all 12 tab stops).
- Mega menu: hover / click / keyboard open; Escape closes (both focus paths
  verified); `aria-expanded` / `aria-haspopup` present.
- Drawer: Escape closes, focus trap + scroll lock (source + runtime verified).
- Lightbox: Escape / × close, body scroll restores.
- Drawer and lightbox are `role="dialog"` with `aria-label`; navs carry
  `aria-label` (Primary / Mobile / Language); mega menu is `role="region"`.

## 6. Alt text / headings / semantics

- `<img>`: 2,055 total, **0 missing `alt`**, 690 empty `alt=""` (decorative:
  emblems, icons, wordmark-adjacent images). Hero and product images carry
  descriptive alts.
- Headings: 19 pages without exactly one `<h1>` — **18 agency pages have 0
  `<h1>`** (first heading is `h2` "المنتجات — Deye") — **D-9 (MINOR)**; the
  root `index.html` (locale redirect) also has 0, which is expected.
- `<html lang>/<html dir>`: **wrong on EN/ZH — `lang="ar" dir="rtl"` on all
  231 files** (D-1, CRITICAL). This is the single largest accessibility /
  i18n defect in the build.
- No secrets in the built output: literal credential scan of `out/` found no
  API keys/passwords. Note: `src/components/AdminClient.tsx:11` holds a
  hardcoded **demo** password (`ghamdan-2026`); the literal string does not
  appear in `out/` (only the localStorage key `gts_admin_demo` ships in the
  admin chunk). Demo-only, no network/data behind it — remove before any real
  admin exists.

## 7. Verdict

Performance is acceptable for a content site but heavy for the target market
(Yemen mobile networks): ~4–5.3 MB per page locally, dominated by the 1 MB
logo preload, ~850 KB JS, and dead assets. Fixing D-3 (logo) and D-4 (dead
assets) removes ~5 MB of the 58 MB build and ~1 MB per page load.
Accessibility is good on Arabic pages (contrast, focus, keyboard, alt text,
reduced motion) and **broken on English/Chinese pages** (D-1) plus the
agency `<h1>` gap (D-9).
