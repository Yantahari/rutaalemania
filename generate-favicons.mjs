import { chromium } from 'playwright';
import { resolve } from 'path';
import { writeFile } from 'fs/promises';

const PUBLIC = resolve(import.meta.dirname, 'public');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
];

function html(size) {
  const r = Math.round(size * 0.1875);
  const fs = Math.round(size * 0.6);
  const x = Math.round(size * 0.11);
  const y = Math.round(size * 0.74);
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}body{width:${size}px;height:${size}px;overflow:hidden;}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#1a1a2e"/>
  <text x="${x}" y="${y}" font-family="Georgia,serif" font-weight="bold" font-size="${fs}" fill="#e2a730">RA</text>
</svg></body></html>`;
}

async function generate() {
  const browser = await chromium.launch();

  for (const { name, size } of sizes) {
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.setContent(html(size), { waitUntil: 'load' });
    await page.screenshot({ path: resolve(PUBLIC, name), clip: { x: 0, y: 0, width: size, height: size } });
    await ctx.close();
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Generate favicon.ico from the 16 and 32 PNGs using a minimal ICO writer
  const png16 = await readPng(resolve(PUBLIC, 'favicon-16.png'));
  const png32 = await readPng(resolve(PUBLIC, 'favicon-32.png'));
  const ico = createIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ]);
  await writeFile(resolve(PUBLIC, 'favicon.ico'), ico);
  console.log('✓ favicon.ico (16+32)');

  await browser.close();
  console.log('\nDone!');
}

async function readPng(path) {
  const { readFile } = await import('fs/promises');
  return readFile(path);
}

function createIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * images.length;

  let offset = dataOffset;
  const entries = [];
  for (const img of images) {
    entries.push({ size: img.size, data: img.data, offset });
    offset += img.data.length;
  }

  const totalSize = offset;
  const buf = Buffer.alloc(totalSize);

  // ICO header
  buf.writeUInt16LE(0, 0);      // reserved
  buf.writeUInt16LE(1, 2);      // type (1=ICO)
  buf.writeUInt16LE(images.length, 4); // count

  // Entries
  entries.forEach((e, i) => {
    const pos = headerSize + i * entrySize;
    buf.writeUInt8(e.size < 256 ? e.size : 0, pos);      // width
    buf.writeUInt8(e.size < 256 ? e.size : 0, pos + 1);   // height
    buf.writeUInt8(0, pos + 2);   // color palette
    buf.writeUInt8(0, pos + 3);   // reserved
    buf.writeUInt16LE(1, pos + 4);  // color planes
    buf.writeUInt16LE(32, pos + 6); // bits per pixel
    buf.writeUInt32LE(e.data.length, pos + 8);  // data size
    buf.writeUInt32LE(e.offset, pos + 12);      // data offset
  });

  // Image data
  entries.forEach(e => {
    e.data.copy(buf, e.offset);
  });

  return buf;
}

generate().catch(err => { console.error(err); process.exit(1); });
