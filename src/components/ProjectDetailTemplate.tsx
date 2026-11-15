import { pages } from "@/data";
import { t } from "@/lib/i18n";
import { categoryIcon } from "./Cards";
import type { Locale } from "@/data";

/**
 * Project detail TEMPLATE (ref 10, pages.projectDetail.template): a
 * development template showing the section order of a project detail page.
 * It is rendered ONLY as a clearly-labelled preview on the projects index —
 * never as a routable page and never as a real project — until CI-07
 * approves real project content.
 */
export default function ProjectDetailTemplate({ locale }: { locale: Locale }) {
  const tpl = pages.projectDetail.template;
  const steps = [
    { title: tpl.k3, text: tpl.k4 },
    { title: tpl.k5, text: tpl.k6 },
    { title: tpl.k7, text: tpl.k8 },
    { title: tpl.k9, text: tpl.k10 },
  ];
  const equipment = [tpl.k21, tpl.k22, tpl.k23, tpl.k24];
  return (
    <article className="overflow-hidden rounded-card border-2 border-dashed border-border-strong bg-surface">
      {/* Honesty label */}
      <div className="bg-sky px-6 py-3">
        <p className="text-sm font-bold text-navy">{t(tpl.k11, locale)}</p>
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-h2 font-semibold text-navy">{t(tpl.k1, locale)}</h3>
        <p className="mt-3 text-body text-text-muted">{t(tpl.k2, locale)}</p>

        <h4 className="mt-8 text-h3 font-semibold text-navy">{t(tpl.k12, locale)}</h4>
        <p className="mt-2 text-body text-text-muted">{t(tpl.k13, locale)}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-card bg-background p-5">
            <h4 className="text-h4 font-semibold text-navy">{t(tpl.k14, locale)}</h4>
            <p className="mt-2 text-body-sm text-text-muted">{t(tpl.k15, locale)}</p>
          </div>
          <div className="rounded-card bg-background p-5">
            <h4 className="text-h4 font-semibold text-navy">{t(tpl.k16, locale)}</h4>
            <p className="mt-2 text-body-sm text-text-muted">{t(tpl.k17, locale)}</p>
          </div>
        </div>

        <h4 className="mt-8 text-h3 font-semibold text-navy">{t(tpl.k18, locale)}</h4>
        <p className="mt-2 text-body text-text-muted">{t(tpl.k19, locale)}</p>

        <h4 className="mt-8 text-h3 font-semibold text-navy">{t(tpl.k20, locale)}</h4>
        <ul className="mt-3 space-y-2">
          {equipment.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-body text-text-muted">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-hover" aria-hidden="true" />
              {t(e, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-body-sm font-bold text-navy">{t(tpl.k25, locale)}</p>

        <h4 className="mt-8 text-h3 font-semibold text-navy">{t(tpl.k26, locale)}</h4>
        <p className="mt-2 text-body-sm text-text-muted">{t(tpl.k27, locale)}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {steps.map((s, i) => (
            <div key={i} className="rounded-card bg-background p-5">
              <span className="font-latin text-3xl font-extrabold text-primary" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h5 className="mt-2 text-h4 font-semibold text-navy">{t(s.title, locale)}</h5>
              <p className="mt-1 text-body-sm text-text-muted">{t(s.text, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
