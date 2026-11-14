"use client";

import { useEffect } from "react";

/**
 * Motion provider (BUILD_SPEC §5): GSAP + ScrollTrigger reveals with an
 * IntersectionObserver fallback, Lenis smooth scroll on desktop, and a
 * prefers-reduced-motion kill-switch. Content is visible WITHOUT JS: the
 * `js` class is only added here, and `.reveal` starts hidden only under
 * `html.js` (see globals.css). If GSAP fails, the IO fallback reveals
 * everything; if JS is absent, everything is visible by default.
 */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lenisDestroy: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        // Lenis smooth scroll (desktop, pointer-fine only)
        if (window.matchMedia("(pointer: fine)").matches) {
          try {
            const { default: Lenis } = await import("lenis");
            if (cancelled) return;
            const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
            lenis.on("scroll", () => ScrollTrigger.update());
            lenisDestroy = () => lenis.destroy();
            // Drive Lenis from GSAP's ticker (spec §5.4.5)
            gsap.ticker.add((time) => {
              lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
          } catch {
            /* Lenis failed — native scroll applies, nothing breaks */
          }
        }

        // Hero entrance (load, not scroll)
        const heroText = document.querySelectorAll(".hero__anim");
        if (heroText.length > 0) {
          gsap.fromTo(
            heroText,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 },
          );
        }

        // Section reveals
        document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });
        document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
          const items = group.querySelectorAll(":scope > *");
          if (items.length === 0) return;
          gsap.fromTo(
            items,
            { opacity: 0, y: 20 },
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
      } catch {
        // GSAP unavailable — IntersectionObserver fallback
        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) {
                  (en.target as HTMLElement).classList.add("reveal--in");
                  io.unobserve(en.target);
                }
              });
            },
            { threshold: 0.12 },
          );
          document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
        } else {
          document.querySelectorAll(".reveal").forEach((el) => el.classList.add("reveal--in"));
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        lenisDestroy?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return null;
}
