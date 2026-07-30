import { expect, test, type Page } from '@playwright/test';
import { blockExternalRequests } from './helpers';

const PAGES = [
  '/',
  '/about/',
  '/how-it-works/',
  '/ways-to-support/',
  '/transparency/',
  '/strong-circle/',
  '/nonexistent-page',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

const TEXT_SELECTOR = [
  'p',
  'li',
  'dd',
  'dt',
  'label',
  'a',
  'button',
  'small',
  'figcaption',
  'input',
  'select',
  'textarea',
].join(',');

const ESSENTIAL_TEXT_SELECTOR = [
  'header a',
  'header button',
  'main p',
  'main li',
  'main dd',
  'main dt',
  'main label',
  'main a',
  'main button',
  'main small',
  'main figcaption',
  'main input',
  'main select',
  'main textarea',
  'footer a',
  'footer p',
].join(',');

type TextViolation = {
  selector: string;
  text: string;
  size: number;
};

async function findUndersizedText(
  page: Page,
  selector: string,
  minimumPx: number,
): Promise<TextViolation[]> {
  return page.locator(selector).evaluateAll((elements, minimum) => {
    const describe = (element: Element) => {
      const id = element.id ? `#${element.id}` : '';
      const classes =
        typeof element.className === 'string' && element.className.trim()
          ? `.${element.className.trim().split(/\s+/).slice(0, 3).join('.')}`
          : '';
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };

    return elements.flatMap((element) => {
      const htmlElement = element as HTMLElement;
      const style = getComputedStyle(htmlElement);
      const rect = htmlElement.getBoundingClientRect();
      const text = (
        htmlElement.innerText ||
        (htmlElement as HTMLInputElement).value ||
        (htmlElement as HTMLInputElement).placeholder ||
        ''
      )
        .trim()
        .replace(/\s+/g, ' ');

      if (
        !text ||
        rect.width <= 0 ||
        rect.height <= 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        return [];
      }

      const size = Number.parseFloat(style.fontSize);
      return size + 0.01 < minimum
        ? [{ selector: describe(element), text: text.slice(0, 80), size }]
        : [];
    });
  }, minimumPx);
}

test.describe('mature-eye typography policy', () => {
  for (const viewport of VIEWPORTS) {
    for (const path of PAGES) {
      test(`${path} keeps readable type at ${viewport.name} size`, async ({
        page,
        baseURL,
      }) => {
        await blockExternalRequests(page, baseURL);
        await page.setViewportSize(viewport);
        await page.goto(path, { waitUntil: 'domcontentloaded' });

        const belowAbsoluteFloor = await findUndersizedText(
          page,
          TEXT_SELECTOR,
          14,
        );
        expect(
          belowAbsoluteFloor,
          'No visible text may render below the 14px absolute floor',
        ).toEqual([]);

        const belowEssentialFloor = await findUndersizedText(
          page,
          ESSENTIAL_TEXT_SELECTOR,
          16,
        );
        expect(
          belowEssentialFloor,
          'Navigation, content, controls, captions, and footer text must be at least 16px',
        ).toEqual([]);
      });
    }
  }

  for (const path of PAGES) {
    test(`${path} reflows without horizontal scrolling at 320px`, async ({
      page,
      baseURL,
    }) => {
      await blockExternalRequests(page, baseURL);
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));

      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }
});
