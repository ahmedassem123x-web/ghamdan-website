# REFERENCE IMAGE ANALYSIS — Ghamdan Solar Platform (Phase 0)

**Source:** `incoming/extracted/` — 10 original JPEGs, each **1440 × 2560 px**
(9:16 tall full-page screenshots), pixels unchanged from
`ui-reference-pages-10-images.zip`. Every image was inspected individually
at full resolution and in vertical sections.
**Governing prompt:** `Ghamdan_Master_Execution_Prompt_v2_3_zpxp.md` §2.3, §5, §6.
**Status:** Audit only — no website code built from this document.

## Inventory (verified)

| # | File | Size | Dimensions | Page represented |
|---|---|---|---|---|
| 01 | `ui-reference-01-home.jpg` | 655 KB | 1440×2560 | Home |
| 02 | `ui-reference-02-about.jpg` | 677 KB | 1440×2560 | About / من نحن |
| 03 | `ui-reference-03-solutions.jpg` | 850 KB | 1440×2560 | Solutions overview / حلولنا |
| 04 | `ui-reference-04-catalog.jpg` | 705 KB | 1440×2560 | Product catalog / المنتجات |
| 05 | `ui-reference-05-projects.jpg` | 830 KB | 1440×2560 | Projects listing / مشاريعنا |
| 06 | `ui-reference-06-product-detail.jpg` | 508 KB | 1440×2560 | Product detail — solar inverter |
| 07 | `ui-reference-07-contact.jpg` | 522 KB | 1440×2560 | Contact / تواصل معنا |
| 08 | `ui-reference-08-product-category.jpg` | 639 KB | 1440×2560 | Product category — solar energy |
| 09 | `ui-reference-09-solution-detail.jpg` | 772 KB | 1440×2560 | Solution detail — solar water pumping |
| 10 | `ui-reference-10-project-detail.jpg` | 732 KB | 1440×2560 | Project detail — sample project |

## ⚠️ CRITICAL FINDING 1 — The references are NOT a Ghamdan-branded site

The 10 images are **one shared design system rendered under four different
sample brand names**. None of them says "Ghamdan / غمدان" anywhere.

| Images | Brand shown in header/footer | Tagline / contact shown |
|---|---|---|
| 01, 02 | **سولفولد / Solfold** (logo = blue rounded square, white sunburst) | No contact details in header/footer; © 2024 (01), © 2025 (02) |
| 03 | **آفاق الطاقة** (same sunburst logo) — "لطاقة أوفر لمستقبل أفضل" | `info@example.com`, `+966 11 123 4567`, الرياض، المملكة العربية السعودية |
| 04, 05, 07, 09, 10 | **Sunfold** (same sunburst logo) | `info@sunfold.com`, `+966 11 234 5678` (04), `+966 11 456 7890` (05), الرياض، المملكة العربية السعودية |
| 06 | **الشركة** (literally "The Company") | No contact details at all |
| 08 | **صن فولد** (Arabic transliteration of Sunfold) | No contact details in footer |

**Consequence:** brand name, logo, taglines, phone numbers, e-mails, addresses
and copyright years in these images are **SAMPLE / PLACEHOLDER — never publish
them**. The Ghamdan build must substitute Ghamdan's approved brand, logo,
+967-775800000, info@ghamdan-trd.com and Sana'a address (per project memory;
to be re-confirmed against the two PDFs — that is the document-audit agent's
job, not this audit's). The logo mark itself (blue rounded square + white
sunburst) is part of the *reference* identity, not Ghamdan's — do not reuse
it as Ghamdan's logo.

## ⚠️ CRITICAL FINDING 2 — Reference palette has NO red; Ghamdan brand does

