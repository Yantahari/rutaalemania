/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ⚠️ `mjs` y `plugins/` NO estaban, y su ausencia era invisible (día 162):
    // el nombre de la clase del aviso vive en `src/data/afiliados.mjs` y en
    // `plugins/rehype-aviso-afiliado.mjs`. Tailwind poda la capa `components`
    // según lo que ENCUENTRA, así que `.aviso-afiliado` no llegaba a la hoja
    // y el aviso se rendía SIN ESTILO — 16px del cuerpo heredado. Medido con
    // Playwright, no leído.
    './src/**/*.{astro,html,js,jsx,md,mdx,mjs,svelte,ts,tsx,vue}',
    './plugins/**/*.mjs',
  ],
  theme: {
    extend: {
      colors: {
        coal: '#1a1a2e',
        midnight: '#16213e',
        ocean: '#0f3460',
        amber: {
          DEFAULT: '#e2a730',
          light: '#d4951c',
          glow: 'rgba(226, 167, 48, 0.08)',
        },
        cream: '#faf8f4',
        'warm-gray': '#f0ece4',
        surface: '#ffffff',
        'surface-alt': '#f8f7f4',
        'surface-muted': '#f1efe9',
        border: '#e5e0d5',
        'border-light': '#eee9df',
        'text-primary': '#1f2937',
        'text-secondary': '#4b5563',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
