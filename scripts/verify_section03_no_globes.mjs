import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const viewports = [
  { name: "Desktop_1920", w: 1920, h: 1080 },
  { name: "Large_Laptop_1536", w: 1536, h: 864 },
  { name: "Laptop_1366", w: 1366, h: 768 },
  { name: "Tablet_Landscape_1024", w: 1024, h: 768 },
  { name: "Tablet_Portrait_768", w: 768, h: 1024 },
  { name: "Mobile_390", w: 390, h: 844 },
  { name: "Small_Mobile_320", w: 320, h: 568 }
];

async function run() {
  console.log("=== VERIFYING SECTION 03 (FORGE OF INTELLIGENCE): ZERO 3D GLOBES & LUXURY 2D INTERFACE ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#skills", { timeout: 15000 });
  await page.waitForTimeout(1000);

  const report = {
    canvasCheck: null,
    backgroundCheck: null,
    removed3DElementsCheck: null,
    categoriesCheck: null,
    all22SkillsCheck: null,
    categoryFilterInteractionCheck: null,
    skillSelectInteractionCheck: null,
    responsiveLayoutChecks: [],
    allPassed: true
  };

  // 1. Check for 3D Canvas in Section 03
  const canvasCount = await page.evaluate(() => {
    const section = document.getElementById("skills");
    if (!section) return -1;
    return section.querySelectorAll("canvas").length;
  });

  report.canvasCheck = {
    canvasCountInSection03: canvasCount,
    passed: canvasCount === 0
  };
  console.log(`[1] 3D Canvas in Section 03: ${canvasCount} (Expected: 0) -> ${canvasCount === 0 ? "PASS" : "FAIL"}`);
  if (canvasCount !== 0) report.allPassed = false;

  // 2. Check Static Gothic Sanctum Background
  const sanctumBg = await page.evaluate(() => {
    const bg = document.querySelector(".forge-sanctum-bg");
    const center = document.querySelector(".forge-center-stage");
    if (!bg) return null;
    const computed = window.getComputedStyle(bg);
    return {
      exists: true,
      bgImage: computed.backgroundImage,
      opacity: computed.opacity,
      display: computed.display,
      stageWidth: center ? center.getBoundingClientRect().width : 0,
      stageHeight: center ? center.getBoundingClientRect().height : 0
    };
  });

  report.backgroundCheck = {
    ...sanctumBg,
    passed: sanctumBg && sanctumBg.bgImage.includes("forge-environment.webp")
  };
  console.log(`[2] Sanctum Environment Image: ${sanctumBg?.bgImage} -> ${report.backgroundCheck.passed ? "PASS" : "FAIL"}`);
  if (!report.backgroundCheck.passed) report.allPassed = false;

  // 3. Check Removed 3D Elements
  const removed3DCheck = await page.evaluate(() => {
    const sec = document.getElementById("skills");
    if (!sec) return { error: "No #skills section found" };
    const hasCanvas = sec.querySelectorAll("canvas").length > 0;
    const hasWebGL = !!sec.querySelector("[data-webgl]");
    const textHasSelectGlobe = sec.textContent?.includes("SELECT A NODE TO ACTIVATE TELEMETRY");
    return {
      hasCanvas,
      hasWebGL,
      textHasSelectGlobe,
      passed: !hasCanvas && !hasWebGL && !textHasSelectGlobe
    };
  });

  report.removed3DElementsCheck = removed3DCheck;
  console.log(`[3] 3D Elements & Node text removed: ${removed3DCheck.passed ? "PASS" : "FAIL"}`);
  if (!removed3DCheck.passed) report.allPassed = false;

  // 4. Check 7 Categories
  const categoriesInfo = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll(".forge-cat-btn"));
    return btns.map(b => ({
      name: b.querySelector(".cat-name")?.textContent?.trim(),
      count: b.querySelector(".cat-count-pill")?.textContent?.trim(),
      isActive: b.classList.contains("active")
    }));
  });

  const expectedCategories = [
    "ALL SKILLS",
    "PROGRAMMING",
    "AI / ML",
    "WEB DEVELOPMENT",
    "DATABASES",
    "TOOLS & CLOUD",
    "OTHER"
  ];
  const categoriesPassed = categoriesInfo.length === 7 &&
    expectedCategories.every(exp => categoriesInfo.some(c => c.name === exp));

  report.categoriesCheck = {
    foundCount: categoriesInfo.length,
    categories: categoriesInfo,
    passed: categoriesPassed
  };
  console.log(`[4] 7 Skill Categories: found ${categoriesInfo.length}/7 -> ${categoriesPassed ? "PASS" : "FAIL"}`);
  if (!categoriesPassed) report.allPassed = false;

  // 5. Check all 22 Skills in Index
  const skillsList = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".skill-index-card"));
    return cards.map(c => ({
      name: c.querySelector(".skill-card-name")?.textContent?.trim(),
      cat: c.querySelector(".skill-card-cat")?.textContent?.trim()
    }));
  });

  report.all22SkillsCheck = {
    count: skillsList.length,
    names: skillsList.map(s => s.name),
    passed: skillsList.length === 22
  };
  console.log(`[5] All 22 Skills in Index: found ${skillsList.length}/22 -> ${skillsList.length === 22 ? "PASS" : "FAIL"}`);
  if (skillsList.length !== 22) report.allPassed = false;

  // 6. Test Interactive Category Filtering
  console.log("[6] Testing Interactive Category Filtering (click 'AI / ML')...");
  // Find AI / ML button
  const aiCatBtn = await page.locator(".forge-cat-btn:has-text('AI / ML')");
  await aiCatBtn.click();
  await page.waitForTimeout(500);

  const filterState = await page.evaluate(() => {
    const activeBtn = document.querySelector(".forge-cat-btn.active .cat-name")?.textContent?.trim();
    const filterStatus = document.querySelector(".skills-index-filter-status")?.textContent?.trim();
    const visibleCards = Array.from(document.querySelectorAll(".skill-index-card")).map(
      c => c.querySelector(".skill-card-name")?.textContent?.trim()
    );
    const inspectorTitle = document.querySelector(".inspector-title")?.textContent?.trim();
    const inspectorCat = document.querySelector(".inspector-category-badge")?.textContent?.trim();
    return {
      activeBtn,
      filterStatus,
      visibleCardsCount: visibleCards.length,
      visibleCards,
      inspectorTitle,
      inspectorCat
    };
  });

  const filterPassed = filterState.activeBtn === "AI / ML" &&
    filterState.visibleCardsCount === 5 && // AI/ML has 5 skills: TensorFlow, Scikit-learn, CatBoost, NumPy, Pandas
    filterState.inspectorCat === "AI / ML";

  report.categoryFilterInteractionCheck = {
    ...filterState,
    passed: filterPassed
  };
  console.log(`[6] Category Filter 'AI / ML': visible skills = ${filterState.visibleCardsCount} (Expected: 5) -> ${filterPassed ? "PASS" : "FAIL"}`);
  if (!filterPassed) report.allPassed = false;

  // Capture Category Selected screenshot
  const catSelectedPath = path.join(artifactDir, "section03_category_selected.png");
  const skillsElem = await page.$("#skills");
  if (skillsElem) {
    await skillsElem.screenshot({ path: catSelectedPath });
    console.log(`Captured: ${catSelectedPath}`);
  }

  // 7. Test Interactive Skill Selection (click 'TensorFlow')
  console.log("[7] Testing Technology Selection (click 'TensorFlow')...");
  const tfBtn = await page.locator(".skill-index-card:has-text('TensorFlow')");
  await tfBtn.click();
  await page.waitForTimeout(500);

  const selectState = await page.evaluate(() => {
    const isCardSelected = document.querySelector(".skill-index-card.selected .skill-card-name")?.textContent?.trim();
    const inspectorTitle = document.querySelector(".inspector-title")?.textContent?.trim();
    const inspectorDesc = document.querySelector(".inspector-desc")?.textContent?.trim();
    const activePill = document.querySelector(".subskill-pill.active")?.textContent?.trim();
    return {
      isCardSelected,
      inspectorTitle,
      inspectorDesc,
      activePill
    };
  });

  const selectPassed = selectState.isCardSelected === "TensorFlow" &&
    selectState.inspectorTitle === "TENSORFLOW" &&
    selectState.activePill === "TensorFlow" &&
    selectState.inspectorDesc.length > 20;

  report.skillSelectInteractionCheck = {
    ...selectState,
    passed: selectPassed
  };
  console.log(`[7] Skill Card Click 'TensorFlow': inspector title = "${selectState.inspectorTitle}" -> ${selectPassed ? "PASS" : "FAIL"}`);
  if (!selectPassed) report.allPassed = false;

  // Capture Skill Selected screenshot
  const skillSelectedPath = path.join(artifactDir, "section03_skill_selected.png");
  if (skillsElem) {
    await skillsElem.screenshot({ path: skillSelectedPath });
    console.log(`Captured: ${skillSelectedPath}`);
  }

  // Reset back to "All skills"
  const allCatBtn = await page.locator(".forge-cat-btn:has-text('ALL SKILLS')");
  await allCatBtn.click();
  await page.waitForTimeout(500);

  // 8. Test Across All 7 Viewports
  console.log("[8] Auditing Responsive Viewports & Mobile Ordering...");
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.waitForTimeout(500);

    const vpData = await page.evaluate((vpWidth) => {
      const section = document.getElementById("skills");
      if (!section) return { error: "No #skills section" };

      const bodyScrollWidth = document.documentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalScroll = bodyScrollWidth > windowWidth;

      const header = document.querySelector(".forge-header-block");
      const leftHud = document.querySelector(".forge-left-hud");
      const rightHud = document.querySelector(".forge-right-hud");
      const centerStage = document.querySelector(".forge-center-stage");
      const skillsIndex = document.querySelector(".forge-skills-index");

      const headerRect = header?.getBoundingClientRect() || { top: 0, bottom: 0, width: 0, height: 0 };
      const leftRect = leftHud?.getBoundingClientRect() || { top: 0, bottom: 0, width: 0, height: 0 };
      const rightRect = rightHud?.getBoundingClientRect() || { top: 0, bottom: 0, width: 0, height: 0 };
      const centerRect = centerStage?.getBoundingClientRect() || { top: 0, bottom: 0, width: 0, height: 0 };
      const indexRect = skillsIndex?.getBoundingClientRect() || { top: 0, bottom: 0, width: 0, height: 0 };

      // Check mobile ordering if width <= 1024px:
      // 1. Header -> 2. Left HUD (categories) -> 3. Right HUD (telemetry) -> 4. Center Stage -> 5. Skills Index
      let mobileOrderCorrect = true;
      if (vpWidth <= 1024) {
        mobileOrderCorrect = (headerRect.top <= leftRect.top) &&
                             (leftRect.top <= rightRect.top) &&
                             (rightRect.top <= centerRect.top) &&
                             (centerRect.top <= indexRect.top);
      }

      // Check skills grid columns
      const grid = document.querySelector(".skills-index-grid");
      const gridComputed = grid ? window.getComputedStyle(grid) : null;
      const colTemplate = gridComputed?.gridTemplateColumns || "";

      return {
        bodyScrollWidth,
        windowWidth,
        hasHorizontalScroll,
        mobileOrderCorrect,
        colTemplate,
        dimensions: {
          header: { w: Math.round(headerRect.width), h: Math.round(headerRect.height), top: Math.round(headerRect.top) },
          leftHud: { w: Math.round(leftRect.width), h: Math.round(leftRect.height), top: Math.round(leftRect.top) },
          rightHud: { w: Math.round(rightRect.width), h: Math.round(rightRect.height), top: Math.round(rightRect.top) },
          centerStage: { w: Math.round(centerRect.width), h: Math.round(centerRect.height), top: Math.round(centerRect.top) },
          skillsIndex: { w: Math.round(indexRect.width), h: Math.round(indexRect.height), top: Math.round(indexRect.top) }
        }
      };
    }, vp.w);

    const vpPassed = !vpData.hasHorizontalScroll && vpData.mobileOrderCorrect;
    if (!vpPassed) report.allPassed = false;

    console.log(`Viewport ${vp.name} (${vp.w}x${vp.h}): overflow=${vpData.hasHorizontalScroll ? "FAIL" : "CLEAN (0px)"}, order=${vpData.mobileOrderCorrect ? "CORRECT" : "FAIL"} -> ${vpPassed ? "PASS" : "FAIL"}`);

    report.responsiveLayoutChecks.push({
      viewport: vp.name,
      width: vp.w,
      height: vp.h,
      ...vpData,
      passed: vpPassed
    });

    // Capture screenshot
    const shotPath = path.join(artifactDir, `section03_${vp.name.toLowerCase()}.png`);
    const sElem = await page.$("#skills");
    if (sElem) {
      await sElem.screenshot({ path: shotPath });
      console.log(`  Saved screenshot: ${shotPath}`);
    }
  }

  // Write JSON report
  const reportPath = path.join(artifactDir, "section03_verification_results.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nVerification report saved to: ${reportPath}`);
  console.log(`ALL TESTS PASSED: ${report.allPassed ? "YES (100% PASS)" : "NO"}`);

  await browser.close();
}

run().catch((err) => {
  console.error("Verification failed with error:", err);
  process.exit(1);
});
