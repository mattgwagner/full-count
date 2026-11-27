// Plays a full game and a Derby headless. Usage: node e2e/play.mjs [outDir]
import { createRequire } from "node:module";
const require = createRequire("/home/matt/Code/readerful/");
const { chromium } = require("playwright");
const out = process.argv[2] || "/tmp";
const url = "file://" + new URL("../public/index.html", import.meta.url).pathname + "?debug&speed=6";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1045 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => m.type() === "error" && errors.push(m.text()));
await page.goto(url);
await page.fill("#nameIn", "Tester");
await page.click("#addBtn");
await page.screenshot({ path: `${out}/menu.png` });

async function autoplay(mode, shots) {
  let n = 0, shot = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 20000; i++) {
    if (await page.isVisible("#sResult")) break;
    const st = await page.evaluate(() => {
      const fc = window.__fc; if (!fc.pending) return null;
      const svg = document.querySelector("#zone"), dot = svg.querySelector("circle");
      let inZone = true;
      if (dot && svg.style.display !== "none") { const x = +dot.getAttribute("cx"), y = +dot.getAttribute("cy"); inZone = x >= 17 && x <= 47 && y >= 14 && y <= 64; }
      return { ans: fc.q.answer, inZone, take: fc.pending.allowTake, T: fc.pending.T };
    });
    if (!st) { await page.waitForTimeout(40); continue; }
    n++;
    if (shot < shots.length && n === shots[shot]) { await page.screenshot({ path: `${out}/${mode}-q${n}.png` }); shot++; }
    if (st.take && !st.inZone) { await page.keyboard.press("t"); continue; }
    // Think like a kid: 15–80% of the pitch clock (the clock runs at SPEED x).
    await page.waitForTimeout(st.T * rnd(0.15, 0.8) / 6);
    const wrong = Math.random() < 0.15;
    await page.keyboard.type(String(wrong ? st.ans + 1 : st.ans));
    await page.keyboard.press("Enter");
    if (n % 7 === 3) { await page.waitForTimeout(250); await page.screenshot({ path: `${out}/${mode}-flight${n}.png` }); }
  }
  await page.screenshot({ path: `${out}/${mode}-result.png` });
  return n;
}
await page.click("#playBtn"); await page.click('[data-lg="sandlot"]'); await page.click("#startBtn");
const n1 = await autoplay("game", [1, 2, 10]);
console.log("game questions:", n1, await page.textContent("#resBody"));
await page.click("#sResult [data-back]");
await page.click("#derbyBtn"); await page.click('[data-lg="majors"]'); await page.click("#startBtn");
const n2 = await autoplay("derby", [1]);
console.log("derby questions:", n2, await page.textContent("#resBody"));
await page.click("#sResult [data-back]");
for (const b of ["#lockerBtn", "#statsBtn", "#flexBtn"]) { await page.click(b); await page.screenshot({ path: `${out}/${b.slice(1)}.png` }); await page.click(`.screen:not([hidden]) [data-back]`); }
console.log("errors:", errors.length ? errors : "none");
await browser.close();
