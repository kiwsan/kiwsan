# E2E Tests — kiwsan.com

End-to-end tests for [kiwsan.com](https://kiwsan.com) using [Playwright](https://playwright.dev).

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running tests

| Command | Description |
|---|---|
| `npm test` | Run the full local E2E suite |
| `npm run test:chromium` | Run the CI browser set locally |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:debug` | Step-through debugger |
| `npm run test:live` | Run the live smoke tests against `SITE_URL` |
| `npm run report` | Open the last HTML report |

The config builds the site and starts a preview server on port `4322`. It does not reuse an existing server, so a stale `astro dev` process cannot produce false results.

The live suite reads `SITE_URL` and defaults to `https://kiwsan.com`:

```bash
SITE_URL=https://kiwsan.com npm run test:live
```

## Structure

```
tests/
├── e2e/
│   ├── fixtures/          # Custom test fixtures and page object
│   ├── pages/             # Page object models
│   ├── accessibility.spec.ts
│   ├── axe.spec.ts        # axe-core WCAG A/AA scan
│   ├── chat-widget.spec.ts
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── office.spec.ts     # company-size marker scale
│   └── responsive.spec.ts
├── live/
│   └── live.spec.ts       # production CSP, 404, sitemap, content
├── playwright.config.ts
├── playwright.live.config.ts
└── package.json
```

## Browsers

The local suite runs on Chromium, Firefox, WebKit, and Mobile Chrome. The live suite runs on Chromium.

## Writing tests

Use the custom fixture to get a pre-navigated page object:

```ts
import { test, expect } from './fixtures';

test('example', async ({ homePage }) => {
  await expect(homePage.heading).toBeVisible();
});
```

To add a page object, extend `BasePage` and register it in `fixtures/index.ts`.
