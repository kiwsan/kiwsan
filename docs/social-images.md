# Social images

The social card is generated from `scripts/social-cards.mjs`. It uses the site's Manrope and Inter fonts, the isometric office language, and the Tokyo Night palette.

## Files

| File | Size | Use |
|---|---|---|
| `public/images/og-image.png` | 1200 × 630 | Facebook, LinkedIn, X, Slack, Discord, WhatsApp link previews |
| `public/images/social/og-square.png` | 1200 × 1200 | Instagram feed, square chat previews |
| `public/images/social/og-portrait.png` | 1080 × 1350 | Instagram 4:5 feed |
| `public/images/social/og-story.png` | 1080 × 1920 | Instagram Stories, Reels, TikTok |

The primary link preview uses the 1200 × 630 image through the `og:image` and `twitter:image` tags. The other variants are available for manual posting.

## Regenerate

```bash
npm run social:generate
```

The script renders each variant in Chromium at 2× and downsamples it with sharp. It writes the primary image to `public/images/og-image.png` and the other variants to `public/images/social/`.

The OG image URL carries a version query in `Layout.astro`. Bump `ogImageVersion` when the artwork changes so social crawlers fetch the new file. After deploying, use the Facebook Sharing Debugger to refresh the cached preview.

## Rules

- Keep the name and title inside the left copy area for the 1200 × 630 card.
- Keep the square and story variants as separate exports instead of relying on platform crops.
- Keep text at least 40px from the edge on the 1200 × 630 card.
- Use PNG for compatibility. The primary card is about 260KB; it is fetched by crawlers, not by page visitors.
