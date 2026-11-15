import type { Metadata } from "next";
import { ShieldIcon, WhatsAppIcon, ChevronDownIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import WhatsAppButton from "@/components/WhatsAppButton";
import { pages, siteSettings } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.support.k1, locale as Locale) };
}

/** Support & warranty (CI-08): warranty text pending — NO duration published, ever. */
export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const s = pages.support;
  const faqs = [
    { q: s.k11, a: s.k12 },
    { q: s.k13, a: s.k14 },
    { q: s.k15, a: s.k16 },
    { q: s.k17, a: s.k18 },
  ];
  return (
    <>
      <Hero
        locale={l}
        variant="plain"
        title={s.k1}
        text={s.k2}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />

      {/* Technical support — light mesh (quiet) */}
      <section data-reveal="up" className="section bg-mesh-light">
        <div data-stagger className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            {/* Heading inlined (visible by default) — SectionHeadingL's shared
                wrapper no longer hides content (Phase 6 removed .reveal). */}
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(s.k3, l)}</h2>
            </div>
            <p data-reveal="fade" className="mt-3 max-w-2xl text-body text-text-muted">{t(s.k4, l)}</p>
            <p data-reveal="fade" className="mt-4 text-body text-text-muted">{t(s.k5, l)}</p>
            <div data-reveal="up" className="mt-6">
              <WhatsAppButton
                locale={l}
                message={WA_MESSAGES.support(t(s.k3, l))[l]}
                label={ui("cta.whatsappStart", l)}
                source="support"
                variant="green-pill"
              />
            </div>
          </div>

          {/* Warranty — pending approval only */}
          <div className="card-luxe p-8">
            <div data-reveal="fade" className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">
                <ShieldIcon className="size-6" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{t(s.k6, l)}</h2>
            </div>
            <p data-reveal="fade" className="mt-4 text-body font-bold text-navy">{t(s.k7, l)}</p>
            <p className="mt-2 text-body text-text-muted">{t(s.k8, l)}</p>
            <p className="mt-4 text-body-sm text-text-muted">{t(siteSettings.warranty.text, l)}</p>
            <p className="mt-2 text-caption text-text-muted">{t(s.k9, l)}</p>
          </div>
        </div>
      </section>

      {/* FAQ — sand band */}
      <section data-reveal="right" className="section bg-sand">
        <div className="wrap max-w-4xl">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-navy">{t(s.k10, l)}</h2>
          </div>
          <div data-stagger className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-card border border-border bg-white p-5 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
                  {t(f.q, l)}
                  <ChevronDownIcon className="size-5 shrink-0 text-primary-hover transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-body text-text-muted">{t(f.a, l)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTABand locale={l} variant="whatsapp" title={s.k1} text={s.k2} />
    </>
  );
}
