import { test, expect } from './fixtures';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle(/Ekkachai|kiwsan/i);
  });

  test('should display main heading', async ({ homePage }) => {
    await expect(homePage.heading).toBeVisible();
  });

  test('should have working portfolio link', async ({ homePage }) => {
    await expect(homePage.portfolioLink).toHaveAttribute('href', /github\.com\/kiwsan/);
  });

  test('should have working LinkedIn link', async ({ homePage }) => {
    await expect(homePage.linkedInLink).toHaveAttribute('href', /linkedin\.com\/in\/kiwsan/);
  });

  test('should have working email link', async ({ homePage }) => {
    await expect(homePage.emailLink).toHaveAttribute('href', 'mailto:kiwsanthia@gmail.com');
  });
});
