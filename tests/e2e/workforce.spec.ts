import { expect, test } from './fixtures';

test.describe('Workforce floor', () => {
  test('shows six pods and 25 desks on desktop', async ({ homePage }) => {
    const width = homePage.page.viewportSize()?.width ?? 0;
    test.skip(width <= 900, 'mobile uses the card layout');

    await homePage.scrollToSection('#workforce');
    const section = homePage.page.locator('#workforce');

    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: /Twenty-five roles/ })).toBeVisible();
    await expect(section.locator('svg .pod')).toHaveCount(6);
    await expect(section.locator('svg .desk')).toHaveCount(25);
    await expect(section.locator('.workforce-stage')).toBeVisible();
    await expect(section.locator('.pod-cards')).toBeHidden();
  });

  test('shows seven pod cards on mobile', async ({ homePage }) => {
    const width = homePage.page.viewportSize()?.width ?? 0;
    test.skip(width > 900, 'desktop uses the SVG floor');

    await homePage.scrollToSection('#workforce');
    const section = homePage.page.locator('#workforce');

    await expect(section.locator('.pod-cards')).toBeVisible();
    await expect(section.locator('.pod-card')).toHaveCount(7);
    await expect(section.locator('.workforce-stage')).toBeHidden();
  });

  test('does not overflow horizontally and links from the nav', async ({ homePage }) => {
    await homePage.scrollToSection('#workforce');

    const overflow = await homePage.page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );

    expect(overflow).toBeLessThanOrEqual(1);
    await expect(homePage.page.locator('nav a[href="#workforce"]')).toHaveCount(1);
  });
});
