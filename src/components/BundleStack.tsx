"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon, BuildingIcon, HomeIcon, PanelIcon } from "@/components/icons";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { webp } from "@/lib/images";
import { type Bundle, type Locale, type LocalizedString } from "@/data";

/**
 * Card Stack / Fan for the 3 confirmed bundles (plan §4).
 *
 * Desktop (md+): the cards sit as a fanned deck — slight rotations and a
 * negative inline-start margin so each card overlaps the previous one.
 * Hovering / focusing the deck fans it wider (rotations grow, cards lift);
 * hovering / focusing one card lifts it above the deck. A toggle button
 * spreads the deck into a plain 3-column grid for touch users and anyone
 * who wants the full cards side by side. Mobile: normal stacked list —
 * no overlap, no fan.
 *
 * Only confirmed bundles are ever passed in by callers (bundle-4 is
 * archived and never rendered). Motion is transform-only, 200ms ease-out,
 * and disabled under prefers-reduced-motion. Entry animation is the
 * section-level [data-reveal] (MotionProvider) — no [data-stagger] on the
 * grid itself, because GSAP's inline transform would override the fan
 * rotations on the cards.
 *
 * The fan CSS lives in a scoped <style> block here (globals.css is owned
 * by another worker): nth-child rotations + overlap margins, hover /
 * focus-within fan, and the spread state.
 */

const COPY: Record<string, LocalizedString> = {
  spread: {
    ar: "فرد الباقات",
    en: "Spread the bundles",
    zh: "展开套餐",
  },
  stack: {
    ar: "عرض كمكدّس",
    en: "Stack the bundles",
    zh: "叠放套餐",
  },
  hint: {
    ar: "مرّر فوق الباقات لفردها، أو استخدم الزر لعرضها جنبًا إلى جنب.",
    en: "Hover the bundles to fan them out, or use the button to lay them side by side.",
    zh: "将鼠标悬停在套餐上可展开，或使用按钮并排显示。",
  },
  current: {
    ar: "الباقة الحالية",
    en: "Current bundle",
    zh: "当前套餐",
  },
};

/** Capacity badges parsed from the bundle's own components string
 * (e.g. "6kW", "5kWh") — derived from the data, never invented. */
function capacityBadges(components: string): string[] {
  const m = components.match(/\d+(?:\.\d+)?\s*kWh?/g);
  return m ? [...new Set(m.map((x) => x.replace(/\s+/g, "")))] : [];
}

/** Application photo per bundle, from the existing photo set. */
const BUNDLE_IMAGES: Record<string, string> = {
  "bundle-1": "/images/photos/villa-roof.jpg",
  "bundle-2": "/images/photos/house-bright.jpg",
  "bundle-3": "/images/photos/solar-farm.jpg",
};

export function BundleCard({ locale, bundle, current = false }: { locale: Locale; bundle: Bundle; current?: boolean }) {
  return (
    <article className="card-luxe group flex flex-col overflow-hidden hover:shadow-card-hover">
      <div className="relative overflow-hidden">
        <img
          src={webp(BUNDLE_IMAGES[bundle.id] ?? "/images/photos/solar-farm.jpg")}
          alt={t(bundle.name, locale)}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {current && (
          <span className="absolute start-3 top-3 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow-card">
            {t(COPY.current, locale)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">
            {bundle.id === "bundle-1" ? (
              <HomeIcon className="size-6" aria-hidden="true" />
            ) : bundle.id === "bundle-2" ? (
              <BuildingIcon className="size-6" aria-hidden="true" />
            ) : (
              <PanelIcon className="size-6" aria-hidden="true" />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {capacityBadges(t(bundle.components, locale)).map((c) => (
              <span key={c} dir="ltr" className="rounded-full bg-sky px-2.5 py-1 text-xs font-bold text-navy">
                {c}
              </span>
            ))}
          </div>
        </div>
        <h3 className="mt-4 text-h3 font-semibold text-navy">{t(bundle.name, locale)}</h3>
        <p className="mt-2 text-body-sm font-bold text-text-muted">{t(bundle.use, locale)}</p>
        <ul className="mt-3 flex-1 list-disc space-y-1 ps-5 text-body-sm text-text-muted">
          {t(bundle.components, locale)
            .split("+")
            .map((part, i) => (
              <li key={i}>{part.trim()}</li>
            ))}
        </ul>
        <Link
          href={localizedHref(locale, `/systems/${bundle.slug}`)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover"
        >
          {ui("cta.details", locale)}
          <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function BundleStack({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [spread, setSpread] = useState(false);
  return (
    <div>
      <style>{`
        .bundle-stack__grid > * { position: relative; transition: transform 200ms ease-out, box-shadow 200ms ease-out; }
        @media (min-width: 768px) {
          .bundle-stack__grid > *:nth-child(2),
          .bundle-stack__grid > *:nth-child(3) { margin-inline-start: -4rem; }
          .bundle-stack__grid > *:nth-child(1) { transform: rotate(-2deg); }
          .bundle-stack__grid > *:nth-child(2) { transform: rotate(0.5deg) translateY(0.5rem); }
          .bundle-stack__grid > *:nth-child(3) { transform: rotate(2deg) translateY(1rem); }
          .bundle-stack__grid:hover > *:nth-child(1),
          .bundle-stack__grid:focus-within > *:nth-child(1) { transform: rotate(-4deg) translateY(-0.25rem); }
          .bundle-stack__grid:hover > *:nth-child(2),
          .bundle-stack__grid:focus-within > *:nth-child(2) { transform: rotate(0deg) translateY(-0.75rem); }
          .bundle-stack__grid:hover > *:nth-child(3),
          .bundle-stack__grid:focus-within > *:nth-child(3) { transform: rotate(4deg) translateY(-0.25rem); }
          .bundle-stack__grid > *:hover,
          .bundle-stack__grid > *:focus-within { z-index: 20; }
          .bundle-stack__grid > *:nth-child(1):hover,
          .bundle-stack__grid > *:nth-child(1):focus-within { transform: rotate(-4deg) translateY(-0.5rem); }
          .bundle-stack__grid > *:nth-child(2):hover,
          .bundle-stack__grid > *:nth-child(2):focus-within { transform: rotate(0deg) translateY(-1rem); }
          .bundle-stack__grid > *:nth-child(3):hover,
          .bundle-stack__grid > *:nth-child(3):focus-within { transform: rotate(4deg) translateY(-0.5rem); }
          .bundle-stack__grid.bundle-stack--spread > *:nth-child(2),
          .bundle-stack__grid.bundle-stack--spread > *:nth-child(3) { margin-inline-start: 0; }
          .bundle-stack__grid.bundle-stack--spread > * { transform: none; }
          .bundle-stack__grid.bundle-stack--spread > *:hover,
          .bundle-stack__grid.bundle-stack--spread > *:focus-within { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bundle-stack__grid > * { transition: none; }
        }
      `}</style>
      <div className="mb-6 hidden items-center justify-between gap-4 md:flex">
        <p className="text-body-sm text-text-muted">{t(COPY.hint, locale)}</p>
        <button
          type="button"
          onClick={() => setSpread((v) => !v)}
          aria-expanded={spread}
          aria-controls="bundle-stack-grid"
          className="btn btn-outline shrink-0"
        >
          {spread ? t(COPY.stack, locale) : t(COPY.spread, locale)}
        </button>
      </div>
      <div id="bundle-stack-grid" className={`bundle-stack__grid grid gap-6 md:grid-cols-3 ${spread ? "bundle-stack--spread" : ""}`}>
        {children}
      </div>
    </div>
  );
}
