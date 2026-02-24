import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'checklist-source.html');
const outputPath = join(__dirname, '..', 'public', 'checklist-emigrar-alemania.pdf');

async function generatePDF() {
  console.log('Generating PDF from:', inputPath);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('PDF saved to:', outputPath);
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
