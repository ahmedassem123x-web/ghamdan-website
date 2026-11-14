# REQUIREMENTS TRACEABILITY — Ghamdan Solar Platform (Phase 0)

> **Sources:** D1 = Technical & Financial Study v1.0, 8 Nov 2026 (`incoming/references/ref-2.pdf`,
> 16 pp). D2 = Price Quotation (`incoming/references/ref-1.pdf`, 4 pp).
> Prompt = `Ghamdan_Master_Execution_Prompt_v2_3_zpxp.md` v2.0.
> **Status values** (prompt §23): `NOT STARTED` · `CLIENT INPUT REQUIRED` · `BLOCKED` ·
> `PARTIAL` · `COMPLETE`. At Phase 0 all implementation is `NOT STARTED`; rows gated on
> missing client input are marked `CLIENT INPUT REQUIRED`.
> **Labels** (prompt §1.3) are noted per row group in the Source column where the statement
> is not a direct source requirement (e.g. prompt-only implementation decisions).
> Commercial figures are INTERNAL — never on the public site.
> **How to read "Page/section":** D1 pages are the study's printed page numbers (1–16);
> D2 pages are the quotation's printed page numbers (1–4).

---

## PUB — Public platform

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-PUB-001 | 10 main sections exist: Home, About, Products, Services, Projects, Support and Warranty, News and Events, Contact, Agencies, Legal Pages | D1 (study v1.0) | p4, §3 | All public pages / main nav | Pages/sections, routes | All 10 sections reachable; nav lists all 10 | NOT STARTED |
| REQ-PUB-002 | Thin top contact bar with contact data | D1 | p4, §3 | Global header (all pages) | Site settings (single source) | Bar visible on all pages; data matches footer/contact | NOT STARTED |
| REQ-PUB-003 | Sticky header that compacts on scroll | D1 | p4, §3 | Global header | — (frontend) | Scroll: header compacts smoothly, no jump | NOT STARTED |
| REQ-PUB-004 | Full slide-in mobile menu | D1 | p4, §3 | Mobile navigation | — (frontend) | Menu opens/closes, keyboard + touch operable | NOT STARTED |
| REQ-PUB-005 | Four-column footer | D1 | p4, §3 | Global footer | Site settings, nav/footer content | Footer renders 4 columns on desktop; reflows on mobile | NOT STARTED |
| REQ-PUB-006 | Any section reachable in at most 2 steps from mobile | D1 | p4, §3 | Global navigation | — | Click-count audit from mobile home: ≤2 steps to every section | NOT STARTED |
| REQ-PUB-007 | Every page ends with one clear next step | D1 | p4, §3 | All public pages | — | Each page has exactly one clear next-step CTA at its end | NOT STARTED |
| REQ-PUB-008 | Legal pages: privacy policy, terms of use, error page | D1 | p4, §3 | Legal pages | Pages (legal text) | Pages exist and are linked from footer | CLIENT INPUT REQUIRED |
| REQ-PUB-009 | No section opens empty; no incomplete placeholder shown to the visitor | D1 | p3 §1, p6 §3 | All public pages | Content approval states | Unapproved/empty categories hidden; no placeholder visible in production | NOT STARTED |
| REQ-PUB-010 | Homepage composition follows reference 01 (header/top contact, hero, company intro, expertise/solutions, featured content, CTA, footer); homepage stays selective, not the whole catalog | Prompt §5 (visual source: reference image 01) | Prompt §5, ref-01 | Home | — | Visual QA vs ref-01 (VISUAL_QA_REPORT.md) | NOT STARTED |
| REQ-PUB-011 | About page follows reference 02 (hero, story/profile, capabilities, values only where supported, CTA, footer) | Prompt §5 (ref-02) | Prompt §5, ref-02 | About | Company profile content | Visual QA vs ref-02 | CLIENT INPUT REQUIRED |
| REQ-PUB-012 | Solutions overview + detail follow references 03 and 09 (editorial sections, integrated systems, applications/benefits, related products, CTA) | Prompt §5 (ref-03, ref-09) | Prompt §5, ref-03/09 | Solutions, Solution detail | Solutions content | Visual QA vs ref-03/09 | CLIENT INPUT REQUIRED |
| REQ-PUB-013 | Projects listing + detail follow references 05 and 10; only client-approved projects published | D1 §3; Prompt §5 (ref-05, ref-10) | D1 p4–5; Prompt §5 | Projects, Project detail | Projects + media | Visual QA vs ref-05/10; no unapproved project published | CLIENT INPUT REQUIRED |
| REQ-PUB-014 | Services, Support/Warranty, News/Events, Agencies, Ready-made systems, Downloads, Search results built in the reference visual language (no unrelated identity) | D1 §§3, 12; Prompt §5.1 | D1 pp4–6; Prompt §5.1 | Services, Support, Warranty, News, Events, Agencies, Packages, Downloads, Search | Respective content modules | Each page renders in the extracted design system; routes work | CLIENT INPUT REQUIRED |
| REQ-PUB-015 | Contact page follows reference 07 (approved contact methods, WhatsApp, contact form, location/map only if verified location data supplied) | D1 §3; Prompt §5 (ref-07) | D1 p4; Prompt §5, ref-07 | Contact | Contact settings, form → WhatsApp | Visual QA vs ref-07; form output reaches WhatsApp | CLIENT INPUT REQUIRED |
| REQ-PUB-016 | Search results page; instant search while typing across products, models, articles, projects in 3 languages, mini-card suggestions, understands model names/codes/common synonyms | D1 §4, p7 | p7, §4 | Search results | Search index/analytics | Search returns correct results in each language; synonyms/codes work | NOT STARTED |

