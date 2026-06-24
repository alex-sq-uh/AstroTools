# AstroTools — Documento de traspaso (handover)

> **Para el chat nuevo: lee esto ANTES de tocar nada.**
> Este documento te permite continuar el trabajo sin romper la coherencia visual ni
> las convenciones de la suite. Si vas a desarrollar algo nuevo, **el look & feel debe
> ser idéntico al actual** (ver §4). Después de leer esto, ojea también
> `shared/brand.js`, `shared/tokens.css`, `shared/header.js` y `shared/feedback.js`.

Reglas de oro (no negociables salvo que el dueño diga lo contrario):

1. **No hagas `git push` sin confirmación explícita del dueño.**
2. **Sin build tools y sin dependencias nuevas.** Es un sitio estático de HTML + CSS +
   JS vanilla. La única librería externa es Chart.js por CDN (solo en `ahorro` y
   `rentabilidad`).
3. **No toques la lógica de cálculo** de una app salvo que se pida; son el núcleo.
4. **Mantén el design system** (§4). Cualquier pantalla nueva usa los mismos tokens,
   la misma cabecera/feedback, el mismo planeta y el mismo tono de copy.
5. **Trilingüe** ES/CA/EN, pero **solo el español es indexable** (ver §7).
6. **Mantén vivos este `HANDOVER.md` y `BACKLOG.md`**: si haces algo que el yo-del-futuro
   necesitaría saber, actualízalos antes de cerrar la sesión (ver §12).

---

## 1. Qué es AstroTools

