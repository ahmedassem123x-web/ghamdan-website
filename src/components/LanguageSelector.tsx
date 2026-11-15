"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/data";

const LABELS: Record<Locale, string> = { ar: "عربي", en: "EN", zh: "中文" };

/**
 * Language selector: preserves the current page (switchLocalePath),
 * sets NEXT_LOCALE cookie. Active locale is unmistakable: sky pill +
 * #0B70C9 (5.03:1, AA) + aria-current; inactive locales are #5A6470,
 * hover sky. Links have a 44px touch height and a clear focus-visible
 * ring. No letter-spacing is applied to the Arabic/Chinese labels.
 * Container: 1px border pill on a white surface.
 */
export default function LanguageSelector({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Language" className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-border bg-surface p-1 text-sm font-semibold">
      {LOCALES.map((l) => (
        l === locale ? (
          <span
            key={l}
            aria-current="true"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-sky px-2.5 text-primary-hover"
          >
            {LABELS[l]}
          </span>
        ) : (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 text-text-secondary transition-colors hover:bg-sky hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
            }}
          >
            {LABELS[l]}
          </Link>
        )
      ))}
    </nav>
  );
}
