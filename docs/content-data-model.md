# Content & Data Model — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Status:** LOCKED.
**Sources:** `src/data/types.ts`, `src/data/*.ts`, `src/lib/i18n.ts`, `src/lib/whatsapp.ts`,
`src/lib/ui-copy.ts`, `docs/current-state-audit.md` §2/§5.

## 1. Principles (v15 §8, binding)

- **One source of truth:** product/category/brand/bundle/solution/page-copy data exists once, in typed
  modules under `src/data/`. No hardcoded copy duplicated across route files; page links are generated
  from stable slugs.
- **No fabrication:** missing values are **absent, never guessed**; missing spec text means no spec row.
  Internal traceability notes (`sourceNote`, `openConfirmation`) are never rendered as customer copy.
- **No prices, structurally:** there is **no monetary field anywhere** in the data model
  (audit §5: 0 `$<digit>` amounts, 0 `USD`, 0 price fields/components in source). The word
  "price/السعر" appears only in the approved inquiry-policy sentence and in code comments.
- **Locale completeness:** Arabic always present; `en`/`zh` optional with fallback to `ar`
  (never presented as a translation).

## 2. Entity-relationship map

```
Category (8) ──1:N──> Product (39; 37 published)
Brand (7 distinct in products; 6 agencies) ──1:N──> Product
Agency (6) ──1:N──> Product        (via brand name; only Deye = confirmed official)
Bundle (4; 3 confirmed) ──M:N──> Product   (via componentProductIds, identified items only)
SolutionArea (5) ──M:N──> Product  (related products per solution; pumping only, fully)
SolutionArea ──M:N──> Project     (related projects — none exist; empty by design)
Category ──1:N──> Subcategory     (Arabic strings from xlsx sheet "ملخص الأقسام")
SiteSettings ──1──> WhatsApp / contact / social / inquiryPolicy
PagesCopy ──1:N──> Page sections   (keyed k1…kN per page, in pages.ts)
```

**Relationship rules:**
- Every product references exactly one `categoryId` (a `CategoryId` union — see §3) and one `brand`
  (free string, must match a known brand; see §4).
- A bundle links a product **only where the component is an identified catalogue product**;
  unconfirmed components are NOT linked (`bundles.ts` header).
- A solution's related products reference real product records; related projects are empty until
  approved project evidence exists.
- Agencies link to products by brand name; the agency page must state the representation status
  honestly (official vs. carried brand).

## 3. Typed schema (actual — `src/data/types.ts`)

### 3.1 Localization

```ts
export type Locale = "ar" | "en" | "zh";
export interface LocalizedString { ar: string; en?: string; zh?: string; }
```

`src/lib/i18n.ts`: `LOCALES = ["ar","en","zh"]`, `DEFAULT_LOCALE = "ar"`,
`localeDir()` (`ar` → RTL, `en`/`zh` → LTR), `t()` (fallback to `ar`),
`isFallback()`, `localizedHref(locale, path)`, `switchLocalePath(pathname, nextLocale)`.

### 3.2 Product

```ts
export type ProductStatus = "published" | "pending";
export type SourceStatus = "confirmed" | "factory_catalog_verified" | "partial" | "awaiting_client_list";
export interface SpecRow { label: LocalizedString; value: string; }
export interface Product {
  id: string;            // p01..p39 (xlsx row number) — STABLE ID, never reused
  slug: string;          // ASCII URL slug, derived from brand + model — STABLE, never changed once published
  brand: string;         // free string; see §4 brand table
  model: string;
  categoryId: CategoryId;
  subcategory: LocalizedString;
  name: LocalizedString;
  overview?: LocalizedString;      // verbatim xlsx "المواصفات الرئيسية" (Arabic); absent when source has none (p11)
  benefits?: LocalizedString[];    // ONLY verbatim capability fragments from xlsx spec text; never invented
  specs: SpecRow[];                // identity rows (brand, model, category, subcategory)
                                   // + one row per verified xlsx spec fragment, verbatim.
                                   // Missing values are ABSENT. (C-2 regression context — see §7)
  image?: string;                  // stand-in photo filename under /images/photos/; absent for p30, p39
  featured: boolean;               // round-robin "featured" selection (12 products; same rule as old build)
  status: ProductStatus;
  sourceStatus: SourceStatus;
  sourceNote?: LocalizedString;    // INTERNAL traceability note (monetary sentences sanitised at extraction).
                                   // Do not render as customer-facing copy.
}
```

