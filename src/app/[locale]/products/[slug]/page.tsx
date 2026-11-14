import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Settings2, Truck, MessageCircle, Check } from "lucide-react";
import CTABand from "@/components/CTABand";
import ProductCard from "@/components/ProductCard";
import Gallery from "@/components/Gallery";
import StickyWhatsAppBar from "@/components/StickyWhatsAppBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Breadcrumbs, EditorialBlock, Reveal, SpecTable } from "@/components/ui";
import { pages, products, categories, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import type { Locale } from "@/data";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["ar", "en", "zh"]) {
    for (const p of products.filter((x) => x.status === "published")) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return { title: p ? t(p.name, "ar") : "" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const product = products.find((x) => x.slug === slug && x.status === "published");
  if (!product) notFound();
  const copy = pages.productDetail[product.id];
  const cat = categories.find((c) => c.id === product.categoryId);
  const name = t(product.name, l);
  const siteUrl = `https://ghamdan-website.vercel.app/${l}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, product.model, siteUrl)[l];
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === "published")
    .slice(0, 3);
  const specRows = product.specs.map((s) => ({ label: t(s.label, l), value: s.value }));
  const galleryItems = product.image
    ? [{ src: product.image, alt: name, caption: copy ? t(copy.k3, l) : undefined }]
    : [];

  return (
    <>
      <div className="bg-surface">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.products", l), href: localizedHref(l, "/products") },
            ...(cat ? [{ label: t(cat.name, l), href: localizedHref(l, `/products/category/${cat.id}`) }] : []),
            { label: name },
          ]}
        />
        <div className="wrap grid gap-10 py-10 md:grid-cols-2 md:py-14">
          {/* Gallery */}
          <Reveal>
            {galleryItems.length > 0 ? (
              <Gallery items={galleryItems} label={name} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-image bg-surface-blue">
                <span className="font-latin text-6xl font-extrabold text-sky" dir="ltr">
                  {product.brand.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {copy && <p className="mt-3 text-caption text-text-muted">{t(copy.k3, l)}</p>}
          </Reveal>

          {/* Summary */}
          <Reveal>
            {cat && (
              <p className="text-sm font-bold text-accent">
                <Link href={localizedHref(l, `/products/category/${cat.id}`)} className="hover:underline">
                  {t(cat.name, l)}
                </Link>
              </p>
            )}
            <h1 className="mt-2 text-h1 font-extrabold leading-[1.2] text-primary">{name}</h1>
            {product.model && (
              <p className="mt-2 font-latin text-lg font-bold text-text-muted" dir="ltr">
                {product.model}
              </p>
            )}
            {product.overview && <p className="mt-4 text-body text-text-muted">{t(product.overview, l)}</p>}
            <p className="mt-4 rounded-[0.625rem] bg-accent-soft px-4 py-3 text-sm font-bold text-primary">
              {copy ? t(copy.k5, l) : t(siteSettings.inquiryPolicy, l)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton locale={l} message={waMsg} label={ui("cta.enquire", l)} source="product" sourceId={product.id} variant="green-pill" />
              <Link href={localizedHref(l, "/contact")} className="inline-flex items-center justify-center gap-2 rounded-[0.625rem] border-2 border-primary px-5 py-2.5 font-bold text-button text-primary transition-all hover:-translate-y-0.5 hover:bg-surface-muted">
                {ui("cta.contactUs", l)}
              </Link>
            </div>
            {/* Trust badges */}
            {copy && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: <BadgeCheck className="size-6" aria-hidden="true" />, t1: t(copy.k6, l), t2: t(copy.k7, l) },
                  { icon: <Truck className="size-6" aria-hidden="true" />, t1: t(copy.k8, l), t2: t(copy.k9, l) },
                  { icon: <MessageCircle className="size-6" aria-hidden="true" />, t1: t(copy.k10, l), t2: t(copy.k11, l) },
                ].map((b, i) => (
                  <div key={i} className="rounded-card border border-border bg-surface p-4 text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">{b.icon}</div>
                    <p className="mt-2 text-sm font-extrabold text-primary">{b.t1}</p>
                    <p className="text-caption text-text-muted">{b.t2}</p>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* Overview — EditorialBlock, image left, on surface-muted panel (§3.6) */}
      <section className="section">
        <div className="wrap rounded-card bg-surface-muted p-6 md:p-10">
          <EditorialBlock
            image="/images/photos/villa-roof.jpg"
            imageAlt={name}
            title={name}
            text={product.overview ? t(product.overview, l) : undefined}
            flip
            eyebrow={
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
                {copy ? t(copy.k12, l) : ui("product.overview", l)}
              </span>
            }
          />
        </div>
      </section>

      {/* Benefits — 4-col feature grid when present (§3.6) */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="section-sm">
          <div className="wrap">
            <h2 className="text-h2 font-extrabold text-primary">{copy ? t(copy.k2, l) : ui("product.features", l)}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
              {product.benefits.map((b, i) => (
                <div key={i} className="rounded-card border border-border bg-surface p-6 shadow-card">
                  <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-bold text-primary">{t(b, l)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specs — product image beside the table (§3.6) */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <Reveal>
            {galleryItems.length > 0 ? (
              <Gallery items={galleryItems} label={name} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-image bg-surface-blue">
                <span className="font-latin text-6xl font-extrabold text-sky" dir="ltr">
                  {product.brand.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </Reveal>
          <Reveal>
            <h2 className="text-h2 font-extrabold text-primary">{copy ? t(copy.k13, l) : ui("product.specs", l)}</h2>
            <div className="mt-4">
              <SpecTable rows={specRows} />
            </div>
            <p className="mt-3 text-body-sm text-text-muted">{ui("product.specsNote", l)}</p>
            {/* Warranty line (CI-08: unified text pending approval — no duration) */}
            <p className="mt-5 rounded-[0.625rem] bg-accent-soft px-4 py-3 text-sm font-bold text-primary">
              {t(siteSettings.warranty.text, l)}{" "}
              <Link href={localizedHref(l, "/support")} className="text-accent underline underline-offset-2 hover:text-accent-strong">
                {ui("nav.support", l)}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-surface">
          <div className="wrap">
            <h2 className="text-h2 font-extrabold text-primary">{copy ? t(copy.k14, l) : ui("product.related", l)}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              {related.map((p) => (
                <ProductCard key={p.id} locale={l} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {copy && (
        <CTABand
          locale={l}
          variant="features"
          image="/images/photos/panels-rows.jpg"
          imageAlt={t(copy.k15, l)}
          title={copy.k15}
          text={copy.k16}
          features={[
            { icon: <MessageCircle className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
            { icon: <BadgeCheck className="size-4" aria-hidden="true" />, title: { ar: "إرشاد متخصص", en: "Specialist guidance", zh: "专业指导" } },
            { icon: <Settings2 className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          ]}
        />
      )}
      <StickyWhatsAppBar locale={l} message={waMsg} name={name} />
    </>
  );
}
