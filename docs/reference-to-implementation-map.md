# Reference-to-Implementation Map — DRAFT (v15 Phase 1, updated Phase 4)

**Status:** DRAFT mapping, updated 2026-11-15 (Phase 4). Built from the 10 inspected reference images + source reads of
`src/app/[locale]/page.tsx`, `Hero.tsx`, `Header.tsx`, `CatalogueClient.tsx`, `CategoryClient.tsx`,
`next.config.ts`, and the `out/` route list. **Layout fidelity was NOT visually verified against the
live site in this audit** (text fetches only) — every "Implementation" row below is a source-level
mapping; visual PASS/PARTIAL/FAIL per page belongs to Phase 8. **Phase 4 did not run a build**
(coordinator owns the single build after integration), so all Phase 4 statuses below are
source-level, not visually confirmed.

## 1. Hero-type decision table (CORRECTS the M-3 premise)

The report (§10) and v15 §2.6 claim the references use full-width heroes on About, Solutions,
Projects, Contact (and pumping). **Direct inspection proves otherwise.** The binding per-page
decision is:

| Ref | Page | Hero type in reference | Focal subject | Implementation route | Hero impl. status (Phase 4) |
|---|---|---|---|---|---|
| 01 | Home | **FULL-WIDTH, centered** | White villa + rooftop solar + sea/city; black headline, no dark overlay | `/[locale]` (`page.tsx`, `Hero variant="center"` + new `darkText` prop, `hero-villa-mountains.jpg`) | **Implemented (source):** navy headline on bright sky, NO navy overlay, white gradient scrim behind the text (measured fallback — navy 8.80:1 median / 5.26:1 p10 on the sky zone; see `docs/visual-gap-analysis.md` §1.1). **Subject still differs** (villa + mountains, not villa + sea — `hero-villa-sea.jpg` stays on About, ref 02) |
| 02 | About | **SPLIT** (text left, photo right ~45%) | Villa + rooftop panels + sea | `/[locale]/about` (`Hero variant="side-left"`, image `hero-villa-sea.jpg`) | **Confirmed in source:** `side-left` = text physical-left, photo right in RTL — matches ref. Visual confirmation still Phase 8 |
| 03 | Solutions | **SPLIT** (text right, photo left ~55%) | White villa + ground-mount panels + mountains | `/[locale]/solutions` (`Hero variant="side-right"`, `hero-villa-mountains.jpg`) | **Confirmed in source:** text physical-right, photo left — matches ref. Visual confirmation still Phase 8 |
| 04 | Products | **SPLIT** (text left, photo right) | Panel + submersible pump + water + mountains | `/[locale]/products` (`CatalogueClient`, hero `hero-pump-mountains.jpg`) | **FIXED in Phase 4:** was `variant="split"` (text right — wrong side); now `side-left` (text left, photo right) — matches ref |
| 05 | Projects | **FULL-WIDTH** (text top-left) | Ground-level solar farm + mountains | `/[locale]/projects` (new `Hero variant="full-left"`, `hero-solar-farm.jpg`) | **FIXED in Phase 4:** was a split hero with a villa image; now full-width, text top physical-left, white on 60% navy overlay (measured: 7.32:1 — see gap analysis §1.2). **Known risk remains:** implemented `hero-solar-farm.jpg` is aerial, ref is ground-level — no ground-level asset exists |
| 06 | Product detail | **SPLIT** (text left, product photo right) | White hybrid inverter + rooftop panels | `/[locale]/products/[slug]` (custom grid: Gallery first, `Gallery.tsx`) | **Confirmed in source:** gallery right / summary left in RTL — matches ref. Per-product photo is a stand-in (M-4) |
| 07 | Contact | **SPLIT** (text right, photo left) | House + rooftop panels | `/[locale]/contact` (`Hero variant="side-right"`, `house-bright.jpg`) | **Confirmed in source:** text right, photo left — matches ref. Visual confirmation still Phase 8 |
| 08 | Category | **SPLIT** (text right, photo left) | Panels + inverter + battery cabinet + villa | `/[locale]/products/category/[slug]` (`Hero variant="split"`, per-category photo) | **Confirmed in source:** text right, photo left — matches ref. Visual confirmation still Phase 8 |
| 09 | Solution detail (pumping) | **SPLIT** (text right, photo left) | Panels + blue pump + water + palms | `/[locale]/solutions/[slug]` (pumping only, `Hero variant="side-right"`, `hero-pump-mountains.jpg`) | **Confirmed in source:** text right, photo left — matches ref. `SystemDiagram.tsx` wiring **confirmed** in Phase 4 (5-node pumping chain) |
| 10 | Project detail | **FULL-WIDTH** (text overlaid top-right) | Solar pumping station (panels + tank + channel + fields) | **NO ROUTE — deliberate** | No approved project evidence; `ProjectDetailTemplate.tsx` exists but is unwired. Template only, do not invent a project. |

