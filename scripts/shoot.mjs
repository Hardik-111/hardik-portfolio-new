/**
 * Screenshot harness for local design review.
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 * Drives the system Chrome over the DevTools protocol so there is no
 * browser download and no extra dependency in package.json.
 */
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import os from "node:os";
import WebSocket from "ws";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const OUT = process.argv[3] ?? ".screens";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;

const SHOTS = [
  { name: "01-hero", y: 0, width: 1440, height: 900 },
  { name: "02-metrics", selector: "#metrics", width: 1440, height: 900 },
  { name: "03-about", selector: "#about", width: 1440, height: 1100 },
  { name: "04-skills", selector: "#skills", width: 1440, height: 1100 },
  { name: "05-experience", selector: "#experience", width: 1440, height: 1100 },
  { name: "06-projects", selector: "#projects", width: 1440, height: 900 },
  { name: "07-architecture", selector: "#architecture", width: 1440, height: 1000 },
  { name: "08-expertise", selector: "#expertise", width: 1440, height: 1000 },
  { name: "09-github", selector: "#github", width: 1440, height: 1100 },
  { name: "10-contact", selector: "#contact", width: 1440, height: 1000 },
  { name: "11-mobile-hero", y: 0, width: 390, height: 844, mobile: true },
  { name: "12-mobile-about", selector: "#about", width: 390, height: 900, mobile: true },
  { name: "13-mobile-projects", selector: "#projects", width: 390, height: 900, mobile: true },
];

const profileDir = path.join(os.tmpdir(), `chrome-shoot-${Date.now()}`);

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profileDir}`,
  "--headless=new",
  "--hide-scrollbars",
  "--force-color-profile=srgb",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
]);
chrome.on("error", (error) => {
  console.error("failed to launch chrome:", error.message);
  process.exit(1);
});

async function cdpTargets() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      /* browser not up yet */
    }
    await sleep(250);
  }
  throw new Error("chrome devtools endpoint never came up");
}

class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      const entry = this.pending.get(msg.id);
      if (!entry) return;
      this.pending.delete(msg.id);
      msg.error ? entry.reject(new Error(msg.error.message)) : entry.resolve(msg.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

const target = await cdpTargets();
const ws = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 256 * 1024 * 1024 });
await new Promise((resolve) => ws.once("open", resolve));
const cdp = new Session(ws);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const shot of SHOTS) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: shot.width,
    height: shot.height,
    deviceScaleFactor: 1,
    mobile: Boolean(shot.mobile),
  });

  await cdp.send("Page.navigate", { url: BASE });
  // Hydration plus the hero's entrance timeline runs to roughly 4s headless.
  await sleep(5200);

  if (shot.selector) {
    // Pinned/lazy sections shift as things above them resolve, so scroll,
    // measure the residual offset, and correct until it settles.
    for (let pass = 0; pass < 3; pass++) {
      await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector("${shot.selector}");
          if (!el) return -1;
          const delta = el.getBoundingClientRect().top - ${shot.offset ?? 0};
          window.scrollBy(0, delta);
          return delta;
        })()`,
        returnByValue: true,
      });
      await sleep(pass === 0 ? 900 : 500);
    }
    // Let scroll-triggered animations settle before capturing.
    await sleep(2200);
  }

  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(OUT, `${shot.name}.png`), Buffer.from(data, "base64"));
  console.log("captured", shot.name);
}

const { result } = await cdp.send("Runtime.evaluate", {
  expression: `JSON.stringify({
    height: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth
  })`,
  returnByValue: true,
});
console.log("page:", result.value);

ws.close();
chrome.kill();
