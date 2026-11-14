# -*- coding: utf-8 -*-
# Part 2 of tools/build.py — appended by the build coordinator.
# (Kept as a separate module file and imported by build.py's main().)

from sitegen.render import Page, shell, hero_center, hero_side, hero_split, section_head, cta_band, product_card, empty_state, wa_msg
from sitegen.icons import icon, product_svg, kind_for


def _footer_note(p, text):
    return f'<p class="form-note" style="margin-top:1.5rem">{p.p(text)}</p>'


# ================================================================ CATEGORY (ref 08)
# Distinct bright hero per category (stand-ins, CI-06).
CATEGORY_PHOTO = {
    "inverters": "inverter-unit.jpg",
    "batteries": "battery-storage.jpg",
    "panels": "panels-rows.jpg",
    "pumps": "pump-flow.jpg",
    "controllers": "controller-unit.jpg",
    "systems": "solar-farm.jpg",
    "storage-ci": "battery-storage.jpg",
    "cameras": "solar-farm.jpg",
}


def build_category(cat):
    p = Page(f"categories/{cat['id']}", cat["ar"], cat["en"], cat["ar"], rel="../")
    prods = [x for x in PUB if x["category"] == cat["id"]]
    hero = hero_split(p, CATEGORY_PHOTO.get(cat["id"], "panels-rows.jpg"), None,
                      {"ar": cat["ar"], "en": cat["en"]},
                      {"ar": cat.get("note_ar") or cat["ar"], "en": cat.get("note_ar") or cat["ar"]},
                      cta_text_key="cta.inquire",
                      crumbs=[("../index.html", "الرئيسية"), ("../catalog.html", "المنتجات"), (None, cat["ar"])])
    tabs = "".join(
        f'<a class="tab{" tab--active" if c["id"] == cat["id"] else ""}" href="../categories/{c["id"]}.html">{c["ar"]}</a>'
        for c in DATA["categories"])
    grid = product_grid(p, prods) if prods else empty_state(
        p, "package",
        {"ar": "لا توجد منتجات منشورة في هذه الفئة بعد", "en": "No published products in this category yet"},
        {"ar": "المنتجات المؤكدة في هذه الفئة قيد الاعتماد من غمدان قبل النشر.", "en": "Confirmed products in this category are awaiting Ghamdan's approval before publication."})
    body = f"""
{hero}
<section class="section section--white" data-catalog><div class="container">
  <div class="tabs reveal" style="margin-bottom:2rem">{tabs}</div>
  <div class="filter-bar reveal" style="margin-bottom:2rem">
    <span class="filter-bar__title">{icon("search")} <span data-i18n="filter.title"></span></span>
    <div class="search-input"><input type="search" data-filter-q data-i18n-ph="search.ph" aria-label="بحث"></div>
    <select data-filter-brand aria-label="العلامة التجارية" style="min-height:3.125rem;border:1px solid #D5DEE8;border-radius:0.625rem;padding:0 1rem;background:#fff">
      <option value="" data-i18n="filter.all"></option>
      {''.join(f'<option value="{esc(b)}">{esc(b)}</option>' for b in sorted({x["brand"] for x in prods}))}
    </select>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem">
    <h2 style="margin:0">{p.p({"ar": "المنتجات", "en": "Products", "zh": "产品"}, "span")}</h2>
    <span class="result-meta" data-result-meta></span>
  </div>
  {grid}
  <div data-filter-empty hidden>{empty_state(p, "search", {"ar": "لا توجد نتائج مطابقة", "en": "No matching results"}, {"ar": "جرّب كلمة أخرى أو غيّر الفلاتر.", "en": "Try another word or change the filters."})}</div>
  {_footer_note(p, {"ar": "جميع المنتجات المعروضة مؤكدة من المصنّع أو من غمدان. للتفاصيل والتوفر تواصل معنا عبر واتساب.", "en": "All listed products are confirmed by the manufacturer or by Ghamdan. For details and availability, contact us via WhatsApp."})}
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "panels-rows.jpg")}
"""
    return f"categories/{cat['id']}.html", shell(p, body, "catalog")


# ================================================================ PRODUCT DETAIL (ref 06)
# Illustrative type photo per category (stand-in, CI-06 — real product photos
# pending client input). Never a screenshot; never presented as the product.
DETAIL_PHOTO = {
    "inverters": "inverter-unit.jpg",
    "batteries": "battery-storage.jpg",
    "panels": "panels-rows.jpg",
    "pumps": "pump-flow.jpg",
    "controllers": "controller-unit.jpg",
    "systems": "solar-farm.jpg",
    "storage-ci": "battery-storage.jpg",
    "cameras": "panels-rows.jpg",
}


