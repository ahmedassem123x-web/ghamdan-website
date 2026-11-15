# Visual QA Report — GTS Website v15 (Phase 8)

**Build under test:** `~/workspace/ghamdan-website-v2/out/` (231 HTML, built
2026-11-15 ~02:15 +03), served locally on `http://127.0.0.1:8321`.
Screenshots: `docs/qa/screenshots/v15/` — `desktop/` (1440×900 viewport +
full-page), `mobile/` (390×844), `tablet/` (820×1000), `interactions/`,
`motion/`. Reference images:
`~/workspace/ghamdan-website/incoming/extracted/ui-reference-01…10` (four
different sample brands — layout/shape/design fidelity judged, not brand
text). All 10 references were inspected by the QA agent directly.

**Verdict scale:** PASS = matches the reference layout/shape and the locked
decisions, no material mismatch. PARTIAL = structure matches but one or more
named mismatches remain. FAIL = a structural or usability break on that
viewport.

## 1. Per-page verdicts (Arabic, the default locale)

| Page | Desktop 1440 | Tablet 820 | Mobile 390 | Notes |
|---|---|---|---|---|
| 01 Home | **PARTIAL** | **PASS** | **PASS** | Hero subject villa+mountains, not villa+sea (H-2, known). Marquee navy bg/white text vs ref white/black (D-5 open decision). Otherwise faithful: centered navy headline on bright sky, badge, navy WhatsApp pill, intro + 3 pillars + faint line art, 2×2 solution cards, why-us band, panoramic band, 3 featured products, agencies preview, navy CTA, footer with giant GHAMDAN wordmark. |
| 02 About | **PASS** | **PASS** | **PASS** | Split hero text-left / photo-right (villa + sea — the correct ref subject), statement + 3 pillars, story split, mission/vision, 3 expertise cards, navy photo CTA. |
| 03 Solutions | **PASS** | **PASS** | **PASS** | Split hero text-right / photo-left (villa + mountains), centered intro, 5 alternating editorial rows, 4-step process, full-width photo CTA band. |
| 04 Products | **PASS** | **PASS** | **PASS** | Split hero text-left / photo-right (panel + pump + water + mountains), no eyebrow pill (R-5), trust row, guidance bar, search, All-Products tab strip (All 37 first/active + 8 categories with counts), 37-product grid, help banner, 4 why-us features. Product cards repeat the same 4 stand-in photos (M-4, known). |
| 05 Projects | **PARTIAL** | **PARTIAL** | **PARTIAL** | Full-width hero, text top-left — composition matches, but treatment differs from ref: white text on 60% navy overlay over an **aerial** solar-farm photo, vs ref dark text on bright **ground-level** photo (measured decision, 7.32:1). Honest empty state ("مشاريعنا قيد التوثيق") is correct, but the page has a large blank band between the intro and the empty-state card. No filter pills / rows / carousel — correctly omitted (no approved projects). |
| 06 Product detail | **PARTIAL** | **PARTIAL** | **PARTIAL** | Split layout (text left, gallery right), breadcrumbs, H1, policy banner, 2 CTAs, 3 feature cards, spec table with real values (C-2 PASS), related products, navy CTA. Mismatches: gallery photo is a stand-in panel structure, not the product (M-4, known); **caption duplicated** — same "(CI-06) صورة توضيحية…" text as overlay AND as a line below the image (D-7); related products all share one photo (M-4). |
| 07 Contact | **PASS** | **PASS** | **PASS** | Split hero text-right / photo-left, 3 contact-option cards, form split (photo panel + name/email/type/message/submit). Hero photo at this crop shows ground panels + sky; the house in `house-bright.webp` is not visible in the rendered crop (minor image-crop gap vs ref-07 house). |
| 08 Category | **PARTIAL** | **PARTIAL** | **PARTIAL** | Split hero text-right / photo-left, tab strip with counts, filter bar, product grid, related categories, navy WhatsApp CTA. **Breadcrumb first crumb is a full sentence** instead of "الرئيسية" (D-5, all 24 category pages). Tab strip overflows the viewport edge — scrollable, but the cut-off tab has no visible scroll affordance. Zero-count categories render honest empty states. |
| 09 Solution detail (pumping) | **PASS** | **PASS** | **PASS** | Split hero text-right / photo-left (panels + blue pump + water — matches ref-09 subject), overview split + 3 mini-features, challenges band (4 cards), 4-step flow cards 01–04, isometric 3D system scene (canvas) with HTML legend + illustrative note, 3 application cards, related products + "قصص نجاح ملهمة" card, navy WhatsApp CTA. The success-stories heading links to the honest empty projects page (body copy is honest). |
| 10 Project detail | **— (no route, ADR-04)** | — | — | Correctly absent: no approved project evidence. `/projects` honest empty state verified instead (see 05). `ProjectDetailTemplate.tsx` exists unwired in source only. |

## 2. English / Chinese (all viewports) — FAIL

**D-1 (CRITICAL):** every EN and ZH page renders `<html lang="ar"
dir="rtl">`. The whole EN/ZH site is laid out right-to-left: the header is
mirrored (logo right, nav Home-first from the right, WhatsApp pill left),
`text-align: start` resolves to the right, and screen readers/SEO see
Arabic. Evidence: `docs/qa/screenshots/v15/desktop/desktop-home-en.png`
(mirrored header; "Ready-made Systems" wraps to 2 lines), `mobile-home-en.png`
and `mobile-home-zh.png` (drawer sliver + clipped hero headline).
**D-2 (CRITICAL):** on EN/ZH below the `lg` breakpoint, a **58.5 px sliver of
the closed mobile drawer** is visible on the left edge of every page
(measured: panel rect `right: 58.5`, `left: -273`; pixel scan of the
screenshots: first non-white x = 58). Root cause is D-1: `start-0` positions
the drawer on the right in RTL, and `-translate-x-full` then leaves
`390 − 331.5 = 58.5 px` peeking in. Arabic pages are unaffected (panel rect
`x: 390`, fully off-screen).

