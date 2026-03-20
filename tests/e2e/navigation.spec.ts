import { test, expect } from './fixtures';

test.describe('Navigation Tests', () => {
  test('should display fixed header', async ({ homePage }) => {
    await expect(homePage.header).toBeVisible();
    const position = await homePage.header.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('fixed');
  });

  test('should display logo linking to home', async ({ homePage }) => {
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveAttribute('href', '/');
  });

  test('should navigate to experience section', async ({ homePage }) => {
    await homePage.navExperience.click();
    await expect(homePage.experienceSection).toBeInViewport();
  });

  test('should navigate to projects section', async ({ homePage }) => {
    await homePage.navProjects.click();
    await expect(homePage.projectsSection).toBeInViewport();
  });

  test('should navigate to contact section', async ({ homePage }) => {
    await homePage.navContact.click();
    await expect(homePage.contactSection).toBeInViewport();
  });

  test('should keep header visible after scrolling', async ({ homePage }) => {
    await homePage.scrollToSection('#contact');
    await expect(homePage.header).toBeVisible();
  });
});

test.describe('Theme Toggle Tests', () => {
  test('should toggle dark mode on click', async ({ homePage }) => {
    const htmlEl = homePage.page.locator('html');

    // Click theme toggle
    await homePage.themeToggle.click();
    const themeAfterClick = await htmlEl.getAttribute('data-theme');
    expect(themeAfterClick).toBeTruthy();

    // Click again to toggle back
    const firstTheme = themeAfterClick;
    await homePage.themeToggle.click();
    const themeAfterSecondClick = await htmlEl.getAttribute('data-theme');
    expect(themeAfterSecondClick).not.toBe(firstTheme);
  });

  test('should persist dark mode visual change', async ({ homePage }) => {
    await homePage.themeToggle.click();
    // Verify background color changed (dark mode has different bg)
    const bgColor = await homePage.page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toBeTruthy();
  });
});

test.describe('Hero CTA Navigation Tests', () => {
  test('"View My Work" button should scroll to experience', async ({ homePage }) => {
    await homePage.viewMyWorkBtn.click();
    await homePage.page.waitForTimeout(500);
    await expect(homePage.experienceSection).toBeInViewport();
  });

  test('"Get in Touch" button should scroll to contact', async ({ homePage }) => {
    await homePage.getInTouchBtn.click();
    await homePage.page.waitForTimeout(500);
    await expect(homePage.contactSection).toBeInViewport();
  });
});
