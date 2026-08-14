// src/data/cifras.ts
// Fichero único de hechos datados del sitio — borrador 1 del fichero canónico
// de hechos de Germania («D-B»). Origen: saneo de afiliados 2026-07
// (repo ops: docs/saneo-afiliados-2026-07.md, §«Decisiones previas — TOMADAS»).
//
// Regla: ninguna cifra anual/legal/de producto se hardcodea en artículos,
// carruseles o componentes. Se escribe aquí —con vigencia, fecha de
// verificación y fuente— y desde aquí se consume (imports) o se contrasta
// (test-guardián para los .md).
//
// Verificación exterior del paquete 2026-07-30: Director + Claude estratégico.

// 'coef': coeficientes adimensionales (fórmula del §32a, ratios de hogar,
// factores declarados). Unidades de coste de vida añadidas el día 143:
// '€/m²/mes' (alquiler frío, Nebenkosten), 'm²' (tamaño), 'kWh/año'
// (consumo eléctrico), '€/kWh' (precio eléctrico).
// 'USD-PPA/mes': dólares internacionales a paridad de poder adquisitivo
// (ILOSTAT). NO se convierten a euros: si los dos lados de una división
// están en la misma unidad, el cociente es válido y no hay nada que
// convertir (día 143).
// 'puestos': conteo de vacantes de empleo (tanda del alemán, día 147) —
// primera unidad de conteo del fichero; solo para cifras de mercado laboral.
export type Unidad =
  | '€' | '€/mes' | '€/año' | '€/28días' | '%' | 'coef'
  | '€/m²/mes' | 'm²' | 'kWh/año' | '€/kWh' | 'USD-PPA/mes' | 'puestos'
  | 'meses' | 'años' | 'año' | 'mensualidades';
// 'estimacion': valor asumido y declarado como tal (sin fuente que lo fije);
// existe para que las estimaciones no se disfracen de hechos.
// 'solvente': fuente seria NO gubernamental (DMB, Stromspiegel, BDEW…) —
// la palabra del criterio del Director: oficial donde exista, solvente
// donde no, y anotado siempre (2026-07-31).
export type TipoFuente = 'oficial' | 'comercial' | 'derivada' | 'estimacion' | 'solvente';

/**
 * Pauta de re-verificación — el campo del VIGÍA (día 143, 2026-07-31).
 * `verificado` dice cuándo se miró; esto dice cuándo TOCA volver a mirar.
 * Dos naturalezas medidas, que no se vigilan igual:
 *  - 'calendario': el dato cambia en fecha conocida de antemano
 *    (`proxima`, formato 'AAAA-MM').
 *  - 'deriva': envejece sin fecha concreta (`umbral_meses` desde
 *    `verificado`). Umbral ausente = pendiente del Director — la
 *    naturaleza es evidente, el plazo es criterio suyo.
 * Reglas: el `porque` viaja siempre (quién/qué cambia el dato). Las
 * derivadas (`deriva_de`) HEREDAN la pauta de sus bases y no llevan campo.
 * Cifra sin `revision` y sin `deriva_de` = pauta PENDIENTE, declarada —
 * el vigía la lista, no la esconde. Instrumento: scripts/vigia.py (ops).
 */
export interface Revision {
  /** 'evento': sin reloj por decisión — se revisa cuando ocurra el evento
   *  nombrado en `porque` (p. ej. la ronda C del gradiente), no por fecha. */
  tipo: 'calendario' | 'deriva' | 'evento';
  /** calendario: cuándo toca mirar ('AAAA-MM'). */
  proxima?: string;
  /** deriva: meses desde `verificado` para re-mirar. Ausente = umbral pendiente del Director. */
  umbral_meses?: number;
  /** Quién/qué cambia el dato y por qué esta pauta. */
  porque: string;
}

export interface Cifra {
  valor: number;
  unidad: Unidad;
  /** Período al que aplica el HECHO (no cuándo se comprobó). */
  vigencia: string;
  /** Fecha de la última verificación contra la fuente (ISO). */
  verificado: string;
  /** Cuándo toca re-verificar — ver interface Revision (el vigía). */
  revision?: Revision;
  /** A quién aplica el hecho, cuando depende del caso. */
  aplica_a?: 'chancenkarte' | 'estudios' | 'empleados';
  fuente: { nombre: string; url?: string; tipo: TipoFuente };
  /** Para derivadas: ids de las cifras base. La aritmética se vigila por test. */
  deriva_de?: string[];
  nota?: string;
}

/**
 * CRITERIO ÚNICO del simulador (decisión del Director, día 143, noche):
 * UN SOLO escenario — el de quien llega. Sueldo del que empieza (se
 * publica el CUARTIL INFERIOR: la mediana oficial incluye toda la
 * antigüedad y sobrestimaría al recién llegado) y gastos a PRECIO DE
 * MERCADO (cesta EVS completa, alquiler de oferta): quien llega cobra
 * menos, pero paga los precios como todo el mundo. El porqué entero de
 * esta decisión —y de la retirada de los «dos estados» el mismo día—
 * vive en docs/metodo-datos-simulador.md §0: no re-litigar sin leerlo.
 * El JSON vigente aún deriva la mediana: el cambio de columna publicada
 * llega con la regeneración.
 */
