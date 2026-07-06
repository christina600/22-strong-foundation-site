// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://22strongfoundation.com',
  integrations: [sitemap()],
  // Always inline page CSS. The holding page is a single small page; keeping its
  // styles inline avoids a Netlify CDN race where a newly-hashed external
  // /_astro/*.css can get an immutable 404-fallback cached during deploy,
  // leaving the live page unstyled.
  build: {
    inlineStylesheets: 'always',
  },
  // Allow external preview tunnels (e.g. cloudflared/localtunnel) to reach the dev server.
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
