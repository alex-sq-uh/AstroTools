# Backlog de ideas · AstroTools

> ¿Continúas el proyecto en un chat nuevo? Lee primero **[`HANDOVER.md`](HANDOVER.md)**
> (arquitectura, design system y estado actual) para no romper el look & feel.
>
> **Mantenimiento:** si surge una idea nueva que no vamos a abordar ya, **apúntala aquí**;
> si una idea se empieza o se termina, márcala o quítala. (El estado del trabajo en curso
> va en `HANDOVER.md` §11; las reglas de mantenimiento, en su §12.)

Ideas para más adelante. No es un compromiso ni un orden de prioridad; es un sitio
donde no perder las ideas. Al abordar una, conviene convertirla en un prompt/plan
propio (como se hizo con AstroReturn).

---

## 💡 AstroAutónomos — nueva app
Una calculadora tipo **AstroPayroll pero para autónomos** (trabajadores por cuenta
propia en España).

- **Por qué**: AstroPayroll cubre al asalariado; el autónomo tiene un cálculo
  distinto (cuota de la Seguridad Social por tramos de rendimientos netos, IRPF por
  pagos fraccionados, gastos deducibles, IVA…) y no está cubierto.
- **Posible alcance v1**: del ingreso bruto al neto real estimado del autónomo:
  cuota de autónomos según rendimientos netos (sistema de cotización por ingresos
  reales), retención/IRPF estimado, gastos deducibles. En lenguaje llano, como el
  resto de la suite.
- **Encaje en la suite**: cuarta/quinta app en su carpeta `autonomos/`, mismo design
  system, cabecera/feedback/analytics compartidos, trilingüe. Enlazable desde/hacia
  AstroPayroll ("¿eres autónomo en vez de asalariado?").
- **A decidir**: nombre exacto, año fiscal de referencia, hasta dónde llega el
  detalle (¿IVA?, ¿módulos?, ¿estimación directa simplificada?).

## 💡 Ayudas estatales en AstroHome
Incorporar a **AstroHome** las **ayudas públicas a la compra/vivienda**.

- **Por qué**: hoy AstroHome calcula a qué vivienda puedes aspirar, pero ignora
  ayudas que cambian mucho el resultado (avales, deducciones, bonos jóvenes…).
- **Posible alcance**: avales ICO/estatales para la entrada, ayudas a jóvenes,
  deducciones autonómicas, etc. Mostrar cómo cambian la entrada necesaria y el
  acceso a la vivienda.
- **Reto**: las ayudas varían por comunidad autónoma y caducan/cambian a menudo →
  hay que decidir cómo mantenerlas y dejar claro que son orientativas (disclaimer),
  igual que con los benchmarks de AstroReturn.
- **A decidir**: qué ayudas entran en v1, si se filtran por comunidad autónoma, y
  cómo se actualizan.

---

## 🔍 Revisión UX/UI · 2026-09-28 — ✅ aplicada el 2026-09-29 (salvo 14, 15 y 20)
> Estado: **1–13 y 16–19 hechas** (detalle en HANDOVER §11). **14 y 15 descartadas** por el
> dueño (la versión se queda en la cabecera; los sufijos siguen en inglés). **20 pendiente.**
> Se conserva la lista como registro de por qué se hizo cada cambio.

Revisión en navegador (móvil 390px + escritorio 1280px) de hub + 5 apps. Wireframes de
la propuesta: https://claude.ai/artifact/GCQE1YnaYSRPsWotEyM3w7 (copia de las fuentes en
`design/wireframes-v2/`). Los números coinciden con las marcas naranjas del lienzo.

**Bugs / arreglos rápidos**
1. **Placeholders que parecen valores.** En Forecast los campos muestran 35 / 500 / 65 pero
   están vacíos → `Calcular` da error "necesitamos tu edad". Igual en Return (10.000 / 14.300)
   y Payroll (50.000). Casa, en cambio, trae valores reales. → Ejemplo real precargado o
   placeholder "p. ej. 35" en cursiva clara.
2. **AstroSavings pega el texto a los bordes en móvil**: `.screen` (absoluta) ignora el
   padding de 14px de `.screens` → x=0.
3. **AstroSavings no carga sus fuentes**: declara Plus Jakarta Sans y Fraunces pero no hay
   `<link>` a Google Fonts → cae a la sans del sistema.
4. **CTA incoherente**: `Calcular` dorado en Casa/Forecast, navy en Payroll. Un único estilo.
5. **Restos de "AstroCosas"**: export de Payroll (`nomina/index.html` ~l.2659) y
   `ahorro/i18n.js` l.64.
6. **Formato de euros mezclado** (875,00 € / 230.000 € / 32.000,00 €) → una función común.
   Casa: "te presta 230.000 € (80 %)" de un piso de 288.000 € no cuadra por 400 € (¿redondeo?).

**Resultados**
7. Payroll: el hero pone al mismo nivel "valoración del paquete" y neto anual; la cifra que
   se busca es el **neto al mes**. "Ahorro fiscal 0 €" se muestra aunque no haya retribución flexible.
8. Payroll: "¿Y ahora qué?" sale antes del desglose (mover al final); la tabla mes a mes corta
   la columna Neto en móvil (ponerla la primera).
9. Casa: "entrada mínima 92.200 €" y "entrada 20 % 57.600 €" usan la misma palabra para dos
   cifras → "lo que necesitas ahorrado (entrada + impuestos y gastos)" + barra de reparto.
10. Barra de resultado fija en móvil tras el primer Calcular (el recálculo en vivo ocurre
    fuera de pantalla).

**Suite / navegación**
11. Hub: tarjetas de ~260px, una por pantalla en móvil → lista compacta por preguntas.
12. Pasar datos entre apps por URL (Payroll → Casa con el neto puesto).
13. "Recordar en este móvil" (localStorage opt-in) + "Continúa donde lo dejaste" en el hub.
14. ~~Quitar la versión (v2.17) de la cabecera → al menú ☰.~~ **Descartada.**
15. ~~Sufijos en inglés (Payroll/Home/Return) en la cabecera → descriptor en español.~~
    **Descartada**: se quedan en inglés.
16. Forecast: flujos escritos como frase + plantillas de ejemplo.
17. Escritorio: formulario a la izquierda y resultados fijos a la derecha (hoy columna única
    de ~680px con mucho blanco).

**Accesibilidad**
18. Labels sin `for`/id en Casa, Return y Forecast; tooltips "i" solo por hover.
19. Sin `:focus-visible` ni `prefers-reduced-motion` en las apps.
20. ⏳ Lighthouse sigue pendiente (ver HANDOVER §11): sin node en la máquina del dueño.

## 💡 Ideas surgidas al aplicar la revisión (2026-09-29)
- **Alojar las fuentes en el repo** (`shared/fonts/*.woff2` + `@font-face`) para no depender de
  Google Fonts ni enviarle peticiones.
- **"Recordar" también las filas dinámicas de AstroPayroll** ("otros beneficios"): hoy se guardan
  los campos con id y los radios, pero no esas filas.
- **Pasar más datos entre apps**: AstroHome → AstroForecast (cuota como gasto mensual),
  AstroPayroll → AstroForecast (ahorro mensual sugerido).
- **Modo oscuro** (`prefers-color-scheme`) para la piel Evolución.
