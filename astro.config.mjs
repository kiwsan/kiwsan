// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';
import path from 'path';
import security from './security.config.json';

// CloudFront serves production over HTTPS, so the policy keeps
// `upgrade-insecure-requests`. The dev and preview servers run on plain HTTP,
// and WebKit applies that upgrade to localhost too: every stylesheet and script
// then fails the TLS handshake and the page renders unstyled. Strip the
// directive for the local servers only; security.config.json still feeds the
// production policy.
const localCsp = security.csp
  .split(';')
  .map((directive) => directive.trim())
  .filter((directive) => directive && directive.toLowerCase() !== 'upgrade-insecure-requests')
  .join('; ');

// https://astro.build/config
export default defineConfig({
  site: 'https://kiwsan.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  // Astro 7 defaults to 'jsx' whitespace compression; keep the v6 behavior.
  compressHTML: true,
  vite: {
    build: {
      cssMinify: 'lightningcss',
      // Vite 8 no longer bundles esbuild; oxc is its native minifier.
      minify: 'oxc',
    },
    plugins: [
      {
        name: 'copy-deferred-css',
        buildStart() {
          const src = path.resolve('src/styles/deferred.css');
          const dest = path.resolve('public/_deferred.css');
          fs.copyFileSync(src, dest);
        },
      },
    ],
  },
  server: {
    headers: {
      'Content-Security-Policy': localCsp,
    },
  },
});
