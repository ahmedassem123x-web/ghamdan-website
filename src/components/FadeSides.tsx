"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/data";

/**
 * Fade In Left / Right for alternating image/text rows (plan §1), RTL-aware.
 *
 * The first child enters from the inline-start side, the second from the
 * inline-end side — so in Arabic (RTL) the directions mirror correctly,
 * while in English/Chinese they run the other way. Word/line-level text
 * is untouched (no letter splitting — Arabic shaping is preserved).
 *
 * Transform/opacity only, 300ms ease-out, second half delayed 80ms.
 * SSR-safe: content renders visible in the initial HTML; the hidden
 * state is applied only after mount (and only when the row is actually
 * below the viewport), so no-JS / failed-JS / reduced-motion readers
 * always see the content.
 */
export default function FadeSides({
  locale,
  className,
  children,
}: {
  locale: Locale;
  className?: string;
  children: [ReactNode, ReactNode];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rtl = locale === "ar";
  // Inline-start side enters from the inline-start direction: +x in RTL,
  // -x in LTR. Inline-end side mirrors it.
  const fromStart = rtl ? 24 : -24;
  const fromEnd = -fromStart;
  const hidden = mounted && !inView;

  const half = (offset: number, delay: number): React.CSSProperties => ({
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translateX(${offset}px)` : "translateX(0)",
    transition: "opacity 300ms ease-out, transform 300ms ease-out",
    transitionDelay: hidden ? "0ms" : `${delay}ms`,
  });

  return (
    <div ref={ref} className={className}>
      <div style={half(fromStart, 0)}>{children[0]}</div>
      <div style={half(fromEnd, 80)}>{children[1]}</div>
    </div>
  );
}
