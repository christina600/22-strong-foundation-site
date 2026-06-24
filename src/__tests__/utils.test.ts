import { describe, it, expect } from "vitest";
import { isConfigured } from "../utils/config";

describe("config utilities", () => {
  it("isConfigured: empty string → false", () => {
    expect(isConfigured("")).toBe(false);
  });

  it("isConfigured: whitespace-only → false", () => {
    expect(isConfigured("   ")).toBe(false);
  });

  it("isConfigured: non-string → false", () => {
    expect(isConfigured(null)).toBe(false);
    expect(isConfigured(undefined)).toBe(false);
    expect(isConfigured(42)).toBe(false);
  });

  it("isConfigured: TEMPLATE: prefix → false", () => {
    expect(isConfigured("TEMPLATE: coming soon")).toBe(false);
  });

  it("isConfigured: real value → true", () => {
    expect(isConfigured("https://example.com")).toBe(true);
    expect(isConfigured("UA-12345")).toBe(true);
  });
});

describe("form validation patterns", () => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("email regex: valid emails pass", () => {
    expect(EMAIL_REGEX.test("test@example.com")).toBe(true);
    expect(EMAIL_REGEX.test("user+tag@domain.co")).toBe(true);
  });

  it("email regex: invalid emails fail", () => {
    expect(EMAIL_REGEX.test("invalid-email")).toBe(false);
    expect(EMAIL_REGEX.test("test@")).toBe(false);
    expect(EMAIL_REGEX.test("@example.com")).toBe(false);
  });

  it("required field: non-empty passes, empty/whitespace fails", () => {
    const required = (v: string) => v.trim().length > 0;
    expect(required("hello")).toBe(true);
    expect(required("")).toBe(false);
    expect(required("   ")).toBe(false);
  });

  it("min length: rejects short strings", () => {
    const minLen = (v: string, n: number) => v.length >= n;
    expect(minLen("hello", 3)).toBe(true);
    expect(minLen("hi", 3)).toBe(false);
  });
});