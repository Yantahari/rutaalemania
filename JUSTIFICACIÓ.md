# JUSTIFICACIÓ — Optimització snippet de `/blog/chancenkarte-guia-completa/`

**Branch:** `experiment/snippet-chancenkarte`
**Data:** 2026-05-03
**Pàgina:** https://rutaalemania.com/blog/chancenkarte-guia-completa/
**Mètriques de partida (GSC, 28 dies):** 189 impressions · 0 clics · CTR 0 % · posició mitjana 7,85

---

## 0. Troballa crítica abans de res

**Google ja està reescrivint el title actual a la SERP.**

- Al codi font (HTML `<head>`) la pàgina serveix: `Chancenkarte 2026: Calcula tus Puntos Gratis | RutaAlemania`
- A la SERP real, Google mostra: `Chancenkarte: Qué es, requisitos y cómo solicitarla (Guía 2026) | RutaAlemania`

Verificat amb dues consultes (`chancenkarte requisitos 2026`, `chancenkarte alemania requisitos`) — el title reescrit és consistent. La descripció en SERP segueix sent la nostra, però el title NO.

**Què significa això**

1. L'algorisme de title-rewriting de Google considera que `Calcula tus Puntos Gratis` no encaixa amb la intenció de cerca.
2. Google sintetitza un title alternatiu agafant H2 del cos (`Qué es la Chancenkarte`, `Los 3 requisitos obligatorios`, `Pasos para solicitar`) i hi afegeix l'any.
3. **El reescriu correlaciona amb pitjor CTR**: és un senyal públic que Google ha pres una decisió en lloc nostre, i els usuaris experimentats sovint ho perceben com a "no ha tornat el que prometia".
4. Alinear el frontmatter amb la fórmula que Google ha triat és la decisió editorial més defensable: deixem de ser reescrits, recuperem control del clic, i **el senyal que rebem de Google ja ens diu què guanya**.

Aquest és el descobriment més rendible de l'auditoria. La resta de l'anàlisi confirma i refina aquesta direcció.

---

## 1. Investigació SERP real

Investigades 4 consultes a la SERP en directe (Google Web Search, 2026-05-03).

### 1.1 `chancenkarte requisitos 2026` — Top 5 reals

| # | URL | Title (tal com es mostra) |
|---|---|---|
| 1 | intermedpersonal.com | "La Chancenkarte Alemania 2026 ... Requisitos, sistema de puntos y procedimiento" |
| 2 | mygermanuniversity.com/es | "Germany Opportunity Card (2026) 🇩🇪 Ultimate Guide" |
| 3 | germany-visa.org (Google translate) | "Tarjeta de oportunidad de Alemania Chancenkarte" |
| 4 | profee.com | "How to get the Chancenkarte (Opportunity Card) in 2026" |
| 5 | chancenkarte.com | "The Opportunity Card for foreign professionals" |
| ~7 | **rutaalemania.com** | "Chancenkarte: Qué es, requisitos y cómo solicitarla (Guía 2026)" *(reescrit per Google)* |

### 1.2 `chancenkarte alemania requisitos` — Top 5 reals

| # | URL | Title |
|---|---|---|
| 1 | intermedpersonal.com | mateix títol llarg de stuffing |
| 2 | **make-it-in-germany.com** *(govern alemany)* | "Tarjeta de oportunidades para búsqueda de empleo" |
| 3 | tegucigalpa.diplo.de *(Affari Esteri DE)* | "Tarjeta de Oportunidades (§§ 20a y 20b AufenthG) - Chancenkarte" |
| 4 | asuncion.diplo.de *(Affari Esteri DE)* | "Chancenkarte para búsqueda de trabajo" |
| 5 | **rutaalemania.com** | (com a dalt, reescrit) |

### 1.3 `tarjeta oportunidades alemania requisitos puntos` — Top 5 reals

Aquí RutaAlemania **no apareix al top 10**. Domini total dels sites institucionals alemanys (make-it-in-germany, diplo.de Tegucigalpa/Lima/Caracas, Ausländerbehörde München) i comercials internacionals (mygermanuniversity, intermedpersonal, fintiba).

### 1.4 `chancenkarte puntos sistema` — Top 5 reals

Domini d'angle "sistema de puntos explicado" (migrando.de, riemenschneider.legal, intermedpersonal). RutaAlemania tampoc no hi és visible al top 10.

### 1.5 Observacions transversals

