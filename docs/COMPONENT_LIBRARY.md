# COMPONENT LIBRARY — مكتبة المكونات (`assets/css/main.css`, 578 سطراً)

> **المصدر:** كل الفئات أدناه موجودة فعلاً في `main.css` (تحقق بالـ grep).
> التوكنز من `DESIGN_SYSTEM.md`؛ لا قيم لونية/مسافات حرفية خارج `:root`
> (عدا `@font-face`). **تدرجات: 0 في الكود** — لا `linear-gradient` ولا
> `radial-gradient` ولا `backdrop-filter` في الملف؛ تعليق الترويسة في
> `main.css` يذكر «تدرج سماء واحداً داخل مشاهد SVG للبطل» لكن لا يوجد
> أي `<linearGradient>` في CSS أو المولِّد أو الصفحات — التعليق قديم
> ولا أثر بصري له. لا زجاجية (glassmorphism)، لا بنفسجي، لا فقاعات زخرفية.

## 1. التوكنز (مختصر — الكامل في DESIGN_SYSTEM.md)

- **ألوان:** خلفية `#F4F7FA`، سطح `#FFFFFF`، كحلي `#0F2E4D` / عميق `#0A2540`،
  أزرق ساطع `#1E8FE8`، سماوي `#B2D3F0`، واتساب `#1D9E44`، نص `#131C1C` /
  باهت `#5A6470`. أحمر غمدان `#E10600` لنقطة الوورد مارك فقط.
- **خطوط:** Tajawal (عربي 400/500/700/800) + Montserrat (لاتيني 500/600/700/800)،
  مستضافة ذاتياً woff2 مع `unicode-range` عربي/لاتيني.
- **مقياس نوع:** بطل `clamp(2.5rem, 4.4vw, 4rem)`، H2 حتى 2.5rem، نص 1rem بارتفاع 1.7.
- **مسافات:** بين الأقسام `clamp(4rem, 7vw, 7.5rem)`، فجوة البطاقات 1.5rem.
- **نصف قطر:** بطاقة 14px، زر/إدخال 10px، حبة 999px. **ظلال:** شبه معدومة —
  البطاقات معرَّفة بالحدود لا بالظل (`0 2px 12px rgba(15,46,77,.06)`).

## 2. الكروم (Chrome)

| المكون | الفئات | ملاحظات |
|---|---|---|
| الشريط العلوي | `.topbar`, `.topbar__group` | كحلي عميق؛ هاتف + بريد + ساعات + فيسبوك/إنستغرام. متطلب برومبت (§4.3) — غير موجود في المراجع. على الجوال يُخفى جزئياً |
| الهيدر | `.site-header`, `.site-header--transparent`, `.site-header--scrolled`, `.site-header__inner` | شفاف فوق البطل، يصبح صلباً أبيض بعد 24px تمرير؛ `top: 2.5rem` سطح مكتب / `0` جوال |
| الوورد مارك | `.wordmark`, `.wordmark__ar`, `.wordmark__dot`, `.wordmark__lat`, `.wordmark__tag`, `.wordmark--inverse` | نصي مؤقت (CI-17)؛ اللاتينية تُخفى <767px عمداً |
| التنقل | `.site-nav`, `.site-nav__link`, `.site-nav__link--active` | رابط نشط بخط سفلي أزرق |
| مبدّل اللغة | `.lang-switch` (+ `#lang-select`) | AR/EN/ZH؛ يحفظ `?lang=` + localStorage |
| زر البرغر + الدرج | `.burger`, `.drawer`, `.drawer--open`, `.drawer__backdrop`, `.drawer__panel`, `.drawer__head`, `.drawer__nav`, `.drawer__foot`, `.drawer__close` | ينزلق جوالاً؛ إغلاق بـ Escape/الخلفية |
| التذييل | `.site-footer`, `.site-footer__main`, `.site-footer__links`, `.site-footer__contact`, `.site-footer__bottom`, `.site-footer__watermark`, `.social` | 4 أعمدة (عن غمدان، روابط، فئات، تواصل) — بناء على المرجع 04 الأكمل؛ علامة مائية «غمدان» باهتة |

