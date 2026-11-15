# Component Library — GTS v15 (Phase 3: Design System & Shell)

**Status:** v15 Phase 3 · 2026-11-15 · Design System & Shell agent
**Sources:** `docs/design-tokens.md` (final tokens), `docs/design-system.md`
(components), `docs/brand-identity-lock.md` (logo), `docs/design-dna.md`.
**Scope:** every component touched or created in Phase 3, its variants,
states, and tokens used. Components outside Phase 3 ownership
(`Hero`, `Cards`, `CatalogueClient`, `ContactForm`, …) are NOT
re-documented here and NOT re-tokenised — see §9 for the interim state.

**Skills applied:** `frontend-design` (detect → plan → build → verify;
existing-system mode — the detected Tailwind v4 / GSAP / Lenis system is
deferred to, no new system introduced), `no-slop-ui`, `hallmark`
(Floor rules where they do not conflict with the boards), plus
`professional-design` and `ui-ux` (RTL by construction, ≥44px targets,
visible focus, honest states).

**Visual thesis:** board-faithful shell — opaque white header, navy
anchors, bright-blue primary actions, sky tints, generous whitespace,
Plex Arabic + Inter Latin, restrained motion (content visible by default).

---

## 1. Tokens as implemented (`src/app/globals.css`, Tailwind v4 `@theme`)

| Token | Value | Used as |
|---|---|---|
| `--color-primary` | `#0081FB` | Large text, icons, focus rings, non-text accents. **Never small body text (3.80:1).** |
| `--color-primary-hover` | `#0B70C9` | **Primary button fill** (5.03:1, AA); small-text links; active nav/language state |
| `--color-primary-active` / `--color-navy` / `--color-secondary` | `#102B46` | Headings, dark surfaces, secondary-button border/text, active button state |
| `--color-accent` | `#89E9F8` | Highlights only — never body text |
| `--color-sky` | `#DDF5FC` | Light-blue sections, hover tints, eyebrow pills, icon circles |
| `--color-background` / `--color-bg` | `#F4F6F8` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, header, footer |
| `--color-surface-elevated` | `#F6FAFC` | Cards on tinted backgrounds (mega-menu secondary column) |
| `--color-surface-muted` | `#EEF3F7` | Subtle wells, zebra rows (retained) |
| `--color-text` | `#131C1C` | Body text (17.35:1) |
| `--color-text-secondary` | `#5A6470` | Muted body text (6.01:1) |
| `--color-text-muted` | `#6B7280` | Captions / meta only (4.83:1) |
| `--color-text-inverse` / `--color-text-inverse-muted` | `#FFFFFF` / `#C7D6E4` | Text on navy |
| `--color-border` / `--color-border-strong` | `#E5E7EB` / `#D5DEE8` | Inputs, dividers |
| `--color-focus` | `#0081FB` | 2px focus outline + 2px offset, always visible |
| `--color-success` / `--color-warning` / `--color-error` / `--color-info` | `#108981` / `#F59E0B` / `#EF4444` / `#3B82F6` | Semantic states (see §7 for contrast limits) |
| `--color-disabled-bg` / `--color-disabled-text` | `#E5E7EB` / `#6B7280` | Disabled states |
| `--color-whatsapp` | `#1D9E44` | WhatsApp fills only (flagged 3.48:1, §7) |
| `--color-logo-red` / `--color-logo-tile-navy` | `#E31E24` / `#124888` | **Logo only — never UI colours** |
| `--font-arabic` | `"IBM Plex Sans Arabic", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif` | Arabic text |
| `--font-latin` | `"Inter", "IBM Plex Sans Arabic", system-ui, sans-serif` | Latin text |
| `--font-cjk` | `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Inter", "IBM Plex Sans Arabic", system-ui, sans-serif` | Chinese text (no CJK webfont) |
| `--font-sans` | Combined Plex + Inter + CJK stack | Body default; overridden per locale (see §2) |
| Type scale | Display 56/1.1 Bold · H1 48/1.2 Bold · H2 36/1.3 Semibold · H3 28/1.4 Semibold · H4 22/1.4 Semibold · Body Large 18/1.6 · Body 16/1.6 · Body Small 14/1.5 · Caption 12/1.4 · Button 16/1.2 Semibold | `text-display` / `text-h1`…`text-caption` / `text-button` |
| Radius | sm 8 · md 12 · lg 16 · card 16 · button 12 · image 16 | Buttons 12, cards 16, inputs 12 |
| Shadows | card `0 2px 12px rgba(16,43,70,.06)` · hover `0 8px 24px rgba(16,43,70,.10)` · header `0 1px 0 rgba(16,43,70,.06)` · float `0 8px 24px rgba(16,43,70,.20)` | Navy-tinted (was `#0F2E4D`-tinted) |
| Container | 1200px / 12 cols / 24px gutter; ≥1440px viewport → 1320px | `.wrap` |

