# Plan: Working Record workforce case study

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-005.md`
- Contract: `DESIGN.md` (T-001)
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record` (commit 5, after T-003)

## Files that change

- `src/pages/workforce.astro` — the nine sections restyled onto the record
  system: hero at section size, facts line at body size, numbered problem and
  evidence records, role schedule, loop records, tables with scroll regions,
  ruled questions, closing controls. The `section-surface` alternation is
  removed; one page colour and 1px rules separate sections.
- `docs/verification/2026-11-21-t005-case-study/` — 54 section screenshots and
  a README.
- `docs/plans/2026-11-21-working-record-case-study.md` — this plan.

No data, copy, anchor, section order, table, route, asset, or dependency
changes. The page has no `C3` career-log chrome, so the text freeze has no
exception here.

## Order of work

1. Replace the scoped style block with the record styles, keeping every class
   and text node.
2. Remove the `section-surface` hooks so no section uses a background shift.
3. Keep the h1, lede, facts, and controls; set the h1 at section size and the
   facts at body size.
4. Check the nine sections, the `#roles`/`#loop` anchors, the two tables, and
   the scroll regions.
5. Run `format:check`, `lint`, `unit`, `build`, then the case-study,
   responsive, accessibility, and axe specs.
6. Screenshot each section at 320/768/1280 in light and dark.

## Risks

- The role count could be amplified by the facts strip. Mitigation: body-size
  values, a ruled facts line, no stat cards.
- The tables can overflow. Mitigation: `min-width: 680px` inside a
  `role="region" tabindex="0"` wrapper; the page itself never scrolls.
- The 54 screenshots are heavy. Mitigation: JPEG at quality 78; 2.8MB total.
- The h1 wraps "25-role" at 320. Mitigation: a `.nowrap` span around the count;
  textContent is unchanged.

## Proof

- `git diff` before the style block shows only the `section-surface` removals
  and the h1 span; no text node changes.
- `git diff src/content src/data` is empty.
- Nine sections and both anchors remain.
- `npm run build`, `lint`, `test:unit`, and the four specs exit 0.
- 54 screenshots at the three widths and two themes.
- No banned pattern in the page.

## Deviations

- The h1 wraps the count in `<span class="nowrap">` so "25-role" does not break
  across lines at 320. The rendered text is identical.
- The seven `.role-card` elements stay as the test's hook, but render as a
  two-column function schedule with ruled role rows, not cards.
- The facts line keeps the four values at body size; the count is a fact in a
  ruled line, not a hero stat.
- The gates and tiers tables keep their 680px minimum and scroll inside their
  region at 320; no page-level horizontal scroll.
