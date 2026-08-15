/**
 * Evaluates an expression in the page and prints the result.
 *   node scripts/probe.mjs "<js expression>" [url] [waitMs] [width] [height]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import os from "node:os";
import WebSocket from "ws";

const EXPR = process.argv[2] ?? "document.title";
const URL_ = process.argv[3] ?? "http://127.0.0.1:4322";
const WAIT = Number(process.argv[4] ?? 3000);
const WIDTH = Number(process.argv[5] ?? 1440);
const HEIGHT = Number(process.argv[6] ?? 900);
const PORT = 9333;

const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(os.tmpdir(), `chrome-probe-${Date.now()}`)}`,
  "--headless=new",
  "--hide-scrollbars",
  "--disable-gpu",
  "--no-first-run",
  "about:blank",
]);

async function findTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      /* not ready */
    }
    await sleep(250);
  }
  throw new Error("no devtools target");
}

const target = await findTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 64 * 1024 * 1024 });
await new Promise((r) => ws.once("open", r));

let id = 0;
const pending = new Map();
ws.on("message", (raw) => {
  const msg = JSON.parse(raw.toString());
  const entry = pending.get(msg.id);
  if (!entry) return;
  pending.delete(msg.id);
  msg.error ? entry.reject(new Error(msg.error.message)) : entry.resolve(msg.result);
});
const send = (method, params = {}) => {
  const mid = ++id;
  ws.send(JSON.stringify({ id: mid, method, params }));
  return new Promise((resolve, reject) => pending.set(mid, { resolve, reject }));
};

const logs = [];
await send("Runtime.enable");
await send("Log.enable");
ws.on("message", (raw) => {
  const msg = JSON.parse(raw.toString());
  if (msg.method === "Log.entryAdded") logs.push(`[${msg.params.entry.level}] ${msg.params.entry.text}`);
  if (msg.method === "Runtime.exceptionThrown")
    logs.push(`[exception] ${msg.params.exceptionDetails.text}`);
});

await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.enable");
await send("Page.navigate", { url: URL_ });
await sleep(WAIT);

const { result, exceptionDetails } = await send("Runtime.evaluate", {
  expression: EXPR,
  returnByValue: true,
  awaitPromise: true,
});

if (exceptionDetails) console.error("EXCEPTION:", exceptionDetails.text, exceptionDetails.exception?.description);
else console.log(typeof result.value === "string" ? result.value : JSON.stringify(result.value, null, 2));

if (logs.length) console.log("\n--- console ---\n" + logs.join("\n"));

ws.close();
chrome.kill();
