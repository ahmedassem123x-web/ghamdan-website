"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { webp } from "@/lib/images";
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
 */
export default function ProjectsClient({ locale, items }: { locale: Locale; items: CarouselItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const current = visible[Math.min(index, Math.max(0, visible.length - 1))];

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + visible.length) % visible.length);

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
      <div className="relative mt-6 overflow-hidden rounded-image shadow-card">
        <button type="button" onClick={() => setLightbox(true)} className="block w-full" aria-label={current.alt}>
          <img src={webp(current.src)} alt={current.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent px-5 pb-5 pt-16">
          <p className="text-lg font-extrabold text-white">{ui("projects.galleryCaption", locale)}</p>
          <p className="mt-1 text-body-sm text-text-inverse-muted">{ui("projects.galleryNote", locale)}</p>
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={locale === "ar" ? "السابق" : locale === "en" ? "Previous" : "上一张"}
          className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-card transition-transform hover:scale-105"
        >
          <ChevronLeft className="size-6 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={locale === "ar" ? "التالي" : locale === "en" ? "Next" : "下一张"}
          className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-card transition-transform hover:scale-105"
        >
          <ChevronRight className="size-6 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </button>
      </div>

      {/* Dot pagination */}
      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Gallery pages">
        {visible.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === Math.min(index, visible.length - 1)}
            aria-label={`${i + 1}`}
            onClick={() => setIndex(i)}
            className={`size-2.5 rounded-full transition-colors ${i === Math.min(index, visible.length - 1) ? "bg-primary-hover" : "bg-border-strong hover:bg-primary"}`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div role="dialog" aria-modal="true" aria-label={current.alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/90 p-4">
          <button type="button" className="absolute top-4 end-4 inline-flex size-11 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Close" onClick={() => setLightbox(false)}>
            <X className="size-6" aria-hidden="true" />
          </button>
          <button type="button" className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Previous" onClick={() => go(-1)}>
            <ChevronLeft className="size-6 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
          </button>
          <img src={webp(current.src)} alt={current.alt} className="max-h-[80vh] max-w-full rounded-image object-contain" />
          <button type="button" className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Next" onClick={() => go(1)}>
            <ChevronRight className="size-6 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
          </button>
          <p className="absolute bottom-4 inset-x-0 text-center text-sm font-bold text-white">{ui("projects.galleryNote", locale)}</p>
        </div>
      )}
    </div>
  );
}
