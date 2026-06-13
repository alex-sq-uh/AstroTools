/* ============================================================
   AstroSavings · i18n (ES base · CA · EN)
   ------------------------------------------------------------
   Motor por elemento: clave = texto español (normalizado),
   valor = HTML traducido (preserva <strong>, <span class="kw"> …).
   No se tocan los HTML de las pantallas: el español es la base y
   lo que no esté traducido se queda en ES (nunca se rompe).
   Re-traduce el contenido dinámico vía MutationObserver.
   ============================================================ */
(function () {
  var LANG = "es";

  // Elementos "hoja" de contenido que traducimos por innerHTML.
  var SEL = [
    ".eyebrow", ".headline", ".subline",
    ".info-block-title", ".info-block-body",
    ".opt-name", ".opt-desc", ".opt-meta",
    ".note-box span:not(.nb-icon)", ".stat-lbl",
    ".cc-label", ".cc-desc",
    ".form-label", ".form-hint",
    ".principle-title", ".principle-desc",
    ".privacy-note", ".section-title",
    ".leg-item", ".kpi-lbl", ".ms-label",
    ".info-collapse summary", ".step-item",
    ".btn-primary", ".btn-ghost", ".back-btn",
    ".proj-result-lbl", ".foot", ".disclaimer", ".pick-flag"
  ].join(",");

  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }

  // ---- Diccionario: clave ES (texto normalizado) → { ca, en } (HTML) ----
  var D = {
    // Milestones
    "Por qué": { ca: "Per què", en: "Why" },
    "Opciones": { ca: "Opcions", en: "Options" },
    "Cuánto": { ca: "Quant", en: "How much" },
    "Cómo": { ca: "Com", en: "How" },
    "Retirar": { ca: "Retirar", en: "Withdraw" },
    "Objetivos": { ca: "Objectius", en: "Goals" },
    "← Volver": { ca: "← Tornar", en: "← Back" },

    // Common summaries / buttons
    "Ver explicación": { ca: "Veure explicació", en: "See explanation" },
    "Ver descripción": { ca: "Veure descripció", en: "See description" },
    "Empezar de nuevo": { ca: "Començar de nou", en: "Start over" },
    "← Otros objetivos": { ca: "← Altres objectius", en: "← Other goals" },

    // ---- S0: bienvenida ----
    "Guía de inversión sencilla": { ca: "Guia d'inversió senzilla", en: "A simple investing guide" },
    "Haz que tu dinero trabaje por ti": { ca: "Fes que els teus diners <em>treballin per tu</em>", en: "Make your money <em>work for you</em>" },
    "Una guía corta y clara para empezar a invertir tus ahorros sin complicaciones. Te acompañamos paso a paso: por qué hacerlo, qué opciones hay, cuánto puedes conseguir y cómo ponerlo en marcha.": { ca: "Una guia curta i clara per començar a invertir els teus estalvis sense complicacions. T'acompanyem pas a pas: per què fer-ho, quines opcions hi ha, quant pots aconseguir i com posar-ho en marxa.", en: "A short, clear guide to start investing your savings without the hassle. We walk you through it step by step: why to do it, what options exist, how much you can get and how to get started." },
    "De forma sencilla": { ca: "De manera senzilla", en: "Made simple" },
    "Sin jerga innecesaria. Solo lo imprescindible para empezar.": { ca: "Sense argot innecessari. Només l'imprescindible per començar.", en: "No needless jargon. Just the essentials to begin." },
    "Con una metodología clara": { ca: "Amb una metodologia clara", en: "With a clear method" },
    "Basada en décadas de evidencia. Sin opiniones ni trucos.": { ca: "Basada en dècades d'evidència. Sense opinions ni trucs.", en: "Based on decades of evidence. No opinions or tricks." },
    "A tu ritmo": { ca: "Al teu ritme", en: "At your pace" },
    "Te proponemos opciones, pero empieza todo lo lento que necesites.": { ca: "Et proposem opcions, però comença tan a poc a poc com necessitis.", en: "We suggest options, but start as slowly as you need." },
    "Generando hábitos": { ca: "Generant hàbits", en: "Building habits" },
    "Acciones pequeñas y consistentes superan a los grandes movimientos aislados.": { ca: "Accions petites i constants superen els grans moviments aïllats.", en: "Small, consistent actions beat big one-off moves." },
    "Esta guía registra datos de uso anónimos (qué pantallas se visitan). Ningún dato financiero o personal sale de tu dispositivo.": { ca: "Aquesta guia registra dades d'ús anònimes (quines pantalles es visiten). Cap dada financera o personal surt del teu dispositiu.", en: "This guide records anonymous usage data (which screens are visited). No financial or personal data leaves your device." },
    "Está pensada para usarse junto a modelos de IA como ChatGPT o Claude, que pueden ayudarte a resolver dudas y aprender más a medida que avanzas.": { ca: "Està pensada per usar-se juntament amb models d'IA com ChatGPT o Claude, que poden ajudar-te a resoldre dubtes i aprendre més a mesura que avances.", en: "It's meant to be used alongside AI models like ChatGPT or Claude, which can help you answer questions and learn more as you go." },
    "Parte de AstroTools: calcula tu sueldo neto en AstroPayroll y a qué vivienda puedes aspirar en AstroHome.": { ca: 'Part d\'AstroTools: calcula el teu sou net a <a href="../nomina/">AstroPayroll</a> i a quin habitatge pots aspirar a <a href="../casa/">AstroHome</a>.', en: 'Part of AstroTools: work out your net salary in <a href="../nomina/">AstroPayroll</a> and what home you can afford in <a href="../casa/">AstroHome</a>.' },
    "Empezar →": { ca: "Començar →", en: "Start →" },
    "Una app de AstroCosas · v4.7": { ca: "Una app d'AstroCosas · v4.7", en: "An AstroCosas app · v4.7" },

    // ---- S1: por qué invertir ----
    "Paso 1 · Por qué invertir": { ca: "Pas 1 · Per què invertir", en: "Step 1 · Why invest" },
    "¿Por qué molestarse en invertir?": { ca: "Per què molestar-se a invertir?", en: "Why bother investing?" },
    "Tres motivos por los que dejar el dinero quieto en el banco te cuesta más de lo que crees.": { ca: "Tres motius pels quals deixar els diners quiets al banc et costa més del que creus.", en: "Three reasons why leaving money idle in the bank costs you more than you think." },
    "La inflación se come tus ahorros": { ca: "La inflació es menja els teus estalvis", en: "Inflation eats your savings" },
    "Cada año las cosas cuestan un poco más. Lo que hoy compras con 100€, en 10 años puede costarte unos 135€. Si tu dinero está parado en la cuenta, no se mueve… y poco a poco puedes comprar menos con él. No lo notas de un día para otro, pero el efecto a 10 o 20 años es enorme.": { ca: "Cada any les coses costen una mica més. El que avui compres amb 100€, d'aquí a 10 anys pot costar-te uns 135€. Si els teus diners estan parats al compte, no es mouen… i a poc a poc pots comprar menys amb ells. No ho notes d'un dia per l'altre, però l'efecte a 10 o 20 anys és enorme.", en: "Each year things cost a bit more. What you buy today for €100 may cost around €135 in 10 years. If your money sits idle in the account, it doesn't move… and little by little it buys less. You don't notice day to day, but over 10 or 20 years the effect is huge." },
    "lo que podrás comprar con el mismo dinero 10 años después": { ca: "el que podràs comprar amb els mateixos diners 10 anys després", en: "what you'll be able to buy with the same money 10 years later" },
    "La pensión pública es una incógnita": { ca: "La pensió pública és una incògnita", en: "The state pension is uncertain" },
    "El sistema de pensiones depende de que haya muchos trabajadores por cada jubilado. Hace décadas había unos 4; hoy estamos cerca de 2, y la tendencia sigue bajando. Nadie sabe cómo serán las pensiones dentro de 20 o 30 años. Depender solo de ellas para tu futuro es arriesgado.": { ca: "El sistema de pensions depèn que hi hagi molts treballadors per cada jubilat. Fa dècades n'hi havia uns 4; avui estem a prop de 2, i la tendència continua baixant. Ningú sap com seran les pensions d'aquí a 20 o 30 anys. Dependre només d'elles per al teu futur és arriscat.", en: "The pension system relies on having many workers per retiree. Decades ago there were about 4; today we're near 2, and the trend keeps falling. No one knows what pensions will look like in 20 or 30 years. Relying on them alone for your future is risky." },
    "trabajadores por jubilado hace décadas": { ca: "treballadors per jubilat fa dècades", en: "workers per retiree decades ago" },
    "trabajadores por jubilado hoy (y bajando)": { ca: "treballadors per jubilat avui (i baixant)", en: "workers per retiree today (and falling)" },
    "Invertir es protegerte y crecer": { ca: "Invertir és protegir-te i créixer", en: "Investing protects you and grows" },
    "Invertir bien no es apostar ni hacerse rico de la noche a la mañana. Es poner tu dinero a trabajar para que, poco a poco, crezca más rápido que la inflación y construyas un colchón para lo que venga. Cuanto antes empieces, más tiempo tiene para crecer.": { ca: "Invertir bé no és apostar ni fer-se ric de la nit al dia. És posar els teus diners a treballar perquè, a poc a poc, creixin més ràpid que la inflació i construeixis un coixí per al que vingui. Com abans comencis, més temps té per créixer.", en: "Investing well isn't gambling or getting rich overnight. It's putting your money to work so it gradually grows faster than inflation and you build a cushion for whatever comes. The sooner you start, the more time it has to grow." },
    "Lo entiendo, ¿qué opciones hay? →": { ca: "Ho entenc, quines opcions hi ha? →", en: "Got it — what are my options? →" },

    // ---- S2: opciones ----
    "Paso 2 · Tus opciones": { ca: "Pas 2 · Les teves opcions", en: "Step 2 · Your options" },
    "¿Dónde puedes poner tu dinero?": { ca: "On pots posar els teus diners?", en: "Where can you put your money?" },
    "Hay muchas formas de invertir. Estas son las más comunes:": { ca: "Hi ha moltes maneres d'invertir. Aquestes són les més comunes:", en: "There are many ways to invest. These are the most common:" },
    "Negocios de conocidos": { ca: "Negocis de coneguts", en: "Friends' businesses" },
    "Suena bien meter dinero en el negocio de un amigo, pero el riesgo es altísimo, no hay garantías y muchos acaban mal (y con la amistad de paso).": { ca: "Sona bé posar diners al negoci d'un amic, però el risc és altíssim, no hi ha garanties i molts acaben malament (i amb l'amistat de passada).", en: "Putting money into a friend's business sounds nice, but the risk is huge, there are no guarantees and many end badly (and take the friendship with them)." },
    "Criptomonedas": { ca: "Criptomonedes", en: "Cryptocurrencies" },
    "Muy volátiles: pueden multiplicarse o desplomarse en semanas. Más apuesta que inversión.": { ca: "Molt volàtils: poden multiplicar-se o desplomar-se en setmanes. Més aposta que inversió.", en: "Very volatile: they can multiply or collapse in weeks. More of a bet than an investment." },
    "Acciones sueltas": { ca: "Accions soltes", en: "Individual stocks" },
    "Comprar empresas una a una. Alto potencial, pero concentras el riesgo en pocas y necesitas tiempo y conocimiento para acertar.": { ca: "Comprar empreses una a una. Alt potencial, però concentres el risc en poques i necessites temps i coneixement per encertar.", en: "Buying companies one by one. High potential, but you concentrate risk in a few and need time and knowledge to get it right." },
    "Pisos": { ca: "Pisos", en: "Property" },
    "Algo tangible, pero caro de entrar (necesitas un buen ahorro o hipoteca), difícil de vender rápido y con mucha gestión: inquilinos, averías e impuestos.": { ca: "Una cosa tangible, però cara d'entrar (necessites un bon estalvi o hipoteca), difícil de vendre ràpid i amb molta gestió: llogaters, avaries i impostos.", en: "Tangible, but expensive to get into (you need solid savings or a mortgage), hard to sell quickly and high-maintenance: tenants, repairs and taxes." },
    "Fondos monetarios": { ca: "Fons monetaris", en: "Money market funds" },
    "Como tener el dinero en el banco, pero ganando intereses (en torno al 3-4% anual según los tipos del BCE). Sin sobresaltos. Ideal para el colchón de emergencia y dinero que necesitarás pronto.": { ca: "Com tenir els diners al banc, però guanyant interessos (al voltant del 3-4% anual segons els tipus del BCE). Sense ensurts. Ideal per al coixí d'emergència i diners que necessitaràs aviat.", en: "Like keeping money in the bank, but earning interest (around 3-4% a year depending on ECB rates). No surprises. Ideal for your emergency cushion and money you'll need soon." },
    "Lo que te explicaremos": { ca: "El que t'explicarem", en: "What we'll explain" },
    "Compras un trocito de miles de empresas a la vez. Diversificación instantánea, coste muy bajo y sin mantenimiento. Ideal para hacer crecer tu dinero a largo plazo.": { ca: "Compres un trosset de milers d'empreses alhora. Diversificació instantània, cost molt baix i sense manteniment. Ideal per fer créixer els teus diners a llarg termini.", en: "You buy a tiny slice of thousands of companies at once. Instant diversification, very low cost and no maintenance. Ideal for growing your money long-term." },
    "Entender mejor los fondos indexados →": { ca: "Entendre millor els fons indexats →", en: "Understand index funds better →" },

    // ---- S_INDEXADOS ----
    "Paso 2 · Cómo funciona": { ca: "Pas 2 · Com funciona", en: "Step 2 · How it works" },
    "¿Cómo funciona un fondo indexado?": { ca: "Com funciona un fons indexat?", en: "How does an index fund work?" },
    "Antes de seguir, vale la pena entender qué estás comprando exactamente, qué te dan a cambio y a qué te expones.": { ca: "Abans de continuar, val la pena entendre què estàs comprant exactament, què et donen a canvi i a què t'exposes.", en: "Before going on, it's worth understanding exactly what you're buying, what you get and what you're exposed to." },
    "¿Qué es exactamente?": { ca: "Què és exactament?", en: "What exactly is it?" },
    "Imagina una cesta que contiene un trocito de miles de empresas a la vez. Eso es un fondo indexado. En lugar de elegir empresas una por una, compras la cesta entera y te toca un poquito de cada una. De los más populares son los que replican al índice MSCI World, que contiene unas 1.500 empresas de 23 países desarrollados: Apple, Nestlé, Toyota, Inditex… Si esas empresas en conjunto suben un 7%, tu fondo sube aproximadamente lo mismo.": { ca: "Imagina una cistella que conté un trosset de milers d'empreses alhora. Això és un fons indexat. En lloc de triar empreses una per una, compres la cistella sencera i et toca una mica de cadascuna. Dels més populars són els que repliquen l'índex <strong>MSCI World</strong>, que conté unes 1.500 empreses de 23 països desenvolupats: Apple, Nestlé, Toyota, Inditex… Si aquestes empreses en conjunt pugen un 7%, el teu fons puja aproximadament el mateix.", en: "Picture a basket holding a tiny slice of thousands of companies at once. That's an index fund. Instead of picking companies one by one, you buy the whole basket and get a bit of each. Among the most popular are those tracking the <strong>MSCI World</strong> index, which holds about 1,500 companies from 23 developed countries: Apple, Nestlé, Toyota, Inditex… If those companies rise 7% overall, your fund rises about the same." },
    "empresas dentro de un fondo MSCI World": { ca: "empreses dins d'un fons MSCI World", en: "companies inside an MSCI World fund" },
    "países desarrollados representados": { ca: "països desenvolupats representats", en: "developed countries represented" },
    "de la bolsa mundial cotizada(países desarrollados)": { ca: "de la borsa mundial cotitzada<br>(països desenvolupats)", en: "of the world's listed market<br>(developed countries)" },
    "Comprar y vender es sencillo": { ca: "Comprar i vendre és senzill", en: "Buying and selling is simple" },
    "Cuando inviertes, compras participaciones del fondo (algo así como acciones del propio fondo). Su precio cambia cada día según suben o bajan las empresas que contiene. Puedes vender cuando quieras y recibir el dinero en tu cuenta en pocos días. No hay penalizaciones por sacarlo antes de tiempo, pero sí pagas impuestos sobre las ganancias cuando vendes (no antes).": { ca: "Quan inverteixes, compres <strong>participacions</strong> del fons (una mena d'accions del fons mateix). El seu preu canvia cada dia segons pugen o baixen les empreses que conté. Pots vendre quan vulguis i rebre els diners al teu compte en pocs dies. No hi ha penalitzacions per treure'l abans d'hora, però sí pagues impostos sobre els guanys quan vens (no abans).", en: "When you invest, you buy <strong>units</strong> of the fund (a bit like shares of the fund itself). Their price changes daily as the companies inside rise or fall. You can sell whenever you want and get the money in your account within a few days. There are no early-withdrawal penalties, but you do pay tax on gains when you sell (not before)." },
    "Por qué funcionan tan bien": { ca: "Per què funcionen tan bé", en: "Why they work so well" },
    "El riesgo: el valor sube y baja": { ca: "El risc: el valor puja i baixa", en: "The risk: the value goes up and down" },
    "A largo plazo el MSCI World ha subido de media en torno a un 8 % anual (desde 1979), pero hay años muy malos. En la crisis de 2008 cayó cerca de un 40 % en un solo año, y tardó unos 5 años en recuperar el nivel previo. En la burbuja puntocom (2000-2002) cayó un 47 % acumulado y tardó unos 7 años en recuperarse. En 2020 cayó un 34 % en pocas semanas, pero se recuperó en 6 meses.": { ca: "A llarg termini el MSCI World ha pujat de mitjana al voltant d'un <strong>8 % anual</strong> (des de 1979), però hi ha anys molt dolents. A la crisi del 2008 va caure prop d'un <strong>40 %</strong> en un sol any, i va trigar uns <strong>5 anys</strong> a recuperar el nivell previ. A la bombolla puntcom (2000-2002) va caure un 47 % acumulat i va trigar uns 7 anys a recuperar-se. El 2020 va caure un 34 % en poques setmanes, però es va recuperar en 6 mesos.", en: "Over the long run the MSCI World has risen on average about <strong>8% a year</strong> (since 1979), but there are very bad years. In the 2008 crisis it fell nearly <strong>40%</strong> in a single year, and took about <strong>5 years</strong> to recover. In the dot-com bubble (2000-2002) it fell 47% cumulatively and took about 7 years to recover. In 2020 it fell 34% in a few weeks, but bounced back in 6 months." },
    "rentabilidad anual media histórica del MSCI World": { ca: "rendibilitat anual mitjana històrica del MSCI World", en: "historical average annual return of the MSCI World" },
    "peor caída reciente (2008)": { ca: "pitjor caiguda recent (2008)", en: "worst recent drop (2008)" },
    "en recuperar el nivel pre-crisis de 2008": { ca: "a recuperar el nivell pre-crisi de 2008", en: "to recover the pre-2008 level" },
    "Por eso solo conviene invertir dinero que no vayas a necesitar a corto plazo (idealmente, 5-10 años o más). Si lo dejas tranquilo y sigues aportando incluso cuando cae, históricamente siempre se ha recuperado. Es más: seguir aportando cuando el mercado está bajo acelera la recuperación, porque compras participaciones más baratas que luego subirán.": { ca: "Per això només convé invertir diners que <strong>no necessitis a curt termini</strong> (idealment, 5-10 anys o més). Si el deixes tranquil i continues aportant fins i tot quan cau, històricament sempre s'ha recuperat. És més: <strong>continuar aportant quan el mercat està baix accelera la recuperació</strong>, perquè compres participacions més barates que després pujaran.", en: "That's why you should only invest money you <strong>won't need in the short term</strong> (ideally 5-10 years or more). If you leave it alone and keep contributing even when it falls, historically it has always recovered. In fact, <strong>contributing while the market is down speeds up recovery</strong>, because you buy cheaper units that will later rise." },
    "Ver cuánto puedo conseguir →": { ca: "Veure quant puc aconseguir →", en: "See how much I can get →" },

    // ---- S_DATOS ----
    "Paso 3 · Cuánto puedes conseguir": { ca: "Pas 3 · Quant pots aconseguir", en: "Step 3 · How much you can get" },
    "Cuéntanos tu situación": { ca: "Explica'ns la teva situació", en: "Tell us your situation" },
    "Tres datos y te mostramos cómo podría crecer tu dinero. Puedes usar aproximaciones.": { ca: "Tres dades i et mostrem com podrien créixer els teus diners. Pots fer servir aproximacions.", en: "Three figures and we'll show how your money could grow. You can use rough numbers." },
    "Tu edad": { ca: "La teva edat", en: "Your age" },
    "Ahorros actuales (€)": { ca: "Estalvis actuals (€)", en: "Current savings (€)" },
    "¿Cuánto puedes ahorrar al mes? (€)": { ca: "Quant pots estalviar al mes? (€)", en: "How much can you save per month? (€)" },
    "La proyección llega hasta los 65 años, así que esta parte está pensada para edades entre 18 y 64.": { ca: "La projecció arriba fins als 65 anys, així que aquesta part està pensada per a edats entre 18 i 64.", en: "The projection runs to age 65, so this part is meant for ages 18 to 64." },
    "Ver mi proyección →": { ca: "Veure la meva projecció →", en: "See my projection →" },

    // ---- S_CUANTO ----
    "Así puede crecer tu dinero": { ca: "Així poden créixer els teus diners", en: "How your money can grow" },
    "Si en el futuro pasa lo mismo que lleva ocurriendo desde hace más de 100 años, tus ahorros invertidos en fondos indexados crecerán de media un 6% cada año.": { ca: "Si en el futur passa el mateix que porta passant des de fa més de 100 anys, els teus estalvis invertits en fons indexats creixeran de mitjana un 6% cada any.", en: "If the future looks like the last 100+ years, your savings invested in index funds will grow on average 6% each year." },
    "Sin invertir": { ca: "Sense invertir", en: "Not invested" },
    "Invertido (6%)": { ca: "Invertit (6%)", en: "Invested (6%)" },
    "La diferencia no es magia: es el interés compuesto trabajando año tras año. Cuanto más tiempo dejas el dinero, más se nota.": { ca: 'La diferència no és màgia: és l\'<span class="kw" data-tip="ic">interès compost</span> treballant any rere any. Com més temps deixes els diners, més es nota.', en: 'The difference isn\'t magic: it\'s <span class="kw" data-tip="ic">compound interest</span> working year after year. The longer you leave the money, the more it shows.' },
    "¿Y cómo empiezo? →": { ca: "I com començo? →", en: "And how do I start? →" },

    // ---- S_COMO_1 ----
    "Paso 4 · Cómo invertir (1/2)": { ca: "Pas 4 · Com invertir (1/2)", en: "Step 4 · How to invest (1/2)" },
    "Empieza con poco y un solo fondo": { ca: "Comença amb poc i un sol fons", en: "Start small with a single fund" },
    "La idea es coger confianza viendo cómo funciona. Sin prisa, sin grandes cantidades.": { ca: "La idea és agafar confiança veient com funciona. Sense pressa, sense grans quantitats.", en: "The idea is to build confidence by seeing how it works. No rush, no big amounts." },
    "Tu fondo para empezar": { ca: "El teu fons per començar", en: "Your starter fund" },
    "Para encontrarlo en tu broker, copia el código ISIN (la columna ISIN de la tabla) y pégalo en el buscador de fondos de la plataforma. Es un código único, así te aseguras de comprar exactamente este fondo y no otro parecido.": { ca: 'Per trobar-lo al teu bróker, copia el codi <span class="kw" data-tip="isin">ISIN</span> (la columna ISIN de la taula) i enganxa\'l al cercador de fons de la plataforma. És un codi únic, així t\'assegures de comprar exactament aquest fons i no un altre de semblant.', en: 'To find it at your broker, copy the <span class="kw" data-tip="isin">ISIN</span> code (the ISIN column in the table) and paste it into the platform\'s fund search. It\'s a unique code, so you make sure you buy exactly this fund and not a similar one.' },
    "Cuando me sienta cómodo, ¿qué hago? →": { ca: "Quan em senti còmode, què faig? →", en: "Once I'm comfortable, what next? →" },

    // ---- S_COMO_2 ----
    "Paso 4 · Cómo invertir (2/2)": { ca: "Pas 4 · Com invertir (2/2)", en: "Step 4 · How to invest (2/2)" },
    "Cuando estés cómodo, amplía la aportación y el plan": { ca: "Quan estiguis còmode, amplia l'aportació i el pla", en: "When you're comfortable, raise your contribution and plan" },
    "Después de unos meses viendo cómo funciona, llega el momento de subir el ritmo y diversificar más.": { ca: "Després d'uns mesos veient com funciona, arriba el moment de pujar el ritme i diversificar més.", en: "After a few months seeing how it works, it's time to step it up and diversify more." },
    "Tu portfolio diversificado — 4 fondos": { ca: "La teva cartera diversificada — 4 fons", en: "Your diversified portfolio — 4 funds" },
    "¿Y si necesito el dinero? →": { ca: "I si necessito els diners? →", en: "What if I need the money? →" },

    // ---- S_SACAR ----
    "Paso 5 · Cómo recuperar tu dinero": { ca: "Pas 5 · Com recuperar els teus diners", en: "Step 5 · Getting your money back" },
    "¿Y si necesito sacarlo?": { ca: "I si necessito treure'l?", en: "What if I need to take it out?" },
    "Tu dinero no se queda atrapado. Esto es lo que pasa cuando quieres recuperarlo.": { ca: "Els teus diners no es queden atrapats. Això és el que passa quan vols recuperar-los.", en: "Your money isn't locked away. Here's what happens when you want it back." },
    "Puedes sacarlo cuando quieras": { ca: "Pots treure'l quan vulguis", en: "You can take it out anytime" },
    "No hay permanencia ni penalización. Cuando vendes (se llama reembolso), el dinero suele tardar alrededor de un día hábil en llegar a tu cuenta. No está bloqueado: simplemente da mejor resultado dejarlo crecer.": { ca: 'No hi ha permanència ni penalització. Quan vens (es diu <span class="kw" data-tip="reembolso">reemborsament</span>), els diners solen trigar al voltant d\'un dia hàbil a arribar al teu compte. No està bloquejat: simplement dona millor resultat deixar-lo créixer.', en: 'No lock-in and no penalty. When you sell (it\'s called <span class="kw" data-tip="reembolso">redemption</span>), the money usually takes about one business day to reach your account. It\'s not blocked: it simply works better to let it grow.' },
    "Solo pagas impuestos por lo que ganas": { ca: "Només pagues impostos pel que guanyes", en: "You only pay tax on what you gain" },
    "Cuando vendes con beneficio, pagas impuestos únicamente sobre la ganancia, no sobre el dinero que pusiste. Mientras no vendas, no pagas nada. Y en España puedes traspasar entre fondos sin tributar, así que solo pasas por Hacienda cuando sacas el dinero de verdad.": { ca: 'Quan vens amb benefici, pagues impostos únicament sobre el <span class="kw" data-tip="plusvalia">guany</span>, no sobre els diners que vas posar. Mentre no venguis, no pagues res. I a Espanya pots <strong>traspassar entre fons sense tributar</strong>, així que només passes per Hisenda quan treus els diners de debò.', en: 'When you sell at a profit, you pay tax only on the <span class="kw" data-tip="plusvalia">gain</span>, not on the money you put in. As long as you don\'t sell, you pay nothing. And in Spain you can <strong>switch between funds tax-free</strong>, so you only deal with the tax office when you truly cash out.' },
    "Ganancia": { ca: "Guany", en: "Gain" },
    "Impuesto": { ca: "Impost", en: "Tax" },
    "Consejo sencillo: vende solo lo que necesites, cuando lo necesites. El resto que siga trabajando.": { ca: "Consell senzill: <strong>ven només el que necessitis, quan ho necessitis.</strong> La resta, que continuï treballant.", en: "Simple tip: <strong>sell only what you need, when you need it.</strong> Let the rest keep working." },
    "¿Para qué quiero el dinero? →": { ca: "Per a què vull els diners? →", en: "What do I want the money for? →" },

    // ---- S_OBJETIVOS ----
    "Paso 6 · Tus objetivos": { ca: "Pas 6 · Els teus objectius", en: "Step 6 · Your goals" },
    "¿Para qué quieres el dinero?": { ca: "Per a què vols els diners?", en: "What do you want the money for?" },
    "Elige lo que más te interese. Puedes mirar varios escenarios.": { ca: "Tria el que més t'interessi. Pots mirar diversos escenaris.", en: "Pick what interests you most. You can explore several scenarios." },
    "Para imprevistos": { ca: "Per a imprevistos", en: "For emergencies" },
    "Un colchón para lo inesperado": { ca: "Un coixí per a l'inesperat", en: "A cushion for the unexpected" },
    "Para comprar un piso": { ca: "Per comprar un pis", en: "To buy a home" },
    "Calcula la entrada en X años": { ca: "Calcula l'entrada en X anys", en: "Work out the deposit in X years" },
    "Para mi jubilación": { ca: "Per a la meva jubilació", en: "For my retirement" },
    "Cuánto tendrás a los 65": { ca: "Quant tindràs als 65", en: "How much you'll have at 65" },
    "Para ser independiente": { ca: "Per ser independent", en: "To be independent" },
    "Vivir de tus inversiones": { ca: "Viure de les teves inversions", en: "Live off your investments" },

    // ---- OBJ: IMPREVISTOS ----
    "Objetivo · Imprevistos": { ca: "Objectiu · Imprevistos", en: "Goal · Emergencies" },
    "Son raros, pero ocurren": { ca: "Són rars, però passen", en: "They're rare, but they happen" },
    "Una avería, el dentista, quedarte sin trabajo… para eso necesitas dinero disponible al momento.": { ca: "Una avaria, el dentista, quedar-te sense feina… per a això necessites diners disponibles a l'instant.", en: "A breakdown, the dentist, losing your job… for that you need money available right away." },
    "Tu colchón de seguridad": { ca: "El teu coixí de seguretat", en: "Your safety cushion" },
    "Antes de invertir, ten guardado en una cuenta el equivalente a entre 3 y 6 meses de tus gastos. Así puedes invertir el resto con tranquilidad, sabiendo que un susto no te obliga a vender en mal momento. Y en el peor de los casos, recuerda que puedes vender tus fondos de un día para otro.": { ca: "Abans d'invertir, tingues guardat en un compte l'equivalent a <strong>entre 3 i 6 mesos de les teves despeses</strong>. Així pots invertir la resta amb tranquil·litat, sabent que un ensurt no t'obliga a vendre en mal moment. I en el pitjor dels casos, recorda que <strong>pots vendre els teus fons d'un dia per l'altre</strong>.", en: "Before investing, keep in an account the equivalent of <strong>3 to 6 months of your expenses</strong>. That way you can invest the rest calmly, knowing a scare won't force you to sell at a bad time. And worst case, remember you <strong>can sell your funds overnight</strong>." },
    "colchón de 3 meses": { ca: "coixí de 3 mesos", en: "3-month cushion" },
    "colchón de 6 meses": { ca: "coixí de 6 mesos", en: "6-month cushion" },

    // ---- OBJ: PISO ----
    "Objetivo · Comprar un piso": { ca: "Objectiu · Comprar un pis", en: "Goal · Buy a home" },
    "¿Cuánto tardas en juntar el dinero?": { ca: "Quant trigues a reunir els diners?", en: "How long to save up the money?" },
    "Pon el precio del piso y te decimos cuántos años necesitas en dos escenarios: pagar solo la entrada y gastos (con hipoteca) o pagarlo entero (sin hipoteca).": { ca: "Posa el preu del pis i et diem quants anys necessites en dos escenaris: pagar només l'entrada i les despeses (amb hipoteca) o pagar-lo sencer (sense hipoteca).", en: "Enter the home price and we'll tell you how many years you need in two scenarios: paying only the deposit and costs (with a mortgage) or paying it in full (no mortgage)." },
    "Precio del piso (€)": { ca: "Preu del pis (€)", en: "Home price (€)" },
    "Tu cartera (neto)": { ca: "La teva cartera (net)", en: "Your portfolio (net)" },
    "Meta con hipoteca": { ca: "Meta amb hipoteca", en: "Goal with mortgage" },
    "Meta sin hipoteca": { ca: "Meta sense hipoteca", en: "Goal without mortgage" },
    "Las metas incluyen 20% de entrada + 10% de impuestos + 2% de gastos (notaría, registro, etc.). En \"sin hipoteca\" sumamos también el resto del precio. La línea de tu cartera ya descuenta el IRPF estimado por vender los fondos.": { ca: "Les metes inclouen <strong>20% d'entrada + 10% d'impostos + 2% de despeses</strong> (notaria, registre, etc.). A \"sense hipoteca\" sumem també la resta del preu. La línia de la teva cartera ja descompta l'IRPF estimat per vendre els fons.", en: "The goals include <strong>20% deposit + 10% taxes + 2% costs</strong> (notary, registry, etc.). In \"no mortgage\" we also add the rest of the price. Your portfolio line already deducts the estimated tax on selling the funds." },
    "Para plazos cortos (menos de 5 años) el mercado puede no tener tiempo de recuperarse de una caída. Para ese dinero, valora opciones más conservadoras o mantén una parte sin invertir.": { ca: "Per a terminis curts (menys de 5 anys) el mercat pot no tenir temps de recuperar-se d'una caiguda. Per a aquests diners, valora opcions més conservadores o mantén-ne una part sense invertir.", en: "For short horizons (under 5 years) the market may not have time to recover from a drop. For that money, consider more conservative options or keep part of it uninvested." },

    // ---- OBJ: JUBILACIÓN ----
    "Objetivo · Jubilación": { ca: "Objectiu · Jubilació", en: "Goal · Retirement" },
    "Tu dinero a los 65": { ca: "Els teus diners als 65", en: "Your money at 65" },
    "Manteniendo tu ahorro actual e invirtiendo al 6% anual de media hasta los 65.": { ca: "Mantenint el teu estalvi actual i invertint al 6% anual de mitjana fins als 65.", en: "Keeping your current saving and investing at 6% a year on average until 65." },
    "tendrías a los 65": { ca: "tindries als 65", en: "you'd have at 65" },
    "Ingreso extra de tus ahorros": { ca: "Ingrés extra dels teus estalvis", en: "Extra income from your savings" },

    // ---- OBJ: INDEPENDENCIA FINANCIERA ----
    "Objetivo · Independencia financiera": { ca: "Objectiu · Independència financera", en: "Goal · Financial independence" },
    "Independencia financiera es tener suficiente invertido como para que sus rendimientos cubran tus gastos. Trabajar pasa a ser opcional.": { ca: "Independència financera és tenir prou invertit perquè els seus rendiments cobreixin les teves despeses. Treballar passa a ser opcional.", en: "Financial independence means having enough invested for its returns to cover your expenses. Working becomes optional." },
    "ahorros necesarios": { ca: "estalvis necessaris", en: "savings needed" },
    "para conseguirlo": { ca: "per aconseguir-ho", en: "to reach it" }
  };

  // ---- Motor ----
  function collect(scope) {
    var els = scope.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__i18nDone) continue;
      if (el.hasAttribute("data-dyn")) continue; // lo gestiona el JS de la app (textos dinámicos)
      el.__i18nDone = true;
      el.__es = el.innerHTML;
      el.__key = norm(el.textContent);
    }
  }
  // Patrones para textos dinámicos con cifras interpoladas (ej. "a los 45 años").
  var PATTERNS = [
    { re: /^a los (\d[\d.]*) años$/, ca: "als $1 anys", en: "at age $1" },
    { re: /^necesitarás (.+)$/, ca: "necessitaràs $1", en: "you'll need $1" }
  ];
  function patternTranslate(key) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = key.match(PATTERNS[i].re);
      if (m) return PATTERNS[i][LANG].replace(/\$(\d)/g, function (_, n) { return m[n]; });
    }
    return null;
  }

  function apply(scope) {
    var els = scope.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.__i18nDone) continue;
      if (LANG === "es") { if (el.innerHTML !== el.__es) el.innerHTML = el.__es; continue; }
      var tr = D[el.__key];
      var val = (tr && tr[LANG]) || patternTranslate(el.__key);
      el.innerHTML = val ? val : el.__es;
    }
  }
  function refresh(scope) { collect(scope); apply(scope); }

  // Helpers para que el JS de la app traduzca sus textos dinámicos.
  window.savingsLang = function () { return LANG; };
  window.savingsT = function (es, ca, en) { return LANG === "ca" ? ca : LANG === "en" ? en : es; };

  window.setLangSavings = function (l) {
    if (l !== "es" && l !== "ca" && l !== "en") l = "es";
    LANG = l;
    document.documentElement.lang = l;
    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].getAttribute("data-l") === l);
    var app = document.getElementById("app");
    if (app) refresh(app);
    // Re-renderiza la pantalla dinámica activa en el nuevo idioma.
    if (typeof window.savingsRerender === "function") window.savingsRerender();
  };

  function start() {
    var app = document.getElementById("app");
    if (!app) return;
    refresh(app);
    // Re-traduce contenido dinámico añadido por la app (tablas, resultados…)
    var obs = new MutationObserver(function (muts) {
      if (LANG === "es") return;
      for (var i = 0; i < muts.length; i++) {
        var an = muts[i].addedNodes;
        for (var j = 0; j < an.length; j++) {
          if (an[j].nodeType === 1) refresh(an[j].nodeType === 1 && an[j].querySelectorAll ? an[j] : app);
        }
      }
    });
    obs.observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
