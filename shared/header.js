/* ============================================================
   <astro-header app="casa|nomina|ahorro" version="vX.Y" [brand-action]>
   ------------------------------------------------------------
   Cabecera ÚNICA de la suite (sustituye a <astro-nav> + el topbar
   propio de cada app). Una sola cabecera, una sola sombra, en filas:

     fila 1 · [☰]  AstroTools         (hamburguesa a la IZQUIERDA)
     fila 2 · 🪐 logo · NombreApp · versión   [slot="action"]
     fila 3 · pestañas internas (opcional, vía slot="tabs")

   El botón ☰ despliega un menú con el selector de APP (marca la
   actual) y el selector de IDIOMA (ES/CA/EN).

   Self-contained vía Shadow DOM: sus estilos NO afectan a la app.
   Lee la config de window.ASTROTOOLS (shared/brand.js). Rutas
   relativas y "depth-aware" (funciona en local y en GitHub Pages).

   Conexión con cada app (en DOM ligero, por eventos):
     · Idioma  → emite  CustomEvent("astro-lang", {detail:{lang}})
                 cada app lo conecta a setLang / setLangSavings.
     · Marca   → con atributo [brand-action], al pulsar logo+nombre
                 emite CustomEvent("astro-brand")  (p.ej. restart()).

   Las pestañas (slot="tabs") y los controles (slot="action") viven
   en el DOM ligero de la app, así que showPage()/data-i18n y demás
   lógica existente siguen funcionando sin tocar nada.
   ============================================================ */
