"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { usePrefersReducedMotion } from "@/lib/perf";

/**
 * Agency coverflow carousel (plan §5 — Coverflow).
 *
 * The 6 agencies in a perspective coverflow: the active card is full-size
 * and centred, side cards angle away and fade with distance. Autoplay
 * advances the REAL active index every 5s (wrapping, same go(1) as the
 * Next button — forward in reading direction). Pauses on hover /
 * focus-within / pointer-down and resumes ~4s after the interaction ends;
 * the pause button toggles it off until pressed again. Disabled entirely
 * under prefers-reduced-motion (no timer; the coverflow is a static grid
 * there and the controls hide). Probe: the root carries
 * data-active-index + data-autoplay; the active dot has aria-current.
 * Controls: prev/next buttons, dots, arrow keys on the region, click a
 * side card to centre it. RTL-correct: in Arabic the flow runs
 * right-to-left (next = visually left) and arrow keys follow the writing
 * direction; the rotation angle mirrors too.
 *
 * Transform/opacity only, 300ms ease-out. The active card's name is
 * announced via a polite live region. Reduced motion: the coverflow
 * becomes a static grid — every card fully visible with its details link,
 * and the arrows/dots hide.
 */
export type CoverflowAgency = {
  id: string;
  name: string;
  wordmarkClass: string;
  status: string;
  text: string;
  href: string;
  officialAgent: boolean;
  pending: boolean;
  pendingLabel: string;
  productCount: number;
  productLabel: string;
  comingSoonLabel: string;
};

export type AgencyCoverflowLabels = {
  carouselLabel: string;
  prevLabel: string;
  nextLabel: string;
  goToLabel: string;
  detailsLabel: string;
};

