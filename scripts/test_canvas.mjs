import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".forge-three-canvas");
  await page.waitForTimeout(2000);

  const canvas = await page.$(".forge-three-canvas");
  if (canvas) {
    await canvas.screenshot({ path: "portfolio-main/screenshots/canvas_only.png" });
    console.log("Saved canvas_only.png");
  }
  await browser.close();
}

main().catch(console.error);

