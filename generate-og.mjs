import { chromium } from 'playwright';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const PUBLIC = resolve(import.meta.dirname, 'public');

const WIDTH = 1200;
const HEIGHT = 630;

// Read logo as base64 data URI so it loads in setContent
const logoBytes = await readFile(resolve(PUBLIC, 'logo-rutaalemania.png'));
const LOGO_B64 = `data:image/png;base64,${logoBytes.toString('base64')}`;

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: #faf8f4;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Amber accent bars */
  .bar-top, .bar-bottom {
    position: absolute;
    left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, #e2a730, #d4951c, #e2a730);
  }
  .bar-top { top: 0; }
  .bar-bottom { bottom: 0; }

  /* Subtle warm radial glow */
  .glow {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(226,167,48,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .glow-bl {
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(226,167,48,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 56px;
    padding: 0 80px;
    position: relative;
    z-index: 1;
  }

  .logo {
    width: 180px;
    height: 180px;
    flex-shrink: 0;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
  }

  .text {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-family: 'Fraunces', serif;
    font-size: 72px;
    font-weight: 800;
    color: #1f2937;
    line-height: 1.1;
    margin-bottom: 8px;
    letter-spacing: -1px;
  }
  .title em {
    color: #e2a730;
    font-style: italic;
  }

  .sep {
    width: 64px;
    height: 3px;
    background: #e2a730;
    border-radius: 2px;
    margin: 16px 0;
  }

  .subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 28px;
    color: #4b5563;
    font-weight: 400;
    line-height: 1.4;
    margin-bottom: 24px;
  }

  .badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 8px 24px;
    border: 2px solid #e5e0d5;
    border-radius: 10px;
    color: #e2a730;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: rgba(226,167,48,0.05);
  }
</style>
</head>
<body>
  <div class="bar-top"></div>
  <div class="bar-bottom"></div>
  <div class="glow"></div>
  <div class="glow-bl"></div>

  <div class="content">
    <img class="logo" src="${LOGO_B64}" alt="" />
    <div class="text">
      <div class="title">Ruta<em>Alemania</em></div>
      <div class="sep"></div>
      <div class="subtitle">Tu guia para emigrar a Alemania</div>
      <div class="badge">rutaalemania.com</div>
    </div>
  </div>
</body>
</html>`;

async function generate() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  // Wait for fonts + logo to load
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: resolve(PUBLIC, 'og-default.png'),
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });
  await browser.close();
  console.log('✓ og-default.png (1200x630 @2x)');
}

generate().catch(err => { console.error(err); process.exit(1); });
