"use client";

import { useEffect, useRef, useState } from "react";
import { webp } from "@/lib/images";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Locale } from "@/data";

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Gallery + lightbox (§2.11): thumbnail grid, click to open, arrows + Escape
 * to close. Stand-in photos always carry an "illustrative" caption (honesty rule).
 *
 * Direction rules (fixed 2026-11-15 — icons and keyboard were written for
 * Arabic only): "Previous" points backward and "Next" points forward per
 * reading direction — in RTL ArrowLeft / swipe right move forward, in LTR
 * ArrowRight / swipe left move forward. Lightbox images crossfade 300ms
 * (`.carousel__img`, keyed by index) instead of swapping instantly.
 */
export default function Gallery({ items, label, locale, vtName }: { items: GalleryItem[]; label: string; locale: Locale; vtName?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  // Lightbox exit: 150ms closing class, then unmount (focus restore is
  // owned by useFocusTrap, which fires when open becomes null).
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);
  // Click zoom: scale 1 -> 1.6 around the click point (200ms); pinch
  // zoom (mobile): 1..3 via two-finger distance; swipe down closes.
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomScale, setZoomScale] = useState(1);
  const pinchRef = useRef<{ d0: number; scale0: number } | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const rtl = locale === "ar";
  const touchX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open !== null, dialogRef);

  const close = () => {
    if (open === null || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(null);
      setClosing(false);
      closeTimer.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  // Reset zoom whenever the image changes.
  useEffect(() => {
    setZoomed(false);
    setZoomScale(1);
    setZoomOrigin("50% 50%");
  }, [open]);

  // Previous points backward, Next points forward — per reading direction.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? null : (o + (rtl ? 1 : -1) + items.length) % items.length));
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? null : (o + (rtl ? -1 : 1) + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, items.length, rtl]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinchRef.current = { d0: d, scale0: zoomScale };
      touchX.current = null;
      swipeRef.current = null;
      return;
    }
    touchX.current = e.touches[0].clientX;
    swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (pinchRef.current && e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setZoomScale(Math.max(1, Math.min(3, (pinchRef.current.scale0 * d) / pinchRef.current.d0)));
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (pinchRef.current) {
      pinchRef.current = null;
      setZoomScale((s) => (s < 1.15 ? 1 : s));
      return;
    }
    // Swipe down to close (mobile, only when not zoomed).
    if (swipeRef.current && zoomScale === 1 && open !== null) {
      const dy = e.changedTouches[0].clientY - swipeRef.current.y;
      swipeRef.current = null;
      if (dy > 80) {
        close();
        return;
      }
    }
    swipeRef.current = null;
    if (open === null || touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    const dir = dx < 0 ? (rtl ? -1 : 1) : (rtl ? 1 : -1);
    setOpen((o) => (o === null ? null : (o + dir + items.length) % items.length));
  };

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomScale !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setZoomed((z) => !z);
  };

  if (items.length === 0) return null;

  // M-1 fix 2026-11-14: a single image rendered as a ~130px thumbnail in a
  // mostly empty grid. With one image, show it large (full-width, 4/3);
  // the thumbnail grid + lightbox apply only when there are 2+ images.
  const single = items.length === 1 ? items[0] : null;

  return (
    <div>
      {single ? (
        <button
          data-reveal
          type="button"
          onClick={() => setOpen(0)}
          className="group relative block w-full overflow-hidden rounded-image text-start shadow-card transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-primary-hover"
          aria-label={`${label} — ${single.alt}`}
        >
          <img src={webp(single.src)} alt={single.alt} loading="lazy" style={vtName ? { viewTransitionName: vtName } : undefined} className={`aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 ${vtName ? "vt-product-img" : ""}`} />
          {/* D-7 fix 2026-11-15: caption was rendered twice — this overlay
              AND the line below the image (product page renders copy.k3
              under the Gallery). Ref 06 shows a single caption, so the
              overlay is removed here; the line below is kept. The lightbox
              caption (inside the dialog) is unchanged. */}
        </button>
      ) : (
        <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative overflow-hidden rounded-image text-start shadow-card transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-primary-hover"
              aria-label={`${label} — ${item.alt}`}
            >
              <img src={webp(item.src)} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {/* D-7: overlay caption removed — same duplicate as above. */}
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={items[open].alt}
          className={`lightbox fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4 ${closing ? "lightbox--closing" : ""}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button type="button" className="absolute top-4 end-4 inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white" aria-label="Close" onClick={close}>
            <X className="size-6" aria-hidden="true" />
          </button>
          <p key={open} className="lightbox__counter absolute top-4 inset-x-0 text-center text-sm font-bold text-white" dir="ltr">
            {open + 1} / {items.length}
          </p>
          <button type="button" className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white" aria-label="Previous" onClick={() => setOpen((open - 1 + items.length) % items.length)}>
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
              key={open}
              src={webp(items[open].src)}
              alt={items[open].alt}
              onClick={onImageClick}
              className={`carousel__img lightbox__img max-h-[80vh] max-w-full rounded-image object-contain shadow-glow-blue ${zoomed || zoomScale !== 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            />
          </div>
          <button type="button" className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white" aria-label="Next" onClick={() => setOpen((open + 1) % items.length)}>
            <NextIcon className="size-6" aria-hidden="true" />
          </button>
          {items[open].caption && (
            <p className="absolute bottom-4 inset-x-0 text-center text-sm font-bold text-white">{items[open].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
