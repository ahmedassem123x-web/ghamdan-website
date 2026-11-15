# Visual Gap Analysis — GTS Website v2 (v15 Phase 4, DRAFT)

**Status:** DRAFT — Phase 4 rebuild record. Built from source reads + PIL pixel
measurements of the hero images (2026-11-15). **No visual verification was done
in Phase 4: the site was not built and no screenshots were captured** (the
coordinator runs the single build after integration). Every "FIXED" below is a
source-level change; visual PASS/FAIL per page belongs to Phase 8.

**Sources:** the 10 reference images as inventoried in
`docs/reference-image-inventory.md`, the corrected M-3 table
(`docs/architecture-decision-record.md` ADR-02), v15 §6/§11/§18, and the
Phase 4 contrast measurements (see §1).

---

## 1. Contrast measurements (PIL, 2026-11-15)

Measured on the actual hero JPEGs (relative luminance, WCAG contrast).
AA threshold for normal text: **4.5:1**.

### 1.1 Home hero — `hero-villa-mountains.jpg` (1600×900), ref-01 black-on-sky

| Zone | Navy `#102B46` | Black `#000` | Verdict |
|---|---|---|---|
| Headline zone, centred x20–80%, y6–30% (median) | **8.80:1** | 12.82:1 | PASS |
| Same zone, p10 (darkest decile) | **5.26:1** | 7.67:1 | PASS |
| Mobile crop, centre x33–67%, y6–30% (median / p10) | 8.93:1 / 6.14:1 | 13.00:1 / 8.94:1 | PASS |
| Copy zone x25–75%, y30–40% (median) | 4.24:1 | 5.09:1 (text `#131C1C`) | **navy FAILS** |
| Whole text block x20–80%, y14–38% (median / p25) | 6.25:1 / 4.22:1 | — | p25 FAILS |

