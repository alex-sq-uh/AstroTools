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
