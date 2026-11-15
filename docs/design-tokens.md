# Design Tokens — GTS v15 (FINAL)

**Status:** v15 brand lock · 2026-11-15 · Brand & Tokens agent
**Sources:** Digital Design System boards 129542 (Arabic) + 129543 (English); Brand Identity board (129540 q1); Design DNA board (129541); official logo tile; live-site `src/app/globals.css` (old tokens, for reconciliation).
**Rule:** a token is *board-printed* (HEX printed on a board), *sampled* (measured pixel cluster ≈ printed value), *retained* (live-site value kept because no board value exists), or *derived* (arithmetic step between two printed values). Nothing else is invented.

---

## 1. Conflicts found — and how they were resolved

### C-1 · Primary blue: `#0B70C9` (composite) vs `#0081FB` (standalone)
- The 2×2 composite board (129540, quadrants 1 and 3) prints **Primary `#0B70C9`**.
- Both standalone Digital Design System boards (129542, 129543) print **Blue `#0081FB`**.
- Pixel sampling: primary swatch clusters measure ≈ `#0070F0–#0080F0` on both boards — between the two printed values, closer to `#0081FB`.
- **Resolution (per v15 §1.7 — standalone boards outrank the composite): primary = `#0081FB`.** The composite's `#0B70C9` is not discarded: it is the darker step of the same blue and becomes **primary-hover**. Both printed values therefore ship, with distinct roles.

### C-2 · Typeface: `Montserrat` (composite) vs `IBM Plex Sans Arabic + Inter` (standalone)
- Composite boards (129540 q1/q3) print **Montserrat** as the typeface.
- Standalone DDS boards print **IBM Plex Sans Arabic** (Arabic) + **Inter** (English/Latin), weights 300/400/500/600/700.
- **Resolution: target = IBM Plex Sans Arabic + Inter** (standalone boards are the target direction per v15 §4). Fonts vendored as local WOFF2; the swap itself is **not** applied — see `docs/qa/font-specimen.html` for the side-by-side review.
- **Additional finding:** the live site's four Montserrat files are **byte-identical** (same SHA-256) and fontTools reports all four as *Montserrat Thin, weight 100*. The live site's 500/600/700/800 Montserrat declarations all load the same Thin file, so Latin bold weights on the live site are browser-synthesised. This is a live defect, independent of the swap decision — see §6.

### C-3 · H4 size: 24 px (129542) vs 22 px (129543)
- **Resolution: H4 = 22 px Semibold, line-height 1.4** (129543, which supplies line-heights for every level). The 24 px variant is recorded here, not silently dropped.

### C-4 · Old palette vs board palette
| Old (live `globals.css`) | Board | Final |
|---|---|---|
| Navy `#0F2E4D` | Navy `#102B46` | **`#102B46`** (near-identical; board wins) |
| Bright blue `#1E8FE8` | Primary `#0081FB` | **`#0081FB`** |
| Sky `#B2D3F0` | Sky `#DDF5FC` + Light cyan `#89E9F8` | **`#DDF5FC` / `#89E9F8`** (`#B2D3F0` retired) |
| Sky-light `#D5F0FB` | — | Retired (use `#DDF5FC`) |
| Accent-strong `#1577C8` | Hover `#0B70C9` | **`#0B70C9`** |
| Wordmark red `#E10600` | Logo red `#E31E24` | **`#E31E24` (logo only)**; `#E10600` retired with the temporary wordmark |
| Background `#F4F7FA` | Background `#F4F6F8` | **`#F4F6F8`** |

---

## 2. Final token table

### Colour

