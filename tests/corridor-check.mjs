// Corridor verification for the Work Experience 3D gallery.
// Serves the built dist and drives a real browser with reducedMotion OFF.
// Asserts: no overflow, always one readable card, camera dollies with scroll,
// rotateY sign, cull sanity, theme response, and the flat reduced-motion path.
// Rerun with `node tests/corridor-check.mjs` after `npm run build`.
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const PORT = 4323;
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--force'], {
  cwd: new URL('..', import.meta.url).pathname,
  env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: 'false' },
  stdio: 'ignore',
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);

const browser = await chromium.launch();
const problems = [];
const report = (label, detail) => problems.push(`${label}: ${detail}`);

// --- Session 1: 3D mode, motion allowed ---
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', colorScheme: 'dark' });
const page = await context.newPage();
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`console: ${m.text()}`); });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// 1. Mode and card inventory.
const boot = await page.evaluate(() => window.__exp3d);
console.log(`boot: mode=${boot?.mode} cards=${boot?.cards?.length}`);
if (boot?.mode !== '3d') report('mode', `expected 3d, got ${boot?.mode}`);
if (boot?.cards?.length !== 6) report('cards', `expected 6 corridor cards, got ${boot?.cards?.length}`);

// 2. No horizontal overflow at three desktop widths (all stay in 3d mode).
for (const width of [1440, 1024, 800]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`overflow @ ${width}px: ${overflow}px`);
  if (overflow > 1) report('overflow', `width ${width}px scrolls ${overflow}px horizontally`);
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(500);

// 3. Readability sweep across the runway: at every sample at least one card
//    must be fully inside the viewport, at opacity >= 0.7, at readable width.
const runway = await page.evaluate(() => {
  const r = document.querySelector('#experience .runway').getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
});
const viewportHeight = await page.evaluate(() => window.innerHeight);
const scrub = runway.height - viewportHeight;
const samples = [];
for (let k = 0; k <= 10; k++) {
  const y = runway.top + (scrub * k) / 10;
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(450);
  const snap = await page.evaluate(() => {
    const state = window.__exp3d;
    const readable = Array.from(document.querySelectorAll('#experience .timeline-card'))
      .map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          i,
          inside: r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth,
          opacity: parseFloat(getComputedStyle(c).opacity),
          width: r.width,
        };
      })
      .filter((c) => c.inside && c.opacity >= 0.7 && c.width >= 240);
    return { progress: state.progress, camZ: state.camZ, lookX: state.lookX, readable };
  });
  samples.push(snap);
  console.log(
    `p=${snap.progress.toFixed(3)} camZ=${snap.camZ.toFixed(0)} lookX=${snap.lookX.toFixed(0)} readable=[` +
    snap.readable.map((r) => `card${r.i} op=${r.opacity.toFixed(2)} w=${r.width.toFixed(0)}`).join(', ') + ']'
  );
  if (snap.readable.length < 1) report('readable', `scroll ${Math.round(y)}: no fully visible readable card`);
}

// 4. Camera must dolly forward (z strictly decreases) as scroll progresses.
const camZs = samples.map((s) => s.camZ);
const monotonic = camZs.every((z, i) => i === 0 || z < camZs[i - 1]);
console.log(`camZ over sweep: ${camZs[0].toFixed(0)} -> ${camZs[camZs.length - 1].toFixed(0)} (monotonic: ${monotonic})`);
if (!monotonic) report('camera', 'camera z did not decrease monotonically with scroll');

