import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT || '4321';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './src/__tests__/e2e',
  timeout: 30000,
  use: {
    baseURL,
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: true,
  },
});
