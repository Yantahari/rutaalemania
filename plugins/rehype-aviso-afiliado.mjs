// plugins/rehype-aviso-afiliado.mjs — el aviso de afiliado SE GENERA, no se copia.
//
// POR QUÉ EXISTE (12-ago-2026, día 162): condición del Director al ordenar el
// arreglo de §8.29 — «la etiqueta sale de una sola fuente, no de 77 copias».
// Este plugin es el consumidor del lado `.md`; la fuente es
// `src/data/afiliados.mjs`, que también gobierna qué cuenta como enlace.
//
// ── LO QUE HAY QUE SABER PARA NO ROMPERLO ────────────────────────────────
// 🔴 UN PLUGIN DE REHYPE DE USUARIO **NO VE EL HTML CRUDO** del markdown, y
// esto NO es un detalle: se midió con una sonda el día 162 y
// `seguro-medico-alemania.md` —que tiene 10 botones de afiliado— devolvía
// **CERO elementos `<a>`**. Los plugins de usuario corren ANTES de que Astro
// convierta el HTML crudo en elementos, así que un botón escrito como
// `<a href=…>` llega como nodo `raw` con la etiqueta de apertura SUELTA
// (el `</a>` es otro nodo `raw` aparte), y sólo los enlaces en sintaxis
// markdown `[x](y)` llegan como `element`.
//
// Si este plugin sólo mirara `element`, cubriría 62 de los 104 enlaces y
// declararía limpio el resto: **exactamente el falso limpio que el método
// viejo producía y que A4 existe para matar.** Por eso mira LAS DOS FORMAS.
//
// GRANULARIDAD, declarada: el aviso se inserta **después del bloque que
// contiene el enlace** (el `<p>`, el `<li>`…). Un bloque con dos enlaces de
// afiliado recibe UN aviso, no dos. Es la convención que el sitio ya usaba en
// sus 56 copias y no la cambia este acto. ⚠️ Si la lectura legal acaba
// exigiendo etiqueta por enlace y no por bloque (cautela 1 de §8.29, que es de
// abogado), lo que hay que tocar es este fichero y sólo este fichero.

import { AVISO_AFILIADO, AVISO_CLASE, esUrlAfiliado } from '../src/data/afiliados.mjs';

// Los bloques tras los que tiene sentido colgar el aviso.
//
// ⚠️ `td`/`th` NO ESTÁN, y `table` SÍ (día 162, veto del Director). La celda
// parecía el sitio natural —es donde está el enlace— y medida no lo es: el
// aviso son ~45 caracteres y **ensancha su columna**, que en la tabla de
// bancos de `primeros-pasos` partía la fila de C24 Bank y desalineaba el
// resto. Es el único caso de tabla del sitio entero (1 de 130 avisos), así
// que la regla se decide sobre el caso que hay, no sobre uno imaginado:
// **el aviso sale de la celda y va una vez bajo la tabla.**
const BLOQUES = new Set(['p', 'blockquote', 'figure', 'div', 'table', 'ul', 'ol']);

// 🔴 LOS QUE LO LLEVAN DENTRO Y NO DETRÁS, y esto lo cazó UN OJO mirando el
// HTML rendido, no el recuento (12-ago-2026 — la lección del 161 otra vez:
// «lo que se genera está verificado; lo que se RINDE, míralo»). La primera
// versión metía el aviso como hermano del bloque SIEMPRE, y en la lista de
// comprobación de `mascotas` eso produce `</li><p>…</p><li>`: **un `<p>` como
// hijo directo de `<ul>`, que es HTML inválido** y que el navegador saca de la
// lista. El recuento salía perfecto (8 de 8) y la página estaba rota.
const LO_LLEVAN_DENTRO = new Set([]);

// ¿Este nodo `raw` abre un enlace de afiliado? Nos quedamos con el href.
const HREF_EN_CRUDO = /<a\s[^>]*href=["']([^"']+)["']/i;

function llevaAfiliado(nodo) {
  if (nodo.type === 'element' && nodo.tagName === 'a') {
    return esUrlAfiliado(nodo.properties?.href);
  }
  if (nodo.type === 'raw') {
    const m = HREF_EN_CRUDO.exec(nodo.value || '');
    return Boolean(m && esUrlAfiliado(m[1]));
  }
  return (nodo.children || []).some(llevaAfiliado);
}

// El aviso ya presente se reconoce por su TEXTO, no por su marcado: así una
// copia vieja con otro estilo tampoco se duplica.
function yaEsAviso(nodo) {
  if (!nodo) return false;
  if (nodo.type === 'raw') return (nodo.value || '').includes(AVISO_AFILIADO);
  const texto = (function recoge(n) {
    if (n.type === 'text') return n.value;
    return (n.children || []).map(recoge).join('');
  })(nodo);
  return texto.includes(AVISO_AFILIADO);
}

// 🔴 EL SEGUNDO DEFECTO QUE CAZÓ EL RECUENTO, no el ojo (12-ago-2026):
// `llevaAfiliado` es recursiva y `div` está en BLOQUES, así que un `<div>` que
// envuelve al `<p>` del enlace recibía SU PROPIO aviso además del del `<p>`.
// `blue-card` salía con 8 avisos para 5 enlaces. La regla correcta es **el
// bloque MÁS INTERNO**: como el recorrido es en profundidad, basta con no
// tocar un bloque que ya tenga un aviso generado dentro.
function tieneAvisoDentro(nodo) {
  if (nodo.type === 'element' && nodo.properties?.['data-aviso-afiliado']) return true;
  return (nodo.children || []).some(tieneAvisoDentro);
}

function nodoAviso() {
  return {
    type: 'element',
    tagName: 'p',
    properties: { className: [AVISO_CLASE], 'data-aviso-afiliado': 'generado' },
    children: [{ type: 'text', value: AVISO_AFILIADO }],
  };
}

export function rehypeAvisoAfiliado() {
  return (tree, file) => {
    let puestos = 0;
    const visita = (padre) => {
      const hijos = padre.children;
      if (!Array.isArray(hijos)) return;
      for (let i = 0; i < hijos.length; i += 1) {
        visita(hijos[i]);
        const n = hijos[i];
        const esBloque = n.type === 'element' && BLOQUES.has(n.tagName);
        if (!esBloque || !llevaAfiliado(n)) continue;
        if (tieneAvisoDentro(n)) continue;   // ya lo puso un bloque más interno
        if (LO_LLEVAN_DENTRO.has(n.tagName)) {
          const ultimo = n.children[n.children.length - 1];
          if (yaEsAviso(ultimo)) continue;
          n.children.push(nodoAviso());
          puestos += 1;
          continue;
        }
        if (yaEsAviso(hijos[i + 1])) continue;
        hijos.splice(i + 1, 0, nodoAviso());
        puestos += 1;
        i += 1;   // saltar el aviso recién puesto
      }
    };
    visita(tree);
    if (puestos && process.env.AVISOS_VERBOSE) {
      const nombre = String(file.history?.[0] || '').split('/').pop();
      console.log(`[avisos] ${nombre}: ${puestos} generados`);
    }
  };
}