## CAT — Catalog, products, packages, agencies

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-CAT-001 | Category tree: main categories by product type, subcategories by families/models; brand is a browse filter inside categories, not the classification basis | D1 | p5, §3 | Catalog, Category | Categories/subcategories | Tree renders as specified; brand never a top-level category | CLIENT INPUT REQUIRED |
| REQ-CAT-002 | Final category tree and contents determined ONLY from the client's approved written product/model lists, before the content phase | D1 | p5, §3 | Catalog | Approved lists | No category/product exists that is not on an approved list | CLIENT INPUT REQUIRED |
| REQ-CAT-003 | Unified filters in every category: brand; power/capacity ranges; system type (hybrid, off-grid, on-grid, single-phase, three-phase, low-voltage, high-voltage); usage (home, farm, shop/office, commercial facility, factory, irrigation/wells); availability | D1 | p5, §3 | Catalog, Category | Filter values from actual catalog data | Each filter works; no filter value shown that no approved product has | NOT STARTED |
| REQ-CAT-004 | Availability shown as clear text ("available now" / "available on order"), not by colour alone; default sort most-requested then newest; result count shown; filter links shareable and indexable | D1 | p5, §3 | Catalog, Category | Availability text field | Availability readable without colour; sort order; shared filter URL works | NOT STARTED |
| REQ-CAT-005 | Unified product card: one real image on clean background; full name; brand; one benefit line; exactly 3 key specs (power/capacity, voltage/phase, usage type); availability as text; WhatsApp + Details buttons; no price field ever | D1 | p5, §3 | Catalog, Category, Home featured | Product | Card field audit on every card; zero price fields | NOT STARTED |
| REQ-CAT-006 | Unified product page with the 10 components in the study's order (breadcrumbs; zoomable gallery; header with name/model/benefit/availability/main WhatsApp button + mobile bottom bar; overview; benefits in full; complete manufacturer spec table; package contents + compatibility with internal links; downloads; approved unified warranty text + warranty-page link; related products + choice-assistance bar) | D1 | p5, §3 | Product detail | Product, specs, downloads, warranty text | Component-order audit vs D1; spec table matches manufacturer document verbatim | CLIENT INPUT REQUIRED |
| REQ-CAT-007 | Technical specifications preserve manufacturer values, units, model identifiers and document references; missing values stay absent, never guessed | D1 | p5, §3 | Product detail | Specs | Spec values spot-checked against manufacturer docs | CLIENT INPUT REQUIRED |
| REQ-CAT-008 | 4 ready-made packages on unified templates (Basic Home; Extended Home; Large Home / Small Facility; Farm and Pumping from catalog pumping products by well depth and water quantity); each shows who it suits, components by model, what it usually powers, component images, package FAQs, one clear WhatsApp button | D1 | pp5–6, §3 | Packages, Package detail | Packages + components | 4 packages exist with approved components only; one WA CTA each | CLIENT INPUT REQUIRED |
| REQ-CAT-009 | No price, saving or discount claim for any package without the client's written approval | D1 | p5, §3 | Packages | — | Price-scan of all package pages/metadata: zero prices | NOT STARTED |
| REQ-CAT-010 | Agency page per agency approved in writing, proving representation status as approved, showing product families/files/certificates, linking to its products; brands covered determined exclusively by the approved written agency list | D1 | p6, §3 | Agency listing, Agency detail | Agencies + evidence | No brand listed as agency without written approval; logos official files, uniform size, no redraw/recolour | CLIENT INPUT REQUIRED |
| REQ-CAT-011 | Content-approval states enforced: confirmed-by-client (publish when image+specs complete); factory-catalog-documented but availability unconfirmed (place prepared, not published); awaiting client list (category in plan/structure only, hidden) | D1 | p6, §3; p7, §5 | Catalog, Admin | Approval state per product/category | State machine test: each state behaves as specified; nothing fictional published | NOT STARTED |
| REQ-CAT-012 | No fictional product published, no empty category opened, no incomplete placeholder shown to the visitor | D1 | p3 §1, p6 §3 | All public pages | Approval states | Production content audit: zero placeholders, zero empty categories | NOT STARTED |
| REQ-CAT-013 | Brand attribution for any product (incl. LM PACK) comes ONLY from the client's approved written lists; no brand is named in either source PDF | D1 (absence) + Prompt §1.2 | D1 §3; DOCUMENT_ANALYSIS §16 C-1 | Product detail, Agency pages | Approved brand list | Attribution audit vs approved list; LM PACK unresolved until client confirms | CLIENT INPUT REQUIRED |

