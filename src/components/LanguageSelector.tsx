"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/data";

const LABELS: Record<Locale, string> = { ar: "عربي", en: "EN", zh: "中文" };

/**
 * Language selector: preserves the current page (switchLocalePath),
 * sets NEXT_LOCALE cookie. Active locale is unmistakable: #0B70C9
 * (5.03:1, AA) + aria-current; inactive locales are #5A6470, hover
 * #0B70C9. Links have a 44px touch height. No letter-spacing is
 * applied to the Arabic/Chinese labels.
 */
export default function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Language" className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1 whitespace-nowrap">
          {i > 0 && <span className="text-text-muted" aria-hidden="true">|</span>}
          {l === locale ? (
            <span aria-current="true" className="inline-flex min-h-11 items-center whitespace-nowrap px-1.5 text-primary-hover">
              {LABELS[l]}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={l}
              className="inline-flex min-h-11 items-center whitespace-nowrap px-1.5 text-text-secondary transition-colors hover:text-primary-hover"
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