def build_product(prod):
    p = Page(f"products/{prod['id']}", prod["model"], prod["model"], prod["specs_ar"], rel="../")
    kind = kind_for(prod["category"], prod["model"])
    cat = CATS[prod["category"]]
    wa_text = f"مرحباً غمدان — أريد الاستفسار عن {prod['brand']} {prod['model']}."
    spec_rows = "".join(
        f'<tr><th>{esc(k)}</th><td dir="auto">{esc(v)}</td></tr>'
        for k, v in (prod.get("specs_rows") or []))
    spec_count = prod.get("spec_count", 0)
    spec_note = ""
    if spec_count < 3:
        spec_note = (f'<p class="form-note" style="margin-top:1rem">{p.p({"ar": "المواصفات الكاملة من كتالوج المصنّع قيد الاستلام من العميل (CI-02) — تُرفق عند الطلب عبر واتساب.", "en": "The full specifications from the manufacturer's catalog are pending receipt from the client (CI-02) — attached on request via WhatsApp."})}</p>')
    spec_table = (f'<table class="spec-table"><tbody>{spec_rows}</tbody></table>{spec_note}' if spec_rows else
                  f'<p class="form-note">{p.p({"ar": "المواصفات التفصيلية الكاملة من كتالوج المصنّع — تُرفق عند الطلب عبر واتساب.", "en": "Full detailed specifications from the manufacturer's catalog — attached on request via WhatsApp."})}</p>')
    # Overview (verified facts only) + benefits (spec fragments verbatim).
    status_line = {"ar": "منتج مؤكد عند غمدان.", "en": "Product confirmed by Ghamdan."} if prod["status"] == "confirmed" else \
        {"ar": "من كتالوج المصنّع — التوفر عند غمدان قيد التأكيد.", "en": "From the manufacturer's catalog — availability at Ghamdan pending confirmation."}
    overview_text = (f"{prod['brand']} {prod['model']} — {prod['subcategory_ar']}، من فئة {cat['ar']}. "
                   f"{prod['specs_ar'] + ' ' if prod['specs_ar'] else ''}"
                   f"{prod['note_ar'] + ' ' if prod.get('note_ar') else ''}")
    # p.p() returns a real <span> for i18n switching — it must NOT pass through esc()
    # (esc() would print the span as literal text). Escape only the plain-text part.
    overview = f"{esc(overview_text)}{p.p(status_line)}"
    frags = [v for k, v in (prod.get("specs_rows") or [])
             if k not in ("العلامة التجارية", "الموديل", "الفئة", "القسم الفرعي")]
    benefits = ""
    if frags:
        items = "".join(f'<li>{icon("check")}<span>{esc(f)}</span></li>' for f in frags[:4])
        benefits = f"""
  <div>
    {section_head(p, {"ar": "المميزات الرئيسية", "en": "Key Benefits"}, None)}
    <ul class="site-footer__contact" style="gap:1rem;display:grid">{items}</ul>
  </div>"""
    related = [x for x in PUB if x["category"] == prod["category"] and x["id"] != prod["id"]][:3]
    if not related:
        related = [x for x in PUB if x["id"] != prod["id"]][:3]
    crumbs = [("../index.html", "الرئيسية"), ("../catalog.html", "المنتجات"),
              (f"../categories/{cat['id']}.html", cat["ar"]), (None, prod["model"])]
    photo = DETAIL_PHOTO.get(prod["category"], "panels-rows.jpg")
    body = f"""
<section class="section section--white" style="padding-top:1.5rem"><div class="container">
  <nav class="breadcrumbs" aria-label="مسار التنقل">{" / ".join(f'<a href="{h}">{l}</a>' if h else f"<span>{l}</span>" for h, l in crumbs)}</nav>
  <div class="detail">
    <div class="detail__media reveal">
      <div class="product-card__visual" style="min-height:22rem;padding:0;overflow:hidden"><img src="../assets/img/photos/{photo}" alt="" loading="eager" style="width:100%;height:100%;object-fit:cover"></div>
      <p class="form-note" style="margin-top:0.75rem">{p.p({"ar": "صورة توضيحية لنوع المنتج — صورة المنتج الحقيقية قيد الاستلام (CI-06).", "en": "Illustrative photo of the product type — the real product photo is pending receipt (CI-06)."})}</p>
      <div class="pill-row">
        <span class="pill">{icon("package")} {esc(cat['ar'])}</span>
        <span class="pill">{icon("award")} <span dir="ltr">{esc(prod['brand'])}</span></span>
      </div>
    </div>
    <div class="detail__info reveal">
      <span class="pill">{p.p({"ar": "مواصفات المنتج", "en": "Product Specifications"})}</span>
      <h1 dir="auto">{esc(prod['model'])}</h1>
      <p class="lead">{esc(prod['specs_ar'] or cat['ar'])}</p>
      <p>{p.p({"ar": "استفسر عن هذا المنتج عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.", "en": "Ask about this product via WhatsApp — price, availability and delivery are confirmed with the sales team."})}</p>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1.5rem">
        <a class="btn btn--primary" data-wa data-wa-type="product" data-wa-entity="{prod['id']}" data-wa-cta="product-inquire" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="cta.inquire"></span></a>
        <a class="btn btn--outline" href="../categories/{cat['id']}.html"><span data-i18n="cta.view_all"></span></a>
      </div>
      <div class="mini-features" style="grid-template-columns:repeat(3,1fr);margin-top:2rem">
        <div class="mini-feature">{icon("shield")}<div><h4>{p.p({"ar": "جودة موثقة", "en": "Verified quality"}, "span")}</h4><p>{p.p({"ar": "من كتالوج المصنّع", "en": "From the manufacturer's catalog"})}</p></div></div>
        <div class="mini-feature">{icon("truck")}<div><h4>{p.p({"ar": "تسليم منسق", "en": "Coordinated delivery"}, "span")}</h4><p>{p.p({"ar": "حسب الطلب والمنطقة", "en": "Per order and area"})}</p></div></div>
        <div class="mini-feature">{icon("message")}<div><h4>{p.p({"ar": "دعم واتساب", "en": "WhatsApp support"}, "span")}</h4><p>{p.p({"ar": "السبت – الجمعة", "en": "Sat – Fri"})}</p></div></div>
      </div>
    </div>
  </div>
</div></section>
<section class="section section--white"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem;align-items:start">
    <div class="reveal">
      {section_head(p, {"ar": "نظرة عامة", "en": "Overview"}, None)}
      <p class="lead" style="margin:0">{overview}</p>
    </div>
    {benefits}
  </div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "المواصفات الفنية", "en": "Technical Specifications"}, None)}
  {spec_table}
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "منتجات ذات صلة", "en": "Related Products"}, None)}
  {product_grid(p, related)}
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "panels-rows.jpg")}
"""
    return f"products/{prod['id']}.html", shell(p, body, "catalog", sticky_wa=True)


# ================================================================ PROJECTS (ref 05) + TEMPLATE (ref 10)
def build_projects():
    p = Page("projects", "مشاريعنا", "Our Projects", "مشاريع غمدان قيد التوثيق.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "مشاريعنا", "en": "Our Projects"},
                     {"ar": "نبني الثقة بمشاريع منفذة بعناية — وهذه الصفحة تُنشر فيها المشاريع المعتمدة فقط.", "en": "We build trust through carefully executed projects — only approved projects are published here."},
                     cta_text_key="cta.talk", wa_text="مرحباً غمدان — أريد مناقشة مشروعي.")
    pills = "".join(
        f'<button type="button" class="tab{" tab--active" if f == "all" else ""}" data-project-filter="{f}">{label}</button>'
        for f, label in [("all", "الكل"), ("residential", "سكني"), ("commercial", "تجاري"),
                         ("agricultural", "زراعي"), ("pumping", "ضخ وري")])
    gallery = "".join(
        f'''<figure class="gallery-item reveal"><img src="assets/img/photos/{img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"><figcaption class="form-note" style="padding:0.5rem 0">{cap}</figcaption></figure>'''
        for img, cap in [("villa-roof.jpg", "صورة توضيحية — ليست مشروعاً منشوراً"),
                         ("panels-rows.jpg", "صورة توضيحية — ليست مشروعاً منشوراً"),
                         ("pump-flow.jpg", "صورة توضيحية — ليست مشروعاً منشوراً"),
                         ("solar-farm.jpg", "صورة توضيحية — ليست مشروعاً منشوراً")])
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {section_head(p, {"ar": "مشاريع معتمدة", "en": "Approved Projects"}, None, center=True)}
  <div class="tabs reveal" style="margin-bottom:2rem;justify-content:center">{pills}</div>
  <div class="grid grid--3" data-stagger></div>
  <div data-project-empty>
  {empty_state(p, "layers", {"ar": "مشاريعنا قيد التوثيق", "en": "Our projects are being documented"},
               {"ar": "لا ننشر أي مشروع قبل اعتماده وموافقة العميل على نشر اسمه وصوره. بيانات المشاريع المعتمدة قيد الاستلام من العميل (CI-07) — تواصل معنا لمعرفة المشاريع المنفذة.", "en": "No project is published before approval and the client's consent to publish its name and photos. Approved project data is pending receipt from the client (CI-07) — contact us to learn about executed projects."})}
  </div>
  <div style="text-align:center;margin-top:2rem">
    <a class="btn btn--primary" data-wa data-wa-type="projects" data-wa-cta="projects-ask" href="{wa_msg("مرحباً غمدان — أريد الاطلاع على مشاريع منفذة.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
    <a class="btn btn--outline" href="projects/template.html" style="margin-inline-start:0.75rem">{p.p({"ar": "معاينة نموذج صفحة مشروع", "en": "Preview a project page template"}, "span")}</a>
  </div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "من أعمالنا — صور توضيحية", "en": "From Our Work — Illustrative Photos"}, None)}
  <p class="lead">{p.p({"ar": "صور توضيحية لمنظومات شمسية — ليست مشاريع منشورة لغمدان. صور المشاريع الحقيقية تُنشر بعد اعتمادها.", "en": "Illustrative photos of solar systems — not published Ghamdan projects. Real project photos are published once approved."})}</p>
  <div class="gallery">{gallery}</div>
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "solar-farm.jpg")}
"""
    return "projects.html", shell(p, body, "projects", transparent=True)


def build_project_template():
    p = Page("projects/template", "نموذج: صفحة تفاصيل مشروع", "Template: Project Detail Page",
             "قالب تطويري لصفحة تفاصيل المشروع.", rel="../")
    p.categories = DATA["categories"]
    hero = hero_side(p, "villa-sky.jpg",
                     {"ar": "نموذج: مشروع سكني", "en": "Template: Residential Project"},
                     {"ar": "هذه صفحة قالب تطويري توضح ترتيب أقسام صفحة تفاصيل المشروع. تُستبدل بالبيانات الحقيقية بعد اعتماد أول مشروع.", "en": "This is a development template showing the project detail page layout. It is replaced with real data once the first project is approved."},
                     cta_text_key="cta.talk", wa_text="مرحباً غمدان — أريد مناقشة مشروعي.")
    gallery = "".join(
        f'''<figure class="gallery-item reveal"><img src="../assets/img/photos/{img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></figure>'''
        for img in ("villa-roof.jpg", "panels-rows.jpg", "pump-flow.jpg"))
    steps = "".join(
        f'<div class="step reveal"><div class="step__num">{i + 1:02d}</div>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>'
        for i, x in enumerate(C.SOLUTIONS_PAGE["process"]))
    body = f"""
{hero}
<div class="dev-banner" style="margin-top:0"><div class="container">{icon("info")} <span>{p.p({"ar": "قالب تطويري — ليس مشروعاً حقيقياً. البيانات والصورة المعروضة للتوضيح فقط.", "en": "Development template — not a real project. The data and photos shown are illustrative only."})}</span></div></div>
<section class="section section--white"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem;align-items:start">
    <div class="reveal">
      {section_head(p, {"ar": "نظرة عامة", "en": "Overview"}, None)}
      <p class="lead" style="margin:0">{p.p({"ar": "مثال توضيحي لترتيب أقسام صفحة تفاصيل مشروع: هنا تُكتب نبذة المشروع بعد اعتماده — نوع المنظومة، وموقعها العام، والغرض منها — بلا أرقام ولا أسماء قبل التوثيق.", "en": "Illustrative example of a project detail page layout: the project summary goes here once approved — system type, general location and purpose — with no figures or names before documentation."})}</p>
    </div>
    <div class="card reveal"><div class="card__body feature">
      <span class="icon-circle">{icon("pin")}</span>
      <h3>{p.p({"ar": "بطاقة الموقع", "en": "Location Card"}, "span")}</h3>
      <p>{p.p({"ar": "مثال توضيحي: تُعرض هنا المحافظة/المنطقة العامة فقط بعد موافقة العميل على نشرها — لا عنوان دقيق ولا إحداثيات.", "en": "Illustrative example: only the general governorate/area is shown here, after the client's consent to publish it — no exact address or coordinates."})}</p>
    </div></div>
  </div>
