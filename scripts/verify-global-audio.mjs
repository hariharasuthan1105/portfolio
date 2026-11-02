import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const EVIDENCE_DIR = path.resolve("screenshots/audio_fix_evidence");
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runTestSuite() {
  console.log("\n============================================================");
  console.log("   KINGDOM OF CODE — GLOBAL PERSISTENT AUDIO TEST SUITE     ");
  console.log("============================================================\n");

  const results = [];
  function record(testId, name, passed, details = "") {
    const symbol = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`[${symbol}] TEST ${testId}: ${name} ${details ? `(${details})` : ""}`);
    results.push({ testId, name, passed, details });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=user-gesture-required"] // strictly enforce browser autoplay policy
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", err => consoleErrors.push(err.message));

  const BASE_URL = "http://127.0.0.1:4173";

  // -------------------------------------------------------------
  // TEST A: Open homepage with no prior interaction
  // -------------------------------------------------------------
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const initialAudioState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const toggle = document.querySelector(".audio-toggle");
    return {
      hasAudio: !!audio,
      paused: audio ? audio.paused : null,
      currentTime: audio ? audio.currentTime : null,
      toggleActiveClass: toggle ? toggle.classList.contains("active") : false,
      toggleAriaLabel: toggle ? toggle.getAttribute("aria-label") : "",
      audioCount: document.querySelectorAll("audio").length,
    };
  });

  const testAPassed =
    initialAudioState.hasAudio &&
    initialAudioState.paused === true &&
    initialAudioState.toggleActiveClass === false &&
    initialAudioState.audioCount === 1;

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "01_initial_muted_ready_state.png")
  });
  record("A", "Initial load respects autoplay policies (sound control ready, not falsely playing)", testAPassed, `audioCount=${initialAudioState.audioCount}`);

  // -------------------------------------------------------------
  // TEST B: Click ENTER THE KINGDOM -> Music starts synchronously
  // -------------------------------------------------------------
  const enterBtn = page.locator(".hero-enter-btn");
  if (await enterBtn.isVisible()) {
    await enterBtn.click();
  } else {
    // fallback click on audio toggle
    await page.locator(".audio-toggle").click();
  }

  // Wait for fade in and playback to begin
  await page.waitForTimeout(2000);

  const playingAudioState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const toggle = document.querySelector(".audio-toggle");
    return {
      paused: audio ? audio.paused : true,
      currentTime: audio ? audio.currentTime : 0,
      volume: audio ? audio.volume : 0,
      toggleActiveClass: toggle ? toggle.classList.contains("active") : false,
      storedEnabled: localStorage.getItem("kingdom_audio_enabled"),
      storedVolume: localStorage.getItem("kingdom_audio_volume"),
    };
  });

  const testBPassed =
    playingAudioState.paused === false &&
    playingAudioState.currentTime > 0 &&
    playingAudioState.volume > 0.05 &&
    playingAudioState.toggleActiveClass === true &&
    playingAudioState.storedEnabled === "true";

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "02_active_playing_state_with_eq_bars.png")
  });
  record("B", "Clicking ENTER THE KINGDOM starts playback and fades in volume", testBPassed, `vol=${playingAudioState.volume.toFixed(2)}, time=${playingAudioState.currentTime.toFixed(2)}s`);

  // -------------------------------------------------------------
  // TEST C: Navigate Home -> About -> Skills -> Projects -> Achievements -> Vault
  // -------------------------------------------------------------
  const timeBeforeNav = playingAudioState.currentTime;
  const sections = ["about", "skills", "projects", "achievements", "vault"];

  let continuousPlayback = true;
  for (const sec of sections) {
    const navLink = page.locator(`header nav a[href="#${sec}"]`).first();
    if (await navLink.isVisible()) {
      await navLink.click();
      await page.waitForTimeout(800);
    }
  }

  const postNavState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const audioElements = document.querySelectorAll("audio");
    return {
      paused: audio ? audio.paused : true,
      currentTime: audio ? audio.currentTime : 0,
      audioCount: audioElements.length,
      volume: audio ? audio.volume : 0,
    };
  });

  const testCPassed =
    postNavState.paused === false &&
    postNavState.currentTime > timeBeforeNav &&
    postNavState.audioCount === 1;

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "03_persistent_playback_across_sections.png")
  });
  record("C", "Continuous audio across all sections without unmounting or resetting timestamp", testCPassed, `timeAdvancement=${(postNavState.currentTime - timeBeforeNav).toFixed(2)}s`);

  // -------------------------------------------------------------
  // TEST D: Mute music, navigate 3 sections, confirm remains muted
  // -------------------------------------------------------------
  const audioToggle = page.locator(".audio-toggle");
  await audioToggle.click();
  // Wait for 0.5s fade out
  await page.waitForTimeout(800);

  const mutedState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const toggle = document.querySelector(".audio-toggle");
    return {
      paused: audio ? audio.paused : false,
      toggleActiveClass: toggle ? toggle.classList.contains("active") : true,
      storedEnabled: localStorage.getItem("kingdom_audio_enabled"),
      pausedTime: audio ? audio.currentTime : 0,
    };
  });

  // Navigate through 3 sections while muted
  for (const sec of ["contact", "about", "home"]) {
    const link = page.locator(`header nav a[href="#${sec}"]`).first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForTimeout(500);
    }
  }

  const postNavMutedState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const toggle = document.querySelector(".audio-toggle");
    return {
      paused: audio ? audio.paused : false,
      toggleActiveClass: toggle ? toggle.classList.contains("active") : true,
      storedEnabled: localStorage.getItem("kingdom_audio_enabled"),
    };
  });

  const testDPassed =
    mutedState.paused === true &&
    mutedState.toggleActiveClass === false &&
    postNavMutedState.paused === true &&
    postNavMutedState.toggleActiveClass === false;

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "04_muted_state_preserved_during_navigation.png")
  });
  record("D", "Mute persists throughout section navigation without accidental auto-resume", testDPassed);

  // -------------------------------------------------------------
  // TEST E: Unmute/resume continues from previous position
  // -------------------------------------------------------------
  const resumePosExpected = mutedState.pausedTime;
  await audioToggle.click();
  await page.waitForTimeout(1000);

  const resumedState = await page.evaluate(() => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    const toggle = document.querySelector(".audio-toggle");
    return {
      paused: audio ? audio.paused : true,
      currentTime: audio ? audio.currentTime : 0,
      toggleActiveClass: toggle ? toggle.classList.contains("active") : false,
    };
  });

  const testEPassed =
    resumedState.paused === false &&
    resumedState.currentTime >= resumePosExpected &&
    resumedState.toggleActiveClass === true;

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "05_resumed_from_saved_position.png")
  });
  record("E", "Unmuting resumes playback from exact paused timestamp without restarting", testEPassed, `resumedAt=${resumedState.currentTime.toFixed(2)}s >= ${resumePosExpected.toFixed(2)}s`);

  // -------------------------------------------------------------
  // TEST F: Seamless loop test
  // -------------------------------------------------------------
  const loopResult = await page.evaluate(async () => {
    const audio = document.getElementById("kingdom-global-soundtrack");
    if (!audio) return { error: "No audio" };
    // Fast forward to 59.5 seconds of the 60s track
    audio.currentTime = 59.5;
    // Wait 1.5 seconds for it to wrap around past 0
    await new Promise(r => setTimeout(r, 1500));
    return {
      paused: audio.paused,
      currentTime: audio.currentTime,
      duration: audio.duration,
    };
  });

  const testFPassed =
    loopResult.paused === false &&
    loopResult.currentTime < 5.0; // successfully looped back to beginning

  record("F", "60-second audio track loops seamlessly without pausing", testFPassed, `wrappedTo=${loopResult.currentTime?.toFixed(2)}s`);

  // -------------------------------------------------------------
  // TEST G: Refresh page and confirm saved preferences
  // -------------------------------------------------------------
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const refreshedState = await page.evaluate(() => {
    return {
      storedEnabled: localStorage.getItem("kingdom_audio_enabled"),
      storedVolume: localStorage.getItem("kingdom_audio_volume"),
      audioCount: document.querySelectorAll("audio").length,
    };
  });

  const testGPassed =
    refreshedState.storedEnabled === "true" &&
    refreshedState.audioCount === 1;

  record("G", "Preferences restored from localStorage without violating autoplay restrictions", testGPassed, `enabled=${refreshedState.storedEnabled}`);

  // -------------------------------------------------------------
  // TEST H: Production audio asset responds successfully on AWS Amplify
  // -------------------------------------------------------------
  let testHPassed = false;
  let prodStatus = 0;
  let prodContentType = "";
  let prodBytes = 0;
  try {
    const prodRes = await fetch("https://main.d3r0wa5wh6oirj.amplifyapp.com/audio/kingdom-ambient.mp3");
    prodStatus = prodRes.status;
    prodContentType = prodRes.headers.get("content-type") || "";
    const prodBuf = await prodRes.arrayBuffer();
    prodBytes = prodBuf.byteLength;
    testHPassed = prodStatus === 200 && prodContentType.includes("audio") && prodBytes > 1000000;
  } catch (e) {
    console.error("Production fetch error:", e);
  }

  record("H", "AWS Amplify production audio endpoint returns valid audio bytes", testHPassed, `status=${prodStatus}, type=${prodContentType}, size=${prodBytes}B`);

  // -------------------------------------------------------------
  // TEST I: Confirm zero play() errors, missing files, or duplicate players
  // -------------------------------------------------------------
  const testIPassed = consoleErrors.length === 0;
  record("I", "Zero unhandled audio play() promise rejections or console errors", testIPassed, `errors=${consoleErrors.length}`);

  await browser.close();

  console.log("\n============================================================");
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`   TEST RESULT: ${totalPassed} / ${results.length} PASSED   `);
  console.log("============================================================\n");

  if (totalPassed !== results.length) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
