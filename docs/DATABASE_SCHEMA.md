# DATABASE SCHEMA — مخطط قاعدة البيانات (المستقبلي: Laravel / PostgreSQL)

> **الحالة:** NOT STARTED (لا قاعدة بيانات في البناء الثابت). هذا الملف هو
> **الخارطة المعتمدة** للترحيل، مستنتجة حرفياً من `assets/js/data.js`
> (39 منتجاً، 8 فئات، 4 باقات) + `assets/js/settings.js` + سجلات `app.js`.
> لا حقل مخترع هنا: كل حقل له مقابل في ملف البيانات الحالي أو في متطلبات
> البرومبت. الأسعار **غير موجودة** في أي جدول — القاعدة §3.1.

## 1. مخطط الحالة (Publication status enum)

يمر كل عنصر قابل للنشر عبر الحالات التالية (نفس القائمة في اللوحة التجريبية
وفي `app.js:statusBadge`):

| القيمة | المعنى | تُنشر؟ |
|---|---|---|
| `draft` | مسودة | لا |
| `awaiting_client_list` | بانتظار قائمة العميل | لا |
| `factory_catalog_verified` | موثّق من كتالوج المصنّع | نعم (مع وسم المصدر) |
| `confirmed` | مؤكد من العميل | نعم |
| `confirmed_by_client` | مؤكد من العميل (مرادف في اللوحة) | نعم |
| `published` | منشور | نعم |
| `archived` | مؤرشف | لا (يُعرض كسابق فقط) |
| `partial` | جزئي — بعض الحقول مؤكدة وبعضها لا | نعم (بحذر؛ يُراجَع قبل النشر) |

**انحراف موثّق (يجب توحيده عند الترحيل):** `data.js` يستخدم فعلياً
`confirmed` و`partial` و`factory_catalog_verified` و`awaiting_client_list`
و`archived` — ولا يستخدم `draft` ولا `published` ولا `confirmed_by_client`
في البيانات، رغم ظهورها في واجهة اللوحة. والقائمة المعتمدة للنشر في
`data.js` هي `published_statuses = [confirmed, factory_catalog_verified, partial]`.
عند الترحيل: وحّد الاسم إلى `confirmed_by_client` أو `confirmed` (قرار واحد)،
واحذف `partial` أو عرّف قواعدها كتابياً — لا تترك قيمتين لمعنى واحد.

**التوزيع الحالي (2026-11-14):** من 39 منتجاً: 27 `factory_catalog_verified`،
8 `confirmed`، 2 `partial`، 2 `awaiting_client_list` (p30، p39). منشور: 37.
الباقات: 3 `confirmed` + 1 `archived`.

## 2. الجداول

### `categories` — الفئات (8 صفوف حالياً)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` | bigint PK | — |
| `slug` | varchar, unique | `inverters`, `batteries`, `panels`, `pumps`, `controllers`, `systems`, `storage-ci`, `cameras` |
| `name_ar` / `name_en` / `name_zh` | varchar | `zh` قيد المراجعة البشرية (CI-09) |
| `note_ar` | text, nullable | وصف الفئة (يظهر في صفحة الفئة) |
| `icon` | varchar | اسم أيقونة Lucide: `zap`, `battery`, `sun`, `droplet`, `sliders`, `package`, `database`, `camera` |
| `priority` | varchar | `high` / `medium` / `low` (ترتيب العرض) |
| `status` | enum (قسم 1) | — |
| `created_at` / `updated_at` | timestamps | — |

### `products` — المنتجات (39 صفاً)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` | bigint PK | المعرف الداخلي `p01`…`p39` يبقى `sku`/`code` نصياً |
| `code` | varchar, unique | `p01`…`p39` |
| `category_id` | FK → categories | — |
| `subcategory_ar` | varchar, nullable | مثل «أحادي الطور — جهد منخفض» |
| `brand` | varchar | `Deye`, `EFORE`, `MUST`, `Jntech`, `Hanwha Q-Cells`, `Wisenet`, `Shenzhen Kexin` |
| `model` | varchar | مثل `SUN-SG04LP1 — 5kW`؛ القيم الفنية (kW/kWh/A/V) جزء من الموديل |
| `specs_ar` | text, nullable | مواصفات مختصرة من الكتالوج (سطر واحد) — **ليست** جدول المواصفات الكامل (CI-06) |
| `status` | enum (قسم 1) | — |
| `image_path` | varchar, nullable | صورة المنتج الحقيقية عند وصولها (CI-06)؛ حالياً SVG خطي مولَّد |
| `datasheet_path` | varchar, nullable | ملف كتيب المصنّع (CI-06) |
| `internal_note` | text, nullable | **داخلي فقط — لا يُعرض أبداً** (انظر §5: ملاحظات الأسعار الحالية) |
| `created_at` / `updated_at` | timestamps | — |

