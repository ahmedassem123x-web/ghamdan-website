# Architecture Overview — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Phase:** v15 Phase 2 — Architecture & UX Lock.
**Status:** LOCKED for Phase 3/4 implementation. Changes after this lock are spec changes, not silent patches.
**Sources:** Phase 1 forensic audit — `docs/current-state-audit.md`, `docs/reference-to-implementation-map.md` (DRAFT),
`docs/reference-image-inventory.md`, `docs/skills-and-tools-audit.md`; v15 master prompt
`incoming/v15/GTS_Ultimate_Master_Execution_Prompt_EN_15_som7.md` (§§5, 7, 8, 15, 23);
source reads of `package.json`, `package-lock.json`, `next.config.ts`, `src/data/types.ts`,
`src/data/*.ts`, `src/lib/*.ts(x)`, `src/components/*.tsx`, `src/app/[locale]/` routes, `src/app/sitemap.ts`.

---

## 1. What this site is

A **trilingual (ar / en / zh) marketing + catalogue site** for Ghamdan Trading & Agencies (GTS), Sana'a —
solar energy systems, storage, pumps, and related products. It is a **content site with a WhatsApp
inquiry funnel**, not a store: no public prices, no cart, no checkout, no accounts, no server.

- **Canonical live URL:** `https://ghamdan-website.vercel.app/` (Vercel only; GitHub Pages disabled).
- **Primary locale:** Arabic (`ar`), RTL. English (`en`) and Simplified Chinese (`zh`) are LTR.
- **Inquiry channel:** one shared WhatsApp number, canonical source `src/data/settings.ts:35–37`
  (`967775800000`, display `+967 775 800 000`, `https://wa.me/967775800000`).
  Per-context prepared messages live in `src/lib/whatsapp.ts` (`waLink()`).
- **Content honesty rules (binding):** zero public prices (§3.1 of v15); no invented projects, customers,
  capacities, results, testimonials, or years of experience; no unverified agency/exclusivity claims
  (only Deye is a confirmed official agency); no warranty duration published (pending client approval);
  `LM PACK` belongs to Shenzhen Kexin, not EFORE.

## 2. Stack — locked (see ADR-01 in `docs/architecture-decision-record.md`)

| Layer | Technology | Installed version (lockfile) | Role |
|---|---|---|---|
| Framework | Next.js (App Router) | **16.4.6** | Routing, page composition, static generation/export |
| UI | React / React DOM | **19.3.0 / 19.3.0** | Component composition, required interactive UI only |
| Language | TypeScript | **5.9.3** | Domain models, component interfaces, data safety |
| Styling | Tailwind CSS (+ @tailwindcss/turbopack) | **4.3.3** | Responsive layout, design tokens, utilities |
| Scroll motion | GSAP + ScrollTrigger | **3.15.1** | Scroll choreography, SVG path drawing, reveals |
| Smooth scroll | Lenis | **1.3.27** | Optional smooth scrolling, desktop pointer-fine only |
| Icons | Lucide React | **0.525.0** | Sole UI icon system |
| Build | Turbopack (`next build`) | — | `output: "export"`, `images.unoptimized: true` |
| QA | Playwright headless-shell | 1.65.1 / Chrome 159 (environment) | Browser automation, visual/functional QA |
| Deploy | Vercel (static) | — | Canonical deployment; no server, no middleware, no ISR |

**Not part of the runtime:** Motion, Lottie, Anime.js, Three.js/R3F, Remotion, HyperFrames, Supabase,
NestJS, PostgreSQL, Valkey, Zod, Drizzle — these exist only in the environment/dev-stack record
(`~/workspace/tools/dev-stack/`) or in the v15 prompt's tool table. None is installed in the site's
`package.json` and none may be added without a Phase 6 decision recorded in the ADR
(see `docs/technology-responsibility-map.md`).

**Node note:** the shell default at audit time was Node v24.22.1; the project record lists fnm-managed
Node 26.13.1 / 24.22.3. Pin the Node version before any Phase 3+ build (`.nvmrc`/fnm default).

## 3. Rendering model — static export

- `next.config.ts`: `output: "export"`, `images.unoptimized: true`, Turbopack CSS rule for Tailwind 4.
  No server, no middleware, no ISR, no server actions, no API routes.