**Retired tokens** (old values, removed): `--color-primary: #0F2E4D`
(navy → `--color-navy`), `--color-accent: #1E8FE8` (bright blue →
`--color-primary`), `--color-sky: #B2D3F0` / `--color-sky-light: #D5F0FB`
(→ `#DDF5FC`), `--color-bg: #F4F7FA` (→ `#F4F6F8`), wordmark red
`#E10600` (→ logo red `#E31E24`, logo only).

**Deprecated aliases kept for un-migrated pages** (Phase 4 removal):
`--color-primary-deep` / `--color-primary-ink` → navy;
`--color-accent-strong` → `#0B70C9`; `--color-accent-soft` /
`--color-sky-light` / `--color-surface-blue` → sky `#DDF5FC`;
`--color-text-faint` → `#6B7280`; `--color-link` → `#0B70C9`;
`--color-danger` → `#EF4444`; `--color-brand-red` → `#E31E24`;
`--color-success-dot` → `#108981`.

---

## 2. Typography & font loading (`src/app/globals.css`, `src/app/layout.tsx`)

- **Started:** Inter latin variable 400–700 (`public/fonts/inter-latin.woff2`,
  48,256 B, one file) + IBM Plex Sans Arabic 400/500/600/700, arabic +
  latin subsets (8 files, 257,368 B). All `font-display: swap`, with
  `unicode-range` per subset so each page loads only the subsets it needs.
- **Stopped:** all Tajawal (8 files) and Montserrat (4 files) `@font-face`
  rules are removed. **The files stay on disk untouched** — nothing was
  deleted; they are simply no longer referenced. After this change a
  source search for `Tajawal|Montserrat` in `src/` returns 0 hits.
- **Why (ADR-11):** the boards print Plex + Inter; and the live Montserrat
  files are byte-identical Thin weight-100 files, so live Latin bolds were
  browser-synthesised — a real defect the swap fixes (real variable Inter
  400–700 + four real Plex weights).
- **Stacks:** Arabic → Plex; Latin → Inter; Chinese → system CJK fonts
  (no CJK webfont vendored — multi-MB, devices carry CJK). Locale-first
  rules in CSS (`html[lang="ar"] body` → `--font-arabic`, `[lang="en"]` →
  `--font-latin`, `[lang="zh"]` → `--font-cjk`) outrank the `.font-sans`
  utility, so body text renders in the locale's board face.
- **Layout shift:** `font-display: swap` + system-face fallbacks
  (metric-close) + explicit `width`/`height` on the logo image; no
  layout shift is introduced by the swap. **No letter-spacing is applied
  to Arabic or Chinese text anywhere** (tracking utilities appear only on
  Latin spans with `dir="ltr"`).