</div></section>
<section class="section"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem;align-items:start">
    <div class="reveal">
      {section_head(p, {"ar": "التحدي", "en": "The Challenge"}, None)}
      <p>{p.p({"ar": "مثال توضيحي: هنا يُوصف التحدي الهندسي — مثل الحاجة إلى طاقة مستمرة لموقع بعيد عن الشبكة — بصياغة العميل بعد الاعتماد.", "en": "Illustrative example: the engineering challenge is described here — for example, the need for continuous power at an off-grid site — in the client's own approved wording."})}</p>
    </div>
    <div class="reveal">
      {section_head(p, {"ar": "الحل الهندسي", "en": "The Engineering Solution"}, None)}
      <p>{p.p({"ar": "مثال توضيحي: هنا يُشرح الحل — نوع المنظومة ومكوناتها الرئيسة وطريقة عملها — بلا مواصفات مختلقة قبل اعتماد قائمة المكونات.", "en": "Illustrative example: the solution is explained here — system type, main components and how it works — with no invented specifications before the component list is approved."})}</p>
    </div>
  </div>
</div></section>
<section class="section section--white"><div class="container">
  {section_head(p, {"ar": "المعدات المستخدمة", "en": "Equipment Used"}, None)}
  <ul class="site-footer__contact" style="gap:1rem;display:grid">
    <li>{icon("check")}<span>{p.p({"ar": "مثال توضيحي: انفرتر هجين (الموديل بعد الاعتماد)", "en": "Illustrative example: hybrid inverter (model after approval)"})}</span></li>
    <li>{icon("check")}<span>{p.p({"ar": "مثال توضيحي: بطاريات ليثيوم (الموديل بعد الاعتماد)", "en": "Illustrative example: lithium batteries (model after approval)"})}</span></li>
    <li>{icon("check")}<span>{p.p({"ar": "مثال توضيحي: ألواح شمسية (القدرة بعد الاعتماد)", "en": "Illustrative example: solar panels (capacity after approval)"})}</span></li>
    <li>{icon("check")}<span>{p.p({"ar": "مثال توضيحي: مضخة شمسية (للمشاريع الزراعية فقط)", "en": "Illustrative example: solar pump (agricultural projects only)"})}</span></li>
  </ul>
  <p class="form-note" style="margin-top:1.5rem">{p.p({"ar": "نطاق الأعمال وأبرز النتائج يُعبَّآن هنا بعد الاعتماد والقياس — لا تُنشَر أرقام قبل توثيقها (CI-07).", "en": "Scope of works and key outcomes are filled in here after approval and measurement — no figures are published before documentation (CI-07)."})}</p>
