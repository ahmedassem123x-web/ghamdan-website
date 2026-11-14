import type { Metadata } from "next";
import Link from "next/link";
import { Sun, Droplet, Leaf, Users, Layers, Settings, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { SolutionCardHorizontal } from "@/components/Cards";
import { Reveal, SectionHeadingL } from "@/components/ui";
import WhatsAppButton from "@/components/WhatsAppButton";
import { pages, pillars, solutionAreas, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const h = pages.home;
  return { title: `${t(h.k2, l)} | ${t(pages.home.k1, l)}` };
}

/** Faint solar-field line art (§3.1.3): decorative, very low contrast, aria-hidden. */
function SolarFieldLineArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 120" className="mt-10 w-full text-primary/[0.08]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M60 110 L180 40 L300 110 Z M200 110 L320 40 L440 110 Z M340 110 L460 40 L580 110 Z M480 110 L600 40 L720 110 Z M620 110 L740 40 L860 110 Z M760 110 L880 40 L1000 110 Z M900 110 L1020 40 L1140 110 Z" />
      <path d="M180 40 L320 40 M320 40 L460 40 M460 40 L600 40 M600 40 L740 40 M740 40 L880 40 M880 40 L1020 40" />
      <path d="M0 118 H1200" />
    </svg>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const h = pages.home;
  const marqueeWords = [h.k10, h.k11, h.k12, h.k13, h.k14, h.k15, h.k16, h.k17, h.k18, h.k19, h.k20, h.k21];
  const residential = solutionAreas.find((a) => a.id === "residential")!;
  const pumping = solutionAreas.find((a) => a.id === "pumping")!;
  const irrigation = solutionAreas.find((a) => a.id === "irrigation")!;
  const { contact } = siteSettings;

  return (
    <>
      {/* 1.1 Hero center (§3.1.1): ONE navy WhatsApp CTA, white badge pill, no pillar pills */}
      <Hero
        locale={l}
        variant="center"
        image="/images/heroes/hero-villa-mountains.jpg"
        imageAlt={t(h.k2, l)}
        eyebrow={h.k1}
        badgeStyle="white"
        title={h.k2}
        text={h.k3}
        whatsapp
        whatsappVariant="navy-pill"
      />

      {/* 1.9 Guidance bar (Home + /products only) */}
      <div className="border-b border-border bg-surface">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-start">
          <p className="font-bold text-primary">
            {l === "ar"
              ? "لا تعرف النظام المناسب؟ جرّب دليل الضخ أو تحدث معنا عبر واتساب"
              : l === "en"
                ? "Not sure which system fits? Try the pumping guide or chat with us on WhatsApp"
                : "不知道哪种系统合适？试试抽水指南或通过 WhatsApp 与我们联系"}
          </p>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link
              href={localizedHref(l, "/guidance")}
              className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] bg-primary px-5 py-2.5 font-bold text-button text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              {l === "ar" ? "دليل الضخ" : l === "en" ? "Pumping guide" : "抽水指南"}
            </Link>
            <WhatsAppButton locale={l} message={WA_MESSAGES.general[l]} label={ui("cta.whatsappStart", l)} source="home-guidance" variant="outlined-blue" />
          </div>
        </div>
      </div>

      {/* 1.2 Intro + 1.3 Pillars */}
      <section className="section">
        <div className="wrap">
          <div className="reveal text-center">
            <h2 className="text-h2 font-extrabold text-primary">{t(h.k37, l)}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body text-text-muted">{t(h.k36, l)}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:divide-x md:divide-border md:divide-x-reverse" data-stagger>
            {pillars.map((p) => (
              <div key={p.title.ar} className="flex flex-col items-center px-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
                  {p.icon === "sun" ? <Sun className="size-8" aria-hidden="true" /> : p.icon === "droplet" ? <Droplet className="size-8" aria-hidden="true" /> : <Leaf className="size-8" aria-hidden="true" />}
                </div>
                <h3 className="mt-4 text-h3 font-extrabold text-primary">{t(p.title, l)}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{t(p.text, l)}</p>
              </div>
            ))}
          </div>
          <SolarFieldLineArt />
        </div>
      </section>

      {/* 1.4 Marquee strip */}
      <div className="overflow-hidden bg-primary py-4 text-white" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex shrink-0 items-center">
              {marqueeWords.map((w, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-lg font-extrabold">{t(w, l)}</span>
                  <span className="text-accent">—</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 1.5 Solutions grid — 2×2 horizontal cards (§3.1.5) */}
      <section className="section">
        <div className="wrap">
          <SectionHeadingL locale={l} eyebrow={t(h.k39, l)} title={t(h.k40, l)} lead={t(h.k38, l)} />
          <div className="mt-10 grid gap-6 lg:grid-cols-2" data-stagger>
            <SolutionCardHorizontal locale={l} title={t(residential.title, l)} text={t(residential.text, l)} image="/images/photos/panels-rows.jpg" imageAlt={t(residential.title, l)} href={localizedHref(l, "/solutions/residential")} />
            <SolutionCardHorizontal locale={l} title={t(pumping.title, l)} text={t(pumping.text, l)} image="/images/photos/pump-flow.jpg" imageAlt={t(pumping.title, l)} href={localizedHref(l, "/solutions/pumping")} />
            <SolutionCardHorizontal locale={l} title={t(irrigation.title, l)} text={t(irrigation.text, l)} image="/images/photos/greenhouse.jpg" imageAlt={t(irrigation.title, l)} href={localizedHref(l, "/solutions/irrigation")} />
            <SolutionCardHorizontal locale={l} title={t(pages.solutions.k1, l)} text={t(pages.solutions.k2, l)} image="/images/photos/solar-farm.jpg" imageAlt={t(pages.solutions.k1, l)} href={localizedHref(l, "/solutions")} />
          </div>
        </div>
      </section>

      {/* 1.6 Why us — surface-blue band with faint sky photo */}
      <section className="section relative overflow-hidden bg-surface-blue">
        <img src={webp("/images/photos/villa-sky.jpg")} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
        <div className="wrap relative">
          <div className="reveal text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-accent shadow-card">
              {t(h.k40, l)}
            </p>
            <h2 className="text-h2 font-extrabold text-primary">{t(h.k41, l)}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3" data-stagger>
            {[
              { icon: <Settings className="size-7" aria-hidden="true" />, title: t(h.k34, l), text: t(h.k35, l) },
              { icon: <Layers className="size-7" aria-hidden="true" />, title: t(h.k32, l), text: t(h.k33, l) },
              { icon: <Users className="size-7" aria-hidden="true" />, title: t(h.k30, l), text: t(h.k31, l) },
            ].map((f, i) => (
              <div key={i} className="rounded-card bg-surface p-6 text-center shadow-card">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">{f.icon}</div>
                <h3 className="mt-4 text-h4 font-extrabold text-primary">{f.title}</h3>
                <p className="mt-2 text-body-sm text-text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.7 Projects + products split */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          {/* Projects (2 image cards, both link to /projects — no fabricated project detail) */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-h2 font-extrabold text-primary">{t(h.k42, l)}</h2>
              <Link href={localizedHref(l, "/projects")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong">
                {ui("cta.viewProject", l)}
                <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2" data-stagger>
              {[
                { img: "/images/photos/solar-farm.jpg", title: l === "ar" ? "مشروع طاقة شمسية" : l === "en" ? "Solar energy project" : "太阳能项目" },
                { img: "/images/photos/pivot.jpg", title: l === "ar" ? "مشروع ري زراعي" : l === "en" ? "Agricultural irrigation project" : "农业灌溉项目" },
              ].map((p, i) => (
                <Link key={i} href={localizedHref(l, "/projects")} className="group block overflow-hidden rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                  <img src={webp(p.img)} alt={p.title} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="block p-4 font-bold text-primary">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Featured products (3 square tiles) */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-h2 font-extrabold text-primary">{t(h.k45, l)}</h2>
              <Link href={localizedHref(l, "/products")} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-accent-strong">
                {ui("cta.viewAllProducts", l)}
                <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4" data-stagger>
              {[
                { img: "/images/photos/panels-rows.jpg", label: l === "ar" ? "ألواح شمسية عالية الكفاءة" : l === "en" ? "High-efficiency solar panels" : "高效太阳能电池板", href: "/products/category/panels" },
                { img: "/images/photos/pump-flow.jpg", label: l === "ar" ? "مضخات مياه مطورة" : l === "en" ? "Advanced water pumps" : "先进水泵", href: "/products/category/pumps" },
                { img: "/images/photos/greenhouse.jpg", label: l === "ar" ? "أنظمة ري ذكية" : l === "en" ? "Smart irrigation systems" : "智能灌溉系统", href: "/solutions/irrigation" },
              ].map((p, i) => (
                <Link key={i} href={localizedHref(l, p.href)} className="group block overflow-hidden rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="aspect-square overflow-hidden bg-surface-muted">
                    <img src={webp(p.img)} alt={p.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <span className="block p-3 text-center text-sm font-bold leading-snug text-primary">{p.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1.8 CTA band split with "other ways to reach us" */}
      <CTABand
        locale={l}
        variant="split"
        title={h.k52}
        text={h.k53}
        whatsappLabelKey="cta.whatsapp"
        whatsappVariant="white-on-dark"
        contactRows={[
          { icon: <Mail className="size-4" aria-hidden="true" />, label: t(h.k46, l), value: contact.email, href: `mailto:${contact.email}` },
          { icon: <Phone className="size-4" aria-hidden="true" />, label: t(h.k48, l), value: contact.phoneDisplay, href: `tel:${contact.whatsapp}` },
          { icon: <MapPin className="size-4" aria-hidden="true" />, label: t(h.k50, l), value: t(contact.address, l) },
        ]}
      />
    </>
  );
}