- **Weights shipped:** 400/500/600/700 only (boards' 300 Thin not vendored).
- `src/app/layout.tsx`: **unchanged** — body already uses `bg-bg font-sans
  text-text`; the new tokens flow through those utilities. No preload
  link was added (the locale layout that owns `<head>` metadata is not
  Phase 3-owned; preload is a Phase 4 opportunity).

---

## 3. Logo & wordmark (`src/components/Wordmark.tsx`)

- **Asset:** `public/images/brand/gts-emblem-transparent.png` (1597×1621,
  PREFERRED) on **every** surface. Never the navy square tile
  (`gts-official-logo.jpg`) on a white header; the tile is navy by design.
  Dark navy footer uses the same transparent emblem (it reproduces the
  tile look on navy — preferred for consistency).
- **Per surface:**

  | Surface | Asset | Size |
  |---|---|---|
  | White header | transparent emblem | 44px (brand lock 40–48) |
  | Mobile drawer header | transparent emblem | 36px |
  | White footer | transparent emblem | 120px (brand lock) |

- **HTML wordmark text** beside the emblem (the emblem at 40–48px is a
  symbol only — its embedded lines become texture, so the text carries
  the name): line 1 = localised name (`غمدان` / `GHAMDAN`, Plex for AR,
  Inter otherwise, bold, navy on light / white on dark); line 2 =
  `GHAMDAN — GTS` (AR) or `TRADING & AGENCIES — GTS` (EN/ZH), Latin,
  10px semibold, `tracking-[0.18em]`, `dir="ltr"`.
- **Rules kept:** explicit `width`/`height` attributes (intrinsic ratio
  1597:1621, no layout shift), no CSS filters, no drop shadow, no crop /
  recolour, clear space ≈ ¼ emblem diameter (flex `gap-3`). Alt text:
  the link carries `aria-label` (`غمدان للتجارة والتوكيلات` / `Ghamdan
  Trading & Agencies — GTS`); the `<img>` itself is `alt=""` to avoid
  duplicating the link label.
- **Retired:** the typographic wordmark (`GHAMDAN.` + red dot `#E10600`,
  Montserrat) is gone with the swap. Logo red `#E31E24` lives inside the
  emblem only.

---

## 4. Header (`src/components/Header.tsx`)

- **Opaque white, sticky `top-0 z-50`, from scroll 0** — the C-1
  regression rule is kept verbatim (never transparent). Scroll > 8px adds
  the header shadow and compacts desktop height 76px → 64px (transition
  250ms); the header never changes colour.
- **Desktop nav (7 items):** Home · About · Products · Solutions ·
  Systems · Projects · Contact. 15px (`text-nav`) semibold, navy;
  hover / active `#0B70C9` (AA) + `aria-current="page"`.
- **Products** is a button (`aria-haspopup`, `aria-expanded`,
  `aria-controls="mega-menu"`): opens the mega menu on hover, click, or
  `ArrowDown` (focus moves to the first panel link); `Escape` closes and
  returns focus to the trigger; route change closes it; leaving the
  header closes it.
- **Right cluster:** `LanguageSelector` (hidden below `sm`), WhatsApp CTA
  (`green-pill`, hidden below `md`), burger trigger (`size-11`, ≥44px,
  `aria-expanded`, hidden ≥`lg`).
- **Mobile drawer:** slides from RTL-start, backdrop, `Escape`, focus
  trap, body scroll lock; header row (36px wordmark + close), nav list
  (Home · About · **Products accordion** · Solutions · Systems ·
  Projects · Contact · Services · Agencies · News — drawer order
  preserves desktop order), language switch, full-width WhatsApp CTA.
  All drawer links ≥44px touch height.

## 5. Mega menu (`src/components/MegaMenu.tsx`, NEW)

- **Desktop panel** (`MegaMenu`): full-width, anchored to the header,
  white, bottom border, card-hover shadow, 180ms entrance (disabled under
  `prefers-reduced-motion`). Unmounts when closed — nothing inside is
  focusable while hidden.
- **Structure — All Products FIRST**, then the 8 real categories:
  - All Products → `/products`, sky card, `LayoutGrid` icon, total
    published count (**37** = sum of the 8 `publishedCount` values,
    computed from `src/data`).
  - 8 categories in a 2-column grid, each with its Lucide icon
    (`categoryIcon`), localised name, and **real published count**
    (inverters 13, batteries 16, panels 0, pumps 7, controllers 1,
    systems 0, storage-ci 0, cameras 0). Zero-count categories are shown
    with `0` and still link to their real category page (honest empty
    state) — counts are never hidden or invented.
  - Secondary column (elevated surface): `/systems` heading + the **3
    confirmed bundles only** (Small Home, Medium Home, Large Home /
    Commercial → `/systems/bundle-1..3`); bundle-4 is archived and is
    never listed.
- **Every link resolves** to an existing route (`/products`,
  `/products/category/[slug]`, `/systems`, `/systems/[slug]`); no dead
  links. Operable by mouse (hover intent), keyboard (button + `ArrowDown`
  + `Escape` + Tab order), and touch (tap toggles).
- **Mobile accordion** (`ProductsAccordion`, exported from the same file):
  same content as a nested accordion group inside the drawer — All
  Products first (with total count), then the 8 categories with counts.
- **Deviation from design-system.md §4:** the board's mega menu lists 4
  columns of *subcategories* (Solar Panels, Lithium Batteries, …). This
  implementation lists the 8 *real GTS categories* instead: the board's
  subcategory names do not exist as routes/data in `src/data`, and
  inventing subcategory routes would create dead links. The 8-category
  structure is the board-driven equivalent using verified data (ADR-07's
  All-Products-first rule is kept).

## 6. Buttons & forms

### `src/components/Button.tsx` (NEW) — the only button implementation

| Variant | Fill / border / text | Radius | Notes |
|---|---|---|---|
| `primary` | `#0B70C9` fill, white text; hover/active navy `#102B46` + subtle lift | 12px | Board prints `#0081FB` fill — see deviation §8 |
| `secondary` | White fill, 1.5px navy border, navy text; hover sky | 12px | |
| `outline` | Transparent, 1.5px `#0081FB` border, `#0B70C9` text; hover sky | 12px | |
| `text` | Transparent, `#0B70C9` text, optional reading-direction arrow; underline on hover | — | Arrow flips in RTL |
| `icon` | 44px square, bordered, navy icon | 12px | `aria-label` required (icon-only) |
| `whatsapp` | `#1D9E44` fill, white text; hover brightness 95% + lift | 12px | Contrast flag, §7 |
| `light` | White fill, navy text — **on navy panels only** | 999px pill | The one pill in the system, board-driven (§8) |

Sizes: sm 40px · md 48px (board height) · lg 56px. Font 16px semibold
(`text-button`). States: hover 180–250ms; active navy; focus 2px
`#0081FB` outline + 2px offset (never removed); disabled `#E5E7EB`
fill / `#6B7280` text / no pointer; loading grey fill + spinner +
`aria-busy` (interaction blocked). Renders as `<button>` or Next
`<Link>` via the `href` prop (disabled links render as inert `<span>`).

### `src/components/WhatsAppButton.tsx`
Historic API kept (callers across the site use it); variants re-mapped
onto the same tokens: `navy-pill` navy fill → hover `#0B70C9`;
`green-pill` `#1D9E44`; `white-on-dark` white/navy; `outlined-blue`
1.5px `#0081FB` border + `#0B70C9` text; `text-link` `#0B70C9` text.
48px, radius 12px, semibold. Clicks recorded to localStorage only —
never delivery/read.

### `src/components/WhatsAppFloat.tsx` / `StickyWhatsAppBar.tsx`
Float: 56px green circle, all public pages, localised `aria-label`
(`cta.whatsapp`). Sticky bar: below `md`, product/system pages only,
64px + safe-area, product/system name + green CTA, semibold. Both keep
the `#1D9E44` fill (flagged, §7).

### Forms — `src/components/ui.tsx` (new primitives)
`Field` (label above + hint + error with icon), `TextInput`,
`TextArea`, `SelectInput`: white fill, 1.5px `#E5E7EB` border, 12px
radius, 16px text, 48px height (textarea min 120px), leading icon in
`#6B7280`, placeholder muted; focus `#0081FB` border + 2px ring;
error `#EF4444` border + icon with the message in `--color-text`
(error red fails AA at small sizes); success `#108981` border/icon.
Labels are required (added even though the Arabic board shows icon +
placeholder only — accessibility, not a board deviation). Submit is a
full-width navy `Button` (design-system §2).

## 7. Other shell components

### `src/components/ui.tsx` (updated, all prior exports kept)
- `SectionHeading` / `SectionHeadingL`: eyebrow pill sky bg +
  `#0B70C9` text; H2 navy semibold (board H2, not extrabold); lead
  `#5A6470`.
- `Breadcrumbs`: home `›` separators, muted links, current page navy
  semibold.
- `EmptyState`: sky icon circle, navy H3 semibold, honest copy + CTA slot.
- `ZhNotice`: sky banner, navy text (CI-09).
- `IconFeature` / `FeatureCard`: sky icon circle + `#0B70C9` icon,
  navy semibold titles.
- `SpecTable`: navy row headers, `#5A6470` values; only existing rows
  render (never `—`).
- `Pagination`: active page `#0B70C9` fill (AA); inactive bordered navy.
- `SearchInput` / `SortSelect`: 48px, 12px radius, `#0081FB` focus
  border + ring.
- `ResultMeta`: `Showing X / Y`, `aria-live="polite"`.
- `EditorialBlock`: navy H2 semibold.
- `Reveal`: unchanged — visible without JS, animated only under `html.js`.

### `src/components/TopBar.tsx`
Desktop-only navy (`#102B46`) strip, scrolls away, header sticks.
Email / phone / hours + verified social icons. Retained as the
pre-existing approved contact strip (design-system §5: no *new* utility
bar); re-tokenised only.

### `src/components/LanguageSelector.tsx`
Preserves the equivalent page (`switchLocalePath`) + `NEXT_LOCALE`
cookie. Active locale `#0B70C9` + `aria-current`; inactive `#5A6470`,
hover `#0B70C9`; 44px touch height. No letter-spacing on AR/ZH labels.

### `src/components/Footer.tsx`
**White footer** (board default + KGE rhythm; see §8). 120px emblem +
wordmark, company summary + `TRUST • TRADE • GROWTH`, 8 category links,
9 quick links (incl. Solutions / Systems), approved contact only
(Sakhr St, front of Noor Yemen Mall · +967 775 800 000 ·
info@ghamdan-trd.com · Sat–Fri 8:00–20:00), privacy/terms, copyright.
Social links **only the verified ones** from `src/data/settings.ts`
(Facebook `facebook.com/GTSYemen`, Instagram `instagram.com/gtsyemen1`);
no other network is linked. Oversized pale GHAMDAN watermark kept:
navy at 4% opacity, hidden below `md`, `aria-hidden`, behind the grid —
it never overlaps readable text.

### `src/app/layout.tsx`
Unchanged (see §2).

---

## 8. Deviations from `design-system.md` (with reasons)

1. **Primary button fill `#0B70C9`, not `#0081FB`.** Board-spec fill +
   white text is 3.80:1 (below AA 4.5:1). The fill is the hover token
   `#0B70C9` (5.03:1, AA); `#0081FB` is kept for large text, icons,
   focus rings and non-text accents. Recorded in ADR-11 and
   `design-tokens.md` §4 — the documented deviation, not a silent change.
2. **Headings semibold, not extrabold.** Boards specify H2/H3/H4
   Semibold; the old code used `font-extrabold`. Phase 3-owned headings
   are now semibold.
3. **`text-muted` is now `#6B7280` (was `#5A6470`).** The board prints
   Gray `#6B7280` as the muted token; `#5A6470` is now
   `--color-text-secondary` for muted body text. Still AA (4.83:1).
4. **Mega menu lists 8 real categories, not the board's 4 subcategory
   columns** (see §5) — the board's subcategory names have no routes or
   data; inventing them would create dead links.
5. **White footer kept; dark-navy variant not adopted.** The board
   allows either; white is the §5 default and the KGE rhythm reference.
6. **Hover lift on primary/WhatsApp buttons** (`-translate-y-0.5`).
   `no-slop-ui` bans transform-on-hover; the board specifies "subtle
   lift" for button hover, and the board wins (restrained: 2px, 200ms,
   transform + opacity only, disabled under reduced motion).
