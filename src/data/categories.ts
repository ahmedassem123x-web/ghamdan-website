/**
 * Ghamdan (GTS) — product categories (8).
 *
 * Source: old build assets/js/data.js categories + xlsx sheet "ملخص الأقسام"
 * (subcategories and brands per category). The xlsx's 9th row ("علامات تحتاج
 * تأكيداً" — Haze / Solarbaba / Nash-SRNE) is NOT a category and is excluded.
 * "Shenzhen Kexin" is added to the batteries brands because products p22,
 * p23, p26 carry that (corrected) brand — see products.ts.
 * publishedCount is computed from products.ts. Categories "systems",
 * "storage-ci" and "cameras" have 0 published products: systems holds the
 * bundles (see bundles.ts), storage-ci has no direct products yet, cameras
 * has only the pending p39.
 */
import type { Category } from "./types";
import { products } from "./products";

const rawCategories: Omit<Category, "publishedCount">[] = [
  {
    "id": "inverters",
    "name": {
      "ar": "المحولات الهجينة والانفرترات",
      "en": "Hybrid Inverters",
      "zh": "混合逆变器"
    },
    "note": {
      "ar": "قلب منظومة الطاقة — أحادي وثلاثي الطور، جهد منخفض وعالٍ"
    },
    "icon": "zap",
    "priority": "high",
    "subcategories": [
      "أحادي الطور جهد منخفض",
      "ثلاثي الطور جهد منخفض",
      "ثلاثي الطور جهد عالٍ",
      "أوف-جريد"
    ],
    "brands": [
      "Deye",
      "MUST"
    ]
  },
  {
    "id": "batteries",
    "name": {
      "ar": "بطاريات الليثيوم والتخزين",
      "en": "Lithium Batteries & Storage",
      "zh": "锂电池与储能"
    },
    "note": {
      "ar": "منزلي جهد منخفض وتجاري جهد عالٍ وأنظمة تخزين صناعية"
    },
    "icon": "battery",
    "priority": "high",
    "subcategories": [
      "منزلي جهد منخفض",
      "تجاري جهد عالٍ",
      "أنظمة تخزين صناعية ESS",
      "بطاريات كربون-رصاص"
    ],
    "brands": [
      "Deye",
      "EFORE",
      "MUST",
      "Shenzhen Kexin"
    ]
  },
  {
    "id": "panels",
    "name": {
      "ar": "الألواح الشمسية",
      "en": "Solar Panels",
      "zh": "太阳能电池板"
    },
    "note": {
      "ar": "ألواح منزلية وتجارية عالية القدرة"
    },
    "icon": "sun",
    "priority": "high",
    "subcategories": [
      "ألواح منزلية",
      "ألواح تجارية عالية القدرة"
    ],
    "brands": [
      "Hanwha Q-Cells"
    ]
  },
  {
    "id": "pumps",
    "name": {
      "ar": "المضخات الشمسية وأنظمة الري",
      "en": "Solar Pumps & Irrigation",
      "zh": "太阳能水泵与灌溉"
    },
    "note": {
      "ar": "محولات مضخات هجينة ومضخات DC وBLDC وأنظمة ري وآبار كاملة"
    },
    "icon": "droplet",
    "priority": "medium",
    "subcategories": [
      "محولات مضخات هجينة AC",
      "مضخات DC وBLDC",
      "أنظمة ري وآبار كاملة"
    ],
    "brands": [
      "Jntech"
    ]
  },
  {
    "id": "controllers",
    "name": {
      "ar": "منظمات الشحن والملحقات",
      "en": "Charge Controllers & Accessories",
      "zh": "充电控制器与配件"
    },
    "note": {
      "ar": "منظمات MPPT وكابلات وقواطع ولوحات توزيع وهياكل تثبيت"
    },
    "icon": "sliders",
    "priority": "medium",
    "subcategories": [
      "منظمات MPPT",
      "كابلات وقواطع ولوحات توزيع",
      "هياكل تثبيت"
    ],
    "brands": [
      "MUST"
    ]
  },
  {
    "id": "systems",
    "name": {
      "ar": "الأنظمة الجاهزة (الباقات)",
      "en": "Ready-Made Systems",
      "zh": "成套系统"
    },
    "note": {
      "ar": "منزل صغير / متوسط / كبير / مزرعة / مصنع — ما يُباع فعلياً"
    },
    "icon": "package",
    "priority": "high",
    "subcategories": [
      "منزل صغير",
      "منزل متوسط",
      "منزل وتجاري كبير",
      "مزرعة",
      "مصنع"
    ],
    "brands": [
      "Deye",
      "EFORE",
      "MUST"
    ]
  },
  {
    "id": "storage-ci",
    "name": {
      "ar": "التخزين التجاري والصناعي",
      "en": "Commercial & Industrial Storage",
      "zh": "工商业储能"
    },
    "note": {
      "ar": "خزائن تخزين وأنظمة خارجية كبيرة للمصانع والمستشفيات والمنشآت"
    },
    "icon": "database",
    "priority": "medium",
    "subcategories": [
      "خزائن تخزين",
      "أنظمة خارجية كبيرة"
    ],
    "brands": [
      "EFORE",
      "Deye"
    ]
  },
  {
    "id": "cameras",
    "name": {
      "ar": "كاميرات المراقبة والأمن",
      "en": "Security Cameras",
      "zh": "监控摄像头"
    },
    "note": {
      "ar": "قسم ثانوي منفصل عن الطاقة"
    },
    "icon": "camera",
    "priority": "low",
    "subcategories": [
      "كاميرات",
      "أجهزة تسجيل"
    ],
    "brands": [
      "Wisenet"
    ]
  }
];

/** publishedCount is computed from products.ts — never hand-written. */
export const categories: Category[] = rawCategories.map((c) => ({
  ...c,
  publishedCount: products.filter((p) => p.categoryId === c.id && p.status === "published").length,
}));

;
