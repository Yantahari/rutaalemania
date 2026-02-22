/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        coal: '#1a1a2e',
        midnight: '#16213e',
        ocean: '#0f3460',
        amber: {
          DEFAULT: '#e2a730',
          light: '#f0c760',
          glow: 'rgba(226, 167, 48, 0.15)',
        },
        cream: '#faf8f4',
        'warm-gray': '#f0ece4',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
