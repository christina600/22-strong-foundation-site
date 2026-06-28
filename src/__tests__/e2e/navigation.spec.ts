import { test, expect } from "@playwright/test";
import { blockExternalRequests } from "./helpers";

test.describe("navigation", () => {
  test("mobile menu opens, traps state, and closes with Escape", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.locator(".nav-toggle");
    const navLinks = page.locator("#nav-menu");

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(navLinks).toHaveClass(/is-open/);

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(navLinks).not.toHaveClass(/is-open/);
  });

  test("mobile menu closes after same-page navigation", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator(".nav-toggle").click();
    await page.locator('#nav-menu a[href="#about"]').click();

    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#nav-menu")).not.toHaveClass(/is-open/);
    await expect(page.locator("#about")).toBeInViewport();
  });
});
