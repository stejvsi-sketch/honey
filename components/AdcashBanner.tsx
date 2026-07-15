'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adcash 300×250 Display Banner.
 *
 * Styled as a clearly-labeled, premium ad slot that users can identify
 * and skip. Clear labeling protects against Google ad-policy penalties.
 *
 * Adcash's runBanner() finds the ad container via the calling script's
 * parentElement, so we inject a real <script> tag inside the div.
 */
export default function AdcashBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || injected.current) return;
    injected.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.textContent = `aclib.runBanner({ zoneId: '11722342' });`;
          el.appendChild(script);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Advertisement"
      style={{
        position: 'relative',
        margin: '48px auto',
        maxWidth: '336px',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius)',
        background: 'rgba(255, 255, 255, 0.25)',
        overflow: 'hidden',
      }}
    >
      {/* Top bar — label + dismiss */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid var(--border-light)',
          background: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <span
          style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'var(--text-faint)',
            opacity: 0.7,
          }}
        >
          Advertisement
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss advertisement"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.7rem',
            color: 'var(--text-faint)',
            opacity: 0.5,
            padding: '2px 4px',
            lineHeight: 1,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; }}
        >
          ✕
        </button>
      </div>

      {/* Ad container */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '250px',
          padding: '12px',
        }}
      />
    </aside>
  );
}
