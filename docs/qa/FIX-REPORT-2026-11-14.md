# Ghamdan v2 — Fix Round Report (QA-REPORT-2026-11-14 items 1–4)

**Date:** 2026-11-14 (fixes applied ~12:44–12:50 UTC, build 12:45 UTC)
**Scope:** items 1–4 only (C-2, C-1, M-1, M-2). M-3 and minors NOT touched.
**Live site / repo:** NOT touched (no wipe, no push). Local `out/` only.

## Result summary

| Item | Status | Evidence |
|---|---|---|
| C-2 copy-key shift | ✅ FIXED + verified | Data script assertion (37/37 blocks) + built-HTML check (111/111 pages) |
| C-1 home header at scroll 0 | ✅ FIXED + verified statically | Built HTML: solid white header, dark nav; visual screenshot BLOCKED (see §5) |
| M-1 product hero thumbnail | ✅ FIXED + verified statically | Built HTML: 0 thumbnail grids, 2 large images on p02; screenshot BLOCKED |
| M-2 home hero overlay | ✅ FIXED + verified statically | Built HTML: `bg-primary-deep/55` = 0, `/25` present; screenshot BLOCKED |
| Rebuild | ✅ EXIT 0 | 231 HTML files, `tsc --noEmit` clean |
| Full probe (0 errors) | ⛔ BLOCKED | Chromium cannot launch (SIGTRAP, host memory 125–148 MB free) — see §5 |

## 1. C-2 — productDetail copy keys (FIXED)

**File:** `src/data/pages.ts`, `productDetail` blocks. Script: `/tmp/fix-c2.py`
(backup of pre-fix file: `/tmp/pages.ts.bak`).

**Correction to the QA report's counts:** there are **37** productDetail blocks
(p01–p29, p31–p38; no p30), not 38 — and **33** needed fixing, not 34.
Correct and untouched: p01, p06, p14, p28.

**Fix applied per block:**
- 27× one-extra: dropped k1 (CI-02 specs note), renumbered k2..k17 → k1..k16.
- 5× two-extra (p02, p03, p05, p24, p25): dropped k1 (CI-02 note); the
  "منتج مؤكد عند غمدان." note moved k2 → k1 (where it belongs, as in
  p06/p14/p28); renumbered k3..k17 → k2..k16.
- p11 (special): the benefits heading was MISSING entirely (k2 held the
  availability note). Replaced k1 with p01's k1 (availability note) and k2
  with p01's k2 ("المميزات الرئيسية"); k3..k16 were already aligned.
- **p38 404-string: NOT a defect.** Proper block-boundary parsing shows p38 is
  a standard one-extra block. The string "ربما نُقل الرابط أو حُذف..." lives
  in `notFound.k2` (legitimate 404-page copy, line ~4849) — it was a
  block-boundary overrun in the earlier parse, the same class of error the QA
  report itself warned about. Left untouched, verified intact.

**Verification:**
- Post-fix assertion in the fix script: all 37 blocks have exactly k1..k16
  with values equal to the p01 template (k1 ∈ {availability note,
  confirmed note}); 0 CI-02 notes and 0 `k17` keys remain in `productDetail`.
- Built-HTML check (`/tmp/verify-c2.py`): all **111 product pages**
  (37 products × AR/EN/ZH) show the template labels in the right slots —
  benefits h2, overview eyebrow ("نظرة عامة" / "Overview"), specs h2
  ("المواصفات الفنية" / "Technical Specifications"), related h2, CTA title
  ("لنبدأ مشروعك اليوم"), inquiry pill, trust card 1 ("جودة موثقة"),
  gallery caption. (Two script bugs found and fixed during verification:
  CTA title is also an `h2` with the same classes; React escapes `'` as
  `&#x27;`; `must-pc18` legitimately has no related-products section.)
- Spot check p02 (`deye-sun-sg04lp1-6kw`, AR): eyebrow "نظرة عامة", specs
  heading "المواصفات الفنية", related "منتجات ذات صلة", CTA "لنبدأ مشروعك
  اليوم" — all correct (before the fix they read "السبت – الجمعة" /
  "نظرة عامة" / "المواصفات الفنية" / "منتجات ذات صلة" respectively).

## 2. C-1 — home header invisible at scroll 0 (FIXED)

**File:** `src/components/Header.tsx`. Fix: solid header from the start
(the option the task allows; it preserves the reference look once scrolled,
which is exactly the solid-white header).

- Removed the transparent-header mechanism entirely: `overPhoto` state +
  `document.querySelector("[data-photo-hero]")`, `scrolled` state + scroll
  listener, and the `transparent` conditional.
- Header is now always `site-header site-header--scrolled sticky top-0 z-50
  bg-white`; Wordmark always `variant="light"`; nav links dark
  (`text-text`, active `text-accent`); burger always `text-primary`.