export const CIFRAS = {
  // ─── Sperrkonto ──────────────────────────────────────────────────────────
  'sperrkonto.chancenkarte.mes': {
    valor: 1091,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2026-09', porque: 'Ligado al baremo de ayudas al estudio: cambia con el curso académico (septiembre). Último cambio: septiembre de 2024; desde entonces NO se ha movido — encontrar el mismo importe al revisar es lo normal, no un fallo. Grado: un solo precedente, no una regla (declarado, Director día 143)' },
    aplica_a: 'chancenkarte',
    fuente: {
      nombre:
        'Auswärtiges Amt (páginas consulares de la Chancenkarte) + Bundesagentur für Arbeit, Stand 2026',
      tipo: 'oficial',
    },
    nota:
      'El sitio publicaba 1.027 €/mes / 12.324 €/año — la cifra de 2024. Expatrio también publica la de 2024: demostración de por qué la fuente canónica de un hecho no puede ser un afiliado.',
  },
  'sperrkonto.chancenkarte.anno': {
    valor: 13092,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-30',
    aplica_a: 'chancenkarte',
    fuente: { nombre: 'mensual × 12', tipo: 'derivada' },
    deriva_de: ['sperrkonto.chancenkarte.mes'],
  },
  'sperrkonto.estudios.mes': {
    valor: 992,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2026-09', porque: 'Ligado al baremo de ayudas al estudio: cambia con el curso académico (septiembre). Último cambio: septiembre de 2024; desde entonces NO se ha movido — encontrar el mismo importe al revisar es lo normal, no un fallo. Grado: un solo precedente, no una regla (declarado, Director día 143)' },
    aplica_a: 'estudios',
    fuente: {
      nombre: 'Normativa alemana (importe ligado a BAföG), confirmado en múltiples fuentes 2026',
      tipo: 'oficial',
    },
  },
  'sperrkonto.estudios.anno': {
    valor: 11904,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-30',
    aplica_a: 'estudios',
    fuente: { nombre: 'mensual × 12', tipo: 'derivada' },
    deriva_de: ['sperrkonto.estudios.mes'],
  },

  // ─── Umbrales salariales de visado (día 144, 2026-08-01) ────────────────
  // POR QUÉ ENTRAN AHORA: el sitio publicaba umbrales de Blue Card y del
  // §19c SIN NINGUNA entrada canónica contra la que contrastarlos. No es que
  // el guardián no los vigilara: es que no existía el hecho. Resultado
  // medido el día 144: blue-card-requisitos.md publicaba dos cifras que NO
  // corresponden a ningún año, las dos por debajo de las reales, y trabajar-en-it
  // publicaba una regla equivocada («60 % de la BBG»; es el 45 %). Los
  // valores falsos retirados NO se transcriben aquí: el guardián los vigila
  // como fósiles, y escribirlos en este fichero lo dispararía. Viven en
  // informes/estrategics/ del repo de ops.
  // Los cuatro umbrales cuelgan de la MISMA base —la BBG de pensiones— así
  // que se datan juntos y con ella: si la base cambia, cambian los cuatro.
  'bluecard.general.anno': {
    valor: 50700,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-08-01',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Es el 50 % de la BBG de pensiones, que se fija cada año por reglamento; el BMI publica el importe en el Bundesanzeiger en diciembre' },
    fuente: { nombre: 'Bekanntmachung del BMI de 2-dic-2025, BAnz AT 18.12.2025 B3 (§18g Abs. 1 S. 1 AufenthG)', tipo: 'oficial' },
    nota: 'Hasta el día 144 el sitio publicaba una cifra que no corresponde a ningún año y que quedaba por debajo de esta. Fallaba en la dirección peligrosa: con una oferta de 47.000 € el lector se creía dentro y estaba fuera. El valor retirado se registra en informes/estrategics/ del repo de ops, no aquí — el guardián lo vigila como fósil y volver a escribirlo aquí lo dispararía.',
  },
  'bluecard.deficitarias.anno': {
    valor: 45934.2,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-08-01',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Es el 45,3 % de la BBG de pensiones; misma publicación anual que el umbral general' },
    fuente: { nombre: 'Bekanntmachung del BMI de 2-dic-2025, BAnz AT 18.12.2025 B3 (§18g Abs. 1 S. 2 y Abs. 2 AufenthG)', tipo: 'oficial' },
    nota: 'Aplica a Mangelberufe y a titulados cuyo título no pase de 3 años en el momento de la solicitud (§ 18g Abs. 1 Satz 2 Nr. 2; borde fijado por T10 C4 — antes esta nota decía «de hace menos de 3 años», sin punto de referencia). Hasta el día 144 el sitio publicaba una cifra que no corresponde a ningún año, por debajo de esta. El valor retirado se registra en informes/estrategics/ del repo de ops, no aquí — el guardián lo vigila como fósil y volver a escribirlo aquí lo dispararía.',
  },
  'bluecard.tasa.primera': {
    valor: 100,
    unidad: '€',
    vigencia: 'desde 2017-09-01',
    verificado: '2026-08-09',
    revision: { tipo: 'evento', porque: 'Importe de norma (§ 45 Nr. 1 AufenthV, versión de la ley de tasas de 13-7-2017): cambia por reforma, no por calendario' },
    fuente: { nombre: '§ 45 Nr. 1 AufenthV — ambos tramos de duración dicen 100 € (veredicto T10 Q6, literal citado, páginas no abiertas: tres fuentes coincidentes)', tipo: 'oficial' },
    nota: 'Primera emisión de la Blue Card. Hasta T10 el artículo decía «aproximadamente 100 €»: el literal permite la cifra cerrada. La tasa consular del VISADO es un coste aparte y su importe NO está verificado (ANEXO-1 del veredicto T10): no tiene clave aquí porque no hay dato que custodiar.',
  },
  'beschv6.umbral.anno': {
    valor: 45630,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-08-01',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Es el 45 % de la BBG de pensiones; el BMI lo publica cada diciembre' },
    fuente: { nombre: 'Bekanntmachung del BMI de 2-dic-2025, BAnz AT 18.12.2025 B1 (§19c Abs. 2 AufenthG + §6 BeschV)', tipo: 'oficial' },
    nota: 'La regla es el 45 % de la BBG, NO el 60 %: el 60 % era la norma de especialistas IT anterior a marzo de 2024 y sigue viva en páginas de embajada desfasadas. El rango «44.000-46.000 €» que publicaba el sitio contenía el valor bueno por accidente; lo grave era la regla, porque se recalcula cada año.',
  },
  'beschv6.umbral.mes': {
    valor: 3802.5,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-08-01',
    fuente: { nombre: 'anual ÷ 12', tipo: 'derivada' },
    deriva_de: ['beschv6.umbral.anno'],
  },
  'fachkraft.mayor45.anno': {
    valor: 55770,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-08-01',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Es el 55 % de la BBG de pensiones' },
    fuente: { nombre: 'Bekanntmachung del BMI de 2-dic-2025 (§18 Abs. 2 Nr. 5 AufenthG)', tipo: 'oficial' },
    nota: 'PASA A PUBLICARSE el día 150 (tanda T6): trabajar-en-it-alemania.md lo publica en dos sitios, y el guardián de cifras vivas lo vigila desde el mismo commit. — DOS PUERTAS, UN SOLO IMPORTE: además del §18 Abs. 2 Nr. 5 AufenthG, el mismo 55 % lo impone el §1 Abs. 2 Satz 1 BeschV para los §§6, 22a, 24a y 26 Abs. 2 cuando el empleo SE INICIA después de cumplir 45 años; si cambia la BBG cambian las dos. Excepciones de esa vía: previsión de jubilación adecuada, o interés público en la contratación (§1 Abs. 2 Satz 2-3; Fachliche Weisungen de la BA 19c.1.4 y 19c.1.5). La edad se mide al INICIAR el empleo, no al solicitar. — (Texto anterior, día 144: «HOY NO SE PUBLICA en ninguna página del sitio». Se dató por adelantado justo para este momento, y funcionó: la cifra llegó al artículo con su ficha ya hecha.)',
  },

  // ─── Mercado laboral (tanda del alemán, 4-ago-2026) ─────────────────────
  // Grado de origen: verificación [web] del chat estratégico del 4-ago-2026
  // (convención c7cebd9), NO medidas por CCode contra la fuente. Son las DOS
  // medidas de vacantes que existen — registradas (BA) y oferta total (IAB) —
  // y nunca se publica «vacantes» sin decir cuál de las dos se cuenta.
  'mercado.vacantes.registradas.ba': {
    valor: 641000,
    unidad: 'puestos',
    vigencia: '2026-04',
    verificado: '2026-08-04',
    revision: { tipo: 'calendario', proxima: '2026-09', porque: 'La Bundesagentur für Arbeit publica el stock de vacantes registradas cada mes; se re-mira en la cita del vigía de septiembre o al tocar el artículo. Marzo-2026: 638.000. En 2024 estuvo en ~700-706.000 — el «700.000» del sitio fue cierto y dejó de serlo.' },
    fuente: { nombre: 'Bundesagentur für Arbeit, informe mensual del mercado de trabajo (abril 2026)', tipo: 'oficial' },
    nota: 'Solo las comunicadas a la agencia. La oferta total de la economía es mercado.vacantes.total.iab.',
  },
  'mercado.vacantes.total.iab': {
    valor: 1150000,
    unidad: 'puestos',
    vigencia: '2026-T1',
    verificado: '2026-08-04',
    revision: { tipo: 'calendario', proxima: '2026-11', porque: 'IAB-Stellenerhebung: sondeo trimestral; el T2-2026 se publica en otoño. Máximo histórico: ~2 M en T4-2022 — el valor actual está un 42 % por debajo (la demanda se enfrió; publicar «va en aumento» fue la mitad de la falsedad retirada).' },
    fuente: { nombre: 'IAB-Stellenerhebung, 1er trimestre de 2026', tipo: 'oficial' },
    nota: 'Incluye los puestos que las empresas no comunican a la BA.',
  },
  'mercado.parados_por_100_vacantes': {
    valor: 264,
    unidad: 'coef',
    vigencia: '2026-T1',
    verificado: '2026-08-04',
    revision: { tipo: 'calendario', proxima: '2026-11', porque: 'Misma publicación trimestral del IAB que la oferta total' },
    fuente: { nombre: 'IAB, 1er trimestre de 2026 (parados por cada 100 vacantes registradas)', tipo: 'oficial' },
    nota: 'El dato del DESAJUSTE: mercado débil con problema de encaje, no de volumen. Sostiene el cierre del párrafo de trabajar-alemania-sin-aleman:18.',
  },
  'mercado.anuncios_sin_aleman.indeed': {
    valor: 2.7,
    unidad: '%',
    vigencia: 'sept-2023–ago-2024',
    verificado: '2026-08-04',
    revision: { tipo: 'calendario', proxima: '2027-08', porque: 'Hiring Lab publica análisis anuales; sin serie fija — si no hay edición nueva, la cifra envejece y se retira antes que extrapolarse' },
    fuente: { nombre: 'Hiring Lab / Indeed, media sept-2023–ago-2024', tipo: 'solvente' },
    nota: 'REFERENCIA DE ORDEN, no medida de accesibilidad: mide anuncios que DECLARAN expresamente no requerir alemán, no «ofertas accesibles sin alemán». El texto visible mantiene la distinción — no convertir nunca en «solo el 2,7 % del mercado es accesible». Sustituye a la escalera 15/30/70/95 retirada (sin fuente localizable, guardián la vigila).',
  },

  // ─── JAEG (umbral GKV/PKV para empleados) ───────────────────────────────
  'jaeg.anno': {
    valor: 77400,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: {
      nombre: 'Sozialversicherungs-Rechengrößenverordnung 2026 (BMAS)',
      tipo: 'oficial',
    },
    nota:
      'seguro-medico-alemania.md ya la publica bien y datada (69.300 → 2024, 73.800 → 2025, 77.400 → 2026). El carrusel seguromedico.ts y cuanto-cuesta-vivir:96 publicaban la de 2024.',
  },
  'jaeg.mes': {
    valor: 6450,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    aplica_a: 'empleados',
    fuente: { nombre: 'anual / 12', tipo: 'derivada' },
    deriva_de: ['jaeg.anno'],
  },
  // EL UMBRAL DE NO RETORNO — saldo de la deuda §8.34 de ESTADO (abierta el
  // día 164, saldada el 166). El nodo 2 lo locutó por `permitirDigitos` con su
  // motivo escrito, porque este fichero vive en el repo del SITIO y tocarlo es
  // un despliegue; hasta hoy el 55 quedaba SIN FECHA, SIN FUENTE Y SIN QUIEN
  // LO REVISE — un `permitirDigitos` es una cadena en un Set y no llega al
  // manifiesto; un `{{cifra.*}}` arrastra vigencia, verificado, fuente y
  // revisión. Viaja gratis en el despliegue del nodo 3.
  // ⚠️ NO es un importe y no cambia con las Rechengrößen: es una EDAD fijada
  // por ley. Por eso `revision.tipo: 'evento'` y no 'calendario' — no tiene
  // fecha conocida de antemano; se mira si se reforma el § 6 SGB V.
  'pkv.no_retorno.edad': {
    valor: 55,
    unidad: 'años',
    vigencia: '2026',
    verificado: '2026-08-14',
    revision: {
      tipo: 'evento',
      porque: 'Edad fijada por ley, sin reloj anual. Se revisa si se reforma el § 6 SGB V — que YA se movió: el § 6 Abs. 3b es nuevo desde el 1-ene-2026 (R46).',
    },
    fuente: { nombre: '§ 6 Abs. 3a SGB V (fijado por ley)', tipo: 'oficial' },
    nota:
      'Cumplidos los 55, la vuelta a la pública es prácticamente imposible, y ESO SÍ LO DICE LA LEY — canon R46, que registra expresamente que esa formulación vale por NO ser un absoluto. Antes de los 55 hay vías CONFIRMADAS (§ 5 Abs. 1 Nr. 1 y Nr. 2, § 10), pero LA LISTA NO ESTÁ CERRADA: el chat verificó que faltaba al menos una, no que con ella estén todas. Y la vuelta por empleo NO es automática (§ 205 Abs. 2 VVG: tres meses para cancelar la póliza privada o se pagan los dos seguros). — HOY NO SE PUBLICA en ninguna página del sitio: entra para que el número tenga ficha antes de que alguna la necesite, que es lo que funcionó con fachkraft.mayor45.anno.',
  },

  // ─── Trámites de llegada (tanda T4, 7-ago-2026) ─────────────────────────
  // Los DOS únicos importes de `primeros-pasos` que no tenían custodia — y la
  // tanda destapó POR QUÉ ninguno la tenía: son números que pueden moverse SIN
  // QUE CAMBIE SU LEY (la IntV fija un porcentaje; el VerpackG, un mínimo).
  // Invisibles para cualquier vigía que mire leyes.
  'integrationskurs.hora': {
    valor: 2.29,
    unidad: '€/hora lectiva',
    vigencia: '2026',
    verificado: '2026-08-07',
    revision: { tipo: 'evento', porque: 'El § 9 Abs. 1 IntV NO fija el importe: fija el 50 % del Kostenerstattungssatz del § 20 Abs. 6. El euro se mueve sin tocar la IntV — vigilar el FAQ del BAMF, no la norma' },
    aplica_a: 'participantes del Integrationskurs sin exención',
    fuente: { nombre: 'BAMF, FAQ «Was kostet ein Integrationskurs?» (act. 1-7-2026) + formulario KNr. 630.027r ed. 07/2026', tipo: 'oficial' },
    nota:
      'Vigente para quien se inscribió a partir del 1-8-2022. Un curso general de 700 horas sale a ~1.603 € [calc: 2,29 × 700 = 1.603]. ⚠️ DATO QUE ERA DINERO Y NO PUBLICÁBAMOS: quien aprueba el examen final dentro de los dos años recupera la mitad. Gratuito con ayudas sociales.',
  },
  'pfand.einweg.minimo': {
    valor: 0.25,
    unidad: '€/envase',
    vigencia: '2026',
    verificado: '2026-08-07',
    revision: { tipo: 'evento', porque: 'importe de norma (§ 31 VerpackG); cambia por reforma' },
    aplica_a: 'envases de bebida de un solo uso (Einweg)',
    fuente: { nombre: '§ 31 Abs. 1 Satz 1 VerpackG', tipo: 'oficial' },
    nota:
      '⚠️ ES UN MÍNIMO LEGAL, NO UN IMPORTE ÚNICO: el literal dice «ein Pfand in Höhe von MINDESTENS 0,25 Euro». Y solo vale para Einweg. En Mehrweg no hay norma que fije importe: lo pone cada embotellador, típicamente 8 cts hasta 0,5 l y 15 por encima, más ~1,50 € por caja. Publicarlo como «0,25 € por envase» era la falta que corrigió T4 en dos superficies.',
  },

  // ─── Reconocimiento de títulos (tanda T2, 7-ago-2026) ───────────────────
  // Única cifra del artículo que puede envejecer sola: es una tasa pública.
  // El artículo la publicaba sin segundo escalón y sin reloj.
  'zab.zeugnisbewertung.primera': {
    valor: 200,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-08-07',
    revision: { tipo: 'evento', porque: 'BQPGebVO del Land de Berlín (últ. modif. junio 2024): cambia por reforma de la norma de tasas, no por calendario' },
    aplica_a: 'Zeugnisbewertung de la ZAB, primera valoración',
    fuente: { nombre: 'kmk.org/zab «Gebühren Zeugnisbewertung» + ficha oficial de service.bremen.de (actualizada 4-5-2026)', tipo: 'oficial' },
    nota:
      'Verificada en la tanda T2 (P13). ⚠️ NO confundir con un reconocimiento: la Zeugnisbewertung es una valoración comparativa y no otorga derechos (canon R51). 🕳️ El rango de las tasas SANITARIAS que publica el mismo cuadro del artículo (150-1.000 €) NO está verificado y así se declaró: no tiene entrada aquí porque no hay dato que custodiar.',
  },
  'zab.zeugnisbewertung.siguientes': {
    valor: 100,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-08-07',
    revision: { tipo: 'evento', porque: 'misma norma de tasas que la primera valoración' },
    aplica_a: 'Zeugnisbewertung de la ZAB, valoraciones posteriores a la primera',
    fuente: { nombre: 'kmk.org/zab «Gebühren Zeugnisbewertung»', tipo: 'oficial' },
    nota:
      'Dato NUEVO que el artículo no daba: cambia la cuenta a quien tiene dos títulos. Llegó en el veredicto de T2 sin haberse preguntado por él.',
  },

  // ─── Tasa del visado nacional (tanda T5, 7-ago-2026)
  // Entra porque era la ÚNICA cifra de la tabla de costes de `chancenkarte` que
  // es un precio público fijado por norma — el resto son horquillas de mercado
  // (clase D) y siguen fuera a propósito. Nadie la vigilaba.
  'visado.nacional.tasa': {
    valor: 75,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-08-07',
    revision: { tipo: 'evento', porque: 'No es cifra indexada ni de revisión anual: sin cambios desde el 1-9-2017 y solo se mueve por ley de tasas. La pauta de EVENTO (y no de calendario) la recomendó el propio veredicto de T5 en su válvula' },
    aplica_a: 'visado nacional alemán (categoría D), también para entradas múltiples',
    fuente: { nombre: '§ 46 Abs. 2 Nr. 1 AufenthV — literal: «für die Erteilung eines nationalen Visums (Kategorie „D“), auch für mehrmalige Einreisen 75 Euro»', tipo: 'oficial' },
    nota:
      'Verificada en la tanda T5 (Q7), CORRECTA. Vigente desde la Ley de modificación de tasas del derecho de extranjería de 13-7-2017, en vigor el 1-9-2017, sin modificaciones posteriores. ⚠️ NO confundir con la tasa de un visado Schengen (categoría C), que es otra.',
  },

  // ─── Bezugsgröße y sus derivadas (tanda T1, 6-ago-2026 · SELLO 9-ago-2026)
  // La condición escrita aquí el 6-ago SE CUMPLIÓ el 9-ago: la Bezugsgröße 2026
  // llegó verificada en fuente oficial (sello del chat; constancia en ops:
  // informes/estrategics/sello-bezugsgroesse-r47-2026-08-09.md) y entra como
  // clave propia; las dos derivadas cuelgan con `deriva_de` y quedan
  // CONFIRMADAS: 3.955 ÷ 3 = 1.318,33 · 3.955 ÷ 7 = 565. El contraste cruzado
  // del 6-ago predijo el valor oficial AL EURO.
  'bezugsgroesse.mes': {
    valor: 3955,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-08-09',
    revision: { tipo: 'calendario', proxima: '2026-11', porque: 'La SVBezGrV del año siguiente se aprueba y publica en OTOÑO (la de 2026: Bundesrat conforme 21-11-2025, V. de 24-11-2025), efectiva el 1 de enero — el valor 2027 se conoce en noviembre, no en enero' },
    fuente: {
      nombre: '§ 18 SGB IV · SVBezGrV 2026 § 1 (V. de 24-11-2025, BGBl. 2025 I Nr. 278) — sello del chat 9-ago-2026, CERRADO el mismo día a [fuente] sin resto: gesetze-im-internet.de/svbezgrv_2026 ABIERTA POR EL DIRECTOR (concordancia total con el extracto) · circular Fin 593 (12/2025), Administración de Berlín, abierta entera por el chat',
      tipo: 'oficial',
    },
    nota:
      'Literal del § 1, verbatim: «Die Bezugsgröße nach § 18 des Vierten Buches Sozialgesetzbuch für das Jahr 2026 beträgt 47 460 Euro. Umgerechnet auf den Monat ergeben sich 3 955 Euro.» (el original separa millares con ESPACIO). Anual: 47.460 €. SIN distinción oeste/este: unificada desde el 1-1-2025 (Rentenüberleitungs-Abschlussgesetz, igualación en siete pasos desde 2019); la exposición de motivos (BR-Drs. 567/25) la llama de vigencia federal unitaria. Abreviatura oficial: SVBezGrV 2026 («SVRechGrV» es forma de fuentes secundarias, no usarla).',
  },
  'familienversicherung.limite_ingresos.mes': {
    valor: 565,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-08-09',
    aplica_a: 'cónyuge o pareja en Familienversicherung',
    fuente: { nombre: '§ 10 Abs. 1 Nr. 5 SGB V: un séptimo de la Bezugsgröße mensual (3.955 ÷ 7 = 565) — la circular Fin 593 (12/2025) de Berlín escribe esa MISMA aritmética', tipo: 'derivada' },
    deriva_de: ['bezugsgroesse.mes'],
    nota:
      'Publicada en seguro-medico-alemania.md con la marca «en 2026» y el aviso de que cambia cada enero. El literal del parágrafo NO dice euros.',
  },
  'familienversicherung.limite_minijob.mes': {
    valor: 603,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-08-06',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Geringfügigkeitsgrenze: cambio anual, efectivo enero' },
    aplica_a: 'familiar con minijob en Familienversicherung',
    fuente: { nombre: '§ 10 Abs. 1 SGB V (remite a la Geringfügigkeitsgrenze) — euro derivado del valor 2026', tipo: 'derivada' },
  },
  'autonomo.base_minima.mes': {
    valor: 1318.33,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-08-09',
    aplica_a: 'autónomos en GKV',
    fuente: { nombre: '§ 240 Abs. 4 Satz 1 SGB V: la nonagésima parte de la Bezugsgröße por día natural, × 30 [calc] (3.955 ÷ 3 = 1.318,33)', tipo: 'derivada' },
    deriva_de: ['bezugsgroesse.mes'],
    nota:
      'Es el suelo de cotización. ⚠️ EL LITERAL NO DICE «UN TERCIO»: dice «der neunzigste Teil der monatlichen Bezugsgröße» POR DÍA NATURAL (§ 240 Abs. 4 Satz 1). El tercio mensual es aritmética nuestra [calc: 1/90 × 30 días]. La CUOTA mensual resultante NO se publica — falta un operando (el tipo de dependencia del autónomo). Frases 2-3 del Abs. 4 LEÍDAS (T7 Q8, dejure.org 8-ago-2026; versión en vigor desde 16-12-2023): dos excepciones regladas y para colectivos concretos — Satz 2: escolares de Fach-/Berufsfachschule, estudiantes de universidad extranjera y Wandergesellen (§ 236 i.V.m. § 245 Abs. 1); Satz 3: solicitantes de pensión con la condición de los nueve décimos — no para el autónomo en general.',
  },

  // ─── GKV (seguro público de salud) ──────────────────────────────────────
  'gkv.tipo_general': {
    valor: 14.6,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    fuente: { nombre: 'Fijado por ley (SGB V)', tipo: 'oficial' },
  },
  'gkv.zusatzbeitrag_medio': {
    valor: 2.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'El BMG publica el Zusatzbeitrag medio del año siguiente en otoño; efectivo enero' },
    fuente: { nombre: 'BMG / GKV-Spitzenverband (durchschnittlicher Zusatzbeitrag)', tipo: 'oficial' },
    nota:
      'Valor de ORIENTACIÓN del BMG (Bundesanzeiger) — NO una media observada. vdek (2026): el tipo efectivo superará claramente el 3 %. Rango real por caja: 2,18–4,39 %. El simulador calcula con este valor y lo declara en pantalla: neto optimista mientras el efectivo esté por encima (T7 C9, 8-ago-2026). El sitio publicaba «~1,5-2 %».',
  },
  'gkv.total_medio': {
    valor: 17.5,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-30',
    fuente: { nombre: '14,6 % + Zusatzbeitrag medio', tipo: 'derivada' },
    deriva_de: ['gkv.tipo_general', 'gkv.zusatzbeitrag_medio'],
    nota: 'El sitio publicaba «15,5-17 %».',
  },
  'gkv.bbg.mes': {
    valor: 5812.5,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    fuente: { nombre: 'Beitragsbemessungsgrenze KV/PV 2026 (BMG)', tipo: 'oficial' },
  },
  'salarios.mediana_2025_anual': {
    valor: 54066,
    unidad: '€/año',
    vigencia: '2025',
    verificado: '2026-08-08',
    revision: { tipo: 'calendario', proxima: '2027-04', porque: 'Destatis publica los Verdienste del ejercicio anterior en primavera' },
    fuente: { nombre: 'Destatis, nota de prensa PD26_113_621 (1-abr-2026)', tipo: 'oficial' },
    nota:
      'Mediana bruta ANUAL a jornada completa, con pagas extra. Es el operando de cuanto-cuesta:100 y del carrusel seguromedico («salario mediano» → parte GKV ~394 €/mes al 8,75 %). Alta T8 C2 (8-ago-2026): el «280-320 € con salario medio» que se publicaba correspondía a un bruto bajo el percentil 30.',
  },
  'salarios.media_2025_anual': {
    valor: 64441,
    unidad: '€/año',
    vigencia: '2025',
    verificado: '2026-08-08',
    revision: { tipo: 'calendario', proxima: '2027-04', porque: 'Destatis publica los Verdienste del ejercicio anterior en primavera' },
    fuente: { nombre: 'Destatis, nota de prensa PD26_113_621 (1-abr-2026)', tipo: 'oficial' },
    nota:
      'Media bruta anual a jornada completa, con pagas extra. NO se usa como operando de la parte GKV: supera la BBG KV (69.750 €/año) y el cálculo lineal deja de valer — la cuota se topa en ~509 €/mes. Se guarda como dato (T8, 8-ago-2026).',
  },
  'wg.habitacion_media': {
    valor: 512,
    unidad: '€/mes',
    vigencia: 'verano 2026',
    verificado: '2026-08-08',
    revision: { tipo: 'calendario', proxima: '2027-02', porque: 'El MMI publica por semestre universitario (SoSe/WiSe)' },
    fuente: { nombre: 'Moses Mendelssohn Institut + WG-Gesucht.de, SoSe 2026 (n=10.542)', tipo: 'solvente' },
    nota:
      'Media nacional ponderada por estudiantes; Warmmiete con luz, internet y mobiliario de zonas comunes. Extremos medidos: Múnich 800 €, Bielefeld 375 / Bochum 385. Solo plazas en 89 ciudades universitarias, WG de 2-3 personas, precios de OFERTA. Operando de cuanto-cuesta:80 (T8 C5).',
  },
  'gkv.empleador_max_kv.mes': {
    valor: 508.59,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    fuente: { nombre: 'BBG × (total medio / 2)', tipo: 'derivada' },
    aplica_a: 'todos los asegurados en GKV',
    nota:
      'Beitragsbemessungsgrenze: el TECHO sobre el que se cotiza en el seguro de salud. ' +
      '⚠️ FICHA CORREGIDA EL 6-ago-2026 (día 149): esta entrada describía «Aportación máxima del empleador al seguro de salud», ' +
      'que es lo que describe `gkv.empleador_max_kv.mes` (508,59 €) — la nota estaba copiada de otra clave. ' +
      'Y su `deriva_de` se apuntaba A SÍ MISMA. El VALOR siempre fue correcto y nada publicado dependía de la nota. ' +
      'Se retira el `deriva_de` (la BBG es cifra primaria, no derivada) y NO se rellena `fuente`: atribuirla exigiría ' +
      'verificar de qué norma sale, y eso no es de esta sesión. Hueco declarado. ' +
      'Consumidores conocidos: `gkv.empleador_max_kv.mes` y el aviso del § 223 en seguro-medico-alemania.md.',
  },
  'gkv.empleador_max_pflege.mes': {
    valor: 104.63,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    fuente: { nombre: 'BBG y tipos Pflege 2026 (BMG)', tipo: 'oficial' },
    nota: 'Tope del empleador en Pflegeversicherung. Conjunto KV + PV: 613,22 €/mes.',
  },

  // ─── Expatrio (proveedor Sperrkonto — afiliado, referral directo) ───────
  'expatrio.alta': {
    valor: 119,
    unidad: '€',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Precio comercial (afiliado/proveedor): umbral 6 meses, o antes si un saneo lo toca (Director, día 143)' },
    fuente: { nombre: 'expatrio.com — página comercial (EN y ES coinciden)', tipo: 'comercial' },
    nota:
      'Subida de precios del 2026-07-07 (aviso Awin). Su propio Help Center aún publicaba 89 €/5 € en un artículo «actualizado» el 2026-05-28: manda la página comercial, que es la que cobra (D-1).',
  },
  'expatrio.mes': {
    valor: 9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Precio comercial (afiliado/proveedor): umbral 6 meses, o antes si un saneo lo toca (Director, día 143)' },
    fuente: { nombre: 'expatrio.com — página comercial (EN y ES coinciden)', tipo: 'comercial' },
    nota: 'El sitio publicaba 0 € de alta / 5,90 €/mes.',
  },
  'expatrio.primer_anno': {
    valor: 227,
    unidad: '€/año',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    fuente: { nombre: 'alta + 12 mensualidades', tipo: 'derivada' },
    deriva_de: ['expatrio.alta', 'expatrio.mes'],
  },

  // ─── Fintiba (proveedor Sperrkonto — sin afiliación) ────────────────────
  'fintiba.alta': {
    valor: 159,
    unidad: '€',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Precio comercial (afiliado/proveedor): umbral 6 meses, o antes si un saneo lo toca (Director, día 143)' },
    fuente: { nombre: 'fintiba.com — página comercial', tipo: 'comercial' },
    nota: 'El sitio publicaba 0 € de alta / 4,90 €/mes.',
  },
  'fintiba.mes': {
    valor: 9.9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Precio comercial (afiliado/proveedor): umbral 6 meses, o antes si un saneo lo toca (Director, día 143)' },
    fuente: { nombre: 'fintiba.com — página comercial', tipo: 'comercial' },
  },
  'fintiba.primer_anno': {
    valor: 277.8,
    unidad: '€/año',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    fuente: { nombre: 'alta + 12 mensualidades', tipo: 'derivada' },
    deriva_de: ['fintiba.alta', 'fintiba.mes'],
  },

  // ─── Lyca Mobile (afiliado Awin — D-3: el afiliado no se toca) ──────────
  'lyca.paquete_desde': {
    valor: 4.99,
    unidad: '€/28días',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Precio comercial (afiliado/proveedor): umbral 6 meses, o antes si un saneo lo toca (Director, día 143)' },
    fuente: { nombre: 'lycamobile.de', tipo: 'comercial' },
    nota:
      'Paquetes por ciclos de 28 días — 13 ciclos/año, no 12: el equivalente mensual real es ≈ 5,41 €/mes. El sitio decía «€/mes». Lyca cambia tarifas con frecuencia: vigencia corta, re-verificar en cada saneo.',
  },

  // ─── Nómina 2026 — motor del simulador ──────────────────────────────────
  // Paquete verificado 2026-07-31 (Director + Claude estratégico) contra el
  // texto legal (§32a EStG, SolzG, redacción vigente) y fuentes oficiales
  // (BMG, Rechengrößen 2026). Consumidor: src/data/motor-nomina-2026.ts.
  // La parte del trabajador de sanidad (KV, 8,75 %) NO está aquí: se deriva
  // de gkv.total_medio / 2 (verificada 2026-07-30, más arriba).
  'rv.trabajador': {
    valor: 9.3,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Rentenversicherung — SGB VI / Rechengrößen 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador. Total 18,6 %, mitad y mitad con el empleador.',
  },
  'alv.trabajador': {
    valor: 1.3,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitslosenversicherung — SGB III / Rechengrößen 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador. Total 2,6 %.',
  },
  'pv.trabajador.con_hijos': {
    valor: 1.8,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador, con hijos, fuera de Sajonia. 1,8 % = exacto con UN hijo: del 2.º al 5.º hijo <25 años el tipo real baja 0,25 puntos por hijo [fuente: veredicto T7 Q9]. El motor no modela la composición familiar — cobra de más a familias numerosas. Declarado, no resuelto (T7 C10, 8-ago-2026).',
  },
  'pv.trabajador.sin_hijos': {
    valor: 2.4,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026', tipo: 'oficial' },
    nota: 'Sin hijos, ≥23 años: el recargo de 0,6 puntos lo paga solo el trabajador.',
  },
  'pv.sachsen.con_hijos': {
    valor: 2.3,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026 (reparto especial de Sajonia)', tipo: 'oficial' },
    nota: 'Sajonia (en el simulador: Leipzig y Dresde) reparte la Pflege de otra forma.',
  },
  'pv.sachsen.sin_hijos': {
    valor: 2.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026 (reparto especial de Sajonia)', tipo: 'oficial' },
  },
  'rv.bbg.mes': {
    valor: 8450,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Rechengrößen y tipos de la seguridad social: cambio anual, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Beitragsbemessungsgrenze RV/ALV 2026 (Rechengrößen, BMAS)', tipo: 'oficial' },
    nota: 'Tope de pensiones Y desempleo — DISTINTO del de sanidad/dependencia (gkv.bbg.mes).',
  },
  'rv.bbg.anno': {
    valor: 101400,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'mensual × 12', tipo: 'derivada' },
    deriva_de: ['rv.bbg.mes'],
  },

  // IRPF §32a EStG 2026 — la ley no define tramos con tipo fijo sino una
  // tarifa CONTINUA por fórmulas. Zonas: hasta el Grundfreibetrag → 0;
  // después dos zonas de progresión (polinomios en y/z = exceso/10.000)
  // y dos zonas proporcionales. La forma vive en motor-nomina-2026.ts.
  'irpf.grundfreibetrag': {
    valor: 12348,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Mínimo exento. El simulador publicaba 11.604 — el de 2024.',
  },
  'irpf.zona2.hasta': {
    valor: 17799,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona2.coef_a': {
    valor: 914.51,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: (914,51·y + 1.400)·y', tipo: 'oficial' },
  },
  'irpf.zona2.coef_b': {
    valor: 1400,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: (914,51·y + 1.400)·y', tipo: 'oficial' },
  },
  'irpf.zona3.hasta': {
    valor: 69878,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona3.coef_a': {
    valor: 173.1,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona3.coef_b': {
    valor: 2397,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona3.sumando': {
    valor: 1034.87,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona4.hasta': {
    valor: 277825,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona4.tipo': {
    valor: 42,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: 0,42·x − 11.135,63', tipo: 'oficial' },
  },
  'irpf.zona4.resta': {
    valor: 11135.63,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: 0,42·x − 11.135,63', tipo: 'oficial' },
  },
  'irpf.zona5.tipo': {
    valor: 45,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: 0,45·x − 19.470,38', tipo: 'oficial' },
  },
  'irpf.zona5.resta': {
    valor: 19470.38,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Tarifa del §32a EStG: cambia con el año fiscal, efectiva enero' },
    fuente: { nombre: '§32a EStG: 0,45·x − 19.470,38', tipo: 'oficial' },
  },

  // Recargo de solidaridad (Soli) 2026.
  'soli.freigrenze': {
    valor: 20350,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Parámetros del SolzG: anuales, efectivos enero' },
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Tributación individual. Por debajo o igual: Soli 0. El simulador publicaba 18.130 — el de 2024.',
  },
  'soli.tipo': {
    valor: 5.5,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Parámetros del SolzG: anuales, efectivos enero' },
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'soli.tipo_transicion': {
    valor: 11.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Parámetros del SolzG: anuales, efectivos enero' },
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Zona de transición: se paga el MENOR de 5,5 % del impuesto u 11,9 % del exceso sobre la Freigrenze.',
  },
  'soli.freigrenze_conjunta': {
    valor: 40700,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Parámetros del SolzG: anuales, efectivos enero' },
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Freigrenze en tributación conjunta — el doble de la individual.',
  },

  // Pauschbeträge que acercan la base imponible a la alemana (motor, paso 3
  // del cierre del simulador — día 143).
  'pauschale.arbeitnehmer': {
    valor: 1230,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Pauschbeträge del EStG (§9a/§10c): anuales, efectivos enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitnehmer-Pauschbetrag — §9a EStG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Por persona CON ingresos del trabajo: con un solo sueldo se aplica una vez, no dos.',
  },
  'pauschale.sonderausgaben': {
    valor: 36,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Pauschbeträge del EStG (§9a/§10c): anuales, efectivos enero' },
    fuente: { nombre: 'Sonderausgaben-Pauschbetrag — §10c EStG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Tributación individual.',
  },
  'pauschale.sonderausgaben_conjunta': {
    valor: 72,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'individual × 2 (§10c EStG)', tipo: 'derivada' },
    deriva_de: ['pauschale.sonderausgaben'],
  },

  // ─── Salarios del simulador — medianas nacionales 2026 ─────────────────
  // Fuente: Entgeltatlas de la Bundesagentur für Arbeit (mediana mensual
  // bruta, jornada completa, Alemania), verificado 2026-07-31 por el chat
  // estratégico. Medicina: convenio TV-Ärzte/VKA 2026 (no estadística).
  // Categorías exactas en alemán, criterio de elección, cuartil inferior
  // como referencia «al llegar» y ausencias honestas (censura del tope de
  // cotización): repo ops, docs/metodo-datos-simulador.md.
  // El simulator-data.json DERIVA de estas cifras × gradiente.* (el gate de
  // ops vigila la derivación). Claves = ids de profesión del JSON.
  'salario.software_engineer.mediana.mes': {
    valor: 6478,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der Informatik (ohne Spezialisierung) – hoch komplexe Tätigkeiten', tipo: 'oficial' },
  },
  'salario.software_engineer.q25.mes': {
    valor: 5180,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
    nota: 'q75 CENSURADO por el tope de cotización: ausencia honesta, no hay entrada.',
  },
  'salario.mechanical_engineer.mediana.mes': {
    valor: 6846,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der Maschinenbau- & Betriebstechnik (ohne Spezialisierung) – hoch komplexe Tätigkeiten', tipo: 'oficial' },
  },
  'salario.mechanical_engineer.q25.mes': {
    valor: 5502,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
    nota: 'q75 CENSURADO por el tope de cotización: ausencia honesta, no hay entrada.',
  },
  'salario.teacher.mediana.mes': {
    valor: 5734,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Lehrkräfte für berufsbildende Fächer – hoch komplexe Tätigkeiten', tipo: 'oficial' },
  },
  'salario.teacher.q25.mes': {
    valor: 4796,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.teacher.q75.mes': {
    valor: 6883,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.business_admin.mediana.mes': {
    valor: 5687,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der kaufmännischen & technischen Betriebswirtschaft (ohne Spezialisierung) – komplexe Spezialistentätigkeiten', tipo: 'oficial' },
    nota: 'Categoría precisada el 2026-07-31 (antes «Betriebswirt/in – allgemeine Betriebswirtschaft», sin cuartiles): la nueva trae la misma mediana Y los cuartiles — hueco cerrado.',
  },
  'salario.business_admin.q25.mes': {
    valor: 4394,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.business_admin.q75.mes': {
    valor: 7153,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.researcher.mediana.mes': {
    valor: 5289,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der Hochschullehre & -forschung – hoch komplexe Tätigkeiten', tipo: 'oficial' },
  },
  'salario.researcher.q25.mes': {
    valor: 4730,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.researcher.q75.mes': {
    valor: 6384,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.architect.mediana.mes': {
    valor: 4745,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Architekt/in', tipo: 'oficial' },
  },
  'salario.architect.q25.mes': {
    valor: 3739,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.architect.q75.mes': {
    valor: 6231,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.nurse.mediana.mes': {
    valor: 4329,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der Gesundheits- & Krankenpflege (ohne Spezialisierung) – fachlich ausgerichtete Tätigkeiten', tipo: 'oficial' },
  },
  'salario.nurse.q25.mes': {
    valor: 3870,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.nurse.q75.mes': {
    valor: 4849,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.electrician.mediana.mes': {
    valor: 4057,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe in der Elektrotechnik (ohne Spezialisierung) – fachlich ausgerichtete Tätigkeiten', tipo: 'oficial' },
  },
  'salario.electrician.q25.mes': {
    valor: 3344,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.electrician.q75.mes': {
    valor: 4981,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.graphic_designer.mediana.mes': {
    valor: 3993,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Berufe im Grafik-, Kommunikations- & Fotodesign – komplexe Spezialistentätigkeiten', tipo: 'oficial' },
    nota: '⚠ familia correcta, nivel exacto por precisar (cabo abierto, ver método).',
  },
  'salario.graphic_designer.q25.mes': {
    valor: 3178,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.graphic_designer.q75.mes': {
    valor: 5139,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.logistician.mediana.mes': {
    valor: 3820,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Speditions- & Logistikkaufleute – hoch komplexe Tätigkeiten', tipo: 'oficial' },
    nota: '⚠ familia correcta, nivel exacto por precisar (cabo abierto, ver método).',
  },
  'salario.logistician.q25.mes': {
    valor: 2906,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.logistician.q75.mes': {
    valor: 5683,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  'salario.chef.mediana.mes': {
    valor: 3018,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas (BA): Köche/Köchinnen (ohne Spezialisierung) – fachlich ausgerichtete Tätigkeiten', tipo: 'oficial' },
  },
  'salario.chef.q25.mes': {
    valor: 2563,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil inferior de la misma categoría', tipo: 'oficial' },
  },
  'salario.chef.q75.mes': {
    valor: 3581,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-07', porque: 'Entgeltatlas de la BA: actualización anual (~julio)' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Entgeltatlas — cuartil superior de la misma categoría', tipo: 'oficial' },
  },
  // El alias heredado salario.physician.mediana.mes se retiró en la
  // regeneración del día 143 (noche), como estaba pactado: el JSON deriva
  // ya del q25 con nombre honesto.
  'salario.physician.q25.mes': {
    valor: 5722.05,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'El convenio TV-Ärzte/VKA vigente expira el 31.12.2026 — fecha exacta, no estimada; después, nueva ronda o prórroga' },
    aplica_a: 'empleados',
    fuente: { nombre: 'TV-Ärzte/VKA, tabla vigente 01.06.2026–31.12.2026 — Ä1 nivel 1 (residente al inicio); convenio público, no estadística', tipo: 'oficial' },
    nota: 'El nombre honesto del escenario único (día 143, noche): el sueldo de quien empieza. NO es cuartil estadístico —el convenio no define cuartiles—: hace el papel del cuartil inferior, declarado. Sin guardias (suman aparte).',
  },
  'salario.physician.especialista_inicio.mes': {
    valor: 7552,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'El convenio TV-Ärzte/VKA vigente expira el 31.12.2026 — fecha exacta, no estimada; después, nueva ronda o prórroga' },
    aplica_a: 'empleados',
    fuente: { nombre: 'TV-Ärzte/VKA, tabla vigente 01.06.2026–31.12.2026 — Ä2 nivel 1 (especialista al inicio)', tipo: 'oficial' },
    nota: 'Dato INFORMATIVO con nombre honesto: el hito real de carrera (hacerse especialista). GRADO declarado: valor REDONDEADO — pendiente de precisar al céntimo (el 5.722,05 sí viene al céntimo de la tabla).',
  },
  'salario.physician.q75.mes': {
    valor: 7355.29,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'El convenio TV-Ärzte/VKA vigente expira el 31.12.2026 — fecha exacta, no estimada; después, nueva ronda o prórroga' },
    aplica_a: 'empleados',
    fuente: { nombre: 'TV-Ärzte/VKA, tabla vigente 01.06.2026–31.12.2026 — Ä1 nivel 6 (residente 6.º año)', tipo: 'oficial' },
    nota: 'Dato INFORMATIVO conservado con su etiqueta correcta (residente de 6.º año): es verdad y costó verificarlo. Constancia de la corrección del mismo día: el dato anterior (7.680) iba un 4,2 % alto; con la tabla en vigor NO existe la anomalía «residente 6.º > especialista inicio» (7.355,29 < 7.552) — la explicación previa por antigüedad era falsa.',
  },

  // ─── Gradiente de ciudad del simulador — ESTIMACIÓN DECLARADA ───────────
  // Heredado de la tabla original (sin fuente conocida) y normalizado por la
  // media de las 10 ciudades (÷1,0114) — opción A del Director, 2026-07-31.
  // Sesgo declarado: conservador (asume que la media de 10 ciudades grandes
  // es la mediana nacional; las grandes pagan por encima, así que esto tira
  // los sueldos de ciudad LIGERAMENTE a la baja). Mejora futura registrada:
  // gradiente oficial por Bundesland (opción C, pendiente de verificación
  // exterior). mediana(prof, ciudad) = mediana.mes × 12 × coef, a miles.
  'gradiente.berlin': {
    valor: 0.9887,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.munich': {
    valor: 1.1064,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.frankfurt': {
    valor: 1.0629,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.hamburg': {
    valor: 1.0223,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.cologne': {
    valor: 0.9917,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.stuttgart': {
    valor: 1.0856,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.dusseldorf': {
    valor: 1.0164,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.freiburg': {
    valor: 0.9482,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.leipzig': {
    valor: 0.8889,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.dresden': {
    valor: 0.8889,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Sin pauta temporal por decisión del Director (día 143): la estimación no envejece sola — se revisa cuando se haga la ronda por Bundesland (opción C del método)' },
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
    nota: 'Clon DECLARADO de Leipzig (decisión del Director 2026-07-31): comparte coeficiente — consecuencia del método, no copia-pega accidental. Dato propio pendiente de la ronda por Bundesland.',
  },

  // ─── Coste de vida — consolidación parcial (día 143, 2026-07-31) ───────
  // ALCANCE del encargo: solo cifras.ts — el simulator-data.json NO se
  // regenera hasta completar el paquete (medio-actualizar sería peor).
  // HUECOS DECLARADOS, no escondidos: Internet, «varios», FRIBURGO (no
  // existe en GREIX — pendiente de Mietspiegel municipal, chat
  // estratégico), los 18 países del poder adquisitivo y el desglose
  // regional de Betriebskosten. El Deutschlandticket (63 €) sigue en
  // simulator-data.json sin cambios; para dos personas son DOS abonos:
  // ×2 exacto, NO el ratio observado 2,08 (decisión del Director).
  //
  // Alquileres — columna MEDIANA (decisión del Director): en alquiler el
  // recién llegado paga POR ENCIMA del cuartil inferior — los pisos
  // baratos son los difíciles de conseguir; el reverso de salarios.
  // q25/q75 se guardan como en salarios: son dato de la fuente, no
  // decoración, y este mismo día sirvieron para razonar el criterio.
  'alquiler.berlin.mediana.m2': {
    valor: 15.18,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.berlin.q25.m2': {
    valor: 10.38,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.berlin.q75.m2': {
    valor: 19.98,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.munich.mediana.m2': {
    valor: 23.23,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.munich.q25.m2': {
    valor: 20.0,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.munich.q75.m2': {
    valor: 26.94,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.frankfurt.mediana.m2': {
    valor: 17.5,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.frankfurt.q25.m2': {
    valor: 14.81,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.frankfurt.q75.m2': {
    valor: 20.83,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.hamburg.mediana.m2': {
    valor: 15.47,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.hamburg.q25.m2': {
    valor: 12.68,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.hamburg.q75.m2': {
    valor: 19.38,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.cologne.mediana.m2': {
    valor: 15.55,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.cologne.q25.m2': {
    valor: 13.16,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.cologne.q75.m2': {
    valor: 18.5,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.stuttgart.mediana.m2': {
    valor: 15.98,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.stuttgart.q25.m2': {
    valor: 13.64,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.stuttgart.q75.m2': {
    valor: 18.29,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dusseldorf.mediana.m2': {
    valor: 14.45,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dusseldorf.q25.m2': {
    valor: 12.5,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dusseldorf.q75.m2': {
    valor: 16.96,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.leipzig.mediana.m2': {
    valor: 10.0,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.leipzig.q25.m2': {
    valor: 8.49,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.leipzig.q75.m2': {
    valor: 12.0,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dresden.mediana.m2': {
    valor: 9.53,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), mediana de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dresden.q25.m2': {
    valor: 8.5,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil inferior de junio 2026', tipo: 'oficial' },
  },
  'alquiler.dresden.q75.m2': {
    valor: 11.49,
    unidad: '€/m²/mes',
    vigencia: '2026-06',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'GREIX publica trimestralmente, ~3-4 semanas tras cerrar el trimestre (Q2-2026 llegó el 22-07-2026); cada actualización fija el siguiente' },
    fuente: { nombre: 'GREIX (IfW Kiel) — Mietpreisindex, alquiler FRÍO de oferta corregido por calidad (hedónico), cuartil superior de junio 2026', tipo: 'oficial' },
  },
  // Friburgo — la décima ciudad, de OTRA fuente (no existe en GREIX;
  // comprobado sobre el fichero: 38 entradas, ninguna es Friburgo).
  // Clave honesta: MEDIA, porque ImmoScout publica media, no mediana.
  'alquiler.freiburg.media.m2': {
    valor: 14.49,
    unidad: '€/m²/mes',
    vigencia: '2026-Q1',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'Fuente con ritmo propio (el dato de Q1 llegó en julio), sin calendario fiable conocido — revisar cada ~6 meses junto al ciclo GREIX más cercano (pauta propuesta por CCode, día 143). SUSTITUIBLE: si GREIX incorpora Friburgo, esta entrada se reemplaza por su mediana' },
    fuente: { nombre: 'ImmoScout24 — media de precios de oferta, alquiler frío, Q1 2026', tipo: 'solvente' },
    nota: 'CALIBRACIÓN que avala mezclar fuentes: Dresde es la única ciudad donde ambas publican — GREIX 9,53 (mediana) vs ImmoScout 9,56 (media): tres céntimos. GRADO, sin suavizar: UN SOLO punto de calibración, no una regla; y hay desajuste conceptual (media vs mediana) que en Dresde no se nota pero no tiene por qué repetirse. Ocho fuentes convergían en 13,88–14,82: el problema no era el número sino la ESCALA. Sin cuartiles: ImmoScout no los publica — hueco declarado, no afecta a lo que se muestra. La regeneración usará esta media como equivalente declarado de la mediana.',
  },
  'alquiler.factor_oferta': {
    valor: 1,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Supuesto declarado: se revisa solo si aparece un dato que permita corregirlo' },
    fuente: { nombre: 'Supuesto (b) del Director, día 143', tipo: 'estimacion' },
    nota: 'Se asume que el precio de OFERTA es lo que acaba firmando quien llega (factor 1,00): no hay dato para hacerlo mejor — se declara y no se corrige.',
  },
  'vivienda.tamano.1p': {
    valor: 50,
    unidad: 'm²',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Supuesto de diseño (Director, día 143): no envejece solo — se revisa solo si cambia el criterio de producto' },
    fuente: { nombre: 'Decisión del Director (día 143) — tamaño de vivienda para una persona; se deriva del paso de familia que ya existe', tipo: 'estimacion' },
  },
  'vivienda.tamano.2p': {
    valor: 65,
    unidad: 'm²',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Supuesto de diseño (Director, día 143): no envejece solo — se revisa solo si cambia el criterio de producto' },
    fuente: { nombre: 'Decisión del Director (día 143) — tamaño de vivienda para dos personas; se deriva del paso de familia que ya existe', tipo: 'estimacion' },
  },
  'vivienda.nebenkosten.m2': {
    valor: 2.67,
    unidad: '€/m²/mes',
    vigencia: 'ejercicio 2024',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-12', porque: 'El Betriebskostenspiegel del DMB se publica cada diciembre' },
    fuente: { nombre: 'Deutscher Mieterbund — Betriebskostenspiegel del ejercicio 2024 (publicado 2025-12-18; ~2 millones de liquidaciones reales)', tipo: 'solvente' },
    nota: 'NACIONAL PLANO por decisión del Director: el desglose regional existe pero las fuentes secundarias se contradicen hasta un 20 % y no se alcanzó la primaria — MEJORA FUTURA en el método.',
  },
  'vivienda.nebenkosten.calefaccion_acs.m2': {
    valor: 1.32,
    unidad: '€/m²/mes',
    vigencia: 'ejercicio 2024',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-12', porque: 'El Betriebskostenspiegel del DMB se publica cada diciembre' },
    fuente: { nombre: 'Deutscher Mieterbund — Betriebskostenspiegel ejercicio 2024, componente calefacción + agua caliente', tipo: 'solvente' },
    nota: 'Parte DE los 2,67 — no se suma aparte. Calefacción y agua caliente viven AQUÍ: la luz (abajo) no las incluye. Sin doble contabilidad.',
  },
  'luz.consumo_1p.kwh_anno': {
    valor: 1200,
    unidad: 'kWh/año',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'El Stromspiegel se actualiza aprox. cada 1-2 años (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Stromspiegel (co2online) — consumos reales, hogar de 1 persona en piso', tipo: 'solvente' },
  },
  'luz.precio.kwh': {
    valor: 0.37,
    unidad: '€/kWh',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 6, porque: 'El precio eléctrico se mueve con el mercado; BDEW lo analiza ~semestralmente (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'BDEW — precio medio hogares 2026', tipo: 'solvente' },
  },
  'luz.cuota_fija.mes': {
    valor: 12,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'evento', porque: 'Estimación pendiente de verificación exterior — se revisa cuando llegue el dato' },
    fuente: { nombre: 'Supuesto (c): estimación del chat estratégico, NO verificada — declarada (día 143)', tipo: 'estimacion' },
    nota: 'El importe mensual de la luz (~50 €) es DERIVADO, no cifra propia: consumo/12 × precio + cuota fija.',
  },
  'comida.1p.mes': {
    valor: 254,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — Encuesta de Ingresos y Consumo (EVS) 2023, publicada 2025-12-09; hogar de 1 persona', tipo: 'oficial' },
  },
  'comida.2p.mes': {
    valor: 480,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — Encuesta de Ingresos y Consumo (EVS) 2023, publicada 2025-12-09; hogar de 2 personas', tipo: 'oficial' },
  },
  'ratio.hogar2.vivienda': {
    valor: 1.52,
    unidad: 'coef',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis EVS 2023 — gasto real por tamaño de hogar (2p respecto a 1p)', tipo: 'oficial' },
    nota: 'Dato OBSERVADO, no escala de equivalencia teórica (decisión del Director, día 143): gasto real medido por tamaño de hogar.',
  },
  'ratio.hogar2.comida': {
    valor: 1.89,
    unidad: 'coef',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis EVS 2023 — gasto real por tamaño de hogar (2p respecto a 1p)', tipo: 'oficial' },
    nota: 'Observado. Coherencia interna: 480/254 = 1,8898 ≈ 1,89.',
  },
  'ratio.hogar2.transporte': {
    valor: 2.08,
    unidad: 'coef',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis EVS 2023 — gasto real por tamaño de hogar (2p respecto a 1p)', tipo: 'oficial' },
    nota: 'Observado — pero NO se usa para el Deutschlandticket del simulador: dos abonos son ×2 exacto (decisión del día 143). Se guarda como dato.',
  },
  'ratio.hogar2.total': {
    valor: 1.76,
    unidad: 'coef',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis EVS 2023 — gasto real por tamaño de hogar (2p respecto a 1p)', tipo: 'oficial' },
    nota: 'Observado, informativo (2 personas vs 1 sobre el gasto total).',
  },

  // ─── Estructura de gasto — Destatis EVS 2023 (día 143, tarde) ──────────
  // HECHOS del hogar de UNA persona (el gasto observado completo); el
  // «resto» es DERIVADA exacta (total − vivienda − alimentación −
  // transporte), vigilada por el guardián. REGLA DE LA CASA aplicada: los
  // importes mezclados (p. ej. ~96 €/mes de comunicaciones = 5 % de todos
  // los hogares × total de uno) NO tienen entrada — se derivan si hacen
  // falta, como la luz. La alimentación de 1p ya existe: comida.1p.mes.
  'gasto.1p.total.mes': {
    valor: 1918,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023 (publicada 2025-12-09), gasto de consumo total, hogar de 1 persona', tipo: 'oficial' },
  },
  'gasto.1p.vivienda.mes': {
    valor: 817,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, gasto en vivienda, hogar de 1 persona', tipo: 'oficial' },
    nota: 'Control cruzado que valida la fuente: 817/1.918 = 42,6 %, exactamente la cuota de vivienda que Destatis publica para hogares de una persona — comprobado por instrumento, no de memoria (día 143).',
  },
  'gasto.1p.transporte.mes': {
    valor: 195,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, gasto en transporte, hogar de 1 persona', tipo: 'oficial' },
    nota: 'Gasto OBSERVADO (incluye coche); el simulador modela transporte con el Deutschlandticket (63 €) — convivencia declarada, no contradicción.',
  },
  'gasto.1p.resto.mes': {
    valor: 652,
    unidad: '€/mes',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    fuente: { nombre: 'total − vivienda − alimentación − transporte (aritmética exacta)', tipo: 'derivada' },
    deriva_de: ['gasto.1p.total.mes', 'gasto.1p.vivienda.mes', 'comida.1p.mes', 'gasto.1p.transporte.mes'],
    nota: 'Todo lo demás del gasto de 1 persona. Verificada por instrumento el día 143; el guardián vigila la aritmética.',
  },
  'transporte.deutschlandticket.mes': {
    valor: 63,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2026-10', porque: 'El precio 2027 se decide a finales de septiembre de 2026 (acuerdo de los ministros de transporte, marzo 2026) — la semilla del día 143, plantada al migrar la cifra en la regeneración' },
    fuente: { nombre: 'Precio público del Deutschlandticket 2026 (subida 49→63 € registrada en enero, commit 0e7333f del repo)', tipo: 'oficial' },
    nota: 'Para dos personas son DOS abonos: ×2 exacto, no el ratio observado 2,08 (decisión del Director, día 143).',
  },
  // ─── Cifras del artículo del coste de vida (día 143, fase 3) ───────────
  // Verificadas por el chat estratégico el 2026-07-31: eran correctas en el
  // artículo, lo que les faltaba era procedencia. Entran aquí para que la
  // tengan y para que el vigía sepa cuándo re-mirarlas.
  'rundfunkbeitrag.mes': {
    valor: 18.36,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'La KEF propone 18,64 € desde 2027 y hay un procedimiento abierto en el Tribunal Constitucional sobre la subida no aplicada: puede cambiar, y en enero se sabrá' },
    fuente: { nombre: 'Rundfunkbeitrag — importe legal por vivienda (Rundfunkbeitragsstaatsvertrag)', tipo: 'oficial' },
    nota: 'Por VIVIENDA, no por persona: en un piso compartido se paga una sola vez.',
  },
  'alg1.tasa.sin_hijos': {
    valor: 60,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Porcentaje fijado por ley (§149 SGB III): cambia con la ley, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitslosengeld I — §149 SGB III', tipo: 'oficial' },
    nota: 'Sobre el sueldo neto calculado a tanto alzado, no sobre el neto real de la nómina. La base se topa en la BBG de desempleo (rv.bbg.mes).',
  },
  'alg1.tasa.con_hijos': {
    valor: 67,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'calendario', proxima: '2027-01', porque: 'Porcentaje fijado por ley (§149 SGB III): cambia con la ley, efectivo enero' },
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitslosengeld I — §149 SGB III, con al menos un hijo', tipo: 'oficial' },
  },
  'gkv.cobertura_poblacion': {
    valor: 90,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'Cuota de población cubierta: se mueve despacio y sin fecha fija — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Bundesgesundheitsministerium — 74,2 millones de asegurados en la GKV a 1-1-2026', tipo: 'oficial' },
  },

  // Reparto oficial por categorías — media de TODOS los hogares, NO de uno:
  // no mezclar estos % con los totales de 1 persona sin declararlo (el
  // ~96 € de comunicaciones nació justo de esa mezcla y no tiene entrada).
  'gasto.reparto.vivienda': {
    valor: 38,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, reparto del gasto, media de todos los hogares', tipo: 'oficial' },
  },
  'gasto.reparto.alimentacion': {
    valor: 14,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, reparto del gasto, media de todos los hogares', tipo: 'oficial' },
  },
  'gasto.reparto.transporte': {
    valor: 12,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, reparto del gasto, media de todos los hogares', tipo: 'oficial' },
  },
  'gasto.reparto.ocio': {
    valor: 9,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, ocio/deporte/cultura, media de todos los hogares', tipo: 'oficial' },
  },
  'gasto.reparto.restaurantes_hoteles': {
    valor: 7,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, restaurantes y hoteles, media de todos los hogares', tipo: 'oficial' },
  },
  'gasto.reparto.informacion_comunicacion': {
    valor: 5,
    unidad: '%',
    vigencia: 'EVS 2023',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'EVS quinquenal con LWR anuales intermedias — mirar una vez al año (pauta propuesta por CCode, día 143)' },
    fuente: { nombre: 'Destatis — EVS 2023, información y comunicación, media de todos los hogares', tipo: 'oficial' },
    nota: 'La casilla «utilities» del JSON era en realidad internet y móvil: corresponde a ESTA categoría, no a los gastos de vivienda — escrito antes de la regeneración (día 143).',
  },

  // ─── Sueldos medios por país — ILOSTAT, en PPA (día 143, noche) ────────
  // Decisión del Director: se compara IGUALES CON IGUALES (media de
  // Alemania vs media del país, no la profesión elegida) y en la columna
  // PPP: la métrica se llama «poder adquisitivo relativo» y el tipo de
  // cambio de mercado es el instrumento equivocado — mezcla niveles de
  // precios. Unidad: DÓLARES INTERNACIONALES PPA, no euros; NO se
  // convierte (mismo numerador y denominador → cociente válido). La clave
  // «avg_professional_salary_eur» del JSON dejará de ser cierta: renombrar
  // en la regeneración.
  // LO QUE MIDE, sin suavizar: media de ASALARIADOS, no de todos los
  // trabajadores — en varios países cerca de la mitad de los ocupados son
  // autónomos y quedan FUERA; el sesgo va al alza justo donde más
  // informalidad hay, así que el multiplicador saldrá algo MENOR que la
  // realidad del emigrante medio. Dirección prudente, declarada.
  // La vigencia es POR PAÍS (2022-2026): no es una tabla de un año.
  // HUECOS DECLARADOS (criterio del Director, no omisión): VENEZUELA
  // (último dato 2020 en bolívares pre-redenominación, sin USD/PPP) y
  // NICARAGUA (2014: no es un dato viejo, es otra época). Sin entrada;
  // los 200/300 del JSON quedan como cifras SIN FUENTE pendientes de
  // retirada en la regeneración, sustituidas por la frase APROBADA por el
  // Director el 2026-07-31 — exportada como FRASES_SIN_DATO (al pie).
  'pais.alemania.ppp.mes': {
    valor: 6134.91,
    unidad: 'USD-PPA/mes',
    vigencia: '2022',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, ALEMANIA 2022', tipo: 'oficial' },
    nota: 'El numerador de la comparación. Desfase declarado: dato de 2022 (EU-SILC), a 4 años — se acepta porque la COMPARABILIDAD era el motivo de todo el cambio; romperla por frescura sería deshacer la decisión (Director, día 143). MEJORA FUTURA: sustituir cuando ILOSTAT actualice Alemania.',
  },
  'pais.spain.ppp.mes': {
    valor: 5165.65,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, España 2024', tipo: 'oficial' },
  },
  'pais.chile.ppp.mes': {
    valor: 2078.79,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Chile 2024', tipo: 'oficial' },
  },
  'pais.costa_rica.ppp.mes': {
    valor: 1928.25,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Costa Rica 2025', tipo: 'oficial' },
  },
  'pais.panama.ppp.mes': {
    valor: 1869.46,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Panamá 2025', tipo: 'oficial' },
  },
  'pais.uruguay.ppp.mes': {
    valor: 1636.24,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Uruguay 2024', tipo: 'oficial' },
  },
  'pais.argentina.ppp.mes': {
    valor: 1522.6,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Argentina 2025', tipo: 'oficial' },
  },
  'pais.bolivia.ppp.mes': {
    valor: 1392.27,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Bolivia 2024', tipo: 'oficial' },
  },
  'pais.dominican_republic.ppp.mes': {
    valor: 1263.09,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, R. Dominicana 2025', tipo: 'oficial' },
  },
  'pais.ecuador.ppp.mes': {
    valor: 1219.58,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Ecuador 2025', tipo: 'oficial' },
  },
  'pais.colombia.ppp.mes': {
    valor: 1214.38,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Colombia 2025', tipo: 'oficial' },
  },
  'pais.paraguay.ppp.mes': {
    valor: 1177.7,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Paraguay 2025', tipo: 'oficial' },
  },
  'pais.peru.ppp.mes': {
    valor: 1042.03,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Perú 2025', tipo: 'oficial' },
  },
  'pais.guatemala.ppp.mes': {
    valor: 1037.93,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Guatemala 2024', tipo: 'oficial' },
  },
  'pais.el_salvador.ppp.mes': {
    valor: 1008.64,
    unidad: 'USD-PPA/mes',
    vigencia: '2024',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, El Salvador 2024', tipo: 'oficial' },
  },
  'pais.mexico.ppp.mes': {
    valor: 938.11,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, México 2025', tipo: 'oficial' },
  },
  'pais.honduras.ppp.mes': {
    valor: 891.5,
    unidad: 'USD-PPA/mes',
    vigencia: '2025',
    verificado: '2026-07-31',
    revision: { tipo: 'deriva', umbral_meses: 12, porque: 'ILOSTAT no publica en fecha fija: cada país gotea a su ritmo (medido el día 143: de 2014 a 2026 en la misma tabla) — mirar una vez al año (pauta propuesta por CCode)' },
    fuente: { nombre: 'ILOSTAT (OIT) — DF_EAR_EMTA_SEX_CUR_NB: media mensual de asalariados, PPP, Honduras 2025', tipo: 'oficial' },
  },

  // Lingoda: deliberadamente FUERA. Su precio depende de plan, volumen y
  // promoción vigente — es un rango móvil, no un hecho datable
  // (paquete de verificación 2026-07-30).

  // ─── Alquiler: el marco legal (T13, tanda buscar-piso, 10-ago-2026) ──────
  'mietpreisbremse.tope.pct': {
    valor: 10,
    unidad: '%',
    vigencia: 'vigente (prórroga en vigor 2025-07-23)',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Tope de norma (§ 556d Abs. 1 BGB): cambia por reforma, no por calendario. La prórroga de 2025 NO lo tocó (veredicto buscar-piso Q2)' },
    fuente: { nombre: '§ 556d Abs. 1 BGB — no más del 10 % sobre la ortsübliche Vergleichsmiete en zona declarada por decreto del Land (veredicto buscar-piso Q1-Q2; § abierto vía § 556g por el Director el 10-ago-2026)', tipo: 'oficial' },
    nota: 'Solo rige en zonas de mercado tenso declaradas por Rechtsverordnung de cada Land (§ 556d Abs. 2). Sobre la DURACIÓN de esos decretos hay divergencia registrada sin resolver (R100): no afirmable.',
  },
  'mietpreisbremse.ruege.meses': {
    valor: 30,
    unidad: 'meses',
    vigencia: 'vigente',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Plazo de norma (§ 556g Abs. 2 S. 3 BGB): cambia por reforma' },
    fuente: { nombre: '§ 556g Abs. 2 S. 3 BGB — Rüge dentro de 30 meses desde el inicio: recupera desde el principio; después (o contrato terminado): solo lo posterior a la Rüge. Literal en R100, copiado de gesetze-im-internet.de', tipo: 'oficial' },
  },
  'mietpreisbremse.subsanacion.anios': {
    valor: 2,
    unidad: 'años',
    vigencia: 'vigente',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Plazo de norma (§ 556g Abs. 1a S. 3 BGB): cambia por reforma' },
    fuente: { nombre: '§ 556g Abs. 1a S. 3 BGB — el casero que no informó y subsana solo puede ampararse en la excepción 2 años tras subsanar. Literal en R100', tipo: 'oficial' },
  },
  'mietpreisbremse.prorroga.anno': {
    valor: 2025,
    unidad: 'año',
    vigencia: 'en vigor desde 2025-07-23',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Ley de prórroga (veredicto buscar-piso Q1): la siguiente prórroga o derogación es el evento. La fecha exacta 23-07-2025 viaja aquí porque valor solo admite número (adaptación declarada en la aplicación de la tanda)' },
    fuente: { nombre: 'Gesetz zur Änderung der Regelungen über die zulässige Miethöhe bei Mietbeginn, en vigor 23-07-2025 (Bundesregierung 24-07-2025 · Bundestag 26-06-2025 · Bundesrat 11-07-2025; veredicto Q1)', tipo: 'oficial' },
  },
  'kaution.max.mensualidades': {
    valor: 3,
    unidad: 'mensualidades',
    vigencia: 'vigente',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Tope de norma (§ 551 Abs. 1 BGB): cambia por reforma' },
    fuente: { nombre: '§ 551 Abs. 1 BGB — máx. 3 mensualidades de alquiler frío; literal en canon R7 (cita cumplida T8 Q2). Da casa única a la cifra que vivía inline en cuanto-cuesta:84', tipo: 'oficial' },
  },
  'bestellerprinzip.vigor.anno': {
    valor: 2015,
    unidad: 'año',
    vigencia: 'en vigor desde 2015-06-01',
    verificado: '2026-08-10',
    revision: { tipo: 'evento', porque: 'Principio de norma (§ 2 Abs. 1a WoVermittG): cambia por reforma. Fecha exacta 01-06-2015 en fuente (misma adaptación declarada que la prórroga)' },
    fuente: { nombre: '§ 2 Abs. 1a WoVermittG (Mietrechtsnovellierungsgesetz, 01-06-2015) — quien encarga paga; cita del literal PENDIENTE (R101, veredicto buscar-piso Q4: IHK Wiesbaden + AG Mietrecht del DAV)', tipo: 'oficial' },
  },
} satisfies Record<string, Cifra>;

