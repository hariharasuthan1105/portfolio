import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const AUDIT_AFTER_DIR = path.resolve("screenshots/v14_audit_after");
if (!fs.existsSync(AUDIT_AFTER_DIR)) {
  fs.mkdirSync(AUDIT_AFTER_DIR, { recursive: true });
}

const VIEWPORTS = [
  // Desktop
  { name: "desktop_2560x1440", width: 2560, height: 1440, category: "desktop" },
  { name: "desktop_1920x1080", width: 1920, height: 1080, category: "desktop" },
  { name: "desktop_1536x864",  width: 1536, height: 864,  category: "desktop" },
  { name: "desktop_1440x900",  width: 1440, height: 900,  category: "desktop" },
  // Laptop
  { name: "laptop_1366x768",   width: 1366, height: 768,  category: "laptop" },
  { name: "laptop_1280x800",   width: 1280, height: 800,  category: "laptop" },
  { name: "laptop_1024x768",   width: 1024, height: 768,  category: "laptop" },
  // Tablet
  { name: "tablet_820x1180",   width: 820,  height: 1180, category: "tablet" },
  { name: "tablet_768x1024",   width: 768,  height: 1024, category: "tablet" },
  { name: "tablet_landscape_1024x768", width: 1024, height: 768, category: "tablet" },
  // Mobile
  { name: "mobile_430x932",    width: 430,  height: 932,  category: "mobile" },
  { name: "mobile_390x844",    width: 390,  height: 844,  category: "mobile" },
  { name: "mobile_375x812",    width: 375,  height: 812,  category: "mobile" },
  { name: "mobile_360x800",    width: 360,  height: 800,  category: "mobile" },
  { name: "mobile_320x568",    width: 320,  height: 568,  category: "mobile" },
  // Mobile Landscape
  { name: "mobile_landscape_844x390", width: 844, height: 390, category: "mobile_landscape" },
];

const SECTIONS = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "achievements",
  "contact",
  "vault"
];

