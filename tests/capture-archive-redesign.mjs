import { chromium } from "playwright";
import fs from "fs";

async function captureArchive() {
  const outDir = "screenshots/archive_redesign";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1536x1024
  const desktopContext = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    deviceScaleFactor: 1,
  });
  const page = await desktopContext.newPage();
  await page.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle", timeout: 35000 });
  await page.waitForTimeout(2500);

  const projectsSec = page.locator("#projects");
  await projectsSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  // Capture default desktop 1536x1024
  await page.screenshot({
    path: `${outDir}/archive_desktop_1536x1024_default.png`,
    fullPage: false,
  });
  console.log("Captured archive_desktop_1536x1024_default.png");

  // Hover over Card 1 (DocRecon)
  const card1 = page.locator(".archive-exhibit-card").nth(0);
  if (await card1.isVisible()) {
    await card1.hover();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${outDir}/archive_desktop_1536x1024_card1_hover.png`,
      fullPage: false,
    });
    console.log("Captured archive_desktop_1536x1024_card1_hover.png");
  }

  // Hover over Card 2 (Pathway AI)
  const card2 = page.locator(".archive-exhibit-card").nth(1);
  if (await card2.isVisible()) {
    await card2.hover();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${outDir}/archive_desktop_1536x1024_card2_hover.png`,
      fullPage: false,
    });
    console.log("Captured archive_desktop_1536x1024_card2_hover.png");
  }

  // Hover over Card 3 (HEFIN)
  const card3 = page.locator(".archive-exhibit-card").nth(2);
  if (await card3.isVisible()) {
    await card3.hover();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${outDir}/archive_desktop_1536x1024_card3_hover.png`,
      fullPage: false,
    });
    console.log("Captured archive_desktop_1536x1024_card3_hover.png");
  }

  // 2. Mobile 390x844
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle", timeout: 35000 });
  await mobilePage.waitForTimeout(2000);

  const mobileProjects = mobilePage.locator("#projects");
  await mobileProjects.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(2000);

  await mobilePage.screenshot({
    path: `${outDir}/archive_mobile_390x844_tab1.png`,
    fullPage: false,
  });
  console.log("Captured archive_mobile_390x844_tab1.png");

  // Click Tab 2 (Pathway AI)
  const tab2 = mobilePage.locator(".archive-mobile-tab").nth(1);
  if (await tab2.isVisible()) {
    await tab2.click();
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({
      path: `${outDir}/archive_mobile_390x844_tab2.png`,
      fullPage: false,
    });
    console.log("Captured archive_mobile_390x844_tab2.png");
  }

  // Click Tab 3 (HEFIN)
  const tab3 = mobilePage.locator(".archive-mobile-tab").nth(2);
  if (await tab3.isVisible()) {
    await tab3.click();
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({
      path: `${outDir}/archive_mobile_390x844_tab3.png`,
      fullPage: false,
    });
    console.log("Captured archive_mobile_390x844_tab3.png");
  }

  await browser.close();
  console.log("Archive redesign capture complete!");
}

captureArchive().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
