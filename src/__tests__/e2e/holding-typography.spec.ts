import { expect, test } from "@playwright/test";

const meaningfulText = [
  ".eyebrow",
  ".tagline",
  ".notify-label",
  '.notify-form input[type="email"]',
  ".notify-form .cta",
  ".meta",
  ".meta .legal",
];

test.describe("holding-page mature-eye typography", () => {
  for (const viewport of [
    { name: "desktop", width: 1280, height: 800 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`${viewport.name} text stays readable`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      for (const selector of meaningfulText) {
        const size = await page.locator(selector).evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        );
        expect(size, `${selector} should be at least 16px`).toBeGreaterThanOrEqual(16);
      }

      const taglineSize = await page.locator(".tagline").evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize),
      );
      expect(taglineSize, "mission statement should be at least 18px").toBeGreaterThanOrEqual(18);
    });
  }

  test("mobile layout reflows at 320px without clipping", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      top: document.querySelector("main")?.getBoundingClientRect().top ?? -1,
    }));

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    expect(layout.top).toBeGreaterThanOrEqual(0);
  });

  test("the official logo remains fully visible in a short desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    const logoBox = await page.locator(".hero-lockup").boundingBox();
    expect(logoBox).not.toBeNull();
    expect(logoBox!.y).toBeGreaterThanOrEqual(0);
    expect(logoBox!.y + logoBox!.height).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.scrollHeight),
    );
  });

  test("each location stays together instead of leaving a dangling city", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto("/");

    const locationLineCounts = await page.locator(".meta .loc").evaluateAll((locations) =>
      locations.map((location) => location.getClientRects().length),
    );

    expect(locationLineCounts).toEqual([1, 1]);
  });

  test("wordmark stays neutral and supporting text keeps sufficient opacity", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const colors = await page.evaluate(() => {
      const color = (selector: string, pseudo?: string) =>
        getComputedStyle(document.querySelector(selector)!, pseudo).color;
      const fill = (selector: string) =>
        getComputedStyle(document.querySelector(selector)!).fill;

      return {
        number: fill(".hero-lockup-22"),
        strong: fill(".hero-lockup-strong"),
        placeholder: color('.notify-form input[type="email"]', "::placeholder"),
      };
    });

    expect(colors.number).toBe(colors.strong);
    expect(colors.placeholder).toMatch(/rgba?\([^)]*(?:0\.6[89]|0\.[7-9]|1)\)/);
  });
});
