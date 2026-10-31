import { chromium } from 'playwright';

async function captureForge() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1536x1024
  const context = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/#skills', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const skillsSec = page.locator('#skills');
  await skillsSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'screenshots/forge_desktop_1536x1024_all.png',
    fullPage: false,
  });
  console.log('Captured forge_desktop_1536x1024_all.png');

  // Test selecting 'AI / ML' category
  const aimlBtn = page.locator('button.forge-cat-btn:has-text("AI / ML")');
  if (await aimlBtn.isVisible()) {
    await aimlBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: 'screenshots/forge_desktop_1536x1024_aiml.png',
      fullPage: false,
    });
    console.log('Captured forge_desktop_1536x1024_aiml.png');
  }

  // 2. Mobile 390x844
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1500);

  const mobileSkills = mobilePage.locator('#skills');
  await mobileSkills.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(2000);

  await mobilePage.screenshot({
    path: 'screenshots/forge_mobile_390x844.png',
    fullPage: false,
  });
  console.log('Captured forge_mobile_390x844.png');

  await browser.close();
  console.log('Done capturing Section 03 screenshots.');
}

captureForge().catch(console.error);
