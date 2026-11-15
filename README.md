# Ghamdan — غمدان للتجارة والتوكيلات (GTS)

New website build for Ghamdan for Trade and Agencies, Sana'a, Yemen —
official Deye agent in Yemen (solar + lithium systems).

> **Status: Next.js site (231 static pages), deployed on Vercel — production
> Ready at ghamdan-website.vercel.app.** The old static-HTML v1 build and its
> demo admin were deleted from this repo on 2026-11-15 (security cleanup);
> the v1 QA screenshots are archived outside Git at
> `~/workspace/ghamdan-qa-archive/qa`. No publish / share publicly without
> Ahmed's explicit approval. Full handover: `docs/FINAL_EXECUTION_REPORT.md`.

## Client (verified)
- **Company:** غمدان للتجارة والتوكيلات — Ghamdan for Trade and Agencies (GTS)
- **Contact:** +967-775800000 · info@ghamdan-trd.com · Sat–Fri 8am–8pm
- **Address:** Sakhr St, front of Noor Yemen Mall, Sana'a (footer also lists Mogadishu St, P.O. Box 18053 — unify on client confirmation, CI-05)
- **Social:** Facebook facebook.com/GTSYemen (120K) · Instagram @gtsyemen1 (2.9K)
- **Brands:** Deye (official agent, spelled «دايا»), EFORE, MUST, Jntech, Hanwha Q-Cells, Wisenet cameras

## Standing rules (do not break)
1. **NO PRICES ON THE SITE** — name + image + description + WhatsApp only. Price on WhatsApp. (Verified: 0 currency amounts in the rendered HTML and no price field in the product data.)
2. **WhatsApp-first** — every product / CTA leads to WhatsApp (`wa.me/967775800000`, single source in `src/data/settings.ts`, links built in `src/lib/whatsapp.ts`).
3. **Arabic-first RTL**, trilingual AR / EN / ZH (ZH body copy pending qualified human review — CI-09).
4. **No placeholder presented as real** — prices, photos, specs and contacts stay placeholders until Ghamdan confirms them. Photos are CC Openverse stand-ins, labelled as development preview; product visuals are code-built SVG line-art.
5. **No publish / share publicly** without Ahmed's explicit approval.
6. **Catalogue:** 8 categories / 39 products (37 published, 2 awaiting client confirmation: p30 Q-Cells, p39 Wisenet). 4 bundles (3 confirmed + 1 archived Ramadan). LM PACK is Shenzhen Kexin, NOT EFORE.
7. **Warranty:** no warranty duration published — text is «نص الضمان الموحد قيد الاعتماد» (CI-08). Do not publish a warranty claim until Ghamdan confirms.
8. **Logo:** the old GTS logo is FORGOTTEN (CI-17). Temporary typographic wordmark «غمدان» + GHAMDAN · GTS until Ahmed sends the new logo.

## Brand identity (as built — reference palette governs)
- Colours: primary blue `#0081FB` / `#0B70C9` · Navy `#102B46` · Sky `#DDF5FC` · WhatsApp green `#157A35` (AA, 5.43:1). Red `#E31E24` is logo-only. 0 gradients, 0 glassmorphism.
- Fonts: IBM Plex Sans Arabic (Arabic) + Inter (Latin) + Noto Sans SC (Chinese), self-hosted woff2 — no Google Fonts at runtime.
- Tagline: TRUST • TRADE • GROWTH (brand tagline; site tagline: «حلول طاقة ومياه وزراعة ذكية لمستقبل أكثر استدامة»).
- Note: the 2026-11-10 brand board (Navy `#0B2D5B` / Red `#E10600`) conflicts with the reference palette; the build follows the references per the governing prompt, with red reserved for the logo. Confirmation pending (CI-12).

## Stack (as built)
- **Next.js 16.4.6 + React 19.3.0 + TypeScript**, static export (`output: "export"`, 231 HTML pages × AR/EN/ZH), Tailwind CSS 4, deployed on Vercel (project `ghamdan-website`, team Ahmed).
- **Motion:** GSAP 3.13 + ScrollTrigger + Lenis (the only animation libraries actually imported; Motion/Lottie/Anime.js/React Three Fiber are NOT in this project). Three.js 0.187 in one scene only (pumping solution page).
- **Data:** typed catalogue in `src/data/` (products, categories, agencies, bundles, pages) — no backend, no database, no prices. Contact form hands off to WhatsApp and stores nothing.
- **No admin panel.** The demo admin (fake login + localStorage analytics) was deleted 2026-11-15 for security; there is no server-side admin in this repo.

## Run it
```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build       # static export → out/ (231 HTML files)
npx serve out       # preview the built site locally
```

## Structure
```
src/app/[locale]/     — 3-locale App Router pages (home, products, categories,
                        solutions, systems, agencies, projects, about, contact, ...)
src/components/       — Header, Hero, ProductCard, CatalogueClient, Gallery, ...
src/data/             — typed catalogue: products.ts, categories.ts, agencies.ts,
                        bundles.ts, pages.ts, settings.ts, ui-copy.ts
src/lib/              — i18n, whatsapp (wa.me links), motion (GSAP), images
public/               — images (photos, brand, heroes), fonts (Plex/Inter/Noto Sans SC)
tools/fix-html-lang.mjs — post-build lang/dir rewrite for the static export
vercel.json           — {"cleanUrls": true}
docs/                 — see Docs index below (v1 docs kept for history;
                        docs/qa screenshots archived outside Git, 2026-11-15)
```

