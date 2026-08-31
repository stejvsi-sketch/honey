'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import BidVertiserAd from '@/components/BidVertiserAd';
import type { Memory } from '@/lib/types';

const CARD_RATIO = 520 / 420;
const DEFAULT_OVERSCAN_ROWS = 3;
const STATIC_RENDER_CAP = 30;

// Insert an ad after every AD_INTERVAL cards
const AD_INTERVAL = 6;
// Fixed pixel height reserved for each ad slot
const AD_SLOT_HEIGHT = 220;

const subscribeNoop = () => () => {};

interface GridMetrics {
  columns: number;
  gap: number;
  cardHeight: number;
  rowPitch: number;    // cardHeight + gap
}

interface VisibleRange {
  startRow: number;
  endRow: number;
}

function getGridMetrics(containerWidth: number): GridMetrics {
  const vw = window.innerWidth;
  const columns = vw <= 640 ? 1 : vw <= 1024 ? 2 : 3;
  const gap = vw <= 640 ? 24 : vw <= 1024 ? 32 : 40;
  const cardMaxW = vw <= 767 ? 340 : vw <= 1023 ? 320 : 420;
  const colW = Math.max(0, (containerWidth - gap * (columns - 1)) / columns);
  const cardW = Math.min(colW, cardMaxW);
  const cardHeight = cardW * CARD_RATIO;
  return { columns, gap, cardHeight, rowPitch: cardHeight + gap };
}

function sameMetrics(a: GridMetrics, b: GridMetrics): boolean {
  return (
    a.columns === b.columns &&
    a.gap === b.gap &&
    Math.abs(a.cardHeight - b.cardHeight) < 0.5 &&
    Math.abs(a.rowPitch - b.rowPitch) < 0.5
  );
}

/**
 * Returns the absolute Y position for a card row, accounting for ad slots above.
 * Ad slots are inserted every `crpb` (cardRowsPerBlock) card rows.
 */
function getRowY(row: number, m: GridMetrics, crpb: number, maxAds: number): number {
  const ads = Math.min(Math.floor(row / crpb), maxAds);
  return row * m.rowPitch + ads * (AD_SLOT_HEIGHT + m.gap);
}

export default function VirtualizedCardGrid({
  memories,
  overscanRows = DEFAULT_OVERSCAN_ROWS,
}: {
  memories: Memory[];
  overscanRows?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [metrics, setMetrics] = useState<GridMetrics>({
    columns: 3, gap: 40, cardHeight: 520, rowPitch: 560,
  });
  const [range, setRange] = useState<VisibleRange>({ startRow: 0, endRow: 4 });

  const rowCount = Math.ceil(memories.length / metrics.columns);
  const crpb = Math.ceil(AD_INTERVAL / metrics.columns);       // card rows per ad-block
  const totalAds = memories.length >= AD_INTERVAL
    ? Math.floor(memories.length / AD_INTERVAL) : 0;

  // --- visible-range update ---
  const updateVisibleRange = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    const m = getGridMetrics(node.clientWidth);
    const rc = Math.ceil(memories.length / m.columns);
    const c = Math.ceil(AD_INTERVAL / m.columns);
    const ta = memories.length >= AD_INTERVAL ? Math.floor(memories.length / AD_INTERVAL) : 0;

    const rect = node.getBoundingClientRect();
    const vpTop = -rect.top;
    const vpBot = vpTop + window.innerHeight;

    // Find first visible row
    let sr = 0;
    for (let r = 0; r < rc; r++) {
      if (getRowY(r + 1, m, c, ta) > vpTop) { sr = r; break; }
    }
    sr = Math.max(0, sr - overscanRows);

    // Find last visible row
    let er = rc;
    for (let r = sr; r < rc; r++) {
      if (getRowY(r, m, c, ta) > vpBot) { er = r; break; }
    }
    er = Math.min(rc, er + overscanRows);

    setMetrics(prev => sameMetrics(prev, m) ? prev : m);
    setRange(prev =>
      prev.startRow === sr && prev.endRow === er ? prev : { startRow: sr, endRow: er }
    );
  }, [memories.length, overscanRows]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      updateVisibleRange();
    });
  }, [updateVisibleRange]);

  useLayoutEffect(() => { if (mounted) updateVisibleRange(); }, [mounted, updateVisibleRange]);

  useEffect(() => {
    if (!mounted) return;
    const node = containerRef.current;
    if (!node) return;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleUpdate) : null;
    ro?.observe(node);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();
    return () => {
      ro?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [mounted, scheduleUpdate]);

  // --- total height ---
  const lastRow = Math.max(0, rowCount - 1);
  const totalHeight = rowCount > 0
    ? getRowY(lastRow, metrics, crpb, totalAds) + metrics.cardHeight
    : 0;

  // --- clipped visible range ---
  const startRow = Math.min(range.startRow, Math.max(0, rowCount - 1));
  const endRow = Math.min(Math.max(range.endRow, startRow + 1), rowCount);

  // --- SSR / first paint ---
  if (!mounted) {
    return (
      <div className="card-grid">
        {memories.slice(0, STATIC_RENDER_CAP).map(m => (
          <CardRenderer key={m.id} memory={m} animate={false} />
        ))}
      </div>
    );
  }

  // --- Build render chunks: split cards at ad boundaries ---
  const firstSec = Math.floor(startRow / crpb);
  const lastSec = Math.floor(Math.max(0, endRow - 1) / crpb);
  const chunks: React.ReactNode[] = [];

  for (let sec = firstSec; sec <= lastSec; sec++) {
    // Card rows in this section
    const secFirst = sec * crpb;
    const secLast = Math.min((sec + 1) * crpb, rowCount);

    // Clip to visible range
    const visFirst = Math.max(secFirst, startRow);
    const visLast = Math.min(secLast, endRow);
    if (visFirst >= visLast) continue;

    // Slice memories for this chunk
    const si = visFirst * metrics.columns;
    const ei = Math.min(memories.length, visLast * metrics.columns);
    const chunk = memories.slice(si, ei);
    if (chunk.length === 0) continue;

    const chunkY = getRowY(visFirst, metrics, crpb, totalAds);
    const style: CSSProperties = {
      position: 'absolute',
      top: chunkY,
      left: 0,
      right: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${metrics.columns}, minmax(0, 1fr))`,
      gap: metrics.gap,
      justifyItems: 'center',
    };

    chunks.push(
      <div key={`sec-${sec}`} className="card-grid virtual-card-grid__items" style={style}>
        {chunk.map(m => <CardRenderer key={m.id} memory={m} animate={false} />)}
      </div>
    );

    // Ad after this section (if within total ad count)
    if (sec < totalAds) {
      const adY = getRowY(secLast - 1, metrics, crpb, totalAds)
        + metrics.cardHeight + metrics.gap;

      chunks.push(
        <div
          key={`ad-${sec}`}
          style={{
            position: 'absolute',
            top: adY,
            left: 0,
            right: 0,
            height: AD_SLOT_HEIGHT,
          }}
        >
          <BidVertiserAd
            rows={1}
            imageWidth={250}
            placement={`archive-${sec}`}
            variant="infeed"
          />
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className="virtual-card-grid"
      style={{ height: totalHeight }}
    >
      {chunks}
    </div>
  );
}
