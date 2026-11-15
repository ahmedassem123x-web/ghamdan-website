# Technology Responsibility Map — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Status:** LOCKED.
**Sources:** `package.json` + `package-lock.json` (installed versions), `src/lib/motion.tsx`,
`src/app/[locale]/layout.tsx`, `next.config.ts`, v15 §15, `docs/current-state-audit.md` §1,
`docs/skills-and-tools-audit.md` §1.

**Rule (v15 §24, binding):** one animation owner per element/property. GSAP and Lenis must not
compete; no two libraries animate the same CSS property on the same element at the same time.
A library is used only for its assigned responsibility below; adding a library requires a Phase 6
decision recorded in the ADR.

## 1. Installed in the site — responsibilities

| Technology | Installed version | Responsibility | Used by (verified) | Constraints |
|---|---|---|---|---|
| **Next.js** | 16.4.6 | Routing, page composition, static generation/export | All routes under `src/app/`; `generateStaticParams` from `src/data/*`; `sitemap.ts`, `robots.ts` | Static export only: no server, middleware, ISR, server actions, API routes. `images.unoptimized: true`. Dynamic routes enumerated at build time. |
| **React / React DOM** | 19.3.0 / 19.3.0 | Component composition; required interactive UI only (catalogue clients, drawer, form, search) | `CatalogueClient`, `CategoryClient`, `SearchClient`, `ProjectsClient`, `GuidanceClient`, `ContactForm`, `AdminClient`, `Header` (drawer) | Do not turn static sections into client JS. Server components by default; `"use client"` only where interactivity requires it. |
| **TypeScript** | 5.9.3 | Domain models, component interfaces, data safety | `src/data/types.ts`, all components | Avoid `any` (no justified `any` boundary recorded yet); no duplicated contracts — `types.ts` is the single contract source. |
| **Tailwind CSS** (+ @tailwindcss/turbopack) | 4.3.3 | Responsive layout, design tokens, UI utilities | All components; `globals.css` (tokens; the `.reveal` hiding rule under `html.js` was deleted in Phase 6 — no CSS rule may hide content) | Centralise tokens; no ad-hoc style drift. Tokens themselves are a Phase 3 deliverable (`docs/design-tokens.md`). |
| **GSAP + ScrollTrigger** | 3.15.1 | **Primary scroll choreography:** hero reveals, image mask reveals, staggered card groups, section entrances, SVG path drawing, controlled marquee, limited scrubbed scenes where a reference requires them | `src/lib/motion.tsx` (`MotionProvider`) — the ONLY place GSAP is imported. Dynamically imported (`import("gsap")`, `import("gsap/ScrollTrigger")`). Targets: `.hero__anim` (load entrance), `[data-reveal]` (ScrollTrigger `top 88%`, `once: true`), `[data-stagger]` groups, `[data-draw]` SVG paths, `[data-flow]` diagram connectors | Animate mainly transform + opacity. **Visible-by-default (Phase 6):** no CSS rule hides content; GSAP applies `fromTo` reveals only after a successful dynamic import; if GSAP fails or JS is absent, content stays visible (the old IntersectionObserver rescue was deleted as dead code); `prefers-reduced-motion` returns before any import. Cleanup via one `gsap.context()` + `usePathname()` dep, ordered ticker → Lenis destroy → `ctx.revert()`; `ScrollTrigger.refresh()` after fonts/load. No excessive pinning; no blank spacer regions; no long scroll sequences on mobile. |
| **Lenis** | 1.3.27 | **Optional smooth scrolling only** | `src/lib/motion.tsx` — dynamically imported, **desktop pointer-fine only** (`matchMedia("(pointer: fine)")`), `lerp: 0.1`, `smoothWheel: true` | **One rAF loop:** driven from GSAP's ticker (`gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`); `lenis.on("scroll", ScrollTrigger.update)`. No competing scroll loops. Failure → native scroll, nothing breaks. Respect keyboard/touch; disable/simplify for reduced motion and low-performance cases. Never a substitute for content animation. |
| **Three.js** (vanilla; **no R3F**) | 0.187.0 (+ `@types/three` 0.187.0) | Selective 3D technical storytelling — exactly one scene: (B) isometric energy system on the pumping solution page | `src/components/three/EnergySystemScene.tsx` — dynamically imports `three` in an effect; SSR/no-JS/reduced-motion/WebGL-fail/import-fail all render the SVG `SystemDiagram` fallback | Illustrative only (never invent a real product's internal design). DPR capped 1.5 mobile / 2 desktop; pauses off-screen and tab-hidden; full disposal on unmount; critical text stays in HTML, never in canvas. See `docs/3d-and-illustration-plan.md`. |
| **Lucide React** | 0.525.0 | **Sole UI icon system** | All icons: pillars (sun/droplet/leaf), category icons via `categoryIcon()` (`Cards.tsx`), contact/social icons, process steps | Same family, consistent stroke/weight/optical size. No decorative icon clutter; no emoji as production icons. Directional icons must respond to RTL/LTR. Do not mix unrelated icon systems. |
| **Playwright** (headless-shell) | 1.65.1 / Chrome 159 (environment) | Browser automation + visual/functional QA | Not a site dependency; QA tooling in `~/workspace/tools/dev-stack/` + `~/.cache/ms-playwright/` | Re-run after material changes. Viewports: 1440×900 desktop, 390×844 mobile, narrow mobile, tablet. Checks: routes, console errors, failed requests, overflow (0 px), lazy-load/scroll-reveal, reduced motion, keyboard nav, mega menu/drawer, locale switching. Headless-shell launch was **not** tested in Phase 1 (memory tight) — verify it launches before relying on it in Phase 8. |
| **Vercel** | — | Canonical deployment (static) | `ghamdan-website.vercel.app` | Verify project/settings before publishing. GitHub Pages stays disabled. No preview → production promotion without authorization. |
| **GitHub** | — | Source control | Repo `ahmedassem123x-web/ghamdan-website` | This working copy is **not** a git repository; repo ops go through the remote/browser path. Never bypass auth; never store credentials in source. |

## 2. Single-owner animation rule — how it is enforced in code

- **Sole orchestrator:** `src/lib/motion.tsx` (`MotionProvider`, mounted in `[locale]/layout.tsx`).
  No other file imports GSAP or Lenis (Phase 6 re-verified: GSAP/Lenis imports live only in
  `motion.tsx`; `ui.tsx` primitives render visible markup with `data-reveal` hooks and import
  neither).
- **Ownership table (locked):**

| Element / property | Owner | Others must not… |
|---|---|---|
| Scroll-linked reveals (`[data-reveal]`, `[data-stagger]`, `.hero__anim`, `[data-draw]`, `[data-flow]` — opacity/transform) | GSAP + ScrollTrigger | …animate opacity/transform on the same elements (no Motion, no CSS transitions on those properties there). |
| Smooth scrolling (scroll position) | Lenis (desktop pointer-fine only) | …run a second scroll loop or a competing smooth-scroll implementation. Lenis is driven by GSAP's ticker — one loop total. |
| Discrete UI state (drawer open/close, accordion, tabs, dialog, loading/feedback) | **Not installed** — see §3. Until a library is chosen, use CSS transitions on transform/opacity for these states, owned by the component itself | …let GSAP touch drawer/accordion/tab state transitions. If Motion is added in Phase 6, it owns these states and GSAP must not animate the same properties on those elements. |
| Small vector loops (solar/pump accents) | **Not installed** — Lottie is a Phase 6 decision | …replace UI icons with Lottie; lazy-load below fold; static SVG fallback; reduced-motion support. |
| 3D scenes | **Installed (Phase 6): vanilla Three.js 0.187.0** — exactly one scene (`EnergySystemScene`, isometric energy system, wired on the pumping solution page; R3F deliberately not installed) | …put WebGL everywhere; dynamic import, pause off-screen/tab-hidden, DPR cap on mobile, static WebP/SVG fallback, content stays in accessible HTML. |
| Line art / technical diagrams | **SVG** (inline `SolarFieldLineArt` on home; `SystemDiagram.tsx` for pumping) | …use WebGL for simple vector work. GSAP may animate SVG `stroke-dasharray`/`stroke-dashoffset` (path drawing) — that is GSAP's SVG responsibility, not a second owner. |
| Marquee | **CSS only — decided in Phase 6, one owner** | …run two marquee mechanisms. GSAP never touches the marquee. |

## 3. NOT installed — do not assume, do not add without a recorded Phase 6 decision

These appear in the v15 prompt (§2.1 environment table, §10, §15) or the dev-stack record, but are
**not in the site's `package.json`** and are **not imported anywhere in `src/`**. Each row states
the condition for adding it.

| Technology | Environment version (for reference) | Assigned responsibility IF added | Condition / constraint |
|---|---|---|---|
| **Motion** (framer-motion) | 14.14.0 | Discrete React state transitions: mobile drawer, accordion, dialog/modal, tabs, small layout/state transitions, loading/feedback | Phase 6 decision: **NOT installed** — CSS transitions own discrete UI state; GSAP covers the rest (see `docs/motion-system.md`). Must never animate the same property as GSAP on the same element. One owner per component. |
| **Lottie** | 5.13.0 | Lightweight prepared vector animation: small solar-energy loops, pump/water accents, engineering indicators | Phase 6 decision: **NOT installed** — GSAP covers those roles. Small JSON only; lazy below fold; static SVG fallback; reduced-motion support; never replaces UI icons. |
| **Anime.js** | 4.5.0 | Optional isolated micro-sequences where a vector/DOM sequence suits it better than GSAP | Phase 6 decision: **NOT installed** — GSAP covers those roles. Only when demonstrably better than the existing system; never merely to increase the technology count; no conflicts with GSAP. |
| **React Three Fiber** | 9.8.2 | — | **NOT installed (Phase 6 decision)** — vanilla Three.js was chosen instead (no React peer-dep risk with React 19/Next 16, smaller bundle, explicit loop/disposal control). See `docs/3d-and-illustration-plan.md`. |
| **Remotion / HyperFrames** | 4.0.543 / 0.9.43 | **Exported video production only** | Never bundled into the site runtime without a specific reason. Exported compressed formats, muted/plays-inline, still fallback, reduced-motion respected. |
| **Zod** | (environment reference) | Data validation (product/category/brand/slug/locale/gallery/spec/publication/URL/WhatsApp checks — see `docs/content-data-model.md` §9) | Phase 5 decision. Use the validation library already installed *if suitable*; Zod is not currently a site dependency — record the choice when made. |
| **Supabase / NestJS / PostgreSQL / Valkey / Drizzle** | (environment reference) | **No role in this site** | Explicitly out of scope (v15 §8.4, §15.2). A CMS/backend is a separately scoped phase; do not silently add one. |
| **Vitest / Jest / ESLint / Prettier / Husky** | (environment reference) | Testing/linting | Not currently configured in the site (no test script in `package.json`; scripts are `build`, `dev`, `start`, `typecheck`). Phase 5/8 decision; record what is adopted. |

## 4. Motion timing tokens (locked ranges, v15 §10.9)

- Micro-interaction: 120–180 ms · Button/hover: 180–250 ms · Card transition: 250–400 ms
- Section reveal: 450–800 ms (implemented: `[data-reveal]` 0.7 s, `power3.out`; hero 0.5 s, stagger 0.1)
- Large visual transition: 650–1100 ms
- Motion must feel premium, support hierarchy, avoid competing movements and continuous decorative
  noise, never delay initial content, and support `prefers-reduced-motion`.

## 5. Progressive-enhancement rule (binding — regression rule for the blank-section defect)

1. Render visible content (static HTML from the export).
2. No CSS rule hides content; nothing starts hidden. (`MotionProvider` no longer adds a `js` hiding class — Phase 6.)
3. Initialise GSAP (dynamic import); on success apply controlled `fromTo` reveals to `[data-reveal]` / `[data-stagger]` / `.hero__anim` / `[data-draw]` / `[data-flow]`.
4. If GSAP fails → content stays visible (no rescue class needed — nothing was hidden; the old IntersectionObserver fallback was deleted as dead code in Phase 6).
5. If JS is absent → everything visible by default.
6. If `prefers-reduced-motion: reduce` → no animation, content visible.
7. **No `opacity: 0` / `visibility: hidden` section may remain indefinitely; no large blank spacer
   regions while waiting for scroll.** Test: direct load, slow network, real scroll, reduced motion,
   full-page capture, JS-disabled screenshot (main content must stay visible; counters reach final values).
