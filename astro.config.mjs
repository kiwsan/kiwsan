// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';
import path from 'path';
import viteCompression from 'vite-plugin-compression';

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
      viteCompression({ algorithm: 'gzip', ext: '.gz' }),
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
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline';",
    },
  },
});
