# SCOPE AND EXCLUSIONS — Ghamdan Solar Platform (Phase 0)

> **Sources:** D1 = Technical & Financial Study v1.0, 8 Nov 2026 (`incoming/references/ref-2.pdf`,
> 16 pp). D2 = Price Quotation (`incoming/references/ref-1.pdf`, 4 pp).
> Governing prompt: `Ghamdan_Master_Execution_Prompt_v2_3_zpxp.md` v2.0, §§1, 3, 15, 21.
> Labels (prompt §1.3): `SOURCE REQUIREMENT` · `APPROVED DECISION` · `IMPLEMENTATION DECISION` ·
> `RECOMMENDATION` · `CLIENT INPUT REQUIRED` · `OUT OF SCOPE`.
> Commercial figures are INTERNAL — never on the public site.

---

## 1. In scope — contracted

### 1.1 Public platform (D1 §3; D2 §1)

`SOURCE REQUIREMENT` — the 10 main sections, in the study's order:
Home, About, Products, Services, Projects, Support and Warranty, News and Events, Contact,
Agencies, Legal Pages (privacy policy, terms of use, error page).

Unified navigation: thin top contact bar; sticky header compacting on scroll; full slide-in
mobile menu; four-column footer; floating WhatsApp button on every page, becoming a full-width
bottom bar carrying the product name inside product pages.
Binding rule: any section reachable in **at most 2 steps from mobile**; every page ends with
**one clear next step**.

Supporting templates (D1 §§3–4, 6, 12; prompt §4.2): catalog, product category, product
detail, ready-made system listing + detail, agency listing + detail, services listing/detail,
projects listing + detail, support, warranty, downloads centre, news listing + article detail,
events archive/detail, contact, search results, privacy policy, terms of use, 404/error states.

Visual composition of the 10 reference pages is governed by the 10 reference images
(prompt §5); the study defines the sections and behaviour, the images define the appearance.

### 1.2 Catalog, products, packages, agencies (D1 §3)

`SOURCE REQUIREMENT`
- Category tree (main by product type, sub by families/models) **as finally approved from the
  client's written lists**; brand is a browse filter inside categories, not the classification basis.
- Unified filters in every category: brand; power/capacity ranges; system type (hybrid,
  off-grid, on-grid, single-phase, three-phase, low-voltage, high-voltage); usage (home, farm,
  shop/office, commercial facility, factory, irrigation/wells); availability (text, not colour
  alone). Default sort most-requested then newest; result count; shareable/indexable filter links.
- Unified product card (one real image on a clean background, full name, brand, one benefit
  line, exactly 3 key specs, availability as text, WhatsApp + Details buttons; no price field).
