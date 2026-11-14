/**
 * Ghamdan (GTS) — site settings. Single source of truth for brand, contact,
 * WhatsApp and social links. Import from here; never hard-code these values
 * in a template.
 *
 * Source: old build assets/js/settings.js (+ BUILD_SPEC §0.3.1 for the
 * canonical inquiry-policy sentence, which is given here in AR/EN/ZH).
 * Warranty: NO duration is approved — status stays pending_client_approval
 * (CI-08); never publish a warranty number or duration.
 * Logo: typographic wordmark only (CI-17) — the old GTS logo is forgotten.
 * Social: Facebook + Instagram only. No LinkedIn / YouTube URL exists in
 * any approved source (BUILD_SPEC O-SOCIAL) — do not add one.
 * Address: Sakhr St, front of Noor Yemen Mall (settings.js). The old site's
 * footer also showed a Mogadishu St address — contradictory and unverified;
 * it is NOT used here.
 */
import type { SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  "brand": {
    "name": {
      "ar": "غمدان",
      "en": "GHAMDAN"
    },
    "short": "GTS",
    "latinName": "GHAMDAN",
    "tagline": {
      "ar": "للتجارة والتوكيلات",
      "en": "Trading & Agencies"
    },
    "taglineMark": "TRUST • TRADE • GROWTH",
    "logoMode": "wordmark"
  },
  "contact": {
    "whatsapp": "967775800000",
    "whatsappDisplay": "+967 775 800 000",
    "whatsappUrl": "https://wa.me/967775800000",
    "phoneDisplay": "+967 775 800 000",
    "email": "info@ghamdan-trd.com",
    "address": {
      "ar": "شارع صخر، أمام نور اليمن مول، صنعاء، اليمن",
      "en": "Sakhr St, front of Noor Yemen Mall, Sana'a, Yemen"
    },
    "hours": {
      "ar": "السبت – الجمعة: 8 صباحاً – 8 مساءً",
      "en": "Sat – Fri: 8:00 – 20:00"
    }
  },
  "social": {
    "facebook": "https://www.facebook.com/GTSYemen",
    "instagram": "https://www.instagram.com/gtsyemen1"
  },
  "inquiryPolicy": {
    "ar": "يُتفق على السعر والتوفر مع فريق المبيعات",
    "en": "Price and availability are agreed with the sales team",
    "zh": "价格与供货请与销售团队确认"
  },
  "warranty": {
    "status": "pending_client_approval",
    "text": {
      "ar": "نص الضمان الموحد قيد الاعتماد من العميل.",
      "en": "Unified warranty text pending client approval.",
      "zh": "统一保修文本待客户确认。"
    }
  }
};
;
