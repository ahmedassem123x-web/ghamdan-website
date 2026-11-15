"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import Wordmark from "./Wordmark";
import LanguageSelector from "./LanguageSelector";
import WhatsAppButton from "./WhatsAppButton";
import { MegaMenu, ProductsAccordion } from "./MegaMenu";
import { localizedHref, localeDir } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.products", href: "/products" },
  { key: "nav.solutions", href: "/solutions" },
  { key: "nav.systems", href: "/systems" },
  { key: "nav.projects", href: "/projects" },
  { key: "nav.contact", href: "/contact" },
] as const;

const DRAWER_LINKS = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  // Products is rendered as the ProductsAccordion (All Products first +
  // the 8 categories), not as a plain link — see drawer below.
  { key: "nav.solutions", href: "/solutions" },
  { key: "nav.systems", href: "/systems" },
  { key: "nav.projects", href: "/projects" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.services", href: "/services" },
  { key: "nav.agencies", href: "/agencies" },
  { key: "nav.news", href: "/news" },
] as const;

/** Header (v15 design-system §4): always opaque white, sticky.
 * C-1 fix 2026-11-14, kept: the header used to go transparent over photo
 * heroes, but the hero sits BELOW the header in flow, so at scroll 0 the
 * transparent header showed the white page background and the white
 * wordmark/nav were invisible. Solid white from first paint; scrolling
 * only adds the shadow and compacts the height (76px -> 64px desktop).
 * Reintroduce transparency only if a hero is ever pulled under the header.
 * Nav: 7 items, 15px semibold navy; active = #0B70C9 (AA) + aria-current.
 * Products opens the MegaMenu (hover / click / ArrowDown / Escape). */
