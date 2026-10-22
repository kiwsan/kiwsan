// Screenshot + interaction probe for the Inside the AI Office section.
// light/dark rest states, mobile, and one post-click zone swap.
// Rerun with `node tests/office-shot.mjs` after `npm run build`.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const PORT = 4325;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], {
  cwd: ROOT,
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: 'false' },
  stdio: 'ignore',
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);

mkdirSync('test-results/office-shots', { recursive: true });
const browser = await chromium.launch();
const base = `http://localhost:${PORT}`;

const boot = (context, theme) =>
  context.addInitScript((t) => localStorage.setItem('theme', t), theme);

async function shot(name, { theme, viewport, clickZone } = {}) {
  const context = await browser.newContext({
    viewport: viewport ?? { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  boot(context, theme ?? 'light');
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#office').scrollIntoViewIfNeeded();
  await sleep(400);
  if (clickZone) {
    await page.locator(`.hotspot[data-zone="${clickZone}"]`).click();
    await sleep(400);
  }
  await page.locator('#office').screenshot({ path: `test-results/office-shots/${name}.png` });
  await context.close();
}

await shot('light-gateway', { theme: 'light' });
await shot('dark-gateway', { theme: 'dark' });
await shot('dark-ops-selected', { theme: 'dark', clickZone: 'ops-pipeline' });
await shot('mobile-light', { theme: 'light', viewport: { width: 375, height: 812 } });
await browser.close();
server.kill();
console.log('office shots done');
