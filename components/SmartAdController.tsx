'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * SmartAdController — Intelligent In-Page Push ad manager
 * 
 * Rules:
 * - Only fires AFTER the user has viewed 3+ pages (they're engaged, won't bounce)
 * - 90-second cooldown between push injections (no re-spawning on every navigation)  
 * - Max 3 pushes per session (stops spamming after that)
 * - Never fires on /write page (conversion page)
 * - Uses sessionStorage for tracking within the current visit
 */

const ZONE_ID = '11272143';
const MIN_PAGEVIEWS = 3;      // Only show after 3 pages visited
const COOLDOWN_MS = 90_000;   // 90 seconds between pushes
const MAX_PER_SESSION = 3;    // Max 3 pushes per session

export default function SmartAdController() {
  const pathname = usePathname();
  const lastPushTime = useRef<number>(0);

  useEffect(() => {
    // Never show ads on the write/conversion page
    if (pathname === '/write') return;

    // Track pageviews
    const views = parseInt(sessionStorage.getItem('ad_views') || '0', 10) + 1;
    sessionStorage.setItem('ad_views', String(views));

    // Check if user is engaged enough
    if (views < MIN_PAGEVIEWS) return;

    // Check session push limit
    const pushCount = parseInt(sessionStorage.getItem('ad_pushes') || '0', 10);
    if (pushCount >= MAX_PER_SESSION) return;

    // Check cooldown
    const now = Date.now();
    if (now - lastPushTime.current < COOLDOWN_MS) return;

    // All checks passed — inject the push ad after a short delay
    const timer = setTimeout(() => {
      const s = document.createElement('script');
      s.dataset.zone = ZONE_ID;
      s.src = 'https://nap5k.com/tag.min.js';
      document.body.appendChild(s);

      lastPushTime.current = Date.now();
      sessionStorage.setItem('ad_pushes', String(pushCount + 1));
    }, 2000); // 2-second delay after page settles

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // No UI — this is a logic-only component
}
