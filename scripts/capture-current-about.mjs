import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://127.0.0.1:4173/#about');
  await page.waitForTimeout(2500);
  const about = await page.$('#about');
  if (about) await about.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/current_live_about_1920.png' });
  await browser.close();
  console.log('Saved screenshots/current_live_about_1920.png');
}

capture().catch(console.error);
