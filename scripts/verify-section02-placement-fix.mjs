import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "screenshots/section02_placement_fix";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const videoDir = path.join(outDir, "video");
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

async function run() {
  console.log("Starting Section 02 Critical 3D Placement Fix Verification...");
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "01_desktop_1920x1080.png", width: 1920, height: 1080 },
    { name: "02_desktop_1536x1024.png", width: 1536, height: 1024 },
    { name: "03_laptop_1366x768.png", width: 1366, height: 768 },
    { name: "04_tablet_1024x768.png", width: 1024, height: 768 },
    { name: "05_tablet_768x1024.png", width: 768, height: 1024 },
    { name: "06_mobile_390x844.png", width: 390, height: 844 },
    { name: "07_mobile_320x568.png", width: 320, height: 568 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const aboutEl = await page.$("#about");
    if (aboutEl) {
      await aboutEl.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(outDir, vp.name) });
    console.log(`Captured: ${vp.name}`);
    await context.close();
  }

  // Isolated 3D Center Scene (?isolate=about3d)
  {
    const context = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/?isolate=about3d#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const aboutEl = await page.$("#about");
    if (aboutEl) await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "08_isolated_center_3d_scene.png") });
    console.log("Captured: 08_isolated_center_3d_scene.png");
    await context.close();
  }

  // Debug World-Space Axes & Ground Plane (?debug=about)
  {
    const context = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/?debug=about#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const aboutEl = await page.$("#about");
    if (aboutEl) await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "09_debug_world_axes_scene.png") });
    console.log("Captured: 09_debug_world_axes_scene.png");
    await context.close();
  }

  // Hover Interaction State
  {
    const context = await browser.newContext({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const aboutEl = await page.$("#about");
    if (aboutEl) await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Hover over 01 CURIOSITY card
    const cards = await page.$$(".about-value-card");
    if (cards.length > 0) {
      await cards[0].hover();
      await page.waitForTimeout(1200);
    }
    await page.screenshot({ path: path.join(outDir, "10_value_card_hover_interaction.png") });
    console.log("Captured: 10_value_card_hover_interaction.png");
    await context.close();
  }

  // Video Demonstration Recording
  {
    console.log("Recording video demonstration of rotations and interactions...");
    const videoContext = await browser.newContext({
      viewport: { width: 1536, height: 864 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: videoDir,
        size: { width: 1536, height: 864 },
      },
    });
    const page = await videoContext.newPage();
    await page.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const aboutEl = await page.$("#about");
    if (aboutEl) await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Observe smooth continuous crystal and platform rotation
    await page.waitForTimeout(3000);

    // Hover sequentially over the three cards
    const cards = await page.$$(".about-value-card");
    if (cards.length >= 3) {
      await cards[0].hover();
      await page.waitForTimeout(1500);
      await cards[1].hover();
      await page.waitForTimeout(1500);
      await cards[2].hover();
      await page.waitForTimeout(1500);
    }

    // Click on crystal to trigger activation pulse
    const canvasEl = await page.$(".about-platform-canvas");
    if (canvasEl) {
      const box = await canvasEl.boundingBox();
      if (box) {
        // Click upper center of canvas where crystal sits
        await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.32);
        await page.waitForTimeout(2500);
      }
    }

    await videoContext.close();
    console.log(`Video recorded in: ${videoDir}`);
  }

  await browser.close();
  console.log("All Section 02 verification steps completed successfully!");
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
