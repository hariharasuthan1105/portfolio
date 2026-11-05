import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const viewports = [
  { name: "Desktop_1920", w: 1920, h: 1080 },
  { name: "Laptop_1366", w: 1366, h: 768 },
  { name: "Tablet_Landscape_1024", w: 1024, h: 768 },
  { name: "Tablet_Portrait_768", w: 768, h: 1024 },
  { name: "Mobile_390", w: 390, h: 844 },
  { name: "Small_Mobile_320", w: 320, h: 568 }
];

async function run() {
  console.log("=== VERIFYING SECTION 06 (HALL OF HONOR): NO 3D TROPHIES & 2D REFINED GALLERY ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#achievements", { timeout: 15000 });
  await page.waitForTimeout(1000);

  const report = {
    canvasCheck: null,
    backgroundCheck: null,
    removedHintsCheck: null,
    cardsContentCheck: null,
    modalInteractionCheck: null,
    certificationsDrawerCheck: null,
    responsiveLayoutChecks: [],
    allPassed: true
  };

  // 1. Check for 3D Canvas in Section 06
  const canvasCount = await page.evaluate(() => {
    const section = document.getElementById("achievements");
    if (!section) return -1;
    return section.querySelectorAll("canvas").length;
  });

  report.canvasCheck = {
    canvasCountInSection06: canvasCount,
    passed: canvasCount === 0
  };
  console.log(`[1] 3D Canvas in Section 06: ${canvasCount} (Expected: 0) -> ${canvasCount === 0 ? "PASS" : "FAIL"}`);
  if (canvasCount !== 0) report.allPassed = false;

  // 2. Check Background layer
  const bgLayer = await page.evaluate(() => {
    const layer = document.querySelector(".hall-background-layer");
    if (!layer) return null;
    const computed = window.getComputedStyle(layer);
    return {
      exists: true,
      bgImage: computed.backgroundImage,
      opacity: computed.opacity,
      display: computed.display
    };
  });

  report.backgroundCheck = {
    ...bgLayer,
    passed: bgLayer && bgLayer.bgImage.includes("hall-of-honor-environment.webp")
  };
  console.log(`[2] Background Layer Image: ${bgLayer?.bgImage} -> ${report.backgroundCheck.passed ? "PASS" : "FAIL"}`);
  if (!report.backgroundCheck.passed) report.allPassed = false;

  // 3. Check Removed Hints & Controls
  const removedElements = await page.evaluate(() => {
    const hint = document.querySelector(".hall-explore-hint");
    const mobileControls = document.querySelector(".hall-mobile-controls");
    const textHasSelectTrophy = document.getElementById("achievements")?.textContent?.includes("SELECT A TROPHY TO EXPLORE");
    const textHasExploreTrophy = document.getElementById("achievements")?.textContent?.includes("EXPLORE TROPHY");
    return {
      hasHintElement: !!hint,
      hasMobileControls: !!mobileControls,
      textHasSelectTrophy: !!textHasSelectTrophy,
      textHasExploreTrophy: !!textHasExploreTrophy
    };
  });

  report.removedHintsCheck = {
    ...removedElements,
    passed: !removedElements.hasHintElement && !removedElements.hasMobileControls && !removedElements.textHasSelectTrophy && !removedElements.textHasExploreTrophy
  };
  console.log(`[3] Removed 3D hints & controls: ${JSON.stringify(removedElements)} -> ${report.removedHintsCheck.passed ? "PASS" : "FAIL"}`);
  if (!report.removedHintsCheck.passed) report.allPassed = false;

  // 4. Check 3 Cards Content & Action Text
  const cardsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".hall-awards-grid .hall-award-panel"));
    return cards.map(c => {
      const title = c.querySelector(".badge-title")?.textContent?.trim();
      const organizer = c.querySelector(".badge-organizer")?.textContent?.trim();
      const status = c.querySelector(".badge-status")?.textContent?.trim();
      const action = c.querySelector(".badge-action")?.textContent?.trim();
      const rect = c.getBoundingClientRect();
      return { title, organizer, status, action, width: rect.width, height: rect.height };
    });
  });

  const cardsPassed = cardsInfo.length === 3 &&
    cardsInfo[0].title.toUpperCase().includes("CONVOLVE 4.0") &&
    cardsInfo[1].title.toUpperCase().includes("PATHWAY AI HACKATHON") &&
    cardsInfo[2].title.toUpperCase().includes("WORLD COMPUTER HACKER LEAGUE") &&
    cardsInfo.every(c => c.action?.includes("VIEW ACHIEVEMENT"));

  report.cardsContentCheck = {
    count: cardsInfo.length,
    cards: cardsInfo,
    passed: cardsPassed
  };
  console.log(`[4] Achievement Cards: count=${cardsInfo.length}, all have '[ VIEW ACHIEVEMENT ]' -> ${cardsPassed ? "PASS" : "FAIL"}`);
  if (!cardsPassed) report.allPassed = false;

  // 5. Test Modal Interaction for all 3 cards
  console.log("\n[5] Testing Modal Interaction for each Achievement card...");
  const modalResults = [];
  for (let i = 0; i < 3; i++) {
    const cardSelector = `.hall-awards-grid .hall-award-panel:nth-child(${i + 1})`;
    await page.click(cardSelector);
    await page.waitForTimeout(300);

    const dialogState = await page.evaluate(() => {
      const dlg = document.querySelector(".award-citation-dialog");
      if (!dlg) return { open: false };
      const title = dlg.querySelector(".citation-title")?.textContent?.trim();
      const status = dlg.querySelector(".citation-badge")?.textContent?.trim();
      const isOpen = dlg.hasAttribute("open") && window.getComputedStyle(dlg).display !== "none";
      return { open: isOpen, title, status };
    });

    console.log(`  - Card ${i + 1} clicked -> Dialog Open: ${dialogState.open}, Title: "${dialogState.title}", Status: "${dialogState.status}"`);

    // Capture screenshot of open dialog for Card 1 (Convolve)
    if (i === 0) {
      await page.screenshot({ path: path.join(artifactDir, "section06_modal_dialog_convolve.png") });
    }

    // Close modal via close button
    await page.click(".dialog-close-btn");
    await page.waitForTimeout(200);

    const dialogClosed = await page.evaluate(() => {
      const dlg = document.querySelector(".award-citation-dialog");
      return !dlg?.hasAttribute("open");
    });

    modalResults.push({
      cardIndex: i,
      title: dialogState.title,
      status: dialogState.status,
      opened: dialogState.open,
      closedCleanly: dialogClosed
    });
  }

  const allModalsPassed = modalResults.every(m => m.opened && m.closedCleanly);
  report.modalInteractionCheck = {
    results: modalResults,
    passed: allModalsPassed
  };
  console.log(`[5] All 3 modals opened & closed cleanly: ${allModalsPassed ? "PASS" : "FAIL"}`);
  if (!allModalsPassed) report.allPassed = false;

  // 6. Test Verified Certifications Drawer Toggle
  console.log("\n[6] Testing Verified Certifications Drawer Toggle...");
  const initialDrawer = await page.evaluate(() => document.getElementById("hall-certifications-drawer") !== null);
  
  // Click to open
  await page.click(".certifications-toggle-btn");
  await page.waitForTimeout(300);
  
  const openedDrawer = await page.evaluate(() => {
    const drawer = document.getElementById("hall-certifications-drawer");
    const count = drawer ? drawer.querySelectorAll(".cert-item-card").length : 0;
    return { exists: drawer !== null, count };
  });

  // Capture screenshot of open drawer
  await page.screenshot({ path: path.join(artifactDir, "section06_certifications_drawer_open.png") });

  // Click to close
  await page.click(".certifications-toggle-btn");
  await page.waitForTimeout(300);

  const closedDrawer = await page.evaluate(() => document.getElementById("hall-certifications-drawer") === null);

  const drawerPassed = !initialDrawer && openedDrawer.exists && openedDrawer.count === 5 && closedDrawer;
  report.certificationsDrawerCheck = {
    initialClosed: !initialDrawer,
    openedWith5Certs: openedDrawer.exists && openedDrawer.count === 5,
    closedCleanly: closedDrawer,
    passed: drawerPassed
  };
  console.log(`[6] Certifications Drawer Toggle: count=${openedDrawer.count} -> ${drawerPassed ? "PASS" : "FAIL"}`);
  if (!drawerPassed) report.allPassed = false;

  // 7. Responsive Viewport Audits & Screenshots
  console.log("\n[7] Auditing Section 06 across viewports & capturing screenshots...");
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.evaluate(() => {
      const s = document.getElementById("achievements");
      if (s) s.scrollIntoView();
    });
    await page.waitForTimeout(300);

    const vpMetrics = await page.evaluate(() => {
      const section = document.getElementById("achievements");
      const stage = document.querySelector(".hall-cinematic-stage");
      const header = document.querySelector(".hall-header-block");
      const grid = document.querySelector(".hall-awards-grid");
      const cards = Array.from(document.querySelectorAll(".hall-awards-grid .hall-award-panel"));

      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const docOverflow = docW > winW;

      const cardRects = cards.map(c => {
        const r = c.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) };
      });

      return {
        docW,
        winW,
        docOverflow,
        cardCount: cards.length,
        cardRects,
        stageHeight: stage?.offsetHeight,
        headerWidth: header?.offsetWidth
      };
    });

    const isLayoutValid = !vpMetrics.docOverflow && vpMetrics.cardCount === 3;
    report.responsiveLayoutChecks.push({
      viewport: vp.name,
      width: vp.w,
      height: vp.h,
      ...vpMetrics,
      passed: isLayoutValid
    });

    console.log(`  - ${vp.name} (${vp.w}x${vp.h}): overflow=${vpMetrics.docOverflow}, cards=${vpMetrics.cardCount}, cardWidths=${vpMetrics.cardRects.map(c => c.w).join(', ')} -> ${isLayoutValid ? "PASS" : "FAIL"}`);
    if (!isLayoutValid) report.allPassed = false;

    // Capture screenshot of the section
    const screenshotName = `section06_${vp.name.toLowerCase()}.png`;
    const sectionHandle = await page.$("#achievements");
    if (sectionHandle) {
      await sectionHandle.screenshot({ path: path.join(artifactDir, screenshotName) });
    } else {
      await page.screenshot({ path: path.join(artifactDir, screenshotName) });
    }
  }

  // Save report artifact
  fs.writeFileSync(
    path.join(artifactDir, "section06_verification_results.json"),
    JSON.stringify(report, null, 2)
  );

  await browser.close();
  console.log(`\n=== SECTION 06 AUDIT COMPLETE: ${report.allPassed ? "ALL 100% PASSED" : "FAILED"} ===\n`);
}

run().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
