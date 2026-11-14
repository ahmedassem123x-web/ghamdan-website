# DESIGN DNA — Ghamdan Solar Platform (Phase 0)

**Extracted from:** the 10 original reference images (1440×2560 each), inspected
individually. **Nothing here is assumed** — every value is either sampled
from the images (marked `sampled`), estimated from visual inspection (marked
`estimate`), or explicitly unknown (marked `unverified`).
**Governing prompt:** §6 (Design DNA and Design System).

> **How to read the confidence marks**
> - `sampled` — measured with PIL from the actual JPEGs (quantized dominant
>   colours + median pixel samples). JPEG compression shifts colours slightly,
>   so even sampled values are ± a few units.
> - `estimate` — judged by eye from the rendered images; close, not exact.
> - `unverified` — cannot be determined from static screenshots; do not
>   present as fact.

## 1. The design in one paragraph

A bright, airy, corporate solar/water/agriculture website: near-white
blue-grey pages, full-bleed daylight photography (blue sky, green fields,
white modern buildings, blue solar panels), a single dark-navy used for
headers' CTAs and the closing band, a bright sky-blue used sparingly for
icons, pills and links, and near-black extra-bold Arabic headings with
generous white space. The mood is clean, technical and optimistic — not
luxury, not playful. Every page ends in the same dark-navy CTA band. Cards
are defined by light borders, not by shadows. There is no red, no orange,
no green (except one WhatsApp button in image 03) and no dark-mode surface
anywhere in the set.

## 2. Colour — extracted

### Sampled dominant colours (PIL, 12-colour quantization, all 10 images)

| Role | Value | Confidence | Evidence |
|---|---|---|---|
| Page background (dominant, 68–86% of pixels) | `#F0F7FA` – `#F6F9FB` (near-white blue-grey) | `sampled` | Top colour in every image: 01 `#F0F7FA` 78%, 04 `#F6F9FB` 86%, 02 `#F5F8FA` 76% |
| Dark navy (buttons, CTA band, footer text blocks) | `#0F2E4D` (range `#0A2540`–`#17324E`) | `sampled` (cluster) | Quantized navy cluster in every image: `#172E48`, `#143457`, `#102D4B`, `#0D2F52`, `#132B47`; median sample of header buttons `#0E1E35` / `#062D4E`; CTA band median `#163049` |
| Near-black text | `#131C1C` – `#171C1C` | `sampled` | 2nd–3rd quantized colour in most images (`#171C1C`, `#151C19`, `#121C26`) |
| Sky blue (hero sky, pale bands) | `#B2D3F0` – `#B5D5F2` | `sampled` | Quantized in 03 (`#B5D5F2` 4.3%), 05 (`#B2D3F0` 4.4%), 10 (`#B0D3ED`) |
| Hero sky (light) | `#D5F0FB` | `sampled` | Median sample, 01 hero sky area |
| Mid grey text | `#5A6470` (approx.) | `estimate` | Body copy grey; quantized mid-greys `#5C6465`, `#5D6661`, `#535C65` |
| Light border grey | `#E5EAF0` | `estimate` | Card/panel borders; consistent with the near-white background + a visible hairline |
| Pale blue (icon circles, pills, active tabs) | `#E8F2FC` | `estimate` | Pale-blue fills behind icons and pills; visually between background and sky blue |
| Bright blue (logo, icons, links) | `#1E8FE8` (range `#1B87E0`–`#2E9BF0`) | `estimate` | Sunburst logo, line icons, text-links; **no clean pixel sample** (logo box median was polluted by white) — do not treat as exact |
| WhatsApp green | `#1D9E44` | `sampled` (single sample) | Median sample of the green header button in 03 only; other WhatsApp buttons are navy, not green |
| White | `#FFFFFF` | `sampled` | Cards, hero text columns, buttons on dark bands |

### What is NOT in the palette

- **No red** anywhere (see Finding 2 in REFERENCE_IMAGE_ANALYSIS.md).
- **No orange / amber** (the sun icon is blue, not yellow; "sun" is rendered as a blue line icon).
- **No dark surface** except the navy CTA band — no dark cards, no dark footer (footers are light).
- Green appears only as (a) the single WhatsApp button in 03, (b) leaf icons, (c) the green dot in badge pills, (d) photographic greenery — never as a UI accent colour.

