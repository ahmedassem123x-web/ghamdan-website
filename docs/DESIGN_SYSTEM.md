# DESIGN SYSTEM — Ghamdan Solar Platform (Phase 0)

**Source:** DESIGN_DNA.md + REFERENCE_IMAGE_ANALYSIS.md (10 reference images,
1440×2560 each). Tokens are written as CSS variables.
**Confidence:** colours marked `sampled` were measured with PIL; all others
are `estimate` (see DESIGN_DNA.md §2–§5). No token is claimed exact unless
marked `sampled`. Font family is `unverified` — Tajawal is the recommended
practical alternative (Ghamdan brand font), not a verified match.
**Stack note:** prompt §15 specifies Laravel + Blade + Tailwind + Alpine.js +
Filament, GSAP + ScrollTrigger where justified. Tokens below are framework
agnostic; implement them as CSS variables (or Tailwind theme extension) in
the build — do not scatter hard-coded values.

> **Brand decision pending (CLIENT_CONFIRMATION_REQUIRED):** tokens below
> use the **reference** palette. If the client chooses Option B (Ghamdan
> red accent), change only `--color-accent`, `--color-accent-strong`,
> `--color-link` and `--color-focus` to Ghamdan red `#E10600` (and
> `--color-primary` to Ghamdan navy `#0B2D5B`); every layout token stays.

## 1. Colour tokens

```css
:root {
  /* ——— Reference palette (sampled / estimate — see DESIGN_DNA.md §2) ——— */
  --color-bg:            #F4F7FA;  /* sampled range #F0F7FA–#F6F9FB — page background */
  --color-surface:       #FFFFFF;  /* sampled — cards, header (solid variant) */
  --color-surface-muted: #EEF3F7;  /* estimate — light-grey panels, spec table, form side panel */
  --color-surface-blue:  #EAF3FC;  /* estimate — pale sky-blue band ("why us", challenges) */
  --color-border:        #E5EAF0;  /* estimate — card / divider hairline */
  --color-border-strong: #D5DEE8;  /* estimate — inputs, selects */

  --color-primary:       #0F2E4D;  /* sampled cluster #0A2540–#17324E — dark navy: primary buttons, CTA band */
  --color-primary-deep:  #0A2540;  /* sampled — darkest navy (header button median #0E1E35) */
  --color-primary-ink:   #163049;  /* sampled — CTA band median */

  --color-accent:        #1E8FE8;  /* estimate — bright blue: icons, links, active states */
  --color-accent-strong: #1577C8;  /* estimate — hover/active of accent */
  --color-accent-soft:   #E8F2FC;  /* estimate — pale-blue fill: icon circles, pills, active tabs */
  --color-sky:           #B2D3F0;  /* sampled — hero sky / pale blue areas */
  --color-sky-light:     #D5F0FB;  /* sampled — lightest sky in hero */

  --color-whatsapp:      #1D9E44;  /* sampled (single sample, image 03) — green WhatsApp button; use only where the reference uses green */
  --color-success-dot:   #22A355;  /* estimate — green dot in badge pills */

  --color-text:          #131C1C;  /* sampled — near-black headings */
  --color-text-muted:    #5A6470;  /* estimate — body / secondary text */
  --color-text-faint:    #8A94A0;  /* estimate — placeholders, legal footer text */
  --color-text-inverse:  #FFFFFF;  /* sampled — text on navy */
  --color-text-inverse-muted: #C7D6E4; /* estimate — copy on navy CTA band */

  --color-link:          #1E8FE8;  /* estimate — same as accent */
  --color-focus:         #1E8FE8;  /* estimate — focus ring */
  --color-danger:        #C0392B;  /* estimate — form errors only; NOT a brand colour in the references */
}
```

## 2. Typography tokens

