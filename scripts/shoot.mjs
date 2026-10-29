// Screenshot a page with real mobile emulation and report any element wider than the viewport.
// Usage: node scripts/shoot.mjs <url> <out.png> <width> [menu]
import puppeteer from "puppeteer-core";

const [, , url = "http://localhost:3000/", out = "shot.png", widthArg = "390", opts = ""] = process.argv;
const width = Number(widthArg);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
await page.goto(url, { waitUntil: "networkidle0" });
// Verification mode: drop the first-visit splash and show scroll-reveal content immediately.
await page.evaluate(() => {
  document.querySelector(".splash")?.remove();
  document.documentElement.classList.remove("js");
});
await new Promise((r) => setTimeout(r, 400));
if (opts.includes("menu")) {
  await page.click('button[aria-controls="mobile-menu"]');
  await new Promise((r) => setTimeout(r, 500));
}
const report = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const wide = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 1) {
      wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")} right=${Math.round(r.right)}`);
      if (wide.length >= 8) break;
    }
  }
  return { viewport: vw, scrollWidth: sw, wide };
});
console.log(`${url} @${width}: viewport=${report.viewport} scrollWidth=${report.scrollWidth}${report.wide.length ? "\n  overflow: " + report.wide.join(" | ") : " (no horizontal overflow)"}`);
await page.screenshot({ path: out, fullPage: !opts.includes("menu") });
await browser.close();
