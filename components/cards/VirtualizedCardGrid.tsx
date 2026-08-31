'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import BidVertiserAd from '@/components/BidVertiserAd';
import type { Memory } from '@/lib/types';

const CARD_RATIO = 520 / 420;
const DEFAULT_OVERSCAN_ROWS = 3;
// Cards rendered as a plain, CSS-responsive grid for SSR and the first paint
// (before hydration), so the layout is correct on every device with no flash of
// squished/overlapping cards. The virtualizer takes over after mount for long lists.
const STATIC_RENDER_CAP = 30;

// Show an in-feed ad after every N cards (tuned per breakpoint)
const AD_INTERVAL = 6;
// Estimated ad container height (label + content + padding)
const AD_ROW_HEIGHT = 200;

// Stable no-op subscribe for useSyncExternalStore (the mount flag never changes).
const subscribeNoop = () => () => {};

interface GridMetrics {
  columns: number;
  gap: number;
  cardHeight: number;
  rowPitch: number;
}

interface VisibleRange {
  startRow: number;
  endRow: number;
}

function getGridMetrics(containerWidth: number): GridMetrics {
  const viewportWidth = window.innerWidth;
  const columns = viewportWidth <= 640 ? 1 : viewportWidth <= 1024 ? 2 : 3;
  const gap = viewportWidth <= 640 ? 24 : viewportWidth <= 1024 ? 32 : 40;
  const cardMaxWidth = viewportWidth <= 767 ? 340 : viewportWidth <= 1023 ? 320 : 420;
  const columnWidth = Math.max(0, (containerWidth - gap * (columns - 1)) / columns);
  const cardWidth = Math.min(columnWidth, cardMaxWidth);
  const cardHeight = cardWidth * CARD_RATIO;

  return {
    columns,
    gap,
    cardHeight,
    rowPitch: cardHeight + gap,
  };
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
 * Builds a mixed list of cards and ad slots.
 * An ad is inserted after every AD_INTERVAL cards.
 */
type GridItem = { type: 'card'; memory: Memory } | { type: 'ad'; index: number };

function buildGridItems(memories: Memory[]): GridItem[] {
  const items: GridItem[] = [];
  let adIndex = 0;
  for (let i = 0; i < memories.length; i++) {
    items.push({ type: 'card', memory: memories[i] });
    if ((i + 1) % AD_INTERVAL === 0 && i < memories.length - 1) {
      items.push({ type: 'ad', index: adIndex++ });
    }
  }
  return items;
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
  // `mounted` is false during SSR and the first hydration render (so the static
  // grid matches the server), then true on the client — without setState-in-effect.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [metrics, setMetrics] = useState<GridMetrics>({
    columns: 3,
    gap: 40,
    cardHeight: 520,
    rowPitch: 560,
  });
  const [range, setRange] = useState<VisibleRange>({ startRow: 0, endRow: 4 });

  const updateVisibleRange = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    const nextMetrics = getGridMetrics(node.clientWidth);
    const rowCount = Math.ceil(memories.length / nextMetrics.columns);
    // Account for ad rows inserted between card rows
    const adRows = Math.floor(memories.length / AD_INTERVAL);
    const totalLogicalRows = rowCount + adRows;

    const rect = node.getBoundingClientRect();
    const gridTopInViewport = rect.top;
    const viewportTopInGrid = -gridTopInViewport;
    const viewportBottomInGrid = viewportTopInGrid + window.innerHeight;
    const startRow = Math.max(
      0,
      Math.floor(viewportTopInGrid / nextMetrics.rowPitch) - overscanRows
    );
    const endRow = Math.min(
      totalLogicalRows,
      Math.max(startRow + 1, Math.ceil(viewportBottomInGrid / nextMetrics.rowPitch) + overscanRows)
    );

    setMetrics(prev => sameMetrics(prev, nextMetrics) ? prev : nextMetrics);
    setRange(prev => (
      prev.startRow === startRow && prev.endRow === endRow
        ? prev
        : { startRow, endRow }
    ));
  }, [memories.length, overscanRows]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateVisibleRange();
    });
  }, [updateVisibleRange]);

  // Render the static SSR grid first, then switch to the virtualizer after mount.
  useLayoutEffect(() => {
    if (!mounted) return;
    updateVisibleRange();
  }, [mounted, updateVisibleRange]);

  useEffect(() => {
    if (!mounted) return;
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleUpdate);

    resizeObserver?.observe(node);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [mounted, scheduleUpdate]);

  const rowCount = Math.ceil(memories.length / metrics.columns);
  const startRow = Math.min(range.startRow, Math.max(0, rowCount - 1));
  const endRow = Math.min(Math.max(range.endRow, startRow + 1), rowCount);
  const startIndex = startRow * metrics.columns;
  const endIndex = Math.min(memories.length, endRow * metrics.columns);
  const topOffset = startRow * metrics.rowPitch;
  const totalHeight = rowCount > 0
    ? rowCount * metrics.cardHeight + Math.max(0, rowCount - 1) * metrics.gap
    : 0;

  // Calculate total height including ad rows
  const cardsPerAdBlock = AD_INTERVAL;
  const cardRowsPerBlock = Math.ceil(cardsPerAdBlock / metrics.columns);
  const adBlockCount = Math.floor(memories.length / AD_INTERVAL);
  const extraAdHeight = adBlockCount * (AD_ROW_HEIGHT + metrics.gap);

  const visibleMemories = useMemo(
    () => memories.slice(startIndex, endIndex),
    [memories, startIndex, endIndex]
  );

  // Determine which ad slots should appear in the visible range
  const visibleAds = useMemo(() => {
    const ads: { adIndex: number; afterCardIndex: number }[] = [];
    for (let i = 0; i < adBlockCount; i++) {
      const afterCardIndex = (i + 1) * AD_INTERVAL - 1;
      const afterRow = Math.floor(afterCardIndex / metrics.columns);
      if (afterRow >= startRow && afterRow <= endRow) {
        ads.push({ adIndex: i, afterCardIndex });
      }
    }
    return ads;
  }, [adBlockCount, metrics.columns, startRow, endRow]);

  const gridStyle: CSSProperties = {
    position: 'absolute',
    top: topOffset,
    left: 0,
    right: 0,
    display: 'grid',
    gridTemplateColumns: `repeat(${metrics.columns}, minmax(0, 1fr))`,
    gap: metrics.gap,
    justifyItems: 'center',
  };

  // SSR / first paint / no-JS: a plain responsive grid whose columns come from CSS
  // media queries, so it lays out correctly on every device with zero shift.
  if (!mounted) {
    const ssrItems = memories.slice(0, STATIC_RENDER_CAP);
    return (
      <div className="card-grid">
        {ssrItems.map((memory, i) => (
          <CardRenderer key={memory.id} memory={memory} animate={false} />
        ))}
      </div>
    );
  }

  // Build the visible items with ads injected between card rows
  const renderItems: React.ReactNode[] = [];
  let adInsertedAfterRows = new Set<number>();
  visibleAds.forEach(({ adIndex, afterCardIndex }) => {
    adInsertedAfterRows.add(Math.floor(afterCardIndex / metrics.columns));
  });

  visibleMemories.forEach((memory, i) => {
    const globalIndex = startIndex + i;
    renderItems.push(
      <CardRenderer key={memory.id} memory={memory} animate={false} />
    );

    // Check if we need to insert an ad after this card's row
    const currentRow = Math.floor(globalIndex / metrics.columns);
    const isLastInRow = (globalIndex + 1) % metrics.columns === 0 || globalIndex === memories.length - 1;

    if (isLastInRow && (globalIndex + 1) % AD_INTERVAL === 0 && globalIndex < memories.length - 1) {
      renderItems.push(
        <BidVertiserAd
          key={`ad-archive-${globalIndex}`}
          rows={1}
          imageWidth={200}
          placement={`archive-${globalIndex}`}
          variant="infeed"
        />
      );
    }
  });

  return (
    <div
      ref={containerRef}
      className="virtual-card-grid"
      style={{ height: totalHeight + extraAdHeight }}
    >
      <div className="card-grid virtual-card-grid__items" style={gridStyle}>
        {renderItems}
      </div>
    </div>
  );
}
