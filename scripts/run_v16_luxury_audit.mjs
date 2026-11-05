import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";
const BASE_URL = "http://127.0.0.1:4173";

const VIEWPORTS = [
  { name: "Small Mobile (iPhone SE 1)", width: 320, height: 568 },
  { name: "Small Mobile (Galaxy)", width: 360, height: 640 },
  { name: "Mobile (iPhone 12/13/14)", width: 390, height: 844 },
  { name: "Mobile (iPhone XR/11)", width: 414, height: 896 },
  { name: "Mobile Landscape", width: 844, height: 390 },
  { name: "Tablet Portrait (iPad Mini)", width: 768, height: 1024 },
  { name: "Tablet Portrait (iPad Air)", width: 820, height: 1180 },
  { name: "Small Laptop (iPad Land / 1024)", width: 1024, height: 768 },
  { name: "Laptop 720p (1280x720)", width: 1280, height: 720 },
  { name: "Laptop 13\" (1280x800)", width: 1280, height: 800 },
  { name: "Standard PC Laptop (1366x768)", width: 1366, height: 768 },
  { name: "Laptop 15\" (1440x900)", width: 1440, height: 900 },
  { name: "Surface / 125% Laptop (1536x864)", width: 1536, height: 864 },
  { name: "Desktop 1080p (1920x1080)", width: 1920, height: 1080 },
  { name: "Desktop QHD (2560x1440)", width: 2560, height: 1440 },
  { name: "Desktop 200% Zoom (Simulated 960x540)", width: 960, height: 540 }
];

