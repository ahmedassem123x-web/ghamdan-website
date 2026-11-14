# Stack & libraries — Ghamdan web kit

## Build
- Vite (dev + build) + Tailwind CSS (tokens in `src/styles/tokens.css`)
- Vanilla JS first; React only if Ahmed's design needs it — no framework for its own sake

## Motion (professional web animation)
- **GSAP + ScrollTrigger** — hero entrance, staggered reveals, scroll-linked sections (primary)
- **Lenis** — smooth scroll (pairs with GSAP ScrollTrigger)
- **Lottie** — small UI micro-animations (success, loading, toggles), one JSON file
- **Three.js** — only if a glossy product/hero 3D shot is requested
- CSS transitions for hover / press states; `prefers-reduced-motion` respected
- Rule: 2–3 intentional motions per page max — one entrance, one scroll/depth, one hover/reveal

## Fonts & type
- Tajawal + Montserrat, self-hosted in `assets/fonts/`, consistent type scale (large / medium / small)

## Image extraction — UI/UX, pixel-faithful
- `~/workspace/tools/site-extract/` — SingleFile (`single-file-cli`), website-scraper, HTTrack, Playwright (screenshots + full-page capture), Python BeautifulSoup/lxml
- `image-search` skill — `/opt/hatch/bin/image-search "<query>" --max-results 5` (locators only; download + verify before use)
- `site-replica-study` / `reference_replica_study_and_verification` — study a reference site whole first, write one motion spec, verify the replica in several passes
- Never present a scraped / placeholder image as a real Ghamdan product photo

## Verification (before any "ready")
- `frontend-design` visual verification: screenshot desktop 1920px + phone ~390px
- `website_build_evidence_verification`: same-build evidence bundle
- Ahmed's own phone test is decisive for mobile — browser cannot resize
