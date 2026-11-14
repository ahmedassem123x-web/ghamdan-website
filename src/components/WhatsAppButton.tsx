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

/** WhatsApp button (BUILD_SPEC §2.6). Clicks recorded to localStorage — never delivery/read. */
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
    "inline-flex items-center justify-center gap-2 rounded-[0.625rem] font-bold text-button transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
  const variants: Record<WaButtonVariant, string> = {
    "navy-pill": "bg-primary text-white px-5 py-2.5 hover:bg-primary-deep shadow-card",
    "green-pill": "bg-whatsapp text-white px-5 py-2.5 hover:brightness-95 shadow-card",
    "white-on-dark": "bg-white text-primary px-5 py-2.5 hover:bg-surface-muted shadow-card",
    "outlined-blue": "bg-transparent text-accent border-2 border-accent px-5 py-2.5 hover:bg-accent-soft",
    "text-link": "bg-transparent text-accent px-1 py-1 hover:underline",
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
