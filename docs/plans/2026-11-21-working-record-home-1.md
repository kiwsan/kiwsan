# Plan: Working Record home, part 1

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-003.md`
- Contract: `DESIGN.md` (T-001)
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record` (commit 3, after T-002)

## Files that change

- `src/components/Hero.astro` — record header: label, title, one rule, lede,
  inline labels, two controls; the gradient background and page decoration are
  removed, the line portrait stays as a plate. No entrance animation.
- `src/components/Metrics.astro` — four-column ruled ledger at body size; the
  count-up script is removed and the values are present on load.
- `src/components/WorkExperience.astro` — numbered run ledger. Rail: `01 / 06`,
  skyline, office name. Body: role, org, period, task, impl, tools, results. The
  `C3` chrome, the reveal script, and the accent colours are removed.
- `docs/verification/2026-11-21-t003-home-1/` — screenshots at 320, 768, 1280
  in light and dark.
- `docs/plans/2026-11-21-working-record-home-1.md` — this plan.

No other component, content, data, style, asset, test, or dependency changes.

## Order of work

1. Hero: remove `hero-bg` and the gradient CSS; keep the portrait, remove its
   draw/fade/bob animations and the glow; restyle label, title, tags, and
   controls. Check: no raw colour or gradient in the file.
2. Metrics: drop the script and the cards; build a ruled four-column ledger
   that reflows to two columns at 768 and one at 320. Check: values present with
   JS off.
3. WorkExperience: keep the `runs` mapping and the per-run skyline geometry;
   replace the timeline markup with run rows; remove the `C3` strings, the
   inline `data-trace` gate, and the reveal script. Check: `git diff` against
   the `C3` list; run data unchanged.
4. Run `format:check`, `lint`, `unit`, `build`, then the home, responsive,
   accessibility, and axe specs under Node 22.
5. Screenshot 320/768/1280 in light and dark.

## Risks

- A `C3` string could be removed twice or a label reworded. Mitigation: the
  removal list is checked line by line before the commit; labels keep their
  words and change case by CSS only.
- The hero portrait's CSS carries many animation classes. Mitigation: remove
  the classes from the markup and the keyframes from the CSS together; verify
  the SVG with a screenshot, not just the build.
- The run rows can overflow at 320. Mitigation: one column below 1024, a 84px
  label column only above 768, and the skyline capped at 100%.
- The fixed header and the chat control are unchanged here.

## Proof

- `git diff` shows the eleven `C3` removals and no other copy change.
- `git diff` of `src/content/projects/*.md` is empty; the rendered roles, orgs,
  periods, tasks, tools, and results are the same.
- `npm run build`, `lint`, `test:unit`, `test:e2e` (home, responsive,
  accessibility, axe) exit 0.
- Screenshots show the three widths in light and dark.
- The banned list: no gradient, pill, uppercase mono label, or shell chrome in
  the three files.

## Deviations

- `tests/e2e/home.spec.ts`, `tests/e2e/responsive.spec.ts`, and
  `tests/e2e/pages/HomePage.ts` are updated. The old assertions encoded card
  selectors and a flex hero, so they could not pass against the record system.
  The replacements assert the ledger counts, the run-row structure, and the
  stacked/two-column layouts.
- The per-run skyline drops its dimension labels and crosshairs. Those were
  7px mono annotations on a thumbnail, below the contract's 12px floor and
  unreadable at every width; the towers, setbacks, antennas, and ground line
  stay, so the drawing is unchanged as a shape.
- The period is rendered once, in the record's field column, instead of twice
  (the old short rail copy duplicated it). The value is unchanged.
