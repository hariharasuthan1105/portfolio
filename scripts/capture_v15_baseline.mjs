import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASELINE_DIR = path.resolve("portfolio-main/screenshots/v15_baseline");
if (!fs.existsSync(BASELINE_DIR)) {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop_1920x1080", width: 1920, height: 1080 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "mobile_390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "mobile_320x568", width: 320, height: 568, isMobile: true, hasTouch: true }
];

const SECTIONS = ["home", "about", "skills", "projects", "experience", "achievements", "contact", "vault"];

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const vp of VIEWPORTS) {
    console.log(`Auditing Viewport: ${vp.name}...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.hasTouch,
    });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#skills", { timeout: 10000 });
    await page.waitForTimeout(500);

    // Home shot
    await page.screenshot({ path: path.join(BASELINE_DIR, `${vp.name}_01_home.png`) });
    console.log(`  Saved ${vp.name}_01_home.png`);

    // Capture each section
    for (const sec of SECTIONS) {
      if (sec === "home") continue;
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "instant" });
      }, sec);
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(BASELINE_DIR, `${vp.name}_sec_${sec}.png`) });
      console.log(`  Saved ${vp.name}_sec_${sec}.png`);
    }
    await page.close();
  }
  await browser.close();
  console.log("Baseline capture complete!");
}

main().catch(console.error);