7. **`light` button is a 999px pill.** `no-slop-ui` bans pills; the boards
   print pill CTAs ("Learn More →", "Get in Touch →") on navy panels, so
   the pill exists for this one board-driven variant only.
8. **Section-heading eyebrow pill kept.** Hallmark Floor 9 bans eyebrows;
   the design system specifies the eyebrow pill, and the board wins.
9. **ADR numbering:** the task asked for "ADR-10" for the font swap, but
   ADR-10 already exists (skills). The decision is recorded as **ADR-11**;
   nothing was renumbered.
10. **No-slop radius vs board radius:** buttons 12px / cards 16px per the
    boards (no-slop caps at 10–12px; cards at 16px are the board value).

## 9. Interim state & open items (for the coordinator / Phase 4)

- **Token migration is shell-only.** Phase 3 re-tokenised its 11 owned
  files. All other components/pages still use the old class meanings
  (`text-primary`, `bg-primary`, `text-accent`, `bg-accent-soft`, …).
  Because the canonical token names now carry the final board values,
  those pages will render `text-primary`/`bg-primary` as bright blue
  `#0081FB` instead of navy until Phase 4 migrates them. Deprecated
  aliases (`--color-primary-deep`, `--color-accent-strong`,
  `--color-accent-soft`, `--color-sky-light`, `--color-surface-blue`,
  `--color-text-faint`, `--color-danger`, `--color-brand-red`,
  `--color-success-dot`, `--color-link`) keep the old *alias* classes
  rendering, but nothing can alias the canonical names. Phase 4 must
  migrate every remaining `text-primary` → `text-navy`,
  `bg-primary` → `bg-navy`, `text-accent` → `text-primary-hover`,
  `bg-accent-soft` → `bg-sky`, `font-extrabold` headings → semibold,
  and then delete the aliases.
- **Contrast flags carried over (tokens §4):** WhatsApp `#1D9E44` +
  white = 3.48:1 (no board HEX; kept, glyph-paired); error `#EF4444`
  small text fails AA — message text stays in `--color-text`; success
  `#108981` is marginal (4.27:1) — large/bold text + icon only; warning
  `#F59E0B` never text.
- **Not visually verified.** No build was run (coordinator owns the single
  build) and no browser verification was performed in this phase; the
  checks here are typecheck + source inspection only. Visual QA (desktop
  1440, mobile 390, narrow-mobile burger, mega-menu hover/keyboard,
  font-swap rendering) belongs to Phase 8 / the coordinator's build.
- **Preload:** no font preload link was added (locale layout not owned).
- **Favicon:** still the pre-logo `غ` tile placeholder — the simplified
  sub-32px mark is an open item (brand lock §9); do not shrink the full
  emblem into a favicon.
