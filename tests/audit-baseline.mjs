import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/baseline_audit';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'desktop_1536x1024', width: 1536, height: 1024 },
  { name: 'laptop_1366x768', width: 1366, height: 768 },
  { name: 'tablet_768x1024', width: 768, height: 1024 },
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true, hasTouch: true }
];

async function auditSite(targetUrl, label) {
  console.log(`\n=== Auditing ${label}: ${targetUrl} ===`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = {
    url: targetUrl,
    label,
    consoleErrors: [],
    failedRequests: [],
    navigationCheck: {},
    interactions: {},
    viewportScreenshots: []
  };

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
      hasTouch: vp.hasTouch || false,
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.consoleErrors.push({ viewport: vp.name, text: msg.text() });
      }
    });

    page.on('requestfailed', req => {
      results.failedRequests.push({
        viewport: vp.name,
        url: req.url(),
        failure: req.failure()?.errorText
      });
    });

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 35000 });
      await page.waitForTimeout(2000); // Allow 3D canvas and animations to settle

      // Screenshot Homepage
      const homeShot = `${label}_${vp.name}_home.png`;
      await page.screenshot({ path: path.join(outDir, homeShot), fullPage: false });
      results.viewportScreenshots.push(homeShot);
      console.log(`Captured screenshot: ${homeShot}`);

      if (vp.name === 'desktop_1536x1024') {
        // Test navigation
        const navLinks = ['#about', '#skills', '#projects', '#experience', '#achievements', '#vault', '#contact', '#home'];
        for (const hash of navLinks) {
          const el = await page.$(`header nav a[href="${hash}"]`);
          if (el) {
            await el.click();
            await page.waitForTimeout(600);
            const targetSection = await page.$(hash);
            const visible = targetSection ? await targetSection.isVisible() : false;
            results.navigationCheck[hash] = { found: true, visible };
          } else {
            results.navigationCheck[hash] = { found: false };
          }
        }

        // Test Vault on Desktop
        await page.goto(`${targetUrl}#vault`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Challenge 1: Scanner
        const slider = await page.$('#scanner');
        if (slider) {
          await slider.fill('100');
          await page.dispatchEvent('#scanner', 'change');
          await page.waitForTimeout(400);
          results.interactions.scannerCompleted = true;
        }

        // Challenge 2: RAG Trace
        const traceBtn = await page.$('.challenge:nth-child(2) button.button');
        if (traceBtn) {
          await traceBtn.click();
          await page.waitForTimeout(2200); // wait for 4 stages * 450ms
          results.interactions.ragCompleted = true;
        }

        // Challenge 3: Network nodes
        const nodes = await page.$$('.network-board button');
        if (nodes.length >= 4) {
          await nodes[0].click();
          await nodes[1].click();
          await page.waitForTimeout(200);
          await nodes[1].click();
          await nodes[2].click();
          await page.waitForTimeout(200);
          await nodes[2].click();
          await nodes[3].click();
          await page.waitForTimeout(400);
          results.interactions.networkCompleted = true;
        }

        // Check if vault reveal unlocked
        const reveal = await page.$('.vault-reveal.unlocked');
        results.interactions.vaultUnlocked = !!reveal;

        const vaultShot = `${label}_desktop_vault_completed.png`;
        await page.screenshot({ path: path.join(outDir, vaultShot) });
        console.log(`Captured vault screenshot: ${vaultShot}`);

        // Test Replay
        const replayBtn = await page.$('.vault-reveal button.text-link');
        if (replayBtn) {
          await replayBtn.click();
          await page.waitForTimeout(300);
          const revealAfter = await page.$('.vault-reveal.unlocked');
          results.interactions.replayResetState = !revealAfter;
        }

        // Test Return to Home and Portal Lighting Check
        await page.goto(`${targetUrl}#home`);
        await page.waitForTimeout(1200);
        const homeReturnShot = `${label}_desktop_home_after_return.png`;
        await page.screenshot({ path: path.join(outDir, homeReturnShot) });
        console.log(`Captured return to home screenshot: ${homeReturnShot}`);
      }

      if (vp.name === 'mobile_390x844') {
        // Capture mobile sections
        await page.goto(`${targetUrl}#vault`);
        await page.waitForTimeout(800);
        const mobileVaultShot = `${label}_mobile_vault.png`;
        await page.screenshot({ path: path.join(outDir, mobileVaultShot) });

        await page.goto(`${targetUrl}#projects`);
        await page.waitForTimeout(800);
        const mobileProjectsShot = `${label}_mobile_projects.png`;
        await page.screenshot({ path: path.join(outDir, mobileProjectsShot) });
      }

    } catch (err) {
      console.error(`Error auditing ${vp.name}:`, err);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  return results;
}

(async () => {
  const localResults = await auditSite('http://127.0.0.1:4173/', 'local_preview');
  const liveResults = await auditSite('https://main.d3r0wa5wh6oirj.amplifyapp.com/', 'live_amplify');

  const report = {
    timestamp: new Date().toISOString(),
    local: localResults,
    live: liveResults
  };

  fs.writeFileSync(
    path.join(outDir, 'audit_report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('\nAudit complete! Report saved to screenshots/baseline_audit/audit_report.json');
})();
