/* ============================================================
   Umami unificado para toda la suite AstroTools.
   ------------------------------------------------------------
   ⚠️ PENDIENTE (usuario): crea UN único website en Umami para el
   dominio de la suite y pega su Website ID abajo. Hasta entonces
   no se carga ningún script (no se rompe nada, solo no hay datos).

   Umami ya separa las apps por URL (/casa, /nomina, /ahorro),
   así que con UN solo ID ves las tres por separado en el panel.
   ============================================================ */
(function () {
  var WEBSITE_ID = "662e04eb-f37f-4e2f-93e4-f6a597da0b3a"; // website "AstroTools" en Umami Cloud

  if (WEBSITE_ID.indexOf("PEGA-AQUI") === 0) return; // sin ID real → no carga

  // Etiqueta por app, para distinguir en Umami quién usa cada una.
  // Umami separa por URL, pero el data-tag permite filtrar páginas Y eventos por app.
  var p = location.pathname;
  var tag = /\/casa\//.test(p)         ? "AstroHome"
          : /\/nomina\//.test(p)       ? "AstroPayroll"
          : /\/ahorro\//.test(p)       ? "AstroSavings"
          : /\/rentabilidad\//.test(p) ? "AstroReturn"
          : "Hub";

  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://cloud.umami.is/script.js";
  s.setAttribute("data-website-id", WEBSITE_ID);
  s.setAttribute("data-tag", tag);
  document.head.appendChild(s);
})();
