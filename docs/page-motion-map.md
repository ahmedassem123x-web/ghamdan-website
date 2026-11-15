# Page Motion Map — Ghamdan (GTS) Website v2 (v15 Phase 6)

**Status:** Phase 6 record, 2026-11-15 (Asia/Aden). **No build was run in
Phase 6** (coordinator owns the single build); "current" below is the
source state, verified by grep. Visual confirmation belongs to Phase 8.

**Sources:** v15 §11 (baseline mapping), §6; `docs/page-architecture.md`
(templates T1–T11); `docs/visual-gap-analysis.md` (§2, §4);
`docs/motion-system.md` (tokens, ownership, hooks).

**How to read it:** "Motion (current)" is what the source actually does
today — not the §11 target. Where the target is not yet wired, the row
says so plainly. Phase 4 removed reveal hooks from nearly all pages and
no page currently renders the four `ui.tsx` primitives, so most sections
are intentionally static and visible by default. That is the correct
posture after the blank-before-reveal defect: animation is added back
only where it is wired and verified, never by hiding content first.

**Common to every page:** `MotionProvider` (layout) — hero entrance
(`.hero__anim`, load, 0.5 s), Lenis smooth scroll (desktop pointer-fine
only), reduced-motion kill-switch, `ScrollTrigger.refresh()` after fonts
+ load. Fallback for every row is the same: **content fully visible
with JS disabled, with GSAP failed, and under reduced motion** — no
exception. Mobile behaviour for every row: no pinning, no scrub, no
long scroll sequences; Lenis off (native scroll); reveals (where wired)
use shorter travel on coarse pointers. Performance budget per page: no
page loads an animation library statically — GSAP/Lenis/three are all
dynamic imports; the only continuous motion on the site is the CSS
marquee (home) and the diagram flow drift (pumping/systems), both of
which pause under reduced motion (the drift also pauses off-screen).

---

## T1 — Home (`/[locale]`, ref 01)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Hero (full-width, `darkText`) | GSAP `.hero__anim` load entrance (badge, H1, copy, CTAs) | Page load | Visible without JS | Same, native scroll |
| Intro + 3 pillars | None (static, visible by default) | — | — | Stacks, no animation |
| Solar line-art (`SolarLineArt`) | GSAP `[data-draw]` path drawing, 1.4 s | Scroll, `top 92%`, once | Paths fully drawn | Same (faint decorative) |
| Expertise marquee | CSS `marquee-x`, 30 s linear infinite | Continuous | Static text | Same; disabled under reduced motion |
| Editorial cards (2×2) | None (static) | — | — | Stacks |
| Why Choose Us (sky band + 3 cards) | None (static) | — | — | Stacks |
| Panoramic solar-farm band | None (static photo) | — | — | Full-width photo |
| Guidance bar | None (static) | — | — | Stacks |
| Featured products (3 real products) | None (static) | — | — | Grid stacks |
| Brand/partner preview | None (static) | — | — | Stacks |
| Navy CTA band | None (static) | — | — | Stacks |

Target not yet wired (§11: gentle intro reveal, staggered editorial
cards, soft panoramic reveal): available via `[data-reveal]` on the
`ui.tsx` primitives or direct `data-reveal` attributes — coordinator
decision, not done in Phase 6 (pages are not Phase 6 files).

## T2 — Corporate, split hero (About / Solutions / Contact, refs 02/03/07)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks (text above photo) |
| All remaining sections (statement, pillars, story, mission/vision, process, forms, FAQ) | None (static) | — | — | Stack, no animation |

## T3 — Catalogue (`/products`, ref 04)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| Tab strip / search / filters / product grid | None (static; filter changes are instant state, no transition) | — | — | Stacks; tabs scroll horizontally |

## T4 — Product category (`/products/category/[slug]`, ref 08)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| Tab strip / filter bar / grid / related categories | None (static) | — | — | Stacks |

