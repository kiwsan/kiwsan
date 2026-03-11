# E2E Tests — kiwsan.com

End-to-end tests for [kiwsan.com](https://kiwsan.com) using [Playwright](https://playwright.dev).

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Step-through debugger |
| `npm run report` | Open last HTML report |

> Tests automatically start the dev server (`npm run dev`) from the project root before running.

## Structure

```
tests/
├── e2e/
│   ├── fixtures/       # Custom test fixtures & extended test object
│   ├── pages/          # Page Object Models
│   │   ├── BasePage.ts
│   │   └── HomePage.ts
│   ├── home.spec.ts        # Homepage functionality
│   ├── accessibility.spec.ts  # a11y checks
│   └── responsive.spec.ts  # Viewport / responsive layout
├── playwright.config.ts
└── package.json
```

## Browsers

Tests run across 4 projects by default:

- Desktop Chrome
- Desktop Firefox
- Desktop Safari (WebKit)
- Mobile Chrome (Pixel 5)

## Writing Tests

Use the custom fixture to get a pre-navigated page object:

```ts
import { test, expect } from './fixtures';

test('example', async ({ homePage }) => {
  await expect(homePage.heading).toBeVisible();
});
```

To add a new page, extend `BasePage` and register it in `fixtures/index.ts`.
