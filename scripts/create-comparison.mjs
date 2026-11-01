import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 2160 } });

  const b1 = fs.readFileSync('screenshots/image_1_broken_implementation.png').toString('base64');
  const b2 = fs.readFileSync('screenshots/image_2_correct_visual_target.png').toString('base64');
  const b3 = fs.readFileSync('screenshots/current_live_about_1920.png').toString('base64');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #08080c; color: #fff; font-family: monospace; margin: 0; padding: 24px; box-sizing: border-box; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: #121218; border: 1px solid #333; padding: 16px; border-radius: 4px; }
        img { width: 100%; height: auto; display: block; border: 1px solid #222; }
        h2 { font-size: 14px; letter-spacing: 0.1em; margin: 0 0 12px 0; color: #aaa; }
        .highlight { color: #fff; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="grid">
        <div class="card">
          <h2><span class="highlight">IMAGE 1</span> — BROKEN IMPLEMENTATION (USER PROVIDED)</h2>
          <img src="data:image/png;base64,${b1}" />
        </div>
        <div class="card">
          <h2><span class="highlight">IMAGE 2</span> — CORRECT VISUAL TARGET (USER PROVIDED)</h2>
          <img src="data:image/png;base64,${b2}" />
        </div>
      </div>
      <div class="grid" style="margin-top: 24px;">
        <div class="card" style="grid-column: span 2;">
          <h2><span class="highlight">CURRENT LIVE IMPLEMENTATION</span> (PORT 4173 @ 1920x1080)</h2>
          <img src="data:image/png;base64,${b3}" />
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/side_by_side_comparison.png', fullPage: true });
  await browser.close();
  console.log('Saved screenshots/side_by_side_comparison.png with embedded base64 images');
}

run().catch(console.error);
