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
  ink: '#f4f7ff',
  muted: '#a7b3c8',
  dim: '#74839c',
  blue: '#7aa2f7',
  purple: '#bb9af7',
  cyan: '#7dcfff',
  green: '#9ece6a',
  amber: '#e0af68',
  pink: '#f7768e',
};

const cube = (cx, cy, w, h, v) => ({
  top: `M${cx},${cy - h} L${cx + w},${cy} L${cx},${cy + h} L${cx - w},${cy} Z`,
  left: `M${cx - w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx - w},${cy + v} Z`,
  right: `M${cx + w},${cy} L${cx},${cy + h} L${cx},${cy + h + v} L${cx + w},${cy + v} Z`,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const windows = (cx, topY, halfWidth, depth, height, side, accent) => {
  const rows = clamp(Math.round(height / 30), 3, 7);
  const cols = clamp(Math.round(halfWidth / 13), 2, 4);
  const uStart = 0.14;
  const uSpan = 0.72;
  const vStart = 0.1;
  const vSpan = 0.8;
  const cellW = uSpan / cols;
  const cellH = vSpan / rows;
  const winW = cellW * 0.52;
  const winH = cellH * 0.4;
  const point = (u, v) =>
    side === 'left'
      ? [cx - halfWidth + u * halfWidth, topY + u * depth + v * height]
      : [cx + u * halfWidth, topY + depth - u * depth + v * height];
  const dim = [];
  const lit = [];
  const warm = [];
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
      dim.push(pane);
      if ((row + col + offset) % 4 === 0) lit.push(pane);
      if ((row * 3 + col + offset) % 11 === 0) warm.push(pane);
    }
  }

  return {
    dim: dim.join(' '),
    lit: lit.join(' '),
    warm: warm.join(' '),
    accent,
  };
};