## WA — WhatsApp and inquiry analytics

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-WA-001 | WhatsApp is the sole sales/inquiry channel at launch; one unified number for the whole platform, managed from admin settings, identical in header, footer, contact page and every button | D1 | p6, §4 | All pages | Site settings (single WhatsApp number) | Number identical everywhere; changed once in settings, updates everywhere | CLIENT INPUT REQUIRED |
| REQ-WA-002 | Permanent floating WhatsApp button on all pages; inside product/package pages it becomes a full-width bottom bar carrying the product/package name | D1 | p6, §4 | All pages; Product/Package detail | — | Floating button present everywhere; bottom bar on product/package pages with correct name | NOT STARTED |
| REQ-WA-003 | Every button opens a chat with a prepared message naming the product, package or request type (product inquiry, package request, maintenance request, facility-system study request, system-choice consultation), in the language of the click-source page | D1 | p6, §4 | All pages | Message templates per language | Each CTA opens wa.me with correct number + encoded message in the right language | NOT STARTED |
| REQ-WA-004 | Short forms send output directly to WhatsApp (maintenance request, facility system-study request, contact message, guidance tools); no customer message lost in an unread mailbox | D1 | p6, §4 | Contact, Support, Guidance | Form → WhatsApp handoff | Each form produces a correct prepared WhatsApp message | NOT STARTED |
| REQ-WA-005 | Pumping guidance tool: collects well depth, daily water quantity, type of use; linked to catalog pumping products/systems; sends answers to WhatsApp for the team to design the system | D1 | p7, §4 | Pumping guidance | Guidance submissions | Tool collects the 3 fields, validates, sends to WhatsApp | NOT STARTED |
| REQ-WA-006 | Pumping tool is a preliminary guidance/request tool, NOT presented as a certified pump-sizing calculator, unless the client supplies an approved calculation method, assumptions and validation data; no specific pump model recommended, no hydraulic result promised | Prompt §11 (implementation decision consistent with D1 §4) | Prompt §11 | Pumping guidance | — | Copy audit: no sizing/certification claim; no model recommendation | NOT STARTED |
| REQ-WA-007 | Guidance bar visible on home page and in the products gateway, directing visitors who do not know the suitable system to ready-made systems or a WhatsApp consultation | D1 | p7, §4 | Home, Products gateway | — | Bar present on home + products gateway; links work | NOT STARTED |
| REQ-WA-008 | Click analytics: WhatsApp button clicks recorded by source (product, package, category, guidance tool, page), time and language; dashboard periodic reports (most-inquired products/packages, most-used categories, internal search operations and results); privacy-respecting tools; clicks recorded, not message delivery | D1 | p7, §4 | Admin reports | Click events | Click recorded with source/time/language; reports render; no delivery claim | NOT STARTED |
| REQ-WA-009 | Sticky WhatsApp bar on product and ready-made-system pages on mobile does not cover content, forms, cookie controls or footer actions; correct mobile safe-area spacing | Prompt §10.2 | Prompt §10.2 | Product/Package detail (mobile) | — | Mobile audit at small widths: no overlap, safe-area respected | NOT STARTED |
| REQ-WA-010 | No price in any WhatsApp prepared message or inquiry flow | D1 §1, p3; Prompt §3.1 | D1 p3; Prompt §3.1 | All WhatsApp CTAs | Message templates | Message audit: zero prices | NOT STARTED |