## Docs index (`docs/`)
- `FINAL_EXECUTION_REPORT.md` — prompt §23's 15 items, answered truthfully
- `SITE_MAP.md` — every page, route, reference image, status
- `ARCHITECTURE.md` — build order, stack decision, Laravel 1:1 mapping, i18n, WhatsApp, wordmark/CI-17
- `DATABASE_SCHEMA.md` — tables/fields implied by `data.js`, mapped to Laravel/PostgreSQL
- `MOTION_SYSTEM.md` — GSAP reveals, stagger, count-up (implemented, unused), reduced-motion, no-JS fallback
- `COMPONENT_LIBRARY.md` — components from `main.css` with tokens
- `ADMIN_GUIDE.md` — ⚠️ OBSOLETE: describes the demo admin deleted 2026-11-15; kept for history only, do not follow
- `DEPLOYMENT.md` — run locally, deploy as static hosting, pre-launch blockers, repo state
- `VISUAL_QA_REPORT.md` — independent side-by-side QA (10 pages × desktop/mobile) + slop check
- `TEST_REPORT.md` — probe methodology, 36-probe results, defects found and fixed, limitations
- Phase 0 (earlier): `DOCUMENT_ANALYSIS.md`, `REQUIREMENTS_TRACEABILITY.md`, `SCOPE_AND_EXCLUSIONS.md`, `CLIENT_INPUT_REGISTER.md`, `DESIGN_DNA.md`, `DESIGN_SYSTEM.md`, `REFERENCE_IMAGE_ANALYSIS.md`, `REFERENCE_PAGE_SECTION_MAP.md`, `REFERENCE_COMPONENT_MAP.md`, `PHOTO_CREDITS.md`
- QA evidence: archived outside Git at `~/workspace/ghamdan-qa-archive/qa` (2026-11-15)

## Verification summary (2026-11-14, v1 build — historical)
- 36 probes (18 pages × 1920 desktop + 390 mobile): horizontal overflow **0px** on all 36; broken images **0**; console errors **0**; WhatsApp links valid on all pages (**0 bad**).
- Two defects found by the probe and fixed during the build: giant bare-`<svg>` icons (~1092px) and 95px mobile overflow on product detail.
- Visual QA: **0 of 10 pages fully PASS on desktop** (4 PASS on mobile) — honest PARTIAL verdicts with named gaps (wrong/repeated hero photos, missing product spec sections, no category filters, honest empty states instead of invented projects). See `docs/VISUAL_QA_REPORT.md`.
- **Security cleanup 2026-11-15:** the "known open defects" from the v1 report are gone with the v1 code — the demo admin (printed credentials, wrong localStorage key, no CRUD) and the internal price notes in `assets/js/data.js` were deleted together with the whole v1 static site. No admin panel and no localStorage visitor storage remain in this repo.

## Client inputs still missing (CI-01…CI-17)
All 17 items in `docs/CLIENT_INPUT_REGISTER.md` are **CLIENT INPUT REQUIRED** (except CI-15, future, NOT STARTED): signed contract (CI-01), product/category lists (CI-02), bundle components (CI-03), agency list/logos/certificates (CI-04), final contacts (CI-05), real product photos + spec files + logo (CI-06), company copy/projects/news (CI-07), warranty text (CI-08), ZH review (CI-09), legal texts (CI-10), domain choice (CI-11), brand identity confirmation (CI-12), availability/«most requested» basis (CI-13), pumping-tool scope (CI-14), future payment decisions (CI-15), materials for the 4-week clock (CI-16), **new logo (CI-17)**.
**Blocking for launch:** CI-01, CI-05, CI-11, CI-09, CI-08, CI-02/CI-03/CI-04/CI-06 for their content.

## Skills wired for this build
- `prompt-architect` — every work order is structured + skill-linked first (automatic, internal)
- `frontend-design` — detect system → plan → build → visual verify with screenshots
- `ui-ux` — hierarchy, one entry per screen, phone <820px = tab bar, no sidebar
- `motion-studio` — GSAP / Remotion / Lottie / Three.js engine router, Arabic RTL motion
- `site-replica-study` + `reference_replica_study_and_verification` — reference sites studied whole, spec first, replica verified in passes
- `image-search` — public image locators (`/opt/hatch/bin/image-search`)
- `website_build_evidence_verification` — same-build evidence bundle before any "ready" claim
- Image extraction tools: `~/workspace/tools/site-extract/` — SingleFile, website-scraper, HTTrack, Playwright, BeautifulSoup

## Workflow
1. Ahmed sends design / files → they land in `incoming/` (not committed until checked)
2. Study reference whole → one unified motion + design spec → build → visual verify (desktop + phone)
3. Evidence bundle before presenting anything as ready
4. Deploy only on his approval
