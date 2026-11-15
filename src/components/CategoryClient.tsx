"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Info } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ResultMeta, SearchInput, SortSelect } from "@/components/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale, Product } from "@/data";

const PAGE_SIZE = 12;

/**
 * Category filter + grid (§3.8.3–§3.8.5): type/brand selects + search, sort,
 * 4-col grid, 12 per page. Filters are reflected in the URL (?brand=&type=&q=)
 * via history.replaceState so they are shareable.
 */
export default function CategoryClient({
  locale,
  categoryId,
  initial,
}: {
  locale: Locale;
  categoryId: string;
  initial: Product[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Read ?brand=&type=&q= on mount (static export: no server searchParams).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("brand")) setBrand(sp.get("brand")!);
    if (sp.get("type")) setType(sp.get("type")!);
    if (sp.get("q")) setQuery(sp.get("q")!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync (shareable, indexable).
  useEffect(() => {
    const sp = new URLSearchParams();
    if (brand !== "all") sp.set("brand", brand);
    if (type !== "all") sp.set("type", type);
    if (query.trim() !== "") sp.set("q", query.trim());
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [brand, type, query]);

  const types = useMemo(() => [...new Set(initial.map((p) => t(p.subcategory, locale)))], [initial, locale]);
  const brands = useMemo(() => [...new Set(initial.map((p) => p.brand))].sort(), [initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = initial.filter((p) => {
      if (type !== "all" && t(p.subcategory, locale) !== type) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (!q) return true;
      return `${p.name.ar} ${p.name.en ?? ""} ${p.brand} ${p.model}`.toLowerCase().includes(q);
    });
    if (sort === "name") list = [...list].sort((a, b) => t(a.name, locale).localeCompare(t(b.name, locale)));
    return list;
  }, [initial, query, type, brand, sort, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const resetPage = () => setPage(1);

  return (
    <div>
      {/* 8.3 Filter bar */}
      <div className="flex flex-col gap-4 rounded-card bg-surface-muted p-5 lg:flex-row lg:items-center">
        <p className="flex shrink-0 items-center gap-2 font-bold text-navy">
          <Filter className="size-5 text-primary-hover" aria-hidden="true" />
          {ui("catalog.filter", locale)}
        </p>
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              resetPage();
            }}
            placeholder={ui("catalog.searchPh", locale)}
            label={ui("catalog.searchPh", locale)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-bold text-text-muted">
            <span>{ui("catalog.type", locale)}</span>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                resetPage();
              }}
              className="rounded-[0.625rem] border border-border bg-surface px-3 py-2.5 text-body-sm font-bold text-navy focus:border-primary-hover focus:outline-none"
            >
              <option value="all">{ui("catalog.allTypes", locale)}</option>
              {types.map((ty) => (
                <option key={ty} value={ty}>
                  {ty}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-text-muted">
            <span>{ui("catalog.brand", locale)}</span>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                resetPage();
              }}
              className="rounded-[0.625rem] border border-border bg-surface px-3 py-2.5 text-body-sm font-bold text-navy focus:border-primary-hover focus:outline-none"
            >
              <option value="all">{ui("catalog.allBrands", locale)}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
          <SortSelect
            value={sort}
            onChange={(v) => {
              setSort(v);
              resetPage();
            }}
            label={ui("catalog.sortBy", locale)}
            options={[
              { value: "newest", label: ui("catalog.newest", locale) },
              { value: "name", label: ui("catalog.nameAZ", locale) },
            ]}
          />
        </div>
      </div>

      {/* 8.4 Result meta */}
      <div className="mt-6">
        <ResultMeta shown={pageItems.length} total={filtered.length} label={ui("catalog.showing", locale)} />
      </div>

      {/* 8.5 Product grid (4-col, 12/page) */}
      {pageItems.length === 0 ? (
        <div className="mt-8">
          {/* Honest empty state — inlined (visible by default) instead of the
              shared EmptyState (Phase 6 removed the .reveal hiding from the
              shared primitives; this page keeps its inline state). */}
          <div className="rounded-card border border-dashed border-border-strong bg-surface p-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
              <Info className="size-8" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-h3 font-semibold text-navy">{ui("catalog.noProducts", locale)}</h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <WhatsAppButton locale={locale} message={WA_MESSAGES.general[locale]} label={ui("cta.whatsappStart", locale)} source="category" variant="green-pill" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.map((p) => (
            <ProductCard key={p.id} locale={locale} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2" role="navigation" aria-label="Pagination">
          {page > 1 && (
            <button type="button" onClick={() => setPage(page - 1)} className="rounded-[0.625rem] border border-border bg-surface px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
              {locale === "ar" ? "→" : "←"}
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === safePage ? "page" : undefined}
              className={`inline-flex size-10 items-center justify-center rounded-[0.625rem] text-sm font-bold transition-colors ${
                n === safePage ? "bg-navy text-white" : "border border-border bg-surface text-navy hover:border-primary-hover hover:text-primary-hover"
              }`}
            >
              {n}
            </button>
          ))}
          {page < totalPages && (
            <button type="button" onClick={() => setPage(page + 1)} className="rounded-[0.625rem] border border-border bg-surface px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
              {locale === "ar" ? "←" : "→"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
