import { chromium } from 'playwright';
import fs from 'fs';

const outDir = 'screenshots/after_correction';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Desktop 1536x1024
  console.log('Testing Desktop 1536x1024...');
  const page1536 = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page1536.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1536.waitForTimeout(2000);

  // JOURNEY SECTION
  const journeySec = await page1536.$('#experience');
  await journeySec.scrollIntoViewIfNeeded();
  await page1536.waitForTimeout(1000);

  // Initial state
  await page1536.screenshot({ path: `${outDir}/journey_desktop_1536_initial.png` });
  console.log('Saved journey_desktop_1536_initial.png');

  // Milestone 0 (2023)
  const stepBtns = await page1536.$$('.milestone-step-btn');
  if (stepBtns.length >= 4) {
    await stepBtns[0].click({ force: true });
    await page1536.waitForTimeout(800);
    await page1536.screenshot({ path: `${outDir}/journey_desktop_1536_2023.png` });
    console.log('Saved journey_desktop_1536_2023.png');

    // Milestone 1 (2024)
    await stepBtns[1].click({ force: true });
    await page1536.waitForTimeout(800);
    await page1536.screenshot({ path: `${outDir}/journey_desktop_1536_2024.png` });
    console.log('Saved journey_desktop_1536_2024.png');

    // Milestone 2 (2025)
    await stepBtns[2].click({ force: true });
    await page1536.waitForTimeout(800);
    await page1536.screenshot({ path: `${outDir}/journey_desktop_1536_2025.png` });
    console.log('Saved journey_desktop_1536_2025.png');

    // Milestone 3 (FUTURE)
    await stepBtns[3].click({ force: true });
    await page1536.waitForTimeout(800);
    await page1536.screenshot({ path: `${outDir}/journey_desktop_1536_future.png` });
    console.log('Saved journey_desktop_1536_future.png');
  }

  // PROJECTS SECTION
  const projectsSec = await page1536.$('#projects');
  await projectsSec.scrollIntoViewIfNeeded();
  await page1536.waitForTimeout(1000);

  // Initial gallery
  await page1536.screenshot({ path: `${outDir}/projects_desktop_1536_initial.png` });
  console.log('Saved projects_desktop_1536_initial.png');

  // DocRecon selected
  const plaques = await page1536.$$('.archive-plaque');
  if (plaques.length >= 3) {
    try {
      await plaques[0].hover({ force: true });
      await page1536.waitForTimeout(800);
      await page1536.screenshot({ path: `${outDir}/projects_desktop_1536_docrecon.png` });
      console.log('Saved projects_desktop_1536_docrecon.png');

      // Pathway AI selected
      await plaques[1].hover({ force: true });
      await page1536.waitForTimeout(800);
      await page1536.screenshot({ path: `${outDir}/projects_desktop_1536_pathway.png` });
      console.log('Saved projects_desktop_1536_pathway.png');

      // HEFIN selected
      await plaques[2].hover({ force: true });
      await page1536.waitForTimeout(800);
      await page1536.screenshot({ path: `${outDir}/projects_desktop_1536_hefin.png` });
      console.log('Saved projects_desktop_1536_hefin.png');

      // Open Modal via first plaque or explore button
      await plaques[0].click({ force: true });
      await page1536.waitForTimeout(1000);
      await page1536.screenshot({ path: `${outDir}/projects_desktop_1536_modal.png` });
      console.log('Saved projects_desktop_1536_modal.png');

      // Close modal via Escape
      await page1536.keyboard.press('Escape');
      await page1536.waitForTimeout(600);
    } catch (e) {
      console.error('Plaque interaction warning:', e.message);
    }
  }
  await page1536.close();

  // 2. Desktop 1366x768
  console.log('Testing Desktop 1366x768...');
  const page1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page1366.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1366.waitForTimeout(2000);

  const j1366 = await page1366.$('#experience');
  await j1366.scrollIntoViewIfNeeded();
  await page1366.waitForTimeout(1000);
  await page1366.screenshot({ path: `${outDir}/journey_desktop_1366_initial.png` });
  console.log('Saved journey_desktop_1366_initial.png');

  const p1366 = await page1366.$('#projects');
  await p1366.scrollIntoViewIfNeeded();
  await page1366.waitForTimeout(1000);
  await page1366.screenshot({ path: `${outDir}/projects_desktop_1366_initial.png` });
  console.log('Saved projects_desktop_1366_initial.png');
  await page1366.close();

  // 3. Mobile 390x844
  console.log('Testing Mobile 390x844...');
  const pageMobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await pageMobile.goto(targetUrl, { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(2000);

  // Scroll to Experience start
  await pageMobile.evaluate(() => {
    document.getElementById('experience')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await pageMobile.waitForTimeout(1200);
  await pageMobile.screenshot({ path: `${outDir}/journey_mobile_390_initial.png` });
  console.log('Saved journey_mobile_390_initial.png');

  // Scroll to Projects start
  await pageMobile.evaluate(() => {
    document.getElementById('projects')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await pageMobile.waitForTimeout(1200);
  await pageMobile.screenshot({ path: `${outDir}/projects_mobile_390_initial.png` });
  console.log('Saved projects_mobile_390_initial.png');
  await pageMobile.close();

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
