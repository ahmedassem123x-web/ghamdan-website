import type { ReactNode } from "react";
import { GradientWord } from "@/components/ui";

/**
 * Wrap the FIRST whole-word occurrence of `word` in `title` with
 * <GradientWord> (Phase 6 brand gradient, red -> blue).
 *
 * Mirrors ui.tsx's private renderTitleWithHighlight (same contract, kept
 * importable for pages whose headings are inline <h2>s rather than
 * <SectionHeading>): split on whitespace only, never inside a word, so
 * Arabic letters stay connected. A title with no whole-word match — e.g.
 * a spaceless ZH string — renders unchanged, and at most one word per
 * heading is ever highlighted.
 */
export function withGradientWord(title: string, word: string): ReactNode {
  const parts = title.split(/(\s+)/);
  let done = false;
  return parts.map((part, i) => {
    if (!done && part === word) {
      done = true;
      return <GradientWord key={i}>{part}</GradientWord>;
    }
    return <span key={i}>{part}</span>;
  });
}
