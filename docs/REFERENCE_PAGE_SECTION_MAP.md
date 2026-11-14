# REFERENCE PAGE → SECTION MAP — Ghamdan Solar Platform (Phase 0)

**Purpose:** map every visible reference section to a real implementation
component and its data source, per prompt §2.3 / §5.
**Reading note:** "Reference" = what the image shows. "Data source" is the
*intended* source per the executive prompt — the PDFs and client-approved
lists, **not** the sample copy in the images. Where the PDFs have not yet
been audited in this phase, the source is marked `PENDING — PDF audit`.
Sample copy in the images is never a data source.

**Routes** use the prompt's information architecture (§4): Arabic-first,
`/ar/` default. English `/en/`, Chinese `/zh/` mirror the same routes.
Component names are the §6.2 reusable-component names where they exist.

## Global (all 10 pages)

| Visible section | Route / scope | Implementation component | Data source |
|---|---|---|---|
| Header (single row, transparent over hero) | All pages | `Header` + `TopBar` (prompt-required, NOT in references — see note) + `DesktopNav` + `LanguageSelector` + `WhatsAppButton` | `settings` (site name, logo, WhatsApp number); nav items from `SITE_MAP.md` |
| Language switcher (عربي \| EN) | All pages | `LanguageSelector` — extend to AR/EN/ZH (ZH not shown in any reference) | `i18n` — locales `ar` (default, RTL), `en`, `zh` |
| Hero (3 variants: centred / side / split) | Per page | `Hero` (variants: `center`, `side`, `split`) | Page content record (`pages` table, per language) |
| Dark-navy CTA band | 01, 02, 03, 05, 06, 07, 08, 09, 10 | `CTA` (variants: `photo-left`, `photo-right`, `whatsapp`) | Page content record; WhatsApp number from `settings` |
| Footer (structure varies 1-row → 4-col) | All pages | `Footer` — base on 04 (4-col, most complete); other pages' footers are variants, not separate footers | `settings` (contact, social links), `pages` (legal), nav from `SITE_MAP.md` |
| Floating WhatsApp button | All pages | `WhatsAppFloatingButton` — prompt-required, NOT visible in any reference | `settings.whatsapp_number` |
| Sticky mobile WhatsApp bar | Product / package detail | `StickyWhatsAppBar` — prompt-required, NOT visible in any reference | `settings.whatsapp_number` + product/package context |
| Slide-in mobile menu | All pages (mobile) | `MobileDrawer` — prompt-required, NOT visible in any reference | Same nav data as `DesktopNav` |

## 01 — Home → `/` (Home)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 1.1 | Hero (centred, badge pill + heading + copy + WhatsApp CTA, villa photo) | `Hero[center]` | `pages.home.hero` |
| 1.2 | Intro "نؤمن بعالم تزدهر فيه الحياة" + copy | `SectionHeading` + copy block | `pages.home.intro` |
| 1.3 | Three-pillar icon row (solar / water / agriculture) | `PillarRow` (3 × `IconFeature`) | `solutions` (3 pillar records) — taxonomy PENDING PDF audit |
| 1.4 | Faint line-art solar-field illustration | Decorative `LineArt` (SVG, rebuild — do not screenshot) | Static asset |
| 1.5 | Marquee "خبراتنا — حلولنا — تأثيرنا —" | `Marquee` | Static strings (per language) |
| 1.6 | Solutions grid 2×2 (image + text + "اكتشف المزيد") | `SolutionCard` ×4 in `SolutionGrid[2col]` | `solutions` (4 featured) |
| 1.7 | "لماذا تختار حلولنا؟" + 3 white cards | `WhyUs` (3 × `FeatureCard`) | `pages.home.why_us` |
| 1.8 | Projects (2 cards) + Featured products (3 tiles) split | `ProjectCard` ×2 + `ProductTile` ×3 | `projects` (2 featured, client-approved only); `products` (3 featured) |
| 1.9 | Dark CTA band + "طرق التواصل الأخرى" (labels only) | `CTA[split]` + `ContactMethods[compact]` | `settings` (contact values — PENDING client data) |

