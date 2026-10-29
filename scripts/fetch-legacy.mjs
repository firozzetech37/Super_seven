// Downloads images from the old sscfi.org site through a real browser session.
// Usage: node scripts/fetch-legacy.mjs <url-list.txt> <out-dir>
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [, , listFile, outDir] = process.argv;
const rels = fs.readFileSync(listFile, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
let ok = 0;
const failed = [];
for (const rel of rels) {
  const url = "https://sscfi.org/" + rel.split("/").map(encodeURIComponent).join("/");
  const dest = path.join(
    outDir,
    rel.replace(/^(img|images)\//, "").replace(/\s+/g, "-").toLowerCase(),
  );
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await page.goto(url, { waitUntil: "load", timeout: 30000 });
    const type = res?.headers()["content-type"] ?? "";
    if (!res || !res.ok() || !type.startsWith("image/")) {
      failed.push(`${rel} (${res?.status() ?? "no response"} ${type})`);
      continue;
    }
    fs.writeFileSync(dest, await res.buffer());
    ok++;
  } catch (e) {
    failed.push(`${rel} (${e.message})`);
  }
}
console.log(`downloaded ${ok}/${rels.length}`);
if (failed.length) console.log("failed:\n  " + failed.join("\n  "));
await browser.close();
