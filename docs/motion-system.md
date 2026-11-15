# Motion System — Ghamdan (GTS) Website v2 (v15 Phase 6)

**Status:** Phase 6 implementation record, 2026-11-15 (Asia/Aden).
**Owner:** `src/lib/motion.tsx` (`MotionProvider`) — the sole animation
orchestrator. **No build was run in Phase 6** (coordinator owns the single
build); everything below is source-level. Visual confirmation belongs to
Phase 8.

**Sources:** v15 §10 (esp. §10.10), §11; `docs/technology-responsibility-map.md`
§2/§5; `docs/visual-gap-analysis.md` §5; `docs/page-architecture.md`.

---

## 1. The binding rule — progressive enhancement (v15 §10.10)

1. All content is visible in the initial static render.
2. `MotionProvider` initialises GSAP + ScrollTrigger.
3. Only after successful initialisation are reveal effects applied — **in
   JS only, via `gsap.fromTo`**. No CSS rule hides animated content.
4. If GSAP fails, if JS is absent, or if `prefers-reduced-motion: reduce`
   is set, content simply stays visible. There is no rescue class any
   more, because nothing needs rescuing.

**Phase 6 fix (the blank-before-reveal defect, visual-gap-analysis §5
residual):** the shared primitives `Reveal` / `SectionHeadingL` /
`SectionHeading` / `EmptyState` in `src/components/ui.tsx` no longer
inject the `.reveal` class — they render visible-by-default markup and
carry a `data-reveal` hook instead. The `html.js .reveal { opacity: 0;
transform: translateY(1.5rem) }` hiding rule, the `.reveal--in` rescue
rule, and the reduced-motion `html.js .reveal` override were removed
from `src/app/globals.css`. Grep verification (2026-11-15): no
`opacity: 0` / `visibility: hidden` / `.reveal` hiding remains in
`ui.tsx` or `globals.css` — the only `opacity: 0` left in `globals.css`
are the closed-drawer backdrop (`.drawer__backdrop`) and the mega-menu
entrance keyframe, both discrete UI states owned by their components,
not content reveals. The `js` class is still added to `<html>` by
`MotionProvider`, but it is a presence signal only — no CSS depends on
it any more.

---

## 2. Timing / easing tokens (v15 §10.9, locked ranges)

| Motion | Duration | Easing | Where |
|---|---|---|---|
| Micro-interaction | 120–180 ms | `ease-out` | Drawer 350 ms is the exception (see §6); mega-menu 180 ms |
| Button / hover | 180–250 ms | CSS `transition-* duration-200` | Buttons, cards, links (component-owned CSS) |
| Card transition | 250–400 ms | CSS `duration-200/300` | Card hover lift, image zoom (`group-hover:scale-105`) |
| Section reveal | 450–800 ms | `power3.out` | `[data-reveal]` 0.7 s (0.6 s on coarse pointers); `[data-stagger]` 0.6 s, stagger 0.08 s |
| Hero entrance | 500 ms | `power3.out` | `.hero__anim`, stagger 0.1 s |
| Large visual transition | 650–1100 ms | `power2.inOut` | SVG path drawing: line-art 1.4 s, diagram flow 1.1 s |
| Marquee | 30 s linear infinite | `linear` | CSS only (§6) |

Rules: animate mainly transform + opacity; never delay initial content;
no continuous decorative noise (the one exception is the diagram flow
drift, §5, which is meaningful energy-flow motion and pauses off-screen);
no scroll hijacking; no long scroll sequences on mobile; no pinning at
all in this phase.

---

## 3. Ownership — one animation owner per element/property

| Element / property | Owner | Others must not… |
|---|---|---|
| Scroll reveals `[data-reveal]`, `[data-stagger]`, `.hero__anim` — opacity/transform | GSAP + ScrollTrigger, via `MotionProvider` only | …animate opacity/transform on the same elements (no CSS transitions on those properties there, no second library) |
| SVG path drawing `[data-draw]`, `[data-flow]` — stroke-dashoffset | GSAP, via `MotionProvider` only | …set dash hiding in markup/CSS; the dash is applied in JS after init |
| Smooth scrolling (scroll position) | Lenis, desktop pointer-fine only, driven from GSAP's ticker | …run a second scroll loop or a competing smooth-scroll implementation |
| Discrete UI state (drawer, mega menu, accordion, tabs, dialog, hover/focus) | CSS transitions owned by the component itself | …let GSAP touch drawer/menu/tab state transitions |
| Marquee | CSS keyframes (`globals.css .marquee__track`) | …animate it with GSAP as well — one owner, decided Phase 6 |
| 3D scene loop | Three.js `setAnimationLoop`, inside `EnergySystemScene` only | …drive it from GSAP's ticker or any other loop |
| Line art / technical diagrams (static form) | SVG (`SolarLineArt`, `SystemDiagram`) | …use WebGL for simple vector work |

