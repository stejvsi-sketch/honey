'use client';

import { useEffect, useRef } from 'react';

/**
 * Adcash 300×250 Display Banner.
 *
 * Adcash's runBanner() finds the ad container via the calling script's
 * parentElement, so we must inject a real <script> tag inside the div
 * rather than calling aclib.runBanner() from a React effect.
 */
export default function AdcashBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || injected.current) return;
    injected.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          // Inject the script exactly as Adcash docs specify —
          // inside the parent div so runBanner can find parentElement.
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
