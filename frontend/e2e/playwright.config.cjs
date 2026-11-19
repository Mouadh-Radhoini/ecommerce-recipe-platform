const path = require('node:path');
const { defineConfig } = require('@playwright/test');
const evidence = path.resolve(__dirname, '../../testing-documentation/13-Test-Results/UI');
const baseURL = process.env.RECIPE_UI_URL || 'http://127.0.0.1:14200';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(baseURL)) {
  throw new Error('Use the isolated loopback Angular server');
}
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'chef-journey.spec.cjs',
  repeatEach: 2,
  workers: 1,
  retries: 0,
  outputDir: path.join(evidence, 'artifacts'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(evidence, 'html'), open: 'never' }],
    ['junit', { outputFile: path.join(evidence, 'junit.xml') }],
  ],
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.RECIPE_CHROMIUM },
    // Traces can contain registration credentials and JWTs. Retain failures privately.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