</div></section>
<section class="section section--white"><div class="container">
  {section_head(p, {"ar": "معرض الصور", "en": "Photo Gallery"}, None)}
  <div class="gallery">{gallery}</div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "مراحل التنفيذ", "en": "Execution Stages"}, None)}
  <div class="steps" data-stagger>{steps}</div>
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "solar-farm.jpg")}
"""
    return "projects/template.html", shell(p, body, "projects", transparent=True)


# ================================================================ CONTACT (ref 07)
def build_contact():
    p = Page("contact", "اتصل بنا", "Contact Us", "تواصل مع غمدان — واتساب، هاتف، بريد، أو زرنا في صنعاء.")
    p.categories = DATA["categories"]
    c = C.CONTACT
    hero = hero_side(p, "house-bright.jpg", c["hero_title"], c["hero_copy"], cta_text_key="cta.whatsapp")
    method_href = {
        "message": wa_msg("مرحباً غمدان — أريد الاستفسار."),
        "mail": "mailto:info@ghamdan-trd.com",
        "headset": "support.html",
    }
    cards = "".join(
        f'<div class="card card--hover reveal"><div class="card__body feature feature--center"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p>'
        f'<a class="btn btn--outline btn--sm" href="{method_href.get(x["icon"], "support.html")}">{p.p(x["link"])}</a></div></div>' for x in c["methods"])
    form = f"""
<form class="form-card" id="contact-form" data-contact-form novalidate>
  <label>{p.p({"ar": "الاسم الكامل", "en": "Full Name", "zh": "全名"})}
    <input name="name" required data-i18n-ph="form.name" placeholder="الاسم الكامل"></label>
  <label>{p.p({"ar": "رقم الهاتف / واتساب", "en": "Phone / WhatsApp", "zh": "电话 / WhatsApp"})}
    <input name="phone" type="tel" dir="ltr" required placeholder="+967 ..."></label>
  <label>{p.p({"ar": "البريد الإلكتروني (اختياري)", "en": "Email (optional)", "zh": "电子邮箱（可选）"})}
    <input name="email" type="email" dir="ltr" placeholder="name@example.com"></label>
  <label>{p.p({"ar": "نوع الاستفسار", "en": "Inquiry Type", "zh": "咨询类型"})}
    <select name="type">
      <option>{p.p({"ar": "استفسار عن منتج", "en": "Product inquiry"})}</option>
      <option>{p.p({"ar": "مشروع ضخ مياه", "en": "Water pumping project"})}</option>
      <option>{p.p({"ar": "منظومة منزلية / تجارية", "en": "Home / commercial system"})}</option>
      <option>{p.p({"ar": "دعم / ضمان", "en": "Support / warranty"})}</option>
      <option>{p.p({"ar": "أخرى", "en": "Other"})}</option>
    </select></label>
  <label>{p.p({"ar": "رسالتك", "en": "Your Message", "zh": "您的留言"})}
    <textarea name="message" rows="4" required data-i18n-ph="form.message" placeholder="رسالتك"></textarea></label>
  <button class="btn btn--primary" type="submit">{p.p({"ar": "إرسال الاستفسار عبر واتساب", "en": "Send Inquiry via WhatsApp", "zh": "通过 WhatsApp 发送咨询"})}</button>
  <p class="form-note">{p.p({"ar": "النموذج يفتح واتساب بالرسالة مكتوبة — لا تُخزَّن أي بيانات على خوادم خارجية.", "en": "The form opens WhatsApp with your message pre-filled — no data is stored on external servers."})}</p>
  <p class="form-note" data-form-status aria-live="polite"></p>
</form>
<div class="card" id="form-success" hidden style="margin-top:1.5rem"><div class="card__body">
  <h3>{p.p({"ar": "تم استلام استفسارك", "en": "Your inquiry was received"}, "span")}</h3>
  <p>{p.p({"ar": "سجّلنا رسالتك محلياً. لإرسالها عبر واتساب اضغط زر واتساب في أعلى الصفحة.", "en": "We recorded your message locally. To send it via WhatsApp, tap the WhatsApp button at the top of the page."})}</p>
</div></div>"""
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--3" data-stagger>{cards}</div>
  <div class="grid grid--2" style="gap:3.75rem;margin-top:3.75rem;align-items:start">
    <div class="reveal">
      <span class="pill">{p.p(c["side_title"])}</span>
      <h2>{p.p(c["form_title"], "span")}</h2>
      <p class="lead">{p.p(c["side_copy"])}</p>
      <ul class="site-footer__contact" style="margin-top:1.5rem">
        <li>{icon("pin")}<span>شارع صخر، أمام نور اليمن مول، صنعاء، اليمن</span></li>
        <li>{icon("mail")}<a href="mailto:info@ghamdan-trd.com" dir="ltr">info@ghamdan-trd.com</a></li>
        <li>{icon("phone")}<a href="tel:+967775800000" dir="ltr">+967 775 800 000</a></li>
        <li>{icon("clock")}<span>السبت – الجمعة: 8 صباحاً – 8 مساءً</span></li>
      </ul>
      <a class="btn btn--whatsapp" data-wa data-wa-type="contact" data-wa-cta="contact-whatsapp" href="{wa_msg("مرحباً غمدان — أريد التواصل معكم.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
    </div>
    {form}
  </div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "الأسئلة الشائعة", "en": "Frequently Asked Questions", "zh": "常见问题"}, None, center=True)}
  <div class="grid grid--2" data-stagger>
    {''.join(f'<div class="card reveal"><div class="card__body"><h3>{p.p(q["q"], "span")}</h3><p>{p.p(q["a"])}</p></div></div>' for q in C.FAQ)}
  </div>
</div></section>
"""
    return "contact.html", shell(p, body, "contact", transparent=True)


