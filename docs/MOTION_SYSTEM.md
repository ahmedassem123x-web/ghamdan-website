# MOTION SYSTEM — نظام الحركة (GSAP + بدائل)

> **الحالة:** COMPLETE (للأنظمة المنفذة) · **عدّاد الأرقام:** منفَّذ لكن **غير مستخدم**
> (لا يوجد `data-count` في أي صفحة — لا أرقام موثقة تُعرض أصلاً).

## 1. المبادئ

1. **الحركة لا تغيّر التصميم** — ظهور/إزاحة خفيفة فقط؛ لا تغيير في التخطيط
   أو الألوان أو المحتوى بعد التحميل.
2. **المحتوى مرئي بلا JS** — فئة `.js` تُضاف من `app.js` فقط؛ قاعدة
   `.reveal { opacity: 1 }` هي الافتراضية، و`.js .reveal { opacity: 0 }`
   تُطبَّق فقط عند وجود JS. بلا JS: كل شيء ظاهر فوراً.
3. **بلا حركة عند طلبها** — `prefers-reduced-motion: reduce` يلغي كل شيء
   (انظر §5).

## 2. مكتبة الحركة

- **GSAP 3.12.5 + ScrollTrigger** مضمَّنان محلياً في `assets/js/vendor/`
  (`gsap.min.js` 72KB، `ScrollTrigger.min.js` 43KB) — لا CDN.
- تُحمَّلان في كل صفحة قبل `app.js`. إن فشل تحميلهما يعمل البديل (§4)؛
  وإن غاب JS كله يبقى المحتوى مرئياً (§1.2).

## 3. الأنظمة المنفذة

| النظام | التنفيذ | المكان |
|---|---|---|
| ظهور الأقسام (Reveal) | GSAP `fromTo {opacity: 0, y: 24}` → `{opacity: 1, y: 0}`، مدة 0.7ث، `power3.out`، محفَّز ScrollTrigger `start: "top 88%"`، `once: true` | كل عنصر `.reveal` في كل الصفحات |
| دخول متدرج (Stagger) | GSAP `fromTo` على أبناء `[data-stagger]` مباشرة، `y: 20`، مدة 0.6ث، `stagger: 0.08`، نفس المحفَّز | شبكات البطاقات والأيقونات |
| شريط Marquee | CSS فقط: `.marquee__track { animation: marquee 30s linear infinite }` مع `@keyframes marquee { to { transform: translateX(-50%) } }` — تكرار «خبراتنا — حلولنا — تأثيرنا —» | `index.html` فقط (مطابق للمرجع 01) |
| انضغاط الهيدر عند التمرير | `app.js:onScroll` — يضيف `.site-header--scrolled` بعد 24px: الهيدر الشفاف يصبح صلباً أبيض مع ظل خفيف؛ الشريط العلوي (topbar) يبقى فوقه (`top: 2.5rem` على سطح المكتب، `0` على الجوال) | كل الصفحات ذات `site-header--transparent` |
| درج الجوال (Drawer) | CSS + JS: `.drawer--open` ينزلق من الجانب؛ إغلاق بالخلفية أو زر الإغلاق أو `Escape`؛ يمنع تمرير الصفحة أثناء فتحه؛ `aria-expanded` على زر البرغر | كل الصفحات (<1024px) |
| لايت بوكس (Lightbox) | `.lightbox--open` يعرض لوحة بعنوان ونص من `data-lightbox-title/body`؛ إغلاق بالنقر خارج اللوحة أو زر الإغلاق أو `Escape` | الصفحات ذات `data-lightbox` |
| عدّاد أرقام (Count-up) | `app.js` — عناصر `[data-count]` تعدّ من 0 إلى الهدف خلال 900ms عند ظهور 50% منها | **منفَّذ، غير مستخدم: لا يوجد أي عنصر `data-count` في الصفحات الـ75** — لا أرقام موثقة (لا سنة تأسيس ولا عدد مشاريع ولا عدد عملاء) تُعرض، فلا شيء يُعَدّ. يُفعَّل فقط عند توثيق رقم حقيقي |
| تمرير ناعم | `html { scroll-behavior: smooth }` | كل الصفحات |

## 4. البدائل (Fallbacks — بالترتيب)

1. `prefers-reduced-motion: reduce` → كل `.reveal` يظهر فوراً، بلا GSAP
   (انظر §5).
2. GSAP/ScrollTrigger غير متاحين + `IntersectionObserver` متاح →
   إضافة فئة `.reveal--in` عند تقاطع 12% (`threshold: 0.12`)، ومراقبة
   مرة واحدة ثم إلغاء (`unobserve`).
3. لا IntersectionObserver → `revealAll()` — إظهار كل شيء فوراً.
4. لا JS أصلاً → المحتوى مرئي بالكامل من CSS الافتراضي.

## 5. تقليل الحركة وإمكانية الوصول

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .js .reveal { opacity: 1; transform: none; }
  .marquee__track { animation: none; }
}
```

- Marquee يتوقف تماماً عند `prefers-reduced-motion`.
- الدرج واللايت بوكس: `Escape` يغلقهما؛ التركيز (focus) يُنقل لرابط
  واتساب الظاهر بعد إرسال نموذج الإرشاد (`link.focus()`).
- الأيقونات زخرفية `aria-hidden="true"`؛ الحقول المطلوبة تُعلَّم
  `field--invalid` عند التحقق الفاشل.

## 6. ما لم يُنفَّذ (بوعي — لا يُدَّعى)

- **لا حركات Hero معقدة** (لا parallax ولا تحريك طبقات) — المرجع صورة ثابتة.
- **لا تشغيل تلقائي لمعارض** — معرض المشاريع في المرجع 05 ثابت في لقطة؛
  لا سلوك تشغيل تلقائي مُدَّعى.
- **لا عدّ إحصائيات** — لا أرقام مخترعة تُعَدّ (انظر §3، العدّاد).
- **لا Lenis ولا تمرير سلس مخصص** — `scroll-behavior: smooth` الأصلي يكفي؛
  لا مكتبة تمرير إضافية.
- الحركة **لم تُتحقق بصرياً** في لقطات الفحص: لقطات `docs/qa/screenshots/`
  تُظهر أعلى الصفحة بعد اكتمال التمرير؛ حركات الظهور عند التمرير
  مؤكدة بالكود فقط، لا بلقطة متحركة (انظر `TEST_REPORT.md` §5).

## 7. ثوابت الحركة (في `main.css`)

- `--dur-slow` و`--ease-out` مستخدمان في انتقال `.reveal--in`
  (القيم في `:root` — 0.7ث تقريباً بما يطابق GSAP).
- Marquee: 30ث، خطي، لا نهائي.
- العدّاد (عند استخدامه مستقبلاً): 900ms لكل رقم.
