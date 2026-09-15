import { chromium } from "playwright-core";
const [url = "http://localhost:3123/", width = "390", out = "shot.png"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
// Scroll through the page so intersection-based reveals fire, then return to top.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(900);
const info = await page.evaluate(() => {
  const wide = [...document.querySelectorAll("body *")]
    .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
    .slice(0, 12)
    .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 4).join(".")} right=${Math.round(el.getBoundingClientRect().right)}`);
  const menu = document.querySelector('button[aria-controls]');
  return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, wide, menu: menu ? menu.textContent + " visible=" + (menu.getBoundingClientRect().width > 0) : "none" };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
