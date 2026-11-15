# Site Map — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Status:** LOCKED.
**Sources:** `docs/current-state-audit.md` §3 (routes recomputed from `out/`), `src/app/sitemap.ts`,
`src/app/[locale]/` source routes (22 `page.tsx` files), `src/data/*.ts` counts.

## 1. Route accounting (verified)

| Measure | Count | Evidence |
|---|---|---|
| HTML files in `out/` (last local build 2026-11-14 12:47) | **231** | 228 locale routes + root `index.html` + `404.html` + `_not-found.html` |
| Routes per locale | **76** | 75 files under `out/<locale>/` + flat locale root (`out/ar.html` etc.; `out/<locale>/index.html` does **not** exist) |
| Routes probed historically (229) | 228 + root | 228 locale routes + root `index.html`; 404/`_not-found` excluded — reconciles exactly |
| Sitemap entries (`src/app/sitemap.ts`) | **228** | Every public route × 3 locales; `/admin` excluded (noindex) |
| Source `page.tsx` files under `[locale]/` | **22** | Home + 21 (see §2) |
| Locales | **3** | `ar` (default, RTL), `en`, `zh` — `src/lib/i18n.ts` |

Per-locale breakdown of the 76 routes: home 1; static pages 16; agency details 6; product
categories 8; product details 37; solution details 5; system/bundle details 3.
(1 + 16 + 6 + 8 + 37 + 5 + 3 = 76 ✓)

## 2. Full route inventory

### 2.1 Root (outside `[locale]/`)

| Route | File | Purpose / status |
|---|---|---|
| `/` | `src/app/page.tsx` | Minimal link page to `/ar` (6,206 B). NOT a landing page. |
| `/404` (fallback) | `src/app/not-found.tsx` + `out/404.html`, `out/_not-found.html` | 404 state. |

### 2.2 Static pages — 16 per locale (`/[locale]/<page>`)

| # | Route | Source | Purpose (verified) | Template |
|---|---|---|---|---|
| 1 | `/about` | `about/page.tsx` | Company overview: statement, 3 pillars, story, mission/vision, 3 expertise cards, navy photo CTA | Corporate / split hero (ref 02) |
| 2 | `/admin` | `admin/page.tsx` → `AdminClient.tsx` | **Demo admin only** (title "Admin — Demo"). No real CMS. Excluded from sitemap, noindex. | Supporting (not public navigation) |
| 3 | `/agencies` | `agencies/page.tsx` | Brands & partners index — 6 agencies; only Deye confirmed official agent | Brands index |
| 4 | `/contact` | `contact/page.tsx` → `ContactForm.tsx` | Contact options + form (no phone field, per spec); submits via WhatsApp (`WA_MESSAGES.contact`). **Hard-coded wa.me URLs at lines 41, 43, 61 — fix in Phase 5** | Contact / split hero (ref 07) |
| 5 | `/downloads` | `downloads/page.tsx` | Downloads centre — **honest empty state**: no files until CI-06 approves them | Supporting |
| 6 | `/guidance` | `guidance/page.tsx` → `GuidanceClient.tsx` | Pumping guidance tool — **guidance ONLY** (`guidanceOnly: true`): no pump sizing, no model recommendation | Supporting |
| 7 | `/news` | `news/page.tsx` | News/events — **honest empty state**: 0 articles until CI-07 approves content | Supporting |
| 8 | `/privacy` | `privacy/page.tsx` | Privacy policy (legal) | Legal |
| 9 | `/products` | `products/page.tsx` → `CatalogueClient.tsx` | Catalogue index: search, featured grid (12 of 37 by default, show-all toggle), guidance bar, help banner, why-us | Catalogue / split hero (ref 04) |
| 10 | `/projects` | `projects/page.tsx` → `ProjectsClient.tsx` | Projects listing — **truthful empty state** ("مشاريع قيد التوثيق"): no invented projects | Projects listing / full-width hero (ref 05) |
| 11 | `/search` | `search/page.tsx` → `SearchClient.tsx` | Site search results + empty state | Supporting |
| 12 | `/services` | `services/page.tsx` | Services listing (from `services` in `solutions.ts`) | Supporting |
| 13 | `/solutions` | `solutions/page.tsx` | Solutions listing — 5 solution areas, editorial rows, 4-step process | Solutions / split hero (ref 03) |
| 14 | `/support` | `support/page.tsx` | Support & warranty — **warranty text pending: NO duration published, ever** (until client approves unified wording) | Supporting |
| 15 | `/systems` | `systems/page.tsx` | Ready-made systems / bundles index (3 confirmed) | Systems index |
| 16 | `/terms` | `terms/page.tsx` | Terms of use (legal) | Legal |

