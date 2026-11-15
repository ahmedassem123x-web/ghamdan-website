"use client";

import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/** Floating WhatsApp button: 56px green circle, all public pages.
 * Fill WhatsApp green (token --color-whatsapp, AA);
 * labelled with the localised CTA string, never a bare glyph. */
export default function WhatsAppFloat({ locale }: { locale: Locale }) {
  return (
    <a
      href={waLink(WA_MESSAGES.general[locale])}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ui("cta.whatsapp", locale)}
      className="whatsapp-float fixed bottom-5 end-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
