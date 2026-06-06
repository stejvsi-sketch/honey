'use client';

import { usePathname } from 'next/navigation';

/**
 * Paths that must NOT load AdSense (low-content, utility, admin pages).
 * Google publisher policy forbids ads on screens without publisher content,
 * error pages, login/admin, and utility/navigation-only pages.
 */
const NO_ADS_PATHS = new Set([
  '/write',
  '/contact',
  '/xqvjkl',
  '/confess',
]);

/** Path prefixes that must not load ads */
const NO_ADS_PREFIXES = ['/xqvjkl/', '/api/'];

const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4151123662328725';

function shouldLoadAds(pathname: string): boolean {
  if (NO_ADS_PATHS.has(pathname)) return false;
  for (const prefix of NO_ADS_PREFIXES) {
    if (pathname.startsWith(prefix)) return false;
  }
  return true;
}

/**
 * Conditionally renders the Google AdSense script tag.
 * 
 * Uses a standard <script> tag rendered inline so it appears in the
 * server-rendered HTML for Google's verification crawler.
 * 
 * Excluded on: /write, /contact, /xqvjkl (admin), /confess, 404 pages.
 * Legal pages (/privacy, /terms, /cookies, /disclaimer) keep the script
 * because they have meaningful text content and Google needs to verify
 * the script is present across the site during account review.
 */
export default function AdSenseScript() {
  const pathname = usePathname();

  if (!shouldLoadAds(pathname)) return null;

  // eslint-disable-next-line @next/next/no-sync-scripts
  return (
    <script
      async
      src={ADSENSE_SRC}
      crossOrigin="anonymous"
    />
  );
}
