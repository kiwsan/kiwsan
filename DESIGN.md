# Design contract: the Working Record

- Status: approved at G2, 2026-11-21. Replaces the "Precision Architect" brief.
- Applies to: `/` and `/workforce`; every component in `src/components/`, the
  layout, and the workforce page.
- Decision: `ADR-20261121-kiwsan-site-unslop` §3, Direction A. That ADR is the
  decision record; this file is the contract a reviewer builds against.
- Token home: `src/styles/global.css`. This file names the roles; the token
  block holds the values.
- Change rule: no page, component, or asset style is written outside this
  contract and the token block.

## 1. Direction and rationale

**Every screen is a record of work: paper, ink, a rule, and a dated row, with
nothing on it that does not record something.**

A reviewer rejects a screen that would still read as a product surface. Reject
if any of these is true:

- hierarchy comes from type size or an effect instead of a rule, a margin, or a
  date;
- a surface floats: blur, shadow, lift, gradient, or a card used as a container;
- a control is filled with a gradient, or moves on hover;
- a tag is a pill;
- a label is uppercase mono below 12px, or any label is decorative;
- copy imitates a terminal: a prompt, a generated command, a fake cursor, a
  `tool_call`;
- a number is set as a hero stat or a metric card;
- an entrance, scroll, count-up, or typing effect plays;
- a section is separated by a background shift instead of a 1px rule.

The site's differentiator is not an effect. It is dated, falsifiable detail: a
review that returned six findings on 1 Nov 2026, a rollback SHA, a tier that
denies force-push, six runs with tasks and results. The direction puts that
detail in the reading position and removes the effects that compete with it.

**Rejected: Direction B, the Drawing Set.** It makes the drawing sheet the unit,
promotes Manrope to a 3–4rem sheet title, and gives every section a title block
and a schedule. It is rejected because its title block wants sheet numbers,
scales, and statuses the content does not contain, so it either stays decorative
or invents copy, and because at 320px its callouts and dimension lines are the
first thing to fail. Two things are borrowed and no more: the floor and the
per-run skylines get a plate treatment (own field, caption, no card chrome), and
the workforce page keeps a repeating section header of number, title, and
one-line purpose.

**Also rejected: keep the brief and patch the worst offenders.** The old brief
is the source of the tells; keeping it would keep authorising glass, gradients,
pills, and the type swing. It is named so that "just recolour it" is visibly
considered and refused.

This contract is not a licence to make the site look like documentation. The
drawings, the dated rows, and typographic craft carry the character. If a screen
loses those and reads as a manual, the screen is wrong, not the direction.

## 2. Tokens

### 2.1 Colour: six roles, no others

One saturated colour, `signal`, and it is reserved for links, focus, the current
run, and a gate's state. A new department colour, a status colour, or a third
accent is banned.

| Role        | Light                 | Dark                     | Use                                                    | Never                                     |
| ----------- | --------------------- | ------------------------ | ------------------------------------------------------ | ----------------------------------------- |
| `page`      | `#F2EFE7`             | `#15171C`                | every page and section background                      | a card fill, a gradient stop              |
| `plate`     | `#E8E3D6`             | `#1E2127`                | drawing fields, table headers, disabled controls       | a full page or section background         |
| `ink`       | `#15171C`             | `#F2EFE7`                | body text, titles, solid controls                      | a large decorative fill                   |
| `ink-muted` | `#5E5A52`             | `#A9A396`                | captions, secondary detail, disabled labels            | primary prose, a link at rest             |
| `rule`      | `rgba(21,23,28,0.18)` | `rgba(242,239,231,0.20)` | every 1px separation, table rows, inline label borders | a filled surface                          |
| `signal`    | `#1E3A8A`             | `#8FA8E8`                | links, focus ring, current run, active gate            | decoration, a second accent, a background |

- The light values for `page`, `ink`, `ink-muted`, `signal`, and `rule` are the
  paper/ink register already in the repository, in
  `scripts/social-cards.mjs:17-24` (`paper`, `ink`, `muted`, `cobalt`, `hair`).
  The card's red is not carried: `signal` is the only saturated colour.
