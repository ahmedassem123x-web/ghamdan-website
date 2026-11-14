/**
 * Ghamdan (GTS) — solutions content.
 *
 * Source: old build tools/sitegen/content.py (HOME pillars, SOLUTIONS,
 * SOLUTIONS_PAGE process, PUMPING detail, SERVICES) — approved copy, no
 * invented results, testimonials, stats or prices.
 * - pillars: the 3 home pillars (solar systems / water engineering /
 *   agricultural technology).
 * - solutionAreas: the 5 solution families (residential, commercial,
 *   pumping, irrigation, agriculture). Only "pumping" has a detail page;
 *   the other four have no approved detail content yet.
 * - pumping: the solar water pumping detail (reference 09). Steps,
 *   challenges and applications are reference-structure copy. The pumping
 *   guidance tool is guidance ONLY (CI-14): no pump sizing, no model
 *   recommendation — see guidanceOnly flag and pages.guidance.
 * - services: the 6 services from services.html.
 * Application images are old-build stand-in photo filenames (BUILD_SPEC
 * §0.5): "greenhouse.jpg" actually shows a drip-irrigated field and
 * "crops.jpg" shows crop rows — label them by what they show, not by
 * filename.
 */
import type {
  PumpingDetail,
  ProcessStep,
  Service,
  SolutionArea,
  SolutionPillar,
} from "./types";

export const pillars: SolutionPillar[] = [
  {
    "icon": "sun",
    "title": {
      "ar": "أنظمة الطاقة الشمسية",
      "en": "Solar Energy Systems",
      "zh": "太阳能系统"
    },
    "text": {
      "ar": "محولات وبطاريات وألواح من علامات موثوقة.",
      "en": "Inverters, batteries and panels from trusted brands.",
      "zh": "来自可信品牌的逆变器、电池与电池板。"
    }
  },
  {
    "icon": "droplet",
    "title": {
      "ar": "هندسة المياه",
      "en": "Water Engineering",
      "zh": "水工程"
    },
    "text": {
      "ar": "ضخ وري بالطاقة الشمسية للآبار والمزارع.",
      "en": "Solar pumping and irrigation for wells and farms.",
      "zh": "为水井与农场提供太阳能抽水与灌溉。"
    }
  },
  {
    "icon": "leaf",
    "title": {
      "ar": "التقنيات الزراعية",
      "en": "Agricultural Technology",
      "zh": "农业技术"
    },
    "text": {
      "ar": "حلول ري ذكية ترفع كفاءة المياه والطاقة.",
      "en": "Smart irrigation solutions that raise water and energy efficiency.",
      "zh": "提高水与能源效率的智能灌溉方案。"
    }
  }
];;

export const solutionAreas: SolutionArea[] = [
  {
    "id": "residential",
    "icon": "home",
    "pill": {
      "ar": "للمنازل",
      "en": "For Homes",
      "zh": "住宅"
    },
    "title": {
      "ar": "الطاقة الشمسية السكنية",
      "en": "Residential Solar Energy",
      "zh": "住宅太阳能"
    },
    "text": {
      "ar": "منظومات منزلية متكاملة: محول هجين وبطارية وألواح — كهرباء مستقرة ليلاً ونهاراً.",
      "en": "Complete home systems: hybrid inverter, battery and panels — stable power day and night.",
      "zh": "完整的家庭系统：混合逆变器、电池与电池板 — 全天候稳定供电。"
    }
  },
  {
    "id": "commercial",
    "icon": "zap",
    "pill": {
      "ar": "للمنشآت",
      "en": "For Facilities",
      "zh": "工商业"
    },
    "title": {
      "ar": "حلول الطاقة التجارية والصناعية",
      "en": "Commercial & Industrial Energy Solutions",
      "zh": "工商业能源解决方案"
    },
    "text": {
      "ar": "منظومات ثلاثية الطور وجهد عالٍ للمحلات والمكاتب والمصانع والمستشفيات.",
      "en": "Three-phase and high-voltage systems for shops, offices, factories and hospitals.",
      "zh": "为商铺、办公室、工厂与医院提供三相与高压系统。"
    }
  },
  {
    "id": "pumping",
    "icon": "droplet",
    "pill": {
      "ar": "المياه",
      "en": "Water",
      "zh": "水"
    },
    "title": {
      "ar": "ضخ المياه بالطاقة الشمسية",
      "en": "Solar Water Pumping",
      "zh": "太阳能抽水"
    },
    "text": {
      "ar": "ضخ من الآبار بالطاقة الشمسية — بلا وقود، وبلا فواتير كهرباء للضخ.",
      "en": "Pumping from wells on solar power — no fuel, no electricity bills for pumping.",
      "zh": "以太阳能从水井抽水 — 无需燃油，无抽水电费。"
    }
  },
  {
    "id": "irrigation",
    "icon": "leaf",
    "pill": {
      "ar": "الري الذكي",
      "en": "Smart Irrigation",
      "zh": "智能灌溉"
    },
    "title": {
      "ar": "أنظمة الري الذكية",
      "en": "Smart Irrigation Systems",
      "zh": "智能灌溉系统"
    },
    "text": {
      "ar": "ري بالتنقيط والرش يدار بالطاقة الشمسية — ماء أقل، ومحصول أفضل.",
      "en": "Drip and sprinkler irrigation run on solar power — less water, better yield.",
      "zh": "以太阳能运行的滴灌与喷灌 — 更少用水，更好收成。"
    }
  },
  {
    "id": "agriculture",
    "icon": "sun",
    "pill": {
      "ar": "الزراعة",
      "en": "Agriculture",
      "zh": "农业"
    },
    "title": {
      "ar": "حلول الطاقة والمياه للقطاع الزراعي",
      "en": "Energy & Water Solutions for Agriculture",
      "zh": "农业能源与水解决方案"
    },
    "text": {
      "ar": "منظومات متكاملة للمزارع: طاقة للضخ والري والتبريد والتخزين.",
      "en": "Integrated systems for farms: power for pumping, irrigation, cooling and storage.",
      "zh": "为农场提供一体化系统：抽水、灌溉、制冷与储能供电。"
    }
  }
];;

