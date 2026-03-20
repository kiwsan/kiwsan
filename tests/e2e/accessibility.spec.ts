import { test, expect } from './fixtures';

test.describe('Accessibility Tests', () => {
  test('should have exactly one h1 heading', async ({ homePage }) => {
    await expect(homePage.page.locator('h1')).toHaveCount(1);
  });

  test('should have proper heading hierarchy (no skipped levels)', async ({ homePage }) => {
    await homePage.page.waitForLoadState('domcontentloaded');
    const headings = await homePage.page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    let lastLevel = 0;
    for (const heading of headings) {
      const tag = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tag.replace('h', ''));
      if (lastLevel > 0) {
        expect(level).toBeLessThanOrEqual(lastLevel + 1);
      }
      lastLevel = level;
    }
  });

  test('should have alt text for all images', async ({ homePage }) => {
    const images = await homePage.page.locator('img').all();
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have aria-labels on interactive elements without visible text', async ({ homePage }) => {
    await expect(homePage.logo).toHaveAttribute('aria-label', /home/i);
    await expect(homePage.menuToggle).toHaveAttribute('aria-label', /menu/i);
    await expect(homePage.themeToggle).toHaveAttribute('aria-label', /dark mode|theme/i);
    await expect(homePage.chatToggle).toHaveAttribute('aria-label', /chat/i);
  });

  test('should have landmark roles for main content areas', async ({ homePage }) => {
    await expect(homePage.page.locator('header')).toBeAttached();
    await expect(homePage.page.locator('main')).toBeAttached();
    await expect(homePage.page.locator('footer')).toBeAttached();
  });

  test('should have aria-label on content sections', async ({ homePage }) => {
    const sections = await homePage.page.locator('main > section[aria-label]').all();
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  test('should be keyboard navigable', async ({ homePage }) => {
    await homePage.page.keyboard.press('Tab');
    const focusedTag = await homePage.page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
  });

  test('should have visible focus indicators on links', async ({ homePage }) => {
    await homePage.page.keyboard.press('Tab');
    const outlineStyle = await homePage.page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return '';
      const style = getComputedStyle(el);
      return style.outlineStyle || style.outlineWidth;
    });
    expect(outlineStyle).toBeTruthy();
  });

  test('external links should have rel="noopener noreferrer"', async ({ homePage }) => {
    await homePage.scrollToSection('footer');
    const externalLinks = await homePage.page.locator('a[target="_blank"]').all();
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      const rel = await link.getAttribute('rel');
      expect(rel, `Link to ${href} missing rel`).toContain('noopener');
    }
  });

  test('chat window should have aria-hidden when closed', async ({ homePage }) => {
    await expect(homePage.chatWindow).toHaveAttribute('aria-hidden', 'true');
  });
});
