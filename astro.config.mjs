// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import security from './security.config.json';

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
  },
  server: {
    headers: {
      'Content-Security-Policy': security.csp,
    },
  },
});
