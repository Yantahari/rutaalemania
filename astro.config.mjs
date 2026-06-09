import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
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
  site: 'https://rutaalemania.com',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/impressum/') &&
        !page.includes('/datenschutz/') &&
        !page.includes('/disclaimer/'),
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
