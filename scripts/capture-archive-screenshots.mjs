import { chromium } from "playwright";
import fs from "fs";

const outDir = "screenshots/archive_redesign";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log("Launching Chromium for comprehensive visual acceptance testing...");
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
  await desktopPage.waitForTimeout(2000);

  const projectsElem = await desktopPage.$("#projects");
  if (projectsElem) {
    await projectsElem.scrollIntoViewIfNeeded();
  }
  await desktopPage.waitForTimeout(1000);

  // 1. Default gallery with no project selected (Desktop State 1: TOP-LEFT)
  await desktopPage.screenshot({
    path: `${outDir}/01_desktop_default_gallery.png`,
  });
  console.log("Captured: 01_desktop_default_gallery.png");

  // Click Exhibit 01 (DocRecon)
  await desktopPage.click(".archive-cta-btn");
  await desktopPage.waitForTimeout(1000);

  // 2. DocRecon selected (Desktop State 2: BOTTOM-LEFT)
  await desktopPage.screenshot({
    path: `${outDir}/02_desktop_docrecon_selected.png`,
  });
  console.log("Captured: 02_desktop_docrecon_selected.png");

  // Raycast click Exhibit 02 (Pathway AI)
  const canvasElem = await desktopPage.$(".archive-three-canvas");
  const canvasBox = await canvasElem.boundingBox();
  if (canvasBox) {
    await desktopPage.mouse.click(canvasBox.x + canvasBox.width * 0.54, canvasBox.y + canvasBox.height * 0.55);
  }
  await desktopPage.waitForTimeout(1000);

  // 3. Pathway AI selected
  await desktopPage.screenshot({
    path: `${outDir}/03_desktop_pathway_selected.png`,
  });
  console.log("Captured: 03_desktop_pathway_selected.png");

  // Raycast click Exhibit 03 (HEFIN)
  if (canvasBox) {
    await desktopPage.mouse.click(canvasBox.x + canvasBox.width * 0.82, canvasBox.y + canvasBox.height * 0.55);
  }
  await desktopPage.waitForTimeout(1000);

  // 4. HEFIN selected
  await desktopPage.screenshot({
    path: `${outDir}/04_desktop_hefin_selected.png`,
  });
  console.log("Captured: 04_desktop_hefin_selected.png");

  await desktopContext.close();

  // -------------------------------------------------------------
  // MOBILE TESTING (390 x 844) — State 3: RIGHT SIDE OF REFERENCE
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
  if (mProjects) {
    await mProjects.scrollIntoViewIfNeeded();
  }
  await mobilePage.waitForTimeout(1000);

  // 5. Mobile default project view (DocRecon active, closed)
  await mobilePage.screenshot({
    path: `${outDir}/05_mobile_default_view.png`,
  });
  console.log("Captured: 05_mobile_default_view.png");

  // 6. DocRecon expanded
  await mobilePage.click(".mobile-details-toggle");
  await mobilePage.waitForTimeout(600);
  // Scroll down slightly so the newly opened details panel is fully in view
  const panelElem = await mobilePage.$(".archive-expanded-panel");
  if (panelElem) {
    await panelElem.scrollIntoViewIfNeeded();
  }
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: `${outDir}/06_mobile_docrecon_expanded.png`,
  });
  console.log("Captured: 06_mobile_docrecon_expanded.png");

  // Navigate to next exhibit (Pathway AI) using carousel arrow ›
  await mobilePage.click(".mobile-nav-arrow.next");
  await mobilePage.waitForTimeout(600);
  if (panelElem) {
    await panelElem.scrollIntoViewIfNeeded();
  }
  await mobilePage.waitForTimeout(600);

  // 7. Pathway AI selected / details expanded
  await mobilePage.screenshot({
    path: `${outDir}/07_mobile_pathway_expanded.png`,
  });
  console.log("Captured: 07_mobile_pathway_expanded.png");

  // Navigate to next exhibit (HEFIN) using carousel arrow ›
  await mobilePage.click(".mobile-nav-arrow.next");
  await mobilePage.waitForTimeout(600);
  if (panelElem) {
    await panelElem.scrollIntoViewIfNeeded();
  }
  await mobilePage.waitForTimeout(600);

  // 8. HEFIN selected / details expanded
  await mobilePage.screenshot({
    path: `${outDir}/08_mobile_hefin_expanded.png`,
  });
  console.log("Captured: 08_mobile_hefin_expanded.png");

  await mobileContext.close();

  console.log("All 8 visual states captured successfully!");
  await browser.close();
}

capture().catch(err => {
  console.error("Error in visual capture:", err);
  process.exit(1);
});
