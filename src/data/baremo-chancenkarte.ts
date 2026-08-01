// src/data/baremo-chancenkarte.ts
// El baremo de puntos de la Chancenkarte (§20b AufenthG), datado.
//
// POR QUÉ ESTE FICHERO EXISTE Y NO ES UNA ENTRADA DE cifras.ts
// ------------------------------------------------------------
// `cifras.ts` guarda HECHOS ESCALARES: un valor, una unidad, una vigencia.
// Un baremo no es eso: es una TABLA cuyos criterios se EXCLUYEN entre sí.
// Y esa exclusividad no es un detalle de formato — es parte del hecho, y es
// justo la propiedad que produjo los errores del día 144: dos artículos del
// sitio publicaban puntos de idioma equivocados, y uno de ellos aconsejaba
// al lector pagar un certificado B1 diciendo que daba 3 puntos (da 2).
// Partido en doce entradas sueltas, `excluyente` se pierde y el error vuelve.
//
// LA NO ACUMULACIÓN ESTÁ EN LA FUENTE, NO ES LECTURA NUESTRA: el documento
// oficial la escribe en los criterios 3, 4 y 7 — «keine Mehrfachberück-
// sichtigung möglich». Se data como hecho.
//
// QUIÉN DEBE CONSUMIRLO: la calculadora de la portada
// (`components/CalculadoraChancenkarte.astro`), que hoy lleva el baremo
// hardcodeado. Su implementación es CORRECTA (medida criterio a criterio el
// día 144) — el problema no es que calcule mal, es que nada obliga a que
// siga coincidiendo con lo que se publica en prosa.

export const BAREMO_CHANCENKARTE = {
  vigencia: '2026',
  verificado: '2026-08-01',
  minimo: 6,
  fuente: {
    nombre:
      '«Punktetabelle für die Chancenkarte», Ausländerbehörde de München ' +
      '(documento oficial bilingüe DE/EN). Respaldo legal: §20b AufenthG, ' +
      'cuyos doce números coinciden uno a uno con la tabla.',
    tipo: 'oficial' as const,
  },
  revision: {
    tipo: 'evento' as const,
    porque:
      'El baremo NO cambia por calendario: cambia por reforma legal del ' +
      '§20b AufenthG. Vigilar la norma, no la fecha. Un año sin cambios es ' +
      'lo normal, no un fallo de la revisión.',
  },

  /**
   * `excluyente: true` → dentro del grupo cuenta SOLO la opción más alta que
   * se cumpla. Es la propiedad que la fuente declara expresamente.
   * `excluyente: false` → el punto se suma si se cumple, con independencia
   * del resto.
   */
  grupos: [
    {
      id: 'reconocimiento',
      etiqueta: 'Reconocimiento PARCIAL de la cualificación profesional (Teilanerkennung)',
      excluyente: true,
      // OJO al enunciado, y no es un matiz de estilo: los 4 puntos son para
      // el reconocimiento PARCIAL — un Teilanerkennungsbescheid o
      // Defizitbescheid, el dictamen que dice que faltan medidas de
      // adaptación. Quien acredita equivalencia PLENA es Fachkraft y obtiene
      // la Chancenkarte SIN pasar por el baremo (§20a Abs. 3 Nr. 1).
      // Escribir «título reconocido» convierte esto en falso.
      opciones: [{ criterio: 'reconocimiento parcial por autoridad alemana', puntos: 4 }],
    },
    {
      id: 'aleman',
      etiqueta: 'Nivel de alemán certificado',
      excluyente: true, // «keine Mehrfachberücksichtigung möglich» (fuente)
      opciones: [
        { criterio: 'B2 o superior', puntos: 3 },
        { criterio: 'B1', puntos: 2 },
        { criterio: 'A2', puntos: 1 },
      ],
    },
    {
      id: 'ingles',
      etiqueta: 'Nivel de inglés certificado',
      excluyente: true,
      opciones: [{ criterio: 'C1 o superior', puntos: 1 }],
    },
    {
      id: 'experiencia',
      etiqueta: 'Experiencia profesional',
      excluyente: true, // «keine Mehrfachberücksichtigung möglich» (fuente)
      // Las dos ventanas temporales son DISTINTAS (7 años y 5 años) y esa
      // diferencia es del baremo, no una simplificación: 5 años de los
      // últimos 7 dan 3 puntos; 2 años de los últimos 5 dan 2.
      opciones: [
        { criterio: '5 años o más, dentro de los últimos 7', puntos: 3 },
        { criterio: '2 años o más, dentro de los últimos 5', puntos: 2 },
      ],
    },
    {
      id: 'edad',
      etiqueta: 'Edad',
      excluyente: true,
      opciones: [
        { criterio: 'menos de 35 años', puntos: 2 },
        { criterio: 'más de 35 y menos de 40', puntos: 1 },
      ],
    },
    {
      id: 'deficitaria',
      etiqueta: 'Cualificación en profesión deficitaria (Mangelberuf)',
      excluyente: false,
      opciones: [{ criterio: 'la profesión está en la lista de escasez', puntos: 1 }],
    },
    {
      id: 'residencia',
      etiqueta: 'Estancia previa en Alemania',
      excluyente: false,
      opciones: [
        { criterio: '6 meses de residencia legal continuada en los últimos 5 años', puntos: 1 },
      ],
    },
    {
      id: 'pareja',
      etiqueta: 'Cónyuge o pareja',
      excluyente: false,
      opciones: [{ criterio: 'cumple los requisitos y solicita conjuntamente', puntos: 1 }],
    },
  ],
} as const;