## 02 — About → `/about` (من نحن)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 2.1 | Hero (side, left-aligned, villa + sea photo) | `Hero[side]` | `pages.about.hero` |
| 2.2 | Intro "من نحن" pill + centred statement | `SectionHeading` | `pages.about.intro` |
| 2.3 | Three-pillar icon row (same as 1.3, different captions) | `PillarRow` | `solutions` (pillars) |
| 2.4 | "قصتنا" editorial split (image + text + button) | `EditorialBlock[image-left]` | `pages.about.story` |
| 2.5 | Mission / Vision cards (2) | `ValueCard` ×2 (`MissionCard`, `VisionCard`) | `pages.about.mission`, `pages.about.vision` |
| 2.6 | "مجالات خبرتنا" + 3 expertise image cards | `SectionHeading` + `ExpertiseCard` ×3 | `solutions` (3 areas) |
| 2.7 | Dark CTA band (photo left) | `CTA[photo-left]` | `pages.about.cta` |

## 03 — Solutions → `/solutions` (حلولنا)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 3.1 | Hero (side, right-aligned, villa + ground array) | `Hero[side]` | `pages.solutions.hero` |
| 3.2 | Centred intro + blue underline accent | `SectionHeading[underline]` | `pages.solutions.intro` |
| 3.3 | Five alternating editorial rows (residential / commercial-industrial / water pumping / smart irrigation / agriculture) | `EditorialBlock[alternating]` ×5, each with category pill (`SolutionPill`) + `Button[dark]` | `solutions` (5 records) — taxonomy PENDING PDF audit; do not copy the reference's 5 as approved |
| 3.4 | "كيف نعمل؟" 4 steps (1→4 RTL, icons + arrows) | `ProcessSteps[4]` | `pages.solutions.process` (static, per language) |
| 3.5 | Full-bleed photo CTA band | `CTA[photo-bg]` | `pages.solutions.cta` |

## 04 — Catalog → `/products` (المنتجات / دليل المنتجات)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 4.1 | Split hero (photo left, heading + copy + CTA right) + trust row (3 items) | `Hero[split]` + `TrustRow` | `pages.catalog.hero`; trust items from `pages.catalog.trust` |
| 4.2 | Search input "ابحث في المنتجات..." | `SearchInput` (→ `/search`) | `products` index (client-approved only) |
| 4.3 | Category icon strip, 13 items | `CategoryStrip` | `categories` (approved tree — PENDING PDF audit; reference lists 13 with a duplicate label, do not copy) |
| 4.4 | "المنتجات المميزة" + 12 product cards (6×2), each with outlined WhatsApp "استفسر الآن" | `ProductGrid[6col]` + `ProductCard` | `products` (featured, `status=published` only); WhatsApp message per prompt §10.1 |
| 4.5 | Wide CTA banner (gradient + photo + 2 buttons) | `CTABanner[gradient]` | `pages.catalog.cta` |
| 4.6 | "لماذا تختار حلولنا؟" 4 columns | `WhyUs[4col]` | `pages.catalog.why_us` |
| 4.7 | Footer, 4 columns (most complete footer in the set) | `Footer[4col]` — canonical base | `settings`, `categories`, nav, legal |

## 05 — Projects → `/projects` (مشاريعنا)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 5.1 | Hero (side, left-aligned, solar farm + mountains) | `Hero[side]` | `pages.projects.hero` |
| 5.2 | Centred intro "مجالات مشاريعنا" | `SectionHeading` | `pages.projects.intro` |
| 5.3 | Filter pills (all / solar / water / agriculture) | `FilterPills` | `projects` categories (from approved project records) |
| 5.4 | Four alternating editorial project rows | `ProjectRow[alternating]` ×4 | `projects` (client-approved only; no invented location/date/capacity) |
| 5.5 | Gallery carousel "مشاهد من مشاريعنا" (4 images, arrows, dots) | `GalleryCarousel` | `projects` gallery media |
| 5.6 | Dark CTA band + 3 mini-features | `CTA[features]` | `pages.projects.cta` |

## 06 — Product Detail → `/products/{slug}`

| # | Visible section | Component | Data source |
|---|---|---|---|
| 6.1 | Breadcrumbs + title + sub-copy + thumbnail + "تحميل كتيب المنتج" + large product photo | `Breadcrumbs` + `ProductHero` + `DownloadButton` | `products` (name, model, brand, overview); `downloads` (brochure — only if supplied) |
| 6.2 | "نظرة عامة على المنتج" editorial split | `EditorialBlock` | `products.overview` |
| 6.3 | "المميزات الرئيسية" 4 columns | `FeatureList[4col]` | `products.benefits` (confirmed only) |
| 6.4 | "المواصفات الفنية" — image + spec table (10 rows, values "—" in reference) | `SpecTable` | `product_specifications` (manufacturer values; missing = absent, never guessed) |
| 6.5 | "منتجات ذات صلة" 3 cards | `RelatedProducts` (3 × `ProductCard[compact]`) | `products` (related, same category/brand) |
| 6.6 | Dark CTA band + 3 mini-features | `CTA[features]` | `pages.product.cta` |
| 6.7 | Sticky mobile WhatsApp bar | `StickyWhatsAppBar` — prompt-required, not visible in reference | `settings.whatsapp_number` + product context (§10.1) |

