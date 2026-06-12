/* ============================================================
   <astro-nav current="casa|nomina|ahorro">
   ------------------------------------------------------------
   Barra superior de la suite (cambiador de apps). Self-contained
   vía Shadow DOM: sus estilos NO afectan a la app que la incluye.
   Lee la config de window.ASTROTOOLS (shared/brand.js).

   Rutas relativas y "depth-aware": detecta si la página está en la
   raíz (hub) o dentro de una app (/casa, /nomina, /ahorro) y antepone
   "../" cuando hace falta. Así funciona igual en local y en
   GitHub Pages (alex-sq-uh.github.io/AstroTools/...).
   ============================================================ */
(function () {
  var cfg = window.ASTROTOOLS || { brand: "AstroTools", apps: [] };
  var inApp = /\/(casa|nomina|ahorro)\//.test(location.pathname);
  var prefix = inApp ? "../" : "";   // para llegar a las apps hermanas
  var home   = inApp ? "../" : "./"; // para volver al hub

  class AstroNav extends HTMLElement {
    connectedCallback() {
      var current = this.getAttribute("current") || "";
      var root = this.attachShadow({ mode: "open" });
      var links = cfg.apps.map(function (a) {
        return '<a class="app' + (a.id === current ? ' active' : '') +
               '" href="' + prefix + a.href + '">' + a.name + '</a>';
      }).join("");
      root.innerHTML =
        '<style>' +
          ":host{display:block;font-family:'Segoe UI',system-ui,sans-serif}" +
          ".bar{background:linear-gradient(120deg,#0f1d44,#1a2b5e 55%,#2a3f80);" +
            "color:#fff;display:flex;align-items:center;gap:.2rem;padding:0 1rem;" +
            "height:38px;font-size:.85rem;overflow-x:auto;-webkit-overflow-scrolling:touch}" +
          ".bar::-webkit-scrollbar{display:none}" +
          ".brand{font-weight:800;letter-spacing:.02em;margin-right:.6rem;white-space:nowrap}" +
          ".brand a{color:#fff;text-decoration:none}" +
          ".brand .dot{color:#f5c84b}" +
          "a.app{color:#cdd6f0;text-decoration:none;padding:.3rem .6rem;border-radius:8px;" +
            "white-space:nowrap;transition:background .15s,color .15s}" +
          "a.app:hover{color:#fff;background:rgba(255,255,255,.12)}" +
          "a.app.active{color:#0f1d44;background:#f5c84b;font-weight:700}" +
        '</style>' +
        '<nav class="bar" aria-label="Apps de ' + cfg.brand + '">' +
          '<span class="brand"><a href="' + home + '">' + cfg.brand + '<span class="dot">.</span></a></span>' +
          links +
        '</nav>';
    }
  }

  if (!customElements.get("astro-nav")) customElements.define("astro-nav", AstroNav);
})();
