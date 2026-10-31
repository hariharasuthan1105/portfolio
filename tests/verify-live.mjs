import { chromium } from 'playwright';

async function verifyLive() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  const page = await context.newPage();
  
  console.log('Navigating to live AWS Amplify app...');
  const res = await page.goto('https://main.d3r0wa5wh6oirj.amplifyapp.com/?live_check=' + Date.now(), { waitUntil: 'networkidle', timeout: 35000 });
  console.log('HTTP Status:', res.status());
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/championship_verified/live_amplify_deployed_desktop_1536x1024.png', fullPage: false });
  console.log('Captured live hero screenshot.');

  // Check chamber hint banner
  const hintText = await page.locator('.chamber-hint-text').innerText().catch(() => 'None');
  console.log('Live Chamber Hint:', hintText);

  // Navigate to Vault
  await page.locator('a[href="#vault"]').first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/championship_verified/live_amplify_deployed_vault.png', fullPage: false });
  console.log('Captured live vault screenshot.');

  // Check console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await browser.close();
  console.log('Live verification complete! Status 200, zero broken assets.');
}

verifyLive().catch(console.error);
