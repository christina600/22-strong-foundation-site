/**
 * Launch-readiness content check.
 *
 * This is stricter than the everyday content wiring check. It flags draft
 * markers that are acceptable during development but should not ship.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const findings = [];
const phrasePattern = /\b(?:coming soon|not connected yet|sample testimonial)\b/i;

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function jsonStringIndex(source, value, state) {
  const encoded = JSON.stringify(value);
  let matches = state.stringMatches.get(encoded);

  if (!matches) {
    matches = [...source.matchAll(new RegExp(escapeRegExp(encoded), "g"))].map((match) => match.index ?? 0);
    state.stringMatches.set(encoded, matches);
  }

  const nextIndex = state.stringIndexes.get(encoded) ?? 0;
  state.stringIndexes.set(encoded, nextIndex + 1);
  return matches[nextIndex] ?? matches[0] ?? 0;
}

function scanJsonValue(value, file, source, state, path = "content") {
  if (typeof value === "string") {
    const match = value.match(phrasePattern);
    if (match) {
      const index = jsonStringIndex(source, value, state);
      findings.push(`${relative(rootDir, file)}:${lineFor(source, index === -1 ? 0 : index)} draft phrase "${match[0]}" at ${path}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanJsonValue(item, file, source, state, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    if (value.sample === true) {
      const index = state.sampleMatches[state.sampleIndex++] ?? 0;
      findings.push(`${relative(rootDir, file)}:${lineFor(source, index === -1 ? 0 : index)} sample content flag at ${path}.sample`);
    }
    for (const [key, child] of Object.entries(value)) scanJsonValue(child, file, source, state, `${path}.${key}`);
  }
}

function scanTextFile(file) {
  if (!/\.(astro|ts|js|mjs)$/.test(file)) return;
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(new RegExp(phrasePattern, "gi"))) {
    findings.push(`${relative(rootDir, file)}:${lineFor(source, match.index ?? 0)} draft phrase "${match[0]}"`);
  }
}

walk(join(rootDir, "src", "content"), (file) => {
  if (!file.endsWith(".json")) return;
  const source = readFileSync(file, "utf8");
  scanJsonValue(JSON.parse(source), file, source, {
    sampleIndex: 0,
    sampleMatches: [...source.matchAll(/"sample"\s*:\s*true/g)].map((match) => match.index ?? 0),
    stringIndexes: new Map(),
    stringMatches: new Map(),
  });
});

walk(join(rootDir, "src", "components"), scanTextFile);
walk(join(rootDir, "src", "scripts"), scanTextFile);

if (findings.length === 0) {
  console.log("All clear - no launch-blocking draft content found.");
} else {
  console.log("Found launch-blocking draft content marker(s):\n");
  for (const finding of findings) console.log(`  [launch-content] ${finding}`);
  process.exit(1);
}
