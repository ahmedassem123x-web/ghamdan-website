import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.legal.privacy.k1, locale as Locale) };
}

/** Privacy policy: draft pending approval (CI-10) — never presented as final. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const p = pages.legal.privacy;
  const items = [p.k3, p.k4, p.k5, p.k6];
  return (
    <>
      <Hero locale={l} variant="plain" title={p.k1} text={p.k2} whatsapp={false} />
      <section className="section">
        <div className="wrap max-w-3xl">
          <div className="rounded-card border border-sky bg-sky-light p-5">
            <p className="font-bold text-primary">{ui("notice.legal", l)}</p>
          </div>
          <ul className="mt-8 space-y-4">
            {items.map((item, i) => (
              <li key={i} className="rounded-card bg-surface p-5 shadow-card">
                <p className="font-bold text-primary">{t(item, l)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-caption text-text-faint">{t(p.k7, l)}</p>
        </div>
      </section>
    </>
  );
}
