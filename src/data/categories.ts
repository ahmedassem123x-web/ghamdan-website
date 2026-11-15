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

export const categories: Category[] = [
  {
    "id": "inverters",
    "name": {
      "ar": "المحولات الهجينة والانفرترات",
      "en": "Hybrid Inverters",
      "zh": "混合逆变器"
    },
    "note": {
      "ar": "قلب منظومة الطاقة — أحادي وثلاثي الطور، جهد منخفض وعالٍ",
      "en": "The heart of the energy system — single- and three-phase, low and high voltage"
    },
    "icon": "zap",
    "priority": "high",
    "subcategories": [
      {
        "ar": "أحادي الطور جهد منخفض",
        "en": "Single-phase, low voltage"
      },
      {
        "ar": "ثلاثي الطور جهد منخفض",
        "en": "Three-phase, low voltage"
      },
      {
        "ar": "ثلاثي الطور جهد عالٍ",
        "en": "Three-phase, high voltage"
      },
      {
        "ar": "أوف-جريد",
        "en": "Off-grid"
      }
    ],
    "brands": [
      "Deye",
      "MUST"
    ],
    "publishedCount": 13
  },
  {
    "id": "batteries",
    "name": {
      "ar": "بطاريات الليثيوم والتخزين",
      "en": "Lithium Batteries & Storage",
      "zh": "锂电池与储能"
    },
    "note": {
      "ar": "منزلي جهد منخفض وتجاري جهد عالٍ وأنظمة تخزين صناعية",
      "en": "Residential low voltage, commercial high voltage, and industrial storage systems"
    },
    "icon": "battery",
    "priority": "high",
    "subcategories": [
      {
        "ar": "منزلي جهد منخفض",
        "en": "Residential, low voltage"
      },
      {
        "ar": "تجاري جهد عالٍ",
        "en": "Commercial, high voltage"
      },
      {
        "ar": "أنظمة تخزين صناعية ESS",
        "en": "Industrial ESS storage systems"
      },
      {
        "ar": "بطاريات كربون-رصاص",
        "en": "Carbon-lead batteries"
      }
    ],
    "brands": [
      "Deye",
      "EFORE",
      "MUST",
      "Shenzhen Kexin"
    ],
    "publishedCount": 16
  },
  {
    "id": "panels",
    "name": {
      "ar": "الألواح الشمسية",
      "en": "Solar Panels",
      "zh": "太阳能电池板"
    },
    "note": {
      "ar": "ألواح منزلية وتجارية عالية القدرة",
      "en": "High-power residential and commercial panels"
    },
    "icon": "sun",
    "priority": "high",
    "subcategories": [
      {
        "ar": "ألواح منزلية",
        "en": "Residential panels"
      },
      {
        "ar": "ألواح تجارية عالية القدرة",
        "en": "High-power commercial panels"
      }
    ],
    "brands": [
      "Hanwha Q-Cells"
    ],
    "publishedCount": 0
  },
  {
    "id": "pumps",
    "name": {
      "ar": "المضخات الشمسية وأنظمة الري",
      "en": "Solar Pumps & Irrigation",
      "zh": "太阳能水泵与灌溉"
    },
    "note": {
      "ar": "محولات مضخات هجينة ومضخات DC وBLDC وأنظمة ري وآبار كاملة",
      "en": "Hybrid pump inverters, DC and BLDC pumps, and complete irrigation and well systems"
    },
    "icon": "droplet",
    "priority": "medium",
    "subcategories": [
      {
        "ar": "محولات مضخات هجينة AC",
        "en": "Hybrid AC pump inverters"
      },
      {
        "ar": "مضخات DC وBLDC",
        "en": "DC and BLDC pumps"
      },
      {
        "ar": "أنظمة ري وآبار كاملة",
        "en": "Complete irrigation and well systems"
      }
    ],
    "brands": [
      "Jntech"
    ],
    "publishedCount": 7
  },
  {
    "id": "controllers",
    "name": {
      "ar": "منظمات الشحن والملحقات",
      "en": "Charge Controllers & Accessories",
      "zh": "充电控制器与配件"
    },
    "note": {
      "ar": "منظمات MPPT وكابلات وقواطع ولوحات توزيع وهياكل تثبيت",
      "en": "MPPT controllers, cables, breakers, distribution boards, and mounting structures"
    },
    "icon": "sliders",
    "priority": "medium",
    "subcategories": [
      {
        "ar": "منظمات MPPT",
        "en": "MPPT controllers"
      },
      {
        "ar": "كابلات وقواطع ولوحات توزيع",
        "en": "Cables, breakers, and distribution boards"
      },
      {
        "ar": "هياكل تثبيت",
        "en": "Mounting structures"
      }
    ],
    "brands": [
      "MUST"
    ],
    "publishedCount": 1
  },
  {
    "id": "systems",
    "name": {
      "ar": "الأنظمة الجاهزة (الباقات)",
      "en": "Ready-Made Systems",
      "zh": "成套系统"
    },
    "note": {
      "ar": "منزل صغير / متوسط / كبير / مزرعة / مصنع — ما يُباع فعلياً",
      "en": "Small / medium / large home, farm, factory — what is actually sold"
    },
    "icon": "package",
    "priority": "high",
    "subcategories": [
      {
        "ar": "منزل صغير",
        "en": "Small home"
      },
      {
        "ar": "منزل متوسط",
        "en": "Medium home"
      },
      {
        "ar": "منزل وتجاري كبير",
        "en": "Large home and commercial"
      },
      {
        "ar": "مزرعة",
        "en": "Farm"
      },
      {
        "ar": "مصنع",
        "en": "Factory"
      }
    ],
    "brands": [
      "Deye",
      "EFORE",
      "MUST"
    ],
    "publishedCount": 0
  },
  {
    "id": "storage-ci",
    "name": {
      "ar": "التخزين التجاري والصناعي",
      "en": "Commercial & Industrial Storage",
      "zh": "工商业储能"
    },
    "note": {
      "ar": "خزائن تخزين وأنظمة خارجية كبيرة للمصانع والمستشفيات والمنشآت",
      "en": "Storage cabinets and large outdoor systems for factories, hospitals, and facilities"
    },
    "icon": "database",
    "priority": "medium",
    "subcategories": [
      {
        "ar": "خزائن تخزين",
        "en": "Storage cabinets"
      },
      {
        "ar": "أنظمة خارجية كبيرة",
        "en": "Large outdoor systems"
      }
    ],
    "brands": [
      "EFORE",
      "Deye"
    ],
    "publishedCount": 0
  },
  {
    "id": "cameras",
    "name": {
      "ar": "كاميرات المراقبة والأمن",
      "en": "Security Cameras",
      "zh": "监控摄像头"
    },
    "note": {
      "ar": "قسم ثانوي منفصل عن الطاقة",
      "en": "A secondary section, separate from energy"
    },
    "icon": "camera",
    "priority": "low",
    "subcategories": [
      {
        "ar": "كاميرات",
        "en": "Cameras"
      },
      {
        "ar": "أجهزة تسجيل",
        "en": "Recording devices"
      }
    ],
    "brands": [
      "Wisenet"
    ],
    "publishedCount": 0
  }
];
;
