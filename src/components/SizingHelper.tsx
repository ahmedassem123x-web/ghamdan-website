"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AirVent,
  Calculator,
  Droplets,
  Fan,
  Laptop,
  Lightbulb,
  Minus,
  Plus,
  Refrigerator,
  RotateCcw,
  Tv,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { localizedHref, t } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import { withGradientWord } from "@/components/headingHighlight";
import { bundles, type Locale, type LocalizedString } from "@/data";

/**
 * "احسب احتياجك" sizing helper (Phase 4).
 *
 * The user picks appliances with +/- steppers. Every load is a generic
 * household/commercial load with a typical wattage CLEARLY labeled as a
 * rough estimate ("تقديرات تقريبية") — actual loads vary by model and use.
 * The helper suggests a system-size RANGE and the closest confirmed-bundle
 * category, then hands off to WhatsApp with the summary prefilled.
 *
 * Hard rules honored: NO prices anywhere, NO exact-spec claims (ranges +
 * "تقديري" throughout, final design is the engineering team's), NO
 * invented products (bundles come from the real `bundles` data, confirmed
 * only — bundle-4 archived is never suggested). Copy lives here as a local
 * trilingual record (ui-copy.ts is owned by another worker).
 *
 * Result updates live as quantities change; the result region is
 * aria-live="polite". Steppers are real buttons with labels.
 */

const COPY: Record<string, LocalizedString> = {
  title: { ar: "احسب احتياجك", en: "Estimate your needs", zh: "估算您的需求" },
  subtitle: {
    ar: "اختر أجهزتك وكمياتها، وسنقترح عليك حجم النظام الأقرب — تقدير أولي يساعدك قبل التواصل معنا.",
    en: "Pick your appliances and quantities and we will suggest the closest system size — a first estimate to help before you get in touch.",
    zh: "选择您的电器和数量，我们会建议最接近的系统容量——在联系我们之前提供初步估算。",
  },
  estimateNote: {
    ar: "الأحمال الظاهرة تقديرات تقريبية شائعة — تختلف حسب الموديل والاستخدام الفعلي، وليست مواصفات دقيقة.",
    en: "Loads shown are common rough estimates — they vary by model and actual use, and are not exact specifications.",
    zh: "所列负载为常见的粗略估计值——因型号和实际使用而异，并非精确规格。",
  },
  wattsEach: { ar: "واط (تقدير)", en: "W (estimate)", zh: "瓦（估计）" },
  decrease: { ar: "إنقاص الكمية", en: "Decrease quantity", zh: "减少数量" },
  increase: { ar: "زيادة الكمية", en: "Increase quantity", zh: "增加数量" },
  reset: { ar: "إعادة تعيين", en: "Reset", zh: "重置" },
  total: { ar: "إجمالي الحمل التقديري", en: "Estimated total load", zh: "估计总负载" },
  empty: {
    ar: "اختر جهازًا واحدًا على الأقل لعرض التقدير.",
    en: "Choose at least one appliance to see the estimate.",
    zh: "请至少选择一种电器以查看估算。",
  },
  suggestedSize: { ar: "حجم النظام المقترح (تقديري)", en: "Suggested system size (estimate)", zh: "建议系统容量（估计）" },
  closestBundle: { ar: "أقرب فئة باقات", en: "Closest bundle category", zh: "最接近的套餐类别" },
  disclaimer: {
    ar: "تقدير أولي فقط — يحدد الفريق الهندسي التصميم النهائي بعد مراجعة احتياجك الفعلي.",
    en: "A first estimate only — our engineering team confirms the final design after reviewing your actual needs.",
    zh: "仅为初步估算——工程团队在审核您的实际需求后确定最终设计。",
  },
  whatsapp: { ar: "أرسل النتيجة عبر واتساب", en: "Send the result via WhatsApp", zh: "通过 WhatsApp 发送结果" },
  viewBundle: { ar: "عرض الباقة", en: "View bundle", zh: "查看套餐" },
  titleWord: { ar: "احتياجك", en: "needs", zh: "需求" },
  stripTitle: { ar: "احسب احتياجك قبل أن تتواصل", en: "Estimate your needs before you get in touch", zh: "联系我们之前，先估算您的需求" },
  stripText: {
    ar: "اختر أجهزتك واحصل على تقدير أولي لحجم النظام المناسب.",
    en: "Pick your appliances and get a first estimate of the right system size.",
    zh: "选择您的电器，初步估算合适的系统容量。",
  },
  stripCta: { ar: "احسب احتياجك", en: "Calculate your needs", zh: "估算我的需求" },
};