- `plate` is one step from `page`, not an independent colour. It exists so a
  drawing or a table head can sit on the page without a card or a shadow.
- Dark is the inversion of the same six roles, not a second palette. Do not
  import a code-editor set of blues, purples, and greens.
- Measured pairs (WCAG contrast, computed 2026-11-21): `ink`/`page` 15.60 both
  themes; `ink-muted`/`page` 5.97 light and 7.14 dark; `signal`/`page` 9.01
  light and 7.63 dark. T-002 re-runs axe; a value change that fails a pair is a
  token defect, not a component defect.
- Token names: `--color-page`, `--color-plate`, `--color-ink`,
  `--color-ink-muted`, `--color-rule`, `--color-signal`. The old
  `--color-bg`/`--color-primary`/`--color-accent` names are retired in T-002.

### 2.2 Spacing, radius, border, elevation, motion

- **Spacing.** The existing 4px scale (`--space-1` … `--space-24`) stays.
  Section rhythm uses `--space-24` (6rem) at desktop, `--space-16` (4rem) at
  768, `--space-12` (3rem) at 320. A one-off spacing value is a token change,
  not a page style.
- **Radius.** Three values only: `0` on plates, images, tables, and sections;
  `2px` on controls (buttons, toggles, fields, tags-as-links); `3px` on a
  non-interactive inline label. No `8px`, no `16px`, no `9999px`. A control,
  tag, or inline label is never a circle or a pill; a drawing mark inside a
  plate (a node, a dot) and the assistant's loading dots may be round. Icon
  buttons are 2px-radius blocks, not circles.
- **Border.** 1px `rule` everywhere a separation is needed. The focus ring is
  2px `--color-signal` at 3px offset, defined once in `global.css`. A 1px border
  is not banned; it is the only way a boundary is drawn.
- **Elevation.** None. The single exception is the chat window (E1 in §6): one
  soft shadow, because an overlay above scrolling text cannot be separated by a
  rule alone.
- **Motion.** `120ms` and `cubic-bezier(0.2, 0, 0.2, 1)`, on colour and
  underline only. No transform, no opacity entrance, no scroll reveal, no
  count-up, no typing, no blinking cursor. The theme switch uses the same 120ms.
  No motion may cause layout shift, and content is fully readable with
  animation disabled. `prefers-reduced-motion: reduce` sets every duration to
  `0` in `global.css`; no component needs its own reduced-motion case.

## 3. Type scale

Two families, five steps, and no third voice.

- **Inter** is the reading family: body, prose, labels, captions, tables.
- **Manrope** is the title family: the page title and section titles only. Never
  below 20px. Never uppercase.
- **Mono is not a family in the system.** The existing mono stack is used only
  for an identifier — a file path, a commit SHA, a date or count inside a table,
  a run number — at 12px or larger, never uppercase, never for a label, never
  for English prose. If a value is not an identifier, it is Inter.

| Step    | Size                          | Family        | Line height | Use                                |
| ------- | ----------------------------- | ------------- | ----------- | ---------------------------------- |
| title   | `clamp(2.5rem, 5vw, 2.75rem)` | Manrope 700   | 1.1         | page title; one per route          |
| section | `1.75rem`                     | Manrope 700   | 1.2         | section titles                     |
| lede    | `1.125rem`                    | Inter 400     | 1.55        | the one paragraph under a title    |
| body    | `1rem`                        | Inter 400     | 1.6         | prose, record values, table cells  |
| small   | `0.8125rem` (13px)            | Inter 400/500 | 1.5         | captions, labels, dates in a table |

Rules:

- No size between or outside these five. The title may scale inside its stated
  range; the other four never scale down.
- No `text-transform: uppercase` anywhere in authoring. Data that arrives
  uppercase (a technology name) is set as it arrives.
- Titles use `-0.01em` tracking at most. No tracking on body text.
- Dates, periods, run numbers, counts, and table figures use
  `font-variant-numeric: tabular-nums`.
- Prose measure is 62–68 characters (`62ch`–`68ch`), including the workforce
  page's lede and the case study's paragraphs.
- Hierarchy comes from the rule, the margin, and the date, not from size.
- A section marker is a sentence-case caption at `small` in `ink-muted`. The old
  12px uppercase tracked `.section-label` is retired.

