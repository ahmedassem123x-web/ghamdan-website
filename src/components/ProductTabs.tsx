/**
 * ProductTabs (Phase 2, plan §3 — "Sticky Sections"). Sticky tab bar
 * under the site header for the sections that exist on this product
 * page. IntersectionObserver scroll-spy marks the active tab; clicking
 * a tab scrolls to its section (smooth unless reduced motion is set).
 *
 * Real <button> elements, keyboard accessible, `aria-current="true"` on
 * the active tab. Sections carry `scroll-mt-28` in the page so the
 * sticky header (64px) + this bar never cover the section heading.
 * Transform/opacity only; no motion is essential to the navigation.
 */

"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/perf";
import styles from "./ProductTabs.module.css";

export interface ProductTab {
  id: string;
  label: string;
}

export default function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const reduced = usePrefersReducedMotion();
  const tabKey = tabs.map((tab) => tab.id).join("|");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const tab of tabs) {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  const goTo = (id: string) => {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  if (tabs.length === 0) return null;

  return (
    <nav aria-label="Product sections" data-product-tabs className={styles.bar}>
      <div className={`wrap ${styles.inner}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => goTo(tab.id)}
            aria-current={active === tab.id ? "true" : undefined}
            className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
