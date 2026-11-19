const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) { this.page = page; }

  async login(email, password) {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeVisible();
  }

  async logoutAndVerifyGuard() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await this.page.goto('/my-recipes/create');
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  }
}

class RecipeListPage {
  constructor(page) { this.page = page; }

  async openCreationForm() {
    await this.page.getByRole('link', { name: 'My Recipes', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'My Recipes' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Create recipe' }).click();
  }
}

class RecipeCreationPage {
  constructor(page) { this.page = page; }

  async create(title) {
    await this.page.getByLabel('Title').fill(title);
    await this.page.getByLabel('Description').fill('Disposable browser fixture');
    await this.page.getByLabel('Ingredients').fill('Tomatoes\nSalt');
    await this.page.getByLabel('Steps').fill('Simmer for ten minutes');
    await this.page.getByRole('button', { name: 'Create recipe' }).click();
    await expect(this.page).toHaveURL(/\/recipes\/[^/]+$/);
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    await this.page.reload();
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    await expect(this.page.getByText('Simmer for ten minutes', { exact: true })).toBeVisible();
  }
}

module.exports = { LoginPage, RecipeListPage, RecipeCreationPage };