### 2.3 Dynamic routes — 59 per locale

| Route pattern | Count/locale | Source data | Notes |
|---|---|---|---|
| `/products/[slug]` | **37** (published only) | `products.ts` p01–p39, `status: "published"` | p30 (Hanwha Q-Cells) and p39 (Wisenet) are `pending`: no page, no image. Slug = ASCII, brand + model. |
| `/products/category/[slug]` | **8** | `categories.ts` | `inverters` (13 published), `batteries` (16), `pumps` (7), `controllers` (1), `panels` (0), `cameras` (0), `systems` (0), `storage-ci` (0). Zero-product categories still have routes — they must render honest empty states, not 404s. |
| `/solutions/[slug]` | **5** | `solutions.ts` `solutionAreas` | `residential`, `commercial`, `pumping`, `irrigation`, `agriculture`. **Only `pumping` has full detail content** (`PumpingDetail`: challenges, 4 steps, applications, `SystemDiagram`). The other four routes exist but have no detail blocks — Phase 4 must confirm what they render and must not invent detail content. |
| `/systems/[slug]` | **3** (confirmed only) | `bundles.ts` | `bundle-1`, `bundle-2`, `bundle-3`. `bundle-4` (Ramadan, archived, past season) correctly has **no page**. |
| `/agencies/[slug]` | **6** | `agencies.ts` | `deye`, `efore`, `must`, `jntech`, `qcells`, `wisenet`. Only `deye` is a confirmed official agency; the other five are carried brands — representation wording must say so. |

### 2.4 Deliberately absent routes (locked — do not create without client evidence)

| Absent route | Reason |
|---|---|
| `/projects/[slug]` (project detail) | **No approved project evidence exists.** Ref 10 is a template only. `ProjectDetailTemplate.tsx` exists in source but is unwired — do not wire it or invent a project, location, capacity, or outcome. |
| `/products/all` | Does not exist. The All-Products fix (see §5) is a **tab/strip on existing pages**, not a new route — unless Phase 4 decides otherwise and records it. |
| `/news/[slug]` (article detail) | No articles exist (0 approved). No route until CI-07 content is approved. |
| `/industries` | Listed in v15 §5.1/§6.10 as a principal area, but **no such route, page, or data exists** in the current build. It is a gap, not a hidden page: adding it is a Phase 4 scope decision (content must come from approved sources, not invented). |
| `/brands` | v15 §7.2 example path; the real route is `/agencies`. Do not create an alias. |

## 3. Sitemap table (per locale — ×3 for ar/en/zh)

Sitemap generation: `src/app/sitemap.ts` (`BASE = https://ghamdan-website.vercel.app`,
`lastModified: 2026-11-14`, `dynamic = "force-static"`). Admin excluded.

| Group | Paths per locale | ×3 locales |
|---|---|---|
| Home + static pages (excl. admin) | ``, `/about`, `/solutions`, `/products`, `/systems`, `/projects`, `/services`, `/support`, `/news`, `/agencies`, `/downloads`, `/guidance`, `/search`, `/contact`, `/privacy`, `/terms` (17) | 51 |
| Solution details | `/solutions/residential`, `/commercial`, `/pumping`, `/irrigation`, `/agriculture` (5) | 15 |
| Product categories | `/products/category/inverters`, `/batteries`, `/panels`, `/pumps`, `/controllers`, `/cameras`, `/systems`, `/storage-ci` (8) | 24 |
| Product details | `/products/<37 published slugs>` | 111 |
| System/bundle details | `/systems/bundle-1`, `/bundle-2`, `/bundle-3` (3) | 9 |
| Agency details | `/agencies/deye`, `/efore`, `/must`, `/jntech`, `/qcells`, `/wisenet` (6) | 18 |
| **Total sitemap entries** | | **228** |

