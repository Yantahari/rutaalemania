import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { rehypeAvisoAfiliado } from './plugins/rehype-aviso-afiliado.mjs';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_TIME = new Date().toISOString();

function resolveSourceFile(pathname) {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '') return 'src/pages/index.astro';

  const candidates = [
    `src/pages${clean}.astro`,
    `src/pages${clean}/index.astro`,
    `src/pages${clean}.md`,
    `src/content${clean}.md`,
  ];

  for (const rel of candidates) {
    if (existsSync(resolve(__dirname, rel))) return rel;
  }
  return null;
}

function lastModFor(pathname) {
  const rel = resolveSourceFile(pathname);
  if (!rel) return BUILD_TIME;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${rel}"`, {
      cwd: __dirname,
      encoding: 'utf-8',
    }).trim();
    return out || BUILD_TIME;
  } catch {
    return BUILD_TIME;
  }
}

export default defineConfig({
  // El aviso de afiliado de los artículos se GENERA aquí, de una sola fuente
  // (src/data/afiliados.mjs). Ver plugins/rehype-aviso-afiliado.mjs.
  markdown: { rehypePlugins: [rehypeAvisoAfiliado] },
  site: 'https://rutaalemania.com',
  // TRAILING SLASH — 'always', puesto el 14-ago-2026 (día 166) por decisión del
  // Director, y con su alcance real declarado, que NO es el que parecía:
  //
  // ⚠️ ESTO NO GOBIERNA PRODUCCIÓN. Las 28 páginas son prerenderizadas (sin
  // adaptador, `output` estático), y la doc de Astro 5.17.3 lo dice: «trailing
  // slashes on prerendered pages are handled by the hosting platform». Medido
  // contra producción: /blog/x devuelve 301 hacia /blog/x/ y /blog/x/ devuelve
  // 200 — lo decide NETLIFY, no esto.
  //
  // LO QUE SÍ HACE, y es para lo que se pone: `post.url` respeta el ajuste, y
  // de ahí salen los enlaces del listado del blog (`pages/blog/index.astro:27`,
  // `href={post.url}`) y de la portada. MEDIDO construyendo con cada opción:
  //   sin declarar ('ignore') → 23 enlaces internos SIN barra
  //   'always'               →  3   (los 3 restantes son literales de markdown)
  //   'never'                → 42
  // Los 28 ficheros HTML NO cambian con ninguna: el layout emitido es el mismo.
  //
  // POR QUÉ 'always' Y NO 'never': porque es la forma que YA usa todo lo
  // publicado —44 URLs en las descripciones de YouTube, las de los registros de
  // RRSS, /links/ y las bios—, la que emite nuestra propia canónica y la que
  // Netlify sirve con 200. 'never' pondría al sitio a emitir sistemáticamente
  // la forma que su propio servidor redirige: un salto de 301 por cada clic
  // interno. No se encontró ninguna razón a favor de 'never'.
  //
  // LO QUE ESTO NO ARREGLA (§8.16): cierra la puerta por la que Google descubrió
  // /blog/trabajar-en-it-alemania sin barra, pero NO recupera el histórico ya
  // partido en GSC (9 + 2 impresiones). La consolidación es hacia delante.
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/impressum/') &&
        !page.includes('/datenschutz/') &&
        !page.includes('/disclaimer/') &&
        !page.includes('/checklist/'),   // /checklist/gracias/: sólo llega quien confirma (18-ago-2026)
      serialize(item) {
        try {
          const url = new URL(item.url);
          item.lastmod = lastModFor(url.pathname);
        } catch {
          item.lastmod = BUILD_TIME;
        }
        return item;
      },
    }),
  ],
});
