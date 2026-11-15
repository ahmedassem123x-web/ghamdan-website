"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import ProductCard, { HighlightWords } from "@/components/ProductCard";
import CTABand from "@/components/CTABand";
import { SearchInput } from "@/components/ui";
import { pages, products, categories, solutionAreas, bundles } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/** Search page: client-side search across products, categories, solutions and systems. Initial query comes from ?q= (catalogue search submit). */
export default function SearchClient({ locale }: { locale: Locale }) {
  const s = pages.search;
  const [query, setQuery] = useState("");

  // Read ?q= on mount (static export: no server searchParams at runtime).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return { products: [], categories: [], solutions: [], systems: [] };
    const match = (hay: string) => hay.toLowerCase().includes(q);
    return {
      products: products.filter(
        (p) =>
          p.status === "published" &&
          match(`${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${typeof p.model === "string" ? p.model : `${p.model.ar} ${p.model.en ?? ""}`} ${p.subcategory.ar}`),
      ),
      categories: categories.filter((c) => match(`${t(c.name, locale)} ${t(c.note ?? { ar: "" }, locale)}`)),
      solutions: solutionAreas.filter((a) => match(`${t(a.title, locale)} ${t(a.text, locale)}`)),
      systems: bundles.filter((b) => b.status === "confirmed" && match(`${t(b.name, locale)} ${t(b.use, locale)}`)),
    };
  }, [query, locale]);

  const total = results.products.length + results.categories.length + results.solutions.length + results.systems.length;
  const searched = query.trim().length >= 2;

  return (
    <>
      <Hero
        locale={locale}
        variant="plain"
        title={{ ar: "ابحث في منتجات وحلول غمدان", en: "Search Ghamdan products and solutions", zh: "搜索 Ghamdan 产品与方案" }}
        whatsapp={false}
      />
      {/* Big search field on a light mesh band */}
      <section data-reveal="up" className="section bg-mesh-light">
        <div className="wrap max-w-4xl">
          <p data-reveal="fade" className="mb-5 text-center text-body text-text-muted">{t(s.k2, locale)}</p>
          <div data-reveal="scale" className="flex items-center gap-3 rounded-card bg-white p-3 shadow-card">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">
              <SearchIcon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <SearchInput value={query} onChange={setQuery} placeholder={ui("search.placeholder", locale)} label={ui("search.title", locale)} />
            </div>
          </div>

          {searched && (
            <p data-reveal="fade" className="mt-6 text-body-sm text-text-muted" aria-live="polite">
              {total === 0
                ? `${t(s.k3, locale)} «${query.trim()}» — ${t(s.k4, locale)}`
                : `${total} ${ui("search.results", locale)}`}
            </p>
          )}

          {searched && total > 0 && (
            <div key={query.trim()} data-stagger className="mt-8 space-y-10">
              {results.products.length > 0 && (
                <section className="search-enter">
                  <div data-reveal="fade">
                    <div className="mb-4">
                      <span className="section-marker" aria-hidden="true" />
                    </div>
                    <h2 className="text-h3 font-semibold text-navy">{ui("nav.products", locale)}</h2>
                  </div>
                  <div data-stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.products.map((p, i) => (
                      <div key={p.id} className="search-enter" style={{ animationDelay: `${i * 25}ms` }}>
                        <ProductCard locale={locale} product={p} highlight={query} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {results.categories.length > 0 && (
                <section className="search-enter" style={{ animationDelay: "25ms" }}>
                  <h2 className="text-h3 font-semibold text-navy">{ui("footer.categories", locale)}</h2>
                  <ul data-stagger className="mt-4 divide-y divide-border rounded-card border border-border bg-white shadow-card">
                    {results.categories.map((c) => (
                      <li key={c.id}>
                        <Link href={localizedHref(locale, `/products/category/${c.id}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">
                            <HighlightWords text={t(c.name, locale)} query={query} />
                          </span>
                          <ArrowIcon className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {results.solutions.length > 0 && (
                <section className="search-enter" style={{ animationDelay: "50ms" }}>
                  <h2 className="text-h3 font-semibold text-navy">{ui("nav.solutions", locale)}</h2>
                  <ul data-stagger className="mt-4 divide-y divide-border rounded-card border border-border bg-white shadow-card">
                    {results.solutions.map((a) => (
                      <li key={a.id}>
                        <Link href={localizedHref(locale, `/solutions/${a.id}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">
                            <HighlightWords text={t(a.title, locale)} query={query} />
                          </span>
                          <ArrowIcon className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {results.systems.length > 0 && (
                <section className="search-enter" style={{ animationDelay: "75ms" }}>
                  <h2 className="text-h3 font-semibold text-navy">{ui("nav.systems", locale)}</h2>
                  <ul data-stagger className="mt-4 divide-y divide-border rounded-card border border-border bg-white shadow-card">
                    {results.systems.map((b) => (
                      <li key={b.id}>
                        <Link href={localizedHref(locale, `/systems/${b.slug}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">
                            <HighlightWords text={t(b.name, locale)} query={query} />
                          </span>
                          <ArrowIcon className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </section>

      {/* LOUD navy closing band — reuses the search page's own copy */}
      <CTABand locale={locale} variant="split" title={s.k1} text={s.k2} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
    </>
  );
}