## 4. Layout

- **Grid.** A 12-column grid, 1200px maximum, `--space-6` gutters, and page
  padding of 2rem / 1.5rem / 1.25rem / 1rem at the existing breakpoints. One
  page colour: no alternating section background, no full-bleed tint.
- **Data rail.** A 9rem left rail at 1024px and up. It carries the date and the
  run number, and nothing else. Below 1024px the rail becomes a row above the
  record; it never scrolls horizontally.
- **Measure.** Prose is held to 62–68ch. A record's label column is 84px at
  desktop and stacks below the value under 768px.
- **Section rhythm.** Each section opens with a 1px `rule`, then the marker, the
  title, and at most one lede. The rule does the separating; a background shift
  or a card does not.
- **Asymmetry.** Allowed only when the margin holds data (a rail, a number, a
  date). There is no asymmetry for its own sake.
- **Plates.** A drawing gets a full-width field on `plate`, a 1px `rule`, a
  caption below it, and no card, shadow, or rounded corner. Radius 0.
- **Tables.** Hairline rows, a header at `small` in sentence case, no zebra, no
  radius, no shadow. A table that can overflow sits in a
  `role="region" tabindex="0"` scroll container with a visible focus ring; the
  page itself never scrolls horizontally.
- **Breakpoints.** 320, 768, and 1280 CSS px are the gate widths. Every layout
  rule must hold at all three: no horizontal page scroll, no clipped text, a
  usable navigation, and tables that scroll inside their own region. "It fits at
  1440" is not a test.

### Layout exceptions (the only page-specific rules)

1. The home page keeps this order: `Header`, `Hero`, `Metrics`, `Workforce`,
   `WorkExperience`, `Projects`, `TechStack`, `Contact`, `Footer`.
2. The workforce page keeps its nine sections and their order: hero, why, roles,
   loop, gates, tiers, evidence, questions, closing.
3. The home hero uses all 12 columns and no data rail. The career log uses the
   9rem rail because it is a ledger.
4. The workforce floor is a full-width plate on both routes: the drawing on its
   own field, a caption, and the shift log as a two-column schedule.
5. The workforce page's hero title is set at `section` size, not `title` size,
   so the roster count is not amplified (C2).
6. The two workforce tables keep their scroll regions and their keyboard focus.
7. `404.astro` is outside this pass. It receives the shared tokens and nothing
   else.

Every other visual rule in this contract is component-level or global. A new
page-specific rule is refused unless it is added to this list first.

## 5. Components and states

Ten components exist in `src/components/`. `Header`, `Footer`, and `ChatWidget`
are shared by both routes and are identical on both. `Layout.astro` owns the
skip link and the shared shell; `workforce.astro` owns the page patterns below.
The state matrix is the test: default, hover, focus-visible, active, and
disabled appear where they apply, and "n/a" is a written decision, not an
omission.

### 5.1 State definitions

- **Default.** No shadow, no transform, no blur, no gradient. A filled control
  uses `ink`; an outlined control uses 1px `rule` and `page`.
- **Hover.** Colour and underline only, in 120ms. Never reveals information that
  is not visible at rest. A hover-only control is banned.
- **Focus-visible.** A 2px `signal` outline at a 3px offset, from
  `global.css`, in both themes. Never removed; a mouse `:focus` is not a
  substitute.
- **Active.** No translate and no scale. A filled control keeps its hover fill
  and adds a 2px inset rule in the contrasting role (`page` inside an `ink`
  fill, `ink` inside a `page` fill); a link thickens its underline to 2px and
  moves the offset to 1px.
- **Disabled.** `plate` fill, 1px `rule`, `ink-muted` label, and a
  non-pointer cursor; no hover. Only the assistant's input and send button use
  it.

### 5.2 The matrix

