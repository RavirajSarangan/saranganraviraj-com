import { chromium } from "playwright";
const OUT = process.argv[2];
const b = await chromium.launch();
const problems = [];
const POST = "http://localhost:3100/blog/how-to-price-your-design";

// --- preloader: fires once per session, never twice ---
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://localhost:3100/", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(250);
  const first = await p.evaluate(() => !!document.querySelector('[class*="z-[100]"]'));
  await p.waitForTimeout(2600);
  const gone = await p.evaluate(() => ({
    overlay: !!document.querySelector('[class*="z-[100]"]'),
    overflow: document.body.style.overflow,
  }));
  await p.goto("http://localhost:3100/work", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(300);
  const second = await p.evaluate(() => !!document.querySelector('[class*="z-[100]"]'));
  console.log(`PRELOADER first-visit=${first} cleared=${!gone.overlay} scroll-unlocked=${gone.overflow !== "hidden"} repeats=${second}`);
  if (!first) problems.push("preloader did not appear on first visit");
  if (gone.overlay) problems.push("preloader did not clear");
  if (gone.overflow === "hidden") problems.push("preloader left scroll locked");
  if (second) problems.push("preloader repeated in same session");
  await c.close();
}

// --- preloader must never appear under reduced motion ---
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await c.newPage();
  await p.goto("http://localhost:3100/", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  const shown = await p.evaluate(() => !!document.querySelector('[class*="z-[100]"]'));
  console.log(`PRELOADER reduced-motion shown=${shown} (want false)`);
  if (shown) problems.push("preloader shown under reduced motion");
  await c.close();
}

// --- TOC + reading progress + related ---
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  p.on("pageerror", e => problems.push("PAGEERROR " + e.message));
  await p.addInitScript(() => { sessionStorage.setItem("sr:intro-seen", "1"); localStorage.setItem("theme","dark"); });
  await p.goto(POST, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);

  const toc = await p.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="On this page"]');
    if (!nav) return null;
    const links = [...nav.querySelectorAll("a")];
    const targets = links.map(a => !!document.getElementById(a.getAttribute("href").slice(1)));
    return { entries: links.length, allResolve: targets.every(Boolean) };
  });
  console.log("TOC:", JSON.stringify(toc));
  if (!toc) problems.push("TOC missing on a 6-heading post");
  else if (!toc.allResolve) problems.push("TOC anchor(s) do not resolve");

  // progress bar advances with scroll
  const before = await p.evaluate(() => getComputedStyle(document.querySelector(".bg-accent.origin-left")).transform);
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.6));
  await p.waitForTimeout(900);
  const after = await p.evaluate(() => getComputedStyle(document.querySelector(".bg-accent.origin-left")).transform);
  console.log(`PROGRESS advanced=${before !== after}`);
  if (before === after) problems.push("reading progress did not advance");

  // active TOC entry tracks scroll
  const active = await p.evaluate(() => document.querySelector('[aria-current="location"]')?.textContent?.trim().slice(0,40) ?? null);
  console.log("TOC active entry:", JSON.stringify(active));
  if (!active) problems.push("no active TOC entry after scrolling");

  const related = await p.evaluate(() => document.querySelectorAll('[aria-labelledby="related-heading"] a').length);
  console.log(`RELATED posts: ${related}`);
  if (related < 2) problems.push(`related posts = ${related}`);
  await p.screenshot({ path: `${OUT}/v4-post.png`, fullPage: false });
  await c.close();
}

// --- responsive + errors across themes, incl. new surfaces ---
{
  const routes = ["/", "/work", "/resume", "/blog", "/blog/how-to-price-your-design", "/about"];
  let n = 0;
  for (const theme of ["light", "dark"]) {
    for (const w of [360, 768, 1440, 2560]) {
      for (const r of routes) {
        const c = await b.newContext({ viewport: { width: w, height: 900 } });
        const p = await c.newPage();
        p.setDefaultTimeout(15000);
        await p.addInitScript(t => { sessionStorage.setItem("sr:intro-seen","1"); localStorage.setItem("theme", t); }, theme);
        p.on("pageerror", e => problems.push(`${theme} ${w} ${r} PAGEERROR ${e.message}`));
        p.on("console", m => { if (m.type()==="error") problems.push(`${theme} ${w} ${r} CONSOLE ${m.text()}`); });
        await p.goto("http://localhost:3100" + r, { waitUntil: "domcontentloaded" });
        await p.waitForTimeout(500);
        await p.evaluate(async () => { const s=innerHeight*0.85; for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,45));} });
        const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (ov > 1) problems.push(`${theme} ${w}px ${r} H-OVERFLOW ${ov}px`);
        n++; await c.close();
      }
    }
  }
  console.log(`RESPONSIVE: ${n} theme×width×route combos`);
}
await b.close();
console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nALL CLEAN ✓");
