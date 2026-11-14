"use client";

import { useEffect, useState } from "react";
import { webp } from "@/lib/images";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Gallery + lightbox (§2.11): thumbnail grid, click to open, arrows + Escape
 * to close. Stand-in photos always carry an "illustrative" caption (honesty rule).
 */
export default function Gallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? null : (o + 1) % items.length));
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? null : (o - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4" data-stagger>
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative overflow-hidden rounded-image text-start focus-visible:outline-2 focus-visible:outline-accent"
            aria-label={`${label} — ${item.alt}`}
          >
            <img src={webp(item.src)} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-primary-deep/70 px-3 py-2 text-[0.6875rem] font-bold text-white">{item.caption}</span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={items[open].alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-primary-deep/90 p-4">
          <button type="button" className="absolute top-4 end-4 inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Close" onClick={() => setOpen(null)}>
            <X className="size-6" aria-hidden="true" />
          </button>
          <button type="button" className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Previous" onClick={() => setOpen((open - 1 + items.length) % items.length)}>
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <img src={webp(items[open].src)} alt={items[open].alt} className="max-h-[80vh] max-w-full rounded-image object-contain" />
          <button type="button" className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Next" onClick={() => setOpen((open + 1) % items.length)}>
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
          {items[open].caption && (
            <p className="absolute bottom-4 inset-x-0 text-center text-sm font-bold text-white">{items[open].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
