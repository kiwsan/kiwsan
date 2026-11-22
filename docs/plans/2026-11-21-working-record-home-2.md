# Plan: Working Record home, part 2

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-004.md`
- Contract: `DESIGN.md` (T-001)
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record` (commit 4, after T-003)

## Files that change

- `src/components/Workforce.astro` — floor on a plate, shift log as a two-column
  schedule, pod records on `page`; department accents removed, `signal` only on
  the active pod; `AI team floor` label and `6 teams` chip removed (`C3`); the
  assembly script and the animejs import removed.
- `src/components/Projects.astro` — record entries with the fixed field order,
  rules between entries, plate screenshots, inline tags, no hover lift or zoom;
  the scroll observer and its animation classes removed.
- `src/components/TechStack.astro` — inline labels, group rules, no fill, no
  hover; the section background shift removed.
- `src/components/Contact.astro` — link list and CTA on the record treatment:
  ink block, 1px outline, 2px radius, underline and focus from the system.
- `tests/e2e/home.spec.ts`, `tests/e2e/pages/HomePage.ts`,
  `tests/e2e/office.spec.ts`, `tests/e2e/workforce.spec.ts` — selectors and the
  assembly test updated for the record structure.
- `docs/verification/2026-11-21-t004-home-2/` — screenshots at 320, 768, 1280
  in light and dark.
- `docs/plans/2026-11-21-working-record-home-2.md` — this plan.

No content collection, data, style token, asset, or dependency changes.

## Order of work

1. Workforce: keep the SVG and its `title`/`desc`; remove the inline accents,
   the scene meta, the log dot/chip, and the assembly script; add `is-active`
   to the first pod; restyle the plate, schedule, legend, gates, and pod
   records. Check: six pods, six agents, one hub, title/desc unchanged.
2. Projects: remove the observer and card styling; rename the entry; keep the
   field order, images, links, and tech tags. Check: no opacity gate.
3. TechStack and Contact: inline labels and link/CTA states.
4. Update the four specs; run `format:check`, `lint`, `unit`, `build`, then
   home, workforce, office, responsive, accessibility, and axe.
5. Screenshot the workforce at 320/768/1280 in light and dark; also capture
   Projects, TechStack, and Contact for the record.

## Risks

- The floor's SVG text is scaled by the viewBox. Mitigation: 14px names and
  12px counts, and hide the drawing below 900px where the pod records carry the
  same information (the existing fallback).
- Removing `--accent` touches many SVG rules. Mitigation: one ink palette for
  all pods, `signal` only on `.pod.is-active` and the active log row.
- The office spec still looks for `.tl-row`; it must move to `.run` in the same
  commit.
- The workforce assembly test asserts the old animation; rewrite it to assert
  the static floor.

## Proof

- `git diff` shows the two `C3` removals and no other copy change.
- `git diff src/content src/data` is empty; the floor `title`/`desc` are
  unchanged.
- `npm run build`, `lint`, `test:unit`, and the six specs exit 0.
- Screenshots show the plate, schedule, and fallback at the three widths.
- No accent colour, pill, uppercase mono label, hover lift, or animation in the
  four files.

## Deviations

- Tests are updated. `home.spec.ts` and `HomePage.ts` move from
  `.project-card` to `.project-entry`; `office.spec.ts` moves from `.tl-row` to
  `.run`; the workforce assembly test becomes a static-floor test, because the
  assembly was removed with the contract's motion budget.
- The floor's static fallback stays at 900px, the existing breakpoint. At 768
  and 320 the pod records carry the function, handoff, and roles; the drawing
  only renders where its labels stay legible.
- The floor's painted background rect and the hub halo are removed. The plate
  field, the dot grid, the rails, and the agents stay.
- The drawing labels are 14px names and 12px counts in the 1000-unit viewBox;
  at the 1280 plate width they render at about 11 and 9.5 CSS px. They are
  drawing annotations, not page text.
- The contact screenshot needed a wait for the lazy credential badge; no code
  change.
