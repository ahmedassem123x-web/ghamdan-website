# 3D and Illustration Plan — Ghamdan (GTS) Website v2 (v15 Phase 6)

**Status:** Phase 6 decision + implementation record, 2026-11-15 (Asia/Aden).
**Decision: PROCEED — one scene, vanilla Three.js.** (Evidence in §1.)
**No build was run in Phase 6** (coordinator owns the single build) and
no screenshot was captured. The scene is **not verified live**; the
coordinator's build + Phase 8 QA are the gate. Do not present the scene
as working until that gate passes.

**Sources:** v15 §10.6, §10.7, §11; `docs/technology-responsibility-map.md`
§3 (Three.js/R3F row); `docs/page-architecture.md` §T6;
`docs/visual-gap-analysis.md` §2 (U-3/U-4).

---

## 1. The 3D decision — proceed, with evidence

| Question | Evidence (2026-11-15) |
|---|---|
| Is Three.js available? | `npm view three@0.187.0` → `0.187.0` (registry reachable). Installed: `three@0.187.0` (dependency) + `@types/three@0.187.0` (devDependency). Lockfile updated. |
| React 19 / Next 16 compatible? | Vanilla `three` has **no React peer dependency**, so there is no React 19 / Next 16 compat question at all. (R3F 9.8.2 also exists on the registry and requires React 19, which the site has — but see the next row for why it was not chosen.) |
| Why vanilla three, not React Three Fiber? | (a) No reconciler in the static export — fewer moving parts, no `react-reconciler`/`zustand` in the bundle. (b) Smaller bundle: `three` only, loaded on demand. (c) Full explicit control of the render loop, DPR cap, pause rules, and disposal — the spec's §10.6 performance rules are easier to prove in imperative code. (d) The scene is simple geometry (boxes, cylinders, cones); R3F's declarative value is small here. Recorded as a deliberate choice, not a limitation. |
| Does it hurt the build? | **Not verified in Phase 6** (no build run by design). Mitigations: `three` is dynamically imported inside a client effect — it is not in the initial bundle and not in any SSR path; the component's static code is ~16 KB. The coordinator's build is the gate; if the build regresses, the fallback (below) means the page still ships complete. |
| Perf? | **Not measured live.** Design caps: DPR 1.5 on coarse pointers / 2 otherwise; no shadows, no post-processing, Lambert materials, ~40 meshes, one small orthographic scene; loop pauses off-screen and on tab-hidden. See §3. |
| Typecheck? | `npx tsc --noEmit --incremental false` → **exit 0, no errors** (after the `three` install + scene). |

**Deferred, not rejected:** Scene A (solar-array landscape) and Scene C
(water pumping / irrigation) are not built in this phase — max 1 scene
was the Phase 6 cap, and Scene B fits an existing page best (below). A
second scene needs a new decision, not a drive-by addition.

**Intentionally not used** (v15 §10.3–10.5, §10.8): Motion
(framer-motion), Lottie, Anime.js, Remotion/HyperFrames (runtime).
GSAP covers their roles; discrete UI states are CSS-owned. Recorded in
`docs/motion-system.md` §3.

---

## 2. The scene — `src/components/three/EnergySystemScene.tsx`

**Choice: Scene B — isometric energy system** (panels → inverter →
battery → loads). It fits the pumping solution detail page's "how the
system works" moment, where the page already has the 5-node chain and
the SVG diagram. Scene A (landscape) would have duplicated the home's
panoramic photo band; Scene C would have duplicated the pumping page's
own photography.

**Placement (coordinator wiring, one-line swap):** in
`src/app/[locale]/solutions/[slug]/page.tsx`, pumping diagram section,
replace
`<SystemDiagram locale={l} nodes={[...]} caption={...} />`
with
`<EnergySystemScene locale={l} nodes={[...]} caption={...} />`
— identical props. The scene may also be used in
`src/app/[locale]/systems/[slug]/page.tsx` (4-node chain) with the same
swap; that is a coordinator call, not a second scene.

**Geometry (all generic, illustrative):** orthographic camera (true
isometric feel), position (11, 10, 11), lookAt (0, 0.6, 0). One object
per node, resolved by `diagramKindFor` (single source of truth, exported
from `SystemDiagram.tsx`): panels = tilted dark-navy slab + frame edges
on legs; device (inverter/controller) = white box + dark screen + green
status dot; pump = blue cylinder + cap + pipe; tank = white cylinder +
blue band + cone roof; battery = navy box + cyan charge bars; house =
white box + blue pyramid roof + warm window. Ground plane, soft ellipse
shadows, hemisphere + directional light, Lambert materials. Energy flow:
a tube along the node tops + 3 dots travelling it (full traverse ~12 s,
slow and restrained).

