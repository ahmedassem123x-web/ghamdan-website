# Brand Identity Lock — GTS (Ghamdan Trading & Agencies)

**Status:** v15 brand lock · 2026-11-15 · Brand & Tokens agent
**Authority:** official logo file supplied by the client + four approved design boards (v15 §1.3–1.4).
**Scope:** logo source, geometry, clear space, usage rules, crop quality verdict. No `src/` component was modified; no font was swapped on the site.

---

## 1. Authoritative logo source (RESOLVED — no longer board extraction)

| Item | Value |
|---|---|
| Client-supplied file | `incoming/v15/gts-official-logo.jpg` |
| Canonical master | `incoming/v15/gts-official-logo.jpg` (client file, unmodified — SHA-256 below). A vendored copy formerly at `public/images/brand/gts-official-logo.jpg` was moved to `docs/qa/removed-assets-2026-11-15/` in the D-4 fix round (0 rendered references); see §10. |
| Format / dimensions | JPEG, RGB, **2048 × 2048 px**, 158,489 bytes, **no transparency** |
| SHA-256 | `3a6c974ddf679f05c1e8298339c0c98c6901132fb38796a87c3c8d07e3cbb812` (verified identical on source and vendored copy) |
| Background | Solid navy **#124888** — corner pixels verified `(18, 72, 136)` at all four corners; background field is flat (JPEG noise ≤ ±3 per channel) |

**Board extraction is SUPERSEDED and was stopped.** The boards were the only logo source before this file arrived; their logo instances are ~150–215 px, AI-rendered, and one board (129542) renders the Arabic name garbled. No board crop is shipped. A workspace search found **no standalone logo file** before this delivery (searched `ghamdan-website/incoming/`, `ghamdan-website-v2/public/`, `user/files/` — only `.md` mentions; `public/favicon.svg` is a `غ` tile, not the logo; `src/components/Wordmark.tsx` is the temporary typographic wordmark, now superseded).

## 2. Emblem geometry (measured, not assumed)

