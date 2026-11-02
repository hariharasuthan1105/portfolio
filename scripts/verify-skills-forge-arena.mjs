import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function verifySkillsForgeArena() {
  const outputDir = "screenshots/skills_forge_arena";
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  console.log("=== 1. Capturing Desktop 1920x1080 Default & Video Recording ===");
  const contextDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await contextDesktop.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  const scrollToSkills = async (p) => {
    await p.evaluate(() => {
      const el = document.getElementById("skills");
      if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
    });
    await p.waitForTimeout(2200);
  };

  await scrollToSkills(page);

  // 1. Full Desktop Default
  await page.screenshot({
    path: path.join(outputDir, "01_desktop_1920x1080_default.png"),
  });
  console.log("Captured 01_desktop_1920x1080_default.png");

  // 2. Programming globe / category selected
  console.log("=== 2. Selecting Programming Category ===");
  const progBtn = page.locator(".forge-cat-btn").filter({ hasText: "PROGRAMMING" });
  await progBtn.click({ force: true });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "02_programming_globe_selected.png"),
  });
  console.log("Captured 02_programming_globe_selected.png");

  // 3. AI / ML globe / category selected
  console.log("=== 3. Selecting AI / ML Category ===");
  const aimlBtn = page.locator(".forge-cat-btn").filter({ hasText: "AI / ML" });
  await aimlBtn.click({ force: true });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "03_aiml_globe_selected.png"),
  });
  console.log("Captured 03_aiml_globe_selected.png");

  // 4. Databases globe / category selected
  console.log("=== 4. Selecting Databases Category ===");
  const dbBtn = page.locator(".forge-cat-btn").filter({ hasText: "DATABASES" });
  await dbBtn.click({ force: true });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "04_databases_globe_selected.png"),
  });
  console.log("Captured 04_databases_globe_selected.png");

  // 5. Tools & Cloud globe / category selected
  console.log("=== 5. Selecting Tools & Cloud Category ===");
  const toolsBtn = page.locator(".forge-cat-btn").filter({ hasText: "TOOLS & CLOUD" });
  await toolsBtn.click({ force: true });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "05_tools_cloud_globe_selected.png"),
  });
  console.log("Captured 05_tools_cloud_globe_selected.png");

  // Select a subskill capability pill (e.g., Git) to verify capability pill reactivity
  const gitPill = page.locator(".subskill-pill").filter({ hasText: "Git" });
  if (await gitPill.isVisible().catch(() => false)) {
    await gitPill.click({ force: true });
    await page.waitForTimeout(600);
  }

  // Let video record rotation and interaction for 4 seconds
  await page.waitForTimeout(4000);
  await page.close();
  await contextDesktop.close();

  console.log("=== 6. Capturing Isolated 3D Globes & Podiums (?isolate=skills3d) ===");
  const contextIso = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pageIso = await contextIso.newPage();
  await pageIso.goto("http://127.0.0.1:4173/?isolate=skills3d", { waitUntil: "networkidle" });
  await scrollToSkills(pageIso);
  await pageIso.screenshot({
    path: path.join(outputDir, "08_isolated_3d_globes_podiums.png"),
  });
  console.log("Captured 08_isolated_3d_globes_podiums.png");
  await pageIso.close();
  await contextIso.close();

  console.log("=== 7. Capturing Laptop 1366x768 ===");
  const contextLaptop = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const pageLaptop = await contextLaptop.newPage();
  await pageLaptop.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToSkills(pageLaptop);
  await pageLaptop.screenshot({
    path: path.join(outputDir, "09_laptop_1366x768.png"),
  });
  console.log("Captured 09_laptop_1366x768.png");
  await pageLaptop.close();
  await contextLaptop.close();

  console.log("=== 8. Capturing Tablet 1024x768 ===");
  const contextTablet = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToSkills(pageTablet);
  await pageTablet.screenshot({
    path: path.join(outputDir, "10_tablet_1024x768.png"),
  });
  console.log("Captured 10_tablet_1024x768.png");
  await pageTablet.close();
  await contextTablet.close();

  console.log("=== 9. Capturing Mobile 390x844 Default & Selected ===");
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToSkills(pageMobile);
  await pageMobile.screenshot({
    path: path.join(outputDir, "06_mobile_390x844_default.png"),
  });
  console.log("Captured 06_mobile_390x844_default.png");

  // Select AI / ML on mobile
  const mobileAimlBtn = pageMobile.locator(".forge-cat-btn").filter({ hasText: "AI / ML" });
  if (await mobileAimlBtn.isVisible().catch(() => false)) {
    await mobileAimlBtn.click({ force: true });
    await pageMobile.waitForTimeout(800);
  }
  await pageMobile.screenshot({
    path: path.join(outputDir, "07_mobile_category_selected.png"),
  });
  console.log("Captured 07_mobile_category_selected.png");

  await pageMobile.close();
  await contextMobile.close();
  await browser.close();

  // Rename recorded video file to clean name
  const videoFiles = fs.readdirSync(outputDir).filter(f => f.endsWith(".webm") && f.startsWith("page@"));
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(outputDir, videoFiles[0]);
    const targetVideoPath = path.join(outputDir, "skills_forge_arena_demo.webm");
    fs.copyFileSync(rawVideoPath, targetVideoPath);
    console.log("Saved video demo:", targetVideoPath);
    // Remove raw page@ file
    try { fs.unlinkSync(rawVideoPath); } catch(e) {}
  }

  console.log("=== All Verification Captures Complete! ===");
}

verifySkillsForgeArena().catch(console.error);
