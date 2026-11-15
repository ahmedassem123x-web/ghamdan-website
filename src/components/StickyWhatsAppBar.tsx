"use client";

import { MessageCircle } from "lucide-react";
import { recordWaClick, waLink } from "@/lib/whatsapp";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/**
 * Sticky mobile WhatsApp bar: below md, product/system pages only,
 * 64px + safe-area. Hidden on desktop; never covers footer actions.
 * Shows the product/system name + green WhatsApp button.
 * Fill #1D9E44 (flagged 3.48:1 — pre-existing live value, no board HEX).
 */
export default function StickyWhatsAppBar({
  locale,
  message,
  labelKey = "cta.enquire",
  name,
}: {
  locale: Locale;
  message: string;
  labelKey?: string;
  name?: string;
}) {
  return (
    <div className="sticky-whatsapp-bar fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-16 items-center justify-center gap-3 bg-whatsapp px-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        onClick={() =>
          recordWaClick({
            source: "sticky",
            sourceId: "",
            pageUrl: window.location.href,
            locale,
            ctaId: "sticky-green",
          })
        }
      >
        {name && <span className="max-w-[55%] truncate text-sm font-semibold opacity-90">{name}</span>}
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="size-5" strokeWidth={2} aria-hidden="true" />
          {ui(labelKey, locale)}
        </span>
      </a>
    </div>
  );
}
