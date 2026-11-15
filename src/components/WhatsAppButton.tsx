"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { recordWaClick, waLink } from "@/lib/whatsapp";
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
 * WhatsApp button (v15 design-system §1). Variants are the Button
 * system's WhatsApp / navy / light / outline / text treatments, kept
 * under this component's historic API because callers across the site
 * use it. Tokens (docs/design-tokens.md):
 *  - navy-pill: navy #102B46 fill, white text; hover #0B70C9.
 *  - green-pill: WhatsApp #1D9E44 fill, white text (3.48:1 — flagged,
 *    pre-existing live value, no board HEX; always paired with the glyph).
 *  - white-on-dark: white fill, navy text (on navy panels).
 *  - outlined-blue: 1.5px #0081FB border, #0B70C9 text (AA).
 *  - text-link: #0B70C9 text (AA), underline on hover.
 * Height 48px (md), radius 12px, semibold. Clicks recorded to
 * localStorage — never delivery/read.
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
  const base =
    "inline-flex h-12 items-center justify-center gap-2 rounded-button px-5 font-semibold text-button transition-[color,background-color,border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
  const variants: Record<WaButtonVariant, string> = {
    "navy-pill": "bg-navy text-white hover:bg-primary-hover shadow-card",
    "green-pill": "bg-whatsapp text-white hover:brightness-95 shadow-card",
    "white-on-dark": "bg-white text-navy hover:bg-sky shadow-card",
    "outlined-blue":
      "bg-transparent text-primary-hover border-[1.5px] border-primary hover:bg-sky",
    "text-link": "h-auto bg-transparent px-1 py-1 text-primary-hover hover:underline",
  };
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variants[variant]} ${className}`}
      onClick={() =>
        recordWaClick({
          source,
          sourceId,
          pageUrl: window.location.href,
          locale,
          ctaId: `${source}-${variant}`,
        })
      }
    >
      {icon ?? <MessageCircle className="size-5" strokeWidth={2} aria-hidden="true" />}
      <span>{label}</span>
    </a>
  );
}
