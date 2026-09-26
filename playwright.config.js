import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.js', workers: 1, timeout: 90000,
  use: { baseURL: process.env.TEST_URL || 'http://localhost:5173', headless: true, launchOptions: { args: ['--enable-unsafe-swiftshader'] } },
  reporter: 'list',
})
