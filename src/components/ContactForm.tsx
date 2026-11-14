"use client";

import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES, waLink, recordWaClick } from "@/lib/whatsapp";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale, LocalizedString } from "@/data";

/**
 * Contact form (§3.7 + §4.10, spec fields — NOT the data's 5-option form):
 * الاسم الكامل * / البريد الإلكتروني * (side by side) / نوع الاستفسار *
 * (SIX options) / رسالتك * — validates locally, records the inquiry in
 * localStorage `gts_inquiries` (shown in the admin demo), then hands the
 * message to WhatsApp. It does NOT send email and stores nothing externally.
 */
const TYPE_OPTIONS: LocalizedString[] = [
  { ar: "استفسار عن منتج", en: "Product enquiry" },
  { ar: "استفسار عن نظام جاهز", en: "Ready-made system enquiry" },
  { ar: "طلب صيانة", en: "Maintenance request" },
  { ar: "دراسة نظام لمنشأة", en: "System study for a facility" },
  { ar: "استشارة اختيار نظام", en: "System selection consultation" },
  { ar: "استفسار عام", en: "General enquiry" },
];

export interface StoredInquiry {
  name: string;
  email: string;
  type: string;
  message: string;
  at: string;
  locale: Locale;
}

export function recordInquiry(inquiry: StoredInquiry) {
  try {
    const raw = localStorage.getItem("gts_inquiries");
    const list: StoredInquiry[] = raw ? JSON.parse(raw) : [];
    list.unshift(inquiry);
    localStorage.setItem("gts_inquiries", JSON.stringify(list.slice(0, 50)));
  } catch {
    // localStorage unavailable (private mode) — the WhatsApp handoff still works.
  }
}

export default function ContactForm({ locale }: { locale: Locale }) {
  const c = pages.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (name.trim().length < 2) errs.push(t(c.k12, locale));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.push(ui("form.invalidEmail", locale));
    if (message.trim().length < 10) errs.push(ui("form.shortMessage", locale));
    setErrors(errs);
    if (errs.length === 0) {
      recordInquiry({
        name: name.trim(),
        email: email.trim(),
        type: t(TYPE_OPTIONS[type], locale),
        message: message.trim(),
        at: new Date().toISOString(),
        locale,
      });
      setReady(true);
    }
  };

  if (ready) {
    const text = WA_MESSAGES.contact(name.trim(), email.trim(), t(TYPE_OPTIONS[type], locale), message.trim())[locale];
    return (
      <div className="rounded-card border border-accent bg-accent-soft p-6">
        <p className="font-bold text-primary">{t(c.k24, locale)}</p>
        <p className="mt-2 text-body-sm text-text-muted">{t(c.k25, locale)}</p>
        <a
          href={waLink(text)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-[0.625rem] bg-whatsapp px-5 py-2.5 font-bold text-button text-white transition-all hover:-translate-y-0.5"
          onClick={() =>
            recordWaClick({ source: "contact", sourceId: "form", pageUrl: window.location.href, locale, ctaId: "contact-form" })
          }
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          {ui("form.openWhatsapp", locale)}
        </a>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body text-text placeholder:text-text-faint focus:border-accent focus:outline-none";
  return (
    <form onSubmit={submit} noValidate className="rounded-card bg-surface p-6 shadow-card md:p-8">
      <h2 className="text-h3 font-extrabold text-primary">{t(c.k27, locale)}</h2>
      {errors.length > 0 && (
        <div role="alert" className="mt-4 rounded-[0.625rem] border border-danger/40 bg-danger/5 px-4 py-3 text-sm font-bold text-danger">
          <ul className="list-disc ps-5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-primary">
            {t(c.k12, locale)} <span className="text-danger">*</span>
          </span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-primary">
            {locale === "ar" ? "البريد الإلكتروني" : locale === "en" ? "Email" : "电子邮箱"} <span className="text-danger">*</span>
          </span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} dir="ltr" autoComplete="email" required />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-bold text-primary">
          {t(c.k15, locale)} <span className="text-danger">*</span>
        </span>
        <select value={type} onChange={(e) => setType(Number(e.target.value))} className={inputCls}>
          {TYPE_OPTIONS.map((o, i) => (
            <option key={i} value={i}>
              {t(o, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-bold text-primary">
          {t(c.k21, locale)} <span className="text-danger">*</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={inputCls}
          placeholder={ui("form.messagePlaceholder", locale)}
          required
        />
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[0.625rem] bg-primary px-6 py-3 font-bold text-button text-white transition-all hover:-translate-y-0.5 hover:bg-primary-deep"
      >
        {ui("cta.sendMessage", locale)}
        <ArrowLeft className="size-5 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
      </button>
      <p className="mt-4 text-caption text-text-muted">{t(c.k23, locale)}</p>
    </form>
  );
}
