import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";
const BASE_URL = "http://127.0.0.1:4173";

async function verifyVault() {
  console.log("=== VERIFYING VAULT UNLOCK & SUPERPOWER REVEAL ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE_URL}#vault-trials`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Solve Challenge 1 (Perception)
  console.log("1. Solving Challenge 1 (Perception OCR)...");
  await page.click("#vault-tab-0");
  await page.waitForTimeout(300);

  await page.evaluate(() => {
    const slider = document.querySelector("#scanner");
    if (slider) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeSetter.call(slider, "100");
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(600);

  // 2. Click Next Tab: Reasoning
  console.log("2. Clicking Next to Challenge 2 (Reasoning)...");
  await page.click("#vault-tab-1");
  await page.waitForTimeout(400);

  // Trigger RAG pipeline
  console.log("   Streaming RAG pipeline...");
  await page.click(".rag-action-btn");
  await page.waitForTimeout(3200); // 4 stages * 550ms + margin

  // 3. Click Next Tab: Connection
  console.log("3. Clicking Next to Challenge 3 (Connection)...");
  await page.click("#vault-tab-2");
  await page.waitForTimeout(400);

  // Connect nodes 0-1, 1-2, 2-3 with proper pauses
  console.log("   Connecting network nodes 0-1, 1-2, 2-3...");
  const nodes = page.locator(".network-board .node-button");
  await nodes.nth(0).click();
  await page.waitForTimeout(150);
  await nodes.nth(1).click();
  await page.waitForTimeout(200);

  await nodes.nth(1).click();
  await page.waitForTimeout(150);
  await nodes.nth(2).click();
  await page.waitForTimeout(200);

  await nodes.nth(2).click();
  await page.waitForTimeout(150);
  await nodes.nth(3).click();
  await page.waitForTimeout(500);

  // Check reveal
  const revealState = await page.evaluate(() => {
    const reveal = document.querySelector(".vault-reveal");
    const unlocked = reveal?.classList.contains("unlocked");
    const heading = reveal?.querySelector(".superpower-heading")?.innerText;
    const pillars = Array.from(reveal?.querySelectorAll(".pillar-card") || []).map(p => ({
      name: p.querySelector(".pillar-project")?.innerText,
      tag: p.querySelector(".pillar-tag")?.innerText,
      detail: p.querySelector(".pillar-detail")?.innerText
    }));
    return { unlocked, heading, pillars };
  });

  console.log("Reveal Result:", JSON.stringify(revealState, null, 2));

  // Scroll to reveal and take screenshot
  await page.locator("#vault-reveal").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "v16_desktop_1440_vault_reveal_unlocked.png") });
  console.log("Captured v16_desktop_1440_vault_reveal_unlocked.png");

  await browser.close();
}

verifyVault().catch(err => {
  console.error("Vault test failed:", err);
  process.exit(1);
});

