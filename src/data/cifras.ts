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
export type TipoFuente = 'oficial' | 'comercial' | 'derivada';

export interface Cifra {
  valor: number;
  unidad: Unidad;
  /** Período al que aplica el HECHO (no cuándo se comprobó). */
  vigencia: string;
  /** Fecha de la última verificación contra la fuente (ISO). */
  verificado: string;
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
    fuente: { nombre: 'Fijado por ley (SGB V)', tipo: 'oficial' },
  },
  'gkv.zusatzbeitrag_medio': {
    valor: 2.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-30',
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
    fuente: { nombre: 'BBG y tipos Pflege 2026 (BMG)', tipo: 'oficial' },
    nota: 'Tope del empleador en Pflegeversicherung. Conjunto KV + PV: 613,22 €/mes.',
  },

  // ─── Expatrio (proveedor Sperrkonto — afiliado, referral directo) ───────
  'expatrio.alta': {
    valor: 119,
    unidad: '€',
    vigencia: '2026-07',
    verificado: '2026-07-30',
    fuente: { nombre: 'expatrio.com — página comercial (EN y ES coinciden)', tipo: 'comercial' },
    nota:
      'Subida de precios del 2026-07-07 (aviso Awin). Su propio Help Center aún publicaba 89 €/5 € en un artículo «actualizado» el 2026-05-28: manda la página comercial, que es la que cobra (D-1).',
  },
  'expatrio.mes': {
    valor: 9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
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
    fuente: { nombre: 'fintiba.com — página comercial', tipo: 'comercial' },
    nota: 'El sitio publicaba 0 € de alta / 4,90 €/mes.',
  },
  'fintiba.mes': {
    valor: 9.9,
    unidad: '€/mes',
    vigencia: '2026-07',
    verificado: '2026-07-30',
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
    aplica_a: 'empleados',
    fuente: { nombre: 'Rentenversicherung — SGB VI / Rechengrößen 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador. Total 18,6 %, mitad y mitad con el empleador.',
  },
  'alv.trabajador': {
    valor: 1.3,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitslosenversicherung — SGB III / Rechengrößen 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador. Total 2,6 %.',
  },
  'pv.trabajador.con_hijos': {
    valor: 1.8,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026', tipo: 'oficial' },
    nota: 'Parte del trabajador, con hijos, fuera de Sajonia.',
  },
  'pv.trabajador.sin_hijos': {
    valor: 2.4,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026', tipo: 'oficial' },
    nota: 'Sin hijos, ≥23 años: el recargo de 0,6 puntos lo paga solo el trabajador.',
  },
  'pv.sachsen.con_hijos': {
    valor: 2.3,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026 (reparto especial de Sajonia)', tipo: 'oficial' },
    nota: 'Sajonia (en el simulador: Leipzig y Dresde) reparte la Pflege de otra forma.',
  },
  'pv.sachsen.sin_hijos': {
    valor: 2.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    aplica_a: 'empleados',
    fuente: { nombre: 'Pflegeversicherung — SGB XI / BMG 2026 (reparto especial de Sajonia)', tipo: 'oficial' },
  },
  'rv.bbg.mes': {
    valor: 8450,
    unidad: '€/mes',
    vigencia: '2026',
    verificado: '2026-07-31',
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
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Mínimo exento. El simulador publicaba 11.604 — el de 2024.',
  },
  'irpf.zona2.hasta': {
    valor: 17799,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona2.coef_a': {
    valor: 914.51,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: (914,51·y + 1.400)·y', tipo: 'oficial' },
  },
  'irpf.zona2.coef_b': {
    valor: 1400,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: (914,51·y + 1.400)·y', tipo: 'oficial' },
  },
  'irpf.zona3.hasta': {
    valor: 69878,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona3.coef_a': {
    valor: 173.1,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona3.coef_b': {
    valor: 2397,
    unidad: 'coef',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona3.sumando': {
    valor: 1034.87,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: (173,10·z + 2.397)·z + 1.034,87', tipo: 'oficial' },
  },
  'irpf.zona4.hasta': {
    valor: 277825,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'irpf.zona4.tipo': {
    valor: 42,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: 0,42·x − 11.135,63', tipo: 'oficial' },
  },
  'irpf.zona4.resta': {
    valor: 11135.63,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: 0,42·x − 11.135,63', tipo: 'oficial' },
  },
  'irpf.zona5.tipo': {
    valor: 45,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: 0,45·x − 19.470,38', tipo: 'oficial' },
  },
  'irpf.zona5.resta': {
    valor: 19470.38,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: '§32a EStG: 0,45·x − 19.470,38', tipo: 'oficial' },
  },

  // Recargo de solidaridad (Soli) 2026.
  'soli.freigrenze': {
    valor: 20350,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Tributación individual. Por debajo o igual: Soli 0. El simulador publicaba 18.130 — el de 2024.',
  },
  'soli.tipo': {
    valor: 5.5,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
  },
  'soli.tipo_transicion': {
    valor: 11.9,
    unidad: '%',
    vigencia: '2026',
    verificado: '2026-07-31',
    fuente: { nombre: 'SolzG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Zona de transición: se paga el MENOR de 5,5 % del impuesto u 11,9 % del exceso sobre la Freigrenze.',
  },
  'soli.freigrenze_conjunta': {
    valor: 40700,
    unidad: '€',
    vigencia: '2026',
    verificado: '2026-07-31',
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
    aplica_a: 'empleados',
    fuente: { nombre: 'Arbeitnehmer-Pauschbetrag — §9a EStG (redacción vigente 2026)', tipo: 'oficial' },
    nota: 'Por persona CON ingresos del trabajo: con un solo sueldo se aplica una vez, no dos.',
  },
  'pauschale.sonderausgaben': {
    valor: 36,
    unidad: '€/año',
    vigencia: '2026',
    verificado: '2026-07-31',
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
