/**
 * Validate local asset references used by content/components.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");
const imageMapPath = join(rootDir, "src", "assets", "images.ts");
const scanRoots = ["src/pages", "src/components", "src/content", "src/layouts"];
const assetRefs = new Map();
const errors = [];

function walk(dir, visitor) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__") continue;
      walk(full, visitor);
    } else {
      visitor(full);
    }
  }
}

function lineFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function addAssetRef(file, source, index, path) {
  if (!path.startsWith("/images/") && !path.startsWith("/video/") && !path.startsWith("/favicon")) return;
  if (!assetRefs.has(path)) assetRefs.set(path, []);
  assetRefs.get(path).push(`${relative(rootDir, file)}:${lineFor(source, index)}`);
}

function scanFile(file) {
  if (!/\.(astro|ts|js|mjs|json)$/.test(file)) return;
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/["'`](\/(?:images|video)\/[^"'`\s)]+|\/favicon\.[^"'`\s)]+)["'`]/g)) {
    addAssetRef(file, source, match.index ?? 0, match[1]);
  }
}

function parseImageMap() {
  const source = readFileSync(imageMapPath, "utf8");
  const mapKeys = new Set([...source.matchAll(/"([^"]+)":\s*[A-Za-z0-9_$]+/g)].map((match) => match[1]));
  const importedAssets = [...source.matchAll(/from\s+"([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("."))
    .map((value) => resolve(dirname(imageMapPath), value));

  for (const importedAsset of importedAssets) {
    if (!existsSync(importedAsset)) {
      errors.push(`src/assets/images.ts imports missing asset: ${relative(rootDir, importedAsset)}`);
    }
  }

  return mapKeys;
}

for (const scanRoot of scanRoots) walk(join(rootDir, scanRoot), scanFile);

const imageMapKeys = parseImageMap();

for (const [assetPath, locations] of assetRefs) {
  const publicPath = join(publicDir, assetPath.slice(1));
  if (!existsSync(publicPath) && !imageMapKeys.has(assetPath)) {
    errors.push(`${assetPath} is missing from public/ and src/assets/images.ts; referenced at ${locations.join(", ")}`);
  }
}

if (errors.length === 0) {
  console.log(`All clear - ${assetRefs.size} local asset reference(s) resolve.`);
} else {
  console.log("Found local asset reference problem(s):\n");
  for (const error of errors) console.log(`  [asset] ${error}`);
  process.exit(1);
}
