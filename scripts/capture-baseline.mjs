import { chromium } from 'playwright';
import fs from 'fs';

const outDir = 'screenshots/before_correction';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function captureBaseline() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });

  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to Projects Section (04)
  const projectsSec = await page.$('#projects');
  if (projectsSec) {
    await projectsSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outDir}/before_projects_desktop.png` });
    console.log('Saved before_projects_desktop.png');
  }

  // Scroll to Experience / Journey Section (05)
  const journeySec = await page.$('#experience');
  if (journeySec) {
    await journeySec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${outDir}/before_journey_desktop.png` });
    console.log('Saved before_journey_desktop.png');
  }

  await browser.close();
}

captureBaseline().catch(err => {
  console.error(err);
  process.exit(1);
});
