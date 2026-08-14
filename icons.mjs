import { chromium } from "playwright";
const OUT = process.argv[2];
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
const p = await c.newPage();
await p.addInitScript(() => localStorage.setItem("theme", "dark"));
await p.goto("http://localhost:3100/resume", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1500);
await p.evaluate(() => {
  const el = [...document.querySelectorAll("h2")].find(x => x.textContent.includes("What the work"));
  el?.closest("section")?.scrollIntoView({ block: "start" });
});
await p.waitForTimeout(1800);
const svgs = await p.evaluate(() => {
  const tags = [...document.querySelectorAll("li")].filter(e => e.className.includes("rounded-full"));
  return { tags: tags.length, withIcon: tags.filter(t => t.querySelector("svg")).length };
});
console.log(`SKILL TAGS: ${svgs.withIcon}/${svgs.tags} have an icon`);
await p.screenshot({ path: `${OUT}/icons-skills.png` });
await c.close(); await b.close();
