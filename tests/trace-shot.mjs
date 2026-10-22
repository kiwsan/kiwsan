// Screenshot probe for the agent-trace terminal: light/dark/mobile rest states
// plus one mid-animation frame. Save nothing but PNGs; exit 0 always.
// Rerun with `node tests/trace-shot.mjs` after `npm run build`.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const PORT = 4324;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], {
  cwd: ROOT,
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: 'false' },
  stdio: 'ignore',
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);

mkdirSync('test-results/trace-shots', { recursive: true });
const browser = await chromium.launch();
const base = `http://localhost:${PORT}`;

// theme must be pinned before page scripts read localStorage.
const boot = (page, theme) =>
  page.addInitScript((t) => localStorage.setItem('theme', t), theme);

async function restShot(name, { viewport, theme, mobile }) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: 'reduce',
    deviceScaleFactor: mobile ? 2 : 1,
  });
  await boot(context, theme);
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await sleep(400);
  await page.locator('#experience').screenshot({ path: `test-results/trace-shots/${name}.png` });
  await context.close();
}

async function motionShot(name) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await boot(context, 'dark');
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await sleep(900);
  await page.screenshot({ path: `test-results/trace-shots/${name}.png` });
  await context.close();
}

await restShot('light-rest', { viewport: { width: 1440, height: 900 }, theme: 'light' });
await restShot('dark-rest', { viewport: { width: 1440, height: 900 }, theme: 'dark' });
await restShot('mobile-rest', { viewport: { width: 375, height: 812 }, theme: 'light', mobile: true });
await motionShot('dark-motion');
await browser.close();
server.kill();
console.log('shots done');