- **Build output is generated, never hand-edited:** 231 HTML files in `out/` (last local build
  2026-11-14 12:47) = 228 locale routes + root `index.html` + `404.html` + `_not-found.html`.
  Per locale: 76 routes = 75 files under `out/<locale>/` + flat locale root (`out/ar.html` etc.;
  `out/<locale>/index.html` does **not** exist). Root `index.html` (6,206 B) is a minimal link page to `/ar`.
- **Dynamic routes are enumerated at build time** via `generateStaticParams` from `src/data/*`
  (products, categories, solutions, bundles, agencies) — see `docs/site-map.md` and
  `docs/content-data-model.md`.
- **Stale comment (fix in Phase 3):** `next.config.ts` still says output "deploys to Vercel … and
  GitHub Pages" — GitHub Pages is disabled; the comment is outdated.
- **Sitemap:** `src/app/sitemap.ts` generates every public route × locale (228 entries), excluding
  `/admin` (noindex). `src/app/robots.ts` also present.

## 4. Source layout (actual, not the v15 §7.2 example)

```
src/
  app/
    page.tsx            # root minimal link page -> /ar
    not-found.tsx       # 404
    sitemap.ts robots.ts
    [locale]/
      layout.tsx        # shared shell: Header, TopBar, Footer, MotionProvider, fonts, dir/lang
      page.tsx          # home
      about/  contact/  downloads/  guidance/  news/  privacy/  projects/
      search/  services/  solutions/  support/  systems/  terms/  admin/
      agencies/  [slug]/          # agency detail
      products/  page.tsx         # catalogue index (CatalogueClient)
        category/[slug]/          # category (CategoryClient)
        [slug]/                   # product detail (Gallery + ProductCard)
      solutions/  [slug]/         # solution detail (pumping has full detail content)
      systems/    [slug]/         # bundle / ready-made system detail
  components/       # 22 files — flat, NOT grouped into layout/navigation/sections/... (see §5)
  data/             # products.ts categories.ts bundles.ts agencies.ts solutions.ts
                    # pages.ts settings.ts types.ts index.ts  (single source of truth)
  lib/              # i18n.ts  images.ts  motion.tsx  ui-copy.ts  whatsapp.ts
public/
  images/heroes/    # 6 AI-generated hero images (.jpg + .webp)
  images/photos/    # 12 stand-in photos (.jpg + .webp) — NOT real GTS photos
  fonts/            # 12 woff2 — Tajawal (ar+latin 400/500/700/800) + Montserrat (latin 500/600/700/800)
```

**Deviation from v15 §7.2 recorded, not silently "fixed":** the recommended `components/layout|navigation|
sections|cards|forms|gallery|media|animation|three|icons|ui/` grouping and `features/` + `hooks/` +
`types/` + `styles/` directories do **not** exist. Components are flat in `src/components/`;
types live in `src/data/types.ts`. Restructuring is a Phase 3/4 prefactoring decision (dev-pipeline
Stage 2: prefactor first, as its own ticket) — it must not be done as drive-by reorganisation during
page reconstruction. See `docs/page-architecture.md` §6 for the component inventory and gaps.

## 5. Component inventory — summary (full list in `docs/page-architecture.md` §6)

22 components, grouped by role:

- **Layout / shell:** `Header.tsx`, `TopBar.tsx`, `Footer.tsx`, `Wordmark.tsx`, `LanguageSelector.tsx`
- **Hero / CTA:** `Hero.tsx`, `CTABand.tsx`, `WhatsAppButton.tsx`, `WhatsAppFloat.tsx`, `StickyWhatsAppBar.tsx`
- **Catalogue (client islands):** `CatalogueClient.tsx`, `CategoryClient.tsx`, `ProductCard.tsx`,
  `Gallery.tsx`, `SearchClient.tsx`, `ProjectsClient.tsx`, `GuidanceClient.tsx`, `ContactForm.tsx`,
  `AdminClient.tsx`
- **Cards / sections:** `Cards.tsx` (CategoryCard, SolutionCard, SolutionCardHorizontal, CategoryTile,
  ProjectCard), `SystemDiagram.tsx`, `ProjectDetailTemplate.tsx` (exists, **no route wired** — template only)
- **Primitives:** `ui.tsx` (Reveal, SectionHeading, SectionHeadingL, Breadcrumbs, EmptyState, ZhNotice,
  IconFeature, FeatureCard, SpecTable, Pagination, SearchInput, SortSelect, ResultMeta, EditorialBlock)

