import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { blockExternalRequests } from './helpers';

const PAGES = [
  '/',
  '/about/',
  '/how-it-works/',
  '/ways-to-support/',
  '/transparency/',
  '/strong-circle/',
];

test.describe('Accessibility', () => {
  for (const path of PAGES) {
    test(`${path} should have no WCAG violations`, async ({ page, baseURL }) => {
      await blockExternalRequests(page, baseURL);
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test('404 page should be accessible', async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto('/nonexistent-page', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1.error-code')).toContainText('404');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
