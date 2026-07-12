'use client';

import { useEffect } from 'react';

/**
 * AdFrequencyGuard — DOM-level frequency control for Monetag In-Page Push
 * 
 * The exact Monetag script stays in <head> (required for verification).
 * This component watches the DOM and REMOVES push notification elements 
 * if the user hasn't earned them yet.
 *
 * Rules:
 *  - First 2 pageviews: no push notifications (let user engage first)
 *  - Max 2 push notifications per session
 *  - 2-minute cooldown between notifications
 *  - Never on /write page
 */

const MIN_VIEWS = 2;
const MAX_PUSHES = 2;
const COOLDOWN_MS = 120_000; // 2 minutes

function shouldAllowPush(): boolean {
  const views = parseInt(sessionStorage.getItem('_pg') || '0', 10);
  const pushes = parseInt(sessionStorage.getItem('_pp') || '0', 10);
  const lastTime = parseInt(sessionStorage.getItem('_pt') || '0', 10);

  if (views < MIN_VIEWS) return false;
  if (pushes >= MAX_PUSHES) return false;
  if (Date.now() - lastTime < COOLDOWN_MS) return false;

  return true;
}

function recordPushShown() {
  const pushes = parseInt(sessionStorage.getItem('_pp') || '0', 10);
  sessionStorage.setItem('_pp', String(pushes + 1));
  sessionStorage.setItem('_pt', String(Date.now()));
}

function isPushNotification(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const style = el.style;
  // Monetag push notifications are fixed-position overlays with very high z-index
  if (style.position === 'fixed' && parseInt(style.zIndex || '0') > 9000) return true;
  // Also check computed style for elements without inline styles
  try {
    const computed = window.getComputedStyle(el);
    if (computed.position === 'fixed' && parseInt(computed.zIndex || '0') > 9000) {
      // Exclude our own site elements (nav, footer, etc.)
      if (el.closest('nav') || el.closest('footer') || el.closest('header')) return false;
      if (el.id && ['navigation', 'footer', 'cookie'].some(k => el.id.toLowerCase().includes(k))) return false;
      return true;
    }
  } catch { /* ignore */ }
  return false;
}

export default function AdFrequencyGuard() {
  useEffect(() => {
    // Track pageview
    const views = parseInt(sessionStorage.getItem('_pg') || '0', 10) + 1;
    sessionStorage.setItem('_pg', String(views));

    // Skip on /write
    if (window.location.pathname === '/write') {
      // On write page, remove ALL push notifications
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement && isPushNotification(node)) {
              node.remove();
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    let pushAllowed = shouldAllowPush();
    let pushRecorded = false;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && isPushNotification(node)) {
            if (!pushAllowed) {
              // Remove it — user hasn't earned it yet
              node.remove();
            } else if (!pushRecorded) {
              // First push this navigation — allow it and record
              recordPushShown();
              pushRecorded = true;
              pushAllowed = false; // No more this navigation
            } else {
              // Already showed one this navigation — remove extras
              node.remove();
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