# ================================================================ SERVICES / SUPPORT / NEWS / AGENCIES
def build_services():
    p = Page("services", "خدماتنا", "Our Services", "خدمات غمدان — استشارة، توريد، تركيب، دعم.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "خدماتنا", "en": "Our Services"},
                     {"ar": "خدمات متكاملة من الاستشارة حتى ما بعد البيع — فريق واحد يرافقك في كل خطوة.", "en": "Integrated services from consultation to after-sales — one team with you at every step."},
                     cta_text_key="cta.whatsapp")
    cards = "".join(
        f'<div class="card card--hover reveal"><div class="card__body feature"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>'
        f'<div class="card__foot"><a class="btn-link" data-wa data-wa-type="service" data-wa-cta="service-inquire" href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن خدمة: " + x["title"]["ar"])}"><span data-i18n="cta.inquire"></span> {icon("arrow")}</a></div></div>'
        for x in C.SERVICES)
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--3" data-stagger>{cards}</div>
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "panels-rows.jpg")}
"""
    return "services.html", shell(p, body, "services", transparent=True)


def build_support():
    p = Page("support", "الدعم والضمان", "Support & Warranty", "الدعم الفني والضمان.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "الدعم والضمان", "en": "Support & Warranty"},
                     {"ar": "فريق الدعم معك قبل الشراء وبعده — تواصل معنا وستجد إجابة واضحة.", "en": "Our support team is with you before and after purchase — reach out and you will get a clear answer."},
                     cta_text_key="cta.whatsapp")
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem;align-items:start">
    <div class="reveal">
      <span class="pill">{p.p({"ar": "الدعم الفني", "en": "Technical Support"})}</span>
      <h2>{p.p({"ar": "كيف نساعدك؟", "en": "How can we help?"}, "span")}</h2>
      <p class="lead">{p.p({"ar": "للاستفسار عن منتج، أو حالة طلب، أو دعم فني — راسلنا عبر واتساب وستصلك إجابة من فريقنا.", "en": "For a product inquiry, an order status, or technical support — message us on WhatsApp and our team will answer."})}</p>
      <a class="btn btn--primary" data-wa data-wa-type="support" data-wa-cta="support-whatsapp" href="{wa_msg("مرحباً غمدان — أحتاج دعماً فنياً.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
    </div>
    <div class="reveal">
      <span class="pill">{p.p({"ar": "الضمان", "en": "Warranty"})}</span>
      <h2>{p.p({"ar": "نص الضمان الموحد قيد الاعتماد", "en": "The unified warranty text is pending approval"}, "span")}</h2>
      <p class="lead">{p.p({"ar": "لا ننشر أي رقم أو مدة ضمان قبل اعتماده رسمياً من غمدان ومن المصنّع. عند اعتماد النص الموحد سيظهر هنا كاملاً.", "en": "We do not publish any warranty number or duration before it is formally approved by Ghamdan and the manufacturer. Once the unified text is approved it will appear here in full."})}</p>
      <p class="form-note">{p.p({"ar": "مرجع العميل: CI-08 — نص الضمان الموحد قيد الاعتماد.", "en": "Client input CI-08 — unified warranty text pending approval."})}</p>
    </div>
  </div>
  <div style="margin-top:3.75rem">{section_head(p, {"ar": "الأسئلة الشائعة", "en": "Frequently Asked Questions", "zh": "常见问题"}, None, center=True)}
  <div class="grid grid--2" data-stagger>
    {''.join(f'<div class="card reveal"><div class="card__body"><h3>{p.p(q["q"], "span")}</h3><p>{p.p(q["a"])}</p></div></div>' for q in C.FAQ)}
  </div></div>
</div></section>
"""
    return "support.html", shell(p, body, "support", transparent=True)


def build_news():
    p = Page("news", "الأخبار والفعاليات", "News & Events", "أخبار غمدان وفعالياتها.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "solar-farm.jpg",
                     {"ar": "الأخبار والفعاليات", "en": "News & Events"},
                     {"ar": "آخر أخبار غمدان — المنتجات الجديدة، الفعاليات، وإعلانات الشركة.", "en": "The latest from Ghamdan — new products, events and company announcements."},
                     cta_text_key="cta.whatsapp")
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {empty_state(p, "newspaper", {"ar": "لا توجد أخبار منشورة بعد", "en": "No news published yet"},
               {"ar": "ستُعتمد الأخبار والفعاليات من غمدان قبل نشرها. تابع صفحتنا على فيسبوك لآخر المستجدات.", "en": "News and events are approved by Ghamdan before publication. Follow our Facebook page for the latest."})}
  <p style="text-align:center;margin-top:2rem"><a class="btn btn--outline" href="https://www.facebook.com/GTSYemen">{icon("facebook")} <span>facebook.com/GTSYemen</span></a></p>
</div></section>
"""
    return "news.html", shell(p, body, "news", transparent=True)


def build_agencies():
    p = Page("agencies", "الوكالات", "Agencies", "وكالات وعلامات غمدان.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "الوكالات والعلامات", "en": "Agencies & Brands"},
                     {"ar": "وكيل Deye الرسمي في اليمن، ونمثل علامات عالمية موثوقة في الطاقة الشمسية والكاميرات.", "en": "Official Deye agent in Yemen, and we carry trusted global brands in solar energy and cameras."},
                     cta_text_key="cta.whatsapp")
    cards = "".join(
        f'<article class="card card--hover reveal"><div class="card__body feature"><span class="icon-circle">{icon("award")}</span>'
        f'<h3 dir="ltr">{a["name"]}</h3><p>{p.p(a["text"])}</p></div>'
        f'<div class="card__foot"><a class="btn-link" href="agencies/{a["id"]}.html"><span data-i18n="cta.view_product"></span> {icon("arrow")}</a></div></article>'
        for a in C.AGENCIES)
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--3" data-stagger>{cards}</div>
  {_footer_note(p, {"ar": "وكالة Deye الرسمية في اليمن معتمدة من غمدان. صفة «وكيل» لغيرها من العلامات لم تُثبَت بعد — تُذكر كعلامات معروضة حتى الاعتماد (CI-04).", "en": "Deye's official agency in Yemen is confirmed by Ghamdan. The «agent» status of the other brands is not yet established — they are listed as carried brands until approval (CI-04)."})}
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "solar-farm.jpg")}
"""
    return "agencies.html", shell(p, body, "agencies", transparent=True)


def build_agency(a):
    p = Page(f"agencies/{a['id']}", a["name"], a["name"], a["text"]["ar"], rel="../")
    rel_prods = [x for x in PUB if x["brand"].lower().startswith(a["id"].lower()) or a["id"] in x["brand"].lower()]
    if not rel_prods:
        rel_prods = [x for x in PUB if x["brand"].lower().replace(" ", "") == a["id"].replace("-", "").lower()]
    hero = hero_split(p, "panels-rows.jpg", None, {"ar": a["name"], "en": a["name"]}, a["text"], cta_text_key="cta.inquire",
                      crumbs=[("../index.html", "الرئيسية"), ("../agencies.html", "الوكالات"), (None, a["name"])])
    grid = product_grid(p, rel_prods) if rel_prods else empty_state(
        p, "package",
        {"ar": "منتجات هذه العلامة ستظهر هنا بعد اعتماد قائمتها", "en": "Products of this brand will appear here once its list is approved"},
        {"ar": "تواصل معنا عبر واتساب للاستفسار عن أي منتج من هذه العلامة.", "en": "Contact us via WhatsApp to ask about any product from this brand."})
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {grid}
</div></section>
"""
    return f"agencies/{a['id']}.html", shell(p, body, "agencies")


# ================================================================ SYSTEMS
def build_systems():
    p = Page("systems", "الأنظمة الجاهزة", "Ready-Made Systems", "أنظمة شمسية جاهزة — باقات معتمدة.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "villa-sky.jpg",
                     {"ar": "الأنظمة الجاهزة", "en": "Ready-Made Systems"},
                     {"ar": "باقات منظومات كاملة جاهزة للتركيب — اختر ما يناسب احتياجك واستفسر عن التفاصيل عبر واتساب.", "en": "Complete ready-to-install system bundles — choose what fits your needs and ask for details on WhatsApp."},
                     cta_text_key="cta.whatsapp")
    cards = ""
    for b in BUNDLES:
        status = b["status"]
        use = C.BUNDLE_USE.get(b["id"], {"ar": b["use_ar"], "en": b["use_ar"]})
        cards += f"""
