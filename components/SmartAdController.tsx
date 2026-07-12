'use client';

import { useEffect } from 'react';

/**
 * AdFrequencyGuard — Controls Monetag In-Page Push notifications
 * 
 * The exact Monetag script stays in <head> (required for verification).
 * This component:
 *  1. Watches the DOM for injected push notification elements
 *  2. Moves them to the LEFT side (so they don't block nav/buttons on the right)
 *  3. Removes extras if frequency limits are exceeded
 *
 * Rules:
 *  - First 2 pageviews: remove all push notifications
 *  - Max 2 push notifications per session total
 *  - 2-minute cooldown between notifications
 *  - Always remove on /write page
 */

const MIN_VIEWS = 2;
const MAX_PUSHES = 2;
const COOLDOWN_MS = 120_000;

function shouldAllowPush(): boolean {
  try {
    const views = parseInt(sessionStorage.getItem('_pg') || '0', 10);
    const pushes = parseInt(sessionStorage.getItem('_pp') || '0', 10);
    const lastTime = parseInt(sessionStorage.getItem('_pt') || '0', 10);
    if (views < MIN_VIEWS) return false;
    if (pushes >= MAX_PUSHES) return false;
    if (Date.now() - lastTime < COOLDOWN_MS) return false;
    return true;
  } catch { return false; }
}

function recordPushShown() {
  try {
    const pushes = parseInt(sessionStorage.getItem('_pp') || '0', 10);
    sessionStorage.setItem('_pp', String(pushes + 1));
    sessionStorage.setItem('_pt', String(Date.now()));
  } catch { /* ignore */ }
}

function isAdElement(el: HTMLElement): boolean {
  // Monetag injects elements directly into body with high z-index and fixed positioning.
  // They are NOT part of our React tree (which lives inside #__next or similar).
  if (el.parentElement !== document.body) return false;

  // Skip our own app elements
  const tag = el.tagName.toLowerCase();
  if (tag === 'script' || tag === 'link' || tag === 'style' || tag === 'meta' || tag === 'noscript') return false;
  if (el.id === '__next' || el.id === '__next-build-watcher') return false;
  if (el.hasAttribute('data-nextjs-scroll-focus-boundary')) return false;

  const style = window.getComputedStyle(el);
  const zIndex = parseInt(style.zIndex || '0', 10);
  const pos = style.position;

  // Fixed/absolute positioned with z-index > 1000 = almost certainly an ad overlay
  if ((pos === 'fixed' || pos === 'absolute') && zIndex > 1000) return true;

  // Also catch iframes injected directly into body (ad iframes)
  if (tag === 'iframe' && !el.id?.startsWith('_')) return true;

  return false;
}

function moveToLeft(el: HTMLElement) {
  // Force the element to the left side so it doesn't block nav/buttons on the right
  el.style.setProperty('right', 'auto', 'important');
  el.style.setProperty('left', '10px', 'important');
}

export default function AdFrequencyGuard() {
  useEffect(() => {
    // Track pageview
    try {
      const views = parseInt(sessionStorage.getItem('_pg') || '0', 10) + 1;
      sessionStorage.setItem('_pg', String(views));
    } catch { /* ignore */ }

    const isWritePage = window.location.pathname === '/write';
    let pushAllowed = !isWritePage && shouldAllowPush();
    let pushShownThisNav = false;

    function handleElement(el: HTMLElement) {
      if (!isAdElement(el)) return;

      if (isWritePage || !pushAllowed || pushShownThisNav) {
        // Remove — not allowed right now
        el.remove();
        return;
      }

      // Allow this one — move to left and record it
      moveToLeft(el);
      recordPushShown();
      pushShownThisNav = true;
      pushAllowed = false;
    }

    // Process any elements already in the DOM
    const existing = document.body.children;
    for (let i = 0; i < existing.length; i++) {
      const child = existing[i];
      if (child instanceof HTMLElement) handleElement(child);
    }

    // Watch for new elements
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.parentElement === document.body) {
            // Small delay to let the element get its styles
            requestAnimationFrame(() => handleElement(node));
          }
        }
      }
    });

    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
