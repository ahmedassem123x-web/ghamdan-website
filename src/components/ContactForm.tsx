"use client";

import { useRef, useState } from "react";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { ui } from "@/lib/ui-copy";
import { WA_MESSAGES, waLink } from "@/lib/whatsapp";
import { pages } from "@/data";
import { t } from "@/lib/i18n";
import type { Locale, LocalizedString } from "@/data";

/**
 * Contact form (§3.7 + §4.10, spec fields — NOT the data's 5-option form):
 * الاسم الكامل * / البريد الإلكتروني * (side by side) / نوع الاستفسار *
 * (SIX options) / رسالتك * — validates locally, then hands the
 * message to WhatsApp. It does NOT send email and stores nothing
 * anywhere (no localStorage, no server).
 *
 * Motion (2026-11-15):
 * - Per-field error: field shakes ±4px twice in 300ms (CSS `field-shake`
 *   in globals.css) + red semantic.error border + error text fade+y
 *   200ms + focus moves to the first invalid field + aria-describedby.
 *   Reduced motion: no shake (border + text only).
 * - Success: SVG circle draws 400ms then ✓ 300ms power2.inOut (CSS,
 *   pathLength=100) + text fade-up 250ms + WhatsApp button 150ms later;
 *   the button is in the DOM and clickable immediately — the delay is
 *   visual only. No data-reveal here: the trigger builds at mount, so
 *   a scroll trigger would never fire.
 * - Floating labels: CSS only (:focus + :not(:placeholder-shown)),
 *   180ms ease-out; the label stays a real <label> (htmlFor + id).
 */
const TYPE_OPTIONS: LocalizedString[] = [
  { ar: "استفسار عن منتج", en: "Product enquiry" },
  { ar: "استفسار عن نظام جاهز", en: "Ready-made system enquiry" },
  { ar: "طلب صيانة", en: "Maintenance request" },
  { ar: "دراسة نظام لمنشأة", en: "System study for a facility" },
  { ar: "استشارة اختيار نظام", en: "System selection consultation" },
  { ar: "استفسار عام", en: "General enquiry" },
];

type FieldErrors = { name?: string; email?: string; message?: string };

