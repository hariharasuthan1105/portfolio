import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function captureAllSections() {
  const browser = await chromium.launch({ headless: true });

  const outDir = path.resolve('screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. DESKTOP 1536 x 1024
  console.log('--- CAPTURING DESKTOP (1536 x 1024) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    deviceScaleFactor: 1,
  });
  const page = await desktopContext.newPage();
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Section 03 — The Forge of Intelligence
  const skillsSec = page.locator('#skills');
  await skillsSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, 'section03_forge_desktop_1536x1024.png'),
    fullPage: false,
  });
  console.log('Saved section03_forge_desktop_1536x1024.png');

  // Filter category AI / ML
  const aimlBtn = page.locator('button.forge-cat-btn:has-text("AI / ML")');
  if (await aimlBtn.isVisible()) {
    await aimlBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(outDir, 'section03_forge_aiml_desktop_1536x1024.png'),
      fullPage: false,
    });
    console.log('Saved section03_forge_aiml_desktop_1536x1024.png');
  }

  // Section 04 — The Archive of Creations
  const projectsSec = page.locator('#projects');
  await projectsSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, 'section04_archive_desktop_1536x1024.png'),
    fullPage: false,
  });
  console.log('Saved section04_archive_desktop_1536x1024.png');

  // Open modal via Explore Projects
  const exploreProjectsBtn = page.locator('.archive-cta-btn');
  if (await exploreProjectsBtn.isVisible()) {
    await exploreProjectsBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, 'section04_archive_modal_desktop_1536x1024.png'),
      fullPage: false,
    });
    console.log('Saved section04_archive_modal_desktop_1536x1024.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // Section 05 — The Journey Archive
  const expSec = page.locator('#experience');
  await expSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(outDir, 'section05_journey_desktop_1536x1024.png'),
    fullPage: false,
  });
  console.log('Saved section05_journey_desktop_1536x1024.png');

  // Step to next milestone via CTA button
  const journeyCta = page.locator('.journey-cta-btn');
  if (await journeyCta.isVisible()) {
    await journeyCta.click(); // Moves to 2024 Robotics Intern
    await page.waitForTimeout(600);
    await journeyCta.click(); // Moves to 2025 Data Science Intern
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(outDir, 'section05_journey_milestone_desktop_1536x1024.png'),
      fullPage: false,
    });
    console.log('Saved section05_journey_milestone_desktop_1536x1024.png');
  }

  await desktopContext.close();

  // 2. MOBILE 390 x 844
  console.log('--- CAPTURING MOBILE (390 x 844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);

  // Section 03 Mobile
  const mobileSkills = mobilePage.locator('#skills');
  await mobileSkills.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1800);
  await mobilePage.screenshot({
    path: path.join(outDir, 'section03_forge_mobile_390x844.png'),
    fullPage: false,
  });
  console.log('Saved section03_forge_mobile_390x844.png');

  // Section 04 Mobile
  const mobileProjects = mobilePage.locator('#projects');
  await mobileProjects.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1800);
  await mobilePage.screenshot({
    path: path.join(outDir, 'section04_archive_mobile_390x844.png'),
    fullPage: false,
  });
  console.log('Saved section04_archive_mobile_390x844.png');

  // Section 05 Mobile
  const mobileExp = mobilePage.locator('#experience');
  await mobileExp.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1800);
  await mobilePage.screenshot({
    path: path.join(outDir, 'section05_journey_mobile_390x844.png'),
    fullPage: false,
  });
  console.log('Saved section05_journey_mobile_390x844.png');

  await mobileContext.close();
  await browser.close();
  console.log('All screenshots captured successfully.');
}

captureAllSections().catch(console.error);
