import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function waitForAmplifyDeploy() {
  const browser = await chromium.launch({ headless: true });
  const liveUrl = 'https://main.d3r0wa5wh6oirj.amplifyapp.com/';

  const outDir = path.resolve('screenshots/live_verified');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Polling live Amplify deployment at: ${liveUrl}`);

  let isDeployed = false;
  let attempts = 0;
  const maxAttempts = 25; // Poll every 12 seconds for up to 5 minutes

  while (!isDeployed && attempts < maxAttempts) {
    attempts++;
    console.log(`[Attempt ${attempts}/${maxAttempts}] Checking live site for dimensional redesign commit 2a192f7...`);

    const context = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      // Bypass caching with cache-control header
      extraHTTPHeaders: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    const page = await context.newPage();

    try {
      // Use cache-busting query param
      const cacheBustUrl = `${liveUrl}?v=${Date.now()}`;
      const res = await page.goto(cacheBustUrl, { waitUntil: 'networkidle', timeout: 30000 });
      console.log(`HTTP Status: ${res.status()}`);

      await page.waitForTimeout(1500);

      // Check if new dimensional elements exist
      const forgeHeading = await page.$('.forge-heading');
      const archiveHeading = await page.$('.archive-heading');
      const journeyHeading = await page.$('.journey-heading');

      if (forgeHeading && archiveHeading && journeyHeading) {
        console.log('>>> SUCCESS! Live AWS Amplify deployment has updated with all three dimensional sections!');
        isDeployed = true;

        // 1. Capture Desktop Screenshots
        console.log('Capturing Live Desktop Screenshots (1536x1024)...');
        await page.locator('#skills').scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(outDir, 'live_section03_forge_desktop_1536x1024.png'), fullPage: false });
        console.log('Captured live_section03_forge_desktop_1536x1024.png');

        await page.locator('#projects').scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(outDir, 'live_section04_archive_desktop_1536x1024.png'), fullPage: false });
        console.log('Captured live_section04_archive_desktop_1536x1024.png');

        await page.locator('#experience').scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(outDir, 'live_section05_journey_desktop_1536x1024.png'), fullPage: false });
        console.log('Captured live_section05_journey_desktop_1536x1024.png');

        await context.close();

        // 2. Capture Mobile Screenshots
        console.log('Capturing Live Mobile Screenshots (390x844)...');
        const mobileContext = await browser.newContext({
          viewport: { width: 390, height: 844 },
          extraHTTPHeaders: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(cacheBustUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await mobilePage.waitForTimeout(2000);

        await mobilePage.locator('#skills').scrollIntoViewIfNeeded();
        await mobilePage.waitForTimeout(2000);
        await mobilePage.screenshot({ path: path.join(outDir, 'live_section03_forge_mobile_390x844.png'), fullPage: false });
        console.log('Captured live_section03_forge_mobile_390x844.png');

        await mobilePage.locator('#projects').scrollIntoViewIfNeeded();
        await mobilePage.waitForTimeout(2000);
        await mobilePage.screenshot({ path: path.join(outDir, 'live_section04_archive_mobile_390x844.png'), fullPage: false });
        console.log('Captured live_section04_archive_mobile_390x844.png');

        await mobilePage.locator('#experience').scrollIntoViewIfNeeded();
        await mobilePage.waitForTimeout(2000);
        await mobilePage.screenshot({ path: path.join(outDir, 'live_section05_journey_mobile_390x844.png'), fullPage: false });
        console.log('Captured live_section05_journey_mobile_390x844.png');

        await mobileContext.close();
        break;
      } else {
        console.log('Amplify build is still in progress (previous bundle currently active). Waiting 12 seconds...');
        await context.close();
        await new Promise(r => setTimeout(r, 12000));
      }
    } catch (err) {
      console.warn('Polling error (will retry):', err.message);
      await context.close();
      await new Promise(r => setTimeout(r, 12000));
    }
  }

  await browser.close();

  if (!isDeployed) {
    throw new Error('Timed out waiting for AWS Amplify build to complete.');
  }

  console.log('--- ALL LIVE SECTIONS VERIFIED AND CAPTURED ON AWS AMPLIFY ---');
}

waitForAmplifyDeploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