## 4. Navigation — locked structure

### 4.1 Header (desktop, `Header.tsx`)

- **Locked appearance (C-1 fix):** opaque white, sticky `top-0 z-50 bg-white`, dark readable links
  from first paint. Never transparent again (the hero sits below the header in flow; transparency
  made the white wordmark/nav invisible at scroll 0).
- **Layout:** wordmark (right in RTL) · nav centre · language switch + WhatsApp pill (left in RTL).
  `TopBar.tsx` utility/contact bar sits above the header.
- **Desktop primary nav (7 items, `NAV_ITEMS` in `Header.tsx:16–22`):**
  Home `/` · About `/about` · Products `/products` · Solutions `/solutions` ·
  Systems `/systems` · Projects `/projects` · Contact `/contact`.
- **Active state:** current route highlighted (pathname-based); hover/focus-visible states required;
  keyboard operable.
- **WhatsApp pill:** navy pill by default (`whatsappVariant="navy-pill"`); green pill on the
  Solutions page (`onSolutions` — matches ref 03's green pill). All pills route through `waLink()`
  except the 4 hard-coded exceptions (see ADR-05).

### 4.2 Products mega menu (v15 §5.5 — REQUIRED, does not exist yet)

- **Status:** no mega menu exists in the current build. The 10 references show only a flat nav row —
  **no reference coverage**; the design must come from the Design System board in Phase 3.
  Do not invent it from the refs.
- **Locked structure (to be built in Phase 3/4):**
  - Trigger: the **Products** nav item (hover on desktop pointer-fine, click/tap otherwise;
    keyboard: Enter/Space opens, Esc closes, arrow keys move, focus returns to trigger on close).
  - Content: the **8 real categories** (see §2.3 counts), each with its real icon (`icon` field in
    `categories.ts`: `zap` etc. via `categoryIcon()` in `Cards.tsx`), localized name, and published
    count; categories with 0 published products are shown but marked as such (they link to their
    honest empty-state page — never a dead link).
  - **All Products entry (first, prominent):** links to `/products` with the full catalogue shown
    (see §5 — the tab-strip fix). This is the locked All-Products entry point.
  - Secondary column: **Ready-made systems** — links to `/systems` + the 3 confirmed bundles.
  - Every link must resolve; no link may point to a pending/archived item (p30, p39, bundle-4).
  - Geometry: full-width panel under the header, aligned to the nav; closes on route change,
    outside click, or Esc. Must not create horizontal overflow at 390 px (mobile uses the drawer
    instead — see §4.4).
  - **No fake imagery:** category tiles use real icons only; no invented product photos in the menu.

### 4.3 Mobile drawer (`Header.tsx` drawer, `drawer__panel`)

- Trigger: hamburger (`nav.menu` label) at `< lg` breakpoint; close button (`nav.close`).
- **Drawer links (10 items, `DRAWER_LINKS`):** the 7 desktop items + Services `/services` +
  Agencies `/agencies` + News `/news`.
- **Nested products:** the drawer must expose the same 8 categories + All Products entry as a
  nested/expandable group under Products (accordion, not a second drawer level) — this is the
  mobile equivalent of the mega menu.
- Language switcher and WhatsApp CTA are reachable inside/near the drawer (Phase 4 to confirm
  placement visually). Drawer is scrollable (`overflow-y-auto`); focus must be trapped while open
  and returned on close (Phase 4 verification item).

### 4.4 Language switcher (`LanguageSelector.tsx`)

- **Behaviour (locked):** 3-locale pill (ar / en / zh). Switching calls
  `switchLocalePath(pathname, nextLocale)` (`src/lib/i18n.ts:37`) — **the equivalent page is
  preserved across locales** (same path, different locale prefix); there is no redirect to home.
- `dir`/`lang` are set per locale in `[locale]/layout.tsx` (`localeDir()`: `ar` → RTL, `en`/`zh` → LTR).
- Missing `en`/`zh` strings fall back to `ar` (`t()` / `isFallback()`); a fallback must never be
  presented as a translation. `ZhNotice` (`ui.tsx`) marks zh-fallback content where applicable.
- **Open item:** the refs show only «عربي | EN»; ZH is a GTS requirement with no reference coverage.
  The 3-way switcher stays; its visual treatment follows the Phase 3 board.

### 4.5 Footer (`Footer.tsx` + `Wordmark.tsx`)

Columns (verified in source):
1. **Brand:** typographic wordmark + company summary + social links (Facebook, Instagram — verified
   URLs in `siteSettings.social`; no other social links may be added without verification).
2. **Categories:** all 8 category links (`/products/category/<id>`), localized names.
3. **Quick links:** About, Products, Solutions, Systems, Projects, Services, Agencies, News, Support
   (`nav.*` keys in `Footer.tsx:15–23`).
4. **Contact:** phone (`tel:` + display `+967 775 800 000`), email `info@ghamdan-trd.com`,
   address Sakhr St, Sana'a; hours Sat–Fri 8–20 (from `siteSettings.contact` — the only approved
   contact facts; sample contacts from the refs — info@sunfold.com, +966 numbers, Riyadh — must
   never appear).
