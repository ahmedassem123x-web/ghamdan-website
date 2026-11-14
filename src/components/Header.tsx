"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Wordmark from "./Wordmark";
import LanguageSelector from "./LanguageSelector";
import WhatsAppButton from "./WhatsAppButton";
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
  ...NAV_ITEMS,
  { key: "nav.services", href: "/services" },
  { key: "nav.agencies", href: "/agencies" },
  { key: "nav.news", href: "/news" },
] as const;

/** Header (BUILD_SPEC §2.3): transparent over photo heroes → solid white after 24px scroll. */
export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overPhoto, setOverPhoto] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOverPhoto(Boolean(document.querySelector("[data-photo-hero]")));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Drawer: Escape to close + body scroll lock + focus trap
  useEffect(() => {
    if (!drawerOpen) return;
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
    };
  }, [drawerOpen]);

  const transparent = overPhoto && !scrolled;
  const onSolutions = pathname.includes("/solutions");
  const dir = localeDir(locale);
  const drawerHidden = dir === "rtl" ? "translate-x-full" : "-translate-x-full";

  const isActive = (href: string) => {
    const p = pathname.replace(/^\/(ar|en|zh)/, "") || "/";
    if (href === "/") return p === "/";
    return p === href || p.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 ${
          transparent ? "bg-transparent" : "site-header--scrolled bg-white"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-2 lg:h-[76px] lg:gap-4">
          <Wordmark locale={locale} variant={transparent ? "overlay" : "light"} />
          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={localizedHref(locale, item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-nav font-bold transition-colors ${
                  isActive(item.href)
                    ? "text-accent"
                    : transparent
                      ? "text-white hover:text-sky-light"
                      : "text-text hover:text-accent"
                }`}
              >
                {ui(item.key, locale)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {/* Language switch lives in the drawer below sm (header row cannot fit wordmark + selector + burger at 360px) */}
            <div className={`hidden sm:block ${transparent ? "[&_a]:!text-white [&_span]:!text-white/70" : ""}`}>
              <LanguageSelector locale={locale} />
            </div>
            <div className="hidden md:block">
              <WhatsAppButton
                locale={locale}
                message={WA_MESSAGES.general[locale]}
                label={ui("cta.whatsapp", locale)}
                source="header"
                variant={onSolutions ? "green-pill" : "navy-pill"}
              />
            </div>
            <button
              type="button"
              className={`inline-flex size-11 items-center justify-center rounded-[0.625rem] lg:hidden ${
                transparent ? "text-white" : "text-primary"
              }`}
              aria-label={ui("nav.menu", locale)}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer (BUILD_SPEC §2.9): slides from RTL-start, backdrop, Escape, focus trap, scroll lock */}
      <div
        className={`drawer fixed inset-0 z-[70] lg:hidden ${drawerOpen ? "drawer--open" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="drawer__backdrop absolute inset-0 bg-primary-deep/60"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={ui("nav.menu", locale)}
          className={`drawer__panel absolute top-0 bottom-0 start-0 flex w-[85vw] max-w-sm flex-col bg-white shadow-float ${
            drawerOpen ? "translate-x-0" : drawerHidden
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Wordmark locale={locale} size="sm" />
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[0.625rem] text-primary"
              aria-label={ui("nav.close", locale)}
              onClick={() => setDrawerOpen(false)}
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {DRAWER_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={localizedHref(locale, item.href)}
                    onClick={() => setDrawerOpen(false)}
                    className={`block border-b border-border py-3.5 text-base font-bold ${
                      isActive(item.href) ? "text-accent" : "text-text"
                    }`}
                  >
                    {ui(item.key, locale)}
                  </Link>
                </li>
              ))}
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
