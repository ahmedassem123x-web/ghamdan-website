# DOCUMENT ANALYSIS — Ghamdan Solar Platform (Phase 0)

> **Audit date:** 2026-11-14
> **Auditor:** PDF audit agent (Phase 0, prompt §§1–2, 22)
> **Governing prompt:** `Ghamdan_Master_Execution_Prompt_v2_3_zpxp.md` (v2.0) — `incoming/prompt/`
> **Method:** Both PDFs read completely in extracted text (all pages, tables, footnotes).
> Arabic text is in presentation forms / bidi-reordered in the extractions; terms were
> verified with NFKC normalisation and both word orders, and every figure below was
> confirmed by raw digit counts in the extracted text. Page counts verified from the
> PDF files themselves (ref-1: 4 pages, A4, Skia/PDF; ref-2: 16 pages, A4, WeasyPrint 70.0;
> both unencrypted). No table or diagram was unclear enough in text to require a rendered-page read.
>
> **Labels used** (prompt §1.3): `SOURCE REQUIREMENT` · `APPROVED DECISION` ·
> `IMPLEMENTATION DECISION` · `RECOMMENDATION` · `CLIENT INPUT REQUIRED` · `OUT OF SCOPE`.
>
> **Commercial figures in this document are INTERNAL.** They govern the build and the
> contract; they must never appear on the public site, in any public page, API response,
> metadata, structured data or search result (prompt §3.1, study §1, release gate 1).

---

## 1. Documents audited

| # | File (as supplied) | Local copy | Title | Version | Date | Pages | Purpose |
|---|---|---|---|---|---|---|---|
| D1 | `DOC-20261114-WA0046.pdf` | `incoming/references/ref-2.pdf` | الدراسة الفنية والتقنية والمالية لمشروع بناء منصة إلكترونية ولوحة تحكم لشركة غمدان للتجارة والخدمات لأنظمة الطاقة الشمسية والتخزين — *Comprehensive Technical, Technological & Financial Study and Price Offer* | 1.0 | 8 Nov 2026 | 16 | `SOURCE REQUIREMENT` — the governing technical + financial study: scope, public platform, catalog, WhatsApp, admin, languages, architecture, future readiness, quality/acceptance, duration, warranty, general terms, price and payment plan. Explicitly "a study and offer, not a contract" (p1, §12.1); on approval it becomes the reference the implementation contract is built on. |
| D2 | `عرض سعر موقع غمدان.pdf` | `incoming/references/ref-1.pdf` | ورقة عرض سعر — مشروع بناء منصة إلكترونية ولوحة تحكم لشركة غمدان للتجارة والخدمات لأنظمة الطاقة الشمسية والتخزين — *Price Quotation — Solar Energy Platform and Admin Dashboard* | (no version number; based on study v1.0, 8 Nov 2026) | (no issue date printed; validity "30 days from issue — until 8 Dec 2026", p1/p4) | 4 | `SOURCE REQUIREMENT` — the single price quotation: implementation price with its 5 line items, 4 payment milestones, domains + cloud hosting for 3 years, and offer conditions. Explicitly "a price quotation, not a contract" (p1, §5); any executive commitment starts from a separate signed contract adopting it as reference. |

**Authority hierarchy (prompt §1.1):** D1 (study v1.0) first, then D2 (quotation), then explicit
written client-approved clarifications, then existing repository constraints. The images are the
source of truth for appearance only.

**Signature status — both documents UNSIGNED in the copies supplied.** D1 p16 and D2 p4 each
carry blank "prepared by ORTECH" and "client acceptance" signature/date/name blocks. No signed
contract exists in the supplied inputs. `CLIENT INPUT REQUIRED` — signed approval / contract
before any executive commitment (see CLIENT_INPUT_REGISTER.md, CI-01).

**Issuer (both documents):** ORTECH SOLUTIONS — شركة أورتيك للحلول التقنية, Sana'a, Yemen.
Tel +967 771 131 894 · info@ortech.tech · https://ortech.tech. This is the *supplier's*
contact, not the client's.

**Client (both documents):** Ghamdan Trading Services — غمدان للتجارة والخدمات, supplier of
solar energy and storage systems, Sana'a, Yemen. **Neither document gives any Ghamdan contact
detail** — no address, phone, email, WhatsApp number, or working hours. All client contact data
is `CLIENT INPUT REQUIRED` (CI-05).

---

## 2. Scope (summary)

`SOURCE REQUIREMENT` — D1 §2 (pp3–4), D2 §1 (pp1–2):

Build an official corporate website + full admin dashboard for Ghamdan that presents the
company's products, agencies, projects and services, receives customer inquiries via WhatsApp,
and is managed entirely from one dashboard in three languages — with architecture prepared for
future commerce/payment/accounting, all disabled at launch.