### ⚠️ Brand conflict — `CLIENT_CONFIRMATION_REQUIRED`

Ghamdan's approved identity (project record 2026-11-10): Navy `#0B2D5B` /
Grey `#6B7280` / **Red `#E10600`** / Light `#F8FAFC`, Tajawal + Montserrat.
The reference navy `#0F2E4D` is close to Ghamdan navy `#0B2D5B` (compatible),
but the reference has **no red** and its accent is bright sky-blue
`#1E8FE8` (estimate). Decision needed before the build:
- **Option A** — keep the reference palette exactly (blue accent, no red).
- **Option B** — map the reference layout onto Ghamdan's brand: navy
  `#0B2D5B`, accent red `#E10600` in the places the reference uses bright
  blue (links, icons, active states), keeping the layout identical.
This audit does **not** choose. DESIGN_SYSTEM.md tokens are written from
the **reference** palette; if Option B is chosen, only the accent token
changes — the layout tokens do not.

## 3. Typography — extracted

| Item | Value | Confidence |
|---|---|---|
| Script | Arabic-first, RTL; Latin wordmark "Sunfold" in 04/05/07/09/10 | observed |
| Arabic family | **Unidentified** — a modern geometric sans with even stroke weight, open counters, fairly compact letterforms. Visually closest open fonts: **Tajawal** (already Ghamdan's brand font) or **IBM Plex Sans Arabic**; also similar to Cairo / Noto Kufi Arabic at bold weights | `unverified` — do **not** claim the reference font is Tajawal; Tajawal is the *recommended practical alternative*, not a verified match |
| Latin family | **Unidentified** — a clean grotesque sans for "Sunfold" (similar to Inter / Montserrat) | `unverified` |
| Heading weight | Extra-bold / 800 (hero + section headings are visibly heavier than bold body titles) | `estimate` |
| Title weight | Bold / 700 (card titles, nav) | `estimate` |
| Body weight | Regular / 400; captions Medium / 500 in places | `estimate` |
| Hero heading scale | ≈ 56–64 px at 1440 px width, 2 lines, line-height ≈ 1.15 | `estimate` (measured relative to 1440 px canvas) |
| Section heading scale | ≈ 32–40 px, line-height ≈ 1.25 | `estimate` |
| Card / editorial title | ≈ 20–28 px (editorial rows ≈ 26–28 px; cards ≈ 18–20 px) | `estimate` |
| Body copy | ≈ 15–16 px, line-height ≈ 1.7–1.8 (generous, Arabic) | `estimate` |
| Small labels / pills / breadcrumbs | ≈ 12–14 px | `estimate` |
| Buttons | ≈ 15–16 px, semi-bold / 600 | `estimate` |
| Line length | Body copy max ≈ 55–65 characters per line (centred intros are narrower, ≈ 45–55) | `estimate` |
| Alignment | Headings: centred (01 hero/intro, 03 intro, 05 intro) or RTL-start (side heroes, editorial text, cards). Body: centred only in intro blocks; otherwise RTL-start. Card text: centred in icon rows, RTL-start in editorial/product cards | observed |

## 4. Layout — extracted

| Item | Value | Confidence |
|---|---|---|
| Canvas | 1440 px desktop screenshots; content container ≈ 1240–1300 px, centred | `sampled` (image width) / `estimate` (container) |
| Header height | ≈ 72–80 px | `estimate` |
| Hero height | ≈ 460–640 px *in the screenshot* — this is a full-page capture, not a viewport; real hero height must be set as ≈ 72–90 vh (decision for the build, not observed) | `unverified` as vh |
| Section spacing | Large: ≈ 80–120 px between major sections (visually ~2× the card gaps) | `estimate` |
| Grid gaps | Cards ≈ 20–24 px; editorial columns ≈ 40–60 px | `estimate` |
| Grid columns | 2-col editorial (50/50 or 55/45); 3-col (pillars, expertise, related); 4-col (features, steps, challenges, gallery, results); 6-col (04 product grid — the densest in the set) | observed |
| Image aspect ratios | Hero photos: full-bleed (no fixed ratio — cover). Editorial images ≈ 16:10. Product card images ≈ 4:3 (04) / 16:9 (06 related). Gallery ≈ 16:10. Product cut-outs: square on light-grey. Application cards: 16:9 with bottom overlay caption | observed / `estimate` |
| Image treatment | Photos are bright, high-key, blue-sky daylight; product cut-outs sit on very light grey (`#F4F7FA` est.) squares; rounded corners on most images | observed |

## 5. Components — geometry

| Item | Value | Confidence |
|---|---|---|
| Corner radius | Cards / panels ≈ 12–16 px; buttons ≈ 10–12 px (pill-ish, not fully round); inputs ≈ 10–12 px; icon circles = 50%; pills (badges, tabs) ≈ 999 px | `estimate` |
| Borders | Cards: 1 px solid light grey `#E5EAF0` (est.); dividers: 1 px hairline, same grey; active nav underline ≈ 2 px navy/blue | `estimate` |
| Shadows | Very soft / almost absent — cards are border-defined, not shadow-defined. Any shadow is ≈ `0 2px 12px rgba(15,46,77,0.06)` at most | `estimate` |
| Primary button | Dark navy fill, white text, ≈ 44–52 px high, horizontal padding ≈ 24–32 px, radius ≈ 10–12 px; icon (WhatsApp / arrow) at the RTL end | `estimate` |
| Secondary button | White fill on dark bands (same size); outlined blue (04 product cards: 1 px blue border, blue text, white fill) | observed |
| Text link | Bright-blue text + left arrow "←", ≈ 15 px, semi-bold | observed |
| Icon style | Thin line icons (Lucide-style), stroke ≈ 1.5–2 px, bright blue `#1E8FE8` (est.); in pale-blue circles ≈ 56–72 px diameter for feature icons; small inline icons ≈ 20–24 px | `estimate` |
| Pills / badges | Small pale-blue rounded pill, blue bold text ≈ 12–13 px, sometimes with a tiny icon; green dot variant for "live/sample" badges | observed |
| Form inputs | White fill, 1 px light border, radius ≈ 10–12 px, height ≈ 48–52 px, placeholder grey text, labels above in bold ≈ 14 px with red `*` for required (07) | `estimate` |
| Nav | Text links ≈ 15–16 px, near-black; active = navy/blue underline ≈ 2 px | `estimate` |
| Footer | Light background (`#F4F7FA`–white est.); giant pale watermark wordmark in 02/05/07 (very light grey, ≈ 10–15% opacity est.); bottom legal row ≈ 13 px grey | `estimate` |
| CTA band | Dark navy `#0F2E4D` (est.), full-bleed, photo on one side or as background with navy overlay; white heading + light-grey copy + white button | observed |

## 6. Motion / interaction — what the static images CANNOT show

- No animation, hover, focus, scroll, carousel or menu behaviour is
  observable. Per prompt §7, motion is an enhancement layer that must not
  change layout, order or identity. Recommended (for MOTION_SYSTEM.md, not
  decided here): fade/slide entrances, staggered card entrances, subtle
  image zoom on hover, count-up only for verified numbers (none exist in
  the references), `prefers-reduced-motion` respected.
- The marquee (01), gallery carousel (05, 10) and filter pills (05) imply
  motion/interaction, but speed, direction and behaviour are `unverified`.

## 7. Responsive rules — inferred (no mobile screenshot supplied)

- **Nothing below 1440 px is shown.** All responsive behaviour is
  `unverified` and must be designed, not copied:
  - Grids 6-col (04) / 4-col → 2-col tablet → 1-col mobile (inferred, not observed).
  - Editorial 2-col → stacked, image first, on mobile (inferred).
  - Header → hamburger + slide-in drawer (prompt-required, not observed).
  - Hero text over photo must keep contrast on small screens (overlay or
    reposition — decision for the build).
  - The sticky mobile WhatsApp bar (prompt-required) has no reference.
- Do not claim any breakpoint is "from the reference". Breakpoints in
  DESIGN_SYSTEM.md are implementation decisions.

## 8. Content truth — what the DNA does NOT include

- No product names, models, specs, prices, capacities, locations, dates,
  outcomes, testimonials, certifications or contact values in the images
  are approved Ghamdan content. All are sample/placeholder (see
  REFERENCE_IMAGE_ANALYSIS.md). The DNA is **visual only**; content comes
  from the PDFs and client-approved lists.
- The three-pillar framing (solar / water / agriculture) is the reference's
  framing. Whether it is Ghamdan's approved framing is a PDF-audit question.