| Token | HEX | Source | Notes / contrast (WCAG, computed 2026-11-15) |
|---|---|---|---|
| `--color-primary` | `#0081FB` | Board-printed (129542/129543) | 3.80:1 on white — **large text / UI only, never small body text** |
| `--color-primary-hover` | `#0B70C9` | Board-printed (composite) | 5.03:1 on white — **passes AA; use for primary-button fill so white button text passes** |
| `--color-primary-active` | `#102B46` | Board states rows (active = darkest navy) | 14.42:1 on white |
| `--color-secondary` | `#102B46` | Board-printed Navy | Same value as navy; secondary button = white bg + navy border/text |
| `--color-accent` | `#89E9F8` | Board-printed Light Blue/Cyan | Highlights, gradient stops; never body text |
| `--color-navy` | `#102B46` | Board-printed | 14.42:1 on white; dark surfaces, headings on sky |
| `--color-sky` | `#DDF5FC` | Board-printed | Light-blue sections; navy text on it 12.73:1 |
| `--color-background` | `#F4F6F8` | Board-printed (129542/129543) | Page background |
| `--color-surface` | `#FFFFFF` | Board-printed | Cards, header |
| `--color-surface-elevated` | `#F6FAFC` | Board-printed "Surface" | Cards on tinted backgrounds |
| `--color-surface-muted` | `#EEF3F7` | Retained (live site) | Subtle wells; no board value — flagged legacy, not board-printed |
| `--color-text` | `#131C1C` | Retained (live site) | 17.35:1 on white. **No board-printed text HEX exists** — kept, do not invent one |
| `--color-text-secondary` | `#5A6470` | Retained (live site) | 6.01:1 on white (AA) |
| `--color-text-muted` | `#6B7280` | Board-printed Gray | 4.83:1 on white (AA) — captions/meta only |
| `--color-border` | `#E5E7EB` | Board-printed | Inputs, dividers |
| `--color-border-strong` | `#D5DEE8` | Retained (live site) | Stronger dividers; no board value |
| `--color-focus` | `#0081FB` | Derived (primary) | 2 px outline + offset; never remove focus styles |
| `--color-success` | `#108981` | Board-printed | 4.27:1 on white — **marginal**: large/bold text OK, small text just below AA 4.5:1; use with icon, not colour alone |
| `--color-warning` | `#F59E0B` | Board-printed | 2.15:1 on white — **never text**; icon/background with dark text only |
| `--color-error` | `#EF4444` | Board-printed | 3.76:1 on white — **fails AA for small text**; use for icons/borders, keep message text in `--color-text` (open item: obtain a darker error-text token) |
| `--color-info` | `#3B82F6` | Board-printed | Informational accents |
| `--color-disabled-bg` | `#E5E7EB` | Board-printed (disabled state) | Disabled buttons/inputs |
| `--color-disabled-text` | `#6B7280` | Board-printed Gray | Disabled state (exempt from contrast) |
| `--color-whatsapp` | `#1D9E44` | Retained (live site) | 3.48:1 white-on-green — fails AA for text; board prints no WhatsApp HEX. Pre-existing live value, flagged, not changed here |
| `--color-logo-red` | `#E31E24` | Board-printed / sampled `#E11F27` | **Inside the logo only.** Never a dominant UI colour |
| `--color-logo-tile-navy` | `#124888` | Sampled (logo tile background) | **Logo tile only — NOT a UI token.** Do not use as a page navy |

### Typography

| Token | Value | Source |
|---|---|---|
| `--font-arabic` | `"IBM Plex Sans Arabic", "Tajawal", "Noto Kufi Arabic", sans-serif` | Board target + current as fallback until swap |
| `--font-latin` | `"Inter", "Montserrat", system-ui, sans-serif` | Board target + current as fallback until swap |
| `--font-cjk` (fallback) | `"Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif` | Neither target family covers CJK — system CJK fonts, **no CJK webfont vendored** (multi-MB; devices already carry CJK) |
| Display XL | 56 px / Bold / 1.1 | 129543 |
| H1 | 48 px / Bold / 1.2 | 129542 + 129543 agree |
| H2 | 36 px / Semibold / 1.3 | 129542 (Bold) vs 129543 (Semibold) — **Semibold** per 129543 (line-height source) |
| H3 | 28 px / Semibold / 1.4 | Both boards agree |
| H4 | 22 px / Semibold / 1.4 | 129543 (see C-3) |
| Body Large | 18 px / Regular / 1.6 | 129543 |
| Body | 16 px / Regular / 1.6 | Both boards agree |
| Body Small | 14 px / Regular / 1.5 | 129543 |
| Caption | 12 px / Regular / 1.4 | Both boards agree |
| Button | 16 px / Semibold / 1.2 | 129543 |

Weights to ship: **400 / 500 / 600 / 700** only (boards list 300 Thin too — not vendored; no board specimen needs it). Do not apply English letter-spacing to Arabic or Chinese text.

