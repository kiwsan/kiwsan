#!/usr/bin/env node
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const fontDir = join(root, 'node_modules', '@fontsource-variable');
const outputDir = join(root, 'public', 'images');
const socialDir = join(outputDir, 'social');

const font = (file) => readFileSync(file).toString('base64');
const manrope = font(join(fontDir, 'manrope', 'files', 'manrope-latin-wght-normal.woff2'));
const inter = font(join(fontDir, 'inter', 'files', 'inter-latin-wght-normal.woff2'));

const C = {
  paper: '#F2EFE7',
  ink: '#15171C',
  muted: '#5E5A52',
  cobalt: '#1E3A8A',
  red: '#C24B32',
  hair: 'rgba(21,23,28,0.18)',
};

const cube = (cx, cy, w, h, v) => ({
  top: `M${cx},${cy - h} L${cx + w},${cy} L${cx},${cy + h} L${cx - w},${cy} Z`,
  left: `M${cx - w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx - w},${cy + v} Z`,
  right: `M${cx + w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx + w},${cy + v} Z`,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const windows = (cx, topY, halfWidth, depth, height, side) => {
  const rows = clamp(Math.round(height / 32), 3, 6);
  const cols = clamp(Math.round(halfWidth / 15), 2, 3);
  const uStart = 0.16;
  const uSpan = 0.68;
  const vStart = 0.12;
  const vSpan = 0.76;
  const cellW = uSpan / cols;
  const cellH = vSpan / rows;
  const winW = cellW * 0.5;
  const winH = cellH * 0.38;
  const point = (u, v) =>
    side === 'left'
      ? [cx - halfWidth + u * halfWidth, topY + u * depth + v * height]
      : [cx + u * halfWidth, topY + depth - u * depth + v * height];
  const outline = [];
  const solid = [];
  const offset = side === 'left' ? 0 : 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const u0 = uStart + col * cellW + (cellW - winW) / 2;
      const u1 = u0 + winW;
      const v0 = vStart + row * cellH + (cellH - winH) / 2;
      const v1 = v0 + winH;
      const [x0, y0] = point(u0, v0);
      const [x1, y1] = point(u1, v0);
      const [x2, y2] = point(u1, v1);
      const [x3, y3] = point(u0, v1);
      const pane = `M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} Z`;
      outline.push(pane);
      if ((row + col + offset) % 5 === 0) solid.push(pane);
    }
  }

  return { outline: outline.join(' '), solid: solid.join(' ') };
};

const tower = ({ cx, baseY, halfW, height, id, roof = 'flat' }) => {
  const depth = halfW * 0.5;
  const topY = baseY - height;
  const body = cube(cx, topY, halfW, depth, height);
  const left = windows(cx, topY, halfW, depth, height, 'left');
  const right = windows(cx, topY, halfW, depth, height, 'right');
  const setback =
    roof === 'setback'
      ? cube(cx, topY - 9, halfW * 0.52, depth * 0.52, 9)
      : roof === 'antenna'
        ? cube(cx, topY - 9, halfW * 0.46, depth * 0.46, 9)
        : null;
  const vent = roof === 'vent' ? cube(cx, topY - 4, halfW * 0.28, depth * 0.28, 4) : null;
  const antenna =
    roof === 'antenna' ? { x: cx, base: topY - depth - 4, tip: topY - depth - 52 } : null;

  const paperFill = C.paper;
  const ink = C.ink;
  const roofEdge = `M${cx - halfW},${topY} L${cx},${topY - depth} L${cx + halfW},${topY}`;
  const frontEdge = `M${cx},${topY + depth} L${cx},${baseY + depth}`;

  return `
    <g id="tower-${id}">
      <path d="${body.left}" fill="${paperFill}" stroke="${ink}" stroke-width="1.15"/>
      <path d="${body.right}" fill="${paperFill}" stroke="${ink}" stroke-width="1.15"/>
      <path d="${body.top}" fill="${paperFill}" stroke="${ink}" stroke-width="1.2"/>
      <path d="${left.outline}" fill="none" stroke="${ink}" stroke-width="0.65"/>
      <path d="${right.outline}" fill="none" stroke="${ink}" stroke-width="0.65"/>
      <path d="${left.solid}" fill="${ink}" opacity="0.9"/>
      <path d="${right.solid}" fill="${ink}" opacity="0.82"/>
      <path d="${roofEdge}" fill="none" stroke="${ink}" stroke-width="1.4"/>
      <path d="${frontEdge}" fill="none" stroke="${ink}" stroke-width="0.9"/>
      ${setback ? `<path d="${setback.left}" fill="${paperFill}" stroke="${ink}" stroke-width="1"/><path d="${setback.right}" fill="${paperFill}" stroke="${ink}" stroke-width="1"/><path d="${setback.top}" fill="${paperFill}" stroke="${ink}" stroke-width="1.1"/>` : ''}
      ${vent ? `<path d="${vent.left}" fill="${paperFill}" stroke="${ink}" stroke-width="0.9"/><path d="${vent.right}" fill="${paperFill}" stroke="${ink}" stroke-width="0.9"/><path d="${vent.top}" fill="${paperFill}" stroke="${ink}" stroke-width="1"/>` : ''}
      ${antenna ? `<path d="M${antenna.x} ${antenna.base} L${antenna.x} ${antenna.tip}" stroke="${ink}" stroke-width="1"/><circle cx="${antenna.x}" cy="${antenna.tip}" r="2.2" fill="${ink}"/>` : ''}
    </g>`;
};

