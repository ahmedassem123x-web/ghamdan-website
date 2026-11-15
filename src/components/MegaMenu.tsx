"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, ChevronDownIcon, LayersIcon, PackageIcon, categoryIcon } from "@/components/icons";
import { categories, bundles } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/**
 * Mega menu — v15 §5.5, board-driven (no reference coverage; design from
 * docs/design-system.md §4 + ADR-07). Desktop panel + mobile accordion.
 *
 * Content is data-driven, never invented:
 *  - All Products FIRST -> /products (37 published = sum of the 8
 *    categories' publishedCount, computed here from src/data).
 *  - The 8 real categories, each with its Lucide icon (categoryIcon) and
 *    its real published count — including 0-count categories (panels,
 *    systems, storage-ci, cameras), which still resolve to their real
 *    category page and its honest empty state.
 *  - Secondary column: /systems index + the 3 CONFIRMED bundles only
 *    (bundle-4 is archived and never listed as available).
 * Every link resolves to an existing route; there are no dead links.
 *
 * Operability: mouse (hover intent on the trigger wrapper, owned by
 * Header), keyboard (button toggles; ArrowDown opens and moves focus
 * into the panel; Escape closes and returns focus to the trigger), and
 * touch (tap toggles). The panel unmounts when closed, so nothing
 * inside it is focusable while hidden. Content is visible by default
 * (no opacity-0 initial state).
 */

function countLabel(count: number, locale: Locale): string {
  return `${count} ${ui("catalog.product", locale)}`;
}

function CategoryRow({
  locale,
  onNavigate,
}: {
  locale: Locale;
  onNavigate: () => void;
}) {
  return (
    <>
      {categories.map((c) => (
        <li key={c.id}>
          <Link
            href={localizedHref(locale, `/products/category/${c.id}`)}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky text-primary-hover transition-colors group-hover:bg-primary-hover group-hover:text-white [&_svg]:size-5">
              {categoryIcon(c.icon)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-sm font-semibold text-navy">
                {t(c.name, locale)}
              </span>
              <span className="block text-caption text-text-muted">
                {countLabel(c.publishedCount, locale)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </>
  );
}

export function MegaMenu({
  locale,
  open,
  closing = false,
  onNavigate,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  closing?: boolean;
  onNavigate: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  const totalPublished = categories.reduce((n, c) => n + c.publishedCount, 0);
  const confirmedBundles = bundles.filter((b) => b.status === "confirmed");
  return (
    <div
      id="mega-menu"
      role="region"
      aria-label={ui("nav.products", locale)}
      className={`mega-menu absolute inset-x-0 top-full hidden rounded-b-[20px] border-b border-border bg-surface shadow-card-hover lg:block ${closing ? "mega-menu--closing" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_20rem]">
        {/* Categories — All Products first */}
        <div>
          <Link
            href={localizedHref(locale, "/products")}
            onClick={onNavigate}
            className="mega-menu__col group flex items-center gap-3 rounded-md bg-sky px-4 py-3 transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-hover">
              <LayersIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-navy group-hover:text-white">
                {ui("catalog.allProducts", locale)}
              </span>
              <span className="block text-caption text-text-secondary group-hover:text-white/80">
                {countLabel(totalPublished, locale)}
              </span>
            </span>
            <ArrowIcon
              className="size-5 shrink-0 text-navy transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-white rtl:rotate-0 ltr:rotate-180"
              aria-hidden="true"
            />
          </Link>
          <ul data-stagger className="mega-menu__col mt-4 grid gap-1 sm:grid-cols-2" style={{ animationDelay: "30ms" }}>
            <CategoryRow locale={locale} onNavigate={onNavigate} />
          </ul>
        </div>
        {/* Secondary column — ready-made systems + confirmed bundles */}
        <div className="mega-menu__col rounded-[20px] border border-border bg-surface-elevated p-5 shadow-card" style={{ animationDelay: "60ms" }}>
          <Link
            href={localizedHref(locale, "/systems")}
            onClick={onNavigate}
            className="flex items-center gap-2 text-h4 font-semibold text-navy transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <PackageIcon className="size-5 text-primary-hover" aria-hidden="true" />
            {ui("nav.systems", locale)}
          </Link>
          <ul data-stagger className="mt-4 space-y-1">
            {confirmedBundles.map((b) => (
              <li key={b.id}>
                <Link
                  href={localizedHref(locale, `/systems/${b.slug}`)}
                  onClick={onNavigate}
                  className="block rounded-md px-3 py-2.5 transition-colors hover:bg-sky focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="block text-body-sm font-semibold text-navy">
                    {t(b.name, locale)}
                  </span>
                  <span className="mt-0.5 block text-caption text-text-muted">
                    {t(b.components, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={localizedHref(locale, "/systems")}
            onClick={onNavigate}
            className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-primary-hover transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {ui("cta.discoverMore", locale)}
            <ArrowIcon
              className="size-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mobile drawer accordion: same 8 categories + All Products first. */
export function ProductsAccordion({
  locale,
  onNavigate,
  animate = false,
  delayMs = 0,
}: {
  locale: Locale;
  onNavigate: () => void;
  animate?: boolean;
  delayMs?: number;
}) {
  const [open, setOpen] = useState(false);
  const totalPublished = categories.reduce((n, c) => n + c.publishedCount, 0);
  return (
    <li className={`border-b border-border ${animate ? "drawer__link" : ""}`} style={animate ? { animationDelay: `${delayMs}ms` } : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="drawer-products"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between py-3.5 text-base font-semibold text-navy"
      >
        {ui("nav.products", locale)}
        <ChevronDownIcon
          className={`size-5 shrink-0 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul data-stagger id="drawer-products" className="pb-3 ps-3">
          <li>
            <Link
              href={localizedHref(locale, "/products")}
              onClick={onNavigate}
              className="flex items-center justify-between rounded-md px-3 py-3 text-body-sm font-semibold text-primary-hover transition-colors hover:bg-sky"
            >
              {ui("catalog.allProducts", locale)}
              <span className="text-caption text-text-muted">
                {countLabel(totalPublished, locale)}
              </span>
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={localizedHref(locale, `/products/category/${c.id}`)}
                onClick={onNavigate}
                className="flex items-center justify-between rounded-md px-3 py-3 text-body-sm font-semibold text-navy transition-colors hover:bg-sky"
              >
                {t(c.name, locale)}
                <span className="text-caption text-text-muted">
                  {countLabel(c.publishedCount, locale)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