export const workProcess: ProcessStep[] = [
  {
    "icon": "users",
    "title": {
      "ar": "فهم احتياجاتك",
      "en": "Understanding Your Needs",
      "zh": "了解您的需求"
    },
    "text": {
      "ar": "نستمع أولاً: ما الذي تريد تشغيله، وكم استهلاكك، وما ظروف موقعك.",
      "en": "We listen first: what you need to run, your consumption, and your site conditions.",
      "zh": "我们首先倾听：您需要驱动什么设备、耗电量以及现场条件。"
    }
  },
  {
    "icon": "settings",
    "title": {
      "ar": "تصميم الحلول",
      "en": "Designing the Solution",
      "zh": "设计方案"
    },
    "text": {
      "ar": "نختار المكونات والقدرات المناسبة لمنظومتك.",
      "en": "We select the right components and capacities for your system.",
      "zh": "为您的系统选择合适的组件与容量。"
    }
  },
  {
    "icon": "wrench",
    "title": {
      "ar": "التنفيذ والمتابعة",
      "en": "Implementation & Follow-up",
      "zh": "实施与跟进"
    },
    "text": {
      "ar": "توريد وتركيب وتشغيل، مع متابعة بعد التسليم.",
      "en": "Supply, installation and commissioning, with follow-up after handover.",
      "zh": "供货、安装与调试，交付后持续跟进。"
    }
  },
  {
    "icon": "headset",
    "title": {
      "ar": "دعم مستمر",
      "en": "Ongoing Support",
      "zh": "持续支持"
    },
    "text": {
      "ar": "قناة تواصل مباشرة للدعم والصيانة وقطع الغيار.",
      "en": "A direct channel for support, maintenance and spare parts.",
      "zh": "提供支持、维护与备件的直接沟通渠道。"
    }
  }
];;

