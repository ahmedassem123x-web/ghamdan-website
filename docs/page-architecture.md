# Page Architecture — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Status:** LOCKED.
**Sources:** `docs/reference-to-implementation-map.md` (DRAFT), `docs/reference-image-inventory.md`,
`docs/current-state-audit.md`, source reads of `src/app/[locale]/**/page.tsx`, `src/components/*.tsx`,
`src/data/pages.ts`, `src/data/solutions.ts`.

**Hero rule (binding, corrected M-3):** FULL-WIDTH photographic heroes on refs **01 (Home),
05 (Projects), 10 (Project Detail)** only. SPLIT heroes (text one side, photo the other) on refs
**02 (About), 03 (Solutions), 04 (Catalog), 06 (Product Detail), 07 (Contact), 08 (Product Category),
09 (Solution Detail)**. Do not force full-width onto the seven split pages.
See `docs/architecture-decision-record.md` ADR-02.

**Shared shell (all pages):** `TopBar` → `Header` (opaque white, sticky — C-1 fix, never transparent)
→ page content → `CTABand` (where the template calls for it) → `Footer` (+ `Wordmark`).
`WhatsAppFloat` + `StickyWhatsAppBar` (mobile) are global. `MotionProvider` wraps the locale layout.

---

## 1. Template catalogue

| # | Template | Routes | Hero | Reference |
|---|---|---|---|---|
| T1 | Home | `/[locale]` | FULL-WIDTH centered | Ref 01 |
| T2 | Corporate (split hero) | `/about`, `/solutions`, `/contact` | SPLIT | Refs 02, 03, 07 |
| T3 | Catalogue | `/products` | SPLIT | Ref 04 |
| T4 | Category | `/products/category/[slug]` (8) | SPLIT | Ref 08 |
| T5 | Product detail | `/products/[slug]` (37) | SPLIT | Ref 06 |
| T6 | Solution detail | `/solutions/[slug]` (5; full content only for pumping) | SPLIT | Ref 09 |
| T7 | Systems / bundle detail | `/systems`, `/systems/[slug]` (3) | SPLIT (no ref; follows T6) | — |
| T8 | Projects listing | `/projects` | FULL-WIDTH | Ref 05 |
| T9 | Project detail | **NO ROUTE — template only** | FULL-WIDTH | Ref 10 |
| T10 | Brands / agencies | `/agencies`, `/agencies/[slug]` (6) | SPLIT (no ref; follows T2) | — |
| T11 | Supporting | `/services`, `/support`, `/downloads`, `/news`, `/search`, `/guidance`, `/privacy`, `/terms`, `/admin` | Shared supporting template, no ref hero | — |

---

## 2. Page-by-page section composition

### T1 — Home (`src/app/[locale]/page.tsx`, ref 01)

1. `Hero variant="center"`, `badgeStyle="white"`, `whatsappVariant="navy-pill"` — full-width,
   image `hero-villa-mountains.jpg`. **Known deviations (open):** ref subject is white villa +
   panels + **sea**; implemented image is villa + **mountains** (`hero-villa-sea.jpg` exists and is
   used on About — per-page hero-image assignment is a Phase 3/4 decision, ADR-03). Ref headline
   is **black on bright sky, no overlay**; implemented copy is **white on 25% navy overlay** (M-2).
2. Guidance bar (extra vs. ref — «دليل الضخ» + WhatsApp; home + `/products` only).
3. Intro + 3 pillars (sun/droplet/leaf, Lucide) + inline `SolarFieldLineArt` SVG (line art is
   inline in the page, not a shared component — see §6 gap).
4. Marquee «خبراتنا — تأثيرنا — حلولنا» — implemented **navy background**; ref is white bg / black
   text (Phase 3 fidelity decision).
5. 2×2 editorial solution cards — `SolutionCardHorizontal` ×4 (residential / pumping / irrigation /
   solutions-index).
