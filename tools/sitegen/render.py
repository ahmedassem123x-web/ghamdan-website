# Renderer — builds every page from the reference design system.
# BUILD ORDER (ARCHITECTURE.md): the faithful luxury replica of the 10
# reference images FIRST (same techniques, shapes, motion); the Ghamdan
# layer (brand, contact, real catalog) is a light content swap on top —
# it never touches layout, composition or design.
import html
import urllib.parse
from .icons import icon, product_svg, kind_for

ROOT = ""  # pages live at site root; sub-pages use ../ via rel()


def esc(s):
    return html.escape(str(s or ""), quote=True)


def wa_msg(text):
    return "https://wa.me/967775800000?text=" + urllib.parse.quote(text)


class Page:
    """Collects page-level i18n strings and renders the shell."""

    def __init__(self, slug, title_ar, title_en, desc_ar, rel=""):
        self.slug = slug
        self.title_ar = title_ar
        self.title_en = title_en
        self.desc_ar = desc_ar
        self.rel = rel  # "../" for sub-pages
        self.i18n = {}
        self._n = 0

    def p(self, s, tag="span"):
        """Register a translatable string, return its HTML in AR."""
        self._n += 1
        key = f"k{self._n}"
        self.i18n[key] = {"ar": s.get("ar", ""), "en": s.get("en", "")}
        if s.get("zh"):
            self.i18n[key]["zh"] = s["zh"]
        return f'<{tag} data-p="{key}">{esc(s["ar"])}</{tag}>'

    def t(self, s):
        """Plain AR text (language-neutral: models, numbers, brand names)."""
        return esc(s.get("ar", "") if isinstance(s, dict) else s)


# ------------------------------------------------------------------ chrome
NAV = [
    ("index.html", "nav.home", "home"),
    ("about.html", "nav.about", "about"),
    ("catalog.html", "nav.products", "catalog"),
    ("solutions.html", "nav.solutions", "solutions"),
    ("systems.html", "nav.systems", "systems"),
    ("projects.html", "nav.projects", "projects"),
    ("agencies.html", "nav.agencies", "agencies"),
    ("news.html", "nav.news", "news"),
    ("support.html", "nav.support", "support"),
    ("contact.html", "nav.contact", "contact"),
]


def wordmark(rel, inverse=False):
    inv = " wordmark--inverse" if inverse else ""
    return (f'<a class="wordmark{inv}" href="{rel}index.html" aria-label="Ghamdan — غمدان">'
            f'<span class="wordmark__ar">غمدان</span><span class="wordmark__dot" aria-hidden="true"></span>'
            f'<span class="wordmark__lat">GHAMDAN · GTS</span></a>')


def header(page, active, transparent=False):
    rel = page.rel
    nav_links = "".join(
        f'<a class="site-nav__link{" site-nav__link--active" if a == active else ""}" href="{rel}{href}" data-i18n="{key}"></a>'
        for href, key, a in NAV[:6]
    )
    drawer_links = "".join(
        f'<a href="{rel}{href}" data-i18n="{key}"></a>' for href, key, a in NAV
    )
    cls = "site-header site-header--transparent" if transparent else "site-header"
    return f"""
<a class="skip-link" href="#main">تخطَّ إلى المحتوى</a>
<div class="topbar"><div class="container">
  <span class="topbar__group">
    <a href="mailto:info@ghamdan-trd.com">{icon("mail")}<span dir="ltr">info@ghamdan-trd.com</span></a>
    <a href="tel:+967775800000">{icon("phone")}<span dir="ltr">+967 775 800 000</span></a>
  </span>
  <span class="topbar__group">
    <span>{icon("clock")} <span>السبت – الجمعة: 8 صباحاً – 8 مساءً</span></span>
    <span class="social">
      <a href="https://www.facebook.com/GTSYemen" aria-label="Facebook">{icon("facebook")}</a>
      <a href="https://www.instagram.com/gtsyemen1" aria-label="Instagram">{icon("instagram")}</a>
    </span>
  </span>
</div></div>
<header class="{cls}">
  <div class="container site-header__inner">
    {wordmark(rel)}
    <nav class="site-nav" aria-label="التنقل الرئيسي">{nav_links}</nav>
    <div class="header-actions">
      <label class="lang-switch">{icon("globe")}
        <select id="lang-select" aria-label="Language / اللغة" onchange="GTS_SET_LANG(this.value)">
          <option value="ar">عربي</option><option value="en">EN</option><option value="zh">中文</option>
        </select>
      </label>
      <span class="header-cta"><a class="btn btn--primary" data-wa data-wa-type="header" data-wa-cta="header-whatsapp"
        href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن منتجاتكم.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a></span>
      <button class="burger" aria-label="القائمة" aria-expanded="false">{icon("menu")}</button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__backdrop"></div>
  <aside class="drawer__panel" aria-label="القائمة">
    <div class="drawer__head">{wordmark(rel)}
      <button class="drawer__close" aria-label="إغلاق">{icon("x")}</button></div>
    <nav class="drawer__nav">{drawer_links}</nav>
    <div class="drawer__foot">
      <a class="btn btn--whatsapp btn--block" data-wa data-wa-type="drawer" data-wa-cta="drawer-whatsapp"
        href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن منتجاتكم.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
      <a class="btn btn--outline btn--block" href="{rel}contact.html"><span data-i18n="cta.contact"></span></a>
    </div>
  </aside>
</div>"""


