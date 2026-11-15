# Architecture Decision Record — Ghamdan (GTS) Website v2 (v15 Phase 2 Lock)

**Lock date:** 2026-11-15 (Asia/Aden). **Status:** LOCKED (Phase 2).
**Sources:** Phase 1 forensic audit (`docs/current-state-audit.md`, `docs/reference-to-implementation-map.md`,
`docs/reference-image-inventory.md`, `docs/skills-and-tools-audit.md`); v15 master prompt §§2.2, 2.5, 2.6, 8.4, 15;
source reads cited per decision.

**How to use this record:** each ADR states the decision, the evidence, the alternatives considered,
and the consequences. A later change is a new ADR entry (or a superseding note on the same entry),
never a silent edit. Decisions marked **OPEN** are recorded with both options and their evidence —
they are not decided silently.

---

## ADR-01 — Keep the Next.js static-export stack; no migration (DECIDED)

**Decision:** keep Next.js 16.4.6 / React 19.3.0 / TypeScript 5.9.3 / Tailwind 4.3.3, static export
(`output: "export"`, `images.unoptimized: true`), deployed on Vercel. No migration to Laravel, Vue,
hand-written HTML, or any server/CMS architecture.

**Evidence (audit §1, §3):**
- Installed versions verified from `package-lock.json` (lockfile v3): next 16.4.6, react/react-dom
  19.3.0, typescript 5.9.3, tailwindcss 4.3.3, gsap 3.15.1, lenis 1.3.27, lucide-react 0.525.0.
- Static export confirmed in `next.config.ts`; no server, middleware, or ISR.
- Last local build produced 231 HTML files (228 locale routes + root + 404 + `_not-found`); the
  historical 229-route probe passed with 0 errors (2026-11-14 recovery verification).
- The v15 §2.2 migration test is not met: no real technical blocker is proven; the existing
  architecture satisfies the required behaviour (trilingual static catalogue + WhatsApp funnel);
  a migration would add cost, deployment, and data risk with no authorised scope change.

**Alternatives considered:**
- *Hand-maintained standalone HTML pages* — rejected (v15 §2.2, §7.3): 231 generated HTML files are
  build output, not source. Duplicating them as source would destroy maintainability.
- *Laravel / Vue / other framework* — rejected: no proven blocker; familiarity/speed is not a
  permitted reason (v15 §2.2).
- *Supabase/NestJS backend or CMS* — rejected for this phase (v15 §8.4, §15.2): explicitly a
  separately scoped phase; Track B remains out of scope.

**Consequences:**
- All Phase 3–8 work is inside the existing Next.js source (components, data modules, templates).
- Version drift note: the report's §2.1 runtime values (GSAP 3.13, Lenis 1.3.4) do **not** match the
  installed lockfile values (3.15.1 / 1.3.27). The lock records **3.15.1 / 1.3.27** as the real
  runtime versions; the `^` ranges in `package.json` permit this and it is not a defect.
- Node version must be pinned before any Phase 3+ build (shell default v24.22.1 vs. fnm record
  26.13.1 / 24.22.3).
- Stale `next.config.ts` comment ("deploys to Vercel … and GitHub Pages") to be corrected in Phase 3
  (GitHub Pages is disabled).

---

## ADR-02 — Corrected M-3 hero table: full-width on 01/05/10 only; split on the other seven (DECIDED)

**Decision:** the per-page hero treatment follows direct inspection of the 10 reference images,
**overriding** the report (§10) and v15 §2.6 premise that the references use full-width heroes on
About, Solutions, Projects, Contact (and pumping).

