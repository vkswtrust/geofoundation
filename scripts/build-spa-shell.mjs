import { copyFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const clientDir = path.resolve(".output/public");
const sourceDir = path.resolve("dist/client");

if (!existsSync(sourceDir)) {
  throw new Error(`Client build directory not found: ${sourceDir}`);
}

await mkdir(clientDir, { recursive: true });

// Copy the complete client build into Nitro's public directory.
async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });

  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

await copyDirectory(sourceDir, clientDir);

console.log(`[spa-shell] copied client build to ${clientDir}`);
console.log("[spa-shell] build completed successfully");
