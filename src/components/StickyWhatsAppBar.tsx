"use client";

import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/whatsapp";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/**
 * Sticky mobile WhatsApp bar: below md, product/system pages only,
 * 64px + safe-area. Hidden on desktop; never covers footer actions.
 * Shows the product/system name + green WhatsApp button
 * (`.btn-whatsapp` fill, token --color-whatsapp, AA).
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
    <div className="sticky-whatsapp-bar fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] shadow-card-hover md:hidden">
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp flex h-16 items-center justify-center gap-3 rounded-none px-4 font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {name && <span className="max-w-[55%] truncate text-sm font-semibold opacity-90">{name}</span>}
        <span className="inline-flex items-center gap-2">
          <WhatsAppIcon className="size-5" aria-hidden="true" />
          {ui(labelKey, locale)}
        </span>
      </a>
    </div>
  );
}
