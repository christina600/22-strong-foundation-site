import { test, expect } from "@playwright/test";
import { blockExternalRequests } from "./helpers";

/**
 * Enforce the two locked design rules so future edits can't quietly
 * regress them:
 *
 *   1. Orange (--orange / --orange-dark) is reserved for primary CTA
 *      buttons — never decorative accents. The site-wide pass is done,
 *      so this is enforced strictly: any orange outside an interactive
 *      CTA fails.
 *
 *   2. No content text below 1.25rem (20px); buttons and nav are excluded
 *      by the rule itself. The sitewide type pass hasn't happened yet
 *      (160 text blocks are under 20px as of July 2026 — full list in
 *      review-inbox/text-size-audit.md), so this rule runs as a RATCHET:
 *      each page fails only if it gains undersized text beyond today's
 *      baseline. As the cleanup pass lands, lower the baselines until
 *      they reach zero.
 */

const PAGES = ["/", "/about/", "/how-it-works/", "/ways-to-support/", "/transparency/", "/strong-circle/"];

const MIN_CONTENT_PX = 19.5; // 20px with rounding headroom

// Undersized text blocks that exist today, counted per page. Only lower
// these numbers as the type pass cleans pages up. Exceptions on record:
// 2026-07-04 approved Ways to Support rebuild added mandated 501(c)(3)
// trust lines and tier notes (23 → 24 on both routes that render it);
// 2026-07-04 approved How It Works copy pass added the referral helper
// line, "One session costs $190.", the "or fund recovery care" link,
// and a second Step 4 paragraph (35 → 39). Later that day the 20px
// type-pass pilot on How It Works brought body copy up to size (39 → 21).
// 2026-07-05: Tom Boscamp testimonial added to the referral section per
// Christina — his attribution line is fine print (21 → 22).
const TEXT_SIZE_BASELINE: Record<string, number> = {
  "/": 31,
  "/about/": 23,
  "/how-it-works/": 22,
  "/ways-to-support/": 24,
  "/transparency/": 25,
  "/strong-circle/": 24,
};

// The rule excludes buttons and nav. Form controls follow button sizing,
// the skip link is a keyboard utility, and .circle-tier is a
// button-styled donation amount control.
const TEXT_SIZE_EXCLUDED =
  "header, nav, button, [role='button'], .pill, .btn-donate, .amount-button, input, select, textarea, label, sup, sub, .skip-link, .circle-tier";

// Orange is allowed on interactive CTA elements (buttons and button-styled
// links, including the active states of the donation amount controls).
const ORANGE_ALLOWED_INTERACTIVE = "a, button, [role='button']";

async function auditPage(page: import("@playwright/test").Page) {
  return page.evaluate(
    ({ minPx, textExcluded, orangeAllowedInteractive }) => {
      const ORANGE_TOKENS = ["rgb(201, 79, 15)", "rgb(159, 57, 8)"];

      function describe(el: Element) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls = el.classList.length ? `.${[...el.classList].slice(0, 3).join(".")}` : "";
        const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
        return `${tag}${id}${cls} "${text}"`;
      }

      function isRendered(el: Element) {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 1 || rect.height <= 1) return false;
        const style = getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      }

      const textViolations: string[] = [];
      const orangeViolations: string[] = [];

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        if (el.closest("script, style, template")) continue;

        // ── Rule 2: minimum content text size ──
        const hasOwnText = Array.from(el.childNodes).some(
          (node) => node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim().length > 0
        );
        if (hasOwnText && !el.closest(textExcluded) && isRendered(el)) {
          const fontSize = parseFloat(getComputedStyle(el).fontSize);
          if (fontSize < minPx) {
            textViolations.push(`${describe(el)} — ${fontSize}px`);
          }
        }

        // ── Rule 1: orange is CTA-only ──
        if (!isRendered(el)) continue;
        if (el.matches(orangeAllowedInteractive) || el.closest(orangeAllowedInteractive)) continue;

        for (const pseudo of ["", "::before", "::after", "::marker"]) {
          if (pseudo === "::marker" && el.tagName !== "LI") continue;
          const style = getComputedStyle(el, pseudo || undefined);
          if (pseudo && pseudo !== "::marker" && style.content === "none") continue;
          for (const prop of ["color", "backgroundColor", "backgroundImage", "borderColor", "borderBottomColor"]) {
            const value = style[prop as keyof CSSStyleDeclaration] as string;
            if (ORANGE_TOKENS.some((token) => value?.includes(token))) {
              orangeViolations.push(`${describe(el)}${pseudo} — ${prop}: ${value.slice(0, 60)}`);
            }
          }
        }
      }

      return { textViolations, orangeViolations };
    },
    { minPx: MIN_CONTENT_PX, textExcluded: TEXT_SIZE_EXCLUDED, orangeAllowedInteractive: ORANGE_ALLOWED_INTERACTIVE }
  );
}

test.describe("locked design rules", () => {
  for (const path of PAGES) {
    test(`${path} keeps orange on CTAs and doesn't add undersized text`, async ({ page, baseURL }) => {
      await blockExternalRequests(page, baseURL);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const { textViolations, orangeViolations } = await auditPage(page);

      expect.soft(orangeViolations, `orange outside primary CTAs on ${path}`).toEqual([]);

      const baseline = TEXT_SIZE_BASELINE[path] ?? 0;
      expect(
        textViolations.length,
        `${path} has ${textViolations.length} text blocks below 20px (baseline ${baseline}) — new undersized text was added:\n${textViolations.join("\n")}`
      ).toBeLessThanOrEqual(baseline);
    });
  }
});
