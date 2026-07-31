// scripts/test-motor.mjs — control del motor de nómina 2026 (día 143).
//
// Prueba el módulo REAL (src/data/motor-nomina-2026.ts + cifras.ts):
// lo empaqueta en memoria con esbuild (la misma familia de herramientas
// que el build del sitio) y lo importa vía data-URL — sin copias del
// código, sin archivos temporales.
//
// Invocado por el gate de sesión del repo ops (tests/test_motor_simulador.py).
// A mano: node scripts/test-motor.mjs   (desde la raíz del repo Astro)
//
// Cubre: continuidad del IRPF en las tres costuras del §32a, los DOS topes
// de cotización, el recargo de Pflege por no tener hijos, el splitting de
// la tributación conjunta, y el umbral + zona de transición del Soli.

import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const empaquetado = await esbuild.build({
  entryPoints: [path.join(raiz, 'src', 'data', 'motor-nomina-2026.ts')],
  bundle: true,
  format: 'esm',
  write: false,
  logLevel: 'silent',
});
const codigo = empaquetado.outputFiles[0].text;
const motor = await import(
  'data:text/javascript;base64,' + Buffer.from(codigo).toString('base64')
);
const { calcularIRPF, calcularSoli, calcularCotizacionesMes } = motor;

let fallos = 0;
const ok = (cond, msg) => {
  if (!cond) {
    console.error(`FALLO: ${msg}`);
    fallos++;
  }
};

// 1 — IRPF: base 0 y continuidad en las costuras (saltos de 0-1 €).
ok(calcularIRPF(0) === 0, 'base 0 debe dar impuesto 0');
for (const costura of [12348, 17799, 69878]) {
  const antes = calcularIRPF(costura - 1);
  const en = calcularIRPF(costura);
  const despues = calcularIRPF(costura + 1);
  ok(
    en - antes >= 0 && en - antes <= 1 && despues - en >= 0 && despues - en <= 1,
    `costura ${costura}: la tarifa debe ser continua (saltos ${en - antes} y ${despues - en})`,
  );
}

// 2 — Los dos topes de cotización (soltero sin hijos, fuera de Sajonia).
const sit = { sinHijos: true, enSajonia: false };
const c5800 = calcularCotizacionesMes(5800, sit);
const c5825 = calcularCotizacionesMes(5825, sit);
// Entre 5.800 y 5.825 la parte KV/PV solo crece hasta 5.812,50 (KV 8,75 + PV 2,4
// = 11,15 %); la parte RV/ALV (10,6 %) crece entera.
ok(
  Math.abs(c5825 - (c5800 + 12.5 * 0.1115 + 25 * 0.106)) < 0.01,
  'tope KV/PV (5.812,50) mal aplicado',
);
ok(
  Math.abs(calcularCotizacionesMes(8500, sit) - calcularCotizacionesMes(8450, sit)) < 0.001,
  'por encima del tope RV/ALV (8.450) la cotización no debe crecer',
);

// 3 — Recargo de Pflege por no tener hijos: 0,6 puntos exactos.
ok(
  Math.abs(
    calcularCotizacionesMes(3000, { sinHijos: true, enSajonia: false }) -
      calcularCotizacionesMes(3000, { sinHijos: false, enSajonia: false }) -
      3000 * 0.006,
  ) < 0.01,
  'el recargo sin hijos debe ser 0,6 puntos',
);
ok(
  calcularCotizacionesMes(3000, { sinHijos: false, enSajonia: true }) >
    calcularCotizacionesMes(3000, { sinHijos: false, enSajonia: false }),
  'en Sajonia el trabajador paga más Pflege',
);

// 4 — Splitting: conjunta = dos veces la tarifa sobre media base.
ok(
  calcularIRPF(60000, true) === 2 * calcularIRPF(30000, false),
  'splitting: IRPF(60.000, conjunta) debe ser 2 × IRPF(30.000, individual)',
);
ok(
  calcularIRPF(60000, true) < calcularIRPF(60000, false),
  'la conjunta debe salir más barata que la individual a igual base',
);

// 5 — Soli: umbral, umbral conjunta y zona de transición (el MENOR de los dos).
ok(calcularSoli(20350) === 0, 'Soli debe ser 0 en la Freigrenze individual');
ok(calcularSoli(20351) > 0, 'Soli debe activarse justo encima de la Freigrenze');
ok(calcularSoli(40700, true) === 0, 'Soli conjunta debe ser 0 en su Freigrenze (40.700)');
ok(calcularSoli(40701, true) > 0, 'Soli conjunta debe activarse justo encima');
// Zona de transición: con impuesto 30.000, 11,9 % del exceso < 5,5 % pleno.
ok(
  Math.abs(calcularSoli(30000) - 0.119 * (30000 - 20350)) < 0.01,
  'en la zona de transición manda el 11,9 % del exceso',
);
// Lejos del umbral: manda el 5,5 % pleno.
ok(
  Math.abs(calcularSoli(60000) - 0.055 * 60000) < 0.01,
  'lejos del umbral manda el 5,5 % pleno',
);

if (fallos === 0) {
  console.log('motor de nómina 2026: todos los controles en verde');
  process.exit(0);
}
console.error(`motor de nómina 2026: ${fallos} control(es) en rojo`);
process.exit(1);
