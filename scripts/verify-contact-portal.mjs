import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/contact_portal';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function verifyContactPortal() {
  console.log('\n=============================================================');
  console.log('   KINGDOM OF CODE — SECTION 07: THE PORTAL AUDIT SUITE    ');
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
  const context1536 = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page1536 = await context1536.newPage();
  await page1536.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1536.waitForTimeout(2000);

  const contactSec = await page1536.$('#contact');
  record('Contact Section Exists', !!contactSec, '#contact found in DOM');
  await contactSec.scrollIntoViewIfNeeded();
  await page1536.waitForTimeout(1000);

  // 1. Default Contact Portal State
  await page1536.screenshot({ path: `${outDir}/01_contact_portal_desktop_1536x1024.png` });
  record('Capture 01 Default Contact Portal 1536x1024', true, 'Saved 01_contact_portal_desktop_1536x1024.png');

  // Verify Heading Elements
  const titleText = await page1536.$eval('.portal-main-title', el => el.innerText.trim());
  record('Portal Main Title Match', titleText.includes("LET'S BUILD"), `Title: "${titleText.replace(/\n/g, ' ')}"`);

  const quoteText = await page1536.$eval('.portal-lead-quote', el => el.innerText.trim());
  record('Lead Quote Match', quoteText.includes("A single conversation"), `Quote: "${quoteText}"`);

  const statusText = await page1536.$eval('.portal-status-pill', el => el.innerText.trim());
  record('Status Pill Match', statusText.includes("COIMBATORE, INDIA"), `Status: "${statusText}"`);

  // Verify 3-Zone Architecture
  const layoutCols = await page1536.$eval('.contact-portal-layout', el => {
    const style = window.getComputedStyle(el);
    return style.gridTemplateColumns;
  });
  record('3-Zone Grid Layout Verified', layoutCols.split(' ').length >= 3, `Columns: ${layoutCols}`);

  // Verify Contact Cards Count & Links
  const cards = await page1536.$$('.portal-contact-card');
  record('Three Contact Cards Present', cards.length === 3, `Found ${cards.length} cards`);

  // Check Card 1: Email
  const emailHref = await cards[0].getAttribute('href');
  record('Card 1 is Email mailto', emailHref === 'mailto:hariharasuthan1105@gmail.com', `Href: ${emailHref}`);

  // Check Card 2: LinkedIn
  const linkedinHref = await cards[1].getAttribute('href');
  record('Card 2 is LinkedIn URL', linkedinHref.includes('linkedin.com/in/hariharasuthan'), `Href: ${linkedinHref}`);

  // Check Card 3: GitHub
  const githubHref = await cards[2].getAttribute('href');
  record('Card 3 is GitHub URL', githubHref.includes('github.com/hariharasuthan1105'), `Href: ${githubHref}`);

  // 2. Hover Interaction on Email Card
  await cards[0].hover();
  await page1536.waitForTimeout(600);
  await page1536.screenshot({ path: `${outDir}/02_contact_portal_email_hover_1536x1024.png` });
  record('Capture 02 Email Card Hovered', true, 'Saved 02_contact_portal_email_hover_1536x1024.png');

  // 3. Test Copy Email Button
  const copyBtn = await page1536.$('.portal-copy-btn');
  record('Copy Email Button Present', !!copyBtn, 'Found dedicated copy email button');
  if (copyBtn) {
    await copyBtn.click();
    await page1536.waitForTimeout(400);
    const copyLabel = await page1536.$eval('.portal-copy-btn', el => el.innerText.trim());
    record('Copy Email Feedback Triggered', copyLabel.includes('COPIED') || copyLabel.includes('EMAIL COPIED'), `Button text: "${copyLabel}"`);
    await page1536.screenshot({ path: `${outDir}/03_contact_portal_email_copied_1536x1024.png` });
    record('Capture 03 Email Copied State', true, 'Saved 03_contact_portal_email_copied_1536x1024.png');
  }

  // 4. Hover LinkedIn Card
  await cards[1].hover();
  await page1536.waitForTimeout(600);
  await page1536.screenshot({ path: `${outDir}/04_contact_portal_linkedin_hover_1536x1024.png` });
  record('Capture 04 LinkedIn Card Hovered', true, 'Saved 04_contact_portal_linkedin_hover_1536x1024.png');

  // 5. Hover GitHub Card
  await cards[2].hover();
  await page1536.waitForTimeout(600);
  await page1536.screenshot({ path: `${outDir}/05_contact_portal_github_hover_1536x1024.png` });
  record('Capture 05 GitHub Card Hovered', true, 'Saved 05_contact_portal_github_hover_1536x1024.png');

  // 6. Keyboard Focus-Visible Test
  await page1536.keyboard.press('Tab');
  await page1536.waitForTimeout(300);
  const activeTag = await page1536.evaluate(() => document.activeElement ? document.activeElement.tagName : 'NONE');
  record('Keyboard Tab Focus Functional', activeTag !== 'BODY', `Active focused element tag: ${activeTag}`);

  await page1536.close();

  // --------------------------------------------------------------------------
  // 2. LAPTOP 1366x768
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 2: Laptop 1366x768 Audit ---');
  const page1366 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page1366.goto(targetUrl, { waitUntil: 'networkidle' });
  await page1366.waitForTimeout(1500);

  const contact1366 = await page1366.$('#contact');
  await contact1366.scrollIntoViewIfNeeded();
  await page1366.waitForTimeout(800);

  await page1366.screenshot({ path: `${outDir}/06_contact_portal_laptop_1366x768.png` });
  record('Capture 06 Laptop 1366x768', true, 'Saved 06_contact_portal_laptop_1366x768.png');

  const overflow1366 = await page1366.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Laptop Zero Horizontal Overflow', overflow1366, `scrollWidth <= clientWidth: ${overflow1366}`);

  await page1366.close();

  // --------------------------------------------------------------------------
  // 3. TABLET 768x1024
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 3: Tablet 768x1024 Audit ---');
  const page768 = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await page768.goto(targetUrl, { waitUntil: 'networkidle' });
  await page768.waitForTimeout(1500);

  const contact768 = await page768.$('#contact');
  await contact768.scrollIntoViewIfNeeded();
  await page768.waitForTimeout(800);

  await page768.screenshot({ path: `${outDir}/07_contact_portal_tablet_768x1024.png` });
  record('Capture 07 Tablet 768x1024', true, 'Saved 07_contact_portal_tablet_768x1024.png');

  const overflow768 = await page768.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Tablet Zero Horizontal Overflow', overflow768, `scrollWidth <= clientWidth: ${overflow768}`);

  await page768.close();

  // --------------------------------------------------------------------------
  // 4. MOBILE 390x844
  // --------------------------------------------------------------------------
  console.log('\n--- PHASE 4: Mobile 390x844 Audit ---');
  const page390 = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await page390.goto(targetUrl, { waitUntil: 'networkidle' });
  await page390.waitForTimeout(1500);

  const contact390 = await page390.$('#contact');
  await contact390.scrollIntoViewIfNeeded();
  await page390.waitForTimeout(800);

  await page390.screenshot({ path: `${outDir}/08_contact_portal_mobile_390x844.png` });
  record('Capture 08 Mobile 390x844', true, 'Saved 08_contact_portal_mobile_390x844.png');

  const overflow390 = await page390.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  record('Mobile Zero Horizontal Overflow', overflow390, `scrollWidth <= clientWidth: ${overflow390}`);

  // Test touch target size on cards
  const cardBox = await page390.$eval('.portal-contact-card', el => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  record('Mobile Card Touch Target >= 44px', cardBox.height >= 44, `Height: ${cardBox.height}px, Width: ${cardBox.width}px`);

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

verifyContactPortal().catch(err => {
  console.error('Error during audit:', err);
  process.exit(1);
});
