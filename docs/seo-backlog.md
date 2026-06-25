# SEO Backlog

Future SEO work that is intentionally deferred. Implemented work lives in the codebase;
this file tracks what is **not** yet done and why.

## Deferred

### Per-template dynamic OG (Open Graph) images
- **What:** Generate a unique social-share image per page (journal posts, `/to/[name]`,
  collections, colors) using `next/og` `ImageResponse`, instead of the single site-wide
  `app/opengraph-image.png`.
- **Why deferred:** `next/og` needs an embedded font to statically generate images at build
  time. With `generateStaticParams` producing 75+ journal images (plus other templates), a
  missing or misconfigured font is a real build-fragility risk, which we avoided during the
  "bulletproof" SEO pass. The existing site-wide OG image stays valid in the meantime.
- **How to do it safely later:**
  1. Add a bundled font file to the repo (e.g. a Lora subset) and load it via
     `fetch(new URL('./font.ttf', import.meta.url))` inside the image route.
  2. Create `app/journal/[slug]/opengraph-image.tsx` (and optionally for `/to/[name]`,
     `/collections/[slug]`, `/colors/[color]`) exporting `size`, `contentType`, and a default
     `Image()` that renders the page title on a branded background using the embedded font.
  3. Run a full `next build` to confirm every image generates without runtime font errors.
- **Impact:** Minor. Affects social-share previews (CTR on shared links), not search rankings.

## Notes
- Pagination canonicals are already correct (`/unsent/[page]` self-canonicals; `/letters` and
  `/to/[name]` self-canonical), so no change was needed there.
