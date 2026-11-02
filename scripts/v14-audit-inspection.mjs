import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const AUDIT_BEFORE_DIR = path.resolve("screenshots/v14_audit_before");
if (!fs.existsSync(AUDIT_BEFORE_DIR)) {
  fs.mkdirSync(AUDIT_BEFORE_DIR, { recursive: true });
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

async function runAudit() {
  console.log("\n============================================================");
  console.log("   KINGDOM OF CODE — V14 RESPONSIVE AUDIT & INSPECTION      ");
  console.log("============================================================\n");

  const browser = await chromium.launch({ headless: true });
  const auditReport = [];

  // PHASE 1: Quick live comparison check
  console.log("--- PHASE 1: Live AWS Amplify Production Health Check ---");
  try {
    const livePage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await livePage.goto("https://main.d3r0wa5wh6oirj.amplifyapp.com/", { timeout: 15000, waitUntil: "domcontentloaded" });
    const liveTitle = await livePage.title();
    console.log(`Live site responded: Title = "${liveTitle}"`);
    await livePage.screenshot({ path: path.join(AUDIT_BEFORE_DIR, "00_live_production_reference.png") });
    await livePage.close();
  } catch (err) {
    console.warn("Live production check notice:", err.message);
  }

  // PHASE 2: Systematic Viewport Audit on Local Working Build
  console.log("\n--- PHASE 2: Comprehensive Multi-Viewport Audit ---");

  for (const vp of VIEWPORTS) {
    console.log(`\nAuditing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.category === "mobile" ? 3 : 1
    });
    const page = await context.newPage();
    const consoleLogs = [];
    page.on("console", msg => consoleLogs.push(msg.text()));

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // 1. Overall Page Horizontal Overflow Check
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
      console.log(`  [OVERFLOW DEFECT] scrollWidth (${overflowCheck.scrollWidth}) > clientWidth (${overflowCheck.clientWidth}) by ${overflowCheck.scrollWidth - overflowCheck.clientWidth}px`);
      auditReport.push({
        viewport: vp.name,
        section: "global",
        element: "document",
        observedDefect: `Horizontal scrollbar caused by overflow (${overflowCheck.scrollWidth}px vs ${overflowCheck.clientWidth}px)`,
        severity: "HIGH",
        sampleElements: overflowCheck.overflowingSamples
      });
    }

    // 2. Navigation bar layout check
    const navMetrics = await page.evaluate(() => {
      const header = document.querySelector("header.topbar");
      const nav = document.querySelector("header.topbar nav");
      const menuBtn = document.querySelector(".menu-toggle");
      const brand = document.querySelector(".brand");
      const navEnd = document.querySelector(".nav-end");
      const headerRect = header ? header.getBoundingClientRect() : null;
      const navRect = nav ? nav.getBoundingClientRect() : null;
      const menuBtnVisible = menuBtn ? window.getComputedStyle(menuBtn).display !== "none" : false;
      const navVisible = nav ? window.getComputedStyle(nav).display !== "none" : false;

      // Check if nav items wrap awkwardly
      const navLinks = Array.from(document.querySelectorAll("header nav a")).map(a => {
        const r = a.getBoundingClientRect();
        return { text: a.textContent.trim(), top: Math.round(r.top), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
      });

      return {
        headerHeight: headerRect ? Math.round(headerRect.height) : 0,
        menuBtnVisible,
        navVisible,
        navLinkCount: navLinks.length,
        navLinks
      };
    });

    // Capture Full Home View
    const homeShotPath = path.join(AUDIT_BEFORE_DIR, `${vp.name}_01_home.png`);
    await page.screenshot({ path: homeShotPath });

    // 3. Section By Section Inspections for Representative Viewports (Desktop, Tablet, Mobile)
    const isRep = ["desktop_1920x1080", "tablet_768x1024", "mobile_390x844"].includes(vp.name);
    if (isRep) {
      for (const sec of SECTIONS) {
        const secEl = await page.$(`#${sec}`);
        if (secEl) {
          await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "instant" });
          }, sec);
          await page.waitForTimeout(600);

          // Measure section metrics
          const secMetrics = await page.evaluate((id) => {
            const el = document.getElementById(id);
            const rect = el ? el.getBoundingClientRect() : null;
            const topbar = document.querySelector("header.topbar");
            const topbarBottom = topbar ? topbar.getBoundingClientRect().bottom : 0;
            const heading = el ? el.querySelector("h1, h2") : null;
            const headingRect = heading ? heading.getBoundingClientRect() : null;

            return {
              id,
              top: rect ? Math.round(rect.top) : 0,
              height: rect ? Math.round(rect.height) : 0,
              isHeadingHiddenByTopbar: headingRect ? headingRect.top < topbarBottom : false,
              headingWidth: headingRect ? Math.round(headingRect.width) : 0,
              windowWidth: window.innerWidth
            };
          }, sec);

          if (secMetrics.isHeadingHiddenByTopbar) {
            console.log(`  [HEADING CLIPPED DEFECT] Section #${sec} heading is partially obscured by fixed topbar!`);
            auditReport.push({
              viewport: vp.name,
              section: sec,
              element: `#${sec} heading`,
              observedDefect: `Heading obscured by fixed topbar header during scroll anchor navigation`,
              severity: "MEDIUM"
            });
          }

          const secShotPath = path.join(AUDIT_BEFORE_DIR, `${vp.name}_sec_${sec}.png`);
          await page.screenshot({ path: secShotPath });
        }
      }

      // Check Mobile Menu Drawer if mobile
      if (vp.category === "mobile") {
        try {
          const menuBtn = page.locator(".menu-toggle");
          const isVis = await menuBtn.isVisible();
          const inView = await page.evaluate(() => {
            const btn = document.querySelector(".menu-toggle");
            if (!btn) return false;
            const r = btn.getBoundingClientRect();
            return r.right <= window.innerWidth && r.left >= 0 && r.width > 0;
          });

          if (!inView) {
            console.log(`  [NAV DEFECT] .menu-toggle is outside viewport on ${vp.name}!`);
            auditReport.push({
              viewport: vp.name,
              section: "navigation",
              element: ".menu-toggle",
              observedDefect: "Mobile hamburger menu button pushed outside viewport / unreachable",
              severity: "CRITICAL"
            });
          } else {
            await menuBtn.click({ timeout: 3000 });
            await page.waitForTimeout(400);
            await page.screenshot({ path: path.join(AUDIT_BEFORE_DIR, `${vp.name}_nav_drawer_open.png`) });
            await menuBtn.click({ timeout: 3000 });
          }
        } catch (err) {
          console.warn(`  [NAV ERROR] Could not toggle menu on ${vp.name}: ${err.message}`);
          auditReport.push({
            viewport: vp.name,
            section: "navigation",
            element: ".menu-toggle",
            observedDefect: `Failed to click menu button: ${err.message}`,
            severity: "CRITICAL"
          });
        }
      }
    }

    await context.close();
  }

  // Browser zoom 200% check
  console.log("\nAuditing Browser Zoom 200% on Desktop (960x540 viewport)...");
  const zoomContext = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const zoomPage = await zoomContext.newPage();
  await zoomPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await zoomPage.waitForTimeout(1000);
  await zoomPage.screenshot({ path: path.join(AUDIT_BEFORE_DIR, "desktop_zoom_200pct.png") });
  await zoomContext.close();

  // Reduced motion check
  console.log("\nAuditing Reduced Motion...");
  const rmContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: "reduce"
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await rmPage.waitForTimeout(1000);
  const motionDataset = await rmPage.evaluate(() => document.documentElement.dataset.motion);
  console.log(`  Reduced motion dataset.motion = "${motionDataset}"`);
  await rmPage.screenshot({ path: path.join(AUDIT_BEFORE_DIR, "prefers_reduced_motion.png") });
  await rmContext.close();

  await browser.close();

  // Write out structured findings log
  const reportPath = path.resolve("screenshots/v14_audit_before/AUDIT_FINDINGS.json");
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit complete! Logged ${auditReport.length} potential defects to ${reportPath}`);
}

runAudit().catch(err => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
