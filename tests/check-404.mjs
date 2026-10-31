import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  page.on('request', req => {
    // console.log('REQ:', req.url());
  });

  page.on('requestfailed', req => {
    console.log('REQ FAILED:', req.url(), req.failure()?.errorText);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('HTTP ERROR', res.status(), res.url());
    }
  });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await browser.close();
})();
