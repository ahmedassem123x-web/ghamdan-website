import Link from "next/link";
import { Clock, Facebook, Instagram } from "lucide-react";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import Wordmark from "./Wordmark";
import { categories } from "@/data";
import { siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

/**
 * Footer (v15 design-system §5, Variant A "Navy Editorial" redesign):
 * DEEP navy mesh — `.bg-mesh-navy` + grain — with a dual-color
 * blue→red hairline on top, white headings, sky-tint links, white on
 * hover. Logo (120px emblem, brand lock §6) + company summary, product
 * categories (all 8, real routes), quick links (incl. Solutions /
 * Systems), approved contact only (Sakhr St, +967 775 800 000,
 * info@ghamdan-trd.com, Sat–Fri 8–20), legal links, copyright. Social
 * links are the VERIFIED ones from src/data/settings.ts
 * (facebook.com/GTSYemen, instagram.com/gtsyemen1); no other network is
 * linked. The oversized pale GHAMDAN watermark is kept — white at 5%
 * opacity, hidden below md, aria-hidden, behind the grid.
 *
 * Icon note: Mail / Phone / MapPin come from the shared icon library;
 * Facebook / Instagram / Clock have no contract equivalent there, so
 * they stay on lucide (same stroke family).
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
    <footer className="bg-mesh-navy relative overflow-hidden text-white">
      {/* Grain is a CHILD overlay span — never a class on the footer itself. */}
      <span className="grain" aria-hidden="true" />
      {/* Dual-color top line: blue → red, echoing the logo ring. */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-primary via-primary-hover to-brand-red" />
      {/* Giant pale watermark — hidden below md */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none justify-center overflow-hidden font-latin text-[11rem] leading-none font-bold tracking-tight text-white/[0.05] md:flex"
        dir="ltr"
      >
        GHAMDAN
      </div>
      <div data-stagger className="wrap relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 — brand + about */}
        <div>
          <Wordmark locale={locale} variant="dark" size="lg" />
          <p className="mt-4 text-body-sm text-text-inverse-muted">{t(siteSettings.brand.tagline, locale)}</p>
          <p className="mt-1 font-latin text-[0.625rem] font-semibold tracking-[0.18em] text-white/60" dir="ltr">
            {siteSettings.brand.taglineMark}
          </p>
          <div className="mt-5 flex gap-2">
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10">
              <Facebook className="size-5" aria-hidden="true" />
            </a>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10">
              <Instagram className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        {/* Col 2 — categories */}
        <nav aria-label={ui("footer.categories", locale)}>
          <h3 className="text-h4 font-semibold text-white">{ui("footer.categories", locale)}</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={localizedHref(locale, `/products/category/${c.id}`)} className="text-body-sm text-text-inverse-muted transition-colors hover:text-white">
                  {t(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Col 3 — quick links */}
        <nav aria-label={ui("footer.quickLinks", locale)}>
          <h3 className="text-h4 font-semibold text-white">{ui("footer.quickLinks", locale)}</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.key}>
                <Link href={localizedHref(locale, l.href)} className="text-body-sm text-text-inverse-muted transition-colors hover:text-white">
                  {ui(l.key, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Col 4 — contact */}
        <div>
          <h3 className="text-h4 font-semibold text-white">{ui("footer.contact", locale)}</h3>
          <ul className="mt-4 space-y-3 text-body-sm text-text-inverse-muted">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{t(contact.address, locale)}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${contact.whatsapp}`} dir="ltr" className="transition-colors hover:text-white">{contact.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MailIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} dir="ltr" className="transition-colors hover:text-white">{contact.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{t(contact.hours, locale)}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/15">
        <div data-reveal className="wrap flex flex-col items-center justify-between gap-3 py-5 text-caption text-white/60 sm:flex-row">
          <p>© {year} {t(siteSettings.brand.name, locale)} — {ui("footer.rights", locale)}</p>
          <div className="flex items-center gap-5">
            <Link href={localizedHref(locale, "/privacy")} className="transition-colors hover:text-white">{ui("footer.privacy", locale)}</Link>
            <Link href={localizedHref(locale, "/terms")} className="transition-colors hover:text-white">{ui("footer.terms", locale)}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
