/**
 * Static guard for automatic third-party page-load requests.
 *
 * This intentionally ignores ordinary outbound <a href="https://..."> links:
 * those are user-initiated. It flags resources that a page can load by itself,
 * such as scripts, stylesheets, preconnects, media, iframes, CSS urls, and
 * client-side fetch/beacon calls.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const scanRoots = ["src/layouts", "src/pages", "src/components", "src/scripts", "src/styles"];
const fileExtensions = new Set([".astro", ".ts", ".js", ".mjs", ".css"]);
const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__") continue;
      walk(full);
      continue;
    }

    if (fileExtensions.has(extname(entry))) scanFile(full);
  }
}

function extname(fileName) {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index);
}

function lineFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function isExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function addFinding(file, source, index, kind, url) {
  if (!isExternalUrl(url)) return;

  const parsed = new URL(url);
  if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1") {
    return;
  }

  findings.push({
    file: relative(rootDir, file),
    line: lineFor(source, index),
    kind,
    url,
  });
}

function attrValue(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|\\{\`([^\`]+)\`\\}|\\{["']([^"']+)["']\\})`, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[4] ?? "";
}

function scanFile(file) {
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(/<script\b[^>]*>/gis)) {
    const url = attrValue(match[0], "src");
    if (url) addFinding(file, source, match.index ?? 0, "script src", url);
  }

  for (const match of source.matchAll(/\bscript\.src\s*=\s*["']([^"']+)["']/gi)) {
    addFinding(file, source, match.index ?? 0, "script.src assignment", match[1]);
  }

  for (const match of source.matchAll(/<link\b[^>]*>/gis)) {
    const rel = attrValue(match[0], "rel").toLowerCase();
    const url = attrValue(match[0], "href");
    const automaticRels = ["stylesheet", "preconnect", "dns-prefetch", "preload", "modulepreload"];
    if (url && automaticRels.some((token) => rel.split(/\s+/).includes(token))) {
      addFinding(file, source, match.index ?? 0, `link rel="${rel}"`, url);
    }
  }

  for (const match of source.matchAll(/<(?:img|source|video|audio|iframe|embed|object)\b[^>]*>/gis)) {
    const url = attrValue(match[0], "src") || attrValue(match[0], "poster") || attrValue(match[0], "data");
    if (url) addFinding(file, source, match.index ?? 0, "embedded media", url);
  }

  for (const match of source.matchAll(/\b(?:fetch|sendBeacon|EventSource|WebSocket)\s*\(\s*["']([^"']+)["']/gi)) {
    addFinding(file, source, match.index ?? 0, "client network call", match[1]);
  }

  for (const match of source.matchAll(/\bXMLHttpRequest\b[\s\S]{0,200}\.open\s*\(\s*["'][A-Z]+["']\s*,\s*["']([^"']+)["']/gi)) {
    addFinding(file, source, match.index ?? 0, "XMLHttpRequest call", match[1]);
  }

  if (file.endsWith(".css")) {
    for (const match of source.matchAll(/@import\s+(?:url\()?["']?([^"')\s]+)["']?\)?/gi)) {
      addFinding(file, source, match.index ?? 0, "css import", match[1]);
    }
    for (const match of source.matchAll(/url\(["']?(https?:\/\/[^"')\s]+)["']?\)/gi)) {
      addFinding(file, source, match.index ?? 0, "css url", match[1]);
    }
  }
}

for (const scanRoot of scanRoots) walk(join(rootDir, scanRoot));

if (findings.length === 0) {
  console.log("All clear - no automatic third-party page-load requests found.");
} else {
  console.log("Found automatic third-party page-load request(s):\n");
  for (const finding of findings) {
    console.log(`  [external] ${finding.file}:${finding.line} ${finding.kind}`);
    console.log(`             ${finding.url}`);
  }
  console.log("\nRemove these, self-host them, or gate them behind an explicit approved integration.");
  process.exit(1);
}
