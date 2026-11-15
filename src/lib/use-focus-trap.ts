"use client";

import { useEffect, type RefObject } from "react";

/**
 * Focus trap for modal dialogs (lightboxes). Same pattern as the mobile
 * drawer in Header.tsx: move focus to the first control on open, keep
 * Tab inside the dialog, restore focus to the opener on close.
 * Escape handling stays with the dialog itself.
 */
export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const first = el.querySelector<HTMLElement>("a[href], button:not([disabled])");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [active, ref]);
}
