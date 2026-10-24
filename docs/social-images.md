# Social images

The social card is generated from `scripts/social-cards.mjs`. It uses the site's Manrope and Inter fonts, an ink axonometric office drawing, a cobalt field, and print registration marks on warm paper.

## Files

| File | Size | Use |
|---|---|---|
| `public/images/og-image.png` | 1200 × 630 | Facebook, LinkedIn, X, Slack, Discord, WhatsApp link previews |
| `public/images/social/og-square.jpg` | 1200 × 1200 | Instagram feed, square chat previews |
| `public/images/social/og-portrait.jpg` | 1080 × 1350 | Instagram 4:5 feed |
| `public/images/social/og-story.jpg` | 1080 × 1920 | Instagram Stories, Reels, TikTok |

The primary link preview uses the 1200 × 630 PNG through the `og:image` and `twitter:image` tags. The other variants are JPEG for manual posting.

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
- The primary PNG is about 390KB; it is fetched by crawlers, not by page visitors.
- The square, portrait, and story JPEGs are about 120–150KB each.
