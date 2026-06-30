'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adsterra banner ad component with lazy-loading via IntersectionObserver.
 * Each variant maps to a specific Adsterra ad unit — only one instance per page.
 *
 * Variants:
 *  - 'rectangle'   → 300×250
 *  - 'leaderboard'  → 728×90  (hidden on mobile)
 *  - 'mobile'       → 320×50  (hidden on desktop)
 */

type AdVariant = 'rectangle' | 'leaderboard' | 'mobile';

interface AdConfig {
  key: string;
  width: number;
  height: number;
  src: string;
}

const AD_CONFIG: Record<AdVariant, AdConfig> = {
  rectangle: {
    key: 'c0a00a6cde20970d4da60a7e2f89e430',
    width: 300,
    height: 250,
    src: 'https://www.highperformanceformat.com/c0a00a6cde20970d4da60a7e2f89e430/invoke.js',
  },
  leaderboard: {
    key: '24e89e028dbbaafbf9241da97e5e7c06',
    width: 728,
    height: 90,
    src: 'https://www.highperformanceformat.com/24e89e028dbbaafbf9241da97e5e7c06/invoke.js',
  },
  mobile: {
    key: '0ebdaa6a199e71d87754eed6ef075b7f',
    width: 320,
    height: 50,
    src: 'https://www.highperformanceformat.com/0ebdaa6a199e71d87754eed6ef075b7f/invoke.js',
  },
};

export default function AdBanner({ variant }: { variant: AdVariant }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const config = AD_CONFIG[variant];

  useEffect(() => {
    const el = containerRef.current;
    if (!el || loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          // Inject the atOptions + script tag
          const optionsScript = document.createElement('script');
          optionsScript.textContent = `atOptions = ${JSON.stringify({
            key: config.key,
            format: 'iframe',
            height: config.height,
            width: config.width,
            params: {},
          })};`;
          el.appendChild(optionsScript);

          const invokeScript = document.createElement('script');
          invokeScript.src = config.src;
          invokeScript.async = true;
          el.appendChild(invokeScript);

          setLoaded(true);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded, config]);

  // Build CSS class for responsive visibility
  const visibilityClass =
    variant === 'leaderboard'
      ? 'ad-slot ad-slot--leaderboard'
      : variant === 'mobile'
        ? 'ad-slot ad-slot--mobile'
        : 'ad-slot ad-slot--rectangle';

  return (
    <aside
      className={visibilityClass}
      aria-label="Sponsored"
      style={{ minHeight: config.height }}
    >
      <span className="ad-slot__label">Sponsored</span>
      <div ref={containerRef} className="ad-slot__inner" />
    </aside>
  );
}

/**
 * Convenience component that renders BOTH the desktop leaderboard and mobile
 * banner in a single call. CSS handles showing only the correct one.
 */
export function AdResponsiveBanner() {
  return (
    <>
      <AdBanner variant="leaderboard" />
      <AdBanner variant="mobile" />
    </>
  );
}
