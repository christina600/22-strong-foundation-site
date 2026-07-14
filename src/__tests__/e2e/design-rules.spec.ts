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
 *   2. Typography follows the role-based minimums established by the
 *      July 2026 50-site nonprofit benchmark: 16px reading copy, 14px
 *      controls, and 12px labels/metadata. This replaces the old 20px
 *      page-count ratchet, which incorrectly treated normal 16–18px
 *      body copy and 12–14px labels as design regressions.
 */

const PAGES = ["/", "/about/", "/how-it-works/", "/ways-to-support/", "/transparency/", "/strong-circle/"];

const MIN_READING_PX = 15.5; // 16px with rendering headroom
const MIN_CONTROL_PX = 13.5; // 14px with rendering headroom
const MIN_LABEL_PX = 11.5; // 12px with rendering headroom

const TEXT_SIZE_EXCLUDED = "sup, sub, .skip-link, .hero-mark, .hero-lockup";

const CONTROL_TEXT =
  "a, button, [role='button'], .pill, .btn-donate, .amount-button, input, select, textarea, label, .circle-tier";

const LABEL_TEXT = [
  ".eyebrow",
  "[class*='eyebrow']",
  "[class*='kicker']",
  "[class*='label']",
  "[class*='meta']",
  "[class*='source']",
  "[class*='caption']",
  "[class*='footnote']",
  "[class*='legal']",
  "[class*='note']",
  "[class*='crisis']",
  ".audience-card-name",
  ".audience-voice__cite-role",
  ".about-proof-list li",
  ".bio-credentials li",
  ".donation-type",
  ".donation-secure",
  ".footer-title",
  ".transparency-status",
  ".transparency-review-note > span",
  ".transparency-need-card > strong",
  "small",
  "figcaption",
  "cite",
  "dt",
].join(", ");

// Orange is reserved for the brand mark and controls that enter a giving flow.
const ORANGE_ALLOWED_INTERACTIVE =
  ".hero-mark, .nav-donate-toggle, .nav-donate-option, .btn-donate, a[href*='#donate'], a[href*='givebutter.com']";

async function auditPage(page: import("@playwright/test").Page) {
  return page.evaluate(
    ({ minReadingPx, minControlPx, minLabelPx, textExcluded, controlText, labelText, orangeAllowedInteractive }) => {
      const ORANGE_TOKENS = [
        "rgb(201, 79, 15)",
        "rgb(159, 57, 8)",
        "rgb(168, 86, 50)",
        "rgb(132, 63, 36)",
        "rgb(135, 59, 30)",
        "rgb(104, 44, 21)",
      ];

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
          const role = el.matches(labelText)
            ? "label"
            : el.closest(controlText)
              ? "control"
              : "reading";
          const minimum = role === "label" ? minLabelPx : role === "control" ? minControlPx : minReadingPx;
          if (fontSize < minimum) {
            textViolations.push(`${describe(el)} — ${fontSize}px (${role}, minimum ${minimum}px)`);
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
    {
      minReadingPx: MIN_READING_PX,
      minControlPx: MIN_CONTROL_PX,
      minLabelPx: MIN_LABEL_PX,
      textExcluded: TEXT_SIZE_EXCLUDED,
      controlText: CONTROL_TEXT,
      labelText: LABEL_TEXT,
      orangeAllowedInteractive: ORANGE_ALLOWED_INTERACTIVE,
    }
  );
}

test.describe("locked design rules", () => {
  for (const path of PAGES) {
    test(`${path} keeps orange on CTAs and uses role-appropriate type sizes`, async ({ page, baseURL }) => {
      await blockExternalRequests(page, baseURL);
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const { textViolations, orangeViolations } = await auditPage(page);

      expect.soft(orangeViolations, `orange outside primary CTAs on ${path}`).toEqual([]);

      expect(textViolations, `undersized text on ${path}`).toEqual([]);
    });
  }
});
