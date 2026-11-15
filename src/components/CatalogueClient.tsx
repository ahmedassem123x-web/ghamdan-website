"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LeafIcon, SettingsIcon, ShieldIcon, PanelIcon, InverterIcon, BatteryIcon, categoryIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
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
  // Filter transitions: on tab/search change the grid exits (opacity 0 +
  // scale 0.96, 150ms), then the new results enter (opacity 0 + y 12,
  // 300ms ease-out, stagger 40ms). Reduced motion: instant swap.
  const [displayed, setDisplayed] = useState(() => products.filter((p) => p.status === "published"));
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const firstFilterRender = useRef(true);
  // Sliding tab indicator: one element sliding to the active tab (250ms
  // standard easing); position measured physically so RTL just works.
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

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
      `${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${typeof p.model === "string" ? p.model : `${p.model.ar} ${p.model.en ?? ""}`} ${p.subcategory.ar}`.toLowerCase().includes(q),
    );
  }, [published, query, activeTab]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) window.location.href = `${localizedHref(locale, "/search")}?q=${encodeURIComponent(q)}`;
  };

  // Filter swap choreography (exit 150ms -> swap -> enter 300ms + 40ms
  // stagger). Runs when the computed result list changes.
  useEffect(() => {
    if (firstFilterRender.current) {
      firstFilterRender.current = false;
      setDisplayed(results);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayed(results);
      setPhase("idle");
      return;
    }
    setPhase("exit");
    const t = window.setTimeout(() => {
      setDisplayed(results);
      setPhase("enter");
    }, 150);
    return () => window.clearTimeout(t);
  }, [results]);

  // Sliding tab indicator: measure the active button on tab/resize.
  useEffect(() => {
    const update = () => {
      const container = tabsRef.current;
      const btn = tabBtnRefs.current.get(activeTab);
      if (!container || !btn) return;
      const cRect = container.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      setIndicator({
        left: bRect.left - cRect.left + container.scrollLeft,
        width: bRect.width,
        visible: true,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTab]);

  const trustItems = [
    { icon: <LeafIcon className="size-6" aria-hidden="true" />, label: t(c.k4, locale) },
    { icon: <SettingsIcon className="size-6" aria-hidden="true" />, label: t(c.k5, locale) },
    { icon: <ShieldIcon className="size-6" aria-hidden="true" />, label: t(c.k6, locale) },
  ];
  const whyUs = [
    { icon: <PanelIcon className="size-7" aria-hidden="true" />, title: t(c.k7, locale), text: t(c.k8, locale) },
    { icon: <InverterIcon className="size-7" aria-hidden="true" />, title: t(c.k9, locale), text: t(c.k10, locale) },
    { icon: <BatteryIcon className="size-7" aria-hidden="true" />, title: t(c.k11, locale), text: t(c.k12, locale) },
    { icon: <ShieldIcon className="size-7" aria-hidden="true" />, title: t(c.k13, locale), text: t(c.k14, locale) },
  ];
  /** Mini category cards (item 29): one real photo per category, from the
   * existing photo set — no invented images. Clicking selects the tab. */
  const categoryImages: Record<string, string> = {
    panels: "/images/photos/panels-rows.jpg",
    inverters: "/images/photos/inverter-unit.jpg",
    batteries: "/images/photos/battery-storage.jpg",
    pumps: "/images/photos/pump-flow.jpg",
    controllers: "/images/photos/controller-unit.jpg",
    systems: "/images/photos/solar-farm.jpg",
    "storage-ci": "/images/photos/battery-storage.jpg",
    cameras: "/images/photos/controller-unit.jpg",
  };

  return (
    <>
      <Hero
        locale={locale}
        variant="side-left"
        image="/images/heroes/hero-pump-mountains.jpg"
        imageAlt={t(c.k2, locale)}
        title={c.k2}
        text={c.k3}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />

      {/* Trust row (§3.4.1) — white, quiet */}
      <div className="border-b border-border bg-white">
        <div data-stagger className="wrap flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5">
          {trustItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-bold text-navy">
              <span className="text-primary-hover">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Guidance bar (§3.1.9 — Home + /products only) */}
      <div data-reveal="fade" className="border-b border-border bg-sky">
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
            className="btn-navy"
          >
            {locale === "ar" ? "دليل الضخ" : locale === "en" ? "Pumping guide" : "抽水指南"}
          </Link>
        </div>
      </div>

      {/* 4.2 Search (live filter; Enter → /search) — light mesh band */}
      <section data-reveal="up" className="section-sm bg-mesh-light">
        <div className="wrap">
          <form onSubmit={submitSearch} className="mx-auto max-w-2xl">
            <SearchInput value={query} onChange={setQuery} placeholder={ui("catalog.searchPh", locale)} label={ui("catalog.searchPh", locale)} />
          </form>
        </div>
      </section>

      {/* 4.3 All-Products tab strip (ADR-07, ref 08 pattern): All first/active,
          then the 8 real GTS categories with published counts. Bordered chips;
          the active chip is navy. */}
      <div className="border-b border-border bg-white">
        <div ref={tabsRef} data-stagger className="tab-strip wrap relative flex gap-2 overflow-x-auto py-4" role="tablist" aria-label={ui("catalog.allProducts", locale)}>
          <span
            className="tab-indicator"
            aria-hidden="true"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
          />
          <button
            type="button"
            role="tab"
            ref={(el) => {
              if (el) tabBtnRefs.current.set("all", el);
              else tabBtnRefs.current.delete("all");
            }}
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === "all" ? "border-navy bg-navy text-white" : "border-border bg-white text-text-muted hover:border-primary-hover hover:text-navy"
            }`}
          >
            {ui("catalog.allProducts", locale)}
            <span dir="ltr" className={`text-xs font-bold ${activeTab === "all" ? "text-white/80" : "text-text-muted"}`}>
              (<span data-countup={String(published.length)}>{published.length}</span>)
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              ref={(el) => {
                if (el) tabBtnRefs.current.set(cat.id, el);
                else tabBtnRefs.current.delete(cat.id);
              }}
              aria-selected={activeTab === cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === cat.id ? "border-navy bg-navy text-white" : "border-border bg-white text-text-muted hover:border-primary-hover hover:text-navy"
              }`}
            >
              {categoryIcon(cat.icon)}
              {t(cat.name, locale)}
              <span dir="ltr" className={`text-xs font-bold ${activeTab === cat.id ? "text-white/80" : "text-text-muted"}`}>
                (<span data-countup={String(cat.publishedCount)}>{cat.publishedCount}</span>)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4.4 Product grid — all 37 by default (All tab), filtered by tab/search */}
      {/* 4.4 Product grid — reveals on scroll (MotionProvider). */}
      <section data-reveal="left" className="section-sm bg-sand" id="grid">
        <div className="wrap">
          {/* Mini category cards: photo + name + count per real category. */}
          <div data-stagger className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveTab(cat.id);
                  document.getElementById("grid")?.scrollIntoView();
                }}
                aria-pressed={activeTab === cat.id}
                className={`group overflow-hidden rounded-card border bg-white text-start shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  activeTab === cat.id ? "border-primary ring-2 ring-primary/40" : "border-border"
                }`}
              >
                <span className="block overflow-hidden">
                  <img
                    src={webp(categoryImages[cat.id] ?? "/images/photos/solar-farm.jpg")}
                    alt=""
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="block p-2.5">
                  <span className="block truncate text-xs font-bold text-navy">{t(cat.name, locale)}</span>
                  <span className="mt-0.5 block text-[0.6875rem] font-bold text-text-muted" dir="ltr">
                    {cat.publishedCount} {cat.publishedCount === 0 ? ui("catalog.comingSoon", locale) : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy"
                >{activeCategory ? t(activeCategory.name, locale) : ui("catalog.allProducts", locale)}
              </h2>
            </div>
          </div>
          <p className="mt-2 text-body-sm font-bold text-navy" aria-live="polite">
            {query.trim() !== ""
              ? `${results.length} ${ui("search.results", locale)}`
              : `${ui("catalog.showing", locale)}: ${results.length} / ${published.length}`}
          </p>
          {displayed.length === 0 ? (
            <div className={`mt-8 rounded-card border border-dashed border-border-strong bg-white p-10 text-center ${phase === "enter" ? "filter-enter" : ""}`}>
              <h3 className="text-h3 font-semibold text-navy">{t(c.k17, locale)}</h3>
              <p className="mt-2 text-body text-text-muted">{t(c.k18, locale)}</p>
            </div>
          ) : (
            <div
              data-stagger
              className={`mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 ${phase === "exit" ? "filter-exit" : ""}`}
            >
              {displayed.map((p, i) => (
                <div
                  key={p.id}
                  className={phase === "enter" ? "filter-enter" : ""}
                  style={phase === "enter" ? { animationDelay: `${i * 40}ms` } : undefined}
                >
                  <ProductCard locale={locale} product={p} />
                </div>
              ))}
            </div>
          )}
          <p className="mt-6 text-body-sm font-bold text-navy">{t(siteSettings.inquiryPolicy, locale)}</p>
        </div>
      </section>

      {/* 4.5 CTA banner — flat sky panel + photo */}
      <section data-reveal="scale" className="section-sm bg-white">
        <div className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-card border border-border bg-surface p-8 shadow-card md:grid-cols-[1fr_40%] md:p-10">
            <div>
              <h3 className="text-h2 font-semibold text-navy">{t(c.k19, locale)}</h3>
              <p className="mt-3 max-w-xl text-body text-text-muted">{t(c.k20, locale)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={waLink(WA_MESSAGES.general[locale])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-navy"
                >
                  {ui("cta.whatsapp", locale)}
                </a>
                <Link
                  href={localizedHref(locale, "/contact")}
                  className="btn btn-outline"
                >
                  {locale === "ar" ? "أو أرسل لنا رسالة" : locale === "en" ? "Or send us a message" : "或给我们留言"}
                </Link>
              </div>
            </div>
            <img src={webp("/images/photos/pivot.jpg")} alt={t(c.k19, locale)} loading="lazy" className="h-full min-h-56 w-full rounded-image object-cover" />
          </div>
        </div>
      </section>

      {/* 4.6 Why us — LOUD navy mesh band, glass cards */}
      <section data-reveal="right" className="section bg-mesh-navy">
        <div className="wrap">
          <div data-reveal="fade" className="text-center">
            <div className="mb-4 flex justify-center">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-white">{t(c.k21, locale)}</h2>
          </div>
          <div data-stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((f, i) => (
              <div key={i} className="flex flex-col items-center rounded-card border border-white/15 bg-[#16324F] p-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-white/10 text-white">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-body-sm text-sky-100">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
