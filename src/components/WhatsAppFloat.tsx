"use client";

import { MessageCircle } from "lucide-react";
import { recordWaClick, waLink } from "@/lib/whatsapp";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

/** Floating WhatsApp button (BUILD_SPEC §2.10): 56px green circle, all public pages. */
export default function WhatsAppFloat({ locale }: { locale: Locale }) {
  return (
    <a
      href={waLink(WA_MESSAGES.general[locale])}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float transition-transform duration-200 hover:scale-105"
      onClick={() =>
        recordWaClick({
          source: "float",
          sourceId: "",
          pageUrl: window.location.href,
          locale,
          ctaId: "float-green",
        })
      }
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