**Consequence (implemented):** the headline alone passes AA on the bare sky,
but the supporting copy extends below the pure-sky zone where navy fails.
The sanctioned fallback is therefore applied: a **white gradient scrim**
(`from-white/90 via-white/60 to-white/0`, top-anchored) behind the text
block — never a navy overlay. Headline colour is token navy `#102B46`
(the ref's "black" headline; no pure-black token exists).

### 1.2 Projects hero — `hero-solar-farm.jpg` (1440×810), ref-05 white-on-photo

| Zone | White `#FFF` | Verdict |
|---|---|---|
| Top-left text zone x0–55%, y5–35% (median) | 2.78:1 | **FAILS bare** |
| Same zone with 60% navy overlay (`#102B46` at 0.6) | **7.32:1** | PASS |

**Consequence (implemented):** the new `full-left` hero variant keeps the
60% navy overlay — it is measured, not blindly reused from M-2's 25%.

### 1.3 Other heroes

Split heroes put text on a white surface (no overlay question). `photo-bg`
variants (used by CTABand photo bands) keep their 60–70% navy overlays;
those were not re-measured in Phase 4 — re-measure in Phase 8 if the
underlying photos change.

---

## 2. Per-page gaps found + fixed in Phase 4

### 01 Home — `src/app/[locale]/page.tsx`

| # | Gap (vs. ref 01 / v15 §6.1) | Fix in Phase 4 | Status |
|---|---|---|---|
| H-1 | Hero was white copy on a 25% navy overlay; ref is a black headline on bright sky, no overlay (ADR-03) | New `Hero darkText` prop: navy headline + dark copy over the sky portion, white gradient scrim (measured fallback, §1.1), no navy overlay; text top-anchored | FIXED (source) |
| H-2 | Hero subject is villa + **mountains**; ref subject is villa + **sea** | NOT fixed by swapping: `hero-villa-sea.jpg` belongs on About (ref 02 is villa + sea). Subject gap recorded; needs a new asset or a client decision | OPEN — asset/decision |
| H-3 | Marquee is navy bg / white text; ref is white bg / black text | Kept navy — open decision D-5, owned by Phase 3. Not changed unilaterally | OPEN — Phase 3 |
| H-4 | Featured-products tiles were generic category labels ("ألواح شمسية عالية الكفاءة" etc.) linking to category pages, not real products | Tiles now render 3 real featured products (one per category: inverters / batteries / pumps) with real names, linking to their product pages | FIXED (source) |
| H-5 | Two generic "project" cards ("مشروع طاقة شمسية" / "مشروع ري زراعي") presented as projects with no genuine project behind them (§6.1 item 15: featured projects ONLY if genuine) | Cards REMOVED, not replaced | FIXED (source) |
| H-6 | No panoramic visual (§6.1 item 12) | Full-width decorative solar-farm photo band added between Why-Us and featured products | FIXED (source) |
| H-7 | No brand/partner preview (§6.1 item 16) | New section: Deye official-agent card + the 5 carried brands as wordmarks with their "brand we carry" status, linking to /agencies | FIXED (source) |
| H-8 | No verified company statistics exist (§6.1 item 7) | Stats block OMITTED (none verified — inventing numbers is prohibited by §3.4) | OMITTED — by rule |
| H-9 | `SolarFieldLineArt` SVG was inline in the page, not a shared component | Extracted to `src/components/SolarLineArt.tsx`; home imports it | FIXED (source) |
| H-10 | Intro/Why-Us headings and grids hid pre-reveal (`.reveal` / `data-stagger`) | Hooks removed; headings inlined visible-by-default (see §5) | FIXED (source) |

### 02 About — `src/app/[locale]/about/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| A-1 | Hero variant unconfirmed in audit (split vs. full-width) | Confirmed in source: `side-left` = image first → text on the physical left, photo right in RTL — matches ref 02 (text left ~55%, photo right ~45%, `hero-villa-sea.jpg`) | CONFIRMED (source; visual check still Phase 8) |
| A-2 | Story split direction | `EditorialBlock flip` = copy first → text right, photo left in RTL — matches ref 02 (story photo left) | CONFIRMED (source) |
| A-3 | `.reveal` / `data-stagger` hiding | Removed from intro, pillars, mission/vision, expertise grids | FIXED (source) |

### 03 Solutions — `src/app/[locale]/solutions/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| S-1 | Hero variant unconfirmed | `side-right` = copy first → text right, photo left in RTL — matches ref 03 (text right, photo left ~55%, villa + ground-mount panels + mountains) | CONFIRMED (source) |
| S-2 | Process steps + CTA band wiring unconfirmed | Present in source: 4-step `workProcess` grid + `CTABand photo-bg` (pivot image) | CONFIRMED (source) |
| S-3 | `SectionHeadingL` / `data-stagger` hiding | Heading inlined; stagger removed | FIXED (source) |

### 04 Products (catalogue) — `src/components/CatalogueClient.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| C-1 | **Hero side wrong:** `variant="split"` put the text on the physical right; ref 04 has text LEFT, photo RIGHT | Changed to `variant="side-left"` (image first → text left in RTL) | FIXED (source) |
| C-2 | **No All-Products entry (ADR-07):** only a `showAll` toggle revealing the featured-12 default; no tab strip | Tab strip implemented (ref 08 pattern): «جميع المنتجات» first/active by default (all 37 published) + 8 GTS categories with published counts; `?cat=` shareable via `replaceState`; zero-count tabs visible with honest empty state; `showAll` toggle + featured-12 default REMOVED; image-tile strip removed (duplicate category navigation) | FIXED (source) |
| C-3 | Unsourced hero phrase «طاقة اليوم لمستقبل أفضل» (`pages.ts:576`, catalog `k1`) | NOT Phase 4's job — removal is Phase 5 (ADR-06). It still renders as the hero eyebrow pill on /products | OPEN — Phase 5 |
| C-4 | Hard-coded `wa.me/967775800000` in the CTA banner (line 216) | NOT Phase 4's job — routing through `waLink()` is Phase 5 (ADR-05). Left untouched | OPEN — Phase 5 |
| C-5 | Grids hid pre-reveal (`data-stagger`) | Removed from product grid + why-us grid | FIXED (source) |

### 05 Projects — `src/app/[locale]/projects/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| P-1 | **Hero was a split hero** (`side-left`, villa-mountains image); ref 05 is FULL-WIDTH, text top-left, ground-level solar farm + mountains | New `Hero` variant `full-left` (full-width photo, text top physical-left, white on 60% navy overlay — measured §1.2) with `hero-solar-farm.jpg` | FIXED (source) |
| P-2 | Implemented `hero-solar-farm.jpg` is **aerial**; ref 05 is **ground-level** | No ground-level hero asset exists — cannot be fixed in code. Recorded; needs a new asset | OPEN — asset |
| P-3 | Empty state hid pre-reveal (shared `EmptyState` injects `.reveal`) | Empty state inlined visible-by-default | FIXED (source) |
| P-4 | Filter pills / carousel / template preview have no real content | Kept as-is: pills filter 4 illustrative photos (caption + note say so), template preview is dashed-border + labelled. No fake projects built | BY DESIGN |

### 06 Product detail — `src/app/[locale]/products/[slug]/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| D-1 | Hero/split composition | Custom grid: Gallery first → photo right, summary left in RTL — matches ref 06 (text left, product photo right) | CONFIRMED (source) |
| D-2 | M-1 single-image gallery | Preserved: `Gallery.tsx` renders one image large at 4:3; thumbnails only for 2+ images (all 37 products have exactly 1 image in data) | PRESERVED |
| D-3 | C-2 spec labels | Preserved: `SpecTable` renders the data's real labels/values; no "—" placeholders, no data-model change | PRESERVED |
| D-4 | **M-4 repeated related imagery (data quality, ADR-08):** only 4 stand-in photos serve 37 products — battery-storage ×16, inverter-unit ×13, pump-flow ×7, controller-unit ×1. Related products on a detail page therefore show the SAME photo as the product itself and each other (e.g. any inverter page: 3 related inverters, all `inverter-unit.jpg`) | NOT fixed in code (ADR-08: no hiding, no invented imagery). Flagged here; needs real client photos (CI-06) | OPEN — client input |
| D-5 | Overview block uses the same `villa-roof.jpg` photo for EVERY product | Flagged (same M-4 family): a generic villa photo stands as the overview visual on all 37 product pages. Not changed — no real product photos exist | OPEN — client input |
| D-6 | Datasheet download («تحميل كتيب المنتج», ref 06) | No datasheet files exist — no button is rendered (correct; CI-06) | BY DESIGN |
| D-7 | `<Reveal>` wrappers hid gallery/summary/specs pre-reveal | Replaced with plain `<div>`s | FIXED (source) |

### 07 Contact — `src/app/[locale]/contact/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| K-1 | Hero variant unconfirmed | `side-right` = copy first → text right, photo left (`house-bright.jpg`) — matches ref 07 | CONFIRMED (source) |
| K-2 | Hard-coded `wa.me` URLs (lines 40, 42, 60) | NOT Phase 4's job — Phase 5 (ADR-05). Left untouched | OPEN — Phase 5 |
| K-3 | `data-stagger` / `SectionHeadingL` hiding | Stagger removed; FAQ heading inlined | FIXED (source) |

### 08 Product category — `src/app/[locale]/products/category/[slug]/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| G-1 | Hero variant unconfirmed | `split` = copy first → text right, photo left in RTL — matches ref 08 | CONFIRMED (source) |
| G-2 | Tab strip existed but had **no counts** (ADR-07: each tab shows its published count) | Counts added: All (37) + each category (`publishedCount`); zero-count tabs stay visible | FIXED (source) |
| G-3 | `data-stagger` hiding on related-categories grid | Removed | FIXED (source) |
| G-4 | Product cards use WhatsApp-outline buttons vs. ref's dark «طلب استشارة» buttons | Kept outline (ProductCard is not a Phase 4 file; the WhatsApp-outline treatment is the live system's card CTA) | NOTED — no change |

