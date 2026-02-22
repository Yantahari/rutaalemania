import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rutaalemania.com',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/impressum/') &&
        !page.includes('/datenschutz/') &&
        !page.includes('/disclaimer/'),
    }),
  ],
});
