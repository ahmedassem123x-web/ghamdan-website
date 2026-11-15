"use client";

import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export type WaButtonVariant =
  | "navy-pill"
  | "green-pill"
  | "white-on-dark"
  | "outlined-blue"
  | "text-link";

export interface WaButtonProps {
  locale: Locale;
  message: string;
  label: string;
  /** Analytics source: "header" | "product" | "system" | "hero" | "cta" | "footer" | "contact" | "float" | "sticky" | "drawer" */
  source: string;
  sourceId?: string;
  variant?: WaButtonVariant;
  className?: string;
  icon?: ReactNode;
}

/**
 * WhatsApp button (v15 design-system §1, Variant A rebind). The historic
 * variant names are kept so every caller works unchanged; each now maps
 * to the shared button system (built by the design-system worker in
 * globals.css):
 *  - navy-pill: `.btn .btn-navy` — navy fill, white text.
 *  - green-pill: `.btn .btn-whatsapp` — WhatsApp #157A35 fill, white text
 *    (5.43:1, AA — darkened 2026-11-15 from #1D9E44 3.48:1; always paired
 *    with the glyph). Rule: green = WhatsApp always; navy = internal
 *    navigation only.
 *  - white-on-dark: `.btn .btn-white` — white fill, navy text (on navy panels).
 *  - outlined-blue: `.btn .btn-outline-blue` — 1px brand-blue border,
 *    #0B70C9 text (AA).
 *  - text-link: #0B70C9 text (AA), underline on hover — no `.btn` class
 *    (no button chrome by design).
 * Height 48px (md), radius 12px, semibold — owned by `.btn`.
 */
export default function WhatsAppButton({
  locale,
  message,
  label,
  source,
  sourceId = "",
  variant = "navy-pill",
  className = "",
  icon,
}: WaButtonProps) {
  const variants: Record<WaButtonVariant, string> = {
    "navy-pill": "btn btn-navy",
    "green-pill": "btn btn-whatsapp",
    "white-on-dark": "btn btn-white",
    "outlined-blue": "btn btn-outline-blue",
    "text-link": "inline-flex h-auto items-center justify-center gap-2 whitespace-nowrap bg-transparent px-1 py-1 font-semibold text-button text-primary-hover transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  };
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variants[variant]} transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {icon ?? <WhatsAppIcon className="size-5" aria-hidden="true" />}
      <span>{label}</span>
    </a>
  );
}
