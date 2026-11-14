# ARCHITECTURE — منصة غمدان للطاقة الشمسية

> **الحالة:** COMPLETE (الهيكل الثابت) · **النسخة الخلفية Laravel/Filament:** NOT STARTED (موثقة هنا كخارطة 1:1).
> البرومبت الحاكم §15 يحدد Laravel + Blade + Tailwind + Alpine.js + Filament. هذا البناء
> ثابت لأسباب موثقة أدناه، ويطابق ذلك الهدف صفحةً بصفحة.

## 1. ترتيب البناء (Build order — قرار ملزم)

1. **أولاً: نسخة فاخرة أمينة من الصور المرجعية العشر** — نفس التقنيات والأشكال
   والحركة (بطل فوتوغرافي، صفوف تحريرية متناوبة، شبكات بطاقات، شريط marquee،
   رسم خطي faint، مخطط نظام، حزام CTA كحلي). لا يُشوَّه التكوين ليناسب بيانات الشركة.
2. **ثانياً: طبقة غمدان خفيفة فوقها** — تبديل محتوى فقط: العلامة (وورد مارك مؤقت)،
   جهات الاتصال (+967775800000 / info@ghamdan-trd.com)، الكتالوج الحقيقي من
   `ghamdan-product-catalogue.xlsx`. التخطيط والتكوين والتصميم لم يتغيرا لاستيعاب
   بيانات الشركة.
3. **قاعدة:** لا منتج/مشروع/سعر/شهادة/نتيجة يُنشر إلا من مصدر معتمد كتابياً.
   كل فجوة تُعرض كحالة فارغة صادقة أو قالب تطويري موسوم، لا كمحتوى مختلق.

## 2. لماذا بناء ثابت (Static) وليس Laravel الآن؟

| السبب | التفصيل |
|---|---|
| لا PHP/Composer على جهاز العمل | بيئة VM هذه بلا PHP ولا Composer؛ Laravel/Blade/Filament لا يمكن تشغيلها أو اختبارها هنا. |
| يجب أن يعمل على هاتف أحمد | الموقع يجب أن يُفتح ويُفحص على الهاتف فوراً؛ الاستضافة الثابتة (أي خادم ملفات) تفي بذلك بلا خادم تطبيقات ولا قاعدة بيانات. |
| لا اعتماديات وقت تشغيل | لا CDN: الخطوط مستضافة ذاتياً، وGSAP مُضمَّن محلياً (`assets/js/vendor/`). الصفحة تعمل من `file://` ومن أي استضافة ثابتة. |
| قابلية النقل 1:1 | كل صفحة ثابتة تقابل مساراً وكنترولر وموارد Filament في الجدول (§5)؛ الترحيل لاحقاً نقل قوالب وبيانات، لا إعادة تصميم. |

## 3. البنية الثابتة

```
repo root = site root (لا مجلد public/ منفصل)
├── index.html, about.html, solutions.html, catalog.html, projects.html,
│   contact.html, services.html, support.html, news.html, agencies.html,
│   systems.html, downloads.html, privacy.html, terms.html, search.html,
│   guidance.html, 404.html
├── products/p01…p38.html        (37 منشورة)
├── categories/<slug>.html       (8)
├── solutions/pumping.html
├── projects/template.html
├── systems/bundle-1…4.html
├── agencies/<brand>.html        (6)
├── admin/index.html             (لوحة تجريبية أمامية)
├── assets/
│   ├── css/main.css             (578 سطراً، مكتوب يدوياً من توكنز DESIGN_SYSTEM — لا Tailwind ولا إطار)
│   ├── js/settings.js           (المصدر الوحيد لجهات الاتصال/واتساب/الضمان — §14.3)
│   ├── js/data.js               (39 منتجاً، 8 فئات، 4 باقات، 6 وكالات — مولَّد من xlsx)
│   ├── js/i18n.js               (سلاسل الواجهة AR/EN/ZH)
│   ├── js/app.js                (366 سطراً: لغة، واتساب، هيدر، درج، لايت بوكس، حركة، فلاتر، لوحة)
│   ├── js/vendor/gsap.min.js + ScrollTrigger.min.js  (GSAP 3.12.5 مضمَّن محلياً)
│   ├── fonts/                   (Tajawal 400/500/700/800 + Montserrat 500/600/700/800، woff2)
│   └── img/photos/              (12 صورة بديلة CC من Openverse — CI-06)
└── tools/
    ├── build.py / build_part2.py        (مولِّد الصفحات — `python3 tools/build.py`)
    ├── sitegen/render.py, content.py, icons.py
    ├── extract_catalog.py               (xlsx → data.js؛ الأسعار تُحذف عند التوليد)
    ├── fetch_photos.py
    └── qa_probe.mjs / qa_one.mjs       (فحص Chromium بلا رأس عبر CDP)
```

