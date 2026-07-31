// src/data/motor-nomina-2026.ts
// Motor de nómina del simulador — IRPF (§32a EStG), recargo de solidaridad
// (SolzG) y cotizaciones del trabajador. Vigencia 2026.
//
// Regla de la casa: aquí vive la FORMA de la ley; los NÚMEROS viven en
// cifras.ts con vigencia, fecha de verificación y fuente (paquete verificado
// 2026-07-31). Cuando llegue la actualización anual, se tocan las cifras,
// no la forma — salvo que la ley cambie de forma.
//
// Simplificación vigente y declarada (decisión pendiente del Director,
// día 143): la base imponible se aproxima como bruto − cotizaciones del
// trabajador, SIN Werbungskostenpauschale ni demás deducciones — el IRPF
// resultante sale algo alto. No cambiar sin encargo.

import { CIFRAS, type CifraId } from './cifras';

const v = (id: CifraId): number => CIFRAS[id].valor;

export interface SituacionCotizante {
  /** Sin hijos (≥23 años): paga el recargo de la Pflegeversicherung. */
  sinHijos: boolean;
  /** Sajonia reparte la Pflege de otra forma (en el simulador: Leipzig y Dresde). */
  enSajonia: boolean;
}

/**
 * IRPF anual según la tarifa CONTINUA del §32a EStG, tributación individual.
 * La ley no define tramos con tipo fijo: define fórmulas sin saltos.
 * Base y resultado se truncan a euro entero (abrunden, práctica del §32a).
 */
export function calcularIRPF(baseImponibleAnual: number): number {
  const x = Math.floor(Math.max(0, baseImponibleAnual));
  if (x <= v('irpf.grundfreibetrag')) return 0;
  let impuesto: number;
  if (x <= v('irpf.zona2.hasta')) {
    const y = (x - v('irpf.grundfreibetrag')) / 10000;
    impuesto = (v('irpf.zona2.coef_a') * y + v('irpf.zona2.coef_b')) * y;
  } else if (x <= v('irpf.zona3.hasta')) {
    const z = (x - v('irpf.zona2.hasta')) / 10000;
    impuesto =
      (v('irpf.zona3.coef_a') * z + v('irpf.zona3.coef_b')) * z +
      v('irpf.zona3.sumando');
  } else if (x <= v('irpf.zona4.hasta')) {
    impuesto = (v('irpf.zona4.tipo') / 100) * x - v('irpf.zona4.resta');
  } else {
    impuesto = (v('irpf.zona5.tipo') / 100) * x - v('irpf.zona5.resta');
  }
  return Math.floor(impuesto);
}

/**
 * Soli anual: 0 hasta la Freigrenze (tributación individual); por encima,
 * el MENOR de {tipo pleno sobre el impuesto} y {tipo de transición sobre el
 * exceso} — la zona de transición del SolzG, que es donde cae casi todo el
 * que paga algo con los sueldos de este simulador.
 */
export function calcularSoli(irpfAnual: number): number {
  const freigrenze = v('soli.freigrenze');
  if (irpfAnual <= freigrenze) return 0;
  return Math.min(
    (v('soli.tipo') / 100) * irpfAnual,
    (v('soli.tipo_transicion') / 100) * (irpfAnual - freigrenze),
  );
}

/**
 * Cotizaciones mensuales del trabajador. Cada seguro topa en SU
 * Beitragsbemessungsgrenze — son dos topes distintos:
 * sanidad y dependencia en gkv.bbg.mes; pensiones y desempleo en rv.bbg.mes.
 */
export function calcularCotizacionesMes(
  brutoMes: number,
  { sinHijos, enSajonia }: SituacionCotizante,
): number {
  const baseKvPv = Math.min(brutoMes, v('gkv.bbg.mes'));
  const baseRvAlv = Math.min(brutoMes, v('rv.bbg.mes'));
  const kv = v('gkv.total_medio') / 2 / 100; // 8,75 % trabajador — verificada 2026-07-30
  const pvId: CifraId = enSajonia
    ? (sinHijos ? 'pv.sachsen.sin_hijos' : 'pv.sachsen.con_hijos')
    : (sinHijos ? 'pv.trabajador.sin_hijos' : 'pv.trabajador.con_hijos');
  const pv = v(pvId) / 100;
  const rv = v('rv.trabajador') / 100;
  const alv = v('alv.trabajador') / 100;
  return baseKvPv * (kv + pv) + baseRvAlv * (rv + alv);
}

export interface Nomina {
  brutoMes: number;
  cotizacionesMes: number;
  irpfAnual: number;
  soliAnual: number;
  impuestoMes: number;
  netoMes: number;
}

export function calcularNomina(
  brutoAnual: number,
  situacion: SituacionCotizante,
): Nomina {
  const brutoMes = brutoAnual / 12;
  const cotizacionesMes = calcularCotizacionesMes(brutoMes, situacion);
  // Simplificación declarada en cabecera: base = bruto − cotizaciones.
  const baseImponible = brutoAnual - cotizacionesMes * 12;
  const irpfAnual = calcularIRPF(baseImponible);
  const soliAnual = calcularSoli(irpfAnual);
  const impuestoMes = (irpfAnual + soliAnual) / 12;
  return {
    brutoMes,
    cotizacionesMes,
    irpfAnual,
    soliAnual,
    impuestoMes,
    netoMes: brutoMes - cotizacionesMes - impuestoMes,
  };
}
