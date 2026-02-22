import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://rutaalemania.com',
  integrations: [tailwind()],
  i18n: undefined,
});
