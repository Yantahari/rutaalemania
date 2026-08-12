// src/data/afiliados.mjs — LA FUENTE ÚNICA de dos cosas que hasta hoy vivían
// repetidas: **qué cuenta como enlace de afiliado** y **qué dice el aviso**.
//
// POR QUÉ NACIÓ (12-ago-2026, día 162, condición del Director):
// había 56 copias sueltas del literal en el árbol. Si mañana el texto tiene que
// cambiar —idioma, redacción, obligación legal— con copias sueltas son ~133
// ediciones a mano y con fuente única es una. El requisito va ENUNCIADO, no
// enumerado: **el aviso por enlace SE GENERA de una fuente única**, no «existe
// un aviso junto a cada enlace».
//
// ⚠️ ES `.mjs` Y NO `.ts` A PROPÓSITO: lo importa `astro.config.mjs` (para el
// plugin de rehype) además de los `.astro`. La config de Astro no pasa por el
// transpilador de TypeScript, así que un `.ts` aquí rompería el build. Es la
// única razón; si algún día la config deja de necesitarlo, vuelve a `.ts`.
//
// LO QUE ESTE FICHERO GOBIERNA, y quién lo consume:
//   · plugins/rehype-aviso-afiliado.mjs → los 15 artículos `.md`
//   · los `.astro` con enlaces (recursos, links, las dos calculadoras)
//   · tests/test_afiliados.py y la próxima auditoría (docs/medir-avisos-afiliados.md)

// ── EL LITERAL ────────────────────────────────────────────────────────────
// Es el que el sitio YA usaba 56 veces. NO se inventa redacción nueva y NO se
// traduce: la pregunta del idioma (la marca se exige en alemán, el público es
// hispanohablante) está ABIERTA y es de abogado — y no bloquea, porque poner
// etiqueta en castellano donde no hay ninguna no empeora nada bajo ninguna
// lectura. Cuando esa decisión caiga, se cambia AQUÍ y en ningún otro sitio.
export const AVISO_AFILIADO = '*Enlace de afiliado — sin coste extra para ti';

// ⚠️ EL ESTILO YA NO VIAJA EN LÍNEA (12-ago-2026, día 162, veto del Director).
// Hasta hoy esto era el `style` copiado verbatim de las 56 apariciones viejas,
// y traía dentro un `margin-top:-0.75rem` que estaba **calibrado contra el
// botón** (`margin:1.5rem 0`). Fuera de ese contexto el tirón no encontraba
// hueco y el aviso se superponía al texto: 12,0 px de solape medidos con
// Playwright sobre el HTML servido, en 30 de 33 avisos de `primeros-pasos`.
// Ahora es una CLASE (`.aviso-afiliado`, en `src/styles/global.css`), que es
// lo que permite que cada contexto —párrafo, lista, botón, carrusel— reciba
// lo suyo sin duplicar el literal. La fuente única no cambia: sigue siendo
// este fichero para el TEXTO y aquella clase para la FORMA.
export const AVISO_CLASE = 'aviso-afiliado';

// ── QUÉ CUENTA COMO ENLACE DE AFILIADO — enunciado, no enumerado ──────────
// LA REGLA: es enlace de afiliado **todo enlace saliente hacia el dominio de un
// actor con el que hay programa**, lleve o no identificador de seguimiento en
// la URL. Se mide POR ACTOR, no por identificador.
//
// 🔴 POR QUÉ ESTA REGLA Y NO LA DE ANTES (caso medido el día 162): el recuento
// del día 160 buscaba identificadores (`1169811`, `camref`, `uid=48`…). Ese
// método no sólo cuenta de menos: **da FALSOS LIMPIOS**. `mascotas-alemania`
// salía 4 enlaces / 4 avisos —cubierta— y por actor sale **8 / 4**: los cuatro
// invisibles eran de Feather, que es «directo» y no lleva identificador. El
// mismo mecanismo explicaba el imposible `seguro-medico` «1 enlace y 10
// avisos»: son 10 y 10.
//
// SEIS ACTORES, no siete: CHECK24 y Tarifcheck24 son la misma empresa
// (medido el día 144). La lista de programas manda en ESTADO.md §2.
export const ACTORES_AFILIADOS = [
  { actor: 'CHECK24',     dominios: ['check24.net', 'check24.de'] },
  { actor: 'Tarifcheck24', dominios: ['partner-versicherung.de', 'tarifcheck.de'] },
  { actor: 'Feather',     dominios: ['feather-insurance.com'] },
  { actor: 'Expatrio',    dominios: ['expatrio.com'] },
  { actor: 'Wise',        dominios: ['wise.com', 'wise.prf.hn'] },
  { actor: 'Lingoda',     dominios: ['lingoda.com', 'l16sh94jd.com'] },
  { actor: 'Lyca Mobile', dominios: ['lycamobile.de', 'lycamobile.com', 'awin1.com', 'tidd.ly'] },
];

// ⚠️ LÍMITE DECLARADO, y viaja con cada número que salga de aquí:
// **este recuento es un SUELO.** No caza (a) acortadores nuevos —`tidd.ly` está
// en la lista porque se encontró leyendo, no porque un patrón lo dedujera—;
// (b) dominios de un actor que no estén escritos arriba; (c) un programa nuevo
// que nadie haya añadido a esta lista. Las tres se arreglan igual: editando
// ESTE fichero. Ninguna se arregla mirando más fuerte.
export const LIMITE_DEL_RECUENTO =
  'SUELO: no caza acortadores no listados, dominios no escritos, ni programas nuevos sin dar de alta aquí.';

const DOMINIOS = ACTORES_AFILIADOS.flatMap((a) => a.dominios);

/** ¿Es esta URL un enlace de afiliado? Coincide con el host o un subdominio. */
export function esUrlAfiliado(url) {
  if (!url || typeof url !== 'string') return false;
  let host;
  try {
    host = new URL(url, 'https://rutaalemania.com').hostname.toLowerCase();
  } catch {
    return false;
  }
  return DOMINIOS.some((d) => host === d || host.endsWith(`.${d}`));
}

/** Qué actor hay detrás de una URL de afiliado — para auditar, no para pintar. */
export function actorDe(url) {
  if (!url) return null;
  let host;
  try {
    host = new URL(url, 'https://rutaalemania.com').hostname.toLowerCase();
  } catch {
    return null;
  }
  const m = ACTORES_AFILIADOS.find(({ dominios }) =>
    dominios.some((d) => host === d || host.endsWith(`.${d}`)));
  return m ? m.actor : null;
}
