'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adsterra Native Banner component — lazy-loaded via IntersectionObserver.
 * Renders the effectivecpmnetwork native ad widget.
 * Should only be used once per page.
 */
export default function AdNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || loaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          // Create the container div that Adsterra targets
          const adDiv = document.createElement('div');
          adDiv.id = 'container-3af113a497d05b87ffa4e9e06fcf7baf';
          el.appendChild(adDiv);

          // Inject the invoke script
          const script = document.createElement('script');
          script.src =
            'https://pl30144951.effectivecpmnetwork.com/3af113a497d05b87ffa4e9e06fcf7baf/invoke.js';
          script.async = true;
          script.setAttribute('data-cfasync', 'false');
          el.appendChild(script);

          setLoaded(true);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  return (
    <aside className="ad-slot ad-slot--native" aria-label="Sponsored content">
      <span className="ad-slot__label">You Might Also Like</span>
      <div ref={containerRef} className="ad-slot__inner" />
    </aside>
  );
}
