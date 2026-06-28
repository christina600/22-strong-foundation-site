import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { blockExternalRequests } from './helpers';

test.describe('Accessibility', () => {
  test('homepage should have no WCAG violations', async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('404 page should be accessible', async ({ page, baseURL }) => {
    await blockExternalRequests(page, baseURL);
    await page.goto('/nonexistent-page');
    await expect(page.locator('h1')).toContainText('404');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
