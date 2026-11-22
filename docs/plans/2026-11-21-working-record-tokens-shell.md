# Plan: Working Record tokens and shared shell

- Spec: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/spec.md`
- Ticket: `/srv/dev/ai-workforce/docs/requirements/kiwsan-site-unslop/tickets/T-002.md`
- Contract: `DESIGN.md` (T-001)
- Owner: `builder`
- Date: 2026-11-21
- Branch: `design/working-record` (commit 2, after T-001)

## Files that change

- `src/styles/global.css` — the six colour roles, five type steps, spacing,
  radius, border, motion, focus ring, link treatment, section caption, and the
  global reduced-motion rule.
- `src/styles/deferred.css` — deleted. It contains only entrance animation
  classes, `section { opacity: 0 }`, and a reduced-motion override; the override
  moves to `global.css`.
- `astro.config.mjs` — the `copy-deferred-css` plugin is removed because its
  source file is deleted. Outside the ticket's literal file list; without it
  the build throws on a missing file.
- `src/layouts/Layout.astro` — remove the deferred CSS preload and `noscript`,
  the grain overlay element, and the scroll observer. Keep the theme toggle and
  its storage.
- `src/components/Header.astro` — page fill with a 1px rule, no blur; mark in
  `currentColor`; nav link, menu toggle, and theme toggle states from the
  contract.
- `src/components/Footer.astro` — page surface, no dark band; referral badges
  keep their supplied artwork at a fixed height (contract E2).
- `src/components/ChatWidget.astro` — surface only: plate window, 1px rule, 2px
  radius, the single E1 shadow, ink close icon, the five control states, no
  entrance animation. Behaviour, copy, and data do not change.
- `src/components/Hero.astro` — one rule: the `.animate-fade-in-up` class no
  longer hides the hero now that the deferred keyframes are gone. Outside the
  ticket's file list; required by the ticket's own "no section is hidden by an
  opacity rule" acceptance.
- `docs/verification/2026-11-21-t002-shell/` — nine screenshots and a README.
- `docs/plans/2026-11-21-working-record-tokens-shell.md` — this plan.

No page section, content collection, test, asset, or dependency changes.

## Order of work

1. Write the token block and primitives in `global.css`. Check: no raw colour,
   font family, or radius in the shared shell files.
2. Delete `deferred.css` and its build copy, remove the preload, the grain, and
   the scroll observer. Check: no `opacity: 0` section rule remains; the build
   no longer references `/_deferred.css`.
3. Restyle `Header`, `Footer`, `ChatWidget` against the tokens, keeping their
   markup, copy, and scripts. Check: chat-widget and navigation specs pass.
4. Run `format:check`, `lint`, `test:unit`, then `build` and the shell e2e specs
   under Node 22.
5. Screenshot the header, footer, and widget in light and dark.

## Migration aliases

The contract retires the old colour, type, and radius names in T-002, but the
page sections still read them until T-003–T-005 land. Removing them now leaves
white-on-paper text in `TechStack` and fails axe. So `global.css` keeps a
clearly marked alias block that maps every old name onto a new role, and no
shared component uses an alias. The block is removed when the last page section
is migrated, before the gate. This is a deviation from the contract's
"retired in T-002" sentence and is recorded in the commit.

Aliases map `--radius-full` to `--radius-control`, so no pill survives even in
an unmigrated page.

## Risks

- A token value may fail a contrast pair in one theme. Mitigation: the pairs in
  the contract are measured; axe runs on both routes in the shell check. A
  failure is fixed in the token block, not in a component.
- The chat window's switch from opacity/visibility to `display` could affect
  focus and tests. Mitigation: the open state still sets `.open`, and the
  existing chat-widget spec covers open, close, Escape, and focus return.
- Deleting `deferred.css` without removing the Vite copy plugin would fail the
  build. Mitigation: both land in the same commit; `grep` proves no reference.
- The page sections will look unfinished until T-003–T-005. Mitigation: one
  branch, one change set; screenshots in this commit cover only the shell.

## Proof

- `grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(|font-family:|border-radius:'` on the
  five shell files outside `global.css` returns only `currentColor`, `inherit`,
  or comments.
- `grep -rn 'deferred'` returns nothing.
- `npm run format:check`, `npm run lint`, `npm run test:unit`, `npm run build`,
  `npm run test:e2e -- home navigation accessibility chat-widget` exit 0.
- Screenshots: header, footer, chat toggle and open window, light and dark, at
  1280 and 320.

## Deviations

- `astro.config.mjs` is edited although the ticket does not list it; it carries
  the copy step for the deleted `deferred.css`.
- `Hero.astro` gets one rule: its local `.animate-fade-in-up` set `opacity: 0`
  and referenced the `fadeInUp` keyframes that lived in `deferred.css`. With the
  file deleted, the hero would render blank in a normal browser (the e2e suite
  runs with reduced motion, which hid the bug). The fix removes the animation
  and the dead stagger delays, which is what the contract requires anyway.
- `Footer.astro` reserves 56px + one gutter on the last row at 769px and up.
  The fixed chat control covered the "Email" link at 1280; the screenshot
  caught it. No text or link changes.
- The alias block maps `--color-primary` and `--color-primary-container` to
  `ink`, not `signal`, so unmigrated headings, solid controls, and the floor hub
  draw in ink. `--color-accent` still maps to `signal`, so links stay signal.
  Old token names survive as internal aliases until the page tickets land, for
  the axe reason above. Shared components do not use them.
