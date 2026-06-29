import { test, expect } from "@playwright/test";
import { blockExternalRequests, uniqueExternalRequests } from "./helpers";

test.describe("contact form", () => {
  test("validates required fields without submitting to the network", async ({ page, baseURL }) => {
    const blocked = await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator("#contactFormEl .form-submit").click();

    await expect(page.locator("#contact-form-status")).toContainText("Please correct the errors above");
    await expect(page.locator("#name-error")).toBeVisible();
    expect(uniqueExternalRequests(blocked)).toEqual([]);
  });

  test("valid submission opens a prepared email without a network post", async ({ page, baseURL }) => {
    const blocked = await blockExternalRequests(page, baseURL);
    const submitRequests: string[] = [];

    await page.goto("/");
    await page.evaluate(() => {
      window.addEventListener("contact:mailto", (event) => {
        event.preventDefault();
        window.sessionStorage.setItem("contactMailtoHref", (event as CustomEvent<{ href: string }>).detail.href);
      });
    });

    await page.locator('input[name="name"]').fill("Test Donor");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('select[name="reason"]').selectOption({ label: "I have a general question" });
    await page.locator('textarea[name="message"]').fill("I would like to learn more about 22 Strong Foundation.");

    page.on("request", (request) => {
      if (request.method() !== "GET") submitRequests.push(`${request.method()} ${request.url()}`);
    });

    await page.locator("#contactFormEl .form-submit").click();

    await expect(page.locator("#contact-form-status")).toContainText("Opening your email app");
    const mailtoHref = await page.evaluate(() => window.sessionStorage.getItem("contactMailtoHref"));
    expect(mailtoHref).toContain("mailto:team@22strongfoundation.com");
    expect(mailtoHref).toContain("subject=22%20Strong%20contact%3A%20I%20have%20a%20general%20question");
    expect(mailtoHref).toContain("Test%20Donor");
    expect(submitRequests).toEqual([]);
    expect(uniqueExternalRequests(blocked)).toEqual([]);
  });

  test("honeypot submissions are ignored locally", async ({ page, baseURL }) => {
    const blocked = await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await page.locator('input[name="website"]').fill("https://example.com");
    await page.locator('input[name="name"]').fill("Test Donor");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('select[name="reason"]').selectOption({ label: "I have a general question" });
    await page.locator('textarea[name="message"]').fill("This should be ignored because the honeypot is filled.");
    await page.locator("#contactFormEl .form-submit").click();

    await expect(page.locator("#contact-form-status")).toBeHidden();
    expect(uniqueExternalRequests(blocked)).toEqual([]);
  });
});
