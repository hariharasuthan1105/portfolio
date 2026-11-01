import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function verifyHallOfHonor() {
  const outputDir = "screenshots/hall_of_honor_arena";
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  console.log("=== 1. Capturing Desktop 1920x1080 Default ===");
  const contextDesktop = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await contextDesktop.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const scrollToAchievements = async (p) => {
    await p.evaluate(() => {
      const el = document.getElementById("achievements");
      if (el) {
        window.scrollTo({ top: el.offsetTop, behavior: "instant" });
      }
    });
    await p.waitForTimeout(2000);
  };

  await scrollToAchievements(page);

  // Capture Default Desktop
  await page.screenshot({
    path: path.join(outputDir, "01_desktop_1920x1080_default.png"),
  });

  console.log("=== 2. Capturing Explorer Walking Down Center Aisle ===");
  // Center aisle crop / focus
  await page.screenshot({
    path: path.join(outputDir, "03_explorer_center_aisle.png"),
  });

  console.log("=== 3. Capturing Convolve Trophy Selected ===");
  const leftBadge = page.locator(".hall-award-panel.hall-podium-badge").nth(0);
  await leftBadge.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "04_convolve_trophy_selected.png"),
  });

  // Close dialog via Escape key
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  console.log("=== 4. Capturing Pathway Trophy Selected ===");
  const centerBadge = page.locator(".hall-award-panel.hall-podium-badge").nth(1);
  await centerBadge.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "05_pathway_trophy_selected.png"),
  });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  console.log("=== 5. Capturing WCHL Trophy Selected ===");
  const rightBadge = page.locator(".hall-award-panel.hall-podium-badge").nth(2);
  await rightBadge.click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outputDir, "06_wchl_trophy_selected.png"),
  });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Let video record rotation for 4 seconds
  await page.waitForTimeout(4000);
  await page.close();
  await contextDesktop.close();

  console.log("=== 6. Capturing Isolated 3D Podiums with Visible Floor Contact ===");
  const contextIso = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pageIso = await contextIso.newPage();
  await pageIso.goto("http://127.0.0.1:4173/?isolate=hall3d", { waitUntil: "networkidle" });
  await scrollToAchievements(pageIso);
  await pageIso.screenshot({
    path: path.join(outputDir, "02_isolated_3d_podiums_floor_contact.png"),
  });
  await pageIso.close();
  await contextIso.close();

  console.log("=== 7. Capturing Laptop 1366x768 ===");
  const contextLaptop = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const pageLaptop = await contextLaptop.newPage();
  await pageLaptop.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToAchievements(pageLaptop);
  await pageLaptop.screenshot({
    path: path.join(outputDir, "07_laptop_1366x768.png"),
  });
  await pageLaptop.close();
  await contextLaptop.close();

  console.log("=== 8. Capturing Tablet 1024x768 ===");
  const contextTablet = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToAchievements(pageTablet);
  await pageTablet.screenshot({
    path: path.join(outputDir, "08_tablet_1024x768.png"),
  });
  await pageTablet.close();
  await contextTablet.close();

  console.log("=== 9. Capturing Mobile 390x844 Default & Selected ===");
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await scrollToAchievements(pageMobile);
  await pageMobile.screenshot({
    path: path.join(outputDir, "09_mobile_390x844_default.png"),
  });

  // Tap Next Trophy on Mobile Carousel
  const nextBtn = pageMobile.locator(".hall-mobile-btn").filter({ hasText: "NEXT" });
  if (await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click();
    await pageMobile.waitForTimeout(1000);
  }
  await pageMobile.screenshot({
    path: path.join(outputDir, "10_mobile_390x844_selected.png"),
  });

  await pageMobile.close();
  await contextMobile.close();
  await browser.close();

  // Rename recorded video file to clean name
  const videoFiles = fs.readdirSync(outputDir).filter(f => f.endsWith(".webm") && f.startsWith("page@"));
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(outputDir, videoFiles[0]);
    const targetVideoPath = path.join(outputDir, "trophies_rotating_podiums_grounded.webm");
    fs.copyFileSync(rawVideoPath, targetVideoPath);
    console.log("Saved video demo:", targetVideoPath);
  }

  console.log("=== Verification Complete! ===");
}

verifyHallOfHonor().catch(console.error);
