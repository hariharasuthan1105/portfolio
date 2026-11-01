import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.getElementById("achievements")?.scrollIntoView();
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "screenshots/current_hall_of_honor_before.png" });
  await browser.close();
  console.log("Captured current_hall_of_honor_before.png");
}

run().catch(console.error);
