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
// ⚠️ 3-sep-2026 (día 179 de ops): LA GRANULARIDAD CAMBIA DE BLOQUE A ENLACE.
// Lo de abajo describe la forma anterior y se conserva como historia; la
// forma vigente está en `rehypeAvisoAfiliado` (marcador inline tras cada <a>).
// GRANULARIDAD anterior, declarada: el aviso se insertaba **después del bloque que
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
function textoDe(n) {
  if (!n) return '';
  if (n.type === 'raw' || n.type === 'text') return n.value || '';
  return (n.children || []).map(textoDe).join('');
}
function yaEsAviso(nodo) {
  return textoDe(nodo).includes(AVISO_AFILIADO);
}

// ── LA FORMA VIGENTE (3-sep-2026): UN MARCADOR INLINE PEGADO A CADA ENLACE ──
// Por qué inline y no por bloque: el § 5a Abs. 4 UWG pide que el fin comercial
// sea reconocible, y eso se predica de cada enlace; medido el 3-sep sobre el
// sitio construido, el aviso por bloque quedaba a 919-1.549 caracteres de seis
// enlaces bajo listas y una tabla. Con el marcador pegado al enlace, listas y
// tablas dejan de ser un caso (y el veto del 162 a la celda —el aviso
// ensanchaba la columna— se revisa con el marcador corto delante: ahora es
// texto en línea, no un párrafo).
//
// Ve LAS DOS FORMAS de enlace, como antes: `element` (sintaxis markdown) y
// `raw` (HTML crudo). En `raw` el `</a>` puede estar en el mismo nodo o en un
// nodo `raw` posterior (la lección del 162): se busca hacia delante.
const SPAN_AVISO = `<span class="${AVISO_CLASE}" data-aviso-afiliado="generado">${AVISO_AFILIADO}</span>`;
const RE_APERTURA = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;

function nodoAvisoInline() {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: [AVISO_CLASE], 'data-aviso-afiliado': 'generado' },
    children: [{ type: 'text', value: AVISO_AFILIADO }],
  };
}

// Inserta el marcador tras cada `</a>` de afiliado dentro de un string crudo.
// Devuelve [textoNuevo, aperturasSinCierre]: las aperturas de afiliado cuyo
// `</a>` no está en este mismo nodo.
function marcarCrudo(valor) {
  const aperturas = [];
  let m;
  while ((m = RE_APERTURA.exec(valor)) !== null) {
    if (esUrlAfiliado(m[1])) aperturas.push(m.index + m[0].length);
  }
  let pendientes = 0;
  let out = valor;
  for (let k = aperturas.length - 1; k >= 0; k -= 1) {
    const cierre = out.indexOf('</a>', aperturas[k]);
    if (cierre === -1) { pendientes += 1; continue; }
    const fin = cierre + '</a>'.length;
    if (out.slice(fin, fin + SPAN_AVISO.length + 8).includes(AVISO_AFILIADO)) continue;
    out = out.slice(0, fin) + SPAN_AVISO + out.slice(fin);
  }
  return [out, pendientes];
}

export function rehypeAvisoAfiliado() {
  return (tree, file) => {
    let puestos = 0;
    const visita = (padre) => {
      const hijos = padre.children;
      if (!Array.isArray(hijos)) return;
      for (let i = 0; i < hijos.length; i += 1) {
        const n = hijos[i];
        if (n.type === 'element' && n.tagName === 'a') {
          if (esUrlAfiliado(n.properties?.href) && !yaEsAviso(hijos[i + 1])) {
            hijos.splice(i + 1, 0, nodoAvisoInline());
            puestos += 1;
            i += 1;
          }
          continue;
        }
        if (n.type === 'raw') {
          const [nuevoValor, pendientes] = marcarCrudo(n.value || '');
          if (nuevoValor !== n.value) { puestos += 1; n.value = nuevoValor; }
          for (let faltan = pendientes, j = i + 1; faltan > 0 && j < hijos.length; j += 1) {
            const h = hijos[j];
            if (h.type !== 'raw' || !(h.value || '').includes('</a>')) continue;
            const fin = h.value.indexOf('</a>') + '</a>'.length;
            if (!h.value.slice(fin, fin + SPAN_AVISO.length + 8).includes(AVISO_AFILIADO)) {
              h.value = h.value.slice(0, fin) + SPAN_AVISO + h.value.slice(fin);
              puestos += 1;
            }
            faltan -= 1;
          }
          continue;
        }
        visita(n);
      }
    };
    visita(tree);
    if (puestos && process.env.AVISOS_VERBOSE) {
      const nombre = String(file.history?.[0] || '').split('/').pop();
      console.log(`[avisos] ${nombre}: ${puestos} generados`);
    }
  };
}