type Appliance = {
  id: string;
  watts: number;
  max: number;
  icon: LucideIcon;
  name: LocalizedString;
};

/** Generic household/commercial loads only — typical watts, estimates. */
const APPLIANCES: Appliance[] = [
  { id: "lights", watts: 12, max: 20, icon: Lightbulb, name: { ar: "نقطة إضاءة LED", en: "LED light point", zh: "LED 灯点" } },
  { id: "fan", watts: 75, max: 10, icon: Fan, name: { ar: "مروحة", en: "Fan", zh: "风扇" } },
  { id: "tv", watts: 120, max: 10, icon: Tv, name: { ar: "شاشة / تلفاز", en: "TV / screen", zh: "电视/屏幕" } },
  { id: "fridge", watts: 150, max: 10, icon: Refrigerator, name: { ar: "ثلاجة", en: "Fridge", zh: "冰箱" } },
  { id: "washer", watts: 500, max: 10, icon: WashingMachine, name: { ar: "غسالة ملابس", en: "Washing machine", zh: "洗衣机" } },
  { id: "pump", watts: 750, max: 10, icon: Droplets, name: { ar: "مضخة مياه", en: "Water pump", zh: "水泵" } },
  { id: "charging", watts: 65, max: 10, icon: Laptop, name: { ar: "لابتوب وشحن هواتف", en: "Laptop & phone charging", zh: "笔记本电脑与手机充电" } },
  { id: "ac", watts: 1500, max: 10, icon: AirVent, name: { ar: "مكيف هواء", en: "Air conditioner", zh: "空调" } },
];

type Band = { maxWatts: number; range: LocalizedString; bundleSlug: string };

/** Total typical watts → size range + closest confirmed-bundle category.
 * Bands are deliberately coarse: this is a first estimate, not a design. */
const BANDS: Band[] = [
  { maxWatts: 1000, range: { ar: "حتى 1 kW تقريبًا", en: "up to about 1 kW", zh: "约 1 kW 以内" }, bundleSlug: "bundle-1" },
  { maxWatts: 3000, range: { ar: "1–3 kW تقريبًا", en: "about 1–3 kW", zh: "约 1–3 kW" }, bundleSlug: "bundle-1" },
  { maxWatts: 6000, range: { ar: "3–6 kW تقريبًا", en: "about 3–6 kW", zh: "约 3–6 kW" }, bundleSlug: "bundle-2" },
  { maxWatts: Number.POSITIVE_INFINITY, range: { ar: "أكثر من 6 kW تقريبًا", en: "more than about 6 kW", zh: "约 6 kW 以上" }, bundleSlug: "bundle-3" },
];

