"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Leaf, Settings, ShieldCheck } from "lucide-react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { categoryIcon } from "@/components/Cards";
import { SearchInput } from "@/components/ui";
import { pages, products, categories, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES, waLink } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

/**
 * Catalogue (§3.4, ADR-07): split hero (ref 04: text left, photo right) +
 * trust row + live search (Enter → /search) + All-Products tab strip +
 * product grid + flat CTA banner + why-us.
 *
 * Tab strip (ref 08 pattern, 8 GTS categories — not the ref's 12 chips):
 * «جميع المنتجات» first/active by default showing all 37 published
 * products, then one tab per real category with its published count.
 * Zero-count tabs stay visible and select an honest empty state — never
 * hidden, never dead. The old `showAll` toggle and the featured-12 default
 * are REMOVED with the strip (ADR-07 §5); `featured` survives only as data
 * for the home page's featured tiles. Active tab is reflected in the URL
 * (?cat=<id>) via history.replaceState so it is shareable; static export
 * stays valid (no server searchParams).
 */
export default function CatalogueClient({ locale }: { locale: Locale }) {
  const c = pages.catalog;
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const published = useMemo(() => products.filter((p) => p.status === "published"), []);

  // Read ?cat= on mount (static export: no server searchParams).
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("cat");
    if (cat && (cat === "all" || categories.some((x) => x.id === cat))) setActiveTab(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync (shareable, indexable).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (activeTab === "all") sp.delete("cat");
    else sp.set("cat", activeTab);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [activeTab]);

  const activeCategory = activeTab === "all" ? undefined : categories.find((x) => x.id === activeTab);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = activeTab === "all" ? published : published.filter((p) => p.categoryId === activeTab);
    if (!q) return list;
    return list.filter((p) =>
      `${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${p.model} ${p.subcategory.ar}`.toLowerCase().includes(q),
    );
  }, [published, query, activeTab]);

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
        variant="side-left"
        image="/images/heroes/hero-pump-mountains.jpg"
        imageAlt={t(c.k2, locale)}
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
            <span key={i} className="inline-flex items-center gap-2 font-bold text-navy">
              <span className="text-primary-hover">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Guidance bar (§3.1.9 — Home + /products only) */}
      <div className="border-b border-border bg-sky">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-4 text-center sm:flex-row sm:text-start">
          <p className="font-bold text-navy">
            {locale === "ar"
              ? "لا تعرف النظام المناسب؟ جرّب دليل الضخ أو تحدث معنا عبر واتساب"
              : locale === "en"
                ? "Not sure which system fits? Try the pumping guide or chat with us on WhatsApp"
                : "不知道哪种系统合适？试试抽水指南或通过 WhatsApp 与我们联系"}
          </p>
          <Link
            href={localizedHref(locale, "/guidance")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-navy"
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
        </div>
      </section>

      {/* 4.3 All-Products tab strip (ADR-07, ref 08 pattern): All first/active,
          then the 8 real GTS categories with published counts. */}
      <div className="border-b border-border bg-surface">
        <div className="wrap flex gap-1 overflow-x-auto py-3" role="tablist" aria-label={ui("catalog.allProducts", locale)}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === "all" ? "bg-navy text-white" : "text-text-muted hover:bg-surface-muted hover:text-navy"
            }`}
          >
            {ui("catalog.allProducts", locale)}
            <span dir="ltr" className={`text-xs font-bold ${activeTab === "all" ? "text-white/80" : "text-text-muted"}`}>
              ({published.length})
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeTab === cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === cat.id ? "bg-navy text-white" : "text-text-muted hover:bg-surface-muted hover:text-navy"
              }`}
            >
              {categoryIcon(cat.icon)}
              {t(cat.name, locale)}
              <span dir="ltr" className={`text-xs font-bold ${activeTab === cat.id ? "text-white/80" : "text-text-muted"}`}>
                ({cat.publishedCount})
              </span>
              {cat.publishedCount === 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-bold ${activeTab === cat.id ? "bg-white/20 text-white" : "bg-sky text-primary-hover"}`}>
                  {ui("catalog.comingSoon", locale)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4.4 Product grid — all 37 by default (All tab), filtered by tab/search */}
      {/* 4.4 Product grid — reveals on scroll (MotionProvider). */}
      <section data-reveal className="section-sm" id="grid">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2 font-semibold text-navy"
              >{activeCategory ? t(activeCategory.name, locale) : ui("catalog.allProducts", locale)}
            </h2>
          </div>
          <p className="mt-2 text-body-sm text-text-muted">
            {query.trim() !== ""
              ? `${results.length} ${ui("search.results", locale)}`
              : `${ui("catalog.showing", locale)}: ${results.length} / ${published.length}`}
          </p>
          {results.length === 0 ? (
            <div className="mt-8 rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
              <h3 className="text-h3 font-semibold text-navy">{t(c.k17, locale)}</h3>
              <p className="mt-2 text-body text-text-muted">{t(c.k18, locale)}</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {results.map((p) => (
                <ProductCard key={p.id} locale={locale} product={p} />
              ))}
            </div>
          )}
          <p className="mt-6 text-body-sm font-bold text-navy">{t(siteSettings.inquiryPolicy, locale)}</p>
        </div>
      </section>

      {/* 4.5 CTA banner — flat sky panel + photo */}
      <section className="section-sm">
        <div className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-card bg-sky p-8 md:grid-cols-[1fr_40%] md:p-10">
            <div>
              <h3 className="text-h2 font-semibold text-navy">{t(c.k19, locale)}</h3>
              <p className="mt-3 max-w-xl text-body text-text-muted">{t(c.k20, locale)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={waLink(WA_MESSAGES.general[locale])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-navy"
                >
                  {ui("cta.whatsapp", locale)}
                </a>
                <Link
                  href={localizedHref(locale, "/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] border-2 border-primary bg-white px-5 py-2.5 font-bold text-button text-navy transition-transform duration-200 hover:-translate-y-0.5"
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
          <h2 className="text-h2 text-center font-semibold text-navy">{t(c.k21, locale)}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border lg:divide-x-reverse">
            {whyUs.map((f, i) => (
              <div key={i} className="flex flex-col items-center px-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
