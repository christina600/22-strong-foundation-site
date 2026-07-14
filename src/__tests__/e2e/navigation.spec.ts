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

  test("main nav groups related pages and keeps two donation paths", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await expect(page.locator("#nav-menu .nav-group__label")).toHaveText(["What We Do", "About Us", "How to Help"]);
    await expect(page.locator('.nav-submenu[aria-label="What We Do"] a')).toHaveText(["How It Works", "Who We Serve"]);
    await expect(page.locator('.nav-submenu[aria-label="About Us"] a')).toHaveText(["Our Story", "The Team", "Transparency"]);
    await expect(page.locator('.nav-submenu[aria-label="How to Help"] a')).toHaveText([
      "Ways to Give",
      "Strong Circle",
      "Refer Someone",
      "Partner With Us",
      "Contact Us",
    ]);
    const donateToggle = page.locator(".nav-donate-toggle");
    await expect(donateToggle).toHaveText(/Donate/);
    await expect(donateToggle).toHaveAttribute("aria-expanded", "false");

    await donateToggle.click();
    await expect(donateToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".nav-donate-menu")).toBeVisible();
    await expect(page.locator(".nav-donate-option")).toHaveText([/Give Once/, /Give Monthly/]);
  });

  test("mobile menu closes after page navigation", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator(".nav-toggle").click();
    await page.locator('#nav-menu .nav-group__label[href="/about/"]').click();

    await expect(page.locator(".nav-toggle")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#nav-menu")).not.toHaveClass(/is-open/);
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test("The team lives on the About page", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator('#nav-menu .nav-group__label[href="/about/"]').click();

    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("#about-title")).toContainText("The gap kept showing up in the treatment room.");
    await expect(page.locator("#leadership h2")).toContainText("The Team");
    await expect(page.locator("#donate")).toHaveCount(0);
  });

  test("Ways to Support lives on its own page", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator('#nav-menu .nav-group__label[href="/ways-to-support/"]').click();

    await expect(page).toHaveURL(/\/ways-to-support\/$/);
    await expect(page.locator("#support-title")).toContainText("Every way to keep recovery care moving.");
    await expect(page.locator("#donate")).toHaveCount(0);
  });
});
