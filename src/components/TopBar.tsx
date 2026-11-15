import { Facebook, Instagram, Mail, Phone, Clock } from "lucide-react";
import { siteSettings } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

/**
 * TopBar: desktop-only navy strip (#102B46), scrolls away, header sticks.
 * Design-system §5: "No utility bar unless approved" — this strip is the
 * pre-existing approved contact strip (email / phone / hours + verified
 * social links); it is retained, re-tokenised, not newly introduced.
 * Social links are the verified ones from src/data/settings.ts
 * (facebook.com/GTSYemen, instagram.com/gtsyemen1) — no other network
 * is linked anywhere in the shell.
 */
export default function TopBar({ locale }: { locale: Locale }) {
  const { contact, social } = siteSettings;
  return (
    <div className="hidden bg-navy text-white lg:block">
      <div className="wrap flex h-10 items-center justify-between text-[0.8125rem]">
        <div className="flex items-center gap-5">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-text-inverse-muted transition-colors hover:text-white">
            <Mail className="size-3.5" aria-hidden="true" />
            <span dir="ltr">{contact.email}</span>
          </a>
          <a href={`tel:${contact.whatsapp}`} className="flex items-center gap-1.5 text-text-inverse-muted transition-colors hover:text-white">
            <Phone className="size-3.5" aria-hidden="true" />
            <span dir="ltr">{contact.phoneDisplay}</span>
          </a>
          <span className="flex items-center gap-1.5 text-text-inverse-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            {t(contact.hours, locale)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-inverse-muted transition-colors hover:text-white">
            <Facebook className="size-4" aria-hidden="true" />
          </a>
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-inverse-muted transition-colors hover:text-white">
            <Instagram className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
