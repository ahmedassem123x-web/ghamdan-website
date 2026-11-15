/**
 * Ghamdan (GTS) — per-page copy, extracted VERBATIM from the old build's
 * inline `window.GTS_PAGE_I18N` JSON blocks (all 75 HTML files carried the
 * block). 1,078 keys in total. Keys k1..kN are preserved
 * exactly as in the source, including quirks: some keys carry Arabic text in
 * their `en` slot (source fallback), and 32 product pages carry 17 keys
 * while 5 (p01, p06, p11, p14, p28) carry 16 — the extra k17 in the 17-key
 * pages duplicates the WhatsApp CTA copy.
 *
 * CORRECTIONS after extraction (the "verbatim" note above describes the
 * pre-fix source): the C-2 fix (2026-11-14) dropped the CI-02 specs note
 * from productDetail blocks and renumbered them, so all 37 productDetail
 * blocks now carry k1..k16 and the 17/16-key counts above no longer apply.
 * Phase 5 (2026-11-15, ADR-06) removed catalog k1 («طاقة اليوم لمستقبل
 * أفضل») entirely — no replacement slogan was supplied — so the 1,078
 * total above is now 1,077 and /products has no hero eyebrow; the
 * category-page breadcrumb that used catalog k1 now uses
 * ui("category.allProducts").
 *
 * zh: present only where the old build supplied it. A missing `zh` means
 * "fall back to `ar`" (see types.ts) — never machine-translate. Per
 * BUILD_SPEC §0.7, ZH strings are CI-09 PENDING and need a competent human
 * review before ZH pages are published.
 *
 * NOTE on the word "price": it occurs ONLY inside the inquiry-policy
 * sentence ("Ask about this product via WhatsApp — price, availability and
 * delivery are confirmed with the sales team" / "استفسر عن هذا المنتج عبر
 * واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات") — the same
 * policy meaning as the canonical sentence in settings.ts (BUILD_SPEC
 * §0.3.1). No amounts, no currency symbols, no price fields anywhere.
 *
 * Projects: there are NO approved projects. pages.projects is the honest
 * empty state ("مشاريعنا قيد التوثيق") and approvedProjects below is
 * intentionally an empty array; projectDetail.template is a DEVELOPMENT
 * TEMPLATE, not a real project — never present it as one.
 */
import type { PagesCopy, Project } from "./types";

