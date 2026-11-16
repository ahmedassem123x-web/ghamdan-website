"use client";

import { useEffect, useRef, useState } from "react";
import { isLowEndDevice, shouldReduceMotion } from "@/lib/perf";

/**
 * HeroParticles — light 2D canvas of drifting energy particles in the
 * hero background (plan §7 Particle Systems). A tiny custom canvas:
 * brand-blue / sky / red dots rising slowly with a gentle sway.
 * Transform/opacity only (the canvas itself never moves layout).
 *
 * Gates: never mounts under `prefers-reduced-motion` or on low-end
 * devices (SSR-safe: the decision is made after mount so server and
 * client first paint agree). The rAF loop pauses while the hero is
 * off-screen (IntersectionObserver) and when the tab is hidden.
 * Decorative only (`aria-hidden`) — no meaning is carried by it.
 */
const COLORS = ["#0081FB", "#8BE5F8", "#DDF5FC", "#E31E24"];

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  color: string;
  alpha: number;
}

export default function HeroParticles() {
  const hostRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!shouldReduceMotion() && !isLowEndDevice());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = hostRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let inView = false;
    let w = 0;
    let h = 0;

    const seed = () => {
      const count = Math.max(14, Math.min(42, Math.floor((w * h) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.2,
        speed: 0.12 + Math.random() * 0.35,
        sway: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.12 + Math.random() * 0.3,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(now / 1600 + p.phase) * p.sway * 8;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const maybeStart = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        maybeStart();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onVisibility = () => maybeStart();
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    maybeStart();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