async function runAudit() {
  console.log("=== KINGDOM OF CODE: V16 LUXURY GRAPHITE & SUNSHINE AUDIT ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();

  // 1. Initial Page Load and Typography / Token Verification
  console.log("\n[1] Verifying Design System Tokens & Typography at 1920x1080...");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const tokens = await page.evaluate(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    return {
      bgPrimary: computed.getPropertyValue("--bg-primary").trim(),
      bgDarker: computed.getPropertyValue("--bg-darker").trim(),
      bgSurface: computed.getPropertyValue("--bg-surface").trim(),
      textPrimary: computed.getPropertyValue("--text-primary").trim(),
      textSecondary: computed.getPropertyValue("--text-secondary").trim(),
      accentSunshine: computed.getPropertyValue("--accent-sunshine").trim(),
      borderGraphite: computed.getPropertyValue("--border-graphite").trim(),
      fontDisplay: computed.getPropertyValue("--font-display").trim(),
      fontBody: computed.getPropertyValue("--font-body").trim(),
      fontTechnical: computed.getPropertyValue("--font-technical").trim(),
      fontRetro: computed.getPropertyValue("--font-retro").trim()
    };
  });
  console.log("CSS Design Tokens:", tokens);

  const typography = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h2 = document.querySelector("h2");
    const bodyP = document.querySelector("p");
    const eyebrow = document.querySelector(".eyebrow");
    return {
      h1Font: h1 ? getComputedStyle(h1).fontFamily : "none",
      h1Weight: h1 ? getComputedStyle(h1).fontWeight : "none",
      h2Font: h2 ? getComputedStyle(h2).fontFamily : "none",
      h2Weight: h2 ? getComputedStyle(h2).fontWeight : "none",
      bodyFont: bodyP ? getComputedStyle(bodyP).fontFamily : "none",
      eyebrowFont: eyebrow ? getComputedStyle(eyebrow).fontFamily : "none"
    };
  });
  console.log("Computed Element Typography:", typography);

  // 2. Multi-Viewport Responsive Overflow Audit
  console.log("\n[2] Multi-Viewport Responsive Overflow Audit (16 Viewports)...");
  const overflowResults = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(500);

    const docMetrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
      const clientW = window.innerWidth;
      const sections = Array.from(document.querySelectorAll("section[id], .section, .chamber, .forge-section, .awards-section")).map(s => ({
        id: s.id || s.className.split(" ")[0],
        scrollWidth: s.scrollWidth,
        clientWidth: s.clientWidth,
        overflow: s.scrollWidth > s.clientWidth + 1
      }));
      return {
        scrollW,
        clientW,
        hasDocOverflow: scrollW > clientW,
        diff: scrollW - clientW,
        sectionsWithOverflow: sections.filter(s => s.overflow)
      };
    });

    const passed = !docMetrics.hasDocOverflow;
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): ${passed ? "PASS (0 overflow)" : "FAIL (+ " + docMetrics.diff + "px)"}`);
    overflowResults.push({
      ...vp,
      ...docMetrics,
      passed
    });
  }

  // 3. Section 03 (Skills) 3D Alignment & Mobile Flow Verification
  console.log("\n[3] Testing Section 03 (Skills) 3D Alignment & Flow...");
  // Test desktop 3 regions at 1366x768
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE_URL}#skills`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const desktopSkillsMetrics = await page.evaluate(() => {
    const grid = document.querySelector(".forge-main-grid");
    const leftHud = document.querySelector(".forge-left-hud");
    const stage = document.querySelector(".forge-stage");
    const rightHud = document.querySelector(".forge-right-hud");
    return {
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : "none",
      leftHudW: leftHud ? leftHud.offsetWidth : 0,
      stageW: stage ? stage.offsetWidth : 0,
      rightHudW: rightHud ? rightHud.offsetWidth : 0
    };
  });
  console.log("Desktop Skills 3-Region Layout at 1366px:", desktopSkillsMetrics);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_laptop_1366_skills.png") });

  // Test mobile flow at 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}#skills`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_mobile_390_skills.png") });

  // Test small mobile at 320x568
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(`${BASE_URL}#skills`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_small_mobile_320_skills.png") });

  // 4. Section 06 (Hall of Honor) 3D Alignment & Trophies Verification
  console.log("\n[4] Testing Section 06 (Hall of Honor) 3D Alignment & Trophies...");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE_URL}#achievements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_desktop_1920_hall.png") });

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE_URL}#achievements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_laptop_1366_hall.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}#achievements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_mobile_390_hall_of_honor.png") });

  // 5. Section 08 (Intelligence Vault) Laptop Tabs & Flow Verification
  console.log("\n[5] Testing Section 08 (Intelligence Vault) Laptop Tabs & Flow...");
  // Test at 1024x768 (Laptop with tabs)
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${BASE_URL}#vault-trials`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const vaultTabsExist = await page.evaluate(() => {
    const tabs = document.querySelector(".vault-tabs");
    const buttons = document.querySelectorAll(".vault-tab-btn");
    const activeChallenge = document.querySelector(".challenge.tab-active");
    const inactiveChallenges = document.querySelectorAll(".challenge.tab-inactive");
    return {
      hasTabs: !!tabs,
      tabCount: buttons.length,
      activeChallengeHeading: activeChallenge ? activeChallenge.querySelector("h3")?.innerText : "none",
      inactiveCount: inactiveChallenges.length
    };
  });
  console.log("Vault Tabs at 1024px Laptop:", vaultTabsExist);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_laptop_1024_vault_tabs.png") });

  // Test at 1280x800
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_laptop_1280_vault.png") });

  // Test at 1366x768
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_laptop_1366_vault.png") });

  // Test at tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_tablet_768_vault.png") });

  // Test at mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_mobile_390_vault.png") });

  // 6. Complete End-to-End Vault Unlocking & Reveal Test
  console.log("\n[6] Testing End-to-End Vault Unlocking Flow...");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${BASE_URL}#vault-trials`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Challenge 1: Scan
  console.log("  Executing Challenge 1 (OCR Sweep)...");
  await page.evaluate(() => {
    const slider = document.querySelector("#scanner");
    if (slider) {
      slider.value = "100";
      slider.dispatchEvent(new Event("change", { bubbles: true }));
      slider.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await page.waitForTimeout(600);

  // Switch to Tab 2
  console.log("  Switching to Challenge 2 (Reasoning RAG)...");
  await page.click("#vault-tab-1");
  await page.waitForTimeout(400);

  // Trigger RAG pipeline
  await page.click(".rag-action-btn");
  await page.waitForTimeout(3000); // Wait for 4 stages (550ms each)

  // Switch to Tab 3
  console.log("  Switching to Challenge 3 (Decentralized Consensus)...");
  await page.click("#vault-tab-2");
  await page.waitForTimeout(400);

  // Connect nodes 0-1, 1-2, 2-3
  await page.evaluate(() => {
    const buttons = document.querySelectorAll(".network-board .node-button");
    if (buttons.length >= 4) {
      // 0 to 1
      buttons[0].click();
      buttons[1].click();
      // 1 to 2
      buttons[1].click();
      buttons[2].click();
      // 2 to 3
      buttons[2].click();
      buttons[3].click();
    }
  });
  await page.waitForTimeout(800);

  // Check if all 3 keys are unlocked
  const keysState = await page.evaluate(() => {
    const reveal = document.querySelector(".vault-reveal");
    const unlocked = reveal?.classList.contains("unlocked");
    const superpowerHeading = reveal?.querySelector(".superpower-heading")?.innerText;
    return { unlocked, superpowerHeading };
  });
  console.log("Vault Unlocking State:", keysState);

  // Capture Desktop 1920 Reveal & Hero Screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_desktop_1920_vault_reveal.png") });

  await page.goto(`${BASE_URL}#home`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_desktop_1920_hero.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}#home`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_mobile_390_home.png") });

  await browser.close();
  console.log("\n=== AUDIT COMPLETE ===");
  return { tokens, typography, overflowResults, vaultTabsExist, keysState };
}

runAudit().then(res => {
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, "v16_audit_results.json"),
    JSON.stringify(res, null, 2)
  );
  console.log("Saved audit results to artifact directory.");
}).catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});

