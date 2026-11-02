import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function verifyGothicPortraitGallery() {
  const outputDir = "screenshots/gothic_portrait_gallery";
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  console.log("=== 1. Desktop 1920x1080 Default & Video Recording ===");
  const contextDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await contextDesktop.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  const scrollToProjects = async (p) => {
    await p.evaluate(() => {
      const el = document.getElementById("projects");
      if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
    });
    await p.waitForTimeout(2000);
  };

  await scrollToProjects(page);

  // 1. Capture 1920x1080 Default
  await page.screenshot({
    path: path.join(outputDir, "01_desktop_1920x1080_default.png"),
  });
  console.log("Captured 01_desktop_1920x1080_default.png");

  // 2. Hover over DocRecon portrait
  console.log("=== 2. Hovering over DocRecon portrait ===");
  const docReconFrame = page.locator(".station-docrecon .gothic-frame-assembly");
  await docReconFrame.hover();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outputDir, "02_desktop_1920x1080_docrecon_hover.png"),
  });
  console.log("Captured 02_desktop_1920x1080_docrecon_hover.png");

  // 3. Click Pathway AI to open details panel
  console.log("=== 3. Clicking Pathway AI (Center) to open specifications ===");
  const pathwayCta = page.locator(".station-pathway .plaque-view-cta");
  await pathwayCta.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "03_desktop_1920x1080_pathway_details_open.png"),
  });
  console.log("Captured 03_desktop_1920x1080_pathway_details_open.png");

  // 4. Click HEFIN to switch specifications
  console.log("=== 4. Clicking HEFIN to switch specifications ===");
  const hefinCta = page.locator(".station-hefin .plaque-view-cta");
  await hefinCta.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "04_desktop_1920x1080_hefin_details_open.png"),
  });
  console.log("Captured 04_desktop_1920x1080_hefin_details_open.png");

  // 5. Close specifications panel
  const closeBtn = page.locator(".specs-close-btn");
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(600);
  }

  // Record 5 seconds of the cathedral flags waving and soft lighting
  console.log("Recording waving banners and atmospheric lighting...");
  await page.waitForTimeout(5000);

  await page.close();
  await contextDesktop.close();

  // 6. Viewport: 1536x1024
  console.log("=== 5. Viewport 1536x1024 ===");
  const ctx1536 = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  const page1536 = await ctx1536.newPage();
  await page1536.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToProjects(page1536);
  await page1536.screenshot({
    path: path.join(outputDir, "05_desktop_1536x1024.png"),
  });
  console.log("Captured 05_desktop_1536x1024.png");
  await page1536.close();
  await ctx1536.close();

  // 7. Viewport: 1366x768
  console.log("=== 6. Viewport 1366x768 (Laptop) ===");
  const ctx1366 = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page1366 = await ctx1366.newPage();
  await page1366.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToProjects(page1366);
  await page1366.screenshot({
    path: path.join(outputDir, "06_laptop_1366x768.png"),
  });
  console.log("Captured 06_laptop_1366x768.png");
  await page1366.close();
  await ctx1366.close();

  // 8. Viewport: 768x1024 (Tablet)
  console.log("=== 7. Viewport 768x1024 (Tablet) ===");
  const ctx768 = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page768 = await ctx768.newPage();
  await page768.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToProjects(page768);
  await page768.screenshot({
    path: path.join(outputDir, "07_tablet_768x1024.png"),
  });
  console.log("Captured 07_tablet_768x1024.png");
  await page768.close();
  await ctx768.close();

  // 9. Viewport: 390x844 (Mobile)
  console.log("=== 8. Viewport 390x844 (Mobile) ===");
  const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page390 = await ctx390.newPage();
  await page390.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToProjects(page390);
  await page390.screenshot({
    path: path.join(outputDir, "08_mobile_390x844_default.png"),
  });
  console.log("Captured 08_mobile_390x844_default.png");

  // Click Next arrow on mobile
  const nextBtn = page390.locator(".mobile-gallery-arrow.next");
  if (await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click();
    await page390.waitForTimeout(600);
    await page390.screenshot({
      path: path.join(outputDir, "09_mobile_390x844_next_portrait.png"),
    });
    console.log("Captured 09_mobile_390x844_next_portrait.png");
  }
  await page390.close();
  await ctx390.close();

  // 10. Viewport: 320x568 (Compact Mobile)
  console.log("=== 9. Viewport 320x568 (Compact Mobile) ===");
  const ctx320 = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true });
  const page320 = await ctx320.newPage();
  await page320.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToProjects(page320);
  await page320.screenshot({
    path: path.join(outputDir, "10_mobile_320x568.png"),
  });
  console.log("Captured 10_mobile_320x568.png");
  await page320.close();
  await ctx320.close();

  await browser.close();

  // Clean and save recorded video
  const videoFiles = fs.readdirSync(outputDir).filter(f => f.endsWith(".webm") && f.startsWith("page@"));
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(outputDir, videoFiles[0]);
    const targetVideoPath = path.join(outputDir, "gothic_portrait_gallery_demo.webm");
    fs.copyFileSync(rawVideoPath, targetVideoPath);
    console.log("Saved video demo to:", targetVideoPath);
    try { fs.unlinkSync(rawVideoPath); } catch(e) {}
  }

  console.log("=== All Gothic Portrait Gallery Verifications Complete! ===");
}

verifyGothicPortraitGallery().catch(console.error);
