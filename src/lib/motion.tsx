"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * MotionProvider — the SOLE animation orchestrator (v15 §10, technology
 * responsibility map §2). GSAP + ScrollTrigger own scroll choreography;
 * Lenis owns smooth scrolling only, driven from GSAP's ticker (one rAF
 * loop total). No other file imports GSAP or Lenis.
 *
 * Progressive enhancement (v15 §10.10, binding): content is ALWAYS visible
 * in the initial HTML/CSS — no rule hides `[data-reveal]`, `.hero__anim`,
 * `[data-stagger]` or SVG paths. This provider only ADDS animation after
 * GSAP + ScrollTrigger initialise successfully. If the import fails, if
 * JS is absent, or if `prefers-reduced-motion` is set, content simply
 * stays visible. There is no IntersectionObserver rescue class any more:
 * nothing needs rescuing.
 *
 * Ownership (one animation owner per element/property):
 * - `[data-reveal]` / `[data-stagger]` / `.hero__anim` opacity+transform: GSAP.
 * - `[data-draw]` / `[data-flow]` SVG stroke-dashoffset: GSAP (path drawing).
 * - Scroll position / smooth wheel: Lenis (desktop pointer-fine only).
 * - Drawer / accordion / tabs / dialog state: CSS transitions owned by the
 *   component itself (no animation library touches them).
 * - Marquee: CSS keyframes only (`globals.css .marquee__track`) — GSAP
 *   never animates it.
 *
 * Lifecycle: setup re-runs on every route change (`pathname` dep) and the
 * previous run is fully reverted — `gsap.context().revert()` kills all
 * tweens/ScrollTriggers, the Lenis ticker callback is removed, Lenis is
 * destroyed. No duplicate triggers across route changes, no leaked loops.
 * ScrollTrigger refreshes after fonts and window load (layout shifts).
 */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // `js` is a presence signal only — no CSS rule depends on it any more
    // (Phase 6 removed the `html.js .reveal` hiding rule).
    root.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let cancelled = false;
    let revertAll: (() => void) | null = null;
    let destroyLenis: (() => void) | null = null;
    let removeTicker: (() => void) | null = null;
    let onLoad: (() => void) | null = null;

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        // --- Lenis: smooth scroll only, desktop pointer-fine (v15 §10.2).
        // Driven from GSAP's ticker: ONE rAF loop, no competing scroll loop.
        if (window.matchMedia("(pointer: fine)").matches) {
          try {
            const { default: Lenis } = await import("lenis");
            if (cancelled) return;
            const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
            lenis.on("scroll", () => ScrollTrigger.update());
            let destroyed = false;
            const tick = (time: number) => {
              if (!destroyed) lenis.raf(time * 1000);
            };
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
            removeTicker = () => gsap.ticker.remove(tick);
            destroyLenis = () => {
              destroyed = true;
              lenis.destroy();
            };
          } catch {
            /* Lenis failed — native scroll applies, nothing breaks. */
          }
        }

        // --- All GSAP work lives in one context so cleanup is total. ---
        const ctx = gsap.context(() => {
          // Hero entrance (load, not scroll). Content is visible without
          // JS — no CSS hides `.hero__anim`; this only animates it.
          const heroText = document.querySelectorAll(".hero__anim");
          if (heroText.length > 0) {
            gsap.fromTo(
              heroText,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 },
            );
          }

          // Section reveals — JS-applied only, after successful init.
          // Mobile (coarse pointer): shorter travel, slightly faster.
          document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: coarse ? 16 : 24 },
              {
                opacity: 1,
                y: 0,
                duration: coarse ? 0.6 : 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });

          // Staggered groups (children animate together on group entry).
          // No pinning, no scrub, no blank spacer regions.
          document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
            const items = group.querySelectorAll(":scope > *");
            if (items.length === 0) return;
            gsap.fromTo(
              items,
              { opacity: 0, y: coarse ? 14 : 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: group, start: "top 88%", once: true },
              },
            );
          });

          // SVG path drawing — SolarLineArt (`[data-draw]`). Dash hiding
          // is applied here in JS only, after init; without JS the paths
          // render fully drawn. Draw once, no continuous motion.
          document.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
            const len = path.getTotalLength();
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: { trigger: path, start: "top 92%", once: true },
            });
          });

          // Diagram flow paths — SystemDiagram (`[data-flow]`). Draw once
          // on entry, then a slow dashed drift (energy flow, meaningful
          // motion, not decoration) that plays only while the figure is
          // in the viewport and only after the draw completed.
          document.querySelectorAll<SVGGeometryElement>("[data-flow]").forEach((path) => {
            const len = path.getTotalLength();
            let drawn = false;
            let flowActive = false;
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            const drift = gsap.to(path, {
              strokeDashoffset: "-=28",
              duration: 1.8,
              ease: "none",
              repeat: -1,
              paused: true,
            });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: "power2.inOut",
              scrollTrigger: { trigger: path, start: "top 90%", once: true },
              onComplete: () => {
                drawn = true;
                // Switch the drawn line to a dashed flow line (7+7 = 14
                // period; the drift step of 28 is exactly 2 periods, so
                // the loop is seamless).
                path.style.strokeDasharray = "7 7";
                if (flowActive) drift.play();
              },
            });
            ScrollTrigger.create({
              trigger: path.closest("figure") ?? path,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => {
                flowActive = self.isActive;
                if (self.isActive && drawn) drift.play();
                else drift.pause();
              },
            });
          });
        });
        revertAll = () => ctx.revert();

        // Refresh after fonts/images/layout settle (positions shift).
        const refresh = () => {
          if (!cancelled) ScrollTrigger.refresh();
        };
        if (document.fonts) {
          document.fonts.ready.then(refresh).catch(() => undefined);
        }
        onLoad = refresh;
        window.addEventListener("load", onLoad);
        ScrollTrigger.refresh();
      } catch {
        // GSAP unavailable — nothing was ever hidden, so content stays
        // visible. No fallback class is needed (the old `.reveal--in`
        // rescue existed only because CSS used to hide `.reveal`).
      }
    })();

    return () => {
      cancelled = true;
      // Order matters: stop the ticker first so a destroyed Lenis is
      // never driven, then destroy Lenis, then revert all GSAP work.
      try {
        removeTicker?.();
      } catch {
        /* ignore */
      }
      try {
        destroyLenis?.();
      } catch {
        /* ignore */
      }
      try {
        revertAll?.();
      } catch {
        /* ignore */
      }
      if (onLoad) window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return null;
}
