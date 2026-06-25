'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import CardRenderer from '@/components/cards/CardRenderer';
import type { Memory } from '@/lib/types';

const CARD_RATIO = 520 / 420;
const DEFAULT_OVERSCAN_ROWS = 3;
// Cards rendered as a plain, CSS-responsive grid for SSR and the first paint
// (before hydration), so the layout is correct on every device with no flash of
// squished/overlapping cards. The virtualizer takes over after mount for long lists.
const STATIC_RENDER_CAP = 30;

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
    const rect = node.getBoundingClientRect();
    const gridTopInViewport = rect.top;
    const viewportTopInGrid = -gridTopInViewport;
    const viewportBottomInGrid = viewportTopInGrid + window.innerHeight;
    const startRow = Math.max(
      0,
      Math.floor(viewportTopInGrid / nextMetrics.rowPitch) - overscanRows
    );
    const endRow = Math.min(
      rowCount,
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

  const visibleMemories = useMemo(
    () => memories.slice(startIndex, endIndex),
    [memories, startIndex, endIndex]
  );

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
      <div className="card-grid virtual-card-grid__items" style={gridStyle}>
        {visibleMemories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} animate={false} />
        ))}
      </div>
    </div>
  );
}
