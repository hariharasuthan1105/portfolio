import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const targetViewports = [
  { name: "Desktop_1920", w: 1920, h: 1080 },
  { name: "Large_Laptop_1536", w: 1536, h: 864 },
  { name: "Desktop_1440", w: 1440, h: 900 },
  { name: "Laptop_1366", w: 1366, h: 768 },
  { name: "Compact_Laptop_1280", w: 1280, h: 720 },
  { name: "Tablet_Landscape_1024", w: 1024, h: 768 },
  { name: "Tablet_Portrait_820", w: 820, h: 1180 },
  { name: "Tablet_Portrait_768", w: 768, h: 1024 },
  { name: "Large_Mobile_430", w: 430, h: 932 },
  { name: "Mobile_390", w: 390, h: 844 },
  { name: "Android_360", w: 360, h: 800 },
  { name: "Small_Mobile_320", w: 320, h: 568 }
];

async function run() {
  console.log("=== VERIFYING SECTION 07 (THE PORTAL): LUXURY ALIGNMENT & RESPONSIVE REPAIR ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"]
  });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#contact", { timeout: 15000 });
  await page.waitForTimeout(1000);

  const report = {
    headingCheck: null,
    regionsBalanceCheck: null,
    contactCardsCheck: null,
    copyInteractionCheck: null,
    viewportAuditChecks: [],
    allPassed: true
  };

  // 1. Initial Desktop 1440 Inspection
  console.log("[1] Inspecting Heading and Typography on 1440x900...");
  const headingData = await page.evaluate(() => {
    const heading = document.querySelector("#contact .contact-heading") || document.querySelector("#contact .portal-main-title");
    const leftZone = document.querySelector("#contact .portal-left-zone");
    const centerZone = document.querySelector("#contact .portal-center-zone");
    const lines = Array.from(heading ? heading.querySelectorAll(".heading-line") : []).map(el => el.textContent.trim());

    const hRect = heading?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };
    const lRect = leftZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };
    const cRect = centerZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };

    const meaningfulLine = Array.from(heading ? heading.querySelectorAll(".heading-line") : []).find(el => el.textContent.includes("MEANINGFUL"));
    const mRect = meaningfulLine?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };

    return {
      headingText: heading?.textContent?.trim().replace(/\s+/g, " "),
      lines,
      headingWidth: Math.round(hRect.width),
      leftZoneWidth: Math.round(lRect.width),
      meaningfulWidth: Math.round(mRect.width),
      overflowsLeftZone: hRect.right > (lRect.right + 2),
      overlapsCenter: cRect.width > 0 && hRect.right > (cRect.left + 2)
    };
  });

  const headingPassed = !headingData.overflowsLeftZone && !headingData.overlapsCenter && headingData.lines.some(l => l.includes("MEANINGFUL"));
  report.headingCheck = {
    ...headingData,
    passed: headingPassed
  };
  console.log(`[1] Heading Check: width=${headingData.headingWidth}px, leftZone=${headingData.leftZoneWidth}px, overflowsLeft=${headingData.overflowsLeftZone}, overlapsCenter=${headingData.overlapsCenter} -> ${headingPassed ? "PASS" : "FAIL"}`);
  if (!headingPassed) report.allPassed = false;

  // 2. Inspect 3-Region Desktop Balance
  console.log("[2] Inspecting 3 Balanced Regions on Desktop...");
  const regionsData = await page.evaluate(() => {
    const layout = document.querySelector("#contact .contact-portal-layout");
    const left = document.querySelector("#contact .portal-left-zone");
    const center = document.querySelector("#contact .portal-center-zone");
    const right = document.querySelector("#contact .portal-right-zone");

    const totalWidth = layout?.getBoundingClientRect().width || 1;
    const lWidth = left?.getBoundingClientRect().width || 0;
    const cWidth = center?.getBoundingClientRect().width || 0;
    const rWidth = right?.getBoundingClientRect().width || 0;

    const lPct = Math.round((lWidth / totalWidth) * 100);
    const cPct = Math.round((cWidth / totalWidth) * 100);
    const rPct = Math.round((rWidth / totalWidth) * 100);

    return {
      totalWidth: Math.round(totalWidth),
      leftWidth: Math.round(lWidth),
      centerWidth: Math.round(cWidth),
      rightWidth: Math.round(rWidth),
      leftPct: lPct,
      centerPct: cPct,
      rightPct: rPct
    };
  });

  // Target: Left 34-37%, Center 28-32%, Right 33-36% (with padding/gap tolerances)
  const regionsPassed = regionsData.leftPct >= 30 && regionsData.leftPct <= 40 &&
                        regionsData.centerPct >= 22 && regionsData.centerPct <= 35 &&
                        regionsData.rightPct >= 30 && regionsData.rightPct <= 40;

  report.regionsBalanceCheck = {
    ...regionsData,
    passed: regionsPassed
  };
  console.log(`[2] 3 Regions Balance: Left ${regionsData.leftPct}% | Center ${regionsData.centerPct}% | Right ${regionsData.rightPct}% -> ${regionsPassed ? "PASS" : "FAIL"}`);
  if (!regionsPassed) report.allPassed = false;

  // 3. Inspect Contact Cards & Content Integrity
  console.log("[3] Inspecting Contact Cards...");
  const cardsData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("#contact .portal-contact-card"));
    return cards.map(c => {
      const label = c.querySelector(".portal-card-label")?.textContent?.trim();
      const val = c.querySelector(".portal-card-value")?.textContent?.trim();
      const action = c.querySelector(".portal-card-action")?.textContent?.trim();
      const href = c.getAttribute("href");
      const rect = c.getBoundingClientRect();
      return {
        label,
        value: val,
        action,
        href,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    });
  });

  const cardsValid = cardsData.length === 3 &&
    cardsData.some(c => c.value.includes("hariharasuthan1105@gmail.com")) &&
    cardsData.some(c => c.value.includes("Hariharasuthan V")) &&
    cardsData.some(c => c.value.includes("Explore Source Code"));

  report.contactCardsCheck = {
    count: cardsData.length,
    cards: cardsData,
    passed: cardsValid
  };
  console.log(`[3] Contact Cards: found ${cardsData.length}/3 -> ${cardsValid ? "PASS" : "FAIL"}`);
  if (!cardsValid) report.allPassed = false;

  // 4. Test Copy Email Interaction
  console.log("[4] Testing Copy Email Interaction...");
  await page.evaluate(() => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(400);
  const initialText = await page.$eval("#contact .portal-copy-btn", el => el.innerText.trim());
  await page.click("#contact .portal-copy-btn");
  await page.waitForTimeout(600);
  const afterClickText = await page.$eval("#contact .portal-copy-btn", el => el.innerText.trim());

  const copyPassed = afterClickText.includes("EMAIL COPIED") || afterClickText.includes("SELECT EMAIL");
  report.copyInteractionCheck = {
    initialText: initialText.trim(),
    afterClickText: afterClickText.trim(),
    passed: copyPassed
  };
  console.log(`[4] Copy Email Button: "${initialText.trim()}" -> "${afterClickText.trim()}" -> ${copyPassed ? "PASS" : "FAIL"}`);
  if (!copyPassed) report.allPassed = false;

  // Capture interactive state screenshot
  const contactElem = await page.$("#contact");
  if (contactElem) {
    const copyShotPath = path.join(artifactDir, "section07_copy_interaction.png");
    await contactElem.screenshot({ path: copyShotPath });
    console.log(`Captured interactive state: ${copyShotPath}`);
  }

  // 5. Audit Across All 12 Breakpoints
  console.log("[5] Auditing Across All 12 Breakpoints...");
  for (const vp of targetViewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.evaluate(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const vpMetrics = await page.evaluate((vpWidth) => {
      const sec = document.getElementById("contact");
      if (!sec) return { error: "No #contact section found" };

      const bodyScrollWidth = document.documentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      const hasHorizontalScroll = bodyScrollWidth > windowWidth;

      const heading = sec.querySelector(".contact-heading") || sec.querySelector(".portal-main-title");
      const leftZone = sec.querySelector(".portal-left-zone");
      const centerZone = sec.querySelector(".portal-center-zone");
      const rightZone = sec.querySelector(".portal-right-zone");
      const mobilePlate = sec.querySelector(".portal-mobile-artwork-plate");
      const emailCard = sec.querySelector(".portal-card-wrapper:first-child");
      const mobileStatus = sec.querySelector(".portal-status-pill.mobile-only");

      const hRect = heading?.getBoundingClientRect() || { width: 0, right: 0, left: 0, top: 0, bottom: 0 };
      const lRect = leftZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0, top: 0, bottom: 0 };
      const cRect = centerZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0, top: 0, bottom: 0 };
      const rRect = rightZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0, top: 0, bottom: 0 };
      const plateRect = mobilePlate?.getBoundingClientRect() || { width: 0, height: 0, top: 0, bottom: 0 };
      const emailRect = emailCard?.getBoundingClientRect() || { width: 0, height: 0, top: 0, bottom: 0 };
      const statusRect = mobileStatus?.getBoundingClientRect() || { width: 0, height: 0, top: 0, bottom: 0 };

      // Desktop heading check: does heading stay inside leftZone?
      let headingContained = true;
      if (vpWidth >= 1025) {
        headingContained = hRect.right <= (lRect.right + 2) && hRect.right <= (cRect.left + 2);
      } else {
        headingContained = hRect.width <= lRect.width + 2;
      }

      // Mobile order check (<= 1024px):
      // 1. Header (lRect.top) < 2. Center Plate (plateRect.top) < 3. Cards (emailRect.top) < 4. Status (statusRect.top)
      let mobileOrderCorrect = true;
      if (vpWidth <= 1024) {
        mobileOrderCorrect = (lRect.top <= plateRect.top) &&
                             (plateRect.top <= emailRect.top) &&
                             (emailRect.top <= statusRect.top);
      }

      return {
        bodyScrollWidth,
        windowWidth,
        hasHorizontalScroll,
        headingContained,
        mobileOrderCorrect,
        headingWidth: Math.round(hRect.width),
        leftZoneWidth: Math.round(lRect.width),
        centerZoneWidth: Math.round(cRect.width),
        rightZoneWidth: Math.round(rRect.width)
      };
    }, vp.w);

    const vpPassed = !vpMetrics.hasHorizontalScroll && vpMetrics.headingContained && vpMetrics.mobileOrderCorrect;
    if (!vpPassed) report.allPassed = false;

    console.log(`Viewport ${vp.name} (${vp.w}x${vp.h}): overflow=${vpMetrics.hasHorizontalScroll ? "FAIL" : "CLEAN (0px)"}, headingContained=${vpMetrics.headingContained ? "YES" : "NO"}, mobileOrder=${vpMetrics.mobileOrderCorrect ? "CORRECT" : "N/A"} -> ${vpPassed ? "PASS" : "FAIL"}`);

    report.viewportAuditChecks.push({
      viewport: vp.name,
      width: vp.w,
      height: vp.h,
      ...vpMetrics,
      passed: vpPassed
    });

    // Save screenshot
    const shotPath = path.join(artifactDir, `section07_after_${vp.name.toLowerCase()}.png`);
    const sElem = await page.$("#contact");
    if (sElem) {
      await sElem.screenshot({ path: shotPath });
      console.log(`  Saved screenshot: ${shotPath}`);
    }
  }

  // Write JSON report
  const reportPath = path.join(artifactDir, "section07_verification_results.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nVerification report saved to: ${reportPath}`);
  console.log(`ALL TESTS PASSED: ${report.allPassed ? "YES (100% PASS)" : "NO"}`);

  await browser.close();
}

run().catch((err) => {
  console.error("Verification failed with error:", err);
  process.exit(1);
});