**لا يوجد:** `price`، `currency`، `discount` — لا حقل سعر في أي جدول،
ولا مكوّن سعر في أي واجهة. السعر يُحدَّد عبر واتساب فقط.

### `bundles` — الباقات الجاهزة (4 صفوف)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` | bigint PK | `bundle-1`…`bundle-4` كـ `code` |
| `code` | varchar, unique | — |
| `name_ar` / `name_en` / `name_zh` | varchar | — |
| `components_ar` | text | قائمة المكونات (منتج + موديل + كمية) — بانتظار اعتماد CI-03 |
| `use_ar` | text, nullable | الاستخدام المقصود |
| `status` | enum (قسم 1) | 3 مؤكدة + 1 مؤرشفة |
| `created_at` / `updated_at` | timestamps | — |

جدول وسيط `bundle_product` (bundle_id, product_id, quantity) عند الحاجة
لربط المكونات بصفوف `products` بدل النص الحر — يُبنى عند اعتماد CI-03.

### `agencies` — الوكالات (6 صفوف)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` | bigint PK | — |
| `brand` | varchar, unique | `Deye`, `EFORE`, `MUST`, `Jntech`, `Hanwha Q-Cells`, `Wisenet` |
| `representation` | varchar | `official_agent` (Deye في اليمن — مؤكد) أو `carried_brand` (الباقي حتى الاعتماد — CI-04) |
| `representation_text_ar/en/zh` | text, nullable | نص الصفة المعتمد كتابياً (CI-04) |
| `logo_path` / `certificate_path` | varchar, nullable | الملفات الرسمية عند وصولها (CI-04) |
| `status` | enum (قسم 1) | — |

### `projects` — المشاريع (0 صفوف — بانتظار CI-07)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` / `slug` | PK / unique | — |
| `title_ar/en/zh` | varchar | — |
| `category` | varchar | `solar` / `water` / `agriculture` (حبوب التصفية في المرجع 05) |
| `location_ar` | varchar, nullable | الموقع الحقيقي فقط + إذن نشر كتابي (CI-07) |
| `description_ar/en/zh` | text | — |
| `challenge_ar` / `solution_ar` | text, nullable | قسما «التحدي» و«الحل الهندسي» (المرجع 10) |
| `scope_ar` | text, nullable | نطاق الأعمال المنفذة |
| `equipment` | JSON | قائمة معدات مستخدمة (روابط `products`) |
| `gallery` | JSON | مسارات صور مع إذن نشر (CI-07) |
| `results` | JSON | نتائج **مقاسة فقط** — بلا أرقام مخترعة؛ العناوين فقط حتى توثيقها |
| `status` | enum (قسم 1) | لا يُنشر مشروع قبل الاعتماد وموافقة العميل |
| `published_at` | timestamp, nullable | — |

### `news` — الأخبار والفعاليات (0 صفوف — CI-07)

`id`, `slug`, `title_ar/en/zh`, `body_ar/en/zh`, `image_path`, `status`, `published_at`.

### `services` — الخدمات (6 بنود نصية حالياً)

`id`, `slug`, `title_ar/en/zh`, `body_ar/en/zh`, `icon`, `status`.

### `settings` — إعدادات المنصة (سجل واحد)

| الحقل | النوع | القيمة الحالية (من `settings.js`) |
|---|---|---|
| `whatsapp_number` | varchar | `967775800000` |
| `email` | varchar | `info@ghamdan-trd.com` |
| `address_ar` / `address_en` | text | شارع صخر، أمام نور اليمن مول، صنعاء |
| `hours_ar` / `hours_en` | varchar | السبت – الجمعة: 8 – 20 |
| `facebook_url` / `instagram_url` | varchar | `facebook.com/GTSYemen` / `@gtsyemen1` |
| `warranty_status` | varchar | `pending_client_approval` (CI-08) |
| `warranty_text_ar/en/zh` | text, nullable | «نص الضمان الموحد قيد الاعتماد» — لا مدة حتى الاعتماد |
| `logo_mode` | varchar | `wordmark` (CI-17) → `image` عند وصول الشعار |
| `logo_path` | varchar, nullable | — |

