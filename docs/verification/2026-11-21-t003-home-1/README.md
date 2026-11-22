# T-003 home, part 1 screenshots

Evidence for `T-003` (hero, metrics, career log) on the `design/working-record`
branch. Captured 2026-11-21 against a production build served by
`astro preview`, at 320, 768, and 1280 CSS px, in light and dark. The fixed
header, skip link, and chat control are hidden for the capture so they do not
paint over a tall element; they are unchanged from T-002.

| Group        | Files                                                    |
| ------------ | -------------------------------------------------------- |
| `hero-*`     | label, title, rule, lede, inline labels, two controls, portrait plate |
| `metrics-*`  | four-column ruled ledger; two columns at 768; one at 320  |
| `experience-*` | section header, six numbered run rows, rail skyline, field column, tools, results |

What the shots check: no page gradient or decorative background; no
uppercase tracked label; no pill; no gradient control; no terminal prompt,
cursor, `tool_call`, or check glyph; the run rows reflow without clipping or
horizontal scroll; light and dark use the same six roles.
