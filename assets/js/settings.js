/* ==========================================================================
   GTS SETTINGS — single source of truth (prompt §14.3).
   Contact details, WhatsApp number and warranty text are maintained HERE
   ONLY and reused across every page. Never hardcode them in templates.
   Sources: client-verified data from Ahmed (not from the new PDFs, which
   contain no Ghamdan contact data — CI-05). Warranty text is PENDING
   client approval (CI-08): the placeholder below is never shown as a
   warranty promise; product pages show "warranty text pending approval".
   Logo: typographic wordmark only (CI-17) — new logo pending from Ahmed.
   ========================================================================== */
window.GTS_SETTINGS = {
  brand: {
    name_ar: "غمدان",
    name_en: "GHAMDAN",
    name_latin: "GHAMDAN",
    short: "GTS",
    tagline_ar: "للتجارة والتوكيلات",
    tagline_en: "Trading & Agencies",
    logo_mode: "wordmark" /* CI-17: swap to "image" when the new logo file arrives */
  },
  contact: {
    whatsapp: "967775800000",           /* international, no + — used to build wa.me links */
    whatsapp_display: "+967 775 800 000",
    phone_display: "+967 775 800 000",
    email: "info@ghamdan-trd.com",
    address_ar: "شارع صخر، أمام نور اليمن مول، صنعاء، اليمن",
    address_en: "Sakhr St, front of Noor Yemen Mall, Sana'a, Yemen",
    hours_ar: "السبت – الجمعة: 8 صباحاً – 8 مساءً",
    hours_en: "Sat – Fri: 8:00 – 20:00"
  },
  social: {
    facebook: "https://www.facebook.com/GTSYemen",
    instagram: "https://www.instagram.com/gtsyemen1"
  },
  warranty: {
    /* CI-08: NO product warranty duration is approved. Never publish one. */
    status: "pending_client_approval",
    text_ar: "نص الضمان الموحد قيد الاعتماد من العميل.",
    text_en: "Unified warranty text pending client approval.",
    text_zh: "统一保修文本待客户确认。"
  },
  dev: {
    /* Development preview only: photos are CC stand-ins (CI-06), product
       visuals are code-built SVG illustrations. Never present either as
       real Ghamdan photos in production. */
    preview: true,
    photos_note_ar: "صور توضيحية مؤقتة — بانتظار صور غمدان الحقيقية",
    photos_note_en: "Draft stand-in photos — awaiting Ghamdan's real photos",
    photos_note_zh: "临时示意图片 — 待客户提供实拍图片"
  }
};
