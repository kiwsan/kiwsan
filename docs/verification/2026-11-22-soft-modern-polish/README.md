# Working Record 1.2 — soft modern, neutral palette screenshots

Operator feedback after the 1.0 merge: more air, consistent padding, a modern
surface instead of square panels everywhere, and a white/neutral-grey palette
instead of the warm paper.

Captured 2026-11-22 against a production build served by `astro preview`. The
fixed header, skip link, and chat control are hidden where they would paint over
a tall element.

- `home-hero-*`, `home-metrics-*`, `home-workforce-*`, `home-experience-*`,
  `home-projects-*`, `home-techstack-*`, `home-contact-*` — 1280 light and dark,
  plus 390 and 768 for the hero, workforce, and career log.
- `case-hero-*`, `case-roles-*`, `case-why-*`, `case-gates-*`,
  `case-questions-*` — the case study panels, stats, and table at the same
  widths.

What to check: the page is `#FFFFFF` and the plate `#F4F5F7` (dark
`#101114`/`#181A1E`); section rhythm at `clamp(4rem, 8vw, 6rem)`; grouped content
on a page panel with a 1px rule and the 12px surface radius; controls at 8px,
inline labels at 6px; the floor and ledger on `plate`; no gradient, glass, pill,
lift, or heavy shadow; tables still scroll inside their region at 320. The
favicon, manifest, social cards, and `theme-color` follow the same palette.
