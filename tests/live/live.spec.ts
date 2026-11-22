import { expect, test } from '@playwright/test';

test('serves the page without CSP violations', async ({ page }) => {
  const violations: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error' && /content security policy/i.test(message.text())) {
      violations.push(message.text());
    }
  });
  page.on('requestfailed', (request) => {
    if (
      /googletagmanager|google-analytics|google\.com/.test(request.url()) &&
      request.failure()?.errorText === 'csp'
    ) {
      violations.push(`${request.url()} ${request.failure()?.errorText}`);
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  expect(violations).toEqual([]);
});

test('returns 404 for a missing page', async ({ request }) => {
  const response = await request.get(`/this-page-does-not-exist-${Date.now()}`);
  expect(response.status()).toBe(404);
});

test('publishes a machine-readable sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap: https://kiwsan.com/sitemap-index.xml');

  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
});

test('serves the core content and manifest', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('#experience h2')).toContainText('Work Experience');
  expect(await page.locator('.work-card').count()).toBeGreaterThanOrEqual(6);
});

test('compresses HTML and sets cache headers', async ({ page, request }) => {
  const html = await request.get('/', { headers: { 'Accept-Encoding': 'gzip, br' } });
  expect(html.status()).toBe(200);
  expect(html.headers()['content-encoding']).toMatch(/gzip|br/);
  expect(html.headers()['cache-control']).toContain('max-age=0');

  await page.goto('/', { waitUntil: 'networkidle' });
  const cssHref = await page
    .locator('link[rel="stylesheet"][href*="/_astro/"]')
    .first()
    .getAttribute('href');
  expect(cssHref).toBeTruthy();

  const css = await request.get(cssHref!, { headers: { 'Accept-Encoding': 'gzip, br' } });
  expect(css.status()).toBe(200);
  expect(css.headers()['cache-control']).toContain('immutable');
});
