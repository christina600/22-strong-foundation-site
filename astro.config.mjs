// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Confirm the production domain before launch.
  site: 'https://22strongfoundation.org',
  integrations: [sitemap()],
});
