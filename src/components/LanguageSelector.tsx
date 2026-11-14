"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/data";

const LABELS: Record<Locale, string> = { ar: "عربي", en: "EN", zh: "中文" };

/** Language selector (BUILD_SPEC §2.4): preserves the current page, sets NEXT_LOCALE cookie. */
export default function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm font-bold">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-faint" aria-hidden="true">|</span>}
          {l === locale ? (
            <span aria-current="true" className="text-accent">
              {LABELS[l]}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              className="text-text-muted transition-colors hover:text-accent"
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
              }}
            >
              {LABELS[l]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