## ADM — Admin dashboard

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-ADM-001 | One dashboard manages the whole site from a single data source; any change reflects on the site directly; works in 3 languages, mobile + computer | D1 | p7, §5 | Admin | All content modules | Edit in admin → visible on site; works on mobile + desktop | NOT STARTED |
| REQ-ADM-002 | Nine units preserved: (1) Products and Catalog, (2) Packages and Ready-made Systems, (3) Projects and Events, (4) News and Articles, (5) Agencies, Certificates and Clients, (6) Services and Support, (7) Statistics and Reports, (8) Site Settings, (9) Users and Roles | D1 | p7, §5 | Admin | Admin modules | All 9 units present with D1 labels | NOT STARTED |
| REQ-ADM-003 | Roles and permissions; operations (audit) log for sensitive actions; least privilege | D1 | pp7–8, §§5, 7 | Admin | Users, roles, audit log | Role test: each role sees/does only its permitted actions; sensitive actions logged | NOT STARTED |
| REQ-ADM-004 | Publication gates enforced in admin: no product with incomplete data, images and confirmed specifications is published | D1 | p7, §5 | Admin (Products) | Approval states, validation | Incomplete product cannot be published; reason shown | NOT STARTED |
| REQ-ADM-005 | Contact and warranty data edited in one place, appearing unified across the platform | D1 | p3 §1; p7 §5 | Admin (Settings) | Site settings | Change once → header/footer/contact/warranty all update | NOT STARTED |
| REQ-ADM-006 | Admin shows translation completeness and publication status per language; Chinese content flagged until human-reviewed | D1 §6, p8; Prompt §13.2 | D1 p8; Prompt §13.2 | Admin (Languages) | Translation status | Status visible per language; unreviewed Chinese blocked from publication | NOT STARTED |
| REQ-ADM-007 | Safe media replacement; prevent accidental deletion of referenced content; validation errors next to relevant fields; publication status visible with reason when unpublishable | Prompt §14.2 (implementation detail of D1 §5) | Prompt §14.2 | Admin | Media, content | Deletion of referenced content blocked; errors inline | NOT STARTED |
| REQ-ADM-008 | Backup operations in admin; documented backup strategy (database, uploaded media, config/secrets handling, retention, restore verification); no claim backups work until a real backup+restore test in the target environment | D1 §7, p8; Prompt §16.2 | D1 p8; Prompt §16.2 | Admin / operations | Backup jobs | Real backup + restore test performed and recorded | NOT STARTED |
| REQ-ADM-009 | Dashboard reports for WhatsApp inquiry clicks (product, package, category, general, guidance-tool, page-level counts, language distribution, internal search usage) | D1 §4, p7; Prompt §10.3 | D1 p7; Prompt §10.3 | Admin (Statistics) | Click events | Reports render with correct counts | NOT STARTED |
| REQ-ADM-010 | Admin routes protected; secure authentication; CSRF, server-side validation, output escaping, secure file upload (MIME/type/size), rate limiting and spam protection for public forms/search | D1 §7, pp8–9 | D1 pp8–9 | Admin, public forms | Auth, policies | Security checklist tested (see TEST_REPORT.md) | NOT STARTED |

