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

Adsterra requires the following domains whitelisted in `next.config.ts` under `Content-Security-Policy`:

| Domain | Purpose | CSP Directives |
|---|---|---|
| `*.highperformanceformat.com` | Main ad script delivery (`invoke.js`) | `script-src`, `connect-src`, `frame-src`, `img-src` |
| `*.effectivecpmnetwork.com` | Native banner delivery | `script-src`, `connect-src`, `frame-src`, `img-src` |
| `*.protrafficinspector.com` | Ad stats & tracking | `connect-src`, `script-src`, `img-src` |
| `*.realizationnewestfangs.com` | Ad creative JS & iframe delivery | `script-src`, `connect-src`, `frame-src`, `img-src` |

> **Note:** Adsterra may rotate delivery domains over time. If you see new CSP violations in the browser console with unfamiliar domain names, add them the same way.

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

### Step 4: Remove Adsterra domains from Content-Security-Policy

**File:** `next.config.ts`

In the `headers()` configuration under `Content-Security-Policy`, remove all 4 Adsterra domains from `script-src`, `img-src`, `connect-src`, and `frame-src`:

```
https://*.highperformanceformat.com
https://*.effectivecpmnetwork.com
https://*.protrafficinspector.com
https://*.realizationnewestfangs.com
```

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
