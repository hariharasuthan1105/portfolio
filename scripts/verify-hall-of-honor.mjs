import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/hall_of_honor';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function verifyHallOfHonor() {
  console.log('\n=============================================================');
  console.log('   KINGDOM OF CODE — SECTION 06: HALL OF HONOR AUDIT SUITE   ');
  console.log('=============================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  function record(name, pass, note = '') {
    results.push({ name, pass, note });
    console.log(`${pass ? '✔ [PASS]' : '✖ [FAIL]'} ${name}: ${note}`);
  }

  // --------------------------------------------------------------------------
  // 1. DESKTOP 1536x1024
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 1: Desktop 1536x1024 Audit ---');
  const page1536 = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page1536.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1536.waitForTimeout(2000);

  const achievementsSec = await page1536.$('#achievements');
  record('Achievements section exists', !!achievementsSec, '#achievements mounted');
  await achievementsSec.scrollIntoViewIfNeeded();
  await page1536.waitForTimeout(1000);

  // 1. Default Hall of Honor
  await page1536.screenshot({ path: `${outDir}/01_hall_of_honor_default_1536x1024.png` });
  record('Capture 01 Default Hall of Honor 1536x1024', true, 'Saved 01_hall_of_honor_default_1536x1024.png');

  // Verify three award panels rendered
  const awardPanels = await page1536.$$('.hall-award-panel');
  record('Three Award Panels Present', awardPanels.length === 3, `Found ${awardPanels.length} panels`);

  // 2. Select Award 01 (Convolve 4.0)
  await awardPanels[0].click({ force: true });
  await page1536.waitForTimeout(800);
  const dialogOpen1 = await page1536.$eval('.award-citation-dialog', d => d.open);
  record('Award 01 Citation Dialog Opens', dialogOpen1 === true, 'Dialog open is true');
  await page1536.screenshot({ path: `${outDir}/02_hall_award_01_convolve_selected.png` });
  record('Capture 02 Convolve 4.0 Selected', true, 'Saved 02_hall_award_01_convolve_selected.png');

  // Close via Escape
  await page1536.keyboard.press('Escape');
  await page1536.waitForTimeout(600);
  const dialogClosed1 = await page1536.$eval('.award-citation-dialog', d => !d.open);
  record('Escape Closes Citation Dialog', dialogClosed1 === true, 'Closed cleanly via Escape');

  // 3. Select Award 02 (Pathway AI Hackathon)
  await awardPanels[1].click({ force: true });
  await page1536.waitForTimeout(800);
  await page1536.screenshot({ path: `${outDir}/03_hall_award_02_pathway_selected.png` });
  record('Capture 03 Pathway AI Selected', true, 'Saved 03_hall_award_02_pathway_selected.png');

  await page1536.keyboard.press('Escape');
  await page1536.waitForTimeout(600);

  // 4. Select Award 03 (World Computer Hacker League)
  await awardPanels[2].click({ force: true });
  await page1536.waitForTimeout(800);
  await page1536.screenshot({ path: `${outDir}/04_hall_award_03_wchl_selected.png` });
  record('Capture 04 WCHL Selected', true, 'Saved 04_hall_award_03_wchl_selected.png');

  await page1536.keyboard.press('Escape');
  await page1536.waitForTimeout(600);

  // 5. Expand Certifications
  const certBtn = await page1536.$('.certifications-toggle-btn');
  record('Certifications toggle button present', !!certBtn, 'Button found');
  await certBtn.click({ force: true });
  await page1536.waitForTimeout(800);

  const certCards = await page1536.$$('.cert-item-card');
  record('Certifications Cards Count', certCards.length === 5, `Found ${certCards.length} verified certificates`);
  await page1536.screenshot({ path: `${outDir}/05_hall_certifications_expanded_1536x1024.png` });
  record('Capture 05 Certifications Expanded', true, 'Saved 05_hall_certifications_expanded_1536x1024.png');

  await page1536.close();

  // --------------------------------------------------------------------------
  // 2. LAPTOP 1366x768
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 2: Laptop 1366x768 Audit ---');
  const page1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page1366.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1366.waitForTimeout(1500);

  const ach1366 = await page1366.$('#achievements');
  await ach1366.scrollIntoViewIfNeeded();
  await page1366.waitForTimeout(800);
  await page1366.screenshot({ path: `${outDir}/06_hall_of_honor_laptop_1366x768.png` });
  record('Capture 06 Hall of Honor Laptop 1366x768', true, 'Saved 06_hall_of_honor_laptop_1366x768.png');
  await page1366.close();

  // --------------------------------------------------------------------------
  // 3. MOBILE 390x844
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 3: Mobile 390x844 Audit ---');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  await mobilePage.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);

  // Check overflow
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  record('Mobile Zero Horizontal Overflow', scrollWidth <= clientWidth, `scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px`);

  await mobilePage.screenshot({ path: `${outDir}/07_hall_of_honor_mobile_390x844.png` });
  record('Capture 07 Mobile Hall of Honor 390x844', true, 'Saved 07_hall_of_honor_mobile_390x844.png');

  // Expand certifications on mobile
  const mobileCertBtn = await mobilePage.$('.certifications-toggle-btn');
  if (mobileCertBtn) {
    await mobileCertBtn.tap();
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: `${outDir}/08_hall_mobile_certifications_390x844.png` });
    record('Capture 08 Mobile Certifications Expanded', true, 'Saved 08_hall_mobile_certifications_390x844.png');
  }

  await mobilePage.close();
  await browser.close();

  fs.writeFileSync(
    path.join(outDir, 'audit_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=============================================================');
  console.log(`  HALL OF HONOR AUDIT COMPLETE: ${results.filter(r => r.pass).length}/${results.length} PASSED  `);
  console.log('=============================================================\n');
}

verifyHallOfHonor().catch(err => {
  console.error(err);
  process.exit(1);
});
