import type { Page } from "@playwright/test";

export interface BlockedExternalRequest {
  method: string;
  resourceType: string;
  url: string;
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isExternalHttpUrl(value: string, baseURL: string) {
  let url: URL;
  let base: URL;

  try {
    url = new URL(value);
    base = new URL(baseURL);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.origin === base.origin) return false;
  if (LOCAL_HOSTS.has(url.hostname) && LOCAL_HOSTS.has(base.hostname) && url.port === base.port) return false;

  return true;
}

export async function blockExternalRequests(page: Page, baseURL = "http://127.0.0.1:4321") {
  const blocked: BlockedExternalRequest[] = [];

  await page.route("**/*", async (route) => {
    const request = route.request();

    if (isExternalHttpUrl(request.url(), baseURL)) {
      blocked.push({
        method: request.method(),
        resourceType: request.resourceType(),
        url: request.url(),
      });
      await route.abort("blockedbyclient");
      return;
    }

    await route.continue();
  });

  return blocked;
}

export function collectBrowserErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  return errors;
}

export function uniqueExternalRequests(requests: BlockedExternalRequest[]) {
  return Array.from(
    new Map(requests.map((request) => [`${request.method} ${request.resourceType} ${request.url}`, request])).values()
  );
}
