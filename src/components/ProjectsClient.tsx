"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { webp } from "@/lib/images";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { usePrefersReducedMotion } from "@/lib/perf";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export interface CarouselItem {
  src: string;
  alt: string;
  category: "solar" | "water" | "agriculture";
  caption?: string;
}

const FILTERS = [
  { id: "all", labelKey: "projects.filterAll" },
  { id: "solar", labelKey: "projects.filterSolar" },
  { id: "water", labelKey: "projects.filterWater" },
  { id: "agriculture", labelKey: "projects.filterAgriculture" },
] as const;

/**
 * Projects gallery (§3.5): filter pills + carousel shell with round arrow
 * buttons and dot pagination. Stand-in photos only — the caption and note
 * say so; no approved project is shown (CI-07).
 *
 * Direction rules (fixed 2026-11-15 — arrows were reversed):
 * - "Previous" sits at the inline-start side and points BACKWARD (against
 *   reading direction): right in RTL, left in LTR.
 * - "Next" sits at the inline-end side and points FORWARD: left in RTL,
 *   right in LTR.
 * - Keyboard and touch follow the same rule: in RTL ArrowLeft / swipe
 *   right move forward; in LTR ArrowRight / swipe left move forward.
 * - Image changes crossfade 300ms (`.carousel__img`, keyed by src) instead
 *   of swapping instantly; touch swipe (40px threshold) is supported.
 * Autoplay: advances the REAL index every 5s (wrapping, same go(1) as
 * the Next button). Pauses on hover / focus-within / pointer-down /
 * swipe and while the lightbox is open; resumes ~4s after the interaction
 * ends. The pause button toggles it off until pressed again. Disabled
 * entirely under prefers-reduced-motion (no timer). Probe: the root
 * carries data-active-index + data-autoplay; the active dot has
 * aria-selected.
 */