// 5. rotateY sign via the projected transform: a card's world matrix embeds
//    rotation.y = -lane * 20deg, so matrix3d value i (index 8) = sin(rotation)
//    must be positive for the left lane and negative for the right lane,
//    meaning every card faces the corridor center. Read at p=0, where the
//    camera sits in front of the corridor and no card is culled.
await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), runway.top);
await page.waitForTimeout(500);
const turns = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('#experience .timeline-card'));
  return els.map((el) => {
    const matrix = getComputedStyle(el).transform;
    const m = matrix.match(/matrix3d\(([^)]+)\)/);
    if (!m) return { i: null };
    const v = m[1].split(',').map((s) => parseFloat(s));
    return { i: +v[8].toFixed(4) };
  });
});
console.log('rotateY matrix i per card (lane -1 expect > 0, lane +1 expect < 0):', JSON.stringify(turns));
turns.forEach((t, i) => {
  const lane = i % 2 === 0 ? -1 : 1;
  if (t.i === null) return report('rotateY', `card ${i} has no matrix3d transform`);
  const expectedPositive = lane === -1;
  if (expectedPositive ? t.i <= 0 : t.i >= 0) report('rotateY', `card ${i} (lane ${lane}) not turned toward center: i=${t.i}`);
});

// 6. Cull sanity: no card may ever cover most of the stage (behind-camera
//    cards are hidden by the corridor, so a passing card stays at the edges).
for (const frac of [0.05, 0.15, 0.5, 0.9]) {
  const y = runway.top + scrub * frac;
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(450);
  const coverage = await page.evaluate(() => {
    const vw = window.innerWidth * window.innerHeight;
    return Math.max(...Array.from(document.querySelectorAll('#experience .timeline-card')).map((c) => {
      const r = c.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0)) *
        Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      return visible / vw;
    }));
  });
  console.log(`max card viewport coverage @ p=${frac}: ${(coverage * 100).toFixed(1)}%`);
  if (coverage > 0.75) report('blowup', `card covers ${(coverage * 100).toFixed(1)}% of the viewport`);
}