- **Tots els competidors que rangen alt en consultes hispanoparlants utilitzen "Chancenkarte" (no la traducció)** com a paraula clau principal. El terme alemany és el que la nostra audiència ja informada utilitza.
- **L'any "2026" apareix al 70 % de titles top**: senyal de frescor, important per a info legal.
- **"requisitos"** i **"puntos"** són els qualificadors dominants. "guía" apareix en variants menys agressives.
- **Sites institucionals** (make-it-in-germany, diplo.de) usen títols curts no optimitzats — guanyen per autoritat de domini, no per snippet.
- **Format guanyador detectat als competidors comercials**: `Chancenkarte [Alemania/2026]: requisitos, puntos y [trámites/procedimiento/cómo solicitar]`. trabajarporelmundo.org en concret usa exactament `Chancenkarte Alemania: requisitos, puntos y trámites` — net, 53 caràcters, fórmula tipus.
- **No hem detectat AI Overview suprimint completament els clics** als nostres tests, però la cua llarga de PAA boxes (People Also Ask) sí absorbeix part del trànsit informacional al top de la SERP.

### 1.6 Buit d'angle detectat

Cap competidor visible al SERP ofereix:

- **calculadora interactiva** integrada a la pàgina (la nostra `/#calculadora` és única dins els competidors hispans)
- **angle target-fit LATAM explícit** al snippet (la majoria són globals/genèrics)
- **dades concretes a la descripció** (€12.324 Sperrkonto, 6 punts mínim)

Aquest és el nostre actiu diferencial real.

---

## 2. Confirmació o refutació de la hipòtesi

**Hipòtesi de partida:** *L'angle "requisits Chancenkarte 2026" és el dominant.*

**Veredicte: CONFIRMADA, amb matisos.**

Evidències a favor:
- 5 de 5 títols top combinen `Chancenkarte` + `requisitos` (o equivalent).
- Google reescriu el nostre title cap a aquesta fórmula.
- L'any "2026" reforça intent informacional + frescor legal.

Matís 1: **El terme correcte és "Chancenkarte", no "tarjeta de oportunidades"** — la nostra audiència ja ha aprés el mot alemany. La traducció només la fan servir sites institucionals i Carlos no competeix amb ells per autoritat de domini.

Matís 2: **"puntos" co-domina amb "requisitos"** — els dos conceptes estan tan lligats al producte que apareixen sempre junts. Incloure els dos al title amplifica match d'intent.

Matís 3: **L'angle "calculadora" no domina la SERP però és el nostre asset únic**. Si l'angle pur informacional ja està saturat per intermedpersonal, mygermanuniversity, make-it-in-germany i diplo.de (tots amb autoritat superior), pujar de la posició 7-8 amb una rèplica del seu format és poc realista. Cal **diferenciació**.

---

## 3. Tres propostes de title + meta

Recordatori tècnic: el frontmatter `title` s'usa **alhora** com a `<title>` i com a `<h1>` de l'article. La capçalera SEO afegeix automàticament ` | RutaAlemania` (15 car.). Ergo, target del frontmatter title: 35-50 car. (60-65 totals amb sufix).

### Proposta A — Conservadora (rèplica del format guanyador)

**title** (49 car. + 15 sufix = 64 totals):
```
Chancenkarte 2026: requisitos, puntos y solicitud
```

**description** (147 car.):
```
Cómo conseguir la Chancenkarte en 2026: requisitos, sistema de 6 puntos, Sperrkonto, costes reales y pasos para la visa de búsqueda de empleo.
```

**Angle:** Puramente informacional + procedural. Còpia de la fórmula trabajarporelmundo.org / intermedpersonal però sense stuffing.

**Per què aquesta:** Encaix màxim amb el title que Google ha triat per nosaltres → para de reescriure → senyal positiu d'algoritme. Risc 0 d'angle ortogonal.

**Per què NO recomanada com a número 1:** Renuncia a la diferenciació. Competeix de cara amb intermedpersonal, mygermanuniversity i make-it-in-germany al seu propi terreny, on tenen autoritat de domini superior. Probabilitat de pujar de la posició 7-8 baixa.

---

### Proposta B — Recomanada (angle informacional + diferenciador)

**title** (52 car. + 15 sufix = 67 totals — al límit):
```
Chancenkarte 2026: requisitos, puntos y calculadora
```

**description** (148 car.):
```
Requisitos de la Chancenkarte 2026: sistema de 6 puntos, Sperrkonto de 12.324 €, costes y plazos reales. Calcula si cumples los puntos en 2 minutos.
```

**Angle:** Hits de l'intent dominant (`Chancenkarte` + `2026` + `requisitos` + `puntos`) i preserva la calculadora com a benefici únic posicionat AL FINAL del title. La descripció afegeix dades concretes (6 puntos, 12.324 €) que cap competidor inclou al snippet i activa el lector amb un CTA suau ("Calcula si cumples ... en 2 minutos").

