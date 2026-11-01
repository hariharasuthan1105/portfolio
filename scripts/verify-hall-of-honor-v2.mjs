import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/hall_of_honor_redesign';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function runAudit() {
  console.log('\n=============================================================');
  console.log('   KINGDOM OF CODE — SECTION 06: HALL OF HONOR AUDIT SUITE   ');
  console.log('=============================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const results = [];
  function record(name, pass, note = '') {
    results.push({ name, pass, note });
    console.log(`${pass ? '✔ [PASS]' : '✖ [FAIL]'} ${name}: ${note}`);
  }

  // --------------------------------------------------------------------------
  // 1. DESKTOP 1920x1080 (Cinematic 16:9 Baseline)
  // --------------------------------------------------------------------------
  console.log('\n--- 1. Desktop 1920x1080 ---');
  const page1920 = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: `${outDir}/video`,
      size: { width: 1920, height: 1080 },
    },
  });

  await page1920.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1920.waitForTimeout(2000);

  const achSec1920 = await page1920.$('#achievements');
  record('Achievements section mounted', !!achSec1920, '#achievements exists');
  await achSec1920.scrollIntoViewIfNeeded();
  await page1920.waitForTimeout(1500);

  // 1. Default state screenshot
  await page1920.screenshot({ path: `${outDir}/01_desktop_1920x1080_default.png` });
  record('Capture 01 Default 1920x1080', true, 'Saved 01_desktop_1920x1080_default.png');

  // Wait 3 seconds to record the 3 trophies rotating on their podiums
  await page1920.waitForTimeout(3000);

  // 2. Select Trophy 01 (Convolve 4.0)
  const badges1920 = await page1920.$$('.hall-award-panel');
  record('Three Podium Badges rendered', badges1920.length === 3, `Count: ${badges1920.length}`);

  await badges1920[0].click({ force: true });
  await page1920.waitForTimeout(1000);
  const dialogOpen1 = await page1920.$eval('.award-citation-dialog', d => d.open);
  record('Trophy 01 Selection opens modal', dialogOpen1 === true, 'Citation dialog opened');
  await page1920.screenshot({ path: `${outDir}/02_desktop_1920_trophy01_convolve_selected.png` });

  // Close modal via Escape key
  await page1920.keyboard.press('Escape');
  await page1920.waitForTimeout(800);
  const dialogClosed1 = await page1920.$eval('.award-citation-dialog', d => !d.open);
  record('Escape key closes modal', dialogClosed1 === true, 'Modal closed cleanly');

  // 3. Select Trophy 02 (Pathway AI Hackathon)
  await badges1920[1].click({ force: true });
  await page1920.waitForTimeout(1000);
  await page1920.screenshot({ path: `${outDir}/03_desktop_1920_trophy02_pathway_selected.png` });
  record('Capture 03 Pathway Trophy Selected', true, 'Saved 03_desktop_1920_trophy02_pathway_selected.png');

  await page1920.keyboard.press('Escape');
  await page1920.waitForTimeout(800);

  // 4. Select Trophy 03 (WCHL)
  await badges1920[2].click({ force: true });
  await page1920.waitForTimeout(1000);
  await page1920.screenshot({ path: `${outDir}/04_desktop_1920_trophy03_wchl_selected.png` });
  record('Capture 04 WCHL Trophy Selected', true, 'Saved 04_desktop_1920_trophy03_wchl_selected.png');

  await page1920.keyboard.press('Escape');
  await page1920.waitForTimeout(800);

  // 5. Expand Certifications
  const certBtn = await page1920.$('.certifications-toggle-btn');
  if (certBtn) {
    await certBtn.scrollIntoViewIfNeeded();
    await certBtn.click();
  }
  await page1920.waitForTimeout(800);
  const certCards = await page1920.$$('.cert-item-card');
  record('Certifications expanded', certCards.length === 5, `Found ${certCards.length} certified items`);
  await page1920.screenshot({ path: `${outDir}/05_desktop_1920_certifications_expanded.png` });

  await page1920.close();

  // --------------------------------------------------------------------------
  // 2. DESKTOP 1536x1024
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Desktop 1536x1024 ---');
  const page1536 = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page1536.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1536.waitForTimeout(1500);
  await page1536.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page1536.waitForTimeout(1200);
  await page1536.screenshot({ path: `${outDir}/06_desktop_1536x1024_default.png` });
  record('Capture 06 Desktop 1536x1024', true, 'Saved 06_desktop_1536x1024_default.png');
  await page1536.close();

  // --------------------------------------------------------------------------
  // 3. LAPTOP 1366x768
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Laptop 1366x768 ---');
  const page1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page1366.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1366.waitForTimeout(1500);
  await page1366.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page1366.waitForTimeout(1200);
  await page1366.screenshot({ path: `${outDir}/07_laptop_1366x768.png` });
  record('Capture 07 Laptop 1366x768', true, 'Saved 07_laptop_1366x768.png');
  await page1366.close();

  // --------------------------------------------------------------------------
  // 4. TABLET 1024x768
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Tablet 1024x768 ---');
  const page1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await page1024.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1024.waitForTimeout(1500);
  await page1024.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page1024.waitForTimeout(1200);
  await page1024.screenshot({ path: `${outDir}/08_tablet_1024x768.png` });
  record('Capture 08 Tablet 1024x768', true, 'Saved 08_tablet_1024x768.png');
  await page1024.close();

  // --------------------------------------------------------------------------
  // 5. MOBILE 390x844
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Mobile 390x844 ---');
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
  await mobilePage.waitForTimeout(1200);

  // Check horizontal overflow
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  record('Mobile Zero Horizontal Overflow', scrollWidth <= clientWidth, `scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px`);

  await mobilePage.screenshot({ path: `${outDir}/09_mobile_390x844_default.png` });
  record('Capture 09 Mobile 390x844 Default', true, 'Saved 09_mobile_390x844_default.png');

  // Test Mobile Navigation Buttons
  const nextBtn = await mobilePage.$('.hall-mobile-btn:has-text("NEXT")');
  if (nextBtn) {
    await nextBtn.tap();
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: `${outDir}/10_mobile_390x844_next_trophy.png` });
    record('Capture 10 Mobile Next Trophy', true, 'Saved 10_mobile_390x844_next_trophy.png');
  }

  // Open achievement modal on mobile
  const viewBtn = await mobilePage.$('.hall-mobile-view-btn');
  if (viewBtn) {
    await viewBtn.tap();
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: `${outDir}/11_mobile_390x844_modal_opened.png` });
    record('Capture 11 Mobile Modal Opened', true, 'Saved 11_mobile_390x844_modal_opened.png');
  }

  await mobilePage.close();

  // --------------------------------------------------------------------------
  // 6. ISOLATED 3D MODE (?isolate=hall3d)
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Isolated 3D Inspection (?isolate=hall3d) ---');
  const pageIsolated = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await pageIsolated.goto(`${targetUrl}?isolate=hall3d`, { waitUntil: 'networkidle' });
  await pageIsolated.waitForTimeout(1500);
  await pageIsolated.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await pageIsolated.waitForTimeout(1200);
  await pageIsolated.screenshot({ path: `${outDir}/12_isolated_3d_trophies_and_podiums.png` });
  record('Capture 12 Isolated 3D Preview', true, 'Saved 12_isolated_3d_trophies_and_podiums.png');
  await pageIsolated.close();

  // --------------------------------------------------------------------------
  // 7. DEBUG HELPERS (?debug=hall)
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Debug Helpers (?debug=hall) ---');
  const pageDebug = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await pageDebug.goto(`${targetUrl}?debug=hall`, { waitUntil: 'networkidle' });
  await pageDebug.waitForTimeout(1500);
  await pageDebug.evaluate(() => {
    document.getElementById('achievements')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await pageDebug.waitForTimeout(1200);
  await pageDebug.screenshot({ path: `${outDir}/13_debug_world_axes_and_grid.png` });
  record('Capture 13 Debug World Axes & Grid', true, 'Saved 13_debug_world_axes_and_grid.png');
  await pageDebug.close();

  await browser.close();

  fs.writeFileSync(
    path.join(outDir, 'audit_summary.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n=============================================================');
  console.log(`  AUDIT COMPLETE: ${results.filter(r => r.pass).length}/${results.length} PASSED`);
  console.log('=============================================================\n');
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
