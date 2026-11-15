/**
 * Ghamdan (GTS) — ready-made systems / bundles (4).
 *
 * Source: xlsx sheet "الباقات الجاهزة" via old build assets/js/data.js.
 * 3 confirmed + 1 archived (bundle-4 Ramadan, previous season — listed as a
 * past bundle only, never as available). Bundle-4's xlsx confirmation
 * question was a price question and was removed at extraction, so it carries
 * no openConfirmation.
 * componentProductIds links ONLY identified catalogue products: bundle-3's
 * 16kWh battery brand is unconfirmed (CI-03), so no battery product is
 * linked; bundle-4's 8 x 360W panels have no catalogue product. The detailed
 * component list of every bundle is under final approval (CI-03).
 */
import type { Bundle } from "./types";

export const bundles: Bundle[] = [
  {
    "id": "bundle-1",
    "slug": "bundle-1",
    "name": {
      "ar": "منزل صغير",
      "en": "Small Home",
      "zh": "小户型住宅"
    },
    "components": {
      "ar": "انفرتر Deye 6kW + بطارية Deye SE-F5 Pro-C 5kWh",
      "en": "Deye 6kW inverter + Deye SE-F5 Pro-C 5kWh battery"
    },
    "use": {
      "ar": "شقة/منزل صغير — إضاءة ومراوح وشاشة وثلاجة",
      "en": "Small apartment/home — lighting, fans, TV, and fridge"
    },
    "status": "confirmed",
    "componentProductIds": [
      "p02",
      "p14"
    ],
    "openConfirmation": {
      "ar": "هل يشمل الألواح والأسلاك والتركيب والتوصيل؟"
    }
  },
  {
    "id": "bundle-2",
    "slug": "bundle-2",
    "name": {
      "ar": "منزل متوسط",
      "en": "Medium Home",
      "zh": "中户型住宅"
    },
    "components": {
      "ar": "انفرتر Deye 6kW + بطارية EFORE 10kWh",
      "en": "Deye 6kW inverter + EFORE 10kWh battery"
    },
    "use": {
      "ar": "منزل متوسط — تخزين أكبر لليل",
      "en": "Medium home — larger storage for the night"
    },
    "status": "confirmed",
    "componentProductIds": [
      "p02",
      "p24"
    ],
    "openConfirmation": {
      "ar": "هل يشمل الألواح والتركيب؟"
    }
  },
  {
    "id": "bundle-3",
    "slug": "bundle-3",
    "name": {
      "ar": "منزل / تجاري كبير",
      "en": "Large Home / Commercial",
      "zh": "大户型 / 商业"
    },
    "components": {
      "ar": "انفرتر Deye 8kW + بطارية 16kWh",
      "en": "Deye 8kW inverter + 16kWh battery"
    },
    "use": {
      "ar": "منزل كبير أو محل/مكتب",
      "en": "Large home or shop/office"
    },
    "status": "confirmed",
    "componentProductIds": [
      "p03"
    ],
    "openConfirmation": {
      "ar": "تأكيد علامة البطارية 16kWh ومكونات الباقة كاملة"
    }
  },
  {
    "id": "bundle-4",
    "slug": "bundle-4",
    "name": {
      "ar": "باقة رمضان (سابقة)",
      "en": "Ramadan Bundle (previous)",
      "zh": "斋月套餐（往期）"
    },
    "components": {
      "ar": "انفرتر MUST 5kW + 4 بطاريات MustPower 200Ah + 8 ألواح 360W",
      "en": "MUST 5kW inverter + 4 MustPower 200Ah batteries + 8 360W panels"
    },
    "use": {
      "ar": "منزل — باقة موسمية سابقة",
      "en": "Home — previous seasonal bundle"
    },
    "status": "archived",
    "componentProductIds": [
      "p12",
      "p29"
    ]
  }
];
;