Root cause (source): `src/app/layout.tsx` reads `params.locale`, but the root
layout sits **above** the `[locale]` segment, so `locale` is always
`undefined` and the code falls back to `lang="ar" dir="rtl"` for every page.
Verified in the built output: **0 of 231 HTML files** have `lang="en"` or
`lang="zh"`.

## 3. Shared shell

- **Header (C-1): PASS.** Opaque white at scroll 0 and at every scroll
  position (measured `rgb(255,255,255)`, 76 px, pinned `top: 0` after scroll),
  dark navy links, emblem + "غمدان / GHAMDAN — GTS" wordmark, TopBar with
  phone/email/hours, green WhatsApp pill, 3-locale switcher. The ref-01
  transparent header was deliberately not reintroduced (ADR-03).
- **Logo: PASS.** Transparent emblem `gts-emblem-transparent.png` in header
  (43×44) and footer (118×120); never a navy square tile on a white header.
  At 44 px the ring + GTS read clearly; the embedded lines become texture,
  as the brand agent predicted — the HTML wordmark beside it carries the name.
  (Perf note: the file is 1,029 KB — see D-3 in the deployment report.)
- **Desktop burger:** a hamburger icon sits at the far left of the header at
  1440 px even though the full nav is visible; clicking it opens the same
  mobile drawer. Unusual vs the references (no burger on desktop) but
  functional; not filed as a defect.
- **Mega menu: PASS.** Hover/click/keyboard opens; all 8 categories with
  counts + 3 bundles + "اكتشف المزيد"; Escape closes (both focus paths
  verified). Screenshot: `interactions/desktop-mega-menu.png`.
- **Mobile drawer: PASS on AR.** Slides from the RTL start, backdrop, nav
  links + products accordion + language switcher + WhatsApp CTA, × button,
  Escape closes, focus trap + scroll lock. Screenshot:
  `interactions/mobile-drawer-open.png`. EN/ZH: FAIL per §2 (D-2).
- **Footer: PASS.** Logo + nav + contact + social + legal + giant pale
  GHAMDAN wordmark on every page; RTL correct on AR.
- **Language switcher: PASS functionally** (lands on the equivalent page in
  the chosen locale); **FAIL on document semantics** (D-1).

## 4. Hero treatments (M-3 table — full-width only 01/05/10; split elsewhere)

| Page | Expected | Implemented | Verdict |
|---|---|---|---|
| 01 Home | full-width, centered, black headline, no dark overlay | full-width, centered, navy headline on bright sky, white gradient scrim, navy WhatsApp pill | PASS (subject differs: mountains, not sea — H-2) |
| 02 About | split, text left / photo right | split, text left / photo right | PASS |
| 03 Solutions | split, text right / photo left | split, text right / photo left | PASS |
| 04 Products | split, text left / photo right | split, text left / photo right | PASS |
| 05 Projects | full-width, text top-left | full-width, text top-left, white on 60% navy overlay | PARTIAL (overlay + aerial photo vs ref dark-on-bright ground-level) |
| 06 Product detail | split, text left / product photo right | split, text left / gallery right | PARTIAL (stand-in photo, M-4) |
| 07 Contact | split, text right / photo left | split, text right / photo left | PASS (house not visible in crop) |
| 08 Category | split, text right / photo left | split, text right / photo left | PASS |
| 09 Pumping | split, text right / photo left | split, text right / photo left | PASS |
| 10 Project detail | full-width | no route (ADR-04) | — |

## 5. Specific checks

- **C-1 header:** PASS on all locales/viewports (measured, §3).
- **C-2 spec labels:** PASS — 111/111 built pages correct; p28 duplicate
  «السلامة» confirmed as the known flag.
- **M-1 gallery:** PASS — large 4:3 single image, lightbox works; caption
  duplicated (D-7).
- **M-2 hero:** PASS — home navy-on-sky, projects white-on-60%-overlay,
  split heroes clean.
- **RTL (AR pages):** correct — breadcrumbs, nav, cards, tables, and the
  SystemDiagram chain all read RTL; the diagram chain itself flows LTR by
  design (technical diagrams are not mirrored).
- **ZH pages:** render with the documented fallback stack (no CJK webfont);
  no tofu boxes observed in the mobile ZH screenshot; **but the whole ZH
  site is RTL (D-1)**.
- **No blank sections:** none observed in full-page captures (desktop 10
  pages) or JS-disabled load.

## 6. Screenshot inventory

`docs/qa/screenshots/v15/` — 57 PNGs: `desktop/` 10 viewport + 10 full-page
+ `desktop-home-en.png`, `desktop-home-zh.png`, `desktop-products-en.png`;
`mobile/` 12 (10 pages + home-en + home-zh); `tablet/` 10;
`interactions/` mega menu, desktop burger, mobile drawer, mobile lightbox,
mobile sticky bar; `motion/` 3D section, reduced-motion, no-JS home/pumping.
Note: the first `tablet-products.png` caught the hero mid-animation (H1
clipped); it was replaced with a clean re-take
(`tablet-products.png`, verified H1 top 144 px vs header bottom 64 px).
