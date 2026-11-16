"use client";

import type { ReactNode } from "react";

/**
 * Orbit animation (plan §10 — Orbit Animation).
 *
 * Four feature icons orbit the GTS logo: the ring rotates (CSS rotateZ)
 * while each satellite chip counter-rotates so its icon + label stay
 * upright. Pure CSS keyframes, transform only, 36s linear infinite.
 *
 * The orbit is decorative (aria-hidden): the same four values are listed
 * as plain text in the caption below, so nothing is conveyed by motion
 * alone. Reduced motion: the ring stops — satellites rest at their fixed
 * angles, fully visible.
 */
export type OrbitItem = { icon: ReactNode; label: string };

export default function AboutOrbit({
  heading,
  items,
  logoAlt,
}: {
  heading: string;
  items: OrbitItem[];
  logoAlt: string;
}) {
  // Diagonal anchor angles so no satellite overlaps the centre logo.
  const angles = [45, 135, 225, 315];

  return (
    <div className="text-center">
      <h3 className="text-h3 font-semibold text-navy">{heading}</h3>
      <div className="about-orbit relative mx-auto mt-10 size-80 md:size-[26rem]" aria-hidden="true">
        {/* Centre: GTS transparent logo on a white disc */}
        <div className="absolute left-1/2 top-1/2 z-10 flex size-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white p-3 shadow-card md:size-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/gts-logo-transparent.png" alt="" className="h-full w-full object-contain" />
        </div>
        {/* Orbit path */}
        <span className="absolute inset-0 rounded-full border border-dashed border-border" />
        <span className="absolute inset-8 rounded-full border border-border/60 md:inset-10" />
        {/* Rotating ring with counter-rotating satellites */}
        <div className="about-orbit__ring absolute inset-0">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="about-orbit__sat absolute left-1/2 top-1/2"
              style={{ "--a": `${angles[i % angles.length]}deg` } as React.CSSProperties}
            >
              <div className="about-orbit__chip flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-border bg-white text-primary-hover shadow-card md:size-24">
                {item.icon}
                <span className="max-w-full px-1 text-center text-[10px] font-bold leading-tight text-navy md:text-xs">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Plain-text caption — the same four values, no motion required. */}
      <p className="mx-auto mt-8 max-w-xl text-body-sm font-bold text-text-muted">
        {items.map((item) => item.label).join(" • ")}
        <span className="sr-only"> — {logoAlt}</span>
      </p>

      <style>{`
        .about-orbit__sat { --r: 8.25rem; }
        @media (min-width: 768px) { .about-orbit__sat { --r: 11rem; } }
        .about-orbit__ring { animation: about-orbit-spin 36s linear infinite; }
        .about-orbit__sat {
          transform: rotate(var(--a)) translate(var(--r)) rotate(calc(var(--a) * -1));
        }
        .about-orbit__chip { animation: about-orbit-spin-rev 36s linear infinite; }
        @keyframes about-orbit-spin { to { transform: rotate(360deg); } }
        /* The chip keeps its -50% centring inside the keyframes: a running
           animation overrides the Tailwind translate, so the translate
           must live in the keyframes or the chip drifts off-centre. */
        @keyframes about-orbit-spin-rev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-orbit__ring, .about-orbit__chip { animation: none; }
        }
      `}</style>
    </div>
  );
}
