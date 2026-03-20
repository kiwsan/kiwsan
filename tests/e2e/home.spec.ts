import { test, expect } from './fixtures';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle(/Ekkachai|kiwsan/i);
  });

  test('should display hero section with heading and description', async ({ homePage }) => {
    await expect(homePage.heading).toBeVisible();
    await expect(homePage.heading).toContainText('Million+ orders');
    await expect(homePage.heroLabel).toBeAttached();
    await expect(homePage.heroDescription).toBeAttached();
    await expect(homePage.heroIllustration).toBeAttached();
    await expect(homePage.heroIllustration).toHaveAttribute('alt', /Ekkachai/i);
  });

  test('should display hero CTA buttons with correct anchors', async ({ homePage }) => {
    await expect(homePage.viewMyWorkBtn).toBeVisible();
    await expect(homePage.viewMyWorkBtn).toHaveAttribute('href', '#experience');
    await expect(homePage.getInTouchBtn).toBeVisible();
    await expect(homePage.getInTouchBtn).toHaveAttribute('href', '#contact');
  });

  test('should display hero skill tags', async ({ homePage }) => {
    await expect(homePage.heroTags.first()).toBeAttached();
    const tagCount = await homePage.heroTags.count();
    expect(tagCount).toBeGreaterThanOrEqual(3);
  });

  test('should display metrics section with cards', async ({ homePage }) => {
    await homePage.scrollToSection('.metrics');
    await expect(homePage.metricsSection).toBeAttached();
    const cardCount = await homePage.metricCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(2);
  });

  test('should display work experience section with cards', async ({ homePage }) => {
    await homePage.scrollToSection('#experience');
    await expect(homePage.experienceSection).toBeAttached();
    await expect(homePage.experienceHeading).toContainText('Work Experience');
    const workCount = await homePage.workCards.count();
    expect(workCount).toBeGreaterThanOrEqual(1);
  });

  test('should display work cards with expected structure', async ({ homePage }) => {
    await homePage.scrollToSection('#experience');
    const firstCard = homePage.workCards.first();
    await expect(firstCard.locator('h3')).toBeAttached();
    await expect(firstCard.locator('.company')).toBeAttached();
    await expect(firstCard.locator('.period')).toBeAttached();
    await expect(firstCard.locator('.tech-tag').first()).toBeAttached();
  });

  test('should display projects section with cards', async ({ homePage }) => {
    await homePage.scrollToSection('#projects');
    await expect(homePage.projectsSection).toBeAttached();
    await expect(homePage.projectsHeading).toContainText('Featured Projects');
    const projectCount = await homePage.projectCards.count();
    expect(projectCount).toBeGreaterThanOrEqual(1);
  });

  test('should display project cards with expected structure', async ({ homePage }) => {
    await homePage.scrollToSection('#projects');
    const firstCard = homePage.projectCards.first();
    await expect(firstCard.locator('h3')).toBeAttached();
    await expect(firstCard.locator('.tech-tag').first()).toBeAttached();
  });

  test('should display tech stack section with skill categories', async ({ homePage }) => {
    await homePage.scrollToSection('section.tech-stack');
    await expect(homePage.techStackSection).toBeAttached();
    await expect(homePage.techStackHeading).toContainText('Tech Stack');
    const skillCount = await homePage.skillTags.count();
    expect(skillCount).toBeGreaterThanOrEqual(5);
  });

  test('should display contact section with links', async ({ homePage }) => {
    await homePage.scrollToSection('#contact');
    await expect(homePage.contactSection).toBeAttached();
    await expect(homePage.contactHeading).toContainText("Let's Work Together");
    await expect(homePage.portfolioLink).toHaveAttribute('href', /github\.com\/kiwsan/);
    await expect(homePage.linkedInLink).toHaveAttribute('href', /linkedin\.com\/in\/kiwsan/);
    await expect(homePage.emailLink).toHaveAttribute('href', 'mailto:kiwsanthia@gmail.com');
  });

  test('should display footer with links', async ({ homePage }) => {
    await homePage.scrollToSection('footer');
    await expect(homePage.footer).toBeAttached();
    const linkCount = await homePage.footerLinks.count();
    expect(linkCount).toBe(3);
  });
});
