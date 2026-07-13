import { expect, test } from "@playwright/test";
import { blockExternalRequests } from "./helpers";

const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };

test.describe("testimonial video system", () => {
  test("all four stories use the shared lazy-loading treatment", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);

    for (const [path, expectedCount] of [["/", 2], ["/how-it-works/", 2]] as const) {
      await page.goto(path);

      const stories = page.locator("[data-testimonial-video]");
      await expect(stories).toHaveCount(expectedCount);
      await expect(stories.locator("[data-testimonial-foreground]")).toHaveCount(expectedCount);
      await expect(stories.locator("[data-testimonial-play]")).toHaveCount(expectedCount);

      const mediaRules = await stories.evaluateAll((figures) => figures.map((figure) => {
        const video = figure.querySelector<HTMLVideoElement>("[data-testimonial-foreground]");
        return {
          controls: video?.controls,
          playsInline: video?.playsInline,
          poster: video?.getAttribute("poster"),
          preload: video?.preload,
        };
      }));

      expect(mediaRules).toEqual(Array.from({ length: expectedCount }, () => ({
        controls: false,
        playsInline: true,
        poster: expect.stringMatching(/^\/images\//),
        preload: "none",
      })));
    }
  });

  test("portrait footage sits uncropped in 4:3 desktop stages", async ({ page, baseURL }) => {
    await page.setViewportSize(DESKTOP);
    await blockExternalRequests(page, baseURL);

    for (const path of ["/", "/how-it-works/"]) {
      await page.goto(path);

      const geometry = await page.locator("[data-testimonial-video]").evaluateAll((figures) => figures.map((figure) => {
        const stage = figure.querySelector<HTMLElement>(".testimonial-video__stage")!;
        const foreground = figure.querySelector<HTMLVideoElement>("[data-testimonial-foreground]")!;
        const stageBox = stage.getBoundingClientRect();
        const foregroundBox = foreground.getBoundingClientRect();
        return {
          stageRatio: stageBox.width / stageBox.height,
          foregroundRatio: foregroundBox.width / foregroundBox.height,
          heightFill: foregroundBox.height / stageBox.height,
        };
      }));

      for (const item of geometry) {
        expect(item.stageRatio).toBeCloseTo(4 / 3, 2);
        // The foreground carries a 1px inline border, so allow a small
        // rendered-box tolerance around the source's native 9:16 ratio.
        expect(Math.abs(item.foregroundRatio - (9 / 16))).toBeLessThan(0.02);
        expect(item.heightFill).toBeGreaterThan(0.96);
        expect(item.heightFill).toBeLessThanOrEqual(1.01);
      }
    }
  });

  test("mobile stages switch to 4:5, stack copy below, and disable moving blur", async ({ page, baseURL }) => {
    await page.setViewportSize(MOBILE);
    await blockExternalRequests(page, baseURL);

    for (const path of ["/", "/how-it-works/"]) {
      await page.goto(path);

      const geometry = await page.locator("[data-testimonial-video]").evaluateAll((figures) => figures.map((figure) => {
        const stage = figure.querySelector<HTMLElement>(".testimonial-video__stage")!;
        const copy = figure.querySelector<HTMLElement>(".testimonial-video__copy");
        const backdrop = figure.querySelector<HTMLVideoElement>("[data-testimonial-backdrop]");
        const stageBox = stage.getBoundingClientRect();
        const copyBox = copy?.getBoundingClientRect();
        return {
          stageRatio: stageBox.width / stageBox.height,
          copyBelowStage: !copyBox || copyBox.top >= stageBox.bottom,
          backdropDisplay: backdrop ? getComputedStyle(backdrop).display : null,
        };
      }));

      for (const item of geometry) {
        expect(item.stageRatio).toBeCloseTo(4 / 5, 2);
        expect(item.copyBelowStage).toBe(true);
        expect(item.backdropDisplay).not.toBe("block");
      }
    }
  });

  test("the branded play control hands off to native video controls", async ({ page, baseURL }) => {
    await page.setViewportSize(DESKTOP);
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    const story = page.locator("[data-testimonial-video]").filter({ hasText: "Luke Hudson" });
    const play = story.getByRole("button", { name: "Play Luke Hudson testimonial video" });
    const video = story.locator("[data-testimonial-foreground]");

    await expect(play).toBeVisible();
    await expect(video).not.toHaveAttribute("controls", "");
    await play.click();
    await expect(play).toBeHidden();
    await expect(video).toHaveJSProperty("controls", true);
  });

  test("reduced motion keeps every moving testimonial backdrop off", async ({ page, baseURL }) => {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    const displays = await page.locator("[data-testimonial-backdrop]").evaluateAll((videos) => (
      videos.map((video) => getComputedStyle(video).display)
    ));
    expect(displays).toEqual(["none", "none"]);
  });

  test("the ambient hero has a poster fallback", async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto("/");

    await expect(page.locator(".hero-media video")).toHaveAttribute("poster", /hero-battle-ropes/);
  });
});