// 8. Narrow viewport must flip to flat even with motion allowed, and cards
//    must be restored to the timeline; widening again must rebuild the 3d.
await page.setViewportSize({ width: 700, height: 900 });
await page.waitForTimeout(600);
const narrow = await page.evaluate(() => ({
  mode: window.__exp3d?.mode,
  runwayHidden: document.querySelector('#experience .runway').hidden,
  cardsInTimeline: document.querySelectorAll('#experience .timeline .timeline-card').length,
  cardsInStage: document.querySelectorAll('#experience .stage .timeline-card').length,
}));
console.log(`narrow 700px: mode=${narrow.mode} runwayHidden=${narrow.runwayHidden} cardsInTimeline=${narrow.cardsInTimeline} cardsInStage=${narrow.cardsInStage}`);
if (narrow.mode !== 'flat' || !narrow.runwayHidden || narrow.cardsInTimeline !== 6 || narrow.cardsInStage !== 0) {
  report('mobile-flat', `expected flat with 6 restored cards at 700px, got ${JSON.stringify(narrow)}`);
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(600);
const rewidened = await page.evaluate(() => ({
  mode: window.__exp3d?.mode,
  cardsInStage: document.querySelectorAll('#experience .stage .timeline-card').length,
}));
console.log(`rewidened 1440px: mode=${rewidened.mode} cardsInStage=${rewidened.cardsInStage}`);
if (rewidened.mode !== '3d' || rewidened.cardsInStage !== 6) {
  report('rewiden', `expected 3d rebuild after widening, got ${JSON.stringify(rewidened)}`);
}

// 7. Theme: the card surface must follow the theme variables in 3d mode.
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(500);
const darkBg = await page.evaluate(() => getComputedStyle(document.querySelector('#experience .timeline-card')).backgroundColor);
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
await page.waitForTimeout(400);
const lightBg = await page.evaluate(() => getComputedStyle(document.querySelector('#experience .timeline-card')).backgroundColor);
console.log(`card surface dark=${darkBg} light=${lightBg}`);
if (darkBg === lightBg) report('theme', 'card surface did not respond to the light theme');

// The site's Layout CSS inlines a small font subset as a data: URI that the
// page CSP blocks; that error predates the corridor and is unrelated to it.
const knownCspFont = consoleErrors.filter((e) => e.includes('data:font/woff2'));
const otherErrors = consoleErrors.filter((e) => !knownCspFont.includes(e));
if (knownCspFont.length) console.log(`ignored pre-existing CSP data:font errors: ${knownCspFont.length}`);
if (otherErrors.length) report('console', otherErrors.join(' | '));
await context.close();

// --- Session 2: reduced motion = flat fallback ---
const flatCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const flatPage = await flatCtx.newPage();
await flatPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
await flatPage.waitForTimeout(400);

const flat = await flatPage.evaluate(() => {
  const runwayEl = document.querySelector('#experience .runway');
  const cards = Array.from(document.querySelectorAll('#experience .timeline-card'));
  return {
    mode: window.__exp3d?.mode,
    runwayHidden: !runwayEl || runwayEl.hidden || getComputedStyle(runwayEl).display === 'none',
    sectionHeight: document.querySelector('#experience').getBoundingClientRect().height,
    cards: cards.map((c) => ({
      h3: c.querySelector('h3')?.textContent?.trim() ?? '',
      company: c.querySelector('.company')?.textContent?.trim() ?? '',
      period: c.querySelector('.period')?.textContent?.trim() ?? '',
      tech: c.querySelectorAll('.tech-tag').length,
      opacity: getComputedStyle(c).opacity,
      transform: getComputedStyle(c).transform,
      width: c.getBoundingClientRect().width,
    })),
  };
});
console.log(`flat: mode=${flat.mode} runwayHidden=${flat.runwayHidden} sectionHeight=${Math.round(flat.sectionHeight)}px`);
if (flat.mode !== 'flat') report('flat-mode', `expected flat, got ${flat.mode}`);
if (!flat.runwayHidden) report('flat-runway', 'runway not hidden in reduced motion');
flat.cards.forEach((c, i) => {
  if (!c.h3 || !c.company || !c.period || c.tech < 1) report('flat-structure', `card ${i} missing inner text nodes`);
  if (c.opacity !== '1' || c.transform !== 'none') report('flat-static', `card ${i} opacity=${c.opacity} transform=${c.transform}`);
  if (c.width <= 0) report('flat-size', `card ${i} has zero width`);
});

// Walk the flat section and confirm each card can be brought into the viewport.
for (let i = 0; i < flat.cards.length; i++) {
  await flatPage.evaluate((idx) => {
    const card = document.querySelectorAll('#experience .timeline-card')[idx];
    window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2, behavior: 'instant' });
  }, i);
  await flatPage.waitForTimeout(300);
  const inView = await flatPage.evaluate((idx) => {
    const r = document.querySelectorAll('#experience .timeline-card')[idx].getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }, i);
  if (!inView) report('flat-reach', `card ${i} not reachable in viewport`);
}
await flatCtx.close();

// --- Session 3: no JS = static flat list ---
const noJsCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
const noJsPage = await noJsCtx.newPage();
await noJsPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
const noJs = await noJsPage.evaluate(() => ({
  cards: document.querySelectorAll('#experience .timeline-card').length,
  runwayHidden: document.querySelector('#experience .runway').hidden,
  is3d: document.querySelector('#experience').classList.contains('is-3d'),
  firstOpacity: getComputedStyle(document.querySelector('#experience .timeline-card')).opacity,
}));
console.log(`no-JS: cards=${noJs.cards} runwayHidden=${noJs.runwayHidden} is3d=${noJs.is3d} firstOpacity=${noJs.firstOpacity}`);
if (noJs.cards !== 6 || !noJs.runwayHidden || noJs.is3d || noJs.firstOpacity !== '1') {
  report('no-js', `expected static list without JS, got ${JSON.stringify(noJs)}`);
}
await noJsCtx.close();

await browser.close();
server.kill();
console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : 'ALL CORRIDOR CHECKS PASSED');
process.exit(problems.length ? 1 : 0);
