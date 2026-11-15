import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Target, Eye, Sun, Droplet, Leaf } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { EditorialBlock } from "@/components/ui";
import { pages, pillars } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(pages.about.k19, locale as Locale) };
}

/** About (§3.2): side-left hero → intro + pillar row → story → mission/vision → expertise → CTA photo-left. */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const a = pages.about;
  const expertise = [
    { icon: <Sun className="size-7" aria-hidden="true" />, pillar: pillars[0], image: "/images/photos/panels-rows.jpg", href: "/solutions/residential" },
    { icon: <Droplet className="size-7" aria-hidden="true" />, pillar: pillars[1], image: "/images/photos/pump-flow.jpg", href: "/solutions/pumping" },
    { icon: <Leaf className="size-7" aria-hidden="true" />, pillar: pillars[2], image: "/images/photos/greenhouse.jpg", href: "/solutions/irrigation" },
  ];

  return (
    <>
      <Hero
        locale={l}
        variant="side-left"
        image="/images/heroes/hero-villa-sea.jpg"
        imageAlt={t(a.k1, l)}
        title={a.k1}
        text={a.k2}
        whatsapp={false}
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />

      {/* 2.2 Intro + pillar row */}
      <section data-reveal className="section">
        <div className="wrap">
          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
              {t(a.k19, l)}
            </p>
            <h2 className="mx-auto max-w-3xl text-h2 font-semibold text-navy">{t(a.k20, l)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(a.k2, l)}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:divide-x md:divide-border md:divide-x-reverse">
            {pillars.map((p) => (
              <div key={p.title.ar} className="flex flex-col items-center px-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-sky text-primary-hover">
                  {p.icon === "sun" ? <Sun className="size-8" aria-hidden="true" /> : p.icon === "droplet" ? <Droplet className="size-8" aria-hidden="true" /> : <Leaf className="size-8" aria-hidden="true" />}
                </div>
                <h3 className="mt-4 text-h3 font-semibold text-navy">{t(p.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(p.text, l)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.3 Story */}
      <section data-reveal className="section bg-surface">
        <div className="wrap">
          <EditorialBlock
            image="/images/photos/solar-farm.jpg"
            imageAlt={t(a.k22, l)}
            title={t(a.k22, l)}
            text={t(a.k23, l)}
            flip
            eyebrow={
              <span className="inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
                {t(a.k21, l)}
              </span>
            }
          >
            <a
              href="#expertise"
              className="mt-6 inline-flex items-center gap-1.5 rounded-[0.625rem] bg-navy px-5 py-2.5 font-bold text-button text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-navy"
            >
              {ui("cta.discoverMore", l)}
              <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </a>
          </EditorialBlock>
        </div>
      </section>

      {/* 2.4 Mission / Vision */}
      <section data-reveal className="section">
        <div className="wrap grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-border bg-surface p-8 shadow-card">
            <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">
              <Target className="size-7" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-h2 font-semibold text-navy">{t(a.k9, l)}</h2>
            <p className="mt-3 text-body text-text-muted">{t(a.k10, l)}</p>
          </div>
          <div className="rounded-card border border-border bg-surface p-8 shadow-card">
            <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">
              <Eye className="size-7" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-h2 font-semibold text-navy">{t(a.k11, l)}</h2>
            <p className="mt-3 text-body text-text-muted">{t(a.k12, l)}</p>
          </div>
        </div>
      </section>

      {/* 2.5 Expertise */}
      <section data-reveal id="expertise" className="section scroll-mt-24 bg-surface">
        <div className="wrap">
          <div className="text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-sm font-bold text-primary-hover">
              {t(a.k24, l)}
            </p>
            <h2 className="text-h2 font-semibold text-navy">{t(a.k25, l)}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {expertise.map((e) => (
              <article key={e.pillar.title.ar} className="group overflow-hidden rounded-card bg-background shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <Link href={localizedHref(l, e.href)} className="block overflow-hidden" aria-label={t(e.pillar.title, l)}>
                  <img src={webp(e.image)} alt={t(e.pillar.title, l)} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </Link>
                <div className="p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">{e.icon}</div>
                  <h3 className="mt-4 text-h4 font-semibold text-navy">{t(e.pillar.title, l)}</h3>
                  <p className="mt-2 text-body-sm text-text-muted">{t(e.pillar.text, l)}</p>
                  <Link href={localizedHref(l, e.href)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
                    {ui("cta.discoverMore", l)}
                    <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        locale={l}
        variant="photo-bg"
        image="/images/photos/solar-farm.jpg"
        imageAlt={t(a.k26, l)}
        title={a.k26}
        text={a.k27}
        whatsappVariant="white-on-dark"
      />
    </>
  );
}