**Rule for Phase 4:** full-width on 01/05/10 only; split on 02/03/04/06/07/08/09. Do not force
full-width onto the seven split pages.

## 2. Page-by-page section mapping

### 01 Home → `src/app/[locale]/page.tsx`
| Ref section | Implementation | Data source |
|---|---|---|
| Transparent header over hero | `Header.tsx` — **opaque white sticky** (C-1 fix); ref header is transparent over sky. Deliberate deviation, do not revert. | — |
| Centered hero, badge, black H1, navy WhatsApp CTA | `Hero variant="center"` + **`darkText`** (Phase 4): navy headline on bright sky, no navy overlay, white gradient scrim (measured fallback); `badgeStyle="white"`, `whatsappVariant="navy-pill"`; image `hero-villa-mountains.jpg` (subject still villa + mountains, not villa + sea — see gap analysis H-2) | `pages.home` (k1–k3) |
| Guidance bar (extra vs. ref) | Present (home + /products only) — «دليل الضخ» + WhatsApp | hardcoded ar/en/zh in page.tsx |
| Intro + 3 pillars + solar line art | `pillars` (sun/droplet/leaf, Lucide) + shared `SolarLineArt` component (extracted from inline SVG in Phase 4) | `data/solutions.ts` pillars |
| Marquee «خبراتنا — تأثيرنا — حلولنا» | Present, **navy background** (`bg-primary`); ref marquee is white bg / black text — open decision D-5, Phase 3; unchanged in Phase 4 | `pages.home` k10–k21 |
| 2×2 editorial solution cards | `SolutionCardHorizontal` ×4 (residential / pumping / irrigation / solutions-index) | `solutionAreas` + `pages.solutions` |
| Why us (light-blue band, 3 white cards) | Present, `bg-surface-blue` + faint `villa-sky.jpg` at 12% opacity | `pages.home` k30–k35, k40–k41 |
| Panoramic visual (§6.1 item 12) | **Added in Phase 4:** full-width decorative solar-farm photo band between Why-Us and featured products | `/images/photos/solar-farm.jpg` |
| Featured products (3 tiles) | **Rebuilt in Phase 4:** 3 real featured products (one per category: inverters / batteries / pumps), real names, links to product pages. The two generic "project" cards that used to share this section were REMOVED (§6.1 item 15: featured projects only if genuine — none exist) | `products` (`featured`, published) |
| Brand/partner preview (§6.1 item 16) | **Added in Phase 4:** Deye official-agent card + 5 carried brands as wordmarks with their "brand we carry" status, linking to /agencies | `agencies` |
| Stats (§6.1 item 7) | **OMITTED in Phase 4:** no verified statistics exist; inventing numbers is prohibited (§3.4) | — |
| Navy CTA band + contact rows | `CTABand variant="split"` (mail / phone / address rows) | `siteSettings.contact` |
| Footer | `Footer.tsx` + `Wordmark.tsx` | `siteSettings` |

### 02 About → `src/app/[locale]/about/page.tsx`
Ref: split hero → statement + 3 pillars → story split (photo left) → mission/vision 2 cards →
3 expertise photo cards → navy photo CTA band → footer. Implementation route exists; live text fetch
confirms statement, pillars, story, mission, vision, expertise cards, CTA all render. **Phase 4
(source-level):** hero is `side-left` (text left, photo right — matches ref 02) and the story uses
`EditorialBlock flip` (photo left — matches ref); `.reveal` / `data-stagger` hiding removed from
this page. Visual confirmation still Phase 8.

### 03 Solutions → `src/app/[locale]/solutions/page.tsx` + `[slug]/page.tsx`
Ref: split hero → centered intro → 5 alternating editorial rows → 4-step process (RTL arrows) →
full-width photo CTA band → footer. Implementation: 5 `solutionAreas`; only `pumping` has a detail
page. **Phase 4 (source-level):** process steps and CTA band wiring confirmed present; hero is
`side-right` (text right, photo left — matches ref 03); `SectionHeadingL` / `data-stagger` hiding
removed. Visual confirmation still Phase 8.

### 04 Products → `src/app/[locale]/products/page.tsx` + `src/components/CatalogueClient.tsx`
Ref: split hero → search + **12 category chips** → featured grid (2×6) + «عرض جميع المنتجات» link →
help banner → why-us 4 features → footer.
Implementation: search present; **hero side FIXED in Phase 4** (`side-left`: text left, photo right — was `split`, text right). **All-Products tab strip IMPLEMENTED in Phase 4 (ADR-07):** «جميع المنتجات» first/active by default (all 37 published) + 8 GTS categories with published counts, `?cat=` shareable; the `showAll` toggle and the featured-12 default are REMOVED, and the image-tile strip was removed as duplicate category navigation. Help banner present as the guidance bar; **the explicit «عرض جميع المنتجات» link is now the All tab itself** (no `/products/all` route — by design).

