# AstroTools (nombre provisional)

Suite que unifica **AstroHome** (`/casa`), **AstroPayroll** (`/nomina`) y **AstroSavings** (`/ahorro`)
bajo una marca, un Umami y un menú de navegación común. Identidad: navy `#1a2b5e` + dorado `#f5c84b`.

## Cómo arrancar
```powershell
cd C:\Users\alexe\Documents\AstroTools
.\serve.ps1   # http://localhost:3000/
```

## Estructura
- `shared/brand.js` — **única fuente del nombre** y lista de apps. Renombrar suite = 1 línea aquí.
- `shared/nav.js` — `<astro-nav>` web component (Shadow DOM): barra cambiador de apps.
- `shared/analytics.js` — carga Umami con UN solo website-id (pendiente, ver abajo).
- `shared/tokens.css` / `base.css` — design system de la suite (usado por el hub).
- `shared/savings-skin.css` — reskin de Savings al navy/gold (remapea sus variables, reversible).
- `casa/`, `nomina/`, `ahorro/` — las apps (1 `index.html` c/u).
- `index.html` — hub/landing.

Originales intactos en `..\_archivo_originales\`.

## Despliegue (GitHub Pages)
Repo `AstroTools` → la suite se sirve en `https://alex-sq-uh.github.io/AstroTools/`.
Todas las rutas internas son **relativas**, así que funcionan igual en esa subcarpeta,
en local (`serve.ps1`) y abriendo el HTML directamente. Sube el contenido de esta
carpeta a la raíz del repo y activa Pages.

## Umami
Website único **AstroTools** (`662e04eb-…`), cargado vía `shared/analytics.js` en las 3 apps.
Umami separa las apps por URL (`/casa`, `/nomina`, `/ahorro`). En local no registra
(el dominio configurado es `alex-sq-uh.github.io`); empezará a contar al desplegar.

## Estado
Hecho: scaffold, design system compartido, navegación entre apps, Umami unificado (ID real),
reskin de Savings, hub, rutas relativas listas para GitHub Pages. Todo verificado (200 OK).

## PENDIENTE (usuario)
1. **Subir a GitHub** (repo `AstroTools`) y activar Pages.
2. **Nombre/dominio** definitivos (provisional: AstroTools; AstroCosas queda como crédito de footer).
3. **Login + datos** (fase futura): elegir proveedor (recomendado Supabase).