export default function AgencyCoverflow({
  agencies,
  locale,
  labels,
}: {
  agencies: CoverflowAgency[];
  locale: string;
  labels: AgencyCoverflowLabels;
}) {
  const [active, setActive] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const rtl = locale === "ar";
  const dirSign = rtl ? -1 : 1;
  const count = agencies.length;

  // --- Autoplay (5s/slide, plain setInterval, no new deps) ---
  // `autoplayPaused` is the user's explicit toggle (sticky until pressed
  // again); `held` is transient — true while hovered / focused /
  // pointer-down, cleared ~4s after the interaction ends.
  const reduced = usePrefersReducedMotion();
  // SSR renders reduced=false (the server value); until this mount effect
  // runs, the preference is unresolved — report autoplay "off" so the
  // attribute never transiently reads "playing" for reduced-motion users.
  const [motionResolved, setMotionResolved] = useState(false);
  useEffect(() => {
    setMotionResolved(true);
  }, []);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const markInteraction = useCallback(() => {
    setHeld(true);
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = null;
  }, []);
  const endInteraction = useCallback(() => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      setHeld(false);
      resumeTimer.current = null;
    }, 4000);
  }, []);
  useEffect(
    () => () => {
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    },
    [],
  );
  const autoplayState =
    !motionResolved || reduced || count <= 1 ? "off" : autoplayPaused || held ? "paused" : "playing";
  // Tighter card spacing on phones so side cards stay inside the stage.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const gap = narrow ? 110 : 190;

  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count],
  );

  // Autoplay tick: advances the SAME active state the arrows/dots use.
  // `active` in the deps restarts the 5s countdown after every change,
  // manual or automatic. No timer at all under reduced motion.
  useEffect(() => {
    if (!motionResolved || reduced || autoplayPaused || held || count <= 1) return;
    const id = window.setInterval(() => go(1), 5000);
    return () => window.clearInterval(id);
  }, [motionResolved, reduced, autoplayPaused, held, active, count, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // In RTL, ArrowLeft moves to the next item (inline-end direction).
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(rtl ? 1 : -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(rtl ? -1 : 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(count - 1);
    }
  };

  // Focus-within pause: only release the hold when focus leaves the
  // whole coverflow (moving between its own controls keeps it held).
  const onBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) endInteraction();
  };

  const pauseLabel =
    locale === "ar" ? "إيقاف التشغيل التلقائي" : locale === "en" ? "Pause autoplay" : "暂停自动播放";
  const playLabel =
    locale === "ar" ? "استئناف التشغيل التلقائي" : locale === "en" ? "Resume autoplay" : "恢复自动播放";

  const activeAgency = agencies[active];

  return (
    <div
      className="agency-coverflow"
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.carouselLabel}
      data-active-index={active}
      data-autoplay={autoplayState}
      onKeyDown={onKeyDown}
      onMouseEnter={markInteraction}
      onMouseLeave={endInteraction}
      onFocus={markInteraction}
      onBlur={onBlur}
      onPointerDown={markInteraction}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
    >
      <p className="sr-only" aria-live="polite">
        {activeAgency ? `${activeAgency.name} — ${activeAgency.status}` : ""}
      </p>

      <div className="agency-coverflow__stage" aria-hidden={false}>
        {agencies.map((ag, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const hidden = abs > 2;
          return (
            <article
              key={ag.id}
              aria-hidden={hidden || undefined}
              className={`agency-coverflow__card${i === active ? " agency-coverflow__card--active" : ""}`}
              style={{
                transform: `translateX(-50%) translateX(${offset * gap * dirSign}px) translateZ(${-abs * 120}px) rotateY(${offset * -32 * dirSign}deg) scale(${1 - Math.min(abs * 0.12, 0.36)})`,
                zIndex: 10 - abs,
                opacity: hidden ? 0 : abs === 0 ? 1 : abs === 1 ? 0.85 : 0.55,
                visibility: hidden ? "hidden" : "visible",
                pointerEvents: hidden ? "none" : "auto",
              }}
              onClick={() => {
                if (i !== active) setActive(i);
              }}
            >
              <div
                className={`flex h-full flex-col rounded-card p-6 shadow-card ${
                  ag.officialAgent ? "bg-mesh-navy" : "border border-border bg-white"
                }`}
              >
                <span className={`font-latin text-3xl ${ag.wordmarkClass} ${ag.officialAgent ? "text-white" : "text-navy"}`} dir="ltr">
                  {ag.name}
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-2">
                  {ag.officialAgent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-red-deep px-3 py-1 text-xs font-bold text-white">
                      <CheckIcon className="size-3.5" aria-hidden="true" />
                      {ag.status}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-navy">{ag.status}</span>
                      {ag.pending && (
                        <span className="inline-flex w-fit rounded-full border border-warning/60 bg-warning/25 px-3 py-1 text-xs font-bold text-navy">
                          {ag.pendingLabel}
                        </span>
                      )}
                    </>
                  )}
                </span>
                <p className={`mt-3 flex-1 text-body-sm ${ag.officialAgent ? "text-sky-100" : "text-text-muted"}`}>
                  {ag.text}
                </p>
                <p className={`mt-3 text-body-sm font-bold ${ag.officialAgent ? "text-white" : "text-navy"}`}>
                  {ag.productCount > 0 ? (
                    <>
                      <span className="font-latin text-xl font-extrabold text-brand-red-text" dir="ltr">
                        {ag.productCount}
                      </span>{" "}
                      {ag.productLabel}
                    </>
                  ) : (
                    <span className="inline-flex rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">
                      {ag.comingSoonLabel}
                    </span>
                  )}
                </p>
                <Link
                  href={ag.href}
                  tabIndex={i === active ? 0 : -1}
                  aria-hidden={i === active ? undefined : true}
                  className="agency-coverflow__details mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {labels.detailsLabel}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="agency-coverflow__controls mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={labels.prevLabel}
          className="flex size-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-card transition-colors hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowIcon className="size-5 rtl:rotate-180 ltr:rotate-0" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" aria-label={labels.carouselLabel}>
          {agencies.map((ag, i) => (
            <button
              key={ag.id}
              type="button"
              aria-current={i === active || undefined}
              aria-label={`${labels.goToLabel} ${ag.name}`}
              onClick={() => setActive(i)}
              className={`size-2.5 rounded-full transition-[transform,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                i === active ? "scale-125 bg-brand-red" : "bg-border hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
        {motionResolved && !reduced && count > 1 && (
          <button
            type="button"
            data-autoplay-toggle
            aria-pressed={autoplayPaused}
            aria-label={autoplayPaused ? playLabel : pauseLabel}
            onClick={() => setAutoplayPaused((v) => !v)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-card transition-colors hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span aria-hidden="true">{autoplayPaused ? "▶" : "❚❚"}</span>
            <span className="sr-only">{autoplayPaused ? playLabel : pauseLabel}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={labels.nextLabel}
          className="flex size-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-card transition-colors hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowIcon className="size-5 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </button>
      </div>

      <style>{`
        .agency-coverflow__stage {
          position: relative;
          height: 22rem;
          perspective: 1200px;
          /* Side cards angle out past the stage edge — clip them here so
             the page never gains horizontal scroll on phones. */
          overflow: clip;
        }
        .agency-coverflow__card {
          position: absolute;
          left: 50%;
          top: 0;
          width: min(19rem, 86vw);
          height: 100%;
          cursor: pointer;
          transition: transform 300ms ease-out, opacity 300ms ease-out, visibility 300ms ease-out;
        }
        .agency-coverflow__card--active { cursor: default; }
        .agency-coverflow__details { visibility: hidden; }
        .agency-coverflow__card--active .agency-coverflow__details { visibility: visible; }
        @media (prefers-reduced-motion: reduce) {
          .agency-coverflow__stage {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            gap: 1.5rem;
            height: auto;
            perspective: none;
          }
          .agency-coverflow__card {
            position: static;
            width: auto;
            height: auto;
            cursor: default;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transition: none;
          }
          .agency-coverflow__details { visibility: visible; }
          .agency-coverflow__controls { display: none; }
        }
      `}</style>
    </div>
  );
}
