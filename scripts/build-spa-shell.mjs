// Renders the SPA shell in-process after `vite build` (no local HTTP server),
// so the build works on hosts like Hostinger that block localhost ports.
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

process.env.TSS_SHELL = "true";
const serverPath = pathToFileURL(path.resolve("dist/server/index.mjs")).href;
const { default: handler } = await import(serverPath);
const res = await handler.fetch(
  new Request("http://localhost/", { headers: { "X-TSS_SHELL": "true" } }),
  {},
  { waitUntil() {}, passThroughOnException() {} },
);
if (!res.ok) throw new Error(`Shell render failed: ${res.status}`);
const html = await res.text();
await writeFile("dist/client/_shell.html", html);
await writeFile("dist/client/index.html", html);
console.log("[spa-shell] wrote dist/client/_shell.html and index.html");
process.exit(0);
