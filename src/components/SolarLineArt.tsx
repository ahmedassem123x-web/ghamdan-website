/**
 * SolarFieldLineArt — faint thin-line solar-field + mountains illustration.
 * Extracted from the home page (Phase 4, v15 §6.1 item 8 / KGE rhythm) so it
 * is a shared component, not inline page markup. Decorative, very low
 * contrast, aria-hidden. The paths carry `data-draw`: MotionProvider draws
 * them with GSAP stroke-dashoffset after successful init (JS-only — the
 * SVG is fully drawn without JS). Animation is a Phase 6 concern; the SVG
 * itself is visible by default.
 *
 * Variant A polish: mountain/panel linework in a faint brand-blue tint,
 * baseline in brand red — the dual-color signature, kept whisper-quiet.
 */
export default function SolarLineArt({ className = "mt-10 w-full text-primary/[0.16]" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 120" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path data-draw d="M60 110 L180 40 L300 110 Z M200 110 L320 40 L440 110 Z M340 110 L460 40 L580 110 Z M480 110 L600 40 L720 110 Z M620 110 L740 40 L860 110 Z M760 110 L880 40 L1000 110 Z M900 110 L1020 40 L1140 110 Z" />
      <path data-draw d="M180 40 L320 40 M320 40 L460 40 M460 40 L600 40 M600 40 L740 40 M740 40 L880 40 M880 40 L1020 40" />
      <path data-draw d="M0 118 H1200" stroke="#E31E24" strokeOpacity="0.35" />
    </svg>
  );
}
