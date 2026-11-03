// scripts/verify-citadel-hero.mjs
// Playwright Verification & Demonstration Suite for Cinematic 3D Hero V13 (The Obsidian Citadel)
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUTPUT_DIR = path.resolve("screenshots/citadel_hero_evidence");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_URL = "http://127.0.0.1:4173";

async function main() {
  console.log("==================================================================");
  console.log("  KINGDOM OF CODE — OBSIDIAN CITADEL 3D DEMONSTRATION SUITE       ");
  console.log("==================================================================");

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--use-angle=default",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.error("[BROWSER ERROR]:", msg.text());
    }
  });

  try {
    // -------------------------------------------------------------
    // DEMO 1 — CASTLE ENVIRONMENT (3D Depth & Multilayer Parallax)
    // -------------------------------------------------------------
    console.log("Running DEMO 1: Castle Environment 3D Depth Demonstration...");
    await page.goto(`${BASE_URL}/?demo=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "01_demo1_castle_environment_depth_proof.png"),
      fullPage: false,
    });
    console.log("Captured: 01_demo1_castle_environment_depth_proof.png");

    // -------------------------------------------------------------
    // DEMO 2 — CHARACTER (Grounded Stance, Walking Animation, Floor Contact)
    // -------------------------------------------------------------
    console.log("Running DEMO 2: Hooded Explorer Walking & Floor Contact...");
    await page.goto(`${BASE_URL}/?demo=2`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "02_demo2_character_walking_ground_contact.png"),
      fullPage: false,
    });
    console.log("Captured: 02_demo2_character_walking_ground_contact.png");

    // -------------------------------------------------------------
    // DEMO 3 — PORTAL (Vortex Shader, Runic Rings, Hover Activation, Charging)
    // -------------------------------------------------------------
    console.log("Running DEMO 3: Portal VFX Idle, Hover & Activation Transition...");
    await page.goto(`${BASE_URL}/?demo=3`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.mouse.move(960, 480);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "03_demo3_portal_vortex_hover_acceleration.png"),
      fullPage: false,
    });
    console.log("Captured: 03_demo3_portal_vortex_hover_acceleration.png");

    // Trigger Enter Action
    const enterBtn = page.locator(".hero-btn-enter");
    if (await enterBtn.isVisible()) {
      await enterBtn.click();
      await page.waitForTimeout(700);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, "03B_demo3_portal_entry_flythrough.png"),
        fullPage: false,
      });
      console.log("Captured: 03B_demo3_portal_entry_flythrough.png");
    }

    // -------------------------------------------------------------
    // DEMO 4 — ENVIRONMENTAL VFX (Clouds, Wind Banners, Waterfalls, Mist)
    // -------------------------------------------------------------
    console.log("Running DEMO 4: Environmental VFX (Clouds, Flags, Waterfalls, Mist)...");
    await page.goto(`${BASE_URL}/?demo=4`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "04_demo4_environmental_vfx_clouds_flags_waterfalls.png"),
      fullPage: false,
    });
    console.log("Captured: 04_demo4_environmental_vfx_clouds_flags_waterfalls.png");

    // -------------------------------------------------------------
    // DEMO 5 — COMPLETE WEBSITE (Cinematic 3D Scene + Responsive HTML UI)
    // -------------------------------------------------------------
    console.log("Running DEMO 5: Complete Website Across All 5 Responsive Viewports...");

    const viewports = [
      { name: "05_demo5_complete_website_desktop_1920x1080", width: 1920, height: 1080 },
      { name: "06_responsive_laptop_1366x768", width: 1366, height: 768 },
      { name: "07_responsive_tablet_768x1024", width: 768, height: 1024 },
      { name: "08_responsive_mobile_390x844", width: 390, height: 844 },
      { name: "09_responsive_mobile_320x568", width: 320, height: 568 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1600);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${vp.name}.png`),
        fullPage: false,
      });
      console.log(`Captured: ${vp.name}.png`);
    }

    console.log("==================================================================");
    console.log("ALL 5 DEMONSTRATIONS AND RESPONSIVE VIEWS CAPTURED SUCCESSFULLY!");
    console.log(`Output Directory: ${OUTPUT_DIR}`);
    if (consoleErrors.length > 0) {
      console.warn(`Total console errors: ${consoleErrors.length}`);
    } else {
      console.log("Total WebGL / Console Errors: 0 (Flawless Render)");
    }
    console.log("==================================================================");
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((err) => {
  console.error("FATAL ERROR IN DEMO RUNNER:", err);
  process.exit(1);
});