| Component / part                        | Default                                                     | Hover                                | Focus-visible               | Active                        | Disabled                           |
| --------------------------------------- | ----------------------------------------------------------- | ------------------------------------ | --------------------------- | ----------------------------- | ---------------------------------- |
| `Header` logo link                      | ink mark, no underline                                      | mark in `signal`                     | 2px signal ring             | mark in `signal`, no movement | n/a                                |
| `Header` nav link                       | ink label, no underline                                     | `signal`, 1px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `Header` menu toggle                    | 2px-radius ink icon block                                   | `signal` icon                        | 2px signal ring             | `plate` fill, 2px rule        | n/a                                |
| `Header` theme toggle                   | 2px-radius ink icon block                                   | `signal` icon                        | 2px signal ring             | `plate` fill, 2px rule        | n/a                                |
| `Hero` primary CTA                      | ink fill, page label, 2px radius                            | page fill, 1px ink rule, ink label   | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `Hero` secondary CTA                    | page fill, 1px ink rule, ink label                          | ink fill, page label                 | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `Hero` tag list                         | comma-separated text, no fill                               | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `Hero` highlighted phrase               | ink text; plain, not a control                              | n/a                                  | n/a                         | n/a                           | n/a                                |
| `Metrics` ledger row                    | body-size figures, tabular, rule between                    | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `WorkExperience` run ledger             | rail date and `01 / 06`, label column, rules                | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `WorkExperience` tool tag               | 1px rule, 3px radius, `ink-muted`, `small`                  | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `Workforce` case-study link             | ink label, 1px underline                                    | `signal`, 2px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `Workforce` floor                       | plate field, ink drawing, accessible via `<title>`/`<desc>` | n/a: not interactive                 | n/a (SVG is not focusable)  | n/a                           | n/a                                |
| `Workforce` shift-log row               | rule between rows; current run in `signal`                  | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `Workforce` pod card                    | rule-bounded record, 0 radius                               | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `Projects` project                      | record entry with fixed fields, rule between                | n/a: the entry is not a control      | n/a                         | n/a                           | n/a                                |
| `Projects` project link                 | ink label, 1px underline                                    | `signal`, 2px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `Projects` tech tag                     | 1px rule, 3px radius, `ink-muted`                           | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `TechStack` skill tag                   | 1px rule, 3px radius, `ink-muted`                           | n/a: not interactive                 | n/a                         | n/a                           | n/a                                |
| `Contact` link item                     | ink label, 1px underline                                    | `signal`, 2px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `Contact` credential link               | ink label, badge image at text height                       | `signal`, 2px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `Contact` CTA primary                   | ink fill, page label, 2px radius                            | page fill, 1px ink rule              | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `Contact` copy button                   | outlined control, ink label                                 | ink fill, page label                 | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `Footer` referral and BMC links         | supplied badge artwork at fixed height                      | 1px rule under the badge becomes 2px | 2px signal ring             | 2px rule                      | n/a                                |
| `Footer` text link                      | ink label, no underline                                     | `signal`, 1px underline              | 2px signal ring             | 2px underline, 1px offset     | n/a                                |
| `ChatWidget` toggle (56px; 48px at 320) | ink fill, page icon, 2px radius                             | page fill, 1px ink rule              | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `ChatWidget` close                      | ink icon, 2px radius                                        | `signal` icon                        | 2px signal ring             | `plate` fill, 2px rule        | n/a                                |
| `ChatWidget` input                      | page fill, 1px rule, ink text                               | 1px `ink-muted` rule                 | 2px signal ring             | n/a                           | plate fill, rule, `ink-muted` text |
| `ChatWidget` send                       | ink fill, page icon, 2px radius                             | page fill, 1px ink rule              | 2px signal ring             | hover fill + 2px inset rule   | plate fill, rule, `ink-muted` icon |
| `ChatWidget` suggestion                 | page fill, 1px rule, ink label, small                       | ink fill, page label                 | 2px signal ring             | hover fill + 2px inset rule   | n/a                                |
| `Layout` skip link                      | page fill, ink label, 1px rule                              | n/a: appears on focus only           | 2px signal ring, top offset | n/a                           | n/a                                |

Component rules that the matrix depends on:

- `Header` is the only shared fixed element. It uses a 1px `rule` and a `page`
  fill, not a blur. The mark is `currentColor`, so it follows `ink` in both
  themes.
- `Metrics` is a ruled four-column ledger at body size. It is not a card grid,
  not a hero, and has no count-up. The figures are present on load.