**Governing constraints (D1 §2, p3):**
- Primary audience: customers in Yemen — individuals, facilities, traders — reaching the site
  mostly from mobile phones over limited-speed networks. The platform is **mobile-first and
  high-performance on weak connections as a commitment, not a preference**.
- Arabic is the platform's first language and primary direction, with full English and
  Simplified Chinese versions.
- Products are usually sold as part of an integrated system, not a single piece — so solutions
  and ready-made systems are presented up front alongside individual products.
- All contact, warranty and availability data is approved by the client and managed from a
  single source in the admin dashboard.

**In scope** (D1 §2, pp3–4): public site in its 10 sections with an official visual identity
specific to the client; product catalog with main/sub categories per approved client lists,
unified templates and agency pages, entering confirmed ready content during the content phase;
admin dashboard with its §5 units, user roles and permissions; full WhatsApp integration
(contextual buttons, prepared messages, inquiry statistics by source); pumping guidance tool
and guidance bar; the three language versions with the same structure/content and a
page-preserving language switcher; architectural preparation for commerce/payment/accounting
per §8, without activating any of it; testing and launch on the client's domain, training the
client's team on the dashboard, and delivering operating documentation and the technical design
package per §12.7.

**Out of scope** — see SCOPE_AND_EXCLUSIONS.md (D1 §2 p4; D2 §1 p2, §5 p4).

---

## 3. Public platform requirements

`SOURCE REQUIREMENT` — D1 §3 (pp4–6), D2 §1 (pp1–2); visual composition governed by the
10 reference images (prompt §5).

### 3.1 The 10 main sections (D1 §3, p4; D2 §1, p1 — identical in both)

1. Home — الرئيسية
2. About — من نحن
3. Products — المنتجات
4. Services — الخدمات
5. Projects — المشاريع
6. Support and Warranty — الدعم والضمان
7. News and Events — الأخبار والفعاليات
8. Contact — التواصل
9. Agencies — صفحات الوكالات
10. Legal Pages — الصفحات النظامية (privacy policy, terms of use, error page)

### 3.2 Unified navigation (D1 §3, p4)

- Thin top bar with contact data.
- Sticky header that compacts (shrinks) on scroll.
- Full slide-in mobile menu.
- Four-column footer.
- Floating WhatsApp button on every page, turning inside product pages into a full-width
  bottom bar carrying the product name.
- **Binding structural rule:** any section is reachable in **at most 2 steps from mobile**,
  and **every page ends with one clear next step**.

### 3.3 Supporting templates

`SOURCE REQUIREMENT` — D1 §§3–4, 6, 12 (catalog, category, product detail, ready-made system
listing/detail, agency listing/detail, services, projects listing/detail, support, warranty,
downloads centre, news listing/article, events, contact, search results, privacy, terms, 404).
Prompt §4.2 lists the same template set; it is consistent with D1 and adds no contracted
section. Distinguish navigation sections from dynamic templates in SITE_MAP.md (implementation).

---

## 4. Catalog and package requirements

`SOURCE REQUIREMENT` — D1 §3 (pp4–6), D2 §1 (pp1–2).

### 4.1 Category tree — NOT defined by the study

- Products are organised in **main categories by product type**, each branching into
  **subcategories by product families and models**. Brand appears as a **browse filter inside
  categories, not as the basis of classification** (D1 §3, p5).
- **Reference clarification (D1 §3, p5): the main/sub categories and their contents are NOT
  determined by this study.** They are determined finally from the product and model lists
  the client approves **in writing before the content phase**. No category opens and no
  product is published except from those lists, per the content-approval states below.
  `CLIENT INPUT REQUIRED` — CI-02 (approved written product/model lists + category hierarchy).

### 4.2 Unified browse/display rules (D1 §3, p5)

- **Unified filters in every category:** brand; power/capacity ranges; system type
  (hybrid — off-grid — on-grid — single-phase — three-phase — low-voltage — high-voltage);
  usage (home — farm — shop/office — commercial facility — factory — irrigation/wells);
  availability.
- **Availability is shown as clear text** ("available now" / "available on order"), **not by
  colour alone**. Default sort: most requested, then newest. Result count shown; filter
  links shareable and indexable.
- **Unified product card:** one real image on a clean background; full name; brand; one line
  showing the product's main benefit; **only three key specifications**
  (power or capacity — voltage or phase — usage type); availability as text; WhatsApp and
  Details buttons. **No price field in the card, ever.**
