"use client";

import { useState } from "react";
import { AlertTriangle, MessageCircle } from "lucide-react";
import Hero from "@/components/Hero";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES, waLink, recordWaClick } from "@/lib/whatsapp";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale } from "@/data";

const USES = ["guidance.useIrrigation", "guidance.useDrinking", "guidance.useLivestock", "guidance.useCommercial", "guidance.useHome"] as const;

/**
 * Pumping guidance tool (CI-14): guidance ONLY — no sizing claim, no model
 * recommendation. Three questions → prepared WhatsApp message.
 */
export default function GuidanceClient({ locale }: { locale: Locale }) {
  const g = pages.guidance;
  const [depth, setDepth] = useState("");
  const [water, setWater] = useState("");
  const [use, setUse] = useState<(typeof USES)[number]>(USES[0]);
  const [error, setError] = useState("");

  const ready = depth.trim() !== "" && water.trim() !== "" && Number(depth) > 0 && Number(water) > 0;
  const text = ready
    ? WA_MESSAGES.guidance(depth.trim(), water.trim(), ui(use, locale))[locale]
    : "";

  return (
    <>
      <Hero locale={locale} variant="plain" title={g.k1} text={g.k2} whatsapp={false} />
      <section className="section">
        <div className="wrap max-w-3xl">
          {/* Mandatory safety copy */}
          <div className="flex items-start gap-3 rounded-card border border-sky bg-sky p-5">
            <AlertTriangle className="mt-0.5 size-6 shrink-0 text-primary-hover" aria-hidden="true" />
            <p className="font-bold text-navy">{ui("guidance.safety", locale)}</p>
          </div>

          <div className="mt-8 rounded-card bg-surface p-6 shadow-card md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-navy">{ui("guidance.depth", locale)}</span>
                <input
                  type="number"
                  min={1}
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body text-text focus:border-primary-hover focus:outline-none"
                  dir="ltr"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-navy">{ui("guidance.water", locale)}</span>
                <input
                  type="number"
                  min={1}
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body text-text focus:border-primary-hover focus:outline-none"
                  dir="ltr"
                />
              </label>
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-bold text-navy">{ui("guidance.use", locale)}</span>
              <select
                value={use}
                onChange={(e) => setUse(e.target.value as (typeof USES)[number])}
                className="w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body text-text focus:border-primary-hover focus:outline-none"
              >
                {USES.map((u) => (
                  <option key={u} value={u}>
                    {ui(u, locale)}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p role="alert" className="mt-4 rounded-[0.625rem] border border-error/40 bg-error/5 px-4 py-3 text-sm font-bold text-error">
                {error}
              </p>
            )}

            <p className="mt-5 text-body-sm text-text-muted">{t(g.k10, locale)}</p>
            <p className="mt-2 text-body-sm text-text-muted">{ui("guidance.review", locale)}</p>

            <a
              href={ready ? waLink(text) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!ready}
              className={`mt-6 inline-flex items-center gap-2 rounded-[0.625rem] px-6 py-3 font-bold text-button text-white transition-all ${
                ready ? "bg-whatsapp hover:-translate-y-0.5" : "cursor-not-allowed bg-text-muted opacity-60"
              }`}
              onClick={(e) => {
                if (!ready) {
                  e.preventDefault();
                  setError(ui("form.required", locale));
                  return;
                }
                recordWaClick({ source: "guidance", sourceId: "", pageUrl: window.location.href, locale, ctaId: "guidance-send" });
              }}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {ui("guidance.send", locale)}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
