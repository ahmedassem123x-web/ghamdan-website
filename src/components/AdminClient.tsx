"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Package, Boxes, FolderKanban, Newspaper, BadgeCheck, Wrench, BarChart3, Settings, Users, LogOut, Lock } from "lucide-react";
import { products, categories, bundles, agencies, services, siteSettings } from "@/data";
import { t } from "@/lib/i18n";
import { readWaClicks } from "@/lib/whatsapp";
import type { Locale } from "@/data";

const DEMO_EMAIL = "admin@ghamdan-trd.com";
const DEMO_PASSWORD = "admin123";
const SESSION_KEY = "gts_admin_demo";

const TABS = [
  { id: "overview", icon: LayoutDashboard },
  { id: "products", icon: Package },
  { id: "packages", icon: Boxes },
  { id: "projects", icon: FolderKanban },
  { id: "news", icon: Newspaper },
  { id: "agencies", icon: BadgeCheck },
  { id: "services", icon: Wrench },
  { id: "statistics", icon: BarChart3 },
  { id: "settings", icon: Settings },
  { id: "users", icon: Users },
] as const;

const TAB_LABELS: Record<string, Record<Locale, string>> = {
  overview: { ar: "نظرة عامة", en: "Overview", zh: "总览" },
  products: { ar: "المنتجات", en: "Products", zh: "产品" },
  packages: { ar: "الباقات", en: "Packages", zh: "套餐" },
  projects: { ar: "المشاريع", en: "Projects", zh: "项目" },
  news: { ar: "الأخبار", en: "News", zh: "新闻" },
  agencies: { ar: "الوكالات", en: "Agencies", zh: "代理品牌" },
  services: { ar: "الخدمات", en: "Services", zh: "服务" },
  statistics: { ar: "الإحصائيات", en: "Statistics", zh: "统计" },
  settings: { ar: "الإعدادات", en: "Settings", zh: "设置" },
  users: { ar: "المستخدمون", en: "Users", zh: "用户" },
};

/**
 * Admin DEMO (§6): login-gated display interface. Local only — sessionStorage
 * flag, read-only tables, localStorage-only demo state, NO network calls, no
 * CRUD. Honesty label on the login screen AND the top bar. Not linked from
 * the public site. Requires JavaScript.
 */
