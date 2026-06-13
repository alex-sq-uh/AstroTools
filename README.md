# AstroTools

Suite que unifica tres calculadoras bajo una marca, un Umami y una navegación común:

| App | Ruta | Versión | Qué hace |
|-----|------|---------|----------|
| **AstroHome** | `/casa` | v1.3 | ¿A qué vivienda puedes aspirar? (+ "ya sé el piso") |
| **AstroPayroll** | `/nomina` | v2.16 | Nómina e IRPF en España |
| **AstroSavings** | `/ahorro` | v4.7 | Guía de inversión |

Identidad visual: navy `#1a2b5e` + dorado `#f5c84b`, tipografía Segoe UI.
**AstroTools** es el producto; **AstroCosas** queda solo como crédito en el footer.

## En producción
`https://alex-sq-uh.github.io/AstroTools/` (GitHub Pages, repo `AstroTools`).
Flujo de cambios: editar → verificar → `git commit` + `git push` a `main` → Pages despliega en ~1 min.
Todas las rutas internas son **relativas** (funcionan en la subcarpeta de Pages, en local y abriendo el archivo).

## Cómo arrancar en local
```powershell
cd C:\Users\alexe\Documents\AstroTools
.\serve.ps1   # http://localhost:3000/
```

## Estructura
- `index.html` — hub/landing (trilingüe ES/CA/EN).
- `casa/`, `nomina/`, `ahorro/` — las apps (1 `index.html` c/u).
- `ahorro/i18n.js` — motor de traducción específico de AstroSavings.
- `shared/`
  - `brand.js` — **única fuente del nombre** y lista de apps. Renombrar la suite = 1 línea aquí.
  - `nav.js` — `<astro-nav>`: barra superior cambiador de apps (Shadow DOM, rutas relativas).
  - `feedback.js` — `<astro-feedback>`: widget de feedback compartido (estrellas con 1 clic + pop-up).
  - `analytics.js` — Umami con `data-tag` por app.
  - `tokens.css` / `base.css` — design system de la suite (hub).
  - `savings-skin.css` — reskin de AstroSavings al navy/gold (reversible).

Originales pre-suite archivados en `..\_archivo_originales\`.

## Idiomas
- **Home, Payroll y hub**: ES/CA/EN con `data-i18n` + diccionario y selector.
- **Savings**: ES/CA/EN vía `ahorro/i18n.js` (traduce por elemento; el ES es la base intacta).
  Incluye los **textos dinámicos** (proyección, Jubilación, Independencia, KPIs/nota de Piso, tablas
  de fondos) y los **tooltips**, traducidos vía `savingsT()` en las funciones de render. Al cambiar
  de idioma se re-renderiza la pantalla dinámica activa.

## Umami
Website único **AstroTools** (`662e04eb-…`) vía `shared/analytics.js`. Cada app añade `data-tag`
(AstroHome / AstroPayroll / AstroSavings / Hub) para filtrar páginas y eventos por app.
En local no registra (dominio configurado: `alex-sq-uh.github.io`).

## Feedback
`<astro-feedback>` al final de cada app. Estrellas con 1 clic (envío directo) + botón que abre un
pop-up para comentario. Envía a Formsubmit (mismo buzón, asunto por app). Eventos Umami
`feedback_open` / `feedback_sent`.

## Sinergias entre apps
Home↔Payroll (sueldo neto), Home→Savings y Payroll→Home/Savings, Savings→Home/Payroll.

## Redirecciones heredadas
Los repos antiguos `AstroHome`, `AstroPayroll`, `astrosavings` redirigen a las rutas nuevas
dentro de AstroTools (para los enlaces que ya tenían los usuarios).

## Pendiente / ideas
1. **Login + datos personales** (fase futura; proveedor recomendado: Supabase).
2. Apps candidatas: AstroAlquiler, AstroAutónomo, AstroRenta, AstroJubilación…
