#!/usr/bin/env python3
"""Ghamdan Solar Platform — static site generator.
Build order (ARCHITECTURE.md): faithful luxury replica of the 10 reference
images FIRST (same techniques, shapes, motion); the Ghamdan layer (brand,
contact, real catalog data) is a light content swap on top — it never
touches layout, composition or design.
Run: python3 tools/build.py   (from repo root)
Output: HTML pages at repo root; assets are hand-written (css/js/img).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

from sitegen.render import Page, shell, hero_center, hero_side, hero_split, section_head, cta_band, product_card, empty_state, wa_msg, esc
from sitegen.icons import icon, product_svg, kind_for
from sitegen import content as C

# ------------------------------------------------------------------ data
raw = (ROOT / "assets/js/data.js").read_text(encoding="utf-8")
DATA = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
CATS = {c["id"]: c for c in DATA["categories"]}
PRODUCTS = DATA["products"]
PUBLISHED = set(DATA["published_statuses"])
PUB = [p for p in PRODUCTS if p["status"] in PUBLISHED]
BUNDLES = DATA["bundles"]


def cat_name(cid):
    return CATS[cid]["ar"]


def prod_url(pid):
    return f"products/{pid}.html"


def product_grid(page, products):
    cards = "".join(product_card(page, p, cat_name(p["category"])) for p in products)
    return (f'<div class="grid grid--3" data-stagger>{cards}</div>' if len(products) <= 9 else
            f'<div class="grid grid--4" data-stagger>{cards}</div>')


def mini_features(items):
    return [{"icon": i, "title": t, "text": x} for i, t, x in items]


# ================================================================ HOME (ref 01)
def build_home():
    p = Page("index", "حلول طاقة ومياه مصممة لتناسب احتياجك", "Energy and water solutions designed around your needs",
             "غمدان للتجارة والتوكيلات — وكيل Deye الرسمي في اليمن.")
    p.categories = DATA["categories"]
    h = C.HOME
    hero = hero_center(p, "villa-roof.jpg", h["hero_badge"], h["hero_title"], h["hero_copy"])
    pillars = "".join(
        f'<div class="pillar reveal"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>' for x in h["pillars"])
    line_art = ('<svg class="line-art" viewBox="0 0 1200 120" fill="none" aria-hidden="true">'
                '<path d="M0 100h1200M60 100V60l40-20 40 20v40M180 100V50l50-25 50 25v50M340 100V65h60v35M460 100l30-45 30 45M580 100V55l45-20 45 20v45M740 100V70h50v30M860 100l35-50 35 50M1000 100V60l40-20 40 20v40" stroke="currentColor" stroke-width="1.5"/>'
                '<circle cx="1100" cy="30" r="18" stroke="currentColor" stroke-width="1.5"/>'
                '<path d="M1100 4v8M1100 48v8M1074 30h8M1118 30h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>')
    marquee = "".join(f'<span>{p.p({"ar": w, "en": w, "zh": w})}<i>—</i></span>' for w in h["marquee"] * 4)
    sol_cards = ""
    for s in C.SOLUTIONS[:4]:
        img = {"residential": "villa-roof.jpg", "commercial": "solar-farm.jpg",
               "pumping": "pump-flow.jpg", "irrigation": "greenhouse.jpg"}[s["id"]]
        sol_cards += f"""
<article class="solution-cell reveal">
  <div class="solution-cell__media"><img src="assets/img/photos/{img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
  <div class="solution-cell__body">
    <span class="icon-circle icon-circle--sm">{icon(s["icon"])}</span>
    <h3>{p.p(s["title"], "span")}</h3><p>{p.p(s["text"])}</p>
    <a class="btn-link" href="solutions.html"><span data-i18n="cta.discover"></span> {icon("arrow")}</a>
  </div>
