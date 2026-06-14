/* ============================================================
   AstroTools · configuración de marca de la suite
   ------------------------------------------------------------
   ÚNICA fuente del nombre. Para renombrar toda la suite,
   cambia `brand` aquí (y nada más).
   Las rutas son RELATIVAS (sin "/" inicial) para que funcionen
   tanto en local como en GitHub Pages (alex-sq-uh.github.io/AstroTools/).
   ============================================================ */
window.ASTROTOOLS = {
  brand: "AstroTools",
  apps: [
    { id: "casa",         name: "AstroHome",    href: "casa/",         tagline: "¿A qué casa puedes aspirar?" },
    { id: "nomina",       name: "AstroPayroll", href: "nomina/",       tagline: "Tu nómina e IRPF, mes a mes" },
    { id: "ahorro",       name: "AstroSavings", href: "ahorro/",       tagline: "Haz que tu dinero trabaje por ti" },
    { id: "rentabilidad", name: "AstroReturn",  href: "rentabilidad/", tagline: "Calcula rentabilidades" }
  ]
};