Measured by pixel analysis on the 2048 × 2048 tile (distance from navy #124888):

- **Emblem bounding box:** x **241–1830**, y **217–1830** (threshold: colour distance > 25 from navy). Size **1590 × 1614 px**. Emblem centre ≈ **(1035.5, 1023.5)** — essentially frame centre.
- **Crop used:** `(237, 213)–(1834, 1834)` = **1597 × 1621 px** (bbox + 4 px margin). All derived assets use exactly this box.
- **White disc:** Ø ≈ 1355 px, centred on the emblem centre.
- **Lettering (inside disc, top → bottom):** `GTS` in split-fill capitals (black lower half / white-outline upper half); Arabic `غمدان للتجارة والتوكيلات`; English `GHAMDAN TRADING & AGENCIES`; partner marks `Deye` (blue, sampled #3794CF), `MUST` (red), `jntech` (black/red) — all preserved exactly as supplied.
- **Ring:** white arc on the left, red arc on the right (sampled `#E11F27`, ≈ board-printed `#E31E24`), thin dark-blue outline strokes around arcs and disc. The arcs **do not meet** at top and bottom: the gaps show whatever background is behind the emblem. Verified two ways — on the navy tile the gaps read as navy "beads" merging seamlessly into the field; on white/sky (boards + our test composites) the same gaps read as background-coloured gaps. **The "beads" are background showing through, not a design element** — so background removal is faithful (see §4).
- **Logo red:** board-printed `#E31E24`; sampled from the tile `#E11F27`. Use `#E31E24` as the documented logo-red token. The old temporary wordmark red `#E10600` is retired with the wordmark (it was never a board value).

## 3. Derived assets (all under `public/images/brand/`)

| File | Size | Bytes | How made | Verdict |
|---|---|---|---|---|
| `gts-official-logo.jpg` | 2048 × 2048 | 158,489 | Exact copy of the client file | **Canonical master — archived.** Moved out of `public/` to `docs/qa/removed-assets-2026-11-15/` in D-4 (never rendered; the transparent emblem is preferred on all surfaces, incl. navy). Master preserved at `incoming/v15/gts-official-logo.jpg`. |
| `gts-emblem-transparent.png` | 473 × 480, RGBA | 149,402 | Bbox crop + flood-fill removal of the exterior navy (see §4), then LANCZOS-resized 2026-11-15 (D-3) | **PREFERRED header/footer asset — any surface.** |
| `gts-emblem-on-white.png` | 1597 × 1621, RGB | 819,981 | Same extraction composited on flat white | Fallback for contexts without alpha support. **White surfaces only.** |

No pixel of the emblem was stretched, skewed, recolored, retraced or redrawn. Aspect ratio preserved (1597 × 1621 is the measured bbox, not a square forced on the emblem).

## 4. Transparency extraction — method and evidence

- **Method:** colour distance from navy #124888; mask = distance < 25; connected-component labelling of the mask.
- **Proof of correctness:** exactly **one** border-touching navy component (766,955 px) — exterior field, interior navy band and the top/bottom gaps are a single connected region, so one flood-fill removes all background and nothing else. The other 62 components are 1–5 px JPEG noise specks inside the emblem, left opaque (invisible).
- **Edge treatment:** alpha feathered with a 1.2 px Gaussian blur. The 1 px dark-blue outline strokes of the arcs/disc are preserved (threshold 25 keeps blend pixels of distance 31–54).
- **Edge inspection (4× zoom):** red-arc outer edge, white-arc edge and top gap inspected at full resolution — **no navy halo, no JPEG mess**. Composites verified clean on white, sky `#DDF5FC` and navy `#102B46`. On navy the transparent emblem reproduces the original tile look exactly (gaps read navy again), which confirms the extraction is faithful rather than destructive.
- **Consequence: NO CLIENT INPUT REQUIRED for a transparent logo.** A vector SVG / transparent master ≥ 600 px from the client would still be welcome for print and favicon use, but it is **not blocking** — record as nice-to-have, not a requirement.

## 5. Per-surface usage (decision)

| Surface | Asset | Why |
|---|---|---|
| Dark navy footer / dark CTA (`#102B46`) | `gts-emblem-transparent.png` | The transparent emblem reproduces the tile look on navy and is the only shipped asset for this surface. (The full tile was archived in D-4; it is designed for navy — never crop it — and is restorable from `docs/qa/removed-assets-2026-11-15/` if ever needed.) |
| White header (current live header) | `gts-emblem-transparent.png` (preferred) or `gts-emblem-on-white.png` | Boards show the circular emblem alone on white. **Do not put the navy square tile on a white header** — it would change the header look. |
| Light-blue / sky sections (`#DDF5FC`) | `gts-emblem-transparent.png` | Clean on sky (verified). Never use the on-white PNG here (white square would show). |
| Favicon / < 32 px | **Open — no asset shipped** | The full emblem is illegible below ~32 px (see §6). Needs a simplified mark decision; current `favicon.svg` (`غ` tile) is the pre-logo placeholder. Do not shrink the full emblem into a favicon. |

## 6. Quality verdict at display sizes

- **~120 px (footer): PASS, fully legible.** GTS, Arabic name, English name and all three partner marks read clearly.
- **~40–48 px (header): PASS as a symbol, with a condition.** Ring + `GTS` mark read clearly; the embedded Arabic/English/partner lines become texture and are not legible. Therefore at header size the emblem must be **paired with HTML wordmark text** (site name in the header, as the current `Wordmark` component already does with text) and never relied on to carry the company name on its own.
- **Minimum sizes:** 40 px header (symbol only), 120 px footer (full lockup). Below 40 px, use a simplified mark (open item) — not this file.

## 7. Clear space, sizing, misuse

- **Clear space:** ¼ of the emblem diameter on all sides (derived from the board's Logo Guidelines clear-space grid, §Board 01). No text, rule or edge inside it.
- **Sizing:** set explicit `width`/`height` on every `<img>` (1597 × 1621 intrinsic ratio) to avoid layout shift. Header 40–48 px, footer 120 px, hero lockup ≥ 160 px if ever used.
- **Never:** stretch, skew, crop the ring, recolor any part, apply CSS filters, place on a background that destroys contrast (e.g. mid-blue), rotate, add drop shadows to the emblem, or separate the partner marks from the disc. The partner marks are part of the supplied lockup — do not create an unofficial combined mark and do not reuse them standalone.
- **Alt text:** EN `Ghamdan Trading & Agencies — GTS`; AR `غمدان للتجارة والوكالات`.

## 8. What the temporary wordmark was (for the record)

`src/components/Wordmark.tsx` (BUILD_SPEC §2.1, CI-17): typographic stand-in — `GHAMDAN.` in Montserrat + red dot `#E10600`, Arabic name in Tajawal, `GTS` tag. Its own comment says the old GTS logo is "forgotten" and the wordmark stands in "until Ahmed sends a new logo". That condition is now met: the official logo supersedes it. Swapping the component is implementation work for another agent — **not done here**.

## 9. Open items

1. Simplified favicon / sub-32 px mark — decision needed (do not shrink the full emblem).
2. Vector SVG master from the client — nice-to-have, not blocking.
3. Header/footer swap to `gts-emblem-transparent.png` — implementation agent's job, with the 40 px / 120 px sizes above.

## 10. D-3 resize (2026-11-15, v15 fix round)

- `gts-emblem-transparent.png` was **1,029,149 B at 1597 × 1621**, preloaded on
  every page while displayed at 44 px (header) / 120 px (footer). Resized with
  PIL LANCZOS to **473 × 480 px, 149,402 B** (≈2× the largest display size
  incl. retina; aspect ratio preserved, artwork untouched — no recolor,
  stretch or redraw). Quality re-verified at 4× zoom: ring text stays legible
  at footer size; header-size behaviour unchanged (ring + GTS clear, embedded
  lines texture — see §6).
- **Regeneration path (full-res master is recoverable):** the 1597 × 1621
  transparent emblem can be regenerated exactly from the client file
  `incoming/v15/gts-official-logo.jpg` (2048 × 2048, SHA-256 in §1) by
  re-running the §2 bbox crop `(237, 213)–(1834, 1834)` + the §4 flood-fill
  transparency extraction, then resizing to 473 × 480. Note: the vendored
  copy `public/images/brand/gts-official-logo.jpg` was moved to
  `docs/qa/removed-assets-2026-11-15/` in the same fix round (D-4, dead asset
  — 0 rendered references); the client file in `incoming/v15/` is the master
  and was not moved.
