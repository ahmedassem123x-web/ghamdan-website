"use client";

import { useState } from "react";
import type { Locale } from "@/data";

/**
 * Marquee strip (home §1.4): navy band, CSS keyframes only.
 * Stops on :hover / :focus-within (CSS) and via the stop button
 * (aria-pressed, visible on mobile too). Reduced motion stops it
 * already (globals.css). The track itself is aria-hidden decoration;
 * the button sits outside it.
 */
export default function Marquee({ locale, words }: { locale: Locale; words: string[] }) {
  const [paused, setPaused] = useState(false);
  const pauseLabel =
    locale === "ar" ? "إيقاف الحركة" : locale === "en" ? "Pause motion" : "暂停滚动";
  const playLabel =
    locale === "ar" ? "تشغيل الحركة" : locale === "en" ? "Resume motion" : "恢复滚动";
  return (
    <div className={`marquee relative overflow-hidden bg-navy py-4 text-white ${paused ? "marquee--paused" : ""}`}>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((dup) => (
          <span key={dup} className="flex shrink-0 items-center">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6 text-lg font-extrabold">{w}</span>
                <span className="text-primary-hover">—</span>
              </span>
            ))}
          </span>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={paused ? playLabel : pauseLabel}
        onClick={() => setPaused((v) => !v)}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
      >
        {paused ? "▶" : "❚❚"}
        <span className="sr-only">{paused ? playLabel : pauseLabel}</span>
      </button>
    </div>
  );
}
