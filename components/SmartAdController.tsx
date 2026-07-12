'use client';

import { useEffect } from 'react';

/**
 * AdFrequencyGuard — Controls Monetag In-Page Push notifications
 * 
 * Strategy: Monetag injects push notification elements directly into document.body
 * with obfuscated, dynamic class names. We can't target specific classes.
 * Instead, we watch ALL new direct children of body that aren't part of our 
 * React app (#__next) and treat them as ad injections.
 *
 * Rules:
 *  - First 2 pageviews: remove all injected ads
 *  - Max 2 push notifications per session
 *  - 2-minute cooldown between notifications
 *  - Always remove on /write page
 *  - Allowed notifications get moved to the LEFT side
 */

const MIN_VIEWS = 2;
const MAX_PUSHES = 2;
const COOLDOWN_MS = 120_000;

// Tags that are NOT ad injections (normal page elements)
const SAFE_TAGS = new Set(['script', 'link', 'style', 'meta', 'noscript', 'svg']);
// IDs that belong to our app or Next.js
const SAFE_IDS = new Set(['__next', '__next-build-watcher', '__next-route-announcer__']);

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

function isInjectedAdElement(el: HTMLElement): boolean {
  // Must be a direct child of body
  if (el.parentElement !== document.body) return false;
  
  const tag = el.tagName.toLowerCase();
  // Skip safe tags (scripts, styles, etc.)
  if (SAFE_TAGS.has(tag)) return false;
  // Skip our app elements
  if (el.id && SAFE_IDS.has(el.id)) return false;
  // Skip Next.js specific attributes
  if (el.hasAttribute('data-nextjs-scroll-focus-boundary')) return false;
  if (el.hasAttribute('data-next-hide-fouc')) return false;
  // Skip Grow.me widget (Mediavine)
  if (el.id?.startsWith('grow') || el.className?.toString().includes('grow')) return false;
  
  // Everything else injected directly into body is an ad
  // (Our React app lives inside #__next, nothing else should be a direct body child)
  return true;
}

function moveToLeft(el: HTMLElement) {
  // Force to left side so it doesn't block right-side navigation
  el.style.setProperty('right', 'auto', 'important');
  el.style.setProperty('left', '10px', 'important');
  
  // Also move any fixed-position children inside it
  const fixedChildren = el.querySelectorAll('*');
  fixedChildren.forEach(child => {
    if (child instanceof HTMLElement) {
      const style = window.getComputedStyle(child);
      if (style.position === 'fixed' || style.position === 'absolute') {
        child.style.setProperty('right', 'auto', 'important');
        child.style.setProperty('left', '10px', 'important');
      }
    }
  });
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
      if (!isInjectedAdElement(el)) return;

      if (isWritePage || !pushAllowed || pushShownThisNav) {
        el.remove();
        return;
      }

      // Allow this one — move to left and record
      moveToLeft(el);
      recordPushShown();
      pushShownThisNav = true;
      pushAllowed = false;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.parentElement !== document.body) continue;
          // Delay slightly to let element initialize its styles
          setTimeout(() => handleElement(node), 50);
        }
      }
    });

    observer.observe(document.body, { childList: true });

    // Also scan existing body children (in case ads loaded before this component mounted)
    requestAnimationFrame(() => {
      Array.from(document.body.children).forEach(child => {
        if (child instanceof HTMLElement) handleElement(child);
      });
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
