# Motion QA Report — GTS Website v15 (Phase 8)

**Build under test:** `~/workspace/ghamdan-website-v2/out/` (built 2026-11-15
~02:15 +03), served locally on `http://127.0.0.1:8321`. Checklists:
`docs/motion-system.md` §9 and `docs/3d-and-illustration-plan.md` §4.
Evidence screenshots: `docs/qa/screenshots/v15/motion/`.

## 1. Progressive enhancement / blank-before-reveal (v15 §10.10) — PASS

- No CSS hides content: the old `html.js .reveal` rule and `.reveal--in`
  rescue were deleted in Phase 6 (verified by grep in the coordinator notes;
  the only remaining `opacity: 0` in `globals.css` are the closed-drawer
  backdrop and the mega-menu entrance keyframe — discrete UI states, not
  content).
- **JS disabled** (`javaScriptEnabled: false`, desktop 1440×900): all 5
  homepage `[data-reveal]` sections render with `opacity: 1`,
  `visibility: visible`, heights 677 / 764 / 512 / 724 / 418 px; H1 visible.
  Screenshot `motion/nojs-home.png` is pixel-identical in structure to the
  JS home. Pumping with JS disabled: no canvas, SVG diagram present,
  illustrative note present.
- **Direct load:** hero visible at scroll 0 on every reference page (all
  viewport screenshots).
- **Full-page captures:** no blank sections on any of the 10 desktop
  full-page screenshots.

## 2. Scroll reveals (homepage) — PASS

- `data-reveal` ×10 per locale home (5 sections × rendered + flight
  payload), wired on the 5 homepage content sections only (coordinator
  decision; other templates are static-visible, an acceptable baseline).
- GSAP applies `fromTo` reveals only after a successful dynamic import;
  GSAP failure leaves content visible by design.
- Measured: sections start at `opacity: 1` before GSAP initialises; reveal
  runs once on scroll into view (top 88%).

## 3. Hero entrance — PASS

- `.hero__anim` elements animate via GSAP after init; hero is fully visible
  at scroll 0 with and without JS. One timing note: the first
  `tablet-products.png` capture caught the H1 mid-entrance (first line
  clipped); a re-take 3 s after load shows the H1 complete (top 144 px vs
  header bottom 64 px). Screenshot artifact, not a defect.

## 4. SolarLineArt path drawing — PASS

- 3 `data-draw` paths on the home intro. Measured `stroke-dashoffset`:
  `3625 / 840 / 1200 px` (fully hidden) before scroll, **`0 px` after
  scrolling the section into view** — the draw animation runs to completion.
  The line art is faint by design (very low contrast, decorative,
  `aria-hidden`) and visible behind the pillars in `full-desktop-home.png`.

## 5. SystemDiagram flow animation — PASS

- Redrawn isometric tiles, Lucide icons in white badges, zero emoji.
- Systems bundle page (`/ar/systems/bundle-1`): 3 `data-flow` connectors,
  `stroke-dasharray "7, 7"`, `stroke-dashoffset` animating (`-7 px` — slow
  dashed drift running). Pumping SSR fallback carries 4 `data-flow`
  connectors (5-node chain). Chain flows LTR in all locales by design.
- Illustrative note present in all 3 locales ("رسم توضيحي — مخطط مفاهيمي
  وليس رسماً هندسياً بمقياس." / equivalents).
- `overflow-x-auto` wrapper on narrow screens; the diagram fits at 820 px
  without document overflow (probe: 0 overflow).

## 6. 3D scene — EnergySystemScene (pumping page only) — PASS

| Check | Result | Evidence |
|---|---|---|
| Canvas renders (desktop) | **PASS** | `<canvas>` 1222×764, visible, WebGL2 available, three.js chunk `3-d1rft_59n9h.js` (743 KB) loaded; screenshot `motion/pumping-3d-section.png` shows the isometric scene (panel, controller, pump, tank, house, blue flow line) + HTML legend + illustrative note |
| Canvas on mobile | Not directly screenshot-verified at 390 px (canvas measured at desktop only); the scene is DPR-capped and the page has no overflow on mobile | Open item — see §8 |
| SVG fallback (SSR / no-JS) | **PASS** | No-JS pumping: no canvas, SVG diagram present with note; SSR HTML contains the fallback (4 `data-flow` attrs) |
| Reduced motion → SVG fallback | **PASS** | `reducedMotion: reduce` context: no canvas, SVG present, three.js chunk **not** loaded |
| WebGL fail → SVG fallback | Code-verified (import/WebGL failure falls back to `SystemDiagram`); not forced at runtime in this environment (SwiftShader WebGL works) | Static-only |
| Pause off-screen / tab-hidden | Code-verified: `IntersectionObserver` pause + `visibilitychange` listener + full disposal in `src/components/three/EnergySystemScene.tsx` (lines 339–372); rAF pause not measured at runtime | Static-only |
| DPR cap | Code-verified: `min(devicePixelRatio, 1.5 coarse / 2 desktop)` (line 67) | Static-only |
| Systems bundle pages keep SVG | **PASS** | `/ar/systems/bundle-1` renders the SVG `SystemDiagram` (no canvas, no three.js chunk) |

## 7. Marquee — PASS

- CSS-only (`@keyframes marquee-x`, `.marquee__track`, `globals.css:275-287`,
  30 s linear infinite); GSAP never touches it (single owner). Reduced-motion
  CSS forces the marquee animation to `0.01 ms`. Styling note: implemented
  navy bg / white text vs ref-01 white bg / black text — open decision D-5,
  not a motion defect.

## 8. Reduced motion — PASS

- `prefers-reduced-motion: reduce`: `MotionProvider` returns before
  importing GSAP or Lenis (measured: no GSAP resource loaded); all 5 home
  `[data-reveal]` sections `opacity: 1`; 3D scene stays on the SVG fallback;
  marquee and mega-menu entrance animations disabled by CSS.
- Screenshot: `motion/reduced-motion-home.png`, `motion/pumping-reduced-motion.png`.

## 9. Lenis / GSAP ownership — PASS (static + runtime)

- GSAP + ScrollTrigger are the sole scroll choreography, imported only in
  `src/lib/motion.tsx` (dynamic import). Lenis runs only via the GSAP ticker
  (one rAF loop); no other `requestAnimationFrame` / `setInterval` loops in
  `src/`. No pinning, scrubbing, blank spacers, or long mobile sequences.
  Lenis is absent on coarse-pointer (mobile) — native scroll. No two
  libraries animate the same property on one element (marquee is CSS-only).

## 10. Open items

- 3D scene on **narrow mobile (390 px)**: canvas presence/size not
  screenshot-verified (desktop only). The pumping page has 0 mobile overflow
  and the scene is DPR-capped; a mobile visual check is still open (Ahmed's
  phone test can cover it).
- 3D **pause off-screen** and **WebGL-fail fallback**: code-verified only,
  not measured at runtime in this environment.
- Slow-network capture: not run as a separate throttled pass; JS-disabled +
  full-page captures cover the no-blank requirement. A throttled-network
  screenshot is a nice-to-have, not a gate.
