import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import Hero from "@/components/Hero";
import CTABand from "@/components/CTABand";
import { categoryIcon } from "@/components/Cards";
import CategoryClient from "@/components/CategoryClient";
import { categories, pages, products } from "@/data";
import { localizedHref, t } from "@/lib/i18n";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES } from "@/lib/whatsapp";
import { webp } from "@/lib/images";
import type { Locale } from "@/data";

export function generateStaticParams() {
  const locales = ["ar", "en", "zh"];
  const slugs = categories.map((c) => c.id);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = categories.find((c) => c.id === slug);
  return { title: cat ? t(cat.name, locale as Locale) : undefined };
}

/** Per-category hero images (§3.8.1). */
const HERO_IMAGES: Record<string, string> = {
  panels: "/images/photos/panels-rows.jpg",
  inverters: "/images/photos/inverter-unit.jpg",
  batteries: "/images/photos/battery-storage.jpg",
  pumps: "/images/photos/pump-flow.jpg",
  controllers: "/images/photos/controller-unit.jpg",
  systems: "/images/photos/solar-farm.jpg",
  "storage-ci": "/images/photos/battery-storage.jpg",
  cameras: "/images/photos/controller-unit.jpg",
};

/** Category page (§3.8): split hero → tabs → filter bar → 4-col grid → related categories → CTA. */
export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const cat = categories.find((c) => c.id === slug);
  if (!cat) notFound();
  const items = products.filter((p) => p.categoryId === slug && p.status === "published");
  const related = [
    { href: "/products/category/inverters", image: "/images/photos/villa-roof.jpg", title: { ar: "الطاقة للمنازل", en: "Energy for homes", zh: "家庭能源" } },
    { href: "/products/category/storage-ci", image: "/images/photos/solar-farm.jpg", title: { ar: "الطاقة للمنشآت التجارية", en: "Energy for commercial facilities", zh: "商业设施能源" } },
    { href: "/systems", image: "/images/photos/solar-farm.jpg", title: { ar: "الطاقة للمشاريع الكبرى", en: "Energy for large projects", zh: "大型项目能源" } },
    { href: "/products/category/batteries", image: "/images/photos/battery-storage.jpg", title: { ar: "حلول التخزين", en: "Storage solutions", zh: "储能解决方案" } },
  ];

  return (
    <>
      <Hero
        locale={l}
        variant="split"
        image={HERO_IMAGES[cat.id] ?? "/images/photos/solar-farm.jpg"}
        imageAlt={t(cat.name, l)}
        title={{
          ar: `${cat.name.ar} ${ui("category.heroSuffix", "ar")}`,
          en: `${cat.name.en ?? cat.name.ar} ${ui("category.heroSuffix", "en")}`,
          zh: `${cat.name.zh ?? cat.name.ar} ${ui("category.heroSuffix", "zh")}`,
        }}
        text={cat.note}
        whatsapp
        whatsappVariant="navy-pill"
        waMessage={WA_MESSAGES.category(t(cat.name, l), `https://ghamdan-website.vercel.app/${locale}/products/category/${cat.id}`)[l]}
        crumbs={[
          { label: t(pages.home.k38, l), href: localizedHref(l, "/") },
          { label: t(pages.catalog.k1, l), href: localizedHref(l, "/products") },
          { label: t(cat.name, l) },
        ]}
      />

      {/* 8.2 Category tabs */}
      <div className="border-b border-border bg-surface">
        <div className="wrap flex gap-1 overflow-x-auto py-3">
          <Link
            href={localizedHref(l, "/products")}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-text-muted transition-colors hover:bg-surface-muted hover:text-primary"
          >
            {ui("category.allProducts", l)}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={localizedHref(l, `/products/category/${c.id}`)}
              aria-current={c.id === cat.id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                c.id === cat.id ? "bg-primary text-white" : "text-text-muted hover:bg-surface-muted hover:text-primary"
              }`}
            >
              {categoryIcon(c.icon)}
              {t(c.name, l)}
            </Link>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <CategoryClient locale={l} categoryId={cat.id} initial={items} />
        </div>
      </section>

      {/* 8.6 Related categories */}
      <section className="section bg-surface">
        <div className="wrap">
          <h2 className="text-h2 font-extrabold text-primary">{ui("related.categories", l)}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {related.map((r, i) => (
              <Link key={i} href={localizedHref(l, r.href)} className="group overflow-hidden rounded-card bg-bg shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="overflow-hidden">
                  <img src={webp(r.image)} alt={t(r.title, l)} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-2 p-5">
                  <h3 className="text-h4 font-extrabold text-primary">{t(r.title, l)}</h3>
                  <ArrowLeft className="size-5 shrink-0 text-accent transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8.7 CTA whatsapp variant + photo right + mini-features */}
      <CTABand
        locale={l}
        variant="whatsapp"
        image="/images/photos/panels-rows.jpg"
        imageAlt={t(pages.contact.k1, l)}
        title={pages.catalog.k19}
        text={pages.catalog.k20}
        features={[
          { icon: <Zap className="size-4" aria-hidden="true" />, title: { ar: "إجابات سريعة", en: "Quick answers", zh: "快速答复" } },
          { icon: <MessageCircle className="size-4" aria-hidden="true" />, title: { ar: "استشارات مخصصة", en: "Tailored advice", zh: "定制咨询" } },
          { icon: <ShieldCheck className="size-4" aria-hidden="true" />, title: { ar: "بدون أي التزام", en: "No obligation", zh: "无任何义务" } },
        ]}
      />
    </>
  );
}
