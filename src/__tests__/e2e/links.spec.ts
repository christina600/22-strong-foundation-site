import { test, expect } from "@playwright/test";
import { blockExternalRequests } from "./helpers";

/**
 * Crawl every internal link on every page and make sure it leads to a real
 * page. Same-page #anchors are covered by the hygiene suite; this catches
 * typo'd paths and links to pages that no longer exist.
 */

const PAGES = ["/", "/about/", "/how-it-works/", "/ways-to-support/", "/transparency/", "/strong-circle/"];

test.describe("internal links", () => {
  test("every internal link on every page resolves", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    const targets = new Map<string, Set<string>>();

    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href]", (anchors) => anchors.map((a) => a.getAttribute("href") || ""));

      for (const href of hrefs) {
        if (!href || href.startsWith("#")) continue;
        if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) continue;

        let target: URL;
        try {
          target = new URL(href, `${baseURL}${path}`);
        } catch {
          continue;
        }
        if (target.origin !== new URL(baseURL!).origin) continue;

        const normalized = target.pathname;
        if (!targets.has(normalized)) targets.set(normalized, new Set());
        targets.get(normalized)!.add(path);
      }
    }

    const broken: string[] = [];
    for (const [target, foundOn] of targets) {
      const response = await page.request.get(target);
      if (response.status() >= 400) {
        broken.push(`${target} → ${response.status()} (linked from ${[...foundOn].join(", ")})`);
      }
    }

    expect(broken, "internal links that do not resolve").toEqual([]);
  });
});
