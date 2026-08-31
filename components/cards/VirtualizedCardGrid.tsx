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

// Insert an ad after every AD_INTERVAL cards
const AD_INTERVAL = 6;
// Fixed height for ad slots (label + content + dividers + padding)
const AD_SLOT_HEIGHT = 220;

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
 * Given a card row index, returns the number of ad slots above it.
 * Ads appear after every `cardRowsPerBlock` card rows.
 */
function adsAboveRow(cardRow: number, cardRowsPerBlock: number, maxAds: number): number {
  if (cardRowsPerBlock <= 0) return 0;
  return Math.min(Math.floor(cardRow / cardRowsPerBlock), maxAds);
}

/**
 * Returns the Y pixel position for a given card row, accounting for ad slots above.
 */
function getCardRowY(cardRow: number, metrics: GridMetrics, cardRowsPerBlock: number, maxAds: number): number {
  const ads = adsAboveRow(cardRow, cardRowsPerBlock, maxAds);
  return cardRow * metrics.rowPitch + ads * (AD_SLOT_HEIGHT + metrics.gap);
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
    columns: 3,
    gap: 40,
    cardHeight: 520,
    rowPitch: 560,
  });
  const [range, setRange] = useState<VisibleRange>({ startRow: 0, endRow: 4 });

  // How many card rows fit between ads
  const cardRowsPerBlock = useMemo(
    () => Math.ceil(AD_INTERVAL / metrics.columns),
    [metrics.columns]
  );
  // Total number of ad slots
  const totalAds = useMemo(
    () => memories.length >= AD_INTERVAL ? Math.floor(memories.length / AD_INTERVAL) : 0,
    [memories.length]
  );

  const updateVisibleRange = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    const nextMetrics = getGridMetrics(node.clientWidth);
    const rowCount = Math.ceil(memories.length / nextMetrics.columns);
    const nextCardRowsPerBlock = Math.ceil(AD_INTERVAL / nextMetrics.columns);
    const nextTotalAds = memories.length >= AD_INTERVAL ? Math.floor(memories.length / AD_INTERVAL) : 0;

    // Use ad-aware Y calculation for viewport mapping
    const rect = node.getBoundingClientRect();
    const viewportTopInGrid = -rect.top;
    const viewportBottomInGrid = viewportTopInGrid + window.innerHeight;

    // Binary-ish search: find which card rows are visible
    // (account for ads shifting rows down)
    let startRow = 0;
    for (let r = 0; r < rowCount; r++) {
      if (getCardRowY(r + 1, nextMetrics, nextCardRowsPerBlock, nextTotalAds) > viewportTopInGrid) {
        startRow = r;
        break;
      }
    }
    startRow = Math.max(0, startRow - overscanRows);

    let endRow = rowCount;
    for (let r = startRow; r < rowCount; r++) {
      if (getCardRowY(r, nextMetrics, nextCardRowsPerBlock, nextTotalAds) > viewportBottomInGrid) {
        endRow = r;
        break;
      }
    }
    endRow = Math.min(rowCount, endRow + overscanRows);

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

  // Derived layout values
  const rowCount = Math.ceil(memories.length / metrics.columns);
  const startRow = Math.min(range.startRow, Math.max(0, rowCount - 1));
  const endRow = Math.min(Math.max(range.endRow, startRow + 1), rowCount);
  const startIndex = startRow * metrics.columns;
  const endIndex = Math.min(memories.length, endRow * metrics.columns);

  // Ad-aware positioning
  const topOffset = getCardRowY(startRow, metrics, cardRowsPerBlock, totalAds);
  const lastRowIndex = Math.max(0, rowCount - 1);
  const totalHeight = rowCount > 0
    ? getCardRowY(lastRowIndex, metrics, cardRowsPerBlock, totalAds) + metrics.cardHeight
    : 0;

  const visibleMemories = useMemo(
    () => memories.slice(startIndex, endIndex),
    [memories, startIndex, endIndex]
  );

  // Find which ad slots fall within the visible pixel range
  const visibleAdSlots = useMemo(() => {
    const slots: { adIndex: number; yPosition: number }[] = [];
    for (let k = 0; k < totalAds; k++) {
      // Ad k appears after card-row-block k (i.e., after row (k+1)*cardRowsPerBlock - 1)
      const lastRowInBlock = (k + 1) * cardRowsPerBlock - 1;
      if (lastRowInBlock < startRow - overscanRows || lastRowInBlock > endRow + overscanRows) continue;

      // Y = bottom of the last card row in this block + gap
      const y = getCardRowY(lastRowInBlock, metrics, cardRowsPerBlock, totalAds)
        + metrics.cardHeight + metrics.gap;
      slots.push({ adIndex: k, yPosition: y });
    }
    return slots;
  }, [totalAds, cardRowsPerBlock, startRow, endRow, overscanRows, metrics]);

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

  // SSR / first paint / no-JS: a plain responsive grid
  if (!mounted) {
    return (
      <div className="card-grid">
        {memories.slice(0, STATIC_RENDER_CAP).map(memory => (
          <CardRenderer key={memory.id} memory={memory} animate={false} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="virtual-card-grid"
      style={{ height: totalHeight }}
    >
      {/* Card grid — absolutely positioned, pure cards only */}
      <div className="card-grid virtual-card-grid__items" style={gridStyle}>
        {visibleMemories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} animate={false} />
        ))}
      </div>

      {/* Ad slots — absolutely positioned independently, no grid interference */}
      {visibleAdSlots.map(({ adIndex, yPosition }) => (
        <div
          key={`ad-slot-${adIndex}`}
          style={{
            position: 'absolute',
            top: yPosition,
            left: 0,
            right: 0,
            height: AD_SLOT_HEIGHT,
          }}
        >
          <BidVertiserAd
            rows={1}
            imageWidth={250}
            placement={`archive-${adIndex}`}
            variant="infeed"
          />
        </div>
      ))}
    </div>
  );
}