</article>"""
    why = "".join(
        f'<div class="card card--hover reveal"><div class="card__body feature"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div></div>' for x in h["why"])
    feat = [p_ for p_ in PUB if p_["category"] in ("inverters", "batteries", "panels")][:3]
    # featured products: use real published products (first per category)
    feat_cards = ""
    seen = set()
    for prod in PUB:
        if prod["category"] in seen or prod["category"] not in ("inverters", "batteries", "pumps"):
            continue
        seen.add(prod["category"])
        feat_cards += product_card(p, prod, cat_name(prod["category"]))
        if len(seen) == 3:
            break
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {section_head(p, h["intro_title"], h["intro_copy"], center=True)}
  <div class="pillars reveal">{pillars}</div>
  <div style="margin-top:2rem">{line_art}</div>
</div></section>
<div class="marquee" aria-hidden="true"><div class="marquee__track">{marquee}</div></div>
<section class="section"><div class="container">
  {section_head(p, h["solutions_title"], h["solutions_copy"])}
  <div class="grid grid--2" data-stagger>{sol_cards}</div>
</div></section>
<section class="section section--band"><div class="container">
  {section_head(p, h["why_title"], None, center=True, pill=h["why_badge"])}
  <div class="grid grid--3" data-stagger>{why}</div>
</div></section>
<section class="section section--white"><div class="container">
  <div class="grid grid--2" style="gap:3.75rem">
    <div>
      {section_head(p, h["projects_title"], None)}
      <div class="empty-state reveal" style="margin-top:-1rem">
        <span class="icon-circle">{icon("layers")}</span>
        <h3>{p.p({"ar": "مشاريعنا قيد التوثيق", "en": "Our projects are being documented"}, "span")}</h3>
        <p>{p.p({"ar": "لا ننشر أي مشروع قبل اعتماده وموافقة العميل على نشر اسمه وصوره.", "en": "No project is published before approval and the client's consent to publish its name and photos."})}</p>
        <a class="btn btn--primary" href="projects.html"><span data-i18n="cta.view_all"></span></a>
      </div>
    </div>
    <div>
      {section_head(p, h["products_title"], None)}
      <div class="grid" style="grid-template-columns:1fr" data-stagger>{feat_cards}</div>
      <p style="margin-top:1.5rem"><a class="btn-link" href="catalog.html"><span data-i18n="cta.view_all"></span> {icon("arrow")}</a></p>
    </div>
  </div>
</div></section>
{cta_band(p, h["cta_title"], h["cta_copy"], "panels-rows.jpg",
          [{"icon": "mail", "title": {"ar": "البريد الإلكتروني", "en": "Email"}, "text": {"ar": "info@ghamdan-trd.com", "en": "info@ghamdan-trd.com"}},
           {"icon": "phone", "title": {"ar": "الهاتف", "en": "Phone"}, "text": {"ar": "+967 775 800 000", "en": "+967 775 800 000"}},
           {"icon": "pin", "title": {"ar": "الموقع", "en": "Location"}, "text": {"ar": "صنعاء، اليمن", "en": "Sana'a, Yemen"}}])}
"""
    return "index.html", shell(p, body, "home", transparent=True)


# ================================================================ ABOUT (ref 02)
def build_about():
    p = Page("about", "من نحن", "About Us", "غمدان للتجارة والتوكيلات — وكيل Deye الرسمي في اليمن.")
    p.categories = DATA["categories"]
    a = C.ABOUT
    hero = hero_side(p, "villa-sky.jpg", a["hero_title"], a["hero_copy"], cta_text_key="cta.talk")
    pillars = "".join(
        f'<div class="pillar reveal"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>' for x in C.HOME["pillars"])
    mission = "".join(
        f'<div class="card card--hover reveal"><div class="card__body feature"><span class="icon-circle">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div></div>' for x in (a["mission"], a["vision"]))
    expertise = ""
    for s in C.SOLUTIONS[:3]:
        img = {"residential": "villa-roof.jpg", "commercial": "solar-farm.jpg", "pumping": "pump-flow.jpg"}[s["id"]]
        expertise += f"""
<article class="card card--hover reveal">
  <div class="card__media"><img src="assets/img/photos/{img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
  <div class="card__body"><h3>{p.p(s["title"], "span")}</h3><p>{p.p(s["text"])}</p></div>
  <div class="card__foot"><a class="btn-link" href="solutions.html"><span data-i18n="cta.discover"></span> {icon("arrow")}</a></div>
</article>"""
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {section_head(p, a["intro_title"], None, center=True, pill={"ar": "من نحن", "en": "About Us", "zh": "关于我们"})}
  <div class="pillars reveal">{pillars}</div>