**Fallbacks (in priority order — the SVG diagram is the fallback):**
1. SSR / JS disabled → the static export serves the `SystemDiagram` SVG.
2. `prefers-reduced-motion` → SVG, no canvas, no loop (checked before
   any import).
3. No `WebGLRenderingContext` → SVG.
4. `three` import fails, renderer creation fails, or any build error
   inside the effect → caught, SVG stays. Nothing throws to the page.
5. Canvas active → the SVG is replaced by the canvas + an **HTML legend**
   (Lucide icon + label per node, in order) + the illustrative note.
   Critical text is HTML, never in the canvas.

**Performance rules (implemented, not just planned):**
- Dynamic `import("three")` inside `useEffect` — chunk loads only on the
  client, after mount.
- `renderer.setAnimationLoop` (three's own loop; nothing else drives it).
- Pause when off-screen (`IntersectionObserver`, threshold 0.05) and
  when the tab is hidden (`visibilitychange`).
- DPR capped: `min(devicePixelRatio, 1.5)` on coarse pointers, `2`
  otherwise. `powerPreference: "low-power"`, `antialias: true`.
- No shadows, no post-processing, no textures.
- Full disposal on unmount: loop stopped, observers disconnected,
  listener removed, every geometry/material disposed, `renderer.dispose()`,
  canvas removed from the DOM.
- Container: `aspect-[16/10]`, `ResizeObserver` keeps the orthographic
  frustum and renderer size in sync.

**Illustrative-only:** generic object types per node kind — never the
internal design of a real branded product, no capacities, pressures,
depths, or performance claims. The HTML note under the scene (ar/en/zh)
says so, in both modes.

---

## 3. SVG / vector scenes (no WebGL needed)

| Asset | File | State in Phase 6 |
|---|---|---|
| Solar line-art (home intro) | `src/components/SolarLineArt.tsx` | Kept. Verified crisp by construction (pure vector, `viewBox 0 0 1200 120`, 1.5 px strokes, `currentColor`). Paths carry `data-draw`; `MotionProvider` draws them with GSAP stroke-dashoffset after init (JS-only — fully drawn without JS). Decorative, `aria-hidden`, very low contrast by design. |
| System diagram (pumping + systems detail) | `src/components/SystemDiagram.tsx` | **Redrawn in Phase 6** (visual-gap-analysis U-3/U-4). Was a flat node chain with emoji/text-glyph icons (☀ ⚙ ↧ ▮ ⌂). Now: isometric tiles (top rhombus + two side faces + ground shadow), Lucide icons in white badges (glyphs + semantic keys mapped in `diagramIconFor`), flow connectors with arrowheads carrying `data-flow` (GSAP draw + slow dashed drift, `MotionProvider`), labels as SVG text, `<title>` + `aria-label`, `overflow-x-auto` wrapper on narrow screens (labels stay legible), and an explicit "illustrative diagram" note (ar/en/zh). Props API unchanged — both callers work unmodified. 5-node chain preserved on pumping; 4-node on systems detail. Chain flows physically left → right in every locale (technical diagrams are not mirrored for RTL, v15 §12.1). |
| Shared node semantics | Exported from `SystemDiagram.tsx` | `diagramIconFor(key)`, `diagramKindFor(key)`, `DIAGRAM_NOTE` — single source of truth for what a node key means, used by both the SVG and the 3D scene. |

No raster illustration assets were created — the diagrams are
code-built SVG, which is the correct fidelity/performance choice for
line art (v15 §10.7). Nothing was placed under
`public/images/illustrations/`; no `.ai` sources exist to export from.

---

## 4. What is NOT done (open, for the coordinator / Phase 8)

1. **Wiring:** `EnergySystemScene` is built but not placed on any page
   (pages are not Phase 6 files). One-line swap, §2.
2. **Live verification:** no build, no screenshot, no device test in
   Phase 6. Gate: coordinator build → Phase 8 visual QA (desktop
   1440×900, mobile 390×844, narrow mobile, tablet) + reduced-motion +
   WebGL-disabled + low-end Android passes. If the scene regresses the
   build or is visibly broken, revert the one-line swap — the page keeps
   the SVG diagram and loses nothing.
3. **Scenes A and C:** deferred (see §1). Revisit only with a new
   decision and a page that needs them.
4. **Real product 3D models:** none exist and none were invented. A
   genuine model viewer on product detail (§11) requires client-supplied
   models; do not build a fake one.
