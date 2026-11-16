/**
 * Performance utilities — Phase 0 (dynamic-site plan, foundations).
 *
 * Imported by Phase 1 (home) and Phase 2 (product page) and by any
 * component that gates heavy motion:
 *
 * - `usePrefersReducedMotion()` — reactive hook; `shouldReduceMotion()`
 *   is the synchronous equivalent for non-React code.
 * - `isLowEndDevice()` — synchronous capability check (cores / memory /
 *   data-saver). SSR-safe: returns `false` on the server.
 * - `useHeavy3DGate()` — lazy-load gate for heavy 3D (Three.js / R3F /
 *   Vanta / particles): only mount when the element is in the viewport
 *   AND the device is capable AND the user has not asked for reduced
 *   motion. `canRunHeavy3D()` is the synchronous capability half.
 *
 * Reduced motion always wins: when it is on, meaning is preserved
 * without motion — content renders in its final state, never hidden.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function matchReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Synchronous reduced-motion check. Safe to call during render and in
 * event handlers; on the server it returns `false`.
 */
export function shouldReduceMotion(): boolean {
  return matchReducedMotion();
}

/**
 * Reactive reduced-motion hook. Subscribes to the media query so a
 * mid-session OS setting change is honoured without a reload.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => matchReducedMotion());
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * Low-end device check. A device counts as low-end when ANY of these hold:
 * - 4 or fewer logical CPU cores (`navigator.hardwareConcurrency`),
 * - 4 GB or less device memory (`navigator.deviceMemory`, Chromium-only),
 * - data-saver mode is on (`navigator.connection.saveData`).
 * Unknown signals are treated as capable (never punish a device we
 * cannot measure); SSR returns `false`.
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorWithMemory;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (nav.connection?.saveData) return true;
  return false;
}

/**
 * Synchronous capability half of the heavy-3D gate: capable device AND
 * no reduced motion. Does NOT check viewport — use `useHeavy3DGate()`
 * when the element must also be visible.
 */
export function canRunHeavy3D(): boolean {
  return !shouldReduceMotion() && !isLowEndDevice();
}

export interface Heavy3DGateOptions {
  /** IntersectionObserver root margin (default `"200px"` — start loading
   * just before the scene scrolls into view). */
  rootMargin?: string;
  /** Fraction of the element that must be visible (default `0`). */
  threshold?: number | number[];
}

export interface Heavy3DGate {
  /** Attach to the wrapper element that will host the 3D scene. */
  ref: (node: HTMLElement | null) => void;
  /** `true` only when: in viewport AND capable device AND no reduced
   * motion. Once `true` it stays `true` (no unmount/remount churn on
   * scroll-away); the scene itself should still pause off-screen. */
  shouldMount: boolean;
  /** Whether the element has entered the viewport (regardless of
   * capability — useful for showing the static fallback). */
  inView: boolean;
}

/**
 * Lazy-load gate for heavy 3D. Mount the Three.js / R3F / Vanta /
 * particle scene only when `shouldMount` is `true`; otherwise render
 * the static fallback (SVG diagram / still image — content must never
 * depend on the 3D scene existing). Example:
 *
 * ```tsx
 * const { ref, shouldMount } = useHeavy3DGate();
 * return <div ref={ref}>{shouldMount ? <EnergyScene /> : <StaticDiagram />}</div>;
 * ```
 */
export function useHeavy3DGate(options: Heavy3DGateOptions = {}): Heavy3DGate {
  const { rootMargin = "200px", threshold = 0 } = options;
  const [inView, setInView] = useState(false);
  const [capable] = useState<boolean>(() => canRunHeavy3D());
  const nodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reduced motion can change mid-session — re-check when it does so a
  // scene never starts animating after the user asked for stillness.
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // No observer support (very old browser): treat as in view so
      // content is never gated away by a missing API.
      setInView(true);
      return;
    }
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return {
    ref: useCallback((node: HTMLElement | null) => {
      nodeRef.current = node;
    }, []),
    shouldMount: inView && capable && !reduced,
    inView,
  };
}
