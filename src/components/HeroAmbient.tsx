"use client";

import { useHeavy3DGate } from "@/lib/perf";
import HeroParticles from "@/components/HeroParticles";
import HeroScene from "@/components/three/HeroScene";

/**
 * HeroAmbient — the ambient background layer for the home hero
 * ("center" variant only). A `pointer-events-none` absolute layer that
 * sits behind the mesh glows and the copy:
 *
 * - `HeroParticles`: light 2D energy particles (self-gated on reduced
 *   motion / low-end devices).
 * - `HeroScene`: the procedural Three.js scene, mounted only through
 *   `useHeavy3DGate` — in viewport AND capable device AND no reduced
 *   motion. Until then the hero shows its normal mesh background, photo
 *   and copy: nothing depends on the 3D scene existing.
 */
export default function HeroAmbient() {
  const { ref, shouldMount } = useHeavy3DGate({ rootMargin: "200px" });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <HeroParticles />
      {shouldMount ? <HeroScene /> : null}
    </div>
  );
}
