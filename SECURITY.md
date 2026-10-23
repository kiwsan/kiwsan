# Security policy

## Supported versions

The site deploys from `main`. Only the current production build is supported.

## Reporting a vulnerability

Email `kiwsanthia@gmail.com` with the affected URL, reproduction steps, and impact. Do not open a public issue for a live vulnerability.

## Security controls

- HTTPS with HSTS preload
- Content Security Policy
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- Referrer and permissions policies
- npm audit and IaC scanning in CI
