# GHAMDAN (GTS) WEBSITE REBUILD — BUILD SPEC v2

**File:** `~/workspace/ghamdan-website-v2/BUILD_SPEC.md`
**Date:** 2026-11-14
**Author role:** reference-study specialist (spec only — no code, no images generated)
**Status:** SPEC — the builder implements exactly this document. Nothing in this spec is a build artefact.

## 0. Authority, scope, and how to read this spec

### 0.1 Sources (all read before writing; in authority order)

| # | Source | What it governs |
|---|---|---|
| 1 | `~/workspace/ghamdan-website/incoming/prompt/Ghamdan_Master_Execution_Prompt_v2_3_zpxp.md` (v2.0, 1571 lines) | Contractual scope, business rules, 10-page reconstruction duty, WhatsApp rules, i18n, admin units, release gates |
| 2 | `~/workspace/ghamdan-website/docs/` — `REFERENCE_IMAGE_ANALYSIS.md`, `DESIGN_DNA.md`, `DESIGN_SYSTEM.md`, `REFERENCE_PAGE_SECTION_MAP.md`, `REFERENCE_COMPONENT_MAP.md`, `MOTION_SYSTEM.md`, `COMPONENT_LIBRARY.md`, `SITE_MAP.md`, `REQUIREMENTS_TRACEABILITY.md`, `CLIENT_INPUT_REGISTER.md` (CI-01–CI-17), `PHOTO_CREDITS.md` | Visual truth, component map, open inputs |
| 3 | The 10 reference images `~/workspace/ghamdan-website/incoming/extracted/ui-reference-01-home.jpg` … `ui-reference-10-project-detail.jpg` (1440×2560 each) — **each viewed individually at full resolution** | Design authority for composition, section order, hero variant, card counts, grids |
| 4 | Old build `~/workspace/ghamdan-website/` (75 static pages, `assets/js/data.js`, `assets/js/settings.js`, `admin/index.html`) — **reference for data scope only; DO NOT copy its code, DO NOT reuse its files, DO NOT fix it** | Catalogue data (8 categories, 37 published products, 4 bundles, 6 agencies), settings values, admin-demo scope |
| 5 | Skills: `site-replica-study`, `frontend-design`, `no-slop-ui` | Method. Where no-slop-ui conflicts with the reference design system, **the reference design system wins** (per task instruction). No-slop-ui applies only where the design system is silent. |

### 0.2 Stack decision (supersedes prompt §15 for this rebuild)

