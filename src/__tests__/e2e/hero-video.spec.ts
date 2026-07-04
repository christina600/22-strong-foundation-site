import { test, expect } from "@playwright/test";
import { existsSync } from "fs";
import { join } from "path";
import { blockExternalRequests } from "./helpers";

const HERO_VIDEO = "video/hero-loop.mp4";

test.describe("hero video", () => {
  test("video element carries the four attributes mobile autoplay requires", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    const video = page.locator(".hero-media video");
    await expect(video).toHaveCount(1);

    // Missing any of these leaves iPhones showing a frozen first frame
    // (or a fullscreen takeover) instead of the quiet loop.
    await expect(video).toHaveAttribute("muted", "");
    await expect(video).toHaveAttribute("autoplay", "");
    await expect(video).toHaveAttribute("loop", "");
    await expect(video).toHaveAttribute("playsinline", "");
  });

  test("hero footage file exists and the dev server serves it", async ({ page }) => {
    const onDisk = join(process.cwd(), "public", HERO_VIDEO);
    expect(existsSync(onDisk), `public/${HERO_VIDEO} is missing`).toBe(true);

    const response = await page.request.get(`/${HERO_VIDEO}`, {
      headers: { Range: "bytes=0-1023" },
    });
    expect(response.status(), `/${HERO_VIDEO} did not serve`).toBeLessThan(400);
  });

  test("reduced-motion visitors get the still dark field, not the loop", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(".hero-media")).toBeHidden();
    // The mark still needs to read against the fallback field.
    await expect(page.locator(".hero-mark")).toBeVisible();
  });
});
