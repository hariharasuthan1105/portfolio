import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/hariharasuthan/.gemini/antigravity-ide/brain/4c508dfd-9fea-4281-bc39-8f8843303c1c";
const OUTPUT_DIR = "screenshots/about_enhancements";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1536x1024
  console.log("Capturing Desktop 1536x1024...");
  const desktopContext = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(3000);

  // Scroll to #about exactly
  const aboutSection = desktopPage.locator("#about");
  await aboutSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(2000);

  // Desktop Full Section Screenshot
  const desktopPath = path.join(OUTPUT_DIR, "desktop_1536x1024_about_section.png");
  await desktopPage.screenshot({ path: desktopPath });
  fs.copyFileSync(desktopPath, path.join(ARTIFACT_DIR, "desktop_about.png"));
  console.log("Saved desktop screenshot.");

  // Hover over concept card 1 to trigger active glow and connecting circuits
  const concept1 = desktopPage.locator(".concept-card").first();
  await concept1.hover();
  await desktopPage.waitForTimeout(1000);

  const desktopHoverPath = path.join(OUTPUT_DIR, "desktop_1536x1024_about_hover_active.png");
  await desktopPage.screenshot({ path: desktopHoverPath });
  fs.copyFileSync(desktopHoverPath, path.join(ARTIFACT_DIR, "desktop_about_hover.png"));
  console.log("Saved desktop hover active screenshot.");

  // Rotating Floor Platform Focal Screenshot
  // Clip around center dais: x: 500 to 1036, y: 550 to 980
  const floorDetailPath = path.join(OUTPUT_DIR, "rotating_floor_platform_detail.png");
  await desktopPage.screenshot({
    path: floorDetailPath,
    clip: { x: 450, y: 520, width: 636, height: 460 },
  });
  fs.copyFileSync(floorDetailPath, path.join(ARTIFACT_DIR, "floor_detail.png"));
  console.log("Saved rotating floor detail screenshot.");

  await desktopContext.close();

  // 2. Mobile 390x844
  console.log("Capturing Mobile 390x844...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(3000);

  const mobileAbout = mobilePage.locator("#about");
  await mobileAbout.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(2000);

  const mobilePath = path.join(OUTPUT_DIR, "mobile_390x844_about_section.png");
  await mobilePage.screenshot({ path: mobilePath });
  fs.copyFileSync(mobilePath, path.join(ARTIFACT_DIR, "mobile_about.png"));
  console.log("Saved mobile screenshot.");

  await mobileContext.close();
  await browser.close();
  console.log("All screenshots captured successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