**Counts:** 39 total; 37 `published`; 2 `pending` (p30 Hanwha Q-Cells — no wattage/model;
p39 Wisenet — brand name only). Pending products have **no page and no image**.

### 3.3 Category

```ts
export type CategoryId = "inverters" | "batteries" | "panels" | "pumps"
  | "controllers" | "systems" | "storage-ci" | "cameras";
export interface Category {
  id: CategoryId;                  // STABLE SLUG — used in /products/category/<id>
  name: LocalizedString;
  note: LocalizedString;           // Arabic-first note
  icon: string;                    // Lucide icon key, rendered by categoryIcon() in Cards.tsx
  priority: "high" | "medium" | "low";
  subcategories: LocalizedString[];  // Localised subcategories, from xlsx sheet "ملخص الأقسام"
  brands: string[];                // brands carried in this category
  publishedCount: number;          // COMPUTED from products.ts — never hand-edited
}
```

| id | Name (ar / en) | Published |
|---|---|---|
| `inverters` | المحولات الهجينة والانفرترات / Hybrid Inverters | 13 |
| `batteries` | (batteries) | 16 |
| `panels` | (panels) | 0 |
| `pumps` | (pumps) | 7 |
| `controllers` | (controllers) | 1 |
| `systems` | (systems — holds the bundles) | 0 |
| `storage-ci` | (commercial/industrial storage) | 0 |
| `cameras` | (cameras — only pending p39) | 0 |

**Rule:** the xlsx's 9th row ("علامات تحتاج تأكيداً" — Haze / Solarbaba / Nash-SRNE) is **not** a
category and is excluded (`categories.ts` header). Zero-product categories keep their routes and
render honest empty states.

### 3.4 Bundle (ready-made system)

```ts
export type BundleStatus = "confirmed" | "archived";
export interface Bundle {
  id: string;                      // bundle-1..bundle-4
  slug: string;                    // = id; used in /systems/<slug>
  name: LocalizedString;
  components: LocalizedString;     // verbatim xlsx components (Arabic)
  use: LocalizedString;            // verbatim xlsx "الاستخدام المناسب" (Arabic)
  status: BundleStatus;
  componentProductIds: string[];   // catalogue links ONLY where identified
  openConfirmation?: LocalizedString; // INTERNAL — open questions awaiting Ghamdan (CI-03). Not customer copy.
}
```

3 confirmed (`bundle-1/2/3`, have pages) + 1 archived (`bundle-4` Ramadan, past season only, **no page**).

### 3.5 Agency / brand

```ts
export interface Agency {
  id: string;          // deye | efore | must | jntech | qcells | wisenet — STABLE SLUG
  name: LocalizedString; // (verify exact fields in agencies.ts; id + name + description + representation status)
  // description by locale, relationship type, verified representation statement,
  // supporting documents, related products (via brand name)
}
```

**Representation status (binding):** only **Deye** is confirmed as the official agent in Yemen
("The official Deye agent in Yemen — hybrid inverters, batteries and storage systems",
`agencies.ts:25`). The other five are **carried brands**; their official-agent status is NOT
established (`agencies.ts` header). Agency pages must distinguish the two cases explicitly.

### 3.6 Solution

```ts
export interface SolutionArea { id: string; name: LocalizedString; summary: LocalizedString; /* + hero/section media, components/products, related projects, publication state */ }
export interface PumpingDetail { /* challenges, 4 steps, applications — pumping only */ }
export interface PumpingStep / PumpingChallenge / PumpingApplication { /* see types.ts:169–186 */ }
export interface ProcessStep { /* 4-step "كيف نعمل؟" process */ }
export interface SolutionPillar { /* sun/droplet/leaf pillars */ }
export interface Service { /* services listing */ }
```

Solution areas (5): `residential`, `commercial`, `pumping`, `irrigation`, `agriculture`.
**Only `pumping` has a `PumpingDetail` block.** The other four have listing-level content only.
`guidanceOnly: true` on the pumping guidance tool — guidance only, no sizing, no model recommendation.