### Spacing / radius / grid / shadow

| Token | Value | Source |
|---|---|---|
| Spacing scale | 4, 8, 12, 16, 24, 32, 40, 48, 64 px | Union of 129542 (…40, 64) and 129543 (…48, 64) |
| Radius sm / md / lg | 8 / 12 / 16 px | 129543 (2/4/8/12/16); 129542 (8/12/16). Buttons 12, cards 16, inputs 12. Current site uses 10/14/14 — implementation to align |
| Container | 1200 px, 12 cols, gutter 24 px | 129542; 129543 adds Large 1440 px viewport → 1320 px container as the ≥1440 step |
| Tablet / Mobile | 768 px, 8 cols / 375 px, 4 cols (129542); mobile 360 px (129543) | Both recorded; 360–375 is one mobile step |
| Shadows | sm / md / lg (no board values printed) | **Retained live-site values**, re-tinted to navy `#102B46`: card `0 2px 12px rgba(16,43,70,.06)`, hover `0 8px 24px rgba(16,43,70,.10)` |
| Motion | micro 120–180 ms · hover 180–250 ms · card 250–400 ms · reveal 450–800 ms · large 650–1100 ms | v15 §10 |

---

## 3. Font files vendored (2026-11-15, Google Fonts, OFL)

All verified `wOF2` magic, non-zero size. Existing Tajawal/Montserrat files untouched.

| File | Family | Weight | Subset | Bytes |
|---|---|---|---|---|
| `inter-latin.woff2` | Inter | **variable 400–700** (one file serves all four weights — Google returns the same variable file per weight) | latin | 48,256 |
| `plex-sans-arabic-400-arabic.woff2` | IBM Plex Sans Arabic | 400 | arabic | 42,848 |
| `plex-sans-arabic-400-latin.woff2` | IBM Plex Sans Arabic | 400 | latin | 19,164 |
| `plex-sans-arabic-500-arabic.woff2` | IBM Plex Sans Arabic | 500 | arabic | 45,296 |
| `plex-sans-arabic-500-latin.woff2` | IBM Plex Sans Arabic | 500 | latin | 20,088 |
| `plex-sans-arabic-600-arabic.woff2` | IBM Plex Sans Arabic | 600 | arabic | 45,688 |
| `plex-sans-arabic-600-latin.woff2` | IBM Plex Sans Arabic | 600 | latin | 20,500 |
| `plex-sans-arabic-700-arabic.woff2` | IBM Plex Sans Arabic | 700 | arabic | 44,280 |
| `plex-sans-arabic-700-latin.woff2` | IBM Plex Sans Arabic | 700 | latin | 19,504 |

Total new: **9 files, 305,624 bytes**. Specimen: `docs/qa/font-specimen.html` (self-contained, references the vendored files + current Tajawal/Montserrat side-by-side; covers Arabic/English Display + body, Chinese fallback, spec data, buttons/nav, weights 400–700).

---

## 4. Contrast flags (actionable, not silent)

1. **Primary button:** board-spec fill `#0081FB` + white text = 3.80:1 (below AA 4.5:1). **Recommendation:** use hover `#0B70C9` (5.03:1) as the primary-button fill; keep `#0081FB` for large text, icons, links ≥ 18 px bold, and non-text accents. Decision needed from Ahmed/implementation agent — not applied here.
2. **Error text:** `#EF4444` at small sizes fails AA (3.76:1). Use for icons/borders; keep the message itself in text colour until a darker error-text token is approved.
3. **Success text:** `#108981` is marginal (4.27:1). Large/bold only for text; always pair with an icon.
4. **Warning:** never text (2.15:1).
5. **WhatsApp button:** `#1D9E44` + white = 3.48:1 (pre-existing live value; board prints no WhatsApp HEX).

## 5. What is NOT a token

- `#124888` (logo tile navy) and `#E31E24` (logo red) are logo-internal colours, not UI tokens.
- No gradients are tokenised: boards show one blue gradient bar (Design DNA §09) without stops — do not invent gradient stops. The diagonal blue/red stripe motif (Brand Identity footer band) is a graphic element, documented in `design-dna.md`, not a colour token.
- Green is WhatsApp-only. No other green enters the UI.