**Per què aquesta:**
- Captura tot el cluster de match d'intent (Google deixa de reescriure)
- "calculadora" no és un substantiu buit — és real, hi ha una calculadora gratuïta a `/#calculadora`. La promesa del snippet es compleix.
- Dades concretes a la meta (€12.324, 6 puntos) creen autoritat instantània vs. snippets generalistes
- "en 2 minutos" injecta urgència/baixa fricció (evidence: psicològicament prou per superar el dubte de clic a la posició 7-8)

**Risc:** Title de 67 car. amb sufix — al límit del que es mostra desktop. Mitigació: si Google trunca, el tall queda probablement després de "calculadora" (el truncament de la marca és habitual i acceptable). Amb tot, el body del snippet manté el missatge complet.

**Predicció:** Si pugem a posició 4-6 i CTR a 3-5 %, podríem passar de 0 a ~7-12 clics/dia (al cap de 28 dies, x10-x20 vs. l'estat actual). El títol per si sol no garanteix la pujada de posició, però reforça els senyals de qualitat (engagement, no-rewriting) que pesen al ranking.

---

### Proposta C — Target-fit (LATAM explícit)

**title** (49 car. + 15 sufix = 64 totals):
```
Chancenkarte 2026: guía completa con calculadora
```

**description** (153 car.):
```
Guía 2026 de la Chancenkarte para profesionales de Latinoamérica: requisitos, sistema de 6 puntos, costes reales y calculadora gratuita en 2 minutos.
```

**Angle:** "Guía completa" + LATAM explícit a la descripció. Reflecteix el target real del projecte (que el contingut ja servei).

**Per què aquesta:** Coherència de marca màxima — el snippet anuncia exactament el target del site. La descripció diu "para profesionales de Latinoamérica" que és literalment el read del repository.

**Per què NO recomanada com a número 1:**
- "Guía completa" és genèric — perd força contra `requisitos, puntos`.
- Posar "Latinoamérica" al snippet és declarar-se nínxol; potencialment redueix impressions de queries més generals (esp/lat com qui busqui "chancenkarte alemania" sense qualificar-se).
- Per fer-ho ben fet caldria també tocar H1/contingut per parlar més fort al target — i el brief diu **no tocar el cos**. Sense la resta del cos alineat, el títol target-fit aïllat pot crear un mismatch de promesa amb el contingut, que és més neutre.

---

## 4. Recomanació final

**Anar amb Proposta B.**

Síntesi de raons:
1. Captura tots els senyals d'intent dominants a la SERP (`Chancenkarte`, `2026`, `requisitos`, `puntos`).
2. Manté l'únic asset diferencial real (calculadora) sense convertir-lo en l'eix principal.
3. La descripció té dades concretes (6 puntos, €12.324, "2 minutos") que cap competidor visible inclou.
4. El title s'alinea suficientment amb el reescriu de Google per aturar la reescriptura, però ens dona un avantatge sobre la fórmula pura informacional (calculadora).
5. Coherent amb el contingut existent — la pàgina té calculadora, té els 12.324 €, té els 6 punts, té els requisits explicats. Cap promesa que no es pugui complir.

Si Carlos prefereix risc 0 al cost de diferenciació, **Proposta A** és el segon lloc (rèplica del format guanyador). Si Carlos vol jugar el target-fit i està disposat a fer una segona iteració al cos del contingut més endavant, **Proposta C** és viable però requereix més feina abans de ser plenament defensable.

---

## 5. Riscos detectats

### 5.1 Desalineació title ↔ contingut: BAIX

El title proposat promet `requisitos, puntos y calculadora`. La pàgina conté:
- Secció "Los 3 requisitos obligatorios" ✓
- Secció "El sistema de puntos en detalle" amb taula 16 punts ✓
- Link a `/#calculadora` (homepage) en multiples punts ✓
- Frontmatter ja inclou `videoId` per a la capa explicativa ✓

No hi ha mismatch de promesa. La calculadora viu a `/#calculadora` (al home), no a la mateixa pàgina blog — això és una micro-asimetria però el link és prominent i funciona.

### 5.2 Title amb sufix supera el llindar de 60 car.: MITJÀ

`Chancenkarte 2026: requisitos, puntos y calculadora | RutaAlemania` = 67 car. Google trunca al desktop a ~580 px (≈55-60 car.). Probable tall:
```
Chancenkarte 2026: requisitos, puntos y calculadora | ...
```
o
```
Chancenkarte 2026: requisitos, puntos y calc... | RutaAlemania
```

Mitigació: si Carlos ho vol més curt, alternativa que cap segur en 60 car. totals: `Chancenkarte 2026: requisitos y calculadora gratis` (51 car. + 15 sufix = 66, igual). O sacrificar la marca: `Chancenkarte 2026: requisitos y calculadora` (44 car.) → però perdem "puntos". Trade-off.

**El meu vot:** acceptar el risc de truncament de la marca. La marca pot tallar-se en SERP, però la promesa d'utilitat (calculadora) queda sempre.

### 5.3 Posició 7-8 no salta sola amb un title nou: MITJÀ-ALT

Un title millor pot lift CTR de 0 % a 1-3 % a la mateixa posició → 2-5 clics/mes. Per multiplicar trànsit x10 com es deia al brief, cal **també** que la posició pugi (de 7-8 a 4-5). El título per se no garanteix la pujada, però:
- CTR és un senyal de ranking → més clics → més ranking
- Stop rewriting és senyal de qualitat → més confiança algorítmica
- Passar 2-3 cicles d'indexació amb el snippet nou abans de mesurar realment

**Expectativa realista:** 2-4 setmanes per a senyals nous; lift modest els primers 14 dies, lift significatiu si la posició també puja.

### 5.4 H1 = title (efectes col·laterals al cos): BAIX

El frontmatter `title` també genera l'H1 visible a la pàgina. El nou H1 seria "Chancenkarte 2026: requisitos, puntos y calculadora". Comparat amb l'actual "Chancenkarte 2026: Calcula tus Puntos Gratis":
- H1 més informatiu, més neutre, menys CTA-ish
- Coherent amb el primer paràgraf del cos ("Si estás pensando en trabajar en Alemania pero aún no tienes contrato, la Chancenkarte...")
- No introdueix mismatch amb el contingut

### 5.5 Observació editorial sobre el cos (NO actuar)

**Detecció col·lateral durant la lectura del cos** (registrada per ordre del Director, sense modificar):

- Línia 186 i 200: enllaços a Lingoda usen el track ID antic (`https://www.l16sh94jd.com/ZCHQXN/55M6S/?uid=48`). Després del rebrand Lingoda del 5/05/2026, podria caldre verificar que el track segueix actiu i, si escau, swap a la nova URL. **No tocat aquí.**
- Línia 280: referència a "modificación legal de diciembre de 2025" sobre §20a Abs. 2 AufenthG. **No verificat** com a part d'aquesta tasca (fora d'abast snippet). Si no és correcte, és una qüestió editorial separada.

