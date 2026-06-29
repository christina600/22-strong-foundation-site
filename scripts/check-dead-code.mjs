/**
 * Small first-party dead-code check for the Astro app graph.
 *
 * This is intentionally conservative. It follows relative imports from page
 * entrypoints, layout imports, and CSS @imports, then reports unreferenced
 * first-party components/scripts/styles plus unused runtime dependencies.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, extname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const srcDir = join(rootDir, "src");
const packageJson = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
const reachable = new Set();
const bareImports = new Set();
const findings = [];

function collectAstroPages(dir) {
  if (!existsSync(dir)) return [];

  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      pages.push(...collectAstroPages(full));
    } else if (extname(full) === ".astro") {
      pages.push(full);
    }
  }

  return pages;
}

const entryFiles = [
  ...collectAstroPages(join(srcDir, "pages")),
  join(rootDir, "astro.config.mjs"),
].filter(existsSync);

function walk(dir, visitor) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "__tests__" || entry === "assets") continue;
      walk(full, visitor);
    } else {
      visitor(full);
    }
  }
}

function normalize(file) {
  return resolve(file);
}

function packageName(specifier) {
  if (specifier.startsWith("astro:")) return "astro";
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function resolveRelative(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.astro`,
    `${base}.ts`,
    `${base}.js`,
    `${base}.mjs`,
    `${base}.json`,
    `${base}.css`,
    join(base, "index.astro"),
    join(base, "index.ts"),
    join(base, "index.js"),
  ];
  return candidates.find(existsSync);
}

function importSpecifiers(source) {
  const specs = [];

  for (const match of source.matchAll(/import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g)) {
    specs.push(match[1]);
  }
  for (const match of source.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    specs.push(match[1]);
  }
  for (const match of source.matchAll(/@import\s+["']([^"']+)["']/g)) {
    specs.push(match[1]);
  }

  return specs;
}

function visit(file) {
  const resolved = normalize(file);
  if (reachable.has(resolved)) return;
  reachable.add(resolved);

  if (!existsSync(resolved) || statSync(resolved).isDirectory()) return;
  const source = readFileSync(resolved, "utf8");

  for (const specifier of importSpecifiers(source)) {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      const child = resolveRelative(resolved, specifier);
      if (child) visit(child);
    } else {
      bareImports.add(packageName(specifier));
    }
  }
}

entryFiles.forEach(visit);

const candidateRoots = [
  join(srcDir, "components"),
  join(srcDir, "scripts"),
  join(srcDir, "styles"),
  join(srcDir, "utils"),
];

for (const candidateRoot of candidateRoots) {
  walk(candidateRoot, (file) => {
    if (![".astro", ".ts", ".js", ".mjs", ".css"].includes(extname(file))) return;
    if (!reachable.has(normalize(file))) {
      findings.push(`unreachable first-party file: ${relative(rootDir, file)}`);
    }
  });
}

for (const dependency of Object.keys(packageJson.dependencies ?? {})) {
  if (!bareImports.has(dependency)) {
    findings.push(`runtime dependency is not used by the reachable app graph: ${dependency}`);
  }
}

if (findings.length === 0) {
  console.log("All clear - no unreachable first-party files or unused runtime dependencies found.");
} else {
  console.log("Found dead-code candidate(s):\n");
  for (const finding of findings) console.log(`  [dead-code] ${finding}`);
  process.exit(1);
}
