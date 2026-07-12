/**
 * Live-site guard: fetch the deployed site and fail if any page auto-loads
 * a resource from a foreign domain.
 *
 * The repo checks (check-external-calls.mjs, check-dist-external.mjs) can
 * never see what the host injects at the edge - e.g. a snippet added in the
 * Netlify dashboard, or a stale/hijacked deploy. This script audits what
 * visitors actually receive.
 *
 * Pages are discovered from the sitemap (falling back to same-domain links
 * on the homepage). For each page it flags scripts, stylesheets, preconnects,
 * media, and iframes pointing at foreign domains, plus Set-Cookie response
 * headers. The site's own JS bundles are downloaded and scanned for any
 * external URL. Ordinary outbound <a href> links are user-initiated and
 * ignored.
 *
 * Usage: node scripts/check-live-external.mjs [site-url]
 */

const siteUrl = new URL(process.argv[2] ?? "https://22strongfoundation.com");

// schema.org appears in JSON-LD @context and www.w3.org in SVG/XML
// namespaces; neither is fetched by the browser.
const allowedOrigins = new Set([
  siteUrl.origin,
  "https://schema.org",
  "http://schema.org",
  "https://www.w3.org",
  "http://www.w3.org",
]);

const findings = [];

function isAllowed(url, baseUrl) {
  let parsed;
  try {
    parsed = new URL(url, baseUrl);
  } catch {
    return true;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return true;
  return allowedOrigins.has(parsed.origin);
}

function addFinding(page, kind, url) {
  findings.push({ page, kind, url });
}

function attrValue(tag, attr) {
  const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2] ?? "";
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return { body: await response.text(), response };
}

function scanHtml(page, source) {
  const scriptSrcs = [];

  for (const match of source.matchAll(/<script\b[^>]*>/gi)) {
    const url = attrValue(match[0], "src");
    if (!url) continue;
    if (isAllowed(url, page)) scriptSrcs.push(new URL(url, page).href);
    else addFinding(page, "script src", url);
  }

  for (const match of source.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attrValue(match[0], "rel").toLowerCase();
    const url = attrValue(match[0], "href");
    const automaticRels = ["stylesheet", "preconnect", "dns-prefetch", "preload", "modulepreload", "prefetch"];
    if (url && automaticRels.some((token) => rel.split(/\s+/).includes(token)) && !isAllowed(url, page)) {
      addFinding(page, `link rel="${rel}"`, url);
    }
  }

  for (const match of source.matchAll(/<(?:img|source|video|audio|iframe|embed|object)\b[^>]*>/gi)) {
    const url = attrValue(match[0], "src") || attrValue(match[0], "poster") || attrValue(match[0], "data");
    if (url && !isAllowed(url, page)) addFinding(page, "embedded media", url);
  }

  for (const match of source.matchAll(/url\(["']?(https?:\/\/[^"')\s]+)["']?\)/gi)) {
    if (!isAllowed(match[1], page)) addFinding(page, "css url", match[1]);
  }

  return scriptSrcs;
}

async function discoverPages() {
  const pages = new Set([siteUrl.href]);

  try {
    const { body: indexXml } = await fetchText(new URL("/sitemap-index.xml", siteUrl).href);
    const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    for (const sitemapUrl of sitemapUrls) {
      const { body: sitemapXml } = await fetchText(sitemapUrl);
      for (const match of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        if (new URL(match[1]).origin === siteUrl.origin) pages.add(match[1]);
      }
    }
  } catch {
    // No sitemap (e.g. the pre-launch holding page) - fall back to
    // same-domain links found on the homepage.
    try {
      const { body } = await fetchText(siteUrl.href);
      for (const match of body.matchAll(/<a\b[^>]*>/gi)) {
        const href = attrValue(match[0], "href");
        if (!href) continue;
        try {
          const resolved = new URL(href, siteUrl);
          if (resolved.origin === siteUrl.origin) pages.add(resolved.href.split("#")[0]);
        } catch { /* mailto:, tel:, etc. */ }
      }
    } catch { /* homepage fetch failure is reported below */ }
  }

  return [...pages];
}

const pages = await discoverPages();
console.log(`Auditing ${pages.length} page(s) on ${siteUrl.origin} ...`);

const jsBundles = new Set();
let fetchFailures = 0;

for (const page of pages) {
  try {
    const { body, response } = await fetchText(page);
    if (response.headers.get("set-cookie")) {
      addFinding(page, "set-cookie response header", response.headers.get("set-cookie"));
    }
    for (const bundle of scanHtml(page, body)) jsBundles.add(bundle);
  } catch (error) {
    fetchFailures += 1;
    console.log(`  [error] could not fetch ${page}: ${error.message}`);
  }
}

for (const bundle of jsBundles) {
  try {
    const { body } = await fetchText(bundle);
    for (const match of body.matchAll(/https?:\/\/[^\s"'`\\)<>]+/g)) {
      if (!isAllowed(match[0], bundle)) addFinding(bundle, "url in js bundle", match[0]);
    }
  } catch (error) {
    fetchFailures += 1;
    console.log(`  [error] could not fetch ${bundle}: ${error.message}`);
  }
}

if (findings.length === 0 && fetchFailures === 0) {
  console.log(`All clear - the live site loads nothing from third-party domains.`);
} else {
  if (findings.length > 0) {
    console.log("\nFound third-party resource(s) on the live site:\n");
    for (const finding of findings) {
      console.log(`  [live] ${finding.page}`);
      console.log(`         ${finding.kind}: ${finding.url}`);
    }
    console.log("\nIf this is not in the repo, check Netlify snippet injection and the deployed branch.");
  }
  process.exit(1);
}
