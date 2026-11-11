import { createServer } from "node:http";
import { readFile, mkdir, readdir } from "node:fs/promises";
import { existsSync, createReadStream, statSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shots = join(root, "checks", "shots");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".txt": "text/plain",
};

const fails = [];
function ok(name) {
  console.log("PASS  " + name);
}
function fail(name, detail) {
  fails.push(name + (detail ? ": " + detail : ""));
  console.log("FAIL  " + name + (detail ? " — " + detail : ""));
}

const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]);
  if (path === "/") path = "/index.html";
  const file = join(root, path.replace(/^\/+/, ""));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const base = "http://127.0.0.1:" + port + "/";

await mkdir(shots, { recursive: true });
const browser = await chromium.launch();

async function overflow(page, width) {
  return page.evaluate((w) => {
    const doc = document.documentElement;
    const body = document.body;
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      innerWidth: window.innerWidth,
      width: w,
    };
  }, width);
}

async function headerTop(page) {
  return page.locator("header.site").evaluate((el) => el.getBoundingClientRect().top);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("tridan-theme", t);
    } catch (e) {}
  }, theme);
}

try {
  const htmlFiles = (await readdir(root)).filter((f) => f.endsWith(".html"));
  let noindexOk = true;
  for (const f of htmlFiles) {
    const html = await readFile(join(root, f), "utf8");
    if (!/name="robots"\s+content="noindex"/.test(html)) {
      noindexOk = false;
      fail("noindex meta", f);
    }
    if (/<select\b/i.test(html)) fail("native select", f);
    if (!/content="Website preview\."/.test(html)) fail("meta description", f);
  }
  if (noindexOk) ok("noindex meta on every page (" + htmlFiles.join(", ") + ")");
  const robots = await readFile(join(root, "robots.txt"), "utf8");
  if (/User-agent:\s*\*\s*Disallow:\s*\//i.test(robots)) ok("robots.txt Disallow");
  else fail("robots.txt Disallow");
  if (/overflow-x\s*:\s*hidden/.test(await readFile(join(root, "styles.css"), "utf8"))) {
    fail("overflow-x hidden in CSS");
  } else ok("overflow-x uses clip, not hidden");

  const page = await browser.newPage();

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(200);
    const top = await headerTop(page);
    if (Math.abs(top) < 1) ok("sticky header top===0 @ " + width + " after 1500px scroll");
    else fail("sticky header @ " + width, "top=" + top);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  const sunBefore = await page.locator(".icon-sun").evaluate((el) => getComputedStyle(el).opacity);
  const moonBefore = await page.locator(".icon-moon").evaluate((el) => getComputedStyle(el).opacity);
  await page.locator("#theme-toggle").click();
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  const sunAfter = await page.locator(".icon-sun").evaluate((el) => getComputedStyle(el).opacity);
  const moonAfter = await page.locator(".icon-moon").evaluate((el) => getComputedStyle(el).opacity);
  if (before !== after && (after === "light" || after === "dark")) ok("toggle flips html[data-theme] (" + before + " → " + after + ")");
  else fail("toggle data-theme", before + " → " + after);
  const flipped =
    (Number(sunBefore) < 0.5 && Number(sunAfter) > 0.5) ||
    (Number(moonBefore) < 0.5 && Number(moonAfter) > 0.5) ||
    (Number(sunBefore) > 0.5 && Number(sunAfter) < 0.5);
  if (flipped) ok("toggle swaps visible icon");
  else fail("toggle icon swap", JSON.stringify({ sunBefore, moonBefore, sunAfter, moonAfter }));

  const chips = page.locator(".day-chips .chip");
  const n = await chips.count();
  if (n === 14) ok("14 date chips");
  else fail("14 date chips", "count=" + n);
  let weekendOk = true;
  let weekendCount = 0;
  for (let i = 0; i < n; i++) {
    const chip = chips.nth(i);
    const disabled = await chip.isDisabled();
    const date = await chip.getAttribute("data-date");
    const [y, m, d] = date.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const weekend = dow === 0 || dow === 6;
    if (weekend) weekendCount++;
    if (weekend && !disabled) weekendOk = false;
    if (!weekend && disabled) weekendOk = false;
  }
  if (weekendOk && weekendCount > 0) ok("weekends disabled (" + weekendCount + ")");
  else fail("weekends disabled", JSON.stringify({ weekendOk, weekendCount }));

  const pills = await page.locator(".time-pills .pill").allTextContents();
  const joined = pills.map((t) => t.trim()).join("|");
  if (joined === "Morning|Midday|Afternoon") ok("time pills Morning/Midday/Afternoon");
  else fail("time pills", joined);

  await page.locator("#b-name").fill("Alex Test");
  await page.locator("#b-phone").fill("0732818081");
  await page.locator(".book-form button[type=submit]").click();
  await page.locator("#book-success").waitFor({ state: "visible" });
  const success = (await page.locator("#book-success-line").textContent() || "").trim();
  const successBan = /(email|calendar|call you|follow-?up|does not send|stay on this page)/i;
  if (success && !successBan.test(success)) ok("booking success restates summary");
  else fail("booking success", success);
  await page.screenshot({ path: join(shots, "booking-success.png"), fullPage: false });

  await page.goto(base + "#lb", { waitUntil: "networkidle" });
  const lb = await page.locator("#lb").evaluate((el) => getComputedStyle(el).display);
  if (lb === "flex") ok("lightbox opens via :target");
  else fail("lightbox :target", "display=" + lb);

  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(base, { waitUntil: "networkidle" });
    const o = await overflow(page, width);
    if (o.scrollWidth <= o.innerWidth + 1) ok("no overflow @ " + width);
    else fail("overflow @ " + width, JSON.stringify(o));
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  const callBtn = page.locator(".hero .cta .btn-accent");
  const callStyle = await callBtn.evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, bg: s.backgroundColor, visibility: s.visibility, opacity: s.opacity };
  });
  if (callStyle.visibility !== "hidden" && Number(callStyle.opacity) > 0.9 && callStyle.bg !== "rgba(0, 0, 0, 0)") {
    ok("390 Call button visibly styled");
  } else fail("390 Call button", JSON.stringify(callStyle));
  const bar = page.locator(".sticky-call");
  const barDisp = await bar.evaluate((el) => getComputedStyle(el).display);
  if (barDisp !== "none") ok("390 sticky Call|Quote bar visible");
  else fail("390 sticky bar hidden");

  await page.evaluate(() => window.scrollTo(0, 0));
  const gap = await page.evaluate(() => {
    const header = document.querySelector("header.site").getBoundingClientRect();
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const bar = document.querySelector(".sticky-call").getBoundingClientRect();
    return {
      above: hero.top - header.bottom,
      below: bar.top - hero.bottom,
      heroH: hero.height,
      vh: window.innerHeight,
    };
  });
  if (gap.above > -2 && gap.above < 4 && gap.below > -8) ok("390 no blank gap around hero");
  else fail("390 hero gaps", JSON.stringify(gap));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  const visible = await page.evaluate(() => document.body.innerText);
  const allowedSlots = visible.replace(/Your photo here/g, "");
  const bans = [
    /\bTODO\b/i,
    /\bplaceholder\b/i,
    /\bsample\b/i,
    /\bdemo\b/i,
    /\btemplate\b/i,
    /\billustrative\b/i,
    /\bwireframe\b/i,
    /\bbrief\b/i,
    /\bL-\d+/i,
    /\bbot\b/i,
    /\bAI\b/,
    /does not send/i,
    /no online price/i,
    /stay on this page/i,
    /Shed 3/i,
    /Briggs/i,
    /\bABN\b/,
    /confirmation email/i,
    /arrives in your email/i,
    /\bconcept\b/i,
    /\bvendor\b/i,
    /\bbot\b/i,
    /\btool\b/i,
  ];
  const hits = bans.filter((re) => re.test(allowedSlots)).map((re) => String(re));
  if (hits.length === 0) ok("banned-text scan");
  else fail("banned-text scan", hits.join(", "));

  async function contrastReport(theme) {
    await setTheme(page, theme);
    await page.waitForTimeout(400);
    return page.evaluate((themeName) => {
      function parse(c) {
        const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
      }
      function lin(c) {
        c = c / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }
      function lum(p) {
        return 0.2126 * lin(p.r) + 0.7152 * lin(p.g) + 0.0722 * lin(p.b);
      }
      function blend(fg, bg) {
        const a = fg.a;
        return {
          r: fg.r * a + bg.r * (1 - a),
          g: fg.g * a + bg.g * (1 - a),
          b: fg.b * a + bg.b * (1 - a),
          a: 1,
        };
      }
      function ratio(fg, bg) {
        const L1 = lum(fg), L2 = lum(bg);
        const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
        return (hi + 0.05) / (lo + 0.05);
      }
      function bgOf(el) {
        let n = el;
        while (n && n !== document.documentElement) {
          const b = parse(getComputedStyle(n).backgroundColor);
          if (b && b.a > 0.01) return b;
          n = n.parentElement;
        }
        return parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
      }
      const fails = [];
      const named = {};
      const els = document.querySelectorAll("body *");
      els.forEach((el) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) < 0.5) return;
        if (el.closest("[hidden]")) return;
        if (el.tagName === "SCRIPT" || el.tagName === "STYLE" || el.tagName === "SVG" || el.tagName === "PATH" || el.tagName === "IMG") return;
        const text = (el.childNodes && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) || el.matches("button, a, .kicker, .btn, .pill, .chip");
        if (!text) return;
        const fg = parse(s.color);
        if (!fg) return;
        const bg = bgOf(el);
        const mixed = fg.a < 1 ? blend(fg, bg) : fg;
        const r = ratio(mixed, bg);
        const label = (el.className && String(el.className).split(" ")[0]) || el.tagName;
        const t = (el.textContent || "").trim().slice(0, 40);
        if (r < 4.5 && t) fails.push({ theme: themeName, label, t, r: +r.toFixed(2), color: s.color, bg: s.backgroundColor });
      });
      function pair(sel, name) {
        const el = document.querySelector(sel);
        if (!el) return;
        const s = getComputedStyle(el);
        const fg = parse(s.color);
        const bg = bgOf(el);
        named[name] = { color: s.color, bg: "rgb(" + Math.round(bg.r) + ", " + Math.round(bg.g) + ", " + Math.round(bg.b) + ")", ratio: +ratio(fg, bg).toFixed(2) };
      }
      pair(".hero .kicker", "hero kicker");
      pair(".section.paper .kicker", "services kicker");
      pair(".section.wash .kicker", "about kicker");
      pair(".hero .cta .btn-accent", "hero Call");
      pair(".hero .cta .btn-ghost-light", "hero quote ghost");
      pair(".actions .btn-accent", "header Request a quote");
      pair(".sticky-call a.call", "mobile Call");
      pair(".book-form .btn-accent", "Book button");
      return { theme: themeName, named, fails: fails.slice(0, 20), failCount: fails.length };
    }, theme);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  const lightC = await contrastReport("light");
  const darkC = await contrastReport("dark");
  console.log("CONTRAST light", JSON.stringify(lightC.named, null, 2));
  console.log("CONTRAST dark", JSON.stringify(darkC.named, null, 2));
  if (lightC.failCount === 0) ok("contrast all text pairs light ≥ 4.5:1");
  else fail("contrast light", JSON.stringify(lightC.fails));
  if (darkC.failCount === 0) ok("contrast all text pairs dark ≥ 4.5:1");
  else fail("contrast dark", JSON.stringify(darkC.fails));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  await setTheme(page, "light");
  await page.screenshot({ path: join(shots, "desktop-1440-light.png"), fullPage: true });
  await setTheme(page, "dark");
  await page.screenshot({ path: join(shots, "desktop-1440-dark.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await setTheme(page, "light");
  await page.screenshot({ path: join(shots, "mobile-390-light.png"), fullPage: true });
  await setTheme(page, "dark");
  await page.screenshot({ path: join(shots, "mobile-390-dark.png"), fullPage: true });
  ok("screenshots written to checks/shots/");
} finally {
  await browser.close();
  server.close();
}

if (fails.length) {
  console.log("\nRESULT FAIL (" + fails.length + ")");
  fails.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("\nRESULT PASS");
