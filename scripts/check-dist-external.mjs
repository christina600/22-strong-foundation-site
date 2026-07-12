/**
 * Post-build guard: scan the built site (dist/) for third-party requests.
 *
 * The src-level scan (check-external-calls.mjs) can't see code that build
 * tooling or a compromised npm dependency injects at build time. This script
 * scans what actually ships:
 *
 *   - HTML: resources a page loads by itself (scripts, stylesheets,
 *     preconnects, media, iframes) plus network calls in inline scripts.
 *     Ordinary outbound <a href> links are user-initiated and ignored.
 *   - JS bundles: ANY external URL is flagged. The site's own bundles
 *     contain no network code, so any URL here is suspicious.
 *   - CSS: external @import and url() references.
 *
 * It also verifies the CSP script-src hashes in dist/_headers still match
 * the inline scripts Astro actually emitted, so a drifted hash fails CI
 * instead of silently breaking the live page.
 */

import { createHash } from "crypto";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const distDir = join(rootDir, "dist");

// Origins the built site is allowed to mention. schema.org appears in
// JSON-LD @context and www.w3.org in SVG/XML namespaces; neither is fetched.
const allowedOrigins = new Set([
  "https://22strongfoundation.com",
  "https://schema.org",
  "http://schema.org",
  "https://www.w3.org",
  "http://www.w3.org",
]);

const findings = [];

if (!existsSync(distDir)) {
  console.log("dist/ not found - run `npm run build` before this check.");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function lineFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function isAllowed(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return true; // relative URL - same-origin by definition
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return true;
  return allowedOrigins.has(parsed.origin);
}

function addFinding(file, source, index, kind, url) {
  if (isAllowed(url)) return;
  findings.push({ file: relative(rootDir, file), line: lineFor(source, index), kind, url });
}

function attrValue(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2] ?? "";
}

function scanCssSource(file, source) {
  for (const match of source.matchAll(/@import\s+(?:url\()?["']?([^"')\s]+)["']?\)?/gi)) {
    addFinding(file, source, match.index ?? 0, "css import", match[1]);
  }
  for (const match of source.matchAll(/url\(["']?(https?:\/\/[^"')\s]+)["']?\)/gi)) {
    addFinding(file, source, match.index ?? 0, "css url", match[1]);
  }
}

function scanJsFile(file) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/https?:\/\/[^\s"'`\\)<>]+/g)) {
    addFinding(file, source, match.index ?? 0, "url in js bundle", match[0]);
  }
}

const NON_EXECUTABLE_TYPES = new Set(["application/ld+json", "application/json"]);

function inlineScripts(source) {
  const scripts = [];
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1];
    if (attrValue(`<script ${attrs}>`, "src")) continue;
    const type = attrValue(`<script ${attrs}>`, "type").toLowerCase();
    scripts.push({
      index: match.index ?? 0,
      body: match[2],
      executable: !NON_EXECUTABLE_TYPES.has(type),
    });
  }
  return scripts;
}

function scanHtmlFile(file) {
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(/<script\b[^>]*>/gi)) {
    const url = attrValue(match[0], "src");
    if (url) addFinding(file, source, match.index ?? 0, "script src", url);
  }

  for (const match of source.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attrValue(match[0], "rel").toLowerCase();
    const url = attrValue(match[0], "href");
    const automaticRels = ["stylesheet", "preconnect", "dns-prefetch", "preload", "modulepreload", "prefetch"];
    if (url && automaticRels.some((token) => rel.split(/\s+/).includes(token))) {
      addFinding(file, source, match.index ?? 0, `link rel="${rel}"`, url);
    }
  }

  for (const match of source.matchAll(/<(?:img|source|video|audio|iframe|embed|object)\b[^>]*>/gi)) {
    const url = attrValue(match[0], "src") || attrValue(match[0], "poster") || attrValue(match[0], "data");
    if (url) addFinding(file, source, match.index ?? 0, "embedded media", url);
  }

  for (const script of inlineScripts(source)) {
    if (!script.executable) continue;
    for (const match of script.body.matchAll(/https?:\/\/[^\s"'`\\)<>]+/g)) {
      addFinding(file, source, script.index + (match.index ?? 0), "url in inline script", match[0]);
    }
  }

  for (const match of source.matchAll(/url\(["']?(https?:\/\/[^"')\s]+)["']?\)/gi)) {
    addFinding(file, source, match.index ?? 0, "css url in html", match[1]);
  }
}

const files = walk(distDir);
for (const file of files) {
  if (file.endsWith(".html")) scanHtmlFile(file);
  else if (file.endsWith(".js") || file.endsWith(".mjs")) scanJsFile(file);
  else if (file.endsWith(".css")) scanCssSource(file, readFileSync(file, "utf8"));
}

// --- CSP hash drift check -------------------------------------------------
// If the CSP pins inline scripts by hash (no 'unsafe-inline'), every
// executable inline script in the built HTML must have a matching hash,
// and every hash in the CSP must match a built script.

const headersPath = join(distDir, "_headers");
const cspErrors = [];

if (existsSync(headersPath)) {
  const csp = readFileSync(headersPath, "utf8").match(/Content-Security-Policy:\s*([^\n]+)/)?.[1] ?? "";
  const scriptSrc = csp.split(";").map((part) => part.trim()).find((part) => part.startsWith("script-src")) ?? "";
  const cspHashes = new Set(scriptSrc.match(/'sha256-[^']+'/g)?.map((token) => token.slice(1, -1)) ?? []);

  if (!scriptSrc.includes("'unsafe-inline'")) {
    const builtHashes = new Map();
    for (const file of files.filter((entry) => entry.endsWith(".html"))) {
      const source = readFileSync(file, "utf8");
      for (const script of inlineScripts(source)) {
        if (!script.executable) continue;
        const hash = `sha256-${createHash("sha256").update(script.body).digest("base64")}`;
        if (!builtHashes.has(hash)) builtHashes.set(hash, relative(rootDir, file));
      }
    }

    for (const [hash, file] of builtHashes) {
      if (!cspHashes.has(hash)) {
        cspErrors.push(`Inline script in ${file} is not allowed by the CSP. Add '${hash}' to script-src in public/_headers.`);
      }
    }
    for (const hash of cspHashes) {
      if (!builtHashes.has(hash)) {
        cspErrors.push(`CSP hash '${hash}' matches no built inline script. Remove it from script-src in public/_headers.`);
      }
    }
  }
} else {
  cspErrors.push("dist/_headers is missing - security headers would not deploy.");
}

// --- Report ----------------------------------------------------------------

if (findings.length === 0 && cspErrors.length === 0) {
  console.log("All clear - built output loads nothing from third-party domains and CSP hashes match.");
} else {
  if (findings.length > 0) {
    console.log("Found third-party reference(s) in the built output:\n");
    for (const finding of findings) {
      console.log(`  [dist] ${finding.file}:${finding.line} ${finding.kind}`);
      console.log(`         ${finding.url}`);
    }
    console.log("\nIf one of these is intentional, add its origin to allowedOrigins in scripts/check-dist-external.mjs.");
  }
  if (cspErrors.length > 0) {
    console.log("CSP hash drift:\n");
    for (const error of cspErrors) console.log(`  [csp] ${error}`);
  }
  process.exit(1);
}