</div></section>
<section class="section"><div class="container">
  <div class="editorial">
    <div class="editorial__media reveal"><img src="assets/img/photos/solar-farm.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
    <div class="editorial__text reveal">
      <span class="pill">{p.p(a["story_title"])}</span>
      <h3>{p.p(a["story_head"], "span")}</h3>
      <p>{p.p(a["story_copy"])}</p>
      <a class="btn btn--primary" href="solutions.html"><span data-i18n="cta.discover"></span> {icon("arrow")}</a>
    </div>
  </div>
  <div class="grid grid--2" style="margin-top:4rem" data-stagger>{mission}</div>
</div></section>
<section class="section section--white"><div class="container">
  {section_head(p, a["expertise_head"], None, center=True, pill=a["expertise_title"])}
  <div class="grid grid--3" data-stagger>{expertise}</div>
</div></section>
{cta_band(p, a["cta_title"], C.HOME["cta_copy"], "panels-rows.jpg")}
"""
    return "about.html", shell(p, body, "about", transparent=True)


# ================================================================ SOLUTIONS (ref 03)
def build_solutions():
    p = Page("solutions", "حلولنا", "Our Solutions", "حلول متكاملة للطاقة والمياه.")
    p.categories = DATA["categories"]
    s = C.SOLUTIONS_PAGE
    hero = hero_side(p, "solar-farm.jpg", s["hero_title"], s["hero_copy"], cta_text_key="cta.discover",
                     wa_text="مرحباً غمدان — أريد اكتشاف حلولكم.")
    rows = ""
    imgs = {"residential": "villa-roof.jpg", "commercial": "solar-farm.jpg", "pumping": "pump-flow.jpg",
            "irrigation": "greenhouse.jpg", "agriculture": "crops.jpg"}
    for i, sol in enumerate(C.SOLUTIONS):
        link = "solutions/pumping.html" if sol["id"] == "pumping" else "solutions.html"
        rows += f"""
<div class="editorial">
  <div class="editorial__media reveal"><img src="assets/img/photos/{imgs[sol["id"]]}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
  <div class="editorial__text reveal">
    <span class="pill">{icon(sol["icon"])} {p.p(sol["pill"])}</span>
    <h3>{p.p(sol["title"], "span")}</h3>
    <p>{p.p(sol["text"])}</p>
    <a class="btn btn--primary" href="{link}"><span data-i18n="cta.discover"></span> {icon("arrow")}</a>
  </div>
</div>"""
    steps = "".join(
        f'<div class="step reveal"><div class="step__num">{i + 1:02d}</div><span class="icon-circle icon-circle--sm" style="margin-bottom:1rem">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>'
        for i, x in enumerate(s["process"]))
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  {section_head(p, s["intro_title"], None, center=True)}
  {rows}
</div></section>
<section class="section"><div class="container">
  {section_head(p, s["process_title"], None, center=True)}
  <div class="steps" data-stagger>{steps}</div>
</div></section>
{cta_band(p, s["cta_title"], C.HOME["cta_copy"], "solar-farm.jpg")}
"""
    return "solutions.html", shell(p, body, "solutions", transparent=True)