const gradient = (id, from, to, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;

const tower = ({ cx, baseY, halfW, height, accent, id, roof = 'flat' }) => {
  const depth = halfW * 0.5;
  const topY = baseY - height;
  const body = cube(cx, topY, halfW, depth, height);
  const left = windows(cx, topY, halfW, depth, height, 'left', accent);
  const right = windows(cx, topY, halfW, depth, height, 'right', accent);
  const crown =
    roof === 'antenna' || roof === 'setback'
      ? cube(cx, topY - 9, halfW * 0.52, depth * 0.52, 9)
      : null;
  const vent = roof === 'vent' ? cube(cx, topY - 4, halfW * 0.26, depth * 0.26, 4) : null;
  const antenna =
    roof === 'antenna' ? { x: cx, base: topY - depth - 2, tip: topY - depth - 74 } : null;

  const roofLine = `M${cx - halfW},${topY} L${cx},${topY - depth} L${cx + halfW},${topY}`;
  const frontEdge = `M${cx},${topY + depth} L${cx},${baseY + depth}`;
  const leftGradient = `tower-${id}-left`;
  const rightGradient = `tower-${id}-right`;
  const topGradient = `tower-${id}-top`;

  return {
    defs: [
      gradient(leftGradient, '#1b2742', '#0b1220'),
      gradient(rightGradient, '#0f1829', '#070b13'),
      gradient(topGradient, '#2b3b5c', '#162136'),
    ].join(''),
    svg: `
      <g>
        <path d="${body.left}" fill="url(#${leftGradient})"/>
        <path d="${body.right}" fill="url(#${rightGradient})"/>
        <path d="${body.left}" fill="${accent}" opacity="0.035"/>
        <path d="${body.right}" fill="${accent}" opacity="0.02"/>
        <path d="${body.top}" fill="url(#${topGradient})" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.1"/>
        <path d="${left.dim}" fill="${accent}" opacity="0.22"/>
        <path d="${right.dim}" fill="${accent}" opacity="0.18"/>
        <path d="${left.lit}" fill="${accent}" opacity="0.68" filter="url(#windowGlow)"/>
        <path d="${right.lit}" fill="${accent}" opacity="0.55" filter="url(#windowGlow)"/>
        <path d="${left.warm}" fill="${C.amber}" opacity="0.5"/>
        <path d="${right.warm}" fill="${C.amber}" opacity="0.38"/>
        <path d="${roofLine}" fill="none" stroke="${accent}" stroke-opacity="0.85" stroke-width="1.4"/>
        <path d="${frontEdge}" fill="none" stroke="${accent}" stroke-opacity="0.32" stroke-width="1"/>
        ${crown ? `<g><path d="${crown.left}" fill="url(#${leftGradient})"/><path d="${crown.right}" fill="url(#${rightGradient})"/><path d="${crown.top}" fill="url(#${topGradient})" stroke="${accent}" stroke-opacity="0.7" stroke-width="1"/></g>` : ''}
        ${vent ? `<g><path d="${vent.left}" fill="url(#${leftGradient})"/><path d="${vent.right}" fill="url(#${rightGradient})"/><path d="${vent.top}" fill="url(#${topGradient})" stroke="${accent}" stroke-opacity="0.6"/></g>` : ''}
        ${
          antenna
            ? `<g><path d="M${antenna.x} ${antenna.base} L${antenna.x} ${antenna.tip}" stroke="${C.cyan}" stroke-opacity="0.8" stroke-width="1.2"/><circle cx="${antenna.x}" cy="${antenna.tip}" r="3" fill="${C.cyan}" filter="url(#windowGlow)"/><circle cx="${antenna.x}" cy="${antenna.tip}" r="1.4" fill="#ffffff"/></g>`
            : ''
        }
      </g>`,
  };
};

const tag = (x, y, w, h, text, line) => {
  const midY = y + h / 2;
  return `
    <g>
      <path d="${line}" fill="none" stroke="${C.blue}" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="3 4"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="rgba(9,13,22,0.88)" stroke="rgba(122,162,247,0.32)" stroke-width="1"/>
      <circle cx="${x + 11}" cy="${midY}" r="2.4" fill="${C.blue}"/>
      <text x="${x + 20}" y="${midY + 3.8}" fill="#c9d6ee" font-family="Menlo, Monaco, monospace" font-size="11.5" letter-spacing="0.04em">${text}</text>
    </g>`;
};

const illustration = () => {
  const towers = {
    left: tower({
      cx: 238,
      baseY: 410,
      halfW: 42,
      height: 142,
      accent: C.purple,
      id: 'l',
      roof: 'vent',
    }),
    right: tower({
      cx: 462,
      baseY: 410,
      halfW: 46,
      height: 168,
      accent: C.cyan,
      id: 'r',
      roof: 'setback',
    }),
    center: tower({
      cx: 350,
      baseY: 400,
      halfW: 64,
      height: 220,
      accent: C.blue,
      id: 'c',
      roof: 'antenna',
    }),
  };

  const pad = cube(350, 414, 230, 115, 6);
  const padEdge = `M350,299 L580,414 L350,529 L120,414 Z`;
  const orbit = [];
  const orbitCx = 350;
  const orbitCy = 252;
  const rx = 266;
  const ry = 116;
  const angle = (-18 * Math.PI) / 180;
  for (let i = 0; i < 5; i += 1) {
    const t = (i / 5) * Math.PI * 2 + 0.5;
    const x = orbitCx + rx * Math.cos(t) * Math.cos(angle) - ry * Math.sin(t) * Math.sin(angle);
    const y = orbitCy + rx * Math.cos(t) * Math.sin(angle) + ry * Math.sin(t) * Math.cos(angle);
    orbit.push({ x, y });
  }

  return `
    <svg class="scene" viewBox="0 0 700 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Isometric office campus with glowing AI platform labels">
      <defs>
        ${towers.left.defs}
        ${towers.right.defs}
        ${towers.center.defs}
        <radialGradient id="sceneGlow" cx="50%" cy="48%" r="52%">
          <stop offset="0" stop-color="${C.blue}" stop-opacity="0.23"/>
          <stop offset="0.48" stop-color="${C.purple}" stop-opacity="0.09"/>
          <stop offset="1" stop-color="${C.blue}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="padGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="${C.blue}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="${C.blue}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${C.blue}" stop-opacity="0.65"/>
          <stop offset="0.55" stop-color="${C.purple}" stop-opacity="0.3"/>
          <stop offset="1" stop-color="${C.cyan}" stop-opacity="0.1"/>
        </linearGradient>
        <pattern id="padGrid" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#0b1320"/>
          <circle cx="1" cy="1" r="0.75" fill="#2b3c5e"/>
        </pattern>
        <filter id="windowGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18"/>
        </filter>
      </defs>

      <circle cx="350" cy="250" r="252" fill="url(#sceneGlow)"/>
      <ellipse cx="350" cy="414" rx="270" ry="62" fill="url(#padGlow)" filter="url(#softBlur)" opacity="0.9"/>

      <path d="M350 58 L350 470" stroke="${C.blue}" stroke-opacity="0.12" stroke-dasharray="3 8"/>
      <path d="M76 414 L624 414" stroke="${C.blue}" stroke-opacity="0.1" stroke-dasharray="3 8"/>

      <g opacity="0.5">
        <ellipse cx="350" cy="252" rx="${rx}" ry="${ry}" transform="rotate(-18 350 252)" fill="none" stroke="url(#orbitStroke)" stroke-width="1" stroke-dasharray="4 8"/>
        ${orbit
          .map(
            (point, index) =>
              `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === 0 ? 3.2 : 2.2}" fill="${index === 0 ? C.cyan : C.blue}" opacity="${index === 0 ? 0.9 : 0.55}"/>`
          )
          .join('')}
        <path d="M${orbit[0].x.toFixed(1)} ${orbit[0].y.toFixed(1)} L${orbit[2].x.toFixed(1)} ${orbit[2].y.toFixed(1)} L${orbit[4].x.toFixed(1)} ${orbit[4].y.toFixed(1)}" fill="none" stroke="${C.purple}" stroke-opacity="0.2" stroke-width="0.8"/>
      </g>

      <g>
        <path d="${pad.left}" fill="#080d16"/>
        <path d="${pad.right}" fill="#0a111d"/>
        <path d="${pad.top}" fill="url(#padGrid)" stroke="${C.blue}" stroke-opacity="0.22" stroke-width="1"/>
        <path d="${padEdge}" fill="none" stroke="${C.blue}" stroke-opacity="0.2" stroke-width="1"/>
        <path d="M300 414 L400 414 M350 364 L350 464" stroke="${C.blue}" stroke-opacity="0.18" stroke-dasharray="2 5"/>
      </g>

      ${towers.left.svg}
      ${towers.right.svg}
      ${towers.center.svg}

      ${tag(500, 82, 132, 29, 'LLM GATEWAY', 'M500 96 L394 151')}
      ${tag(48, 170, 106, 29, 'MCP TOOLS', 'M154 184 L222 250')}
      ${tag(476, 300, 166, 29, 'ERP · OMS · WMS', 'M476 314 L442 330')}

      <g font-family="Menlo, Monaco, monospace" fill="${C.dim}">
        <text x="350" y="498" text-anchor="middle" font-size="9" letter-spacing="0.16em">AI PLATFORM / CAREER FLOOR 01</text>
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
  html, body { margin: 0; width: 100%; height: 100%; background: #090b12; }
  body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: ${C.ink};
  }
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background:
      radial-gradient(42% 58% at 72% 42%, rgba(122,162,247,0.17), transparent 70%),
      radial-gradient(38% 48% at 55% 16%, rgba(187,154,247,0.13), transparent 70%),
      radial-gradient(45% 60% at 18% 86%, rgba(125,207,255,0.06), transparent 70%),
      #090b12;
  }
  .grid, .noise, .vignette { position: absolute; inset: 0; pointer-events: none; }
  .grid {
    background-image:
      linear-gradient(rgba(122,162,247,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,162,247,0.05) 1px, transparent 1px),
      linear-gradient(rgba(122,162,247,0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,162,247,0.09) 1px, transparent 1px);
    background-size: 24px 24px, 24px 24px, 120px 120px, 120px 120px;
    mask-image: radial-gradient(ellipse at 66% 46%, black 0%, transparent 82%);
    opacity: 0.85;
  }
  .noise {
    opacity: 0.05;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .vignette {
    background: linear-gradient(180deg, rgba(0,0,0,0.2), transparent 20%, transparent 80%, rgba(0,0,0,0.34));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
  }
  .topbar, .copy, .visual, .bottombar { position: absolute; z-index: 2; }
  .topbar { top: 40px; left: 64px; right: 64px; display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .mark {
    width: 34px; height: 34px; padding: 6px; border-radius: 9px;
    border: 1px solid rgba(122,162,247,0.26);
    background: rgba(122,162,247,0.07);
  }
  .brand span {
    font-family: Menlo, Monaco, monospace; font-size: 12px; letter-spacing: 0.18em;
    color: #d9e2f1;
  }
  .locale {
    font-family: Menlo, Monaco, monospace; font-size: 11px; letter-spacing: 0.14em;
    color: ${C.dim}; display: flex; align-items: center; gap: 8px;
  }
  .locale i { width: 6px; height: 6px; border-radius: 50%; background: ${C.green}; box-shadow: 0 0 10px ${C.green}; }
  .copy { left: 64px; }
  .eyebrow {
    font-family: Menlo, Monaco, monospace; text-transform: uppercase;
    color: ${C.blue}; letter-spacing: 0.14em; margin: 0 0 18px;
  }
  h1 {
    font-family: 'Manrope', sans-serif; font-weight: 800; margin: 0;
    color: ${C.ink}; letter-spacing: -0.045em; line-height: 0.94;
    text-wrap: balance;
  }
  h1 .accent { color: ${C.blue}; }
  .lede {
    font-family: 'Inter', sans-serif; color: ${C.muted}; margin: 20px 0 0;
    line-height: 1.5;
  }
  .lede strong { color: #dbe6f8; font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; margin-top: 24px; }
  .chips span {
    font-family: Menlo, Monaco, monospace; letter-spacing: 0.06em;
    color: #c9d6ee; border: 1px solid rgba(122,162,247,0.24);
    background: rgba(122,162,247,0.06); border-radius: 999px;
  }
  .metrics { display: flex; gap: 30px; margin-top: 34px; }
  .metrics strong {
    display: block; font-family: 'Manrope', sans-serif; font-weight: 800;
    font-size: 30px; color: ${C.ink}; letter-spacing: -0.04em; line-height: 1;
  }
  .metrics span {
    display: block; margin-top: 7px; font-family: Menlo, Monaco, monospace;
    font-size: 10px; letter-spacing: 0.1em; color: ${C.dim};
  }
  .visual { aspect-ratio: 700 / 520; }
  .scene { display: block; width: 100%; height: 100%; }
  .bottombar { left: 64px; right: 64px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .rule { position: absolute; left: 0; right: 0; top: -18px; height: 1px; background: linear-gradient(90deg, rgba(122,162,247,0.22), transparent); }
  .domain { font-family: Menlo, Monaco, monospace; color: #dbe6f8; letter-spacing: 0.08em; }
  .meta { font-family: Menlo, Monaco, monospace; color: ${C.dim}; letter-spacing: 0.08em; text-align: right; }

  body.landscape .copy { top: 136px; width: 500px; }
  body.landscape .eyebrow { font-size: 14px; }
  body.landscape h1 { font-size: 76px; }
  body.landscape .lede { font-size: 19px; max-width: 480px; }
  body.landscape .chips { gap: 9px; }
  body.landscape .chips span { font-size: 10px; padding: 5px 9px; }
  body.landscape .visual { right: 30px; top: 72px; width: 614px; }
  body.landscape .bottombar { bottom: 34px; }
  body.landscape .domain { font-size: 15px; }
  body.landscape .meta { font-size: 11px; }

  body.square .copy { top: 130px; width: 1040px; }
  body.square .eyebrow { font-size: 18px; }
  body.square h1 { font-size: 98px; }
  body.square .lede { font-size: 23px; max-width: 760px; }
  body.square .chips { gap: 11px; margin-top: 28px; }
  body.square .chips span { font-size: 12px; padding: 6px 11px; }
  body.square .visual { left: 170px; top: 480px; width: 860px; }
  body.square .bottombar { bottom: 44px; }
  body.square .domain { font-size: 18px; }
  body.square .meta { font-size: 13px; }

  body.portrait .copy { top: 124px; width: 920px; }
  body.portrait .eyebrow { font-size: 17px; }
  body.portrait h1 { font-size: 92px; }
  body.portrait .lede { font-size: 22px; max-width: 840px; }
  body.portrait .chips { gap: 10px; margin-top: 26px; }
  body.portrait .chips span { font-size: 12px; padding: 6px 10px; }
  body.portrait .visual { left: 90px; top: 540px; width: 900px; }
  body.portrait .bottombar { bottom: 48px; }
  body.portrait .domain { font-size: 17px; }
  body.portrait .meta { font-size: 12px; }

  body.story .topbar { top: 70px; left: 80px; right: 80px; }
  body.story .copy { top: 190px; left: 80px; width: 920px; }
  body.story .eyebrow { font-size: 20px; }
  body.story h1 { font-size: 112px; }
  body.story .lede { font-size: 27px; max-width: 820px; }
  body.story .chips { gap: 12px; margin-top: 30px; }
  body.story .chips span { font-size: 14px; padding: 7px 12px; }
  body.story .visual { left: 50px; top: 680px; width: 980px; }
  body.story .bottombar { bottom: 78px; left: 80px; right: 80px; }
  body.story .domain { font-size: 24px; }
  body.story .meta { font-size: 14px; }
  body.story .story-stats {
    position: absolute; z-index: 2; left: 80px; right: 80px; top: 1470px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-top: 1px solid rgba(122,162,247,0.2); padding-top: 26px;
  }
  body.story .story-stats strong {
    display: block; font-family: 'Manrope', sans-serif; font-weight: 800;
    font-size: 46px; color: ${C.ink}; letter-spacing: -0.04em; line-height: 1;
  }
  body.story .story-stats span {
    display: block; font-family: Menlo, Monaco, monospace; font-size: 11px;
    color: ${C.dim}; letter-spacing: 0.12em; margin-top: 8px;
  }
`;

const mark = `
  <svg class="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M5 28C13 6 27 6 35 28" stroke="#dce7ff" stroke-width="3" stroke-linecap="round"/>
    <path d="M5 12C13 34 27 34 35 12" stroke="#dce7ff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="5" cy="28" r="1.2" fill="#dce7ff"/><circle cx="35" cy="28" r="1.2" fill="#dce7ff"/>
    <circle cx="5" cy="12" r="1.2" fill="#dce7ff"/><circle cx="35" cy="12" r="1.2" fill="#dce7ff"/>
  </svg>`;

const copy = (story = false) => `
  <p class="eyebrow">AI Manager · Full Stack Engineer</p>
  <h1>Ekkachai <span class="accent">K.</span></h1>
  <p class="lede">Building AI platforms and the integration backbone behind <strong>1M+ orders a year</strong>.</p>
  <div class="chips">
    <span>LLM Gateway</span><span>MCP</span><span>Azure</span><span>AWS</span>
  </div>
  ${
    story
      ? `<div class="story-stats">
          <div><strong>1M+</strong><span>ORDERS / YEAR</span></div>
          <div><strong>10+</strong><span>YEARS ENGINEERING</span></div>
          <div><strong>AI</strong><span>PLATFORM &amp; AGENTS</span></div>
        </div>`
      : `<div class="metrics">
          <div><strong>10+</strong><span>YEARS ENGINEERING</span></div>
          <div><strong>1M+</strong><span>ORDERS / YEAR</span></div>
          <div><strong>AI</strong><span>PLATFORM &amp; AGENTS</span></div>
        </div>`
  }`;

const card = (layout) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><style>${css}</style></head>
<body class="${layout}">
  <div class="card">
    <div class="grid"></div>
    <div class="noise"></div>
    <div class="vignette"></div>
    <header class="topbar">
      <div class="brand">${mark}<span>KIWSAN.COM</span></div>
      <div class="locale"><i></i> BANGKOK · REMOTE</div>
    </header>
    <section class="copy">${copy(layout === 'story')}</section>
    <div class="visual">${illustration()}</div>
    <footer class="bottombar">
      <span class="rule"></span>
      <span class="domain">kiwsan.com</span>
      <span class="meta">10+ YEARS · E-COMMERCE · CLOUD</span>
    </footer>
  </div>
</body>
</html>`;

const variants = [
  { layout: 'landscape', name: 'og-image.png', width: 1200, height: 630, dir: outputDir },
  { layout: 'square', name: 'og-square.png', width: 1200, height: 1200, dir: socialDir },
  { layout: 'portrait', name: 'og-portrait.png', width: 1080, height: 1350, dir: socialDir },
  { layout: 'story', name: 'og-story.png', width: 1080, height: 1920, dir: socialDir },
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
  await sharp(shot)
    .resize(variant.width, variant.height, { fit: 'cover', kernel: 'lanczos3' })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, colors: 256, dither: 0.8 })
    .toFile(target);

  console.log(`${variant.layout}: ${target}`);
}

await browser.close();
