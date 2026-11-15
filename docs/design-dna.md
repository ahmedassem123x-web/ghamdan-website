# Design DNA — GTS v15

**Status:** v15 brand lock · 2026-11-15 · Brand & Tokens agent
**Sources (viewed individually at full resolution):**

| File | Dimensions | What it is |
|---|---|---|
| `incoming/v15/129540_12_xccp.png` | 1160 × 1355 | **2×2 composite** of all four boards (Brand Identity / Design DNA / Digital Design System / UI-UX) — the overview sheet |
| `incoming/v15/129541_11_olil.png` | 1024 × 1536 | Board 02 — **Design DNA** (standalone) |
| `incoming/v15/129542_9_drao.png` | 1024 × 1536 | Board 03 — **Digital Design System**, Arabic/bilingual (standalone) |
| `incoming/v15/129543_10_3cxh.png` | 1024 × 1536 | Board 03 — **Digital Design System**, English (standalone) |
| `incoming/v15/129547_8_l8s7.png` | 503 × 2048 | Long vertical screenshot of **KGE** (Kazakhstan solar company) — page-rhythm reference only, **not GTS** |

Boards are AI-generated reference images: small text, numeric labels and sample copy may be inaccurate (e.g. board 129542 renders the Arabic logo name garbled; the official logo file supersedes all board logo renderings). Visual intent is extracted; factual content is verified against the logo file, font files and project data.

---

## 1. Board 01 — Brand Identity System (composite q1)

- **Header:** official logo (circular emblem) + title "Brand Identity System" / "Our Identity, Our Strength", over a solar-roof photograph.
- **Logo Variations (3):** full-colour emblem on white; full-colour emblem on white (small); **white emblem on navy** — the reversed lockup for dark surfaces.
- **Brand Colors (printed):** Primary `#0B70C9`, Navy `#102B46`, Red `#E31E24`, Light Blue `#DDF5FC`, Gray `#6B7280`. (Conflict with the standalone boards' `#0081FB` — resolved in `design-tokens.md` C-1.)
- **Typography (printed):** "Montserrat" — the composite's font label (conflict with the standalone boards' Plex + Inter — resolved in `design-tokens.md` C-2).
- **Logo Guidelines:** clear-space grid around the emblem (clear space ≈ ¼ diameter, see `brand-identity-lock.md`).
- **Brand Elements:** thin line icons — solar panel, battery, water droplet, leaf, gear, sprout.
- **Brand Personality (4):** Innovation, Reliability, Sustainability, Excellence.
- **Tagline band:** navy panel with diagonal blue/red/white stripes — "Powering a Sustainable Future".

## 2. Board 02 — Design DNA (standalone 129541)

Header tagline: "Innovation · Reliability · Sustainability". Twelve numbered sections:

1. **Visual Direction — "Clean. Modern. Innovative."** "A premium visual identity inspired by renewable energy and modern engineering."
2. **Brand Personality:** Trust, Innovation, Sustainability, Expertise (shield, lightbulb, leaf, gear icons).
3. **Design Mood:** 4 photos — solar farm, glass office building, green field rows, water splash.
4. *(numbered 05 in the board)* **Photography Style:** Bright & Realistic · Modern Architecture · Natural Environments · Clean Composition. Hero photo: solar farm at sunset with "Clean Energy, Brighter Tomorrow".
5. **Illustration Style:** thin grey line-art — solar array + city skyline. Delicate, technical, never heavy.
6. **Iconography (10):** Solar Energy, Batteries, Water Pumps, Irrigation, Machinery, Residential, Industrial, Partnership, Support, Global — single-weight blue line icons.
7. **Graphic Elements:** diagonal blue stripes (3-bar motif), pale-blue rounded rectangles, thin circle outline.
8. **Color & Gradient System:** blue gradient bar (pale → deep) + swatch row (navy, primary, light blue, pale, grey).
9. **UI Surfaces:** Clean Cards (minimal, elegant), Clear Hierarchy (organised structure), Modern Interface (smooth, intuitive).
10. **Layout Principles:** Generous White Space · Balanced Composition · Clear Visual Hierarchy · Responsive Design · **RTL & LTR Support**.
11. **Brand Essence:** navy curved panel (curved cut into a solar-farm photograph) — "Smart Solutions for a Sustainable World" / "Integrating renewable energy, water and agriculture with innovative technology." + "Learn More →" white pill button.

