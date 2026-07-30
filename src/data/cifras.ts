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

export type Unidad = '€' | '€/mes' | '€/año' | '€/28días' | '%';
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
