# Skills & Tools Audit — GTS v15 Phase 1

**Audit date:** 2026-11-15. **Method:** direct version checks in this shell + directory listing of
`~/workspace/custom-skills/` + reading the two audit-relevant SKILL.md files in full.

## 1. Tools — verified in this shell

| Tool | Result | Notes |
|---|---|---|
| node | **v24.22.1** | Current shell default. Report appendix records fnm-managed Node **26.13.1 / 24.22.3** — the shell's 24.22.1 matches neither exactly. Use the project's required Node explicitly in Phase 2 (check `.nvmrc`/fnm default) before any build. |
| npm | **10.9.4** | OK |
| python3 + PIL | **PIL 10.2.0** | Available for image inspection/manipulation |
| ImageMagick (`convert` / `magick` / `identify`) | **NOT FOUND** | `which` returns nothing. Image work must use PIL, `sips`-style alternatives, or install ImageMagick (auto-confirm install rule applies — record if installed). |
| Playwright headless-shell | **Present** | `~/.cache/ms-playwright/chromium_headless_shell-1255` + `ffmpeg-1013`. Matches report (Playwright 1.65.1 / Chrome 159 headless shell). Full browser launch not tested in this audit (memory tight). |
| `~/workspace/tools/dev-stack/` | **Present** | `starter-kit/` (GSAP 3.15.1, Lenis 1.3.27, Motion 14.14.0, Lottie 5.13.0, Anime.js 4.5.0, Three.js 0.187/R3F 9.8.2, Remotion 4.0.543, HyperFrames 0.9.43), `mcp/`, `nestjs-reference/`, `playwright-test.png`, READMEs (batch2, top15). Environment-level tools only — **not** site dependencies. |
| Memory | **135 MB free / 494 MB available** of 7,934 MB at check time | Same pressure regime as the 2026-11-14 EPERM fault. Prefer text fetches over Playwright; run builds/probes only after a `free -m` + test-write check. |
| Git | **Not available in this working copy** | `~/workspace/ghamdan-website-v2/` is not a git repository. All repo operations (log, status, push) must go through the remote/browser path. |

## 2. Custom skills — all 15 required skills EXIST

Checked against `~/workspace/custom-skills/` (33 skills total on disk). Every skill the v15 spec
and the task named is present:

| Skill | Present | Role in v15 |
|---|---|---|
| `frontend-design` | ✓ | Implementation + visual verification |
| `reference_replica_study_and_verification` | ✓ (SKILL.md read) | Reference study + multi-pass verification |
| `site-replica-study` | ✓ | Reference study method |
| `no-slop-ui` | ✓ | Anti-slop review lens (v0.7.0) |
| `hallmark` | ✓ | Design-quality review lens (v2.0.0) |
| `21st-ui-review` | ✓ | UI review lens |
| `professional-design` | ✓ | Design execution |
| `ui-ux` | ✓ | UX structure |
| `logo-design` | ✓ | Logo handling (official GTS logo) |
| `motion-studio` | ✓ | Motion system |
| `dev-pipeline` | ✓ | Build/deploy pipeline |
| `testing-and-qa` | ✓ | QA method |
| `website_build_evidence_verification` | ✓ (SKILL.md read) | Evidence bundle before presenting a build |
| `live_deployment_defect_verification` | ✓ | Verify hosted fixes on the live URL |
| `prompt-architect` | ✓ | Default first step for work orders (per standing workflow) |

Other relevant skills on disk (not required by this task, noted for later phases):
`github_vercel_publish_fallback` (browser publish when connectors 403), `live_deployment_defect_verification`,
`client_document_version_discipline`, `pdf_delivery_diagnosis_before_rebuild`,
`artifact_delivery_failure_recovery`, `motion-studio`, `store-cro`, `pixels-tracking`,
`marketing-skills`, `saudi-ads-data`, `tiktok-snapchat-ads`, `whatsapp-api-projects`,
`database-and-api-design`, `system-architecture`, `software-engineering`,
`professional-programming`, `requirements-engineering`, `research-and-analysis`,
`no-duplication-navigation`, `software-systems-analysis`.

## 3. Audit procedures adopted (from the two SKILL.md files read)

### `reference_replica_study_and_verification`
- Study the reference **whole** before building; record group sizes, entry direction, exit
  conditions, whether motion reverses on scroll-up or plays once.
- Reconcile **one written spec** before coding; resolve conflicts by rechecking the reference;
  mark unobserved motion as **unconfirmed** — do not build it as if confirmed.
- Freeze the spec; treat a later correction as a spec change, not a blind patch.
- **Motion invariants:** destination hidden until the transition fully covers the screen; long
  pinned progress driven by scroll capture at normal page height (not a stretched stage); scroll-up
  reverses pinned motion; one-time entrances never replay on scroll-up; queue clicks during transitions.
- **Verify in ≥3 passes** (phone + desktop, console errors, horizontal overflow); fix and re-run
  the affected pass; report plainly what still frames/code review cannot prove (mid-flight motion,
  hover, scroll-lock feel); name the deciding check only the user browser test can settle; stop the
  patch cycle when a second correction contradicts an earlier fix and return to the whole-reference study.

### `website_build_evidence_verification`
- Record **build identity** (slug/version/size/hash) before probing; probe the exact build presented;
  discard evidence from earlier builds when code changes.
- Drive the page with **real interactions + a screenshot per interaction**; re-probe every claimed
  fix on the same build.
- **Measure numerically:** horizontal overflow in px at narrow phone / standard phone / desktop
  (require 0 px, name the widest element when it appears); contrast ≥ 4.5:1 for dark text pairs;
  hero entry timing from captured frames (not from code); **screenshot with JavaScript disabled** —
  main content must stay visible; counters must reach final values; floating button must not cover
  a hero button at narrow phone width.
- **Content truth in every language:** search full source incl. dictionaries for each removed marker
  (require 0 hits); treat any number/warranty/date/price/client name without a source as unsourced;
  check all language versions; open one WhatsApp link, confirm it reaches the messaging page, close
  without sending, then validate every other WhatsApp link; **check no price appears anywhere**
  (cards, dictionaries, hidden text) when the brief forbids prices.
- **Report what is proven vs. what only the user can settle;** state plainly when probes ran on a
  local file instead of a hosted URL; name the user phone test as the deciding check.

## 4. Gaps / cautions for later phases

1. **ImageMagick missing** — install or use PIL for any image work (record the choice).
2. **Node version ambiguity** — shell 24.22.1 vs. fnm 26.13.1/24.22.3; pin before building.
3. **No git in the working copy** — repo state (HEAD 9f53195) unverifiable locally; browser/remote path only.
4. **Boards + long screenshot not yet visually inspected** — 5 files located in `incoming/v15/`
   (see `current-state-audit.md` §7); visual inspection is an open Phase 1 item.
5. **Playwright presence confirmed, launch not tested** in this audit — verify the headless shell
   actually launches before relying on it for Phase 8 (memory was 135 MB free).
6. **Skills are installed, not yet activated for this build** — Phase 2 must read the SKILL.md of
   each skill it actually uses (especially `frontend-design`, `site-replica-study`,
   `reference_replica_study_and_verification`, `website_build_evidence_verification`,
   `live_deployment_defect_verification`, `no-slop-ui`, `hallmark`, `21st-ui-review`) and record
   which were activated, per v15 §25.