export const pumping: PumpingDetail = {
  "id": "pumping",
  "heroTitle": {
    "ar": "حلول ضخ المياه بالطاقة الشمسية",
    "en": "Solar Water Pumping Solutions",
    "zh": "太阳能抽水解决方案"
  },
  "heroCopy": {
    "ar": "مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.",
    "en": "More water. More opportunity. For a more sustainable future.",
    "zh": "更多水，更多机遇，共创更可持续的未来。"
  },
  "overviewTitle": {
    "ar": "نظرة عامة",
    "en": "Overview",
    "zh": "概述"
  },
  "overviewHead": {
    "ar": "مياه أكثر. فرص أكبر. لمستقبل أكثر استدامة.",
    "en": "More water. More opportunity. For a more sustainable future.",
    "zh": "更多水，更多机遇，共创更可持续的未来。"
  },
  "overviewCopy": {
    "ar": "منظومة ضخ شمسية متكاملة: ألواح شمسية تغذي محول مضخة، ومضخة ترفع الماء من البئر إلى خزان، وشبكة توزيع تصل الماء إلى المزرعة أو المنزل أو المجتمع — بلا وقود وبلا فواتير.",
    "en": "A complete solar pumping system: panels feed a pump inverter, a pump lifts water from the well to a tank, and a distribution network carries it to the farm, home or community — no fuel, no bills.",
    "zh": "完整的太阳能抽水系统：电池板为水泵逆变器供电，水泵将水从井中提升至水箱，配水网络将水输送至农场、家庭或社区 — 无需燃油，没有账单。"
  },
  "overviewFeatures": [
    {
      "icon": "leaf",
      "title": {
        "ar": "زراعة أكثر إنتاجية",
        "en": "More Productive Farming",
        "zh": "更高产的农业"
      }
    },
    {
      "icon": "users",
      "title": {
        "ar": "مجتمعات أقوى",
        "en": "Stronger Communities",
        "zh": "更强大的社区"
      }
    },
    {
      "icon": "sun",
      "title": {
        "ar": "بيئة أنظف",
        "en": "A Cleaner Environment",
        "zh": "更清洁的环境"
      }
    }
  ],
  "challengesTitle": {
    "ar": "معالجة التحديات الحقيقية في توفير المياه",
    "en": "Addressing the Real Challenges of Water Supply",
    "zh": "应对供水的真正挑战"
  },
  "challenges": [
    {
      "icon": "zap",
      "title": {
        "ar": "الاعتماد على الوقود الأحفوري",
        "en": "Dependence on Fossil Fuel",
        "zh": "依赖化石燃料"
      },
      "text": {
        "ar": "الضخ بالديزل مكلف ومتقلب — الشمس بديل ثابت.",
        "en": "Diesel pumping is costly and volatile — the sun is a steady alternative.",
        "zh": "柴油抽水成本高且不稳定 — 阳光是稳定的替代方案。"
      }
    },
    {
      "icon": "alert",
      "title": {
        "ar": "صعوبة الوصول لشبكات الكهرباء",
        "en": "Hard Access to Power Grids",
        "zh": "难以接入电网"
      },
      "text": {
        "ar": "مواقع كثيرة خارج الشبكة — المنظومة الشمسية تعمل حيثما كانت الشمس.",
        "en": "Many sites are off-grid — a solar system works wherever the sun shines.",
        "zh": "许多地点远离电网 — 太阳能系统有阳光的地方就能工作。"
      }
    },
    {
      "icon": "gauge",
      "title": {
        "ar": "ارتفاع تكاليف التشغيل",
        "en": "High Running Costs",
        "zh": "运行成本高"
      },
      "text": {
        "ar": "كل لتر ديزل يُدفع يومياً — الشمس بلا فاتورة تشغيل.",
        "en": "Every litre of diesel is paid daily — the sun has no running bill.",
        "zh": "每升柴油都要天天付费 — 阳光没有运行账单。"
      }
    },
    {
      "icon": "droplet",
      "title": {
        "ar": "نقص إمدادات المياه الموثوقة",
        "en": "Unreliable Water Supply",
        "zh": "供水不可靠"
      },
      "text": {
        "ar": "ضخ منتظم يعني ماءً منتظماً للشرب والري.",
        "en": "Regular pumping means regular water for drinking and irrigation.",
        "zh": "定期抽水意味着饮用与灌溉用水都有保障。"
      }
    }
  ],
  "stepsTitle": {
    "ar": "أربع خطوات لحل متكامل",
    "en": "Four Steps to a Complete Solution",
    "zh": "四步实现完整方案"
  },
  "steps": [
    {
      "n": "01",
      "title": {
        "ar": "الطاقة الشمسية",
        "en": "Solar Energy",
        "zh": "太阳能"
      },
      "text": {
        "ar": "ألواح شمسية تولّد الكهرباء نهاراً.",
        "en": "Solar panels generate electricity during the day.",
        "zh": "太阳能电池板在白天发电。"
      }
    },
    {
      "n": "02",
      "title": {
        "ar": "جهاز التحكم",
        "en": "Controller",
        "zh": "控制器"
      },
      "text": {
        "ar": "محول مضخة يدير التشغيل ويحمي المنظومة.",
        "en": "A pump inverter manages operation and protects the system.",
        "zh": "水泵逆变器管理运行并保护系统。"
      }
    },
    {
      "n": "03",
      "title": {
        "ar": "مضخة المياه",
        "en": "Water Pump",
        "zh": "水泵"
      },
      "text": {
        "ar": "مضخة غاطسة أو سطحية ترفع الماء من البئر.",
        "en": "A submersible or surface pump lifts water from the well.",
        "zh": "潜水泵或地面泵将水从井中提升。"
      }
    },
    {
      "n": "04",
      "title": {
        "ar": "توزيع المياه",
        "en": "Water Distribution",
        "zh": "配水"
      },
      "text": {
        "ar": "خزان وشبكة توزيع تصل الماء حيث يُحتاج.",
        "en": "A tank and network carry water where it is needed.",
        "zh": "水箱与管网将水输送到需要的地方。"
      }
    }
  ],
  "diagramTitle": {
    "ar": "نظام متكامل وموثوق",
    "en": "An Integrated, Reliable System",
    "zh": "一体化可靠系统"
  },
  "diagramPill": {
    "ar": "المكونات الرئيسية",
    "en": "Main Components",
    "zh": "主要组件"
  },
  "applicationsTitle": {
    "ar": "مناطق التطبيق",
    "en": "Areas of Application",
    "zh": "应用领域"
  },
  "applications": [
    {
      "image": "/images/photos/greenhouse.jpg",
      "title": {
        "ar": "الزراعة والري",
        "en": "Agriculture & Irrigation",
        "zh": "农业与灌溉"
      }
    },
    {
      "image": "/images/photos/crops.jpg",
      "title": {
        "ar": "إمدادات المياه للمجتمعات",
        "en": "Community Water Supply",
        "zh": "社区供水"
      }
    },
    {
      "image": "/images/photos/pivot.jpg",
      "title": {
        "ar": "مشاريع البنية التحتية للمياه",
        "en": "Water Infrastructure Projects",
        "zh": "水利基础设施项目"
      }
    }
  ],
  "ctaTitle": {
    "ar": "استفسر عن مشروعك",
    "en": "Enquire About Your Project",
    "zh": "咨询您的项目"
  },
  "guidanceOnly": true
};;

