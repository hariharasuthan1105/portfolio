import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'screenshots/3d_repair_evidence';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetUrl = 'http://127.0.0.1:4173/';

async function captureEvidence() {
  console.log(`\n======================================================`);
  console.log(`  KINGDOM OF CODE — 3D ALIGNMENT REPAIR VERIFICATION  `);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    // 1. Initial Load and skip intro
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const skipBtn = await page.$('.skip-intro-btn');
    if (skipBtn) await skipBtn.click();
    await page.waitForTimeout(800);

    // =========================================================================
    // SKILLS SECTION (THE FORGE OF INTELLIGENCE) VERIFICATION
    // =========================================================================
    console.log('Capturing Skills section evidence...');

    const skillsSection = await page.$('#skills');
    if (skillsSection) {
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // 01: Default Arena (1920x1080 Viewport)
      await page.screenshot({ path: path.join(outDir, '01_skills_default_arena_1920x1080.png') });

      // 02: All four aligned globes - closeup of stage
      const skillsStage = await page.$('.forge-stage');
      if (skillsStage) {
        await skillsStage.screenshot({ path: path.join(outDir, '02_skills_four_globes_aligned_stage.png') });
      }

      // 03: Select "TOOLS & CLOUD" Category
      const toolsBtn = await page.$('.forge-cat-btn:has-text("TOOLS & CLOUD")');
      if (toolsBtn) {
        await toolsBtn.click();
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(outDir, '03_skills_tools_and_cloud_selected.png') });
      }

      // 04: Select "PROGRAMMING" Category
      const progBtn = await page.$('.forge-cat-btn:has-text("PROGRAMMING")');
      if (progBtn) {
        await progBtn.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(outDir, '04_skills_programming_selected.png') });
      }
    }

    // 05A: Isolated 3D mode for Skills (?isolate=skills3d)
    await page.goto(`${targetUrl}?isolate=skills3d`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const skip2 = await page.$('.skip-intro-btn');
    if (skip2) await skip2.click();
    await page.waitForTimeout(600);
    const skillsIso = await page.$('#skills');
    if (skillsIso) {
      await skillsIso.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, '05_skills_isolated_3d_grounding.png') });
    }

    // 05B: Debug contact points mode for Skills (?debug=skills)
    await page.goto(`${targetUrl}?debug=skills`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const skipDebugSkills = await page.$('.skip-intro-btn');
    if (skipDebugSkills) await skipDebugSkills.click();
    await page.waitForTimeout(600);
    const skillsDbg = await page.$('#skills');
    if (skillsDbg) {
      await skillsDbg.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, '05B_skills_debug_contact_grid.png') });
    }

    // =========================================================================
    // HALL OF HONOR SECTION VERIFICATION
    // =========================================================================
    console.log('Capturing Hall of Honor evidence...');

    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const skip3 = await page.$('.skip-intro-btn');
    if (skip3) await skip3.click();
    await page.waitForTimeout(600);

    const hallSection = await page.$('#achievements');
    if (hallSection) {
      await hallSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // 06: Corrected Full Hall of Honor Scene (1920x1080)
      await page.screenshot({ path: path.join(outDir, '06_hall_of_honor_corrected_full_scene.png') });

      // 07: Left Trophy (Convolve 4.0) Selected
      const leftCard = await page.$('.hall-award-panel:nth-child(1)');
      if (leftCard) {
        await leftCard.click();
        await page.waitForTimeout(600);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, '07_hall_convolve_left_selected.png') });
      }

      // 08: Center Trophy (Pathway AI Hackathon) Selected
      const centerCard = await page.$('.hall-award-panel:nth-child(2)');
      if (centerCard) {
        await centerCard.click();
        await page.waitForTimeout(600);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, '08_hall_pathway_center_selected.png') });
      }

      // 09: Right Trophy (WCHL) Selected
      const rightCard = await page.$('.hall-award-panel:nth-child(3)');
      if (rightCard) {
        await rightCard.click();
        await page.waitForTimeout(600);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, '09_hall_wchl_right_selected.png') });
      }

      // 10: Citation Modal Details View
      if (centerCard) {
        await centerCard.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, '10_hall_achievement_citation_modal.png') });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }

      // 11: Expand Verified Credentials Section
      const certToggle = await page.$('.certifications-toggle-btn');
      if (certToggle) {
        await certToggle.click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(outDir, '11_hall_verified_credentials_expanded.png') });
      }
    }

    // 12A: Isolated 3D mode for Hall of Honor (?isolate=hall3d)
    await page.goto(`${targetUrl}?isolate=hall3d`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const skip4 = await page.$('.skip-intro-btn');
    if (skip4) await skip4.click();
    await page.waitForTimeout(600);
    const hallIso = await page.$('#achievements');
    if (hallIso) {
      await hallIso.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, '12_hall_isolated_3d_podiums.png') });
    }

    // 12B: Debug contact points mode for Hall of Honor (?debug=hall)
    await page.goto(`${targetUrl}?debug=hall`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const skipDbgHall = await page.$('.skip-intro-btn');
    if (skipDbgHall) await skipDbgHall.click();
    await page.waitForTimeout(600);
    const hallDbg = await page.$('#achievements');
    if (hallDbg) {
      await hallDbg.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, '12B_hall_debug_contact_grid.png') });
    }

    // =========================================================================
    // RESPONSIVE SCREEN SIZES VERIFICATION (All 7 Required Viewports)
    // 1920x1080, 1536x1024, 1366x768, 1024x768, 768x1024, 390x844, 320x568
    // =========================================================================
    console.log('Capturing responsive viewports evidence across all 7 resolutions...');

    const viewports = [
      { name: '13_desktop_1920x1080', width: 1920, height: 1080 },
      { name: '14_desktop_1536x1024', width: 1536, height: 1024 },
      { name: '15_laptop_1366x768', width: 1366, height: 768 },
      { name: '16_tablet_landscape_1024x768', width: 1024, height: 768 },
      { name: '17_tablet_portrait_768x1024', width: 768, height: 1024 },
      { name: '18_mobile_390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
      { name: '19_mobile_320x568', width: 320, height: 568, isMobile: true, hasTouch: true },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const skipVp = await page.$('.skip-intro-btn');
      if (skipVp) await skipVp.click();
      await page.waitForTimeout(500);

      // Skills section in this viewport
      const sEl = await page.$('#skills');
      if (sEl) {
        await sEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, `${vp.name}_skills.png`) });
      }

      // Hall of Honor section in this viewport
      const hEl = await page.$('#achievements');
      if (hEl) {
        await hEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, `${vp.name}_hall.png`) });
      }
      console.log(`Captured responsive views for: ${vp.name}`);
    }

  } catch (err) {
    console.error('Error during evidence capture:', err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  console.log(`\nAll visual evidence captured to: ${outDir}\n`);
}

captureEvidence();
