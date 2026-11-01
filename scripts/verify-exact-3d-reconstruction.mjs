import { chromium } from "playwright";
import fs from "fs";

const outDir = "screenshots/exact_3d_reconstruction";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function runVerification() {
  console.log("Starting Section 04 Exact 3D Visual Reconstruction Verification...");
  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------------------
  // 1. ISOLATED 3D MODEL DEMONSTRATIONS (Against dark neutral background)
  // -------------------------------------------------------------------------
  console.log("Capturing Isolated 3D Exhibits...");
  const isoContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const isoPage = await isoContext.newPage();

  // Exhibit A: DocRecon Isolated
  await isoPage.goto("http://127.0.0.1:4173/?isolate=docrecon#projects", { waitUntil: "networkidle" });
  await isoPage.waitForTimeout(2500);
  const projEl = await isoPage.$("#projects");
  if (projEl) await projEl.scrollIntoViewIfNeeded();
  await isoPage.waitForTimeout(1000);
  await isoPage.screenshot({ path: `${outDir}/A_DocRecon_Isolated_3D.png` });
  console.log("Captured: A_DocRecon_Isolated_3D.png");

  // Exhibit B: Pathway AI Isolated
  await isoPage.goto("http://127.0.0.1:4173/?isolate=pathway#projects", { waitUntil: "networkidle" });
  await isoPage.waitForTimeout(2000);
  const projElB = await isoPage.$("#projects");
  if (projElB) await projElB.scrollIntoViewIfNeeded();
  await isoPage.waitForTimeout(1000);
  await isoPage.screenshot({ path: `${outDir}/B_PathwayAI_Isolated_3D.png` });
  console.log("Captured: B_PathwayAI_Isolated_3D.png");

  // Exhibit C: HEFIN Isolated
  await isoPage.goto("http://127.0.0.1:4173/?isolate=hefin#projects", { waitUntil: "networkidle" });
  await isoPage.waitForTimeout(2000);
  const projElC = await isoPage.$("#projects");
  if (projElC) await projElC.scrollIntoViewIfNeeded();
  await isoPage.waitForTimeout(1000);
  await isoPage.screenshot({ path: `${outDir}/C_HEFIN_Isolated_3D.png` });
  console.log("Captured: C_HEFIN_Isolated_3D.png");

  await isoContext.close();

  // -------------------------------------------------------------------------
  // 2. DESKTOP 1920x1080 (16:9 REFERENCE ASPECT RATIO)
  // -------------------------------------------------------------------------
  console.log("Capturing Desktop 1920x1080 (16:9 Reference Framing)...");
  const d1920Context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page1920 = await d1920Context.newPage();
  await page1920.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await page1920.waitForTimeout(3000);
  const p1920 = await page1920.$("#projects");
  if (p1920) await p1920.scrollIntoViewIfNeeded();
  await page1920.waitForTimeout(1500);

  // Default state: 3 exhibits on circular gothic pedestals, cathedral background, SELECT AN EXHIBIT prompt
  await page1920.screenshot({ path: `${outDir}/D_Desktop_1920x1080_Default_Gallery.png` });
  console.log("Captured: D_Desktop_1920x1080_Default_Gallery.png");

  // Click DocRecon
  await page1920.click(".pedestal-plaque-btn.plaque-0");
  await page1920.waitForTimeout(1200);
  await page1920.screenshot({ path: `${outDir}/E_Desktop_1920x1080_DocRecon_Selected.png` });
  console.log("Captured: E_Desktop_1920x1080_DocRecon_Selected.png");

  // Click Pathway AI
  await page1920.click(".pedestal-plaque-btn.plaque-1");
  await page1920.waitForTimeout(1200);
  await page1920.screenshot({ path: `${outDir}/F_Desktop_1920x1080_PathwayAI_Selected.png` });
  console.log("Captured: F_Desktop_1920x1080_PathwayAI_Selected.png");

  // Click HEFIN
  await page1920.click(".pedestal-plaque-btn.plaque-2");
  await page1920.waitForTimeout(1200);
  await page1920.screenshot({ path: `${outDir}/G_Desktop_1920x1080_HEFIN_Selected.png` });
  console.log("Captured: G_Desktop_1920x1080_HEFIN_Selected.png");

  await d1920Context.close();

  // -------------------------------------------------------------------------
  // 3. RESPONSIVE VIEWPORTS: LAPTOP, TABLET, MOBILE
  // -------------------------------------------------------------------------
  // Laptop 1366x768
  const laptopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
  });
  const page1366 = await laptopContext.newPage();
  await page1366.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await page1366.waitForTimeout(2000);
  const p1366 = await page1366.$("#projects");
  if (p1366) await p1366.scrollIntoViewIfNeeded();
  await page1366.waitForTimeout(1000);
  await page1366.screenshot({ path: `${outDir}/H_Laptop_1366x768_Default.png` });
  console.log("Captured: H_Laptop_1366x768_Default.png");
  await laptopContext.close();

  // Tablet 768x1024
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 1,
  });
  const page768 = await tabletContext.newPage();
  await page768.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await page768.waitForTimeout(2000);
  const p768 = await page768.$("#projects");
  if (p768) await p768.scrollIntoViewIfNeeded();
  await page768.waitForTimeout(1000);
  await page768.screenshot({ path: `${outDir}/I_Tablet_768x1024_Default.png` });
  console.log("Captured: I_Tablet_768x1024_Default.png");
  await tabletContext.close();

  // Mobile 390x844 (Single-exhibit carousel)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page390 = await mobileContext.newPage();
  await page390.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await page390.waitForTimeout(2000);
  const p390 = await page390.$("#projects");
  if (p390) await p390.scrollIntoViewIfNeeded();
  await page390.waitForTimeout(1000);
  await page390.screenshot({ path: `${outDir}/J_Mobile_390x844_Exhibit01.png` });
  console.log("Captured: J_Mobile_390x844_Exhibit01.png");

  // Click next arrow on mobile
  await page390.click(".mobile-nav-arrow.next");
  await page390.waitForTimeout(1000);
  await page390.screenshot({ path: `${outDir}/K_Mobile_390x844_Exhibit02_Pathway.png` });
  console.log("Captured: K_Mobile_390x844_Exhibit02_Pathway.png");

  await mobileContext.close();

  // -------------------------------------------------------------------------
  // 4. VIDEO DEMONSTRATION RECORDING
  // -------------------------------------------------------------------------
  console.log("Recording high-fidelity demonstration video...");
  const videoContext = await browser.newContext({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: `${outDir}/video/`,
      size: { width: 1536, height: 864 },
    },
  });
  const videoPage = await videoContext.newPage();
  await videoPage.goto("http://127.0.0.1:4173/#projects", { waitUntil: "networkidle" });
  await videoPage.waitForTimeout(2000);
  const pVid = await videoPage.$("#projects");
  if (pVid) await pVid.scrollIntoViewIfNeeded();
  await videoPage.waitForTimeout(1500);

  // Hover over DocRecon
  await videoPage.hover(".pedestal-plaque-btn.plaque-0");
  await videoPage.waitForTimeout(1200);

  // Click DocRecon to reveal details
  await videoPage.click(".pedestal-plaque-btn.plaque-0");
  await videoPage.waitForTimeout(2500);

  // Click Pathway AI
  await videoPage.click(".pedestal-plaque-btn.plaque-1");
  await videoPage.waitForTimeout(2500);

  // Click HEFIN
  await videoPage.click(".pedestal-plaque-btn.plaque-2");
  await videoPage.waitForTimeout(2500);

  // Close details panel
  await videoPage.click(".panel-close-text-btn");
  await videoPage.waitForTimeout(2000);

  await videoContext.close();
  console.log("Video demonstration recorded in: " + outDir + "/video/");

  await browser.close();
  console.log("All Section 04 exact 3D visual reconstruction verifications completed successfully!");
}

runVerification().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
