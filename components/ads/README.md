# Adsterra Ad Integration

## Overview

This site uses **Adsterra** for monetization with 4 ad unit types:

| Ad Unit | Size | Adsterra Key | File |
|---|---|---|---|
| Rectangle Banner | 300×250 | `c0a00a6cde20970d4da60a7e2f89e430` | `components/ads/AdBanner.tsx` |
| Leaderboard Banner | 728×90 | `24e89e028dbbaafbf9241da97e5e7c06` | `components/ads/AdBanner.tsx` |
| Mobile Banner | 320×50 | `0ebdaa6a199e71d87754eed6ef075b7f` | `components/ads/AdBanner.tsx` |
| Native Banner | — | `3af113a497d05b87ffa4e9e06fcf7baf` | `components/ads/AdNativeBanner.tsx` |

## Ad Placement Map

| Page | Route | Ad(s) |
|---|---|---|
| Homepage | `/` | Rectangle (300×250) |
| Letters Archive | `/letters` | Leaderboard (728×90) / Mobile (320×50) + In-feed Rectangle (300×250) after 9th card |
| Single Letter | `/letter/[id]` | Rectangle (300×250) |
| Name Page | `/to/[name]` | Leaderboard/Mobile + Native Banner |
| Journal Article | `/journal/[slug]` | Rectangle (300×250) + Native Banner |
| Journal Index | `/journal` | Leaderboard (728×90) / Mobile (320×50) |
| Unsent Archive | `/unsent/[page]` | Rectangle (300×250) |

Pages with NO ads: `/write`, `/about`, `/faq`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/disclaimer`, `/colors`, `/collections`, `/stories`, `/table`, `/archive`

## Content Security Policy (CSP)

Adsterra uses **randomly-generated rotating delivery domains** (e.g., `realizationnewestfangs.com`, `zoologyfibre.com`, `protrafficinspector.com`). Whitelisting them individually is an endless game of whack-a-mole.

**Current approach:** The CSP in `next.config.ts` uses `https:` (any HTTPS source) for `script-src`, `connect-src`, `frame-src`, and `img-src`. This allows Adsterra to work regardless of which domains they rotate to.

**What's still strictly protected (even with ads):**
- `default-src 'self'` — everything not explicitly listed is restricted to our domain
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — only our styles + Google Fonts
- `font-src 'self' data: https://fonts.gstatic.com` — only our fonts + Google Fonts
- `object-src 'none'` — no Flash/plugins
- `base-uri 'self'` — prevents base tag injection
- `form-action 'self'` — forms can only submit to our domain

See **Step 4** in the removal guide below for the original strict CSP to restore when removing ads.

## Local Development Note

**Ads will NOT render on `localhost`.** You will see "This content is blocked. Contact the site owner to fix the issue." — this is normal. Adsterra only serves ad creatives to authorized production domains (e.g., `honeyifonly.com`). This is an anti-fraud measure and cannot be bypassed.

---

## How to Remove All Ads

### Step 1: Delete ad component files

```
components/ads/AdBanner.tsx
components/ads/AdNativeBanner.tsx
app/ads.css
```

### Step 2: Remove the CSS import from layout

**File:** `app/layout.tsx`

Remove this line:
```tsx
import './ads.css';
```

### Step 3: Remove ad imports and components from each page

Search your codebase for these imports and remove them along with their JSX usage:

```bash
# Find all files that import ad components
grep -rn "AdBanner\|AdNativeBanner\|AdResponsiveBanner" --include="*.tsx" app/ components/
```

Here's the exact list of files to edit:

#### `app/page.tsx` (Homepage)
- Remove: `import AdBanner from '@/components/ads/AdBanner';`
- Remove: `<AdBanner variant="rectangle" />`

#### `app/letter/[id]/page.tsx` (Single Letter)
- Remove: `import AdBanner from '@/components/ads/AdBanner';`
- Remove: `<AdBanner variant="rectangle" />`

#### `app/to/[name]/page.tsx` (Name Page)
- Remove: `import { AdResponsiveBanner } from '@/components/ads/AdBanner';`
- Remove: `import AdNativeBanner from '@/components/ads/AdNativeBanner';`
- Remove: `<AdResponsiveBanner />`
- Remove: `<AdNativeBanner />`

#### `app/journal/[slug]/page.tsx` (Journal Article)
- Remove: `import AdBanner from '@/components/ads/AdBanner';`
- Remove: `import AdNativeBanner from '@/components/ads/AdNativeBanner';`
- Remove: `<AdBanner variant="rectangle" />`
- Remove: `<AdNativeBanner />`

#### `app/journal/page.tsx` (Journal Index)
- Remove: `import { AdResponsiveBanner } from '@/components/ads/AdBanner';`
- Remove: `<AdResponsiveBanner />`

#### `components/LettersArchive.tsx` (Letters Archive)
- Remove: `import CardRenderer from '@/components/cards/CardRenderer';`
- Remove: `import { AdResponsiveBanner } from '@/components/ads/AdBanner';`
- Remove: `import AdBanner from '@/components/ads/AdBanner';`
- Remove: `const IN_FEED_AD_AFTER = 9;`
- Remove: `<AdResponsiveBanner />`
- Remove: the entire first-batch plain grid block, `<AdBanner variant="rectangle" />`, and the conditional `<VirtualizedCardGrid memories={memories.slice(IN_FEED_AD_AFTER)} />`
- Restore: `<VirtualizedCardGrid memories={memories} />` as a single call

#### `components/UnsentArchive.tsx` (Unsent Archive)
- Remove: `import AdBanner from '@/components/ads/AdBanner';`
- Remove: `<AdBanner variant="rectangle" />`

### Step 4: Restore the strict Content-Security-Policy

**File:** `next.config.ts`

The CSP was relaxed to `https:` for ad compatibility. Replace the current CSP block with the original strict version:

```ts
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://faves.grow.me https://*.grow.me https://cdn.prod.uidapi.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://*.grow.me",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://*.supabase.co https://*.upstash.io https://*.grow.me https://*.growplow.events https://*.uidapi.com",
    "frame-src 'self' https://*.grow.me",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
},
```

This restores the pre-ad strict CSP that only allows Google Analytics, Cloudflare, Grow.me, Supabase, and Upstash.

### Step 5: Build and deploy

```bash
npx next build
git add .
git commit -m "chore: remove all Adsterra ads"
git push
```

---

## Quick One-Liner Removal (PowerShell)

If you want to quickly find every ad reference before removing:

```powershell
Select-String -Path "app\**\*.tsx","components\**\*.tsx" -Pattern "AdBanner|AdNativeBanner|AdResponsiveBanner|ads\.css" -Recurse
```
