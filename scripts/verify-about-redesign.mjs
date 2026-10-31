import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "desktop_1536x1024", width: 1536, height: 1024 },
  { name: "desktop_1366x768", width: 1366, height: 768 },
  { name: "desktop_1200x800", width: 1200, height: 800 },
  { name: "desktop_1024x768", width: 1024, height: 768 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "mobile_390x844", width: 390, height: 844 },
];

const outDir = path.resolve("screenshots/about_redesign");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log(`\nTesting ${vp.name} (${vp.width}x${vp.height})...`);
    await page.goto("http://127.0.0.1:4173/#about", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const aboutEl = page.locator("#about");
    await aboutEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Diagnostics check & cleanup for clean capture
    const diag = await page.evaluate(() => {
      // Blur skip link
      const skip = document.querySelector(".skip-link");
      if (skip) {
        skip.blur();
        skip.style.display = "none";
      }

      // Keep topbar static for element-level screenshot
      const topbar = document.querySelector(".topbar");
      if (topbar) {
        topbar.style.position = "absolute";
      }

      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasHorizontalOverflow = docW > winW;

      const heading = document.querySelector(".about-main-heading");
      const headingRect = heading ? heading.getBoundingClientRect() : null;

      const cards = Array.from(document.querySelectorAll(".about-value-card"));
      const cardRects = cards.map((c) => {
        const r = c.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          clipsRight: r.right > winW,
          clipsLeft: r.left < 0,
        };
      });

      const eduCard = document.querySelector(".about-education-card");
      const eduRect = eduCard ? eduCard.getBoundingClientRect() : null;

      const resumeBtn = document.querySelector(".about-resume-btn");
      const resumeHref = resumeBtn ? resumeBtn.getAttribute("href") : null;

      return {
        docW,
        winW,
        hasHorizontalOverflow,
        headingRect: headingRect
          ? {
              left: Math.round(headingRect.left),
              right: Math.round(headingRect.right),
              width: Math.round(headingRect.width),
              clipsLeft: headingRect.left < 0,
              clipsRight: headingRect.right > winW,
            }
          : null,
        cardRects,
        eduRect: eduRect
          ? {
              left: Math.round(eduRect.left),
              right: Math.round(eduRect.right),
              width: Math.round(eduRect.width),
              clipsLeft: eduRect.left < 0,
            }
          : null,
        resumeHref,
      };
    });

    console.log(`  Horizontal overflow: ${diag.hasHorizontalOverflow} (doc: ${diag.docW}px, win: ${diag.winW}px)`);
    if (diag.headingRect) {
      console.log(`  Heading: [${diag.headingRect.left}px .. ${diag.headingRect.right}px] (clipsLeft: ${diag.headingRect.clipsLeft})`);
    }
    if (diag.eduRect) {
      console.log(`  Edu Card: [${diag.eduRect.left}px .. ${diag.eduRect.right}px] (clipsLeft: ${diag.eduRect.clipsLeft})`);
    }
    diag.cardRects.forEach((c, idx) => {
      console.log(`  Card ${idx + 1}: [${c.left}px .. ${c.right}px] (clipsRight: ${c.clipsRight})`);
    });

    // Capture clean element screenshot
    const screenshotPath = path.join(outDir, `${vp.name}.png`);
    await aboutEl.screenshot({ path: screenshotPath });
    console.log(`  Saved screenshot: ${screenshotPath}`);

    // Hover effect test
    const firstCard = page.locator(".about-value-card").first();
    if (await firstCard.isVisible()) {
      await firstCard.hover();
      await page.waitForTimeout(300);
      const hoverPath = path.join(outDir, `${vp.name}_hover.png`);
      await aboutEl.screenshot({ path: hoverPath });
    }

    await context.close();
  }

  await browser.close();
  console.log("\nAll viewport audits complete!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
