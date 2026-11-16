"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import WhatsAppButton from "./WhatsAppButton";
import { topSpecs } from "./ProductCard";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { Locale, Product } from "@/data";

/**
 * QuickView — Phase 3 (§4 Card Reveal / §9 Scale In modal): "عرض سريع"
 * dialog with the product image, name, top specs and a WhatsApp CTA.
 * Reuses the lightbox conventions from Gallery: `.lightbox` backdrop
 * fade (200ms ease-out), `.lightbox--closing` exit (150ms), focus trap
 * via useFocusTrap (focus in, Tab trapped, focus restored to the opener
 * on close), Escape + backdrop click to close, body scroll lock.
 * No prices, no invented content — specs come from topSpecs() (the same
 * confirmed specs ProductCard shows).
 */
export default function QuickView({
  locale,
  product,
  onClose,
}: {
  locale: Locale;
  product: Product | null;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const open = product !== null;
  useFocusTrap(open, dialogRef);

  const close = () => {
    if (!open || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  if (!product) return null;

  const name = t(product.name, locale);
  const model = typeof product.model === "string" ? product.model : t(product.model, locale);
  const img = product.image ?? "";
  const benefit = product.benefits?.[0] ? t(product.benefits[0], locale) : "";
  const specs = topSpecs(product);
  const siteUrl = `https://ghamdan-website.vercel.app/${locale}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, model, siteUrl)[locale];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className={`lightbox fixed inset-0 z-[80] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm ${
        closing ? "lightbox--closing" : ""
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="search-enter relative w-full max-w-lg overflow-hidden rounded-card bg-white shadow-float">
        <button
          type="button"
          onClick={close}
          aria-label={ui("nav.close", locale)}
          className="absolute top-3 end-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-navy/70 text-white transition-colors duration-200 hover:bg-navy focus-visible:outline-2 focus-visible:outline-white"
        >
          <CloseIcon className="size-5" aria-hidden="true" />
        </button>
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
          {img ? (
            <img src={webp(img)} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-muted">
              <span className="font-latin text-4xl font-extrabold text-primary" dir="ltr">
                {product.brand?.slice(0, 2).toUpperCase() ?? "G"}
              </span>
            </div>
          )}
          {product.brand && (
            <span className="absolute top-3 start-3 rounded-full bg-sky px-3 py-1 text-xs font-bold text-navy shadow-card" dir="ltr">
              {product.brand}
            </span>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="text-h3 font-semibold text-navy">{name}</h3>
          {model && (
            <p className="mt-1 text-body-sm font-bold text-text-muted" dir="ltr">
              {model}
            </p>
          )}
          {benefit && <p className="mt-2 text-body-sm text-text-muted">{benefit}</p>}
          {specs.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
              {specs.map((s, i) => (
                <li key={i} className="flex items-baseline justify-between gap-3 text-caption">
                  <span className="font-bold text-navy">{t(s.label, locale)}</span>
                  <span className="text-text-muted">{typeof s.value === "string" ? s.value : t(s.value, locale)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <WhatsAppButton
              locale={locale}
              message={waMsg}
              label={ui("cta.enquire", locale)}
              source="quick-view"
              sourceId={product.id}
              variant="green-pill"
            />
            <Link href={localizedHref(locale, `/products/${product.slug}`)} onClick={close} className="btn btn-outline">
              {ui("cta.details", locale)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
