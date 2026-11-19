const { randomUUID } = require('node:crypto');
const { expect, test } = require('@playwright/test');
const { LoginPage, RecipeListPage, RecipeCreationPage } = require('./page-objects/recipe-journey.cjs');

test('UI-01 chef publishes a recipe through the form, then logs out', async ({ page, request }, info) => {
  const suffix = randomUUID();
  const email = 'chef-ui-' + suffix + '@example.test';
  const password = randomUUID();
  const fixture = await request.post('/api/auth/register/chef', {
    data: { name: 'UI fixture', email, password },
  });
  expect(fixture.status()).toBe(200);

  const login = new LoginPage(page);
  await login.login(email, password);
  await new RecipeListPage(page).openCreationForm();
  await new RecipeCreationPage(page).create('Browser recipe ' + suffix);
  const screenshot = info.outputPath('published-recipe.png');
  await page.screenshot({ path: screenshot });
  await info.attach('Persisted recipe', { path: screenshot, contentType: 'image/png' });
  await login.logoutAndVerifyGuard();
});