- **Stack: Next.js (App Router) + TypeScript + Tailwind CSS + GSAP 3 + ScrollTrigger + Lenis.** No Vite (the old build's Vite step left all 6 JS files 404 on Vercel and broke the burger/language/WhatsApp — the new build must have zero build-step JS that can 404: ship JS as part of the Next.js bundle, verify every JS/CSS asset returns 200 on the live URL).
- **Conflict note:** master prompt §15 specifies Laravel + Blade + Alpine.js + Filament and forbids Next.js. That instruction is **superseded for v2 by Ahmed's explicit rebuild order of 2026-11-14** ("wipe the old site from the repo permanently and rebuild from scratch, replace Laravel with Next.js"). Recorded as decision **D-STACK**. The Filament admin is deferred to a later track (§6 of this spec is a front-end demo only).
- **Data:** single source file `src/data/catalog.ts` (migrated from old `data.js`: 8 categories, 37 published products, 4 bundles, 6 agencies — see §3.4/§3.8). No database in v2. No CMS. No backend.
- **i18n:** route-prefixed locales `/ar` (default, RTL), `/en`, `/zh` (LTR). One dictionary file per locale; model/brand/unit strings are NEVER translated. Chinese content is flagged unreviewed (CI-09) — see §7.7.
- **Images:** `public/images/photos/` (the 12 existing photos, copied from the old build — see §0.5) and `public/images/heroes/` (3 AI-generated heroes — see §0.6).

### 0.3 Hard rules (violation = build failure; testable in QA)

1. **NO PRICES anywhere.** No price field, no price component, no `$`/currency amount, no discount/savings claim, in any page, API response, metadata, structured data, sitemap, or WhatsApp message. The ONLY permitted price wording, verbatim, is: AR «يُتفق على السعر والتوفر مع فريق المبيعات» / EN "Price and availability are agreed with the sales team" / ZH «价格与供货请与销售团队确认». A full price-scan (grep for `$`, `ر.س`, `USD`, digits adjacent to currency words) must return zero hits outside this sentence and the internal docs.
2. **Arabic-first RTL.** AR is the default locale and the reference for every page. EN/ZH mirror the same architecture and routes.
3. **WhatsApp-first.** One configurable number, single source: `967775800000` → `https://wa.me/967775800000`. Display `+967 775 800 000`. Never hard-code the number in a template; import it from settings. Every CTA opens a prepared message in the current page language (§2.5).
4. **Contact (only approved values):** phone `+967-775800000`, e-mail `info@ghamdan-trd.com`, address «شارع صخر، أمام نور اليمن مول، صنعاء، اليمن» / "Sakhr St, front of Noor Yemen Mall, Sana'a, Yemen", hours «السبت – الجمعة: 8 صباحاً – 8 مساءً» / "Sat – Fri: 8:00 – 20:00", Facebook `https://www.facebook.com/GTSYemen`, Instagram `https://www.instagram.com/gtsyemen1`. **Do NOT use** any LinkedIn/YouTube URL (the old build links generic `linkedin.com` / `youtube.com` — unverified; omit those icons until confirmed, O-SOCIAL).
5. **Logo: typographic wordmark ONLY (CI-17).** «غمدان» in Tajawal ExtraBold + red dot `#E10600` + `GHAMDAN · GTS` in Montserrat. The old GTS logo is FORGOTTEN — it must appear nowhere (not in header, footer, admin, favicon, or metadata). Favicon = SVG with «غ» in navy on white. When a new logo file arrives, it swaps in at one place only (`components/Wordmark.tsx`).
6. **Sample data is NEVER real content.** The references show FOUR different sample brands — Solfold / سولفولد (01, 02), آفاق الطاقة (03), Sunfold / صن فولد (04, 05, 07, 08, 09, 10), «الشركة» (06) — with sample Saudi contacts (`info@example.com`, `info@sunfold.com`, `+966 11 123 4567`, `+966 11 234 5678`, `+966 11 456 7890`, الرياض). **None of that may appear in the build.** Replace every instance with Ghamdan data (§0.3.4). Reference headlines/copy are SAMPLE copy: use them as layout copy keys only (flagged SAMPLE in §3), never as verified Ghamdan claims. **LM PACK is Shenzhen Kexin, NOT EFORE** — wherever the old `data.js` attributes LM PACK to EFORE, correct it to Kexin.
7. **No invented facts.** No founded year, no project count, no client count, no capacity (kW/kWp), no location, no date, no outcome figure, no testimonial, no certificate, no warranty duration, no "exclusive agent" claim — unless client-approved (CI-02/03/04/06/07/08). Missing value = absent or honest empty state, never guessed, never a dash presented as data (the reference 06 spec table shows "—" for every value: in the build, a missing spec row is OMITTED, not shown with "—").
8. **No commerce at launch.** No cart, checkout, payment, customer accounts, or public pricing. No commerce UI, routes, or API endpoints. (Future hooks are data-model only, invisible.)
9. **Content must be visible without JS** (§5). No content may depend on JS to appear. No horizontal overflow at any width. No `console.error` on any page.

### 0.4 Verified facts about the v2 workspace (checked 2026-11-14, before writing)

- `~/workspace/ghamdan-website-v2/` exists but is **EMPTY**: `docs/`, `public/images/`, `src/data/` contain no files. There is **no** `public/images/heroes/` directory and **none** of the three AI heroes exists yet — contrary to the task brief's assumption. The builder (or the image-generation step) must create them; see §0.6 and open item O-HERO.
- The old build's photo library is 12 files in `~/workspace/ghamdan-website/assets/img/photos/` (see §0.5). All are openly-licensed stand-ins (see `PHOTO_CREDITS.md`), NOT Ghamdan's real photos.
- Old build catalogue (from `assets/js/data.js`, verified by grep): 8 categories (`inverters`, `batteries`, `panels`, `pumps`, `controllers`, `systems`, `storage-ci`, `cameras`), 39 products (37 published: `p01`–`p29`, `p31`–`p38`; `p30` Hanwha Q-Cells and `p39` Wisenet are `awaiting_client_list` and have NO pages), 4 bundles (`bundle-1` small home Deye 6kW + Deye SE-F5 Pro-C 5kWh; `bundle-2` medium home Deye 6kW + EFORE 10kWh; `bundle-3` large home/commercial Deye 8kW + 16kWh battery — brand unconfirmed; `bundle-4` Ramadan, archived), 6 agencies (Deye — official agent in Yemen, confirmed; EFORE, MUST, Jntech, Hanwha Q-Cells, Wisenet — shown pending confirmation).

### 0.5 Photo library (the 12 existing photos — copy to `public/images/photos/`)

These are the ONLY photos the builder may use for non-hero slots. All are stand-ins pending real client photos (CI-06); every product page carries the caption «صورة توضيحية لنوع المنتج — صورة المنتج الحقيقية قيد الاستلام». No people, no brand logos, no watermarks in any of them.

| File | Subject (verified) | Primary use |
|---|---|---|
| `villa-roof.jpg` | House roof with solar panels, bright | Home/about/solutions editorial, rooftop-PV rows |
| `villa-sky.jpg` | Rooftop panels against sky | About/system heroes (fallback), why-us band background |
| `house-bright.jpg` | Bright house + solar field | Contact hero |
| `panels-rows.jpg` | Rows of ground solar panels, bright | Catalogue/category heroes, CTA bands, generic solar |
| `solar-farm.jpg` | Solar power plant, wide | Solutions/projects heroes, commercial rows, CTA bands |
| `pump-flow.jpg` | Solar water pump + well, water flowing | Pumping (all pages), guidance hero |
| `inverter-unit.jpg` | Solar-park inverter unit | Inverter category/product visual |
| `battery-storage.jpg` | Industrial battery storage system | Battery/storage category/product visual |
| `controller-unit.jpg` | Solar charge controller | Controller category/product visual |
| `pivot.jpg` | Centre-pivot irrigation rig, green field | Irrigation/pumping solution cards, CTA banner |
| `greenhouse.jpg` | Drip-irrigated vegetable field (filename is a leftover — it is NOT a greenhouse) | Irrigation/agriculture cards |
| `crops.jpg` | Green crop rows (filename is a leftover) | Agriculture cards |

Rules: never crop a photo so its subject is unrecognisable; never use a photo whose subject contradicts its label (e.g. do not label `greenhouse.jpg` "greenhouse" — label it by what it shows: drip-irrigated field); never reuse the same photo twice on one page except the deliberate hero/CTA echo noted in §3; all photos served as WebP/AVIF derivatives + JPEG fallback, `loading="lazy"` except the hero (`fetchpriority="high"`).

### 0.6 The three AI-generated heroes (DO NOT EXIST YET — must be generated)

Per Ahmed's standing rule, the three missing hero subjects must be **AI-generated to match the references exactly** (not licensed stock). Target paths (create the directory):

| File | Subject — match this reference exactly | Used on |
|---|---|---|
| `public/images/heroes/hero-villa-sea.jpg` | Modern white villa, rooftop solar panels, **sea in the distance**, pale blue sky, bright daylight, no people, no text, no logos. Reference 02 hero. | 01 Home hero, 02 About hero (different crop/focal point) |
| `public/images/heroes/hero-villa-mountains.jpg` | Modern white villa + ground solar array, **mountains behind**, pale blue sky, bright daylight, no people, no text, no logos. Reference 03 hero. | 03 Solutions hero, 05 Projects hero, 10 Project-detail hero |
| `public/images/heroes/hero-pump-mountains.jpg` | Ground solar panels + blue submersible-pump pipe **gushing water** into a basin, **mountains behind**, green field, bright daylight, no people, no text, no logos. Reference 04 hero. | 04 Catalogue split hero, 09 Solution-detail hero |

Generation spec: landscape 2400×1350 minimum (16:9, cropped by CSS to hero ratio), bright high-key daylight, blue sky occupying the top ~40% (hero text sits over sky), saturated blue panels / green field, photorealistic, no people, no animals, no text, no watermark, no brand mark. If generation fails or is unavailable, the fallback is the photo named in each §3 image assignment — and the fallback MUST be recorded as a deviation in the QA report, not silently accepted. **Open item O-HERO (blocking for exact-match heroes).**

### 0.7 Copy-key convention

- Every user-visible string lives in `src/i18n/{ar,en,zh}.json` under a dotted key (e.g. `home.hero.title`). Components reference keys, never inline strings.
- **AR strings in §3 are quoted verbatim from the reference images** and are marked `SAMPLE` — they define layout/line-breaks, not approved Ghamdan copy. Approved copy replaces them when CI-07/CI-09 lands; the key stays the same.
- **EN strings in §3 are drafts** (translated from the AR sample for layout purposes). They are NOT approved EN copy.
- **ZH: no ZH string is given in this spec.** ZH values are `CI-09 PENDING` — the builder must ship ZH pages with the AR original shown plus the banner «中文内容正在审核 — 以下显示阿拉伯语原文» (as the old build did) and must NOT ship machine-translated ZH technical copy. ZH pages are unpublished until a competent human reviewer signs off.
- Brand/model names and units (Deye, SUN-SG04LP1, kW, kWh, V, IP65) are identical in all three locales.

### 0.8 Route map (Next.js App Router, `[locale]` prefix)

| Route | Template | Reference |
|---|---|---|
| `/[locale]/` | Home | 01 |
| `/[locale]/about` | About | 02 |
| `/[locale]/solutions` | Solutions overview | 03 |
| `/[locale]/solutions/[slug]` | Solution detail | 09 (pumping = `solar-water-pumping`) |
| `/[locale]/products` | Catalogue | 04 |
| `/[locale]/products/category/[slug]` | Product category (8 slugs, §3.8) | 08 |
| `/[locale]/products/[slug]` | Product detail (37 published) | 06 |
| `/[locale]/systems` | Ready-made systems listing | — (§4) |
| `/[locale]/systems/[slug]` | System detail (`bundle-1`…`bundle-3` published; `bundle-4` archived, listed as past only) | — (§4) |
| `/[locale]/projects` | Projects listing | 05 |
| `/[locale]/projects/[slug]` | Project detail | 10 (template only — no real project published, §3.5) |
| `/[locale]/services` | Services | — (§4) |
| `/[locale]/support` | Support & warranty | — (§4) |
| `/[locale]/news` | News & events | — (§4) |
| `/[locale]/news/[slug]` | Article detail | — (§4) |
| `/[locale]/agencies` | Agencies listing | — (§4) |
| `/[locale]/agencies/[slug]` | Agency detail (6) | — (§4) |
| `/[locale]/downloads` | Downloads centre | — (§4) |
| `/[locale]/guidance` | Pumping guidance tool | — (§4) |
| `/[locale]/search` | Search results | — (§4) |
| `/[locale]/contact` | Contact | 07 |
| `/[locale]/privacy`, `/[locale]/terms` | Legal | — (§4) |
| `/[locale]/admin` | Admin demo (§6) | — |
| `/*` unknown | 404 | — (§4) |

Trailing-slash and locale rules: `/` redirects to `/ar`; unknown locale redirects to `/ar`; language switch preserves the current page (same slug in the other locale) or falls back to that locale's home with no broken URL. `hreflang` alternates on every page. Sitemap per locale. `robots.txt` disallows `/admin`.

---

## 1. Global design tokens (summary — full authority: `DESIGN_SYSTEM.md` + `DESIGN_DNA.md`)

Do NOT re-derive the palette. Implement these tokens as CSS variables (Tailwind theme extension) in ONE file (`src/app/globals.css` or `src/styles/tokens.css`). No hard-coded colour/spacing value outside the token file (except `@font-face`). If a value is needed that is not listed here, add it to the token file and note it — do not scatter literals.

### 1.1 Colour

| Token | Value | Confidence / note |
|---|---|---|
| `--color-bg` | `#F4F7FA` | sampled range `#F0F7FA`–`#F6F9FB` — page background |
| `--color-surface` | `#FFFFFF` | sampled — cards, solid header |
| `--color-surface-muted` | `#EEF3F7` | estimate — light-grey panels, spec table, form side panel |
| `--color-surface-blue` | `#EAF3FC` | estimate — pale sky-blue band (why-us, challenges) |
| `--color-border` | `#E5EAF0` | estimate — card/divider hairline |
| `--color-border-strong` | `#D5DEE8` | estimate — inputs, selects |
| `--color-primary` | `#0F2E4D` | sampled cluster — dark navy: primary buttons, CTA band |
| `--color-primary-deep` | `#0A2540` | sampled — darkest navy |
| `--color-primary-ink` | `#163049` | sampled — CTA band median |
| `--color-accent` | `#1E8FE8` | estimate — bright blue: icons, links, active states |
| `--color-accent-strong` | `#1577C8` | estimate — accent hover |
| `--color-accent-soft` | `#E8F2FC` | estimate — pale-blue fill: icon circles, pills, active tabs |
| `--color-sky` | `#B2D3F0` | sampled — hero sky / pale blue areas |
| `--color-sky-light` | `#D5F0FB` | sampled — lightest sky |
| `--color-whatsapp` | `#1D9E44` | sampled (image 03 only) — green WhatsApp button; use ONLY where the reference uses green (03 header, 09 CTA icon). All other WhatsApp buttons are navy. |
| `--color-success-dot` | `#22A355` | estimate — green dot in badge pills |
| `--color-text` | `#131C1C` | sampled — near-black headings |
| `--color-text-muted` | `#5A6470` | estimate — body / secondary text |
| `--color-text-faint` | `#8A94A0` | estimate — placeholders, legal footer text |
| `--color-text-inverse` | `#FFFFFF` | sampled — text on navy |
| `--color-text-inverse-muted` | `#C7D6E4` | estimate — copy on navy CTA band |
| `--color-link` / `--color-focus` | `#1E8FE8` | estimate |
| `--color-danger` | `#C0392B` | estimate — form errors ONLY, never a brand colour |

**Brand decision D-RED (open, O-BRAND):** the reference palette has NO red. Ghamdan's brand identity is Navy `#0B2D5B` / Grey `#6B7280` / Red `#E10600` / Light `#F8FAFC`. Default for this build = **Option A: keep the reference palette exactly** (navy `#0F2E4D`, accent `#1E8FE8`, no red), with ONE exception carried from the old build: the wordmark dot uses Ghamdan red `#E10600`. If Ahmed later chooses Option B, change ONLY `--color-accent`, `--color-accent-strong`, `--color-link`, `--color-focus` to `#E10600` and `--color-primary` to `#0B2D5B`; no layout token changes. Do NOT introduce red anywhere else without that decision.

### 1.2 Typography

- **Fonts (self-hosted woff2, `unicode-range` AR/Latin):** Arabic `Tajawal` 400/500/700/800; Latin `Montserrat` 500/600/700/800. The reference font is UNVERIFIED — never claim Tajawal matches it; it is the recommended practical alternative and Ghamdan's brand font.
- **Scale (desktop 1440px; see §1.5 for tablet/mobile):** hero `clamp(2.5rem, 4.4vw, 4rem)` / lh 1.15, weight 800; H1 `clamp(2rem, 3vw, 2.75rem)`; H2 `clamp(1.75rem, 2.5vw, 2.5rem)` / lh 1.25, weight 800; H3 `clamp(1.375rem, 2vw, 1.75rem)` weight 700; H4 `clamp(1.125rem, 1.5vw, 1.25rem)` weight 700; body `1rem` / lh 1.7 (Arabic), weight 400; body-sm `0.9375rem`; caption `0.8125rem`; nav `0.9375rem`; button `0.9375rem` weight 600.
- **Measure:** body max `65ch`; centred intro copy max `52ch`.
- **Alignment:** headings centred (01 hero/intro, 03 intro, 05 intro) or RTL-start (side heroes, editorial text, cards) per §3. Body centred only in intro blocks, otherwise RTL-start. Card text centred in icon rows, RTL-start in editorial/product cards.

### 1.3 Spacing, layout, radii, shadows

- Section spacing `--space-section: clamp(4rem, 7vw, 7.5rem)` (64–120px); sub-section `clamp(2.5rem, 4vw, 4rem)`; card gap `1.5rem` (24px); editorial column gap `clamp(2rem, 4vw, 3.75rem)`; scale 4/8/12/16/20/24/32/40/48/64px.
- Container `--container: 80rem` (1280px), centred, side padding `clamp(1rem, 4vw, 2rem)`. Header height `4.75rem` (76px) desktop. Hero height `72–90vh` (decision, not observed — screenshots are full-page captures).
- Radii: card/image `0.875rem` (14px); button/input `0.625rem` (10px); pill `999px`. **Buttons are pill-ish (10–12px), NOT fully round — this is a reference requirement and overrides no-slop-ui's "no pills" rule for the primary CTA and badge pills only.** No-slop-ui applies where the system is silent: no glassmorphism, no decorative gradients, no floating shells, no oversized (20px+) radii, no glow shadows.
- Borders: cards `1px solid var(--color-border)`; dividers 1px hairline; active nav underline 2px accent/navy.
- Shadows (deliberately minimal — cards are border-defined, not shadow-defined): card `0 2px 12px rgba(15,46,77,0.06)`; card-hover `0 8px 24px rgba(15,46,77,0.10)`; solid header `0 1px 0 rgba(15,46,77,0.06)`. **No gradient backgrounds as decoration anywhere** (the catalogue CTA banner in ref 04 is a light-blue panel — implement as flat `--color-surface-blue`, NOT a gradient; this is the one place the reference's gradient-looking panel is flattened, per no-slop-ui, with no visual loss). No `backdrop-filter`. No purple. No dark-mode surface.
- Buttons: height `3rem` (48px), `2.5rem` small; padding-x `1.75rem`. Variants: `.btn-primary` navy fill/white text (default CTA everywhere); `.btn-white` white fill/navy text (on dark bands); `.btn-outline` 1px accent border/accent text/white fill (product cards); `.btn-whatsapp-green` green `#1D9E44` (03 header + 09 CTA icon only); `.btn-link` accent text + left arrow `←`, no fill ("اكتشف المزيد"). Forward arrow in RTL is `←` (points left). Do not mirror arrows blindly — directional icons follow reading direction; non-directional icons (sun, droplet, leaf) are never mirrored.
- Forms: input height `3.125rem` (50px), radius 10px, 1px `--color-border-strong`, white fill, placeholder `--color-text-faint`; label bold 14px above field; required mark red `*` (`#C0392B`, form-only).
- Icons: Lucide, thin line, stroke 1.5–2px, accent blue; feature icons in pale-blue circles 56–72px diameter; small inline icons 20–24px. No emoji icons. Decorative icons `aria-hidden="true"`.

### 1.4 Grids

2-col editorial (50/50 or 55/45); 3-col (pillars, expertise, related); 4-col (features, steps, challenges, gallery, results); 6-col catalogue product grid ONLY (ref 04). Image ratios: hero full-bleed cover; editorial ~16:10; product card ~4:3 (04) / 16:9 (06 related); gallery ~16:10; product cut-outs square on light-grey `#F4F7FA`; application cards 16:9 with bottom overlay caption.

### 1.5 Breakpoints (implementation decisions — NOT observed; no mobile screenshot exists)

| Breakpoint | Width | Behaviour |
|---|---|---|
| `sm` | 640px | 1-col grids; stacked editorial (image first); hero centred, 56–64vh |
| `md` | 768px | 2-col grids; sticky WhatsApp bar appears (product/system pages only); hero text centred with navy overlay for contrast below this width |
| `lg` | 1024px | 3-col grids; editorial 2-col; header → burger + drawer below this width |
| `xl` | 1280px | Container max; 4-col / 6-col grids |
| `2xl` | 1536px | Container stays capped at `--container` |

Reflow rules: 6-col product grid → 3-col at `lg`, 2-col at `md`, 1-col below `md`. 4-col grids → 2-col at `md`, 1-col below `md`. Hero side-aligned text → centred below `md`. Type scale: hero 56–64px desktop / 40–48px tablet / 32–36px mobile; H2 32–40 / 28–32 / 24–28; section spacing 80–120 / 64–80 / 48–64; container padding 32 / 24 / 16; header height 76 / 72 / 64 (drawer header).

### 1.6 No-slop-ui reconciliation (explicit, so the builder does not "fix" the reference)

The following reference features are KEPT even though no-slop-ui would normally ban them (reference wins): navy pill-ish primary CTAs + badge pills; the marquee strip (01); the giant pale footer watermark wordmark; the 6-column dense product grid (04); the light-blue CTA banner panel (04, flattened, not gradient). No-slop-ui rules that DO apply: no glassmorphism, no decorative gradients, no floating shells, no glow/dramatic shadows, no decorative copy in the UI, no fake charts/stats, no emoji, no purple, no shadcn defaults. Cards: 14px radius max (reference value), 1px border, shadow cap `0 8px 24px rgba(15,46,77,0.10)`.

---

## 2. Global components

All components live in `src/components/` (one file per component, props typed). Every component supports AR/EN/ZH via the dictionary; every link is a real route (no `#` placeholders); every image has `alt` in the current locale; every interactive element is keyboard-operable with a visible focus ring (`--color-focus`, 2px outline offset 2px).

### 2.1 TopBar (`TopBar.tsx`) — prompt-required, NOT visible in any reference

- Desktop only (hidden below `md`). Dark navy `--color-primary-deep` background, white 13px text, height `2.5rem`.
- RTL-start group: e-mail link `info@ghamdan-trd.com` (mailto), phone link `+967 775 800 000` (tel:+967775800000). RTL-end group: hours «السبت – الجمعة: 8 صباحاً – 8 مساءً» + Facebook + Instagram icons (links §0.3.4). No LinkedIn/YouTube.
- The header sits BELOW the TopBar when at page top; when scrolled, the TopBar scrolls away and the header sticks to `top: 0` (old build kept the header at `top: 2.5rem` — do NOT copy that; the sticky header must sit at viewport top once scrolled).
- Test: TopBar visible on desktop on every page; values identical to footer/contact; hidden on mobile; does not overlap the header.

### 2.2 Header (`Header.tsx`) — transparent over hero → solid on scroll

- One row, height 76px desktop / 64px mobile. Container `80rem`.
- **Transparent variant** (pages whose hero is a full-bleed photo: 01, 02, 03, 05, 07, 09, 10): transparent background, white nav text + white wordmark over the photo at scroll 0. **Solid variant** (split-hero pages 04, 06, 08 and all no-reference pages): white background, `--color-text` nav text, navy wordmark from the start.
- **On scroll (any variant):** after 24px scroll, add `.site-header--scrolled` — solid white background + `--shadow-header` + compact height (72px desktop). Transition 0.25s ease. No layout jump: the header is `position: fixed` with a spacer of equal height, or `sticky top-0`; the hero must not shift when the state changes.
- Layout (RTL): start = Wordmark; centre = DesktopNav; end = LanguageSelector + WhatsAppButton (header CTA) + Burger (below `lg` only).
- Test: scroll 0 → transparent (photo pages) / white (split pages); scroll 25px → solid white, no jump; scroll back to 0 → returns; no horizontal overflow.

### 2.3 DesktopNav (`DesktopNav.tsx`) — ONE canonical nav

The per-image navs differ (e.g. «القطاعات» only in 03, «خبراتنا» only in 05, «المزايا» only in 10, «الموارد» only in 04, duplicate «الرئيسية» in 09). Those are reference inconsistencies — **do not copy them**. Canonical nav (7 items desktop; full 10 in the drawer, §2.6):

| # | AR | EN | ZH | Route |
|---|---|---|---|---|
| 1 | الرئيسية | Home | 首页 | `/[locale]/` |
| 2 | من نحن | About | 关于我们 | `/[locale]/about` |
| 3 | المنتجات | Products | 产品 | `/[locale]/products` |
| 4 | حلولنا | Solutions | 解决方案 | `/[locale]/solutions` |
| 5 | الأنظمة الجاهزة | Ready-made Systems | 成套系统 | `/[locale]/systems` |
| 6 | مشاريعنا | Projects | 项目 | `/[locale]/projects` |
| 7 | تواصل معنا | Contact | 联系我们 | `/[locale]/contact` |

- Style: 15px, `--color-text` (white on transparent header), weight 500; active item = 2px accent underline + weight 700. Services, Agencies, News, Support are NOT in the desktop nav (space) — they are reachable via drawer + footer + home/solutions cross-links, satisfying "any section ≤2 steps from mobile" (REQ-PUB-006). Active state is derived from the current route (exact for `/`, prefix match otherwise).
- Test: same 7 items, same order, on every page; active underline on the correct item; no page shows a different nav.

### 2.4 LanguageSelector (`LanguageSelector.tsx`) — AR / EN / ZH

- References show AR + EN only (`عربي | EN`); **ZH is required and must be added in the same style** — three options: `عربي | EN | 中文`. Desktop: text switcher (active language bold/underlined); on the solid header it may render as a white rounded box (as in refs 02/06/07). Mobile: the same three options inside the drawer + a `<select>` fallback is NOT acceptable as the only control (use buttons/links).
- Behaviour: switching preserves the equivalent current page (same slug in the other locale). If the equivalent translation does not exist, go to that locale's home — never a broken URL. Persist choice in a cookie (`NEXT_LOCALE`) so the next visit lands in the chosen locale. `dir` flips: AR `rtl`, EN/ZH `ltr`. Model/brand/unit strings never change.
- Test: switch on every template type (home, product detail, category, solution detail, project detail, search with query) → lands on the same page in the other locale; ZH pages show the CI-09 review banner (§0.7).

### 2.5 WhatsAppButton (`WhatsAppButton.tsx`) — variants + prepared messages

- **One number everywhere:** `wa.me/967775800000`. Build links from settings only.
- Variants: `navy-pill` (header + most CTAs, navy fill, white text, WhatsApp icon at RTL end, arrow `←` where the reference shows one); `green-pill` (03 header ONLY — `#1D9E44`); `white-on-dark` (CTA bands); `outlined-blue` (product cards in the catalogue grid, 1px accent border, accent text); `text-link` (blue text + `←`, "اكتشف المزيد" style — used for discovery links, not WhatsApp).
- **Prepared messages** (URL-encoded, in the current page language; product/package name + page URL included; NEVER a price):
  - Header/general: AR «مرحباً غمدان — أريد الاستفسار عن منتجاتكم.» / EN "Hello Ghamdan — I'd like to enquire about your products." / ZH «您好，我想咨询贵公司的产品。»
  - Product: AR «مرحباً غمدان — أستفسر عن المنتج: {name} ({model}) — {url}» / EN "Hello Ghamdan — I'm enquiring about: {name} ({model}) — {url}" / ZH «您好，我想咨询产品：{name} ({model}) — {url}»
  - System/package: AR «مرحباً غمدان — أستفسر عن النظام الجاهز: {name} — {url}» / EN "Hello Ghamdan — I'm enquiring about the ready-made system: {name} — {url}"
  - Support: AR «مرحباً غمدان — أحتاج دعماً فنياً بخصوص: {topic}» / EN "Hello Ghamdan — I need technical support regarding: {topic}"
  - Guidance: AR «مرحباً غمدان — نتيجة دليل الضخ: عمق البئر {depth}م، المياه اليومية {water}م³، الاستخدام: {use}. أرجو تصميم النظام المناسب.» / EN equivalent with the three submitted values.
  - Contact form: AR «مرحباً غمدان — رسالة من {name} ({type}): {message}» / EN equivalent.
- **Analytics (client-side only in v2):** every WhatsApp click records `{source, sourceId, pageUrl, locale, ctaId, timestamp}` to `localStorage` (key `gts_wa_clicks`) and is shown in the admin demo statistics tab (§6). Never claim delivery/read. `data-wa-type` + `data-wa-cta` attributes on every WhatsApp link (values per §3, e.g. `header`, `hero`, `product-card`, `sticky-bar`).
- Test: every WhatsApp link on every page opens `wa.me/967775800000?text=…` with the correct number and a correctly-encoded message in the page language; click is recorded with the right source.

### 2.6 MobileDrawer (`MobileDrawer.tsx`) — MUST WORK

- Trigger: burger button below `lg` (44×44px touch target, `aria-expanded`, `aria-controls`). The old build's drawer was verified broken on Vercel because a Vite build step 404'd all JS — **the v2 drawer must be React state, no separate JS file, no build-step asset**. Test it on the deployed URL, not only locally.
- Behaviour: slides in from the RTL-start side (right in AR), 320px wide max 85vw, white background, wordmark + close button at top; nav = all 10 sections (the 7 desktop items + الخدمات / الوكالات / الأخبار / الدعم والضمان); then LanguageSelector (3 options); then WhatsApp button (full-width navy) + Contact button (outlined). Backdrop click, close button, and `Escape` all close it. Focus is trapped while open; focus returns to the burger on close. Body scroll is locked while open (`overflow: hidden` on `documentElement`, restored on close). The drawer must never render underneath the sticky WhatsApp bar.
- Test (acceptance): on a 390px viewport, tap burger → drawer opens with all 10 links; tap a link → navigates AND closes; `Escape` closes; backdrop closes; no horizontal overflow while open; keyboard-only walkthrough works.

### 2.7 Footer (`Footer.tsx`) — canonical = reference 04's 4-column footer

The references show 1-row (01, 06), 2–3-column (02, 03, 05, 07, 08, 10), 4-column (04), and truncated (09) footers. **One footer everywhere: the 4-column layout of ref 04**, in the reference visual language (light background `#F4F7FA`–white, no dark footer):

| Column | Content |
|---|---|
| 1 — Brand | Wordmark (غمدان / GHAMDAN · GTS) + tagline «للتجارة والتوكيلات» / "Trading & Agencies" + 1-line description (SAMPLE: «نقدّم حلول الطاقة الشمسية والمياه والمعدات الزراعية…» — replace on CI-07) + social icons Facebook + Instagram only (§0.3.4) |
| 2 — فئات المنتجات / Product categories | Links to the 8 categories (§3.8): المحولات الهجينة والانفرترات / بطاريات الليثيوم والتخزين / الألواح الشمسية / المضخات الشمسية وأنظمة الري / منظمات الشحن والملحقات / الأنظمة الجاهزة / التخزين التجاري والصناعي / كاميرات المراقبة والأمن |
| 3 — روابط سريعة / Quick links | Home, About, Products, Solutions, Systems, Projects, Agencies, News, Support, Contact |
| 4 — تواصل معنا / Contact | Address (Sakhr St, front of Noor Yemen Mall, Sana'a), `info@ghamdan-trd.com`, `+967 775 800 000`, hours Sat–Fri 8:00–20:00 + outlined WhatsApp button «استفسر عبر واتساب» |

- Bottom row: `© {current year} غمدان للتجارة والتوكيلات — جميع الحقوق محفوظة` (year computed at render, never hard-coded 2024/2025 as in the references) + «سياسة الخصوصية | الشروط والأحكام» links.
- Giant pale watermark wordmark «GHAMDAN» behind the footer (very light grey, ~10–15% opacity, `aria-hidden`, `pointer-events: none`) — as in refs 02/05/07. It must not reduce text contrast and must not overlap the bottom row on mobile (hide below `md` if it collides).
- Mobile: columns stack 1-col, contact column first after brand; bottom row stacks centred.
- Test: identical 4 columns on every page; all links work; contact values identical to TopBar/contact page; year is current.

### 2.8 CTA band (`CTABand.tsx`) — variants

Dark navy `--color-primary` (`#0F2E4D`), full-bleed, white heading + `--color-text-inverse-muted` copy + white button. Present on every page except the catalogue (which uses the light-blue banner, §3.4.5). Variants:

| Variant | Layout | Used on |
|---|---|---|
| `split` | Right column: heading + copy + white WhatsApp button; left column: «طرق التواصل الأخرى» with 3 rows (mail / phone / pin icons + labels + REAL values from settings — the reference shows labels only; the build shows labels + values) | 01 |
| `photo-left` | Photo left half, text right | 02 |
| `photo-bg` | Full-bleed photo background + navy overlay (overlay must guarantee ≥4.5:1 contrast for the white text) + right-aligned text | 03 |
| `features` | Heading + copy + white button + 3 mini-features below/beside (icon + bold title + 1-line caption, vertical dividers) | 05, 06, 07 |
| `whatsapp` | WhatsApp icon in a blue rounded square + heading + copy + white button «بدء المحادثة ←» + 3 mini-features (إجابات سريعة / استشارات مخصصة / بدون أي التزام) | 08, 09 |
| `gradient` (catalogue only) | Flat `--color-surface-blue` panel (NOT a gradient), text right + 2 buttons (navy WhatsApp + white outlined «أو أرسل لنا رسالة» with mail icon) + photo right | 04 |

- Every page ends with exactly ONE clear next-step CTA (REQ-PUB-007). The CTA band IS that step on pages that have it; on the catalogue the light-blue banner is it.
- Mini-feature sets (SAMPLE copy, per reference): 05 = خبرة متكاملة / حلول مخصصة / استشارة مجانية; 06 = استشارة مجانية / إرشاد متخصص / حلول مخصصة; 07 = حلول مخصصة / خبرة موثوقة / استشارة مجانية; 08 = إجابات سريعة / استشارات مخصصة / بدون أي التزام. Do not present «استشارة مجانية» as a verified offer — it is reference sample copy pending CI-07 confirmation; keep the wording but do not add any stronger promise (no "free" claim beyond the reference wording).

### 2.9 Floating WhatsApp button (`WhatsAppFloat.tsx`)

- Fixed, bottom corner at the RTL-end side (bottom-left in AR / bottom-right in EN-ZH — use logical `inset-inline-end`), 56×56px green circle `#1D9E44` (the floating button is green in the old build and in prompt §4.3; the header button stays navy), white WhatsApp glyph, shadow `0 8px 24px rgba(15,46,77,0.20)`, `z-index` below the drawer and lightbox, above page content.
- Present on ALL public pages. On mobile product/system pages it is HIDDEN while the sticky bar is visible (never show both at once). `aria-label="WhatsApp"`, `data-wa-type="floating"`.
- Test: visible on every page; does not cover footer actions, cookie controls, or form submit buttons; hidden on mobile product/system detail (sticky bar instead).

### 2.10 Sticky mobile WhatsApp bar (`StickyWhatsAppBar.tsx`) — product/system pages ONLY

- Below `md` only, on `/products/[slug]` and `/systems/[slug]` only. Fixed bottom bar, white background + top border, safe-area padding (`env(safe-area-inset-bottom)`), height 64px + safe area.
- Content: product/system name (truncated, 1 line) + green WhatsApp button «استفسر عبر واتساب» (full contextual message, §2.5). The bar must NOT cover content, forms, or footer actions: add `padding-bottom` to the page body equal to the bar height on these pages only (mobile only).
- Test: at 390px on a product page, scroll to bottom — footer actions remain tappable above the bar; bar shows the correct product name; tapping opens the correct prepared message.

### 2.11 Shared sub-components (build once, reuse everywhere)

`SectionHeading` (variants `center` / `start` / `underline` — the short blue underline accent appears in ref 03 only; use it only where §3 says so); `Pill` (pale-blue pill, 12–13px bold accent text, optional icon, optional green dot); `Breadcrumbs` (home icon first, separators `›` in RTL / `/` as in refs 09–10 — use `›` consistently; small grey 13px; placed above the hero heading); `EditorialBlock` (`image-left` / `image-right` / `alternating`); `IconFeature` (icon in pale-blue circle or bare); `FeatureCard`; `ProductCard` (canonical, §3.4.4); `CategoryCard`; `ProjectCard`; `SolutionCard`; `Gallery` + `Lightbox` (keyboard: arrows + Escape; focus trapped; no autoplay); `SpecTable`; `Pagination` (numbered, prev/next, preserves filters in the URL); `EmptyState` (icon + title + 1-line copy + optional CTA — honest, never "coming soon" as a fake promise); `SearchInput`; `Filters`; `ResultMeta` + `SortSelect`; `ContactForm` (§3.7.4); `SystemDiagram` (§3.9.5 — code-built SVG, never a screenshot).

---

## 3. Per-page spec — the 10 reference pages

**Reading notes for §3.** (a) Hero variant per page is normative: `center` (01), `side-left` (02, 05 — text in the visually-left column, i.e. RTL end), `side-right` (03, 07, 09, 10 — text in the RTL-start column), `split` (04, 06, 08). (b) Copy keys: AR quoted from the reference (SAMPLE); EN = draft; ZH = CI-09 pending. Only the hero H1, intro, and CTA strings are spelled out per page; all other strings use the reference text as their AR value under the key named. (c) Image slots name the exact file; "fallback" is used only if the AI hero (O-HERO) is unavailable, and must be logged as a deviation. (d) Counts are normative: 4 solution cells, 3 why-cards, 2 project cards, 3 product tiles (01); 12 featured cards 6×2 (04); 8 cards 4×2 (08); 4 steps (03, 09); 4 challenges (09); 4 gallery images (05, 10). Do not add or remove cards to "fill" a page.

### 3.1 Page 01 — Home `/` — ref `ui-reference-01-home.jpg` — Hero `center`

| # | Section | Component | Spec |
|---|---|---|---|
| 1.1 | Hero | `Hero[center]` | Full-bleed photo `heroes/hero-villa-sea.jpg` (fallback `photos/villa-roof.jpg`), sky-heavy crop: headline sits in the sky area, photo occupies the lower ~half. Badge pill (white, green dot): AR «طاقة ومياه من أجل مستقبل أفضل» / EN "Energy and water for a better future". H1 (2 lines, centred, 56–64px, 800): AR «حلول طاقة ومياه مصممة / لتناسب احتياجاتك» / EN "Energy and water solutions designed / to fit your needs". Sub-copy (2 lines, centred, grey): AR «نقدّم أنظمة طاقة شمسية وحلول مياه والتقنيات الزراعية المتكاملة لبناء مستقبل أكثر استدامة.» Navy pill CTA «تواصل عبر واتساب ←» (WhatsApp icon; `data-wa-cta="hero-whatsapp"`). Hero 72–90vh. |
| 1.2 | Intro | `SectionHeading[center]` | H2 AR «نؤمن بعالم تزدهر فيه الحياة» / EN "We believe in a world where life thrives". Copy (2 lines, ≤52ch): AR «نوفر حلولاً متكاملة للطاقة الشمسية وهندسة المياه والتقنيات الزراعية لتمكين الأفراد والمجتمعات والشركات من بناء مستقبل أكثر استدامة.» |
| 1.3 | Pillars | `PillarRow` (3 × `IconFeature`, hairline vertical dividers) | RTL order: أنظمة الطاقة الشمسية (sun icon; caption «طاقة نظيفة لحياة أفضل») / هندسة المياه (droplet; «حلول موثوقة لإدارة المياه») / التقنيات الزراعية (leaf; «زراعة أكثر إنتاجية واستدامة»). Centred text. Below: faint full-width line-art SVG of a solar field (rebuild as inline SVG, very low contrast — do NOT screenshot the reference; decorative, `aria-hidden`). |
| 1.4 | Marquee | `Marquee` | Large thin text, words separated by em-dashes, repeated: «خبراتنا — حلولنا — تأثيرنا —» (EN "Our expertise — Our solutions — Our impact —"). CSS animation only, 30s linear infinite, duplicated track for a seamless loop; stops entirely under `prefers-reduced-motion` (§5). |
| 1.5 | Solutions grid | `SolutionGrid[2col]` (2×2 `SolutionCard`) | Each cell: image left ~40% (~16:10) + text right on `--color-surface-muted` panel: blue line icon, bold title, 2-line grey copy, blue text-link «اكتشف المزيد ←» → `/solutions/[slug]`. Cells (RTL order, row 1 then row 2): (1) أنظمة الطاقة الشمسية — image `photos/panels-rows.jpg` — «تصميم وتركيب أنظمة طاقة شمسية عالية الكفاءة للمنازل والشركات والمشاريع الكبرى.» (2) حلول ضخ ومعالجة المياه — image `photos/pump-flow.jpg` — «حلول متكاملة لضخ ومعالجة وتوزيع المياه باستخدام تقنيات حديثة وموثوقة.» (3) التقنيات الزراعية — image `photos/greenhouse.jpg` — «أنظمة الري الذكية والحلول الزراعية الحديثة لإنتاجية أعلى باستخدام موارد أقل.» (4) حلول متكاملة — image `photos/solar-farm.jpg` — «نجمع بين الطاقة والمياه والزراعة لتقديم حلول متكاملة ومصممة حسب احتياجاتك.» |
| 1.6 | Why us | `WhyUs[3col]` on `--color-surface-blue` band (faint sky/cloud photo under the pale blue — use `photos/villa-sky.jpg` at 12% opacity as background, never a gradient) | Pill «لمستقبل أكثر استدامة»; H2 AR «لماذا تختار حلولنا؟» / EN "Why choose our solutions?". 3 white cards: حلول مخصصة (diamond icon; «تصاميم مرنة تلبي احتياجاتك بأعلى جودة وكفاءة.») / خبرة متكاملة (gear; «فريق متخصص يجمع بين الطاقة والمياه والزراعة.») / شراكة طويلة الأمد (people; «نرافقك في كل مرحلة من التصميم إلى التشغيل وما بعده.»). |
| 1.7 | Projects + products split | 2-col split: right «مشاريعنا» / left «منتجات مختارة» | Projects (2 image cards ~16:9 + bold title + blue link «عرض المشروع ←»): مشروع طاقة شمسية — `photos/solar-farm.jpg`; مشروع ري زراعي — `photos/pivot.jpg`. **Both link to `/projects` (not to a fabricated project detail) until a real project is approved (CI-07); the cards are category showcases, and their titles must not name a specific client, place, or capacity.** Products (3 square tiles, cut-out style on light-grey squares + label): ألواح شمسية عالية الكفاءة — `photos/panels-rows.jpg`; مضخات مياه مطورة — `photos/pump-flow.jpg`; أنظمة ري ذكية — `photos/greenhouse.jpg`. Link «عرض جميع المنتجات →» → `/products`. |
| 1.8 | CTA band | `CTA[split]` (§2.8) | Right: H2 «لنبدأ مشروعك اليوم» + copy «تواصل معنا لمناقشة احتياجاتك، وسنقدّم لك الحل الأمثل بمساعدة فريقنا المتخصص.» + white WhatsApp button. Left: «طرق التواصل الأخرى» — 3 rows with REAL values: mail `info@ghamdan-trd.com` / phone `+967 775 800 000` / pin «شارع صخر، أمام نور اليمن مول، صنعاء». |
| 1.9 | Guidance bar | (prompt §10 / REQ-WA-007) | A slim bar above the CTA band (or directly under the hero on mobile): «لا تعرف النظام المناسب؟ جرّب دليل الضخ أو تحدث معنا عبر واتساب» + buttons «دليل الضخ» → `/guidance` and «استشارة واتساب». Present on Home and on `/products` only. |

### 3.2 Page 02 — About `/about` — ref `ui-reference-02-about.jpg` — Hero `side-left`

| # | Section | Component | Spec |
|---|---|---|---|
| 2.1 | Hero | `Hero[side-left]` | Full-bleed `heroes/hero-villa-sea.jpg` (same file as 01, different focal point: villa right, sea left; fallback `photos/villa-sky.jpg`). Text in the visually-LEFT column (RTL end), left-aligned: H1 (2 lines) AR «خبرة هندسية متكاملة / لطاقة أذكى وحياة أفضل» / EN "Integrated engineering expertise / for smarter energy and a better life". Sub-copy (3 lines): AR «نصمّم وننفّذ حلولاً متكاملة للطاقة الشمسية وهندسة المياه والتقنيات الزراعية، بما يناسب احتياجاتك ويخدم مجتمعاتنا.» Navy pill CTA «تحدث معنا اليوم ←». NO badge pill. |
| 2.2 | Intro | `SectionHeading[center]` + `PillarRow` | Pill «من نحن»; H2 (centred, 2 lines): AR «نؤمن بأن الطاقة المستدامة والمياه والزراعة الذكية ليست بدائل، بل أسس لمستقبل أفضل للجميع.» Copy: AR «نحن فريق من المتخصصين يجمع بين الهندسة والابتكار والخبرة العملية لتقديم حلول متكاملة تسهم في بناء مجتمعات أكثر استدامة ومرونة.» Then the same 3-pillar row as 1.3 with DIFFERENT captions: الطاقة الشمسية «لمستقبل أنظف» / هندسة المياه «للحياة والازدهار» / الزراعة الذكية «لتغذية مستدامة». |
| 2.3 | Story | `EditorialBlock[image-left]` | Image left (~55%, ~16:10, rounded 14px): `photos/solar-farm.jpg` (solar field at sunset over a city — closest available; the reference shows a city skyline: do NOT composite a city into the photo). Text right: pill «قصتنا»; H3 AR «انطلقت رحلتنا من إيمان بإمكانات عالم أكثر استدامة»; copy (3 lines, SAMPLE — replace on CI-07); navy button «اكتشف المزيد عنا ←» → stays on the page (anchor to §2.6 expertise) — it must NOT link to a non-existent page. |
| 2.4 | Mission / Vision | `ValueCard` ×2 | Two white cards, light border: رسالتنا (target icon in pale-blue circle; «تقديم حلول هندسية عالية الجودة تجمع بين الابتكار والاستدامة، وتلبي احتياجات عملائنا والمجتمعات التي نخدمها.») / رؤيتنا (eye icon; «أن نكون شريكاً موثوقاً في بناء مستقبل مستدام، من خلال حلول مبتكرة ومتكاملة للطاقة والمياه والزراعة.»). Both SAMPLE — CI-07. |
| 2.5 | Expertise | `SectionHeading[center]` + 3 `ExpertiseCard` | Pill «مجالات خبرتنا»; H2 «حلول متكاملة لحياة أكثر استدامة» + copy. 3 image cards (image top ~16:10, bold title, 2-line copy, blue link «اعرف المزيد ←» → `/solutions/[slug]`): الطاقة الشمسية — `photos/panels-rows.jpg` / هندسة المياه — `photos/pump-flow.jpg` / التقنيات الزراعية — `photos/greenhouse.jpg`. |
| 2.6 | CTA band | `CTA[photo-left]` | Photo left: `photos/solar-farm.jpg`. Text right: H2 «لنبحث معاً عن الحل الأنسب لمشروعك» + copy «فريقنا جاهز للاستماع إلى احتياجاتك ومساعدتك في تصميم حلول مخصصة تحقق أهدافك.» + white WhatsApp button «تواصل عبر واتساب». |
| 2.7 | NOT on this page | — | No statistics/numbers section (the reference has none — do not invent a founded year, project count, or team size). No team photos (no people in any reference). |

### 3.3 Page 03 — Solutions `/solutions` — ref `ui-reference-03-solutions.jpg` — Hero `side-right`

| # | Section | Component | Spec |
|---|---|---|---|
| 3.1 | Hero | `Hero[side-right]` | Full-bleed `heroes/hero-villa-mountains.jpg` (fallback `photos/solar-farm.jpg`). Text in the RTL-start (right) ~45% column: H1 (2 lines) AR «حلول متكاملة / للطاقة والمياه» / EN "Integrated solutions / for energy and water". Sub-copy (3 lines): AR «نصمّم وننفّذ حلول الطاقة المتجددة وأنظمة المياه بكفاءة وموثوقية عالية، لتمكين الأفراد والشركات والمجتمعات من بناء مستقبل أكثر استدامة.» Navy pill CTA «اكتشف حلولنا ←» (ONE arrow only — the reference's double-arrow «← →» is a rendering quirk, do not copy). |
| 3.2 | Intro | `SectionHeading[center, underline]` | H2 «معاً نحو مستقبل أكثر استدامة» with the short blue underline accent below the heading (the only page that uses the underline variant). Copy (2 lines): AR «نجمع بين خبرتنا الهندسية العميقة والتقنيات المتقدمة لنقدّم حلولاً متكاملة في مجالات الطاقة والمياه، تلبي احتياجات اليوم وتدعم الأجيال القادمة.» |
| 3.3 | Editorial rows | `EditorialBlock[alternating]` ×5 | Alternating image/text; text panels alternate white / `--color-surface-muted`; each row: category `SolutionPill` + H3 (~28px) + 2–3 line copy + navy button «اكتشف المزيد ←» → `/solutions/[slug]`. Rows (in order): (a) الطاقة الشمسية السكنية — pill «للمنازل» (home icon) — image left `photos/villa-roof.jpg`; (b) حلول الطاقة التجارية والصناعية — pill «للشركات والصناعة» (building icon) — text on grey panel left, image right `photos/solar-farm.jpg`; (c) ضخ المياه بالطاقة الشمسية — pill «المياه» (droplet) — image left `photos/pump-flow.jpg`; (d) أنظمة الري الذكية — pill «الري الذكي» (leaf) — text on grey panel left, image right `photos/pivot.jpg`; (e) حلول الطاقة والمياه للقطاع الزراعي — pill «الزراعة» (leaf) — image left `photos/crops.jpg`. **Taxonomy warning:** these five are the REFERENCE's taxonomy. The approved Ghamdan solution taxonomy is CI-02/CI-07 pending; the builder implements these five slugs (`residential-solar`, `commercial-industrial`, `solar-water-pumping`, `smart-irrigation`, `agriculture`) as the v2 set and flags any change as a content update, not a redesign. |
| 3.4 | How we work | `ProcessSteps[4]` | H2 «كيف نعمل؟» centred. 4 steps numbered RTL 1→4 with left-pointing arrows between steps: ١. فهم احتياجاتك (chat icon; «نستمع لمتطلباتك ونحلل التحديات بدقة.») / ٢. تصميم الحلول (gear; «نطوّر حلولاً هندسية مخصصة باستخدام أحدث التقنيات.») / ٣. التنفيذ والمتابعة (helmet; «ننفّذ المشاريع بأعلى معايير الجودة مع متابعة مستمرة.») / ٤. دعم مستمر (handshake; «نقدّم خدمات ما بعد التنفيذ لضمان أداء مستدام.»). Static per-language strings, no data source. |
| 3.5 | CTA band | `CTA[photo-bg]` | Full-bleed photo `photos/pivot.jpg` (irrigation pivot + solar field) + navy overlay; text right-aligned: H2 «لنبدأ مشروعك الآن» + copy «تحدث مع فريقنا المتخصص لنستكشف معاً أفضل الحلول لاحتياجاتك في الطاقة والمياه.» + navy button «تواصل معنا الآن ←» (navy on photo-bg here, per reference — the button sits on the photo, white text on navy). |
| 3.6 | Header CTA colour | — | The reference shows a GREEN header WhatsApp button on this page only (`#1D9E44`). Implement `btn-whatsapp-green` for the header CTA on `/solutions` ONLY. Every other page uses the navy header button. |

### 3.4 Page 04 — Catalogue `/products` — ref `ui-reference-04-catalog.jpg` — Hero `split`

| # | Section | Component | Spec |
|---|---|---|---|
| 4.1 | Hero | `Hero[split]` + `TrustRow` | Split: photo left ~55% (`heroes/hero-pump-mountains.jpg` — panels + pump + mountains, exact match; fallback `photos/pump-flow.jpg`); text right ~45% white: small heading «طاقة اليوم / لمستقبل أفضل» (top-right), then H1 AR «دليل منتجات الطاقة الشمسية / والمضخات والمعدات الزراعية» / EN "Guide to solar energy products, / pumps and agricultural equipment", 2-line copy, navy button «تواصل معنا الآن ←». Below the hero, trust row (3 items, icon + bold label): مستقبل أكثر استدامة (leaf) / دعم فني متخصص (gear) / منتجات عالية الجودة (shield). |
| 4.2 | Search | `SearchInput` | Centred rounded input, magnifier icon, placeholder AR «ابحث في المنتجات...» / EN "Search products…". Typing filters the grid live (client-side over the 37 published products) AND submits to `/search?q=…` on Enter. |
| 4.3 | Category strip | `CategoryStrip` (13 tiles in the reference — BUILD 8) | **Do NOT copy the reference's 13 items** (it lists «بطاريات رصاصية» twice and includes a tractor). Build the strip from the 8 approved categories (§3.8), each tile = square product visual + 1–2 line label: الألواح الشمسية (`photos/panels-rows.jpg`) / بطاريات الليثيوم والتخزين (`photos/battery-storage.jpg`) / المحولات الهجينة (`photos/inverter-unit.jpg`) / المضخات الشمسية وأنظمة الري (`photos/pump-flow.jpg`) / منظمات الشحن والملحقات (`photos/controller-unit.jpg`) / الأنظمة الجاهزة (`photos/solar-farm.jpg`) / التخزين التجاري والصناعي (`photos/battery-storage.jpg`, different crop) / كاميرات المراقبة والأمن (`photos/controller-unit.jpg`, different crop — camera has no dedicated photo; mark O-IMG-CAM). Clicking a tile navigates to its category page. Active tile = pale-blue fill. On mobile the strip scrolls horizontally (snap) — never wraps into a broken grid. |
| 4.4 | Featured products | `ProductGrid[6col]` + `ProductCard` (12 cards, 2 rows) | Heading right «المنتجات المميزة» + link left «عرض جميع المنتجات ←» → `/products` (same page anchor to the grid — it must not reload to a different URL). Card (canonical, §3.4.4): white, light border, radius 14px; product visual on light-grey square (~4:3); bold name; small grey category label; outlined blue WhatsApp button «استفسر الآن» (WhatsApp icon). 12 featured = first 12 published products ordered by category priority (inverters → batteries → panels → pumps → controllers), 2 per category where available. **No tractor card** (farm machinery is not in the approved catalogue — O-TRACTOR). |
| 4.5 | CTA banner | `CTABanner[gradient → flat]` | Flat `--color-surface-blue` panel (NOT a gradient), text right: H3 «تحتاج إلى مساعدة في اختيار الحل الأنسب؟» + copy «فريقنا من الخبراء جاهز لمساعدتك في تصميم الحل الأمثل لمشروعك، من الدراسة حتى التنفيذ وما بعد البيع.» Two buttons: navy WhatsApp «تواصل معنا عبر واتساب» + white outlined «أو أرسل لنا رسالة» (mail icon → `/contact`). Photo right: `photos/pivot.jpg` (solar field + sprinklers). |
| 4.6 | Why us | `WhyUs[4col]` (white background, no band) | H2 «لماذا تختار حلولنا؟» centred. 4 columns with icons + hairline dividers: حلول متكاملة (leaf; «من الطاقة إلى الزراعة») / خبرة موثوقة (gear; «سنوات من الخبرة في المنطقة») / منتجات عالية الجودة (shield; «معايير عالمية لأداء يطول الأمد») / دعم بعد البيع (people; «فريق فني متخصص دائماً»). **«سنوات من الخبرة» is reference sample copy — no number is stated, and the builder must NOT add one (no "since 1997" — that string was removed everywhere in the old build; no year anywhere).** |
| 4.7 | Footer | `Footer[4col]` | The canonical footer (§2.7). This page's reference footer IS the canonical base — implement it here first, reuse everywhere. |

**§3.4.4 Canonical `ProductCard` (used on 04, 08, 06-related, 09-related, 10-related, search):** image (real approved image; stand-in photo + «صورة توضيحية» caption until CI-06) → product name (bold, 18–20px) → brand (never translated) → model where useful → ONE approved benefit line → up to THREE confirmed specs (power/capacity, voltage/phase, usage type) → availability as TEXT («متوفر الآن» / «متوفر عند الطلب» — only when confirmed per CI-13; otherwise the line is omitted) → TWO actions: «التفاصيل» (link to product page) + WhatsApp «استفسر الآن» (outlined blue on grids; full navy on detail pages). **No price field, no price metadata, no price in structured data.** If a product has no confirmed image, the card is NOT published (it stays in the admin demo as `awaiting_client_list`).

### 3.5 Page 05 — Projects `/projects` — ref `ui-reference-05-projects.jpg` — Hero `side-left`

| # | Section | Component | Spec |
|---|---|---|---|
| 5.1 | Hero | `Hero[side-left]` | Full-bleed `heroes/hero-villa-mountains.jpg` (fallback `photos/solar-farm.jpg`). Text in the visually-LEFT column: H1 (2 lines) AR «مشاريع طاقة شمسية / وحلول مائية لمستقبل أفضل» / EN "Solar energy projects / and water solutions for a better future". Copy (2 lines): AR «نصمّم وننفّذ أنظمة متكاملة للطاقة الشمسية والهندسة المائية لتلبية احتياجات الأفراد والشركات والمجتمعات.» Navy pill «استعرض مشاريعنا ←» (anchor to §5.4). |
| 5.2 | Intro | `SectionHeading[center]` | Small label «— مجالات مشاريعنا —» + H2 «مشاريع متنوعة... لحلول مستدامة» + copy «من أنظمة الطاقة الشمسية إلى الحلول المائية والزراعية، نقدّم مشاريع متكاملة تصمّم بعناية لتناسب مختلف الاحتياجات والبيئات.» |
| 5.3 | Filter pills | `FilterPills` (centred) | جميع المشاريع (navy, active, grid icon) / الطاقة الشمسية (sun) / الأنظمة المائية (droplet) / القطاع الزراعي (leaf). Client-side filtering of the project rows below; the active pill is reflected in the URL (`?type=solar|water|agriculture`). **If no approved project exists for a filter, the filter shows the honest empty state (§5.4), never a fabricated project.** |
| 5.4 | Project rows | `ProjectRow[alternating]` ×4 — **HONEST EMPTY STATE INSTEAD** | **No client-approved project exists (CI-07). The four reference rows (rooftop PV / solar pumping / smart irrigation / commercial systems) are SAMPLE projects and must NOT be published as Ghamdan projects.** The builder implements the `ProjectRow` template + the filter pills + the gallery carousel shell, and renders the honest empty state: icon + H3 «مشاريعنا قيد التوثيق» + copy «نوثّق مشاريعنا المنفذة مع عملائنا قبل نشرها. للاستفسار عن مشروع مشابه، تواصل معنا عبر واتساب.» + WhatsApp button. The empty state is the CORRECT launch state. When CI-07 lands, rows render in this order with these images: rooftop PV `photos/villa-roof.jpg` / pumping `photos/pump-flow.jpg` / irrigation `photos/greenhouse.jpg` / commercial `photos/solar-farm.jpg`; each row = category label + icon + bold title + 2-line copy + underlined blue link «عرض المشروع ←» → `/projects/[slug]`. |
| 5.5 | Gallery | `GalleryCarousel` | 4 images in a row + round arrow buttons at both ends + dot pagination below (4 dots, first active). Images: `photos/solar-farm.jpg`, `photos/pump-flow.jpg`, `photos/pivot.jpg`, `photos/panels-rows.jpg`. Manual navigation only (arrows/dots/swipe); **NO autoplay** (the reference cannot prove autoplay; MOTION_SYSTEM.md forbids claiming it). Hidden entirely while the empty state is active? NO — the gallery is a generic showcase of the company's work areas and may render with the four photos + the caption «مشاهد من مشاريعنا» + the note «صور توضيحية لمجالات عملنا — مشاريع محددة قيد التوثيق». |
| 5.6 | CTA band | `CTA[features]` | H2 «لنبدأ مشروعك القادم معاً» + copy «تواصل معنا اليوم لمناقشة احتياجاتك والحصول على استشارة أولية حول أفضل الحلول لمشروعك في الطاقة الشمسية أو الهندسة المائية.» + white button «تواصل معنا الآن». 3 mini-features: خبرة متكاملة / حلول مخصصة / استشارة مجانية. |

### 3.6 Page 06 — Product detail `/products/[slug]` — ref `ui-reference-06-product-detail.jpg` — Hero `split`

Template for all 37 published products (`p01`–`p29`, `p31`–`p38`). `p30` (Hanwha Q-Cells) and `p39` (Wisenet) have NO pages (`awaiting_client_list`).

| # | Section | Component | Spec |
|---|---|---|---|
| 6.1 | Identity | `Breadcrumbs` + `ProductHero` | Breadcrumbs: الرئيسية › المنتجات › {category AR} › {product name}. Split: text right ~45% — extra-bold title = product name (e.g. «عاكس الطاقة الشمسية» for the reference inverter; real title = brand + model from `catalog.ts`, e.g. Deye SUN-SG04LP1 — 5kW), 2-line sub-copy (approved benefit), small thumbnail image (second angle — use the same product visual cropped; if no second image exists, OMIT the thumbnail, do not reuse the hero image at a different size as a fake "second angle"), navy button «تحميل كتيب المنتج» (document icon) — rendered ONLY when a brochure file exists in `public/downloads/`; otherwise the button is omitted entirely. Left ~55%: large product visual (`photos/inverter-unit.jpg` for inverters; `photos/battery-storage.jpg` batteries; `photos/panels-rows.jpg` panels; `photos/pump-flow.jpg` pumps; `photos/controller-unit.jpg` controllers) over a sky/rooftop background (`photos/villa-roof.jpg`, low-key). **No model number, brand, wattage, or price is shown unless it is in `catalog.ts` — and no value is ever guessed.** Gallery: main image + thumbnail strip (when ≥2 real images exist); click opens `Lightbox`; no autoplay. |
| 6.2 | Overview | `EditorialBlock` | Image left `photos/villa-roof.jpg` (~16:10); text right on `--color-surface-muted` panel: H3 «نظرة عامة على المنتج» + approved overview copy (3 lines max). If no approved overview exists, this section is omitted (not filled with generic text). |
| 6.3 | Key features | `FeatureList[4col]` | H3 «المميزات الرئيسية» centred; 4 columns with icons + hairline dividers. Reference set (inverter): أداء مستقر وموثوق (gear; «تشغيل آمن ومستمر في مختلف الظروف») / كفاءة عالية (bars; «تحويل مثالي للطاقة مع أقل فقد») / حماية متكاملة (shield; «مزايا أمان متعددة لضمان استمرارية التشغيل») / متوافق مع تطبيقات متعددة (grid; «مناسب للمشاريع السكنية والتجارية والصناعية»). **Features are per-product from `catalog.ts` (`benefits`); the reference's four are the template default ONLY for inverters without confirmed benefits — and only as layout placeholders, never published as verified claims. If a product has no confirmed benefits, this section is omitted.** |
| 6.4 | Spec table | `SpecTable` | Light-grey panel: product image left (`photos/inverter-unit.jpg` etc., ~4:5), spec table right. Rows come ONLY from `catalog.ts` `specs_rows` (manufacturer values, verbatim, with units and model identifiers). Reference rows (10): الموديل / نوع العاكس / مدى جهد الإدخال / جهد الإخراج / الكفاءة / طرق الاتصال / درجة الحماية / بيئة التشغيل / الأبعاد / الوزن. **A row with no confirmed value is OMITTED — never shown with "—" (the reference's dashes are placeholders, not data).** The old build's spec table (7 rows: brand, model, category, subcategory, type, battery, usage) is the minimum viable set; the builder extends it from `specs_rows` where present. Add the note under the table: «المواصفات الكاملة تُرفق عند الطلب عبر واتساب» + WhatsApp button, ONLY when the full datasheet is not yet published (CI-06). |
| 6.5 | Downloads & warranty | `DownloadItem` + warranty line | Downloads list (datasheets, certificates) — rendered ONLY for files present in `public/downloads/` with approved labels; otherwise the section is omitted. Warranty: ONE line with the centrally-managed text from settings: «نص الضمان الموحد قيد الاعتماد من العميل.» (CI-08) + link «صفحة الدعم والضمان» → `/support`. **Never publish a warranty duration.** |
| 6.6 | Related | `RelatedProducts` (3 cards) | 3 `ProductCard[compact]` from the same category/brand (image top ~16:9, bold title, 1–2 line copy, blue link «عرض المنتج ←»). Reference shows panels / storage / solar-water-heating — **solar water heating is NOT in the approved catalogue, so it must NOT appear**; related cards are drawn from real catalogue data only. If fewer than 3 related products exist, show what exists (no filler). |
| 6.7 | CTA band | `CTA[features]` | Photo left `photos/panels-rows.jpg`; text right: H3 «تحدث مع أحد خبرائنا الآن» + «احصل على استشارة مجانية لمشروعك» + white WhatsApp button (contextual product message, §2.5). 3 mini-features: استشارة مجانية / إرشاد متخصص / حلول مخصصة. |
| 6.8 | Sticky bar | `StickyWhatsAppBar` | Mobile only (§2.10), product name + green WhatsApp button. |

### 3.7 Page 07 — Contact `/contact` — ref `ui-reference-07-contact.jpg` — Hero `side-right`

| # | Section | Component | Spec |
|---|---|---|---|
| 7.1 | Hero | `Hero[side-right]` | Full-bleed `photos/house-bright.jpg` (bright house + panels; fallback `photos/villa-roof.jpg`). Text right-aligned: huge H1 «تواصل معنا» (single word, largest on the page) + 2-line copy «نحن هنا للاستماع إلى احتياجاتك وتقديم الحلول المناسبة لمشاريع الطاقة الشمسية والمياه والزراعة.» + navy WhatsApp button «ابدأ محادثة واتساب ←» (WhatsApp icon). **Header on this page: logo at the RTL START (right in AR) as on every page — the reference's left-side logo (07 only) is a reference inconsistency, do not copy.** |
| 7.2 | Contact methods | `ContactMethodCard` ×3 | Light-grey panels, rounded 14px; icon in pale-blue circle; bold title; 2-line copy; blue text-link. (1) استشارة عبر واتساب (WhatsApp icon; «تحدث مباشرة مع فريقنا للحصول على استشارة سريعة ومخصصة.»; link «ابدأ محادثة واتساب ←» → wa.me with the general message). (2) استفسار عام (mail icon; «للاستفسارات العامة والشراكات وفرص الأعمال.»; link «أرسل استفسارك ←» → anchor to the form). (3) الدعم الفني (headset icon; «احصل على المساعدة من فريقنا الفني بخصوص الأنظمة والمنتجات والخدمات.»; link «تواصل مع الدعم الفني ←» → wa.me with the support message). **No phone number, e-mail, or street address is printed on the cards in the reference — in the build, the values ARE shown (they are approved contact data, §0.3.4) in the footer and in §7.5's side panel; the cards keep the reference layout (title + copy + link) and add the value as a second line under the title.** |
| 7.3 | Form block | 2-col: `SidePanel[photo]` left ~40% + `ContactForm` right ~60% | Side panel: tall sky-blue panel (`--color-surface-blue`), H3 «معاً نبني / مستقبل أكثر استدامة» + copy «حلول متكاملة للطاقة الشمسية والمياه والزراعة.» + photo at the bottom (`photos/panels-rows.jpg`). Form card «أرسل لنا رسالة» + copy «أخبرنا عن مشروعك أو استفسارك وسنتواصل معك في أقرب وقت ممكن.» Fields (labels above, required `*` red): الاسم الكامل * / البريد الإلكتروني * (side by side) / نوع الاستفسار * (select: «اختر النوع» — options: استفسار عن منتج / استفسار عن نظام جاهز / طلب صيانة / دراسة نظام لمنشأة / استشارة اختيار نظام / استفسار عام — these six match the study's inquiry types, REQ-WA-003) / رسالتك * (textarea, placeholder «اكتب رسالتك هنا...»). Full-width navy submit «إرسال الرسالة ←». **Behaviour: submit opens WhatsApp with the prepared contact message (§2.5) — it does NOT send e-mail and does NOT claim to. Client-side validation (name ≥2 chars, valid e-mail, type selected, message ≥10 chars); inline errors next to the field; on success show the WhatsApp link + a success note and record the inquiry in `localStorage` (shown in admin demo §6). No map block (none shown; prompt allows a map only with verified location data — none is supplied, O-MAP).** |
| 7.4 | CTA band | `CTA[features]` | Photo left `photos/panels-rows.jpg`; H2 (2 lines) «لنناقش مشروعك / ونحوّل رؤيتك إلى واقع» + copy «سواء كنت فرداً، شركة، أو جهة حكومية، فإن فريقنا جاهز للاستماع إلى احتياجاتك وتقديم الدعم المناسب لمشروعك.» + white WhatsApp button «ابدأ محادثة واتساب». 3 mini-features: حلول مخصصة / خبرة موثوقة / استشارة مجانية. |
| 7.5 | Working hours / address | (in footer + TopBar only) | Hours and address are NOT a separate section on this page (the reference has none). They appear in the TopBar, footer column 4, and as the second line of the method cards (§7.2). |

### 3.8 Page 08 — Product category `/products/category/[slug]` — ref `ui-reference-08-product-category.jpg` — Hero `split`

The 8 category slugs (from old `data.js`, verified): `inverters` المحولات الهجينة والانفرترات / `batteries` بطاريات الليثيوم والتخزين / `panels` الألواح الشمسية / `pumps` المضخات الشمسية وأنظمة الري / `controllers` منظمات الشحن والملحقات / `systems` الأنظمة الجاهزة (الباقات) / `storage-ci` التخزين التجاري والصناعي / `cameras` كاميرات المراقبة والأمن.

| # | Section | Component | Spec |
|---|---|---|---|
| 8.1 | Hero | `Hero[split]` + `Breadcrumbs` | Split hero with a product still-life photo spanning the left/background: `photos/panels-rows.jpg` for `panels`, `photos/inverter-unit.jpg` for `inverters`, `photos/battery-storage.jpg` for `batteries`/`storage-ci`, `photos/pump-flow.jpg` for `pumps`, `photos/controller-unit.jpg` for `controllers`/`cameras`, `photos/solar-farm.jpg` for `systems`. Text right: breadcrumbs الرئيسية › منتجاتنا › {category}; H1 (2 lines) = category name + «لحلول أكثر استدامة» (e.g. «الطاقة الشمسية / لحلول أكثر استدامة»); 2-line copy (category description from `catalog.ts` `note_ar`); navy button «طلب استشارة ←» (wa.me, category message). **O-IMG-08: no single existing photo matches the reference's still-life (two panels + two white inverters + house). Do NOT composite a fake still-life; use the per-category photo above full-bleed in the split hero.** |
| 8.2 | Category tabs | `CategoryTabs` (6 items in the reference — BUILD 8) | All 8 categories as tabs with icons + hairline dividers; active tab = pale-blue fill. First tab = «جميع المنتجات» (grid icon) → `/products`. The reference's 6 tabs (all / panels / inverters / storage / mounting / accessories) do not match the approved 8-category tree — use the 8. On mobile the tabs scroll horizontally. |
| 8.3 | Filter bar | `Filters[bar]` | Light-grey rounded panel: «تصفية المنتجات» + funnel icon; selects: نوع المنتج «جميع الأنواع» / العلامة التجارية «جميع العلامات التجارية»; search input «البحث في المنتجات...» (magnifier). Filter values come ONLY from products actually in this category (brand / power-capacity / system type / usage / availability per prompt §8.1; a filter value with zero matching products is not shown). Filters are reflected in the URL (`?brand=…&type=…&q=…`) so they are shareable and indexable. **This filter bar must work on category pages — the old build's filters worked only on `catalog.html`/`search.html` and were absent from category pages (SITE_MAP §1, row 08). That is a defect to fix, not to copy.** |
| 8.4 | Result meta | `ResultMeta` + `SortSelect` | Right: «عرض {n} من {m} منتج» (real counts from the query); left: «الترتيب حسب: الأحدث» (select: الأحدث / الأكثر طلباً — default الأكثر طلباً then الأحدث per the study; «الأكثر طلباً» ordering basis is CI-13 pending, so until then the default sort is الأحدث and the select shows only الأحدث + الاسم أ–ي). The reference says "12 of 24" while showing 8 cards — **do not copy the numbers; show the true counts.** |
| 8.5 | Product grid | `ProductGrid[4col]` + `ProductCard` (paginated, 12 per page) | Cards = PRODUCTS (per prompt §8.2), not sub-categories. The reference's 8 cards are sub-categories — that is a reference inconsistency, resolved in favour of the prompt. Each card: image top (~4:3) on light-grey, bold title, 1–2 line grey caption, full-width navy button «طلب استشارة ←» (wa.me, product message) + «التفاصيل» text-link. Pagination below the grid (numbered + prev/next); empty category (e.g. `storage-ci` with 0 published products) renders the honest empty state «لا توجد منتجات منشورة في هذه الفئة بعد» + link back to `/products` — the category page itself still exists (it is in the plan), but it never shows an empty grid as if products existed. |
| 8.6 | Related categories | `RelatedCategories` (4 cards) | Heading right «فئات ذات صلة» + link left «عرض جميع الفئات ←» → `/products`. 4 cards (image top ~16:9 + bold title + blue link «استكشف الفئة ←»): the reference's four (الطاقة للمنازل / الطاقة للمنشآت التجارية / الطاقة للمشاريع الكبرى / حلول التخزين) are USE-CASE groupings, not categories — build them as filtered views: homes → `/products?usage=home` (image `photos/villa-roof.jpg`) / commercial → `?usage=commercial` (`photos/solar-farm.jpg`) / large projects → `?usage=large` (`photos/solar-farm.jpg`, different crop) / storage → `/products/category/batteries` (`photos/battery-storage.jpg`). |
| 8.7 | CTA band | `CTA[whatsapp]` | WhatsApp icon in a blue rounded square + H3 «تحدث مع خبرائنا عبر واتساب» + copy «احصل على استشارة سريعة ومخصصة لمشروعك» + white button «بدء المحادثة ←». 3 mini-features: إجابات سريعة / استشارات مخصصة / بدون أي التزام. Photo right: `photos/panels-rows.jpg`. |

### 3.9 Page 09 — Solution detail `/solutions/solar-water-pumping` — ref `ui-reference-09-solution-detail.jpg` — Hero `side-right`

Template for all 5 solutions (§3.3.3); pumping is the fully-specified instance.

| # | Section | Component | Spec |
|---|---|---|---|
| 9.1 | Hero | `Hero[side-right]` + `Breadcrumbs` | Full-bleed `heroes/hero-pump-mountains.jpg` (fallback `photos/pump-flow.jpg`). Breadcrumbs top-right: الرئيسية › حلولنا › ضخ المياه بالطاقة الشمسية. Text right: H1 (2 lines) «حلول ضخ المياه / بالطاقة الشمسية» + 2-line copy «حلول متكاملة وموثوقة لتوفير المياه باستخدام الطاقة الشمسية لمختلف القطاعات.» + navy button «ناقش مشروعك معنا ←». **Nav: use the canonical nav (§2.3) — the reference's duplicate «الرئيسية» nav item is a defect, do not copy.** |
| 9.2 | Overview | `EditorialBlock` + `MiniFeatures[3]` | Image left `photos/pump-flow.jpg` (~16:10); text right: pill «نظرة عامة»; H3 «مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.»; copy (3 lines, SAMPLE); then 3 mini-features in a row: زراعة أكثر إنتاجية (leaf; «توفير مياه موثوقة للري ودعم الأمن الغذائي.») / مجتمعات أقوى (people; «حلول مياه مستدامة للقرى والمناطق النائية.») / بيئة أنظف (leaf; «طاقة نظيفة تقلل الانبعاثات وتحافظ على الموارد الطبيعية.»). |
| 9.3 | Challenges | `ChallengeList[4col]` on `--color-surface-blue` band | Heading right + pill «التحديات التي نحلها»: H3 «معالجة التحديات الحقيقية في توفير المياه» + copy «نقدّم حلولاً عملية للتغلب على التحديات التي تواجه توفير المياه في المواقع البعيدة والمناطق الزراعية وشبكات المياه المحدودة.» 4 columns (blue icon in white circle, bold title, 2-line copy): الاعتماد على الوقود الأحفوري (gear; «تقليل التكاليف والتأثير البيئي.») / صعوبة الوصول لشبكات الكهرباء (pin; «أنظمة مستقلة للعمل في المناطق النائية.») / ارتفاع تكاليف التشغيل (coins; «حلول منخفضة الصيانة وتكلفة تشغيل أقل.») / نقص إمدادات المياه الموثوقة (droplet; «ضخ ثابت ومستمر لتلبية الاحتياجات.»). |
| 9.4 | Steps | `SolutionSteps[4]` | Heading right + pill «كيف يعمل النظام»: H3 «أربع خطوات لحل متكامل» + copy «نظامنا المتكامل يحوّل أشعة الشمس إلى مياه موثوقة بكفاءة عالية وبطريقة سهلة.» 4 step cards numbered **01–04 RTL** (blue number badge top corner), product image, bold title, 2-line copy, left-pointing arrow between cards: 01 الطاقة الشمسية (`photos/panels-rows.jpg`; «تلتقط ألواح الشمسية أشعة الشمس وتولّد الكهرباء») / 02 جهاز التحكم (`photos/controller-unit.jpg`; «ينظّم الطاقة ويشغّل المضخة بكفاءة عالية.») / 03 مضخة المياه (`photos/pump-flow.jpg`; «تحوّل الطاقة الكهربائية إلى ضخ مستمر للمياه.») / 04 توزيع المياه (`photos/pivot.jpg`; «نقل المياه إلى خزانات وشبكات التوزيع للاستخدام المباشر.»). |
| 9.5 | System diagram | `SystemDiagram` (code-built SVG/HTML — NEVER a screenshot of the reference) | Full-width, pale-blue band. Heading right: pill «المكونات الرئيسية» + H3 «نظام متكامل وموثوق» + copy «نستخدم مكونات عالية الجودة ومصممة للعمل معاً لضمان أداء مستقر وطويل العمر.» Diagram (left-to-right in RTL flow): ألواح شمسية → جهاز التحكم → مضخة المياه (submersible, in a well cutaway) → خزان المياه (on a tower) → شبكة التوزيع → crops. Labels in AR (EN/ZH on locale switch). Built as inline SVG with labelled nodes + connecting pipes/arrows; each node links to its product category. Include the caption «مخطط توضيحي مبني بالكود — ليس صورة». Components listed are ONLY approved catalogue items (CI-02/CI-03); no quantities, no sizing data. |
| 9.6 | Applications | `ApplicationCard` ×3 | Heading right «مياه تدعم الحياة والتنمية» + copy «تُستخدم حلولنا في مجموعة واسعة من القطاعات لتحقيق أثر أكثر استدامة.» 3 image cards with dark overlay captions at the bottom: الزراعة والري (`photos/greenhouse.jpg`) / إمدادات المياه للمجتمعات (`photos/pump-flow.jpg`, different crop) / مشاريع البنية التحتية للمياه (`photos/solar-farm.jpg` — no tank/infrastructure photo exists; O-IMG-INFRA). |
| 9.7 | Related | 2 panels side-by-side | Right panel «منتجات مكملة لحلول متكاملة» (3 small cards: أنظمة الطاقة الشمسية `photos/panels-rows.jpg` / خزانات المياه — NO photo exists; use `photos/pump-flow.jpg` crop and mark O-IMG-TANK / أنظمة الري والتوزيع `photos/pivot.jpg`; each with title + blue link «اعرف المزيد ←»). Left panel «قصص نجاح ملهمة» (1 wide image card `photos/pivot.jpg` + blue link «استكشف المزيد من المشاريع ←» → `/projects`). **The "success story" panel links to the projects listing (which shows the honest empty state until CI-07) — it must NOT present a fabricated success story.** |
| 9.8 | CTA band | `CTA[whatsapp]` | Green WhatsApp icon in a rounded square + heading «استفسر عن مشروعك» + «تواصل معنا عبر واتساب» + copy «فريقنا جاهز للإجابة على استفساراتك ومساعدتك في اختيار الحل الأنسب لاحتياجاتك.» + white button «مراسلتنا على واتساب ←». Photo right: `photos/pump-flow.jpg`. |
| 9.9 | Footer | `Footer[4col]` | Canonical footer (§2.7). The reference's footer is truncated at the image edge (and shows a garbled sample address «+45 Power Avenue, Streng…» — gibberish, never use). |

### 3.10 Page 10 — Project detail `/projects/[slug]` — ref `ui-reference-10-project-detail.jpg` — Hero `side-right`

**Template only. No real project is published (CI-07).** The reference project is explicitly «مشروع نموذجي» (sample project). The builder implements the full template and renders it ONLY for approved projects; until then `/projects/[slug]` for any slug returns the projects listing empty state (not a fabricated project page). The spec below defines the template for when CI-07 lands.

| # | Section | Component | Spec |
|---|---|---|---|
| 10.1 | Hero | `Hero[side-right]` + `Breadcrumbs` + `StatusPill` | Full-bleed `heroes/hero-villa-mountains.jpg` (fallback `photos/solar-farm.jpg`). Breadcrumbs: الرئيسية / مشاريعنا / {project name}. Pill «مشروع نموذجي •» (green dot) — shown ONLY if the project genuinely is a sample/template; a real project never carries this pill. H1 (2 lines, right-aligned) = project name (reference: «مشروع نظام طاقة شمسية / للمياه والزراعة») + 2-line copy. **Note: the reference screenshot has black vertical bars (~70px each side) — that is a property of the supplied image, not the design; the build uses the full viewport width.** Header on this page: the reference shows TWO header buttons («تواصل معنا» outlined + «ابدأ مشروعك» navy) — implement ONE header CTA (navy WhatsApp, §2.5) as on every page; the second button is a reference inconsistency. |
| 10.2 | Overview + location | `EditorialBlock` + `InfoCard[location]` | Text right: H3 «نظرة عامة على المشروع» + approved overview copy. Info card left (light-grey, pin icon): «الموقع» + the confirmed location — **the reference's value is the literal placeholder «موقع المشروع»; in the build the card is OMITTED unless a real location is confirmed (CI-07).** Never render a placeholder as a value. |
| 10.3 | Challenge | `EditorialBlock` (image left `photos/solar-farm.jpg`) | H3 «التحدي» (exclamation icon in blue circle) + documented challenge copy — rendered ONLY when documented; otherwise omitted. |
| 10.4 | Engineering solution | `EditorialBlock` (image right `photos/pump-flow.jpg`) | H3 «الحل الهندسي» (gear icon) + documented solution copy — rendered ONLY when documented; otherwise omitted. |
| 10.5 | Equipment + scope | 2 panels side-by-side | «المعدات المستخدمة» (3 product tiles with cut-outs: الألواح الشمسية `photos/panels-rows.jpg` / مضخات المياه `photos/pump-flow.jpg` / أنظمة التحكم والمراقبة `photos/controller-unit.jpg` — each tile links to its product/category) + «نطاق الأعمال المنفذة» (list icon, 3-line copy of the approved scope). Both panels render ONLY from approved project data. |
| 10.6 | Gallery | `Gallery` + `Lightbox` on `--color-surface-blue` band | H3 «معرض صور المشروع» + 4 images in a row + round arrow buttons (`photos/solar-farm.jpg`, `photos/pump-flow.jpg`, `photos/panels-rows.jpg`, `photos/pivot.jpg` as the template set; real project media replaces them on approval). Manual navigation; no autoplay; lightbox with captions. |
| 10.7 | Outcomes | `Outcomes[4col]` | H3 «أبرز النتائج» + 4 grey cards (icon + bold title): دعم المجتمعات المحلية / موثوقية عالية / تحسين الكفاءة التشغيلية / أثر إيجابي على البيئة. **Titles only, no numbers — the reference has no measured outcomes, and the builder must NOT add figures.** If no verified outcome exists for a card, the card is omitted. |
| 10.8 | Related | `RelatedProducts[horizontal]` (3 cards) | Horizontal cards (image left, title + 1-line copy + blue link «تعرف على المزيد ←» right): الألواح الشمسية / مضخات الطاقة الشمسية / أنظمة التحكم الذكية — from real catalogue data. |
| 10.9 | CTA band | `CTA` | Photo background `photos/solar-farm.jpg` + navy overlay; H3 «نحو مستقبل أكثر استدامة» + copy «تواصل معنا لمناقشة مشروعك واكتشاف كيف يمكن لحلول الطاقة الشمسية أن تلبي احتياجاتك.» + white button «تواصل معنا ←». |

---

## 4. Pages with NO reference image (base each on the nearest reference, same design language)

General rule for all of §4: same tokens (§1), same header/footer/CTA band (§2), same hero variants, same card geometry. No new visual identity. Every page's H1, intro, and CTA use the copy keys named; body copy is SAMPLE until CI-07/CI-09. Every page that has no approved content renders its honest empty state — never an empty grid, never a fabricated list.

### 4.1 Services `/services` — base: ref 03 editorial rows + ref 06 feature columns

- Hero `side-right`, photo `photos/solar-farm.jpg`: H1 «خدماتنا» / EN "Our services" + copy «خدمات هندسية متكاملة — من التصميم إلى التشغيل وما بعده.» (SAMPLE).
- Service list (only client-confirmed services, CI-07): each service = `EditorialBlock` alternating row with pill + H3 + copy + navy button «استفسر عبر واتساب ←». Candidate services from the old build (structure only, text pending approval): التصميم والدراسة / التوريد / التركيب / الصيانة والدعم / الضخ والري / الاستشارات. **Do not invent service guarantees, response times, or coverage areas.**
- Each service card links to its related products/systems where relevant + one WhatsApp CTA per service (support message, §2.5).
- If no service is confirmed: honest empty state «خدماتنا قيد التوثيق» + WhatsApp button. (The old build listed 6 services as structure — the v2 build keeps the 6 rows as the template set with SAMPLE copy flagged, and hides any row whose content is not approved. Do not publish the old build's service text as approved.)

### 4.2 Support & warranty `/support` — base: ref 07 contact-method cards + ref 06 spec-table panel

- Hero `side-left`, photo `photos/panels-rows.jpg`: H1 «الدعم والضمان» / EN "Support & warranty".
- Three `ContactMethodCard`s (as §3.7.2): استشارة واتساب / استفسار عام (form anchor) / الدعم الفني.
- Warranty panel (`SpecTable`-style light-grey panel): H3 «الضمان الموحد» + the centrally-managed text: «نص الضمان الموحد قيد الاعتماد من العميل.» (CI-08) + link to the warranty terms when approved. **No duration, no coverage list, no "lifetime/3-year/5-year" claim — the old site's lifetime claim and Facebook's 3yr/5yr conflict is unresolved and must NOT appear.**
- Support form: same fields as the contact form (§3.7.3) with inquiry type pre-set to «طلب صيانة» / «دعم فني», submitting to WhatsApp (support message). Maintenance-request and facility-study-request flows open the same WhatsApp handoff with the request type in the message (REQ-WA-004).
- FAQ: none. (The old build added 4 FAQs to the contact page that are not in the reference — do NOT copy them into v2.)

### 4.3 News & events `/news`, `/news/[slug]` — base: ref 05 project rows + ref 09 application cards

- Hero `side-right`, photo `photos/solar-farm.jpg`: H1 «الأخبار والفعاليات» / EN "News & events".
- Listing: `NewsCard` grid (3-col: image top ~16:9, date, category tag, bold title, 2-line excerpt, blue link «اقرأ المزيد ←»). **No approved news exists (CI-07) — launch state is the honest empty state «لا توجد أخبار منشورة بعد» + WhatsApp button.** Article template (`/news/[slug]`): hero image, H1, date, body, related articles (3). Dates are required on every published article; no article is published without a date.
- Events: same listing with date + location (location only when confirmed). No fabricated event.

### 4.4 Agencies `/agencies`, `/agencies/[slug]` — base: ref 04 category strip + ref 08 related categories

- Hero `split`, photo `photos/panels-rows.jpg`: H1 «وكالاتنا وعلاماتنا» / EN "Our agencies & brands".
- Listing: `AgencyCard` grid (3-col): brand name (text wordmark — **no logo image is used; no official logo file exists, CI-04/CI-06**), representation status line, product families, link «عرض منتجات العلامة ←» → filtered catalogue. 6 agencies from `catalog.ts`: Deye (status: «وكيل رسمي في اليمن» — confirmed), EFORE / MUST / Jntech / Hanwha Q-Cells / Wisenet (status: «علامة معروضة — صفة الوكالة قيد الاعتماد», CI-04). **Never claim exclusive agency, official distributor, or authorised representative for any brand without documentary evidence. LM PACK is listed under Shenzhen Kexin, NOT EFORE (§0.3.6).**
- Agency detail: brand name + representation status + product families + related products (from catalogue) + certificates/downloads section (rendered ONLY when certificate files exist in `public/downloads/`). No logo redraw, no recolour, no invented certificate.

### 4.5 Ready-made systems `/systems`, `/systems/[slug]` — base: ref 09 solution detail (steps + diagram + components)

- Listing hero `side-right`, photo `photos/solar-farm.jpg`: H1 «الأنظمة الجاهزة» / EN "Ready-made systems". 4 `PackageCard`s (2-col grid): each = image, name, "who it suits" line, component summary (model names only), ONE WhatsApp button «استفسر عن النظام ←» (package message, §2.5). **No price, no discount, no savings claim.**
  - `bundle-1` منزل صغير: انفرتر Deye 6kW + بطارية Deye SE-F5 Pro-C 5kWh. Use: «شقة/منزل صغير — إضاءة ومراوح وشاشة وثلاجة». Image `photos/inverter-unit.jpg`.
  - `bundle-2` منزل متوسط: انفرتر Deye 6kW + بطارية EFORE 10kWh. Use: «منزل متوسط — تخزين أكبر لليل». Image `photos/battery-storage.jpg`.
  - `bundle-3` منزل / تجاري كبير: انفرتر Deye 8kW + بطارية 16kWh (brand UNCONFIRMED — show «بطارية 16kWh» with NO brand name until CI-03 confirms). Use: «منزل كبير أو محل/مكتب». Image `photos/solar-farm.jpg`.
  - `bundle-4` باقة رمضان (سابقة): status `archived` — listed in a separate «باقات سابقة» row, visually muted, labelled «باقة موسمية سابقة — غير متوفرة», no WhatsApp CTA. Components: انفرتر MUST 5kW + 4 بطاريات MustPower 200Ah + 8 ألواح 360W.
- System detail (`/systems/[slug]`): same template as §3.9 (hero + overview + 4 steps + component list with images + "who it suits" + package FAQs if supplied + ONE WhatsApp CTA + sticky mobile bar). Component list = approved components + models ONLY (CI-03); «what it usually powers» only if verified. No component quantities are invented.

### 4.6 Downloads `/downloads` — base: ref 06 download button + spec panel

- Hero `split`, photo `photos/panels-rows.jpg`: H1 «مركز التنزيلات» / EN "Downloads".
- `DownloadItem` list grouped by type (datasheets / certificates / warranty documents / company documents): each item = document icon, title, file type + size, download button. **Only files present in `public/downloads/` with approved labels are listed. Launch state (no files approved, CI-06): honest empty state «لا توجد ملفات منشورة بعد».** No placeholder file rows. File validation on upload (later Filament track): MIME/type/size checks — v2 has no upload, so this is a display-only rule.

### 4.7 Legal `/privacy`, `/terms` — base: footer legal links (all pages)

- Hero: none (no photo hero — legal pages use a plain `SectionHeading[start]` + body). H1 «سياسة الخصوصية» / «الشروط والأحكام». Body = approved legal text ONLY (CI-10). **Launch state: the pages exist and are linked from the footer, but render the honest notice «النص القانوني قيد الاعتماد وسيُنشر بعد موافقة العميل.» — never a drafted legal text presented as the company's policy.** No invented clauses.

### 4.8 Search `/search` — base: ref 04 search input + ref 08 result meta

- Hero: none (compact `SectionHeading[start]` + `SearchInput`, large). Searches products (37 published), categories (8), solutions (5), systems (4), projects (approved only), news (approved only) — across AR/EN/ZH titles and model names/codes (e.g. `SUN-SG04LP1` must match). Live suggestions (mini-cards) while typing; Enter shows the results page with `ResultMeta` («عرض {n} من {m} نتيجة») + `SortSelect` + `ProductCard` grid + grouped results for non-products. Empty query → empty state with search tips. No result → «لا توجد نتائج مطابقة لـ "{q}"» + suggested links. Search usage is recorded (localStorage, shown in admin statistics).

### 4.9 Pumping guidance tool `/guidance` — base: ref 09 system diagram + steps

- Hero `side-left`, photo `photos/pump-flow.jpg`: H1 «دليل الضخ» / EN "Pumping guidance".
- Guided form (3 fields, labels + units + help text, required validation, inline errors): (1) عمق البئر (m, number, 1–300) (2) كمية المياه اليومية (m³/day, number, 0.5–500) (3) نوع الاستخدام (select: ري زراعي / مياه شرب للمجتمع / مياه للمواشي / استخدام تجاري/صناعي / استخدام منزلي). Review step showing the three values, then a green WhatsApp button «أرسل عبر واتساب» (guidance message, §2.5) + a note «سيقوم فريقنا الهندسي بمراجعة بياناتك وتصميم النظام المناسب.»
- **Safety copy (mandatory, above the form):** «أداة إرشاد أولية وليست حساباً معتمداً لتحجيم المضخات. لا نوصي بموديل محدد ولا نعد بنتيجة هيدروليكية من هذه البيانات.» (REQ-WA-006, CI-14). No model recommendation, no hydraulic result, no sizing claim — ever.
- On submit: record the guidance event (localStorage, admin statistics) and focus the WhatsApp link.

### 4.10 404 + error states — base: global header/footer

- `/404`: `SectionHeading[center]` H1 «الصفحة غير موجودة» (404, large, muted) + copy «يبدو أن الرابط غير صحيح أو أن الصفحة نُقلت.» + buttons: «العودة للرئيسية» (navy) + «تواصل عبر واتساب» (outlined). Same header/footer/drawer as every page. No auto-redirect. Error state (500): same shell + «حدث خطأ — حاول مرة أخرى» + home link. Loading state: skeleton shaped like the content (no spinner-only page). All three states respect `prefers-reduced-motion` and are visible without JS.

---

## 5. Motion spec — GSAP + Lenis (concrete, testable)

**Stack:** GSAP 3 + ScrollTrigger (bundled via npm, no CDN, no separate vendor file that can 404) + Lenis smooth scroll. CSS transitions for simple hover/focus states. No other animation library.

### 5.1 Principles (non-negotiable)

1. Motion is an enhancement layer: it must not change layout, section order, content hierarchy, or visual identity.
2. **Content is visible without JS.** Default CSS: `.reveal { opacity: 1; transform: none; }`. Only when JS runs and adds `html.js` does `.js .reveal { opacity: 0; }` apply, and GSAP then animates it in. If GSAP fails to load, the IntersectionObserver fallback (§5.4) reveals everything. If JS is absent entirely, everything is visible. **Test: disable JS → every page fully readable, no invisible section.**
3. `prefers-reduced-motion: reduce` kills ALL motion (§5.4).
4. Prefer opacity + transform only. No layout shift (no animating width/height/margin). No scroll hijacking. No perpetual decorative movement except the marquee (which stops under reduced-motion). No autoplay carousels. No parallax on mobile.
5. Count-up: implemented but DISABLED — there is no verified number to count (no founded year, no project count). The `data-count` hook exists; no element uses it until a verified number is approved.

### 5.2 Timing scale (the ONLY durations in the build — do not invent others)

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 200ms, `ease-out` | Hover/focus, button state, tab switch |
| `--dur-base` | 350ms, `cubic-bezier(0.22,1,0.36,1)` | Drawer slide, lightbox open, accordion |
| `--dur-reveal` | 700ms, `power3.out` | Section reveal (fade + rise) |
| `--dur-stagger` | 600ms, `power3.out`, stagger 0.08s | Card/icon grids entering the viewport |
| `--dur-hero` | 500ms, `power3.out` | Hero text entrance on load (badge → H1 → copy → CTA, stagger 0.1s) |
| `--dur-marquee` | 30s, `linear`, infinite | Marquee track (CSS only) |
| `--dur-gallery` | 400ms, `ease-out` | Gallery/lightbox image crossfade |
| `--dur-header` | 250ms, `ease` | Header transparent → solid |
| `--dur-count` | 900ms | Count-up (disabled until a verified number exists) |
| Lenis | `lerp: 0.1`, `smoothWheel: true` | Smooth scroll, desktop only |

### 5.3 Motion map by component

| Component | Motion | Trigger |
|---|---|---|
| Header | Background + shadow fade, height 76→72px (`--dur-header`) | Scroll > 24px |
| Hero (all variants) | Image: scale 1.04→1.00 + fade, `--dur-hero`; text: fade + rise 16px, stagger 0.1s, `--dur-hero` | Page load (not scroll) |
| Section reveal (`.reveal`) | GSAP `fromTo {opacity: 0, y: 24} → {opacity: 1, y: 0}`, `--dur-reveal`, ScrollTrigger `start: "top 88%"`, `once: true` | Scroll into view |
| Card/icon grids (`[data-stagger]`) | Children `fromTo {opacity: 0, y: 20}`, `--dur-stagger`, stagger 0.08s, same trigger | Scroll into view |
| Editorial blocks | Image: clip/mask reveal (scale 1.02→1, fade); text: fade + rise 20px | Scroll into view; image and text animate independently (image first) |
| Cards (hover) | `translateY(-4px)` + shadow to `--shadow-card-hover`, `--dur-fast`; image inside scales 1.03 (overflow hidden) | Hover/focus-visible (desktop only; no hover-only information — the CTA is always visible) |
| Marquee | CSS `translateX(-50%)` loop, `--dur-marquee` | Always (stops under reduced-motion) |
| Gallery / lightbox | Crossfade `--dur-gallery`; lightbox panel scale 0.96→1 + fade `--dur-base` | Arrow/dot click; `Escape` closes |
| Process/steps | Number badge pops (scale 0.8→1, `--dur-base`) as each step reveals; connecting arrows draw (opacity) in sequence | Scroll into view |
| System diagram (09) | Nodes fade in left→right (RTL flow) in sequence, 0.12s apart; connecting pipes draw via `stroke-dashoffset` | Scroll into view, once |
| Drawer | Slide from RTL-start side, `--dur-base`; backdrop fade | Burger click |
| Sticky WhatsApp bar | Slide up from bottom, `--dur-base`, once per page view (appears when the hero CTA scrolls out of view on mobile) | Scroll |
| Form | Field error: shake is FORBIDDEN (no transform shake); error appears as red text + red border, `--dur-fast` fade | Validation failure |
| Language switch | Page content crossfades 200ms (opacity only) — no slide, no layout shift | Locale change |

### 5.4 Fallbacks and reduced motion (in order)

1. `prefers-reduced-motion: reduce` → all `.reveal` visible immediately, no GSAP initialisation, marquee animation `none`, Lenis disabled, `scroll-behavior: auto`. CSS:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
     .js .reveal { opacity: 1 !important; transform: none !important; }
     .marquee__track { animation: none !important; }
   }
   ```
2. GSAP/ScrollTrigger unavailable + IntersectionObserver available → add `.reveal--in` at 12% intersection, `unobserve` after first trigger.
3. No IntersectionObserver → reveal everything immediately.
4. No JS → content visible from CSS defaults (§5.1.2).
5. Lenis: disabled on touch devices and under reduced-motion; must not break anchor navigation or ScrollTrigger — wire `lenis.on('scroll', ScrollTrigger.update)` and drive ScrollTrigger from GSAP's ticker. If Lenis fails to load, native scroll applies and nothing breaks.

### 5.5 What is NOT animated (deliberate, per MOTION_SYSTEM.md)

- No hero parallax, no layered hero motion, no Ken Burns on hero images.
- No autoplay for any gallery/carousel.
- No count-up (no verified numbers).
- No scroll-triggered animation of spec-table data (technical data must stay readable).
- No pulsing CTA. No bouncy easing anywhere. No animation that delays first content (LCP hero text animates on load but is painted immediately if JS is slow — the hero is never hidden waiting for GSAP).

---

## 6. Admin demo spec — login-gated front-end demo (NO real CRUD)

**Scope match:** the old build's `admin/index.html` (196 lines, read in full). The v2 demo reproduces its scope exactly: login gate + 10 tabs + read-only tables + localStorage-backed demo state. **Full CRUD is a later Filament track — not this build.** The demo must be labelled as a demo on every screen.

### 6.1 Route, access, and honesty

- Route: `/[locale]/admin`. Not indexed (`robots.txt` disallow + `noindex` meta). Not linked from the public footer/nav (reachable only by direct URL).
- Login gate: e-mail + password form, Arabic-first. Demo credentials shown on the login screen (as the old build did): `admin@ghamdan-trd.com` / `admin123`. Client-side check only; on success set a `sessionStorage` flag `gts_admin_demo=1` and show the shell. On failure show «بيانات الدخول غير صحيحة — جرّب بيانات العرض التجريبية.» Logout clears the flag.
- **Honesty label (mandatory, on the login screen AND in the shell top bar):** «واجهة عرض تجريبية — الدخول محلي فقط، والبيانات تُحفَظ في متصفحك. ليست لوحة إدارة حقيقية ولا تحمي أي بيانات.» The password `admin123` is a demo value and must never be presented as secure; the real Filament admin (roles, permissions, audit log, backups) is a separate later track.
- Layout: RTL, dark right sidebar + top bar (WordPress-style, as the old build), matching the public design tokens (navy `#0F2E4D`, Tajawal). Sidebar width 240–260px, solid background, 1px border. No hero inside the admin. No glassmorphism, no metric-card grid as the default dashboard layout (no-slop-ui applies fully here — the public site's pills/gradient exceptions do NOT carry into the admin).

### 6.2 The 10 tabs (exact scope of the old build — 9 prompt units + overview)

| Tab | Content (read-only unless stated) |
|---|---|
| نظرة عامة (overview) | 3 stat cards (counts computed live from `catalog.ts`: published products / categories / systems) + "بوابات النشر" card explaining the 5 publication states with badges: `draft` مسودة / `awaiting_client_list` بانتظار العميل / `factory_catalog_verified` موثق من المصنّع / `confirmed` مؤكد من العميل / `archived` مؤرشف. Top-bar pill: «مسودة — لا شيء يُنشَر دون اعتماد». |
| المنتجات (products) | Table: product (brand + model) / category / status badge / spec count. Rows from `catalog.ts` (39 products incl. the 2 unpublished, shown with their status). Status change control (select) — demo only: updates `localStorage` and the overview counters immediately, does NOT publish anything (there is no backend). A note under the table: «التغيير يُحفَظ في هذا المتصفح (تجريبي)». |
| الباقات (packages) | Table: 4 bundles (name / components / status). Same demo status control as products. |
| المشاريع (projects) | Honest empty state: «لا مشاريع معتمدة بعد — المشاريع تُضاف هنا بعد اعتمادها وموافقة العميل على نشرها.» (No fake rows.) |
| الأخبار (news) | Honest empty state: «لا أخبار منشورة بعد — الأخبار تُضاف هنا بعد اعتمادها من غمدان.» |
| الوكالات (agencies) | Table: 6 agencies (brand / status: Deye «وكيل رسمي — مؤكد», others «قيد الاعتماد») / product families count. No logo images. |
| الخدمات (services) | Table: the 6 candidate services (§4.1) with status «قيد الاعتماد» (all). |
| الإحصائيات (statistics) | Two tables from `localStorage`: (1) WhatsApp clicks (`gts_wa_clicks`: source / type / page / locale / time — click counts only, never delivery/read); (2) last 10 contact-form inquiries (from `gts_inquiries`). Empty states when no data exists yet. |
| الإعدادات (settings) | Form (4 fields, pre-filled from settings): WhatsApp number (international, no `+`, default `967775800000`) / e-mail (`info@ghamdan-trd.com`) / address / working hours. Save → `localStorage` only + success note «حُفظت الإعدادات في هذا المتصفح (تجريبي)». **The public site does NOT read these demo values — the public site reads the build-time settings file. The demo settings tab is a UI preview of the later Filament settings screen, not a live control.** State this in a note on the tab. |
| المستخدمون (users) | Card: «حساب المدير التجريبي: admin@ghamdan-trd.com. إدارة المستخدمين الكاملة (الأدوات والصلاحيات) في نسخة Filament الخلفية.» No user list, no add/delete. |

### 6.3 Demo rules

- No network calls. No real authentication. No password hashing claim (do not mention hashing — there is none in the demo). No data leaves the browser. The demo must work with JS disabled? NO — the demo requires JS (login + tabs); with JS disabled it shows the login form with a note «تتطلب لوحة العرض تفعيل JavaScript». (This is the one place the no-JS rule does not apply — the PUBLIC site must still work without JS.)
- The admin shell reuses the public header/footer? NO — the admin has its own minimal shell (sidebar + top bar + logout). It does NOT include the public TopBar, floating WhatsApp button, or CTA band.

---

## 7. OPEN / UNCERTAIN items — what the builder must do for each

**Rule for every item:** honest empty state / omit / clearly-labelled pending placeholder. NEVER invent data. NEVER present a placeholder as real. Items marked BLOCKING stop only the affected page/section, never the whole build.

### 7.1 Client inputs CI-01–CI-17 (from `CLIENT_INPUT_REGISTER.md` — condensed; the register is authoritative)

| ID | Item | Builder action |
|---|---|---|
| CI-01 | Signed contract + written approval of study/quotation (both unsigned) | Not a build task. No launch commitment. Build proceeds; record the unsigned status in the handover notes. |
| CI-02 | Approved product/model lists + final category hierarchy | BLOCKING for catalogue content. Build templates + filters + search from `catalog.ts` (old-build data, flagged as carried-over pending re-confirmation). No category/product is published that is not in `catalog.ts`. |
| CI-03 | Approved components/models per package (4) | BLOCKING for package content. Build the 4 package templates from §4.5; `bundle-3` battery brand shown WITHOUT a brand name; no component list beyond `catalog.ts`. |
| CI-04 | Approved agency list + representation text + official logos/certificates | BLOCKING for agency claims. Agency pages use text wordmarks only; non-Deye agencies labelled «قيد الاعتماد»; no logo images anywhere. |
| CI-05 | Confirmed WhatsApp number / e-mail / hours / address | The build uses the settings values in §0.3.4 (Ahmed-verified, from old `settings.js`). If the client corrects them, change ONE file (`src/config/settings.ts`). No launch verification of the inquiry flow until confirmed. |
| CI-06 | Real product images + manufacturer spec files + original logo | BLOCKING for publishing products as "real". Use the 12 stand-in photos (§0.5) + «صورة توضيحية» caption on every product page; spec tables show only `specs_rows` values; missing rows omitted. |
| CI-07 | Approved company profile/copy, services, projects + images + permissions, news/events | BLOCKING for About/Services/Projects/News content. All copy in §3 is SAMPLE; projects + news launch as honest empty states (§3.5.4, §4.3). No project/client name or image is published without written permission. |
| CI-08 | Approved unified warranty text + duration + terms | BLOCKING for warranty claims. Show only «نص الضمان الموحد قيد الاعتماد من العميل.» + link to `/support`. No duration anywhere. |
| CI-09 | Approved AR/EN/ZH text + Chinese human reviewer | BLOCKING for ZH launch. ZH pages show AR original + the CI-09 banner (§0.7). EN is draft until approved. |
| CI-10 | Legal texts (privacy, terms) | BLOCKING for legal pages. Pages exist, linked, showing the «قيد الاعتماد» notice (§4.7). |
| CI-11 | Domain choice (ONE of `ghamdan-solar.com` / `ghamdan-energy.com`) + hosting tier | Not a build task. Deploy to the staging address; record that the offer expires 8 Dec 2026. |
| CI-12 | Brand identity confirmation (colours, fonts, logo use; gold?) | Build uses Option A (§1.1, D-RED). No gold element anywhere (gold appears 0 times in the sources). |
| CI-13 | Availability per product + "most requested" ordering basis | Availability line omitted unless confirmed; default sort = newest until the "most requested" basis is supplied. |
| CI-14 | Pumping guidance parameters / sizing-model confirmation | Build the guidance-only tool (§4.9) with the mandatory safety copy. No sizing claim. |
| CI-15 | Future payment/commerce decisions | Not a build task. All commerce disabled and invisible (§0.3.8). |
| CI-16 | Client materials delivered together (4-week clock start) | Not a build task. Record that no start date is set. |
| CI-17 | NEW LOGO (old GTS logo forgotten) | Build uses the typographic wordmark only (§0.3.5). When the new logo arrives, swap it in `components/Wordmark.tsx` only. |

### 7.2 Spec-specific open items (found during this study)

| ID | Item | Builder action |
|---|---|---|
| O-HERO | **The 3 AI heroes do not exist.** `ghamdan-website-v2/public/images/heroes/` is empty (verified 2026-11-14). | BLOCKING for exact-match heroes. Generate per §0.6. Until then use the named fallback photo per §3 and log each fallback as a deviation in the QA report. Never substitute a random stock photo. |
| O-BRAND | Red accent decision (Option A vs B) | Default Option A (§1.1). List as a decision for Ahmed; changing it later is a 4-token change only. |
| O-STACK | Laravel/Blade (prompt §15) vs Next.js (Ahmed's rebuild order) | Next.js wins (D-STACK, §0.2). Note the supersession in the handover. |
| O-IMG-08 | No photo matches ref 08's still-life (2 panels + 2 inverters + house) | Use the per-category hero photo (§3.8.1). Do NOT composite a fake still-life. |
| O-IMG-CAM | No camera photo exists (cameras category tile + hero) | Reuse `controller-unit.jpg` (different crop) as a stand-in, labelled illustrative. Real camera photo = CI-06. |
| O-IMG-TANK | No water-tank photo (ref 09 related product «خزانات المياه») | Reuse `pump-flow.jpg` crop as a stand-in, labelled illustrative. |
| O-IMG-INFRA | No water-infrastructure photo (ref 09 application card) | Use `photos/solar-farm.jpg` as a stand-in, labelled illustrative. |
| O-TRACTOR | Reference 04 lists a tractor («جرار زراعي») as a product | OMIT. Farm machinery is not in the approved catalogue. Do not show a tractor photo or card. |
| O-WATER-HEATING | Reference 06 related card «أنظمة تسخين المياه الشمسية» | OMIT. Not in the approved catalogue. Related cards come from real catalogue data only (§3.6.6). |
| O-SOCIAL | LinkedIn/YouTube URLs unverified (old build links generic homepages) | Omit LinkedIn/YouTube icons everywhere. Facebook + Instagram only. |
| O-MAP | No verified location/map data | No map block on the contact page. Address is text only. |
| O-COPY | All EN copy is draft; all ZH copy is pending human review | Ship EN as draft (flagged in handover); ZH shows AR + CI-09 banner. No machine ZH. |
| O-STATS | No verified numbers exist (no founded year, project count, client count) | No statistics section, no count-up, no "since" year anywhere. The string «1997» must not appear. |
| O-NAV | Desktop nav shows 7 items; drawer shows 10 | Deliberate (§2.3). Services/Agencies/News/Support are drawer + footer only on desktop. |
| O-FOOTER-YEAR | References show © 2024 / © 2025 | Compute the current year at render. Never hard-code. |
| O-GREEN-BTN | Green header WhatsApp button appears only on ref 03 | Implement green ONLY on `/solutions` (§3.3.6). Everywhere else navy. |
| O-REF-DEFECTS | Reference defects NOT to copy | Duplicate «بطاريات رصاصية» (04); duplicate «الرئيسية» nav (09); double-arrow hero button (03); "12 of 24" vs 8 cards (08); left-side logo (07); two header buttons (10); black side bars (10); garbled footer address (09); inconsistent sample phone numbers across images. All recorded in `REFERENCE_IMAGE_ANALYSIS.md` — none is reproduced. |

### 7.3 Acceptance checklist (the builder's definition of done — all must pass)

1. **Price scan:** zero prices on any public page, API response, metadata, structured data, sitemap, or WhatsApp message (except the single permitted sentence, §0.3.1).
2. **Reference fidelity:** visual QA side-by-side vs each of the 10 references (desktop 1440px + mobile 390px): section order, hero variant, card counts, grids, header/footer — mismatches listed with the reason (open item or approved deviation).
3. **Routes:** all routes in §0.8 resolve in AR/EN/ZH; no 404 except unknown slugs; language switch preserves the page.
4. **WhatsApp:** every CTA uses `wa.me/967775800000` with the correct prepared message in the page language; click recorded with source.
5. **No-JS:** with JS disabled, every public page is fully readable; navigation, forms (as WhatsApp links), and footer work.
6. **Mobile:** 390px — no horizontal overflow; drawer opens/closes (keyboard + touch); sticky bar only on product/system pages and never covering footer actions.
7. **Motion:** `prefers-reduced-motion` kills all motion; no invisible content if GSAP fails.
8. **Admin demo:** login gate works with the demo credentials; all 10 tabs render; no CRUD claims; demo labels present.
9. **Performance:** hero image ≤150KB (WebP); below-fold images lazy; no render-blocking third-party script; LCP hero not delayed by animation.
10. **No invented content:** no sample brand/contact, no fabricated project/news/product, no warranty duration, no year/count claim — verified by a content audit against CI-01–CI-17.

---

## 8. File map (what the builder creates — for orientation only, not a build order)

```text
ghamdan-website-v2/
  BUILD_SPEC.md                  ← this file
  src/
    app/[locale]/                ← routes per §0.8 (page.tsx per route)
    app/[locale]/admin/          ← admin demo (§6)
    components/                  ← §2 global + §2.11 shared components
    config/settings.ts           ← single source: WhatsApp, e-mail, address, hours, socials
    data/catalog.ts              ← migrated from old data.js (8 cats, 37 products, 4 bundles, 6 agencies)
    i18n/{ar,en,zh}.json         ← dictionaries per §0.7
    styles/tokens.css            ← §1 tokens (single source)
    lib/motion.ts                ← GSAP + ScrollTrigger + Lenis setup (§5)
    lib/whatsapp.ts              ← message builders + click recording (§2.5)
  public/
    images/photos/               ← the 12 photos (§0.5)
    images/heroes/               ← hero-villa-sea.jpg, hero-villa-mountains.jpg, hero-pump-mountains.jpg (§0.6)
    downloads/                   ← approved files only (§4.6; empty at launch)
    favicon.svg                  ← «غ» wordmark, navy on white
```

**End of spec.** Questions that this spec cannot answer are in §7 — ask Ahmed / the client; do not guess.
