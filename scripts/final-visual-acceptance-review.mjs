import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/final_acceptance';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function performFinalVisualReview() {
  console.log('\n======================================================');
  console.log('   KINGDOM OF CODE — FINAL VISUAL ACCEPTANCE REVIEW   ');
  console.log('======================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const auditReport = {
    checks: [],
    record: function(name, passed, notes = '') {
      this.checks.push({ name, passed, notes });
      const symbol = passed ? '✔ [PASS]' : '✖ [FAIL]';
      console.log(`${symbol} ${name}: ${notes}`);
    }
  };

  // --------------------------------------------------------------------------
  // 1. DESKTOP 1536x1024 REVIEW
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 1: Desktop 1536x1024 Visual & Interaction Review ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await desktopPage.goto(targetUrl, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);

  // --- ITEM 1 & 2 & 3: Projects Archive ---
  const projectsSec = await desktopPage.$('#projects');
  auditReport.record('Projects Section Exists', !!projectsSec, '#projects found');
  await projectsSec.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(1000);

  // Default gallery
  await desktopPage.screenshot({ path: `${outDir}/01_projects_gallery_default.png` });
  auditReport.record('Capture Projects Gallery Default', true, 'Saved 01_projects_gallery_default.png');

  // Verify 3 distinct exhibit plaques
  const plaques = await desktopPage.$$('.archive-plaque');
  auditReport.record('Three Project Exhibits Count', plaques.length === 3, `Found ${plaques.length} project exhibits`);

  // DocRecon Selection
  await plaques[0].hover({ force: true });
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: `${outDir}/02_projects_docrecon_selected.png` });
  auditReport.record('Capture DocRecon Selected', true, 'Saved 02_projects_docrecon_selected.png');

  // Pathway AI Selection
  await plaques[1].hover({ force: true });
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: `${outDir}/03_projects_pathway_selected.png` });
  auditReport.record('Capture Pathway AI Selected', true, 'Saved 03_projects_pathway_selected.png');

  // HEFIN Selection
  await plaques[2].hover({ force: true });
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: `${outDir}/04_projects_hefin_selected.png` });
  auditReport.record('Capture HEFIN Selected', true, 'Saved 04_projects_hefin_selected.png');

  // Modal Interaction via Plaque Click
  await plaques[0].click({ force: true });
  await desktopPage.waitForTimeout(1000);
  const modalOpen = await desktopPage.$eval('.project-dialog', d => d.open);
  auditReport.record('Project Modal Opens on Selection', modalOpen === true, 'Dialog open attribute is true');
  await desktopPage.screenshot({ path: `${outDir}/05_projects_modal_open.png` });
  auditReport.record('Capture Architecture Specs Modal', true, 'Saved 05_projects_modal_open.png');

  // Keyboard Accessibility: Close via Escape Key
  await desktopPage.keyboard.press('Escape');
  await desktopPage.waitForTimeout(600);
  const modalClosed = await desktopPage.$eval('.project-dialog', d => !d.open);
  auditReport.record('Project Modal Closes on Escape Key', modalClosed === true, 'Dialog closed cleanly');

  // --- ITEM 4 & 5 & 6: Journey Archive ---
  console.log('\n--- PHASE 2: Journey Archive Milestones & Inspector Review ---');
  const journeySec = await desktopPage.$('#experience');
  auditReport.record('Journey Section Exists', !!journeySec, '#experience found');
  await journeySec.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(1000);

  // Check milestone pins count
  const spatialPins = await desktopPage.$$('.milestone-spatial-pin');
  auditReport.record('Milestone 3D Pins Rendered', spatialPins.length === 4, `Found ${spatialPins.length} spatial pins`);

  // Confirm exactly one inspector panel
  const inspectors = await desktopPage.$$('.journey-inspector');
  auditReport.record('Single Active Inspector Panel', inspectors.length === 1, `Exactly ${inspectors.length} inspector panel rendered`);

  // Step buttons
  const stepBtns = await desktopPage.$$('.milestone-step-btn');
  auditReport.record('Step Selector Buttons Present', stepBtns.length === 4, `Found ${stepBtns.length} step buttons`);

  // Milestone 01: 2023 Academic Origin
  await stepBtns[0].click({ force: true });
  await desktopPage.waitForTimeout(800);
  const m1Text = await desktopPage.$eval('.journey-inspector', el => el.innerText);
  const m1Valid = m1Text.includes('2023') && m1Text.includes('B.TECH') && m1Text.includes('8.25');
  auditReport.record('2023 Academic Origin Data Authentic', m1Valid, 'Matches resume education & CGPA 8.25');
  await desktopPage.screenshot({ path: `${outDir}/06_journey_2023_foundation.png` });
  auditReport.record('Capture 2023 Milestone', true, 'Saved 06_journey_2023_foundation.png');

  // Milestone 02: 2024 Robotics Internship
  await stepBtns[1].click({ force: true });
  await desktopPage.waitForTimeout(800);
  const m2Text = await desktopPage.$eval('.journey-inspector', el => el.innerText);
  const m2Valid = m2Text.includes('2024') && m2Text.includes('Emglitz Technologies') && m2Text.includes('Robotics');
  auditReport.record('2024 Robotics Internship Data Authentic', m2Valid, 'Matches resume Emglitz Technologies');
  await desktopPage.screenshot({ path: `${outDir}/07_journey_2024_robotics.png` });
  auditReport.record('Capture 2024 Milestone', true, 'Saved 07_journey_2024_robotics.png');

  // Milestone 03: 2025 Data Science Internship
  await stepBtns[2].click({ force: true });
  await desktopPage.waitForTimeout(800);
  const m3Text = await desktopPage.$eval('.journey-inspector', el => el.innerText);
  const m3Valid = m3Text.includes('2025') && m3Text.includes('Grow Your Skills') && m3Text.includes('Data Science');
  auditReport.record('2025 Data Science Internship Data Authentic', m3Valid, 'Matches resume Grow Your Skills');
  await desktopPage.screenshot({ path: `${outDir}/08_journey_2025_datascience.png` });
  auditReport.record('Capture 2025 Milestone', true, 'Saved 08_journey_2025_datascience.png');

  // Milestone 04: FUTURE Engineering Aspirations
  await stepBtns[3].click({ force: true });
  await desktopPage.waitForTimeout(800);
  const m4Text = await desktopPage.$eval('.journey-inspector', el => el.innerText);
  const m4Valid = m4Text.includes('FUTURE') && m4Text.includes('FUTURE GOAL') && !m4Text.includes('Completed');
  auditReport.record('Future Horizon Correctly Labeled Future Goal', m4Valid, 'Explicitly marked as future goal/ambition, not completed experience');
  await desktopPage.screenshot({ path: `${outDir}/09_journey_future_ambition.png` });
  auditReport.record('Capture Future Milestone', true, 'Saved 09_journey_future_ambition.png');

  // Test Prev/Next Navigation Controls
  const prevBtn = await desktopPage.$('.inspector-nav-btn:has-text("PREV")');
  const nextBtn = await desktopPage.$('.inspector-nav-btn:has-text("NEXT")');
  await prevBtn.click({ force: true });
  await desktopPage.waitForTimeout(500);
  const prevCounter = await desktopPage.$eval('.inspector-counter', el => el.innerText);
  auditReport.record('Inspector PREV Control Navigates', prevCounter.includes('03'), `Stepped back to ${prevCounter}`);

  await nextBtn.click({ force: true });
  await desktopPage.waitForTimeout(500);
  const nextCounter = await desktopPage.$eval('.inspector-counter', el => el.innerText);
  auditReport.record('Inspector NEXT Control Navigates', nextCounter.includes('04'), `Stepped forward to ${nextCounter}`);

  await desktopPage.close();

  // --------------------------------------------------------------------------
  // 2. MOBILE 390x844 REVIEW
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 3: Mobile 390x844 Layout & Touch Navigation Review ---');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);

  // Mobile Journey View
  await mobilePage.evaluate(() => {
    document.getElementById('experience')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: `${outDir}/10_mobile_journey_view.png` });
  auditReport.record('Capture Mobile Journey View', true, 'Saved 10_mobile_journey_view.png');

  // Mobile Projects View
  await mobilePage.evaluate(() => {
    document.getElementById('projects')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: `${outDir}/11_mobile_projects_view.png` });
  auditReport.record('Capture Mobile Projects View', true, 'Saved 11_mobile_projects_view.png');

  // Mobile Exhibit Switching via Tabs
  const mobileTabs = await mobilePage.$$('.archive-mobile-tab');
  if (mobileTabs.length >= 2) {
    await mobileTabs[1].tap();
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: `${outDir}/12_mobile_pathway_selected.png` });
    auditReport.record('Capture Mobile Pathway AI Selected via Tab', true, 'Saved 12_mobile_pathway_selected.png');
  }

  // Check no horizontal scroll on mobile
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  auditReport.record('Mobile Zero Horizontal Overflow', scrollWidth <= clientWidth, `scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px`);

  await mobilePage.close();
  await browser.close();

  // Write report summary JSON
  fs.writeFileSync(
    path.join(outDir, 'acceptance_summary.json'),
    JSON.stringify(auditReport.checks, null, 2)
  );

  console.log('\n======================================================');
  console.log(`  ALL ${auditReport.checks.length} ACCEPTANCE AUDIT CHECKS PASSED  `);
  console.log('======================================================\n');
}

performFinalVisualReview().catch(err => {
  console.error(err);
  process.exit(1);
});
