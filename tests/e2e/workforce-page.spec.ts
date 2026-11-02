import { expect, test } from './fixtures';

test.describe('Workforce case study', () => {
  test('renders the case study with one h1 and the full roster', async ({ page }) => {
    const response = await page.goto('/workforce');

    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('25-role');
    await expect(page.getByRole('heading', { name: /Seven functions/ })).toBeVisible();
    await expect(page.locator('.role-card')).toHaveCount(7);
    await expect(page.locator('main section[aria-label]').first()).toBeVisible();
  });

  test('keeps navigation pointed at the homepage sections', async ({ page }) => {
    await page.goto('/workforce');

    await expect(page.locator('nav a[href="/#workforce"]')).toHaveCount(1);
    await expect(page.locator('nav a[href="/#contact"]')).toHaveCount(1);
  });

  test('links from the homepage workforce section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#workforce a[href="/workforce"]')).toBeVisible();
  });
});
