import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_1_idle.png' });

  // Click ENTER THE KINGDOM
  const enterBtn = await page.$('.hero-btn-enter');
  console.log('Clicking ENTER THE KINGDOM...');
  await enterBtn.click();

  // Watch transition
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_2_activating.png' });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_3_entering.png' });

  // Wait until we reach about
  await page.waitForTimeout(1500);
  console.log('Reached about, scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_4_inside_about.png' });

  // Now return Home via topbar HOME link
  const homeLink = await page.$('header nav a[href="#home"]');
  console.log('Clicking HOME to return...');
  await homeLink.click();

  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_5_returning_600ms.png' });

  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_6_returned_2000ms.png' });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/baseline_audit/portal_7_returned_4000ms.png' });

  console.log('Portal flight test completed.');
  await browser.close();
})();
