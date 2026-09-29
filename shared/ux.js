/* ============================================================
   AstroTools · comportamiento común de las calculadoras (window.AstroUX)
   ------------------------------------------------------------
   Piezas de interfaz compartidas por casa, nomina, rentabilidad y
   forecast. No toca ningún cálculo: cada app le pasa lo que tiene que
   enseñar. Todo es opcional y tolera fallos (p. ej. sin localStorage).

     AstroUX.init({ app })              → prepara la página (una vez)
     AstroUX.showResult({ label, value, hero, state, summary })
                                        → barra fija + escritorio a 2 columnas
                                          + guarda en el móvil si el usuario lo pidió
     AstroUX.clearResult()              → vuelta al estado inicial
     AstroUX.mountRemember(afterEl)     → casilla "Recordar en este móvil"
     AstroUX.restoreState()             → estado guardado (o null)
     AstroUX.markMissing([inputs])      → resalta lo que falta y enfoca el primero

   Guardado local (solo si el usuario marca la casilla):
     astro:rem:<app> = "1" · astro:state:<app> = estado · astro:last = resumen
     para el "Continúa donde lo dejaste" del hub. Nada sale del navegador.
   ============================================================ */
(function () {
  var TXT = {
    es: { edit: "Cambiar datos", see: "Ver resultado", remember: "Recordar mis datos en este móvil" },
    ca: { edit: "Canviar dades", see: "Veure resultat", remember: "Recordar les meves dades en aquest mòbil" },
    en: { edit: "Edit inputs", see: "See result", remember: "Remember my inputs on this device" }
  };
  function lang() { var l = (document.documentElement.lang || "es").slice(0, 2); return TXT[l] ? l : "es"; }
  function tx(k) { return TXT[lang()][k]; }

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) {} }
  };

  var app = "", bar = null, barLbl = null, barVal = null, barBtn = null, heroEl = null, heroVisible = true, io = null, rememberBox = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Movimiento reducido: los scrollIntoView "smooth" pasan a instantáneos ---- */
  if (reduceMotion && Element.prototype.scrollIntoView) {
    var native = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (o) {
      if (o && typeof o === "object") { o = Object.assign({}, o, { behavior: "auto" }); }
      return native.call(this, o);
    };
  }

  /* ---- Etiquetas: cada <label> de un .field apunta a su campo ---- */
  var uid = 0;
  function linkLabels(root) {
    (root || document).querySelectorAll(".field").forEach(function (f) {
      var lab = f.querySelector("label"); if (!lab || lab.htmlFor || lab.querySelector("input,select")) return;
      var inp = f.querySelector("input:not([type=hidden]),select,textarea"); if (!inp) return;
      if (!inp.id) inp.id = "fld-" + (++uid);
      lab.htmlFor = inp.id;
    });
  }

  /* ---- Ayudas "i": enfocables y con teclado (el clic lo gestiona cada app) ---- */
  function a11yInfo(root) {
    (root || document).querySelectorAll(".info-icon:not([data-a11y])").forEach(function (ic) {
      ic.setAttribute("data-a11y", "1");
      ic.setAttribute("tabindex", "0");
      ic.setAttribute("role", "button");
      var tip = ic.querySelector(".tooltip-box");
      ic.setAttribute("aria-label", tip ? tip.textContent.trim() : "Info");
      ic.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ic.click(); }
        if (e.key === "Escape") ic.classList.remove("show");
      });
    });
  }

  /* ---- Escritorio: separa formulario y resultados en dos columnas ---- */
  function wrapCalc() {
    var pc = document.getElementById("page-calc"); if (!pc || pc.querySelector(".calc-form")) return;
    var res = document.getElementById("results"); if (!res || res.parentNode !== pc) return;
    var form = document.createElement("div"); form.className = "calc-form";
    var out = document.createElement("div"); out.className = "calc-out";
    var kids = Array.prototype.slice.call(pc.children), past = false;
    kids.forEach(function (k) {
      if (k.classList.contains("page-head")) return; // la franja se queda arriba, a todo el ancho
      if (k === res) past = true;
      (past ? out : form).appendChild(k);
    });
    pc.appendChild(form); pc.appendChild(out);
  }

  /* ---- Barra de resultado fija (móvil) ---- */
  function buildBar() {
    if (bar) return;
    bar = document.createElement("div"); bar.className = "result-bar"; bar.setAttribute("aria-live", "polite");
    bar.innerHTML = '<div class="rb-txt"><span class="rb-lbl"></span><span class="rb-val"></span></div><button type="button"></button>';
    document.body.appendChild(bar);
    barLbl = bar.querySelector(".rb-lbl"); barVal = bar.querySelector(".rb-val"); barBtn = bar.querySelector("button");
    barBtn.addEventListener("click", function () {
      if (!heroEl) return;
      if (heroBelow()) { heroEl.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      var f = document.querySelector("#page-calc .calc-form input:not([type=checkbox]):not([type=hidden]), #page-calc input[type=text]");
      var pc = document.getElementById("page-calc");
      (pc || document.body).scrollIntoView({ behavior: "smooth", block: "start" });
      if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }, 350);
    });
    window.addEventListener("scroll", refreshBar, { passive: true });
  }
  function heroBelow() { return heroEl && heroEl.getBoundingClientRect().top > window.innerHeight; }
  function refreshBar() {
    if (!bar) return;
    var on = document.body.classList.contains("has-results") && heroEl && !heroVisible && heroEl.offsetParent !== null;
    bar.classList.toggle("show", !!on);
    if (on) barBtn.textContent = heroBelow() ? tx("see") : tx("edit");
  }
  function watchHero(el) {
    if (heroEl === el) return;
    heroEl = el; heroVisible = true;
    if (io) io.disconnect();
    if (!el || !("IntersectionObserver" in window)) return;
    io = new IntersectionObserver(function (ents) { heroVisible = ents[0].isIntersecting; refreshBar(); }, { threshold: 0 });
    io.observe(el);
  }

  /* ---- Recordar en este móvil ---- */
  function remembering() { return store.get("astro:rem:" + app) === "1"; }
  var lastPayload = null;
  function persist() {
    if (!remembering() || !lastPayload) return;
    if (lastPayload.state != null) store.set("astro:state:" + app, lastPayload.state);
    if (lastPayload.summary) {
      store.set("astro:last", JSON.stringify({
        app: app, label: lastPayload.summary.label, value: lastPayload.summary.value, t: Date.now()
      }));
    }
  }

  var AstroUX = {
    init: function (opts) {
      app = (opts && opts.app) || "";
      wrapCalc(); linkLabels(); a11yInfo(); buildBar();
      var pc = document.getElementById("page-calc");
      if (pc && "MutationObserver" in window) {
        var pending = false;
        new MutationObserver(function () {
          if (pending) return; pending = true;
          setTimeout(function () { pending = false; linkLabels(pc); a11yInfo(pc); }, 0);
        }).observe(pc, { childList: true, subtree: true });
      }
      document.addEventListener("astro-lang", function () {
        setTimeout(function () {
          if (rememberBox) rememberBox.querySelector("span").textContent = tx("remember");
          refreshBar();
        }, 0);
      });
    },
    showResult: function (o) {
      o = o || {};
      document.body.classList.add("has-results");
      if (barLbl) { barLbl.textContent = o.label || ""; barVal.textContent = o.value || ""; }
      watchHero(o.hero || null);
      lastPayload = { state: o.state, summary: o.summary };
      persist();
      refreshBar();
    },
    clearResult: function () {
      document.body.classList.remove("has-results");
      lastPayload = null;
      refreshBar();
    },
    mountRemember: function (afterEl) {
      if (!afterEl || rememberBox) return;
      rememberBox = document.createElement("label");
      rememberBox.className = "remember";
      rememberBox.innerHTML = '<input type="checkbox"><span></span>';
      rememberBox.querySelector("span").textContent = tx("remember");
      var cb = rememberBox.querySelector("input");
      cb.checked = remembering();
      cb.addEventListener("change", function (e) {
        e.stopPropagation(); // que no dispare el recálculo en vivo de la app
        if (cb.checked) { store.set("astro:rem:" + app, "1"); persist(); }
        else {
          store.del("astro:rem:" + app); store.del("astro:state:" + app);
          try { var l = JSON.parse(store.get("astro:last") || "null"); if (l && l.app === app) store.del("astro:last"); } catch (err) { store.del("astro:last"); }
        }
      });
      cb.addEventListener("input", function (e) { e.stopPropagation(); });
      afterEl.parentNode.insertBefore(rememberBox, afterEl.nextSibling);
    },
    restoreState: function () { return remembering() ? store.get("astro:state:" + app) : null; },
    markMissing: function (els) {
      var first = null;
      (els || []).forEach(function (el) {
        if (!el) return; el.classList.add("is-missing"); if (!first) first = el;
        el.addEventListener("input", function h() { el.classList.remove("is-missing"); el.removeEventListener("input", h); });
      });
      if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 300); }
    }
  };
  window.AstroUX = AstroUX;
})();
