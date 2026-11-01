import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(process.cwd(), "screenshots/about_sanctum_final");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: "01_large_desktop_1920x1080", width: 1920, height: 1080 },
  { name: "02_standard_desktop_1536x1024", width: 1536, height: 1024 },
  { name: "03_laptop_1366x768", width: 1366, height: 768 },
  { name: "04_tablet_landscape_1024x768", width: 1024, height: 768 },
  { name: "05_tablet_portrait_768x1024", width: 768, height: 1024 },
  { name: "06_mobile_390x844", width: 390, height: 844 },
  { name: "07_small_mobile_320x568", width: 320, height: 568 },
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("=== CAPTURING SECTION 02 RESPONSIVE SCREENS ===");
  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    });
    // Wait for Three.js render and animation loop
    await page.waitForTimeout(2500);

    const filePath = path.join(outDir, `${vp.name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`Saved ${vp.name} to ${filePath}`);

    await page.close();
  }

  // Capture Isolated 3D Objects Render against plain dark background
  console.log("=== CAPTURING ISOLATED 3D OBJECTS RENDER ===");
  {
    const page = await browser.newPage({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    await page.goto("http://127.0.0.1:4173/?isolate=about3d", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(3000);

    const isolatedPath = path.join(outDir, "08_isolated_3d_geometry_render.png");
    await page.screenshot({ path: isolatedPath, fullPage: false });
    console.log(`Saved isolated 3D render to ${isolatedPath}`);
    await page.close();
  }

  // Capture Hover / Value Card Active Glow
  console.log("=== CAPTURING VALUE CARD HOVER ACTIVATION ===");
  {
    const page = await browser.newPage({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(2000);

    const card = await page.$(".about-value-card");
    if (card) {
      await card.hover();
      await page.waitForTimeout(800);
      const hoverPath = path.join(outDir, "09_desktop_value_card_hover.png");
      await page.screenshot({ path: hoverPath, fullPage: false });
      console.log(`Saved hover state to ${hoverPath}`);
    }
    await page.close();
  }

  // Capture Crystal Click Activation
  console.log("=== CAPTURING CRYSTAL CLICK ACTIVATION ===");
  {
    const page = await browser.newPage({
      viewport: { width: 1536, height: 1024 },
      deviceScaleFactor: 1,
    });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(2000);

    const canvas = await page.$(".about-platform-canvas");
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.38);
        await page.waitForTimeout(450); // During activation pulse
        const clickPath = path.join(outDir, "10_crystal_click_activation_pulse.png");
        await page.screenshot({ path: clickPath, fullPage: false });
        console.log(`Saved click activation state to ${clickPath}`);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log("=== ALL CAPTURES COMPLETED SUCCESSFULLY ===");
})();
