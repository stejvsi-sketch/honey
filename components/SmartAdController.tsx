'use client';

import { useEffect } from 'react';

/**
 * AdFrequencyGuard — Foolproof control for Monetag In-Page Push
 * 
 * Monetag's exact script stays inside <head> so verification passes 100%.
 * Once the script fetches and injects its DOM overlays / shadow roots, this guard:
 *  1. Intercepts any Shadow DOM (`attachShadow`) to ensure ads can't hide in closed roots.
 *  2. Scans the DOM & all shadow roots (via MutationObserver + 250ms interval) for ad cards.
 *  3. Forces any notification box from the RIGHT side (`right: 15px`) to the LEFT side (`left: 12px`).
 *  4. Enforces strict limits (1 per page load, max 2 per session, 2-min cooldown, 0 on /write).
 */

const MIN_VIEWS = 2;
const MAX_PUSHES = 2;
const COOLDOWN_MS = 120_000; // 2 minutes

// Global registry of shadow roots created on the page
if (typeof window !== 'undefined' && !(window as any)._adShadowIntercepted) {
  (window as any)._adShadowIntercepted = true;
  (window as any)._adShadowRoots = new Set<ShadowRoot>();

  const origAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadow = origAttachShadow.call(this, { ...init, mode: 'open' });
    (window as any)._adShadowRoots.add(shadow);
    return shadow;
  };
}

function getSessionInt(key: string): number {
  try {
    return parseInt(sessionStorage.getItem(key) || '0', 10);
  } catch {
    return 0;
  }
}

function setSessionInt(key: string, val: number) {
  try {
    sessionStorage.setItem(key, String(val));
  } catch { /* ignore */ }
}

function shouldAllowPush(): boolean {
  try {
    if (window.location.pathname === '/write') return false;
    const views = getSessionInt('_pg');
    const pushes = getSessionInt('_pp');
    const lastTime = getSessionInt('_pt');

    if (views < MIN_VIEWS) return false;
    if (pushes >= MAX_PUSHES) return false;
    if (Date.now() - lastTime < COOLDOWN_MS) return false;
    return true;
  } catch {
    return false;
  }
}

function recordPushShown() {
  const pushes = getSessionInt('_pp');
  setSessionInt('_pp', pushes + 1);
  setSessionInt('_pt', Date.now());
}

/**
 * Check if an element or node is our React app or core site infrastructure
 */
function isOurAppElement(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return true;
  const tag = el.tagName.toLowerCase();
  if (['script', 'link', 'style', 'meta', 'noscript', 'header', 'nav', 'footer', 'main'].includes(tag)) return true;
  if (el.id === '__next' || el.id === '__next-build-watcher' || el.id === 'navigation' || el.id === 'footer') return true;
  if (el.closest('nav, header, footer, main, #__next')) return true;
  if (el.hasAttribute('data-nextjs-scroll-focus-boundary')) return true;
  return false;
}

/**
 * Force an element (and its container) to stick to the LEFT side instead of the right
 */
function enforceLeftSide(el: HTMLElement) {
  el.style.setProperty('right', 'auto', 'important');
  el.style.setProperty('left', '12px', 'important');
  el.style.setProperty('margin-left', '0px', 'important');
  el.style.setProperty('margin-right', 'auto', 'important');
  el.style.setProperty('float', 'left', 'important');
  el.style.setProperty('transform', 'none', 'important');

  // If parent uses flex or grid alignment on the right, force it left
  const parent = el.parentElement;
  if (parent && parent !== document.body) {
    parent.style.setProperty('justify-content', 'flex-start', 'important');
    parent.style.setProperty('align-items', 'flex-start', 'important');
    parent.style.setProperty('right', 'auto', 'important');
    parent.style.setProperty('left', '0px', 'important');
  }
}

export default function AdFrequencyGuard() {
  useEffect(() => {
    // Increment pageview count
    const views = getSessionInt('_pg') + 1;
    setSessionInt('_pg', views);

    const isWritePage = window.location.pathname === '/write';
    let pushAllowed = !isWritePage && shouldAllowPush();
    let activePushesThisNav = 0;

    function scanAndProcessNode(node: Element, inShadow = false) {
      if (!inShadow && isOurAppElement(node)) return;
      if (!(node instanceof HTMLElement)) return;

      const style = window.getComputedStyle(node);
      const zIndex = parseInt(style.zIndex || '0', 10);
      const pos = style.position;

      // Check bounding rect to catch ad cards rendered on screen
      const rect = node.getBoundingClientRect();
      const isVisibleBox = rect.width > 60 && rect.height > 35 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      const isFixedOrAbsolute = pos === 'fixed' || pos === 'absolute' || zIndex > 1000;
      const isOnRightSide = rect.left > window.innerWidth * 0.35 && rect.width < window.innerWidth * 0.9;

      // If it's a fixed overlay, or an iframe, or an ad box rendered on the right half of screen
      const isAdBox = (isFixedOrAbsolute && isVisibleBox && (isOnRightSide || zIndex > 500)) ||
                      (node.tagName.toLowerCase() === 'iframe' && !node.id?.startsWith('_'));

      if (isAdBox) {
        if (isWritePage || !pushAllowed || activePushesThisNav >= 1) {
          // Limit exceeded or on /write page -> remove immediately
          node.remove();
          return;
        }

        // We allow exactly 1 push -> move to LEFT and count it
        enforceLeftSide(node);
        if (activePushesThisNav === 0) {
          activePushesThisNav = 1;
          pushAllowed = false;
          recordPushShown();
        }
      }

      // Check children
      const children = Array.from(node.children);
      for (let i = 0; i < children.length; i++) {
        scanAndProcessNode(children[i], inShadow);
      }

      // Check shadow root if present on this element
      if (node.shadowRoot) {
        const shadowChildren = Array.from(node.shadowRoot.children);
        for (let i = 0; i < shadowChildren.length; i++) {
          scanAndProcessNode(shadowChildren[i], true);
        }
      }
    }

    function runFullScan() {
      // 1. Scan direct body children outside our app
      const bodyChildren = Array.from(document.body.children);
      for (let i = 0; i < bodyChildren.length; i++) {
        const child = bodyChildren[i];
        if (!isOurAppElement(child)) {
          scanAndProcessNode(child, false);
        }
      }

      // 2. Scan all registered shadow roots from attached ads
      const shadowRoots: Set<ShadowRoot> = (window as any)._adShadowRoots || new Set();
      shadowRoots.forEach((shadow) => {
        const shadowChildren = Array.from(shadow.children);
        for (let i = 0; i < shadowChildren.length; i++) {
          scanAndProcessNode(shadowChildren[i], true);
        }
      });
    }

    // Run initial scan & set periodic check every 250ms (beats delayed async injections)
    runFullScan();
    const intervalId = setInterval(runFullScan, 250);

    // Watch DOM mutations across the entire body subtree
    const observer = new MutationObserver(() => {
      runFullScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  return null;
}