# ================================================================ PUMPING DETAIL (ref 09)
def build_pumping():
    p = Page("solutions/pumping", "حلول ضخ المياه بالطاقة الشمسية", "Solar Water Pumping Solutions",
             "ضخ المياه بالطاقة الشمسية — منظومة متكاملة.", rel="../")
    p.categories = DATA["categories"]
    d = C.PUMPING
    crumbs = [("index.html", "الرئيسية"), ("solutions.html", "حلولنا"), (None, "ضخ المياه بالطاقة الشمسية")]
    hero = hero_side(p, "pump-flow.jpg", d["hero_title"], d["hero_copy"], cta_text_key="cta.contact",
                     wa_text="مرحباً غمدان — أريد مناقشة مشروع ضخ مياه.", crumbs=crumbs)
    feats = "".join(
        f'<div class="mini-feature">{icon(x["icon"])}<div><h4>{p.p(x["title"], "span")}</h4></div></div>' for x in d["overview_features"])
    challenges = "".join(
        f'<div class="feature reveal"><span class="icon-circle icon-circle--white">{icon(x["icon"])}</span>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>' for x in d["challenges"])
    steps = "".join(
        f'<div class="step reveal"><div class="step__num">{x["n"]}</div>'
        f'<div class="product-card__visual" style="border-radius:0.875rem;margin-bottom:1rem">{product_svg("pump")}</div>'
        f'<h3>{p.p(x["title"], "span")}</h3><p>{p.p(x["text"])}</p></div>' for x in d["steps"])
    apps = "".join(
        f'''<article class="card card--hover reveal">
  <div class="card__media"><img src="../assets/img/photos/{x["img"]}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset-inline:0;bottom:0;background:rgba(10,37,64,0.65);color:#fff;padding:1rem 1.25rem;font-weight:700">{p.p(x["title"], "span")}</div></div>
</article>''' for x in d["apps"])
    diagram = '''<svg viewBox="0 0 1100 320" fill="none" aria-hidden="true">
<rect x="20" y="20" width="1060" height="280" rx="14" fill="#FFFFFF"/>
<g stroke="#0F2E4D" stroke-width="2.5">
<rect x="60" y="90" width="150" height="90" rx="8" fill="#B2D3F0"/>
<path d="M85 120h100M85 140h100M135 100v70" stroke="#0F2E4D"/>
<rect x="300" y="110" width="90" height="55" rx="8" fill="#EEF3F7"/>
<rect x="480" y="60" width="60" height="140" rx="8" fill="#EEF3F7"/>
<path d="M510 200v40M470 240h80" />
<rect x="640" y="80" width="110" height="90" rx="8" fill="#EEF3F7"/>
<path d="M695 80V50M650 50h90" />
<path d="M750 125h60M810 125v60M810 185H950" />
<path d="M950 185v-40" />
</g>
<g fill="#0F2E4D" font-family="Tajawal" font-size="15" font-weight="700" text-anchor="middle">
<text x="135" y="205">ألواح شمسية</text><text x="345" y="190">جهاز التحكم</text>
<text x="510" y="270">مضخة المياه</text><text x="695" y="200">خزان المياه</text>
<text x="880" y="170">شبكة التوزيع</text><text x="1020" y="120">المحاصيل</text>
</g>
<g stroke="#1E8FE8" stroke-width="3" stroke-linecap="round"><path d="M210 132h90M390 137h90M540 132h100M750 125h0"/></g>
<path d="M990 90c14-12 30-12 40 0s24 4 30-8" stroke="#22A355" stroke-width="2.5" fill="none"/>
</svg>'''
    related = [x for x in PUB if x["category"] == "pumps"][:3]
    body = f"""
{hero}
<section class="section section--white"><div class="container">
  <div class="editorial">
    <div class="editorial__media reveal"><img src="../assets/img/photos/pump-flow.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
    <div class="editorial__text reveal">
      <span class="pill">{p.p(d["overview_title"])}</span>
      <h3>{p.p(d["overview_head"], "span")}</h3>
      <p>{p.p(d["overview_copy"])}</p>
      <div class="mini-features mini-features--light" style="grid-template-columns:repeat(3,1fr)">{feats}</div>
    </div>
  </div>
</div></section>
<section class="section section--band"><div class="container">
  {section_head(p, d["challenges_title"], None)}
  <div class="grid grid--4" data-stagger>{challenges}</div>
</div></section>
<section class="section section--white"><div class="container">
  {section_head(p, d["steps_title"], None)}
  <div class="steps" data-stagger>{steps}</div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, d["diagram_title"], None, pill=d["diagram_pill"])}
  <div class="diagram reveal">{diagram}</div>
  <p class="form-note" style="margin-top:1rem">{p.p({"ar": "مخطط توضيحي مبني بالكود — وليس لقطة من المرجع.", "en": "Illustrative diagram built in code — not a screenshot of the reference."})}</p>
</div></section>
<section class="section section--white"><div class="container">
  {section_head(p, d["apps_title"], None)}
  <div class="grid grid--3" data-stagger>{apps}</div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, {"ar": "منتجات مكملة", "en": "Complementary Products", "zh": "配套产品"}, None)}
  {product_grid(p, related)}
  <p style="margin-top:2rem"><a class="btn btn--primary" href="../guidance.html"><span data-i18n="nav.guidance"></span> {icon("arrow")}</a></p>
</div></section>
{cta_band(p, d["cta_title"], C.HOME["cta_copy"], "pump-flow.jpg")}
"""
    return "solutions/pumping.html", shell(p, body, "solutions", transparent=True)


