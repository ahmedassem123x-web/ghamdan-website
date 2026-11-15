"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { webp } from "@/lib/images";
import { useFocusTrap } from "@/lib/use-focus-trap";
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
 */
export default function ProjectsClient({ locale, items }: { locale: Locale; items: CarouselItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const rtl = locale === "ar";
  const touchX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(lightbox, dialogRef);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const current = visible[Math.min(index, Math.max(0, visible.length - 1))];

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + visible.length) % visible.length);

  const prevLabel = locale === "ar" ? "السابق" : locale === "en" ? "Previous" : "上一张";
  const nextLabel = locale === "ar" ? "التالي" : locale === "en" ? "Next" : "下一张";
  const closeLabel = locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "关闭";
  // Previous points backward, Next points forward — per reading direction.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  // Lightbox keyboard: Escape closes; arrows follow reading direction.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, rtl, visible]);

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

  if (!current) return null;

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={ui("projects.filterAll", locale)}>
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
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              filter === f.id ? "bg-navy text-white" : "bg-surface text-text-muted hover:bg-surface-muted hover:text-navy"
            }`}
          >
            {ui(f.labelKey, locale)}
          </button>
        ))}
      </div>

      {/* Carousel shell */}
      <div
        className="relative mt-6 overflow-hidden rounded-image shadow-card"
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
      <div className="mt-4 flex justify-center gap-1" role="tablist" aria-label="Gallery pages">
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

      {/* Lightbox */}
      {lightbox && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={current.alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4">
          <button type="button" className="absolute top-4 end-4 inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white" aria-label={closeLabel} onClick={() => setLightbox(false)}>
            <X className="size-6" aria-hidden="true" />
          </button>
          <button type="button" className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label={prevLabel} onClick={() => go(-1)}>
            <PrevIcon className="size-6" aria-hidden="true" />
          </button>
          <img key={current.src} src={webp(current.src)} alt={current.alt} className="carousel__img max-h-[80vh] max-w-full rounded-image object-contain" />
          <button type="button" className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label={nextLabel} onClick={() => go(1)}>
            <NextIcon className="size-6" aria-hidden="true" />
          </button>
          <p className="absolute bottom-4 inset-x-0 text-center text-sm font-bold text-white">{ui("projects.galleryNote", locale)}</p>
        </div>
      )}
    </div>
  );
}