- Unified product page (10 components in the study's order — see DOCUMENT_ANALYSIS.md §4.2),
  including the complete manufacturer spec table without abbreviating or altering values.
- 4 ready-made packages (Basic Home; Extended Home; Large Home / Small Facility; Farm and
  Pumping) on unified templates, components as approved in writing; no price, no saving/discount
  claim without written approval.
- Agency pages for agencies approved in writing, proving representation status, showing product
  families/files/certificates, linking to their products; official logos used as supplied,
  uniform sizes, no redrawing/recolouring.
- Content-approval states (§4.5 of DOCUMENT_ANALYSIS.md): nothing fictional published, no
  empty category opened, no incomplete placeholder shown to the visitor.

### 1.3 WhatsApp (D1 §4)

`SOURCE REQUIREMENT` — sole sales/inquiry channel at launch; one unified number from admin
settings, identical everywhere; floating button + mobile bottom bar on product/package pages;
prepared messages in the click-source page's language naming product/package/request type;
short forms (maintenance request, facility system-study request, contact message, guidance
tools) send output directly to WhatsApp; pumping guidance tool (well depth, daily water
quantity, type of use) + guidance bar on home and products gateway; instant internal search
in 3 languages with mini-card suggestions; inquiry-click analytics by source/time/language
with periodic dashboard reports (most-inquired products/packages, most-used categories,
internal search operations and results), privacy-respecting.

### 1.4 Admin dashboard (D1 §5)

`SOURCE REQUIREMENT` — one dashboard, 3 languages, mobile + computer, managing the whole site
from a single data source; the 9 units: (1) Products and Catalog, (2) Packages and Ready-made
Systems, (3) Projects and Events, (4) News and Articles, (5) Agencies, Certificates and Clients,
(6) Services and Support, (7) Statistics and Reports, (8) Site Settings, (9) Users and Roles.
Roles/permissions, operations (audit) log, publication gates per §4.5, single-source contact
and warranty data.

### 1.5 Languages (D1 §6)

`SOURCE REQUIREMENT` — Arabic first (RTL, reference version), English, Simplified Chinese;
each edited independently, no instant machine translation; switcher preserves the same page;
model/brand names and technical units never translated; Chinese reviewed by a competent human
before launch; per-language search titles/descriptions, sitemaps and hreflang; approved unified
terminology across the three versions.

### 1.6 Architecture, security, SEO, performance (D1 §§7, 9)

`SOURCE REQUIREMENT`
- Presentation layer (fast, mobile-optimised, modern compressed image formats in multiple
  sizes); application + relational DB with documented internal APIs; single external
  integration layer; independent modules with activation keys; fixed unchanging product IDs.
- HTTPS everywhere; admin roles/permissions + operations log; integration secrets in a secure
  vault outside the code; periodic backup of content + DB with documented restore; form
  abuse protection; no payment data, no visitor accounts.
- SEO: automatic per-language sitemaps; routing file protecting the dashboard; structured data
  for products, projects, FAQs and the organisation; manually written search titles/descriptions
  for main pages in 3 languages; short stable URLs without dates/internal numbers.
- Performance (binding): first-visual image compressed and loaded first, rest lazy-loaded;
  no heavy sliders at the top of pages; skeleton loading; calm motion in one documented system,
  auto-reduced for reduced-motion users, never delaying first content; full RTL mastery;
  contrast, alt text in the platform's languages, logical heading order, visible keyboard focus;
  single reused components (product card, article template, project template, WhatsApp bar).

### 1.7 Future readiness — architecture only (D1 §8)

`SOURCE REQUIREMENT` — reserved places/relationships/keys for store, cart, checkout, customer
account; designed (not operating) entities: customer, order + items, invoice, stock movement,
accounting entry; optional internal disabled fields (internal price, cost, stock, accounting
code) unreachable by display templates; extendable roles (store manager, accountant,
storekeeper). **All disabled and invisible at launch**; activation only by the 5-step
governance in D1 §8 (written client decision → independent project → external approvals →
test environment → gradual launch with rollback, WhatsApp as working alternative throughout).

### 1.8 Delivery, training, documentation (D1 §§9–12)

`SOURCE REQUIREMENT` — 4 phases over 4 weeks from client delivery of materials (Phase 1
foundation; Phase 2 catalog/products; Phase 3 content/support; Phase 4 launch); the 8 launch
gates all passed together before publication; delivery by written final acceptance; client
team trained on the dashboard; documentation package delivered (logical data model + data
dictionary, architecture diagrams + integration layer with documented internal APIs, admin
operating guide, scope/approval decision log). Free maintenance/support for 3 months from
final acceptance (platform defects within scope).

---

## 2. Out of scope — explicitly excluded at launch

`OUT OF SCOPE` — D1 §2 (p4), D2 §1 (p2) and §5 (p4); prompt §§3.1, 15.3.

| # | Excluded item | Source |
|---|---|---|
| E-01 | Activating any online sale, cart, checkout, electronic payment, or customer accounts at launch. These are architecturally prepared only; activation is a separate later project. | D1 §2 p4, §8; D2 §1 p2 |
| E-02 | Producing raw content: product images, specification files, certificates, publication permissions. Supplied by the client; ORTECH's role is wording, organising and publishing them. | D1 §2 p4; D2 §1 p2 |
| E-03 | Specialised human translation of the Chinese version outside what is approved in the content plan. Chinese review is arranged by the client or by separate agreement. | D1 §2 p4, §6 p8; D2 §1 p2 |
| E-04 | Costs of external services: domain registration, hosting, any third-party service. Shown in D1 §4 / D2 §4 at the client's cost with their providers; outside the $550. | D1 §2 p4, §4 p15; D2 §4 p3 |
| E-05 | Any change to the client's internal systems or external accounts. | D1 §2 p4 |
| E-06 | Naming any payment provider inside the platform before its agreement is signed; confirming any payment by customer screenshot; storing card data or wallet balances. | D1 §8 p9 |
| E-07 | Publishing any price — product, package, approximate or promotional — in the presentation layer, including price fields, price components, price metadata or price-bearing structured data. | D1 §1 p3, §3 p5; prompt §3.1 |
| E-08 | Any work outside the approved scope: priced in a separate independent price annex, approved by both parties before implementation. | D1 §12.5 p12; D2 §5 p4 |

---

## 3. Conditional / gated — in scope only when the condition is met

| # | Item | Condition (source) |
|---|---|---|
| G-01 | Publishing a product | Image real + specifications confirmed + client approval state complete (D1 §3 p6, §5 p7). Until then: hidden / prepared in structure only. |
| G-02 | Opening a category | Client's written list for it received (D1 §3 p5). Until then: exists in plan/structure only, hidden. |
| G-03 | Listing a brand as a Ghamdan agency | Client's written approved agency list + representation text (D1 §3 p6). |
| G-04 | Any package price / saving / discount claim | Client's written approval (D1 §3 p5). Default: none. |
| G-05 | Publishing the Chinese version | Human review by a reviewer competent in energy/equipment terminology (D1 §6 p8). |
| G-06 | Publishing any statement about the company/products | An approved source from the client (D1 §1 p3: "no statement … except with a source approved by the client"). |
| G-07 | Publishing a project / client name / image / testimonial | Client's written publication permission (D1 §10 p12). |
| G-08 | Activating commerce / payment / accounting | Written client decision + independent project + external approvals + test environment + gradual launch (D1 §8 p10). |
| G-09 | Any product warranty statement | Approved unified warranty text supplied in writing (D1 §3 p5, §10 p12). |
| G-10 | Phase acceptance | Written client acceptance, or lapse of the contract-agreed review period without documented material observations (D1 §12.6 p12). |

---

## 4. Scope risks and notes

1. **The study defines behaviour, not content.** No product, category, package component,
   project, service, news item or legal text is supplied in either PDF. The build can deliver
   templates and structure, but every publishable content item is gated on client input
   (CLIENT_INPUT_REGISTER.md). Do not fill gaps with invented content.
2. **No brand is named in either PDF** (see DOCUMENT_ANALYSIS.md §16, C-1). The category
   tree, agency pages and brand filters cannot be populated until the approved brand/agency
   list arrives.
3. **No Ghamdan contact data in either PDF** (C-8). The top bar, footer, contact page and
   every WhatsApp button depend on CI-05.
4. **No visual identity tokens in either PDF** (C-4). Colours/fonts come from the 10 reference
   images (prompt §§1.1, 6), not from the study or quotation.
5. **Offer validity expires 8 Dec 2026** (30 days from 8 Nov 2026). If acceptance slips past
   that date, the $550 price is not guaranteed by either document — flag to the client.
6. **Duration clock has not started.** The 4 weeks run from the client's delivery of the
   requirements/materials (D1 §10), and external-party waiting time is outside the duration.
   No start date is recorded in the supplied documents.
7. **Price-item wording differs slightly between D1 and D2 item 1** (motion system vs SEO
   wording, same $200). D1 governs scope; both motion and SEO are in scope (C-6, not material).