**DNA in one line:** bright, realistic photography; thin technical line-art; generous white space; blue-on-white with navy anchors; no decoration without a job.

## 3. Board 03 — Digital Design System (129542 Arabic + 129543 English)

Two renderings of the same system; the English board is the more complete spec (it supplies line-heights, container widths and a 7-state table). Where they differ, see `design-tokens.md` §1. Full component inventory is in `design-system.md`. Headline facts:

- **Colour system:** Primary Navy `#102B46`, Blue `#0081FB`, Accent Red, Sky `#DDF5FC`, Light Blue `#89E9F8`, Gray `#6B7280`; neutrals White `#FFFFFF`, Surface `#F6FAFC`, Background `#F4F6F8`, Border `#E5E7EB`; semantic Success `#108981`, Warning `#F59E0B`, Error `#EF4444`, Info `#3B82F6`.
- **Typography:** IBM Plex Sans Arabic + Inter (see `design-tokens.md` §2).
- **Layout:** container 1200 px / 12 cols / gutter 24 px; tablet 768 px / 8 cols; mobile 375 px / 4 cols (360 px in the English board).
- **Footer line (129543):** "ORTECH SOLUTIONS | Digital Design System" — "Innovation · Reliability · Sustainability" — "Energy for a better tomorrow".

## 4. Board 04 — UI/UX Website Guidelines (composite q4)

- **Key Pages:** thumbnails for Home, About, Solutions, Products, Projects, Contact — bright hero images, white cards, navy CTA bands.
- **Design Highlights:** Clean & Modern Layout · Premium Imagery · Easy Navigation · Clear CTAs.
- **Interactive Elements:** video play button centred on a solar-field image.
- **Mobile Experience:** phone mockup — "Solar Energy, Tailored to Your Needs" over a villa image; bottom nav implied, single-column stack.
- **Motion & Animation:** Smooth Scroll · Elegant Transitions · Subtle Animations · Performance First.
- **Closing CTA:** navy panel with wind-turbine photograph — "Let's Build a Better Energy Future Together" + white pill "Get in Touch →".

## 5. KGE vertical screenshot (129547) — rhythm only

A Kazakhstan solar company ("KGE") homepage, 503 × 2048. **Nothing from it is GTS content** — no name, logo, copy, claim, address or asset may be copied. What it defines is page rhythm, translated into GTS branding (v15 §1.5):

1. Minimal nav (logo, 5 links, language, CTA).
2. Light sky-blue hero, large headline, short copy, compact CTA, wide solar image.
3. White intro section + 4 feature cards.
4. "Complete Project Lifecycle" centred statement.
5. Wide blue feature panel (image right) + wide dark panel (image left).
6. Equipment catalogue — 4 product cards with spec chips + View Details.
7. Comparison table (brand vs "Traditional Market").
8. Blue CTA banner ("Take the first step…").
9. FAQ accordion.
10. White footer, 4 columns, oversized pale wordmark treatment.

## 6. Visual rules derived from the boards (binding for v15)

1. **Dominant surfaces are white, sky `#DDF5FC` and navy `#102B46`.** Red appears only inside the logo and as a thin stripe accent; never as a dominant UI colour or button.
2. **Photography is bright, realistic, daytime.** No dark overlays beyond what text contrast needs (the historic M-2 55% overlay defect must not return; boards show bright images with text beside, not under, the image).
3. **Illustration is thin line-art** (solar arrays, skylines, flow diagrams) in blue/grey — never filled cartoon art, never generic AI-gradient art.
4. **Geometry:** diagonal stripe motif (blue/white/red, 3 bars), rounded rectangles (radius 8–16), thin circle outlines. No glassmorphism, no oversized pills, no purple-blue gradients.
5. **Cards are white on tinted backgrounds**, thin border `#E5E7EB`, restrained shadow. Card image ratio ≈ 16:10; title → 2-line description → navy pill CTA.
6. **Whitespace is generous**; sections are separated by space, not by rules or colour blocks, except the navy CTA band and the sky feature section.
7. **Icons are one family, one stroke weight** (thin line, blue). No emoji as production icons. Directional icons flip in RTL; logos, product photos and diagrams do not mirror.
8. **Motion is restrained:** smooth scroll reveal, staggered cards, subtle hover, elegant transitions, performance first (v15 §10). Content is visible by default; animation is progressive enhancement only (historic blank-section defect).
