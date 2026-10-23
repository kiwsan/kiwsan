import { defineConfig, devices } from '@playwright/test';

const site = process.env.SITE_URL || 'https://kiwsan.com';

export default defineConfig({
  testDir: './live',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  reporter: [['list']],
  use: {
    baseURL: site,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