- **لا إطار أمامي:** لا React/Next/Vue/Flutter. JS فانيليا + GSAP.
- **لا بناء (build step) وقت التشغيل:** الصفحات HTML جاهزة؛ إعادة التوليد فقط عند
  تغيير البيانات (`python3 tools/build.py`).
- **المحتوى مرئي بلا JS:** فئة `.js` تُضاف من `app.js` فقط؛ `.reveal` مخفي فقط
  عند وجود JS (انظر `MOTION_SYSTEM.md`).

## 4. مصدر الحقيقة الوحيد (Single sources of truth)

| الشيء | الملف | القاعدة |
|---|---|---|
| جهات الاتصال + واتساب + الضمان | `assets/js/settings.js` (`window.GTS_SETTINGS`) | لا تُكتب جهة اتصال حرفياً في أي قالب؛ كل شيء يقرأ من هنا |
| الكتالوج (منتجات/فئات/باقات) | `assets/js/data.js` (`window.GTS_DATA`) | مولَّد من xlsx؛ لا تحرير يدوي — أعد التوليد |
| سلاسل الواجهة | `assets/js/i18n.js` + `GTS_PAGE_I18N` في كل صفحة | AR افتراضي RTL؛ EN وZH كاملتان للواجهة |
| التصميم | `assets/css/main.css` (توكنز من `DESIGN_SYSTEM.md`) | لا قيم حرفية متناثرة؛ التوكنز CSS variables |

## 5. خارطة الترحيل إلى Laravel 1:1 (الهدف النهائي §15)

| الصفحة الثابتة | مسار Laravel | الكنترولر / المورد |
|---|---|---|
| `index.html` | `GET /` | `HomeController@index` |
| `about.html` | `GET /about` | `PageController@about` |
| `solutions.html` | `GET /solutions` | `SolutionController@index` |
| `solutions/pumping.html` | `GET /solutions/pumping` | `SolutionController@show('pumping')` |
| `catalog.html` | `GET /products` | `ProductController@index` (بحث + تصفية) |
| `categories/<slug>.html` | `GET /categories/{category}` | `CategoryController@show` |
| `products/<slug>.html` | `GET /products/{product}` | `ProductController@show` |
| `systems.html` + `systems/bundle-<n>.html` | `GET /systems`, `GET /systems/{bundle}` | `BundleController@index/show` |
| `projects.html` + `projects/template.html` | `GET /projects`, `GET /projects/{project}` | `ProjectController@index/show` |
| `agencies.html` + `agencies/<brand>.html` | `GET /agencies`, `GET /agencies/{agency}` | `AgencyController@index/show` |
| `services.html` | `GET /services` | `PageController@services` |
| `support.html` | `GET /support` | `PageController@support` |
| `news.html` | `GET /news` | `NewsController@index` |
| `downloads.html` | `GET /downloads` | `DownloadController@index` |
| `contact.html` | `GET /contact`, `POST /contact` | `ContactController@create/store` (يفتح واتساب؛ لا إرسال بريد تلقائي في الطور الحالي) |
| `search.html` | `GET /search?q=` | `SearchController@index` |
| `guidance.html` | `GET /guidance`, `POST /guidance` | `GuidanceController@create` (إرشاد أولي → رسالة واتساب) |
| `privacy.html` / `terms.html` | `GET /privacy`, `GET /terms` | `PageController@privacy/terms` |
| `404.html` | — | معالج 404 في Laravel |
| `admin/index.html` (تجريبي) | `/admin` | **Filament**: موارد `ProductResource`, `CategoryResource`, `BundleResource`, `AgencyResource`, `ProjectResource`, `NewsResource`, `ServiceResource`, `SettingResource`, `UserResource` + لوحة إحصائيات نقرات واتساب |

**قواعد الترحيل:**
- `data.js` → جداول PostgreSQL (انظر `DATABASE_SCHEMA.md`)؛ الحقول والـ enum كما هي.
- `settings.js` → جدول `settings` (سجل واحد) + إعدادات Filament.
- `GTS_PAGE_I18N` → جداول ترجمة لكل لغة (AR/EN/ZH مستقلة، بلا ترجمة آلية — CI-09).
- سجل نقرات واتساب (localStorage حالياً) → جدول `wa_click_logs` في الخادم.
- نموذج التواصل (localStorage حالياً) → جدول `inquiries` + إشعار واتساب يدوي.
- دخول اللوحة التجريبي (`admin@ghamdan-trd.com / admin123`) **يُحذف تماماً**؛
  في Filament: مصادقة Laravel + أدوار وصلاحيات، وكلمة المرور تُدار من لوحة
  الاستضافة لا من الكود ولا من صفحة الدخول نفسها.