export default function AdminClient({ locale }: { locale: Locale }) {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<string>("overview");
  const [waClicks, setWaClicks] = useState(0);
  const [inquiries, setInquiries] = useState(0);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    setWaClicks(readWaClicks().length);
    try {
      const raw = localStorage.getItem("gts_inquiries");
      setInquiries(raw ? JSON.parse(raw).length : 0);
    } catch {
      setInquiries(0);
    }
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError("");
    } else {
      setError(locale === "ar" ? "بيانات الدخول غير صحيحة — جرّب بيانات العرض التجريبي." : "Invalid credentials — try the demo login.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  const publishedCount = useMemo(() => products.filter((p) => p.status === "published").length, []);
  const pendingCount = useMemo(() => products.filter((p) => p.status !== "published").length, []);

  if (!authed) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-card bg-surface p-8 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Lock className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-h3 font-extrabold text-primary">{locale === "ar" ? "لوحة تحكم غمدان" : "Ghamdan Admin"}</h1>
              <p className="text-caption font-bold text-accent">
                {locale === "ar" ? "واجهة عرض تجريبية — الدخول محلي فقط، ولا تُحفظ أي بيانات على خوادم." : "Demo interface — local login only, no data is stored on any server."}
              </p>
            </div>
          </div>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-primary">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body" dir="ltr" autoComplete="username" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-primary">{locale === "ar" ? "كلمة المرور" : "Password"}</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-[0.625rem] border border-border bg-surface px-4 py-3 text-body" dir="ltr" autoComplete="current-password" />
            </label>
            {error && (
              <p role="alert" className="rounded-[0.625rem] border border-danger/40 bg-danger/5 px-4 py-3 text-sm font-bold text-danger">{error}</p>
            )}
            <button type="submit" className="w-full rounded-[0.625rem] bg-primary px-5 py-3 font-bold text-button text-white transition-colors hover:bg-primary-deep">
              {locale === "ar" ? "دخول" : "Sign in"}
            </button>
            <p className="text-center text-caption text-text-muted">
              {locale === "ar" ? "بيانات العرض التجريبي: admin@ghamdan-trd.com / admin123" : "Demo login: admin@ghamdan-trd.com / admin123"}
            </p>
          </form>
          <noscript>
            <p className="mt-4 text-sm font-bold text-danger">This demo requires JavaScript.</p>
          </noscript>
        </div>
      </main>
    );
  }

  const th = "px-4 py-3 text-start text-sm font-bold text-primary";
  const td = "px-4 py-3 text-sm text-text-muted";

  return (
    <main className="py-8">
      <div className="wrap">
        {/* Honesty label — top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-sky bg-sky-light px-5 py-3">
          <p className="text-sm font-bold text-primary">
            {locale === "ar" ? "واجهة عرض تجريبية — الدخول محلي فقط، والجداول للعرض فقط (لا تعديل ولا حفظ على خادم)." : "Demo interface — local login only; tables are read-only (no editing, nothing saved to a server)."}
          </p>
          <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-[0.625rem] border border-border bg-white px-4 py-2 text-sm font-bold text-primary hover:border-danger hover:text-danger">
            <LogOut className="size-4" aria-hidden="true" />
            {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
          {TABS.map((tb) => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                type="button"
                role="tab"
                aria-selected={tab === tb.id}
                onClick={() => setTab(tb.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  tab === tb.id ? "bg-primary text-white" : "border border-border bg-surface text-primary hover:border-accent hover:text-accent"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {TAB_LABELS[tb.id][locale]}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-card bg-surface p-6 shadow-card md:p-8">
          {tab === "overview" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.overview[locale]}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: TAB_LABELS.products[locale], value: publishedCount },
                  { label: locale === "ar" ? "منتجات قيد الانتظار" : "Pending products", value: pendingCount },
                  { label: TAB_LABELS.packages[locale], value: bundles.filter((b) => b.status === "confirmed").length },
                  { label: TAB_LABELS.agencies[locale], value: agencies.length },
                ].map((s, i) => (
                  <div key={i} className="rounded-card bg-bg p-5">
                    <p className="font-latin text-4xl font-extrabold text-primary" dir="ltr">{s.value}</p>
                    <p className="mt-1 text-sm font-bold text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-body-sm text-text-muted">
                {locale === "ar"
                  ? `نقرات واتساب المسجلة محلياً في هذا المتصفح: ${waClicks} — استفسارات نموذج التواصل المسجلة محلياً: ${inquiries}`
                  : `WhatsApp clicks recorded locally in this browser: ${waClicks} — contact-form inquiries recorded locally: ${inquiries}`}
              </p>
            </div>
          )}

          {tab === "products" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.products[locale]}</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={th}>{locale === "ar" ? "المنتج" : "Product"}</th>
                      <th className={th}>{locale === "ar" ? "العلامة" : "Brand"}</th>
                      <th className={th}>{locale === "ar" ? "الفئة" : "Category"}</th>
                      <th className={th}>{locale === "ar" ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className={td}>{t(p.name, locale)}</td>
                        <td className={td} dir="ltr">{p.brand}</td>
                        <td className={td}>{categories.find((c) => c.id === p.categoryId)?.id}</td>
                        <td className={td}>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "packages" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.packages[locale]}</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={th}>{locale === "ar" ? "الباقة" : "Package"}</th>
                      <th className={th}>{locale === "ar" ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundles.map((b) => (
                      <tr key={b.id} className="border-b border-border last:border-0">
                        <td className={td}>{t(b.name, locale)}</td>
                        <td className={td}>{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "projects" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.projects[locale]}</h2>
              <p className="mt-4 text-body text-text-muted">{locale === "ar" ? "لا توجد مشاريع معتمدة بعد — المشاريع قيد التوثيق (CI-07)." : "No approved projects yet — projects are being documented (CI-07)."}</p>
            </div>
          )}

          {tab === "news" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.news[locale]}</h2>
              <p className="mt-4 text-body text-text-muted">{locale === "ar" ? "لا توجد أخبار منشورة بعد." : "No news published yet."}</p>
            </div>
          )}

          {tab === "agencies" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.agencies[locale]}</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={th}>{locale === "ar" ? "العلامة" : "Brand"}</th>
                      <th className={th}>{locale === "ar" ? "الحالة" : "Status"}</th>
                      <th className={th}>{locale === "ar" ? "وكيل رسمي" : "Official agent"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((a) => (
                      <tr key={a.id} className="border-b border-border last:border-0">
                        <td className={td} dir="ltr">{a.name}</td>
                        <td className={td}>{t(a.status, locale)}</td>
                        <td className={td}>{a.officialAgent ? (locale === "ar" ? "نعم" : "Yes") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "services" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.services[locale]}</h2>
              <ul className="mt-6 space-y-3">
                {services.map((s) => (
                  <li key={s.title.ar} className="rounded-card bg-bg p-4">
                    <p className="font-bold text-primary">{t(s.title, locale)}</p>
                    <p className="text-sm text-text-muted">{t(s.text, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "statistics" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.statistics[locale]}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: TAB_LABELS.products[locale], value: publishedCount },
                  { label: locale === "ar" ? "الفئات" : "Categories", value: categories.length },
                  { label: locale === "ar" ? "نقرات واتساب (محلية)" : "WhatsApp clicks (local)", value: waClicks },
                ].map((s, i) => (
                  <div key={i} className="rounded-card bg-bg p-5">
                    <p className="font-latin text-4xl font-extrabold text-primary" dir="ltr">{s.value}</p>
                    <p className="mt-1 text-sm font-bold text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-body-sm text-text-muted">
                {locale === "ar" ? "لا توجد أرقام مبيعات أو زيارات معتمدة — لا نعرض إحصائيات غير موثقة." : "No verified sales or visit figures — unverified statistics are not shown."}
              </p>
            </div>
          )}

          {tab === "settings" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.settings[locale]}</h2>
              <dl className="mt-6 space-y-3">
                <div className="flex justify-between gap-4 rounded-card bg-bg p-4">
                  <dt className="font-bold text-primary">{locale === "ar" ? "واتساب" : "WhatsApp"}</dt>
                  <dd className="text-text-muted" dir="ltr">{siteSettings.contact.whatsappDisplay}</dd>
                </div>
                <div className="flex justify-between gap-4 rounded-card bg-bg p-4">
                  <dt className="font-bold text-primary">{locale === "ar" ? "البريد" : "Email"}</dt>
                  <dd className="text-text-muted" dir="ltr">{siteSettings.contact.email}</dd>
                </div>
                <div className="flex justify-between gap-4 rounded-card bg-bg p-4">
                  <dt className="font-bold text-primary">{locale === "ar" ? "العنوان" : "Address"}</dt>
                  <dd className="text-text-muted">{t(siteSettings.contact.address, locale)}</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === "users" && (
            <div>
              <h2 className="text-h2 font-extrabold text-primary">{TAB_LABELS.users[locale]}</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className={th}>{locale === "ar" ? "البريد" : "Email"}</th>
                      <th className={th}>{locale === "ar" ? "الدور" : "Role"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border last:border-0">
                      <td className={td} dir="ltr">{DEMO_EMAIL}</td>
                      <td className={td}>{locale === "ar" ? "مدير (عرض تجريبي)" : "Admin (demo)"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
