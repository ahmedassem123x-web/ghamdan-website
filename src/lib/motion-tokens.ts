/**
 * Motion tokens — Phase 0 (dynamic-site plan, foundations).
 *
 * Single source of truth for motion values in JS/TS. The CSS mirror lives
 * in `src/app/globals.css` (`--motion-*` / `--ease-standard` custom
 * properties) — keep the two in sync when a value changes. `src/lib/motion.tsx`
 * re-exports these and keeps the legacy `MOTION` object (seconds, GSAP)
 * for existing code.
 *
 * Rules (web_design_best_practices motion section + animation-motion
 * skill): animate only `transform` / `opacity`; ease-out for every
 * entrance (never ease-in); entrances 100–300ms for micro-interactions,
 * entrances slow enough to SEE (moderate 600ms / slow 800ms, cinematic
 * 900ms ceiling) — Worker A motion-tuning round 2026-11-16: entrances
 * must NOT be fast; always honour `prefers-reduced-motion` (see
 * `src/lib/perf.ts`).
 *
 * Arabic rule (hard): Arabic text motion is WORD- or LINE-level only —
 * never split connected Arabic letters. Use `splitMotionWords()` below
 * (whitespace split) for any word-level text animation; never a
 * character splitter on Arabic strings.
 */

/** The one standard easing for entrances and transitions. */
export const MOTION_EASE_STANDARD = "cubic-bezier(0.16,1,0.3,1)" as const;

/** Secondary easings (CSS strings). `easeOutSoft` is the gentler
 * alternative for small hover/press feedback. `spring` is the
 * overshoot easing for PRESS states only (Phase 6) — never entrances. */
export const MOTION_EASE = {
  /** Standard entrance / transition easing — the default everywhere. */
  standard: MOTION_EASE_STANDARD,
  /** Softer ease-out for micro-interactions (hovers, presses). */
  outSoft: "cubic-bezier(0.22,1,0.36,1)",
  /** Spring/elastic overshoot for button press states (scale 0.97 on
   * active). Transform-only, ~200ms. CSS mirror: --ease-spring. */
  spring: "cubic-bezier(0.34,1.56,0.64,1)",
  /** Linear — scrub-linked / progress motion only, never entrances. */
  linear: "linear",
} as const;

/** GSAP easing names that correspond to the CSS easings above. GSAP has
 * no cubic-bezier(0.16,1,0.3,1) preset; `expo.out` is its closest
 * equivalent and is what MotionProvider already uses for entrances. */
export const MOTION_EASE_GSAP = {
  standard: "expo.out",
  outSoft: "power3.out",
  /** GSAP mirror of MOTION_EASE.spring (press states only). */
  spring: "back.out(1.7)",
  inOut: "power2.inOut",
  out: "power2.out",
} as const;

/**
 * Durations in MILLISECONDS — the canonical scale (100–900ms).
 * Use these for CSS transitions/animations and Web Animations API.
 * Micro-interactions stay in the 100–300ms band; `moderate`/`slow`
 * are the visible entrance band (600/800ms); `cinematic` is the
 * 900ms ceiling, reserved for large section reveals.
 */
export const MOTION_MS = {
  /** Instant feedback (press states). */
  instant: 100,
  /** Fast micro-interaction (hover, toggle, tooltip). */
  fast: 160,
  /** Default transition / small reveal. */
  normal: 240,
  /** Medium reveal (cards, panels) — slowed 360 -> 600ms (Worker A,
   * 2026-11-16) so card entrances are clearly visible. */
  moderate: 600,
  /** Slow reveal (large sections, draw-on) — slowed 550 -> 800ms. */
  slow: 800,
  /** Cinematic section reveal — the 900ms ceiling, use sparingly. */
  cinematic: 900,
  /** Stagger step range for grouped reveals (min / max per item) —
   * widened 40–80 -> 80–150ms so a grid visibly unfolds. */
  staggerMin: 80,
  staggerMax: 150,
} as const;

export type MotionDurationKey = keyof typeof MOTION_MS;

/**
 * Durations in SECONDS — GSAP mirror of `MOTION_MS` (GSAP takes seconds).
 * `MOTION` in `src/lib/motion.tsx` is built from these values.
 */
export const MOTION_SECONDS = {
  instant: 0.1,
  fast: 0.16,
  normal: 0.24,
  moderate: 0.6,
  slow: 0.8,
  cinematic: 0.9,
  staggerMin: 0.08,
  staggerMax: 0.15,
} as const;

/** Reveal travel distances (transform-only, px). */
export const MOTION_DISTANCE = {
  /** Default vertical reveal distance (desktop / pointer-fine). */
  reveal: 24,
  /** Reveal distance on coarse pointers / small screens. */
  revealMobile: 16,
} as const;

/**
 * Split text into motion-safe units: WORDS only (whitespace split).
 * Arabic letters stay connected inside each word, so shaping is never
 * broken. Use for word-level masked/staggered title animation
 * (the pattern `MotionProvider` already uses for `[data-masked-title]`).
 * Returns the words in order; empty segments are dropped.
 */
export function splitMotionWords(text: string): string[] {
  return text.split(/\s+/).filter((w) => w.length > 0);
}
