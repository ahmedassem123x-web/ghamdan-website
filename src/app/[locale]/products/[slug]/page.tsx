import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckIcon, SettingsIcon, WhatsAppIcon, PackageIcon } from "@/components/icons";
import CTABand from "@/components/CTABand";
import ProductCard from "@/components/ProductCard";
import Gallery from "@/components/Gallery";
import StickyWhatsAppBar from "@/components/StickyWhatsAppBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Breadcrumbs, EditorialBlock, SpecTable } from "@/components/ui";
import { pages, products, categories, siteSettings } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { detailMetadata } from "@/lib/metadata";
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
  const { locale, slug } = await params;
  const l = locale as Locale;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  const name = t(p.name, l);
  const description = p.overview ? t(p.overview, l) : name;
  return detailMetadata({ locale: l, path: `/products/${p.slug}`, title: name, description });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const product = products.find((x) => x.slug === slug && x.status === "published");
  if (!product) notFound();
  const copy = pages.productDetail[product.id];
  const cat = categories.find((c) => c.id === product.categoryId);
  const name = t(product.name, l);
  const model = typeof product.model === "string" ? product.model : t(product.model, l);
  const siteUrl = `https://ghamdan-website.vercel.app/${l}/products/${product.slug}`;
  const waMsg = WA_MESSAGES.product(name, model, siteUrl)[l];
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === "published")
    .slice(0, 3);
  const specRows = product.specs.map((s) => ({ label: t(s.label, l), value: typeof s.value === "string" ? s.value : t(s.value, l) }));
  const galleryItems = product.image
    ? [{ src: product.image, alt: name, caption: copy ? t(copy.k3, l) : undefined }]
    : [];

  return (
    <>
      {/* Photo-bg hero: breadcrumbs + gallery + summary on a light mesh */}
      <div data-reveal="up" className="bg-mesh-light">
        <Breadcrumbs
          locale={l}
          items={[
            { label: ui("nav.home", l), href: localizedHref(l, "/") },
            { label: ui("nav.products", l), href: localizedHref(l, "/products") },
            ...(cat ? [{ label: l === "ar" && cat.id === "inverters" ? (
              <>
                <span className="hidden sm:inline">{t(cat.name, l)}</span>
                <span className="sm:hidden">العواكس</span>
              </>
            ) : t(cat.name, l), href: localizedHref(l, `/products/category/${cat.id}`) }] : []),
            { label: name },
          ]}
        />
        <div data-stagger className="wrap grid gap-10 py-10 md:grid-cols-2 md:py-14">
          {/* Gallery — visible by default (was <Reveal>). M-1 preserved:
              Gallery renders a single image large at 4:3. */}
          <div>
            {galleryItems.length > 0 ? (
              <Gallery items={galleryItems} label={name} locale={l} vtName={`product-${product.id}`} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-image bg-sky">
                <span className="font-latin text-6xl font-extrabold text-primary" dir="ltr">
                  {product.brand.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {copy && <p data-reveal="fade" className="mt-3 text-caption text-text-muted">{t(copy.k3, l)}</p>}
          </div>

          {/* Summary — visible by default (was <Reveal>). */}
          <div>
            {cat && (
              <p data-reveal="fade" className="text-sm font-bold text-primary-hover">
                <Link href={localizedHref(l, `/products/category/${cat.id}`)} className="hover:underline">
                  {t(cat.name, l)}
                </Link>
              </p>
            )}
            <h1 data-reveal="up" className="mt-2 break-words text-h1 font-bold leading-[1.2] text-navy">{name}</h1>
            {model && (
              <p data-reveal="fade" className="mt-2 font-latin text-lg font-bold text-text-muted" dir="ltr">
                {model}
              </p>
            )}
            {product.overview && <p data-reveal="fade" className="mt-4 text-body text-text-muted">{t(product.overview, l)}</p>}
            {/* Few benefits (< 3): compact chips row here in the hero
                instead of a full sky section (item 6). */}
            {product.benefits && product.benefits.length > 0 && product.benefits.length < 3 && (
              <ul data-reveal="fade" className="mt-4 flex flex-wrap gap-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-bold text-navy">
                    <CheckIcon className="size-4 shrink-0 text-primary-hover" aria-hidden="true" />
                    {t(b, l)}
                  </li>
                ))}
              </ul>
            )}
            <p data-reveal="scale" className="mt-4 rounded-[0.625rem] bg-sky px-4 py-3 text-sm font-bold text-navy">
              {copy ? t(copy.k5, l) : t(siteSettings.inquiryPolicy, l)}
            </p>
            <div data-reveal="up" className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton locale={l} message={waMsg} label={ui("cta.enquire", l)} source="product" sourceId={product.id} variant="green-pill" />
              <Link href={localizedHref(l, "/contact")} className="btn btn-outline">
                {ui("cta.contactUs", l)}
              </Link>
            </div>
            {/* Trust badges */}
            {copy && (
              <div data-stagger className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: <CheckIcon className="size-6" aria-hidden="true" />, t1: t(copy.k6, l), t2: t(copy.k7, l) },
                  { icon: <PackageIcon className="size-6" aria-hidden="true" />, t1: t(copy.k8, l), t2: t(copy.k9, l) },
                  { icon: <WhatsAppIcon className="size-6" aria-hidden="true" />, t1: t(copy.k10, l), t2: t(copy.k11, l) },
                ].map((b, i) => (
                  <div key={i} className="card-luxe p-4 text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-sky text-primary-hover">{b.icon}</div>
                    <p className="mt-2 text-sm font-extrabold text-navy">{b.t1}</p>
                    <p className="text-caption text-text-muted">{b.t2}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview — EditorialBlock, image left, on surface-muted panel (§3.6) */}
      <section data-reveal="fade" className="section bg-white">
        <div className="wrap rounded-card bg-surface-muted p-6 md:p-10">
          <div data-reveal="left">
          <EditorialBlock
            image="/images/photos/villa-roof.jpg"
            imageAlt={name}
            title={name}
            text={product.overview ? t(product.overview, l) : undefined}
            flip
            eyebrow={
              <span className="section-marker" aria-hidden="true" />
            }
          />
          </div>
        </div>
      </section>

      {/* Benefits — full 4-col feature grid only when there are 3+ of
          them (§3.6, sky mesh); fewer benefits render as chips in the
          hero above (item 6). */}
      {product.benefits && product.benefits.length >= 3 && (
        <section data-reveal="left" className="section-sm bg-mesh-sky">
          <div className="wrap">
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{copy ? t(copy.k2, l) : ui("product.features", l)}</h2>
            </div>
            <div data-stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {product.benefits.map((b, i) => (
                <div key={i} className="card-luxe p-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-sky text-primary-hover">
                    <CheckIcon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-bold text-navy">{t(b, l)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specs — full-width table (§3.6). The second Gallery that used
          to sit beside the table repeated the hero photo with the same
          title/description, so it is gone (item 27c). C-2 preserved: the
          table renders the data's real spec labels/values, never "—". */}
      <section data-reveal="right" className="section bg-white">
        <div className="wrap">
          <div data-reveal="fade">
            <div className="mb-4">
              <span className="section-marker" aria-hidden="true" />
            </div>
            <h2 className="text-h2 font-semibold text-navy">{copy ? t(copy.k13, l) : ui("product.specs", l)}</h2>
          </div>
          <div data-reveal="fade" className="mt-4 max-w-4xl">
            <SpecTable rows={specRows} />
          </div>
          <p data-reveal="fade" className="mt-3 max-w-4xl text-body-sm text-text-muted">{ui("product.specsNote", l)}</p>
          {/* Warranty (item 27a): one honest line here; the pending-approval
              note itself lives on the Support & Warranty page. */}
          <p data-reveal="fade" className="mt-5 max-w-4xl rounded-[0.625rem] bg-sky px-4 py-3 text-sm font-bold text-navy">
            {l === "ar"
              ? "الضمان حسب كتيب الشركة — يُرفق عند الطلب عبر واتساب."
              : l === "en"
                ? "Warranty per the manufacturer's booklet — shared on request via WhatsApp."
                : "保修以厂家手册为准 — 可通过 WhatsApp 索取。"}
          </p>
        </div>
      </section>

      {/* Related — sand band */}
      {related.length > 0 && (
        <section data-reveal="up" className="section bg-sand">
          <div className="wrap">
            <div data-reveal="fade">
              <div className="mb-4">
                <span className="section-marker" aria-hidden="true" />
              </div>
              <h2 className="text-h2 font-semibold text-navy">{copy ? t(copy.k14, l) : ui("product.related", l)}</h2>
            </div>
            <div data-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            { icon: <WhatsAppIcon className="size-4" aria-hidden="true" />, title: { ar: "استشارة مجانية", en: "Free consultation", zh: "免费咨询" } },
            { icon: <CheckIcon className="size-4" aria-hidden="true" />, title: { ar: "إرشاد متخصص", en: "Specialist guidance", zh: "专业指导" } },
            { icon: <SettingsIcon className="size-4" aria-hidden="true" />, title: { ar: "حلول مخصصة", en: "Tailored solutions", zh: "定制解决方案" } },
          ]}
        />
      )}
      <StickyWhatsAppBar locale={l} message={waMsg} name={name} />
    </>
  );
}