import build_part2 as bp

# inject shared context into part 2
bp.PUB = PUB
bp.CATS = CATS
bp.DATA = DATA
bp.BUNDLES = BUNDLES
bp.C = C
bp.product_grid = product_grid
from html import escape as _esc
bp.esc = _esc


# ================================================================ CATALOG (ref 04)
def _featured(n=12):
    """Featured products, round-robin across categories (PUB is grouped by
    category in the xlsx, so PUB[:12] would be 12 inverters)."""
    by_cat = {}
    for x in PUB:
        by_cat.setdefault(x["category"], []).append(x)
    order = ["inverters", "batteries", "pumps", "controllers",
             "panels", "systems", "storage-ci", "cameras"]
    idx = {c: 0 for c in order}
    out = []
    while len(out) < n:
        progressed = False
        for c in order:
            if len(out) >= n:
                break
            lst = by_cat.get(c, [])
            if idx[c] < len(lst):
                out.append(lst[idx[c]])
                idx[c] += 1
                progressed = True
        if not progressed:
            break
    return out


def build_catalog():
    p = Page("catalog", "المنتجات", "Products", "دليل منتجات الطاقة الشمسية والمضخات والمعدات الزراعية.")
    p.categories = DATA["categories"]
    c = C.CATALOG
    hero = hero_split(p, "panels-rows.jpg", c["hero_kicker"], c["hero_title"], c["hero_copy"], cta_text_key="cta.contact")
    trust = "".join(
        f'<div class="feature feature--center reveal"><span class="icon-circle">{icon(x["icon"])}</span><h4>{p.p(x["title"], "span")}</h4></div>'
        for x in c["trust"])
    strip = "".join(
        f'''<a class="cat-tile" href="categories/{cat["id"]}.html">
      <span class="cat-tile__visual">{icon(cat["icon"])}</span><span>{esc(cat["ar"])}</span></a>'''
        for cat in DATA["categories"])
    featured = _featured(12)
    why = "".join(
        f'<div class="feature reveal"><span class="icon-circle">{icon(x["icon"])}</span><h4>{p.p(x["title"], "span")}</h4><p>{p.p(x["text"])}</p></div>'
        for x in c["why"])
    body = f"""
{hero}
<section class="section section--white" style="padding-top:2.5rem"><div class="container">
  <div class="grid grid--3 reveal">{trust}</div>
</div></section>
<section class="section" data-catalog><div class="container">
  {section_head(p, c["explore_title"], None, center=True)}
  <div class="filter-bar reveal" style="margin-bottom:2rem">
    <span class="filter-bar__title">{icon("search")} <span data-i18n="filter.title"></span></span>
    <div class="search-input"><input type="search" data-filter-q data-i18n-ph="search.ph" aria-label="بحث"></div>
    <select data-filter-brand aria-label="العلامة التجارية" style="min-height:3.125rem;border:1px solid #D5DEE8;border-radius:0.625rem;padding:0 1rem;background:#fff">
      <option value="" data-i18n="filter.all"></option>
      {''.join(f'<option value="{esc(b)}">{esc(b)}</option>' for b in sorted({x["brand"] for x in PUB}))}
    </select>
    <select data-filter-type aria-label="الفئة" style="min-height:3.125rem;border:1px solid #D5DEE8;border-radius:0.625rem;padding:0 1rem;background:#fff">
      <option value="" data-i18n="filter.all"></option>
      {''.join(f'<option value="{cat["id"]}">{esc(cat["ar"])}</option>' for cat in DATA["categories"])}
    </select>
  </div>
  <div class="cat-strip reveal" style="margin-bottom:3rem">{strip}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem">
    <h2 style="margin:0">{p.p(c["featured_title"], "span")}</h2>
    <span class="result-meta" data-result-meta></span>
  </div>
  {product_grid(p, featured)}
  <div data-filter-empty hidden>{empty_state(p, "search", {"ar": "لا توجد نتائج مطابقة", "en": "No matching results"}, {"ar": "جرّب كلمة أخرى أو غيّر الفلاتر.", "en": "Try another word or change the filters."})}</div>
  <p style="margin-top:2rem;text-align:center"><a class="btn btn--primary" href="categories/inverters.html"><span data-i18n="cta.view_all"></span> {icon("arrow")}</a></p>
</div></section>
<section class="section section--white"><div class="container">
  <div class="card reveal" style="background:#EAF3FC;border:0">
    <div class="card__body" style="display:grid;grid-template-columns:1.2fr 0.8fr;gap:2rem;align-items:center">
      <div>
        <h2>{p.p(c["help_title"], "span")}</h2>
        <p class="lead">{p.p(c["help_copy"])}</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1rem">
          <a class="btn btn--primary" data-wa data-wa-type="catalog-help" data-wa-cta="catalog-help" href="{wa_msg("مرحباً غمدان — أحتاج مساعدة في اختيار الحل الأنسب.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
          <a class="btn btn--outline" href="contact.html"><span data-i18n="cta.contact"></span></a>
        </div>
      </div>
      <div style="border-radius:0.875rem;overflow:hidden;min-height:14rem"><img src="assets/img/photos/panels-rows.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
    </div>
  </div>
</div></section>
<section class="section"><div class="container">
  {section_head(p, c["why_title"], None, center=True)}
  <div class="grid grid--4" data-stagger>{why}</div>
</div></section>
"""
    return "catalog.html", shell(p, body, "catalog")


# ================================================================ MAIN
def main():
    pages = [
        build_home(), build_about(), build_solutions(), build_pumping(), build_catalog(),
        bp.build_projects(), bp.build_project_template(), bp.build_contact(),
        bp.build_services(), bp.build_support(), bp.build_news(), bp.build_agencies(),
        bp.build_systems(), bp.build_downloads(), bp.build_legal("privacy"), bp.build_legal("terms"),
        bp.build_search(), bp.build_guidance(), bp.build_404(), bp.build_admin(),
    ]
    for cat in DATA["categories"]:
        pages.append(bp.build_category(cat))
    for prod in PUB:
        pages.append(bp.build_product(prod))
    for b in BUNDLES:
        pages.append(bp.build_system(b))
    for a in C.AGENCIES:
        pages.append(bp.build_agency(a))
    for rel, html_text in pages:
        out = ROOT / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html_text, encoding="utf-8")
    print(f"Built {len(pages)} pages")
    for rel, _ in pages:
        print(" ", rel)


if __name__ == "__main__":
    main()
