import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, SunIcon, DropletIcon, LeafIcon, ShieldIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { EditorialBlock } from "@/components/ui";
import { pages, pillars, products, categories, agencies } from "@/data";
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
    { icon: <SunIcon className="size-7" aria-hidden="true" />, pillar: pillars[0], image: "/images/photos/panels-rows.jpg", href: "/solutions/residential" },
    { icon: <DropletIcon className="size-7" aria-hidden="true" />, pillar: pillars[1], image: "/images/photos/pump-flow.jpg", href: "/solutions/pumping" },
    { icon: <LeafIcon className="size-7" aria-hidden="true" />, pillar: pillars[2], image: "/images/photos/greenhouse.jpg", href: "/solutions/irrigation" },
  ];
  // Real numbers only, computed from the data — never invented: published
  // products (37), agencies (6), categories (8). No years, no projects.
  const stats = [
    { value: products.filter((p) => p.status === "published").length, label: ui("nav.products", l) },
    { value: agencies.length, label: ui("nav.agencies", l) },
    { value: categories.length, label: ui("footer.categories", l) },
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
        primaryHref="/contact"
        primaryLabelKey="cta.contactUs"
      />

      {/* 2.2 Intro — sky mesh (quiet). The pillar row that used to sit
          here duplicated the home intro and the expertise section below,
          so it is gone: intro + real-number stats only; the story
          follows in §2.3. */}
      <section data-reveal="up" className="section bg-mesh-sky">
        <div className="wrap">
          <div data-reveal="fade" className="text-center">
            <div className="mb-4 flex justify-center">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="mx-auto max-w-3xl text-h2 font-semibold text-navy">{t(a.k20, l)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(a.k2, l)}</p>
          </div>
          {/* Real-number stats — count-up 1.2s power2.out, stagger 100ms.
              Only documented numbers (37 products, 6 agencies, 8
              categories); no years of experience, no project counts. */}
          <div data-stagger className="mt-12 grid gap-6 text-center sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} className="rounded-card border border-border bg-white p-6 shadow-card">
                <p className="font-latin text-5xl font-extrabold text-brand-red-text" dir="ltr">
                  <span data-countup={String(s.value)} data-countup-delay={String(i * 0.1)}>
                    {s.value}
                  </span>
                </p>
                <p className="mt-2 text-body-sm font-bold text-navy">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.3 Story */}
      <section data-reveal="left" className="section bg-white">
        <div className="wrap">
          <div data-reveal="fade">
          <EditorialBlock
            image="/images/photos/solar-farm.jpg"
            imageAlt={t(a.k22, l)}
            title={t(a.k22, l)}
            text={t(a.k23, l)}
            flip
            eyebrow={
              <span className="section-marker" aria-hidden="true" />
            }
          >
            <a
              href="#expertise"
              className="btn btn-navy mt-6"
            >
              {ui("cta.discoverMore", l)}
              <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
            </a>
          </EditorialBlock>
          </div>
        </div>
      </section>

      {/* Full-width real photo band with caption — replaces the standalone
          cartoon illustration strip. */}
      <figure className="relative overflow-hidden">
        <img src={webp("/images/photos/villa-sky.jpg")} alt={t(a.k22, l)} loading="lazy" className="aspect-[21/9] w-full object-cover md:aspect-[21/6]" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-4 pb-4 pt-10 text-center font-bold text-white">
          {t(a.k22, l)}
        </figcaption>
      </figure>

      {/* 2.4 Mission / Vision */}
      <section data-reveal="right" className="section bg-white">
        <div data-stagger className="wrap grid gap-6 md:grid-cols-2">
          <div className="card-luxe p-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">
              <ShieldIcon className="size-7" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-h3 font-semibold text-navy">{t(a.k9, l)}</h3>
            <p className="mt-3 text-body text-text-muted">{t(a.k10, l)}</p>
          </div>
          <div className="card-luxe p-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">
              <SunIcon className="size-7" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-h3 font-semibold text-navy">{t(a.k11, l)}</h3>
            <p className="mt-3 text-body text-text-muted">{t(a.k12, l)}</p>
          </div>
        </div>
      </section>

      {/* 2.5 Expertise — LOUD navy mesh band, image cards on top */}
      <section data-reveal="scale" id="expertise" className="section scroll-mt-24 bg-mesh-navy">
        <div className="wrap">
          <div data-reveal="fade" className="text-center">
            <div className="mb-4 flex justify-center">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-white">{t(a.k25, l)}</h2>
          </div>
          <div data-stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {expertise.map((e) => (
              <article key={e.pillar.title.ar} className="group overflow-hidden rounded-card bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <Link href={localizedHref(l, e.href)} className="block overflow-hidden" aria-label={t(e.pillar.title, l)}>
                  <img src={webp(e.image)} alt={t(e.pillar.title, l)} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </Link>
                <div className="p-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">{e.icon}</div>
                  <h3 className="mt-4 text-h4 font-semibold text-navy">{t(e.pillar.title, l)}</h3>
                  <p className="mt-2 text-body-sm text-text-muted">{t(e.pillar.text, l)}</p>
                  <Link href={localizedHref(l, e.href)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover">
                    {ui("cta.discoverMore", l)}
                    <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
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
