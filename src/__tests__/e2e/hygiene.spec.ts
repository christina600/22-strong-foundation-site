import { test, expect } from "@playwright/test";
import { blockExternalRequests, collectBrowserErrors, uniqueExternalRequests } from "./helpers";

const CRITICAL_PATHS = ["/", "/about/", "/strong-circle/"] as const;
const VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
] as const;

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

  test("giving CTAs point to the right checkout campaigns", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await expect(page.locator("#donate .btn-donate")).toHaveAttribute(
      "href",
      /https:\/\/givebutter\.com\/fund-recovery-care-gaf6gu\?amount=100&frequency=once/
    );

    await page.goto("/strong-circle/");

    await expect(page.locator(".strong-circle-trigger")).toHaveAttribute(
      "href",
      "https://givebutter.com/22-strong-circle-bjf16z"
    );
    await expect(page.locator(".circle-tier").first()).toHaveAttribute(
      "href",
      /https:\/\/givebutter\.com\/22-strong-circle-bjf16z\?amount=22&frequency=monthly/
    );
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

  test("critical pages avoid horizontal overflow on desktop and mobile", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);

    for (const pathname of CRITICAL_PATHS) {
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await page.goto(pathname);
        await page.waitForLoadState("domcontentloaded");

        await expect(page.locator("main")).toBeVisible();
        await expect(page.locator("h1").first()).toBeVisible();

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe("reduced motion", () => {
  test("revealed content remains visible when motion is reduced", async ({ page, baseURL }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await blockExternalRequests(page, baseURL);

    for (const pathname of CRITICAL_PATHS) {
      await page.goto(pathname);
      await page.waitForTimeout(500);

      expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

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
    }
  });
});
