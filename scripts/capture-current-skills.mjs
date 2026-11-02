import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const el = document.getElementById("skills");
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "screenshots/current_skills_before.png" });
  await browser.close();
  console.log("Captured screenshots/current_skills_before.png");
}

run().catch(console.error);