async function runAfterAudit() {
  console.log("\n============================================================");
  console.log("   KINGDOM OF CODE — V14 AFTER ALIGNMENT VERIFICATION       ");
  console.log("============================================================\n");

  const browser = await chromium.launch({ headless: true });
  const auditReport = [];

  for (const vp of VIEWPORTS) {
    console.log(`\nVerifying Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.category === "mobile" ? 3 : 1
    });
    const page = await context.newPage();

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // 1. Horizontal Overflow Verification
    const overflowCheck = await page.evaluate(() => {
      const doc = document.documentElement;
      const scrollW = doc.scrollWidth;
      const clientW = doc.clientWidth;
      const innerW = window.innerWidth;
      const overflowingElements = [];

      document.querySelectorAll("*").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > innerW + 1 && el.offsetParent !== null && !["canvas", "svg"].includes(el.tagName.toLowerCase())) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });

      return {
        hasHorizontalOverflow: scrollW > clientW + 1,
        scrollWidth: scrollW,
        clientWidth: clientW,
        innerWidth: innerW,
        overflowingCount: overflowingElements.length,
        overflowingSamples: overflowingElements.slice(0, 5)
      };
    });

    if (overflowCheck.hasHorizontalOverflow) {
      console.warn(`  [OVERFLOW WARNING] scrollWidth (${overflowCheck.scrollWidth}) > clientWidth (${overflowCheck.clientWidth}) by ${overflowCheck.scrollWidth - overflowCheck.clientWidth}px`);
    } else {
      console.log(`  [OVERFLOW PASS] Clean horizontal fit (${overflowCheck.scrollWidth}px <= ${overflowCheck.clientWidth}px)`);
    }

    // 2. Navigation bar layout check
    const navMetrics = await page.evaluate(() => {
      const topbar = document.querySelector("header.topbar");
      const menuBtn = document.querySelector(".menu-toggle");
      const audioBtn = document.querySelector(".audio-toggle");
      const rTopbar = topbar ? topbar.getBoundingClientRect() : null;
      const rMenu = menuBtn ? menuBtn.getBoundingClientRect() : null;
      const rAudio = audioBtn ? audioBtn.getBoundingClientRect() : null;

      const isMenuInside = rMenu ? (rMenu.right <= window.innerWidth && rMenu.left >= 0) : true;
      const isAudioInside = rAudio ? (rAudio.right <= window.innerWidth && rAudio.left >= 0) : true;

      return {
        topbarHeight: rTopbar ? Math.round(rTopbar.height) : 0,
        isMenuInside,
        isAudioInside,
        menuVisible: menuBtn ? window.getComputedStyle(menuBtn).display !== "none" : false
      };
    });

    console.log(`  [NAV METRICS] topbarHeight=${navMetrics.topbarHeight}px, menuInside=${navMetrics.isMenuInside}, audioInside=${navMetrics.isAudioInside}`);

    // Capture Home View
    const homeShotPath = path.join(AUDIT_AFTER_DIR, `${vp.name}_01_home.png`);
    await page.screenshot({ path: homeShotPath });

    // 3. Representative Section Captures
    const isRep = ["desktop_1920x1080", "tablet_768x1024", "mobile_390x844"].includes(vp.name);
    if (isRep) {
      for (const sec of SECTIONS) {
        await page.evaluate((id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "instant" });
        }, sec);
        await page.waitForTimeout(600);

        const secShotPath = path.join(AUDIT_AFTER_DIR, `${vp.name}_sec_${sec}.png`);
        await page.screenshot({ path: secShotPath });
      }

      // Check Mobile Menu Drawer if mobile
      if (vp.category === "mobile") {
        try {
          const menuBtn = page.locator(".menu-toggle");
          if (await menuBtn.isVisible()) {
            await menuBtn.click({ timeout: 2000 });
            await page.waitForTimeout(400);
            await page.screenshot({ path: path.join(AUDIT_AFTER_DIR, `${vp.name}_nav_drawer_open.png`) });
            await menuBtn.click({ timeout: 2000 });
            console.log(`  [NAV DRAWER PASS] Drawer toggled cleanly and captured on ${vp.name}!`);
          }
        } catch (err) {
          console.warn(`  [NAV DRAWER NOTICE] ${err.message}`);
        }
      }
    }

    auditReport.push({
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      category: vp.category,
      hasHorizontalOverflow: overflowCheck.hasHorizontalOverflow,
      scrollWidth: overflowCheck.scrollWidth,
      clientWidth: overflowCheck.clientWidth,
      navMetrics
    });

    await context.close();
  }

  // Browser zoom 200% check
  console.log("\nVerifying Browser Zoom 200% on Desktop (960x540 viewport)...");
  const zoomContext = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const zoomPage = await zoomContext.newPage();
  await zoomPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await zoomPage.waitForTimeout(1000);
  await zoomPage.screenshot({ path: path.join(AUDIT_AFTER_DIR, "desktop_zoom_200pct.png") });
  await zoomContext.close();

  // Reduced motion check
  console.log("\nVerifying Reduced Motion...");
  const rmContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: "reduce"
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await rmPage.waitForTimeout(1000);
  const motionDataset = await rmPage.evaluate(() => document.documentElement.dataset.motion);
  console.log(`  Reduced motion dataset.motion = "${motionDataset}"`);
  await rmPage.screenshot({ path: path.join(AUDIT_AFTER_DIR, "prefers_reduced_motion.png") });
  await rmContext.close();

  await browser.close();

  const reportPath = path.resolve("screenshots/v14_audit_after/AFTER_AUDIT_REPORT.json");
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nVerification complete! Full report written to ${reportPath}`);
}

runAfterAudit().catch(err => {
  console.error("After verification failed:", err);
  process.exit(1);
});
