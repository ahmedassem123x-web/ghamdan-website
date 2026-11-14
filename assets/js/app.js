/* ==========================================================================
   GTS APP — vanilla JS. No framework. Content is visible without JS:
   .js .reveal starts hidden only when JS runs; GSAP (if loaded) enhances.
   ========================================================================== */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var S = window.GTS_SETTINGS, I18N = window.GTS_I18N, DATA = window.GTS_DATA || {};

  /* ---------- Language ---------- */
  function currentLang() {
    var q = new URLSearchParams(location.search).get("lang");
    var saved = null;
    try { saved = localStorage.getItem("gts-lang"); } catch (e) {}
    var l = q || saved || document.documentElement.getAttribute("lang") || "ar";
    return I18N[l] ? l : "ar";
  }
  var LANG = currentLang();
  function t(key) {
    var d = I18N[LANG] || I18N.ar;
    return d[key] || I18N.ar[key] || key;
  }
  function applyLang() {
    document.documentElement.setAttribute("lang", LANG);
    document.documentElement.setAttribute("dir", LANG === "ar" ? "rtl" : "ltr");
    /* Page-level strings (window.GTS_PAGE_I18N, emitted by the generator).
       ZH: keys without a zh value stay in Arabic and #zh-notice is shown
       (§13.2 / CI-09 — Chinese technical content needs human review). */
    var pageDict = window.GTS_PAGE_I18N || {};
    var zhMissing = false;
    document.querySelectorAll("[data-p]").forEach(function (el) {
      var rec = pageDict[el.getAttribute("data-p")];
      if (!rec) return;
      var v = rec[LANG] || rec.en || rec.ar;
      if (LANG === "zh" && !rec.zh) zhMissing = true;
      el.textContent = v;
    });
    var notice = document.getElementById("zh-notice");
    if (notice) notice.hidden = !(LANG === "zh" && zhMissing);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.setAttribute("placeholder", v);
      else el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    var sel = document.getElementById("lang-select");
    if (sel) sel.value = LANG;
    try { localStorage.setItem("gts-lang", LANG); } catch (e) {}
  }
  window.GTS_SET_LANG = function (lang) {
    if (!I18N[lang]) return;
    var url = new URL(location.href);
    url.searchParams.set("lang", lang);
    location.href = url.toString();
  };

  /* ---------- WhatsApp links (single source: settings.whatsapp) ---------- */
  function waLink(message) {
    return "https://wa.me/" + S.contact.whatsapp + "?text=" + encodeURIComponent(message || "");
  }
  window.GTS_WA_LINK = waLink;
  function logWaClick(sourceType, entityId, ctaId) {
    try {
      var log = JSON.parse(localStorage.getItem("gts-wa-clicks") || "[]");
      log.push({ source: sourceType, entity: entityId || "", cta: ctaId || "",
        page: location.pathname, lang: LANG, ts: new Date().toISOString() });
      localStorage.setItem("gts-wa-clicks", JSON.stringify(log.slice(-500)));
    } catch (e) {}
  }
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("[data-wa]") : null;
    if (!a) return;
    logWaClick(a.getAttribute("data-wa-type") || "general",
      a.getAttribute("data-wa-entity") || "", a.getAttribute("data-wa-cta") || "");
  });

  /* ---------- Header: transparent -> solid on scroll; compaction ---------- */
  var header = document.querySelector(".site-header--transparent");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("site-header--scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  var burger = document.querySelector(".burger");
  var backdrop = drawer ? drawer.querySelector(".drawer__backdrop") : null;
  var closeBtn = drawer ? drawer.querySelector(".drawer__close") : null;
  function openDrawer() { if (drawer) { drawer.classList.add("drawer--open"); document.body.style.overflow = "hidden"; if (burger) burger.setAttribute("aria-expanded", "true"); } }
  function closeDrawer() { if (drawer) { drawer.classList.remove("drawer--open"); document.body.style.overflow = ""; if (burger) burger.setAttribute("aria-expanded", "false"); } }
  if (burger) burger.addEventListener("click", openDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); closeLightbox(); } });
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeDrawer); });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  function closeLightbox() { if (lightbox) lightbox.classList.remove("lightbox--open"); }
  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (!lightbox) return;
      var title = el.getAttribute("data-lightbox-title") || "";
      var body = el.getAttribute("data-lightbox-body") || "";
      var t = lightbox.querySelector("[data-lb-title]"); if (t) t.textContent = title;
      var b = lightbox.querySelector("[data-lb-body]"); if (b) b.textContent = body;
      lightbox.classList.add("lightbox--open");
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    var lb = lightbox.querySelector(".lightbox__close");
    if (lb) lb.addEventListener("click", closeLightbox);
  }

  /* ---------- Reveal motion: GSAP if available, else IntersectionObserver ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function revealAll() {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("reveal--in"); });
  }
  if (reduced) { revealAll(); }
  else if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll(".reveal").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var items = group.querySelectorAll(":scope > *");
      if (items.length) gsap.fromTo(items, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: group, start: "top 88%", once: true }
      });
    });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("reveal--in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else { revealAll(); }

  /* ---------- Count-up: verified numbers only (data-count) ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (!target) return;
    if (reduced) { el.textContent = target; return; }
    var done = false;
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !done) {
          done = true; var start = null;
          (function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / 900, 1);
            el.textContent = Math.round(target * p);
            if (p < 1) requestAnimationFrame(tick);
          })(performance.now());
          io2.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io2.observe(el);
  });

  /* ---------- Contact form: validate, log locally, show success ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var field = f.closest(".field");
        if (!f.value.trim()) { ok = false; if (field) field.classList.add("field--invalid"); }
        else if (field) field.classList.remove("field--invalid");
      });
      if (!ok) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      try {
        var box = JSON.parse(localStorage.getItem("gts-inquiries") || "[]");
        box.push(Object.assign({ ts: new Date().toISOString(), lang: LANG }, data));
        localStorage.setItem("gts-inquiries", JSON.stringify(box));
      } catch (err) {}
      var done = document.getElementById("form-success");
      if (done) { done.hidden = false; done.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.reset();
    });
  }

  /* ---------- Pumping guidance tool ---------- */
  var gform = document.getElementById("guidance-form");
  if (gform) {
    gform.addEventListener("submit", function (e) {
      e.preventDefault();
      var depth = parseFloat(gform.depth.value), water = parseFloat(gform.water.value);
      var use = gform.use.value;
      var valid = true;
      [["depth", depth], ["water", water]].forEach(function (pair) {
        var f = gform[pair[0]].closest(".field");
        if (!pair[1] || pair[1] <= 0) { valid = false; if (f) f.classList.add("field--invalid"); }
        else if (f) f.classList.remove("field--invalid");
      });
      if (!valid || !use) return;
      var useLabel = { home: t("guidance.use_home"), farm: t("guidance.use_farm"), commercial: t("guidance.use_commercial") }[use] || use;
      var msg = (LANG === "ar" ? "طلب إرشاد ضخ — غمدان\n" : LANG === "zh" ? "抽水指导申请 — Ghamdan\n" : "Pumping guidance request — Ghamdan\n") +
        (LANG === "ar" ? "عمق البئر: " : LANG === "zh" ? "井深：" : "Well depth: ") + depth + " m\n" +
        (LANG === "ar" ? "كمية المياه اليومية: " : LANG === "zh" ? "每日用水量：" : "Daily water: ") + water + " m³\n" +
        (LANG === "ar" ? "نوع الاستخدام: " : LANG === "zh" ? "用途：" : "Use: ") + useLabel;
      var link = document.getElementById("guidance-wa");
      if (link) {
        link.href = waLink(msg);
        link.hidden = false;
        link.focus();
      }
      logWaClick("guidance", "pumping-tool", "guidance-submit");
    });
  }

  /* ---------- Catalog filters (catalog + category pages) ---------- */
  function bindFilters(root) {
    if (!root) return;
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-product-card]"));
    var q = root.querySelector("[data-filter-q]");
    var brand = root.querySelector("[data-filter-brand]");
    var type = root.querySelector("[data-filter-type]");
    var meta = root.querySelector("[data-result-meta]");
    function apply() {
      var query = (q ? q.value : "").trim().toLowerCase();
      var b = brand ? brand.value : "";
      var ty = type ? type.value : "";
      var shown = 0;
      cards.forEach(function (c) {
        var hay = (c.getAttribute("data-search") || "").toLowerCase();
        var ok = (!query || hay.indexOf(query) !== -1) &&
                 (!b || c.getAttribute("data-brand") === b) &&
                 (!ty || c.getAttribute("data-cat") === ty);
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (meta) meta.textContent = t("filter.showing") + " " + shown + " " + t("filter.of") + " " + cards.length + " " + t("filter.products");
      var empty = root.querySelector("[data-filter-empty]");
      if (empty) empty.hidden = shown !== 0;
    }
    [q, brand, type].forEach(function (el) { if (el) el.addEventListener("input", apply); if (el) el.addEventListener("change", apply); });
    apply();
  }
  bindFilters(document.querySelector("[data-catalog]"));

  /* ---------- Project filter pills ---------- */
  document.querySelectorAll("[data-project-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-project-filter]").forEach(function (b) { b.classList.remove("tab--active"); });
      btn.classList.add("tab--active");
      var f = btn.getAttribute("data-project-filter");
      var shown = 0;
      document.querySelectorAll("[data-project]").forEach(function (card) {
        var vis = (!f || f === "all" || card.getAttribute("data-project") === f);
        card.style.display = vis ? "" : "none";
        if (vis) shown++;
      });
      var empty = document.querySelector("[data-project-empty]");
      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ---------- Admin (front-end demo UI, §14; Filament port in ARCHITECTURE.md) ---------- */
  (function admin() {
    var gate = document.querySelector("[data-admin-gate]");
    var shellEl = document.querySelector("[data-admin-shell]");
    if (!gate || !shellEl) return;
    var KEY = "gts-admin";
    function showShell() { gate.hidden = true; shellEl.hidden = false; renderAdmin(); }
    function showGate() { gate.hidden = false; shellEl.hidden = true; }
    try { if (localStorage.getItem(KEY) === "1") showShell(); } catch (e) {}
    var login = document.querySelector("[data-admin-login]");
    if (login) login.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = login.email.value.trim(), pw = login.password.value;
      var st = login.querySelector("[data-admin-login-status]");
      if (em === "admin@ghamdan-trd.com" && pw === "admin123") {
        try { localStorage.setItem(KEY, "1"); } catch (err) {}
        showShell();
      } else if (st) st.textContent = "بيانات الدخول غير صحيحة — جرّب بيانات الدخول التجريبية.";
    });
    var logout = document.querySelector("[data-admin-logout]");
    if (logout) logout.addEventListener("click", function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      showGate();
    });
    document.querySelectorAll("[data-admin-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-admin-tab]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var tab = btn.getAttribute("data-admin-tab");
        document.querySelectorAll("[data-admin-panel]").forEach(function (pnl) {
          pnl.hidden = pnl.getAttribute("data-admin-panel") !== tab;
        });
        var title = document.querySelector("[data-admin-title]");
        if (title) title.textContent = btn.textContent.trim();
      });
    });
    function statusBadge(s) {
      var map = { draft: "مسودة", awaiting_client_list: "بانتظار العميل", factory_catalog_verified: "موثق من المصنّع", confirmed: "مؤكد من العميل", confirmed_by_client: "مؤكد من العميل", published: "منشور", archived: "مؤرشف" };
      var cls = { draft: "status--draft", awaiting_client_list: "status--awaiting", factory_catalog_verified: "status--verified", confirmed: "status--confirmed", confirmed_by_client: "status--confirmed", published: "status--published", archived: "status--archived" }[s] || "status--draft";
      return '<span class="status ' + cls + '">' + (map[s] || s) + "</span>";
    }
    /* Publication overrides (demo): status changes are kept in this browser
       only (gts-overrides) and applied on top of data.js — the Filament port
       persists them server-side. */
    var OVERRIDES_KEY = "gts-overrides";
    function getOverrides() {
      try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); } catch (e) { return {}; }
    }
    function setOverride(type, id, status) {
      var o = getOverrides();
      o[type + ":" + id] = status;
      try { localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o)); } catch (e) {}
    }
    var STATUS_OPTIONS = ["awaiting_client_list", "factory_catalog_verified", "confirmed", "archived"];
    function statusSelect(type, id, current) {
      var labels = { awaiting_client_list: "بانتظار العميل", factory_catalog_verified: "موثق من المصنّع", confirmed: "مؤكد من العميل", archived: "مؤرشف" };
      return '<select data-status-change data-type="' + type + '" data-id="' + id + '" aria-label="حالة النشر">' +
        STATUS_OPTIONS.map(function (s) {
          return '<option value="' + s + '"' + (s === current ? " selected" : "") + ">" + labels[s] + "</option>";
        }).join("") + "</select>";
    }
    function renderAdmin() {
      var d = window.GTS_DATA || {};
      var overrides = getOverrides();
      var effStatus = function (type, item) { return overrides[type + ":" + item.id] || item.status; };
      var prods = d.products || [], bundles = d.bundles || [], cats = d.categories || [];
      var stats = document.querySelector("[data-admin-stats]");
      var waLog = [];
      try { waLog = JSON.parse(localStorage.getItem("gts-wa-clicks") || "[]"); } catch (e) {}
      if (stats) {
        var pub = prods.filter(function (p) { return (d.published_statuses || []).indexOf(p.status) !== -1; }).length;
        stats.innerHTML = [
          ["المنتجات المنشورة", pub + " / " + prods.length],
          ["الباقات", bundles.length],
          ["الفئات", cats.length],
          ["نقرات واتساب (هذا المتصفح)", waLog.length],
        ].map(function (kv) {
          return '<div class="card"><div class="card__body"><h3>' + kv[0] + '</h3><p style="font-size:2rem;font-weight:800;color:var(--color-navy)">' + kv[1] + "</p></div></div>";
        }).join("");
      }
      function fillTable(name, head, rows) {
        var t = document.querySelector('[data-admin-table="' + name + '"]');
        if (!t) return;
        t.innerHTML = "<thead><tr>" + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
      }
      var catName = {};
      cats.forEach(function (c) { catName[c.id] = c.ar; });
      fillTable("products", ["الموديل", "العلامة", "الفئة", "الحالة", "تغيير الحالة"],
        prods.map(function (p) { var s = effStatus("product", p); return ["<span dir=\"ltr\">" + p.model + "</span>", p.brand, catName[p.category] || p.category, statusBadge(s), statusSelect("product", p.id, s)]; }));
      fillTable("packages", ["الباقة", "المكونات", "الحالة", "تغيير الحالة"],
        bundles.map(function (b) { var s = effStatus("bundle", b); return [b.name_ar, b.components_ar, statusBadge(s), statusSelect("bundle", b.id, s)]; }));
      fillTable("agencies", ["العلامة", "الصفة"], [
        ["Deye", "وكيل رسمي في اليمن"], ["EFORE", "علامة معروضة"], ["MUST", "علامة معروضة"],
        ["Jntech", "علامة معروضة"], ["Hanwha Q-Cells", "علامة معروضة"], ["Wisenet", "علامة معروضة"],
      ]);
      fillTable("services", ["الخدمة"], [
        ["تصميم المنظومات"], ["توريد المنتجات"], ["التركيب والتشغيل"], ["الصيانة والدعم"], ["أنظمة الضخ والري"], ["استشارات فنية"],
      ]);
      fillTable("stats", ["الوقت", "النوع", "العنصر", "الصفحة", "اللغة", "الزر"],
        waLog.slice(-30).reverse().map(function (e) {
          return [new Date(e.ts).toLocaleString("ar"), e.source || "", e.entity || "—", e.page || "", e.lang || "", e.cta || ""];
        }));
      var inquiries = [];
      try { inquiries = JSON.parse(localStorage.getItem("gts-inquiries") || "[]"); } catch (e) {}
      fillTable("inquiries", ["الوقت", "الاسم", "الهاتف", "النوع", "الرسالة"],
        inquiries.slice(-10).reverse().map(function (q) {
          return [new Date(q.ts).toLocaleString("ar"), q.name || "—", q.phone || "—", q.type || "—", (q.message || "").slice(0, 80)];
        }));
    }
    /* Status changes (delegated — tables re-render on login). */
    document.addEventListener("change", function (e) {
      var sel = e.target.closest ? e.target.closest("[data-status-change]") : null;
      if (!sel) return;
      setOverride(sel.getAttribute("data-type"), sel.getAttribute("data-id"), sel.value);
      renderAdmin();
    });
    var settingsForm = document.querySelector("[data-admin-settings]");
    if (settingsForm) settingsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var st = settingsForm.querySelector("[data-admin-settings-status]");
      try {
        localStorage.setItem("gts-settings-override", JSON.stringify({
          whatsapp: settingsForm.whatsapp.value.trim(),
          email: settingsForm.email.value.trim(),
          address: settingsForm.address.value.trim(),
          hours: settingsForm.hours.value.trim(),
        }));
        if (st) st.textContent = "حُفظت الإعدادات في هذا المتصفح (تجريبي). التطبيق على الموقع الحي يتم عبر النسخة الخلفية.";
      } catch (err) { if (st) st.textContent = "تعذّر الحفظ في هذا المتصفح."; }
    });
  })();

  applyLang();
})();
