"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/perf";
import styles from "./WordSwap.module.css";

/**
 * WordSwap — rotating word line under the hero title (plan §6 Morphing
 * Text / Word Swap). The words come from existing data only (the caller
 * passes solution-area pills / category names, localised); nothing is
 * invented here.
 *
 * WORD-level swap only: each entry is a whole word/phrase and is never
 * split — Arabic letter joining is never broken. `aria-live="polite"`
 * announces the change to screen readers. Under `prefers-reduced-motion`
 * the first word is shown statically and the interval never starts.
 * Transform/opacity only (see `WordSwap.module.css`).
 */
export default function WordSwap({ words }: { words: string[] }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reduced, words.length]);

  if (words.length === 0) return null;

  return (
    <p aria-live="polite" className={`${styles.wordSwap} hero__anim`}>
      <span key={index} className={styles.word}>
        {words[index]}
      </span>
    </p>
  );
}
