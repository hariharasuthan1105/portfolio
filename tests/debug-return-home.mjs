import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Navigate to Vault
  const vaultLink = await page.$('header nav a[href="#vault"]');
  await vaultLink.click();
  await page.waitForTimeout(1500);
  console.log('Scrolled to vault, scrollY:', await page.evaluate(() => window.scrollY));

  // Now click HOME link in topbar
  const homeLink = await page.$('header nav a[href="#home"]');
  await homeLink.click();
  await page.waitForTimeout(1500);
  console.log('After clicking home, scrollY:', await page.evaluate(() => window.scrollY));
  
  await page.screenshot({ path: 'screenshots/baseline_audit/debug_click_home.png' });
  await browser.close();
})();
