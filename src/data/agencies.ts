/**
 * Ghamdan (GTS) — agencies / brands (6).
 *
 * Source: old build tools/sitegen/content.py AGENCIES + agencies.html i18n.
 * ONLY Deye is a confirmed official agent in Yemen. The other five are
 * brands Ghamdan carries; their "agent" status is NOT established yet and
 * they are listed as carried brands until approval (CI-04, agencies.html k9).
 * productIds are derived from products.ts by brand. Shenzhen Kexin products
 * (p22, p23, p26) have NO agency record — the xlsx listed them under EFORE
 * and the correction is recorded in products.ts; do not list them under EFORE.
 */
import type { Agency } from "./types";
import { products } from "./products";

const AGENCY_BRANDS: Record<string, string> = {
  deye: "Deye",
  efore: "EFORE",
  jntech: "Jntech",
  must: "MUST",
  qcells: "Hanwha Q-Cells",
  wisenet: "Wisenet",
};

const rawAgencies: Omit<Agency, "productIds">[] = [
  {
    "id": "deye",
    "name": "Deye",
    "status": {
      "ar": "وكيل رسمي في اليمن",
      "en": "Official Agent in Yemen",
      "zh": "也门官方代理"
    },
    "text": {
      "ar": "وكيل Deye الرسمي في اليمن — محولات هجينة وبطاريات وأنظمة تخزين.",
      "en": "The official Deye agent in Yemen — hybrid inverters, batteries and storage systems.",
      "zh": "Deye 在也门的官方代理 — 混合逆变器、电池与储能系统。"
    },
    "officialAgent": true,
    "confirmationStatus": "confirmed"
  },
  {
    "id": "efore",
    "name": "EFORE",
    "status": {
      "ar": "علامة نوفرها",
      "en": "Brand We Carry",
      "zh": "供应品牌"
    },
    "text": {
      "ar": "بطاريات وأنظمة تخزين EFORE — منزلية وتجارية وصناعية.",
      "en": "EFORE batteries and storage systems — residential, commercial and industrial.",
      "zh": "EFORE 电池与储能系统 — 住宅、商业与工业。"
    },
    "officialAgent": false,
    "confirmationStatus": "pending"
  },
  {
    "id": "must",
    "name": "MUST",
    "status": {
      "ar": "علامة نوفرها",
      "en": "Brand We Carry",
      "zh": "供应品牌"
    },
    "text": {
      "ar": "محولات اقتصادية ومنظمات شحن وبطاريات MUST.",
      "en": "MUST economy inverters, charge controllers and batteries.",
      "zh": "MUST 经济型逆变器、充电控制器与电池。"
    },
    "officialAgent": false,
    "confirmationStatus": "pending"
  },
  {
    "id": "jntech",
    "name": "Jntech",
    "status": {
      "ar": "علامة نوفرها",
      "en": "Brand We Carry",
      "zh": "供应品牌"
    },
    "text": {
      "ar": "محولات مضخات ومضخات شمسية Jntech للآبار والري.",
      "en": "Jntech pump inverters and solar pumps for wells and irrigation.",
      "zh": "Jntech 水泵逆变器与太阳能水泵，用于水井与灌溉。"
    },
    "officialAgent": false,
    "confirmationStatus": "pending"
  },
  {
    "id": "qcells",
    "name": "Hanwha Q-Cells",
    "status": {
      "ar": "علامة نوفرها",
      "en": "Brand We Carry",
      "zh": "供应品牌"
    },
    "text": {
      "ar": "ألواح شمسية Hanwha Q-Cells — الموديلات المتوفرة قيد التأكيد.",
      "en": "Hanwha Q-Cells solar panels — available models pending confirmation.",
      "zh": "Hanwha Q-Cells 太阳能电池板 — 可供型号待确认。"
    },
    "officialAgent": false,
    "confirmationStatus": "pending"
  },
  {
    "id": "wisenet",
    "name": "Wisenet",
    "status": {
      "ar": "علامة نوفرها",
      "en": "Brand We Carry",
      "zh": "供应品牌"
    },
    "text": {
      "ar": "كاميرات وأنظمة مراقبة Wisenet — الموديلات قيد التأكيد.",
      "en": "Wisenet cameras and security systems — models pending confirmation.",
      "zh": "Wisenet 摄像头与安防系统 — 型号待确认。"
    },
    "officialAgent": false,
    "confirmationStatus": "pending"
  }
];

/** productIds are derived from products.ts by brand — never hand-written. */
export const agencies: Agency[] = rawAgencies.map((a) => ({
  ...a,
  productIds: products.filter((p) => p.brand === AGENCY_BRANDS[a.id]).map((p) => p.id),
}));

;
