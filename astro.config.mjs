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
  vite: {
    build: {
      cssMinify: 'lightningcss',
      minify: 'esbuild',
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