export type CifraId = keyof typeof CIFRAS;

// ─── Helpers de presentación ──────────────────────────────────────────────

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function fmtValor(c: Cifra): string {
  const num = c.valor.toLocaleString('es-ES', {
    minimumFractionDigits: Number.isInteger(c.valor) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (c.unidad === '%') return `${num} %`;
  if (c.unidad === '€') return `${num} €`;
  return `${num} ${c.unidad}`;
}

export function cifra(id: CifraId): Cifra {
  return CIFRAS[id];
}

/** «13.092 €/año» */
export function valorTexto(id: CifraId): string {
  return fmtValor(CIFRAS[id]);
}

/**
 * «13.092 €/año (verificado en julio de 2026)» — la idea era que la fecha
 * viajara con el dato.
 *
 * ⚠️ NO TIENE LLAMANTES, Y NO PUEDE TENERLOS (medido el 6-ago-2026, día 149).
 * Los sellos datados del sitio viven en los `.md` de `src/pages/blog/`, y los
 * `.md` de Astro NO ejecutan expresiones: no hay `@astrojs/mdx` instalado. Por
 * eso los 12 sellos del sitio se escriben A MANO, y por eso divergieron en
 * cinco formas distintas hasta que se midió.
 *
 * Para estrenarla harían falta MDX o mover los sellos a componentes `.astro`.
 * Se conserva porque la intención es correcta y el siguiente la reinventaría
 * peor; se anota para que nadie lea el docstring como una descripción de lo que
 * el sitio hace hoy. Detalle: `informes/estrategics/medicion-sellos-datados-2026-08-06.md`.
 */
export function conFecha(id: CifraId): string {
  const c = CIFRAS[id];
  const [y, m] = c.verificado.split('-').map(Number);
  return `${fmtValor(c)} (verificado en ${MESES[m - 1]} de ${y})`;
}

// ─── Frases para los huecos sin estadística utilizable ─────────────────────
// Texto visible APROBADO por el Director el 2026-07-31 (día 143) — no es
// propuesta. Lo consume la regeneración en lugar de los valores retirados
// de Venezuela (200) y Nicaragua (300), que no tienen fuente conocida.
// Claves = ids de país del simulator-data.json.
export const FRASES_SIN_DATO: Record<string, string> = {
  venezuela:
    'Venezuela: no hay estadística salarial utilizable para hacer esta comparación. Cuando exista una fuente fiable, la añadiremos.',
  nicaragua:
    'Nicaragua: no hay estadística salarial utilizable para hacer esta comparación. Cuando exista una fuente fiable, la añadiremos.',
};
