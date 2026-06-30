// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://22strongfoundation.com',
  integrations: [sitemap()],
  redirects: {
    '/strong-circle/': '/ways-to-support/',
  },
  // Allow external preview tunnels (e.g. cloudflared/localtunnel) to reach the dev server.
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
