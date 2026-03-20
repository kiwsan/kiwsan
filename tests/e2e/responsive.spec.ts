import { test, expect } from './fixtures';

test.describe('Responsive Design Tests', () => {
  test.describe('Mobile (375x667)', () => {
    test('should show hamburger menu and hide nav links', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await expect(homePage.menuToggle).toBeVisible();
      await expect(homePage.nav).not.toHaveClass(/\bactive\b/);
    });

    test('should open mobile menu on hamburger click', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await homePage.menuToggle.click();
      await expect(homePage.nav).toHaveClass(/\bactive\b/);
      await expect(homePage.navExperience).toBeVisible();
      await expect(homePage.navProjects).toBeVisible();
      await expect(homePage.navContact).toBeVisible();
    });

    test('should close mobile menu after clicking a nav link', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await homePage.menuToggle.click();
      await expect(homePage.nav).toHaveClass(/\bactive\b/);
      await homePage.navExperience.click();
      await expect(homePage.nav).not.toHaveClass(/\bactive\b/);
    });

    test('should stack hero content vertically', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      const heroContent = homePage.page.locator('.hero-content');
      const style = await heroContent.evaluate(el => getComputedStyle(el).flexDirection);
      expect(style).toBe('column');
    });

    test('should stack CTA buttons vertically on small screens', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      const cta = homePage.page.locator('.cta');
      const style = await cta.evaluate(el => getComputedStyle(el).flexDirection);
      expect(style).toBe('column');
    });

    test('should display metrics in 2-column grid', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await homePage.scrollToSection('.metrics');
      const grid = homePage.page.locator('.metrics-grid');
      const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
      const colCount = columns.split(' ').length;
      expect(colCount).toBe(2);
    });

    test('should display chat toggle button', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 375, height: 667 });
      await expect(homePage.chatToggle).toBeVisible();
    });
  });

  test.describe('Tablet (768x1024)', () => {
    test('should show hamburger menu on tablet', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 768, height: 1024 });
      await expect(homePage.menuToggle).toBeVisible();
    });

    test('should display all main sections', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 768, height: 1024 });
      await expect(homePage.heading).toBeVisible();
      await homePage.scrollToSection('#experience');
      await expect(homePage.experienceSection).toBeAttached();
      await homePage.scrollToSection('#projects');
      await expect(homePage.projectsSection).toBeAttached();
      await homePage.scrollToSection('#contact');
      await expect(homePage.contactSection).toBeAttached();
    });
  });

  test.describe('Desktop (1920x1080)', () => {
    test('should show navigation links inline', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 1920, height: 1080 });
      await expect(homePage.navExperience).toBeVisible();
      await expect(homePage.navProjects).toBeVisible();
      await expect(homePage.navContact).toBeVisible();
    });

    test('should hide hamburger menu', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 1920, height: 1080 });
      await expect(homePage.menuToggle).not.toBeVisible();
    });

    test('should display hero content in row layout', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 1920, height: 1080 });
      const heroContent = homePage.page.locator('.hero-content');
      const style = await heroContent.evaluate(el => getComputedStyle(el).flexDirection);
      expect(style).toBe('row');
    });

    test('should display hero illustration', async ({ homePage }) => {
      await homePage.page.setViewportSize({ width: 1920, height: 1080 });
      await expect(homePage.heroIllustration).toBeVisible();
    });
  });
});
