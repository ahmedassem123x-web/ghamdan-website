import { siteSettings } from "@/data";
import type { Locale } from "@/data";

const WA_NUMBER = siteSettings.contact.whatsapp;

/** Build a wa.me link with a prepared message. Never hard-code the number elsewhere. */
export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general: {
    ar: "مرحباً غمدان — أريد الاستفسار عن منتجاتكم.",
    en: "Hello Ghamdan — I'd like to enquire about your products.",
    zh: "您好，我想咨询贵公司的产品。",
  },
  product: (name: string, model: string, url: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — أستفسر عن المنتج: ${name} (${model}) — ${url}`,
    en: `Hello Ghamdan — I'm enquiring about: ${name} (${model}) — ${url}`,
    zh: `您好，我想咨询产品：${name} (${model}) — ${url}`,
  }),
  system: (name: string, url: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — أستفسر عن النظام الجاهز: ${name} — ${url}`,
    en: `Hello Ghamdan — I'm enquiring about the ready-made system: ${name} — ${url}`,
    zh: `您好，我想咨询成套系统：${name} — ${url}`,
  }),
  category: (name: string, url: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — أستفسر عن فئة المنتجات: ${name} — ${url}`,
    en: `Hello Ghamdan — I'm enquiring about the product category: ${name} — ${url}`,
    zh: `您好，我想咨询产品分类：${name} — ${url}`,
  }),
  support: (topic: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — أحتاج دعماً فنياً بخصوص: ${topic}`,
    en: `Hello Ghamdan — I need technical support regarding: ${topic}`,
    zh: `您好，我需要技术支持：${topic}`,
  }),
  guidance: (depth: string, water: string, use: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — نتيجة دليل الضخ: عمق البئر ${depth}م، المياه اليومية ${water}م³، الاستخدام: ${use}. أرجو تصميم النظام المناسب.`,
    en: `Hello Ghamdan — pumping guidance result: well depth ${depth}m, daily water ${water}m³, use: ${use}. Please design the right system.`,
    zh: `您好 — 抽水指南结果：井深 ${depth}米，每日用水 ${water}立方米，用途：${use}。请设计合适的系统。`,
  }),
  contact: (name: string, email: string, type: string, message: string): Record<Locale, string> => ({
    ar: `مرحباً غمدان — رسالة من ${name} (${email}) — ${type}: ${message}`,
    en: `Hello Ghamdan — message from ${name} (${email}) — ${type}: ${message}`,
    zh: `您好 — 来自 ${name}（${email}）的消息 — ${type}：${message}`,
  }),
} as const;

export interface WaClick {
  source: string;
  sourceId: string;
  pageUrl: string;
  locale: Locale;
  ctaId: string;
  timestamp: string;
}

/** Record a WhatsApp click in localStorage (client-side analytics only — never delivery/read). */
export function recordWaClick(click: Omit<WaClick, "timestamp">): void {
  try {
    const raw = localStorage.getItem("gts_wa_clicks") ?? "[]";
    const log: WaClick[] = JSON.parse(raw);
    log.push({ ...click, timestamp: new Date().toISOString() });
    localStorage.setItem("gts_wa_clicks", JSON.stringify(log.slice(-500)));
  } catch {
    /* storage unavailable — analytics is best-effort only */
  }
}

export function readWaClicks(): WaClick[] {
  try {
    return JSON.parse(localStorage.getItem("gts_wa_clicks") ?? "[]");
  } catch {
    return [];
  }
}
