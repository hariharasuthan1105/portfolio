import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "small_mobile_320x568", width: 320, height: 568, isMobile: true, hasTouch: true },
  { name: "mobile_360x800", width: 360, height: 800, isMobile: true, hasTouch: true },
  { name: "mobile_375x812", width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: "mobile_390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "mobile_430x932", width: 430, height: 932, isMobile: true, hasTouch: true },
  { name: "large_mobile_600x960", width: 600, height: 960, isMobile: true, hasTouch: true },
  { name: "tablet_portrait_768x1024", width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: "tablet_portrait_820x1180", width: 820, height: 1180, isMobile: true, hasTouch: true },
  { name: "tablet_landscape_1024x768", width: 1024, height: 768, isMobile: false, hasTouch: true },
  { name: "small_laptop_1280x800", width: 1280, height: 800, isMobile: false, hasTouch: false },
  { name: "laptop_1366x768", width: 1366, height: 768, isMobile: false, hasTouch: false },
  { name: "laptop_1440x900", width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: "desktop_1536x864", width: 1536, height: 864, isMobile: false, hasTouch: false },
  { name: "desktop_1920x1080", width: 1920, height: 1080, isMobile: false, hasTouch: false },
  { name: "desktop_2560x1440", width: 2560, height: 1440, isMobile: false, hasTouch: false },
  { name: "mobile_landscape_844x390", width: 844, height: 390, isMobile: true, hasTouch: true }
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
  const outDir = path.resolve("portfolio-main/screenshots/v15_audit");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = {
    totalViewports: VIEWPORTS.length,
    passedViewports: 0,
    overflowIssues: [],
    sectionHealth: {},
    drawerVerified: false
  };

  console.log(`Starting Kingdom of Code V15 Responsive Layout Audit across ${VIEWPORTS.length} viewports...`);

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      deviceScaleFactor: 2
    });

    try {
      await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#skills", { timeout: 15000 });
      await page.waitForTimeout(600);

      // Check for horizontal overflow across document
      const overflowData = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bodyScrollW = document.body.scrollWidth;
        const maxScrollW = Math.max(scrollW, bodyScrollW);
        const hasOverflow = maxScrollW > docW + 1;

        let culprits = [];
        if (hasOverflow) {
          const all = document.querySelectorAll("*");
          all.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docW + 2) {
              culprits.push({
                tag: el.tagName,
                className: el.className ? String(el.className).slice(0, 50) : "",
                id: el.id || "",
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                docW
              });
            }
          });
        }
        return { docW, maxScrollW, hasOverflow, culprits: culprits.slice(0, 5) };
      });

      if (overflowData.hasOverflow) {
        console.warn(`  ⚠️ OVERFLOW DETECTED: maxScrollW=${overflowData.maxScrollW} > docW=${overflowData.docW}`);
        results.overflowIssues.push({ viewport: vp.name, ...overflowData });
      } else {
        console.log(`  ✅ Zero horizontal overflow (scrollWidth=${overflowData.maxScrollW}, clientWidth=${overflowData.docW})`);
        results.passedViewports++;
      }

      // Capture key viewports for visual record
      if (
        vp.name === "mobile_390x844" ||
        vp.name === "small_mobile_320x568" ||
        vp.name === "tablet_portrait_768x1024" ||
        vp.name === "desktop_1920x1080"
      ) {
        // Screenshot all sections for this viewport
        for (const sec of SECTIONS) {
          await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "instant" });
          }, sec);
          await page.waitForTimeout(400);

          const shotPath = path.join(outDir, `${vp.name}_sec_${sec}.png`);
          await page.screenshot({ path: shotPath });
        }
        console.log(`  📸 Saved all section screenshots for ${vp.name}`);
      }

      // Test mobile navigation drawer on 390x844
      if (vp.name === "mobile_390x844" && !results.drawerVerified) {
        const menuBtn = await page.$(".menu-toggle");
        if (menuBtn) {
          await menuBtn.click();
          await page.waitForTimeout(400);

          const drawerVisible = await page.$eval(".mobile-nav-drawer", (el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== "none";
          });

          const linksCount = await page.$$eval(".mobile-nav-link", (els) => els.length);
          console.log(`  📱 Mobile drawer opened: visible=${drawerVisible}, links=${linksCount}/8`);

          await page.screenshot({ path: path.join(outDir, `mobile_390x844_drawer_open.png`) });

          // Test ESC key
          await page.keyboard.press("Escape");
          await page.waitForTimeout(400);
          const drawerClosed = await page.$eval(".mobile-nav-drawer", (el) => !el).catch(() => true);
          console.log(`  📱 Mobile drawer closed on ESC: ${drawerClosed}`);
          results.drawerVerified = drawerVisible && linksCount === 8;
        }
      }

      // Test Skills ordering on mobile
      if (vp.name === "mobile_390x844") {
        const skillsMetrics = await page.evaluate(() => {
          const header = document.querySelector(".forge-header-block")?.getBoundingClientRect();
          const catBar = document.querySelector(".forge-left-hud")?.getBoundingClientRect();
          const stage = document.querySelector(".forge-stage")?.getBoundingClientRect();
          const hud = document.querySelector(".forge-right-hud")?.getBoundingClientRect();
          const list = document.querySelector(".skill-list")?.getBoundingClientRect();
          return {
            headerTop: header ? Math.round(header.top) : null,
            catBarTop: catBar ? Math.round(catBar.top) : null,
            stageTop: stage ? Math.round(stage.top) : null,
            hudTop: hud ? Math.round(hud.top) : null,
            listTop: list ? Math.round(list.top) : null,
            correctOrder:
              header && catBar && stage && hud && list &&
              header.top < catBar.top &&
              catBar.top < stage.top &&
              stage.top < hud.top &&
              hud.top < list.top
          };
        });
        console.log(`  🎯 Skills Phase 4 Mobile Order:`, skillsMetrics);
        results.skillsCorrectOrder = skillsMetrics.correctOrder;
      }

    } catch (err) {
      console.error(`  ❌ Error testing viewport ${vp.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  // 200% Zoom check on 1280x800
  console.log(`\nTesting 200% zoom emulation on desktop (1280x800)...`);
  const zoomPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  await zoomPage.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
  await zoomPage.waitForSelector("#skills");
  await zoomPage.evaluate(() => {
    document.body.style.zoom = "200%";
  });
  await zoomPage.waitForTimeout(600);
  const zoomOverflow = await zoomPage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`  Zoom 200% overflow check: ${zoomOverflow ? "⚠️ Overflow" : "✅ Pass"}`);
  await zoomPage.screenshot({ path: path.join(outDir, "desktop_1280x800_zoom_200.png") });
  await zoomPage.close();

  await browser.close();

  fs.writeFileSync(
    path.join(outDir, "audit_summary.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\n================ AUDIT SUMMARY ================");
  console.log(`Total Viewports: ${results.totalViewports}`);
  console.log(`Passed (Zero Overflow): ${results.passedViewports} / ${results.totalViewports}`);
  console.log(`Overflow Issues: ${results.overflowIssues.length}`);
  console.log(`Mobile Drawer Verified: ${results.drawerVerified}`);
  console.log(`Skills Mobile Order Correct: ${results.skillsCorrectOrder}`);
  console.log("===============================================");
}

runAudit().catch(console.error);

