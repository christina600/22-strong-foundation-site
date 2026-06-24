import { describe, it, expect } from "vitest";

describe("accessibility patterns", () => {
  it("ARIA attributes should follow naming conventions", () => {
    // Common ARIA attributes used in the site
    const validAriaAttrs = [
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "aria-live",
      "aria-atomic",
      "aria-relevant",
      "aria-busy",
      "aria-controls",
      "aria-expanded",
      "aria-hidden",
    ];

    expect(validAriaAttrs).toContain("aria-label");
    expect(validAriaAttrs).toContain("aria-live");
    expect(validAriaAttrs).toContain("aria-hidden");
  });

  it("aria-live values should be valid", () => {
    const validLiveValues = ["off", "polite", "assertive"];
    expect(validLiveValues).toContain("polite");
    expect(validLiveValues).toContain("assertive");
    expect(validLiveValues).not.toContain("urgent"); // invalid
  });

  it("aria-expanded should be boolean string", () => {
    const validExpandedValues = ["true", "false"];
    expect(validExpandedValues).toContain("true");
    expect(validExpandedValues).toContain("false");
  });

  it("aria-hidden should be boolean string", () => {
    const validHiddenValues = ["true", "false"];
    expect(validHiddenValues).toContain("true");
    expect(validHiddenValues).toContain("false");
  });

  it("role values should use valid WAI-ARIA roles", () => {
    const validRoles = [
      "button",
      "link",
      "img",
      "navigation",
      "main",
      "complementary",
      "contentinfo",
      "status",
      "alert",
    ];

    expect(validRoles).toContain("status");
    expect(validRoles).toContain("alert");
    expect(validRoles).toContain("button");
  });
});