// src/data/motor-nomina-2026.ts
// Motor de nómina del simulador — IRPF (§32a EStG), recargo de solidaridad
// (SolzG) y cotizaciones del trabajador. Vigencia 2026.
//
// Regla de la casa: aquí vive la FORMA de la ley; los NÚMEROS viven en
// cifras.ts con vigencia, fecha de verificación y fuente (paquete verificado
// 2026-07-31). Cuando llegue la actualización anual, se tocan las cifras,
// no la forma — salvo que la ley cambie de forma.
//
// Simplificación vigente y declarada (día 143, tras el paso 3 del cierre):
// la base imponible resta las cotizaciones COMPLETAS del trabajador más las
// dos Pauschbeträge (§9a y §10c). Eso la ACERCA a la base alemana real, no
// la iguala: la ley no deduce la cotización completa sino la
// Vorsorgepauschale (§39b), que es otra cosa y tiene sus topes. Queda
// declarado, no resuelto. No cambiar sin encargo.

import { CIFRAS, type CifraId } from './cifras';

const v = (id: CifraId): number => CIFRAS[id].valor;

export interface SituacionCotizante {
  /** Sin hijos (≥23 años): paga el recargo de la Pflegeversicherung. */
  sinHijos: boolean;
  /** Sajonia reparte la Pflege de otra forma (en el simulador: Leipzig y Dresde). */
  enSajonia: boolean;
}

export interface SituacionFiscal extends SituacionCotizante {
  /**
   * Tributación conjunta (casado/a): splitting suponiendo UN SOLO ingreso
   * en la pareja — el supuesto se declara en el resultado visible.
   */
  conjunta: boolean;
}

/** La tarifa del §32a sobre un zvE individual, truncada a euro entero. */
function tarifa(x: number): number {
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
 * IRPF anual según la tarifa CONTINUA del §32a EStG. La ley no define
 * tramos con tipo fijo: define fórmulas sin saltos. Base y resultado se
 * truncan a euro entero (abrunden, práctica del §32a).
 * Conjunta = splitting (§32a(5)): dos veces la tarifa sobre media base.
 */
export function calcularIRPF(
  baseImponibleAnual: number,
  conjunta = false,
): number {
  const x = Math.floor(Math.max(0, baseImponibleAnual));
  if (conjunta) return 2 * tarifa(Math.floor(x / 2));
  return tarifa(x);
}

/**
 * Soli anual: 0 hasta la Freigrenze (doble en tributación conjunta); por
 * encima, el MENOR de {tipo pleno sobre el impuesto} y {tipo de transición
 * sobre el exceso} — la zona de transición del SolzG, que es donde cae casi
 * todo el que paga algo con los sueldos de este simulador.
 */
export function calcularSoli(irpfAnual: number, conjunta = false): number {
  const freigrenze = conjunta
    ? v('soli.freigrenze_conjunta')
    : v('soli.freigrenze');
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
  situacion: SituacionFiscal,
): Nomina {
  const brutoMes = brutoAnual / 12;
  const cotizacionesMes = calcularCotizacionesMes(brutoMes, situacion);
  // Base imponible — simplificación declarada en cabecera. Pauschbeträge:
  // la de trabajador se aplica UNA vez (supuesto de un solo sueldo, §9a);
  // la de Sonderausgaben es doble en conjunta (§10c).
  const baseImponible =
    brutoAnual -
    cotizacionesMes * 12 -
    v('pauschale.arbeitnehmer') -
    (situacion.conjunta
      ? v('pauschale.sonderausgaben_conjunta')
      : v('pauschale.sonderausgaben'));
  const irpfAnual = calcularIRPF(baseImponible, situacion.conjunta);
  const soliAnual = calcularSoli(irpfAnual, situacion.conjunta);
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
