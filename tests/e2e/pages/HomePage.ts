import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Hero
  readonly heading: Locator;
  readonly heroLabel: Locator;
  readonly heroDescription: Locator;
  readonly heroIllustration: Locator;
  readonly viewMyWorkBtn: Locator;
  readonly getInTouchBtn: Locator;
  readonly heroTags: Locator;

  // Header / Nav
  readonly header: Locator;
  readonly logo: Locator;
  readonly navExperience: Locator;
  readonly navProjects: Locator;
  readonly navContact: Locator;
  readonly themeToggle: Locator;
  readonly menuToggle: Locator;
  readonly nav: Locator;

  // Metrics
  readonly metricsSection: Locator;
  readonly metricCards: Locator;

  // Work Experience
  readonly experienceSection: Locator;
  readonly experienceHeading: Locator;
  readonly workCards: Locator;

  // Projects
  readonly projectsSection: Locator;
  readonly projectsHeading: Locator;
  readonly projectCards: Locator;

  // Tech Stack
  readonly techStackSection: Locator;
  readonly techStackHeading: Locator;
  readonly skillTags: Locator;

  // Contact
  readonly contactSection: Locator;
  readonly contactHeading: Locator;
  readonly portfolioLink: Locator;
  readonly linkedInLink: Locator;
  readonly emailLink: Locator;

  // Footer
  readonly footer: Locator;
  readonly footerLinks: Locator;

  // Chat Widget
  readonly chatToggle: Locator;
  readonly chatWindow: Locator;
  readonly chatClose: Locator;
  readonly chatInput: Locator;
  readonly chatSend: Locator;
  readonly chatMessages: Locator;

  constructor(page: Page) {
    super(page);

    // Hero
    this.heading = page.locator('h1');
    this.heroLabel = page.locator('.hero-label');
    this.heroDescription = page.locator('.hero-description');
    this.heroIllustration = page.locator('.hero-illustration img');
    this.viewMyWorkBtn = page.locator('a.btn-primary', { hasText: 'View My Work' });
    this.getInTouchBtn = page.locator('a.btn-secondary', { hasText: 'Get in Touch' });
    this.heroTags = page.locator('.hero .tags span');

    // Header / Nav
    this.header = page.locator('header.header');
    this.logo = page.locator('a.logo');
    this.navExperience = page.locator('nav a[href="#experience"]');
    this.navProjects = page.locator('nav a[href="#projects"]');
    this.navContact = page.locator('nav a[href="#contact"]');
    this.themeToggle = page.locator('#theme-toggle');
    this.menuToggle = page.locator('#menu-toggle');
    this.nav = page.locator('#nav');

    // Metrics
    this.metricsSection = page.locator('section.metrics');
    this.metricCards = page.locator('.metric-card');

    // Work Experience
    this.experienceSection = page.locator('#experience');
    this.experienceHeading = page.locator('#experience h2');
    this.workCards = page.locator('.work-card');

    // Projects
    this.projectsSection = page.locator('#projects');
    this.projectsHeading = page.locator('#projects h2');
    this.projectCards = page.locator('.project-card');

    // Tech Stack
    this.techStackSection = page.locator('section.tech-stack');
    this.techStackHeading = page.locator('section.tech-stack h2');
    this.skillTags = page.locator('.skill-tag');

    // Contact
    this.contactSection = page.locator('#contact');
    this.contactHeading = page.locator('#contact h2');
    this.portfolioLink = page.locator('#contact a[href*="github.com/kiwsan"]');
    this.linkedInLink = page.locator('#contact a[href*="linkedin.com/in/kiwsan"]');
    this.emailLink = page.locator('#contact a[href="mailto:kiwsanthia@gmail.com"]');

    // Footer
    this.footer = page.locator('footer.footer');
    this.footerLinks = page.locator('.footer-links a');

    // Chat Widget
    this.chatToggle = page.locator('#chat-toggle');
    this.chatWindow = page.locator('#chat-window');
    this.chatClose = page.locator('#chat-close');
    this.chatInput = page.locator('#chat-input');
    this.chatSend = page.locator('#chat-send');
    this.chatMessages = page.locator('#chat-messages');
  }

  async getHeadingText() {
    return await this.heading.textContent();
  }

  async openChat() {
    await this.chatToggle.click();
    // First click initializes, second opens — the widget handles this internally
    await this.page.waitForFunction(
      () => document.getElementById('chat-window')?.classList.contains('open'),
      { timeout: 5000 }
    );
  }

  async closeChat() {
    await this.chatClose.click();
    await this.page.waitForFunction(
      () => !document.getElementById('chat-window')?.classList.contains('open'),
      { timeout: 5000 }
    );
  }

  async sendChatMessage(text: string) {
    await this.chatInput.fill(text);
    await this.chatSend.click();
  }

  async scrollToSection(sectionId: string) {
    await this.page.locator(sectionId).scrollIntoViewIfNeeded();
  }
}
