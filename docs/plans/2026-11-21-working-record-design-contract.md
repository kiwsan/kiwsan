# Plan: replace the design contract with the Working Record

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-001.md`
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record`, based on `origin/main` (`9387be0`)

## Files that change

- `DESIGN.md` — replaced by the eight-section Working Record contract. This is
  the ticket's whole scope.
- `docs/plans/2026-11-21-working-record-design-contract.md` — this plan, so the
  commit carries its reasoning. `docs/` is outside the prettier gate.

No page, component, style, asset, test, data, or dependency file changes.

## Order of work

1. Read the ADR §2–4, spec `R1`/`R3`/`R4`/`R5`, and the old 79-line brief.
   Check: direction, rejected option, and the `C3` boundary are unambiguous.
2. Inventory the ten components in `src/components/`, `Layout.astro`, and the
   workforce page for interactive parts and states. Check: every component has
   a row in the state matrix.
3. Record the six colour roles, five type steps, spacing, radius, border,
   elevation, and motion. Check: no role is undefined; the contrast pairs are
   measured.
4. Write the eight sections, the banned list with an owner per pattern, and the
   exact `C3` strings and glyphs. Check: eight `##` headings; every banned
   pattern owned; every string traced to its source file.
5. Read-through against the ticket's acceptance criteria and run
   `npm run format:check`. Check: both pass.

## Risks

- The ADR names the six roles but not every value. Mitigation: use the
  paper/ink/muted/cobalt/hair values already in `scripts/social-cards.mjs` that
  ADR §2 A names, derive `plate` one step from `page`, and state that values
  live in `global.css` and are verified by axe in T-002.
- The `C3` list could widen the copy freeze. Mitigation: enumerate only the
  strings the ADR names, and state exactly what stays.
- A page-specific rule could leak into the contract. Mitigation: one
  "layout exceptions" subsection; every other rule is component-level.
- `DESIGN.md` and `docs/` are prettier-ignored, so `format:check` proves nothing
  about this file. Mitigation: count headings and trace strings by hand.

## Proof

- `grep -c '^## ' DESIGN.md` returns 8.
- The ten component names all appear in the state matrix.
- Every banned pattern has an owner and, where it exists today, a file:line
  instance.
- Every `C3` string appears in both the contract and the source file named
  beside it.
- `npm run format:check` exits 0.

## Deviations

- None. Update this section in the same commit as any change.
