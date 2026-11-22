# T-002 shell screenshots

Evidence for `T-002` (tokens and shared shell) on the `design/working-record`
branch. Captured 2026-11-21 against a production build served by
`astro preview` at 1280 and 320 CSS px.

| File                    | Surface                    | Theme | Width |
| ----------------------- | -------------------------- | ----- | ----- |
| `header-light-1280.png` | fixed header               | light | 1280  |
| `header-dark-1280.png`  | fixed header               | dark  | 1280  |
| `header-light-320.png`  | fixed header, menu toggle  | light | 320   |
| `footer-light-1280.png` | footer, referral row       | light | 1280  |
| `footer-dark-1280.png`  | footer, referral row       | dark  | 1280  |
| `footer-light-320.png`  | footer, stacked            | light | 320   |
| `chat-light-1280.png`   | chat window, welcome state | light | 1280  |
| `chat-dark-1280.png`    | chat window, welcome state | dark  | 1280  |
| `chat-light-320.png`    | chat window, full screen   | light | 320   |

What the shots check: one paper/ink surface with a 1px rule; no blur, grain,
gradient, shadow, or pill; the theme toggle is a 2px block; the mark follows
`currentColor`; the footer's third-party badges keep their supplied artwork;
the chat window is the only elevation; the footer's last row clears the fixed
chat control.

The final finish gate and the per-section pass/fail record are T-007's
`docs/verification/2026-11-21-kiwsan-site-unslop.md`.