## T5 — Product detail (`/products/[slug]`, ref 06)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Custom split hero (Gallery + summary) | Gallery: CSS image transitions only (component-owned); no GSAP hero entrance on this page (no `Hero` component) | — | — | Gallery stacks above summary |
| Overview / features / spec table / related | None (static) | — | — | Spec table scrolls horizontally inside its container |

## T6 — Solution detail (`/solutions/[slug]`, ref 09)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| Overview / challenges / steps / applications / related | None (static) | — | — | Stacks |
| System diagram (`SystemDiagram`, pumping only) | GSAP `[data-flow]` draw 1.1 s on entry + slow dashed drift while in view | Scroll, `top 90%`, once (draw); viewport toggle (drift) | Connectors fully drawn; SVG is the static illustration | Horizontal scroll inside `overflow-x-auto` wrapper (labels stay legible) |
| 3D scene (`EnergySystemScene`, pumping only) | **Not wired yet** — component built in Phase 6, awaiting coordinator wiring (one-line swap in the pumping diagram section; see `docs/3d-and-illustration-plan.md`) | — | SVG diagram (the component's default) | DPR capped 1.5; pauses off-screen / tab hidden |

## T7 — Systems / bundle detail (`/systems`, `/systems/[slug]`)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero (index) / header block (detail) | Index: GSAP `.hero__anim`; detail: none (custom header, no `Hero`) | Page load | Visible without JS | Stacks |
| Components + `SystemDiagram` (detail) | GSAP `[data-flow]` as T6 | Scroll, `top 90%`, once | Connectors fully drawn | Horizontal scroll wrapper |
| Linked products | None (static) | — | — | Stacks |

## T8 — Projects listing (`/projects`, ref 05)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Full-width hero (`full-left`) | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Text stays in safe area |
| Intro / filter pills / truthful empty state / template preview | None (static) | — | — | Stacks |

## T9 — Project detail (NO ROUTE — template only, ref 10)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| `ProjectDetailTemplate` | `[data-stagger]` on the key-results grid (the only `data-stagger` left in `src/`) | Scroll, `top 88%`, once | Visible by default | Stacks |
| All other template sections | None (static) | — | — | — |

No route exists by design (no invented projects). Motion is wired in
the template and will work if/when a real project is approved and the
route is created.

## T10 — Brands / agencies (`/agencies`, `/agencies/[slug]`)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero (index) | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| Logo grid / brand detail / related products | None (static) | — | — | Stacks |

## T11 — Supporting (Services / Support / Downloads / News / Search / Guidance / Privacy / Terms / Admin)

| Section | Motion (current) | Trigger | Fallback | Mobile |
|---|---|---|---|---|
| Split hero (where a `Hero` is used: Services, Support, News, Downloads, Agencies) | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| Search / Guidance clients (own `Hero` usage) | GSAP `.hero__anim` load entrance | Page load | Visible without JS | Stacks |
| All other supporting content (incl. honest empty states) | None (static) | — | — | Stacks |

---

## Open motion items (not Phase 6 work)

1. **Section reveals on pages:** the `[data-reveal]` mechanism is built
   and safe, but no page uses it yet. If the coordinator wants the §11
   targets (intro fade, staggered editorial/Why-Us cards, soft
   panoramic/CTA entrances), the wiring is: add `data-reveal` to the
   section wrappers (or use the `ui.tsx` primitives, which now carry
   it). Do not reintroduce any CSS hiding to do it.
2. **Statistics count-up:** §11 lists it, but no verified numbers exist
   (§3.4 prohibits invented stats) — nothing to count up. Revisit only
   if the client approves real figures.
3. **Product-detail gallery transitions:** CSS-only today; a GSAP
   gallery transition is a future enhancement, not a defect.
4. **3D scene wiring:** `EnergySystemScene` is built, not wired (see
   `docs/3d-and-illustration-plan.md` §4).
5. **Marquee styling:** navy bg / white text is the implemented
   treatment; ref 01 shows white bg / black text (open decision D-5,
   Phase 3). Motion ownership (CSS) is unaffected either way.
