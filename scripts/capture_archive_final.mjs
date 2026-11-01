import { chromium } from "playwright";
import fs from "fs";

const outDir = "screenshots/archive_final";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log("Launching Chromium for comprehensive Section 04 Archive testing...");
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // DESKTOP TESTING (1536 x 1024)
  // -------------------------------------------------------------
  const desktopContext = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(2500);

  const projectsElem = await desktopPage.$("#projects");
  if (projectsElem) {
    await projectsElem.scrollIntoViewIfNeeded();
  }
  await desktopPage.waitForTimeout(1200);

  // A. Default gallery (No project selected, 3 exhibits visible, pedestals aligned, prompt visible)
  await desktopPage.screenshot({
    path: `${outDir}/A_desktop_1536_default_gallery.png`,
  });
  console.log("Captured: A_desktop_1536_default_gallery.png");

  // B. DocRecon selected (Click plaque 0)
  await desktopPage.click(".pedestal-plaque-btn.plaque-0");
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({
    path: `${outDir}/B_desktop_1536_docrecon_selected.png`,
  });
  console.log("Captured: B_desktop_1536_docrecon_selected.png");

  // C. Pathway AI selected (Click plaque 1)
  await desktopPage.click(".pedestal-plaque-btn.plaque-1");
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({
    path: `${outDir}/C_desktop_1536_pathway_selected.png`,
  });
  console.log("Captured: C_desktop_1536_pathway_selected.png");

  // D. HEFIN selected (Click plaque 2)
  await desktopPage.click(".pedestal-plaque-btn.plaque-2");
  await desktopPage.waitForTimeout(1200);
  await desktopPage.screenshot({
    path: `${outDir}/D_desktop_1536_hefin_selected.png`,
  });
  console.log("Captured: D_desktop_1536_hefin_selected.png");

  // Close details via close button
  await desktopPage.click(".panel-close-text-btn");
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({
    path: `${outDir}/E_desktop_1536_closed_restored.png`,
  });
  console.log("Captured: E_desktop_1536_closed_restored.png");

  await desktopContext.close();

  // -------------------------------------------------------------
  // LAPTOP TESTING (1366 x 768)
  // -------------------------------------------------------------
  const laptopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
  });
  const laptopPage = await laptopContext.newPage();
  await laptopPage.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await laptopPage.waitForTimeout(2000);
  const lProjects = await laptopPage.$("#projects");
  if (lProjects) await lProjects.scrollIntoViewIfNeeded();
  await laptopPage.waitForTimeout(1000);

  await laptopPage.screenshot({
    path: `${outDir}/F_laptop_1366_default_gallery.png`,
  });
  console.log("Captured: F_laptop_1366_default_gallery.png");

  await laptopPage.click(".pedestal-plaque-btn.plaque-1");
  await laptopPage.waitForTimeout(1000);
  await laptopPage.screenshot({
    path: `${outDir}/G_laptop_1366_pathway_selected.png`,
  });
  console.log("Captured: G_laptop_1366_pathway_selected.png");

  await laptopContext.close();

  // -------------------------------------------------------------
  // MOBILE TESTING (390 x 844)
  // -------------------------------------------------------------
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(2000);
  const mProjects = await mobilePage.$("#projects");
  if (mProjects) await mProjects.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);

  // Mobile default
  await mobilePage.screenshot({
    path: `${outDir}/H_mobile_390_default.png`,
  });
  console.log("Captured: H_mobile_390_default.png");

  // Mobile toggle details
  await mobilePage.click(".mobile-details-toggle");
  await mobilePage.waitForTimeout(800);
  const mPanel = await mobilePage.$(".archive-expanded-panel");
  if (mPanel) await mPanel.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: `${outDir}/I_mobile_390_docrecon_expanded.png`,
  });
  console.log("Captured: I_mobile_390_docrecon_expanded.png");

  // Next exhibit (Pathway AI)
  await mobilePage.click(".mobile-nav-arrow.next");
  await mobilePage.waitForTimeout(800);
  if (mPanel) await mPanel.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: `${outDir}/J_mobile_390_pathway_expanded.png`,
  });
  console.log("Captured: J_mobile_390_pathway_expanded.png");

  await mobileContext.close();
  await browser.close();
  console.log("All visual states captured successfully!");
}

capture().catch((err) => {
  console.error("Error in capture:", err);
  process.exit(1);
});
