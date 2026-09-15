// Manual check: card images and the laptop mockup show the whole screenshot (no crop).
import { chromium } from "playwright-core";
const base = process.argv[2] ?? "http://localhost:3123";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/work`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 420));
await page.waitForTimeout(1000);
await page.screenshot({ path: "cards.png" });
console.log(await page.evaluate(() => [...document.querySelectorAll('a[href^="/work/"] img')].map((img) => ({ natural: (img.naturalWidth / img.naturalHeight).toFixed(2), box: (img.clientWidth / img.clientHeight).toFixed(2), fit: getComputedStyle(img).objectFit }))));
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const laptop = await page.evaluate(() => { const el = document.querySelector('img[sizes*="900px"]'); return el ? el.getBoundingClientRect().top + window.scrollY : null; });
if (laptop) { await page.evaluate((y) => window.scrollTo(0, y - 200), laptop); await page.waitForTimeout(1500); await page.screenshot({ path: "laptop.png" }); }
await browser.close();