### 3.7 Project (template only)

```ts
export interface Project { /* id, slug, title by locale, summary/details, location/date ONLY when approved,
  gallery, components/products/solutions, documented results only, publication state */ }
```

**No `Project` records exist in the data.** The type exists for the template; no record may be
created without client-approved project evidence.

### 3.8 Site settings & page copy

```ts
export interface SiteSettings {
  // contact: whatsapp "967775800000", whatsappDisplay "+967 775 800 000",
  //   whatsappUrl "https://wa.me/967775800000", phoneDisplay, email info@ghamdan-trd.com,
  //   address (Sakhr St, Sana'a), hours (Sat–Fri 8–20)
  // social: facebook, instagram (verified URLs only)
  // inquiryPolicy: LocalizedString — "Ask about this product via WhatsApp — price, availability
  //   and delivery are confirmed with the sales team." (ar/en/zh; settings.ts:54–56)
  // warranty: status pending_client_approval — NO duration published
}
export type PageCopy = Record<string, LocalizedString>;   // k1…kN keys per page
export interface PagesCopy { /* home, about, solutions, products, contact, services, support,
  downloads, news, guidance, privacy, terms, ... — see pages.ts */ }
```

- **WhatsApp (canonical):** `settings.ts:35–37`. `src/lib/whatsapp.ts` `waLink()` builds
  `https://wa.me/${WA_NUMBER}?text=…` with per-context prepared messages
  (`general`, `product`, `system`, `category`, `support`, `guidance`, `contact`) in ar/en/zh.
  Click logging is localStorage-only — never presented as delivery/read.
- **UI strings:** `src/lib/ui-copy.ts` (nav, footer, buttons, form labels) — separate from page copy.
- **Media:** `src/lib/images.ts` — image helpers / focal points (verify in Phase 3).

## 4. Brand table (verified)

Distinct brands in products (7) vs. agencies (6):

| Brand | Agency id | Status |
|---|---|---|
| Deye | `deye` | **Confirmed official agent in Yemen** |
| EFORE | `efore` | Carried brand — official status NOT established |
| MUST | `must` | Carried brand — official status NOT established |
| Jntech | `jntech` | Carried brand — official status NOT established |
| Hanwha Q-Cells | `qcells` | Carried brand — official status NOT established (product p30 pending) |
| Wisenet | `wisenet` | Carried brand — official status NOT established (product p39 pending) |
| **Shenzhen Kexin** | — (no agency record) | Brand of **LM PACK** products (p22, p23, p26; 14 mentions in products.ts). **NOT EFORE** — corrected mapping, do not change without documentary support. |

## 5. Slugs & IDs — stability rules (locked)

1. **Product `id` (p01–p39)** is the xlsx row number — immutable, never reused, never renumbered.
2. **Product `slug`** (brand + model, ASCII) is the public URL key — immutable once published;
   changing it breaks the static route and any shared WhatsApp link. New products get new slugs.
3. **Category `id`** is the URL key (`/products/category/<id>`) — immutable; it is also the
   `CategoryId` union, so adding a category is a type change + data change + route regeneration.
4. **Bundle `slug` = `id`** (`bundle-1…4`) — immutable; archived bundles keep their slug but lose
   their page and all links.
5. **Agency `id`** is the URL key (`/agencies/<id>`) — immutable.
6. **Solution `id`** is the URL key (`/solutions/<id>`) — immutable.
7. **Slug uniqueness** is enforced by construction (one record per id/slug); Phase 5 validation
   must assert uniqueness across products, categories, bundles, agencies, and solutions, and
   assert that every `categoryId`, `brand`, and `componentProductId` resolves to a real record.

## 6. Publication states & locale completeness rules

| Entity | States | Public when… |
|---|---|---|
| Product | `published` / `pending` | `published` AND name + model (where applicable) + brand + category + representative image + verified specs + required locale content all present. `pending` → no page, no image, excluded from search, filters, sitemap, related lists. |
| Bundle | `confirmed` / `archived` | `confirmed` only. `archived` → no page, no links (bundle-4). |
| Category | (implicit: has `publishedCount`) | Always has a route; zero-count renders an honest empty state, never a 404. |
| Agency | (implicit) | Always has a route; representation wording must match evidence. |
| Solution | (implicit; `PumpingDetail` only for pumping) | Route always exists; detail blocks only where `PumpingDetail` (or approved equivalent) exists. Never invent detail content for the other four. |
| Project | — | **No records.** No page until approved evidence exists. |