## 07 — Contact → `/contact` (تواصل معنا)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 7.1 | Hero (side, right-aligned, villa + panels) | `Hero[side]` | `pages.contact.hero` |
| 7.2 | Three contact-method cards (WhatsApp / general inquiry / technical support) | `ContactMethodCard` ×3 | `settings` (WhatsApp, e-mail); support route PENDING client data |
| 7.3 | Side panel "معاً نبني مستقبل أكثر استدامة" + photo | `SidePanel[photo]` | `pages.contact.side_panel` |
| 7.4 | Contact form: name* / e-mail* / inquiry type* (select) / message* + submit | `ContactForm` | Form → admin inbox / e-mail; inquiry-type options PENDING client data; no map (none shown; prompt allows map only with verified location) |
| 7.5 | Dark CTA band + 3 mini-features | `CTA[features]` | `pages.contact.cta` |

## 08 — Product Category → `/products/category/{slug}`

| # | Visible section | Component | Data source |
|---|---|---|---|
| 8.1 | Hero (split, product still-life + breadcrumbs + heading + "طلب استشارة") | `Hero[split]` + `Breadcrumbs` | `categories` (name, description) |
| 8.2 | Category tab strip, 6 items (first active) | `CategoryTabs` | `categories` (siblings of current) |
| 8.3 | Filter bar: type select / brand select / search | `Filters` (type, brand, search) | `products` filter values — brand/power/type/usage/availability per prompt §8.1, only values present in approved data |
| 8.4 | Result meta "عرض 12 من 24 منتج" + sort "الأحدث" | `ResultMeta` + `SortSelect` | `products` query (paginated; reference shows 8 cards for "12 of 24" — inconsistency, do not copy the numbers) |
| 8.5 | Product grid 4×2 (cards = sub-categories in the reference; build as products per §8.2) | `ProductGrid[4col]` + `ProductCard` | `products` in this category (`status=published`) |
| 8.6 | "فئات ذات صلة" 4 cards | `RelatedCategories` (4 × `CategoryCard`) | `categories` (related) |
| 8.7 | Dark WhatsApp CTA band + 3 mini-features | `CTA[whatsapp]` | `settings.whatsapp_number` |

## 09 — Solution Detail → `/solutions/{slug}` (solar water pumping)

| # | Visible section | Component | Data source |
|---|---|---|---|
| 9.1 | Hero (side, breadcrumbs + heading + "ناقش مشروعك معنا") | `Hero[side]` + `Breadcrumbs` | `solutions` (record: solar water pumping) |
| 9.2 | "نظرة عامة" editorial split + 3 mini-features | `EditorialBlock` + `MiniFeatures[3]` | `solutions.overview` |
| 9.3 | "معالجة التحديات الحقيقية" — 4 challenge columns (pale band) | `ChallengeList[4col]` | `solutions.challenges` |
| 9.4 | "أربع خطوات لحل متكامل" — 4 numbered step cards with product images + arrows | `SolutionSteps[4]` | `solutions.steps` |
| 9.5 | System diagram (cutaway: panels → controller → pump → tank → network → crops, labelled) | `SystemDiagram` (rebuild as SVG/HTML — do NOT screenshot the reference image) | `solutions.components` (approved component list) |
| 9.6 | "مناطق التطبيق" 3 image cards with overlay captions | `ApplicationCard` ×3 | `solutions.applications` |
| 9.7 | "منتجات مكملة" (3 small cards) + "قصص نجاح ملهمة" (1 wide card) | `RelatedProducts[compact]` + `RelatedProjects[wide]` | `products` (related); `projects` (client-approved only) |
| 9.8 | Dark WhatsApp CTA band (green WhatsApp icon + photo) | `CTA[whatsapp]` | `settings.whatsapp_number` |
| 9.9 | Footer (truncated in the image — structure unknown below the fold line) | `Footer` (canonical, as 04) | As global footer |