### 09 Solution detail (pumping) — `src/app/[locale]/solutions/[slug]/page.tsx`

| # | Gap | Fix | Status |
|---|---|---|---|
| U-1 | Hero variant unconfirmed | `side-right` = text right, photo left (`hero-pump-mountains.jpg`) — matches ref 09 | CONFIRMED (source) |
| U-2 | `SystemDiagram` wiring unconfirmed in audit | CONFIRMED in source: pumping page passes its own 5-node chain (panels → controller → pump → tank → distribution) with caption | CONFIRMED (source) |
| U-3 | Diagram is a flat node chain, not the ref's isometric cross-section with labelled well/tank/distribution | Not rebuilt in Phase 4 (diagram is a schematic; an isometric cross-section is a Phase 6 illustration task). Recorded | OPEN — Phase 6 |
| U-4 | Diagram node icons are emoji/text glyphs (☀ ⚙ ↧ ▮ ⌂) — design-system says no emoji as production icons | Not changed in Phase 4 (SVG `<text>` cannot render Lucide components; needs a diagram redraw). Recorded | OPEN — Phase 6 |
| U-5 | Other four solution areas have no detail content | By design: approved summary + process + CTA only; nothing invented | BY DESIGN |
| U-6 | `<Reveal>` / `SectionHeadingL` / `data-stagger` hiding | Reveal removed; headings inlined; stagger removed | FIXED (source) |

