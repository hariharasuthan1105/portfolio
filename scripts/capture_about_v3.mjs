import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../screenshots/about_cinematic_v3");
fs.mkdirSync(OUT_DIR, { recursive: true });

const viewports = [
  { name: "desktop_1536x1024", width: 1536, height: 1024 },
  { name: "laptop_1366x768", width: 1366, height: 768 },
  { name: "mobile_390x844", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });

  try { await page.click("button.skip-intro-btn", { timeout: 5000 }); } catch {}
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(3500);

  const screenshotPath = path.join(OUT_DIR, `${vp.name}_about.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log("Captured: " + screenshotPath);
  await page.close();
}

await browser.close();
console.log("All screenshots captured.");