**Gaps vs. the design-system needs (Phase 3):** no dedicated button component (variants live ad hoc in
`Hero`/`WhatsAppButton`/`CTABand`); no mega-menu component (v15 §5.5 requires one — none exists);
no modal/lightbox component (gallery lightbox is a Phase 4/5 decision); no form-field primitives
(inputs/selects live inside `ContactForm`/`SearchClient`); no `three/` or animation components
(Three.js/R3F not installed); `ProjectDetailTemplate.tsx` is unwired dead code until a real project exists.

## 6. Data architecture — summary (full model in `docs/content-data-model.md`)

- **Single source of truth:** typed modules in `src/data/` (`types.ts` defines `Product`, `Category`,
  `Bundle`, `Agency`, `SolutionArea`, `PumpingDetail`, `SiteSettings`, `LocalizedString`, `SpecRow`,
  `PageCopy`). Page copy lives in `pages.ts` (keyed `k1…kN` per page); UI strings in `src/lib/ui-copy.ts`.
- **Counts (recomputed from source, audit §2):** 39 products (37 published, 2 pending — p30 Hanwha
  Q-Cells, p39 Wisenet); 8 categories; 4 bundles (3 confirmed + 1 archived, no page); 6 agencies
  (only Deye confirmed official); 5 solution areas (only pumping has full detail content);
  7 distinct product brands (Deye, MUST, Shenzhen Kexin, EFORE, Hanwha Q-Cells, Jntech, Wisenet).
- **Localization rule:** `LocalizedString` = `{ ar: string; en?: string; zh?: string }` — Arabic always
  present; missing `en`/`zh` falls back to `ar` (`src/lib/i18n.ts` `t()` / `isFallback()`).
  `switchLocalePath()` preserves the equivalent page across locales.
- **Spec schema (C-2 regression context):** `SpecRow = { label: LocalizedString; value: string }`;
  identity rows (brand, model, category, subcategory) + one row per verified spec fragment, verbatim;
  missing values are **absent, never guessed**. Any spec change must re-run the 37-block / 111-page
  verification (see ADR).
- **Publication states:** `ProductStatus = "published" | "pending"`;
  `SourceStatus = "confirmed" | "factory_catalog_verified" | "partial" | "awaiting_client_list"`;
  `BundleStatus = "confirmed" | "archived"`. No product is public until it has a name, model where
  applicable, brand, category, representative image, verified specs, required locale content, and
  `published` status.
- **No monetary fields anywhere** in the data model (`types.ts` has zero price fields) — the
  no-public-price rule is structural, not just editorial.

## 7. Motion architecture — summary (full map in `docs/technology-responsibility-map.md`)

- **Single owner:** `src/lib/motion.tsx` (`MotionProvider`) is the only animation orchestrator.
  GSAP + ScrollTrigger are dynamically imported; Lenis only on desktop pointer-fine devices,
  driven from GSAP's ticker (`lenis.raf` via `gsap.ticker.add`, `lagSmoothing(0)`); one rAF loop —
  GSAP and Lenis never compete.
- **Progressive enhancement (binding):** content is visible without JS — `.reveal` starts hidden
  only under `html.js` (class added by `MotionProvider`); if GSAP fails, an IntersectionObserver
  fallback reveals everything; `prefers-reduced-motion: reduce` disables the whole system.
  **No section may remain `opacity: 0` / `visibility: hidden` indefinitely** — this is the
  regression rule for the historical blank-section defect.
- **No second animation library is installed.** Motion (framer-motion), Lottie, Anime.js, Three.js/R3F
  are not dependencies; adding any of them is a Phase 6 decision, with one owner per element/property.

## 8. Navigation & shell — summary (full spec in `docs/site-map.md` §4 and `docs/page-architecture.md`)

- **Header (locked, C-1 fix):** opaque white, sticky `top-0 z-50 bg-white`, dark readable links from
  first paint — never transparent again. Desktop nav (7 items) + drawer (10 items) + WhatsApp pill +
  3-locale switcher. **No mega menu exists yet** — v15 §5.5 requires one; design is in §4.3 of the
  site map (board-driven, no reference coverage).
