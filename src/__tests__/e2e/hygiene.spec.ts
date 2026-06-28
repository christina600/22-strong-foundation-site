import { test, expect } from "@playwright/test";
import { blockExternalRequests, collectBrowserErrors, uniqueExternalRequests } from "./helpers";

test.describe("runtime hygiene", () => {
  test("homepage makes no automatic external page-load requests", async ({ page, baseURL }) => {
    const blocked = await blockExternalRequests(page, baseURL);

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    expect(uniqueExternalRequests(blocked)).toEqual([]);
  });

  test("homepage has no browser console errors or uncaught exceptions", async ({ page, baseURL }) => {
    const blocked = await blockExternalRequests(page, baseURL);
    const errors = collectBrowserErrors(page);

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
    expect(uniqueExternalRequests(blocked)).toEqual([]);
  });

  test("donation section uses a local no-external path", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await expect(page.locator("#donate")).toBeVisible();
    await expect(page.locator("givebutter-widget")).toHaveCount(0);
    await expect(page.locator(".donation-module")).toBeVisible();
  });

  test("same-page anchors point to existing targets in the rendered DOM", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    const missing = await page.locator('a[href^="#"]').evaluateAll((links) => (
      links
        .map((link) => link.getAttribute("href") || "")
        .filter((href) => href.length > 1)
        .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1))))
    ));

    expect(missing).toEqual([]);
  });

  test("desktop and mobile layouts do not create horizontal page overflow", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);

    for (const viewport of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("revealed content remains visible when motion is reduced", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");
    await page.waitForTimeout(500);

    const hiddenRevealElements = await page.locator("[data-reveal]").evaluateAll((elements) => (
      elements
        .filter((element) => {
          const style = window.getComputedStyle(element);
          return style.opacity === "0" || style.visibility === "hidden";
        })
        .map((element) => {
          const tag = element.tagName.toLowerCase();
          const id = element.id ? `#${element.id}` : "";
          const className = element.className ? `.${String(element.className).trim().replace(/\s+/g, ".")}` : "";
          return `${tag}${id}${className}`;
        })
    ));

    expect(hiddenRevealElements).toEqual([]);
  });
});