## I18N — Three languages

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-I18N-001 | Arabic first (RTL, reference version for every addition/update), English, Simplified Chinese — three complete versions, same page architecture | D1 | p8, §6 | All pages (×3) | Translations per language | All required pages exist in all 3 languages | NOT STARTED |
| REQ-I18N-002 | Each language edited independently in admin on the same structure/images/products; no instant machine translation in any version | D1 | p8, §6 | Admin (Languages) | Translations | Editing one language never auto-changes another | NOT STARTED |
| REQ-I18N-003 | Language switcher takes the visitor to the same page in the other language, not to home; clear intentional fallback when no equivalent translation exists | D1 | p8, §6 | Global header | Routes, hreflang | Switcher preserves page on every tested page; missing-translation fallback is intentional, not a broken URL | NOT STARTED |
| REQ-I18N-004 | Model names, brand names and technical units never translated; only descriptions, benefits and titles translated | D1 | p8, §6 | All pages | Translations | Audit: model/brand/unit strings identical across languages | NOT STARTED |
| REQ-I18N-005 | Prepared WhatsApp messages written in the language of the page the visitor clicked from | D1 | p8, §6 | All WhatsApp CTAs | Message templates | Message language matches source page language | NOT STARTED |
| REQ-I18N-006 | Per-language search titles/descriptions, own sitemap, mutual language tags (hreflang); approved unified terminology across the three versions | D1 | p8, §6 | SEO | Sitemaps, metadata | Sitemap per language; hreflang correct; metadata unique per page+language | NOT STARTED |
| REQ-I18N-007 | Chinese version reviewed before launch by a human competent in energy/equipment terminology, arranged by the client or by separate agreement | D1 | p8, §6; p4, §2 | Chinese version | Review workflow | Chinese content flagged unreviewed until reviewer sign-off | CLIENT INPUT REQUIRED |
| REQ-I18N-008 | RTL/LTR mastery: Arabic fully mirrored without breaking cards/tables; English and Chinese on the same grid and spacing; logical CSS properties; directional icons not blindly mirrored | D1 §9, p10; Prompt §13.3 | D1 p10; Prompt §13.3 | All pages | Styles | RTL/LTR audit on nav, breadcrumbs, cards, forms, tables, galleries, drawers, pagination, sticky bars | NOT STARTED |

## NFR — Architecture, security, performance, SEO, quality

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NFR-001 | Mobile-first performance on slow networks: first-visual image compressed and loaded first; rest lazy-loaded; no heavy sliders at page tops; skeleton loading shaped like content | D1 | p10, §9 | All pages | Images, loading | Slow-network profile test on Android + iPhone; first content not delayed | NOT STARTED |
| REQ-NFR-002 | Calm motion in one documented system (staggered scroll appearance, short controlled transitions), auto-reduced for reduced-motion users, never delaying first content | D1 | p10, §9 | All pages | Motion system | Motion audit; prefers-reduced-motion respected; no invisible content if JS fails | NOT STARTED |
| REQ-NFR-003 | Accessibility: sufficient contrast, alt text for every image in the platform's languages, logical heading order, visible keyboard focus | D1 | p10, §9 | All pages | Content, styles | Contrast ≥4.5:1 for text; alt audit; heading order; keyboard walkthrough | NOT STARTED |
| REQ-NFR-004 | Visual consistency: product card, article template, project template, WhatsApp bar are single reused components without random variations | D1 | p10, §9 | All pages | Components | Component audit: one component reused everywhere | NOT STARTED |
| REQ-NFR-005 | HTTPS on platform and dashboard; secure auth; roles/permissions; audit log; integration secrets in a secure vault outside code; periodic backup with documented restore | D1 | pp8–9, §7 | Platform + Admin | Infra, secrets | HTTPS verified; secrets not in code; backup+restore test | NOT STARTED |
| REQ-NFR-006 | SEO: automatic per-language sitemaps; routing file protecting the dashboard; structured data for products, projects, FAQs and the organisation; manually written titles/descriptions for main pages in 3 languages; short stable URLs without dates/internal numbers | D1 | p9, §7 | SEO | Sitemaps, metadata, robots | Sitemap/robots/structured-data audit; no price metadata; no invented review/rating data | NOT STARTED |
| REQ-NFR-007 | Presentation layer fast/mobile-optimised with modern compressed image formats in multiple sizes; application + relational DB with documented internal APIs; single external integration layer; fixed unchanging product IDs | D1 | p8, §7 | Architecture | Schema, APIs | Architecture review vs D1 §7; responsive images verified | NOT STARTED |
| REQ-NFR-008 | 8 launch gates passed together before publication (no price anywhere; links sound in 3 versions; 3 versions complete + page-preserving switcher; product fields complete + unconfirmed categories hidden; WhatsApp buttons correct; Android+iPhone slow-network test; contact data matching + current copyright year; future capabilities closed and hidden) | D1 | p11, §9 | Release | — | Gate checklist with evidence per gate (TEST_REPORT.md) | NOT STARTED |
| REQ-NFR-009 | Delivery by written final acceptance after the gates; documentation package delivered (logical data model + data dictionary; architecture diagrams + integration layer with documented internal APIs; admin guide; scope/approval decision log); client team trained on the dashboard | D1 | p11 §9; p13 §12.7 | Handover | Docs | Handover checklist complete; training done | NOT STARTED |
| REQ-NFR-010 | Free maintenance/support 3 months from final acceptance (defects in built scope, platform+dashboard as delivered); afterwards by separate agreement | D1 | p12, §11 | Support | — | Support terms recorded; not presented as product warranty | NOT STARTED |
| REQ-NFR-011 | Stack: Laravel + Blade + Alpine.js + Tailwind CSS + Filament admin + PostgreSQL-or-MySQL + GSAP/ScrollTrigger where justified; no React/Next.js/Vue/Flutter | Prompt §15 (IMPLEMENTATION DECISION; D1 mandates no framework) | Prompt §15 | Architecture | Stack | Stack audit; forbidden frameworks absent | NOT STARTED |
| REQ-NFR-012 | No price anywhere: no public page, API response, metadata, structured data or search result exposes a price (release gate 1) | D1 §1 p3, §9 p11; Prompt §3.1 | D1 pp3, 11 | All public surfaces | Templates, APIs, metadata | Full price-scan of pages, APIs, metadata, structured data, sitemaps | NOT STARTED |