6. Why us — light-blue band `bg-surface-blue` + faint `villa-sky.jpg` at 12% opacity, 3 white cards.
7. Projects (2 cards, both link to `/projects` — no fabricated detail) + featured products (3 tiles).
8. Navy CTA band — `CTABand variant="split"` (mail / phone / address rows from `siteSettings.contact`).
9. Footer.

Data: `pages.home` (k1–k3 hero, k10–k21 marquee, k30–k35/k40–k41 why-us), `solutionAreas`,
`pages.solutions`, `siteSettings.contact`.

### T2a — About (`about/page.tsx`, ref 02) — SPLIT hero

Split hero (text left ~55%, photo right ~45%, `hero-villa-sea.webp` per live fetch) → centered
statement + 3 pillars → story split (photo left) → mission/vision 2 cards → 3 expertise photo
cards → navy photo CTA band → footer. Live text fetch confirms statement, pillars, story, mission,
vision, expertise cards, CTA all render. **Verify in Phase 4:** split-vs-full-width hero as rendered,
and story flip direction (EPERM doc records an EditorialBlock flip fix on the about story).

### T2b — Solutions listing (`solutions/page.tsx`, ref 03) — SPLIT hero

Split hero (text right, photo left ~55%, villa + ground-mount panels + mountains) → centered intro
→ 5 alternating editorial rows (residential / commercial / pumping / irrigation / agriculture) →
4-step process «كيف نعمل؟» (RTL arrows) → full-width photo CTA band → footer.
**Verify in Phase 4:** process steps and CTA band wiring.

### T2c — Contact (`contact/page.tsx` + `ContactForm.tsx`, ref 07) — SPLIT hero

Split hero (text right, photo left, house + rooftop panels) → 3 contact-option cards (WhatsApp /
general / technical support) → form split (name* / email* / inquiry-type* / message* / submit;
**no phone field** — matches ref) + photo panel → navy CTA band → footer.
Form submits via WhatsApp (`WA_MESSAGES.contact`), not email.
**Phase 5 fix:** hard-coded wa.me URLs at `contact/page.tsx:41, 43, 61` → route through `waLink()`.

### T3 — Catalogue (`products/page.tsx` + `CatalogueClient.tsx`, ref 04) — SPLIT hero

