// Renders the static SPA shell in-process (no localhost server — Hostinger's
// build environment refuses local ports) and collects the files to upload.
import { cp, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

process.env.TSS_SHELL = "true";
process.env.TSS_PRERENDERING = "true";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const serverCandidates = [".output/server/index.mjs", "dist/server/index.mjs"].map((p) =>
  path.resolve(p),
);
const clientCandidates = [".output/public", "dist/client"].map((p) => path.resolve(p));

const serverEntry = serverCandidates.find((p) => existsSync(p));
const clientDir = clientCandidates.find((p) => existsSync(p));
if (!serverEntry) throw new Error(`[spa-shell] server bundle not found in ${serverCandidates.join(", ")}`);
if (!clientDir) throw new Error(`[spa-shell] client build not found in ${clientCandidates.join(", ")}`);

const mod = await import(pathToFileURL(serverEntry).href);
const handler = mod.default ?? mod;
const fetchFn = typeof handler === "function" ? handler : handler?.fetch?.bind(handler);
if (typeof fetchFn !== "function") throw new Error("[spa-shell] server bundle has no fetch handler");

const ctx = { waitUntil() {}, passThroughOnException() {} };
const response = await fetchFn(new Request("http://localhost/", { headers: { "X-TSS_SHELL": "true" } }), {}, ctx);
const html = await response.text();
if (!response.ok || !html.includes("<html")) {
  throw new Error(`[spa-shell] shell render failed (status ${response.status}): ${html.slice(0, 300)}`);
}

await writeFile(path.join(clientDir, "_shell.html"), html);
await writeFile(path.join(clientDir, "index.html"), html);

// Single, predictable upload folder for Hostinger: hostinger-upload/
const uploadDir = path.resolve("hostinger-upload");
await mkdir(uploadDir, { recursive: true });
await cp(clientDir, uploadDir, { recursive: true });

console.log(`[spa-shell] wrote _shell.html + index.html to ${clientDir}`);
console.log(`[spa-shell] upload the contents of ${uploadDir} to public_html`);
process.exit(0);