- `WorkExperience` is a numbered run ledger. Field labels are sentence case and
  read at `small`; they are not uppercase, not mono, and not 10px. The run
  number and total are information and stay. The `C3` chrome in §6.3 goes.
- `Workforce` is a plate and a schedule. The drawing draws in `ink` and `rule`;
  `signal` marks the current pod and the current shift-log row. Department
  accents are gone from text, chips, and pod fills. The shift log keeps its
  `title`/`desc` data and its legend.
- `Projects` is a list of record entries with a fixed field order (title,
  company, period, challenge, solution, tech, results, link), a rule between
  entries, and no hover lift, image zoom, or card. A screenshot keeps its aspect
  ratio, has radius 0, and sits on `rule`.
- `TechStack` is a list of inline labels, grouped as today. The group cannot use
  a different fill or a second accent; the current-focus group is marked by
  position and a rule, not colour.
- `Contact` keeps both paths (link list and direct CTA). The copy button keeps
  its visible "Copied" feedback. It is not hover-only and not icon-only.
- `Footer` is a ledger: referral badges at fixed height on `page`, then the
  copyright, build version, and text links. No dark band, no white text on a
  near-black fill (that is a second palette).
- `ChatWidget` keeps its behaviour, model, and data. Only its surface changes:
  a plate window with a 1px rule, 2px radius, the E1 shadow, no filled header
  bar, an ink close icon, and the same input and send states. Its loading
  indicator is a state, not decoration.

### 5.3 Workforce-page patterns

| Pattern               | Rule                                                                             | States                                           |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| Hero and lede         | `section`-size title, one lede at 62–68ch, no stat callout                       | n/a: static                                      |
| Hero actions          | the two block controls from §5.2                                                 | default, hover, focus-visible, active            |
| Inline link in a note | body link, underlined at rest                                                    | default, hover, focus-visible, active            |
| Facts line            | the four facts set at body size in a ruled record; none is a hero stat or a chip | n/a: static                                      |
| Section header        | rule, generated section index, title, one-line purpose                           | n/a: static                                      |
| Problem record        | `01`–`03` in the margin, title, one paragraph, rule between                      | n/a: static                                      |
| Role schedule         | a ruled table of function, role, artifact; no cards, no accents                  | n/a: static; the role count is not a hero figure |
| Loop step             | an ordered record: number in the margin, title, body, role and gate              | n/a: static                                      |
| Data table            | hairline rows, sentence-case header, scroll region                               | region: focus-visible ring; no hover or disabled |
| Evidence entry        | dated record with the claim it does not make stated in place                     | n/a: static                                      |
| Question              | title and answer in a ruled record, one per row                                  | n/a: static                                      |
| Closing actions       | the two block controls                                                           | default, hover, focus-visible, active            |

The workforce page keeps its content, data, and anchors. Section order is fixed
by §4. The `tabindex="0"` regions on the gates and tiers tables stay.

## 6. Banned patterns

A banned pattern is not kept "temporarily". The owner column is the ticket that
removes it; T-007 fails the gate if one survives.

### 6.1 The list