## FUT — Future commerce readiness (disabled at launch)

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUT-001 | Reserved places/relationships/keys for store, cart, checkout, customer account; designed (not operating) entities: customer, order + items, invoice, stock movement, accounting entry; optional internal disabled fields (internal price, cost, stock, accounting code) unreachable by display templates | D1 | pp9–10, §8 | Architecture (invisible) | Schema (disabled) | Schema review: entities exist without operating interfaces; templates cannot reach disabled fields | NOT STARTED |
| REQ-FUT-002 | All future capabilities closed and invisible at launch (no cart, no payment, no customer accounts, no accounting, no published prices); activation keys off and verified off in the launch gates | D1 | p10, §8; p11, §9 | All public surfaces | Feature flags (server-side) | Gate 8 evidence: no commerce UI, no commerce routes/APIs reachable, flags off server-side | NOT STARTED |
| REQ-FUT-003 | Future payment rules (whenever activated): no provider named before its agreement is signed; confirmation only by signed, verified provider notifications (never a customer screenshot); no card data / wallet balances stored; fixed states (started, confirmed, failed, refunded); provider reference number per movement; daily settlement before accounting posting; currencies + exchange rate set in writing by the client before activation | D1 | p9, §8 | Future only | — | Documented in ARCHITECTURE.md as future rules; NOT implemented at launch | NOT STARTED |
| REQ-FUT-004 | Future activation governance: written client decision → independent project → external approvals → test environment → gradual launch with rollback, WhatsApp as working alternative throughout; future accounting on the store's own data with client-approved chart of accounts, serial invoices, "no entry without an order, no invoice without confirmed payment or documented credit approval", parallel trial cycle, accountant's written approval | D1 | p10, §8 | Future only | — | Documented as future governance; NOT implemented at launch | NOT STARTED |

## DEL — Delivery, commercial, timing (INTERNAL)