## 3. البطل (Hero — 3 متغيرات)

| المتغير | الفئات | الاستخدام |
|---|---|---|
| متمركز فوق صورة | `.hero--center`, `.hero--on-photo`, `.hero__scene`, `.hero__scrim`, `.hero__inner`, `.hero__content`, `.hero__title`, `.hero__copy`, `.hero__actions` | الرئيسية (01) |
| جانبي فوق صورة | `.hero--on-photo` (نص في جهة البداية RTL) | من نحن، حلولنا، مشاريعنا، تواصل، الضخ، قالب المشروع |
| منقسم (صورة/نص) | `.hero--split` | الكتالوج، الفئات |
| شارة حبة | `.pill`, `.pill--white`, `.pill__dot`, `.pill-row` | «طاقة ومياه من أجل مستقبل أفضل •» بنقطة خضراء |

## 4. الأقسام والعناوين

- `.section`, `.section--white`, `.section--muted`, `.section--band`, `.section--sm`
- `.section-head`, `.section-head--center`, `.section-head__rule` (الخط الأزرق
  القصير تحت العناوين — مضاف في البناء؛ في المرجع يظهر في 03 فقط)
- `.lead` (مقدمة رمادية)، `.center`
- `.grid`, `.grid--2/3/4/6` (كلها `minmax(0, 1fr)` — يمنع التمدد الأفقي)

## 5. البطاقات والشبكات

| المكون | الفئات | ملاحظات |
|---|---|---|
| بطاقة عامة | `.card`, `.card--hover`, `.card--muted`, `.card__body`, `.card__foot`, `.card__media` | حدود فاتحة، زوايا 14px |
| خلية حل | `.solution-cell`, `.solution-cell__media`, `.solution-cell__body` | صورة ~40% + نص على لوح رمادي فاتح (المرجع 01) |
| بطاقة منتج | `.product-card`, `.product-card__visual`, `.product-card__name`, `.product-card__spec`, `.product-card__brand` | صورة/رسم على مربع رمادي + اسم + مواصفات + زر واتساب مفرَّغ أزرق |
| أيقونة دائرية | `.icon-circle`, `.icon-circle--sm`, `.icon-circle--white` | أيقونة خطية زرقاء في دائرة زرقاء باهتة 56–72px |
| ركائز (لماذا نحن) | `.pillars`, `.pillar` | 3–4 أعمدة بخطوط فاصلة |
| تحريري | `.editorial`, `.editorial__media`, `.editorial__text` | صفان متناوبان صورة/نص |
| شريط فئات | `.cat-strip`, `.cat-tile`, `.cat-tile--active`, `.cat-tile__visual` | الكتالوج (13 بلاطة في المرجع؛ 8 فئات فعلية هنا) |
| تبويبات/حبوب | `.tabs`, `.tab`, `.tab--active` | حبوب تصفية المشاريع والفئات |

## 6. مكونات خاصة

| المكون | الفئات | الحالة |
|---|---|---|
| Marquee | `.marquee`, `.marquee__track` | «خبراتنا — حلولنا — تأثيرنا —» مكررة، حركة CSS 30ث (الرئيسية فقط) |
| رسم خطي | `.line-art` | رسم حقل شمسي باهت تحت صف الأيقونات (الرئيسية — مطابق للمرجع 01) |
| مخطط النظام | `.diagram` | مخطط ضخ مبني بالكود SVG (ألواح → متحكم → مضخة → خزان → توزيع) في `solutions/pumping.html` + ملاحظة «مخطط توضيحي مبني بالكود» |
| خطوات | `.steps`, `.step`, `.step__num`, `.steps-mini` | «كيف نعمل؟» 4 خطوات + «أربع خطوات لحل متكامل» 01–04 |
| ميزات مصغرة | `.mini-features`, `.mini-features--light`, `.mini-feature` | 3 ميزات أسفل أحزمة CTA |
| معرض | `.gallery`, `.gallery__item` | 4 صور في صف (قالب المشروع) |
| لايت بوكس | `.lightbox`, `.lightbox--open`, `.lightbox__panel`, `.lightbox__close` | عنوان+نص من `data-lightbox-*` |
| لوحة مواصفات | `.spec-panel`, `.spec-panel__visual`, `.spec-table` | **معرَّفة في CSS لكن غير مستخدمة في أي صفحة منتج** — جدول المواصفات غير منبثق (انظر SITE_MAP §1 صف 06) |
| تفاصيل المنتج | `.detail`, `.detail__media`, `.detail__info` | شبكة `minmax(0,…)` + `min-width: 0` (إصلاح فيض الجوال 95px) |

