# REFERENCE COMPONENT MAP — Ghamdan Solar Platform (Phase 0)

**Purpose:** every visible reference section mapped to a real implementation
component (§6.2), its variants, where it appears, and its data source.
Component names follow prompt §6.2. No component is built here — this is
the map the build follows.

**Data-source key:** `settings` = centrally managed site settings (admin);
`pages.*` = per-language page content records; `products` / `categories` /
`solutions` / `projects` = database records, published only when approved
(prompt §3.2). `STATIC` = fixed per-language strings, not content records.
`PENDING` = source not yet confirmed by the PDF audit / client.

## Global components

| Component | Variants | Appears in | Structure (as seen) | Data source |
|---|---|---|---|---|
| `TopBar` | — | **None** (prompt-required §4.3) | Not in any reference. Build in-system: contact e-mail/phone + social, above header, desktop only | `settings` |
| `Header` | `transparent` (over hero photo: 01, 02, 03, 05, 07, 09, 10), `solid` (white: 04, 08; sky: 06) | All 10 | One row, ≈ 72–80 px est. high. RTL start: logo (+ wordmark). Centre: nav links. RTL end: language switcher + CTA button | `settings` (logo, brand), nav from `SITE_MAP.md` |
| `DesktopNav` | — | All 10 | 4–6 text links, ≈ 15–16 px, near-black; active link underlined (blue/navy, ≈ 2 px) | `SITE_MAP.md` (ONE canonical nav — per-image variants are inconsistencies, see § "Nav variance") |
| `MobileDrawer` | — | **None visible** (prompt-required) | Slide-in drawer, same nav + language + WhatsApp CTA | Same nav data as `DesktopNav` |
| `LanguageSelector` | `pill` (white box, 02/06/07), `text` (عربي \| EN, others) | All 10 | Two options, ≈ 14–15 px; active language bold/underlined in some images | `i18n` locales: `ar` (default), `en`, `zh` (ZH **not shown** — add in same style) |
| `WhatsAppButton` | `navy-pill` (most), `green-pill` (03 header), `white-on-dark` (CTA bands), `outlined-blue` (04 product cards) | All 10 | Rounded ≈ 10–12 px, ≈ 44–48 px high, icon + label, arrow ← on some | `settings.whatsapp_number` + contextual message (§10.1) |
| `WhatsAppFloatingButton` | — | **None visible** (prompt-required §4.3) | Fixed bottom corner, green circle, WhatsApp glyph | `settings.whatsapp_number` |
| `StickyWhatsAppBar` | — | **None visible** (prompt-required §4.3) | Mobile-only bottom bar on product/package detail | `settings.whatsapp_number` + page context |
| `Hero` | `center` (01), `side` (02, 03, 05, 07, 09, 10), `split` (04, 06, 08) | All 10 | Photo 460–640 px tall in screenshot; headline extra-bold 2 lines; sub-copy 2–3 lines; 1 primary CTA. `center`: text over sky, badge pill above. `side`: text in one column over photo. `split`: white text column + photo column | `pages.{page}.hero` |
| `Breadcrumbs` | — | 06, 08, 09, 10 | Small grey text, home icon first, separators `>` / `/`; placed above the hero heading (06, 08, 09) or below the header (10) | Route hierarchy |
| `SectionHeading` | `center`, `start`, `underline` (03 only) | All 10 | Bold heading 32–40 px est. + optional small pill label above + optional 2-line grey intro copy; centred or RTL-start | `pages.*` |
| `CTA` | `split` (01), `photo-left` (02), `photo-bg` (03), `features` (05, 06, 07), `whatsapp` (08, 09), `gradient` (04 banner) | 01–03, 05–10 (not 04's main CTA) | Dark-navy full-bleed band, photo on one side, heading + copy + white button; `features` adds 3 mini-features with icons + dividers | `pages.*.cta`; WhatsApp number from `settings` |
| `Footer` | `1-row` (01, 06), `2-3col` (02, 03, 05, 07, 08, 10), `4col` (04 — canonical), `truncated` (09) | All 10 | Light background; logo + nav + legal links; optional giant pale watermark wordmark (02, 05, 07); bottom row copyright + privacy/terms | `settings`, nav, `categories`, legal pages |
| `SearchOverlay` | — | **None visible** | Search appears as an inline input (04, 08), not an overlay | `products` index |

## Content components

| Component | Variants | Appears in | Structure (as seen) | Data source |
|---|---|---|---|---|
| `EditorialBlock` | `image-left`, `image-right`, `alternating` (03, 05) | 02 (story), 03 (×5), 05 (×4), 06 (overview), 09 (overview), 10 (challenge/solution) | 2-col ≈ 50/50 or 55/45; image ~16:9–16:10 rounded ≈ 12–16 px; text side: pill label (optional), bold title ≈ 26–30 px, 2–3 line grey copy, optional navy button / blue link | `solutions` / `projects` / `products.overview` / `pages.*` |
| `PillarRow` | — | 01, 02 | 3 columns, hairline vertical dividers; line icon (leaf / droplet / sun) + bold title + 1-line caption, centred | `solutions` (3 pillars) |
| `IconFeature` | — | 01, 02, 03, 04, 05, 06, 07, 09, 10 | Blue line icon (Lucide-style) alone or in a pale-blue circle (≈ 64 px est.); bold title; 1–2 line grey caption | Per-section content |
| `SolutionCard` | `grid-2x2` (01), `row` (03) | 01, 03 | 01: image left ≈ 40% + light-grey text panel right (icon, title, copy, blue link). 03: full editorial row with pill | `solutions` |
| `SolutionPill` | — | 03, 09 | Small pale-blue rounded pill, ≈ 12–13 px bold blue text + tiny icon (home / droplet / leaf / gear) | `solutions.category` |
| `ProcessSteps` | `4-step` | 03 | 4 columns, numbered 1→4 RTL, icon in pale-blue circle, bold title, 2-line copy, left-arrow between steps | `pages.solutions.process` (STATIC) |
| `SolutionSteps` | `4-step-numbered` | 09 | 4 cards, blue number badge (01–04) top corner, product cut-out image, bold title, 2-line copy, arrow between cards | `solutions.steps` |
| `SystemDiagram` | — | 09 only | Full-width cutaway illustration (panels → controller → pump → tank → network → crops), labelled in Arabic, on pale-blue band | `solutions.components` — rebuild as SVG/HTML, never screenshot |
| `ChallengeList` | `4col` | 09 | 4 columns on pale band; blue icon in white circle, bold title, 2-line copy | `solutions.challenges` |
| `FeatureCard` | `white-card` (01 why-us), `icon-row` (06 features) | 01, 02, 04, 06, 07, 09, 10 | White card, light border, rounded ≈ 12–16 px, icon top, bold title, 1–2 line copy; or borderless icon row with dividers | Per-section content |
| `WhyUs` | `3col` (01), `4col` (04) | 01, 04 | Pale sky-blue band (01) or white (04); icon + bold title + 1-line copy per column | `pages.*.why_us` |
| `ValueCard` | `mission`, `vision` | 02 | White card, light border, blue icon in pale-blue circle, bold title, 2-line copy | `pages.about.mission/vision` |
| `Marquee` | — | 01 only | Large thin text, words separated by em-dashes, repeated: "خبراتنا — حلولنا — تأثيرنا —" | STATIC strings |
| `TrustRow` | — | 04 only | 3 items, small icon + bold label, in a row under the split hero | `pages.catalog.trust` |
| `CategoryStrip` | — | 04 only | 13 items in one row; small square tile (product cut-out) + 1–2 line label below | `categories` (approved tree — reference has a duplicate "بطاريات رصاصية" label; do not copy) |
| `CategoryTabs` | — | 08 only | 6 tabs in a row, icons, hairline dividers; active tab pale-blue fill | `categories` (siblings) |
| `Filters` | `bar` (08), `strip` (04 category strip only) | 08 (04 has search + strip only) | Light-grey rounded panel: "تصفية المنتجات" + funnel icon; 2 selects + search input | Filter values from approved `products` data (§8.1: brand, power, system type, usage, availability) |
| `SearchInput` | — | 04, 08 | Rounded input, magnifier icon, placeholder "ابحث في المنتجات..." | `products` index |
| `ResultMeta` + `SortSelect` | — | 08 only | Right: "عرض 12 من 24 منتج"; left: "الترتيب حسب: الأحدث" select | `products` query (paginated) |
| `ProductCard` | `grid-6col` (04), `grid-4col` (08), `compact` (06 related, 09 related), `horizontal` (10 related) | 04, 06, 08, 09, 10 | White card, light border, rounded ≈ 12–16 px; image on light-grey square (~4:3 or 16:9); bold name; grey category/caption; CTA: outlined blue WhatsApp button (04) / full navy button (08) / blue text-link (06, 09, 10). **No price on any card** | `products` (`status=published` only); image = real approved image; specs ≤ 3 confirmed |
| `ProductGrid` | `6col` (04), `4col` (08) | 04, 08 | 6-col (12 cards, 2 rows) / 4-col (8 cards, 2 rows); gap ≈ 20–24 px est. | `products` query |
| `ProductTile` | — | 01, 10 | Small square tile, product cut-out on light grey, label below (01) or beside (10) | `products` (featured / equipment) |
| `CategoryCard` | — | 08 (related) | Image top ~16:9, bold title, blue link "استكشف الفئة ←" | `categories` |
| `ProjectCard` | `editorial-row` (05), `image-card` (01) | 01, 05 | 05: alternating editorial row (image + category label + title + copy + underlined link). 01: image card + title + link | `projects` (approved only) |
| `ProjectRow` | — | 05 | Same as `ProjectCard[editorial-row]` | `projects` |
| `FilterPills` | — | 05 only | Centred pills; active = navy fill + white text; inactive = light grey; small icon per pill | `projects` categories |
| `GalleryCarousel` | — | 05 | 4 images in a row, round arrow buttons at both ends, dot pagination below | `projects` gallery media |
| `Gallery` | — | 10 | 4 images in a row on pale-blue band, round arrow buttons | `projects.media` (+ lightbox per §6.2) |
| `ProductHero` | — | 06 | Breadcrumbs + title + copy + thumbnail + download button + large product photo | `products` |
| `SpecTable` | — | 06 only | Light-grey panel; product image left; 10-row label/value table right (values "—" in reference = placeholder) | `product_specifications` (manufacturer values only) |
| `DownloadButton` / `DownloadItem` | — | 06 only | Navy button "تحميل كتيب المنتج" with document icon | `downloads` (only if supplied) |
| `RelatedProducts` | `3col-cards` (06), `compact` (09), `horizontal` (10) | 06, 09, 10 | 3 cards; image + title + copy + blue link | `products` (related) |
| `RelatedCategories` | — | 08 | 4 cards, image + title + blue link | `categories` (related) |
| `RelatedProjects` | — | 09 | 1 wide image card + link | `projects` (approved only) |
| `ContactMethodCard` | — | 07 | Light-grey rounded panel; icon in pale-blue circle; bold title; 2-line copy; blue text-link | `settings` + support route (PENDING) |
| `ContactForm` | — | 07 only | Card with heading + copy; fields: name* / e-mail* (2-col), inquiry type* (select), message* (textarea); full-width navy submit | Form submission → admin; options PENDING client data |
| `SidePanel` | — | 07 | Tall sky-blue panel: heading + copy + photo at bottom | `pages.contact.side_panel` |
| `InfoCard` | `location` | 10 | Light-grey card, pin icon, bold "الموقع", value text (placeholder "موقع المشروع" in reference) | `projects.location` — only when confirmed |
| `EquipmentList` | — | 10 | 3 product tiles (cut-out + label) | `projects.equipment` |
| `ScopePanel` | — | 10 | Grey panel, list icon, bold title, 3-line copy | `projects.scope` |
| `Outcomes` | `4col` | 10 | 4 grey cards, icon + bold title only — **no numbers in the reference** | `projects.outcomes` (verified only) |
| `ApplicationCard` | — | 09 | Image card with dark overlay caption at bottom | `solutions.applications` |
| `MiniFeatures` | `3col` | 05, 06, 07, 08, 09 | 3 items, icon + bold title + 1-line caption, separated by vertical dividers; used inside CTA bands | Per-page CTA content |
| `Pagination` | — | **None visible** | 08 implies a second page ("12 of 24") but shows no pager; 04 shows none | `products` pagination |
| `EmptyState` / `LoadingState` / `ErrorState` | — | **None visible** (prompt-required §6.2) | Build in-system | — |
| `Statistics` | — | **None visible** | No count-up numbers appear in any image — do not invent stats | Only verified numbers, if the client supplies any |

## Nav variance (recorded, not to be copied as five navs)

| Image | Nav items shown (RTL order) |
|---|---|
| 01 | الرئيسية، حلولنا، مشاريعنا، من نحن، تواصل معنا |
| 02 | الرئيسية، من نحن، مجالات خبرتنا، تواصل معنا |
| 03 | الرئيسية، القطاعات، حلولنا، من نحن، اتصل بنا |
| 04 | الرئيسية، المنتجات، الحلول، عن الشركة، الموارد، تواصل معنا |
| 05 | الرئيسية، من نحن، مشاريعنا، خبراتنا، تواصل معنا |
| 06 | الرئيسية، منتجاتنا، حلولنا، من نحن، تواصل معنا |
| 07 | الرئيسية، من نحن، مجالات خبرتنا، لماذا اخترنا، تواصل معنا |
| 08 | الرئيسية، مجال خبراتنا، من نحن، لماذا نحن، تواصل معنا |
| 09 | الرئيسية، خبراتنا، من نحن، الرئيسية (duplicate — reference defect) |
| 10 | الرئيسية، المزايا، خبراتنا، لماذا نحن، تواصل معنا |

**Canonical nav** is defined by prompt §4.1 (Home, About, Products, Services,
Projects, Support & Warranty, News & Events, Contact, Agencies, Legal) and
must be settled in `SITE_MAP.md` — the per-image navs are sample
inconsistencies, not requirements.

## Components required by the prompt with NO reference instance

`TopBar`, `MobileDrawer`, `WhatsAppFloatingButton`, `StickyWhatsAppBar`,
`SearchOverlay`, `Pagination`, `EmptyState`, `LoadingState`, `ErrorState`,
`Statistics`, `AgencyCard`, `NewsCard`, `PackageCard`, `WarrantyPanel`,
`SpecTable` (beyond 06's placeholder), gallery `Lightbox`, `Breadcrumbs`
variants for services/news/agencies. Build all of these in the extracted
design language (DESIGN_SYSTEM.md); do not invent a second visual identity
for them.