```css
:root {
  /* Family: UNVERIFIED — recommended practical alternative is Tajawal
     (Ghamdan brand font) for Arabic + Montserrat for Latin; do not claim
     this matches the reference font. */
  --font-arabic: "Tajawal", "IBM Plex Sans Arabic", "Noto Kufi Arabic", sans-serif;
  --font-latin:  "Montserrat", "Inter", system-ui, sans-serif;
  --font-family: var(--font-arabic); /* Arabic-first; Latin wordmark uses --font-latin */

  --font-weight-regular: 400;
  --font-weight-medium:  500;
  --font-weight-semibold: 600;
  --font-weight-bold:    700;
  --font-weight-extrabold: 800;

  /* Type scale — estimates at 1440px desktop (see DESIGN_DNA.md §3) */
  --text-hero:    clamp(2.5rem, 4.4vw, 4rem);     /* 40–64px — hero heading, lh 1.15 */
  --text-h1:      clamp(2rem, 3vw, 2.75rem);      /* 32–44px — page heading */
  --text-h2:      clamp(1.75rem, 2.5vw, 2.5rem);  /* 28–40px — section heading, lh 1.25 */
  --text-h3:      clamp(1.375rem, 2vw, 1.75rem);  /* 22–28px — editorial title */
  --text-h4:      clamp(1.125rem, 1.5vw, 1.25rem);/* 18–20px — card title */
  --text-body:    1rem;                            /* 16px — body, lh 1.7 */
  --text-body-sm: 0.9375rem;                       /* 15px — secondary copy */
  --text-caption: 0.8125rem;                       /* 13px — labels, pills, legal */
  --text-nav:     0.9375rem;                       /* 15px — nav links */
  --text-button:  0.9375rem;                       /* 15px — buttons, 600 */

  --leading-tight: 1.15;  /* hero */
  --leading-snug:  1.25;  /* headings */
  --leading-normal: 1.5;
  --leading-relaxed: 1.7; /* Arabic body copy */
  --leading-loose: 1.8;

  --measure: 65ch;        /* max body line length */
  --measure-narrow: 52ch; /* centred intro copy */
}
```

## 3. Spacing tokens

```css
:root {
  /* Section rhythm — estimates from the references */
  --space-section: clamp(4rem, 7vw, 7.5rem);   /* 64–120px between major sections */
  --space-section-sm: clamp(2.5rem, 4vw, 4rem);/* 40–64px between sub-sections */
  --space-block: 1.5rem;   /* 24px — between heading and copy */
  --space-card-gap: 1.5rem;/* 24px — card grid gap (estimate 20–24px) */
  --space-col-gap: clamp(2rem, 4vw, 3.75rem);  /* 32–60px — editorial column gap */

  --space-1: 0.25rem;  /* 4px  */
  --space-2: 0.5rem;   /* 8px  */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

## 4. Layout tokens

```css
:root {
  --container: 80rem;          /* 1280px — content container (estimate 1240–1300px) */
  --container-wide: 84rem;     /* 1344px — full-bleed hero inner limit, if needed */
  --container-pad: clamp(1rem, 4vw, 2rem); /* side padding */

  --header-height: 4.75rem;    /* 76px — estimate 72–80px */
  --hero-min: 72vh;             /* decision, NOT observed — screenshots are full-page captures */
  --hero-max: 90vh;

  --grid-2: repeat(2, minmax(0, 1fr));
  --grid-3: repeat(3, minmax(0, 1fr));
  --grid-4: repeat(4, minmax(0, 1fr));
  --grid-6: repeat(6, minmax(0, 1fr)); /* catalog only (image 04) */
}
```

## 5. Radii, borders, shadows

```css
:root {
  --radius-card: 0.875rem;   /* 14px — cards, panels (estimate 12–16px) */
  --radius-button: 0.625rem; /* 10px — buttons, inputs (estimate 10–12px) */
  --radius-image: 0.875rem;  /* 14px — editorial / card images */
  --radius-pill: 999px;      /* badges, tabs, icon circles */
  --radius-input: 0.625rem;  /* 10px */

  --border: 1px solid var(--color-border);
  --border-strong: 1px solid var(--color-border-strong);

  /* Shadows are deliberately minimal — cards are border-defined (see DNA §5) */
  --shadow-card: 0 2px 12px rgba(15, 46, 77, 0.06);
  --shadow-card-hover: 0 8px 24px rgba(15, 46, 77, 0.10);
  --shadow-header: 0 1px 0 rgba(15, 46, 77, 0.06); /* solid header only */
}
```

## 6. Button tokens

```css
:root {
  --btn-height: 3rem;          /* 48px — estimate 44–52px */
  --btn-height-sm: 2.5rem;     /* 40px */
  --btn-pad-x: 1.75rem;        /* 28px */
  --btn-radius: var(--radius-button);
  --btn-font: var(--text-button);
  --btn-weight: var(--font-weight-semibold);
}
/* Variants (from the references):
   .btn-primary  — navy fill, white text (default CTA everywhere)
   .btn-white    — white fill, navy text (on dark CTA bands)
   .btn-outline — 1px accent border, accent text, white fill (04 product cards)
   .btn-whatsapp-green — green fill (#1D9E44 sampled), white text (03 header only)
   .btn-link    — accent text + ← arrow, no fill ("اكتشف المزيد") */
