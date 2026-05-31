// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TEMPLATE: Replace with your production URL before launch
  site: 'https://www.yourorganization.org',
  integrations: [sitemap()],
});