### 10 Project detail — NO ROUTE (deliberate)

Ref 10 is a template only (`ProjectDetailTemplate.tsx`, unwired). No route
was created, no project invented (ADR-04). The template preview on
`/projects` is dashed-border + labelled as a template. Nothing to fix.

### Supporting pages (T11)

| Page | Gap / note | Fix |
|---|---|---|
| Services | `data-stagger` hiding; unused `SectionHeadingL` import | Removed; import dropped |
| Support | Warranty: NO duration claim anywhere (pending client approval, ADR-09) — verified present in source | Kept; `SectionHeadingL` ×2 inlined |
| Guidance | Guidance-only (`guidanceOnly`) — no sizing/recommendation | No change; no reveal hooks present |
| Search | Indexes published items only | No change; no reveal hooks present |
| Downloads | Honest empty state (no files until CI-06) | Empty state inlined (was shared `EmptyState`) |
| News | Honest empty state (0 articles until CI-07) | Empty state inlined (was shared `EmptyState`) |
| Privacy / Terms | Draft-pending legal notice (CI-10) | No change; no reveal hooks present |
| Systems index/detail | Split hero (no ref; follows T6) | `<Reveal>` ×3 removed; stagger removed; unused import dropped |
| Agencies index/detail | Only Deye confirmed official agent; other five are "brands we carry" | No change to wording; `<Reveal>` removed; stagger removed |

---

## 3. Hero decision table (as implemented in Phase 4)

| Ref | Page | Hero type | Variant / image | Overlay / text | Height |
|---|---|---|---|---|---|
| 01 | Home | FULL-WIDTH, centred | `center` + `darkText`, `hero-villa-mountains.jpg` | NO navy overlay; white gradient scrim; navy headline + dark copy | 72vh / 90vh |
| 02 | About | SPLIT, text left / photo right | `side-left`, `hero-villa-sea.jpg` | Text on white surface | auto |
| 03 | Solutions | SPLIT, text right / photo left | `side-right`, `hero-villa-mountains.jpg` | Text on white surface | auto |
| 04 | Products | SPLIT, text left / photo right | `side-left`, `hero-pump-mountains.jpg` | Text on white surface | auto |
| 05 | Projects | FULL-WIDTH, text top physical-left | `full-left` (new), `hero-solar-farm.jpg` | 60% navy overlay, white text (measured §1.2) | auto |
| 06 | Product detail | SPLIT, text left / photo right | Custom grid (Gallery first), per-product image | Text on white surface | auto |
| 07 | Contact | SPLIT, text right / photo left | `side-right`, `house-bright.jpg` | Text on white surface | auto |
| 08 | Category | SPLIT, text right / photo left | `split`, per-category photo | Text on white surface | auto |
| 09 | Solution detail (pumping) | SPLIT, text right / photo left | `side-right`, `hero-pump-mountains.jpg` | Text on white surface | auto |
| 10 | Project detail | FULL-WIDTH | NO ROUTE (template only) | — | — |

RTL note: in the `Hero` split branch the first grid column renders on the
physical right, so `side-left` (image first) puts text on the physical left
and `side-right`/`split` (copy first) puts text on the physical right. This
is why the catalogue hero had to change from `split` to `side-left` (C-1).