**Not installed, intentionally** (v15 §10.3–10.5, §10.8; decision recorded
in `docs/3d-and-illustration-plan.md`): Motion (framer-motion), Lottie,
Anime.js, Remotion/HyperFrames (runtime). GSAP covers their roles;
discrete UI states are CSS-owned and work today. Adding any of them
requires a recorded Phase 6+ decision and must not create a second owner
for an already-owned property.

---

## 4. MotionProvider behaviour (`src/lib/motion.tsx`)

Init sequence, every route (the effect depends on `usePathname()`):

1. Add the `js` class to `<html>` (signal only).
2. `prefers-reduced-motion: reduce` → return immediately. No GSAP, no
   Lenis, no hiding. Content visible.
3. Dynamically import `gsap` + `gsap/ScrollTrigger` (never statically
   imported — the animation code is not in the initial bundle path).
   Register the plugin.
4. Lenis (desktop `pointer: fine` only): `lerp: 0.1`, `smoothWheel: true`.
   Driven from `gsap.ticker` (`lenis.raf(time * 1000)`,
   `lagSmoothing(0)`); `lenis.on("scroll", ScrollTrigger.update)`. One
   rAF loop total — verified: no `requestAnimationFrame` / `setInterval`
   / `setTimeout` loop exists anywhere else in `src/`.
5. All GSAP work is created inside one `gsap.context()`: hero entrance,
   `[data-reveal]`, `[data-stagger]`, `[data-draw]`, `[data-flow]`.
6. `ScrollTrigger.refresh()` after setup, after `document.fonts.ready`,
   and on window `load` (positions shift when fonts/images settle).
7. If the GSAP import throws: catch, do nothing. Content was never
   hidden, so there is nothing to reveal.

Cleanup (unmount / route change), in this order:
`gsap.ticker.remove(tick)` → `lenis.destroy()` → `ctx.revert()` →
remove the `load` listener. `ctx.revert()` kills every tween and
ScrollTrigger created in the run and restores the elements' original
(visible) inline styles, so a route change can never leave stale
triggers pointing at detached DOM or duplicate triggers on the new page.

Mobile / coarse pointer: Lenis is not created (native scroll); reveals
use shorter travel (`y: 16` vs `24`, stagger children `14` vs `20`) and
slightly faster duration (0.6 s vs 0.7 s). No pinning, no scrub, no
scroll sequences of any length on mobile.

---

## 5. Animation hooks — inventory (what actually exists)

| Hook | Where it lives | Effect | Fallback |
|---|---|---|---|
| `.hero__anim` | `Hero.tsx` (all hero variants, ~15 pages + Catalogue/Search/Guidance clients) | Load entrance: `fromTo opacity 0→1, y 16→0`, 0.5 s, stagger 0.1 | Visible without JS (no CSS hides it) |
| `[data-reveal]` | The four `ui.tsx` primitives only (`Reveal`, `SectionHeading`, `SectionHeadingL`, `EmptyState`) | Scroll reveal, `top 88%`, `once: true`, 0.7 s | Visible by default; GSAP applies the effect after init |
| `[data-stagger]` | `ProjectDetailTemplate.tsx` only (unwired template, no route) | Group stagger on entry, 0.6 s, stagger 0.08 | Visible by default |
| `[data-draw]` | `SolarLineArt.tsx` (home intro, 3 paths) | Path drawing, 1.4 s, `top 92%`, once | Paths fully drawn without JS |
| `[data-flow]` | `SystemDiagram.tsx` connectors (pumping + systems detail) | Draw 1.1 s on entry (`top 90%`, once), then slow dashed drift (7/7 dash, step 28 = 2 periods, 1.8 s loop) that plays only while the figure is in view and only after the draw completed | Connectors fully drawn without JS; drift is GSAP-only |
| `.marquee__track` | Home marquee (`page.tsx`) | CSS `marquee-x` 30 s linear infinite | Static text if animations are off (reduced-motion disables it) |

