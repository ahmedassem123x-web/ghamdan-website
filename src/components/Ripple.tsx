import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Shared ripple (Phase 6, plan §13) — one implementation for every
 * WhatsApp CTA and primary button.
 *
 * - `spawnRipple(target, clientX, clientY)`: appends a `.ripple-ink`
 *   span (see globals.css) centred on the pointer position, sized to
 *   cover the host, and removes it when the 550ms expand animation
 *   ends (plus a timeout fallback). Transform/opacity only.
 * - `attachRipple(e)`: React `onPointerDown` handler for elements that
 *   are not covered by MotionProvider's delegated listener (which
 *   handles all `.btn*` + `.whatsapp-float`); give the element the
 *   `.ripple-host` class (position relative + overflow hidden) first.
 *
 * Hosts: `.btn*` get their host styles from the button base in
 * globals.css; `.whatsapp-float` likewise. `currentColor` is the ink
 * colour, so the ripple reads on dark fills (white ink) and on
 * outline buttons (navy ink) alike.
 *
 * Reduced motion: spawning is skipped entirely (the meaning — a
 * pressed button — is unchanged without it). No React state, no
 * client boundary needed: plain functions, safe to import from
 * server components (ui.tsx re-exports both).
 */

const RIPPLE_DURATION_MS = 550;

export function spawnRipple(target: HTMLElement, clientX: number, clientY: number): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = target.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;
  const diameter = Math.max(rect.width, rect.height) * 2.2;
  const ink = document.createElement("span");
  ink.className = "ripple-ink";
  ink.setAttribute("aria-hidden", "true");
  ink.style.width = `${diameter}px`;
  ink.style.height = `${diameter}px`;
  ink.style.left = `${clientX - rect.left}px`;
  ink.style.top = `${clientY - rect.top}px`;
  const remove = () => ink.remove();
  ink.addEventListener("animationend", remove, { once: true });
  window.setTimeout(remove, RIPPLE_DURATION_MS + 150);
  target.appendChild(ink);
}

/** React pointerdown handler — attach as `onPointerDown={attachRipple}`. */
export function attachRipple(e: ReactPointerEvent<HTMLElement>): void {
  if (e.pointerType === "mouse" && e.button !== 0) return;
  const target = e.currentTarget;
  if ((target as unknown as { disabled?: boolean }).disabled) return;
  spawnRipple(target, e.clientX, e.clientY);
}