CAT_FOOTER = [
    {"id": "inverters", "ar": "المحولات الهجينة والانفرترات"},
    {"id": "batteries", "ar": "البطاريات"},
    {"id": "panels", "ar": "الألواح الشمسية"},
    {"id": "pumps", "ar": "المضخات"},
    {"id": "controllers", "ar": "أجهزة التحكم"},
    {"id": "systems", "ar": "الأنظمة الجاهزة"},
]


def footer(page):
    rel = page.rel
    cats = "".join(
        f'<li><a href="{rel}categories/{c["id"]}.html">{esc(c["ar"])}</a></li>'
        for c in (getattr(page, "categories", None) or CAT_FOOTER)[:6]
    )
    quick = "".join(
        f'<li><a href="{rel}{href}" data-i18n="{key}"></a></li>' for href, key, a in NAV
    )
    return f"""
<footer class="site-footer">
  <div class="site-footer__watermark" aria-hidden="true">GHAMDAN</div>
  <div class="container">
    <div class="site-footer__main">
      <div>
        {wordmark(rel)}
        <p class="lead" style="margin-top:1rem" data-i18n="footer.tagline"></p>
        <div class="social" style="margin-top:1rem">
          <a href="https://www.facebook.com/GTSYemen" aria-label="Facebook">{icon("facebook")}</a>
          <a href="https://www.instagram.com/gtsyemen1" aria-label="Instagram">{icon("instagram")}</a>
          <a href="https://www.linkedin.com" aria-label="LinkedIn">{icon("linkedin")}</a>
          <a href="https://www.youtube.com" aria-label="YouTube">{icon("youtube")}</a>
        </div>
      </div>
      <div>
        <h4 data-i18n="footer.categories"></h4>
        <ul class="site-footer__links">{cats}</ul>
      </div>
      <div>
        <h4 data-i18n="footer.quick"></h4>
        <ul class="site-footer__links">{quick}</ul>
      </div>
      <div>
        <h4 data-i18n="footer.contact"></h4>
        <ul class="site-footer__contact">
          <li>{icon("pin")}<span>شارع صخر، أمام نور اليمن مول، صنعاء، اليمن</span></li>
          <li>{icon("mail")}<a href="mailto:info@ghamdan-trd.com" dir="ltr">info@ghamdan-trd.com</a></li>
          <li>{icon("phone")}<a href="tel:+967775800000" dir="ltr">+967 775 800 000</a></li>
          <li>{icon("clock")}<span>السبت – الجمعة: 8 صباحاً – 8 مساءً</span></li>
        </ul>
        <a class="btn btn--outline btn--sm" style="margin-top:1rem" data-wa data-wa-type="footer" data-wa-cta="footer-whatsapp"
          href="{wa_msg("مرحباً غمدان — أريد الاستفسار.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>© 2026 غمدان للتجارة والتوكيلات — <span data-i18n="footer.rights"></span></span>
      <span><a href="{rel}privacy.html" data-i18n="footer.privacy"></a> | <a href="{rel}terms.html" data-i18n="footer.terms"></a></span>
    </div>
  </div>
</footer>
<a class="wa-float" data-wa data-wa-type="floating" data-wa-cta="floating-whatsapp" aria-label="WhatsApp"
  href="{wa_msg("مرحباً غمدان — أريد الاستفسار.")}">{icon("message")}</a>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true">
  <div class="lightbox__panel">
    <button class="lightbox__close btn btn--outline btn--sm" type="button">{icon("x")} <span data-i18n="common.close"></span></button>
    <h3 data-lb-title></h3><p data-lb-body></p>
  </div>
</div>
<div id="zh-notice" class="dev-banner" hidden>
  <div class="container">{icon("info")} <span>中文内容正在审核（CI-09）— 以下显示阿拉伯语原文。Chinese content under human review — showing the Arabic original.</span></div>
</div>"""