### `users` — المستخدمون (Filament)

جدول مستخدمي Laravel القياسي + أدوار (مدير/محرر/مشاهد) — **لا مستخدمين
حقيقيين في البناء الحالي**؛ حساب اللوحة التجريبي ليس مستخدماً ولا يُرحَّل.

### `wa_click_logs` — سجل نقرات واتساب (من `app.js:logWaClick`)

| الحقل | النوع | ملاحظة |
|---|---|---|
| `id` | bigint PK | — |
| `source` | varchar | `product` / `bundle` / `guidance` / `general` … |
| `entity` | varchar, nullable | مثل `p14` أو `bundle-2` |
| `cta` | varchar, nullable | مثل `product-inquire` |
| `page` | varchar | المسار |
| `lang` | varchar(2) | `ar` / `en` / `zh` |
| `clicked_at` | timestamp | — |

**تحذير صريح:** هذا الجدول عدّاد **نقرات** فقط. لا عمود تسليم/قراءة/رد —
واتساب لا يمنحها، ولا يجوز اختلاقها.

### `inquiries` — استفسارات نموذج التواصل (من `app.js`)

`id`, `name`, `phone`, `type` (عام/شراء/دعم/ضمان/ضخ), `message`, `lang`,
`created_at`. تُخزَّن محلياً حالياً (`localStorage["gts-inquiries"]`)؛
في الخادم تُحفظ هنا ويُشعَر بها فريق المبيعات يدوياً عبر واتساب.

## 3. العلاقات

```
categories 1───* products
products   *───* bundles   (عبر bundle_product عند اعتماد CI-03)
agencies   1───* products  (brand — علاقة منطقية بالنص حالياً، FK عند الترحيل)
projects   *───* products  (equipment — JSON حالياً، جدول وسيط لاحقاً)
settings   1 (سجل واحد)
```

## 4. قواعد النشر (تُنفَّذ في Filament لاحقاً، ومطبَّقة يدوياً الآن)

1. لا يُعرض عنصر في أي شبكة إلا إذا كانت حالته في
   `published_statuses = [confirmed, factory_catalog_verified, partial]`
   (يجب توحيد القائمة مع §1 عند الترحيل).
2. `awaiting_client_list` و`draft` و`archived` مستبعدة من كل الشبكات
   (الأرشيف يُعرض في صفحته فقط كـ«سابق»).
3. لا حقل سعر يُقرأ أو يُعرض في أي استعلام — الاستعلامات لا تختار أي عمود سعر
   لأنه غير موجود أصلاً.
4. كل نص صيني يُنشر بعد مراجعة بشرية مؤهلة (CI-09)؛ حقل `zh` الفارغ = عدم نشر
   تلك اللغة لذلك العنصر.

## 5. تنبيه بيانات: ملاحظات داخلية في الملف المنشور حالياً

`assets/js/data.js` ملف يُرسَل للمتصفح مع الموقع، ويحوي حالياً في حقل
`note_ar` لبعض المنتجات إشارات أسعار داخلية من منشورات فيسبوك
(مثال: p02 «ظهر أيضاً بـ 480$ في منشور أقدم»، p38 «79$ … بدل 125$»،
و`questions_ar` للباقة المؤرشفة «هل ما زالت متاحة وبنفس السعر؟»).
هذه الملاحظات **لا تُعرض في أي صفحة** (المولِّد لا يطبع `note_ar` للمنتجات)،
لكنها **قابلة للقراءة من «عرض المصدر»** لأي زائر. قبل أي نشر عام:
انقل `note_ar` و`questions_ar` إلى ملف داخلي غير منشور، أو احذف كل إشارة
سعر منها، وأعد التوليد. في مخطط PostgreSQL أعلاه حقل `internal_note`
مصمَّم أصلاً كعمود داخلي لا يُعرَض ولا يُرسَل للواجهة.