export default function ProjectsClient({ locale, items }: { locale: Locale; items: CarouselItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  // Lightbox exit: 150ms closing class, then unmount.
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  // Click zoom (1 -> 1.6 around the click point) + pinch zoom (1..3) +
  // swipe down to close (mobile, only when not zoomed).
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomScale, setZoomScale] = useState(1);
  const pinchRef = useRef<{ d0: number; scale0: number } | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const rtl = locale === "ar";
  const touchX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(lightbox, dialogRef);

  const closeLightbox = () => {
    if (!lightbox || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setLightbox(false);
      setClosing(false);
      closeTimer.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    setZoomed(false);
    setZoomScale(1);
    setZoomOrigin("50% 50%");
  }, [lightbox, index]);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const current = visible[Math.min(index, Math.max(0, visible.length - 1))];

  // --- Autoplay (5s/slide, plain setInterval, no new deps) ---
  // `autoplayPaused` is the user's explicit toggle (sticky until pressed
  // again); `held` is transient — true while hovered / focused /
  // pointer-down / swiping / lightbox open, cleared ~4s after the
  // interaction ends.
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
  // The lightbox owns the same index — never auto-advance under it.
  useEffect(() => {
    if (lightbox) markInteraction();
    else endInteraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);
  const autoplayState =
    !motionResolved || reduced || visible.length <= 1
      ? "off"
      : autoplayPaused || held
        ? "paused"
        : "playing";

  // Autoplay tick: advances the SAME index state the arrows/dots use.
  // `index` in the deps restarts the 5s countdown after every change,
  // manual or automatic. No timer at all under reduced motion.
  useEffect(() => {
    if (!motionResolved || reduced || autoplayPaused || held || lightbox || visible.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % visible.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [motionResolved, reduced, autoplayPaused, held, lightbox, index, visible.length]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + visible.length) % visible.length);

  const prevLabel = locale === "ar" ? "السابق" : locale === "en" ? "Previous" : "上一张";
  const nextLabel = locale === "ar" ? "التالي" : locale === "en" ? "Next" : "下一张";
  const pauseLabel =
    locale === "ar" ? "إيقاف التشغيل التلقائي" : locale === "en" ? "Pause autoplay" : "暂停自动播放";
  const playLabel =
    locale === "ar" ? "استئناف التشغيل التلقائي" : locale === "en" ? "Resume autoplay" : "恢复自动播放";
  const closeLabel = locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "关闭";
  // Previous points backward, Next points forward — per reading direction.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  // Lightbox keyboard: Escape closes; arrows follow reading direction.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, rtl, visible]);

  // Lightbox touch: pinch zoom + swipe down to close.
  const onDialogTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinchRef.current = { d0: d, scale0: zoomScale };
      swipeRef.current = null;
      return;
    }
    swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onDialogTouchMove = (e: React.TouchEvent) => {
    if (pinchRef.current && e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setZoomScale(Math.max(1, Math.min(3, (pinchRef.current.scale0 * d) / pinchRef.current.d0)));
    }
  };
  const onDialogTouchEnd = (e: React.TouchEvent) => {
    if (pinchRef.current) {
      pinchRef.current = null;
      setZoomScale((s) => (s < 1.15 ? 1 : s));
      return;
    }
    if (swipeRef.current && zoomScale === 1) {
      const dy = e.changedTouches[0].clientY - swipeRef.current.y;
      swipeRef.current = null;
      if (dy > 80) closeLightbox();
    }
    swipeRef.current = null;
  };

  const onLightboxImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomScale !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setZoomed((z) => !z);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 ? (rtl ? -1 : 1) : (rtl ? 1 : -1));
  };

  // Focus-within pause: only release the hold when focus leaves the
  // whole carousel (moving between its own controls keeps it held).
  const onBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) endInteraction();
  };

  if (!current) return null;

  return (
    <div
      data-active-index={Math.min(index, visible.length - 1)}
      data-autoplay={autoplayState}
      onMouseEnter={markInteraction}
      onMouseLeave={endInteraction}
      onFocus={markInteraction}
      onBlur={onBlur}
      onPointerDown={markInteraction}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
    >
      {/* Filter pills */}
      <div data-stagger className="flex flex-wrap gap-2" role="tablist" aria-label={ui("projects.filterAll", locale)}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setIndex(0);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              filter === f.id ? "border-navy bg-navy text-white" : "border-border bg-white text-text-muted hover:border-primary-hover hover:text-navy"
            }`}
          >
            {ui(f.labelKey, locale)}
          </button>
        ))}
      </div>

      {/* Carousel shell */}
      <div
        data-reveal="scale" className="relative mt-6 overflow-hidden rounded-image shadow-card"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button type="button" onClick={() => setLightbox(true)} className="block w-full" aria-label={current.alt}>
          <img key={current.src} src={webp(current.src)} alt={current.alt} loading="lazy" className="carousel__img aspect-[16/9] w-full object-cover" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent px-5 pb-5 pt-16">
          <p className="text-lg font-extrabold text-white">{ui("projects.galleryCaption", locale)}</p>
          <p className="mt-1 text-body-sm text-text-inverse-muted">{ui("projects.galleryNote", locale)}</p>
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={prevLabel}
          className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-card transition-transform hover:scale-105"
        >
          <PrevIcon className="size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={nextLabel}
          className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-card transition-transform hover:scale-105"
        >
          <NextIcon className="size-6" aria-hidden="true" />
        </button>
      </div>

      {/* Dot pagination — 24px hit area (WCAG 2.5.8) around a 10px dot. */}
      <div data-stagger className="mt-4 flex items-center justify-center gap-3">
        <div className="flex gap-1" role="tablist" aria-label="Gallery pages">
          {visible.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === Math.min(index, visible.length - 1)}
              aria-label={`${i + 1}`}
              onClick={() => setIndex(i)}
              className="flex size-6 items-center justify-center rounded-full"
            >
              <span
                className={`size-2.5 rounded-full transition-colors ${i === Math.min(index, visible.length - 1) ? "bg-primary-hover" : "bg-border-strong hover:bg-primary"}`}
              />
            </button>
          ))}
        </div>
        {motionResolved && !reduced && visible.length > 1 && (
          <button
            type="button"
            data-autoplay-toggle
            aria-pressed={autoplayPaused}
            aria-label={autoplayPaused ? playLabel : pauseLabel}
            onClick={() => setAutoplayPaused((v) => !v)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-navy shadow-card transition-colors hover:border-primary-hover hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span aria-hidden="true">{autoplayPaused ? "▶" : "❚❚"}</span>
            <span className="sr-only">{autoplayPaused ? playLabel : pauseLabel}</span>
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className={`lightbox fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4 ${closing ? "lightbox--closing" : ""}`}
          onTouchStart={onDialogTouchStart}
          onTouchMove={onDialogTouchMove}
          onTouchEnd={onDialogTouchEnd}
        >
          <button type="button" className="absolute top-4 end-4 inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white" aria-label={closeLabel} onClick={closeLightbox}>
            <X className="size-6" aria-hidden="true" />
          </button>
          <p key={Math.min(index, visible.length - 1)} className="lightbox__counter absolute top-4 inset-x-0 text-center text-sm font-bold text-white" dir="ltr">
            {Math.min(index, visible.length - 1) + 1} / {visible.length}
          </p>
          <button type="button" className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label={prevLabel} onClick={() => go(-1)}>
            <PrevIcon className="size-6" aria-hidden="true" />
          </button>
          <div
            className="max-h-[80vh] max-w-full overflow-hidden"
            style={{
              transform: `scale(${zoomed ? 1.6 : zoomScale})`,
              transformOrigin: zoomOrigin,
              transition: "transform 200ms ease-out",
            }}
          >
            <img
              key={current.src}
              src={webp(current.src)}
              alt={current.alt}
              onClick={onLightboxImageClick}
              className={`carousel__img lightbox__img max-h-[80vh] max-w-full rounded-image object-contain ${zoomed || zoomScale !== 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            />
          </div>
          <button type="button" className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label={nextLabel} onClick={() => go(1)}>
            <NextIcon className="size-6" aria-hidden="true" />
          </button>
          <p className="absolute bottom-4 inset-x-0 text-center text-sm font-bold text-white">{ui("projects.galleryNote", locale)}</p>
        </div>
      )}
    </div>
  );
}