export default function SizingHelper({ locale }: { locale: Locale }) {
  const [qty, setQty] = useState<Record<string, number>>({});

  const total = useMemo(
    () => APPLIANCES.reduce((sum, a) => sum + (qty[a.id] ?? 0) * a.watts, 0),
    [qty],
  );
  const selected = APPLIANCES.filter((a) => (qty[a.id] ?? 0) > 0);
  const band = total > 0 ? BANDS.find((b) => total <= b.maxWatts) ?? null : null;
  const bundle = band ? bundles.find((b) => b.slug === band.bundleSlug && b.status === "confirmed") ?? null : null;

  const waText = useMemo(() => {
    if (total <= 0 || !band) return "";
    const lines = selected.map(
      (a) => `• ${t(a.name, locale)} × ${qty[a.id]} (${(qty[a.id] ?? 0) * a.watts}W)`,
    );
    if (locale === "ar") {
      return `مرحباً غمدان — نتيجة «احسب احتياجك» (تقديرات تقريبية):\n${lines.join("\n")}\nإجمالي الحمل التقديري: ${total}W\nحجم النظام المقترح: ${t(band.range, locale)}\nأرجو تصميم النظام المناسب.`;
    }
    if (locale === "en") {
      return `Hello Ghamdan — “Estimate your needs” result (rough estimates):\n${lines.join("\n")}\nEstimated total load: ${total}W\nSuggested system size: ${t(band.range, locale)}\nPlease design the right system.`;
    }
    return `您好 — “估算需求”结果（粗略估计）：\n${lines.join("\n")}\n估计总负载：${total}W\n建议系统容量：${t(band.range, locale)}\n请设计合适的系统。`;
  }, [total, band, selected, qty, locale]);

  const set = (id: string, next: number, max: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(max, next)) }));

  return (
    <div className="card-luxe p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">
          <Calculator className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-h3 font-semibold text-navy">{withGradientWord(t(COPY.title, locale), t(COPY.titleWord, locale))}</h2>
          <p className="mt-1 text-body-sm text-text-muted">{t(COPY.subtitle, locale)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-card border border-sky bg-sky p-4">
        <Zap className="mt-0.5 size-5 shrink-0 text-primary-hover" aria-hidden="true" />
        <p className="text-sm font-bold text-navy">{t(COPY.estimateNote, locale)}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {APPLIANCES.map((a) => {
          const Icon = a.icon;
          const count = qty[a.id] ?? 0;
          return (
            <div
              key={a.id}
              className={`flex items-center gap-3 rounded-card border p-3 transition-colors duration-200 ${
                count > 0 ? "border-primary-hover bg-sky/40" : "border-border bg-surface"
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-navy">{t(a.name, locale)}</span>
                <span className="block text-xs text-text-muted" dir="ltr">
                  {a.watts}W · {t(COPY.wattsEach, locale)}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1" dir="ltr">
                <button
                  type="button"
                  onClick={() => set(a.id, count - 1, a.max)}
                  disabled={count === 0}
                  aria-label={`${t(COPY.decrease, locale)} — ${t(a.name, locale)}`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-navy transition-colors duration-200 hover:border-primary-hover hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="min-w-7 text-center font-latin text-base font-extrabold text-navy" aria-live="off">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => set(a.id, count + 1, a.max)}
                  disabled={count >= a.max}
                  aria-label={`${t(COPY.increase, locale)} — ${t(a.name, locale)}`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-navy transition-colors duration-200 hover:border-primary-hover hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setQty({})}
          disabled={total === 0}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t(COPY.reset, locale)}
        </button>
      </div>

      {/* Result — live region; always rendered so the layout never jumps. */}
      <div aria-live="polite" className="mt-4 rounded-card border border-border bg-surface p-5">
        {total === 0 || !band ? (
          <p className="text-body-sm text-text-muted">{t(COPY.empty, locale)}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-navy">{t(COPY.total, locale)}</span>
              <span className="font-latin text-3xl font-extrabold text-navy" dir="ltr">
                {total.toLocaleString("en-US")}W
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
              <span className="text-sm font-bold text-navy">{t(COPY.suggestedSize, locale)}</span>
              <span className="font-latin text-xl font-extrabold text-brand-red" dir="ltr">
                {t(band.range, locale)}
              </span>
            </div>
            {bundle && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-navy">{t(COPY.closestBundle, locale)}</span>
                <Link
                  href={localizedHref(locale, `/systems/${bundle.slug}`)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-hover transition-colors hover:text-primary-hover"
                >
                  {t(bundle.name, locale)}
                  <ArrowIcon className="size-4 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            )}
            <p className="mt-4 text-body-sm text-text-muted">{t(COPY.disclaimer, locale)}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={total > 0 ? waLink(waText) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={total === 0}
                className={`inline-flex items-center gap-2 rounded-[0.625rem] px-6 py-3 font-bold text-button text-white transition-transform duration-200 ${
                  total > 0 ? "bg-whatsapp hover:-translate-y-0.5" : "cursor-not-allowed bg-text-muted opacity-60"
                }`}
                onClick={(e) => {
                  if (total === 0) e.preventDefault();
                }}
              >
                <WhatsAppIcon className="size-5" aria-hidden="true" />
                {t(COPY.whatsapp, locale)}
              </a>
              {bundle && (
                <Link href={localizedHref(locale, `/systems/${bundle.slug}`)} className="btn btn-outline">
                  {t(COPY.viewBundle, locale)}
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Slim link strip to the helper — embedded on solution + system detail
 * pages so the helper is one tap away wherever the user is deciding. */
export function SizingStrip({ locale }: { locale: Locale }) {
  return (
    <section className="section-sm bg-mesh-sky">
      <div className="wrap">
        <div
          data-reveal="fade"
          className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky text-primary-hover">
              <Calculator className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-h4 font-semibold text-navy">{t(COPY.stripTitle, locale)}</h2>
              <p className="mt-1 text-body-sm text-text-muted">{t(COPY.stripText, locale)}</p>
            </div>
          </div>
          <Link href={localizedHref(locale, "/systems#sizing-helper")} className="btn btn-navy">
            {t(COPY.stripCta, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
