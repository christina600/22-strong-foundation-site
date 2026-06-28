/**
 * Check that automatically loaded external resources are compatible with the
 * Netlify CSP in public/_headers.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const headersPath = join(rootDir, "public", "_headers");
const scanRoots = ["src/layouts", "src/pages", "src/components", "src/scripts", "src/styles"];
const findings = [];
const resources = [];

const headers = readFileSync(headersPath, "utf8");
const csp = headers.match(/Content-Security-Policy:\s*([^\n]+)/)?.[1]?.trim();

if (!csp) {
  console.log("Missing Content-Security-Policy in public/_headers.");
  process.exit(1);
}

const directives = new Map(
  csp.split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, ...tokens] = part.split(/\s+/);
      return [name, tokens];
    })
);

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__") continue;
      walk(full);
      continue;
    }
    if (/\.(astro|ts|js|mjs|css)$/.test(entry)) scanFile(full);
  }
}

function attrValue(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|\\{\`([^\`]+)\`\\}|\\{["']([^"']+)["']\\})`, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[4] ?? "";
}

function lineFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function addResource(file, source, index, directive, kind, url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
  if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1") return;

  resources.push({
    file: relative(rootDir, file),
    line: lineFor(source, index),
    directive,
    kind,
    origin: parsed.origin,
    url,
  });
}

function scanFile(file) {
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(/<script\b[^>]*>/gis)) {
    const url = attrValue(match[0], "src");
    if (url) addResource(file, source, match.index ?? 0, "script-src", "script src", url);
  }

  for (const match of source.matchAll(/\bscript\.src\s*=\s*["']([^"']+)["']/gi)) {
    addResource(file, source, match.index ?? 0, "script-src", "script.src assignment", match[1]);
  }

  for (const match of source.matchAll(/<link\b[^>]*>/gis)) {
    const rel = attrValue(match[0], "rel").toLowerCase();
    const url = attrValue(match[0], "href");
    if (!url) continue;
    if (rel.split(/\s+/).includes("stylesheet")) {
      addResource(file, source, match.index ?? 0, "style-src", "stylesheet", url);
    }
  }

  for (const match of source.matchAll(/\b(?:fetch|sendBeacon|EventSource|WebSocket)\s*\(\s*["']([^"']+)["']/gi)) {
    addResource(file, source, match.index ?? 0, "connect-src", "client network call", match[1]);
  }

  if (file.endsWith(".css")) {
    for (const match of source.matchAll(/url\(["']?(https?:\/\/[^"')\s]+)["']?\)/gi)) {
      addResource(file, source, match.index ?? 0, "img-src", "css url", match[1]);
    }
  }
}

function directiveTokens(name) {
  return directives.get(name) ?? directives.get("default-src") ?? [];
}

function isAllowed(origin, directive) {
  const url = new URL(origin);
  const tokens = directiveTokens(directive);

  return tokens.some((token) => (
    token === "*" ||
    token === `${url.protocol}` ||
    token === origin ||
    token === `${url.protocol}//${url.hostname}` ||
    token === `${url.protocol}//*.${url.hostname}` ||
    token === "'self'" && false
  ));
}

for (const scanRoot of scanRoots) walk(join(rootDir, scanRoot));

for (const resource of resources) {
  if (!isAllowed(resource.origin, resource.directive)) findings.push(resource);
}

if (findings.length === 0) {
  console.log("All clear - automatic external resources match the configured CSP.");
} else {
  console.log("Found automatic external resources blocked by CSP:\n");
  for (const finding of findings) {
    console.log(`  [csp] ${finding.file}:${finding.line} ${finding.kind}`);
    console.log(`        ${finding.directive} does not allow ${finding.origin}`);
    console.log(`        ${finding.url}`);
  }
  process.exit(1);
}
