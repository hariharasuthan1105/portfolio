import { chromium } from "playwright";
import path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#skills");
  await page.waitForTimeout(1000);

  // 1. Capture Skills section
  await page.evaluate(() => {
    const el = document.getElementById("skills");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.resolve("portfolio-main/screenshots/skills_fixed_mobile_390.png") });
  console.log("Saved skills_fixed_mobile_390.png");

  // 2. Open drawer and capture
  const menuBtn = await page.$(".menu-toggle");
  if (menuBtn) {
    await menuBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.resolve("portfolio-main/screenshots/navigation_drawer_mobile_390.png") });
    console.log("Saved navigation_drawer_mobile_390.png");
  }

  await browser.close();
}

main().catch(console.error);

