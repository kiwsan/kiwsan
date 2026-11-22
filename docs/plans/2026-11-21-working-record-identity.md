# Plan: identity assets on the Working Record tokens

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-006.md`
- Contract: `DESIGN.md` (T-001)
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record` (commit 6, after T-005)

## Files that change

- `src/components/Header.astro` — already moved to `currentColor` in T-002;
  verified, no change needed.
- `public/favicon.svg` — the mark redrawn with ink on the page value, square
  (no rounded chip, no `#111`).
- `public/favicon-16.png`, `favicon-32.png`, `favicon-180.png`, `favicon.ico` —
  regenerated from the SVG with `sharp`, including a PNG-payload ICO.
- `public/site.webmanifest` — `theme_color` and `background_color` to the page.
- `scripts/social-cards.mjs` — palette stays paper/ink/muted/cobalt/hair, but
  the red second accent is removed; the grain overlay, the mono micro-labels,
  the drawing annotations, and the uppercase transforms are removed, and the
  title drops to Manrope 700. Regenerated output:
  `public/images/og-image.png` and `public/images/social/*`.
- `src/layouts/Layout.astro` — `theme-color` to the page value (plus a dark
  media variant), `ogImageVersion` bumped, and the image alt text corrected to
  the paper field.
- `docs/plans/2026-11-21-working-record-identity.md` — this plan.

No rebrand, no new mark, no new dependency, no page copy.

## Order of work

1. Write the new favicon SVG and rasterise 16/32/180 plus a 16/32/48 ICO.
2. Update the social-card script: one accent, Inter labels, Manrope 700 titles,
   no mono/uppercase micro-labels, no grain, no red marks; run
   `npm run social:generate`.
3. Update Layout: theme-color, version, alt.
4. Update the manifest colours.
5. Inspect the OG image and the favicon at 16/32/180; check the header in both
   themes; run `format:check`, `lint`, `unit`, `build`.

## Risks

- The favicon mark at 16px can disappear if the strokes are too thin.
  Mitigation: render the 40-unit mark at 16/32/48 and inspect the PNGs.
- Regenerating the card could shift the composition when the labels grow to
  12px. Mitigation: inspect the 1200×630 output, not only the build.
- The card's cobalt disk is the only signal field; do not add a second accent
  when the red is removed.
- Browsers cache `og-image.png`; the `?v=` bump and the social filenames are
  the only cache controls available.

## Proof

- `favicon.svg` has no `#111`, `#FFFFFF`, or `rx`; the PNGs are regenerated.
- `npm run social:generate` writes four files; the OG image has no red, no
  grain, and no mono labels.
- Built HTML: `theme-color` is `#F2EFE7`, `og:image` carries `?v=4`.
- `git diff package.json` is empty.
- The header mark is ink in light, page in dark (currentColor).

## Deviations

- `public/site.webmanifest` is updated although the ticket does not list it; its
  `theme_color` and `background_color` were still `#111111`, and the manifest is
  part of the favicon set.
- The OG and Twitter image alt text changes from "cobalt field" to "cobalt disk
  over a paper field", because the regenerated card is paper with a cobalt disk.
  It is metadata, not visible copy.
- The card drops its grain overlay, mono micro-labels, drawing annotations, and
  uppercase labels, and its title weight drops from 800 to 700. These follow
  from "the palette and type agree" and the contract's type rules.
