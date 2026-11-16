"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/whatsapp";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { ui } from "@/lib/ui-copy";
import LottieIcon from "@/components/LottieIcon";
import type { Locale } from "@/data";

/** Floating WhatsApp button: 56px green circle, all public pages.
 * Fill WhatsApp green (token --color-whatsapp, AA); soft blue glow
 * (`shadow-glow-blue`), no aggressive pulse; labelled with the
 * localised CTA string, never a bare glyph.
 *
 * Phase 6 (§11): a small sun Lottie badge in the corner that plays
 * ONCE, ~1.2s after mount — never competing with first paint, never
 * looping, never obscuring the WhatsApp glyph (the glyph stays the
 * affordance; the sun is a decorative solar wink). LottieIcon
 * lazy-loads lottie-web (deferred, cached) and shows the first frame
 * statically under reduced motion; a failed load renders nothing.
 * The pointerdown ripple comes from MotionProvider's shared listener
 * (`.whatsapp-float` host, overflow hidden in globals.css). */
export default function WhatsAppFloat({ locale }: { locale: Locale }) {
  const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowBadge(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <a
      href={waLink(WA_MESSAGES.general[locale])}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ui("cta.whatsapp", locale)}
      className="whatsapp-float fixed bottom-5 end-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float shadow-glow-blue transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <WhatsAppIcon className="size-7" aria-hidden="true" />
      {showBadge && (
        <span aria-hidden="true" className="pointer-events-none absolute start-1 top-1">
          <LottieIcon name="sun" loop={false} className="size-[18px]" />
        </span>
      )}
    </a>
  );
}
