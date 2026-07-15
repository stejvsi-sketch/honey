'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adcash 300×250 Display Banner — lazy-loaded via IntersectionObserver.
 * Renders inside its parent div; aclib.runBanner() targets the container.
 * Only loads when the slot scrolls into view (200px margin).
 */
export default function AdcashBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          // Wait for aclib to be available, then run banner
          const tryRun = () => {
            if (typeof window !== 'undefined' && (window as any).aclib) {
              (window as any).aclib.runBanner({ zoneId: '11721690' });
            } else {
              // aclib not loaded yet — retry in 500ms
              setTimeout(tryRun, 500);
            }
          };
          tryRun();
          setLoaded(true);
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <aside
      aria-label="Sponsored"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '48px auto',
        maxWidth: '300px',
        minHeight: '250px',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: 'var(--text-faint)',
          marginBottom: '8px',
          textAlign: 'center' as const,
          opacity: 0.6,
        }}
      >
        Sponsored
      </span>
      <div ref={containerRef} style={{ width: '300px', minHeight: '250px' }} />
    </aside>
  );
}
