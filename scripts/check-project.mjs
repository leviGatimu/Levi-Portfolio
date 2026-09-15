// Manual check: navigate work -> project, confirm scroll resets, capture gallery + lightbox.
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3123";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/work`, { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(500);
const link = await page.$('a[href^="/work/"]');
if (!link) throw new Error("no project link");
await link.click();
await page.waitForURL("**/work/**");
await page.waitForTimeout(1500);
console.log("scrollY after navigation:", await page.evaluate(() => window.scrollY));
await page.screenshot({ path: "pj.png" });

const galleryTop = await page.evaluate(() => {
  const s = document.querySelector('section[aria-label="Gallery"]');
  return s ? s.getBoundingClientRect().top + window.scrollY : null;
});
if (galleryTop !== null) {
  await page.evaluate((y) => window.scrollTo(0, y - 60), galleryTop);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "gal.png" });
  const btn = await page.$('section[aria-label="Gallery"] button');
  if (btn) {
    await btn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "lb.png" });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);
    console.log("lightbox counter:", await page.evaluate(() => document.querySelector('[role="dialog"] span')?.textContent));
  }
} else {
  console.log("no gallery section (project has only a cover)");
}
await browser.close();