| ID | Requirement | Source file | Page/section | Public page/module | Backend/data | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-DEL-001 | Implementation price $550 total (200 + 150 + 120 + 50 + 30) — INTERNAL, never on the site | D1 §2, p14; D2 §2, pp2–3 | D1 p14; D2 pp2–3 | — (internal) | — | Arithmetic verified: 200+150+120+50+30 = 550 | NOT STARTED |
| REQ-DEL-002 | 4 equal instalments of $137.50 tied to milestones: (1) contract signing/start; (2) Phase 1 acceptance; (3) Phases 2+3 acceptance; (4) final acceptance + launch + documentation package — INTERNAL | D1 §3, p15; D2 §3, p3 | D1 p15; D2 p3 | — (internal) | — | Arithmetic verified: 4 × 137.50 = 550 | NOT STARTED |
| REQ-DEL-003 | Duration 4 weeks from the client's delivery of requirements/materials; external-party waiting time outside the duration; client delay pauses the clock by the delay | D1 §10, p11; §12.4, p12; D2 §5, p4 | D1 pp11–12; D2 p4 | — (internal) | — | Start date recorded when materials delivered; clock rules applied | CLIENT INPUT REQUIRED |
| REQ-DEL-004 | Offer valid 30 days from issue (8 Nov 2026 → 8 Dec 2026); both documents are offers, not contracts; executive commitment starts from a separate signed contract adopting them | D1 §1, p14; §12.1–12.2; D2 pp1, 4 | D1 pp12–14; D2 pp1, 4 | — (internal) | — | Signed contract on file before executive commitment; expiry flagged if past 8 Dec 2026 | CLIENT INPUT REQUIRED |
| REQ-DEL-005 | Client chooses ONE domain only: ghamdan-solar.com ($41.44 / 3 years) OR ghamdan-energy.com ($41.44 / 3 years); hosting free at launch, Pro upgrade $20/month optional ($240/yr, $720/3yr); domains + hosting are client-paid external services outside the $550 | D1 §4, p15; D2 §4, p3 | D1 p15; D2 p3 | Deployment | Domain/hosting | Domain choice recorded in writing; costs not in implementation price | CLIENT INPUT REQUIRED |
| REQ-DEL-006 | Ownership transfers to the client on full payment; ORTECH general tools/methodologies remain ORTECH's; mutual confidentiality | D1 §12.8–12.9, p13; D2 §5, p4 | D1 p13; D2 p4 | — (internal) | — | Recorded in contract | NOT STARTED |
| REQ-DEL-007 | Change requests: any change to approved scope documented in an annex showing price + time effect, approved by both parties before implementation | D1 §12.5, p12; D2 §5, p4 | D1 p12; D2 p4 | — (internal) | Decision log | Decision log maintained (D1 §12.7) | NOT STARTED |

---

## Conflicts recorded in this traceability file

| Conflict | Rows affected | Status |
|---|---|---|
| C-1 No brand named in either PDF (LM PACK attribution unanswerable from sources) | REQ-CAT-013, REQ-CAT-002, REQ-CAT-010 | CLIENT INPUT REQUIRED |
| C-2 Pro hosting $20 periodicity: D1 no period; D2 adopts monthly | REQ-DEL-005 | Resolved by the more specific document (D2) |
| C-3 No product warranty duration in either PDF; 3 months is platform maintenance only | REQ-NFR-010, REQ-CAT-006 (component 9) | CLIENT INPUT REQUIRED |
| C-4 No colour palette / gold in either PDF; identity governed by reference images | REQ-PUB-010–015 | CLIENT INPUT REQUIRED (only if gold proposed) |
| C-5 No homepage section order in the study; order from reference image 01 | REQ-PUB-010 | Not a conflict — reference-governed |
| C-6 Price-item 1 wording differs (motion vs SEO), same $200 | REQ-DEL-001 | Not material — D1 governs |
| C-7 Admin unit labels differ in wording, count 9 in all sources | REQ-ADM-002 | Not material — D1 labels used |
| C-8 No Ghamdan contact data / WhatsApp number in either PDF | REQ-WA-001, REQ-PUB-002/015 | CLIENT INPUT REQUIRED |
| C-9 No content supplied in either PDF (products, categories, packages, projects, services, news, legal) | REQ-CAT-001/002/008, REQ-PUB-008/011–014 | CLIENT INPUT REQUIRED |

**Row counts:** PUB 16 · CAT 13 · WA 10 · ADM 10 · I18N 8 · NFR 12 · FUT 4 · DEL 7 = **80 requirements**.
