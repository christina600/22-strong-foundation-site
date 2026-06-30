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

  test("main nav shows About, Strong Circle, and Contact with one action button", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await expect(page.locator("#nav-menu a")).toHaveText(["About", "Strong Circle", "Contact"]);
    await expect(page.locator(".nav-actions .pill")).toHaveText(["Fund recovery care"]);
  });

  test("mobile menu closes after page navigation", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator(".nav-toggle").click();
    await page.locator('#nav-menu a[href="/about/"]').click();

    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#nav-menu")).not.toHaveClass(/is-open/);
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test("Meet the team lives on the About page", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator('#nav-menu a[href="/about/"]').click();

    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("#about-title")).toContainText("The gap kept showing up in the treatment room.");
    await expect(page.locator("#leadership h2")).toContainText("Meet the team.");
    await expect(page.locator("#donate")).toHaveCount(0);
  });

  test("Strong Circle lives on its own page", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator('#nav-menu a[href="/strong-circle/"]').click();

    await expect(page).toHaveURL(/\/strong-circle\/$/);
    await expect(page.locator("#strong-circle h1")).toContainText("Join the 22 Strong Circle.");
    await expect(page.locator("#donate")).toHaveCount(0);
  });
});