---

## 4. Homepage §6.1 section list (as implemented)

1. Header (Phase 3) — untouched.
2. Cinematic full-width hero (`darkText`, ref 01).
3. Headline + concise copy (inside the hero).
4. Main CTA: single navy WhatsApp pill (ref 01 shows one CTA; no secondary CTA — justified by the reference).
5. Large solar/engineering photograph (the hero image itself).
6. Company intro statement + 3 pillars + `SolarLineArt`.
7. Verified stats — **OMITTED** (none verified; §3.4 prohibits invented stats).
8. Fine engineering/solar line-art SVG (`SolarLineArt`, shared component).
9. Expertise marquee (navy bg / white text — ref shows white/black; open D-5, Phase 3).
10. Alternating image/text editorial cards (2×2 `SolutionCardHorizontal`).
11. Light-blue Why Choose GTS + 3 restrained feature cards.
12. Panoramic visual (full-width solar-farm photo band, decorative).
13. Guidance bar (extra vs. ref — kept; home + /products only).
14. Featured products — 3 real featured products, one per category.
15. Featured projects — **OMITTED** (none genuine; §3.4).
16. Brand/partner preview — Deye (official agent) + 5 carried brands.
17. Dark navy closing CTA (`CTABand split` + contact rows).
18. Footer (Phase 3) — untouched.

---

## 5. Blank-before-reveal fix (critical defect)

**Mechanism found:** content hid pre-reveal through two hooks that
`src/lib/motion.tsx` (Phase 6-owned, used as-is) animates with
`gsap.fromTo(..., {opacity: 0...}, scrollTrigger once)`:
- the `.reveal` class — also forced hidden by `html.js .reveal {opacity: 0}`
  in `globals.css` (Phase 3-owned);
- the `data-stagger` attribute (children hidden until their group triggers).

**Removed in Phase 4 (my files only):** every `data-stagger` attribute
(27 occurrences) and every direct `className="reveal …"` (4 occurrences);
every `<Reveal>` wrapper (9 occurrences: product detail ×4, systems detail
×3, solution detail ×1, agency detail ×1) replaced with a plain `<div>`;
every `SectionHeadingL` usage (9 occurrences) replaced with identical
visible-by-default heading markup; every `EmptyState` usage in my pages
(4 occurrences: projects, downloads, news, category client) replaced with
identical visible-by-default markup.

**Residual (NOT fixed — cross-phase):** the shared primitives
`Reveal` / `SectionHeadingL` / `SectionHeading` / `EmptyState` in
`src/components/ui.tsx` (Phase 3-owned) still inject `.reveal`, and
`globals.css` still hides `.reveal` under `html.js`. Any future page using
those primitives reintroduces the defect. **Recommended:** Phase 3 removes
`.reveal` from the four primitives (one-line change each) and the
`html.js .reveal` rule from `globals.css`; Phase 6 then re-adds reveals
only as JS-applied progressive enhancement (add the hiding class in JS
after successful GSAP init, never in initial HTML/CSS). The hero
`.hero__anim` entrance (GSAP `fromTo` on load, 0.5 s) was kept: it is a
load animation, content is visible without JS (no CSS hiding applies to
it), and it is not a scroll-reveal gap.

**Not verified visually:** no build was run in Phase 4 (coordinator owns the
build); the "visible by default" claim is source-level (no hiding hooks
remain in Phase 4 files) and must be confirmed by a full-page capture in
Phase 8, including slow-network and reduced-motion passes.

## 6. Token migration (T-1) — Phase 3 re-tokenisation, Phase 4 migration

**Trigger:** during Phase 4, the parallel Phase 3 agent rewrote
`src/app/globals.css` (v15 FINAL tokens, `docs/component-library.md` §9):
canonical names now carry board values — `text-primary` / `bg-primary`
= bright blue `#0081FB` (was navy `#102B46`); `text-accent` /
`bg-accent` = light cyan `#89E9F8` (was bright blue `#1E8FE8`); `bg-sky`
= `#DDF5FC` (was `#B2D3F0`). The deprecated aliases were kept
(`primary-deep`, `accent-soft`, `surface-blue`, `text-faint`, `danger`,
`success-dot`, `link`) so alias-named classes still render — but nothing
can alias the canonical names. Left unmigrated, every Phase 4 page would
have rendered bright-blue headings / bands / buttons instead of navy.

