// Section-by-section screenshots for the UX/UI review.
// Uses the running dev server on :4321. Output: tests/test-results/review/
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4321/';
const out = 'test-results/review';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const sections = [
  ['hero', '.hero'],
  ['metrics', '.metrics'],
  ['projects', '#projects'],
  ['techstack', '.tech-stack'],
  ['contact', '#contact'],
  ['footer', 'footer'],
];

async function shoot(name, theme, viewport, opts = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: opts.motion ?? 'reduce' });
  await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  for (const [label, sel] of sections) {
    const el = page.locator(sel).first();
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await el.screenshot({ path: `${out}/${name}-${label}.png` }).catch(() => {});
  }
  // full page for flow
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  await context.close();
}

await shoot('light', 'light', { width: 1440, height: 900 });
await shoot('dark', 'dark', { width: 1440, height: 900 });
await shoot('mobile', 'light', { width: 390, height: 844 });
await browser.close();
console.log('review shots done');