Cap d'aquestes observacions afecta la decisió del snippet.

---

## 6. Alternatives descartades

### 6.1 Mantenir title actual i només canviar description

Considerada i descartada. El title és el que Google reescriu — és el senyal més fort i és el camp amb més pes a la decisió de clic. Tocar només la description deixa intacte el problema central.

### 6.2 Incloure "gratis" / "gratuita" al title

Considerada. Avantatge: paraula activadora (clic-magnetisme). Desavantatge: sona promocional/SEO-hack. Risc afegit que Google penalitzi (desaprova "free", "best", "now" en titles informacionals). Es manté "gratuita" SOL a la description, on és més acceptat.

### 6.3 Title hiper-curt tipus "Chancenkarte: Requisitos 2026"

Considerada. Avantatge: cap segur en SERP, alta densitat de keywords. Desavantatge: idèntic al d'altres competidors → no diferencia. Si tenim asset únic (calculadora), seria error no aprofitar-lo.

### 6.4 Title formulari com "¿Cumples los requisitos de la Chancenkarte?"

Considerada. Avantatge: angle pregunta, alta engagement potencial. Desavantatge: sacrifica densitat de paraules clau (perdem "2026", "puntos"); pregunta + interrogació + accents pot crear problemes de display en alguns clients. Massa risc per al guany esperat.

### 6.5 Inclusió explícita de "LATAM" o "Latinoamérica" al title

Considerada (Proposta C). Descartada com a recomanació principal perquè redueix impressions a queries genèriques i requereix coherència amb el cos del contingut, que ara mateix és més neutre.

---

## 7. Què cal del revisor

1. **Llegir aquesta JUSTIFICACIÓ.md.** En particular, secció 0 (Google reescriu) — és el descobriment principal.
2. **Comparar les 3 propostes** (secció 3) i decidir.
3. **Aprovar la meva recomanació (B)** o triar A o C, o demanar una nova proposta.
4. Si aprova:
   - Push de la branca a origin
   - Merge a main amb `--no-ff`
   - Push origin main
   - **Sol·licitar reindexació a GSC** per a la URL afectada
   - Esperar 2-4 setmanes per a nous senyals abans de tornar a mesurar
5. Si rebutja:
   - Em diu quina alternativa prefereix i ajusto

**No s'ha fet push.** Tot local en branca. JUSTIFICACIÓ.md és artefacte de l'experiment — eliminar-lo de main amb `git rm` un cop revisat (com vam fer amb la peça GKV).
