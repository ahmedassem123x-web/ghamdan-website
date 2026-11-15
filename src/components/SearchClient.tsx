"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Hero from "@/components/Hero";
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
          match(`${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${p.model} ${p.subcategory.ar}`),
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
      <Hero locale={locale} variant="plain" title={s.k1} text={s.k2} whatsapp={false} />
      <section className="section">
        <div className="wrap max-w-4xl">
          <SearchInput value={query} onChange={setQuery} placeholder={ui("search.placeholder", locale)} label={ui("search.title", locale)} />

          {searched && (
            <p className="mt-6 text-body-sm text-text-muted" aria-live="polite">
              {total === 0
                ? `${t(s.k3, locale)} «${query.trim()}» — ${t(s.k4, locale)}`
                : `${total} ${ui("search.results", locale)}`}
            </p>
          )}

          {searched && total > 0 && (
            <div className="mt-8 space-y-10">
              {results.products.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold text-navy">{ui("nav.products", locale)}</h2>
                  <ul className="mt-4 divide-y divide-border rounded-card border border-border bg-surface">
                    {results.products.map((p) => (
                      <li key={p.id}>
                        <Link href={localizedHref(locale, `/products/${p.slug}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span>
                            <span className="block font-bold text-navy">{t(p.name, locale)}</span>
                            <span className="text-body-sm text-text-muted" dir="ltr">{p.brand} — {p.model}</span>
                          </span>
                          <ArrowLeft className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {results.categories.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold text-navy">{ui("footer.categories", locale)}</h2>
                  <ul className="mt-4 divide-y divide-border rounded-card border border-border bg-surface">
                    {results.categories.map((c) => (
                      <li key={c.id}>
                        <Link href={localizedHref(locale, `/products/category/${c.id}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">{t(c.name, locale)}</span>
                          <ArrowLeft className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {results.solutions.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold text-navy">{ui("nav.solutions", locale)}</h2>
                  <ul className="mt-4 divide-y divide-border rounded-card border border-border bg-surface">
                    {results.solutions.map((a) => (
                      <li key={a.id}>
                        <Link href={localizedHref(locale, `/solutions/${a.id}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">{t(a.title, locale)}</span>
                          <ArrowLeft className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {results.systems.length > 0 && (
                <section>
                  <h2 className="text-h3 font-semibold text-navy">{ui("nav.systems", locale)}</h2>
                  <ul className="mt-4 divide-y divide-border rounded-card border border-border bg-surface">
                    {results.systems.map((b) => (
                      <li key={b.id}>
                        <Link href={localizedHref(locale, `/systems/${b.slug}`)} className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-muted">
                          <span className="font-bold text-navy">{t(b.name, locale)}</span>
                          <ArrowLeft className="size-4 shrink-0 text-primary-hover rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
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
    </>
  );
}
