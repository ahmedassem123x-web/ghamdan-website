/**
 * ScrambleValue (Phase 2, plan §6 — "Text Scramble / Glitch", used with
 * care). A spec value that contains Latin digits scrambles those digits
 * briefly when it first enters the viewport, then settles on the TRUE
 * value from the product data.
 *
 * Rules honoured:
 * - Latin digits only: only [0-9] characters ever change; Arabic text,
 *   units and punctuation are rendered verbatim from the first paint.
 * - Values with no digits render as-is (no animation at all).
 * - Runs once (IntersectionObserver disconnects after the first entry).
 * - Fully disabled under `prefers-reduced-motion`: the true value is
 *   shown immediately, with no observer and no animation frames.
 * - Progressive enhancement: the true value is in the initial HTML, so
 *   with JS disabled the correct value is simply shown.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/perf";

const DIGITS = "0123456789";
const DURATION_MS = 900; // slowed 600 -> 900ms (Worker A 2026-11-16) so the digit scramble is actually visible before it settles

export default function ScrambleValue({ value }: { value: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(value);
  const hasDigits = /[0-9]/.test(value);

  // Start once, on first viewport entry.
  useEffect(() => {
    if (!hasDigits || reduced) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasDigits, reduced]);

  // Scramble pass: digit positions show random digits until they settle
  // left-to-right; every other character is the true value throughout.
  useEffect(() => {
    if (!started || reduced) {
      setDisplay(value);
      return;
    }
    const digitPositions: number[] = [];
    value.split("").forEach((ch, i) => {
      if (/[0-9]/.test(ch)) digitPositions.push(i);
    });
    if (digitPositions.length === 0) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      const settled = Math.floor(p * digitPositions.length);
      const chars = value.split("");
      digitPositions.forEach((pos, k) => {
        if (k < settled) return;
        chars[pos] = DIGITS[Math.floor(Math.random() * DIGITS.length)];
      });
      setDisplay(chars.join(""));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, reduced]);

  return <span ref={ref}>{display}</span>;
}
