import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const captures = [
  { name: "section07_before_desktop_1920.png", w: 1920, h: 1080 },
  { name: "section07_before_desktop_1440.png", w: 1440, h: 900 },
  { name: "section07_before_laptop_1366.png", w: 1366, h: 768 },
  { name: "section07_before_tablet_1024.png", w: 1024, h: 768 },
  { name: "section07_before_tablet_768.png", w: 768, h: 1024 },
  { name: "section07_before_mobile_390.png", w: 390, h: 844 },
  { name: "section07_before_small_mobile_320.png", w: 320, h: 568 }
];

async function run() {
  console.log("=== CAPTURING SECTION 07 (CONTACT PORTAL) BEFORE STATE ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#contact", { timeout: 15000 });
  await page.waitForTimeout(1000);

  const baselineData = [];

  for (const c of captures) {
    await page.setViewportSize({ width: c.w, height: c.h });
    await page.evaluate(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const measurements = await page.evaluate(() => {
      const heading = document.querySelector("#contact .portal-main-title") || document.querySelector("#contact .contact-heading");
      const leftZone = document.querySelector("#contact .portal-left-zone");
      const centerZone = document.querySelector("#contact .portal-center-zone");
      const rightZone = document.querySelector("#contact .portal-right-zone");
      const contactCards = Array.from(document.querySelectorAll("#contact .portal-contact-card"));

      const hRect = heading?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };
      const lRect = leftZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };
      const cRect = centerZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };
      const rRect = rightZone?.getBoundingClientRect() || { width: 0, right: 0, left: 0 };

      // Check if heading overflows left zone into center
      const headingOverflowsLeftZone = hRect.right > (lRect.right + 2);
      const headingOverlapsCenter = cRect.width > 0 && hRect.right > cRect.left;

      return {
        headingWidth: Math.round(hRect.width),
        leftZoneWidth: Math.round(lRect.width),
        centerZoneWidth: Math.round(cRect.width),
        rightZoneWidth: Math.round(rRect.width),
        headingOverflowsLeftZone,
        headingOverlapsCenter,
        cardsCount: contactCards.length
      };
    });

    console.log(`[${c.w}x${c.h}] Heading width: ${measurements.headingWidth}px | LeftZone: ${measurements.leftZoneWidth}px | Overflows left zone: ${measurements.headingOverflowsLeftZone} | Overlaps center: ${measurements.headingOverlapsCenter}`);
    baselineData.push({ viewport: `${c.w}x${c.h}`, ...measurements });

    const el = await page.$("#contact");
    if (el) {
      const shotPath = path.join(artifactDir, c.name);
      await el.screenshot({ path: shotPath });
      console.log(`  Saved screenshot: ${shotPath}`);
    }
  }

  const outPath = path.join(artifactDir, "section07_baseline_measurements.json");
  fs.writeFileSync(outPath, JSON.stringify(baselineData, null, 2));
  console.log(`Saved baseline measurements to: ${outPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error("Baseline capture failed:", err);
  process.exit(1);
});
