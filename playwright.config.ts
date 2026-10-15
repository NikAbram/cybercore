import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      BOOKING_FORM_ENABLED: 'true',
      BOOKING_PRIVACY_URL: 'https://example.com/privacy',
      BOOKING_RATE_LIMIT_CONFIGURED: 'true',
      APP_ORIGIN: 'http://localhost:3000',
      RESEND_API_KEY: 'playwright-placeholder',
      BOOKING_EMAIL_FROM: 'CYBERCORE <booking@example.com>',
      BOOKING_EMAIL_TO: 'booking@example.com',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
