#!/usr/bin/env python3
"""Extract the approved Ghamdan catalogue from the client-supplied xlsx
(Ahmed-supplied, sourced from Ghamdan's own publications + manufacturer
catalogues) into assets/js/data.js.

RULES (do not change without a client decision):
- NEVER output a price. The xlsx price column is internal only and is
  dropped here entirely.
- Status mapping: 'مؤكد عند غمدان' -> confirmed; 'من كتالوج المصنّع' ->
  factory_catalog_verified; 'جزئي' -> partial; 'يحتاج تأكيد غمدان' ->
  awaiting_client_list (NOT published).
- Rows 40-42 (Haze / Solarbaba / Nash-SRNE) are STOPPED — excluded entirely.
- LM PACK is Shenzhen Kexin, NOT EFORE (manufacturer evidence; parent
  instruction). The xlsx lists it under EFORE — corrected here, flagged in
  docs/DOCUMENT_ANALYSIS.md conflict C-1.
- Q-Cells panels (row 30): models unconfirmed -> category exists, 0 published
  products, empty state on the page.
- Wisenet (row 39): no models confirmed -> category exists, 0 products.
"""
import json
import openpyxl
from pathlib import Path
# Price sanitizer: data.js SHIPS to the browser, so no price may survive in
# any field — the xlsx notes/questions contain internal Facebook price
# references ($ amounts, "سعر ..."). Drop any sentence mentioning a price
# or a $ amount; keep the rest of the note.
import re as _re
_PRICE_RE = _re.compile(r"[^.؛\n]*(\$|سعر|دولار|﷼)[^.؛\n]*[.؛]?")
_AMOUNT_RE = _re.compile(r"\$?\s*\d[\d,\.]*\s*\$|\d+\s*\$")


def _norm_model(model):
    """Presentation normalization ONLY: a numeric range written with the
    Arabic word 'إلى' (e.g. '10 إلى 50kW') becomes an en-dash range
    ('10–50kW'). Same meaning, displays correctly inside LTR model names
    (bidi reordering otherwise scrambles it to '10 50 إلى kW').
    The xlsx source is untouched."""
    return _re.sub(r"(\d+(?:\.\d+)?\s*(?:kWh|kW|MWh|W)?)\s*إلى\s*(\d+(?:\.\d+)?\s*(?:kWh|kW|MWh|W)?)", r"\1–\2", (model or "").strip())


def sanitize_note(text):
    t = (text or "").strip()
    if not t:
        return ""
    t = _PRICE_RE.sub("", t)
    t = _AMOUNT_RE.sub("", t)
    t = _re.sub(r"\s+", " ", t).strip(" .؛-")
    return t

ROOT = Path(__file__).resolve().parent.parent
XLSX = Path.home() / "workspace/goals/ghamdan-marketing-plan-and-website-rebuild/files/ghamdan-product-catalogue/ghamdan-product-catalogue.xlsx"

wb = openpyxl.load_workbook(XLSX, data_only=True)

STATUS = {
    "مؤكد عند غمدان": "confirmed",
    "من كتالوج المصنّع": "factory_catalog_verified",
    "جزئي": "partial",
    "يحتاج تأكيد غمدان": "awaiting_client_list",
}

# Categories: id, ar, en, zh, icon, priority, note
CATEGORIES = [
    {"id": "inverters", "ar": "المحولات الهجينة والانفرترات", "en": "Hybrid Inverters", "zh": "混合逆变器", "icon": "zap", "priority": "high",
     "note_ar": "قلب منظومة الطاقة — أحادي وثلاثي الطور، جهد منخفض وعالٍ"},
    {"id": "batteries", "ar": "بطاريات الليثيوم والتخزين", "en": "Lithium Batteries & Storage", "zh": "锂电池与储能", "icon": "battery", "priority": "high",
     "note_ar": "منزلي جهد منخفض وتجاري جهد عالٍ وأنظمة تخزين صناعية"},
    {"id": "panels", "ar": "الألواح الشمسية", "en": "Solar Panels", "zh": "太阳能电池板", "icon": "sun", "priority": "high",
     "note_ar": "ألواح منزلية وتجارية عالية القدرة"},
    {"id": "pumps", "ar": "المضخات الشمسية وأنظمة الري", "en": "Solar Pumps & Irrigation", "zh": "太阳能水泵与灌溉", "icon": "droplet", "priority": "medium",
     "note_ar": "محولات مضخات هجينة ومضخات DC وBLDC وأنظمة ري وآبار كاملة"},
    {"id": "controllers", "ar": "منظمات الشحن والملحقات", "en": "Charge Controllers & Accessories", "zh": "充电控制器与配件", "icon": "sliders", "priority": "medium",
     "note_ar": "منظمات MPPT وكابلات وقواطع ولوحات توزيع وهياكل تثبيت"},
    {"id": "systems", "ar": "الأنظمة الجاهزة (الباقات)", "en": "Ready-Made Systems", "zh": "成套系统", "icon": "package", "priority": "high",
     "note_ar": "منزل صغير / متوسط / كبير / مزرعة / مصنع — ما يُباع فعلياً"},
    {"id": "storage-ci", "ar": "التخزين التجاري والصناعي", "en": "Commercial & Industrial Storage", "zh": "工商业储能", "icon": "database", "priority": "medium",
     "note_ar": "خزائن تخزين وأنظمة خارجية كبيرة للمصانع والمستشفيات والمنشآت"},
    {"id": "cameras", "ar": "كاميرات المراقبة والأمن", "en": "Security Cameras", "zh": "监控摄像头", "icon": "camera", "priority": "low",
     "note_ar": "قسم ثانوي منفصل عن الطاقة"},
]

