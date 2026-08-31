'use client';

import { useEffect, useRef } from 'react';

interface BidVertiserAdProps {
  rows: number;
  cols?: number;
  imageWidth: number;
  mobileCols?: number;
  /** Unique suffix to prevent DOM id collisions when multiple ads are on one page */
  placement: string;
}

/**
 * BidVertiser Native Ad component.
 * Renders a native ad widget with the specified configuration.
 * Each instance must have a unique `placement` string.
 */
export default function BidVertiserAd({
  rows,
  cols = 1,
  imageWidth,
  mobileCols = 1,
  placement,
}: BidVertiserAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const container = containerRef.current;
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
  }, [rows, cols, imageWidth, mobileCols, placement]);

  return (
    <div
      ref={containerRef}
      className="bidvertiser-ad"
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 0',
      }}
    />
  );
}
