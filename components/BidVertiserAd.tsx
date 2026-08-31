'use client';

import { useEffect, useRef, useState } from 'react';

interface BidVertiserAdProps {
  rows: number;
  cols?: number;
  imageWidth: number;
  mobileCols?: number;
  /** Unique suffix to prevent DOM id collisions when multiple ads are on one page */
  placement: string;
  /** Optional CSS variant: 'infeed' for card grid inserts, 'letter' for letter pages */
  variant?: 'infeed' | 'letter';
}

/**
 * BidVertiser Native Ad component.
 * Renders a native ad widget inside a premium-styled container with
 * a subtle "Advertisement" label matching the site's design language.
 */
export default function BidVertiserAd({
  rows,
  cols = 1,
  imageWidth,
  mobileCols = 1,
  placement,
  variant,
}: BidVertiserAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (loaded.current || !adRef.current) return;
    loaded.current = true;

    const container = adRef.current;
    const cb = Date.now();
    const widgetId = `ntv_2106767_${placement}_${cb}`;
    container.id = widgetId;

    const params: Record<string, string | number> = {
      bvwidgetid: widgetId,
      bvlinksownid: 2106767,
      rows,
      cols,
      textpos: 'below',
      imagewidth: imageWidth,
      mobilecols: mobileCols,
      cb,
    };

    const qs = Object.keys(params)
      .map((k) => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://cdn.hyperpromote.com/bidvertiser/tags/active/bdvws.js?${qs}`;
    container.appendChild(s);

    // Mark loaded after a short delay to fade in
    const timer = setTimeout(() => setAdLoaded(true), 800);
    return () => clearTimeout(timer);
  }, [rows, cols, imageWidth, mobileCols, placement]);

  const className = [
    'ad-container',
    variant === 'infeed' && 'ad-container--infeed',
    variant === 'letter' && 'ad-container--letter',
    adLoaded && 'ad-container--loaded',
  ].filter(Boolean).join(' ');

  return (
    <aside className={className} aria-label="Advertisement">
      <div className="ad-container__divider" />
      <span className="ad-container__label">— Advertisement —</span>
      <div ref={adRef} className="ad-container__content" />
      <div className="ad-container__divider" />
    </aside>
  );
}