(function () {
  var cfg = window.ASTROTOOLS || { brand: "AstroTools", apps: [] };
  var inApp = /\/(casa|nomina|ahorro)\//.test(location.pathname);
  var prefix = inApp ? "../" : ""; // para llegar a las apps hermanas

  var ICONS = { casa: "🏠", nomina: "🧾", ahorro: "📈" };
  var MENU_T = {
    es: { apps: "Cambiar de app", lang: "Idioma" },
    ca: { apps: "Canviar d'app", lang: "Idioma" },
    en: { apps: "Switch app", lang: "Language" }
  };

  // Logo de la suite: planeta dorado con órbita (neutro, igual en las 3 apps)
  var LOGO =
    '<svg class="app-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="ahHdrOrbit" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7aa1ff"/><stop offset="100%" stop-color="#f5c84b"/></linearGradient>' +
        '<radialGradient id="ahHdrPlanet" cx="0.35" cy="0.3" r="0.85"><stop offset="0%" stop-color="#f8d97a"/><stop offset="55%" stop-color="#f5c84b"/><stop offset="100%" stop-color="#c79420"/></radialGradient>' +
        '<clipPath id="ahHdrBack"><rect x="0" y="0" width="64" height="31"/></clipPath>' +
        '<clipPath id="ahHdrFront"><rect x="0" y="31" width="64" height="33"/></clipPath>' +
      '</defs>' +
      '<ellipse cx="32" cy="34" rx="26" ry="9" fill="none" stroke="url(#ahHdrOrbit)" stroke-width="2.4" transform="rotate(-22 32 34)" opacity="0.85" clip-path="url(#ahHdrBack)"/>' +
      '<circle cx="32" cy="30" r="14" fill="url(#ahHdrPlanet)"/>' +
      '<circle cx="11" cy="14" r="1.4" fill="#fff"/><circle cx="54" cy="18" r="1" fill="#fff"/>' +
      '<circle cx="52" cy="48" r="1.2" fill="#fff"/><circle cx="9" cy="50" r="1" fill="#fff"/>' +
      '<ellipse cx="32" cy="34" rx="26" ry="9" fill="none" stroke="url(#ahHdrOrbit)" stroke-width="2.4" transform="rotate(-22 32 34)" clip-path="url(#ahHdrFront)"/>' +
    '</svg>';

  function escAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  class AstroHeader extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;

      var app = this.getAttribute("app") || "";
      var version = this.getAttribute("version") || "";
      var brandAction = this.hasAttribute("brand-action");
      var home = this.hasAttribute("home"); // hub: cabecera slim de 1 fila (sin row2/row3)

      var lang = (document.documentElement.lang || "es").slice(0, 2).toLowerCase();
      if (["es", "ca", "en"].indexOf(lang) < 0) lang = "es";

      var hasTabs = !!this.querySelector('[slot="tabs"]');
      var hasAction = !!this.querySelector('[slot="action"]');

      var current = null;
      for (var i = 0; i < cfg.apps.length; i++) if (cfg.apps[i].id === app) current = cfg.apps[i];
      var appName = current ? current.name : cfg.brand;
      var accentName = appName.indexOf("Astro") === 0
        ? 'Astro<span class="accent">' + appName.slice(5) + "</span>"
        : appName;

      var appLinks = cfg.apps.map(function (a) {
        return '<a href="' + prefix + a.href + '" class="' + (a.id === app ? "current" : "") + '">' +
          '<span class="ic">' + (ICONS[a.id] || "•") + "</span> " + a.name + "</a>";
      }).join("");

      var mt = MENU_T[lang];
      var langBtns = ["es", "ca", "en"].map(function (l) {
        return '<button data-l="' + l + '"' + (l === lang ? ' class="active"' : "") + ">" + l.toUpperCase() + "</button>";
      }).join("");

      var root = this.attachShadow({ mode: "open" });
      root.innerHTML =
        "<style>" +
          ":host{display:block;width:100%;position:sticky;top:0;z-index:100;font-family:'Segoe UI',system-ui,sans-serif}" +
          ".header{position:relative;background:linear-gradient(120deg,#0f1d44,#1a2b5e 60%,#2a3f80);color:#fff;box-shadow:0 3px 14px rgba(15,29,68,.28)}" +
          /* fila 1 */
          ".row1{display:flex;align-items:center;gap:.6rem;height:38px;padding:0 1rem;border-bottom:1px solid rgba(255,255,255,.12)}" +
          ".menu-btn{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.22);border-radius:8px;width:34px;height:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;padding:0;flex-shrink:0}" +
          ".menu-btn span{display:block;width:16px;height:2px;background:#fff;border-radius:2px}" +
          ".menu-btn:hover{background:rgba(255,255,255,.2)}" +
          ".suite{font-weight:800;font-size:.9rem;letter-spacing:.02em}" +
          ".suite .dot{color:#f5c84b}" +
          /* fila 2 */
          ".row2{display:flex;align-items:center;gap:11px;padding:.55rem 1rem .6rem}" +
          ".brand{display:flex;align-items:center;gap:11px;min-width:0}" +
          ".brand.clickable{cursor:pointer;user-select:none}" +
          ".app-logo{width:34px;height:34px;flex-shrink:0;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))}" +
          ".app-name{font-weight:800;font-size:1.15rem;letter-spacing:.01em;white-space:nowrap}" +
          ".app-name .accent{color:#f5c84b}" +
          ".app-ver{font-size:.7rem;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,.78);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:1px 9px;flex-shrink:0}" +
          ".row2-action{margin-left:auto;display:flex;align-items:center;gap:6px}" +
          'slot[name="action"]{display:flex;align-items:center;gap:6px}' +
          /* fila 3 (pestañas) */
          ".row3{display:flex;padding:0 .65rem .5rem;overflow-x:auto;-webkit-overflow-scrolling:touch}" +
          ".row3::-webkit-scrollbar{display:none}" +
          'slot[name="tabs"]{display:flex;gap:4px}' +
          /* menú desplegable */
          ".menu{position:absolute;top:34px;left:.6rem;width:230px;background:#fff;color:#1a2733;border:1px solid #dde3ea;border-radius:12px;box-shadow:0 12px 34px rgba(15,29,68,.22);padding:.5rem;display:none;z-index:120}" +
          ".menu.open{display:block}" +
          ".menu-sec{padding:.3rem .2rem}" +
          ".menu-sec+.menu-sec{border-top:1px solid #dde3ea;margin-top:.2rem;padding-top:.5rem}" +
          ".menu-lbl{font-size:.64rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5a6a7a;padding:.1rem .55rem .35rem}" +
          ".menu a{display:flex;align-items:center;gap:9px;padding:.5rem .55rem;border-radius:8px;text-decoration:none;color:#1a2733;font-size:.9rem;font-weight:600}" +
          ".menu a:hover{background:#f4f6fb}" +
          ".menu a.current{background:#eef4fc;color:#1a2b5e}" +
          ".menu a .ic{width:22px;text-align:center}" +
          ".lang-row{display:flex;gap:6px;padding:.15rem .55rem}" +
          ".lang-row button{flex:1;background:#fff;border:1px solid #dde3ea;color:#5a6a7a;font:inherit;font-weight:700;font-size:.8rem;padding:6px 0;border-radius:7px;cursor:pointer}" +
          ".lang-row button.active{background:#1a2b5e;color:#fff;border-color:#1a2b5e}" +
          "@media(max-width:600px){.app-name{font-size:1.05rem}.app-logo{width:30px;height:30px}}" +
        "</style>" +
        '<header class="header">' +
          '<div class="row1">' +
            '<button class="menu-btn" id="mb" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span></button>' +
            '<span class="suite">' + cfg.brand + '<span class="dot">.</span></span>' +
          "</div>" +
          (home ? "" :
          '<div class="row2">' +
            '<span class="brand' + (brandAction ? " clickable" : "") + '" id="brand">' +
              LOGO +
              '<span class="app-name">' + accentName + "</span>" +
              (version ? '<span class="app-ver">' + escAttr(version) + "</span>" : "") +
            "</span>" +
            (hasAction ? '<span class="row2-action"><slot name="action"></slot></span>' : "") +
          "</div>") +
          (hasTabs ? '<div class="row3"><slot name="tabs"></slot></div>' : "") +
          '<div class="menu" id="menu">' +
            '<div class="menu-sec">' +
              '<div class="menu-lbl" id="lbl-apps">' + mt.apps + "</div>" + appLinks +
            "</div>" +
            '<div class="menu-sec">' +
              '<div class="menu-lbl" id="lbl-lang">' + mt.lang + "</div>" +
              '<div class="lang-row">' + langBtns + "</div>" +
            "</div>" +
          "</div>" +
        "</header>";

      this._root = root;
      var self = this;
      var btn = root.getElementById("mb");
      var menu = root.getElementById("menu");

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
      menu.addEventListener("click", function (e) { e.stopPropagation(); });

      root.querySelectorAll(".lang-row button").forEach(function (b) {
        b.addEventListener("click", function () {
          var l = b.getAttribute("data-l");
          self.setActiveLang(l);
          self.dispatchEvent(new CustomEvent("astro-lang", { detail: { lang: l }, bubbles: true, composed: true }));
          menu.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        });
      });

      if (brandAction) {
        root.getElementById("brand").addEventListener("click", function () {
          self.dispatchEvent(new CustomEvent("astro-brand", { bubbles: true, composed: true }));
        });
      }
    }

    /* Refleja el idioma activo (botones + etiquetas del menú). */
    setActiveLang(l) {
      if (!this._root) return;
      this._root.querySelectorAll(".lang-row button").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-l") === l);
      });
      var mt = MENU_T[l] || MENU_T.es;
      var la = this._root.getElementById("lbl-apps");
      var ll = this._root.getElementById("lbl-lang");
      if (la) la.textContent = mt.apps;
      if (ll) ll.textContent = mt.lang;
    }
  }

  if (!customElements.get("astro-header")) customElements.define("astro-header", AstroHeader);
})();