**Scope conflict recorded:** the Phase 4 brief did not list the
migration, and forbids touching `globals.css`; `component-library.md`
§9 explicitly assigns it to Phase 4 ("Phase 4 must migrate every
remaining `text-primary` → `text-navy` … and then delete the aliases").
The migration was done because the brief's own rule — use only the
canonical tokens from `design-tokens.md` — requires it, and without it
the ADR-03 home-hero fix (navy headline) would have rendered bright
blue. `globals.css` itself was NOT touched (aliases stay — see residual).

**Mapping applied (Phase 4 files only, 32 files):**

| Old class | New class | Notes |
|---|---|---|
| `text-primary` | `text-navy` | 139 — headings, labels, breadcrumbs |
| `bg-primary` | `bg-navy` | 36 — buttons, bands, marquee, active tabs |
| `bg-primary-deep` / `from-primary-deep` / `via-primary-deep` | `bg-navy` / `from-navy` / `via-navy` | 20 — incl. gradient overlays |
| `text-accent` / `text-accent-strong` | `text-primary-hover` (`#0B70C9`, AA 5.03:1) | 83 — links, icons |
| `bg-accent` | `bg-primary-hover` | 6 — step arrows, active dot, underline bar (white on `#0B70C9` = 5.03:1) |
| `bg-accent-soft` / `bg-surface-blue` / `bg-sky-light` | `bg-sky` | 60 — light-blue bands, icon tiles |
| `border-accent` / `outline-accent` | `border-primary-hover` / `outline-primary-hover` | 12 |
| `text-text-faint` / `bg-text-faint` | `text-text-muted` / `bg-text-muted` | 10 |
| `text-danger` / `border-danger` / `bg-danger` | `text-error` / `border-error` / `bg-error` | 10 |
| `bg-success-dot` | `bg-success` | 2 |
| `bg-bg` | `bg-background` | 5 |
| `text-sky` | `text-primary` | 8 — large decorative numerals/initials; old sky `#B2D3F0` was already pale, new sky `#DDF5FC` would be invisible on white |
| `hover:bg-sky` | `hover:bg-primary` | 1 — pagination dot hover only (text chips keep `hover:bg-sky` + `hover:text-primary-hover`) |
| `font-extrabold` on `<h1>` | `font-bold` | token table: H1 Bold |
| `font-extrabold` on `<h2>`–`<h4>` | `font-semibold` | token table: H2–H4 Semibold; 78 headings changed. 14 remaining `font-extrabold` are non-headings (display numerals, marquee words, captions) — left as-is |

**Incident + repair (own goal, fixed):** the heading-weight script
dropped the closing `>` on all 78 `<h1>`–`<h4>` opening tags
(`tsc` then failed on `SearchClient.tsx` first). Repaired with a
tag parser that re-inserted the missing `>` (78/78 fixed, verified by
count); final `npx tsc --noEmit --incremental false` → **exit 0, no
errors**. No old-class tokens remain in Phase 4 files (grep-verified,
0 leftovers; `border-sky` kept intentionally — canonical token, light
notice-box border).

**Residual (NOT Phase 4 — coordinator / Phase 3):**
- `ProductCard.tsx` and `ProjectDetailTemplate.tsx` still use old
  classes — they are outside Phase 4 ownership and were NOT migrated.
  Until they are, the deprecated aliases in `globals.css` must NOT be
  deleted (Phase 3's "then delete the aliases" step is blocked on
  those two files + any other unowned file).
- The `bg-primary` → `bg-navy` mapping keeps buttons navy; the
  design-system's recommended primary-button fill is `#0B70C9`
  (`bg-primary-hover`) — a button-colour decision for the coordinator,
  not unilaterally changed in Phase 4.
- Visual confirmation of the migrated colours belongs to Phase 8
  (no build / no screenshots in Phase 4).