- **Unified product page — 10 components, in order:**
  1. Breadcrumbs; 2. zoomable image gallery; 3. header with name, model, benefit, availability,
     main WhatsApp button and a fixed bottom WhatsApp bar on mobile; 4. overview; 5. benefits in
     full wording; 6. **complete technical specification table from the manufacturer's document,
     without abbreviating or altering values**; 7. package contents and compatibility with
     internal links; 8. downloads (specification document and product certificates);
     9. the approved unified warranty text for this product, with a link to the warranty page;
     10. related products and a choice-assistance bar.
  - The product WhatsApp button opens the unified number with a prepared message naming the
    product and model and its page link, **in the language of the page the visitor came from**.

### 4.3 Ready-made systems / packages (D1 §3, pp5–6; D2 §1, p2)

- Approved packages shown on unified-template pages: who it suits; its components by model;
  what it usually powers; component images; package-specific FAQs; **one clear WhatsApp
  button per package**.
- **No price and no saving/discount claim for any package without the client's written approval.**
- **Initial 4 packages in scope, with components as the client approves them in writing:**
  Basic Home; Extended Home; Large Home / Small Facility; Farm and Pumping (built from the
  catalog's pumping products according to well depth and water quantity).
  `CLIENT INPUT REQUIRED` — CI-03 (approved component/model list per package).

### 4.4 Agency pages (D1 §3, p6; D2 §1, p2)

- One page per agency the client approves **in writing in his official agency list**, proving
  the client's representation status as approved in writing, showing its product families,
  files and certificates, and linking to its products inside their functional categories.
- The brands covered by agency pages are determined **exclusively** by the client's approved
  written list before the content phase. **No brand is listed as a Ghamdan agency without
  that approval.**
- The agency page organises access and does not duplicate product pages. Agency logos are used
  from their official files, in uniform sizes, **without redrawing or recolouring**.
- **No brand name is given in either PDF.** See §13 / Conflict C-1.
  `CLIENT INPUT REQUIRED` — CI-04 (approved agency list + representation texts + official logos).

### 4.5 Content-approval states for publication (D1 §3, p6; D1 §5, p7)

Three states; in all three, **no fictional product is published, no empty category opens,
and no incomplete placeholder is shown to the visitor**:

| State | Meaning |
|---|---|
| Confirmed by the client | Built and published as soon as its image and specifications are complete. |
| Documented in the factory catalog, availability unconfirmed | Its place is prepared in the structure; not published until the client confirms the available models. |
| Awaiting the client's list | The category exists in the plan and structure only and stays hidden until the list arrives. |

Prompt §3.2 names six workflow states (`draft`, `awaiting_client_list`, `factory_catalog_verified`,
`confirmed_by_client`, `published`, `archived`) — `IMPLEMENTATION DECISION`: these map onto the
three source states above; the source's three states govern publication, the prompt's six are the
admin workflow labels for them. No conflict.

---

## 5. WhatsApp requirements

`SOURCE REQUIREMENT` — D1 §4 (pp6–7), D2 §1 (pp1–2).

- **WhatsApp is the sole sales and inquiry channel at launch.** One unified WhatsApp number
  for sales and inquiries across the whole platform, managed from the admin settings, shown
  identically in the header, footer, contact page and every button.
  `CLIENT INPUT REQUIRED` — CI-05 (the business WhatsApp number; **no number appears in
  either PDF**).
- Permanent floating button on all pages; inside product and package pages it becomes a
  full-width bottom bar carrying the product/package name.
- Every button opens a chat with a prepared message naming the product, package, or request
  type (product inquiry — package request — maintenance request — facility-system study
  request — system-choice consultation), **in the language of the page the click came from**.
- **Short platform forms send their output directly to WhatsApp** — maintenance request,
  facility system-study request, contact message, guidance tools — "so no customer message is
  lost in an unread mailbox". (No email inbox is part of the inquiry flow.)
- **Pumping guidance tool:** linked to the catalog's pumping products/systems; collects **well
  depth, daily water quantity, type of use**; sends the answers to WhatsApp so the team designs
  the suitable system. Prompt §11 adds the engineering-safety rule: do not present it as a
  certified pump-sizing calculator unless the client supplies an approved calculation method —
  `IMPLEMENTATION DECISION` consistent with D1 (D1 calls it a guidance tool, not a calculator).
- **Guidance bar:** a visible bar on the home page and in the products gateway, directing a
  visitor who does not know the suitable system to the ready-made systems or to a consultation
  request via WhatsApp.
- **Inquiry/use analytics:** the platform records WhatsApp button clicks by source
  (product — package — category — guidance tool — page), time and language; the dashboard shows
  periodic reports: most-inquired products/packages, most-used platform categories, internal
  search operations and their results — using privacy-respecting analytics tools. **Clicks are
  recorded, not message delivery** (prompt §10.3; D1 does not claim delivery/read tracking).
- **Internal search:** instant while typing; covers products, models, articles and projects in
  all three languages; suggests results as mini-cards; understands model names, codes and
  common synonyms.

---

## 6. Admin requirements

`SOURCE REQUIREMENT` — D1 §5 (p7), D2 §1 (p2).

- The dashboard is the client's tool to control and manage the whole site himself without a
  programmer; everything shown on the site — content, products, pages, data, settings — is
  managed from it, and any change in it is reflected on the site directly.
- Works in the three languages, from mobile and computer.
- **Nine main units (D1 §5, p7 — exact group labels):**
  1. Products and Catalog — المنتجات والكتالوج
  2. Packages and Ready-made Systems — الباقات والأنظمة الجاهزة
  3. Projects and Events — المشاريع والفعاليات
  4. News and Articles — الأخبار والمقالات
  5. Agencies, Certificates and Clients — الوكالات والشهادات والعملاء
  6. Services and Support — الخدمات والدعم
  7. Statistics and Reports — الإحصاءات والتقارير
  8. Site Settings — إعدادات الموقع
  9. Users and Roles — المستخدمون والأدوار
- Publication rules in the dashboard follow the §4.5 approval states: **no product with
  incomplete data, images and confirmed specifications is published from it.**
- Contact and warranty data are edited in one place and appear unified across the platform
  (D1 executive summary, p3; D2 §1, p2: "contact and warranty from one place").
- Prompt §14 lists the same nine groups with shorter labels (Products, Packages, Projects,
  News, Agencies, Services, Statistics, Settings, Users) and proposes role labels
  (Super Administrator, Content Administrator, Catalog Manager, Projects/News Editor,
  read-only reporting user) — `IMPLEMENTATION DECISION`: the nine groups are source; the role
  labels are proposals unless the source specifies exact names (it does not). D1 requires
  roles/permissions and an operations (audit) log; it does not name the roles.

---

## 7. Language requirements

`SOURCE REQUIREMENT` — D1 §6 (p8), D2 §1 (p2).

- Three complete versions: **Arabic first (RTL, the reference version from which every
  addition or update starts)**, English (opposite direction), **Simplified Chinese** (for
  communicating with manufacturers/suppliers and verifying agencies and models).
- Each version is edited independently in the dashboard on the same structure, images and
  products. **No instant machine translation in any version.** The language switcher takes the
  visitor to **the same page in the other language, not to the home page**.
- Model names, brand names and technical units are **never translated**; only descriptions,
  benefits and titles are translated. Prepared WhatsApp messages are written in the language
  of the page the visitor clicked from.
- Each version has its own search titles/descriptions, its own sitemap, and mutual language
  tags (`hreflang`); the platform adheres to approved unified terminology across the three
  versions.
- **The Chinese version is reviewed before launch by a human reviewer competent in energy and
  equipment terminology**, arranged by the client or by separate agreement (D1 §2, p4; §6, p8).
  `CLIENT INPUT REQUIRED` — CI-09 (Chinese review arrangement / approved Chinese text).

---

## 8. Architecture and security

`SOURCE REQUIREMENT` — D1 §7 (pp8–9), D2 §1 (p2).

### 8.1 System layers (D1 §7, p8)

- **Presentation layer:** fast-loading, mobile-optimised public interfaces, built with modern
  web tools, serving images in modern compressed formats in multiple sizes to suit each screen.
- **Application + relational database layer:** manages catalog, content and settings, with
  **documented internal APIs** serving the catalog today and connecting future modules without
  direct database access.
- **Single external integration layer:** any future link (payment wallets — gateways — shipping —
  external systems) passes through it; no external service is planted inside the platform's pages.
- **Independent modules with activation keys:** content and catalog work at launch; customer,
  order, payment and accounting modules are **closed by their keys until their systematic
  activation**.
- **A fixed, unchanging identifier for every product**, linking its display today to any later
  commercial extension without duplicating records.

### 8.2 Security and operations (D1 §7, pp8–9)

- Full encrypted connection (**HTTPS**) on platform and dashboard; admin accounts with roles,
  permissions and an operations log.
- Keys/secrets of any future external integration are kept in a **secure settings vault outside
  the platform code**.
- **Periodic backup** of content and database, with documented restore capability.
- Form protection against abuse; **no payment data collected, no visitor accounts created**
  in the current scope.
- SEO: automatic sitemaps per language, a routing file protecting the dashboard, structured
  data for **products, projects, FAQs and the organisation**, manually written search titles
  and descriptions for the main pages in the three languages, short stable URLs with no dates
  or internal numbers.

### 8.3 Stack — NOT mandated by the study

D1 mandates no framework. Prompt §15 directs Laravel + Blade + Alpine.js + Tailwind CSS +
Filament admin + PostgreSQL-or-MySQL + GSAP/ScrollTrigger where justified, and forbids
React/Next.js/Vue/Flutter — `IMPLEMENTATION DECISION` (prompt direction, compatible with D1;
record in ARCHITECTURE.md, not as a source requirement).

---

## 9. Future readiness (commerce / payment / accounting)

`SOURCE REQUIREMENT` — D1 §8 (pp9–10), D2 §1 (p2). All `OUT OF SCOPE` at launch; architecture
only.

**Prepared from day one (placeholders/relationships/keys, no working capability, no trace in
the visitor interface at launch):**
- Reserved places in the structure for store, cart, checkout and customer-account routes —
  not actually created at launch.
- Entities designed in the data schema and linked to the catalog, without operating interfaces:
  **customer, order and its items, invoice, stock movement, accounting entry**.
- Optional internal disabled fields that may later carry (internal price — cost — stock —
  accounting code), which the current display templates do not reach and do not publish.
- Extendable roles (store manager — accountant — storekeeper) added later without changing
  the permission system.
- The single integration layer (§8.1) is the route for any future payment/shipping/accounting link.

**Rules for any future payment activation (D1 §8, p9):**
- No payment provider is named inside the platform before its agreement is signed; the company
  chooses what it actually contracts from local digital wallets, card gateways and documented
  bank transfer with licensed entities.
- Payment confirmation only by **signed notifications from the provider, verified before any
  order is considered paid**; no payment is confirmed by a screenshot sent by the customer;
  the platform stores no card data and no wallet balances.
- Fixed payment states (**started — confirmed — failed — refunded**); every payment movement
  has a provider reference number that can be matched; movements are settled daily between the
  system and the provider statements before any accounting posting.
- Accepted currencies and the approved exchange rate are determined **in writing by the client
  before any activation**.

**Future accounting as a principle (D1 §8, p10):** when activated in its own independent
project, the accounting unit is built on the store's own data: a chart of accounts approved by
the client's management and accountant; invoices with non-repeating serial numbers linked to
entries generated automatically from every paid operation, refund and financially-effective
stock movement, on two unbreakable rules — **no entry without an order, no invoice without
confirmed payment or documented credit approval**; a full accounting cycle runs in parallel
with the client's existing system before final approval; technical/legal responsibility lies
with the client's accountant and his written approval.

**Activation governance (D1 §8, p10) — 5 steps:** (1) written decision from client management
describing the capability and its commercial goal, no verbal agreement; (2) independent project
with its own scope, price, schedule and acceptance tests, separate from this platform's contract;
(3) completion of external approvals (provider agreements, licences, accountant approval for
any financial effect) before writing any live link; (4) build and test in a test environment
with dummy data, then with reviewed symbolic real operations, without touching the live
platform; (5) gradual launch to a limited segment first, with an immediate rollback plan, and
WhatsApp as a working alternative channel throughout.

**Launch state (D1 §8, p10):** at launch there are no published prices, no cart, no payment,
no customer accounts and no accounting, and all their activation keys are closed and verified
closed within the launch gates (§10 below).

---

## 10. Quality and acceptance

`SOURCE REQUIREMENT` — D1 §9 (pp10–11), D2 §1 (p2).

### 10.1 Binding performance / quality objectives (D1 §9, p10)

- **Mobile and slow networks:** the first-visual image is compressed and loaded first; the
  rest of the images lazy-load; **no heavy sliders at the top of pages**; skeleton loading
  structures shaped like the content while waiting.
- **Calm motion documented in one system:** staggered appearance on scroll and short
  controlled transitions; automatically reduced for anyone who enables reduced-motion on their
  device; **never slows the appearance of the first content**.
- **Both directions mastered:** Arabic fully mirrored RTL without breaking any card or table;
  English and Chinese on the same grid and spacing.
- **Accessibility:** sufficient contrast, alt text for every image in the platform's languages,
  logical heading order, visible keyboard focus.
- **Visual consistency:** product card, article template, project template and WhatsApp bar are
  single components reused across the whole platform without random variations.

### 10.2 The 8 launch gates (D1 §9, p11; D2 §1, p2 — identical)

The platform is **not published before passing all eight together**:
1. A comprehensive check proving **every published page, image and file is free of any price**.
2. Soundness of all internal links and their working in the three versions.
3. Completeness and review of the three versions, and a language switcher that preserves the
   same page.
4. Completeness of every published product's fields with its real image and confirmed
   specifications, and hiding of every category whose lists are unconfirmed.
5. Every WhatsApp button opens the unified number with a correct prepared message naming the
   product, package or request type.
6. Actual testing on **Android and iPhone phones on a slow network**, within the approved
   performance objectives.
7. Matching contact data in the header, footer and contact page, and a **current copyright year**.
8. Closure and invisibility of all future capabilities: no cart, no payment, no customer
   accounts, no visible prices, and activation keys switched off.

**Delivery is by written final acceptance after passing these gates**, with the documentation
package (§12) delivered with it and the client's team trained on the dashboard (D1 §9, p11).

---

## 11. Delivery sequence and timing

`SOURCE REQUIREMENT` — D1 §10 (pp11–12), D2 §5 (p4); prompt §21 maps the same four phases.

- **Duration: 4 weeks, starting from the date the client delivers the requirements and
  materials listed below.** Verified in both documents (D1 p1 cover, §10 p11; D2 p1 summary,
  §5 p4). A detailed implementation plan is approved at contract signing, within this
  4-week duration from the date materials are delivered.
- **Any time in which external parties are awaited (domains, hosting, later providers) is
  outside this duration**, and delay in the client's materials pauses the clock by the amount
  of the delay (D1 §10 p11, §12.4 p12; D2 §5 p4).
- **Phase 1 — Foundation:** approve identity, structure and general design; set up the
  dashboard and the three-language system and base page templates; build the main, profile
  and contact pages. Acceptance: client acceptance of identity, structure and templates and
  completion of the base pages in the three languages.
- **Phase 2 — Catalog and Products:** build the main/sub product categories approved from the
  client's lists, the card/product/package templates, agency pages, filters and search, and
  enter the confirmed catalog with its images and specifications. Acceptance: client
  acceptance of the published catalog and completeness of every published product's fields
  per the approval states.
- **Phase 3 — Content and Support:** build services, projects, support and warranty, FAQs,
  news and events and the downloads centre; complete the English and Chinese versions and
  review them. Acceptance: client acceptance of content completeness in the three languages
  and soundness of the language switcher page by page.
- **Phase 4 — Launch:** comprehensive tests and the §9 launch gates; prepare search maps and
  protection; train the client's team on the dashboard; publish on the client's domain.
  Acceptance: final acceptance and delivery of the live platform with the documentation package.
- **Client materials/commitments before content is complete (D1 §10, p12):** approve the
  official name, address and final contact data and the written representation texts for the
  agencies; the confirmed-available model lists for each catalog category to be approved, or
  a decision to postpone any category whose list is unavailable; real images for every
  published product, its specification files, agency certificates in their originals, and the
  company's original logo file; the approved unified warranty text in writing, publication
  permissions for projects and clients by name and image, and texts of real testimonials if
  any; confirmation of the sales WhatsApp number, official email and displayed working hours.

---

## 12. Warranty / support

`SOURCE REQUIREMENT` — D1 §11 (p12), D2 summary (p1) and §5 (p4).

- **Free maintenance and support for 3 months from the date of final acceptance**, covering
  repair of any defect in what was built within scope and operation of the platform and
  dashboard as delivered. After the free period, maintenance and developments continue under
  a separate maintenance agreement whose scope and price are set at that time.
- **This 3-month term is platform maintenance/support, not a product warranty.**
  Neither document states any product warranty duration. The product warranty is the
  **approved unified warranty text** the client supplies in writing (D1 §3 p5, §10 p12).
  `CLIENT INPUT REQUIRED` — CI-08 (approved unified warranty text + its duration/terms).
  See Conflict C-3.

---

## 13. Commercial terms relevant to implementation — INTERNAL

`SOURCE REQUIREMENT` — D1 §2 (pp14–15), D2 §§2–4 (pp2–4). **INTERNAL — never on the site.**

### 13.1 Implementation price — $550 total, verified arithmetic

| # | Item (D1 §2, p14 / D2 §2, pp2–3) | $ |
|---|---|---|
| 1 | Public platform with its sections, interfaces, visual identity, motion system and user experience in the three languages (D2 wording: "…and its appearance in browsers (SEO)…") | 200 |
| 2 | Catalog, products, packages, agency pages, filters, internal search, pumping guidance tool, WhatsApp integration and inquiry statistics | 150 |
| 3 | Admin dashboard with its main units, roles/permissions, settings and backup | 120 |
| 4 | Architectural preparation for commerce/payment/accounting (designed, not activated) + technical design and documentation package | 50 |
| 5 | Testing, launch gates, dashboard training, live delivery of the platform | 30 |
| | **Total** | **550** |

Arithmetic verified: 200 + 150 + 120 + 50 + 30 = **550**. The total "550" appears 3× in D1
text and 2× in D2 text; the line values 200/150/120/50/30 each appear once in each document.

### 13.2 Payment plan — 4 equal instalments of $137.50

| Instalment | Milestone (D1 §3, p15 / D2 §3, p3 — identical) | $ |
|---|---|---|
| 1st | Contract signing and start of implementation | 137.50 |
| 2nd | Acceptance of Phase 1 (foundation: identity, structure, templates, base pages) | 137.50 |
| 3rd | Acceptance of Phases 2 and 3 (catalog and content in the three languages) | 137.50 |
| 4th | Final acceptance, platform launch, delivery of the documentation package | 137.50 |

Arithmetic verified: 4 × 137.50 = **550**. "137.50" appears 6× in D1 text; in D2 it is
rendered in split presentation form ("137 50") — confirmed by reading the table, 6 occurrences
of the digits.

### 13.3 Domains and hosting — client-paid, outside the $550

| Service | Term | Cost (client pays provider directly) |
|---|---|---|
| Domain 1 — `ghamdan-solar.com` | 3-year registration with a domain registrar | **$41.44** |
| Domain 2 — `ghamdan-energy.com` | 3-year registration with a domain registrar | **$41.44** |
| Cloud hosting at launch | Free tier | **$0.00** |
| Hosting upgrade (Pro) — optional, future, by client decision | $20 / month → $240 / year → $720 / 3 years | $20/mo (optional) |

- **The client chooses ONE domain only** (`ghamdan-solar.com` OR `ghamdan-energy.com`).
  Both domains and hosting are optional external services the client subscribes to or not;
  their costs are on the client directly with their providers and **do not enter the
  implementation price or its instalments** (D2 §4, p3, footnote; D1 §4, p15).
- **Pro periodicity:** D1 states the $20 Pro upgrade without a period (cover p1; §4 p15:
  "$20 — optional future item by client decision"). D2 §4 (p3, footnote) explicitly adopts
  it as **monthly** ($20/mo, $240/yr, $720/3yr) and notes it is optional and outside the
  implementation price. See Conflict C-2 (resolved by the more specific document, D2).
- "41.44" appears 4× in D1 text; in D2 it is rendered split ("41 44") — confirmed by reading.

### 13.4 Offer validity, ownership, confidentiality, change control

- **Validity: 30 days from the issue date** — D1 §1, p14 ("valid for 30 days from its issue
  date"); D2 p1/p4 ("30 days from the issue date — until 8 December 2026"). Issue date
  8 Nov 2026 → **expiry 8 Dec 2026**. After expiry the price is not guaranteed by either
  document. `IMPLEMENTATION DECISION`: do not treat the quoted price as open-ended; flag
  expiry to the client if acceptance slips past 8 Dec 2026.
- **Ownership:** ownership of the platform, its content and its documents transfers to the
  client on completion of payment of its dues; ORTECH's general tools and methodologies remain
  ORTECH's (D1 §12.8, p13; D2 §5, p4).
- **Confidentiality:** both parties keep the other's data and this offer's content confidential
  and do not use it outside the purpose of the potential contract (D1 §12.9; D2 §5).
- **Change requests:** any change to the approved scope is documented in an annex showing its
  price and time effect, approved by both parties before implementation (D1 §12.5, p12;
  D2 §5, p4: any out-of-scope work is priced in a separate independent price annex approved
  before implementation).
- **Acceptance:** acceptance of each phase in writing, or by lapse of the review period agreed
  in the contract without documented material observations; final acceptance on passing the
  §9 launch gates (D1 §12.6, p12).
- **Documentation package** (D1 §12.7, p13 — part of delivery): the complete technical design
  package, delivered with the client's project documents — logical data model and data
  dictionary with its entities, tables, fields and relationships; technical architecture
  diagrams, system components and the integration layer with its documented internal interfaces;
  admin operating guide; and a log of scope and approval decisions issued during implementation.

---

## 14. Client-supplied inputs (as required by the documents)

`SOURCE REQUIREMENT` — D1 §10 (p12), §2 (p4); D2 §1 (p2). Full register with formats, owners
and blocking impact: CLIENT_INPUT_REGISTER.md. Summary:

1. Written approval / signed contract (both documents unsigned in the supplied copies).
2. Approved written product + model lists and final category hierarchy (or a decision to
   postpone a category).
3. Real product images, manufacturer specification files, agency certificates (originals),
   original company logo file.
4. Approved agency list + written representation-status texts + official agency logos.
5. Approved unified warranty text (in writing).
6. Publication permissions for projects/clients (names + images); texts of real testimonials
   if any.
7. Confirmed sales WhatsApp number, official email, displayed working hours, final official
   name/address/contact data.
8. Approved company profile/copy, services, projects, news/events content.
9. Chinese human review arrangement (or approved Chinese text).
10. Domain choice (one of the two) + hosting decision.
11. Approved package components per package.
12. Legal texts (privacy policy, terms of use) — study lists them as sections; no text is
    supplied in either PDF.

---

## 15. Explicit exclusions

`SOURCE REQUIREMENT` — D1 §2 (p4), D2 §1 (p2), §5 (p4). Full list: SCOPE_AND_EXCLUSIONS.md.
Summary: activating any online sale, cart, electronic payment or customer accounts at launch;
producing raw content (product images, specification files, certificates, publication
permissions — supplied by the client; ORTECH's role is wording, organising and publishing);
specialised human translation of the Chinese version outside what is approved in the content
plan (review arranged by the client or by separate agreement); costs of external services
(domain registration, hosting, any third-party service); any change to the client's internal
systems or external accounts.

---

## 16. Conflicts and observations

Full conflict register with sources, impact and status: §17 below and
REQUIREMENTS_TRACEABILITY.md (Status column). Summary:

| # | Conflict / observation | Status |
|---|---|---|
| C-1 | **No brand is named in either PDF.** LM PACK / EFORE / Shenzhen Kexin / Deye / MUST / Jntech etc. appear nowhere in D1 or D2 (verified by normalised search: 0 hits for every brand token; the only Latin tokens are ORTECH, Ghamdan, domains, and generic words). The LM PACK attribution question therefore **cannot be answered from these documents**. | `CLIENT_CONFIRMATION_REQUIRED` — approved brand/agency list (CI-04) |
| C-2 | **Pro hosting periodicity:** D1 states $20 with no period; D2 adopts it as monthly ($20/mo, $240/yr, $720/3yr). | Resolved by the more specific document (D2, prompt §1.2 rule 5). Not a client blocker. |
| C-3 | **Warranty:** the only duration in either document is **3 months of free platform maintenance/support from final acceptance**. No product warranty duration is stated anywhere. The product warranty is an approved unified text the client must supply. | `CLIENT_CONFIRMATION_REQUIRED` — approved warranty text + duration (CI-08). Do not present 3 months as the product warranty. |
| C-4 | **No colour palette / no gold in either PDF.** Neither document names any brand colour, font, or visual identity token. "Gold" appears 0×; the only "colour" hits are the availability rule ("not by colour alone", D1 §3 p5) and the word "mobile" split in presentation form. Visual identity is governed by the 10 reference images (prompt §1.1), not by these PDFs. | `CLIENT_CONFIRMATION_REQUIRED` only if a gold element is proposed — confirm against the reference images / brand board (CI-12). |
| C-5 | **No homepage section order in the study.** D1 defines the 10 sections and the navigation, but no homepage section sequence. The sequence comes from reference image 01 (prompt §5). | Not a conflict — order governed by the reference images. |
| C-6 | **Price-item wording, item 1:** D1 item 1 ($200) mentions "motion system and user experience"; D2 item 1 ($200) mentions "appearance in browsers (SEO)". Same amount, slightly different wording. | Not material — D1 governs scope (prompt §1.1); motion + SEO are both in scope. |
| C-7 | **Admin unit labels:** D1 §5 groups the 9 units with compound labels (e.g. "Projects and Events", "Agencies, Certificates and Clients"); D2/prompt §14 use shorter labels. Count is 9 in all sources. | Not material — same 9 units; use D1's labels in the admin. |
| C-8 | **WhatsApp number / all Ghamdan contact data absent** from both PDFs (only ORTECH's contact appears). | `CLIENT_CONFIRMATION_REQUIRED` (CI-05). Build cannot be completed without it. |
| C-9 | **No product, category, package-component, project, service, news or legal text is supplied** in either PDF — all content is client-supplied. | `CLIENT_CONFIRMATION_REQUIRED` (CI-02, CI-03, CI-06, CI-07, CI-10, CI-11). Templates can be built; no real content can be published without it. |

---

## 17. Document inventory — what was checked

- D1: cover + control table (p1), contents (p2), §1 executive summary (p3), §2 scope/outputs
  (pp3–4), §3 platform sections & catalog (pp4–6), §4 WhatsApp & measurement (pp6–7),
  §5 dashboard (p7), §6 languages (p8), §7 architecture & security (pp8–9),
  §8 future readiness (pp9–10), §9 quality/acceptance (pp10–11), §10 duration & sequence
  (pp11–12), §11 warranty/maintenance (p12), §12 general terms (pp12–13), §2 financial
  letter (p14), price items (p14), payment plan (p15), third-party items (p15), adoption
  block (p16). Contents page matches actual pagination.
- D2: cover + control table (p1), §1 scope summary table (pp1–2), §2 price items (pp2–3),
  §3 payment plan (p3), §4 domains & hosting (p3), §5 offer conditions (p4), adoption block (p4).
- Figures cross-checked: $550 total (200+150+120+50+30); 4 × $137.50 = $550; domains
  2 × $41.44 (3 years each); hosting $0 free / $20 monthly Pro ($240/yr, $720/3yr).
- **Nothing in either PDF was skipped.** No footnotes beyond the D2 §4 Pro footnote and the
  D2 §5 conditions; both are recorded above.