5. **Legal row:** Privacy `/privacy` · Terms `/terms` + copyright line + giant pale wordmark
   (only if the Phase 3 board confirms it does not impair readability).

### 4.6 Breadcrumbs (`Breadcrumbs` in `ui.tsx`, rendered by `Hero.tsx`)

- Present on: product detail (Products › category › product), category (Home › Products › category),
  solution detail (Home › Solutions › solution), project detail template (when/if routed).
- Rule: every breadcrumb segment except the last is a working link; the last is plain text
  (current page). Breadcrumb labels use localized names, never slugs.

## 5. "All Products" fix — locked design (ADR-07)

**Problem (audit §9.2):** `/products` shows 12 featured products with a `showAll` toggle
(`CatalogueClient.tsx:38,139–148`, `cta.viewAllProducts`); `/products/category/*` has
all-type/all-brand dropdowns. But there is **no «جميع المنتجات» tab strip as the first/active tab**
(ref 08 pattern) on either page, and no `/products/all` route. A visitor can miss the full catalogue.

**Locked design (Phase 4/5 implementation):**
1. **Catalogue page (`/products`):** add a category tab strip directly under the hero/search,
   modelled on ref 08: first tab **«جميع المنتجات» (All Products, active by default)** showing all
   37 published products, followed by one tab per real category — **8 GTS categories, not the ref's
   12 chips** (ref 04's 12 chips are a sample taxonomy; GTS has 8). Each tab shows its published
   count; zero-count tabs (panels, cameras, systems, storage-ci) are visible but disabled-or-empty
   with an honest empty state — never hidden, never linking to nothing.
2. **Category pages (`/products/category/[slug]`):** add the same strip with the current category
   active and «جميع المنتجات» first, linking back to `/products` (all-tab state).
3. **Mega menu + drawer:** All Products is the first entry (see §4.2/§4.3) linking to `/products`
   in its all-tab state.
4. **No new route.** `/products/all` is NOT created; the all-state is the default state of
   `/products` (query param or client state only — Phase 4/5 to choose, must keep static export
   valid and the URL shareable).
5. **The existing `showAll` toggle is removed** when the strip lands (it becomes redundant);
   the featured-12 default is replaced by the all-tab default. Featured status (`featured: true`,
   12 products, round-robin rule) is retained as data for the home page's featured tiles only.
6. **Count display:** «عرض: N / 37» (`ResultMeta`) stays, driven by the active tab + filters.

## 6. Cross-cutting navigation rules

- **No dead controls:** every visible link/button performs a real action (v15 §13). No `href="#"`,
  no decorative controls. If a feature has no data, show an honest state, not an active control.
- **WhatsApp everywhere:** header pill, footer, CTA bands, floating button (`WhatsAppFloat.tsx`),
  sticky mobile bar (`StickyWhatsAppBar.tsx` — must not cover content at 390 px; Phase 8 check),
  product/category/system/support/guidance/contact contextual messages — all via `waLink()`
  after the Phase 5 hardcode fix.
- **Search:** `/search` route + `SearchClient.tsx`; per-page search in `CatalogueClient` /
  `CategoryClient`. Search indexes published products/categories/solutions only — never pending
  or archived items.
- **404 / empty states:** honest copy, a link back to `/products` or home, and (where relevant) the
  WhatsApp CTA. Never a fabricated suggestion.