CAT_BY_AR = {
    "المحولات": "inverters",
    "بطاريات الليثيوم": "batteries",
    "بطاريات تقليدية": "batteries",
    "الألواح الشمسية": "panels",
    "المضخات الشمسية": "pumps",
    "منظمات الشحن": "controllers",
    "كاميرات المراقبة": "cameras",
}

def slug(s):
    import re, unicodedata
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "product"

def _spec_label(frag):
    """Label one verified spec fragment from the xlsx (keyword rules only;
    falls back to the generic label — never invents a value or a label
    that implies a measurement the fragment does not state)."""
    f = frag
    if "kWh" in f:
        return "السعة"
    if "Wp" in f or "kW" in f:
        return "القدرة"
    if "بطارية" in f:
        return "البطارية"
    if _re.search(r"\d+\s*V\b", f) or "فولت" in f:
        return "الجهد"
    if _re.search(r"\d+\s*A\b", f) or "أمبير" in f:
        return "التيار"
    if "دورة" in f:
        return "دورات الشحن"
    if "IP" in f:
        return "الحماية"
    if "واي فاي" in f or "بلوتوث" in f:
        return "الاتصال"
    if "هجين" in f:
        return "النوع"
    if "محول مضخة" in f:
        return "النوع"
    if "منازل" in f or "منزلي" in f:
        return "الاستخدام"
    if "مونو" in f or "PERC" in f or "TOPCon" in f:
        return "نوع الخلايا"
    if "تبريد" in f or "إطفاء" in f:
        return "السلامة"
    if "قابل للتوسعة" in f:
        return "التوسعة"
    if "انفرتر وبطارية" in f:
        return "التكوين"
    return "مواصفات"


def build_specs_rows(cat_ar, sub_ar, brand, model, specs):
    """Structured spec rows from xlsx facts only: identity rows (brand,
    model, category, subcategory) + one row per verified spec fragment,
    verbatim. Missing values stay ABSENT — no dashes, no invented rows."""
    rows = [
        ("العلامة التجارية", brand),
        ("الموديل", model),
        ("الفئة", cat_ar),
    ]
    if (sub_ar or "").strip():
        rows.append(("القسم الفرعي", sub_ar.strip()))
    frags = []
    for frag in _re.split(r"[،,]", specs or ""):
        frag = frag.strip()
        if frag:
            frags.append(frag)
    seen = set()
    for frag in frags:
        row = (_spec_label(frag), frag)
        if row not in seen:
            seen.add(row)
            rows.append(row)
    return rows, len(frags)


products = []
ws = wb["الكتالوج الكامل"]
for row in ws.iter_rows(min_row=4, values_only=True):
    num, cat_ar, sub_ar, brand, model, specs, _price, status_ar, notes = row[:9]
    if num is None or model is None:
        continue
    model = _norm_model(model)
    if brand in ("Haze", "Solarbaba", "Nash / SRNE"):
        continue  # stopped brands — never published
    status = STATUS.get((status_ar or "").strip(), "awaiting_client_list")
    # LM PACK correction: Shenzhen Kexin, not EFORE
    brand_en = (brand or "").strip()
    if "LM PACK" in (model or "") or "LM BAT" in (model or "") or "LM-AIO" in (model or ""):
        brand_en = "Shenzhen Kexin"
    spec_rows, spec_count = build_specs_rows(
        (cat_ar or "").strip(), sub_ar, brand_en, (model or "").strip(), specs)
    products.append({
        "id": f"p{int(num):02d}",
        "category": CAT_BY_AR.get((cat_ar or "").strip(), "inverters"),
        "subcategory_ar": (sub_ar or "").strip(),
        "brand": brand_en,
        "model": (model or "").strip(),
        "specs_ar": (specs or "").strip(),
        "specs_rows": spec_rows,
        "spec_count": spec_count,
        "status": status,
        "note_ar": sanitize_note(notes),
    })

# Published = confirmed / factory_catalog_verified / partial.
# awaiting_client_list stays in data for the admin, flagged unpublished.
PUBLISHED = {"confirmed", "factory_catalog_verified", "partial"}

bundles = []
ws = wb["الباقات الجاهزة"]
for row in ws.iter_rows(min_row=4, values_only=True):
    num, name, components, use, _price, questions = row[:6]
    if num is None or name is None:
        continue
    bundles.append({
        "id": f"bundle-{int(num)}",
        "name_ar": (name or "").strip(),
        "components_ar": (components or "").strip(),
        "use_ar": (use or "").strip(),
        "status": "archived" if "رمضان" in (name or "") else "confirmed",
        "questions_ar": sanitize_note(questions),
    })

data = {
    "meta": {
        "source": "ghamdan-product-catalogue.xlsx (Ahmed-supplied; Ghamdan publications + manufacturer catalogues)",
        "lm_pack_brand": "Shenzhen Kexin (corrected from xlsx EFORE attribution)",
    },
    "categories": CATEGORIES,
    "products": products,
    "bundles": bundles,
    "published_statuses": sorted(PUBLISHED),
}

out = ROOT / "assets/js/data.js"
out.write_text("/* Generated from ghamdan-product-catalogue.xlsx by tools/extract_catalog.py\n"
               "   Regenerate, do not hand-edit. No monetary field exists in this file. */\n"
               "window.GTS_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n",
               encoding="utf-8")
print(f"products: {len(products)}  published: {sum(1 for p in products if p['status'] in PUBLISHED)}  awaiting: {sum(1 for p in products if p['status']=='awaiting_client_list')}")
print(f"bundles: {len(bundles)}  categories: {len(CATEGORIES)}")
for c in CATEGORIES:
    n = sum(1 for p in products if p["category"] == c["id"] and p["status"] in PUBLISHED)
    print(f"  {c['id']}: {n} published")
