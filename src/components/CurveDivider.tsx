/**
 * CurveDivider — the restrained curve signature (2026-11-15 motion pass).
 * An SVG divider of double arcs (blue #0081FB + red #E31E24) echoing the
 * GTS logo ring. Curves carry brand colors; colors bound curves — no curve
 * without purposeful color, no loud color without a curve to soften it.
 * Light and elegant on white / sky (#DDF5FC) backgrounds.
 *
 * Variants (shape):
 * - "arcs"  — two concentric arcs rising from the baseline, the logo ring
 *   segment (outer blue, inner red). Default.
 * - "curve" — two gentle parallel flowing curves (blue above, red below).
 *
 * `tone` adapts the strokes to the surface underneath (default "light"):
 * - "light" / "sky" — brand blue + brand red (unchanged default).
 * - "navy" — light energy blue #8BE5F8 + brand red, legible on navy.
 * `flip` mirrors the divider vertically (e.g. closing a navy band).
 * Decorative only (aria-hidden). Sizing comes from `.curve-divider`
 * (globals.css) unless overridden via className. Placements are added by
 * a separate worker — no other file imports this yet.
 *
 * NOTE: the task brief named the tone prop `variant`, but `variant` is
 * already the shape prop ("arcs" | "curve") — renaming it would break
 * call sites, so the tone prop is called `tone`.
 */
export type CurveDividerVariant = "arcs" | "curve";
export type CurveDividerTone = "light" | "navy" | "sky";

const TONE_STROKES: Record<CurveDividerTone, { blue: string; red: string }> = {
  light: { blue: "#0081FB", red: "#E31E24" },
  sky: { blue: "#0081FB", red: "#E31E24" },
  navy: { blue: "#8BE5F8", red: "#E31E24" },
};

export default function CurveDivider({
  variant = "arcs",
  tone = "light",
  flip = false,
  className = "",
}: {
  variant?: CurveDividerVariant;
  tone?: CurveDividerTone;
  flip?: boolean;
  className?: string;
}) {
  const strokes = TONE_STROKES[tone];
  return (
    <div className={`curve-divider ${flip ? "-scale-y-100 " : ""}${className}`.trim()} aria-hidden="true">
      {variant === "arcs" ? (
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          fill="none"
          focusable="false"
        >
          {/* Outer arc — brand blue, the ring's outer edge. */}
          <path
            d="M 20 60 A 700 700 0 0 1 1420 60"
            stroke={strokes.blue}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Inner arc — brand red, the ring's inner edge. */}
          <path
            d="M 80 60 A 640 640 0 0 1 1360 60"
            stroke={strokes.red}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="none"
          focusable="false"
        >
          {/* Flowing curve — brand blue. */}
          <path
            d="M 0 28 C 360 4, 1080 52, 1440 28"
            stroke={strokes.blue}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Flowing curve — brand red, echoing below. */}
          <path
            d="M 0 42 C 360 18, 1080 66, 1440 42"
            stroke={strokes.red}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
