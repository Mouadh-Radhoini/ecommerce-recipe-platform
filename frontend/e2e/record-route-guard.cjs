const path = require('node:path');
const { chromium, expect } = require('@playwright/test');

async function record() {
  const baseURL = process.env.RECIPE_UI_URL || 'http://127.0.0.1:14203';
  if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(baseURL)) {
    throw new Error('Use the isolated loopback Angular server');
  }

  const browser = await chromium.launch({ executablePath: process.env.RECIPE_CHROMIUM });
  try {
    const context = await browser.newContext({ baseURL });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
    const page = await context.newPage();
    await page.goto('/my-recipes/create');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    await context.tracing.stop({
      path: path.resolve(__dirname, '../../testing-documentation/13-Test-Results/UI/anonymous-route-guard.zip'),
    });
    console.log('Anonymous protected-route trace recorded.');
  } finally {
    await browser.close();
  }
}

record().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