def shell(page, body, active, transparent=False, sticky_wa=False, extra_head=""):
    rel = page.rel
    i18n_json = __import__("json").dumps(page.i18n, ensure_ascii=False)
    wa_bar = ""
    if sticky_wa:
        wa_bar = f"""<div class="wa-bar wa-bar--show">
      <a class="btn btn--whatsapp" data-wa data-wa-type="sticky" data-wa-cta="sticky-whatsapp"
        href="{wa_msg("مرحباً غمدان — أريد الاستفسار عن هذا المنتج.")}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
      <a class="btn btn--outline" href="{rel}contact.html"><span data-i18n="cta.contact"></span></a>
    </div>"""
    return f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(page.title_ar)} — غمدان للتجارة والتوكيلات</title>
<meta name="description" content="{esc(page.desc_ar)}">
<link rel="stylesheet" href="{rel}assets/css/main.css">
<link rel="icon" href="{rel}assets/img/favicon.svg" type="image/svg+xml">
{extra_head}
</head>
<body{f' class="has-sticky-wa"' if sticky_wa else ""}>
{header(page, active, transparent)}
<main id="main">
{body}
<div class="dev-banner"><div class="container">{icon("info")} <span data-i18n="common.development"></span></div></div>
</main>
{footer(page)}
{wa_bar}
<script>window.GTS_PAGE_I18N = {i18n_json};</script>
<script src="{rel}assets/js/settings.js"></script>
<script src="{rel}assets/js/data.js"></script>
<script src="{rel}assets/js/i18n.js"></script>
<script src="{rel}assets/js/vendor/gsap.min.js"></script>
<script src="{rel}assets/js/vendor/ScrollTrigger.min.js"></script>
<script src="{rel}assets/js/app.js"></script>
</body>
</html>"""


# ------------------------------------------------------------------ heroes
def hero_center(page, img, badge, title, copy, cta_text_key="cta.whatsapp", wa_text="مرحباً غمدان — أريد الاستفسار عن منتجاتكم."):
    return f"""
