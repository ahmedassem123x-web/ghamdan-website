"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Leaf, Settings, ShieldCheck, Search } from "lucide-react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { CategoryTile } from "@/components/Cards";
import { SearchInput } from "@/components/ui";
import { pages, products, categories, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

/** Per-category strip images (§3.4.3). */
const STRIP_IMAGES: Record<string, string> = {
  panels: "/images/photos/panels-rows.jpg",
  batteries: "/images/photos/battery-storage.jpg",
  inverters: "/images/photos/inverter-unit.jpg",
  pumps: "/images/photos/pump-flow.jpg",
  controllers: "/images/photos/controller-unit.jpg",
  systems: "/images/photos/solar-farm.jpg",
  "storage-ci": "/images/photos/battery-storage.jpg",
  cameras: "/images/photos/controller-unit.jpg",
};

/**
 * Catalogue (§3.4): hero split + trust row + live search (Enter → /search) +
 * image-tile category strip + featured 12 (6-col) + flat CTA banner + why-us.
 * The 12 featured are the data's round-robin selection; search filters all
 * 37 published products live; "view all" reveals the full catalogue in place.
 */
export default function CatalogueClient({ locale }: { locale: Locale }) {
  const c = pages.catalog;
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const published = useMemo(() => products.filter((p) => p.status === "published"), []);
  const featured = useMemo(() => published.filter((p) => p.featured).slice(0, 12), [published]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return showAll ? published : featured;
    return published.filter((p) =>
      `${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${p.model} ${p.subcategory.ar}`.toLowerCase().includes(q),
    );
  }, [published, featured, query, showAll]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) window.location.href = `${localizedHref(locale, "/search")}?q=${encodeURIComponent(q)}`;
  };

  const trustItems = [
    { icon: <Leaf className="size-6" aria-hidden="true" />, label: t(c.k4, locale) },
    { icon: <Settings className="size-6" aria-hidden="true" />, label: t(c.k5, locale) },
    { icon: <ShieldCheck className="size-6" aria-hidden="true" />, label: t(c.k6, locale) },
  ];
  const whyUs = [
    { icon: <Leaf className="size-7" aria-hidden="true" />, title: t(c.k7, locale), text: t(c.k8, locale) },
    { icon: <Settings className="size-7" aria-hidden="true" />, title: t(c.k9, locale), text: t(c.k10, locale) },
    { icon: <ShieldCheck className="size-7" aria-hidden="true" />, title: t(c.k11, locale), text: t(c.k12, locale) },
    { icon: <Leaf className="size-7" aria-hidden="true" />, title: t(c.k13, locale), text: t(c.k14, locale) },
  ];

  return (
    <>
      <Hero
        locale={locale}
        variant="split"
        image="/images/heroes/hero-pump-mountains.jpg"
        imageAlt={t(c.k1, locale)}
        eyebrow={c.k1}
        title={c.k2}
        text={c.k3}
        whatsapp={false}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />

      {/* Trust row (§3.4.1) */}
      <div className="border-b border-border bg-surface">
        <div className="wrap flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-bold text-primary">
              <span className="text-accent">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Guidance bar (§3.1.9 — Home + /products only) */}
      <div className="border-b border-border bg-surface-blue">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-4 text-center sm:flex-row sm:text-start">
          <p className="font-bold text-primary">
            {locale === "ar"
              ? "لا تعرف النظام المناسب؟ جرّب دليل الضخ أو تحدث معنا عبر واتساب"
              : locale === "en"
                ? "Not sure which system fits? Try the pumping guide or chat with us on WhatsApp"
                : "不知道哪种系统合适？试试抽水指南或通过 WhatsApp 与我们联系"}
          </p>
          <Link
            href={localizedHref(locale, "/guidance")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[0.625rem] bg-primary px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
          >
            {locale === "ar" ? "دليل الضخ" : locale === "en" ? "Pumping guide" : "抽水指南"}
          </Link>
        </div>
      </div>

      {/* 4.2 Search (live filter; Enter → /search) */}
      <section className="section-sm">
        <div className="wrap">
          <form onSubmit={submitSearch} className="mx-auto max-w-2xl">
            <SearchInput value={query} onChange={setQuery} placeholder={ui("catalog.searchPh", locale)} label={ui("catalog.searchPh", locale)} />
          </form>

          {/* 4.3 Category strip — 8 image tiles, horizontal scroll on mobile */}
          <div className="mt-10 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-8 lg:overflow-visible">
            {categories.map((cat) => (
              <div key={cat.id} className="w-36 shrink-0 snap-start lg:w-auto">
                <CategoryTile locale={locale} category={cat} image={STRIP_IMAGES[cat.id] ?? "/images/photos/solar-farm.jpg"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.4 Featured products (12, 6-col) */}
      <section className="section-sm" ref={gridRef} id="grid">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2 font-extrabold text-primary">{t(c.k16, locale)}</h2>
            {!showAll && query.trim() === "" && (
              <button
                type="button"
                onClick={() => {
                  setShowAll(true);
                  gridRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong"
              >
                {ui("cta.viewAllProducts", locale)}
                <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-2 text-body-sm text-text-muted">
            {query.trim() !== ""
              ? `${results.length} ${ui("search.results", locale)}`
              : `${ui("catalog.showing", locale)}: ${results.length} / ${published.length}`}
          </p>
          {results.length === 0 ? (
            <div className="mt-8 rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
              <h3 className="text-h3 font-extrabold text-primary">{t(c.k17, locale)}</h3>
              <p className="mt-2 text-body text-text-muted">{t(c.k18, locale)}</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5" data-stagger>
              {results.map((p) => (
                <ProductCard key={p.id} locale={locale} product={p} />
              ))}
            </div>
          )}
          <p className="mt-6 text-body-sm font-bold text-primary">{t(siteSettings.inquiryPolicy, locale)}</p>
        </div>
      </section>

      {/* 4.5 CTA banner — flat surface-blue panel + photo */}
      <section className="section-sm">
        <div className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-card bg-surface-blue p-8 md:grid-cols-[1fr_40%] md:p-10">
            <div>
              <h3 className="text-h2 font-extrabold text-primary">{t(c.k19, locale)}</h3>
              <p className="mt-3 max-w-xl text-body text-text-muted">{t(c.k20, locale)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/967775800000?text=${encodeURIComponent(WA_MESSAGES.general[locale])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-primary px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
                >
                  {ui("cta.whatsapp", locale)}
                </a>
                <Link
                  href={localizedHref(locale, "/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] border-2 border-primary bg-white px-5 py-2.5 font-bold text-button text-primary transition-all duration-200 hover:-translate-y-0.5"
                >
                  {locale === "ar" ? "أو أرسل لنا رسالة" : locale === "en" ? "Or send us a message" : "或给我们留言"}
                </Link>
              </div>
            </div>
            <img src={webp("/images/photos/pivot.jpg")} alt={t(c.k19, locale)} loading="lazy" className="h-full min-h-56 w-full rounded-image object-cover" />
          </div>
        </div>
      </section>

      {/* 4.6 Why us — 4 columns, hairline dividers */}
      <section className="section bg-surface">
        <div className="wrap">
          <h2 className="text-h2 text-center font-extrabold text-primary">{t(c.k21, locale)}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border lg:divide-x-reverse" data-stagger>
            {whyUs.map((f, i) => (
              <div key={i} className="flex flex-col items-center px-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-extrabold text-primary">{f.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