- Comment updated with the reason + the rule for reintroducing transparency
  (only if a hero is ever pulled under the header).
- `src/components/Hero.tsx` comment updated: `data-photo-hero` is now
  documented as a hook for future use, not a header trigger. The attribute
  itself is left in place (inert).

**Verification (static — visual screenshot blocked, see §5):** in
`out/ar.html` the SSR header is
`<header class="site-header site-header--scrolled sticky top-0 z-50 bg-white">`
with dark nav classes; the single `text-white` inside the header is the
WhatsApp pill (`bg-primary text-white`, correct); the single
`bg-transparent` in `ar.html` is an outline ghost button elsewhere on the
page, not the header.

## 3. M-1 — product hero thumbnail (FIXED)

**File:** `src/components/Gallery.tsx`. With one image, render it large
(full-width button, `aspect-[4/3]`, same caption overlay + lightbox on
click); the thumbnail grid applies only with 2+ images. Multi-image
behaviour unchanged. Gallery is used only on product detail (2 instances,
same single item), so both the hero and the specs-section image are large
now, per spec §3.6.

**Verification (static):** in `out/ar/products/deye-sun-sg04lp1-6kw.html`:
thumbnail-grid class occurrences = 0; large single-image buttons = 2;
large gallery images = 2; inverter photo present.

## 4. M-2 — home hero overlay (FIXED)

**File:** `src/components/Hero.tsx`, `center` variant only (home).
`bg-primary-deep/55` → `bg-primary-deep/25`. Ref 01 is bright daylight
(white villa + panels under a pale-blue sky, text over the sky); the 55%
navy overlay was the cause of the dark/moody render. 25% keeps the white
hero copy legible while letting the daylight photo read bright. The
`photo-bg` variant (`/60`) was NOT touched — M-2 is about the home hero
only, and no other page uses `photo-bg` as a hero today.

**Verification (static):** `bg-primary-deep/55` = 0 occurrences in
`out/ar.html`; `bg-primary-deep/25` present (rendered div + RSC payload).

## 5. BLOCKED — visual screenshots + full probe (environment, not code)

Chromium (Playwright headless-shell) **cannot launch at all** in the current
environment, so no new screenshots and no full-probe re-run were possible.

- First full-probe attempt (`tools/probe.mjs`, 12:47 UTC): died silently
  after ~6.4 min mid-loop, exit 1, no error output, no results written
  (the 12:22 `probe-results.json` on disk is the OLD run — do not mistake
  it for a re-verification).
- Screenshot attempts (×4, incl. `--single-process` minimal launch, with
  90 s and 4 min waits): every launch crashes with SIGTRAP
  (`browserType.launch: Target page, context or browser has been closed`,
  `signal=SIGTRAP`).
- File writes fail intermittently with EPERM (e.g. Python writes to /tmp
  and workspace, 6/6 retries failed at ~12:55 UTC; `muse.write` still
  works). This is the same degraded state documented in
  `docs/qa/BLOCKER-EPERM-2026-11-14.md` (which also lists a Chromium
  SIGTRAP launch crash as a symptom).
- Host memory is the correlate: **125–148 MB free of 7934 MB** at every
  check during this round (the blocker doc cites 137–256 MB free during
  the morning degradation). Memory is falling, not recovering (343 → 148
  → 125 MB across the session). Nothing in this cell can free host memory.

**What this blocks:** only the *visual* confirmation (header readable at
scroll 0 desktop + mobile; hero brighter; large product photo) and the
full-probe 0-errors re-run. All four fixes are in the source, in the
passing build, and verified in the built HTML as documented above. When
the environment recovers (check `free -m` + a test write + a Chromium
launch first), re-run `node tools/probe.mjs` and take the 4 screenshots
(home desktop/mobile at scroll 0, product detail desktop/mobile) before
presenting the round as fully verified.

## 6. Not touched (per task)

- M-3 hero-treatment decision (split vs full-bleed) — needs Ahmed's call.
- Minors m-1…m-7. M-4 related-photo repetition unchanged.
- Live Vercel site, repo (no wipe, no push). Local static server
  (`node tools/serve.mjs 8321`, PID 9275, from the QA session) still
  serving the new `out/` — verified via curl (new labels, solid header,
  `/25` overlay).

## Files changed

- `src/data/pages.ts` — C-2 (33 blocks realigned; 4 untouched)
- `src/components/Header.tsx` — C-1 (solid header)
- `src/components/Gallery.tsx` — M-1 (single image large)
- `src/components/Hero.tsx` — M-2 (overlay /55 → /25) + stale comment
- Build: `npm run build` EXIT 0, 231 HTML files; `tsc --noEmit` clean
- Scripts (not in repo): `/tmp/fix-c2.py`, `/tmp/verify-c2.py`,
  `/tmp/verify-shots.mjs`, `/tmp/shot-one.mjs`
