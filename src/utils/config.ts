export function isConfigured(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const text = value.trim();
  return text !== "" && !text.startsWith("TEMPLATE:");
}