export default function ContactForm({ locale }: { locale: Locale }) {
  const c = pages.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState(0);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [ready, setReady] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (name.trim().length < 2) errs.name = t(c.k12, locale);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = ui("form.invalidEmail", locale);
    if (message.trim().length < 10) errs.message = ui("form.shortMessage", locale);
    setErrors(errs);
    setSubmitCount((n) => n + 1);
    if (Object.keys(errs).length === 0) {
      setReady(true);
      return;
    }
    // Focus the first invalid field (name → email → message).
    requestAnimationFrame(() => {
      if (errs.name) nameRef.current?.focus();
      else if (errs.email) emailRef.current?.focus();
      else if (errs.message) messageRef.current?.focus();
    });
  };

  if (ready) {
    const text = WA_MESSAGES.contact(name.trim(), email.trim(), t(TYPE_OPTIONS[type], locale), message.trim())[locale];
    return (
      <div className="card-luxe p-6 md:p-8">
        <svg
          viewBox="0 0 52 52"
          className="size-14 text-success"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle className="success-check__circle" cx="26" cy="26" r="24" pathLength={100} />
          <path className="success-check__check" d="M14 27l8 8 16-16" pathLength={100} />
        </svg>
        <p className="success-fade-up mt-4 font-bold text-navy">{t(c.k24, locale)}</p>
        <p className="success-fade-up mt-2 text-body-sm text-text-muted">{t(c.k25, locale)}</p>
        <a
          href={waLink(text)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-navy success-fade-up--delayed mt-5"
        >
          <WhatsAppIcon className="size-5" aria-hidden="true" />
          {ui("form.openWhatsapp", locale)}
        </a>
      </div>
    );
  }

  const emailLabel = locale === "ar" ? "البريد الإلكتروني" : locale === "en" ? "Email" : "电子邮箱";
  // Form-completion progress (micro-polish only — validation and the
  // WhatsApp handoff are untouched). Four steps: name, email, enquiry
  // type (always selected, so it counts as done), message. Subtle top
  // bar in the form card, 200ms ease-out width.
  const doneName = name.trim().length >= 2;
  const doneEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const doneMessage = message.trim().length >= 10;
  const doneSteps = [doneName, doneEmail, true, doneMessage].filter(Boolean).length;
  const progressPct = Math.round((doneSteps / 4) * 100);
  const progressLabel =
    locale === "ar" ? "اكتمال النموذج" : locale === "en" ? "Form completion" : "表单完成度";
  const baseCls =
    "w-full rounded-[0.625rem] border bg-surface px-4 text-body text-text placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
  const fieldCls = (hasError: boolean) =>
    `${baseCls} ${hasError ? "border-error focus:border-error" : "border-border focus:border-primary-hover"}`;
  const errCls = "field-error-msg mt-1.5 text-caption font-semibold text-error";

  return (
    <form data-stagger onSubmit={submit} noValidate className="card-luxe p-6 md:p-8">
      {/* Completion progress — thin bar at the card's top edge. */}
      <div
        className="-mx-6 -mt-6 h-1 overflow-hidden rounded-t-card bg-sky md:-mx-8 md:-mt-8"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={progressLabel}
      >
        <span
          className="block h-full bg-brand-red transition-[width] duration-200 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="sr-only">
        {progressLabel}: {progressPct}%
      </span>
      <h2 className="mt-6 text-h3 font-semibold text-navy md:mt-8">{t(c.k27, locale)}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Name — floating label + per-field error + shake */}
        <div key={`name-${submitCount}`} className={errors.name ? "field-error" : ""}>
          <span className="field-float">
            <input
              ref={nameRef}
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={`${fieldCls(Boolean(errors.name))} h-14`}
            />
            <label htmlFor="contact-name">
              {t(c.k12, locale)} <span className="text-error">*</span>
            </label>
          </span>
          {errors.name && (
            <p id="contact-name-error" className={errCls}>
              {errors.name}
            </p>
          )}
        </div>
        {/* Email — floating label + per-field error + shake */}
        <div key={`email-${submitCount}`} className={errors.email ? "field-error" : ""}>
          <span className="field-float">
            <input
              ref={emailRef}
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              dir="ltr"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={`${fieldCls(Boolean(errors.email))} h-14`}
            />
            <label htmlFor="contact-email">
              {emailLabel} <span className="text-error">*</span>
            </label>
          </span>
          {errors.email && (
            <p id="contact-email-error" className={errCls}>
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-bold text-navy">
          {t(c.k15, locale)} <span className="text-error">*</span>
        </span>
        <select
          id="contact-type"
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
          className={`${fieldCls(false)} h-14`}
        >
          {TYPE_OPTIONS.map((o, i) => (
            <option key={i} value={i}>
              {t(o, locale)}
            </option>
          ))}
        </select>
      </label>
      {/* Message — floating label + per-field error + shake */}
      <div key={`message-${submitCount}`} className={`mt-5 ${errors.message ? "field-error" : ""}`}>
        <span className="field-float">
          <textarea
            ref={messageRef}
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder=" "
            required
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`${fieldCls(Boolean(errors.message))} min-h-[7.5rem] py-3`}
          />
          <label htmlFor="contact-message">
            {t(c.k21, locale)} <span className="text-error">*</span>
          </label>
        </span>
        {errors.message && (
          <p id="contact-message-error" className={errCls}>
            {errors.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-navy mt-6 min-h-12 w-full px-6 py-3">
        {ui("cta.sendMessage", locale)}
        <ArrowIcon className="size-5 rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />
      </button>
      <p className="mt-4 text-caption text-text-muted">{t(c.k23, locale)}</p>
    </form>
  );
}