<article class="card card--hover reveal">
  <div class="card__body">
    <span class="pill">{p.p({"ar": "باقة معتمدة" if status == "confirmed" else "باقة سابقة", "en": "Confirmed bundle" if status == "confirmed" else "Previous bundle"})}</span>
    <h3 style="margin-top:1rem">{esc(b["name_ar"])}</h3>
    <p>{p.p(use)}</p>
    <ul class="site-footer__contact" style="margin-top:1rem">
      <li>{icon("check")}<span>{esc(b["components_ar"])}</span></li>
    </ul>
  </div>
  <div class="card__foot">
    <a class="btn btn--primary btn--sm" data-wa data-wa-type="bundle" data-wa-entity="{b['id']}" data-wa-cta="bundle-inquire" href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن باقة: " + b['name_ar'])}">{icon("message")} <span data-i18n="cta.inquire"></span></a>
    <a class="btn-link" href="systems/{b['id']}.html"><span data-i18n="cta.view_product"></span> {icon("arrow")}</a>
  </div>
</article>"""
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--2" data-stagger>{cards}</div>
  {_footer_note(p, {"ar": "الباقات المعروضة معتمدة من غمدان. مكونات الباقات التفصيلية قيد الاعتماد النهائي (CI-03) — للتفاصيل والتوفر تواصل معنا عبر واتساب.", "en": "The bundles shown are approved by Ghamdan. Detailed bundle components are under final approval (CI-03) — for details and availability, contact us via WhatsApp."})}
</div></section>
{cta_band(p, C.HOME["cta_title"], C.HOME["cta_copy"], "villa-roof.jpg")}
"""
    return "systems.html", shell(p, body, "systems", transparent=True)


def build_system(b):
    use = C.BUNDLE_USE.get(b["id"], {"ar": b["use_ar"], "en": b["use_ar"]})
    name_s = {"ar": b["name_ar"], "en": use["en"]}
    p = Page(f"systems/{b['id']}", b["name_ar"], use["en"], b["use_ar"], rel="../")
    hero = hero_split(p, "villa-sky.jpg", None, name_s, use, cta_text_key="cta.inquire",
                      crumbs=[("../index.html", "الرئيسية"), ("../systems.html", "الأنظمة الجاهزة"), (None, b["name_ar"])])
    items = f'<li>{icon("check")}<span>{esc(b["components_ar"])}</span></li>'
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem;align-items:start">
    <div class="reveal">
      <span class="pill">{p.p({"ar": "مكونات الباقة", "en": "Bundle Components"})}</span>
      <h2>{p.p({"ar": "ما تشمله الباقة", "en": "What the bundle includes"}, "span")}</h2>
      <ul class="site-footer__contact" style="margin-top:1.5rem">{items}</ul>
      <p class="form-note" style="margin-top:1.5rem">{p.p({"ar": "قائمة المكونات التفصيلية قيد الاعتماد النهائي من غمدان (CI-03).", "en": "The detailed component list is under final approval by Ghamdan (CI-03)."})}</p>
    </div>
    <div class="card reveal"><div class="card__body feature">
      <span class="icon-circle">{icon("message")}</span>
      <h3>{p.p({"ar": "استفسر عن هذه الباقة", "en": "Ask about this bundle"}, "span")}</h3>
      <p>{p.p({"ar": "استفسر عن هذه الباقة عبر واتساب — السعر والتوفر والتسليم يُحدَّدان مع فريق المبيعات.", "en": "Ask about this bundle via WhatsApp — price, availability and delivery are confirmed with the sales team."})}</p>
      <a class="btn btn--whatsapp" data-wa data-wa-type="bundle" data-wa-entity="{b['id']}" data-wa-cta="bundle-inquire" href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن باقة: " + b['name_ar'])}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
    </div></div>
  </div>
</div></section>
"""
    return f"systems/{b['id']}.html", shell(p, body, "systems", sticky_wa=True)


# ================================================================ DOWNLOADS / LEGAL / SEARCH / GUIDANCE / 404
def build_downloads():
    p = Page("downloads", "التحميلات", "Downloads", "كتالوجات وأدلة غمدان.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "التحميلات", "en": "Downloads"},
                     {"ar": "كتالوجات وأدلة المنتجات — تُرفع هنا بعد اعتمادها من غمدان.", "en": "Product catalogs and guides — uploaded here once approved by Ghamdan."},
                     cta_text_key="cta.whatsapp")
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {empty_state(p, "download", {"ar": "لا توجد ملفات منشورة بعد", "en": "No files published yet"},
               {"ar": "كتالوجات المنتجات وأدلة التركيب تُرفع هنا بعد اعتمادها من غمدان والمصنّع.", "en": "Product catalogs and installation guides are uploaded here once approved by Ghamdan and the manufacturer."})}
</div></section>
"""
    return "downloads.html", shell(p, body, "support", transparent=True)


def build_legal(kind):
    is_privacy = kind == "privacy"
    p = Page(kind, "سياسة الخصوصية" if is_privacy else "الشروط والأحكام",
             "Privacy Policy" if is_privacy else "Terms & Conditions",
             "نص قانوني قيد الاعتماد.", rel="")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "سياسة الخصوصية" if is_privacy else "الشروط والأحكام",
                      "en": "Privacy Policy" if is_privacy else "Terms & Conditions"},
                     {"ar": "هذا النص القانوني مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني." if is_privacy else "هذه الشروط مسودة قيد الاعتماد — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.",
                      "en": "This legal text is a draft pending approval — no clause is binding before review by Ghamdan and its legal counsel."},
                     cta_text_key="cta.whatsapp")
    points = [
        {"ar": "نطاق هذا النص", "en": "Scope of this text"},
        {"ar": "بيانات التواصل التي تجمعها غمدان وكيفية استخدامها", "en": "Contact data Ghamdan collects and how it is used"},
        {"ar": "المراسلة عبر واتساب — تتم عبر منصة واتساب بشروطها", "en": "Messaging via WhatsApp — conducted through WhatsApp under its terms"},
        {"ar": "لا نبيع بياناتك لأي طرف ثالث", "en": "We do not sell your data to any third party"},
    ] if is_privacy else [
        {"ar": "نطاق هذه الشروط", "en": "Scope of these terms"},
        {"ar": "التفاصيل تُؤكَّد كتابياً عبر واتساب مع فريق المبيعات", "en": "Details are confirmed in writing via WhatsApp with the sales team"},
        {"ar": "التركيب والتسليم يتم بالاتفاق الكتابي مع العميل", "en": "Installation and delivery are agreed in writing with the client"},
        {"ar": "الضمان يخضع للنص الموحد المعتمد (CI-08)", "en": "Warranty is governed by the approved unified text (CI-08)"},
    ]
    items = "".join(f'<li>{icon("check")}<span>{p.p(x)}</span></li>' for x in points)
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="dev-banner" style="margin-bottom:2rem"><div class="container">{icon("info")} <span>{p.p({"ar": "مسودة قيد الاعتماد (CI-10) — لا يُعتمَد أي بند قبل مراجعة غمدان ومستشارها القانوني.", "en": "Draft pending approval (CI-10) — no clause is binding before review by Ghamdan and its legal counsel."})}</span></div></div>
  <ul class="site-footer__contact" style="gap:1.25rem;display:grid">{items}</ul>