**Locale completeness rule:** `ar` is mandatory for every rendered string. `en`/`zh` missing →
fallback to `ar` via `t()`; the fallback must be identifiable (`isFallback()` / `ZhNotice`) and
must never be presented as a translation. Product models, brand names, and technical units are
**never translated** (Latin model codes and units stay as-is in all locales; verify mixed-direction
rendering in Phase 8).

## 7. Spec schema — C-2 regression context (binding)

- **Schema:** `SpecRow = { label: LocalizedString; value: string }`. The product `specs` array is:
  identity rows (brand, model, category, subcategory) + one row per verified xlsx spec fragment,
  verbatim. Missing values are **absent** — an extra or missing key shifts every label below it
  (the C-2 defect: one extra key shifted labels in 33 of 37 blocks; fixed 2026-11-14, verified
  37/37 blocks and 111/111 localized product pages).
- **Regression rule:** any change to `products.ts` specs, `types.ts` `SpecRow`, or `SpecTable`
  (`ui.tsx`) must re-run the automated schema/content check (Phase 5: validate spec keys/labels/
  values/units, slug uniqueness, category/brand references, locale completeness, publication
  eligibility) **and** the 37-block / 111-page verification before the change is presented as done.
  Do not fix a data-structure issue by hiding fields with CSS (v15 §2.5).
- **Units:** values carry their units as verified text (e.g. kW, kWh, V, A, IP65); units are part of
  the verified fragment and are never converted or re-typed by hand.

## 8. Media model (data-quality items)

- **Heroes:** 6 AI-generated images in `public/images/heroes/` (`.jpg` + `.webp` each):
  villa+mountains, villa+sea, pump+mountains, solar farm (aerial), + 2 others. They are
  **AI-generated by Ahmed**, not licensed stock and not real GTS photos — per-page assignment is a
  Phase 3/4 decision (ADR-03); missing hero subjects must be AI-generated to match, not stock.
- **Product photos:** 12 stand-in photos in `public/images/photos/` (`.jpg` + `.webp` each) serve
  37 products (**M-4**). The `image` field on a product names a stand-in file; the model must keep
  representative status labelled (the `products.ts` header saying `public/images/photos/` is empty
  is **stale** — the directory is no longer empty; fix the header comment in Phase 5).
  Real product photos are a client input (CI-06); until they arrive, repetition is structural and
  must be recorded as a data-quality item, not hidden.
- **Datasheets:** no files exist. No `datasheet` field is populated; the download button stays
  hidden until CI-06 files arrive.
- **Logo:** the official logo (`incoming/v15/gts-official-logo.jpg`, 2048×2048 JPEG, solid blue,
  no transparency/vector) is **not** in `public/` and not in the data model. Phase 3 must decide
  its integration (background treatment) and record the chosen asset path + alt text here.

## 9. Validation checklist (Phase 5 — from v15 §8.3)

Automated checks to build (not built in this lock phase):
- [ ] Product schema valid (all required fields; `specs` non-empty for published products).
- [ ] Category/brand references resolve (`categoryId` ∈ `CategoryId`; `brand` ∈ known brands;
  `componentProductIds` ⊆ published product ids).
- [ ] Slug uniqueness across products, categories, bundles, agencies, solutions.
- [ ] Locale completeness: `ar` present everywhere; report `en`/`zh` gaps (do not auto-fill).
- [ ] Gallery items exist on disk (`image` files present in `public/images/photos/`).
- [ ] Specifications: stable keys/labels/values/units; no shifted labels (C-2 regression).
- [ ] Publication eligibility: no `pending`/`archived` item reachable from any public route,
  sitemap, search index, or related list.
- [ ] URLs: every internal link resolves; every WhatsApp link uses `waLink()` (0 hard-coded
  `wa.me/…` in `src/` after the Phase 5 fix).
- [ ] No-price scan: 0 prices in source, dictionaries, metadata, structured data, and generated HTML.