| Pattern                                                   | Owner                      | Today's instance (2026-11-21)                                                                                                                                                                                     |
| --------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Glassmorphism, backdrop blur                              | T-002                      | `Header.astro:165-166`                                                                                                                                                                                            |
| Gradient-filled controls or decorative gradients          | T-003, T-004, T-005        | `Hero.astro:566,573`, `Contact.astro:184,191`, `Projects.astro:400,410`, `workforce.astro:581`; hero background at `Hero.astro:246,270,288`                                                                       |
| Pill tags (9999px or any full radius)                     | T-002, T-003, T-004, T-005 | `Hero.astro:532`, `TechStack.astro:60`, `Projects.astro:340`, `ChatWidget.astro:454-457,487-490`, `workforce.astro:811`                                                                                           |
| Decorative sub-12px, uppercase, or mono labels            | T-002, T-003, T-005        | `.section-label` in `global.css:262`; `.k` and `.tool-label` at 10px in `WorkExperience.astro:907,941`; `.bp-dim-label` at 7px at `:761-764`; `.card-index` and the role-card header in `workforce.astro:644,706` |
| Fake shell chrome                                         | T-003                      | `WorkExperience.astro:33,62,173-181,220-223,235-236`                                                                                                                                                              |
| Emoji as an icon                                          | T-007                      | none found in `src/` on 2026-11-21; the gate checks zero                                                                                                                                                          |
| A metrics strip used as a hero                            | T-003                      | `Metrics.astro:48-75` (40vh, centred, display figures)                                                                                                                                                            |
| A second accent, department colour, or status colour      | T-003, T-004, T-005        | `WorkExperience.astro:16`, the `--accent` values in `Workforce.astro` and `workforce.astro`                                                                                                                       |
| Hover lift, scale, or shadow                              | T-002, T-003, T-004        | `Metrics.astro:72`, `Projects.astro:223,347`, `Hero.astro:538`, `TechStack.astro:72`, `ChatWidget.astro:170,175,469`                                                                                              |
| Entrance, scroll, count-up, typing, or blinking motion    | T-002, T-003, T-004        | `Metrics.astro:21-45`, `Layout.astro:165-176`, `WorkExperience.astro:250-420`, `Workforce.astro:310+`, `deferred.css` stagger classes                                                                             |
| A background shift used to separate sections              | T-003, T-004, T-005        | `.metrics`, `.tech-stack`, `.section-surface`                                                                                                                                                                     |
| A new dependency, font, icon set, or client JS for effect | every ticket               | none today; `package.json` and the build output are diffed at T-007                                                                                                                                               |

The workforce role count is not a display figure, hero stat, or chip (C2). It
stays inside running text and its schedule row, and the case-study title is set
at `section` size.

### 6.2 Written exceptions

These survive, with the reason stated. No other pattern is exempt.

- **E1. One overlay shadow on the chat window.** An overlay above scrolling text
  cannot be separated by a 1px rule alone. The shadow is ink at 8%, 0 8px 32px,
  and is the only elevation in the system. Owner: T-002.
- **E2. Supplied third-party badge artwork in `Footer`.** DigitalOcean,
  Hostinger, and Buy Me a Coffee supply their own images and colours. They are
  content images at a fixed height on `page`, never recoloured, never used as a
  UI colour. Owner: T-002.
- **E3. Line-art grids and dimension marks inside plates.** The hero figure, the
  per-run skylines, and the floor are drawings. They draw in `ink`, `rule`, and
  `signal` only. A full-page grain or noise overlay is banned. Owner: T-003 and
  T-004.
- **E4. The assistant's loading indicator.** Three dots while a reply is
  pending are a loading state, not a typing effect: the message text is present
  when it arrives, and the dots stop under reduced motion. Owner: T-002.

### 6.3 The C3 text exception

`R4` freezes visible text. G2 approved exactly this removal, and nothing else.
Every string below goes with its element; the styling that framed it goes too.

| Remove                                          | Where                             | Note                                                        |
| ----------------------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `$` prompt glyph                                | `WorkExperience.astro:175-177`    | with its `aria-hidden` wrapper                              |
| `career log --org "<company>" --role "<title>"` | `WorkExperience.astro:33,178-180` | the generated command string and its `aria-label` at `:173` |
| the blinking cursor element                     | `WorkExperience.astro:181`        |                                                             |
| `tool_call(N)`                                  | `WorkExperience.astro:223`        | N is the run's tool count                                   |
| `▸`                                             | `WorkExperience.astro:220-222`    |                                                             |
| `✔`                                             | `WorkExperience.astro:235-237`    |                                                             |
| `career floor`                                  | `WorkExperience.astro:62`         | scene label                                                 |
| `AI team floor`                                 | `Workforce.astro:28`              | scene label                                                 |
| `06 roles · 2015 — now`                         | `WorkExperience.astro:63-66`      | career status chip, with its dot                            |
| `25 roles · 6 teams`                            | `Workforce.astro:29-32`           | floor status chip, with its dot                             |
| `6 teams`                                       | `Workforce.astro:231`             | shift-log chip                                              |