/** Shared copy — used 54× (dedup, P2). */
const SHARED_COPY_1 = { ar: "تحدث مع فريقنا عبر واتساب — أخبرنا باحتياجك وسنرشدك إلى المنظومة الأنسب.", en: "Talk to our team on WhatsApp — tell us what you need and we will guide you to the right system.", zh: "通过 WhatsApp 联系我们的团队 — 告诉我们您的需求，我们将为您推荐最合适的系统。" };
/** Shared copy — used 51× (dedup, P2). */
const SHARED_COPY_2 = { ar: "لنبدأ مشروعك اليوم", en: "Let's Start Your Project Today", zh: "今天就开始您的项目" };
/** Shared copy — used 38× (dedup, P2). */
const SHARED_COPY_3 = { ar: "نظرة عامة", en: "Overview" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_4 = { ar: "المميزات الرئيسية", en: "Key Benefits" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_5 = { ar: "صورة توضيحية لنوع المنتج — صورة المنتج الحقيقية قيد الاستلام.", en: "Illustrative photo of the product type — the real product photo is pending receipt." };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_6 = { ar: "مواصفات المنتج", en: "Product Specifications" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_7 = { ar: "استفسر عن هذا المنتج عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.", en: "Ask about this product via WhatsApp — price, availability and delivery are confirmed with the sales team." };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_8 = { ar: "جودة موثقة", en: "Verified quality" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_9 = { ar: "من كتالوج المصنّع", en: "From the manufacturer's catalog" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_10 = { ar: "تسليم منسق", en: "Coordinated delivery" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_11 = { ar: "حسب الطلب والمنطقة", en: "Per order and area" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_12 = { ar: "دعم واتساب", en: "WhatsApp support" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_13 = { ar: "السبت – الجمعة", en: "Sat – Fri" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_14 = { ar: "المواصفات الفنية", en: "Technical Specifications" };
/** Shared copy — used 37× (dedup, P2). */
const SHARED_COPY_15 = { ar: "منتجات ذات صلة", en: "Related Products" };
/** Shared copy — used 29× (dedup, P2). */
const SHARED_COPY_16 = { ar: "من كتالوج المصنّع — التوفر عند غمدان قيد التأكيد.", en: "From the manufacturer's catalog — availability at Ghamdan pending confirmation." };
/** Shared copy — used 10× (dedup, P2). */
const SHARED_COPY_17 = { ar: "لا توجد نتائج مطابقة", en: "No matching results" };
/** Shared copy — used 9× (dedup, P2). */
const SHARED_COPY_18 = { ar: "جرّب كلمة أخرى أو غيّر الفلاتر.", en: "Try another word or change the filters." };
/** Shared copy — used 8× (dedup, P2). */
const SHARED_COPY_19 = { ar: "المنتجات", en: "Products", zh: "产品" };
/** Shared copy — used 8× (dedup, P2). */
const SHARED_COPY_20 = { ar: "جميع المنتجات المعروضة مؤكدة من المصنّع أو من غمدان. للتفاصيل والتوفر تواصل معنا عبر واتساب.", en: "All listed products are confirmed by the manufacturer or by Ghamdan. For details and availability, contact us via WhatsApp." };
/** Shared copy — used 8× (dedup, P2). */
const SHARED_COPY_21 = { ar: "منتج مؤكد عند غمدان.", en: "Product confirmed by Ghamdan." };

export const pages: PagesCopy = {
  "home": {
    "k1": {
      "ar": "طاقة ومياه من أجل مستقبل أفضل",
      "en": "Energy and water for a better future",
      "zh": "为更美好的未来提供能源与水"
    },
    "k2": {
      "ar": "حلول طاقة ومياه مصممة لتناسب احتياجاتك",
      "en": "Energy and water solutions designed around your needs",
      "zh": "为您量身定制的能源与水解决方案"
    },
    "k3": {
      "ar": "غمدان للتجارة والتوكيلات — وكيل Deye الرسمي في اليمن — توريد أنظمة الطاقة الشمسية والتخزين والمضخات، من التصميم إلى التركيب والمتابعة.",
      "en": "Ghamdan for Trade and Agencies — the official Deye agent in Yemen — supplying solar energy, storage and pumping systems, from design to installation and follow-up.",
      "zh": "Ghamdan 贸易与代理公司 — Deye 在也门的官方代理 — 提供太阳能、储能与水泵系统，从设计到安装与跟进。"
    },
    "k4": {
      "ar": "أنظمة الطاقة الشمسية",
      "en": "Solar Energy Systems",
      "zh": "太阳能系统"
    },
    "k5": {
      "ar": "محولات وبطاريات وألواح من علامات موثوقة.",
      "en": "Inverters, batteries and panels from trusted brands.",
      "zh": "来自可信品牌的逆变器、电池与电池板。"
    },
    "k6": {
      "ar": "هندسة المياه",
      "en": "Water Engineering",
      "zh": "水工程"
    },
    "k7": {
      "ar": "ضخ وري بالطاقة الشمسية للآبار والمزارع.",
      "en": "Solar pumping and irrigation for wells and farms.",
      "zh": "为水井与农场提供太阳能抽水与灌溉。"
    },
    "k8": {
      "ar": "التقنيات الزراعية",
      "en": "Agricultural Technology",
      "zh": "农业技术"
    },
    "k9": {
      "ar": "حلول ري ذكية ترفع كفاءة المياه والطاقة.",
      "en": "Smart irrigation solutions that raise water and energy efficiency.",
      "zh": "提高水与能源效率的智能灌溉方案。"
    },
    "k10": {
      "ar": "خبراتنا",
      "en": "Our Expertise",
      "zh": "我们的专长"
    },
    "k11": {
      "ar": "حلولنا",
      "en": "Our Solutions",
      "zh": "我们的解决方案"
    },
    "k12": {
      "ar": "تأثيرنا",
      "en": "Our Impact",
      "zh": "我们的影响"
    },
    "k13": {
      "ar": "خبراتنا",
      "en": "Our Expertise",
      "zh": "我们的专长"
    },
    "k14": {
      "ar": "حلولنا",
      "en": "Our Solutions",
      "zh": "我们的解决方案"
    },
    "k15": {
      "ar": "تأثيرنا",
      "en": "Our Impact",
      "zh": "我们的影响"
    },
    "k16": {
      "ar": "خبراتنا",
      "en": "Our Expertise",
      "zh": "我们的专长"
    },
    "k17": {
      "ar": "حلولنا",
      "en": "Our Solutions",
      "zh": "我们的解决方案"
    },
    "k18": {
      "ar": "تأثيرنا",
      "en": "Our Impact",
      "zh": "我们的影响"
    },
    "k19": {
      "ar": "خبراتنا",
      "en": "Our Expertise",
      "zh": "我们的专长"
    },
    "k20": {
      "ar": "حلولنا",
      "en": "Our Solutions",
      "zh": "我们的解决方案"
    },
    "k21": {
      "ar": "تأثيرنا",
      "en": "Our Impact",
      "zh": "我们的影响"
    },
    "k22": {
      "ar": "الطاقة الشمسية السكنية",
      "en": "Residential Solar Energy",
      "zh": "住宅太阳能"
    },
    "k23": {
      "ar": "منظومات منزلية متكاملة: محول هجين وبطارية وألواح — كهرباء مستقرة ليلاً ونهاراً.",
      "en": "Complete home systems: hybrid inverter, battery and panels — stable power day and night.",
      "zh": "完整的家庭系统：混合逆变器、电池与电池板 — 全天候稳定供电。"
    },
    "k24": {
      "ar": "حلول الطاقة التجارية والصناعية",
      "en": "Commercial & Industrial Energy Solutions",
      "zh": "工商业能源解决方案"
    },
    "k25": {
      "ar": "منظومات ثلاثية الطور وجهد عالٍ للمحلات والمكاتب والمصانع والمستشفيات.",
      "en": "Three-phase and high-voltage systems for shops, offices, factories and hospitals.",
      "zh": "为商铺、办公室、工厂与医院提供三相与高压系统。"
    },
    "k26": {
      "ar": "ضخ المياه بالطاقة الشمسية",
      "en": "Solar Water Pumping",
      "zh": "太阳能抽水"
    },
    "k27": {
      "ar": "ضخ من الآبار بالطاقة الشمسية — بلا وقود، وبلا فواتير كهرباء للضخ.",
      "en": "Pumping from wells on solar power — no fuel, no electricity bills for pumping.",
      "zh": "以太阳能从水井抽水 — 无需燃油，无抽水电费。"
    },
    "k28": {
      "ar": "أنظمة الري الذكية",
      "en": "Smart Irrigation Systems",
      "zh": "智能灌溉系统"
    },
    "k29": {
      "ar": "ري بالتنقيط والرش يدار بالطاقة الشمسية — ماء أقل، ومحصول أفضل.",
      "en": "Drip and sprinkler irrigation run on solar power — less water, better yield.",
      "zh": "以太阳能运行的滴灌与喷灌 — 更少用水，更好收成。"
    },
    "k30": {
      "ar": "شراكة طويلة الأمد",
      "en": "A Long-Term Partnership",
      "zh": "长期合作伙伴"
    },
    "k31": {
      "ar": "نتابع معك بعد التركيب — دعم وصيانة وقطع.",
      "en": "We stay with you after installation — support, maintenance and parts.",
      "zh": "安装后我们依然陪伴您 — 支持、维护与配件。"
    },
    "k32": {
      "ar": "خبرة متكاملة",
      "en": "Integrated Expertise",
      "zh": "综合专业经验"
    },
    "k33": {
      "ar": "طاقة ومياه وزراعة في منظومة واحدة متناسقة.",
      "en": "Energy, water and agriculture in one coherent system.",
      "zh": "能源、水与农业融为一个协调的系统。"
    },
    "k34": {
      "ar": "حلول مخصصة",
      "en": "Tailored Solutions",
      "zh": "定制解决方案"
    },
    "k35": {
      "ar": "نصمم المنظومة على احتياجك الفعلي، لا على قالب جاهز.",
      "en": "We design the system around your actual need, not a ready-made template.",
      "zh": "根据您的实际需求设计系统，而非套用现成模板。"
    },
    "k36": {
      "ar": "طاقة شمسية موثوقة، ومياه تصل حيث تحتاجها، وأنظمة زراعية ذكية — نبنيها معك منظومة متكاملة، لا قطعاً متفرقة.",
      "en": "Reliable solar power, water where you need it, and smart agricultural systems — built with you as one integrated system, not scattered parts.",
      "zh": "可靠的太阳能、按需供水与智能农业系统 — 与您共建一体化系统，而非零散部件。"
    },
    "k37": {
      "ar": "نؤمن بعالم تزدهر فيه الحياة",
      "en": "We believe in a world where life thrives",
      "zh": "我们相信生命繁荣的世界"
    },
    "k38": {
      "ar": "أربع عائلات من الحلول المتكاملة — اختر ما يناسب منزلك أو مزرعتك أو منشأتك.",
      "en": "Four families of integrated solutions — choose what fits your home, farm or facility.",
      "zh": "四大类综合解决方案 — 选择适合您家庭、农场或设施的方案。"
    },
    "k39": {
      "ar": "حلولنا",
      "en": "Our Solutions",
      "zh": "我们的解决方案"
    },
    "k40": {
      "ar": "لمستقبل أكثر استدامة",
      "en": "For a more sustainable future",
      "zh": "共创更可持续的未来"
    },
    "k41": {
      "ar": "لماذا تختار حلولنا؟",
      "en": "Why Choose Our Solutions?",
      "zh": "为什么选择我们？"
    },
    "k42": {
      "ar": "مشاريعنا",
      "en": "Our Projects",
      "zh": "我们的项目"
    },
    "k43": {
      "ar": "مشاريعنا قيد التوثيق",
      "en": "Our projects are being documented"
    },
    "k44": {
      "ar": "لا ننشر أي مشروع قبل اعتماده وموافقة العميل على نشر اسمه وصوره.",
      "en": "No project is published before approval and the client's consent to publish its name and photos."
    },
    "k45": {
      "ar": "منتجات مختارة",
      "en": "Featured Products",
      "zh": "精选产品"
    },
    "k46": {
      "ar": "البريد الإلكتروني",
      "en": "Email"
    },
    "k47": {
      "ar": "info@ghamdan-trd.com",
      "en": "info@ghamdan-trd.com"
    },
    "k48": {
      "ar": "الهاتف",
      "en": "Phone"
    },
    "k49": {
      "ar": "+967 775 800 000",
      "en": "+967 775 800 000"
    },
    "k50": {
      "ar": "الموقع",
      "en": "Location"
    },
    "k51": {
      "ar": "صنعاء، اليمن",
      "en": "Sana'a, Yemen"
    },
    "k52": SHARED_COPY_2,
    "k53": SHARED_COPY_1
  },
  "about": {
    "k1": {
      "ar": "خبرة هندسية متكاملة لطاقة أذكى وحياة أفضل",
      "en": "Integrated engineering expertise for smarter energy and a better life",
      "zh": "综合工程经验，带来更智能的能源与更美好的生活"
    },
    "k2": {
      "ar": "غمدان للتجارة والتوكيلات — شركة يمنية في صنعاء، وكيل Deye الرسمي في اليمن، تعمل في توريد أنظمة الطاقة الشمسية والتخزين والضخ والري.",
      "en": "Ghamdan for Trade and Agencies — a Yemeni company in Sana'a, the official Deye agent in Yemen, supplying solar energy, storage, pumping and irrigation systems.",
      "zh": "Ghamdan 贸易与代理公司 — 位于萨那的也门公司，Deye 在也门的官方代理，提供太阳能、储能、抽水与灌溉系统。"
    },
    "k3": {
      "ar": "أنظمة الطاقة الشمسية",
      "en": "Solar Energy Systems",
      "zh": "太阳能系统"
    },
    "k4": {
      "ar": "محولات وبطاريات وألواح من علامات موثوقة.",
      "en": "Inverters, batteries and panels from trusted brands.",
      "zh": "来自可信品牌的逆变器、电池与电池板。"
    },
    "k5": {
      "ar": "هندسة المياه",
      "en": "Water Engineering",
      "zh": "水工程"
    },
    "k6": {
      "ar": "ضخ وري بالطاقة الشمسية للآبار والمزارع.",
      "en": "Solar pumping and irrigation for wells and farms.",
      "zh": "为水井与农场提供太阳能抽水与灌溉。"
    },
    "k7": {
      "ar": "التقنيات الزراعية",
      "en": "Agricultural Technology",
      "zh": "农业技术"
    },
    "k8": {
      "ar": "حلول ري ذكية ترفع كفاءة المياه والطاقة.",
      "en": "Smart irrigation solutions that raise water and energy efficiency.",
      "zh": "提高水与能源效率的智能灌溉方案。"
    },
    "k9": {
      "ar": "رسالتنا",
      "en": "Our Mission",
      "zh": "我们的使命"
    },
    "k10": {
      "ar": "أن تصل الطاقة النظيفة والمياه إلى كل منزل ومزرعة ومنشأة في اليمن، بمنظومات موثوقة وخدمة صادقة.",
      "en": "Clean energy and water reaching every home, farm and facility in Yemen — through reliable systems and honest service.",
      "zh": "让清洁能源与水抵达也门的每一个家庭、农场与设施 — 以可靠的系统与真诚的服务。"
    },
    "k11": {
      "ar": "رؤيتنا",
      "en": "Our Vision",
      "zh": "我们的愿景"
    },
    "k12": {
      "ar": "يمنٌ يعتمد على طاقته الشمسية — منازل مضيئة، وآبار تعمل، ومزارع تنتج طوال العام.",
      "en": "A Yemen that runs on its own sun — lit homes, working wells, and farms producing all year round.",
      "zh": "一个依靠自身阳光运转的也门 — 灯火通明的家庭、运转的水井与全年生产的农场。"
    },
    "k13": {
      "ar": "الطاقة الشمسية السكنية",
      "en": "Residential Solar Energy",
      "zh": "住宅太阳能"
    },
    "k14": {
      "ar": "منظومات منزلية متكاملة: محول هجين وبطارية وألواح — كهرباء مستقرة ليلاً ونهاراً.",
      "en": "Complete home systems: hybrid inverter, battery and panels — stable power day and night.",
      "zh": "完整的家庭系统：混合逆变器、电池与电池板 — 全天候稳定供电。"
    },
    "k15": {
      "ar": "حلول الطاقة التجارية والصناعية",
      "en": "Commercial & Industrial Energy Solutions",
      "zh": "工商业能源解决方案"
    },
    "k16": {
      "ar": "منظومات ثلاثية الطور وجهد عالٍ للمحلات والمكاتب والمصانع والمستشفيات.",
      "en": "Three-phase and high-voltage systems for shops, offices, factories and hospitals.",
      "zh": "为商铺、办公室、工厂与医院提供三相与高压系统。"
    },
    "k17": {
      "ar": "ضخ المياه بالطاقة الشمسية",
      "en": "Solar Water Pumping",
      "zh": "太阳能抽水"
    },
    "k18": {
      "ar": "ضخ من الآبار بالطاقة الشمسية — بلا وقود، وبلا فواتير كهرباء للضخ.",
      "en": "Pumping from wells on solar power — no fuel, no electricity bills for pumping.",
      "zh": "以太阳能从水井抽水 — 无需燃油，无抽水电费。"
    },
    "k19": {
      "ar": "من نحن",
      "en": "About Us",
      "zh": "关于我们"
    },
    "k20": {
      "ar": "نؤمن بأن الطاقة المستدامة والمياه والزراعة الذكية ليست بدائل، بل أسس لمستقبل أفضل للجميع.",
      "en": "We believe sustainable energy, water and smart agriculture are not alternatives — they are the foundations of a better future for everyone.",
      "zh": "我们相信，可持续能源、水与智慧农业不是替代品，而是人人享有更美好未来的基础。"
    },
    "k21": {
      "ar": "قصتنا",
      "en": "Our Story",
      "zh": "我们的故事"
    },
    "k22": {
      "ar": "انطلقت رحلتنا من إيمان بإمكانات عالم أكثر استدامة",
      "en": "Our journey began with a belief in the potential of a more sustainable world",
      "zh": "我们的旅程始于对更可持续世界可能性的信念"
    },
    "k23": {
      "ar": "من صنعاء نخدم المنازل والمزارع والمنشآت في اليمن بمنظومات طاقة شمسية وتخزين وضخ — نختار علامات موثوقة، ونركّب بعناية، ونتابع بعد التسليم.",
      "en": "From Sana'a we serve homes, farms and facilities across Yemen with solar, storage and pumping systems — choosing trusted brands, installing with care, and following up after handover.",
      "zh": "我们从萨那出发，为也门各地的家庭、农场与设施提供太阳能、储能与抽水系统 — 选择可信品牌、精心安装、交付后持续跟进。"
    },
    "k24": {
      "ar": "مجالات خبرتنا",
      "en": "Our Areas of Expertise",
      "zh": "我们的专业领域"
    },
    "k25": {
      "ar": "حلول متكاملة لحياة أكثر استدامة",
      "en": "Integrated solutions for a more sustainable life",
      "zh": "一体化解决方案，共创更可持续的生活"
    },
    "k26": {
      "ar": "لنبحث معاً عن الحل الأنسب لمشروعك",
      "en": "Let's find the right solution for your project together",
      "zh": "让我们一起为您的项目找到最合适的方案"
    },
    "k27": SHARED_COPY_1
  },
  "solutions": {
    "k1": {
      "ar": "حلول متكاملة للطاقة والمياه",
      "en": "Integrated Solutions for Energy and Water",
      "zh": "能源与水一体化解决方案"
    },
    "k2": {
      "ar": "خمس عائلات من الحلول — كل واحدة منظومة هندسية متكاملة، لا منتج منفرد.",
      "en": "Five families of solutions — each one an integrated engineering system, not a single product.",
      "zh": "五大类解决方案 — 每一类都是完整的工程系统，而非单一产品。"
    },
    "k3": {
      "ar": "للمنازل",
      "en": "For Homes",
      "zh": "住宅"
    },
    "k4": {
      "ar": "الطاقة الشمسية السكنية",
      "en": "Residential Solar Energy",
      "zh": "住宅太阳能"
    },
    "k5": {
      "ar": "منظومات منزلية متكاملة: محول هجين وبطارية وألواح — كهرباء مستقرة ليلاً ونهاراً.",
      "en": "Complete home systems: hybrid inverter, battery and panels — stable power day and night.",
      "zh": "完整的家庭系统：混合逆变器、电池与电池板 — 全天候稳定供电。"
    },
    "k6": {
      "ar": "للمنشآت",
      "en": "For Facilities",
      "zh": "工商业"
    },
    "k7": {
      "ar": "حلول الطاقة التجارية والصناعية",
      "en": "Commercial & Industrial Energy Solutions",
      "zh": "工商业能源解决方案"
    },
    "k8": {
      "ar": "منظومات ثلاثية الطور وجهد عالٍ للمحلات والمكاتب والمصانع والمستشفيات.",
      "en": "Three-phase and high-voltage systems for shops, offices, factories and hospitals.",
      "zh": "为商铺、办公室、工厂与医院提供三相与高压系统。"
    },
    "k9": {
      "ar": "المياه",
      "en": "Water",
      "zh": "水"
    },
    "k10": {
      "ar": "ضخ المياه بالطاقة الشمسية",
      "en": "Solar Water Pumping",
      "zh": "太阳能抽水"
    },
    "k11": {
      "ar": "ضخ من الآبار بالطاقة الشمسية — بلا وقود، وبلا فواتير كهرباء للضخ.",
      "en": "Pumping from wells on solar power — no fuel, no electricity bills for pumping.",
      "zh": "以太阳能从水井抽水 — 无需燃油，无抽水电费。"
    },
    "k12": {
      "ar": "الري الذكي",
      "en": "Smart Irrigation",
      "zh": "智能灌溉"
    },
    "k13": {
      "ar": "أنظمة الري الذكية",
      "en": "Smart Irrigation Systems",
      "zh": "智能灌溉系统"
    },
    "k14": {
      "ar": "ري بالتنقيط والرش يدار بالطاقة الشمسية — ماء أقل، ومحصول أفضل.",
      "en": "Drip and sprinkler irrigation run on solar power — less water, better yield.",
      "zh": "以太阳能运行的滴灌与喷灌 — 更少用水，更好收成。"
    },
    "k15": {
      "ar": "الزراعة",
      "en": "Agriculture",
      "zh": "农业"
    },
    "k16": {
      "ar": "حلول الطاقة والمياه للقطاع الزراعي",
      "en": "Energy & Water Solutions for Agriculture",
      "zh": "农业能源与水解决方案"
    },
    "k17": {
      "ar": "منظومات متكاملة للمزارع: طاقة للضخ والري والتبريد والتخزين.",
      "en": "Integrated systems for farms: power for pumping, irrigation, cooling and storage.",
      "zh": "为农场提供一体化系统：抽水、灌溉、制冷与储能供电。"
    },
    "k18": {
      "ar": "فهم احتياجاتك",
      "en": "Understanding Your Needs",
      "zh": "了解您的需求"
    },
    "k19": {
      "ar": "نستمع أولاً: ما الذي تريد تشغيله، وكم استهلاكك، وما ظروف موقعك.",
      "en": "We listen first: what you need to run, your consumption, and your site conditions.",
      "zh": "我们首先倾听：您需要驱动什么设备、耗电量以及现场条件。"
    },
    "k20": {
      "ar": "تصميم الحلول",
      "en": "Designing the Solution",
      "zh": "设计方案"
    },
    "k21": {
      "ar": "نختار المكونات والقدرات المناسبة لمنظومتك.",
      "en": "We select the right components and capacities for your system.",
      "zh": "为您的系统选择合适的组件与容量。"
    },
    "k22": {
      "ar": "التنفيذ والمتابعة",
      "en": "Implementation & Follow-up",
      "zh": "实施与跟进"
    },
    "k23": {
      "ar": "توريد وتركيب وتشغيل، مع متابعة بعد التسليم.",
      "en": "Supply, installation and commissioning, with follow-up after handover.",
      "zh": "供货、安装与调试，交付后持续跟进。"
    },
    "k24": {
      "ar": "دعم مستمر",
      "en": "Ongoing Support",
      "zh": "持续支持"
    },
    "k25": {
      "ar": "قناة تواصل مباشرة للدعم والصيانة وقطع الغيار.",
      "en": "A direct channel for support, maintenance and spare parts.",
      "zh": "提供支持、维护与备件的直接沟通渠道。"
    },
    "k26": {
      "ar": "معاً نحو مستقبل أكثر استدامة",
      "en": "Together Towards a More Sustainable Future",
      "zh": "携手共创更可持续的未来"
    },
    "k27": {
      "ar": "كيف نعمل؟",
      "en": "How We Work",
      "zh": "我们如何工作"
    },
    "k28": {
      "ar": "لنبدأ مشروعك الآن",
      "en": "Let's Start Your Project Now",
      "zh": "现在就开始您的项目"
    },
    "k29": SHARED_COPY_1
  },
  "catalog": {
    "k2": {
      "ar": "دليل منتجات الطاقة الشمسية والمضخات والمعدات الزراعية",
      "en": "Guide to Solar Energy Products, Pumps and Agricultural Equipment",
      "zh": "太阳能产品、水泵与农业设备指南"
    },
    "k3": {
      "ar": "محولات وبطاريات وألواح ومضخات من علامات موثوقة — تصفح الكتالوج، ثم استفسر عبر واتساب عن الموديل المناسب لك.",
      "en": "Inverters, batteries, panels and pumps from trusted brands — browse the catalogue, then enquire on WhatsApp about the right model for you.",
      "zh": "来自可信品牌的逆变器、电池、电池板与水泵 — 浏览目录，然后通过 WhatsApp 咨询适合您的型号。"
    },
    "k4": {
      "ar": "مستقبل أكثر استدامة",
      "en": "A More Sustainable Future",
      "zh": "更可持续的未来"
    },
    "k5": {
      "ar": "دعم فني متخصص",
      "en": "Specialised Technical Support",
      "zh": "专业技术支持"
    },
    "k6": {
      "ar": "منتجات عالية الجودة",
      "en": "High-Quality Products",
      "zh": "高品质产品"
    },
    "k7": {
      "ar": "حلول متكاملة",
      "en": "Integrated Solutions",
      "zh": "一体化解决方案"
    },
    "k8": {
      "ar": "منظومة كاملة من مصدر واحد.",
      "en": "A complete system from one source.",
      "zh": "一站式完整系统。"
    },
    "k9": {
      "ar": "خبرة موثوقة",
      "en": "Trusted Expertise",
      "zh": "值得信赖的经验"
    },
    "k10": {
      "ar": "وكيل رسمي لعلامات عالمية.",
      "en": "Official agent of global brands.",
      "zh": "全球品牌的官方代理。"
    },
    "k11": {
      "ar": "منتجات عالية الجودة",
      "en": "High-Quality Products",
      "zh": "高品质产品"
    },
    "k12": {
      "ar": "علامات وموديلات مختارة بعناية.",
      "en": "Carefully selected brands and models.",
      "zh": "精心挑选的品牌与型号。"
    },
    "k13": {
      "ar": "دعم بعد البيع",
      "en": "After-Sales Support",
      "zh": "售后支持"
    },
    "k14": {
      "ar": "متابعة ودعم بعد التركيب.",
      "en": "Follow-up and support after installation.",
      "zh": "安装后持续跟进与支持。"
    },
    "k15": {
      "ar": "استكشف المنتجات",
      "en": "Explore Products",
      "zh": "探索产品"
    },
    "k16": {
      "ar": "المنتجات المميزة",
      "en": "Featured Products",
      "zh": "精选产品"
    },
    "k17": SHARED_COPY_17,
    "k18": SHARED_COPY_18,
    "k19": {
      "ar": "تحتاج إلى مساعدة في اختيار الحل الأنسب؟",
      "en": "Need help choosing the right solution?",
      "zh": "需要帮助选择最合适的方案吗？"
    },
    "k20": {
      "ar": "أخبرنا باحتياجك وسنرشدك إلى الموديل والمنظومة المناسبة — بلا أي التزام.",
      "en": "Tell us what you need and we will guide you to the right model and system — with no obligation.",
      "zh": "告诉我们您的需求，我们将为您推荐合适的型号与系统 — 无需任何承诺。"
    },
    "k21": {
      "ar": "لماذا تختار حلولنا؟",
      "en": "Why Choose Our Solutions?",
      "zh": "为什么选择我们？"
    }
  },
  "projects": {
    "k1": {
      "ar": "مشاريعنا",
      "en": "Our Projects"
    },
    "k2": {
      "ar": "نبني الثقة بمشاريع منفذة بعناية — وهذه الصفحة تُنشر فيها المشاريع المعتمدة فقط.",
      "en": "We build trust through carefully executed projects — only approved projects are published here."
    },
    "k3": {
      "ar": "مشاريع معتمدة",
      "en": "Approved Projects"
    },
    "k4": {
      "ar": "مشاريعنا قيد التوثيق",
      "en": "Our projects are being documented"
    },
    "k5": {
      "ar": "لا ننشر أي مشروع قبل اعتماده وموافقة العميل على نشر اسمه وصوره. بيانات المشاريع المعتمدة قيد الاستلام من العميل — تواصل معنا لمعرفة المشاريع المنفذة.",
      "en": "No project is published before approval and the client's consent to publish its name and photos. Approved project data is pending receipt from the client — contact us to learn about executed projects."
    },
    "k6": {
      "ar": "معاينة نموذج صفحة مشروع",
      "en": "Preview a project page template"
    },
    "k7": {
      "ar": "من أعمالنا — صور توضيحية",
      "en": "From Our Work — Illustrative Photos"
    },
    "k8": {
      "ar": "صور توضيحية لمنظومات شمسية — ليست مشاريع منشورة لغمدان. صور المشاريع الحقيقية تُنشر بعد اعتمادها.",
      "en": "Illustrative photos of solar systems — not published Ghamdan projects. Real project photos are published once approved."
    },
    "k9": SHARED_COPY_2,
    "k10": SHARED_COPY_1
  },
  "contact": {
    "k1": {
      "ar": "تواصل معنا",
      "en": "Contact Us",
      "zh": "联系我们"
    },
    "k2": {
      "ar": "فريقنا جاهز للإجابة عن استفساراتك — عبر واتساب، أو برسالة من النموذج أدناه.",
      "en": "Our team is ready to answer your enquiries — on WhatsApp, or through the form below.",
      "zh": "我们的团队随时解答您的咨询 — 可通过 WhatsApp 或下方表单联系我们。"
    },
    "k3": {
      "ar": "استشارة عبر واتساب",
      "en": "WhatsApp Consultation",
      "zh": "WhatsApp 咨询"
    },
    "k4": {
      "ar": "أسرع طريق إلينا — محادثة مباشرة مع الفريق.",
      "en": "The fastest way to reach us — a direct chat with the team.",
      "zh": "联系我们最快的方式 — 与团队直接对话。"
    },
    "k5": {
      "ar": "ابدأ محادثة واتساب",
      "en": "Start a WhatsApp chat",
      "zh": "开始 WhatsApp 对话"
    },
    "k6": {
      "ar": "استفسار عام",
      "en": "General Enquiry",
      "zh": "一般咨询"
    },
    "k7": {
      "ar": "أرسل استفسارك بالبريد وسنرد عليك.",
      "en": "Send your enquiry by email and we will reply.",
      "zh": "通过邮件发送您的咨询，我们将尽快回复。"
    },
    "k8": {
      "ar": "أرسل استفسارك",
      "en": "Send your enquiry",
      "zh": "发送咨询"
    },
    "k9": {
      "ar": "الدعم الفني",
      "en": "Technical Support",
      "zh": "技术支持"
    },
    "k10": {
      "ar": "مساعدة فنية لمنظومتك الحالية أو الجديدة.",
      "en": "Technical help for your current or new system.",
      "zh": "为您的现有或新系统提供技术帮助。"
    },
    "k11": {
      "ar": "تواصل مع الدعم الفني",
      "en": "Contact technical support",
      "zh": "联系技术支持"
    },
    "k12": {
      "ar": "الاسم الكامل",
      "en": "Full Name",
      "zh": "全名"
    },
    "k13": {
      "ar": "رقم الهاتف / واتساب",
      "en": "Phone / WhatsApp",
      "zh": "电话 / WhatsApp"
    },
    "k14": {
      "ar": "البريد الإلكتروني (اختياري)",
      "en": "Email (optional)",
      "zh": "电子邮箱（可选）"
    },
    "k15": {
      "ar": "نوع الاستفسار",
      "en": "Inquiry Type",
      "zh": "咨询类型"
    },
    "k16": {
      "ar": "استفسار عن منتج",
      "en": "Product inquiry"
    },
    "k17": {
      "ar": "مشروع ضخ مياه",
      "en": "Water pumping project"
    },
    "k18": {
      "ar": "منظومة منزلية / تجارية",
      "en": "Home / commercial system"
    },
    "k19": {
      "ar": "دعم / ضمان",
      "en": "Support / warranty"
    },
    "k20": {
      "ar": "أخرى",
      "en": "Other"
    },
    "k21": {
      "ar": "رسالتك",
      "en": "Your Message",
      "zh": "您的留言"
    },
    "k22": {
      "ar": "إرسال الاستفسار عبر واتساب",
      "en": "Send Inquiry via WhatsApp",
      "zh": "通过 WhatsApp 发送咨询"
    },
    "k23": {
      "ar": "النموذج يفتح واتساب بالرسالة مكتوبة — لا تُخزَّن أي بيانات على خوادم خارجية.",
      "en": "The form opens WhatsApp with your message pre-filled — no data is stored on external servers."
    },
    "k24": {
      "ar": "تم استلام استفسارك",
      "en": "Your inquiry was received"
    },
    "k25": {
      "ar": "سجّلنا رسالتك محلياً. لإرسالها عبر واتساب اضغط زر واتساب في أعلى الصفحة.",
      "en": "We recorded your message locally. To send it via WhatsApp, tap the WhatsApp button at the top of the page."
    },
    "k26": {
      "ar": "معاً نبني مستقبل أكثر استدامة",
      "en": "Together We Build a More Sustainable Future",
      "zh": "携手共建更可持续的未来"
    },
    "k27": {
      "ar": "أرسل لنا رسالة",
      "en": "Send Us a Message",
      "zh": "给我们留言"
    },
    "k28": {
      "ar": "منزل، مزرعة، منشأة — أخبرنا بمشروعك وسنبدأ معك من الخطوة الأولى.",
      "en": "A home, a farm, a facility — tell us about your project and we will start with you from step one.",
      "zh": "家庭、农场或设施 — 告诉我们您的项目，我们将从第一步与您同行。"
    },
    "k29": {
      "ar": "الأسئلة الشائعة",
      "en": "Frequently Asked Questions",
      "zh": "常见问题"
    },
    "k30": {
      "ar": "كيف أستفسر عن منتج؟",
      "en": "How do I enquire about a product?",
      "zh": "如何咨询产品？"
    },
    "k31": {
      "ar": "حدّد المنتج والكمية وراسلنا عبر واتساب، وسيؤكد فريق المبيعات التفاصيل معك.",
      "en": "Choose the product and quantity, message us on WhatsApp, and the sales team will confirm the details with you.",
      "zh": "请确定产品与数量并通过 WhatsApp 联系我们，销售团队将与您确认详情。"
    },
    "k32": {
      "ar": "ما مدة الضمان؟",
      "en": "What is the warranty duration?",
      "zh": "保修期是多久？"
    },
    "k33": {
      "ar": "نص الضمان الموحد قيد الاعتماد من غمدان والمصنّع، وسيُنشر كاملاً هنا فور اعتماده.",
      "en": "The unified warranty text is pending approval by Ghamdan and the manufacturer, and will be published here in full once approved.",
      "zh": "统一保修文本正待 Ghamdan 与制造商批准，批准后将完整发布于此。"
    },
    "k34": {
      "ar": "هل توصلون إلى محافظتي؟",
      "en": "Do you deliver to my governorate?",
      "zh": "你们送货到我的省份吗？"
    },
    "k35": {
      "ar": "التسليم يُنسَّق مع فريق المبيعات حسب الطلب والمنطقة — أرسل موقعك عبر واتساب وستصلك التفاصيل.",
      "en": "Delivery is coordinated with the sales team per order and area — send your location via WhatsApp and you will receive the details.",
      "zh": "交付按订单与地区与销售团队协调 — 请通过 WhatsApp 发送您的位置以获取详情。"
    },
    "k36": {
      "ar": "هل أداة دليل الضخ تحدد لي مضخة معينة؟",
      "en": "Does the pumping guide pick a specific pump for me?",
      "zh": "抽水指南会为我指定某一款水泵吗？"
    },
    "k37": {
      "ar": "لا — الأداة إرشاد أولي فقط؛ التحديد النهائي للمضخة يتم بعد المعاينة والاتفاق مع فريق غمدان.",
      "en": "No — the tool is preliminary guidance only; the final pump selection is made after inspection and agreement with the Ghamdan team.",
      "zh": "不会 — 该工具仅为初步指引；水泵的最终选型需在现场勘察并与 Ghamdan 团队确认后确定。"
    }
  },
  "category": {
    "inverters": {
      "k1": {
        "ar": "المحولات الهجينة والانفرترات",
        "en": "Hybrid Inverters"
      },
      "k2": {
        "ar": "قلب منظومة الطاقة — أحادي وثلاثي الطور، جهد منخفض وعالٍ",
        "en": "قلب منظومة الطاقة — أحادي وثلاثي الطور، جهد منخفض وعالٍ"
      },
      "k3": SHARED_COPY_19,
      "k4": SHARED_COPY_17,
      "k5": SHARED_COPY_18,
      "k6": SHARED_COPY_20,
      "k7": SHARED_COPY_2,
      "k8": SHARED_COPY_1
    },
    "batteries": {
      "k1": {
        "ar": "بطاريات الليثيوم والتخزين",
        "en": "Lithium Batteries & Storage"
      },
      "k2": {
        "ar": "منزلي جهد منخفض وتجاري جهد عالٍ وأنظمة تخزين صناعية",
        "en": "منزلي جهد منخفض وتجاري جهد عالٍ وأنظمة تخزين صناعية"
      },
      "k3": SHARED_COPY_19,
      "k4": SHARED_COPY_17,
      "k5": SHARED_COPY_18,
      "k6": SHARED_COPY_20,
      "k7": SHARED_COPY_2,
      "k8": SHARED_COPY_1
    },
    "panels": {
      "k1": {
        "ar": "الألواح الشمسية",
        "en": "Solar Panels"
      },
      "k2": {
        "ar": "ألواح منزلية وتجارية عالية القدرة",
        "en": "ألواح منزلية وتجارية عالية القدرة"
      },
      "k3": {
        "ar": "لا توجد منتجات منشورة في هذه الفئة بعد",
        "en": "No published products in this category yet"
      },
      "k4": {
        "ar": "المنتجات المؤكدة في هذه الفئة قيد الاعتماد من غمدان قبل النشر.",
        "en": "Confirmed products in this category are awaiting Ghamdan's approval before publication."
      },
      "k5": SHARED_COPY_19,
      "k6": SHARED_COPY_17,
      "k7": SHARED_COPY_18,
      "k8": SHARED_COPY_20,
      "k9": SHARED_COPY_2,
      "k10": SHARED_COPY_1
    },
    "pumps": {
      "k1": {
        "ar": "المضخات الشمسية وأنظمة الري",
        "en": "Solar Pumps & Irrigation"
      },
      "k2": {
        "ar": "محولات مضخات هجينة ومضخات DC وBLDC وأنظمة ري وآبار كاملة",
        "en": "محولات مضخات هجينة ومضخات DC وBLDC وأنظمة ري وآبار كاملة"
      },
      "k3": SHARED_COPY_19,
      "k4": SHARED_COPY_17,
      "k5": SHARED_COPY_18,
      "k6": SHARED_COPY_20,
      "k7": SHARED_COPY_2,
      "k8": SHARED_COPY_1
    },
    "controllers": {
      "k1": {
        "ar": "منظمات الشحن والملحقات",
        "en": "Charge Controllers & Accessories"
      },
      "k2": {
        "ar": "منظمات MPPT وكابلات وقواطع ولوحات توزيع وهياكل تثبيت",
        "en": "منظمات MPPT وكابلات وقواطع ولوحات توزيع وهياكل تثبيت"
      },
      "k3": SHARED_COPY_19,
      "k4": SHARED_COPY_17,
      "k5": SHARED_COPY_18,
      "k6": SHARED_COPY_20,
      "k7": SHARED_COPY_2,
      "k8": SHARED_COPY_1
    },
    "systems": {
      "k1": {
        "ar": "الأنظمة الجاهزة (الباقات)",
        "en": "Ready-Made Systems"
      },
      "k2": {
        "ar": "منزل صغير / متوسط / كبير / مزرعة / مصنع — ما يُباع فعلياً",
        "en": "منزل صغير / متوسط / كبير / مزرعة / مصنع — ما يُباع فعلياً"
      },
      "k3": {
        "ar": "لا توجد منتجات منشورة في هذه الفئة بعد",
        "en": "No published products in this category yet"
      },
      "k4": {
        "ar": "المنتجات المؤكدة في هذه الفئة قيد الاعتماد من غمدان قبل النشر.",
        "en": "Confirmed products in this category are awaiting Ghamdan's approval before publication."
      },
      "k5": SHARED_COPY_19,
      "k6": SHARED_COPY_17,
      "k7": SHARED_COPY_18,
      "k8": SHARED_COPY_20,
      "k9": SHARED_COPY_2,
      "k10": SHARED_COPY_1
    },
    "storage-ci": {
      "k1": {
        "ar": "التخزين التجاري والصناعي",
        "en": "Commercial & Industrial Storage"
      },
      "k2": {
        "ar": "خزائن تخزين وأنظمة خارجية كبيرة للمصانع والمستشفيات والمنشآت",
        "en": "خزائن تخزين وأنظمة خارجية كبيرة للمصانع والمستشفيات والمنشآت"
      },
      "k3": {
        "ar": "لا توجد منتجات منشورة في هذه الفئة بعد",
        "en": "No published products in this category yet"
      },
      "k4": {
        "ar": "المنتجات المؤكدة في هذه الفئة قيد الاعتماد من غمدان قبل النشر.",
        "en": "Confirmed products in this category are awaiting Ghamdan's approval before publication."
      },
      "k5": SHARED_COPY_19,
      "k6": SHARED_COPY_17,
      "k7": SHARED_COPY_18,
      "k8": SHARED_COPY_20,
      "k9": SHARED_COPY_2,
      "k10": SHARED_COPY_1
    },
    "cameras": {
      "k1": {
        "ar": "كاميرات المراقبة والأمن",
        "en": "Security Cameras"
      },
      "k2": {
        "ar": "قسم ثانوي منفصل عن الطاقة",
        "en": "قسم ثانوي منفصل عن الطاقة"
      },
      "k3": {
        "ar": "لا توجد منتجات منشورة في هذه الفئة بعد",
        "en": "No published products in this category yet"
      },
      "k4": {
        "ar": "المنتجات المؤكدة في هذه الفئة قيد الاعتماد من غمدان قبل النشر.",
        "en": "Confirmed products in this category are awaiting Ghamdan's approval before publication."
      },
      "k5": SHARED_COPY_19,
      "k6": SHARED_COPY_17,
      "k7": SHARED_COPY_18,
      "k8": SHARED_COPY_20,
      "k9": SHARED_COPY_2,
      "k10": SHARED_COPY_1
    }
  },
  "productDetail": {
    "p01": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p02": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p03": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p04": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p05": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p06": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p07": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p08": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p09": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p10": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p11": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p12": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p13": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p14": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p15": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p16": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p17": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p18": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p19": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p20": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p21": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p22": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p23": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p24": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p25": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p26": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p27": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p28": {
      "k1": SHARED_COPY_21,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p29": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p31": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p32": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p33": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p34": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p35": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p36": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p37": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    },
    "p38": {
      "k1": SHARED_COPY_16,
      "k2": SHARED_COPY_4,
      "k3": SHARED_COPY_5,
      "k4": SHARED_COPY_6,
      "k5": SHARED_COPY_7,
      "k6": SHARED_COPY_8,
      "k7": SHARED_COPY_9,
      "k8": SHARED_COPY_10,
      "k9": SHARED_COPY_11,
      "k10": SHARED_COPY_12,
      "k11": SHARED_COPY_13,
      "k12": SHARED_COPY_3,
      "k13": SHARED_COPY_14,
      "k14": SHARED_COPY_15,
      "k15": SHARED_COPY_2,
      "k16": SHARED_COPY_1
    }
  },
  "solutionDetail": {
    "pumping": {
      "k1": {
        "ar": "حلول ضخ المياه بالطاقة الشمسية",
        "en": "Solar Water Pumping Solutions",
        "zh": "太阳能抽水解决方案"
      },
      "k2": {
        "ar": "مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.",
        "en": "More water. More opportunity. For a more sustainable future.",
        "zh": "更多水，更多机遇，共创更可持续的未来。"
      },
      "k3": {
        "ar": "زراعة أكثر إنتاجية",
        "en": "More Productive Farming",
        "zh": "更高产的农业"
      },
      "k4": {
        "ar": "مجتمعات أقوى",
        "en": "Stronger Communities",
        "zh": "更强大的社区"
      },
      "k5": {
        "ar": "بيئة أنظف",
        "en": "A Cleaner Environment",
        "zh": "更清洁的环境"
      },
      "k6": {
        "ar": "الاعتماد على الوقود الأحفوري",
        "en": "Dependence on Fossil Fuel",
        "zh": "依赖化石燃料"
      },
      "k7": {
        "ar": "الضخ بالديزل مكلف ومتقلب — الشمس بديل ثابت.",
        "en": "Diesel pumping is costly and volatile — the sun is a steady alternative.",
        "zh": "柴油抽水成本高且不稳定 — 阳光是稳定的替代方案。"
      },
      "k8": {
        "ar": "صعوبة الوصول لشبكات الكهرباء",
        "en": "Hard Access to Power Grids",
        "zh": "难以接入电网"
      },
      "k9": {
        "ar": "مواقع كثيرة خارج الشبكة — المنظومة الشمسية تعمل حيثما كانت الشمس.",
        "en": "Many sites are off-grid — a solar system works wherever the sun shines.",
        "zh": "许多地点远离电网 — 太阳能系统有阳光的地方就能工作。"
      },
      "k10": {
        "ar": "ارتفاع تكاليف التشغيل",
        "en": "High Running Costs",
        "zh": "运行成本高"
      },
      "k11": {
        "ar": "كل لتر ديزل يُدفع يومياً — الشمس بلا فاتورة تشغيل.",
        "en": "Every litre of diesel is paid daily — the sun has no running bill.",
        "zh": "每升柴油都要天天付费 — 阳光没有运行账单。"
      },
      "k12": {
        "ar": "نقص إمدادات المياه الموثوقة",
        "en": "Unreliable Water Supply",
        "zh": "供水不可靠"
      },
      "k13": {
        "ar": "ضخ منتظم يعني ماءً منتظماً للشرب والري.",
        "en": "Regular pumping means regular water for drinking and irrigation.",
        "zh": "定期抽水意味着饮用与灌溉用水都有保障。"
      },
      "k14": {
        "ar": "الطاقة الشمسية",
        "en": "Solar Energy",
        "zh": "太阳能"
      },
      "k15": {
        "ar": "ألواح شمسية تولّد الكهرباء نهاراً.",
        "en": "Solar panels generate electricity during the day.",
        "zh": "太阳能电池板在白天发电。"
      },
      "k16": {
        "ar": "جهاز التحكم",
        "en": "Controller",
        "zh": "控制器"
      },
      "k17": {
        "ar": "محول مضخة يدير التشغيل ويحمي المنظومة.",
        "en": "A pump inverter manages operation and protects the system.",
        "zh": "水泵逆变器管理运行并保护系统。"
      },
      "k18": {
        "ar": "مضخة المياه",
        "en": "Water Pump",
        "zh": "水泵"
      },
      "k19": {
        "ar": "مضخة غاطسة أو سطحية ترفع الماء من البئر.",
        "en": "A submersible or surface pump lifts water from the well.",
        "zh": "潜水泵或地面泵将水从井中提升。"
      },
      "k20": {
        "ar": "توزيع المياه",
        "en": "Water Distribution",
        "zh": "配水"
      },
      "k21": {
        "ar": "خزان وشبكة توزيع تصل الماء حيث يُحتاج.",
        "en": "A tank and network carry water where it is needed.",
        "zh": "水箱与管网将水输送到需要的地方。"
      },
      "k22": {
        "ar": "الزراعة والري",
        "en": "Agriculture & Irrigation",
        "zh": "农业与灌溉"
      },
      "k23": {
        "ar": "إمدادات المياه للمجتمعات",
        "en": "Community Water Supply",
        "zh": "社区供水"
      },
      "k24": {
        "ar": "مشاريع البنية التحتية للمياه",
        "en": "Water Infrastructure Projects",
        "zh": "水利基础设施项目"
      },
      "k25": {
        "ar": "نظرة عامة",
        "en": "Overview",
        "zh": "概述"
      },
      "k26": {
        "ar": "مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.",
        "en": "More water. More opportunity. For a more sustainable future.",
        "zh": "更多水，更多机遇，共创更可持续的未来。"
      },
      "k27": {
        "ar": "منظومة ضخ شمسية متكاملة: ألواح شمسية تغذي محول مضخة، ومضخة ترفع الماء من البئر إلى خزان، وشبكة توزيع تصل الماء إلى المزرعة أو المنزل أو المجتمع — بلا وقود وبلا فواتير.",
        "en": "A complete solar pumping system: panels feed a pump inverter, a pump lifts water from the well to a tank, and a distribution network carries it to the farm, home or community — no fuel, no bills.",
        "zh": "完整的太阳能抽水系统：电池板为水泵逆变器供电，水泵将水从井中提升至水箱，配水网络将水输送至农场、家庭或社区 — 无需燃油，没有账单。"
      },
      "k28": {
        "ar": "معالجة التحديات الحقيقية في توفير المياه",
        "en": "Addressing the Real Challenges of Water Supply",
        "zh": "应对供水的真正挑战"
      },
      "k29": {
        "ar": "أربع خطوات لحل متكامل",
        "en": "Four Steps to a Complete Solution",
        "zh": "四步实现完整方案"
      },
      "k30": {
        "ar": "المكونات الرئيسية",
        "en": "Main Components",
        "zh": "主要组件"
      },
      "k31": {
        "ar": "نظام متكامل وموثوق",
        "en": "An Integrated, Reliable System",
        "zh": "一体化可靠系统"
      },
      "k32": {
        "ar": "مخطط توضيحي مبني بالكود — وليس لقطة من المرجع.",
        "en": "Illustrative diagram built in code — not a screenshot of the reference."
      },
      "k33": {
        "ar": "مناطق التطبيق",
        "en": "Areas of Application",
        "zh": "应用领域"
      },
      "k34": {
        "ar": "منتجات مكملة",
        "en": "Complementary Products",
        "zh": "配套产品"
      },
      "k35": {
        "ar": "استفسر عن مشروعك",
        "en": "Enquire About Your Project",
        "zh": "咨询您的项目"
      },
      "k36": SHARED_COPY_1
    }
  },
  "projectDetail": {
    "template": {
      "k1": {
        "ar": "نموذج: مشروع سكني",
        "en": "Template: Residential Project"
      },
      "k2": {
        "ar": "هذه صفحة قالب تطويري توضح ترتيب أقسام صفحة تفاصيل المشروع. تُستبدل بالبيانات الحقيقية بعد اعتماد أول مشروع.",
        "en": "This is a development template showing the project detail page layout. It is replaced with real data once the first project is approved."
      },
      "k3": {
        "ar": "فهم احتياجاتك",
        "en": "Understanding Your Needs",
        "zh": "了解您的需求"
      },
      "k4": {
        "ar": "نستمع أولاً: ما الذي تريد تشغيله، وكم استهلاكك، وما ظروف موقعك.",
        "en": "We listen first: what you need to run, your consumption, and your site conditions.",
        "zh": "我们首先倾听：您需要驱动什么设备、耗电量以及现场条件。"
      },
      "k5": {
        "ar": "تصميم الحلول",
        "en": "Designing the Solution",
        "zh": "设计方案"
      },
      "k6": {
        "ar": "نختار المكونات والقدرات المناسبة لمنظومتك.",
        "en": "We select the right components and capacities for your system.",
        "zh": "为您的系统选择合适的组件与容量。"
      },
      "k7": {
        "ar": "التنفيذ والمتابعة",
        "en": "Implementation & Follow-up",
        "zh": "实施与跟进"
      },
      "k8": {
        "ar": "توريد وتركيب وتشغيل، مع متابعة بعد التسليم.",
        "en": "Supply, installation and commissioning, with follow-up after handover.",
        "zh": "供货、安装与调试，交付后持续跟进。"
      },
      "k9": {
        "ar": "دعم مستمر",
        "en": "Ongoing Support",
        "zh": "持续支持"
      },
      "k10": {
        "ar": "قناة تواصل مباشرة للدعم والصيانة وقطع الغيار.",
        "en": "A direct channel for support, maintenance and spare parts.",
        "zh": "提供支持、维护与备件的直接沟通渠道。"
      },
      "k11": {
        "ar": "قالب تطويري — ليس مشروعاً حقيقياً. البيانات والصورة المعروضة للتوضيح فقط.",
        "en": "Development template — not a real project. The data and photos shown are illustrative only."
      },
      "k12": SHARED_COPY_3,
      "k13": {
        "ar": "مثال توضيحي لترتيب أقسام صفحة تفاصيل مشروع: هنا تُكتب نبذة المشروع بعد اعتماده — نوع المنظومة، وموقعها العام، والغرض منها — بلا أرقام ولا أسماء قبل التوثيق.",
        "en": "Illustrative example of a project detail page layout: the project summary goes here once approved — system type, general location and purpose — with no figures or names before documentation."
      },
      "k14": {
        "ar": "بطاقة الموقع",
        "en": "Location Card"
      },
      "k15": {
        "ar": "مثال توضيحي: تُعرض هنا المحافظة/المنطقة العامة فقط بعد موافقة العميل على نشرها — لا عنوان دقيق ولا إحداثيات.",
        "en": "Illustrative example: only the general governorate/area is shown here, after the client's consent to publish it — no exact address or coordinates."
      },
      "k16": {
        "ar": "التحدي",
        "en": "The Challenge"
      },
      "k17": {
        "ar": "مثال توضيحي: هنا يُوصف التحدي الهندسي — مثل الحاجة إلى طاقة مستمرة لموقع بعيد عن الشبكة — بصياغة العميل بعد الاعتماد.",
        "en": "Illustrative example: the engineering challenge is described here — for example, the need for continuous power at an off-grid site — in the client's own approved wording."
      },
      "k18": {
        "ar": "الحل الهندسي",
        "en": "The Engineering Solution"
      },
      "k19": {
        "ar": "مثال توضيحي: هنا يُشرح الحل — نوع المنظومة ومكوناتها الرئيسة وطريقة عملها — بلا مواصفات مختلقة قبل اعتماد قائمة المكونات.",
        "en": "Illustrative example: the solution is explained here — system type, main components and how it works — with no invented specifications before the component list is approved."
      },
      "k20": {
        "ar": "المعدات المستخدمة",
        "en": "Equipment Used"
      },
      "k21": {
        "ar": "مثال توضيحي: انفرتر هجين (الموديل بعد الاعتماد)",
        "en": "Illustrative example: hybrid inverter (model after approval)"
      },
      "k22": {
        "ar": "مثال توضيحي: بطاريات ليثيوم (الموديل بعد الاعتماد)",
        "en": "Illustrative example: lithium batteries (model after approval)"
      },
      "k23": {
        "ar": "مثال توضيحي: ألواح شمسية (القدرة بعد الاعتماد)",
        "en": "Illustrative example: solar panels (capacity after approval)"
      },
      "k24": {
        "ar": "مثال توضيحي: مضخة شمسية (للمشاريع الزراعية فقط)",
        "en": "Illustrative example: solar pump (agricultural projects only)"
      },
      "k25": {
        "ar": "نطاق الأعمال وأبرز النتائج يُعبَّآن هنا بعد الاعتماد والقياس — لا تُنشَر أرقام قبل توثيقها.",
        "en": "Scope of works and key outcomes are filled in here after approval and measurement — no figures are published before documentation."
      },
      "k26": {
        "ar": "معرض الصور",
        "en": "Photo Gallery"
      },
      "k27": {
        "ar": "مراحل التنفيذ",
        "en": "Execution Stages"
      },
      "k28": SHARED_COPY_2,
      "k29": SHARED_COPY_1
    }
  },
  "services": {
    "k1": {
      "ar": "خدماتنا",
      "en": "Our Services"
    },
    "k2": {
      "ar": "خدمات متكاملة من الاستشارة حتى ما بعد البيع — فريق واحد يرافقك في كل خطوة.",
      "en": "Integrated services from consultation to after-sales — one team with you at every step."
    },
    "k3": {
      "ar": "تصميم المنظومات",
      "en": "System Design",
      "zh": "系统设计"
    },
    "k4": {
      "ar": "دراسة احتياجك وموقعك، واختيار القدرات والمكونات المناسبة.",
      "en": "We study your needs and site, then select the right capacities and components.",
      "zh": "研究您的需求与现场条件，选择合适的容量与组件。"
    },
    "k5": {
      "ar": "توريد المنتجات",
      "en": "Product Supply",
      "zh": "产品供应"
    },
    "k6": {
      "ar": "توريد محولات وبطاريات وألواح ومضخات من علامات موثوقة.",
      "en": "Supplying inverters, batteries, panels and pumps from trusted brands.",
      "zh": "供应来自可信品牌的逆变器、电池、电池板与水泵。"
    },
    "k7": {
      "ar": "التركيب والتشغيل",
      "en": "Installation & Commissioning",
      "zh": "安装与调试"
    },
    "k8": {
      "ar": "تركيب وتشغيل المنظومة واختبارها قبل التسليم.",
      "en": "Installing and commissioning the system, tested before handover.",
      "zh": "安装调试系统，交付前完成测试。"
    },
    "k9": {
      "ar": "الصيانة والدعم",
      "en": "Maintenance & Support",
      "zh": "维护与支持"
    },
    "k10": {
      "ar": "متابعة وصيانة وقطع غيار بعد التسليم.",
      "en": "Follow-up, maintenance and spare parts after handover.",
      "zh": "交付后提供跟进、维护与备件。"
    },
    "k11": {
      "ar": "أنظمة الضخ والري",
      "en": "Pumping & Irrigation Systems",
      "zh": "抽水与灌溉系统"
    },
    "k12": {
      "ar": "منظومات ضخ وري شمسية للآبار والمزارع.",
      "en": "Solar pumping and irrigation systems for wells and farms.",
      "zh": "为水井与农场提供太阳能抽水与灌溉系统。"
    },
    "k13": {
      "ar": "استشارات فنية",
      "en": "Technical Consultation",
      "zh": "技术咨询"
    },
    "k14": {
      "ar": "استشارة قبل الشراء: أي منظومة تناسب احتياجك وميزانيتك.",
      "en": "Pre-purchase consultation: which system fits your needs and budget.",
      "zh": "购买前咨询：哪种系统最适合您的需求与预算。"
    },
    "k15": SHARED_COPY_2,
    "k16": SHARED_COPY_1
  },
  "support": {
    "k1": {
      "ar": "الدعم والضمان",
      "en": "Support & Warranty"
    },
    "k2": {
      "ar": "فريق الدعم معك قبل الشراء وبعده — تواصل معنا وستجد إجابة واضحة.",
      "en": "Our support team is with you before and after purchase — reach out and you will get a clear answer."
    },
    "k3": {
      "ar": "الدعم الفني",
      "en": "Technical Support"
    },
    "k4": {
      "ar": "كيف نساعدك؟",
      "en": "How can we help?"
    },
    "k5": {
      "ar": "للاستفسار عن منتج، أو حالة طلب، أو دعم فني — راسلنا عبر واتساب وستصلك إجابة من فريقنا.",
      "en": "For a product inquiry, an order status, or technical support — message us on WhatsApp and our team will answer."
    },
    "k6": {
      "ar": "الضمان",
      "en": "Warranty"
    },
    "k7": {
      "ar": "نص الضمان الموحد قيد الاعتماد",
      "en": "The unified warranty text is pending approval"
    },
    "k8": {
      "ar": "لا ننشر أي رقم أو مدة ضمان قبل اعتماده رسمياً من غمدان ومن المصنّع. عند اعتماد النص الموحد سيظهر هنا كاملاً.",
      "en": "We do not publish any warranty number or duration before it is formally approved by Ghamdan and the manufacturer. Once the unified text is approved it will appear here in full."
    },
    "k9": {
      "ar": "مرجع العميل: CI-08 — نص الضمان الموحد قيد الاعتماد.",
      "en": "Client input CI-08 — unified warranty text pending approval."
    },
    "k10": {
      "ar": "الأسئلة الشائعة",
      "en": "Frequently Asked Questions",
      "zh": "常见问题"
    },
    "k11": {
      "ar": "كيف أستفسر عن منتج؟",
      "en": "How do I enquire about a product?",
      "zh": "如何咨询产品？"
    },
    "k12": {
      "ar": "حدّد المنتج والكمية وراسلنا عبر واتساب، وسيؤكد فريق المبيعات التفاصيل معك.",
      "en": "Choose the product and quantity, message us on WhatsApp, and the sales team will confirm the details with you.",
      "zh": "请确定产品与数量并通过 WhatsApp 联系我们，销售团队将与您确认详情。"
    },
    "k13": {
      "ar": "ما مدة الضمان؟",
      "en": "What is the warranty duration?",
      "zh": "保修期是多久？"
    },
    "k14": {
      "ar": "نص الضمان الموحد قيد الاعتماد من غمدان والمصنّع، وسيُنشر كاملاً هنا فور اعتماده.",
      "en": "The unified warranty text is pending approval by Ghamdan and the manufacturer, and will be published here in full once approved.",
      "zh": "统一保修文本正待 Ghamdan 与制造商批准，批准后将完整发布于此。"
    },
    "k15": {
      "ar": "هل توصلون إلى محافظتي؟",
      "en": "Do you deliver to my governorate?",
      "zh": "你们送货到我的省份吗？"
    },
    "k16": {
      "ar": "التسليم يُنسَّق مع فريق المبيعات حسب الطلب والمنطقة — أرسل موقعك عبر واتساب وستصلك التفاصيل.",
      "en": "Delivery is coordinated with the sales team per order and area — send your location via WhatsApp and you will receive the details.",
      "zh": "交付按订单与地区与销售团队协调 — 请通过 WhatsApp 发送您的位置以获取详情。"
    },
    "k17": {
      "ar": "هل أداة دليل الضخ تحدد لي مضخة معينة؟",
      "en": "Does the pumping guide pick a specific pump for me?",
      "zh": "抽水指南会为我指定某一款水泵吗？"
    },
    "k18": {
      "ar": "لا — الأداة إرشاد أولي فقط؛ التحديد النهائي للمضخة يتم بعد المعاينة والاتفاق مع فريق غمدان.",
      "en": "No — the tool is preliminary guidance only; the final pump selection is made after inspection and agreement with the Ghamdan team.",
      "zh": "不会 — 该工具仅为初步指引；水泵的最终选型需在现场勘察并与 Ghamdan 团队确认后确定。"
    }
  },
  "news": {
    "k1": {
      "ar": "الأخبار والفعاليات",
      "en": "News & Events"
    },
    "k2": {
      "ar": "آخر أخبار غمدان — المنتجات الجديدة، الفعاليات، وإعلانات الشركة.",
      "en": "The latest from Ghamdan — new products, events and company announcements."
    },
    "k3": {
      "ar": "لا توجد أخبار منشورة بعد",
      "en": "No news published yet"
    },
    "k4": {
      "ar": "ستُعتمد الأخبار والفعاليات من غمدان قبل نشرها. تابع صفحتنا على فيسبوك لآخر المستجدات.",
      "en": "News and events are approved by Ghamdan before publication. Follow our Facebook page for the latest."
    }
  },
  "agencies": {
    "list": {
      "k1": {
        "ar": "الوكالات والعلامات",
        "en": "Agencies & Brands"
      },
      "k2": {
        "ar": "وكيل Deye الرسمي في اليمن، ونمثل علامات عالمية موثوقة في الطاقة الشمسية والكاميرات.",
        "en": "Official Deye agent in Yemen, and we carry trusted global brands in solar energy and cameras."
      },
      "k3": {
        "ar": "وكيل Deye الرسمي في اليمن — محولات هجينة وبطاريات وأنظمة تخزين.",
        "en": "The official Deye agent in Yemen — hybrid inverters, batteries and storage systems.",
        "zh": "Deye 在也门的官方代理 — 混合逆变器、电池与储能系统。"
      },
      "k4": {
        "ar": "بطاريات وأنظمة تخزين EFORE — منزلية وتجارية وصناعية.",
        "en": "EFORE batteries and storage systems — residential, commercial and industrial.",
        "zh": "EFORE 电池与储能系统 — 住宅、商业与工业。"
      },
      "k5": {
        "ar": "محولات اقتصادية ومنظمات شحن وبطاريات MUST.",
        "en": "MUST economy inverters, charge controllers and batteries.",
        "zh": "MUST 经济型逆变器、充电控制器与电池。"
      },
      "k6": {
        "ar": "محولات مضخات ومضخات شمسية Jntech للآبار والري.",
        "en": "Jntech pump inverters and solar pumps for wells and irrigation.",
        "zh": "Jntech 水泵逆变器与太阳能水泵，用于水井与灌溉。"
      },
      "k7": {
        "ar": "ألواح شمسية Hanwha Q-Cells — الموديلات المتوفرة قيد التأكيد.",
        "en": "Hanwha Q-Cells solar panels — available models pending confirmation.",
        "zh": "Hanwha Q-Cells 太阳能电池板 — 可供型号待确认。"
      },
      "k8": {
        "ar": "كاميرات وأنظمة مراقبة Wisenet — الموديلات قيد التأكيد.",
        "en": "Wisenet cameras and security systems — models pending confirmation.",
        "zh": "Wisenet 摄像头与安防系统 — 型号待确认。"
      },
      "k9": {
        "ar": "وكالة Deye الرسمية في اليمن معتمدة من غمدان. صفة «وكيل» لغيرها من العلامات لم تُثبَت بعد — تُذكر كعلامات معروضة حتى الاعتماد.",
        "en": "Deye's official agency in Yemen is confirmed by Ghamdan. The «agent» status of the other brands is not yet established — they are listed as carried brands until approval."
      },
      "k10": SHARED_COPY_2,
      "k11": SHARED_COPY_1
    },
    "detail": {
      "deye": {
        "k1": {
          "ar": "Deye",
          "en": "Deye"
        },
        "k2": {
          "ar": "وكيل Deye الرسمي في اليمن — محولات هجينة وبطاريات وأنظمة تخزين.",
          "en": "The official Deye agent in Yemen — hybrid inverters, batteries and storage systems.",
          "zh": "Deye 在也门的官方代理 — 混合逆变器、电池与储能系统。"
        }
      },
      "efore": {
        "k1": {
          "ar": "EFORE",
          "en": "EFORE"
        },
        "k2": {
          "ar": "بطاريات وأنظمة تخزين EFORE — منزلية وتجارية وصناعية.",
          "en": "EFORE batteries and storage systems — residential, commercial and industrial.",
          "zh": "EFORE 电池与储能系统 — 住宅、商业与工业。"
        }
      },
      "jntech": {
        "k1": {
          "ar": "Jntech",
          "en": "Jntech"
        },
        "k2": {
          "ar": "محولات مضخات ومضخات شمسية Jntech للآبار والري.",
          "en": "Jntech pump inverters and solar pumps for wells and irrigation.",
          "zh": "Jntech 水泵逆变器与太阳能水泵，用于水井与灌溉。"
        }
      },
      "must": {
        "k1": {
          "ar": "MUST",
          "en": "MUST"
        },
        "k2": {
          "ar": "محولات اقتصادية ومنظمات شحن وبطاريات MUST.",
          "en": "MUST economy inverters, charge controllers and batteries.",
          "zh": "MUST 经济型逆变器、充电控制器与电池。"
        }
      },
      "qcells": {
        "k1": {
          "ar": "Hanwha Q-Cells",
          "en": "Hanwha Q-Cells"
        },
        "k2": {
          "ar": "ألواح شمسية Hanwha Q-Cells — الموديلات المتوفرة قيد التأكيد.",
          "en": "Hanwha Q-Cells solar panels — available models pending confirmation.",
          "zh": "Hanwha Q-Cells 太阳能电池板 — 可供型号待确认。"
        },
        "k3": {
          "ar": "منتجات هذه العلامة ستظهر هنا بعد اعتماد قائمتها",
          "en": "Products of this brand will appear here once its list is approved"
        },
        "k4": {
          "ar": "تواصل معنا عبر واتساب للاستفسار عن أي منتج من هذه العلامة.",
          "en": "Contact us via WhatsApp to ask about any product from this brand."
        }
      },
      "wisenet": {
        "k1": {
          "ar": "Wisenet",
          "en": "Wisenet"
        },
        "k2": {
          "ar": "كاميرات وأنظمة مراقبة Wisenet — الموديلات قيد التأكيد.",
          "en": "Wisenet cameras and security systems — models pending confirmation.",
          "zh": "Wisenet 摄像头与安防系统 — 型号待确认。"
        },
        "k3": {
          "ar": "منتجات هذه العلامة ستظهر هنا بعد اعتماد قائمتها",
          "en": "Products of this brand will appear here once its list is approved"
        },
        "k4": {
          "ar": "تواصل معنا عبر واتساب للاستفسار عن أي منتج من هذه العلامة.",
          "en": "Contact us via WhatsApp to ask about any product from this brand."
        }
      }
    }
  },
  "systems": {
    "list": {
      "k1": {
        "ar": "الأنظمة الجاهزة",
        "en": "Ready-Made Systems"
      },
      "k2": {
        "ar": "باقات منظومات كاملة جاهزة للتركيب — اختر ما يناسب احتياجك واستفسر عن التفاصيل عبر واتساب.",
        "en": "Complete ready-to-install system bundles — choose what fits your needs and ask for details on WhatsApp."
      },
      "k3": {
        "ar": "باقة معتمدة",
        "en": "Confirmed bundle"
      },
      "k4": {
        "ar": "منزل صغير",
        "en": "Small Home",
        "zh": "小户型住宅"
      },
      "k5": {
        "ar": "باقة معتمدة",
        "en": "Confirmed bundle"
      },
      "k6": {
        "ar": "منزل متوسط",
        "en": "Medium Home",
        "zh": "中户型住宅"
      },
      "k7": {
        "ar": "باقة معتمدة",
        "en": "Confirmed bundle"
      },
      "k8": {
        "ar": "منزل / تجاري كبير",
        "en": "Large Home / Commercial",
        "zh": "大户型 / 商业"
      },
      "k9": {
        "ar": "باقة سابقة",
        "en": "Previous bundle"
      },
      "k10": {
        "ar": "باقة رمضان (سابقة)",
        "en": "Ramadan Bundle (previous)",
        "zh": "斋月套餐（往期）"
      },
      "k11": {
        "ar": "الباقات المعروضة معتمدة من غمدان. مكونات الباقات التفصيلية قيد الاعتماد النهائي — للتفاصيل والتوفر تواصل معنا عبر واتساب.",
        "en": "The bundles shown are approved by Ghamdan. Detailed bundle components are under final approval — for details and availability, contact us via WhatsApp."
      },
      "k12": SHARED_COPY_2,
      "k13": SHARED_COPY_1
    },
    "bundles": {
      "bundle-1": {
        "k1": {
          "ar": "منزل صغير",
          "en": "Small Home"
        },
        "k2": {
          "ar": "منزل صغير",
          "en": "Small Home",
          "zh": "小户型住宅"
        },
        "k3": {
          "ar": "مكونات الباقة",
          "en": "Bundle Components"
        },
        "k4": {
          "ar": "ما تشمله الباقة",
          "en": "What the bundle includes"
        },
        "k5": {
          "ar": "قائمة المكونات التفصيلية قيد الاعتماد النهائي من غمدان.",
          "en": "The detailed component list is under final approval by Ghamdan."
        },
        "k6": {
          "ar": "استفسر عن هذه الباقة",
          "en": "Ask about this bundle"
        },
        "k7": {
          "ar": "استفسر عن هذه الباقة عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.",
          "en": "Ask about this bundle via WhatsApp — price, availability and delivery are confirmed with the sales team."
        }
      },
      "bundle-2": {
        "k1": {
          "ar": "منزل متوسط",
          "en": "Medium Home"
        },
        "k2": {
          "ar": "منزل متوسط",
          "en": "Medium Home",
          "zh": "中户型住宅"
        },
        "k3": {
          "ar": "مكونات الباقة",
          "en": "Bundle Components"
        },
        "k4": {
          "ar": "ما تشمله الباقة",
          "en": "What the bundle includes"
        },
        "k5": {
          "ar": "قائمة المكونات التفصيلية قيد الاعتماد النهائي من غمدان.",
          "en": "The detailed component list is under final approval by Ghamdan."
        },
        "k6": {
          "ar": "استفسر عن هذه الباقة",
          "en": "Ask about this bundle"
        },
        "k7": {
          "ar": "استفسر عن هذه الباقة عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.",
          "en": "Ask about this bundle via WhatsApp — price, availability and delivery are confirmed with the sales team."
        }
      },
      "bundle-3": {
        "k1": {
          "ar": "منزل / تجاري كبير",
          "en": "Large Home / Commercial"
        },
        "k2": {
          "ar": "منزل / تجاري كبير",
          "en": "Large Home / Commercial",
          "zh": "大户型 / 商业"
        },
        "k3": {
          "ar": "مكونات الباقة",
          "en": "Bundle Components"
        },
        "k4": {
          "ar": "ما تشمله الباقة",
          "en": "What the bundle includes"
        },
        "k5": {
          "ar": "قائمة المكونات التفصيلية قيد الاعتماد النهائي من غمدان.",
          "en": "The detailed component list is under final approval by Ghamdan."
        },
        "k6": {
          "ar": "استفسر عن هذه الباقة",
          "en": "Ask about this bundle"
        },
        "k7": {
          "ar": "استفسر عن هذه الباقة عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.",
          "en": "Ask about this bundle via WhatsApp — price, availability and delivery are confirmed with the sales team."
        }
      },
      "bundle-4": {
        "k1": {
          "ar": "باقة رمضان (سابقة)",
          "en": "Ramadan Bundle (previous)"
        },
        "k2": {
          "ar": "باقة رمضان (سابقة)",
          "en": "Ramadan Bundle (previous)",
          "zh": "斋月套餐（往期）"
        },
        "k3": {
          "ar": "مكونات الباقة",
          "en": "Bundle Components"
        },
        "k4": {
          "ar": "ما تشمله الباقة",
          "en": "What the bundle includes"
        },
        "k5": {
          "ar": "قائمة المكونات التفصيلية قيد الاعتماد النهائي من غمدان.",
          "en": "The detailed component list is under final approval by Ghamdan."
        },
        "k6": {
          "ar": "استفسر عن هذه الباقة",
          "en": "Ask about this bundle"
        },
        "k7": {
          "ar": "استفسر عن هذه الباقة عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.",
          "en": "Ask about this bundle via WhatsApp — price, availability and delivery are confirmed with the sales team."
        }
      }
    }
  },
  "downloads": {
    "k1": {
      "ar": "التحميلات",
      "en": "Downloads"
    },
    "k2": {
      "ar": "كتالوجات وأدلة المنتجات — تُرفع هنا بعد اعتمادها من غمدان.",
      "en": "Product catalogs and guides — uploaded here once approved by Ghamdan."
    },
    "k3": {
      "ar": "لا توجد ملفات منشورة بعد",
      "en": "No files published yet"
    },
    "k4": {
      "ar": "كتالوجات المنتجات وأدلة التركيب تُرفع هنا بعد اعتمادها من غمدان والمصنّع.",
      "en": "Product catalogs and installation guides are uploaded here once approved by Ghamdan and the manufacturer."
    }
  },
  "legal": {
    "privacy": {
      "k1": {
        "ar": "سياسة الخصوصية",
        "en": "Privacy Policy"
      },
      "k2": {
        "ar": "هذا النص القانوني مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.",
        "en": "This legal text is a draft pending approval — no clause is binding before review by Ghamdan and its legal counsel."
      },
      "k3": {
        "ar": "نطاق هذا النص",
        "en": "Scope of this text"
      },
      "k4": {
        "ar": "بيانات التواصل التي تجمعها غمدان وكيفية استخدامها",
        "en": "Contact data Ghamdan collects and how it is used"
      },
      "k5": {
        "ar": "المراسلة عبر واتساب — تتم عبر منصة واتساب بشروطها",
        "en": "Messaging via WhatsApp — conducted through WhatsApp under its terms"
      },
      "k6": {
        "ar": "لا نبيع بياناتك لأي طرف ثالث",
        "en": "We do not sell your data to any third party"
      },
      "k7": {
        "ar": "مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.",
        "en": "Draft pending approval — no clause is binding before review by Ghamdan and its legal counsel."
      }
    },
    "terms": {
      "k1": {
        "ar": "الشروط والأحكام",
        "en": "Terms & Conditions"
      },
      "k2": {
        "ar": "هذه الشروط مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.",
        "en": "This legal text is a draft pending approval — no clause is binding before review by Ghamdan and its legal counsel."
      },
      "k3": {
        "ar": "نطاق هذه الشروط",
        "en": "Scope of these terms"
      },
      "k4": {
        "ar": "التفاصيل تُؤكَّد كتابياً عبر واتساب مع فريق المبيعات",
        "en": "Details are confirmed in writing via WhatsApp with the sales team"
      },
      "k5": {
        "ar": "التركيب والتسليم يتم بالاتفاق الكتابي مع العميل",
        "en": "Installation and delivery are agreed in writing with the client"
      },
      "k6": {
        "ar": "الضمان يخضع للنص الموحد المعتمد",
        "en": "Warranty is governed by the approved unified text"
      },
      "k7": {
        "ar": "مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.",
        "en": "Draft pending approval — no clause is binding before review by Ghamdan and its legal counsel."
      }
    }
  },
  "search": {
    "k1": {
      "ar": "البحث",
      "en": "Search"
    },
    "k2": {
      "ar": "ابحث بالاسم أو العلامة أو المواصفات — النتائج تُحدَّث مباشرة.",
      "en": "Search by name, brand or specification — results update live."
    },
    "k3": SHARED_COPY_17,
    "k4": {
      "ar": "جرّب كلمة أخرى.",
      "en": "Try another word."
    }
  },
  "guidance": {
    "k1": {
      "ar": "دليل الضخ — إرشاد أولي",
      "en": "Pumping Guidance — Preliminary"
    },
    "k2": {
      "ar": "أجب عن ثلاثة أسئلة، وسيحوّلك الدليل إلى واتساب برسالة جاهزة — هذه أداة إرشاد أولية وليست حساب تحجيم معتمداً.",
      "en": "Answer three questions and the guide takes you to WhatsApp with a ready message — a preliminary guidance tool, not a certified sizing calculation."
    },
    "k3": {
      "ar": "عمق البئر (متر)",
      "en": "Well depth (m)",
      "zh": "井深（米）"
    },
    "k4": {
      "ar": "الاحتياج اليومي من الماء (م³)",
      "en": "Daily water need (m³)",
      "zh": "每日需水量（m³）"
    },
    "k5": {
      "ar": "نوع الاستخدام",
      "en": "Use type",
      "zh": "用途"
    },
    "k6": {
      "ar": "ري محاصيل",
      "en": "Crop irrigation"
    },
    "k7": {
      "ar": "شرب / منزلي",
      "en": "Drinking / domestic"
    },
    "k8": {
      "ar": "تربية مواشي / تجاري",
      "en": "Livestock / commercial"
    },
    "k9": {
      "ar": "تجهيز رسالة واتساب",
      "en": "Prepare WhatsApp Message"
    },
    "k10": {
      "ar": "لا نقدّم توصية بمضخة محددة في هذه الأداة — التحديد النهائي يتم بعد المعاينة والاتفاق مع فريق غمدان.",
      "en": "No specific pump is recommended by this tool — the final selection is made after inspection and agreement with the Ghamdan team."
    }
  },
  "notFound": {
    "k1": {
      "ar": "الصفحة غير موجودة",
      "en": "Page Not Found"
    },
    "k2": {
      "ar": "ربما نُقل الرابط أو حُذف. عد إلى الرئيسية أو راسلنا عبر واتساب.",
      "en": "The link may have moved or been removed. Go home or message us on WhatsApp."
    }
  }
};
;

/** No approved projects yet (CI-07). Render the empty state from pages.projects. */
export const approvedProjects: Project[] = [];
