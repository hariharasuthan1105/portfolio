import { chromium } from "playwright";

const artifactDir = "C:/Users/hariharasuthan/.gemini/antigravity/brain/dfbb09da-5d9c-46a8-8a42-0fac6f626a12";

const captures = [
  { name: "v17_before_desktop_1920_vault.png", w: 1920, h: 1080, sec: "vault" },
  { name: "v17_before_desktop_1440_vault.png", w: 1440, h: 900, sec: "vault" },
  { name: "v17_before_laptop_1366_vault.png", w: 1366, h: 768, sec: "vault" },
  { name: "v17_before_laptop_1024_vault.png", w: 1024, h: 768, sec: "vault" },
  { name: "v17_before_mobile_390_vault.png", w: 390, h: 844, sec: "vault" },
  { name: "v17_before_desktop_1440_contact.png", w: 1440, h: 900, sec: "contact" },
  { name: "v17_before_mobile_390_contact.png", w: 390, h: 844, sec: "contact" }
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForSelector("#vault", { timeout: 15000 });
  await page.waitForTimeout(1000);

  for (const c of captures) {
    await page.setViewportSize({ width: c.w, height: c.h });
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }, c.sec);
    await page.waitForTimeout(400);
    const el = await page.$("#" + c.sec);
    if (el) {
      await el.screenshot({ path: artifactDir + "/" + c.name });
      console.log("Captured " + c.name);
    }
  }

  await browser.close();
  console.log("All before screenshots captured successfully.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
