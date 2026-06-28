/**
 * Validate same-page anchor links against rendered/static section ids.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const sourceRoots = ["src/pages", "src/components", "src/layouts"];
const contentRoots = ["src/content"];
const ids = new Set();
const links = [];

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

function addLink(file, source, index, href) {
  const target = href.slice(1);
  if (!target) return;
  links.push({
    file: relative(rootDir, file),
    line: lineFor(source, index),
    href,
    target: decodeURIComponent(target),
  });
}

function scanAstro(file) {
  if (!file.endsWith(".astro")) return;
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(/\bid\s*=\s*"([^"]+)"/g)) {
    ids.add(match[1]);
  }
  for (const match of source.matchAll(/\bhref\s*=\s*"#[^"]+"/g)) {
    const href = match[0].match(/"([^"]+)"/)?.[1] ?? "";
    addLink(file, source, match.index ?? 0, href);
  }
}

function scanContentValue(value, file, source, path = "content") {
  if (typeof value === "string") {
    if (value.startsWith("#")) {
      const index = source.indexOf(JSON.stringify(value));
      addLink(file, source, index === -1 ? 0 : index, value);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanContentValue(item, file, source, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    if (typeof value.id === "string") ids.add(value.id);
    if (typeof value.voicesId === "string") ids.add(value.voicesId);
    for (const [key, child] of Object.entries(value)) {
      scanContentValue(child, file, source, `${path}.${key}`);
    }
  }
}

for (const sourceRoot of sourceRoots) walk(join(rootDir, sourceRoot), scanAstro);
for (const contentRoot of contentRoots) {
  walk(join(rootDir, contentRoot), (file) => {
    if (!file.endsWith(".json")) return;
    const source = readFileSync(file, "utf8");
    scanContentValue(JSON.parse(source), file, source);
  });
}

const missing = links.filter((link) => !ids.has(link.target));

if (missing.length === 0) {
  console.log(`All clear - ${links.length} same-page anchor link(s) resolve.`);
} else {
  console.log("Found same-page anchor link(s) without matching ids:\n");
  for (const link of missing) {
    console.log(`  [anchor] ${link.file}:${link.line} ${link.href}`);
  }
  process.exit(1);
}
