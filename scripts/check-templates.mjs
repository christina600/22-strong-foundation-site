/**
 * Build-time check for TEMPLATE: placeholders.
 *
 * Run with: node scripts/check-templates.mjs
 *
 * Scans every .json file in src/content/ and flags any value
 * that still starts with "TEMPLATE:". This prevents you from
 * accidentally publishing a site with placeholder text.
 *
 * Exit code 0 = all clear, 1 = placeholders found.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const contentDir = join(__dirname, "..", "src", "content");

let found = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith(".json")) {
      checkFile(full);
    }
  }
}

function checkFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const rel = relative(contentDir, filePath);
  scanValue(data, rel, "");
}

function scanValue(value, file, path) {
  if (typeof value === "string") {
    if (value.startsWith("TEMPLATE:")) {
      found++;
      console.log(`  [TEMPLATE] ${file} -> ${path || "(root)"}`);
      console.log(`             "${value.slice(0, 80)}${value.length > 80 ? "..." : ""}"`);
      console.log();
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => scanValue(item, file, `${path}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [key, val] of Object.entries(value)) {
      scanValue(val, file, path ? `${path}.${key}` : key);
    }
  }
}

console.log("Scanning content for TEMPLATE: placeholders...\n");
walk(contentDir);

if (found === 0) {
  console.log("All clear — no TEMPLATE: placeholders found.");
} else {
  console.log(`Found ${found} TEMPLATE: placeholder(s). Replace them before publishing.`);
  process.exit(1);
}
