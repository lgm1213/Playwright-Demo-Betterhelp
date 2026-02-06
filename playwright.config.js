// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

const today = new Date();
const dateDir = `${today.getMonth() + 1}.${String(today.getDate()).padStart(2, '0')}.${today.getFullYear()}`;

module.exports = defineConfig({
  testDir: './tests',
  outputDir: `./test-results/${dateDir}`,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like await page.goto('/') */
    baseURL: 'https://www.betterhelp.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});