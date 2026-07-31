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

// 'coef': coeficientes adimensionales de la fórmula del §32a EStG (IRPF).
export type Unidad = '€' | '€/mes' | '€/año' | '€/28días' | '%' | 'coef';
// 'estimacion': valor asumido y declarado como tal (sin fuente que lo fije);
// existe para que las estimaciones no se disfracen de hechos.
export type TipoFuente = 'oficial' | 'comercial' | 'derivada' | 'estimacion';

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
  tipo: 'calendario' | 'deriva';
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

export const CIFRAS = {
  // ─── Sperrkonto ──────────────────────────────────────────────────────────
  'sperrkonto.chancenkarte.mes': {
    valor: 1091,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
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
      'Media oficial 2026. Rango real por caja: 2,18–4,39 %. El sitio publicaba «~1,5-2 %».',
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
  'gkv.empleador_max_kv.mes': {
    valor: 508.59,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-30',
    fuente: { nombre: 'BBG × (total medio / 2)', tipo: 'derivada' },
    deriva_de: ['gkv.bbg.mes', 'gkv.total_medio'],
    nota: 'Aportación máxima del empleador al seguro de salud (también como tope en PKV). El sitio publicaba «unos 370 €».',
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
    revision: { tipo: 'deriva', porque: 'Precio comercial (afiliado/proveedor): cambia sin calendario; umbral pendiente del Director (día 143)' },
    fuente: { nombre: 'expatrio.com — página comercial (EN y ES coinciden)', tipo: 'comercial' },
    nota:
      'Subida de precios del 2026-07-07 (aviso Awin). Su propio Help Center aún publicaba 89 €/5 € en un artículo «actualizado» el 2026-05-28: manda la página comercial, que es la que cobra (D-1).',
  },
  'expatrio.mes': {
    valor: 9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', porque: 'Precio comercial (afiliado/proveedor): cambia sin calendario; umbral pendiente del Director (día 143)' },
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
    revision: { tipo: 'deriva', porque: 'Precio comercial (afiliado/proveedor): cambia sin calendario; umbral pendiente del Director (día 143)' },
    fuente: { nombre: 'fintiba.com — página comercial', tipo: 'comercial' },
    nota: 'El sitio publicaba 0 € de alta / 4,90 €/mes.',
  },
  'fintiba.mes': {
    valor: 9.9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    revision: { tipo: 'deriva', porque: 'Precio comercial (afiliado/proveedor): cambia sin calendario; umbral pendiente del Director (día 143)' },
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
    revision: { tipo: 'deriva', porque: 'Precio comercial (afiliado/proveedor): cambia sin calendario; umbral pendiente del Director (día 143)' },
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
    nota: 'Parte del trabajador, con hijos, fuera de Sajonia.',
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
    fuente: { nombre: 'Entgeltatlas (BA): Betriebswirt/in – allgemeine Betriebswirtschaft', tipo: 'oficial' },
    nota: 'Cuartiles no disponibles en la fuente: ausencia honesta, sin entradas.',
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
  'salario.physician.mediana.mes': {
    valor: 5700,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'TV-Ärzte/VKA 2026 — Assistenzarzt/ärztin Stufe 1 (residente al inicio); convenio público, no estadística', tipo: 'oficial' },
    nota: 'Decisión (i) del Director 2026-07-31: la referencia es el recién llegado. Sin guardias (suman aparte). Sin q25: ausencia honesta.',
  },
  'salario.physician.q75.mes': {
    valor: 7680,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'TV-Ärzte/VKA 2026 — Assistenzarzt/ärztin Stufe 6 (residente 6.º año)', tipo: 'oficial' },
    nota: 'Techo aproximado de carrera en residencia, NO cuartil estadístico. Cobra más que el especialista recién estrenado (7.481): mecánica de tablas por antigüedad, verificado — no es error.',
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
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.munich': {
    valor: 1.1064,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.frankfurt': {
    valor: 1.0629,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.hamburg': {
    valor: 1.0223,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.cologne': {
    valor: 0.9917,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.stuttgart': {
    valor: 1.0856,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.dusseldorf': {
    valor: 1.0164,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.freiburg': {
    valor: 0.9482,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.leipzig': {
    valor: 0.8889,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
  },
  'gradiente.dresden': {
    valor: 0.8889,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'Gradiente heredado normalizado (opción A) — sin fuente exterior', tipo: 'estimacion' },
    nota: 'Clon DECLARADO de Leipzig (decisión del Director 2026-07-31): comparte coeficiente — consecuencia del método, no copia-pega accidental. Dato propio pendiente de la ronda por Bundesland.',
  },

  // Lingoda: deliberadamente FUERA. Su precio depende de plan, volumen y
  // promoción vigente — es un rango móvil, no un hecho datable
  // (paquete de verificación 2026-07-30).
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

/** «13.092 €/año (verificado en julio de 2026)» — la fecha viaja con el dato. */
export function conFecha(id: CifraId): string {
  const c = CIFRAS[id];
  const [y, m] = c.verificado.split('-').map(Number);
  return `${fmtValor(c)} (verificado en ${MESES[m - 1]} de ${y})`;
}