const illustration = () => {
  const left = tower({ cx: 316, baseY: 400, halfW: 40, height: 128, id: 'l', roof: 'vent' });
  const right = tower({ cx: 572, baseY: 400, halfW: 44, height: 150, id: 'r', roof: 'setback' });
  const center = tower({ cx: 446, baseY: 390, halfW: 60, height: 202, id: 'c', roof: 'antenna' });
  const padTop = cube(446, 400, 224, 112, 5);
  const padInner = 'M446,318 L642,400 L446,482 L250,400 Z';
  const padDashed = 'M446,336 L610,400 L446,464 L282,400 Z';

  return `
    <svg class="scene" viewBox="0 0 700 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Line drawing of an isometric office campus on a cobalt field">
      <defs>
        <pattern id="paperGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="${C.ink}" stroke-opacity="0.055" stroke-width="0.5"/>
        </pattern>
        <pattern id="diskDots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.55" fill="${C.paper}" opacity="0.28"/>
        </pattern>
      </defs>

      <rect x="28" y="28" width="644" height="464" fill="url(#paperGrid)"/>

      <circle cx="452" cy="260" r="198" fill="${C.cobalt}"/>
      <circle cx="452" cy="260" r="198" fill="url(#diskDots)"/>
      <circle cx="452" cy="260" r="216" fill="none" stroke="${C.cobalt}" stroke-opacity="0.3" stroke-width="0.8" stroke-dasharray="2 7"/>

      <path d="M120 432 L650 432" stroke="${C.ink}" stroke-opacity="0.22" stroke-width="0.7" stroke-dasharray="2 6"/>
      <path d="M656 188 L656 404 M652 188 L660 188 M652 404 L660 404" stroke="${C.ink}" stroke-opacity="0.4" stroke-width="0.7"/>

      <g>
        <path d="${padTop.left}" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.9"/>
        <path d="${padTop.right}" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.9"/>
        <path d="${padTop.top}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.1"/>
        <path d="${padInner}" fill="none" stroke="${C.ink}" stroke-opacity="0.45" stroke-width="0.7"/>
        <path d="${padDashed}" fill="none" stroke="${C.ink}" stroke-opacity="0.28" stroke-width="0.6" stroke-dasharray="2 5"/>
        <path d="M446,388 L446,412 M434,400 L458,400" stroke="${C.ink}" stroke-opacity="0.4" stroke-width="0.7"/>
      </g>

      ${left}
      ${right}
      ${center}

      <g font-family="Menlo, Monaco, monospace" fill="${C.ink}">
        <text x="36" y="38" font-size="8.5" letter-spacing="0.12em" opacity="0.62">AXONOMETRIC / 01</text>
        <text x="36" y="492" font-size="8.5" letter-spacing="0.12em" opacity="0.62">CAREER FLOOR</text>
        <text x="610" y="492" font-size="8.5" letter-spacing="0.12em" opacity="0.62">FIG. 01</text>
        <text x="666" y="404" font-size="8" letter-spacing="0.08em" opacity="0.5">ELEV.</text>
      </g>

      <g stroke="${C.red}" stroke-width="1.2" fill="none">
        <path d="M648 56 L662 56 M655 49 L655 63"/>
        <rect x="652" y="446" width="6" height="6" fill="${C.red}" stroke="none"/>
      </g>
    </svg>`;
};