| Ref | Page | Hero (LOCKED) | Focal subject (ref) | Implementation route |
|---|---|---|---|---|
| 01 | Home | **FULL-WIDTH**, centered | White villa + rooftop solar + sea/city; black headline, no dark overlay | `/[locale]` (`Hero variant="center"`, `hero-villa-mountains.jpg`) |
| 02 | About | **SPLIT** (text left, photo right ~45%) | Villa + rooftop panels + sea | `/[locale]/about` (`hero-villa-sea.webp`) |
| 03 | Solutions | **SPLIT** (text right, photo left ~55%) | White villa + ground-mount panels + mountains | `/[locale]/solutions` |
| 04 | Catalog | **SPLIT** (text left, photo right) | Panel + submersible pump + water + mountains | `/[locale]/products` (`hero-pump-mountains.webp`) |
| 05 | Projects | **FULL-WIDTH** (text top-left) | Ground-level solar farm + mountains | `/[locale]/projects` (`ProjectsClient`; implemented `hero-solar-farm.jpg` is aerial — known risk) |
| 06 | Product Detail | **SPLIT** (text left, product photo right) | White hybrid inverter + rooftop panels | `/[locale]/products/[slug]` (`Gallery.tsx`) |
| 07 | Contact | **SPLIT** (text right, photo left) | House + rooftop panels | `/[locale]/contact` (`ContactForm.tsx`) |
| 08 | Product Category | **SPLIT** (text right, photo left) | Panels + inverter + battery cabinet + villa | `/[locale]/products/category/[slug]` (`CategoryClient`) |
| 09 | Solution Detail (pumping) | **SPLIT** (text right, photo left) | Panels + blue pump + water + palms | `/[locale]/solutions/[slug]` (pumping only; `SystemDiagram.tsx`) |
| 10 | Project Detail | **FULL-WIDTH** (text overlaid top-right) | Solar pumping station (panels + tank + channel + fields) | **NO ROUTE — deliberate** (template only) |

**Evidence:** all 10 images inspected individually at full size (1440×2560 JPEG) in
`docs/reference-image-inventory.md`; hero types measured and recorded in audit §10.1 and the
reference-to-implementation map §1.

**Rule for Phase 4:** full-width on 01/05/10 only; split on 02/03/04/06/07/08/09. Do not force a
full-width composition on pages whose reference uses a split composition. Match image crop, focal
point, overlay, text position, height, and responsive treatment per page. Hero variant as rendered
(not just as coded) is verified visually in Phase 4 for refs 02/03/04/07/08, where the audit could
not confirm the variant from text fetches.

**Consequences:** the M-3 fix is a per-page correction, not a blanket full-width conversion. Any
page whose implemented hero disagrees with this table is a Phase 4 defect.

---

## ADR-03 — Ref-01 home hero fidelity: BLACK headline on bright sky vs. white copy on 25% overlay (OPEN)

**Status: OPEN — recorded for the Phase 3/4 decision. Not decided silently.**

**The two options, with evidence:**