- **Footer:** wordmark + social (Facebook/Instagram, verified) + category links (all 8) + quick links
  + contact (Sakhr St, +967 775 800 000, info@ghamdan-trd.com, Sat–Fri 8–20) + privacy/terms +
  giant pale wordmark.
- **Language switch:** `LanguageSelector.tsx` + `switchLocalePath()` — same path, different locale
  prefix; falls back to the equivalent page; `dir`/`lang` set per locale in the layout.

## 9. Page templates — summary (full spec in `docs/page-architecture.md`)

| Template | Routes using it | Hero (locked, corrected M-3) |
|---|---|---|
| Home | `/[locale]` | FULL-WIDTH, centered (ref 01) |
| Corporate / split-hero | about, solutions, contact | SPLIT (refs 02, 03, 07) |
| Catalogue | products | SPLIT (ref 04) |
| Category | products/category/[slug] | SPLIT (ref 08) |
| Product detail | products/[slug] | SPLIT (ref 06) |
| Solution detail | solutions/[slug] (pumping full; other 4 routes exist, detail content pending) | SPLIT (ref 09) |
| Systems / bundle detail | systems/[slug] (3 confirmed) | SPLIT (no ref; follows solution-detail pattern) |
| Projects listing | projects | FULL-WIDTH (ref 05) |
| Project detail | **NO ROUTE — deliberate** | FULL-WIDTH (ref 10, template only) |
| Supporting | services, support, downloads, news, search, guidance, privacy, terms, admin | Shared supporting template (no ref hero) |

Full-width heroes exist on refs **01, 05, 10 only**; split heroes on **02, 03, 04, 06, 07, 08, 09**.
This corrects the report/v15 §2.6 premise (see ADR-02).

## 10. Known gaps carried into Phase 3/4 (not resolved by this lock)

1. **Ref-01 hero fidelity — OPEN decision (ADR-03):** reference has a BLACK headline on bright sky
   with no dark overlay; live site has white copy on a 25% navy overlay (M-2 fix). Both options
   recorded; decision belongs to Phase 3/4.
2. **Unsourced hero phrase — REMOVE (ADR-06):** «طاقة اليوم لمستقبل أفضل» (`src/data/pages.ts:576`)
   is live on `/ar/products` with no verified source. Flagged for removal/replacement with approved
   neutral copy in Phase 5.
3. **"All Products" entry — FIX DESIGNED (ADR-07):** only a show-all toggle exists on `/products`;
   no «جميع المنتجات» tab strip (ref 08 pattern) and no `/products/all` route. Design locked in
   `docs/site-map.md` §5.
4. **M-4 repeated imagery — DATA QUALITY (ADR-08):** 12 stand-in photos serve 37 products; repetition
   is structural until real photos arrive. Representative status must stay labelled in the model.
5. **Fonts/palette reconciliation — Phase 3:** live build uses Tajawal + Montserrat and navy
   `#0F2E4D`; the approved board specifies IBM Plex Sans Arabic + Inter and `#0081FB` / `#102B46`.
   Not decided here.
6. **Official logo — Phase 3:** `incoming/v15/gts-official-logo.jpg` (flat JPEG, solid blue, no
   transparency/vector) is not in `public/`; site still uses the typographic `Wordmark.tsx`.
7. **Track B out of scope:** CMS, real routes, SEO/301s, advanced publishing — separate project.
8. **`/admin`:** demo admin page (`AdminClient.tsx`, title "Admin — Demo"), excluded from sitemap
   (noindex). No real CMS exists; do not present it as one.
9. **Empty-state pages:** news (0 articles), downloads (no files until CI-06), support warranty text
   pending — all render honest empty states; never fabricate content to fill them.
10. **Git state:** this working copy is not a git repository; HEAD `9f53195` unverifiable locally.
    Repo operations go through the remote/browser path only.

## 11. Skills activated for this lock

Read in full and applied: `dev-pipeline` (spec → tickets → TDD → two-axis review; this lock is the
Phase 2 spec — implementation tickets belong to Phases 3–8) and `frontend-design`
(detect → plan → build → verify; existing-system mode — defer to the detected Tailwind/GSAP/Lenis
system, do not introduce a new one). Phase 1 audit procedures from
`reference_replica_study_and_verification` and `website_build_evidence_verification` were used as
the evidence standard for the facts cited here (verified facts only; unobserved layout/motion
marked unconfirmed, not asserted).
