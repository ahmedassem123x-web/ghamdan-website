import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react";
import Wordmark from "./Wordmark";
import { categories } from "@/data";
import { siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/**
 * Footer (v15 design-system §5): WHITE footer per the boards and the KGE
 * rhythm reference — logo (120px emblem, brand lock §6) + company
 * summary, product categories (all 8, real routes), quick links
 * (incl. Solutions / Systems), approved contact only (Sakhr St,
 * +967 775 800 000, info@ghamdan-trd.com, Sat–Fri 8–20), legal links,
 * copyright. Social links are the VERIFIED ones from
 * src/data/settings.ts (facebook.com/GTSYemen, instagram.com/gtsyemen1);
 * no other network is linked. The oversized pale GHAMDAN watermark is
 * kept — navy at 4% opacity, hidden below md, aria-hidden, and it never
 * overlaps readable text (it sits behind the grid, bottom-anchored).
 * A dark-navy footer variant would also be board-acceptable, but the
 * white footer is the board default and is kept — see
 * docs/component-library.md §9.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const { contact, social } = siteSettings;
  const year = new Date().getFullYear();
  const quickLinks = [
    { key: "nav.about", href: "/about" },
    { key: "nav.products", href: "/products" },
    { key: "nav.solutions", href: "/solutions" },
    { key: "nav.systems", href: "/systems" },
    { key: "nav.projects", href: "/projects" },
    { key: "nav.services", href: "/services" },
    { key: "nav.agencies", href: "/agencies" },
    { key: "nav.news", href: "/news" },
    { key: "nav.support", href: "/support" },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      {/* Giant pale watermark — hidden below md */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none justify-center overflow-hidden font-latin text-[11rem] leading-none font-bold tracking-tight text-navy/[0.04] md:flex"
        dir="ltr"
      >
        GHAMDAN
      </div>
      <div className="wrap relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 — brand + about */}
        <div>
          <Wordmark locale={locale} size="lg" />
          <p className="mt-4 text-body-sm text-text-secondary">{t(siteSettings.brand.tagline, locale)}</p>
          <p className="mt-1 font-latin text-[0.625rem] font-semibold tracking-[0.18em] text-text-muted" dir="ltr">
            {siteSettings.brand.taglineMark}
          </p>
          <div className="mt-5 flex gap-2">
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
              <Facebook className="size-5" aria-hidden="true" />
            </a>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-primary-hover hover:text-primary-hover">
              <Instagram className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        {/* Col 2 — categories */}
        <nav aria-label={ui("footer.categories", locale)}>
          <h3 className="text-h4 font-semibold text-navy">{ui("footer.categories", locale)}</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={localizedHref(locale, `/products/category/${c.id}`)} className="text-body-sm text-text-secondary transition-colors hover:text-primary-hover">
                  {t(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Col 3 — quick links */}
        <nav aria-label={ui("footer.quickLinks", locale)}>
          <h3 className="text-h4 font-semibold text-navy">{ui("footer.quickLinks", locale)}</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.key}>
                <Link href={localizedHref(locale, l.href)} className="text-body-sm text-text-secondary transition-colors hover:text-primary-hover">
                  {ui(l.key, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Col 4 — contact */}
        <div>
          <h3 className="text-h4 font-semibold text-navy">{ui("footer.contact", locale)}</h3>
          <ul className="mt-4 space-y-3 text-body-sm text-text-secondary">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary-hover" aria-hidden="true" />
              <span>{t(contact.address, locale)}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary-hover" aria-hidden="true" />
              <a href={`tel:${contact.whatsapp}`} dir="ltr" className="transition-colors hover:text-primary-hover">{contact.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary-hover" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} dir="ltr" className="transition-colors hover:text-primary-hover">{contact.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary-hover" aria-hidden="true" />
              <span>{t(contact.hours, locale)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-5 text-caption text-text-muted sm:flex-row">
          <p>© {year} {t(siteSettings.brand.name, locale)} — {ui("footer.rights", locale)}</p>
          <div className="flex items-center gap-5">
            <Link href={localizedHref(locale, "/privacy")} className="transition-colors hover:text-primary-hover">{ui("footer.privacy", locale)}</Link>
            <Link href={localizedHref(locale, "/terms")} className="transition-colors hover:text-primary-hover">{ui("footer.terms", locale)}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
