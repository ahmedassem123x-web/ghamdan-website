"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import styles from "./ProductCardTilt.module.css";

/**
 * ProductCardTilt — 3D tilt + glow for featured product cards
 * (Phase 1, plan §4 3D Tilt + Glow Card). Pointer-fine only, transform
 * and opacity only (see `ProductCardTilt.module.css`).
 *
 * Drag safety: this component adds NO drag handler — the
 * `FeaturedCarousel` track owns dragging with pointer capture, so while
 * a drag is active the pointer is captured by the track and this card
 * receives no pointermove events at all. As a belt-and-braces guard the
 * tilt also resets whenever the track carries its
 * `.drag-carousel__track--dragging` class. Arrows / dots / keyboard /
 * progress in the carousel are untouched.
 */
export default function ProductCardTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.classList.remove(styles.tiltActive);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Drag in progress on the carousel track → tilt stays off.
    if (el.closest(".drag-carousel__track--dragging")) {
      reset();
      return;
    }
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
    el.style.setProperty("--glow-x", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-y", `${((py + 0.5) * 100).toFixed(1)}%`);
    el.classList.add(styles.tiltActive);
  };

  return (
    <div ref={ref} className={styles.tilt} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
      <span aria-hidden="true" className={styles.glow} />
    </div>
  );
}