## 7. تصفية وبحث ونماذج

- `.filter-bar`, `.filter-bar__title`, `.search-input`, `.result-meta` —
  تعمل في `catalog.html` و`search.html` فقط (بحث نصي + علامة + نوع + عدّاد
  «عرض N من M منتج» + حالة فارغة). **غير موجودة في صفحات الفئات.**
- `.form-card`, `.field`, `.field--invalid`, `.field__error`, `.form-note`,
  `.form-row` — نموذج التواصل (اسم، هاتف، نوع، رسالة) + نموذج الإرشاد
  (عمق، مياه، استخدام)؛ تحقق محلي + نجاح ظاهرة + حفظ محلي.
- `.table`, `.req` — جداول اللوحة.

## 8. حالات فارغة وتطويرية

- `.empty-state` — «مشاريعنا قيد التوثيق»، «لا توجد أخبار منشورة بعد»،
  «لا توجد ملفات منشورة بعد»، «لا توجد منتجات منشورة في هذه الفئة بعد».
- `.dev-banner`, `.dev-note` — «معاينة تطويرية — الصور توضيحية مؤقتة» في
  نهاية `<main>` (لا تتصادم مع الهيدر) + شريط قالب المشروع التطويري.

## 9. واتساب

- `.wa-float` — زر أخضر دائري عائم (كل الصفحات، أسفل جهة النهاية).
- `.wa-bar`, `.wa-bar--show` — شريط ثابت سفلي على الجوال في صفحات
  المنتج/الأنظمة (زر واتساب أخضر + «تواصل معنا»).
- أزرار: `.btn--whatsapp` (أخضر `#1D9E44` — في الهيدر حسب المرجع 03 فقط)،
  `.btn--primary` (كحلي)، `.btn--white` (على الأحزمة الداكنة)،
  `.btn--outline` (مفرَّغ أزرق — بطاقات المنتجات)، `.btn--sm`, `.btn--block`,
  `.btn-link` (نص أزرق + سهم ←).

## 10. حزام CTA والتذييل

- `.cta-band`, `.cta-band__inner`, `.cta-band__media` — كحلي داكن، صورة
  في جهة + عنوان + زر أبيض + 3 ميزات مصغرة (في كل الصفحات عدا الكتالوج
  حيث البديل لوحة زرقاء فاتحة + صف «لماذا»).

## 11. اللوحة (Admin)

- `.admin`, `.admin__side`, `.admin__nav`, `.admin__main`, `.admin__cards`,
  `.stat-card`, `.stat-card__label`, `.stat-card__num`
- `.status`, `.status--draft/awaiting/published/archived` (+ `--verified`,
  `--confirmed` في `app.js:statusBadge`) — شارات حالة النشر الملونة.
- التفاصيل في `ADMIN_GUIDE.md`.

## 12. قواعد منع الـ Slop المطبقة في CSS

- توكنز مغلقة فقط؛ لا ألوان حرفية خارج `:root`.
- لا تدرجات فعلية، لا زجاجية، لا بنفسجي، لا بطاقات متداخلة، لا إحصائيات
  وهمية، لا أيقونات إيموجي (SVG خطية فقط، `stroke-width: 2`).
- الأسهم تشير يساراً (←) للتقدم في RTL.