The sampled reference palette is navy + sky blue + white + near-black text.
There is **no red accent anywhere** in the 10 images. Ghamdan's approved
identity (project record, 2026-11-10) is Navy `#0B2D5B` / Grey `#6B7280` /
**Red `#E10600`** / Light `#F8FAFC`. This is a **conflict to be decided, not
silently reconciled**: either the reference blue system is kept as-is (and
Ghamdan's red is dropped from the website), or Ghamdan's navy/red is mapped
onto the reference layout (accent blue → Ghamdan red in defined places).
Recorded here as `CLIENT_CONFIRMATION_REQUIRED` in DESIGN_DNA.md. This audit
records the reference palette as seen; it does not choose.

## ⚠️ CRITICAL FINDING 3 — Prompt-required chrome is NOT visible in any reference

Prompt §4.3 requires: a top contact bar, a sticky header that compacts on
scroll, a slide-in mobile menu, a four-column footer, a floating WhatsApp
button, and a sticky lower WhatsApp bar on product / ready-made-system pages.
**None of these is visible in any of the 10 static full-page screenshots:**
no top contact bar exists (headers are a single row), no floating WhatsApp
button appears, no sticky bottom bar appears, no mobile menu is shown (all
screenshots are desktop-width 1440 px), and no footer has four columns (see
per-image footer notes — 2–3 columns max, several are a single row).
These are therefore **implementation requirements from the prompt, not
reference-observed patterns** — build them in the reference visual language,
do not claim the references show them.

## ⚠️ CRITICAL FINDING 4 — Language switcher is AR + EN only

Every header that shows a language switcher shows **عربي | EN** only.
**No Chinese (中文) switcher appears in any image**, although prompt §13
requires Arabic + English + Simplified Chinese. The switcher component must
be extended to three languages in the reference style; the references do not
show how.

## Prices

**No price appears in any of the 10 images.** No currency symbol, no numeric
price, no "discount / savings" claim. The only numbers are counts
("عرض 12 من 24 منتج" in 08 — a result count, not a price) and step numbers
(01–04 in 09). The specification table in 06 shows a dash "—" for every
value. **Price flag: PASS — nothing to remove; the no-price rule (§3.1) is
satisfied by the references as-is.**

---

## 01 — Home (`ui-reference-01-home.jpg`)

- **Page:** Home. **Brand in image:** سولفولد (logo top-right, Arabic wordmark only in footer).
- **Header / navigation:** Single row, transparent over the sky photo. Right (RTL start): blue sunburst logo. Centre: nav — الرئيسية (underlined = active), حلولنا، مشاريعنا، من نحن، تواصل معنا. Left: language `عربي | EN`, then a dark-navy pill button "تواصل عبر واتساب" with WhatsApp icon. No top contact bar, no search icon, no hamburger (desktop width).
- **Hero:** Very tall — roughly the top 640 px (~25% of the image). Full-bleed photo of a modern white villa with rooftop solar panels under a pale blue sky. Text is centred over the sky (not over the house): small white pill badge "طاقة ومياه من أجل مستقبل أفضل •" with green dot; two-line extra-bold centred heading "حلول طاقة ومياه مصممة / لتناسب احتياجاتك"; two-line centred grey sub-copy; dark-navy pill CTA "تواصل عبر واتساب ←" with WhatsApp icon. The photo occupies the lower ~half of the hero; the headline sits in the sky area.
- **Section order:** (1) Hero → (2) Intro "نؤمن بعالم تزدهر فيه الحياة" (centred heading + 2-line copy) → (3) three-column icon row — التقنيات الزراعية / هندسة المياه / أنظمة الطاقة الشمسية, separated by hairline vertical dividers, each with a line icon (leaf / droplet / sun), bold title, one-line grey caption; below it a faint full-width line-art illustration of a solar field (very low contrast, decorative) → (4) Marquee strip: "خبراتنا — حلولنا — تأثيرنا —" repeated, large thin text, separated by em-dashes → (5) Solutions grid, 2×2: أنظمة الطاقة الشمسية / حلول ضخ ومعالجة المياه / التقنيات الزراعية / حلول متكاملة. Each cell = image left (≈40% of cell, ~16:10), text right on a very light grey panel: blue line icon, bold title, 2-line grey copy, blue text-link "اكتشف المزيد ←" → (6) "لماذا تختار حلولنا؟" on a pale sky-blue band: small white pill "لمستقبل أكثر استدامة", centred heading, 3 white cards in a row (شراكة طويلة الأمد / خبرة متكاملة / حلول مخصصة) with blue line icons → (7) Two-column split: right "مشاريعنا" with 2 project image cards (مشروع طاقة شمسية / مشروع ري زراعي, image ~16:9 + bold title + blue link "عرض المشروع ←"); left "منتجات مختارة" with 3 small square product tiles (ألواح شمسية عالية الكفاءة / مضخات مياه مطورة / أنظمة ري ذكية) + link "عرض جميع المنتجات →" → (8) Dark-navy CTA band: right column "لنبدأ مشروعك اليوم" + copy + white WhatsApp button; left column "طرق التواصل الأخرى" with 3 rows (email / phone / location icons, labels only, **no actual values**) → (9) Footer.
- **Grid / columns:** Content container ≈ 1240–1300 px wide, centred, generous side margins. 3-col icon row, 2×2 solution grid, 3-col "why" cards, 2-col projects/products split.
- **Typography:** Extra-bold large Arabic headings (hero ≈ 56–64 px est.), section headings ≈ 32–40 px est. bold, card titles ≈ 18–20 px bold, body ≈ 15–16 px, grey `#5A6470` est. All text centred in hero/intro/why sections; right-aligned (RTL start) in solution cells and the projects/products split.
- **Image placement / crop:** Hero photo full-bleed, sky-heavy. Solution images are tight crops (roof panels, pump gushing water, greenhouse drip lines, solar pergola). Product tiles are studio cut-outs on light-grey squares. "Why" band has a faint sky/cloud photo background under the pale blue.
- **Cards + counts:** 4 solution cells, 3 "why" cards, 2 project cards, 3 product tiles.
- **Background / surface transitions:** White → white (intro) → white with line-art → white (solutions) → pale sky-blue band → white → dark navy CTA band → white footer. Soft, low-contrast transitions; no harsh section dividers except the marquee.
- **CTA placement:** Hero (navy WhatsApp pill), header (navy WhatsApp pill), CTA band (white WhatsApp button). No floating button visible.
- **Footer:** Single row: logo left, nav links centre, language + social icons (LinkedIn, YouTube, Instagram) right; below: "جميع الحقوق محفوظة © 2024" left, "سياسة الخصوصية | الشروط والأحكام" right. **Not** four columns.
- **Responsive clues:** None — desktop 1440 px only; no mobile menu, no hamburger.
- **Uncertainties:** Hero height on real viewports (screenshot is a full page, not one viewport); whether the marquee animates; whether the line-art solar field is a background image or an inline SVG; the exact "why" band background (photo vs gradient); contact values in the CTA band are labels only.

## 02 — About (`ui-reference-02-about.jpg`)

- **Page:** About / من نحن. **Brand:** سولفولد (logo + wordmark top-right).
- **Header:** Same single row as 01, but the WhatsApp button is on the left and the language pill is a white rounded box "عربي | EN". Nav: الرئيسية، من نحن (underlined = active)، مجالات خبرتنا، تواصل معنا. Note: **fewer nav items than 01** (no حلولنا / مشاريعنا).
- **Hero:** Tall photo hero (~500 px): modern villa + rooftop panels + sea in the distance. Text is **left-aligned** (visually left column, i.e. RTL end) over the sky: two-line extra-bold heading "خبرة هندسية متكاملة / لطاقة أذكى وحياة أفضل", 3-line sub-copy, navy pill CTA "تحدث معنا اليوم ←". No badge pill.
- **Section order:** (1) Hero → (2) Intro "من نحن" pill + centred heading "نؤمن بأن الطاقة المستدامة والمياه والزراعة الذكية ليست بدائل، بل أسس لمستقبل أفضل للجميع." + 2-line copy → (3) same 3-col icon row as 01 (الزراعة الذكية / هندسة المياه / الطاقة الشمسية) with one-line captions → (4) Editorial split "قصتنا": image left (solar field at sunset over a city, ~16:10, rounded corners), text right: pill "قصتنا", bold heading "انطلقت رحلتنا من إيمان بإمكانات عالم أكثر استدامة", 3-line copy, navy button "اكتشف المزيد عنا ←" → (5) Two cards side-by-side: رسالتنا / رؤيتنا — white cards with light border, blue icon in a pale-blue circle (target / eye), bold title, 2-line copy → (6) "مجالات خبرتنا" pill + centred heading "حلول متكاملة لحياة أكثر استدامة" + copy → 3 image cards in a row (التقنيات الزراعية / هندسة المياه / الطاقة الشمسية): image top (~16:10), bold title, 2-line copy, blue link "اعرف المزيد ←" → (7) Dark-navy CTA band with solar-field photo on the left half and text right: heading "لنبحث معاً عن الحل الأنسب لمشروعك", copy, white WhatsApp button "تواصل عبر واتساب" → (8) Footer.
- **Grid:** Same container; 3-col icon row; 2-col editorial (image ≈ 55% / text ≈ 45%); 2-col mission/vision; 3-col expertise cards.
- **Typography:** Same hierarchy as 01. Hero heading left-aligned here, unlike 01's centred hero — **intentional per-page difference**.
- **Footer:** Different from 01: logo + wordmark + tagline "حلول هندسية لمستقبل أكثر استدامة." left; centre nav list (الرئيسية / من نحن / مجالات خبرتنا / تواصل معنا); right a navy WhatsApp button + language pill; bottom row "سياسة الخصوصية | الشروط والأحكام" and "جميع الحقوق محفوظة."; a giant pale-grey "سولفولد" watermark wordmark spans the footer background. **Not** four columns; no contact details, no social icons in this footer.
- **Uncertainties:** No statistics/numbers section (no founded year, no project count, no team size) — do not invent any; mission/vision copy is sample text, not Ghamdan-approved.

## 03 — Solutions (`ui-reference-03-solutions.jpg`)

- **Page:** Solutions overview / حلولنا. **Brand:** آفاق الطاقة (different brand, same logo) — tagline "لطاقة أوفر لمستقبل أفضل".
- **Header:** Single row, transparent over sky. Right: wordmark + tagline + logo. Centre nav: الرئيسية، القطاعات، حلولنا، من نحن، اتصل بنا. Left: **green WhatsApp button** "تواصل عبر واتساب" (the only green header button in the set — all others are navy) + language `عربي | EN`. **Nav differs again** ("القطاعات" appears only here).
- **Hero:** Full-bleed photo (villa + ground solar array, mountains), text **right-aligned** (RTL start) in the right ~45%: two-line extra-bold heading "حلول متكاملة / للطاقة والمياه", 3-line sub-copy, navy pill button "اكتشف حلولنا ← →" (arrow on both sides — likely a rendering quirk, note it). Hero ≈ 500 px tall.
- **Section order:** (1) Hero → (2) Centred intro "معاً نحو مستقبل أكثر استدامة" with a short blue underline accent + 2-line copy → (3) Five editorial rows, **alternating** image/text: (a) الطاقة الشمسية السكنية — image left, text right, pill "للمنازل" with home icon; (b) حلول الطاقة التجارية والصناعية — text left on light-grey panel, image right; (c) ضخ المياه بالطاقة الشمسية — image left, text right, pill "المياه" with droplet icon; (d) أنظمة الري الذكية — text left on light-grey panel, image right, pill "الري الذكي"; (e) حلول الطاقة والمياه للقطاع الزراعي — image left, text right, pill "الزراعة". Each row: bold title ≈ 28 px, 2–3 line grey copy, navy button "اكتشف المزيد ←". Rows alternate image-left / image-right; text panels alternate white / very light grey → (4) "كيف نعمل؟" — 4 steps in a row with numbered order **right-to-left 1→4** (١. فهم احتياجاتك / ٢. تصميم الحلول / ٣. التنفيذ والمتابعة / ٤. دعم مستمر), each with a blue line icon in a pale-blue circle, bold title, 2-line copy, and a left-pointing arrow between steps → (5) Full-bleed photo CTA band (irrigation pivot + solar field): heading "لنبدأ مشروعك الآن" right-aligned, copy, navy button "تواصل معنا الآن ←" → (6) Footer.
- **Grid:** Editorial rows are 2-col (≈ 50/50, image ~16:9); steps are 4-col.
- **Footer:** 3 columns: brand + social icons (LinkedIn, YouTube, Instagram) left; "روابط سريعة" centre (الرئيسية / حلولنا / القطاعات / من نحن / اتصل بنا); "معلومات الاتصال" right with **sample values**: `info@example.com`, `+966 11 123 4567`, "الرياض، المملكة العربية السعودية". Bottom: "© 2025 آفاق الطاقة. جميع الحقوق محفوظة." + privacy/terms links. **Sample contact — do not publish.**
- **Uncertainties:** The five solutions are the reference's own taxonomy (residential / commercial-industrial / water pumping / smart irrigation / agriculture) — Ghamdan's approved solution taxonomy must come from the PDFs, not from this list; the double-arrow hero button is probably an artefact.

## 04 — Catalog (`ui-reference-04-catalog.jpg`)

- **Page:** Product catalog / المنتجات. **Brand:** Sunfold (Latin wordmark, logo left of it, top-right in RTL).
- **Header:** Single row on white/sky. Right: logo + "Sunfold". Centre nav: الرئيسية، المنتجات، الحلول، عن الشركة، الموارد، تواصل معنا. Left: globe icon + `English | العربية` (note: **English first here**, unlike other pages) + navy WhatsApp button "استفسر عبر واتساب".
- **Hero:** Split hero, not full-bleed: left ≈ 55% is a large photo (solar panels + submersible pump gushing water, mountains); right ≈ 45% is white with a small heading "طاقة اليوم / لمستقبل أفضل" (top-right), then a large extra-bold heading "دليل منتجات الطاقة الشمسية / والمضخات والمعدات الزراعية", 2-line copy, navy button "تواصل معنا الآن ←". Below the hero, a 3-item trust row with icons: مستقبل أكثر استدامة / دعم فني متخصص / منتجات عالية الجودة. Hero ≈ 560 px tall including the trust row.
- **Section order:** (1) Hero + trust row → (2) "استكشف المنتجات" — centred search input (rounded, magnifier icon, placeholder "ابحث في المنتجات...") above a **13-item category icon strip** in one row: الألواح الشمسية / بطاريات ليثيوم / بطاريات رصاصية / بطاريات رصاصية (duplicate label — see below) / المحولات الكهربائية / منظمات الشحن / ملحقات الطاقة / المضخات الشمسية والغاطسة / المضخات السطحية وبئر الارتوازي / المحركات / أنظمة الري (تنقيط ورش) / الفلاتر والصمامات / المعدات الزراعية. Each item = small square tile with a product cut-out image + 1–2 line label beneath → (3) "المنتجات المميزة" — heading right, link "عرض جميع المنتجات ←" left; **12 product cards in a 6-column × 2-row grid**: each card = white, light border, rounded corners; product cut-out image on a very light grey square; bold product name; small grey category label; outlined blue button "استفسر الآن" with WhatsApp icon. Products shown: لوح شمسي عالي الكفاءة / محول طاقة شمسي / بطارية ليثيوم / بطارية رصاصية / منظم شحن شمسي / ملحقات طاقة شمسية / مضخة غاطسة شمسية / مضخة سطحية / محرك كهربائي / نظام ري بالتنقيط (تنقيط ورش) / فلتر وصمامات مياه / جرار زراعي → (4) Wide CTA banner: light-blue gradient panel, text right ("تحتاج إلى مساعدة في اختيار الحل الأنسب؟" + copy), two buttons (navy WhatsApp "تواصل معنا عبر واتساب" + white outlined "أو أرسل لنا رسالة" with mail icon), photo right (solar field + sprinklers) → (5) "لماذا تختار حلولنا؟" — 4 columns with icons and dividers: حلول متكاملة / خبرة موثوقة / منتجات عالية الجودة / دعم بعد البيع → (6) Footer.
- **Grid:** Category strip 13 in a row (very tight); product grid 6 columns — the densest grid in the set. Container same ≈ 1300 px.
- **Footer:** 4 columns — the closest to the prompt's "four-column footer": brand + description + 4 social icons (LinkedIn, YouTube, Instagram, Facebook) | "فئات المنتجات" (الألواح الشمسية / البطاريات / المحولات / المضخات / أنظمة الري / المعدات الزراعية) | "روابط سريعة" (المنتجات / الحلول / عن الشركة / الموارد / تواصل معنا) | "تواصل معنا" (الرياض، المملكة العربية السعودية / `info@sunfold.com` / `+966 11 234 5678` + outlined WhatsApp button "استفسر عبر واتساب"). Bottom: "© 2025 Sunfold. جميع الحقوق محفوظة." + privacy/terms. **All contact values are sample.**
- **Defects / inconsistencies in the reference itself (record, do not copy):** the category strip lists "بطاريات رصاصية" twice (two different battery images, same label); the category strip (13 items) and the product grid (12 cards) do not match one-to-one; a tractor ("جرار زراعي") appears as a "product" — Ghamdan's approved catalog must decide whether farm machinery is in scope.
- **Uncertainties:** No visible filter panel (only search + category strip) — prompt §8.1 filters (brand / power / system type / usage / availability) are not shown; no pagination, no result count, no sort control on this page (contrast 08, which has them).

## 05 — Projects (`ui-reference-05-projects.jpg`)

- **Page:** Projects listing / مشاريعنا. **Brand:** Sunfold.
- **Header:** Single row, transparent over sky. Right: logo + "Sunfold". Centre nav: الرئيسية، من نحن، مشاريعنا (underlined), خبراتنا، تواصل معنا. Left: language + navy WhatsApp button "تواصل عبر واتساب". Nav differs again ("خبراتنا" instead of "حلولنا").
- **Hero:** Full-bleed solar-farm photo with mountains; text **left-aligned** (visually left column): two-line heading "مشاريع طاقة شمسية / وحلول مائية لمستقبل أفضل", 2-line copy, navy pill "استعرض مشاريعنا ←". Hero ≈ 480 px.
- **Section order:** (1) Hero → (2) Centred intro: small label "— مجالات مشاريعنا —" + heading "مشاريع متنوعة... لحلول مستدامة" + copy → (3) Filter pills, centred: **جميع المشاريع** (navy, active, grid icon) / الطاقة الشمسية (sun icon) / الأنظمة المائية (droplet) / القطاع الزراعي (leaf) → (4) Four editorial project rows, alternating: (a) منظومة كهروضوئية على الأسطح — image left, text right, category label "مشاريع الطاقة الشمسية" + sun icon; (b) ضخ المياه بالطاقة الشمسية — text left, image right, label "مشاريع الأنظمة المائية"; (c) أنظمة الري الذكية — image left, text right, label "مشاريع القطاع الزراعي"; (d) منظومات للطاقة للمشاريع التجارية — text left, image right, label "مشاريع الطاقة الشمسية". Each: bold title, 2-line copy, underlined blue link "عرض المشروع ←" → (5) "مشاهد من مشاريعنا" gallery carousel: 4 images in a row, round arrow buttons at both ends, dot pagination below (4 dots, first active) → (6) Dark-navy CTA band: heading "لنبدأ مشروعك القادم معاً" + copy + white button "تواصل معنا الآن"; right side 3 mini-features with icons (خبرة متكاملة / حلول مخصصة / استشارة مجانية) separated by vertical dividers → (7) Footer.
- **Grid:** Editorial rows 2-col ≈ 55/45; gallery 4-col.
- **Footer:** Brand + tagline "طاقة نظيفة. مياه مستدامة. لمستقبل أفضل." + 3 social icons (LinkedIn, YouTube, Instagram) left; centre "تواصل معنا" with **sample** `info@sunfold.com`, `+966 11 456 7890`, الرياض; right "روابط سريعة" list; giant pale "sunfold" watermark across the footer; bottom "© 2025 Sunfold. جميع الحقوق محفوظة." + privacy/terms. Note: phone number here differs from 04 (`…456 7890` vs `…234 5678`) — **sample numbers are inconsistent across images**.
- **Uncertainties:** No project location, date, capacity or outcome figures on any card — do not invent them; the gallery carousel's behaviour (autoplay? swipe?) cannot be inferred from a static image; filter pills are the only filtering UI.

## 06 — Product Detail (`ui-reference-06-product-detail.jpg`)

- **Page:** Product detail — generic solar inverter ("عاكس الطاقة الشمسية"). **Brand:** الشركة (placeholder).
- **Header:** Single row over sky. Right: logo + "الشركة". Centre nav: الرئيسية، منتجاتنا، حلولنا، من نحن، تواصل معنا. Left: language pill + navy WhatsApp button "تواصل عبر واتساب".
- **Hero / identity block:** Split: right ≈ 45% text — breadcrumbs "الرئيسية > المنتجات > أنظمة الطاقة الشمسية > العواكس الشمسية" (with home icon), extra-bold title "عاكس الطاقة الشمسية", 2-line sub-copy, a small thumbnail image (inverter underside) and a navy button "تحميل كتيب المنتج" with document icon. Left ≈ 55%: large studio product photo (white inverter) over a sky/rooftop photo background. **No model number, no brand name, no wattage, no price anywhere.**
- **Section order:** (1) Hero/identity → (2) "نظرة عامة على المنتج" — editorial split: image left (villa roof panels, ~16:10), text right on a light-grey panel: heading + 3-line copy → (3) "المميزات الرئيسية" — 4 columns with icons + dividers: أداء مستقر وموثوق / كفاءة عالية / حماية متكاملة / متوافق مع تطبيقات متعددة → (4) "المواصفات الفنية" — light-grey panel: product image left (inverter on sky background, ~4:5), spec table right with **10 rows, every value a dash "—"**: الموديل / نوع العاكس / مدى جهد الإدخال / جهد الإخراج / الكفاءة / طرق الاتصال / درجة الحماية / بيئة التشغيل / الأبعاد / الوزن. **This is an explicit placeholder table — values must come from the manufacturer datasheet, never guessed** → (5) "منتجات ذات صلة" — 3 cards: الألواح الشمسية / أنظمة تخزين الطاقة / أنظمة تسخين المياه الشمسية (image top ~16:9, bold title, 1–2 line copy, blue link "عرض المنتج ←") → (6) Dark-navy CTA band: solar-panel photo left, text right "تحدث مع أحد خبرائنا الآن" + "احصل على استشارة مجانية لمشروعك" + white WhatsApp button; below, 3 mini-features (استشارة مجانية / إرشاد متخصص / حلول مخصصة) → (7) Footer.
- **Grid:** Editorial 2-col; features 4-col; related 3-col.
- **Footer:** Minimal single row: logo + "الشركة" left; nav centre; giant pale "الشركة" watermark; bottom "© 2025 جميع الحقوق محفوظة" + privacy/terms. No contact column, no social icons.
- **Uncertainties:** No gallery/thumbnails strip (only one small thumbnail in the hero), no downloads list beyond the single "download brochure" button, no certificates section, no sticky mobile WhatsApp bar visible, no availability text. Prompt §8.3 requires gallery, downloads, certificates, warranty — the reference shows only part of that; the rest must be built in the same visual language.

## 07 — Contact (`ui-reference-07-contact.jpg`)

- **Page:** Contact / تواصل معنا. **Brand:** Sunfold.
- **Header:** Single row over sky. **Logo on the LEFT here** (Sunfold, Latin wordmark) — the only image with a left-side logo; nav centre: الرئيسية، من نحن، مجالات خبرتنا، لماذا اخترنا، تواصل معنا; right: language pill + navy button "تواصل معنا" (no WhatsApp icon). Nav differs again.
- **Hero:** Full-bleed villa + rooftop panels; text **right-aligned**: huge heading "تواصل معنا", 2-line copy, navy WhatsApp button "ابدأ محادثة واتساب ←" with WhatsApp icon. Hero ≈ 560 px.
- **Section order:** (1) Hero → (2) Three contact-method cards in a row (light-grey panels, rounded): استشارة عبر واتساب (WhatsApp icon in pale-blue circle) / استفسار عام (mail icon) / الدعم الفني (headset icon). Each: bold title, 2-line copy, blue text-link ("ابدأ محادثة واتساب ←" / "أرسل استفسارك ←" / "تواصل مع الدعم الفني ←"). **No phone number, e-mail address or street address is printed on any card** → (3) Two-column block: left ≈ 40% a tall sky-blue panel "معاً نبني / مستقبل أكثر استدامة" + copy + solar-pergola photo at the bottom; right ≈ 60% the form card "أرسل لنا رسالة" + copy: fields — الاسم الكامل * / البريد الإلكتروني * (side by side), نوع الاستفسار * (select, "اختر النوع"), رسالتك * (textarea, "اكتب رسالتك هنا..."), full-width navy submit button "إرسال الرسالة ←". All fields show placeholder text, no values → (4) Dark-navy CTA band with solar-panel photo left: heading "لنناقش مشروعك / ونحول رؤيتك إلى واقع", copy, white WhatsApp button "ابدأ محادثة واتساب"; bottom row 3 mini-features (حلول مخصصة / خبرة موثوقة / استشارة مجانية) → (5) Footer.
- **Grid:** 3-col method cards; form 2-col fields; 2-col form/side-panel.
- **Footer:** Minimal: logo + tagline left ("حلول مبتكرة لمستقبل أكثر استدامة في مجالات الطاقة الشمسية والمياه والزراعة."), nav centre (الرئيسية / من نحن / مجالات خبرتنا / لماذا اخترنا / تواصل معنا), privacy/terms right; giant pale "sunfold" watermark; bottom "جميع الحقوق محفوظة © 2025". No contact column, no social icons.
- **Uncertainties:** No map / location block (prompt §5-07 allows map "only if verified location data is supplied" — none is shown, so none is assumed); the inquiry-type select has no visible options; no working-hours, no address, no phone — all must come from approved client data.

## 08 — Product Category (`ui-reference-08-product-category.jpg`)

- **Page:** Product category — solar energy ("الطاقة الشمسية / لحلول أكثر استدامة"). **Brand:** صن فولد.
- **Header:** Single row over pale sky. Right: logo + "صن فولد". Centre nav: الرئيسية، مجال خبراتنا، من نحن، لماذا نحن، تواصل معنا. Left: language + navy button "تواصل معنا".
- **Hero:** Split hero with a **product still-life photo** (two solar panels + two white inverters, house behind) spanning the full width behind/left; text right: breadcrumbs "الرئيسية > منتجاتنا > الطاقة الشمسية", huge two-line heading "الطاقة الشمسية / لحلول أكثر استدامة", 2-line copy, navy button "طلب استشارة ←". Hero ≈ 540 px.
- **Section order:** (1) Hero → (2) Category tab strip — 6 items in a row with icons and hairline dividers: **جميع المنتجات** (active, pale-blue fill, grid icon) / الألواح الشمسية / محولات الطاقة / أنظمة التخزين / أنظمة التركيب / الملحقات → (3) Filter bar (light-grey rounded panel): "تصفية المنتجات" + funnel icon; selects: نوع المنتج "جميع الأنواع" / العلامة التجارية "جميع العلامات التجارية"; search input "البحث في المنتجات..." with magnifier → (4) Result meta row: right "عرض 12 من 24 منتج", left "الترتيب حسب: الأحدث" (select) → (5) Product grid **4 columns × 2 rows = 8 cards**: each card = white, light border, image top (~4:3) on light-grey, bold title, 1–2 line grey caption, full-width navy button "طلب استشارة ←". Cards: ألواح شمسية / محولات الطاقة / أنظمة التخزين / أنظمة التركيب / مجموعات متكاملة / صناديق الحماية والتجميع / أنظمة المراقبة / الملحقات الكهربائية. **Note: these 8 cards are categories/sub-categories, not individual products** (their titles match the tab strip) → (6) "فئات ذات صلة" — heading right, link "عرض جميع الفئات ←" left; 4 cards in a row: الطاقة للمنازل / الطاقة للمنشآت التجارية / الطاقة للمشاريع الكبرى / حلول التخزين (image top ~16:9 + bold title + blue link "استكشف الفئة ←") → (7) Dark-navy WhatsApp CTA band: WhatsApp icon in a blue rounded square, heading "تحدث مع خبرائنا عبر واتساب", copy, white button "بدء المحادثة ←"; right side 3 mini-features (إجابات سريعة / استشارات مخصصة / بدون أي التزام) → (8) Footer.
- **Grid:** Tabs 6-col; filter bar 3-field; product grid 4-col; related 4-col.
- **Footer:** Minimal: logo + "صن فولد" + "مستقبل أكثر إشراقاً" left; centre "روابط سريعة" (الرئيسية / منتجاتنا / لماذا نحن / تواصل معنا); right "تابعنا" with 3 social icons (YouTube, LinkedIn, X); bottom "جميع الحقوق محفوظة © 2025" + privacy/terms.
- **Inconsistencies in the reference (record, do not copy):** the meta row says "12 of 24 products" but only 8 cards are shown; the tab strip has 6 items while the grid shows 8 (adds أنظمة المراقبة / صناديق الحماية / مجموعات متكاملة); the grid cards are categories, so a real category page needs a decision — cards = products (per prompt §8.2) with the category strip above.
- **Uncertainties:** Pagination is not shown (12 of 24 implies a second page, but no pager is visible); filter selects show no option lists; no per-card brand/model/spec — unlike 04, these cards carry no WhatsApp button, only "طلب استشارة".

## 09 — Solution Detail (`ui-reference-09-solution-detail.jpg`)

- **Page:** Solution detail — solar water pumping ("حلول ضخ المياه بالطاقة الشمسية"). **Brand:** Sunfold.
- **Header:** Single row over sky. Right: logo + "Sunfold". Centre nav: الرئيسية، خبراتنا، من نحن، الرئيسية (duplicate "الرئيسية" — second item is probably a rendering error for "حلولنا/مشاريعنا"). Left: globe + "English" only (no عربي visible) + navy button "تواصل معنا". **Nav is inconsistent with every other page — treat as a reference defect.**
- **Hero:** Full-bleed photo (solar array + blue pump pipe gushing water); breadcrumbs top-right "الرئيسية > حلولنا > ضخ المياه بالطاقة الشمسية"; text right: two-line heading "حلول ضخ المياه / بالطاقة الشمسية", 2-line copy, navy button "ناقش مشروعك معنا ←". Hero ≈ 460 px.
- **Section order:** (1) Hero → (2) "نظرة عامة" editorial split: image left (pump + basin, ~16:10), text right: pill "نظرة عامة", bold heading "مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.", 3-line copy, then 3 mini-features in a row (زراعة أكثر إنتاجية / مجتمعات أقوى / بيئة أنظف) with leaf/people/leaf icons → (3) "معالجة التحديات الحقيقية في توفير المياه" on a pale-blue-grey band: heading + copy right, **4 challenge columns** left-to-right: الاعتماد على الوقود الأحفوري / صعوبة الوصول لشبكات الكهرباء / ارتفاع تكاليف التشغيل / نقص إمدادات المياه الموثوقة — each with a blue icon in a white circle, bold title, 2-line copy → (4) "أربع خطوات لحل متكامل" — heading right with pill "كيف يعمل النظام"; 4 step cards in a row (numbered **01–04 right-to-left**, blue number badge top-right of each card): الطاقة الشمسية / جهاز التحكم / مضخة المياه / توزيع المياه — each with a product cut-out image, bold title, 2-line copy, and a left-pointing arrow between cards → (5) **System diagram** (full-width, pale-blue band): a cutaway illustration — solar panels → controller → submersible pump in a well → water tank on a tower → distribution network → crops — with Arabic labels (ألواح شمسية / جهاز التحكم / مضخة المياه / خزان المياه / شبكة التوزيع) and connecting pipes/arrows. Heading right: pill "المكونات الرئيسية" + "نظام متكامل وموثوق" + copy. **This is the only diagram in the set; it is an illustration, not a photo** → (6) "مناطق التطبيق" — heading right + copy; 3 image cards with dark overlay captions at the bottom: الزراعة والري / إمدادات المياه للمجتمعات / مشاريع البنية التحتية للمياه → (7) Two panels side-by-side: "منتجات مكملة لحلول متكاملة" (3 small product cards: أنظمة الطاقة الشمسية / خزانات المياه / أنظمة الري والتوزيع, each with image + title + blue link) and "قصص نجاح ملهمة" (1 wide image card + blue link "استكشف المزيد من المشاريع ←") → (8) Dark-navy WhatsApp CTA band: green WhatsApp icon in a rounded square, heading "استفسر عن مشروعك" + "تواصل معنا عبر واتساب", copy, white button "مراسلتنا على واتساب ←", photo right (solar + pump) → (9) Footer — **cut off at the bottom edge of the image**: only the top of the footer is visible (logo + social icons, "روابط سريعة", "حلولنا", "سياسة الخصوصية" + a garbled address fragment "+45 Power Avenue, Streng…" — **gibberish sample text, do not use**). Footer structure below the fold line cannot be determined from this image.
- **Grid:** Editorial 2-col; challenges 4-col; steps 4-col; applications 3-col; related 3+1.
- **Uncertainties:** Footer is truncated — full footer unknown for this page; the duplicate nav item; the diagram's labels/positions must be rebuilt as a real component (SVG/HTML), not screenshotted; no technical specs, no component quantities, no pump sizing data — the pumping guidance tool (§11) has no data source in this image.

## 10 — Project Detail (`ui-reference-10-project-detail.jpg`)

- **Page:** Project detail — sample project ("مشروع نظام طاقة شمسية للمياه والزراعة"). **Brand:** Sunfold.
- **Note on the image itself:** the screenshot has **black vertical bars (~70 px) on both sides** — the captured page is ≈1300 px wide centred on a 1440 px canvas. This is a property of the supplied image, not of the design; the build uses the full viewport width.
- **Header:** Single row over sky. Right: logo + "Sunfold". Centre nav: الرئيسية، المزايا، خبراتنا، لماذا نحن، تواصل معنا (note: "المزايا" appears only here). Left: globe + "EN" + white outlined button "تواصل معنا" + navy button "ابدأ مشروعك". Two header buttons — the only image with two.
- **Hero:** Full-bleed photo (solar array + water tank + irrigation channel); breadcrumbs "الرئيسية / مشاريعنا / مشروع الطاقة الشمسية"; pill "مشروع نموذجي •" (green dot); two-line heading "مشروع نظام طاقة شمسية / للمياه والزراعة" right-aligned; 2-line copy. Hero ≈ 560 px. **"مشروع نموذجي" = "sample project" — the project itself is a placeholder.**
- **Section order:** (1) Hero → (2) "نظرة عامة على المشروع" — text right (heading + 3-line copy) + a light-grey info card left: "الموقع" with pin icon and the literal text "موقع المشروع" (**placeholder — no real location**) → (3) Two alternating editorial rows: (a) "التحدي" (exclamation icon in blue circle) — text right, image left (solar field); (b) "الحل الهندسي" (gear icon) — text left, image right (pump station). Each: bold title + 3-line copy → (4) Two panels side-by-side: "المعدات المستخدمة" (3 product tiles with cut-outs: الألواح الشمسية / مضخات المياه / أنظمة التحكم والمراقبة) and "نطاق الأعمال المنفذة" (list icon, 3-line copy) → (5) "معرض صور المشروع" on a pale-blue band: 4 images in a row + round arrow buttons + (no visible dots) → (6) "أبرز النتائج" — 4 grey cards in a row with icons: دعم المجتمعات المحلية / موثوقية عالية / تحسين الكفاءة التشغيلية / أثر إيجابي على البيئة — **titles only, no numbers, no measured outcomes** → (7) "منتجات وحلول ذات صلة" — 3 horizontal cards (image left, title + 1-line copy + blue link "تعرف على المزيد ←" right): الألواح الشمسية / مضخات الطاقة الشمسية / أنظمة التحكم الذكية → (8) Dark-navy CTA band with solar photo: heading "نحو مستقبل أكثر استدامة" + copy + white button "تواصل معنا ←" → (9) Footer.
- **Grid:** Editorial 2-col; equipment 3 tiles; gallery 4-col; results 4-col; related 3-col (horizontal cards — the only horizontal related-cards in the set).
- **Footer:** 3 columns: brand left; centre "ساعات العمل" with clock icon — "من الاثنين إلى الجمعة / السبت / الأحد / رقم الهاتف / العطلات الرسمية" (**labels only, no values**); right "تواصل معنا" with mail/phone/pin icons and labels "البريد الإلكتروني / رقم الهاتف / العنوان" (**labels only, no values**). Bottom: "جميع الحقوق محفوظة." + privacy/terms.
- **Uncertainties:** No capacity (kW/kWp), no location, no date, no client, no measured results — every project fact is a placeholder; do not publish this project as a real Ghamdan project. Gallery/lightbox behaviour cannot be inferred from a static image.

---

## Shared patterns (all 10 images)

- **Canvas:** 1440 px desktop full-page screenshots; container ≈ 1240–1300 px centred.
- **Language:** Arabic-first, RTL, right-aligned headings; language switcher in the header on every page.
- **Header:** one row, transparent over the hero photo (or white on 04/08 where the hero is split), logo at the RTL start, nav centre, language + CTA at the RTL end. No top contact bar anywhere.
- **Hero:** photographic, 460–640 px tall in the screenshot, headline + sub-copy + one navy CTA. Three hero variants: centred over sky (01), side-aligned over photo (02, 03, 05, 07, 09, 10), split white/photo (04, 06, 08).
- **Section headings:** centred or RTL-start, bold, with an optional small pill label above ("من نحن", "قصتنا", "نظرة عامة"…) and occasionally a short blue underline accent (03).
- **Icons:** thin blue line icons (Lucide-style), usually in a pale-blue circle or on their own; green leaf for agriculture, blue droplet for water, blue sun for solar, gear for engineering.
- **Buttons:** dark-navy filled pill/rounded-rectangle as the primary CTA everywhere; white filled button on dark bands; blue outlined button ("استفسر الآن") on product cards; blue text-links with a left-pointing arrow (←) for "discover more".
- **Cards:** white or very light grey panels, light `#E5EAF0`-est. borders, rounded corners ≈ 12–16 px est., soft shadows (barely visible — mostly border-defined, not shadow-defined).
- **CTA band:** dark navy, full-bleed, photo on one side, heading + copy + white button, often with 3 mini-features below or beside. Present on 01, 02, 03, 05, 06, 07, 08, 09, 10 — i.e. **every page except 04**, where the equivalent is the light-blue banner + "why" row.
- **Footer:** light background, logo + nav + legal links + giant pale watermark wordmark (02, 05, 07) or plain (others). Structure varies per page (1-row to 4-column) — **there is no single canonical footer**; 04 is the most complete (4 columns) and is the recommended base.
- **Photography:** bright daylight solar/agriculture/water photos, blue sky, saturated greens/blues; product cut-outs on light-grey squares; no people visible in any image (no team photos, no customer photos).

## Page-specific patterns (do not force uniformity)

- 01 only: marquee strip; faint line-art solar-field illustration; projects + products split section.
- 02 only: mission/vision cards; giant footer watermark wordmark in Arabic.
- 03 only: green header WhatsApp button; 5 alternating editorial rows; 4-step "how we work" with arrows; "القطاعات" nav item.
- 04 only: 13-item category icon strip; 6-column product grid; split hero with trust row; Latin "Sunfold" wordmark with globe language icon.
- 05 only: filter pills; gallery carousel with dots; "خبراتنا" nav item.
- 06 only: spec table with dash values; "download brochure" button; literal "الشركة" brand.
- 07 only: left-side logo; contact-method cards; contact form (the only form in the set); no contact values anywhere.
- 08 only: category tabs + filter bar + result count + sort; 4-column category grid; cards are categories, not products.
- 09 only: system cutaway diagram; 4 challenge columns; numbered step cards with product images; footer truncated.
- 10 only: black side bars in the screenshot; two header buttons; "الموقع" placeholder card; results cards with no numbers; horizontal related cards.

## Uncertainties that cannot be inferred from static images (all pages)

1. Sticky-header behaviour, scroll compaction, mobile menu, floating WhatsApp button, sticky mobile bar — none visible (see Finding 3).
2. All motion/animation: entrance, stagger, hover, carousel autoplay, marquee movement, count-up — not observable.
3. All interactive states: hover, focus, active, disabled, loading, error, empty states.
4. Responsive behaviour below 1440 px: breakpoints, stacking order, font scaling — no mobile/tablet screenshot supplied.
5. Actual font family, exact hex values, exact spacing in px — estimates only (see DESIGN_DNA.md).
6. Form behaviour (07): validation, submission target, success state.
7. Search/filter behaviour (04, 08): option lists, filtering logic, pagination.
8. Gallery/lightbox behaviour (05, 10): navigation, captions, zoom.
9. Whether the giant footer watermark, the line-art illustration (01) and the system diagram (09) are images, inline SVG, or CSS.
10. Content truth: every headline, paragraph, product name, project name, statistic and contact value in the images is unapproved sample copy until the PDFs / client confirm it.
