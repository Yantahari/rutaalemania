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
