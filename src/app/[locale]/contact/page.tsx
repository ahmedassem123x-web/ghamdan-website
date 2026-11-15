import type { Metadata } from "next";
import { WhatsAppIcon, MailIcon, HeadsetIcon, ChevronDownIcon, ArrowIcon, SettingsIcon, WrenchIcon, MapPinIcon, InfoIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import { pages, siteSettings } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES, waLink } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.contact.k1, locale as Locale) };
}

/**
 * Contact (§3.7): side-right hero (house-bright) + 3 equal light-grey method
 * panels with text-links + 2-col form block (sky-blue side panel + form) +
 * FAQ + features CTA. No separate info card — hours/address live in the
 * TopBar/footer and the method panels only (§7.5).
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = pages.contact;
  const { contact } = siteSettings;
  const faqs = [
    { q: c.k30, a: c.k31 },
    { q: c.k32, a: c.k33 },
    { q: c.k34, a: c.k35 },
    { q: c.k36, a: c.k37 },
  ];
  const methods = [
    {
      icon: <WhatsAppIcon className="size-6" aria-hidden="true" />,
      title: t(c.k3, l),
      value: contact.phoneDisplay,
      valueHref: waLink(WA_MESSAGES.general[l]),
      linkLabel: t(c.k5, l),
      linkHref: waLink(WA_MESSAGES.general[l]),
      external: true,
    },
    {
      icon: <MailIcon className="size-6" aria-hidden="true" />,
      title: t(c.k6, l),
      value: contact.email,
      valueHref: `mailto:${contact.email}`,
      linkLabel: t(c.k8, l),
      linkHref: `mailto:${contact.email}`,
      external: false,
    },
    {
      icon: <HeadsetIcon className="size-6" aria-hidden="true" />,
      title: t(c.k9, l),
      value: contact.phoneDisplay,
      valueHref: waLink(WA_MESSAGES.support(t(c.k9, l))[l]),
      linkLabel: t(c.k11, l),
      linkHref: waLink(WA_MESSAGES.support(t(c.k9, l))[l]),
      external: true,
    },
  ];

  return (
    <>
      <Hero
        locale={l}
        variant="side-right"
        image="/images/photos/house-bright.jpg"
        imageAlt={t(c.k1, l)}
        title={c.k1}
        text={c.k2}
        whatsapp
        whatsappVariant="green-pill"
      />

      {/* 7.2 Method cards — 3 white luxe cards on a light mesh */}
      <section data-reveal="up" className="section-sm bg-mesh-light">
        <div data-stagger className="wrap grid gap-6 md:grid-cols-3">
          {methods.map((m, i) => (
            <div key={i} className="card-luxe p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">{m.icon}</div>
              <h3 className="mt-4 text-h4 font-semibold text-navy">{m.title}</h3>
              {m.valueHref ? (
                <a href={m.valueHref} dir="ltr" className="mt-1 block text-body-sm font-bold text-text-muted hover:text-primary-hover">
                  {m.value}
                </a>
              ) : (
                <p className="mt-1 text-body-sm font-bold text-text-muted">{m.value}</p>
              )}
              <a
                href={m.linkHref}
                {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover"
              >
                {m.linkLabel}
                <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 7.3 Form block — sky-mesh side panel (40%) + form (60%) */}
      <section data-reveal="left" className="section-sm bg-white">
        <div data-stagger className="wrap grid gap-6 lg:grid-cols-[40%_60%]">
          <aside className="flex flex-col overflow-hidden rounded-card bg-mesh-sky shadow-card">
            <div className="p-8">
              <div data-reveal="fade" className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 data-reveal="fade" className="text-h2 font-semibold leading-[1.3] text-navy">{t(c.k26, l)}</h2>
              <p data-reveal="fade" className="mt-4 text-body text-text-muted">{t(c.k28, l)}</p>
              {/* Info block (item 21): address + hours + Google Maps
                  directions, beside the form — not buried in the footer. */}
              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <p className="flex items-start gap-2.5 text-body-sm font-bold text-navy">
                  <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary-hover" aria-hidden="true" />
                  {t(contact.address, l)}
                </p>
                <p className="flex items-start gap-2.5 text-body-sm font-bold text-navy">
                  <InfoIcon className="mt-0.5 size-5 shrink-0 text-primary-hover" aria-hidden="true" />
                  {t(contact.hours, l)}
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sakhr%20St%2C%20Sana%27a%2C%20Yemen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline mt-2"
                >
                  {l === "ar" ? "الاتجاهات عبر خرائط Google" : l === "en" ? "Directions on Google Maps" : "在 Google 地图上查看路线"}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </a>
              </div>
            </div>
            <img data-parallax src={webp("/images/photos/panels-rows.jpg")} alt={t(c.k26, l)} loading="lazy" className="mt-auto aspect-[16/10] w-full object-cover" />
          </aside>
          <ContactForm locale={l} />
        </div>
      </section>

      {/* FAQ — heading inlined (visible by default); SectionHeadingL's shared
          wrapper no longer hides content (Phase 6 removed .reveal). */}
      <section data-reveal="right" className="section bg-sand">
        <div className="wrap max-w-4xl">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-navy">{t(c.k29, l)}</h2>
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

      <CTABand
        locale={l}
        variant="features"
        image="/images/photos/panels-rows.jpg"
        imageAlt={ui("contact.ctaTitle", l)}
        title={{
          ar: ui("contact.ctaTitle", "ar"),
          en: ui("contact.ctaTitle", "en"),
          zh: ui("contact.ctaTitle", "zh"),
        }}
        text={c.k2}
        whatsappVariant="green-pill"
        features={[
          { icon: <SettingsIcon className="size-4" aria-hidden="true" />, title: { ar: "خبرة متكاملة", en: "Integrated expertise", zh: "综合经验" } },
          { icon: <WrenchIcon className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          { icon: <WhatsAppIcon className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
        ]}
      />
    </>
  );
}
