import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('has no WCAG A or AA violations on the home page', async ({ homePage }) => {
  await homePage.page.waitForLoadState('networkidle');
  await homePage.page.waitForTimeout(1600);

  const results = await new AxeBuilder({ page: homePage.page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('has no WCAG A or AA violations on the workforce case study', async ({ page }) => {
  await page.goto('/workforce/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    document.querySelectorAll('section').forEach((el) => el.classList.add('visible'));
  });

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  expect(results.violations).toEqual([]);
});
