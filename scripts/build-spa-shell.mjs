// Renders the SPA shell in-process after `vite build` (no local HTTP server),
// so the build works on hosts like Hostinger that block localhost ports.
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

process.env.TSS_SHELL = "true";
// Nitro may emit to .output/ (Hostinger/Node preset) or dist/ (Cloudflare preset).
const serverCandidates = [".output/server/index.mjs", "dist/server/index.mjs"];
const serverFile = serverCandidates.map((p) => path.resolve(p)).find((p) => existsSync(p));
if (!serverFile) throw new Error(`Server bundle not found in: ${serverCandidates.join(", ")}`);
const clientDir = serverFile.includes(`${path.sep}.output${path.sep}`)
  ? path.resolve(".output/public")
  : path.resolve("dist/client");

const mod = await import(pathToFileURL(serverFile).href);
const handler = mod.default ?? mod;
const fetchFn = typeof handler.fetch === "function" ? handler.fetch.bind(handler) : handler;
const res = await fetchFn(
  new Request("http://localhost/", { headers: { "X-TSS_SHELL": "true" } }),
  {},
  { waitUntil() {}, passThroughOnException() {} },
);
if (!res.ok) throw new Error(`Shell render failed: ${res.status}`);
const html = await res.text();
await mkdir(clientDir, { recursive: true });
await writeFile(path.join(clientDir, "_shell.html"), html);
await writeFile(path.join(clientDir, "index.html"), html);
console.log(`[spa-shell] wrote ${clientDir}/_shell.html and index.html`);
process.exit(0);
