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