| | Option A — Keep current (white on 25% overlay) | Option B — Match ref 01 (black on bright sky, no overlay) |
|---|---|---|
| **Evidence** | M-2 fix (2026-11-14): overlay reduced 55% → 25%; confirmed in source `Hero.tsx:136–141` (`bg-primary-deep/25` with dated fix comment). White copy is readable; the fix was verified live. | Ref 01 (`ui-reference-01-home.jpg`, inspected full-size): pale sky-blue photo (white villa + rooftop solar + sea/city), transparent header, badge «طاقة ومياه من أجل مستقبل أفضل», **black extra-bold 2-line headline** «حلول طاقة ومياه مصممة لتناسب احتياجاتك», **no dark overlay**, single dark-navy WhatsApp CTA. The long vertical screenshot (§1.5) agrees: light sky-blue hero, large centered black headline. |
| **For** | Proven readable; preserves the C-1/M-2 fix lineage; no contrast risk on the current image. | Faithful to the approved reference — the reference is a specification, not a suggestion (v15 §0). The bright-sky/black-headline treatment is the defining look of the approved home page. |
| **Against / risk** | Diverges from the approved reference on the single most visible element of the site (home hero). The M-2 fix optimised the wrong variable: it kept white copy and tuned the overlay, while the ref removes the overlay and changes the copy colour. | Requires the hero image to be bright enough across its full width (current image is `hero-villa-mountains.jpg`; ref subject is villa + **sea** — `hero-villa-sea.jpg` exists and is used on About). Black copy must pass WCAG AA contrast (≥ 4.5:1) against the actual sky area behind the headline at desktop + mobile crops, with and without the transparent-header question (header is locked opaque white — C-1 — so the hero no longer sits under a transparent header; the ref's transparent header is a deliberate deviation, do not revert). |
| **What the decision needs** | — | Phase 3/4: (1) confirm per-page hero-image assignment (is the home image villa+sea or villa+mountains?); (2) contrast measurement of black headline on the chosen image at 1440×900 and 390×844; (3) a visual side-by-side of both options. M-2's 25% value must not be reused blindly if the image/reference requires a different treatment (v15 §2.5). |

**Related open items (same decision family, Phase 3):** marquee styling (ref white bg/black text vs.
implemented navy bg/white text); home hero subject (villa+sea vs. villa+mountains).
**Decision owner:** Phase 3/4 (with Ahmed's approval — this is a visible fidelity call, not an
engineering default).

---

## ADR-04 — No project-detail route; no invented projects (DECIDED)

**Decision:** `/projects/[slug]` does **not** exist and must not be created. `ProjectDetailTemplate.tsx`
stays unwired. The projects listing keeps its truthful empty state ("مشاريع قيد التوثيق").

**Evidence:** audit §3 (no project-detail route in `out/`); map §2.10; v15 §3.4 (no fake projects,
locations, capacities, results, testimonials). No approved project evidence exists.

**Consequences:** ref 10 is a template for when/if a real project is approved. Creating the route
requires client-approved project evidence + a new ADR entry. The template's gallery/filter/carousel
elements have no real content until then — do not build fake rows to populate them.

---

## ADR-05 — WhatsApp hardcode fix: route all links through `waLink()` (DECIDED for Phase 5)

**Decision:** the 4 hard-coded `wa.me/967775800000` URLs — `src/app/[locale]/contact/page.tsx:41,
43, 61` and `src/components/CatalogueClient.tsx:183` — are routed through `waLink()` in Phase 5.
The canonical source stays `src/data/settings.ts:35–37` (`whatsapp`, `whatsappDisplay`, `whatsappUrl`).

**Evidence:** audit §4. Same number everywhere (no wrong destination found), but the file's own rule
("Never hard-code the number elsewhere", `whatsapp.ts:6`) is violated in 4 places. v15 §13.1
requires one shared configuration source.

**Consequences:** after the fix, a source-wide search for hard-coded `wa.me/…` must return 0 hits
(Phase 5 validation checklist). Contextual messages (`product`, `system`, `category`, `support`,
`guidance`, `contact`, `general`) keep working unchanged. Click logging stays localStorage-only —
never presented as delivery/read.

---

## ADR-06 — Unsourced hero phrase «طاقة اليوم لمستقبل أفضل» — remove/replace (DECIDED for Phase 5)

**Decision:** the phrase «طاقة اليوم لمستقبل أفضل» is removed from the products hero (or replaced
with approved neutral copy if the client supplies it). It must not remain as a headline.

**Evidence:** audit §6/§9.3 — the phrase is at `src/data/pages.ts:576` and renders as the
`/ar/products` hero headline in the live fetch (2026-11-14). No source was found in the audit;
v15 §2.6 requires checking the factual source and replacing with approved neutral copy or removing
it if unsubstantiated. It is distinct from the ref-01 badge «طاقة ومياه من أجل مستقبل أفضل»
(sample copy from a reference — also not GTS copy and not to be adopted as fact).

**Consequences:** Phase 5 must verify 0 hits for the phrase across source, dictionaries, and
generated HTML in all three locales (per `website_build_evidence_verification`: search full source
incl. dictionaries for each removed marker, require 0 hits). The replacement headline (if any) needs
an approved source recorded here; if none is supplied, the hero uses neutral copy derived from the
verified catalogue description, not a new invented slogan.

---

## ADR-07 — "All Products" fix design (DECIDED — design locked, implementation in Phase 4/5)

**Decision:** implement the All-Products entry as a **tab strip on existing pages**, not a new route
(see `docs/site-map.md` §5 for the full design):
1. `/products`: category tab strip under hero/search — «جميع المنتجات» first/active by default
   (all 37 published), then one tab per real GTS category (**8, not the ref's 12 chips**).
   Zero-count tabs visible with honest empty states.
2. `/products/category/[slug]`: same strip, current category active, «جميع المنتجات» first (→ `/products`).
3. Mega menu + mobile drawer: All Products is the first entry (→ `/products` all-tab state).
4. No `/products/all` route is created.
5. The existing `showAll` toggle is removed when the strip lands; featured-12 default is replaced
   by the all-tab default (featured status retained as data for home-page tiles only).
6. Count display «عرض: N / 37» stays, driven by active tab + filters.

**Evidence:** audit §9.2; map §2 (refs 04/08). The ref-08 pattern is a tab strip with
«جميع المنتجات» first/active; the ref-04 pattern is a 12-chip row + «عرض جميع المنتجات» link.

---

## ADR-08 — M-4 repeated related-product imagery is a data-quality item, not a code defect (DECIDED)

**Decision:** 12 stand-in photos serving 37 products is recorded as a **data-quality item** pending
client photos (CI-01). No code change in Phase 4/5 may "fix" it by hiding images, duplicating
different stand-ins, or presenting a stand-in as a real product photo.

**Evidence:** audit §7/§9.4 — 36 media files in `public/` (6 heroes + 12 stand-ins, `.jpg` + `.webp`);
`products.ts` header saying `public/images/photos/` is empty is **stale** (fix the comment in Phase 5).
All 12 photos are stand-ins, not real GTS photos.

**Consequences:** representative status stays labelled in the content model (`image` field + the
stale-header correction). Per-product image mapping is corrected only when real photos arrive;
until then, repetition is structural and must be disclosed in QA, not concealed. The
`website_build_evidence_verification` rule applies: any number/image without a source is unsourced.

---

## ADR-09 — Supporting-page states stay honest (DECIDED)

**Decision:** news (0 articles until CI-07), downloads (no files until CI-06), support warranty
(no duration — pending client approval), guidance (guidance-only, no sizing/recommendation), and
the projects empty state keep their honest empty states. No content is fabricated to fill them,
and no active control is shown for a feature with no data (v15 §13).

**Evidence:** source comments in `news/page.tsx`, `downloads/page.tsx`, `support/page.tsx`,
`solutions.ts:442` (`guidanceOnly: true`).

---

## ADR-10 — Skills activated for this lock (RECORDED)

- `dev-pipeline` (SKILL.md read in full): this lock is the Phase 2 spec. Implementation proceeds
  as tracer-bullet tickets (Phases 3–8), one vertical slice at a time, TDD at pre-agreed seams,
  two-axis review (standards + spec) before any commit/share, no publish without Ahmed's approval.
- `frontend-design` (SKILL.md read in full): existing-system mode — the detected Tailwind/GSAP/Lenis
  system is deferred to; no new design system is introduced in this lock. Detect → plan → build →
  verify applies to every Phase 3+ change, with visual verification mandatory (or explicitly noted
  as skipped with reason).
- Phase 1 audit procedures from `reference_replica_study_and_verification` and
  `website_build_evidence_verification` (SKILL.md files read in Phase 1) were the evidence standard
  for the facts cited in this record: verified facts only; unobserved layout/motion marked
  unconfirmed, not asserted.

---

## ADR-11 — Font swap: Tajawal + Montserrat → IBM Plex Sans Arabic + Inter (DECIDED, Phase 3)

**Decision:** the site's typefaces change from Tajawal (Arabic) + Montserrat
(Latin) to **IBM Plex Sans Arabic + Inter**, as printed on the standalone
Digital Design System boards (129542/129543). The swap is applied in
`src/app/globals.css` (Phase 3, this change): all Tajawal/Montserrat
`@font-face` rules removed; Inter (latin variable 400–700, one file) and
IBM Plex Sans Arabic (400/500/600/700, arabic + latin subsets) wired with
`font-display: swap`; locale-first stacks (`html[lang="ar"]` → Plex,
`html[lang="en"]` → Inter, `html[lang="zh"]` → Noto Sans SC / PingFang SC /
Microsoft YaHei / system-ui, no CJK webfont). The Tajawal/Montserrat files
stay on disk untouched and are no longer loaded. No letter-spacing is
applied to Arabic or Chinese text.

**Numbering note:** the Phase 3 task labelled this decision "ADR-10", but
ADR-10 already exists above (Skills activated for this lock). The font-swap
decision is therefore recorded as **ADR-11**; nothing was renumbered.

**Evidence:**
- Boards 129542/129543 print IBM Plex Sans Arabic + Inter (weights
  300/400/500/600/700); the composite board's "Montserrat" label is
  superseded per v15 §1.7 (standalone boards outrank the composite) —
  see `docs/design-tokens.md` C-2.
- Vendored files verified present in `public/fonts/` (9 files, 305,624 B):
  `inter-latin.woff2` (48,256 B) + 8 Plex files; specimen at
  `docs/qa/font-specimen.html`.
- **Independent live defect (not just a preference):** the live site's four
  Montserrat files are byte-identical (same SHA-256) and fontTools reports
  all four as *Montserrat Thin, weight 100*. The live 500/600/700/800
  Montserrat declarations all load the same Thin file, so Latin bold
  weights on the live site are browser-synthesised. The swap fixes this:
  Inter ships as a real variable font covering 400–700, and Plex ships
  four real weights.
- Weights shipped: 400/500/600/700 only (the boards' 300 Thin is not
  vendored; no board specimen needs it).

**Alternatives considered:**
- *Keep Tajawal + Montserrat* — rejected: contradicts the standalone
  boards (the target direction) and leaves the synthesised-bold defect.
- *Keep the old faces as fallbacks in the stacks* — rejected: a fallback
  that loads would reintroduce the Thin file; the new stacks fall back to
  system faces instead (metric-close, no layout shift with
  `font-display: swap`).
- *Vendor a CJK webfont* — rejected: multi-MB; devices already carry CJK
  system fonts (tokens doc §2).

**Consequences:**
- Primary-button fill deviation (same change, recorded here for the
  record): the board-spec primary fill `#0081FB` + white text is 3.80:1
  (below AA 4.5:1), so the primary fill is `#0B70C9` (5.03:1, AA);
  `#0081FB` is kept for large text, icons, focus rings and non-text
  accents. See `docs/design-tokens.md` §4 and `docs/component-library.md`.
- Token renames in the same change (`--color-primary` was navy `#0F2E4D`,
  `--color-accent` was bright blue `#1E8FE8`): canonical names now carry
  the final board values; the old meanings survive only as deprecated
  aliases (`--color-primary-deep`, `--color-accent-strong`, etc.) so
  un-migrated pages outside Phase 3 ownership keep rendering. Phase 4
  removes the aliases and migrates the remaining pages to the canonical
  tokens — until then, non-Phase-3 pages using `text-primary`/`bg-primary`
  will render in bright blue `#0081FB` instead of navy. That interim
  shift is a known, bounded consequence of the token migration, not a
  silent change; it is listed in `docs/component-library.md` §9.
- D-2 (fonts/palette) and D-3 (logo) in the register below are now
  DECIDED; D-4 (mega-menu design) is DECIDED by the board-driven
  implementation in `src/components/MegaMenu.tsx`.

---

## Open decisions register (for Phase 3/4)

| # | Decision | Owner | Evidence needed |
|---|---|---|---|
| D-1 | ADR-03: ref-01 hero (black-on-bright vs. white-on-overlay) + hero-image assignment | Phase 3/4 + Ahmed | Contrast measurements; side-by-side; image assignment |
| D-2 | ~~Fonts/palette reconciliation~~ — DECIDED by ADR-11 (Phase 3) | Phase 3 | — |
| D-3 | ~~Official logo integration~~ — DECIDED by ADR-11 + brand-identity-lock.md (Phase 3: transparent emblem in header/footer) | Phase 3 | — |
| D-4 | ~~Mega-menu visual design~~ — DECIDED by board-driven MegaMenu.tsx (Phase 3) | Phase 3 | — |
| D-5 | Marquee styling (navy vs. ref white/black) | Phase 3 | Board + ref 01 |
| D-6 | Motion/3D additions (Motion, Lottie, Anime.js, Three.js/R3F, Zod, test tooling) | Phase 5/6 | Per-library justification, bundle impact, fallback, test plan (see technology map §3) |
| D-7 | `/industries` route (v15 §5.1/§6.10 lists it; no route/data exists) | Phase 4 scope decision | Approved industry content — never invented |
| D-8 | Replacement headline for the removed phrase (ADR-06) | Phase 5 + client | Approved neutral copy or removal |