```

## 7. Form tokens

```css
:root {
  --input-height: 3.125rem;    /* 50px — estimate 48–52px */
  --input-radius: var(--radius-input);
  --input-border: var(--border-strong);
  --input-bg: #FFFFFF;
  --input-placeholder: var(--color-text-faint);
  --label-weight: var(--font-weight-bold);
  --label-size: 0.875rem;      /* 14px */
  --required-mark: #C0392B;    /* red asterisk in 07 — form-only, not a brand colour */
}
```

## 8. Breakpoints (implementation decisions — NOT observed)

No mobile/tablet screenshot was supplied. These breakpoints are
**decisions for the build**, to be verified in visual QA (§18):

```css
/* Mobile-first */
--bp-sm: 640px;    /* phones → small tablets: 1-col grids, stacked editorial */
--bp-md: 768px;    /* tablets: 2-col grids, header → drawer */
--bp-lg: 1024px;   /* laptops: 3-col grids, editorial 2-col */
--bp-xl: 1280px;   /* desktop: container max, 4-col / 6-col grids */
--bp-2xl: 1536px;  /* large desktop: container stays capped at --container */
```

Reflow rules (inferred, to be confirmed in QA):
- 6-col product grid (04) → 3-col at `lg`, 2-col at `md`, 1-col below `md`.
- 4-col grids → 2-col at `md`, 1-col below `md`.
- Editorial 2-col → stacked (image first) below `lg`.
- Header → hamburger + `MobileDrawer` below `lg`.
- Hero side-aligned text → centred, with a navy overlay for contrast, below `md`.
- Sticky mobile WhatsApp bar appears below `md` on product/package pages only.

## 9. Desktop / tablet / mobile token differences

| Token | Desktop (≥1280px) | Tablet (768–1279px) | Mobile (<768px) |
|---|---|---|---|
| `--text-hero` | 56–64px | 40–48px | 32–36px |
| `--text-h2` | 32–40px | 28–32px | 24–28px |
| `--space-section` | 80–120px | 64–80px | 48–64px |
| `--container-pad` | 32px | 24px | 16px |
| `--header-height` | 76px | 72px | 64px (drawer header) |
| Grids | 3/4/6-col | 2/3-col | 1-col (2-col only for small tiles) |
| Hero | 72–90vh, side/centre/split as per page | 60–72vh | 56–64vh, centred text |

## 10. Iconography

- Style: thin line icons, stroke ≈ 1.5–2px, accent blue; Lucide icon set
  recommended (prompt §15: "Lucide or an existing consistent icon set").
- Feature icons sit in pale-blue circles (`--color-accent-soft`), ≈ 56–72px.
- Directional icons (arrows) point **left** (←) in RTL for "forward" —
  use logical properties / RTL-aware icons; do not blindly mirror every icon.
- The sunburst logo mark in the references is **not** Ghamdan's logo —
  use Ghamdan's approved logo asset.

## 11. What this system does NOT define

- Exact font files (unverified — use Tajawal + Montserrat per Ghamdan brand,
  self-hosted).
- Exact hex values beyond the sampled cluster (all other colours are
  estimates — re-verify against the build screenshots in VISUAL_QA_REPORT.md).
- Motion timings (see MOTION_SYSTEM.md — to be written by the motion agent).
- Content, copy, products, prices (none — no prices anywhere, §3.1).
- Admin (Filament) styling — Filament's own system, with these tokens
  applied to brand accents only.