</div></section>
"""
    return f"{kind}.html", shell(p, body, "support", transparent=True)


def build_search():
    p = Page("search", "البحث", "Search", "ابحث في منتجات غمدان.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "panels-rows.jpg",
                     {"ar": "البحث", "en": "Search"},
                     {"ar": "ابحث بالاسم أو العلامة أو المواصفات — النتائج تُحدَّث مباشرة.", "en": "Search by name, brand or specification — results update live."},
                     cta_text_key="cta.whatsapp")
    body = f"""
{hero}
<section class="section section--white" data-catalog><div class="container">
  <div class="filter-bar reveal" style="margin-bottom:2rem">
    <div class="search-input"><input type="search" data-filter-q data-i18n-ph="search.ph" aria-label="بحث"></div>
    <select data-filter-brand aria-label="العلامة التجارية" style="min-height:3.125rem;border:1px solid #D5DEE8;border-radius:0.625rem;padding:0 1rem;background:#fff">
      <option value="" data-i18n="filter.all"></option>
      {''.join(f'<option value="{esc(b)}">{esc(b)}</option>' for b in sorted({x["brand"] for x in PUB}))}
    </select>
  </div>
  <span class="result-meta" data-result-meta></span>
  {product_grid(p, PUB)}
  <div data-filter-empty hidden>{empty_state(p, "search", {"ar": "لا توجد نتائج مطابقة", "en": "No matching results"}, {"ar": "جرّب كلمة أخرى.", "en": "Try another word."})}</div>
</div></section>
"""
    return "search.html", shell(p, body, "catalog", transparent=True)


def build_guidance():
    p = Page("guidance", "دليل الضخ — إرشاد أولي", "Pumping Guidance — Preliminary", "أداة إرشاد أولية لضخ المياه.")
    p.categories = DATA["categories"]
    hero = hero_side(p, "pump-flow.jpg",
                     {"ar": "دليل الضخ — إرشاد أولي", "en": "Pumping Guidance — Preliminary"},
                     {"ar": "أجب عن ثلاثة أسئلة، وسيحوّلك الدليل إلى واتساب برسالة جاهزة — هذه أداة إرشاد أولية وليست حساب تحجيم معتمداً.", "en": "Answer three questions and the guide takes you to WhatsApp with a ready message — a preliminary guidance tool, not a certified sizing calculation."},
                     cta_text_key="cta.whatsapp")
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <form class="form-card reveal" id="guidance-form" style="max-width:44rem;margin:0 auto" novalidate>
    <div class="field"><label>{p.p({"ar": "عمق البئر (متر)", "en": "Well depth (m)", "zh": "井深（米）"})}
      <input name="depth" type="number" min="1" max="300" required placeholder="مثال: 120"></label></div>
    <div class="field"><label>{p.p({"ar": "الاحتياج اليومي من الماء (م³)", "en": "Daily water need (m³)", "zh": "每日需水量（m³）"})}
      <input name="water" type="number" min="1" max="500" required placeholder="مثال: 30"></label></div>
    <div class="field"><label>{p.p({"ar": "نوع الاستخدام", "en": "Use type", "zh": "用途"})}
      <select name="use">
        <option value="farm">{p.p({"ar": "ري محاصيل", "en": "Crop irrigation"})}</option>
        <option value="home">{p.p({"ar": "شرب / منزلي", "en": "Drinking / domestic"})}</option>
        <option value="commercial">{p.p({"ar": "تربية مواشي / تجاري", "en": "Livestock / commercial"})}</option>
      </select></label></div>
    <button class="btn btn--primary" type="submit">{p.p({"ar": "تجهيز رسالة واتساب", "en": "Prepare WhatsApp Message"})}</button>
    <p class="form-note">{p.p({"ar": "لا نقدّم توصية بمضخة محددة في هذه الأداة — التحديد النهائي يتم بعد المعاينة والاتفاق مع فريق غمدان.", "en": "No specific pump is recommended by this tool — the final selection is made after inspection and agreement with the Ghamdan team."})}</p>
    <a class="btn btn--whatsapp" id="guidance-wa" data-wa data-wa-type="guidance" data-wa-cta="guidance-send" hidden href="{wa_msg("مرحباً غمدان — أريد إرشاداً أولياً لضخ المياه.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
  </form>
</div></section>
"""
    return "guidance.html", shell(p, body, "solutions", transparent=True)


def build_404():
    p = Page("404", "الصفحة غير موجودة", "Page Not Found", "الصفحة غير موجودة.")
    p.categories = DATA["categories"]
    body = f"""
<section class="section section--white"><div class="container" style="text-align:center;padding:6rem 0">
  <span class="icon-circle" style="margin:0 auto 1.5rem">{icon("search")}</span>
  <h1 style="font-size:4rem">404</h1>
  <h2>{p.p({"ar": "الصفحة غير موجودة", "en": "Page Not Found"}, "span")}</h2>
  <p class="lead">{p.p({"ar": "ربما نُقل الرابط أو حُذف. عد إلى الرئيسية أو راسلنا عبر واتساب.", "en": "The link may have moved or been removed. Go home or message us on WhatsApp."})}</p>
  <div style="display:flex;gap:0.75rem;justify-content:center;margin-top:2rem;flex-wrap:wrap">
    <a class="btn btn--primary" href="index.html"><span data-i18n="nav.home"></span></a>
    <a class="btn btn--whatsapp" data-wa data-wa-type="404" data-wa-cta="404-whatsapp" href="{wa_msg("مرحباً غمدان — وصلت إلى صفحة غير موجودة.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
  </div>
</div></section>
"""
    return "404.html", shell(p, body, "home")