### 05 Projects → `src/app/[locale]/projects/page.tsx` + `ProjectsClient.tsx`
Ref: full-width ground-level hero → intro + filter pills (all/solar/water/agriculture) → 4 alternating
rows → gallery carousel → navy CTA band → footer. Implementation: **hero FIXED in Phase 4** — was a
split hero with a villa image; now new `Hero variant="full-left"` (full-width, text top physical-left,
white on 60% navy overlay — measured 7.32:1) with `hero-solar-farm.jpg` (still aerial vs. ref
ground-level — no ground-level asset exists). Listing page with truthful empty
state ("مشاريع قيد التوثيق" — no invented projects); **no project-detail routes**. Filter pills and
carousel have no real content to filter/show until approved projects exist — do not build fake rows.

### 06 Product detail → `src/app/[locale]/products/[slug]/page.tsx` + `Gallery.tsx` + `ProductCard.tsx`
Ref: split hero (breadcrumbs, H1, copy, thumbnail, «تحميل كتيب المنتج») → overview split →
4 key features → spec table (10 labels; ref values are «—») → 3 related products → navy CTA band.
Implementation: breadcrumbs, overview, benefits, spec table with **real values** (C-2 fix — correct,
do not copy the ref's «—»), related products (M-4: images repeat — 12 stand-ins for 37 products),
WhatsApp CTA with contextual message. «تحميل كتيب المنتج» (datasheet download) has **no datasheet
files** — pending client input; do not render a dead download button.

### 07 Contact → `src/app/[locale]/contact/page.tsx` + `ContactForm.tsx`
Ref: split hero → 3 contact-option cards (WhatsApp / general / technical support) → form split
(name* / email* / inquiry-type* / message* / submit) + photo panel → navy CTA band → footer.
Implementation: form present (phone field dropped per spec — matches ref, which has no phone field);
form submits via WhatsApp (`WA_MESSAGES.contact`), not email. **Hard-coded wa.me URLs at lines
41/43/61** (see audit §4) — route through `waLink()` in Phase 5.

### 08 Product category → `src/app/[locale]/products/category/[slug]/page.tsx` + `CategoryClient.tsx`
Ref: split hero → **category tab strip with «جميع المنتجات» first/active** → filter bar
(type/brand/search, sort, count «عرض 12 من 24») → 4×2 product grid → related categories →
navy WhatsApp CTA band → footer.
Implementation: filter bar present (type/brand dropdowns defaulting to "all", search, sort, count);
**the tab strip exists and gained published counts in Phase 4** (All = 37 + each category's
`publishedCount`; zero-count tabs stay visible, linking to honest empty states). Product cards use
dark «طلب استشارة» buttons in ref vs. WhatsApp-outline buttons in the live build — kept as-is in
Phase 4 (`ProductCard.tsx` is not a Phase 4 file).

### 09 Solution detail (pumping) → `src/app/[locale]/solutions/[slug]/page.tsx`
Ref: split hero → overview split + 3 mini-features → challenges band (4 cards) → 4-step flow cards
(01 panels → 02 controller → 03 pump → 04 distribution) → **isometric system diagram** (labeled
cross-section) → 3 application cards → related products + related projects → navy WhatsApp CTA band.
Implementation: pumping detail exists with steps/challenges/applications (per `solutions.ts` header);
`SystemDiagram.tsx` is the diagram — **wiring CONFIRMED in Phase 4** (pumping page passes its own
5-node chain: panels → controller → pump → tank → distribution, with caption). The diagram itself is
a flat node chain, not the ref's isometric cross-section — recorded as a Phase 6 illustration gap
(see `docs/visual-gap-analysis.md` U-3/U-4). The other four solution areas have **no detail content
by design** — their routes exist, but no detail blocks may be invented for them.

### 10 Project detail → NO ROUTE (deliberate)
Ref template only. `ProjectDetailTemplate.tsx` exists in source; do not wire a route or invent a
project, location, capacity, or outcome until client-approved project evidence exists.

## 3. Shared shell mapping (all refs)

| Element | Reference pattern | Implementation |
|---|---|---|
| Header | Logo right, nav center, language switch, WhatsApp pill; transparent over hero on 01/05/10, white elsewhere | `Header.tsx` — opaque white sticky always (C-1); `TopBar.tsx`; `LanguageSelector.tsx`; mobile drawer (`drawer__panel`) |
| Language switch | «عربي \| EN» pill (refs show EN only; ZH is a GTS requirement, no ref coverage) | 3-locale switcher ar/en/zh |
| WhatsApp CTA | Navy pill (most refs), green pill (03), white-on-navy (CTA bands), outline (04 cards) | `WhatsAppButton.tsx`, `WhatsAppFloat.tsx`, `StickyWhatsAppBar.tsx`, `CTABand.tsx` |
| Footer | Logo + nav + contact + social + legal + giant pale wordmark (most refs) | `Footer.tsx` + `Wordmark.tsx` |
| Mega menu | Not shown in any of the 10 refs (nav is a flat row) | v15 §5.5 requires a products mega menu — **no reference coverage**; design from the Design System board in Phase 3, do not invent from the refs |
| Breadcrumbs | Present on 06, 08, 09, 10 | `Hero.tsx` breadcrumb rendering |
| Search | Search box on 04, filter bar on 08 | `/search` route + `SearchClient.tsx`; per-page search in Catalogue/Category clients |

## 4. Known gaps / decisions owed (updated Phase 4)

1. **Home hero copy color — DECIDED + IMPLEMENTED in Phase 4 (ADR-03):** ref 01 black headline on bright sky. Implemented as navy `#102B46` headline + white gradient scrim (measured: 8.80:1 median / 5.26:1 p10 on the sky zone — see `docs/visual-gap-analysis.md` §1.1). The old white-on-25%-overlay treatment is gone from the home hero (kept only as the `darkText=false` fallback path in `Hero.tsx`, unused by any page).
2. **Home hero subject:** ref 01 white villa + panels + **sea**; implemented `hero-villa-mountains.jpg`.
   `hero-villa-sea.jpg` exists in `public/images/heroes/` (used on About, where ref 02 also shows villa + sea) — swapping would steal About's correct image. Needs a new asset or a client decision, not a code fix.
3. **Marquee styling:** ref 01 white bg/black text vs. implemented navy bg/white text — open decision D-5, Phase 3; unchanged in Phase 4.
4. **"All Products" tab strip — IMPLEMENTED in Phase 4 (ADR-07):** `/products` has the strip (All first/active, 8 categories + counts, `?cat=` shareable, `showAll` toggle removed); category pages have the strip with counts added. No `/products/all` route (by design).
5. **Category chips row** (ref 04, 12 chips) — superseded by the ADR-07 tab strip (8 GTS categories); the image-tile strip on `/products` was removed as duplicate navigation in Phase 4.
6. **Datasheet download** (ref 06 «تحميل كتيب المنتج») — no files; hide until client supplies (CI-06). Unchanged.
7. **Mega menu** — no ref coverage; board-driven design needed (Phase 3).
8. **Projects page** — filter pills/carousel/rows cannot be built without approved projects. Hero fixed in Phase 4 (full-width `full-left`); aerial-vs-ground-level image gap remains (no ground-level asset).
9. **Fonts/palette reconciliation** — Tajawal+Montserrat / navy #0F2E4D vs. board IBM Plex Sans Arabic
   + Inter / #0081FB / #102B46 (Phase 3).
10. **Official logo integration** — replace typographic wordmark with `gts-official-logo.jpg`
    (JPEG on solid blue — needs a transparency/background treatment decision; no vector supplied).
11. **Blank-before-reveal residual (new, Phase 4):** Phase 4 removed every `.reveal` / `data-stagger` hook from its own files, but the shared primitives in `ui.tsx` (`Reveal`, `SectionHeadingL`, `SectionHeading`, `EmptyState`) still inject `.reveal` and `globals.css` still hides it under `html.js`. Phase 3 should remove the hiding from the primitives; Phase 6 re-adds reveals only as JS-applied progressive enhancement. See `docs/visual-gap-analysis.md` §5.
12. **M-4 repeated imagery (new, Phase 4):** only 4 stand-in photos serve 37 products; related products and the product-overview block repeat the same image. Needs real client photos (CI-01); no code fix per ADR-08.
13. **Token migration (new, Phase 4 — see `docs/visual-gap-analysis.md` §6):** Phase 3 re-tokenised `globals.css` mid-Phase-4 (canonical names now carry board values: `text-primary`/`bg-primary` = `#0081FB`, `text-accent`/`bg-accent` = `#89E9F8`). Phase 4 migrated all its own files to canonical classes (`text-navy`, `bg-navy`, `text-primary-hover`, `bg-sky`, headings H1 Bold / H2–H4 Semibold); `tsc` exit 0. **Blocked on others:** `ProductCard.tsx` and `ProjectDetailTemplate.tsx` still use old classes (outside Phase 4 ownership) — the deprecated aliases in `globals.css` must NOT be deleted until they are migrated. Button fill (navy vs. recommended `#0B70C9`) is a coordinator decision.
