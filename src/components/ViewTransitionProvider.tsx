"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * ViewTransitionProvider — route-change transitions for every page.
 *
 * Intercepts same-origin internal link clicks and wraps router.push in
 * document.startViewTransition. The transition itself is CSS-owned
 * (globals.css, Phase 6): a brand curtain wipe — the incoming page is
 * revealed by a 250ms clip-path wipe from the reading-start side with a
 * navy band + red leading edge riding the wipe front — INSTEAD of a
 * bare cut. The wipe and the product-image morph never fight: the
 * morph (`vt-product-img`) is a SEPARATE view-transition group with its
 * own 350ms animation, so it runs concurrently underneath the wipe
 * while the wipe is the curtain over the page swap. Navigation is
 * never delayed: the transition starts immediately on click, the old
 * page stays visible underneath, and the whole swap finishes in
 * ~350ms max. Silent fallback when the API is unsupported or reduced
 * motion is set: plain router.push, no navigation delay (and the
 * reduced-motion CSS rule kills the wipe for automatic transitions
 * from `navigation: auto` too, e.g. back/forward). Back/forward and
 * deep links keep working (they bypass the click interceptor and
 * navigate normally).
 * html[data-navigating] drives the Header's indeterminate progress
 * state; it clears on every pathname change.
 */
export default function ViewTransitionProvider() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.removeAttribute("data-navigating");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset.noVt !== undefined) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same document (anchor jump or identical URL) — let the browser
      // handle it natively; no transition, no interception.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      const go = () => router.push(`${url.pathname}${url.search}${url.hash}`);
      document.documentElement.setAttribute("data-navigating", "");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };
      if (!reduced && typeof doc.startViewTransition === "function") {
        try {
          doc.startViewTransition(() => {
            go();
          });
        } catch {
          go();
        }
      } else {
        go();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