export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaClosing, setMegaClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const megaTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll progress bar (3px, blue->red, reading-start origin): CSS
  // scroll-driven animation first (globals.css); JS fallback below when
  // animation-timeline is unsupported. Hidden under reduced motion.
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")) return;
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mega menu close with a 150ms exit (faster than the 180ms enter):
  // keep it mounted with .mega-menu--closing, then unmount.
  const closeMega = useCallback(() => {
    if (!megaOpen) return;
    if (megaTimer.current !== null) window.clearTimeout(megaTimer.current);
    setMegaClosing(true);
    megaTimer.current = window.setTimeout(() => {
      setMegaOpen(false);
      setMegaClosing(false);
      megaTimer.current = null;
    }, 150);
  }, [megaOpen]);

  const openMega = useCallback(() => {
    if (megaTimer.current !== null) {
      window.clearTimeout(megaTimer.current);
      megaTimer.current = null;
    }
    setMegaClosing(false);
    setMegaOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      if (megaTimer.current !== null) window.clearTimeout(megaTimer.current);
    };
  }, []);

  // Close the mega menu on route change.
  useEffect(() => {
    setMegaOpen(false);
    setMegaClosing(false);
  }, [pathname]);

  // Drawer: Escape to close + body scroll lock + focus trap + focus
  // restore to the menu button on close (same pattern as useFocusTrap).
  useEffect(() => {
    if (!drawerOpen) return;
    const opener = menuBtnRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const firstLink = drawerRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [drawerOpen]);

  const dir = localeDir(locale);
  const drawerHidden = dir === "rtl" ? "translate-x-full" : "-translate-x-full";

  const isActive = (href: string) => {
    const p = pathname.replace(/^\/(ar|en|zh)/, "") || "/";
    if (href === "/") return p === "/";
    return p === href || p.startsWith(`${href}/`);
  };

  const closeMegaAndFocusTrigger = () => {
    closeMega();
    productsBtnRef.current?.focus();
  };

  return (
    <>
      {/* Scroll progress bar: fixed top, no layout shift; indeterminate
          while navigating (html[data-navigating]); hidden reduced-motion. */}
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      {/* site-header--intro: one-time load fade, animated once by
          MotionProvider (GSAP fromTo opacity/y, module-guarded so it never
          replays on route change). It owns no visual property that
          .site-header--scrolled touches (background/shadow only). */}
      <header
        className={`site-header site-header--intro sticky top-0 z-50 border-b border-border bg-surface ${scrolled ? "site-header--scrolled" : ""}`}
        onMouseLeave={() => closeMega()}
      >
        <div
          className={`wrap flex items-center justify-between gap-2 lg:gap-4 ${scrolled ? "h-16 lg:h-16" : "h-16 lg:h-[76px]"}`}
        >
          <Wordmark locale={locale} variant="light" />
          {/* Desktop nav — D-12 fix 2026-11-15: EN "Ready-made Systems"
              wrapped to 2 lines at 1440px. The AR label "الأنظمة الجاهزة"
              means exactly that, so the label is NOT shortened; instead each
              item is whitespace-nowrap and the gap tightens below xl. */}
          <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV_ITEMS.map((item) => {
              if (item.key === "nav.products") {
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => openMega()}
                  >
                    {/* Click always OPENS: hover (onMouseEnter above) already
                        opens the menu, so a toggling click would close what
                        hover just opened — the first click looked dead and a
                        second click was needed to reopen it. Closing stays
                        via mouse-leave, Escape, link click, route change. */}
                    <button
                      ref={productsBtnRef}
                      type="button"
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      aria-controls="mega-menu"
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => openMega()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          openMega();
                          document
                            .querySelector<HTMLElement>("#mega-menu a[href]")
                            ?.focus();
                        }
                        if (e.key === "Escape") closeMegaAndFocusTrigger();
                      }}
                      className={`relative inline-flex min-h-11 items-center gap-1 whitespace-nowrap border-b-2 text-nav font-semibold transition-colors ${
                        isActive(item.href) || megaOpen
                          ? "border-primary text-primary-hover"
                          : "border-transparent text-navy hover:border-primary/40 hover:text-primary-hover"
                      }`}
                    >
                      {ui(item.key, locale)}
                      <ChevronDownIcon
                        className={`size-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={localizedHref(locale, item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative inline-flex min-h-11 items-center whitespace-nowrap border-b-2 text-nav font-semibold transition-colors ${
                    isActive(item.href)
                      ? "border-primary text-primary-hover"
                      : "border-transparent text-navy hover:border-primary/40 hover:text-primary-hover"
                  }`}
                >
                  {ui(item.key, locale)}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {/* Language switch lives in the drawer below sm (header row cannot fit wordmark + selector + burger at 360px) */}
            <div className="hidden sm:block">
              <LanguageSelector locale={locale} />
            </div>
            <div className="hidden md:block">
              <WhatsAppButton
                locale={locale}
                message={WA_MESSAGES.general[locale]}
                label={ui("cta.whatsapp", locale)}
                source="header"
                variant="green-pill"
              />
            </div>
            <button
              ref={menuBtnRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-button text-navy transition-colors hover:bg-sky lg:hidden"
              aria-label={ui("nav.menu", locale)}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* Mega menu: full-width panel anchored to the header (not the nav
            item), so it spans the container; hover intent is owned by the
            header's onMouseLeave + the trigger's onMouseEnter above. */}
        <MegaMenu
          locale={locale}
          open={megaOpen}
          closing={megaClosing}
          onNavigate={() => setMegaOpen(false)}
          onClose={closeMegaAndFocusTrigger}
        />
      </header>

      {/* Mobile drawer: slides from RTL-start, backdrop, Escape, focus trap, scroll lock */}
      <div
        className={`drawer fixed inset-0 z-[70] lg:hidden ${drawerOpen ? "drawer--open" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="drawer__backdrop absolute inset-0 bg-navy/60"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={ui("nav.menu", locale)}
          className={`drawer__panel absolute top-0 bottom-0 start-0 flex w-[85vw] max-w-sm flex-col bg-surface shadow-float ${
            drawerOpen ? "translate-x-0" : drawerHidden
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Wordmark locale={locale} size="sm" />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-button text-navy transition-colors hover:bg-sky"
              aria-label={ui("nav.close", locale)}
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {DRAWER_LINKS.map((item, liIndex) => {
                // Drawer links enter fade + y 8->0, 250ms, stagger 40ms
                // when the drawer opens (class applied only while open so
                // the entrance replays on every open).
                const linkCls = drawerOpen ? "drawer__link" : "";
                const linkStyle = drawerOpen ? { animationDelay: `${liIndex * 40}ms` } : undefined;
                if (item.key === "nav.solutions") {
                  // Products accordion sits between About and Solutions,
                  // preserving the desktop nav order.
                  return (
                    <Fragment key="products-accordion">
                      <ProductsAccordion
                        locale={locale}
                        onNavigate={() => setDrawerOpen(false)}
                        animate={drawerOpen}
                        delayMs={liIndex * 40}
                      />
                      <li key={item.key} className={linkCls} style={linkStyle}>
                        <Link
                          href={localizedHref(locale, item.href)}
                          onClick={() => setDrawerOpen(false)}
                          className={`block border-b border-border py-3.5 text-base font-semibold ${
                            isActive(item.href) ? "text-primary-hover" : "text-navy"
                          }`}
                        >
                          {ui(item.key, locale)}
                        </Link>
                      </li>
                    </Fragment>
                  );
                }
                return (
                  <li key={item.key} className={linkCls} style={linkStyle}>
                    <Link
                      href={localizedHref(locale, item.href)}
                      onClick={() => setDrawerOpen(false)}
                      className={`block border-b border-border py-3.5 text-base font-semibold ${
                        isActive(item.href) ? "text-primary-hover" : "text-navy"
                      }`}
                    >
                      {ui(item.key, locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between py-4">
              <LanguageSelector locale={locale} />
            </div>
          </nav>
          <div className="border-t border-border p-5">
            <WhatsAppButton
              locale={locale}
              message={WA_MESSAGES.general[locale]}
              label={ui("cta.whatsappStart", locale)}
              source="drawer"
              variant="green-pill"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
