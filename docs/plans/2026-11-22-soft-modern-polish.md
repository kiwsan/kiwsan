# Plan: Working Record 1.1 — soft modern polish

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Contract: `DESIGN.md` (1.1 amendment, 2026-11-22)
- Owner: `builder`
- Date: 2026-11-22
- Branch: `design/soft-modern-polish`, based on `9177507` (the live smoke fix)

## Why

After the 1.0 merge the operator asked for a more modern, less rigid surface:
consistent padding, more air, and rounded grouped surfaces instead of square
rules everywhere. The record structure, typography, and content stay; the
surface language changes.

## What changes

- `DESIGN.md` — 1.1: surface radius 12px, control radius 8px, inline radius
  6px; the section rhythm widens; plates may be rounded. The banned list still
  bans gradients, glass, pills, and hover lift.
- `src/styles/global.css` — the three radius tokens; a softer rule value;
  section rhythm tokens.
- `src/components/Hero.astro` — the portrait sits on a rounded plate; wider
  section padding; tag and control radii from the tokens.
- `Metrics.astro` — the ledger becomes one rounded plate block with generous
  internal padding; two columns at 768 and one at 320 remain.
- `Workforce.astro` — the floor and the shift log are rounded plates side by
  side; the pod fallback records are rounded; labels keep their sizes.
- `WorkExperience.astro` — wider rhythm; the skyline thumbnail gets a small
  plate; tags keep the inline radius.
- `Projects.astro` — wider rhythm; screenshots use the surface radius.
- `TechStack.astro`, `Contact.astro` — wider rhythm; the CTA panel is a rounded
  plate; tags and controls use the tokens.
- `Header.astro`, `Footer.astro`, `ChatWidget.astro` — control radii, a rounded
  mobile nav, rounded badges, and the chat window on the surface radius.
- `workforce.astro` — wider section rhythm; problem, evidence, FAQ, and role
  groups sit on a soft plate; the stats line and tables are rounded; the
  callout is a rounded plate.
- Screenshots at 320/768/1280 light and dark.

## Order of work

1. Tokens and contract amendment.
2. Shell (header, footer, chat).
3. Home sections.
4. Case study sections.
5. `format:check`, `lint`, `unit`, `build`, the home/workforce/case-study e2e
   set, and the live suite against production (read-only).
6. Screenshots and review.

## Risks

- Rounded panels can drift back to generic cards. Mitigation: one radius scale,
  no shadows except E1, no fills beyond `plate`, and the same typography.
- More padding can push tables past 320. Mitigation: keep the table scroll
  regions and the 680px minimum inside them.
- The contract's state matrix mentions radii; 1.1 updates it in the same
  commit, and the CSS scan allows 0/6/8/12 only.
- The branch includes the live smoke selector fix; merge #121 first or this PR
  carries it.

## Proof

- No raw radius outside `global.css`; the scan allows 0/6/8/12 tokens.
- `npm run build`, `lint`, `test:unit`, and the e2e set exit 0.
- Live suite 5/5 against `https://kiwsan.com` after the deploy; read-only.
- Screenshots at the three widths and two themes; the record read-through.

## Deviations

- Grouped content panels (why, evidence, roles, FAQ, pod records) use the page
  fill with a 1px rule; drawing and data fields (floor, metrics ledger, stats,
  tables, callouts) use `plate`. That keeps one rule for surfaces rather than
  mixing fills inside a section.
- The metrics section lost its full-width top rule; the rounded ledger block
  separates it from the hero.

