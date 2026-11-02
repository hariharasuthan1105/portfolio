import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("screenshots/restored_homepage");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureRestoredHomepage() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "01_restored_desktop_1920x1080", width: 1920, height: 1080 },
    { name: "02_restored_desktop_1536x1024", width: 1536, height: 1024 },
    { name: "03_restored_laptop_1366x768", width: 1366, height: 768 },
    { name: "04_restored_mobile_390x844", width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    // Wait 2.5s for WebGL textures (hero-citadel-archers.webp + depth) to load and render
    await page.waitForTimeout(2500);

    const outPath = path.join(OUTPUT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${outPath} (${vp.width}x${vp.height})`);

    // In 1920x1080, also capture portal hover and audio toggle
    if (vp.width === 1920) {
      // Hover portal
      await page.mouse.move(960, 540);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "01B_portal_hover_state.png") });
    }

    await context.close();
  }

  await browser.close();
  console.log("Restored homepage capture complete!");
}

captureRestoredHomepage().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