What stays, unchanged in wording: the run number and total (`01 / 06`), the
field labels as words (role, org, period, task, impl), the tool list, the result
lines, the section headings and captions, the link text, the shift-log heading
`team status`, the pod and team counts in the schedule, and every role card.
The mono and uppercase styling on the removed chrome, and on the field labels,
is retired; the labels are set sentence case at reading size. Their words do not
change.

This list is the whole licence. It does not authorise rewording a claim,
changing a date, removing a link, or "tidying" a sentence. Anything not listed
is frozen. The roster copy (25 roles, `reviewer`, `qa`) is `C2`, a separate
content intent; this pass does not fix it and must not amplify it.

No new visible numbering is authored. Where a number is needed, use the numbers
already in the content (run `01 / 06`, the `01`–`03` problem indexes, the
ordered loop). A generated section index is a CSS counter, not copy.

## 7. Evidence and finish gate

The gate is the `anti-ui-slop` skill's finish gate, run by the verifier, not the
builder. It is a review with evidence, not a build that exited 0.

- **Surface.** Both routes: `/` and `/workforce`.
- **Widths.** 320, 768, and 1280 CSS px.
- **Themes.** Light and dark, plus the `prefers-color-scheme` fallback.
- **Passes.** A keyboard-only pass, a `prefers-reduced-motion: reduce` pass, and
  a JavaScript-off pass. With JS off, text, navigation, contact links, and the
  workforce schedule still carry the same information.
- **Record.** `docs/verification/2026-11-21-kiwsan-site-unslop.md`, one row per
  route × width × theme, with a pass or fail for each of: direction, tokens,
  type, layout, components and states, banned patterns, accessibility, motion,
  and copy freeze (against §6.3). Screenshot paths are listed per row.
- **Commands.** `npm run build`, `npm run lint`, `npm run test:unit`,
  `npm run test:e2e`, and `npm run format:check` all exit 0. The existing axe,
  accessibility, navigation, responsive, and workforce specs are part of
  `test:e2e`; they are not replaced by screenshots.
- **Scans.** `AC2`'s CSS scan: no raw colour, literal `font-family`, or literal
  `border-radius` outside `global.css`; the only allowed radius values are 0,
  2px, and 3px, through tokens. `AC4`'s diff: no text change except §6.3.
- **Failure.** If the gate fails, fix it inside the branch. If it fails twice on
  the same section, stop and re-scope that section; do not merge a half-system.
  No gate, no merge, and the merge is not the deploy.

## 8. Maintenance rule

- **A new token** is added in `src/styles/global.css` only, in `:root`,
  `[data-theme='dark']`, and the `prefers-color-scheme` fallback together. Then
  run the CSS scan and axe. A component never declares its own colour, font
  family, or radius.
- **A new component** is built from the parts and states in §5. If it needs a
  pattern or a state that is not in this contract, update this contract in the
  same change, before the component is styled. A component that "needed" a new
  colour is a token decision, not a component decision.
- **A one-off page style is refused.** A page's scoped styles may place
  components in the grid and nothing else. If a page truly needs a different
  rule, it is added to the layout exceptions in §4 with a reason, or it does not
  ship.
- **Copy is frozen** except §6.3. A copy change is a content ticket, not a
  design change.
- **Open decisions** (not a ninth section; each needs a human):
  1. `animejs` is currently a dependency used only by the floor assembly. T-004
     removes the import; whether to drop the package is a separate change.
  2. If the floor cannot be made legible at 320 without losing data, replace it
     with a static schedule below 768 and keep the drawing at 768 and up. Decide
     at T-004 with the T-007 screenshot, not by shrinking labels below 12px.
  3. A replacement typeface returns to G2 with its licence and loading cost. The
     default is the two existing families.
  4. The roster correction is `C2`'s separate content intent and blocks G4. Do
     not change the count in this pass.
  5. The identity assets (`C4`) are regenerated from these tokens in T-006. If
     the social card's red is wanted back, that is a change to the six roles and
     returns to G2.
- **What this contract cannot verify.** Taste. The gate records what was
  observed; a person reads it, asks "what does this person do?", and decides
  whether the record reads as work or as a manual. That decision is G4, and it
  is not an agent's to make.