- شعار الوورد مارك (`settings.js` + `.wordmark`) → حقل شعار في `settings`
  يُستبدل بملف الشعار الجديد فور وصوله (CI-17) بلا أي تغيير آخر.

## 6. i18n — النهج

- AR أولاً RTL افتراضياً (`lang="ar" dir="rtl"`). EN وZH يبدّلان `dir` إلى `ltr`.
- سلاسل الواجهة (تنقّل، تذييل، أزرار، نماذج، رسائل فارغة) مترجمة بالكامل
  في `i18n.js` للغات الثلاث (~110 مفاتيح لكل لغة).
- نصوص الصفحات في `GTS_PAGE_I18N` لكل صفحة: AR + EN كاملتان؛ ZH ناقصة في
  بعض المفاتيح — عند غياب `zh` يبقى النص عربياً ويظهر إشعار `#zh-notice`
  «المحتوى الصيني قيد المراجعة» (§13.2 / CI-09 — المراجعة البشرية إلزامية).
- تبديل اللغة يحفظ الصفحة: `?lang=` في URL + `localStorage["gts-lang"]`
  (انظر `app.js`: `currentLang()` و`GTS_SET_LANG()`). **لم يُختبر التبديل حياً
  في متصفح تفاعلي** — الآلية مؤكدة بالقراءة فقط (انظر `TEST_REPORT.md`).
- أرقام الموديلات وأسماء العلامات والوحدات الفنية لا تُترجم أبداً.

## 7. واتساب — مصدر واحد (§10)

- الرقم الوحيد: `967775800000` في `settings.js`؛ كل الروابط تُبنى بصيغة
  `https://wa.me/967775800000?text=<رسالة مرمّزة>`.
- زر عائم في كل الصفحات + شريط سفلي ثابت على الجوال في صفحات المنتج/الأنظمة +
  أزرار سياقية برسائل جاهزة حسب الصفحة واللغة (منتج، باقة، إرشاد ضخ، تواصل).
- النقرات تُسجَّل في `localStorage["gts-wa-clicks"]` (المصدر/العنصر/الصفحة/
  اللغة/الزر/الوقت) — **لا يُزعم أبداً تسليم أو قراءة**؛ السجل عدّاد نقرات فقط.
- **عيب معروف:** لوحة الإحصائيات تقرأ المفتاح الخاطئ `gts-wa-log` (انظر
  `ADMIN_GUIDE.md` §5 و`FINAL_EXECUTION_REPORT.md`) — الإحصائيات تظهر صفراً دائماً
  حتى يُصحَّح المفتاح.

## 8. الوورد مارك / CI-17

- لا شعار GTS القديم (السويش الأزرق/الأحمر) في أي مكان — منسيّ بأمر أحمد.
- البديل المؤقت: وورد مارك نصي «غمدان» (Tajawal ExtraBold) + `GHAMDAN · GTS`
  (Montserrat) + نقطة حمراء `#E10600`. الأحمر **في النقطة فقط** — لا يظهر
  كلون واجهة في أي مكان آخر (تحقق: `--color-brand-red` يُستخدم في
  `.wordmark__dot` فقط).
- على الجوال (<767px) تُخفى اللاتينية عمداً (`main.css`) ويبقى «غمدان» + النقطة.
- عند وصول الشعار الجديد: يُستبدل في `settings.js` (`logo_mode: "image"`) +
  `.wordmark` فقط، بلا تغيير آخر.

## 9. GSAP — التضمين المحلي

- GSAP 3.12.5 + ScrollTrigger مضمَّنان في `assets/js/vendor/` (لا CDN، لا اعتماد
  شبكة). كل صفحة تحمّلهما قبل `app.js`.
- إن غاب GSAP يعمل بديل IntersectionObserver؛ وإن غاب JS كله يبقى المحتوى
  مرئياً (انظر `MOTION_SYSTEM.md`).

## 10. ما ليس في هذا البناء (خارج النطاق — انظر SCOPE_AND_EXCLUSIONS.md)

- لا خادم، لا قاعدة بيانات، لا مصادقة حقيقية، لا دفع/تجارة (معطّلة ومخفية)،
  لا بريد تلقائي، لا خرائط (لا موقع موثّق)، لا تحليلات خارجية، لا Pixel.
- لا أسعار في أي مكان في الموقع (القاعدة §3.1) — كلمة «سعر» تظهر فقط في
  عبارة السياسة «السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات» وسؤال
  الأسئلة الشائعة «كيف أعرف سعر منتج؟».
