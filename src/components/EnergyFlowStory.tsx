"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowIcon, BatteryIcon, HomeIcon, InverterIcon, PanelIcon, SunIcon } from "@/components/icons";
import LottieIcon from "@/components/LottieIcon";
import { categories, pillars, pumping, solutionAreas } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";
import styles from "./EnergyFlowStory.module.css";

/**
 * EnergyFlowStory — the energy-flow scroll story on the home page
 * (Phase 1, plan §3 Scrubbing + §11 SVG Path Drawing + §10 Orbit).
 * Placed after the intro/pillars section.
 *
 * - Steps sun → panel → inverter → battery → home. Every label comes
 *   from existing data only: the pumping detail's first step, the
 *   panels / inverters / batteries category names, and the residential
 *   solution title. The heading is the pumping diagram title and the
 *   sub-copy is the first pillar's text. Nothing is invented.
 * - Scroll choreography is owned by the existing MotionProvider — no
 *   second GSAP owner: `[data-scrub]` translates the wide step track
 *   horizontally in proportion to vertical scroll, `[data-draw]` draws
 *   the SVG flow path on entry. Without JS (or under reduced motion)
 *   the full track and all labels are simply visible.
 * - One owner per motion: the scrub owns the step cards, so the cards
 *   carry NO separate [data-step-group]/[data-step-dot] fill — the old
 *   group fill fired all five icon badges together the moment the band
 *   entered (top 88%), while cards 4–5 were still off-screen right.
 *   The scrub slide itself is the cards' entrance.
 * - Desktop scrub travel: the step cards are wider at lg (19rem) so the
 *   track overflows the band by ~440–560px at desktop widths — with the
 *   old 15rem cards the overflow was only ~120–240px, i.e. the scrub
 *   barely moved on desktop while mobile (375px) scrubbed ~1:1.
 *   Mobile keeps the 15rem cards (strong scrub there already).
 * - Orbit: a sun (LottieIcon "sun") with four small icons orbiting it
 *   in pure CSS (transform only), paused under reduced motion. The
 *   orbit is decorative (`aria-hidden`) — the step list above it
 *   carries the same meaning as text.
 */
export default function EnergyFlowStory({ locale }: { locale: Locale }) {
  const panels = categories.find((c) => c.id === "panels")!;
  const inverters = categories.find((c) => c.id === "inverters")!;
  const batteries = categories.find((c) => c.id === "batteries")!;
  const residential = solutionAreas.find((a) => a.id === "residential")!;

  const steps = [
    { icon: SunIcon, label: t(pumping.steps[0].title, locale) },
    { icon: PanelIcon, label: t(panels.name, locale) },
    { icon: InverterIcon, label: t(inverters.name, locale) },
    { icon: BatteryIcon, label: t(batteries.name, locale) },
    { icon: HomeIcon, label: t(residential.title, locale) },
  ];

  // Orbiting icons reuse the same step icons (sun stays in the centre).
  const orbitIcons = [
    { icon: PanelIcon, angle: "0deg" },
    { icon: InverterIcon, angle: "90deg" },
    { icon: BatteryIcon, angle: "180deg" },
    { icon: HomeIcon, angle: "270deg" },
  ];

  // Orbit: pause the infinite CSS spin while the orbit is off-screen
  // (IntersectionObserver; starts paused so nothing spins unseen).
  const orbitRef = useRef<HTMLDivElement>(null);
  const [orbitPaused, setOrbitPaused] = useState(true);
  useEffect(() => {
    const el = orbitRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOrbitPaused(!entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section data-reveal="up" className="section bg-white">
      <div className="wrap">
        <div data-reveal="fade" className="text-center">
          <h2 className="text-h2 font-semibold text-navy">{t(pumping.diagramTitle, locale)}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(pillars[0].text, locale)}</p>
        </div>

        {/* Scrub band: the wide track translates horizontally with
            vertical scroll (MotionProvider [data-scrub]). */}
        <div data-scrub className="mt-12 overflow-hidden">
          <div className="flex w-max min-w-full flex-col gap-6">
            {/* SVG flow path — drawn on entry by MotionProvider [data-draw]. */}
            <svg
              viewBox="0 0 1200 48"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="h-12 w-full"
            >
              <defs>
                <linearGradient id="energy-flow-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0081FB" />
                  <stop offset="55%" stopColor="#0B70C9" />
                  <stop offset="100%" stopColor="#E31E24" />
                </linearGradient>
              </defs>
              <path
                data-draw
                d="M 8 24 C 200 4, 400 44, 600 24 S 1000 4, 1192 24"
                fill="none"
                stroke="url(#energy-flow-grad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <ol className="flex items-stretch gap-4">
              {steps.map((step, i) => (
                <li key={i} className="flex min-w-[15rem] flex-1 items-stretch lg:min-w-[19rem]">
                  <div className="card-luxe flex w-full flex-col items-center p-6 text-center">
                    <span className="font-latin text-sm font-bold text-brand-red" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-3 flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
                      <step.icon className="size-8" aria-hidden="true" />
                    </span>
                    <span className="mt-4 text-balance text-h4 font-semibold leading-snug text-navy">
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <span aria-hidden="true" className="flex shrink-0 items-center px-1 text-primary-hover">
                      <ArrowIcon className="size-5 rtl:rotate-0 ltr:rotate-180" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Orbit — sun at the centre, step icons circling it (CSS only). */}
        <div aria-hidden="true" ref={orbitRef} className={orbitPaused ? `${styles.orbit} ${styles.orbitPaused}` : styles.orbit}>
          <div className={styles.orbitCenter}>
            <LottieIcon name="sun" className="size-16" />
          </div>
          <div className={styles.orbitRing}>
            {orbitIcons.map((o, i) => (
              <span key={i} className={styles.orbitItem} style={{ "--a": o.angle } as CSSProperties}>
                <span className={styles.orbitIcon} style={{ "--a": o.angle } as CSSProperties}>
                  <o.icon className="size-6 text-primary-hover" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
