"use client";

import { useEffect } from "react";
import type { Locale } from "@/data";

/**
 * LocaleHtmlAttrs — keeps <html lang/dir> in sync with the current locale
 * on CLIENT-SIDE navigation (2026-11-15 fix).
 *
 * Why it exists: the root layout (src/app/layout.tsx) sits ABOVE the
 * [locale] segment, so it cannot see the locale param and the emitted
 * <html> defaults to lang="ar" dir="rtl" for every page; the correct
 * per-locale attrs are applied post-build to the static files by
 * tools/fix-html-lang.mjs. That fixes direct loads — but the language
 * switcher navigates with Next.js <Link> (no document reload), so after
 * /ar → /en the URL and content changed while document.dir stayed "rtl":
 * English content in a mirrored RTL layout. This effect runs on every
 * locale change (the [locale] layout re-renders with the new param) and
 * writes the matching lang/dir onto <html>. On initial load it writes
 * the same values the static file already has — harmless and idempotent.
 */
export default function LocaleHtmlAttrs({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
