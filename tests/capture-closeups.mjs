import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  
  await page.goto('http://127.0.0.1:4173/#vault', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  // Solve Challenge 1
  await page.fill('#scanner', '100');
  await page.dispatchEvent('#scanner', 'change');
  
  // Solve Challenge 2
  await page.click('.rag-action-btn');
  await page.waitForTimeout(2800);
  
  // Solve Challenge 3
  const nodes = await page.$$('.node-button');
  await nodes[0].click();
  await nodes[1].click();
  await nodes[1].click();
  await nodes[2].click();
  await nodes[2].click();
  await nodes[3].click();
  await page.waitForTimeout(800);
  
  // Scroll to reveal
  const el = await page.$('.vault-reveal');
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/championship_verified/02_vault_superpower_reveal_close.png' });
    console.log('Saved 02_vault_superpower_reveal_close.png');
  }

  // Open project modal
  await page.goto('http://127.0.0.1:4173/#projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.click('.project-card:nth-child(1) .project-open');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshots/championship_verified/03_project_architecture_modal.png' });
  console.log('Saved 03_project_architecture_modal.png');

  await browser.close();
})();