Suite de **calculadoras financieras gratuitas para España**, en lenguaje llano ("en
cristiano", sin tecnicismos). Un **hub** (página de inicio) + **5 apps**, cada una en su
carpeta. Todo es cliente: los cálculos ocurren en el navegador, no se guarda nada, sin
cookies (analítica anónima con Umami).

| Carpeta | Nombre de marca | Qué hace |
|---|---|---|
| `casa/` | **AstroHome** | A qué vivienda puedes aspirar según sueldo y ahorros (hipoteca, entrada, impuestos, cuota). |
| `nomina/` | **AstroPayroll** | Sueldo neto e IRPF mes a mes (bonus, plan de pensiones, tickets, retribución flexible). |
| `ahorro/` | **AstroSavings** | Cuánto crece tu dinero en fondos indexados (interés compuesto, riesgo). Guía paso a paso. |
| `rentabilidad/` | **AstroReturn** | Rentabilidad anual real (TIR/XIRR) de una inversión vs inflación y bolsa. |
| `forecast/` | **AstroForecast** | Planificación financiera a largo plazo: proyecta tu patrimonio año a año según tus flujos de caja y cuánto podrías retirar. |
| `/` (raíz) | **AstroTools** (hub) | Portada con las tarjetas de las 5 apps. |

Convención de nombres: la marca de cada app es **Astro + Palabra** (AstroHome,
AstroPayroll…). La parte "Astro" va en blanco y la palabra final en dorado (`--accent`).

---

## 2. Arquitectura y stack

- **Estático**: cada app es un único `index.html` autocontenido (su CSS en un `<style>`
  y su JS en `<script>` al final). `ahorro` además usa `i18n.js` y `savings-skin.css`.
- **Sin framework, sin bundler, sin npm.** Se sirve tal cual.
- **Componentes compartidos** vía Web Components con Shadow DOM (no contaminan el CSS de
  la app): `<astro-header>` y `<astro-feedback>` (ver §5).
- **Hosting**: GitHub Pages (ver §8).

## 3. Estructura del repo

```
AstroTools/
├── index.html              ← hub (portada)
├── casa/index.html         ← AstroHome
├── nomina/index.html       ← AstroPayroll
├── ahorro/index.html       ← AstroSavings (+ i18n.js)
├── rentabilidad/index.html ← AstroReturn
├── forecast/index.html     ← AstroForecast (Chart.js, skin navy)
├── og.jpg                  ← imagen de previsualización del hub (1200×630)
├── casa/og.jpg  nomina/og.jpg  ahorro/og.jpg  rentabilidad/og.jpg  forecast/og.jpg
├── sitemap.xml  robots.txt ← SEO (raíz del repo)
├── shared/
│   ├── brand.js            ← ÚNICA fuente del nombre y lista de apps (window.ASTROTOOLS)
│   ├── tokens.css          ← design tokens (colores, fuente, sombras…)
│   ├── base.css            ← base común del hub (.wrap, .card, .btn)
│   ├── header.js           ← <astro-header> (cabecera única de la suite)
│   ├── feedback.js         ← <astro-feedback> (valoración + comentario + compartir)
│   ├── analytics.js        ← Umami (analítica anónima, sin cookies)
│   └── savings-skin.css    ← piel azul específica de AstroSavings
├── BACKLOG.md              ← ideas futuras (no es compromiso)
└── HANDOVER.md             ← este documento
```

---

## 4. Look & Feel / Design system  ⚠️ LA PARTE IMPORTANTE

### 4.1 Tokens (identidad visual: navy + dorado)
Definidos en `shared/tokens.css`. Cada app los repite en su `:root` (cópialos, no
inventes colores):

```
--primary:#1a2b5e   --primary-deep:#0f1d44   --secondary:#4a6dd1   --accent:#f5c84b (dorado)
--bg:#f4f6fb        --surface:#ffffff        --surface2:#f8fafd     --border:#dde3ea
--text:#1a2733      --text-muted:#5a6a7a
--danger:#e74c3c    --success:#27ae60        --warning:#e67e22
--radius:10px       --radius-lg:14px
--shadow:0 2px 12px rgba(26,60,94,.08)        --shadow-lg:0 4px 24px rgba(26,60,94,.13)
--topbar-gradient:linear-gradient(120deg,#0f1d44 0%,#1a2b5e 55%,#2a3f80 100%)
--font:'Segoe UI',system-ui,sans-serif
```

- **Fuente**: `Segoe UI` / system-ui en todo, **excepto AstroSavings** que usa
  `'Plus Jakarta Sans'`.
- **Cabecera (header)**: fondo navy con el gradiente `--topbar-gradient`. Texto blanco,
  acentos en dorado.
- **Acento dorado `#f5c84b`**: es la firma de la marca (la palabra final del nombre, el
  punto de "AstroTools.", el planeta, el halo al hover de las tarjetas).

### 4.2 Skins
- **Navy por defecto** (hub, casa, nomina, rentabilidad): fondo `--bg` claro, navy +
  dorado.
- **AstroSavings ("sky" skin)**: paleta azul cielo propia (`--sky:#4a9fd4`, etc.) +
  `savings-skin.css` + Plus Jakarta Sans. Es una variación deliberada, más cálida, para
  una experiencia tipo "guía paso a paso". Si tocas ahorro, respeta su piel; si creas
  una app nueva, usa la navy por defecto salvo que se decida lo contrario.

### 4.3 El planeta (logo del sistema) — spec exacta
Es el elemento visual central y debe dibujarse SIEMPRE igual. SVG `viewBox="0 0 64 64"`:

- **Órbita** (linearGradient `#7aa1ff` → `#f5c84b`): `ellipse cx=32 cy=30 rx=26 ry=9`
  rotada `rotate(-22 32 30)`, `stroke-width=2.4`.
- **Planeta** (radialGradient cx .35 cy .3 r .85: `#f8d97a` → `#f5c84b` 55% → `#c79420`):
  `circle cx=32 cy=30 r=14`.
- **Truco del aro (no lo rompas)**: el aro pasa por delante y por detrás del planeta. Se
  dibuja en 3 capas con dos `clipPath`:
  1. arco trasero = elipse con `clip-path` rect `(0,0,64,28)` y `opacity=.85`
  2. planeta encima
  3. arco delantero = misma elipse con `clip-path` rect `(0,28,64,36)`
- **4 estrellitas** blancas: `(11,14) r1.4`, `(54,18) r1`, `(52,48) r1.2`, `(9,50) r1`.
- **Símbolo de cada app** en navy `#1a2b5e`, entre el planeta y el arco delantero:
  - casa → casita (`path` tejado+cuerpo), nomina → `€` (text), ahorro → flecha de
    tendencia ascendente, rentabilidad → barras + línea, forecast → curva de proyección
    ascendente + estrella de 4 puntas en la punta, hub/header → **sin símbolo**
    (planeta liso).

Snippet canónico en `shared/header.js` (ids `ahHdr…`) y en el hub `index.html` (objeto
`ICONS`, ids por app: `cOrbit/cPlanet/cBack/cFront`, etc.). Reutiliza esos snippets; no
redibujes a ojo.

### 4.4 Tarjetas y botones (base.css)
- **Tarjeta**: `--surface`, borde `--border`, `--radius-lg`, `--shadow`; al hover sube
  2–6px, borde dorado/secundario, halo dorado radial. Ver `.app-card` en el hub.
- **Botón primario**: fondo `--primary`, texto blanco, `--radius`; hover `--primary-deep`.
  Acento: `.btn-accent` dorado con texto navy.

### 4.5 Tono de copy (igual de importante que el visual)
- **Español de "tú"**, cercano, **sin tecnicismos**; cuando hace falta un término
  técnico (IRPF, TIR), se explica al lado "en cristiano".
- Frases cortas, ejemplos con números reales, nada de jerga financiera sin traducir.
- Disclaimers honestos: "herramienta orientativa, no asesoramiento".
- Emojis con mesura como iconos de sección (🔍 📈 🏦…), no decorativos en exceso.

### 4.6 Imágenes Open Graph (`og.jpg`, 1200×630)
Cada página tiene su `og.jpg` con el MISMO estilo (para que al compartir el enlace en
WhatsApp/redes se vea coherente):
- Fondo navy en gradiente 45°: `#0f1d44` → `#1a2b5e` (0.6) → `#2a3f80`; halo radial azul
  arriba-centro; estrellitas blancas.
- "AstroTools." arriba a la izquierda (blanco + punto dorado), Segoe UI bold.
- Planeta centrado (con el símbolo de la app) igual que el logo.
- Nombre **Astro**(blanco)+**Sufijo**(dorado) grande y centrado; debajo el tagline
  (~44px, `#e8ecf7`); abajo una línea de features separada por `·` (~28px, `#9fb0d0`).

Cómo regenerarlas sin dependencias (Windows): se dibujan con **GDI+ desde PowerShell**
(`System.Drawing`), 1200×630, JPEG calidad 82 (~40–50 KB). El generador no vive en el
repo para no publicar archivos sueltos; pídeselo al dueño o recréalo replicando el estilo
de arriba (la `rentabilidad/og.jpg` es la referencia "maestra"). Mantén tipografías,
posiciones y colores idénticos.

---

## 5. Componentes compartidos (`shared/`)

- **`brand.js`** → `window.ASTROTOOLS = { brand, apps:[{id,name,href,tagline}] }`. **Única
  fuente del nombre de la suite y de la lista de apps.** Para renombrar TODO, se cambia
  `brand` aquí (ver §11 rename pendiente). Rutas relativas (sin `/` inicial) para que
  funcione en local y en GitHub Pages bajo subcarpeta.
- **`header.js`** → `<astro-header app="casa|nomina|…" version="vX.Y">`. Cabecera única
  en filas: (1) ☰ + "AstroTools.", (2) logo + NombreApp + versión + slot `action`,
  (3) pestañas opcionales (slot `tabs`). El menú ☰ tiene selector de app y de idioma.
  Emite `CustomEvent("astro-lang", {detail:{lang}})` al cambiar idioma; con el atributo
  `brand-action` emite `astro-brand` al pulsar el logo. El hub la usa con atributo `home`
  (cabecera slim de 1 fila).
- **`feedback.js`** → `<astro-feedback>`. Bloque "¿Te ha sido útil?" + 5 estrellas (envío
  con 1 clic), botón **💬 Dejar un comentario** (modal) y botón **📤 Compartir**
  (Web Share API en móvil → WhatsApp/etc.; en escritorio copia el enlace al portapapeles).
  Se autolocaliza ES/CA/EN y detecta la app por la URL. Envía por Formsubmit (AJAX).
- **`analytics.js`** → Umami, analítica anónima sin cookies.
- **`tokens.css` / `base.css` / `savings-skin.css`** → ver §4.

**Cómo cablear una página** (orden en el `<head>`/final de body):
```html
<script src="../shared/brand.js"></script>
<script src="../shared/header.js" defer></script>
<script src="../shared/analytics.js" defer></script>
<script src="../shared/feedback.js" defer></script>
...
<astro-header app="casa" version="v1.4"> … slots … </astro-header>
...
<astro-feedback></astro-feedback>
```
(El hub usa `../` → `` y `<astro-header home>`.)

---

## 6. i18n (ES / CA / EN)
- Cada app tiene un objeto `T = { es:{…}, ca:{…}, en:{…} }` y marca el texto con
  `data-i18n="clave"`. `setLang(l)` (o `setLangSavings` en ahorro) recorre el DOM y
  sustituye. El hub conecta `astro-lang` → `setLang`.
- Idioma por defecto: `document.documentElement.lang="es"`.
- Al añadir copy nuevo, añade SIEMPRE las 3 lenguas.

---

## 7. SEO — checklist obligatorio para CADA página
(Implementado en commit `5317b01`. Replica este patrón en apps nuevas.)
- `<title>` con keyword al inicio, **≤60 caracteres**.
- `<meta name="description">` única, **~150–160 caracteres**.
- **Favicon** SVG inline (planeta con el símbolo de la app).
- **Open Graph + Twitter Card** completos. ⚠️ `canonical`, `og:url` y `og:image` deben
  ser **URLs ABSOLUTAS** (`https://alex-sq-uh.github.io/AstroTools/<app>/`); los enlaces
  internos siguen siendo **relativos**.
- `og:image` → `<app>/og.jpg` (1200×630, ver §4.6).
- **JSON-LD**: `WebApplication` (FinanceApplication, precio 0 €) + `FAQPage` con el
  **texto real visible** de la sección "¿Cómo funciona?". El hub usa `WebSite` + `hasPart`.
- Añadir la URL nueva a `sitemap.xml` (raíz).
- **Sin hreflang, sin multi-idioma indexable**: solo español se indexa.
- **Gotcha**: como el sitio vive en subcarpeta, Google NO lee `robots.txt`; hay que
  enviar el `sitemap.xml` a mano por **Google Search Console** (propiedad de prefijo de
  URL `https://alex-sq-uh.github.io/AstroTools/`).

---

## 8. Despliegue
- **Repo**: `https://github.com/alex-sq-uh/AstroTools.git` · rama **`main`**.
- **Web (producción)**: `https://alex-sq-uh.github.io/AstroTools/` (GitHub Pages,
  subcarpeta `/AstroTools/`). Push a `main` → redespliegue automático en 1–2 min.
- **Recordatorio**: tras añadir/cambiar páginas, reenviar `sitemap.xml` por Search
  Console (ver §7).

## 9. Previsualizar y verificar en local
- Servidor estático en el puerto 3000 (p. ej. `python -m http.server 3000` desde la raíz,
  o las herramientas de preview del entorno). Abrir `http://localhost:3000/<app>/`.
- Verificar: consola sin errores, calculadoras intactas, JSON-LD parsea, `og.jpg` carga,
  `canonical`/`og:url` correctos. Las 5 páginas deben quedar sin errores de consola.

## 10. Cómo añadir una app nueva (manteniendo el look & feel)
1. Crear `nuevaapp/index.html` autocontenido; copiar tokens (§4.1) y la estructura de una
   app existente similar (casa/nomina = formulario; ahorro = guía por pasos).
2. Añadir la app a `shared/brand.js` (`{id,name,href,tagline}`).
3. Añadir su icono-planeta al objeto `ICONS` del hub `index.html` y al `ICONS`/regex de
   `shared/header.js` (con su símbolo en navy).
4. Cablear `<astro-header app="…">` y `<astro-feedback>` (§5).
5. Copy trilingüe (§6) y tono "en cristiano" (§4.5).
6. SEO completo (§7) + generar su `og.jpg` (§4.6) + añadirla a `sitemap.xml`.
7. Enlazarla desde/hacia las apps relacionadas (como hacen casa↔nomina↔ahorro).
8. Verificar en local (§9). No hacer push sin confirmación.

---

## 11. Estado actual (a 2026-06-22)

**En producción (pushed, commit `5317b01`):**
- Las 4 apps + hub con SEO técnico completo (§7), 5 `og.jpg`, `sitemap.xml`, `robots.txt`.
- Botón **📤 Compartir** en el feedback de todas las apps.
- Logo planeta con el aro corregido (delante/detrás) y centrado en el ecuador (cy=30).
- Hub sin footer ni planeta flotante del hero.

**Pusheado y en producción (último commit relevante `b3d4121`):**
- **App AstroForecast** (`forecast/index.html`) — planificador financiero a largo plazo.
  Entradas: **edad actual** (el plan llega SIEMPRE hasta los 100, no hay campo de edad
  final), ahorros iniciales y N flujos de caja (entra/sale, €/mes↔€/año, entre edades).
  Resultados (en este orden): **3 hitos** (patrimonio dentro de 10/20/30 años; vacíos y
  atenuados si la edad supera 100) → **slider de rentabilidad 0–12%** (def. 6%, con
  descripción por nivel: cuenta corriente, depósito, fondos indexados ⭐, alto riesgo…)
  → **gráfico de patrimonio** (una sola línea según el slider) → **tabla "Detalle por
  periodos"** → supuestos → **gráfico de flujos** (al final, antes del feedback). La tabla
  tiene 7 columnas (edad/rango, saldo inicio, entradas, salidas, rent. inversión, saldo
  final, renta disponible = patrimonio × tasa retirada def. 3%). Los periodos son
  **contiguos y sin solapar** (`buildPeriods()`: en modo 5 años → 38–40, 41–45, 46–50…
  96–100; en modo todos los años → un año por fila). Sin hero/veredicto/KPIs (retirados).
  Pestaña "Conceptos": 8 acordeones (incluye "Renta disponible" y "tasa de retirada").
  Euros nominales, trilingüe ES/CA/EN, SEO completo + `forecast/og.jpg`. Integrada en
  `brand.js`, `header.js`, `feedback.js`, `sitemap.xml` y hub.
  **Pendiente manual:** reenviar `sitemap.xml` en Search Console.
- **Hub reorganizado en 2 secciones** (`index.html`): **"Calculadoras"** (AstroHome,
  AstroPayroll, AstroReturn, AstroForecast) y **"Guías paso a paso"** (AstroSavings, la
  única experiencia guiada/formativa). Cada sección lleva título + subtítulo trilingüe
  (objeto `T[...].sec`). El grid pasó a `repeat(auto-fit,212px)` centrado (se adapta a
  cualquier nº de tarjetas; la tarjeta sola de Guías queda centrada, no huérfana). La
  agrupación vive en el array `GROUPS` del hub; **cualquier app de `brand.js` sin grupo
  asignado cae automáticamente en "Calculadoras"** (red de seguridad). Al añadir una app
  nueva, si es formativa, mete su `id` en el grupo `learn`.
- **Footer eliminado** de `casa`, `nomina` y `ahorro` (la barra inferior "Una app de
  AstroCosas …": markup + CSS `.site-footer`/`.foot` + claves i18n `footer_astrocosas`).
  Verificado sin errores. Falta que el dueño confirme el push.
- **AstroPayroll · fix coherencia retribución flexible**: el hero "Ahorro IRPF de
  retribución flexible" no cuadraba con la línea "Ahorro fiscal por retribución flexible"
  de la valoración del paquete. El hero usaba `flexIRPFSavingTotal` (solo IRPF, **olvidaba
  el seguro médico** y contaba modo on-top), mientras la línea usa `flexSavingTotal`
  (IRPF + SS, solo modalidad worker/flex, los 4 conceptos). Se unificó: el hero ahora usa
  `flexSavingTotal` y la misma etiqueta ("Ahorro fiscal por retribución flexible",
  ES/CA/EN); se eliminó la variable buggy `flexIRPFSaving*`. Nuance pendiente de decisión
  del dueño: en modo **on-top** (aportado por la empresa) la tabla "Resumen de retribución
  flexible" aún muestra su ventaja IRPF, que no entra en `flexSavingTotal`.

**Tareas abiertas:**
- **Lighthouse completo**: pendiente. El API anónimo de PageSpeed Insights bloquea por
  cuota (429). Vías para hacerlo: (a) instalar Node y `npx lighthouse` contra localhost,
  o (b) una API key de Google Cloud (PageSpeed Insights API). Sin urgencia: las páginas
  son HTML sencillo; el SEO ya está validado a mano; lo que más podría mejorar es
  accesibilidad/buenas prácticas (contraste, tamaño de toque, alt).
- **Rename de la suite (aplazado)**: "AstroTools" colisiona con la marca real "Astro
  Pneumatic Tools". Si se retoma, se cambia en `shared/brand.js` (`brand`) — fuente única.
  Ver memoria `astrotools-rename-pending.md`.
- **Marca "AstroCosas" en retirada**: se quitó de los footers. Queda un resto en el texto
  que `AstroPayroll` añade al copiar/exportar resultados (`… una app de AstroCosas`); el
  dueño decidirá si se quita también.

**Ideas futuras**: ver [`BACKLOG.md`](BACKLOG.md) (p. ej. AstroAutónomos, ayudas a la
vivienda en AstroHome).

---

## 12. Mantén vivos estos documentos (importante)

> Un handover que nadie actualiza queda obsoleto enseguida (de hecho la memoria llegó a
> decir "SEO pendiente" cuando ya estaba hecho). Cuesta un minuto y evita perder contexto.

**Actualiza `HANDOVER.md` cuando:**
- Cambie el **look & feel**: nuevo token/color/fuente, componente o patrón visual, o el
  estilo del planeta/OG → §4.
- Aparezca una **convención o regla** nueva (SEO, i18n, despliegue, estructura) → §5–§9.
- **Añadas o quites una app**, o cambie su alcance → §1, §3, §10.
- Cambie el **estado**: algo pasa de pendiente → hecho, se hace push, se abre/cierra una
  tarea → §11 (y actualiza la fecha "a 20XX-XX-XX").

**Actualiza `BACKLOG.md` cuando:**
- Surja una **idea** para más adelante que NO vamos a abordar ahora → apúntala para no
  perderla.
- Una idea del backlog **se empieza o se termina** → márcala o quítala.

**Repaso de cierre** (antes de terminar una sesión con cambios relevantes):
- `[ ]` ¿Cambió el look & feel o alguna regla? → HANDOVER §4–§9
- `[ ]` ¿Cambió el estado (hecho / pendiente / push)? → HANDOVER §11 + fecha
- `[ ]` ¿Apareció una idea nueva aparcada? → BACKLOG.md

(Mantenerlos al día NO requiere push: viven en local salvo que el dueño los suba.)

---

## 13. Cómo retomar (resumen de 10 segundos)
Lee este doc → mira `brand.js`/`tokens.css`/`header.js`/`feedback.js` → respeta tokens,
planeta, cabecera/feedback y tono → trilingüe → SEO por página → verifica en local →
**no hagas push sin que el dueño lo confirme** → **actualiza HANDOVER/BACKLOG si algo
relevante cambió** (§12).