const css = `
  @font-face {
    font-family: 'Manrope';
    src: url(data:font/woff2;base64,${manrope}) format('woff2');
    font-weight: 200 800;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'Inter';
    src: url(data:font/woff2;base64,${inter}) format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: block;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 100%; height: 100%; background: ${C.paper}; }
  body { font-family: 'Inter', sans-serif; color: ${C.ink}; -webkit-font-smoothing: antialiased; }
  .card {
    position: relative; width: 100%; height: 100%; overflow: hidden;
    background: ${C.paper};
  }
  .grain {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.045;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .topbar, .copy, .visual, .bottombar { position: absolute; z-index: 2; }
  .topbar { top: 42px; left: 56px; right: 56px; display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 11px; }
  .mark { width: 30px; height: 30px; }
  .brand span {
    font-family: Menlo, Monaco, monospace; font-size: 10px; letter-spacing: 0.16em; color: ${C.ink};
  }
  .topmeta {
    font-family: Menlo, Monaco, monospace; font-size: 9px; letter-spacing: 0.12em; color: ${C.muted};
    display: flex; align-items: center; gap: 16px;
  }
  .topmeta i { width: 5px; height: 5px; background: ${C.red}; display: inline-block; }
  .rule-top {
    position: absolute; left: 56px; right: 56px; top: 92px; height: 1px; background: ${C.hair}; z-index: 2;
  }
  .copy { left: 56px; }
  .eyebrow {
    font-family: Menlo, Monaco, monospace; text-transform: uppercase; color: ${C.cobalt};
    letter-spacing: 0.14em; margin: 0 0 18px;
  }
  h1 {
    font-family: 'Manrope', sans-serif; font-weight: 800; margin: 0; color: ${C.ink};
    letter-spacing: -0.055em; line-height: 0.88;
  }
  h1 .k { color: ${C.cobalt}; }
  .lede { color: ${C.muted}; margin: 22px 0 0; line-height: 1.5; }
  .lede strong { color: ${C.ink}; font-weight: 500; }
  .cred-rule { width: 42px; height: 1px; background: ${C.ink}; opacity: 0.55; margin-top: 28px; }
  .credentials {
    font-family: Menlo, Monaco, monospace; color: ${C.muted}; letter-spacing: 0.03em;
    margin: 12px 0 0; white-space: nowrap;
  }
  .credentials b { color: ${C.ink}; font-weight: 400; }
  .visual { aspect-ratio: 700 / 520; }
  .scene { display: block; width: 100%; height: 100%; }
  .bottombar { left: 56px; right: 56px; display: flex; align-items: center; justify-content: space-between; }
  .rule-bottom {
    position: absolute; left: 0; right: 0; top: -18px; height: 1px; background: ${C.hair};
  }
  .domain { font-family: Menlo, Monaco, monospace; color: ${C.ink}; letter-spacing: 0.08em; }
  .meta { font-family: Menlo, Monaco, monospace; color: ${C.muted}; letter-spacing: 0.08em; text-align: right; }

  body.landscape .copy { top: 158px; width: 500px; }
  body.landscape .eyebrow { font-size: 10.5px; }
  body.landscape h1 { font-size: 78px; }
  body.landscape .lede { font-size: 17.5px; max-width: 460px; }
  body.landscape .credentials { font-size: 9.5px; }
  body.landscape .visual { right: 26px; top: 84px; width: 610px; }
  body.landscape .bottombar { bottom: 34px; }
  body.landscape .domain { font-size: 12px; }
  body.landscape .meta { font-size: 9px; }

  body.square .copy { top: 138px; width: 1040px; }
  body.square .eyebrow { font-size: 14px; }
  body.square h1 { font-size: 102px; }
  body.square .lede { font-size: 22px; max-width: 900px; }
  body.square .credentials { font-size: 12px; }
  body.square .visual { left: 170px; top: 450px; width: 860px; }
  body.square .bottombar { bottom: 42px; }
  body.square .domain { font-size: 16px; }
  body.square .meta { font-size: 11px; }

  body.portrait .copy { top: 124px; width: 920px; }
  body.portrait .eyebrow { font-size: 13px; }
  body.portrait h1 { font-size: 94px; }
  body.portrait .lede { font-size: 21px; max-width: 780px; }
  body.portrait .credentials { font-size: 11px; }
  body.portrait .visual { left: 90px; top: 530px; width: 900px; }
  body.portrait .bottombar { bottom: 44px; }
  body.portrait .domain { font-size: 15px; }
  body.portrait .meta { font-size: 10px; }

  body.story .topbar { top: 66px; left: 80px; right: 80px; }
  body.story .rule-top { left: 80px; right: 80px; top: 118px; }
  body.story .copy { top: 198px; left: 80px; width: 920px; }
  body.story .eyebrow { font-size: 15px; }
  body.story h1 { font-size: 108px; }
  body.story .lede { font-size: 25px; max-width: 820px; }
  body.story .credentials { font-size: 13px; }
  body.story .visual { left: 50px; top: 620px; width: 980px; }
  body.story .bottombar { bottom: 74px; left: 80px; right: 80px; }
  body.story .domain { font-size: 19px; }
  body.story .meta { font-size: 11px; }
  body.story .story-stats {
    position: absolute; z-index: 2; left: 80px; right: 80px; top: 1500px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-top: 1px solid ${C.hair}; padding-top: 24px;
  }
  body.story .story-stats strong {
    display: block; font-family: 'Manrope', sans-serif; font-weight: 800;
    font-size: 42px; color: ${C.ink}; letter-spacing: -0.045em; line-height: 1;
  }
  body.story .story-stats span {
    display: block; font-family: Menlo, Monaco, monospace; font-size: 9px;
    color: ${C.muted}; letter-spacing: 0.12em; margin-top: 8px;
  }
`;

