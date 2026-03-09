# Chat Widget Design

## Overview
AI chat widget (bottom-right corner) for the portfolio site that answers questions about Ekkachai. Frontend-only phase first, with Gemini API integration later via serverless functions.

## Approach
Vanilla HTML/CSS/JS in a single Astro component (`ChatWidget.astro`). No additional dependencies.

## UI Specifications

### Toggle Button
- Circular button (56px) at bottom-right corner
- Background: `--color-primary`, icon: white chat bubble
- Hover: scale(1.05) + shadow
- Existing `.theme-toggle` moves up to `bottom: 5.5rem` to avoid overlap

### Chat Window
- Size: 380px x 520px (desktop), full screen (mobile < 480px)
- Position: fixed, bottom-right, above toggle button
- Border-radius: `--radius-xl`
- Background: `--color-bg`, border: `--color-border`
- Box shadow for elevation
- Open/close animation: slide up + fade in

### Header
- Title: "Ask about Ekkachai"
- Close button (X) on the right
- Background: `--color-primary`, text: white

### Messages
- Bot messages: left-aligned, background `--color-surface`
- User messages: right-aligned, background `--color-primary`, text white
- Bot avatar: circle with "E" letter, color `--color-primary`
- Timestamp below each message, `--text-xs`, `--color-text-muted`
- New messages animate in with fade

### Typing Indicator
- 3 bouncing dots in bot message style
- Shown during mock delay (1-2s) before bot response

### Input Area
- Text input with placeholder "Type a message..."
- Send button (arrow icon) on the right
- Send on Enter key or button click
- Disabled while bot is "typing"

## Dark Mode
Uses existing CSS custom properties. Automatically adapts via `--color-*` variables and `[data-theme="dark"]` selectors.

## Responsive
- Desktop (> 480px): 380x520px floating window
- Mobile (<= 480px): full-screen overlay with safe area padding

## Mock Responses (Phase 1)
Keyword-based canned responses:
- Skills/tech -> tech stack info
- Experience/work -> work history
- Projects -> project highlights
- Contact/hire -> contact info
- Default -> greeting + suggestion prompts

1-2 second delay with typing indicator to simulate real AI response.

## Integration
- New file: `src/components/ChatWidget.astro`
- Add `<ChatWidget />` in `Layout.astro` before `</body>`
- Adjust `.theme-toggle` position in `global.css`

## Future (Phase 2)
- Serverless function backend (Vercel/Netlify/Cloudflare)
- Google Gemini API integration
- Knowledge base: existing site content + separate markdown file
- Streaming responses
