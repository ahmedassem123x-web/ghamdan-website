import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, Check } from "lucide-react";
import CTABand from "@/components/CTABand";
import ProductCard from "@/components/ProductCard";
import StickyWhatsAppBar from "@/components/StickyWhatsAppBar";
import SystemDiagram from "@/components/SystemDiagram";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Breadcrumbs } from "@/components/ui";
import { pages, bundles, products, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["ar", "en", "zh"]) {
    for (const b of bundles.filter((x) => x.status === "confirmed")) {
      params.push({ locale, slug: b.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const b = bundles.find((x) => x.slug === slug);
  return { title: b ? t(b.name, locale as Locale) : "" };
}

export default async function SystemDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const bundle = bundles.find((x) => x.slug === slug && x.status === "confirmed");
  if (!bundle) notFound();
  const copy = pages.systems.bundles[slug];
  const name = t(bundle.name, l);
  const siteUrl = `https://ghamdan-website.vercel.app/${l}/systems/${bundle.slug}`;
  const waMsg = WA_MESSAGES.system(name, siteUrl)[l];
  const linkedProducts = bundle.componentProductIds
    .map((id) => products.find((p) => p.id === id && p.status === "published"))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <div className="bg-surface">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.systems", l), href: localizedHref(l, "/systems") },
            { label: name },
          ]}
        />
        <div className="wrap py-10 md:py-14">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-sky text-primary-hover">
                <Package className="size-7" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-sky px-3 py-1 text-xs font-bold text-primary-hover">{t(pages.systems.list.k3, l)}</span>
            </div>
            <h1 className="mt-4 text-h1 font-bold text-navy">{name}</h1>
            <p className="mt-3 max-w-2xl text-body-lg text-text-muted">{t(bundle.use, l)}</p>
            <p className="mt-4 rounded-[0.625rem] bg-sky px-4 py-3 text-sm font-bold text-navy">
              {copy ? t(copy.k7, l) : t(siteSettings.inquiryPolicy, l)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton locale={l} message={waMsg} label={copy ? t(copy.k6, l) : ui("cta.enquire", l)} source="system" sourceId={bundle.id} variant="green-pill" />
              <Link href={localizedHref(l, "/contact")} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] border-2 border-primary px-5 py-2.5 font-bold text-button text-navy transition-all hover:-translate-y-0.5 hover:bg-surface-muted">
                {ui("cta.contactUs", l)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Components — visible by default (was <Reveal>). */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 font-semibold text-navy">{copy ? t(copy.k3, l) : ui("nav.systems", l)}</h2>
            <p className="mt-4 text-body text-text-muted">{t(bundle.components, l)}</p>
            {copy && <p className="mt-4 text-body-sm font-bold text-navy">{t(copy.k5, l)}</p>}
          </div>
          <div>
            <SystemDiagram
              locale={l}
              nodes={[
                { label: l === "ar" ? "الألواح الشمسية" : l === "en" ? "Solar Panels" : "太阳能电池板", icon: "☀" },
                { label: l === "ar" ? "المحول الهجين" : l === "en" ? "Hybrid Inverter" : "混合逆变器", icon: "⚡" },
                { label: l === "ar" ? "البطارية" : l === "en" ? "Battery" : "电池", icon: "▮" },
                { label: l === "ar" ? "الأحمال" : l === "en" ? "Loads" : "负载", icon: "⌂" },
              ]}
            />
            <p className="mt-3 flex items-center gap-2 text-caption text-text-muted">
              <Check className="size-4 text-primary-hover" aria-hidden="true" />
              {copy ? t(copy.k4, l) : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Linked products */}
      {linkedProducts.length > 0 && (
        <section className="section bg-surface">
          <div className="wrap">
            <h2 className="text-h2 font-semibold text-navy">{ui("product.related", l)}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {linkedProducts.map((p) => (
                <ProductCard key={p.id} locale={l} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand locale={l} variant="split" title={pages.systems.list.k12} text={pages.systems.list.k13} primaryHref="/contact" primaryLabelKey="cta.contactUs" />
      <StickyWhatsAppBar locale={l} message={waMsg} name={name} />
    </>
  );
}
