import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/intelligence_vault';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function verifyIntelligenceVault() {
  console.log('\n=============================================================');
  console.log('   KINGDOM OF CODE — SECTION 08: INTELLIGENCE VAULT AUDIT    ');
  console.log('=============================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  function record(name, pass, note = '') {
    results.push({ name, pass, note });
    console.log(`${pass ? '✔ [PASS]' : '✖ [FAIL]'} ${name}: ${note}`);
  }

  // --------------------------------------------------------------------------
  // 1. DESKTOP 1536x1024 AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 1: Desktop 1536x1024 Comprehensive State Audit ---');
  const page1536 = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page1536.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1536.waitForTimeout(2000);

  const vaultSec = await page1536.$('#vault');
  record('Vault Section Exists', !!vaultSec, '#vault found in DOM');

  // Scroll cleanly to the top of Section 08 (Region A Cinematic Chamber)
  await page1536.evaluate(() => {
    document.getElementById('vault').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1536.waitForTimeout(600);

  // 1. Vault Initial State (Region A Cinematic Chamber + Header + Unobstructed Sphere)
  await page1536.screenshot({ path: `${outDir}/01_vault_initial_chamber_desktop_1536x1024.png` });
  record('Capture 01 Vault Initial Chamber 1536x1024', true, 'Saved 01_vault_initial_chamber_desktop_1536x1024.png');

  // Verify Title and Subheading
  const mainTitle = await page1536.$eval('.vault-main-title', el => el.innerText.trim());
  record('Vault Main Title Match', mainTitle === 'THE INTELLIGENCE VAULT', `Title: "${mainTitle}"`);

  // Verify Gateway Cue Button
  const cueBtn = await page1536.$('.vault-trial-cue-btn');
  record('Gateway Cue Button Present', !!cueBtn, 'Found [ BEGIN THE INTELLIGENCE TRIAL ] cue');

  // Scroll to Region B (Challenges)
  await page1536.evaluate(() => {
    document.getElementById('vault-trials').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1536.waitForTimeout(600);

  // 2. Initial State of Region B Challenges
  await page1536.screenshot({ path: `${outDir}/02_vault_challenges_initial_1536x1024.png` });
  record('Capture 02 Challenges Initial State', true, 'Saved 02_vault_challenges_initial_1536x1024.png');

  // 3. Challenge 1: Perception (DocRecon) Sweep
  const scanner = await page1536.$('#scanner');
  record('Perception Scanner Slider Found', !!scanner, '#scanner exists');
  await scanner.fill('100');
  await page1536.dispatchEvent('#scanner', 'change');
  await page1536.waitForTimeout(600);

  const key1Badge = await page1536.$('.challenge:nth-child(1) .key-unlocked-badge');
  record('Key 01 (Perception) Unlocked', !!key1Badge, 'DocRecon scanner extracted all 3 entities');
  await page1536.screenshot({ path: `${outDir}/03_vault_challenge_01_perception_solved.png` });
  record('Capture 03 Perception Solved', true, 'Saved 03_vault_challenge_01_perception_solved.png');

  // 4. Challenge 2: Reasoning (Pathway AI) Trigger
  const ragBtn = await page1536.$('.challenge:nth-child(2) .rag-action-btn');
  record('Reasoning RAG Action Button Found', !!ragBtn, '.rag-action-btn exists');
  await ragBtn.click();
  await page1536.waitForTimeout(2800); // 4 stages

  const key2Badge = await page1536.$('.challenge:nth-child(2) .key-unlocked-badge');
  const groundedAnswer = await page1536.$('.grounded-answer-box');
  record('Key 02 (Reasoning) Unlocked', !!key2Badge && !!groundedAnswer, 'Grounded answer synthesized');
  await page1536.screenshot({ path: `${outDir}/04_vault_challenge_02_reasoning_solved.png` });
  record('Capture 04 Reasoning Solved', true, 'Saved 04_vault_challenge_02_reasoning_solved.png');

  // 5. Challenge 3: Connection (HEFIN) Topology
  const nodes = await page1536.$$('.network-board .node-button');
  record('Four Decentralized Nodes Found', nodes.length === 4, `Found ${nodes.length} nodes`);
  if (nodes.length === 4) {
    await nodes[0].click();
    await nodes[1].click();
    await page1536.waitForTimeout(150);
    await nodes[1].click();
    await nodes[2].click();
    await page1536.waitForTimeout(150);
    await nodes[2].click();
    await nodes[3].click();
    await page1536.waitForTimeout(400);
  }

  const key3Badge = await page1536.$('.challenge:nth-child(3) .key-unlocked-badge');
  record('Key 03 (Connection) Unlocked', !!key3Badge, 'All 4 nodes synchronized in decentralized consensus');
  await page1536.screenshot({ path: `${outDir}/05_vault_challenge_03_connection_solved.png` });
  record('Capture 05 Connection Solved', true, 'Saved 05_vault_challenge_03_connection_solved.png');

  // 6. Grand Finale Reveal (All 3 Keys Merged)
  const revealEl = await page1536.$('.vault-reveal.unlocked');
  record('Vault Grand Finale Unlocked', !!revealEl, '.vault-reveal.unlocked rendered');
  await page1536.evaluate(() => {
    document.querySelector('.vault-reveal').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page1536.waitForTimeout(1000);

  const superpowerHeading = await page1536.$eval('.superpower-heading', el => el.innerText.trim());
  record('Superpower Statement Verified', superpowerHeading.includes('TRANSFORMING COMPLEX DATA'), `Heading: "${superpowerHeading.replace(/\n/g, ' ')}"`);

  const pillars = await page1536.$$('.pillar-card');
  record('Three Project Pillars Verified', pillars.length === 3, 'Found Perception (DocRecon), Reasoning (Pathway AI), Connection (HEFIN)');

  await page1536.screenshot({ path: `${outDir}/06_vault_superpower_reveal_desktop_1536x1024.png` });
  record('Capture 06 Superpower Reveal 1536x1024', true, 'Saved 06_vault_superpower_reveal_desktop_1536x1024.png');

  // 7. Scroll back up to Chamber to inspect 3D core in UNLOCKED state
  await page1536.evaluate(() => {
    document.getElementById('vault').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1536.waitForTimeout(600);
  await page1536.screenshot({ path: `${outDir}/07_vault_chamber_unlocked_astral_core_1536x1024.png` });
  record('Capture 07 Chamber Unlocked Astral Core', true, 'Saved 07_vault_chamber_unlocked_astral_core_1536x1024.png');

  // 8. Replay Action & Clean Reset
  await page1536.evaluate(() => {
    document.querySelector('.vault-reveal').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page1536.waitForTimeout(400);

  const replayBtn = await page1536.$('.vault-actions-row button');
  record('Replay Button Found', !!replayBtn, 'Found replay button');
  await replayBtn.click();
  await page1536.waitForTimeout(600);

  const isReset = await page1536.$eval('.vault-reveal', el => !el.classList.contains('unlocked'));
  const sliderReset = await page1536.$eval('#scanner', el => el.value === '0');
  record('Replay Restores Original Locked State', isReset && sliderReset, 'Keys reset, slider returned to 0');
  await page1536.screenshot({ path: `${outDir}/08_vault_replayed_reset_state.png` });
  record('Capture 08 Replayed Reset State', true, 'Saved 08_vault_replayed_reset_state.png');

  await page1536.close();

  // --------------------------------------------------------------------------
  // 2. LAPTOP 1366x768 AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 2: Laptop 1366x768 Audit ---');
  const page1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page1366.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1366.waitForTimeout(1500);

  await page1366.evaluate(() => {
    document.getElementById('vault').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page1366.waitForTimeout(600);

  await page1366.screenshot({ path: `${outDir}/09_vault_laptop_1366x768.png` });
  record('Capture 09 Laptop 1366x768', true, 'Saved 09_vault_laptop_1366x768.png');

  const overflow1366 = await page1366.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Laptop Zero Horizontal Overflow', overflow1366, `scrollWidth <= clientWidth: ${overflow1366}`);

  await page1366.close();

  // --------------------------------------------------------------------------
  // 3. TABLET 768x1024 AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 3: Tablet 768x1024 Audit ---');
  const page768 = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await page768.goto(targetUrl, { waitUntil: 'networkidle' });
  await page768.waitForTimeout(1500);

  await page768.evaluate(() => {
    document.getElementById('vault').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page768.waitForTimeout(600);

  await page768.screenshot({ path: `${outDir}/10_vault_tablet_768x1024.png` });
  record('Capture 10 Tablet 768x1024', true, 'Saved 10_vault_tablet_768x1024.png');

  const overflow768 = await page768.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Tablet Zero Horizontal Overflow', overflow768, `scrollWidth <= clientWidth: ${overflow768}`);

  await page768.close();

  // --------------------------------------------------------------------------
  // 4. MOBILE 390x844 AUDIT
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 4: Mobile 390x844 Audit ---');
  const page390 = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await page390.goto(targetUrl, { waitUntil: 'networkidle' });
  await page390.waitForTimeout(1500);

  await page390.evaluate(() => {
    document.getElementById('vault').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page390.waitForTimeout(600);

  await page390.screenshot({ path: `${outDir}/11_vault_mobile_chamber_390x844.png` });
  record('Capture 11 Mobile Chamber 390x844', true, 'Saved 11_vault_mobile_chamber_390x844.png');

  // Scroll to challenges on mobile
  await page390.evaluate(() => {
    document.getElementById('vault-trials').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page390.waitForTimeout(600);

  await page390.screenshot({ path: `${outDir}/12_vault_mobile_challenges_390x844.png` });
  record('Capture 12 Mobile Challenges 390x844', true, 'Saved 12_vault_mobile_challenges_390x844.png');

  const overflow390 = await page390.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Mobile Zero Horizontal Overflow', overflow390, `scrollWidth <= clientWidth: ${overflow390}`);

  // Test mobile node button target size
  const nodeBtnSize = await page390.$eval('.network-board .node-button', el => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  record('Mobile Node Button Touch Target >= 44px', nodeBtnSize.height >= 44, `Height: ${nodeBtnSize.height}px, Width: ${nodeBtnSize.width}px`);

  await page390.close();
  await browser.close();

  // Summary
  console.log('\n=============================================================');
  console.log(`AUDIT COMPLETE: ${results.filter(r => r.pass).length}/${results.length} PASSED`);
  console.log('=============================================================\n');

  fs.writeFileSync(`${outDir}/test_results.json`, JSON.stringify(results, null, 2));

  const allPassed = results.every(r => r.pass);
  if (!allPassed) {
    console.error('Some tests failed!');
    process.exit(1);
  }
}

verifyIntelligenceVault().catch(err => {
  console.error('Error during audit:', err);
  process.exit(1);
});