## 10 — Project Detail → `/projects/{slug}`

| # | Visible section | Component | Data source |
|---|---|---|---|
| 10.1 | Hero (side, breadcrumbs + "مشروع نموذجي" pill + heading + copy) | `Hero[side]` + `Breadcrumbs` + `StatusPill` | `projects` (title, overview; status pill only if the project is genuinely a sample — never label a real project "sample") |
| 10.2 | "نظرة عامة على المشروع" + location card ("الموقع" — value is the placeholder "موقع المشروع") | `EditorialBlock` + `InfoCard[location]` | `projects.overview`; `projects.location` — only when confirmed, else omit the card |
| 10.3 | "التحدي" editorial row (text + image) | `EditorialBlock` | `projects.challenge` — only when documented |
| 10.4 | "الحل الهندسي" editorial row (text + image) | `EditorialBlock` | `projects.solution` — only when documented |
| 10.5 | "المعدات المستخدمة" (3 product tiles) + "نطاق الأعمال المنفذة" | `EquipmentList` + `ScopePanel` | `projects.equipment` (approved products); `projects.scope` |
| 10.6 | "معرض صور المشروع" (4 images, arrows) | `Gallery` (+ lightbox) | `projects.media` |
| 10.7 | "أبرز النتائج" 4 cards (titles only, no numbers) | `Outcomes[4col]` | `projects.outcomes` — only verified outcomes; no invented figures |
| 10.8 | "منتجات وحلول ذات صلة" 3 horizontal cards | `RelatedProducts[horizontal]` | `products` (related) |
| 10.9 | Dark CTA band | `CTA` | `pages.project.cta` |

## Pages required by the prompt with NO dedicated reference image (§5.1)

Build in the extracted design language; do not invent a new identity.

| Required section (§4.1 / §5.1) | Base on | Notes |
|---|---|---|
| Services (`/services`) | 03 editorial rows + 06 feature columns | Only client-confirmed services |
| Support & Warranty (`/support`, `/warranty`) | 07 contact-method cards + 06 spec-table panel | Warranty text centrally managed; no inferred manufacturer terms |
| News & Events (`/news`, `/events`) | 05 project rows + 09 application cards | Only approved content; dates required |
| Agencies (`/agencies`, `/agencies/{slug}`) | 04 category strip + 08 related categories | No exclusivity claim without documentary evidence (§12.4) |
| Ready-made systems (`/systems`, `/systems/{slug}`) | 09 solution detail (steps + diagram + components) | Packages: Basic Home / Extended Home / Large Home–Small Facility / Farm & Pumping — components only from approved lists (§9) |
| Downloads (`/downloads`) | 06 "تحميل كتيب المنتج" + 06 spec panel | Approved datasheets/certificates only |
| Legal (`/privacy`, `/terms`) | Footer legal links (all pages) | Text only when supplied/approved |
| Search results (`/search`) | 04 search input + 08 result meta | Uses product/project/news indexes |
| Pumping guidance tool | 09 system diagram + 09 steps | Preliminary guidance/request tool only (§11) — no certified sizing claims |
| 404 / error states | Global header/footer | Standard, in-system |

## Intentional differences between references (do not flatten)

- Hero alignment: centred (01) vs side-left (02, 05) vs side-right (03, 07, 09, 10) vs split (04, 06, 08).
- Nav items differ per page (e.g. "القطاعات" only in 03, "خبراتنا" only in 05, "المزايا" only in 10, "الموارد" only in 04) — the build uses ONE canonical nav (§4.3 / SITE_MAP.md); the per-image variants are reference inconsistencies, not five different navs.
- Header CTA: navy WhatsApp (most) vs green WhatsApp (03) vs plain "تواصل معنا" (07, 08, 09) vs two buttons (10).
- Footer: 1-row (01, 06) vs 2–3 column (02, 03, 05, 07, 08, 10) vs 4-column (04) vs truncated (09). Canonical = 04's 4-column footer.
- Brand name/logo: four variants (see REFERENCE_IMAGE_ANALYSIS.md Finding 1) — all replaced by Ghamdan's approved brand.
- Product-card CTA: outlined WhatsApp "استفسر الآن" (04) vs full navy "طلب استشارة" (08) vs blue text-link "عرض المنتج" (06) — one canonical `ProductCard` with both actions (details + WhatsApp) per §8.2.
- Category page cards: categories in 08 vs products in 04 — canonical: products, with the category strip/tabs above.
