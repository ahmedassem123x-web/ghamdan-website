/**
 * LottieIcon — Phase 0 (dynamic-site plan §11: Lottie icons).
 *
 * Small client component that renders one of the bundled Lottie JSON
 * icons (`public/lottie/*.json`) with lottie-web. The player library is
 * lazy-loaded via dynamic `import("lottie-web")` (client-only, never in
 * the initial bundle) and the JSON is fetched from our own `public/`
 * folder — never hotlinked to an untrusted source.
 *
 * Icons (see `public/lottie/` + `LOTTIE_ICON_SOURCES` below):
 * - `sun` — rotating sun (LottieFiles, free, Lottie Simple License).
 * - `battery` — charging battery line icon (LottieFiles, free, Lottie
 *   Simple License).
 * - `pump` — solar water pump, hand-written original Lottie JSON
 *   (rotating impeller + falling drop, GTS brand colours).
 *
 * Failure behaviour (never a broken UI): if the JSON fetch fails, the
 * JSON is invalid, or lottie-web fails to load, the component renders
 * nothing — these icons are decorative (`aria-hidden` by default), so
 * no meaning is lost. With `prefers-reduced-motion` the animation does
 * not play: the first frame is shown statically instead.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { usePrefersReducedMotion } from "@/lib/perf";

export type LottieIconName = "sun" | "battery" | "pump";

/** Public paths of the bundled icon JSONs (served from `public/lottie/`). */
export const LOTTIE_ICON_PATHS: Record<LottieIconName, string> = {
  sun: "/lottie/sun.json",
  battery: "/lottie/battery.json",
  pump: "/lottie/pump.json",
} as const;

/**
 * Provenance for every bundled icon — keep in sync with the files in
 * `public/lottie/`. Phase 1/2 workers: do not swap a file without
 * updating its entry here.
 */
export const LOTTIE_ICON_SOURCES: Record<LottieIconName, { source: string; license: string }> = {
  sun: {
    source:
      "https://lottiefiles.com/free-animation/simple-sun-animation-TekgPVvx8x (Simple Sun Animation) — file extracted from its dotLottie bundle https://assets-v2.lottiefiles.com/a/459fb76a-1152-11ee-b330-bf8edba6c2da/cC7vrszKHO.lottie",
    license: "Free to use under the Lottie Simple License",
  },
  battery: {
    source:
      "https://lottiefiles.com/146447-battery-charged-animation (Battery Charged Animation, by Neel) — file extracted from its dotLottie bundle https://assets-v2.lottiefiles.com/a/93b11456-118b-11ee-9166-63fb7c8e8a7f/FquXDdruiG.lottie",
    license: "Free to use under the Lottie Simple License",
  },
  pump: {
    source: "Hand-written original Lottie JSON (public/lottie/pump.json) — no third-party source",
    license: "Original GTS work, no licence restriction (created because no clearly-free water/solar pump animation was found on LottieFiles; the pump animations there are premium IconScout)",
  },
};

export interface LottieIconProps {
  /** Which bundled icon to render. */
  name: LottieIconName;
  /** Extra classes on the wrapper (size it here, e.g. `h-12 w-12`). */
  className?: string;
  /** Loop the animation (default `true`). Ignored under reduced motion. */
  loop?: boolean;
  /** Start playing immediately (default `true`). Ignored under reduced motion. */
  autoplay?: boolean;
  /** Playback speed multiplier (default `1`). */
  speed?: number;
  /**
   * Accessible label. Icons are decorative by default (`aria-hidden`);
   * pass a label only when the icon carries meaning on its own.
   */
  label?: string;
}

export default function LottieIcon({
  name,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  label,
}: LottieIconProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Reduced motion: show the first frame statically — meaning preserved,
  // nothing moves.
  const shouldPlay = autoplay && !reducedMotion;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let animation: AnimationItem | null = null;

    (async () => {
      try {
        const [lottieModule, res] = await Promise.all([
          import("lottie-web"),
          fetch(LOTTIE_ICON_PATHS[name]),
        ]);
        if (cancelled) return;
        if (!res.ok) throw new Error(`Lottie JSON fetch failed: ${res.status}`);
        const animationData: unknown = await res.json();
        if (cancelled) return;
        animation = lottieModule.default.loadAnimation({
          container: host,
          renderer: "svg",
          loop: loop && !reducedMotion,
          autoplay: shouldPlay,
          animationData,
        });
        if (speed !== 1) animation.setSpeed(speed);
        // Reduced motion (or autoplay off): render the first frame only.
        if (!shouldPlay) animation.goToAndStop(0, true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      try {
        animation?.destroy();
      } catch {
        /* Already destroyed — nothing to do. */
      }
    };
  }, [name, loop, reducedMotion, shouldPlay, speed]);

  // Decorative by default; a failed load renders nothing (never a
  // broken frame or alt-text box).
  if (failed) return null;

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}