Split hero (text left, photo right: panel + submersible pump + water + mountains;
`hero-pump-mountains.webp` per live fetch) → search + category navigation → featured grid (2×6) +
«عرض جميع المنتجات» → help banner (guidance bar) → why-us 4 features → footer.
**Current state:** search present; featured grid shows **12 of 37** by default with a `showAll`
toggle; **no category-chip row** (ref has 12 chips — GTS has 8 categories, so the strip must be a
GTS-taxonomy version, not the ref's 12); the «عرض جميع المنتجات» link exists only as the show-all
toggle button, not as a route/tab. **Locked fix:** the All-Products tab strip (see
`docs/site-map.md` §5) replaces the toggle in Phase 4/5.
**Unsourced copy flag:** hero headline «طاقة اليوم لمستقبل أفضل» (`pages.ts:576`) is live here
with no verified source — remove/replace in Phase 5 (ADR-06).

### T4 — Product category (`products/category/[slug]/page.tsx` + `CategoryClient.tsx`, ref 08) — SPLIT hero

Split hero (text right, photo left: panels + inverter + battery cabinet + villa) → **category tab
strip** (ref: «جميع المنتجات» first/active + sibling categories) → filter bar (type/brand dropdowns
defaulting to "all", search, sort, count «عرض 12 من 24») → product grid (4×2 in ref) →
related categories → navy WhatsApp CTA band → footer.
**Current state:** filter bar present; **the tab strip is missing** — add it in Phase 4/5
(8 GTS categories + All; see site-map §5). Product cards use WhatsApp-outline buttons in the live
build vs. dark «طلب استشارة» buttons in the ref — check in Phase 4.
Zero-product categories (panels, cameras, systems, storage-ci) render honest empty states.

### T5 — Product detail (`products/[slug]/page.tsx` + `Gallery.tsx` + `ProductCard.tsx`, ref 06) — SPLIT hero

Split hero (breadcrumbs, H1, copy, thumbnail, product photo right — white hybrid inverter +
rooftop panels in ref) → overview split → 4 key features → spec table (10 labels in ref) →
3 related products → navy CTA band.
**Implementation rules (locked):**
- Spec table shows **real values** (C-2 fix) — do **not** copy the ref's «—» placeholder values.
  Spec schema: `SpecRow { label, value }`, identity rows + verified fragments, missing values absent.
- Gallery (M-1 fix): a single image renders **large at 4:3**; thumbnail grid only when multiple
  images exist.
- Related products: M-4 — images repeat (12 stand-ins / 37 products); keep representative status
  labelled, never present a stand-in as a real product photo.
- «تحميل كتيب المنتج» (datasheet download): **no datasheet files exist** — do not render a dead
  download button; hide until the client supplies files (CI-06).
- WhatsApp CTA with contextual message (`product` context in `waLink()`).

### T6 — Solution detail (`solutions/[slug]/page.tsx`, ref 09) — SPLIT hero

Split hero (text right, photo left: panels + blue pump + water + palms) → overview split +
3 mini-features → challenges band (4 cards) → 4-step flow cards (01 panels → 02 controller →
03 pump → 04 distribution) → **isometric system diagram** (labeled cross-section) →
3 application cards → related products + related projects → navy WhatsApp CTA band.
**Current state:** pumping detail exists with steps/challenges/applications (per `solutions.ts`
header); `SystemDiagram.tsx` is the diagram candidate — **confirm in Phase 4** that it renders the
labeled cross-section and is wired to the pumping page. The other four solution areas have **no
detail content by design** — their routes exist, but no detail blocks may be invented for them.

### T7 — Systems / bundle detail (`systems/page.tsx`, `systems/[slug]/page.tsx`)

Index: 3 confirmed bundles. Detail: bundle name, verbatim components (`components`), suitable use
(`use`), linked catalogue products **only where identified** (`componentProductIds` — unconfirmed
components are NOT linked), contextual WhatsApp CTA (`system` context). No hero reference exists;
follows the T6 split-hero pattern. `bundle-4` (archived) has no page and must never be linked.

### T8 — Projects listing (`projects/page.tsx` + `ProjectsClient.tsx`, ref 05) — FULL-WIDTH hero

Full-width hero (ref: **ground-level** solar farm + mountains; implemented `hero-solar-farm.jpg` is
**aerial** — known fidelity risk) → intro + filter pills (all/solar/water/agriculture) →
4 alternating rows → gallery carousel → navy CTA band → footer.
**Current state:** truthful empty state ("مشاريع قيد التوثيق") — no invented projects.
Filter pills and carousel have **no real content** to filter/show until approved projects exist —
do not build fake rows.

### T9 — Project detail (NO ROUTE — template only, ref 10)

`ProjectDetailTemplate.tsx` exists in source: full-width hero (text overlaid top-right) → overview
split + location card → challenge/solution alternating rows → scope + equipment chips → gallery
carousel → 4 key-result cards → related products/solutions → navy CTA band.
**Locked:** do not wire a route or invent a project, location, capacity, or outcome until
client-approved project evidence exists.

### T10 — Brands / agencies (`agencies/page.tsx`, `agencies/[slug]/page.tsx`)

Index: logo/name grid of 6 agencies with classification (official agent vs. carried brand).
Detail: brand description, representation statement **only where proven**, product-family links
(products filtered by brand), related products, CTA. Never imply exclusive agency or official
authorization without evidence. No page reference covers this template; it follows T2 composition.

### T11 — Supporting pages (shared template)

One shared supporting template (section heading, body, CTA band, footer) for:
- **Services** (`/services`) — service list from `services` in `solutions.ts`.
- **Support** (`/support`) — support + warranty; warranty text pending, **no duration published**.
- **Downloads** (`/downloads`) — honest empty state, no files until CI-06.
- **News** (`/news`) — honest empty state, 0 articles until CI-07.
- **Search** (`/search` + `SearchClient.tsx`) — results + empty state; indexes published items only.
- **Guidance** (`/guidance` + `GuidanceClient.tsx`) — pumping guidance tool, guidance-only
  (`guidanceOnly: true`): no sizing, no model recommendation.
- **Privacy / Terms** (`/privacy`, `/terms`) — legal pages.
- **Admin** (`/admin` + `AdminClient.tsx`) — demo only, noindex, excluded from sitemap; not a CMS.

## 3. Section-composition rules (all templates)

- **One job per section** (frontend-design litmus): each section explains, proves, deepens, or
  converts — never repeats the same mood statement.
- **No card-grid monotony:** do not repeat the same card grid on every page (v15 §6). Editorial
  rows, split blocks, bands, and diagrams alternate by template as the refs dictate.
- **CTA discipline:** one primary WhatsApp CTA per viewport where the ref shows one; CTA bands are
  navy with a white WhatsApp button (green WhatsApp icon only where the ref shows it, e.g. ref 09).
- **Breadcrumbs** on T4, T5, T6, T9 (when routed). **Search** on T3, T4, T11-search.
- **Empty states** are first-class: honest copy + a real next step (browse catalogue / WhatsApp),
  never fabricated filler.

## 4. Responsive behaviour (locked expectations for Phase 4/8 verification)

- Viewports: narrow mobile, 390×844 mobile, tablet, 1440×900 desktop (report baseline), large desktop.
- Split heroes stack (text above photo) at mobile widths; full-width heroes keep the focal subject
  visible with a safe text area — never text over the busy side of an image.
- No horizontal overflow at any viewport (0 px); tables (spec table) scroll horizontally inside
  their container on mobile, never breaking the page.
- Sticky mobile WhatsApp bar must not cover hero buttons or footer content at 390 px.
- Touch targets ≥ 44 px; drawer/mega menu fully operable by touch and keyboard.
- Reduced motion: all animation off, content fully visible (see technology map).

## 5. What is NOT decided here (Phase 3/4)

- Fonts/palette reconciliation (Tajawal+Montserrat / `#0F2E4D` vs. board IBM Plex Sans Arabic + Inter /
  `#0081FB` / `#102B46`).
- Official logo integration (flat JPEG, solid blue — transparency/background treatment).
- Marquee styling (navy bg vs. ref white bg/black text).
- Home hero image assignment (`hero-villa-mountains` vs. `hero-villa-sea`) and copy colour (ADR-03).
- Mega-menu visual design (board-driven, Phase 3).
- Datasheet download behaviour (hidden until files exist — locked) and downloads content (CI-06).

## 6. Component inventory (actual, from `src/components/`)

22 files. Grouped by role (the flat directory is a recorded deviation from v15 §7.2 — see
`docs/architecture-overview.md` §4).

### Layout / navigation / shell

| Component | File | Role | Notes |
|---|---|---|---|
| Header | `Header.tsx` (199 lines) | Opaque white sticky header; desktop nav (7), drawer (10), WhatsApp pill, language switch | C-1 fix at line 88 (`bg-white`). No mega menu. |
| TopBar | `TopBar.tsx` (37) | Utility/contact bar above header | |
| Footer | `Footer.tsx` (112) | Brand + social + 8 category links + quick links + contact + legal | |
| Wordmark | `Wordmark.tsx` (51) | Typographic GTS wordmark (temporary; official logo pending) | Replace in Phase 3 |
| LanguageSelector | `LanguageSelector.tsx` (38) | 3-locale switcher via `switchLocalePath()` | Preserves equivalent page |

### Hero / CTA / WhatsApp

| Component | File | Role |
|---|---|---|
| Hero | `Hero.tsx` (233) | Hero variants (`center`, split), breadcrumbs, badge/WhatsApp variants; 25% navy overlay (M-2, lines 136–141) |
| CTABand | `CTABand.tsx` (212) | Navy CTA band, `split` variant with contact rows |
| WhatsAppButton | `WhatsAppButton.tsx` (67) | Contextual WhatsApp CTA (via `waLink()`) |
| WhatsAppFloat | `WhatsAppFloat.tsx` (30) | Floating WhatsApp button (global) |
| StickyWhatsAppBar | `StickyWhatsAppBar.tsx` (49) | Sticky mobile WhatsApp bar |

### Catalogue — client islands

| Component | File | Role |
|---|---|---|
| CatalogueClient | `CatalogueClient.tsx` (220) | `/products`: search, featured grid, show-all toggle. **Hard-coded wa.me at line 183 — Phase 5 fix** |
| CategoryClient | `CategoryClient.tsx` (194) | Category page: type/brand dropdowns, search, sort, count |
| ProductCard | `ProductCard.tsx` (105) | Product card (image, name, category, WhatsApp outline button) |
| Gallery | `Gallery.tsx` (95) | Product gallery — M-1 rule: single image large 4:3, thumbs only if multiple |
| SearchClient | `SearchClient.tsx` (129) | `/search` results |
| ProjectsClient | `ProjectsClient.tsx` (123) | `/projects` listing + truthful empty state |
| GuidanceClient | `GuidanceClient.tsx` (115) | `/guidance` pumping guidance tool |
| ContactForm | `ContactForm.tsx` (161) | Contact form → WhatsApp; no phone field |
| AdminClient | `AdminClient.tsx` (363) | `/admin` demo panel (largest component; demo only) |

### Cards / sections / diagrams

| Component | File | Role |
|---|---|---|
| Cards | `Cards.tsx` (162) | `CategoryCard`, `SolutionCard`, `SolutionCardHorizontal`, `CategoryTile`, `ProjectCard`, `categoryIcon()` |
| SystemDiagram | `SystemDiagram.tsx` (59) | Pumping system diagram candidate — wiring to pumping page **unconfirmed** (verify Phase 4) |
| ProjectDetailTemplate | `ProjectDetailTemplate.tsx` (76) | Ref-10 template — **unwired, no route** (deliberate) |

### Primitives

| Component | File | Role |
|---|---|---|
| ui | `ui.tsx` (334) | `Reveal`, `SectionHeading`, `SectionHeadingL`, `Breadcrumbs`, `EmptyState`, `ZhNotice`, `IconFeature`, `FeatureCard`, `SpecTable`, `Pagination`, `SearchInput`, `SortSelect`, `ResultMeta`, `EditorialBlock` |

### Gaps vs. design-system needs (Phase 3 — record, do not build here)

1. **No mega-menu component** (v15 §5.5 requires one) — new component, board-driven design.
2. **No dedicated Button component** — variants are ad hoc across `Hero`/`WhatsAppButton`/`CTABand`;
   Phase 3 must define Primary / Secondary / Outline / Text / Icon / WhatsApp / Light-on-dark
   variants in one place (v15 §9.2).
3. **No modal/lightbox component** — gallery lightbox is a Phase 4/5 decision (keyboard Esc/arrows,
   accessible); do not add one speculatively.
4. **No form-field primitives** — inputs/selects live inside `ContactForm`/`SearchClient`; Phase 3
   standardises Text / Email / Textarea / Select / Search / validation / error / success states.
5. **No `three/` or animation components** — Three.js/R3F not installed; any 3D is a Phase 6 decision.
6. **Inline line art** — `SolarFieldLineArt` SVG is inline in the home page, not a shared component;
   Phase 3/6 should extract it as a reusable SVG illustration.
7. **No `features/` / `hooks/` / `styles/` structure** — flat `components/` + `lib/` is the actual
   architecture; restructuring is a prefactoring ticket, not a drive-by change.