const mark = `
  <svg class="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M5 28C13 6 27 6 35 28" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
    <path d="M5 12C13 34 27 34 35 12" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="5" cy="28" r="1.1" fill="${C.ink}"/><circle cx="35" cy="28" r="1.1" fill="${C.ink}"/>
    <circle cx="5" cy="12" r="1.1" fill="${C.ink}"/><circle cx="35" cy="12" r="1.1" fill="${C.ink}"/>
  </svg>`;

const copy = (story = false) => `
  <p class="eyebrow">AI Manager / Full Stack Engineer</p>
  <h1>Ekkachai <span class="k">K.</span></h1>
  <p class="lede">I build AI platforms and the integration backbone behind <strong>1M+ orders a year</strong>.</p>
  <div class="cred-rule"></div>
  <p class="credentials"><b>10+</b> years in software <span>·</span> <b>1M+</b> orders/year <span>·</span> Bangkok / Remote</p>
  ${
    story
      ? `<div class="story-stats">
          <div><strong>1M+</strong><span>ORDERS / YEAR</span></div>
          <div><strong>10+</strong><span>YEARS ENGINEERING</span></div>
          <div><strong>AI</strong><span>PLATFORM &amp; AGENTS</span></div>
        </div>`
      : ''
  }`;

const card = (layout) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><style>${css}</style></head>
<body class="${layout}">
  <div class="card">
    <div class="grain"></div>
    <header class="topbar">
      <div class="brand">${mark}<span>KIWSAN.COM</span></div>
      <div class="topmeta"><span>PORTFOLIO / 2026</span><i></i><span>BANGKOK / REMOTE</span></div>
    </header>
    <div class="rule-top"></div>
    <section class="copy">${copy(layout === 'story')}</section>
    <div class="visual">${illustration()}</div>
    <footer class="bottombar">
      <span class="rule-bottom"></span>
      <span class="domain">kiwsan.com</span>
      <span class="meta">AI PLATFORM / E-COMMERCE / CLOUD</span>
    </footer>
  </div>
</body>
</html>`;

const variants = [
  { layout: 'landscape', name: 'og-image.png', width: 1200, height: 630, dir: outputDir },
  { layout: 'square', name: 'og-square.jpg', width: 1200, height: 1200, dir: socialDir },
  { layout: 'portrait', name: 'og-portrait.jpg', width: 1080, height: 1350, dir: socialDir },
  { layout: 'story', name: 'og-story.jpg', width: 1080, height: 1920, dir: socialDir },
];

const only = process.argv.find((arg) => arg.startsWith('--only='))?.split('=')[1];
const targets = only ? variants.filter((variant) => variant.layout === only) : variants;

mkdirSync(socialDir, { recursive: true });

const browser = await chromium.launch();
for (const variant of targets) {
  const page = await browser.newPage({
    viewport: { width: variant.width, height: variant.height },
    deviceScaleFactor: 2,
  });
  await page.setContent(card(variant.layout), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  const shot = await page.screenshot({ type: 'png' });
  await page.close();

  const target = join(variant.dir, variant.name);
  const pipeline = sharp(shot).resize(variant.width, variant.height, {
    fit: 'cover',
    kernel: 'lanczos3',
  });

  if (variant.name.endsWith('.jpg')) {
    await pipeline.jpeg({ quality: 90, mozjpeg: true }).toFile(target);
  } else {
    await pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        colors: 256,
        dither: 0.8,
      })
      .toFile(target);
  }

  console.log(`${variant.layout}: ${target}`);
}

await browser.close();
