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
 * - `[data-parallax]` images/layers: GSAP scrub (small y drift, transform only).
 * - `[data-scrub]` bands: GSAP scrub, inner content translates horizontally.
 * - `[data-pinned-scrub]` sections: ONE GSAP pin + scrub per page
 *   (solutions), progress bar + counter, Lenis scrollTo buttons/keys.
 * - `[data-masked-title] .mask-line__inner`: hero title word masks,
 *   first load only (heroIntroDone guard — route changes never replay).
 * - `[data-step-line]` / `[data-step-group] [data-step-dot]`: step
 *   progress line draw + dot fill.
 * - `[data-draw-group]` line-icon shapes: stroke draw on entry.
 * - `.site-header--intro`: one-time load fade, GSAP only, outside the
 *   route-change context so it never replays or reverts on navigation.
 * - `[data-draw]` / `[data-flow]` SVG stroke-dashoffset: GSAP (path drawing).
 * - `[data-countup]` numbers: GSAP once-on-entry tween of a JS object
 *   (innerText only; the FINAL value is already in the HTML, so without
 *   JS — or with `prefers-reduced-motion`, which returns before GSAP
 *   loads — the correct number is simply shown, never 0).
 * - `[data-magnetic]` buttons/links: pointer-fine only, ≤6px transform
 *   toward the cursor, spring back on leave. Never combined with
 *   `[data-reveal]` / `.hero__anim` on the same element (two owners of
 *   one transform would fight); magnetic targets are plain CTAs.
 * - `[data-clip]` bands: clip-path inset wipe on entry, once.
 *   Transform/opacity only elsewhere; clip-path is the one exception
 *   (a reveal mask, composited, on large bands only).
 * - Scroll position / smooth wheel: Lenis (desktop pointer-fine only).
 * - Drawer / accordion / tabs / dialog state: CSS transitions owned by the
 *   component itself (no animation library touches them).
 * - Marquee: CSS keyframes only (`globals.css .marquee__track`) — GSAP
 *   never animates it. An IntersectionObserver here pauses it while it
 *   is off-screen, so it never burns frames for nobody.
 *
 * Lifecycle: setup re-runs on every route change (`pathname` dep) and the
 * previous run is fully reverted — `gsap.context().revert()` kills all
 * tweens/ScrollTriggers, the Lenis ticker callback is removed, Lenis is
 * destroyed. No duplicate triggers across route changes, no leaked loops.
 * ScrollTrigger refreshes after fonts and window load (layout shifts).
 */

/** Motion tokens — JS mirror of the --motion-* tokens in globals.css
 * (@theme). Durations in seconds for GSAP; the CSS mirror is the source
 * of truth for CSS animations. No hand-written duration/easing in new
 * components — use these constants. */
export const MOTION = {
  instant: 0.1,
  fast: 0.16,
  normal: 0.24,
  moderate: 0.36,
  slow: 0.55,
  cinematic: 0.9,
  easeStandard: "cubic-bezier(0.16,1,0.3,1)",
  easeExpoOut: "expo.out",
  easePower2InOut: "power2.inOut",
  easePower2Out: "power2.out",
  revealDistance: 24,
  revealDistanceMobile: 16,
  staggerMin: 0.04,
  staggerMax: 0.08,
} as const;

/** Header intro runs exactly once per page session — the provider re-runs
 * on every route change, so a module flag (not state) guards the replay. */
let headerIntroDone = false;
/** Hero entrance (`.hero__anim` + masked titles) runs on FIRST LOAD ONLY
 * (View Transitions own route-change entrances; replaying the hero on
 * every pathname would fight them). Module flag, same guard pattern. */
let heroIntroDone = false;
/** Shared Lenis handle so pinned-scrub buttons/keyboard can scrollTo
 * through the smooth scroller instead of fighting it. Set on Lenis
 * creation, cleared on effect cleanup. */
let sharedLenis: { scrollTo: (target: number, options?: { duration?: number }) => void } | null = null;