export const services: Service[] = [
  {
    "icon": "settings",
    "title": {
      "ar": "تصميم المنظومات",
      "en": "System Design",
      "zh": "系统设计"
    },
    "text": {
      "ar": "دراسة احتياجك وموقعك، واختيار القدرات والمكونات المناسبة.",
      "en": "We study your needs and site, then select the right capacities and components.",
      "zh": "研究您的需求与现场条件，选择合适的容量与组件。"
    }
  },
  {
    "icon": "package",
    "title": {
      "ar": "توريد المنتجات",
      "en": "Product Supply",
      "zh": "产品供应"
    },
    "text": {
      "ar": "توريد محولات وبطاريات وألواح ومضخات من علامات موثوقة.",
      "en": "Supplying inverters, batteries, panels and pumps from trusted brands.",
      "zh": "供应来自可信品牌的逆变器、电池、电池板与水泵。"
    }
  },
  {
    "icon": "wrench",
    "title": {
      "ar": "التركيب والتشغيل",
      "en": "Installation & Commissioning",
      "zh": "安装与调试"
    },
    "text": {
      "ar": "تركيب وتشغيل المنظومة واختبارها قبل التسليم.",
      "en": "Installing and commissioning the system, tested before handover.",
      "zh": "安装调试系统，交付前完成测试。"
    }
  },
  {
    "icon": "headset",
    "title": {
      "ar": "الصيانة والدعم",
      "en": "Maintenance & Support",
      "zh": "维护与支持"
    },
    "text": {
      "ar": "متابعة وصيانة وقطع غيار بعد التسليم.",
      "en": "Follow-up, maintenance and spare parts after handover.",
      "zh": "交付后提供跟进、维护与备件。"
    }
  },
  {
    "icon": "droplet",
    "title": {
      "ar": "أنظمة الضخ والري",
      "en": "Pumping & Irrigation Systems",
      "zh": "抽水与灌溉系统"
    },
    "text": {
      "ar": "منظومات ضخ وري شمسية للآبار والمزارع.",
      "en": "Solar pumping and irrigation systems for wells and farms.",
      "zh": "为水井与农场提供太阳能抽水与灌溉系统。"
    }
  },
  {
    "icon": "users",
    "title": {
      "ar": "استشارات فنية",
      "en": "Technical Consultation",
      "zh": "技术咨询"
    },
    "text": {
      "ar": "استشارة قبل الشراء: أي منظومة تناسب احتياجك وميزانيتك.",
      "en": "Pre-purchase consultation: which system fits your needs and budget.",
      "zh": "购买前咨询：哪种系统最适合您的需求与预算。"
    }
  }
];;
