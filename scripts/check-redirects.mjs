/**
 * Catch netlify.toml redirects that silently do nothing.
 *
 * Netlify only applies a redirect when no real file exists at the "from"
 * path (unless force = true). So a redirect away from a route that the
 * build still generates is dead config: visitors get the page, not the
 * redirect. Fail loudly so the mismatch gets resolved on purpose —
 * either delete the page, delete the redirect, or set force = true.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const pagesDir = join(rootDir, "src", "pages");
const tomlPath = join(rootDir, "netlify.toml");
const errors = [];

function parseRedirects(source) {
  const redirects = [];
  const blocks = source.split(/\[\[redirects\]\]/).slice(1);
  for (const block of blocks) {
    // Each block runs until the next table header or end of file.
    const body = block.split(/\n\s*\[/)[0];
    const from = body.match(/from\s*=\s*"([^"]+)"/)?.[1];
    const force = /force\s*=\s*true/.test(body);
    if (from) redirects.push({ from, force });
  }
  return redirects;
}

function routeHasPage(fromPath) {
  const route = fromPath.replace(/^\/|\/$/g, "");
  if (route === "" || route.includes(":") || route.includes("*")) return false;
  return (
    existsSync(join(pagesDir, `${route}.astro`)) ||
    existsSync(join(pagesDir, route, "index.astro")) ||
    existsSync(join(pagesDir, `${route}.md`)) ||
    existsSync(join(pagesDir, route, "index.md"))
  );
}

const redirects = parseRedirects(readFileSync(tomlPath, "utf8"));

for (const redirect of redirects) {
  if (redirect.force) continue;
  if (routeHasPage(redirect.from)) {
    errors.push(
      `netlify.toml redirects "${redirect.from}" elsewhere, but src/pages still builds a real page there — ` +
        `Netlify will serve the page and ignore the redirect. Remove the redirect, remove the page, or add force = true.`
    );
  }
}

if (errors.length === 0) {
  console.log(`All clear - ${redirects.length} redirect(s) checked against src/pages.`);
} else {
  console.log("Found redirect problem(s):\n");
  for (const error of errors) console.log(`  [redirect] ${error}`);
  process.exit(1);
}