export function scrollToY(target: number, duration = 1) {
  if (sharedLenis) sharedLenis.scrollTo(target, { duration });
  else window.scrollTo({ top: target, behavior: "smooth" });
}

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
    // Magnetic-hover listeners live outside the GSAP context (contexts
    // don't remove DOM listeners), so their teardown is tracked here and
    // run from the effect cleanup alongside ctx.revert().
    let magneticCleanups: Array<() => void> = [];

    // Marquee: pause while off-screen (cheap transform-only animation,
    // but no reason to run it for nobody). Runs even if GSAP fails.
    let marqueeObserver: IntersectionObserver | null = null;
    const marqueeTrack = document.querySelector<HTMLElement>(".marquee__track");
    if (marqueeTrack && "IntersectionObserver" in window) {
      marqueeObserver = new IntersectionObserver(
        ([entry]) => {
          marqueeTrack.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        },
        { rootMargin: "100px" },
      );
      marqueeObserver.observe(marqueeTrack);
    }

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        // Motion is live — desktop pinned tracks switch from native
        // scroll to GSAP pin (see .pinned-scrub__track in globals.css).
        document.documentElement.classList.add("motion-ready");

        // --- Lenis: smooth scroll only, desktop pointer-fine (v15 §10.2).
        // Driven from GSAP's ticker: ONE rAF loop, no competing scroll loop.
        if (window.matchMedia("(pointer: fine)").matches) {
          try {
            const { default: Lenis } = await import("lenis");
            if (cancelled) return;
            const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
            sharedLenis = lenis;
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
              sharedLenis = null;
              lenis.destroy();
            };
          } catch {
            /* Lenis failed — native scroll applies, nothing breaks. */
          }
        }

        // --- Header intro (one-time load fade, outside the route context
        // so route-change revert never replays or undoes it). Transform +
        // opacity only; `.site-header--scrolled` owns background/shadow,
        // so the two never fight. Runs once per page session.
        if (!headerIntroDone) {
          const header = document.querySelector(".site-header--intro");
          if (header) {
            headerIntroDone = true;
            gsap.fromTo(
              header,
              { opacity: 0, y: -8 },
              { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
            );
          }
        }

        // --- All GSAP work lives in one context so cleanup is total. ---
        const ctx = gsap.context(() => {
          // Hero entrance (FIRST LOAD ONLY — heroIntroDone guard). Content
          // is visible without JS — no CSS hides `.hero__anim`; this only
          // animates it. Sequence budget 900–1400ms total: 0.7s per
          // element, 0.12s stagger — 5 elements finish at ~1.18s.
          // Masked-line titles: `[data-masked-title] .mask-line__inner`
          // (word-level masks in Hero.tsx — never char-level, Arabic
          // shaping is preserved) rise 110% -> 0, 700ms expo.out,
          // stagger 90ms between words.
          if (!heroIntroDone) {
            heroIntroDone = true;
            const heroText = document.querySelectorAll(".hero__anim");
            if (heroText.length > 0) {
              gsap.fromTo(
                heroText,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.12 },
              );
            }
            const masked = document.querySelectorAll("[data-masked-title] .mask-line__inner");
            if (masked.length > 0) {
              gsap.fromTo(
                masked,
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.09 },
              );
            }
          }

          // Section reveals — JS-applied only, after successful init.
          // Variants (transform/opacity only, 60fps, CLS-safe):
          // plain / "up" = fade-up (default), "fade" = opacity only,
          // "left"/"right" = horizontal drift, "scale" = gentle zoom.
          // Durations: text 450–750ms, cards/sections 550–900ms.
          // Mobile (coarse pointer): shorter travel, slightly faster.
          // immediateRender: false — nothing is hidden before its trigger
          // fires, so full-page screenshots, print, crawlers and #anchor
          // jumps see the content instead of blank sections.
          document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            const variant = el.dataset.reveal ?? "";
            const travel = coarse ? 16 : 24;
            const from: gsap.TweenVars =
              variant === "fade"
                ? { opacity: 0 }
                : variant === "left"
                  ? { opacity: 0, x: -travel }
                  : variant === "right"
                    ? { opacity: 0, x: travel }
                    : variant === "scale"
                      ? { opacity: 0, scale: 0.96 }
                      : { opacity: 0, y: travel };
            const duration =
              variant === "fade" ? 0.6 : variant === "scale" ? 0.75 : 0.7;
            gsap.fromTo(el, from, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration,
              ease: "expo.out",
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });

          // Staggered groups (children animate together on group entry).
          // No pinning, no scrub, no blank spacer regions.
          // Optional overrides: data-stagger-step (ms, default 80),
          // data-stagger-duration (ms, default 650), data-stagger-max
          // (cap of animated children — the rest stay visible, e.g.
          // SpecTable caps at 10 rows).
          document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
            const allItems = Array.from(group.querySelectorAll(":scope > *"));
            if (allItems.length === 0) return;
            const max = Number.parseInt(group.dataset.staggerMax ?? "", 10);
            const items = Number.isFinite(max) && max > 0 ? allItems.slice(0, max) : allItems;
            const step = (Number.parseFloat(group.dataset.staggerStep ?? "") || 80) / 1000;
            const duration = (Number.parseFloat(group.dataset.staggerDuration ?? "") || 650) / 1000;
            gsap.fromTo(
              items,
              { opacity: 0, y: coarse ? 14 : 20 },
              {
                opacity: 1,
                y: 0,
                duration,
                ease: "expo.out",
                stagger: step,
                immediateRender: false,
                scrollTrigger: { trigger: group, start: "top 88%", once: true },
              },
            );
          });

          // Light scrub parallax on [data-parallax] images/layers only:
          // small vertical drift (±4%) while the element crosses the
          // viewport. scale 1.08 is baked in so the drift never exposes
          // an edge — parallax layers must sit in an overflow-hidden
          // container (hero sections, image wrappers). Transform only.
          document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -4, scale: 1.08 },
              {
                yPercent: 4,
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

          // Horizontal scrub: a [data-scrub] band's inner content (first
          // child, e.g. a wide panoramic track) translates horizontally
          // in proportion to vertical scroll. Distance is measured from
          // the overflow (track scrollWidth − band clientWidth) and
          // re-measured on refresh; direction follows the band's own
          // writing direction (RTL bands move the other way).
          document.querySelectorAll<HTMLElement>("[data-scrub]").forEach((el) => {
            const track = el.firstElementChild as HTMLElement | null;
            if (!track) return;
            const isRtl = getComputedStyle(el).direction === "rtl";
            gsap.to(track, {
              x: () => (isRtl ? 1 : -1) * Math.max(0, track.scrollWidth - el.clientWidth),
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });

          // SVG path drawing — SolarLineArt (`[data-draw]`). Dash hiding
          // is applied by the tween itself with immediateRender: false,
          // so without a scroll trigger the paths render fully drawn.
          // Optional: data-draw-duration (s, default 1.4),
          // data-draw-delay (s, default 0).
          document.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
            const len = path.getTotalLength();
            const duration = Number.parseFloat(path.dataset.drawDuration ?? "") || 1.4;
            const delay = Number.parseFloat(path.dataset.drawDelay ?? "") || 0;
            gsap.fromTo(
              path,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration,
                delay,
                ease: "power2.inOut",
                immediateRender: false,
                scrollTrigger: { trigger: path, start: "top 92%", once: true },
              },
            );
          });

          // Icon drawing — `[data-draw-group]` containers (line icons in
          // Cards / pillar tiles): every stroked shape inside draws once
          // on entry, 600ms power2.inOut, stagger 60ms, one shared
          // trigger per group. Icons stay aria-hidden; reduced-motion
          // users see them fully drawn (early return above).
          document.querySelectorAll<HTMLElement>("[data-draw-group]").forEach((group) => {
            const shapes = Array.from(
              group.querySelectorAll<SVGGeometryElement>(
                "path, circle, rect, line, polyline, polygon",
              ),
            ).filter((shape) => {
              try {
                const len = shape.getTotalLength();
                return Number.isFinite(len) && len > 0;
              } catch {
                return false;
              }
            });
            if (shapes.length === 0) return;
            const lengths = shapes.map((s) => {
              try {
                return s.getTotalLength();
              } catch {
                return 0;
              }
            });
            gsap.fromTo(
              shapes,
              (i: number) => ({ strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }),
              {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.inOut",
                stagger: 0.06,
                immediateRender: false,
                scrollTrigger: { trigger: group, start: "top 92%", once: true },
              },
            );
          });

          // Diagram flow paths — SystemDiagram (`[data-flow]`). Draw once
          // on entry, then a slow dashed drift (energy flow, meaningful
          // motion, not decoration) that plays only while the figure is
          // in the viewport and only after the draw completed.
          document.querySelectorAll<SVGGeometryElement>("[data-flow]").forEach((path) => {
            const len = path.getTotalLength();
            let drawn = false;
            let flowActive = false;
            const drift = gsap.to(path, {
              strokeDashoffset: "-=28",
              duration: 1.8,
              ease: "none",
              repeat: -1,
              paused: true,
            });
            gsap.fromTo(
              path,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: "power2.inOut",
                immediateRender: false,
                scrollTrigger: { trigger: path, start: "top 90%", once: true },
                onComplete: () => {
                  drawn = true;
                  // Switch the drawn line to a dashed flow line (7+7 = 14
                  // period; the drift step of 28 is exactly 2 periods, so
                  // the loop is seamless).
                  path.style.strokeDasharray = "7 7";
                  if (flowActive) drift.play();
                },
              },
            );
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

          // Count-up — `[data-countup="N"]` (registry #8). The element's
          // HTML text is ALREADY the final value (progressive enhancement
          // + reduced-motion: the early return above never runs this, so
          // reduced-motion users simply see the final number). The tween
          // only rewrites innerText while it plays, once, on entry.
          // Optional `data-countup-suffix` (e.g. "+") is appended.
          document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
            const target = Number.parseFloat(el.dataset.countup ?? "");
            if (!Number.isFinite(target)) return;
            const suffix = el.dataset.countupSuffix ?? "";
            const decimals = Number.isInteger(target) ? 0 : 1;
            // Optional data-countup-delay (s) staggers counters in a group
            // (e.g. about-page stats: 0 / 0.1 / 0.2).
            const delay = Number.parseFloat(el.dataset.countupDelay ?? "") || 0;
            const render = (v: number) => {
              el.textContent = `${v.toFixed(decimals)}${suffix}`;
            };
            const state = { v: 0 };
            gsap.to(state, {
              v: target,
              duration: 1.2,
              delay,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
              onUpdate: () => render(state.v),
              onComplete: () => render(target),
            });
          });

          // Step progress — `[data-step-line]` (axis x|y, default x) draws
          // 0 -> 100% in 800ms ease-in-out on entry; `[data-step-group]`
          // dots (`[data-step-dot]`) fill with 120ms stagger, 250ms
          // fade-up. Decorative only — steps are numbered in text.
          document.querySelectorAll<HTMLElement>("[data-step-line]").forEach((el) => {
            const axis = el.dataset.stepAxis === "y" ? "scaleY" : "scaleX";
            gsap.fromTo(
              el,
              { [axis]: 0 },
              {
                [axis]: 1,
                duration: 0.8,
                ease: "power2.inOut",
                immediateRender: false,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });
          document.querySelectorAll<HTMLElement>("[data-step-group]").forEach((group) => {
            const dots = group.querySelectorAll<HTMLElement>("[data-step-dot]");
            if (dots.length === 0) return;
            gsap.fromTo(
              dots,
              { opacity: 0.2, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: "power2.out",
                stagger: 0.12,
                immediateRender: false,
                scrollTrigger: { trigger: group, start: "top 88%", once: true },
              },
            );
          });

          // Pinned scrub carousel — `[data-pinned-scrub]` (solutions).
          // Desktop (>=768px): ONE pin per page; the track translates
          // horizontally with scrub: 1; pin distance = track overflow.
          // Mobile: no pin — the track is a native horizontal snap
          // carousel (CSS). RTL: x direction reversed. Reduced motion:
          // no pin (early return above). Progress bar + slide counter
          // follow scroll position on both layouts; prev/next buttons
          // and Arrow keys move one slide via Lenis scrollTo.
          document.querySelectorAll<HTMLElement>("[data-pinned-scrub]").forEach((section) => {
            const track = section.querySelector<HTMLElement>("[data-pinned-track]");
            if (!track) return;
            const fill = section.querySelector<HTMLElement>("[data-scrub-progress]");
            const counter = section.querySelector<HTMLElement>("[data-scrub-counter]");
            const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-pinned-slide]"));
            const total = slides.length;
            const isRtl = getComputedStyle(section).direction === "rtl";
            const setProgress = (p: number) => {
              const clamped = Math.max(0, Math.min(1, p));
              if (fill) fill.style.transform = `scaleX(${clamped})`;
              if (counter && total > 0) {
                counter.textContent = `${Math.min(total, Math.round(clamped * (total - 1)) + 1)} / ${total}`;
              }
            };
            // Mobile / no-JS fallback: native track scroll drives the
            // progress bar and counter (same normalisation as the drag
            // carousel — Chrome/Safari RTL scrollLeft is negative,
            // Firefox RTL starts at maxScroll).
            const onTrackScroll = () => {
              const max = track.scrollWidth - track.clientWidth;
              if (max <= 0) return;
              const offset = isRtl
                ? track.scrollLeft <= 0
                  ? -track.scrollLeft
                  : max - track.scrollLeft
                : track.scrollLeft;
              setProgress(offset / max);
            };
            track.addEventListener("scroll", onTrackScroll, { passive: true });
            const mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
              const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
              const tween = gsap.to(track, {
                x: () => (isRtl ? 1 : -1) * distance(),
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: () => `+=${distance()}`,
                  pin: true,
                  scrub: 1,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => setProgress(self.progress),
                },
              });
              const st = tween.scrollTrigger;
              const goTo = (idx: number) => {
                if (!st || total <= 1) return;
                const clamped = Math.max(0, Math.min(total - 1, idx));
                const target = st.start + (clamped / (total - 1)) * (st.end - st.start);
                scrollToY(target, 0.9);
              };
              const currentIdx = () => {
                if (!st || total <= 1) return 0;
                return Math.round(((st.scroll() - st.start) / (st.end - st.start)) * (total - 1));
              };
              const onKey = (e: KeyboardEvent) => {
                if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                const forward = e.key === "ArrowRight" ? !isRtl : isRtl;
                e.preventDefault();
                goTo(currentIdx() + (forward ? 1 : -1));
              };
              const onPrev = () => goTo(currentIdx() - 1);
              const onNext = () => goTo(currentIdx() + 1);
              section.addEventListener("keydown", onKey);
              const prevBtn = section.querySelector("[data-scrub-prev]");
              const nextBtn = section.querySelector("[data-scrub-next]");
              prevBtn?.addEventListener("click", onPrev);
              nextBtn?.addEventListener("click", onNext);
              return () => {
                section.removeEventListener("keydown", onKey);
                prevBtn?.removeEventListener("click", onPrev);
                nextBtn?.removeEventListener("click", onNext);
                track.removeEventListener("scroll", onTrackScroll);
              };
            });
          });

          // Clip-wipe — `[data-clip]` (registry #10, CTA bands). A mask
          // reveal, top-down, once on entry. immediateRender: false keeps
          // the band fully visible without JS / before its trigger fires.
          document.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.9,
                ease: "expo.out",
                immediateRender: false,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
          });

          // Magnetic hover — `[data-magnetic]` (registry #11). Pointer-fine
          // only (touch/coarse never gets it), ≤6px drift toward the
          // cursor, transform only, eased back on leave. Listeners are
          // registered here but torn down via `magneticCleanups` (the
          // effect cleanup), because gsap.context().revert() does not
          // remove DOM listeners.
          if (window.matchMedia("(pointer: fine)").matches) {
            document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
              const onMove = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                const clamp = (v: number) => Math.max(-6, Math.min(6, v * 0.25));
                gsap.to(el, {
                  x: clamp(dx),
                  y: clamp(dy),
                  duration: 0.3,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              };
              const onLeave = () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: "expo.out", overwrite: "auto" });
              };
              el.addEventListener("pointermove", onMove);
              el.addEventListener("pointerleave", onLeave);
              magneticCleanups.push(() => {
                el.removeEventListener("pointermove", onMove);
                el.removeEventListener("pointerleave", onLeave);
                gsap.set(el, { x: 0, y: 0 });
              });
            });
          }
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
      // Magnetic listeners are outside the GSAP context — remove them so
      // a route change never leaves stale handlers on unmounted nodes.
      for (const cleanup of magneticCleanups) {
        try {
          cleanup();
        } catch {
          /* ignore */
        }
      }
      magneticCleanups = [];
      if (onLoad) window.removeEventListener("load", onLoad);
      try {
        marqueeObserver?.disconnect();
      } catch {
        /* ignore */
      }
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
