/* ============================================================
   <astro-feedback>  ·  widget de feedback compartido de la suite
   ------------------------------------------------------------
   - Bloque al final de la página: "¿Te ha sido útil?" + 5 estrellas
     que se puntúan con UN clic (envío directo).
   - Botón que abre un pop-up para dejar un comentario detallado.
   - Self-contained (Shadow DOM). Se autolocaliza (ES/CA/EN según el
     idioma de la página) y detecta la app por la URL.
   - Envía por Formsubmit (AJAX). El endpoint se puede sobreescribir
     con el atributo endpoint="...". Dispara eventos de Umami.

   Uso:  <astro-feedback></astro-feedback>
   ============================================================ */
(function () {
  var ENDPOINT_DEFAULT = "https://formsubmit.co/ajax/31181a9b83dda38926ace2532e4a9aba";

  var STR = {
    es: { q:"¿Te ha sido útil?", comment:"💬 Dejar un comentario",
      thanks:"¡Gracias por tu valoración!", more:"¿Algo que mejorar? Cuéntanos",
      mtitle:"Cuéntanos más", msub:"Tu opinión nos ayuda a mejorar.",
      ratelbl:"Tu puntuación", clbl:"Comentarios (opcional)",
      ph:"¿Qué te ha gustado? ¿Qué mejorarías?", send:"Enviar feedback", sending:"Enviando…",
      stitle:"¡Gracias!", ssub:"Tu feedback nos ayuda muchísimo.", close:"Cerrar",
      evalid:"Pon al menos una puntuación o un comentario.",
      esend:"No se pudo enviar. Inténtalo de nuevo en un momento." },
    ca: { q:"T'ha estat útil?", comment:"💬 Deixa un comentari",
      thanks:"Gràcies per la teva valoració!", more:"Alguna cosa a millorar? Explica'ns",
      mtitle:"Explica'ns més", msub:"La teva opinió ens ajuda a millorar.",
      ratelbl:"La teva puntuació", clbl:"Comentaris (opcional)",
      ph:"Què t'ha agradat? Què milloraries?", send:"Enviar feedback", sending:"Enviant…",
      stitle:"Gràcies!", ssub:"El teu feedback ens ajuda moltíssim.", close:"Tancar",
      evalid:"Posa almenys una puntuació o un comentari.",
      esend:"No s'ha pogut enviar. Torna-ho a provar d'aquí un moment." },
    en: { q:"Was this helpful?", comment:"💬 Leave a comment",
      thanks:"Thanks for your rating!", more:"Anything to improve? Tell us",
      mtitle:"Tell us more", msub:"Your feedback helps us improve.",
      ratelbl:"Your rating", clbl:"Comments (optional)",
      ph:"What did you like? What would you improve?", send:"Send feedback", sending:"Sending…",
      stitle:"Thank you!", ssub:"Your feedback helps us a lot.", close:"Close",
      evalid:"Add at least a rating or a comment.",
      esend:"Couldn't send. Please try again in a moment." }
  };

  function appName() {
    var p = location.pathname;
    return /\/casa\//.test(p) ? "AstroHome"
         : /\/nomina\//.test(p) ? "AstroPayroll"
         : /\/ahorro\//.test(p) ? "AstroSavings"
         : /\/rentabilidad\//.test(p) ? "AstroReturn" : "AstroTools";
  }
  function lang() {
    var l = (document.documentElement.lang || "es").slice(0, 2).toLowerCase();
    return STR[l] ? l : "es";
  }
  function track(name, data) { try { if (window.umami) window.umami.track(name, data); } catch (e) {} }

  var CSS =
    ":host{display:block;font-family:'Segoe UI',system-ui,sans-serif;color:#1a2733}" +
    ".wrap{max-width:680px;margin:2rem auto 0;padding:1.1rem 1.2rem;background:#fff;border:1px solid #dde3ea;" +
      "border-radius:14px;box-shadow:0 2px 12px rgba(26,60,94,.08);text-align:center}" +
    ".q{font-weight:700;color:#1a2b5e;font-size:.98rem;margin:0 0 .6rem}" +
    ".stars{display:flex;gap:.25rem;justify-content:center;margin-bottom:.7rem}" +
    ".star{background:none;border:none;font-size:1.9rem;line-height:1;color:#e0e6ee;cursor:pointer;" +
      "padding:2px 4px;transition:color .12s,transform .12s}" +
    ".star:hover,.star.on{color:#f5b800}.star:hover{transform:scale(1.12)}" +
    ".comment{background:none;border:1.5px solid #cfd9e6;color:#4a6dd1;font:inherit;font-weight:600;" +
      "font-size:.85rem;padding:.45rem .9rem;border-radius:9px;cursor:pointer;transition:all .15s}" +
    ".comment:hover{border-color:#4a6dd1;background:#eef4fc}" +
    ".thanks{font-weight:700;color:#1a9e5c;font-size:.95rem}" +
    ".thanks .more{display:block;margin-top:.5rem;background:none;border:none;color:#4a6dd1;font:inherit;" +
      "font-weight:600;font-size:.83rem;cursor:pointer;text-decoration:underline}" +
    /* modal */
    ".ov{display:none;position:fixed;inset:0;background:rgba(15,29,68,.55);z-index:10000;align-items:center;" +
      "justify-content:center;padding:1rem}" +
    ".ov.show{display:flex}" +
    ".modal{background:#fff;border-radius:14px;padding:1.5rem 1.3rem 1.3rem;max-width:420px;width:100%;" +
      "max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.28);position:relative}" +
    ".x{position:absolute;top:.4rem;right:.6rem;background:none;border:none;font-size:1.7rem;color:#8096b0;" +
      "cursor:pointer;line-height:1;padding:2px 8px;border-radius:50%}" +
    ".x:hover{background:#f4f6fb;color:#1a2733}" +
    ".title{font-size:1.15rem;font-weight:800;color:#1a2b5e;margin:0 0 .25rem;text-align:center}" +
    ".sub{font-size:.82rem;color:#5a6a7a;margin:0 0 1rem;text-align:center}" +
    ".lbl{font-size:.68rem;font-weight:700;color:#5a6a7a;text-transform:uppercase;letter-spacing:.04em;margin-bottom:.35rem}" +
    ".modal .stars{justify-content:flex-start}" +
    "textarea{width:100%;border:1.5px solid #dde3ea;border-radius:9px;padding:9px 11px;font-family:inherit;" +
      "font-size:.88rem;color:#1a2733;resize:vertical;min-height:84px;box-sizing:border-box}" +
    "textarea:focus{outline:none;border-color:#4a6dd1}" +
    ".err{font-size:.75rem;color:#e74c3c;margin-top:.4rem;min-height:1rem}" +
    ".send{margin-top:.7rem;width:100%;background:#1a2b5e;color:#fff;border:none;border-radius:10px;" +
      "padding:.7rem 1rem;font:inherit;font-weight:700;cursor:pointer}" +
    ".send:hover{background:#0f1d44}.send:disabled{opacity:.6;cursor:default}" +
    ".success{text-align:center;padding:.6rem 0}.success .emo{font-size:2.2rem}";

  function stars(cls) {
    var h = '<div class="stars ' + cls + '">';
    for (var i = 1; i <= 5; i++) h += '<button type="button" class="star" data-v="' + i + '" aria-label="' + i + '">★</button>';
    return h + '</div>';
  }

  class AstroFeedback extends HTMLElement {
    connectedCallback() {
      this.endpoint = this.getAttribute("endpoint") || ENDPOINT_DEFAULT;
      this._root = this.attachShadow({ mode: "open" });
      this.render();
      var self = this;
      // Re-localiza si la app cambia el idioma (document.documentElement.lang)
      this._obs = new MutationObserver(function () { self.render(); });
      this._obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
    disconnectedCallback() { if (this._obs) this._obs.disconnect(); }
    render() {
      var self = this;
      var T = STR[lang()];
      this.rating = 0;
      var root = this._root;
      root.innerHTML =
        "<style>" + CSS + "</style>" +
        '<section class="wrap">' +
          '<div id="inline">' +
            '<p class="q">' + T.q + '</p>' +
            stars("inlineStars") +
            '<button class="comment" id="open">' + T.comment + '</button>' +
          '</div>' +
          '<div class="thanks" id="thanks" style="display:none">' + T.thanks +
            '<button class="more" id="openMore">' + T.more + ' →</button>' +
          '</div>' +
        '</section>' +
        '<div class="ov" id="ov">' +
          '<div class="modal" role="dialog" aria-modal="true">' +
            '<button class="x" id="close" aria-label="' + T.close + '">×</button>' +
            '<div id="formWrap">' +
              '<h2 class="title">' + T.mtitle + '</h2><p class="sub">' + T.msub + '</p>' +
              '<div class="lbl">' + T.ratelbl + '</div>' + stars("modalStars") +
              '<div class="lbl" style="margin-top:.7rem">' + T.clbl + '</div>' +
              '<textarea id="msg" maxlength="2000" placeholder="' + T.ph + '"></textarea>' +
              '<div class="err" id="err"></div>' +
              '<button class="send" id="send">' + T.send + '</button>' +
            '</div>' +
            '<div class="success" id="success" style="display:none">' +
              '<div class="emo">🎉</div><h2 class="title">' + T.stitle + '</h2>' +
              '<p class="sub">' + T.ssub + '</p>' +
              '<button class="send" id="closeOk">' + T.close + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      var $ = function (s) { return root.querySelector(s); };
      var $$ = function (s) { return root.querySelectorAll(s); };

      function paint(scope, n) {
        $$(scope + " .star").forEach(function (b) { b.classList.toggle("on", +b.dataset.v <= n); });
      }
      function openModal() {
        paint(".modalStars", self.rating);
        $("#err").textContent = "";
        $("#formWrap").style.display = "";
        $("#success").style.display = "none";
        $("#send").disabled = false; $("#send").textContent = T.send;
        $("#ov").classList.add("show");
        track("feedback_open", { app: appName() });
      }
      function closeModal() { $("#ov").classList.remove("show"); }

      async function send(rating, msg) {
        var res = await fetch(self.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: "Feedback " + appName() + " (" + (rating || "—") + "/5)",
            _captcha: "false",
            app: appName(),
            rating: rating || "sin puntuación",
            mensaje: msg || "(sin comentario)",
            idioma: lang(),
            url: location.href,
            userAgent: navigator.userAgent
          })
        });
        if (!res.ok) throw new Error("bad");
      }

      // Estrellas inline: puntuar con un clic → envío directo
      $$(".inlineStars .star").forEach(function (b) {
        b.addEventListener("click", async function () {
          var v = +b.dataset.v;
          self.rating = v; paint(".inlineStars", v);
          try {
            await send(v, "");
            track("feedback_sent", { app: appName(), rating: v, via: "inline" });
            $("#inline").style.display = "none";
            $("#thanks").style.display = "";
          } catch (e) {
            self.openErr();
          }
        });
      });

      // Estrellas del modal: solo seleccionan (no envían)
      $$(".modalStars .star").forEach(function (b) {
        b.addEventListener("click", function () { self.rating = +b.dataset.v; paint(".modalStars", self.rating); });
      });

      $("#open").addEventListener("click", openModal);
      $("#openMore").addEventListener("click", openModal);
      $("#close").addEventListener("click", closeModal);
      $("#closeOk").addEventListener("click", closeModal);
      $("#ov").addEventListener("click", function (e) { if (e.target === $("#ov")) closeModal(); });

      $("#send").addEventListener("click", async function () {
        var msg = $("#msg").value.trim();
        if (self.rating === 0 && !msg) { $("#err").textContent = T.evalid; return; }
        $("#err").textContent = "";
        var btn = $("#send"); btn.disabled = true; btn.textContent = T.sending;
        try {
          await send(self.rating, msg);
          track("feedback_sent", { app: appName(), rating: self.rating, via: "modal" });
          $("#formWrap").style.display = "none"; $("#success").style.display = "";
        } catch (e) {
          $("#err").textContent = T.esend; btn.disabled = false; btn.textContent = T.send;
        }
      });

      this.openErr = function () { openModal(); $("#err").textContent = T.esend; };
    }
  }

  if (!customElements.get("astro-feedback")) customElements.define("astro-feedback", AstroFeedback);
})();
