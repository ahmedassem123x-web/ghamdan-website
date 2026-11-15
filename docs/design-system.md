# Design System — GTS v15 (components per the boards)

**Status:** v15 brand lock · 2026-11-15 · Brand & Tokens agent
**Sources:** Digital Design System boards 129542 (Arabic) + 129543 (English); UI/UX board (129540 q4); Design DNA board (129541). Tokens live in `design-tokens.md` — this file defines **components only**. No `src/` component was modified.

---

## 1. Buttons

| Variant | Fill / border / text | Radius | Font |
|---|---|---|---|
| **Primary** | `#0081FB` fill, white text (board-spec; contrast 3.80:1 — see flag below) | 12 px | 16 px / Semibold |
| **Primary (recommended fill)** | `#0B70C9` fill, white text (5.03:1, passes AA) | 12 px | 16 px / Semibold |
| **Secondary** | White fill, 1.5 px `#102B46` border, navy text | 12 px | 16 px / Semibold |
| **Ghost / Text link** | Transparent, `#0081FB` text + `→` arrow | — | 16 px / Semibold |
| **WhatsApp** | `#1D9E44` fill, white text + WhatsApp glyph | 12 px | 16 px / Semibold |
| **Light-on-dark** | White fill, navy text (on `#102B46` panels) | 999 px pill in boards (e.g. "Learn More →", "Get in Touch →") | 16 px / Semibold |

Board labels: EN "Request a Quote →", "View Details →", "Learn More →", "Chat on WhatsApp", "Submit"; AR "اطلب استشارة ←", "عرض التفاصيل ←", "المزيد ←", "تواصل عبر واتساب", "إرسل الطلب ←". Arrows point in the reading direction (flip in RTL). Heights: buttons read ~48 px in the boards; touch target ≥ 44 px minimum.
**Contrast flag:** board-spec primary fill `#0081FB` + white text is 3.80:1 (below AA 4.5:1 for text). The recommended fill `#0B70C9` (5.03:1) is the documented deviation; the decision is open for Ahmed/implementation — see `design-tokens.md` §4.

### Button states (129543 7-state table; 129542 5-state table — merged)

| State | Appearance |
|---|---|
| Default | Primary fill `#0081FB` (or recommended `#0B70C9`) |
| Hover | One step darker (`#0B70C9` from default `#0081FB`; navy `#102B46` from hover) + subtle lift, 180–250 ms |
| Active | Darkest navy `#102B46` |
| Focus | 2 px `#0081FB` outline + offset — always visible, never removed |
| Disabled | `#E5E7EB` fill, `#6B7280` text, no pointer |
| Loading | Grey fill + spinner + "Loading…" text |
| Error | `#EF4444` outline/text on white (form-level error state) |

## 2. Forms & inputs

- **Text / email / phone / textarea / select:** white fill, 1.5 px `#E5E7EB` border, 12 px radius, 16 px text, ~48 px height; leading icon (person, envelope, phone) in `#6B7280`; placeholder in muted grey; label above the field (Arabic board shows icon + placeholder only — **labels are required for accessibility** and are added, not a board deviation).
- **Focus:** border `#0081FB` + 2 px focus ring.
- **Validation error:** `#EF4444` border + icon; message text in `--color-text` (error red alone fails AA at small sizes — see `design-tokens.md` §4).
- **Success:** `#108981` border/icon + message.
- **Submit:** full-width navy `#102B46` button on forms ("إرسل الطلب →" / "Submit"); the English board shows a blue submit button — navy is the Arabic board's form submit and the darker, AA-passing choice.
- **Search bar:** rounded input with magnifier icon, placeholder "Search products, solutions…" / "ابحث عن منتج أو حل…".
- **Filters (129542):** 2 × 2 dropdown grid — Capacity/Power (القدرة/السعة), System Type (نوع النظام), Availability (التوفر), Usage (الاستخدام) — plus a filter icon button. Only render a filter when it has values for that category (no empty filters).

## 3. Cards