# ================================================================ ADMIN (front-end UI, §14)
def build_admin():
    p = Page("admin/index", "لوحة التحكم", "Admin Dashboard", "لوحة تحكم غمدان — واجهة أمامية.", rel="../")
    p.categories = DATA["categories"]
    body = """
<section class="section section--white"><div class="container">
  <div class="admin-gate reveal" data-admin-gate>
    <div class="admin-login">
      <span class="icon-circle" style="margin:0 auto 1rem">__ICON_LOCK__</span>
      <h1>لوحة تحكم غمدان</h1>
      <p class="lead">واجهة أمامية تجريبية — الدخول محلي فقط، والبيانات تُحفظ في متصفحك (localStorage).</p>
      <form data-admin-login novalidate>
        <label>البريد الإلكتروني<input name="email" type="email" dir="ltr" required placeholder="admin@ghamdan-trd.com"></label>
        <label>كلمة المرور<input name="password" type="password" dir="ltr" required placeholder="••••••••"></label>
        <button class="btn btn--primary btn--block" type="submit">دخول</button>
        <p class="form-note" data-admin-login-status aria-live="polite"></p>
        <p class="form-note">بيانات الدخول التجريبية: admin@ghamdan-trd.com / admin123 — تُغيَّر من وحدة المستخدمين. النسخة الخلفية (Filament) موثقة في ARCHITECTURE.md.</p>
      </form>
    </div>
  </div>
  <div class="admin-shell" data-admin-shell hidden>
    <aside class="admin-sidebar">
      <div style="padding:1rem 0.75rem 0">__WORDMARK__</div>
      <nav class="admin-nav" data-admin-nav>
        <button data-admin-tab="overview" class="active">__ICON_GRID__ <span>نظرة عامة</span></button>
        <button data-admin-tab="products">__ICON_PACKAGE__ <span>المنتجات</span></button>
        <button data-admin-tab="packages">__ICON_BOXES__ <span>الباقات</span></button>
        <button data-admin-tab="projects">__ICON_LAYERS__ <span>المشاريع</span></button>
        <button data-admin-tab="news">__ICON_NEWSPAPER__ <span>الأخبار</span></button>
        <button data-admin-tab="agencies">__ICON_AWARD__ <span>الوكالات</span></button>
        <button data-admin-tab="services">__ICON_WRENCH__ <span>الخدمات</span></button>
        <button data-admin-tab="statistics">__ICON_CHART__ <span>الإحصائيات</span></button>
        <button data-admin-tab="settings">__ICON_SETTINGS__ <span>الإعدادات</span></button>
        <button data-admin-tab="users">__ICON_USERS__ <span>المستخدمون</span></button>
      </nav>
      <button class="btn btn--outline btn--sm" data-admin-logout style="margin:1rem 0.75rem">تسجيل الخروج</button>
    </aside>
    <div class="admin-main">
      <div class="admin-topbar">
        <h2 data-admin-title>نظرة عامة</h2>
        <span class="pill">مسودة — لا شيء يُنشَر دون اعتماد</span>
      </div>
      <div data-admin-panel="overview">
        <div class="grid grid--3" data-admin-stats></div>
        <div class="card" style="margin-top:1.5rem"><div class="card__body">
          <h3>بوابات النشر</h3>
          <p>كل عنصر يمر عبر حالة: <span class="status status--awaiting">بانتظار العميل</span> <span class="status status--verified">موثق من المصنّع</span> <span class="status status--confirmed">مؤكد من العميل</span> <span class="status status--archived">مؤرشف</span>. غيّر الحالة من جدول المنتجات أو الباقات — التغيير يُحفظ في هذا المتصفح (تجريبي) ويُطبَّق فوراً على العدّادات. لا يُنشَر أي عنصر دون اعتماد صريح. (حالا «مسودة» و«منشور» من بوابات Filament الخلفية، وليستا مستخدمتين في بيانات العرض الحالية.)</p>
        </div></div>
      </div>
      <div data-admin-panel="products" hidden><div class="table-wrap"><table class="table" data-admin-table="products"></table></div></div>
      <div data-admin-panel="packages" hidden><div class="table-wrap"><table class="table" data-admin-table="packages"></table></div></div>
      <div data-admin-panel="projects" hidden>
        <div class="empty-state"><span class="icon-circle">__ICON_LAYERS__</span><h3>لا مشاريع معتمدة بعد</h3><p>المشاريع تُضاف هنا بعد اعتمادها وموافقة العميل على نشرها.</p></div>
      </div>
      <div data-admin-panel="news" hidden>
        <div class="empty-state"><span class="icon-circle">__ICON_NEWSPAPER__</span><h3>لا أخبار منشورة بعد</h3><p>الأخبار تُضاف هنا بعد اعتمادها من غمدان.</p></div>
      </div>
      <div data-admin-panel="agencies" hidden><div class="table-wrap"><table class="table" data-admin-table="agencies"></table></div></div>
      <div data-admin-panel="services" hidden><div class="table-wrap"><table class="table" data-admin-table="services"></table></div></div>
      <div data-admin-panel="statistics" hidden>
        <div class="card"><div class="card__body"><h3>نقرات واتساب (من سجل المتصفح المحلي)</h3><p class="form-note">تُسجَّل كل نقرة بمصدرها ونوعها وصفحتها ولغتها ووقتها — ولا يُزعَم أبداً تسليم أو قراءة.</p><div class="table-wrap"><table class="table" data-admin-table="stats"></table></div></div></div>
        <div class="card" style="margin-top:1.5rem"><div class="card__body"><h3>الاستفسارات الواردة (من نموذج التواصل — هذا المتصفح)</h3><p class="form-note">آخر 10 استفسارات سُجّلت من نموذج التواصل في هذا المتصفح. الإرسال الفعلي يتم عبر واتساب.</p><div class="table-wrap"><table class="table" data-admin-table="inquiries"></table></div></div></div>
      </div>
      <div data-admin-panel="settings" hidden>
        <form class="form-card" data-admin-settings novalidate>
          <label>رقم واتساب (بصيغة دولية دون +)<input name="whatsapp" dir="ltr" value="967775800000"></label>
          <label>البريد الإلكتروني<input name="email" dir="ltr" value="info@ghamdan-trd.com"></label>
          <label>العنوان<input name="address" value="شارع صخر، أمام نور اليمن مول، صنعاء، اليمن"></label>
          <label>ساعات العمل<input name="hours" value="السبت – الجمعة: 8 صباحاً – 8 مساءً"></label>
          <button class="btn btn--primary" type="submit">حفظ الإعدادات</button>
          <p class="form-note" data-admin-settings-status aria-live="polite"></p>
        </form>
      </div>
      <div data-admin-panel="users" hidden>
        <div class="card"><div class="card__body"><h3>المستخدمون</h3><p>حساب المدير التجريبي: admin@ghamdan-trd.com. إدارة المستخدمين الكاملة (الأدوار والصلاحيات) في نسخة Filament الخلفية — موثقة في ARCHITECTURE.md.</p></div></div>
      </div>
    </div>
  </div>
</div></section>
"""
    body = (body
            .replace("__ICON_LOCK__", icon("lock"))
            .replace("__ICON_GRID__", icon("grid"))
            .replace("__ICON_PACKAGE__", icon("package"))
            .replace("__ICON_BOXES__", icon("boxes"))
            .replace("__ICON_LAYERS__", icon("layers"))
            .replace("__ICON_NEWSPAPER__", icon("newspaper"))
            .replace("__ICON_AWARD__", icon("award"))
            .replace("__ICON_WRENCH__", icon("wrench"))
            .replace("__ICON_CHART__", icon("chart"))
            .replace("__ICON_SETTINGS__", icon("settings"))
            .replace("__ICON_USERS__", icon("users")))
    # wordmark inside admin (relative links)
    from sitegen.render import wordmark
    body = body.replace("__WORDMARK__", wordmark("../"))
    return "admin/index.html", shell(p, body, "home")
