import type { Metadata } from "next";
import { MessageCircle, Mail, Headset, ChevronDown, ArrowLeft, Settings, Wrench } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import { SectionHeadingL } from "@/components/ui";
import { pages, siteSettings } from "@/data";
import { t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
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
      icon: <MessageCircle className="size-6" aria-hidden="true" />,
      title: t(c.k3, l),
      value: contact.phoneDisplay,
      valueHref: `https://wa.me/967775800000?text=${encodeURIComponent(WA_MESSAGES.general[l])}`,
      linkLabel: t(c.k5, l),
      linkHref: `https://wa.me/967775800000?text=${encodeURIComponent(WA_MESSAGES.general[l])}`,
      external: true,
    },
    {
      icon: <Mail className="size-6" aria-hidden="true" />,
      title: t(c.k6, l),
      value: contact.email,
      valueHref: `mailto:${contact.email}`,
      linkLabel: t(c.k8, l),
      linkHref: `mailto:${contact.email}`,
      external: false,
    },
    {
      icon: <Headset className="size-6" aria-hidden="true" />,
      title: t(c.k9, l),
      value: t(contact.hours, l),
      valueHref: undefined,
      linkLabel: t(c.k11, l),
      linkHref: `https://wa.me/967775800000?text=${encodeURIComponent(WA_MESSAGES.support(t(c.k9, l))[l])}`,
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
        whatsappVariant="navy-pill"
      />

      {/* 7.2 Method cards — 3 equal light-grey panels, text-links */}
      <section className="section-sm">
        <div className="wrap grid gap-6 md:grid-cols-3" data-stagger>
          {methods.map((m, i) => (
            <div key={i} className="rounded-card bg-surface-muted p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">{m.icon}</div>
              <h2 className="mt-4 text-h4 font-extrabold text-primary">{m.title}</h2>
              {m.valueHref ? (
                <a href={m.valueHref} dir="ltr" className="mt-1 block text-body-sm font-bold text-text-muted hover:text-accent">
                  {m.value}
                </a>
              ) : (
                <p className="mt-1 text-body-sm font-bold text-text-muted">{m.value}</p>
              )}
              <a
                href={m.linkHref}
                {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong"
              >
                {m.linkLabel}
                <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 7.3 Form block — sky-blue side panel (40%) + form (60%) */}
      <section className="section-sm">
        <div className="wrap grid gap-6 lg:grid-cols-[40%_60%]">
          <aside className="flex flex-col overflow-hidden rounded-card bg-surface-blue shadow-card">
            <div className="p-8">
              <h2 className="text-h2 font-extrabold leading-[1.3] text-primary">{t(c.k26, l)}</h2>
              <p className="mt-4 text-body text-text-muted">{t(c.k28, l)}</p>
            </div>
            <img src={webp("/images/photos/panels-rows.jpg")} alt={t(c.k26, l)} loading="lazy" className="mt-auto aspect-[16/10] w-full object-cover" />
          </aside>
          <ContactForm locale={l} />
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface">
        <div className="wrap max-w-4xl">
          <SectionHeadingL locale={l} title={t(c.k29, l)} />
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-card border border-border bg-bg p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-primary">
                  {t(f.q, l)}
                  <ChevronDown className="size-5 shrink-0 text-accent transition-transform group-open:rotate-180" aria-hidden="true" />
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
        whatsappVariant="navy-pill"
        features={[
          { icon: <Settings className="size-4" aria-hidden="true" />, title: { ar: "خبرة متكاملة", en: "Integrated expertise", zh: "综合经验" } },
          { icon: <Wrench className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          { icon: <MessageCircle className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
        ]}
      />
    </>
  );
}
