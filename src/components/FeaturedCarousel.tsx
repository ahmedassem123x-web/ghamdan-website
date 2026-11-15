"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Locale, Product } from "@/data";

/**
 * FeaturedCarousel — drag carousel for the home featured products.
 * CSS Scroll Snap + pointer events, no library. Drag is 1:1 with the
 * pointer (mouse + touch); snap 250ms on release to the nearest card.
 * Arrows + dots + keyboard + red progress bar + "n / total" counter.
 * Angle threshold: a mostly-vertical gesture is left to page scroll.
 * RTL: dragging right moves forward (same scrollLeft formula works in
 * both Chrome-style (negative) and Firefox-style RTL scrolling).
 * Reduced motion: snap is instant (global 0.01ms override), no momentum.
 * No autoplay.
 */
export default function FeaturedCarousel({ locale, products }: { locale: Locale; products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startScroll: number;
    active: boolean;
    decided: boolean;
  } | null>(null);
  const rtlNegativeRef = useRef(true);
  const total = products.length;
  const rtl = locale === "ar";

  const cardWidth = useCallback(() => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>("[data-drag-slide]");
    if (!track || !slide) return track?.clientWidth ?? 300;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "16") || 16;
    return slide.offsetWidth + gap;
  }, []);

  /** Normalised scroll offset (0..max) regardless of RTL scrollLeft mode. */
  const offsetOf = useCallback((el: HTMLElement) => {
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return 0;
    if (!rtl) return el.scrollLeft;
    return rtlNegativeRef.current ? -el.scrollLeft : max - el.scrollLeft;
  }, [rtl]);

  const scrollToIndex = useCallback(
    (idx: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(total - 1, idx));
      const max = track.scrollWidth - track.clientWidth;
      const target = Math.min(max, clamped * cardWidth());
      let left = target;
      if (rtl) left = rtlNegativeRef.current ? -target : max - target;
      track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      setIndex(clamped);
    },
    [cardWidth, rtl, total],
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      // dir +1 = forward (reading direction).
      const next = Math.max(0, Math.min(total - 1, index + dir));
      scrollToIndex(next);
    },
    [index, scrollToIndex, total],
  );

  // Detect the browser's RTL scrollLeft mode once (Chrome/Safari: 0 at
  // start and negative while scrolling; Firefox: maxScroll at start).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    rtlNegativeRef.current = !rtl || track.scrollLeft === 0;
  }, [rtl]);

  // Keep index / progress in sync with native scrolling (wheel, keys).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = track.scrollWidth - track.clientWidth;
        const offset = offsetOf(track);
        setIndex(max > 0 ? Math.round(offset / cardWidth()) : 0);
        const fill = track.parentElement?.querySelector<HTMLElement>("[data-drag-progress]");
        if (fill && max > 0) fill.style.width = `${(offset / max) * 100}%`;
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [cardWidth, offsetOf]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startScroll: track.scrollLeft,
      active: false,
      decided: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.decided) {
      // Angle threshold: vertical gesture belongs to page scroll.
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        dragRef.current = null;
        return;
      }
      if (Math.abs(dx) > 8) {
        drag.decided = true;
        drag.active = true;
        setDragging(true);
        track.setPointerCapture(e.pointerId);
      } else {
        return;
      }
    }
    if (drag.active) {
      // Same formula in LTR and RTL (see header comment): dragging right
      // scrolls toward the previous item in LTR and the next in RTL.
      track.scrollLeft = drag.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!drag || !drag.active || !track) return;
    // Snap 250ms to the nearest card.
    const max = track.scrollWidth - track.clientWidth;
    const idx = max > 0 ? Math.round(offsetOf(track) / cardWidth()) : 0;
    scrollToIndex(idx);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(rtl ? 1 : -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(rtl ? -1 : 1);
    }
  };

  const prevLabel = locale === "ar" ? "السابق" : locale === "en" ? "Previous" : "上一张";
  const nextLabel = locale === "ar" ? "التالي" : locale === "en" ? "Next" : "下一张";
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <div>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={locale === "ar" ? "منتجات مميزة" : locale === "en" ? "Featured products" : "精选产品"}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`drag-carousel__track ${dragging ? "drag-carousel__track--dragging" : ""}`}
      >
        {products.map((p) => (
          <div key={p.id} data-drag-slide className="drag-carousel__slide">
            <ProductCard locale={locale} product={p} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label={prevLabel}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-navy shadow-card transition-colors hover:border-primary-hover hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PrevIcon className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= total - 1}
          aria-label={nextLabel}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-navy shadow-card transition-colors hover:border-primary-hover hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <NextIcon className="size-5" aria-hidden="true" />
        </button>
        <div className="drag-carousel__bar flex-1" aria-hidden="true">
          <div data-drag-progress className="drag-carousel__fill" />
        </div>
        <div className="flex shrink-0 items-center gap-1" role="tablist" aria-label={prevLabel}>
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className="flex size-6 items-center justify-center rounded-full"
            >
              <span
                className={`size-2.5 rounded-full transition-colors ${i === index ? "bg-brand-red" : "bg-border-strong hover:bg-primary"}`}
              />
            </button>
          ))}
        </div>
        <span className="shrink-0 font-latin text-sm font-bold text-navy" dir="ltr" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
