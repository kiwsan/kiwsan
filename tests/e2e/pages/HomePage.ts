import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly portfolioLink: Locator;
  readonly linkedInLink: Locator;
  readonly emailLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Full Stack Software Engineer', level: 1 });
    this.portfolioLink = page.getByRole('region', { name: 'Contact Information' }).getByRole('link', { name: 'github.com/kiwsan' });
    this.linkedInLink = page.getByRole('region', { name: 'Contact Information' }).getByRole('link', { name: 'linkedin.com/in/kiwsan' });
    this.emailLink = page.getByRole('region', { name: 'Contact Information' }).getByRole('link', { name: 'kiwsanthia@gmail.com' });
  }

  async getHeadingText() {
    return await this.heading.textContent();
  }
}