<section class="hero hero--center hero--on-photo">
  <div class="hero__scene"><img src="{page.rel}assets/img/photos/{img}" alt="" loading="eager" style="width:100%;height:100%;object-fit:cover"><div class="hero__scrim"></div></div>
  <div class="container hero__inner"><div class="hero__content reveal">
    {f'<span class="pill pill--white"><span class="pill__dot"></span>{page.p(badge)}</span>' if badge else ""}
    <h1 class="hero__title">{page.p(title, "span")}</h1>
    <p class="hero__copy">{page.p(copy)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" data-wa data-wa-type="hero" data-wa-cta="hero-whatsapp" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="{cta_text_key}"></span></a>
    </div>
  </div></div>
</section>"""


def hero_side(page, img, title, copy, cta_text_key="cta.talk", wa_text="مرحباً غمدان — أريد التحدث معكم اليوم.", crumbs=None):
    crumb_html = ""
    if crumbs:
        crumb_html = '<nav class="breadcrumbs" aria-label="مسار التنقل">' + " / ".join(
            f'<a href="{page.rel}{href}">{esc(label)}</a>' if href else f"<span>{esc(label)}</span>"
            for href, label in crumbs) + "</nav>"
    return f"""
<section class="hero hero--side hero--on-photo">
  <div class="hero__scene"><img src="{page.rel}assets/img/photos/{img}" alt="" loading="eager" style="width:100%;height:100%;object-fit:cover"><div class="hero__scrim"></div></div>
  <div class="container hero__inner"><div class="hero__content reveal">
    {crumb_html}
    <h1 class="hero__title">{page.p(title, "span")}</h1>
    <p class="hero__copy">{page.p(copy)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" data-wa data-wa-type="hero" data-wa-cta="hero-whatsapp" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="{cta_text_key}"></span></a>
    </div>
  </div></div>
</section>"""


def hero_split(page, img, kicker, title, copy, cta_text_key="cta.contact", wa_text="مرحباً غمدان — أريد الاستفسار.", crumbs=None):
    crumb_html = ""
    if crumbs:
        crumb_html = '<nav class="breadcrumbs" aria-label="مسار التنقل">' + " / ".join(
            f'<a href="{page.rel}{href}">{esc(label)}</a>' if href else f"<span>{esc(label)}</span>"
            for href, label in crumbs) + "</nav>"
    return f"""
<section class="hero hero--split">
  <div class="container hero__inner">
    <div class="hero__content reveal">
      {crumb_html}
      {f'<span class="pill">{page.p(kicker)}</span>' if kicker else ""}
      <h1 class="hero__title">{page.p(title, "span")}</h1>
      <p class="hero__copy">{page.p(copy)}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" data-wa data-wa-type="hero" data-wa-cta="hero-whatsapp" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="{cta_text_key}"></span></a>
      </div>
    </div>
    <div class="hero__scene reveal"><img src="{page.rel}assets/img/photos/{img}" alt="" loading="eager" style="width:100%;height:100%;object-fit:cover"></div>
  </div>
</section>"""


# ------------------------------------------------------------------ sections
def section_head(page, title, copy=None, center=False, pill=None):
    cls = "section-head section-head--center" if center else "section-head"
    pill_html = f'<span class="pill">{page.p(pill)}</span>' if pill else ""
    copy_html = f'<p class="lead">{page.p(copy)}</p>' if copy else ""
    return (f'<div class="{cls} reveal">{pill_html}<h2>{page.p(title, "span")}</h2>{copy_html}'
            f'<div class="section-head__rule" aria-hidden="true"></div></div>')


def cta_band(page, title, copy, img, features=None, wa_text="مرحباً غمدان — أريد بدء مشروعي."):
    feats = ""
    if features:
        items = "".join(
            f'<div class="mini-feature">{icon(f["icon"])}<div><h4>{page.p(f["title"], "span")}</h4><p>{page.p(f["text"])}</p></div></div>'
            for f in features)
        feats = f'<div class="mini-features">{items}</div>'
    return f"""
<section class="cta-band"><div class="container cta-band__inner">
  <div class="reveal">
    <h2>{page.p(title, "span")}</h2>
    <p>{page.p(copy)}</p>
    <a class="btn btn--white" data-wa data-wa-type="cta-band" data-wa-cta="cta-whatsapp" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="cta.whatsapp"></span></a>
    {feats}
  </div>
  <div class="cta-band__media reveal"><img src="{page.rel}assets/img/photos/{img}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
</div></section>"""


# Type photo per product category (same mapping as DETAIL_PHOTO / CATEGORY_PHOTO
# in build_part2.py). Product cards show the real photo; the generic SVG is
# kept only as the img onerror fallback. Photos are illustrative type photos
# (CI-06) — real product photos are pending client input.
PRODUCT_PHOTO = {
    "inverters": "inverter-unit.jpg",
    "batteries": "battery-storage.jpg",
    "panels": "panels-rows.jpg",
    "pumps": "pump-flow.jpg",
    "controllers": "controller-unit.jpg",
    "systems": "solar-farm.jpg",
    "storage-ci": "battery-storage.jpg",
    "cameras": "panels-rows.jpg",
}


def product_card(page, prod, cat_name_ar):
    kind = kind_for(prod["category"], prod["model"])
    photo = PRODUCT_PHOTO.get(prod["category"], "panels-rows.jpg")
    wa_text = f"مرحباً غمدان — أريد الاستفسار عن {prod['brand']} {prod['model']}."
    search = f"{prod['brand']} {prod['model']} {prod['specs_ar']} {cat_name_ar}"
    return f"""
<article class="card product-card card--hover" data-product-card data-brand="{esc(prod['brand'])}" data-cat="{esc(prod['category'])}" data-search="{esc(search)}">
  <div class="product-card__visual"><img src="{page.rel}assets/img/photos/{photo}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
  <div class="card__body">
    <span class="product-card__brand" dir="ltr">{esc(prod['brand'])}</span>
    <h3 class="product-card__name" dir="auto">{esc(prod['model'])}</h3>
    <p class="product-card__spec">{esc(prod['specs_ar'] or cat_name_ar)}</p>
  </div>
  <div class="card__foot">
    <a class="btn-link" href="{page.rel}products/{prod['id']}.html"><span data-i18n="cta.view_product"></span> {icon("arrow")}</a>
    <a class="btn btn--outline btn--sm" data-wa data-wa-type="product" data-wa-entity="{prod['id']}" data-wa-cta="product-inquire" href="{wa_msg(wa_text)}">{icon("message")} <span data-i18n="cta.inquire"></span></a>
  </div>
</article>"""


def empty_state(page, icon_name, title_s, text_s):
    return f"""
<div class="empty-state reveal">
  <span class="icon-circle">{icon(icon_name)}</span>
  <h3>{page.p(title_s, "span")}</h3>
  <p>{page.p(text_s)}</p>
</div>"""