| Variant | Image | Content | CTA |
|---|---|---|---|
| **Product** | 16:10 photo, 16 px radius top | Name (H4), category line, 2-line description, spec chips where verified | Navy pill "View Details →" / "عرض التفاصيل ←" |
| **Solution** | 16:10 photo/illustration | Title, 2-line description | Navy pill "Learn More →" / "اعرف المزيد ←" |
| **Project** | 16:10 photo | Title, 2-line description | Navy pill "View Project →" / "عرض المشروع ←" |
| **Category** | 16:10 photo | Name, product count (real count only) | Text link "View Category →" |
| **Feature** | No image; line icon on sky tint | Title, 1–2 line description | None (static) |
| **Statistic** | No image; big number in navy | Label in muted text | None — **verified numbers only; no invented stats** |

Shared: white surface, 1 px `#E5E7EB` border, 16 px radius, restrained shadow (`--shadow-card`), hover lift 250–400 ms. **No prices anywhere** — no price component exists in this system (standing rule; no public prices in any language, card, metadata or structured data).

## 4. Navigation

- **Desktop header:** white, opaque from scroll 0 (historic C-1: never transparent over white). Logo left (RTL: right) at 40–48 px, nav links 15 px / Semibold navy, language selector (`AR ⌄`), green WhatsApp pill, CTA. Sticky/compact on scroll per the boards' scrolled state.
- **Nav items (129542, RTL order):** الرئيسية · الحلول · المنتجات · المشاريع · الوكالات · الأخبار · تواصل (+ EN: Home · About · Solutions · Products · Projects · Contact).
- **Products mega menu:** 4 columns — Solar Energy Systems (Solar Panels, Lithium Batteries, Lead-Acid Batteries, Inverters, Charge Controllers, Accessories), Water Pumps (Solar Pumps, Submersible Pumps, Surface Pumps, Borehole Pumps, Motors & Drives), Irrigation Systems (Drip Irrigation, Sprinkler Systems, Center Pivot, Filters & Valves, Controllers), Agricultural Machinery (Farm Machines, Spraying Equipment, Mechanical Equipment, Smart Farming). **All Products entry is mandatory** (historic gap). Column headers carry the matching line icon. Links resolve to real categories only.
- **Mobile:** slim header + drawer (phone: no sidebar). Single-column stack, nested categories, ≥ 44 px targets, language switch inside the drawer.
- **Breadcrumbs:** Home › Products › Solar Panels — home icon + `›`, muted except current page (navy, semibold).
- **Tabs:** pill row — active tab solid `#0081FB` white text ("Overview"), inactive transparent muted ("Specifications", "Downloads").
- **Badges & tags:** Featured (blue `#0081FB` pill), New, In Stock (`#108981`), On Request (sky tint, navy text). Badges show real states only.

## 5. Header / footer composition

- **Header:** logo + nav + language + WhatsApp CTA (see §4). No utility bar unless approved.
- **Footer:** white (per the KGE rhythm reference and the boards' light footers) with: logo (120 px), company summary, main links, product/solution links, **verified contact information only**, legal links, copyright. Optional oversized pale wordmark only if it matches the boards and does not impair readability. Social links only if verified. **Dark navy footer variant** (logo tile as-is) is acceptable where the boards show it — the transparent emblem reproduces the tile look on navy, so either asset is correct there.

## 6. Iconography

- One family, one stroke weight (thin line, blue `#0081FB`/navy). Board set: home, sun, bolt, droplet, leaf, tractor, factory, gear, chart, shield, pin, document, cloud, phone, mail, headset, globe, handshake, battery, panel. Live site uses Lucide React (per project report) — keep Lucide; do not mix icon families. No emoji as production icons. Directional icons flip in RTL; logos, product photos and technical diagrams do not mirror.

## 7. States (global)

- **Empty:** what the state is + what to do next (e.g. no approved projects → truthful empty state, never fake projects).
- **Loading:** skeleton, never a blank page.
- **Error:** plain language + what to try; `#EF4444` for icon/border only.
- **Reduced motion:** all animation off; content fully visible.
- **Content visible by default:** animation is progressive enhancement (historic blank-section defect). No `opacity: 0` in initial HTML.

## 8. Motion (summary — full map is the motion agent's doc)

Per v15 §10: GSAP + ScrollTrigger for scroll choreography, Lenis for smooth scroll, Motion for discrete component transitions, Lottie/SVG for technical illustration only, 3D only where justified. Timings: micro 120–180 ms, hover 180–250 ms, card 250–400 ms, reveal 450–800 ms, large 650–1100 ms. One animation owner per element; no competing loops.
