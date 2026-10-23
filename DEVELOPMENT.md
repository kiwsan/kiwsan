# Development

## Prerequisites

- Node.js 22 or newer
- npm
- AWS CLI and Terraform for deployment work

## Install

```bash
npm ci
npm --prefix tests ci
npx playwright install --with-deps
```

## Run locally

```bash
npm run dev
```

The site runs at `http://localhost:4321`.

## Build

```bash
npm run build
```

The build runs `astro check` and then builds the static site into `dist/`.

## Test

```bash
npm run test:unit
npm run test:e2e:chromium
```

`test:unit` runs Vitest over the pure logic in `src/lib`. `test:e2e:chromium` starts a preview server on port 4322 and runs the same Chromium and mobile Chrome projects as CI. Use `npm run test:e2e` when Firefox and WebKit are available locally. The E2E config does not reuse an existing server, so a stale dev server cannot produce false results.

The Playwright suite covers navigation, responsive layout, the chat widget, accessibility, and the office marker scale.

To run a live check against production:

```bash
SITE_URL=https://kiwsan.com npm run test:live
```

## Lint and format

```bash
npm run lint
npm run format:check
npm run format
```

## Deploy

The CI workflow builds, tests, uploads `dist/` through Terraform, applies the CloudFront configuration, invalidates the cache, and runs the live smoke test.

See `terraform/README.md` for the AWS bootstrap and manual deployment steps.

## Production configuration

- `security.config.json` is the single source of truth for the Content Security Policy.
- `astro.config.mjs` uses the same policy for the dev server.
- `scripts/apply-cloudfront.mjs` applies the policy, enables gzip and Brotli, and sets 403/404 responses to the 404 page with status 404.
- CloudFront response headers are managed outside the S3 upload. The script keeps the production policy aligned with the repository.

## Repository rules

`main` requires a pull request and passing `Lint & Static Analysis`, `Build & Test`, `Security Scan`, and `Terraform Plan` checks. Branches are deleted after merge.