**Honest current state:** Phase 4 removed reveal hooks from nearly all
pages, and no page currently renders the four `ui.tsx` primitives, so
today the only scroll animation a visitor sees is the hero entrance,
the line-art draw, and the diagram flow. Section reveals exist as a
working, safe mechanism — wiring `[data-reveal]` into pages is a
coordinator decision for a later pass (see `docs/page-motion-map.md`),
not something Phase 6 did by touching pages it does not own.

---

## 6. Marquee decision (Phase 6)

Owner: **CSS only** (`.marquee__track`, `globals.css`). The technology
map left "GSAP or CSS — decide in Phase 6, one owner only". CSS already
owned it, it is a seamless 30 s linear loop of duplicated content, and
GSAP would add nothing except a second owner. GSAP never animates the
marquee. Reduced-motion disables it (`animation: none`).

---

## 7. Audit findings — motion.tsx + Lenis wiring (Phase 6)

Verified before the rewrite: single rAF loop (GSAP ticker → Lenis),
correct GSAP–Lenis sync (`lenis.on("scroll", ScrollTrigger.update)`),
no competing scroll loops, mobile/reduced-motion fallbacks present,
no pinning, no scrub, no blank spacer regions, no long mobile sequences.
Defects found and fixed:

| # | Finding | Fix |
|---|---|---|
| F-1 | The Lenis GSAP-ticker callback was never removed on unmount — the ticker kept calling `lenis.raf` on a destroyed Lenis (leak / potential throw). | Callback stored and removed with `gsap.ticker.remove(tick)` before `lenis.destroy()`; a `destroyed` guard inside the callback. |
| F-2 | Tweens/ScrollTriggers were never killed on unmount or route change. `MotionProvider` mounts once per layout, so client-side navigation left stale triggers on detached DOM and new-page elements were never set up. | All GSAP work inside one `gsap.context()`; `ctx.revert()` on cleanup; effect re-runs on `usePathname()` change. |
| F-3 | No `ScrollTrigger.refresh()` after fonts/images/layout settled — reveal positions could be stale after webfonts loaded. | Refresh after setup, on `document.fonts.ready`, and on window `load`. |
| F-4 | The IntersectionObserver fallback added a `.reveal--in` class that only worked because CSS used to hide `.reveal`. With the hiding removed it is dead code that implied content could still be hidden. | Fallback removed entirely. GSAP failure now means "no animation", which is the correct behaviour when nothing is hidden. |
| F-5 | `.reveal` was still the selector, and `globals.css` still hid it under `html.js` — the Phase 4 residual. Any future use of the four primitives reintroduced blank sections. | Primitives now emit `data-reveal`; `html.js .reveal` / `.reveal--in` rules deleted (§1). |
| F-6 | `data-stagger` and `.hero__anim` were the only other selectors; both were already JS-applied only (no CSS hiding) — confirmed, kept, and now documented in §5. | No change needed. |

Not changed: Lenis config (`lerp: 0.1`, `smoothWheel: true`,
pointer-fine gate), reveal start (`top 88%`, `once: true`), hero
timing, reduced-motion early return. The `js` class is still added
(signal only).

---

## 8. Reduced motion

- `prefers-reduced-motion: reduce` → `MotionProvider` returns before
  importing GSAP or Lenis. No animation of any kind is applied by JS.
- `globals.css` forces `animation-duration` / `transition-duration` to
  `0.01ms` and disables the marquee and mega-menu entrance animations.
- The 3D scene never starts (`EnergySystemScene` checks the media query
  and stays on the SVG fallback).
- Content is fully visible in all cases; counters/statistics do not exist
  on this site (no verified numbers — none were invented), so there is no
  count-up to freeze at a final value.

---

## 9. Phase 8 verification checklist (not done in Phase 6)

- Direct load, slow network, real scroll, reduced-motion, JS-disabled
  screenshot, full-page capture: no blank sections at any scroll
  position; hero visible at scroll 0.
- Route change (client-side nav) then scroll: reveals fire once, no
  duplicates, no console errors.
- Mobile 390×844 + narrow mobile: no horizontal overflow from the
  diagram (`overflow-x-auto` wrapper), no long scroll sequences, Lenis
  absent (native scroll).
- Fonts loaded late: `ScrollTrigger.refresh()` keeps reveal positions
  correct.
- 3D scene: see `docs/3d-and-illustration-plan.md` — not verified live
  in Phase 6.
