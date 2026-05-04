// Variant contextual del site: lockup horitzontal amb fons coal (#1a1a2e)
// per encaixar amb el bg-coal del footer. NO és un asset del paquet de marca.
// Es deriva de svg/09-lockup-horitzontal-fons-fosc.svg amb el rect de fons
// substituït per coal i la tipografia IBM Plex Serif carregada via Google Fonts.
import { chromium } from 'playwright';
import { resolve } from 'path';

const PUBLIC = resolve(import.meta.dirname, 'public');

const COAL = '#1a1a2e';
const W = 1200;
const H = 280;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <rect width="600" height="140" fill="${COAL}"></rect>
  <g transform="translate(20,20)">
    <rect x="0" y="46" width="13.5" height="8" fill="#000000"></rect>
    <rect x="13.3" y="46" width="13.5" height="8" fill="#DD0000"></rect>
    <rect x="26.6" y="46" width="14.9" height="8" fill="#FFCE00"></rect>
    <path d="M 35 15 L 75 15 L 85 25 L 85 85 L 35 85 Z" fill="#F5F2EC"></path>
  </g>
  <text x="150" y="88" fill="#F5F2EC" font-family="'IBM Plex Serif', 'Times New Roman', serif" font-size="64" letter-spacing="-0.64">
    <tspan font-style="italic" font-weight="300">Ruta</tspan><tspan font-weight="400"> Alemania</tspan><tspan fill="#E0A93B" font-weight="400">.</tspan>
  </text>
</svg>`;

const html = `<!DOCTYPE html>
<html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;1,300&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;}
  html,body{width:${W}px;height:${H}px;background:${COAL};overflow:hidden;}
  .wrap{width:${W}px;height:${H}px;}
  .wrap svg{display:block;}
</style>
</head><body><div class="wrap">${svg}</div></body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
// Wait for font to settle
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.screenshot({
  path: resolve(PUBLIC, 'lockup-horitzontal-fons-coal.png'),
  clip: { x: 0, y: 0, width: W, height: H },
  omitBackground: false,
});
await browser.close();
console.log(`✓ lockup-horitzontal-fons-coal.png (${W}x${H}, bg=${COAL})`);
