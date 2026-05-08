'use client';

import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, PointerEvent, ReactNode } from 'react';
import type { Memory } from '@/lib/types';

const LONG_PRESS_MS = 650;
const MOVE_TOLERANCE = 12;
const DOWNLOAD_DEDUPE_MS = 1400;

function makeFileName(memory: Memory): string {
  const name = memory.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'letter';

  return `honey-if-only-${name}-${memory.id.slice(0, 8)}.png`;
}

export default function CardDownloadSurface({
  memory,
  className,
  style,
  children,
  itemScope,
  itemType,
}: {
  memory: Memory;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
  itemScope?: boolean;
  itemType?: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastDownloadRef = useRef(0);
  const longPressTriggeredRef = useRef(false);

  function clearLongPress() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPointRef.current = null;
  }

  async function downloadCard(mode: 'fetch' | 'navigate' = 'fetch') {
    const now = Date.now();
    if (downloading || now - lastDownloadRef.current < DOWNLOAD_DEDUPE_MS) return;

    lastDownloadRef.current = now;
    const imageUrl = `/api/card-image/${encodeURIComponent(memory.id)}?download=1`;

    if (mode === 'navigate') {
      window.location.href = imageUrl;
      return;
    }

    setDownloading(true);

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to prepare card image');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = makeFileName(memory);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    clearLongPress();
    void downloadCard();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') return;

    startPointRef.current = { x: event.clientX, y: event.clientY };
    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      timerRef.current = null;
      void downloadCard('navigate');
    }, LONG_PRESS_MS);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const startPoint = startPointRef.current;
    if (!startPoint) return;

    const deltaX = Math.abs(event.clientX - startPoint.x);
    const deltaY = Math.abs(event.clientY - startPoint.y);
    if (deltaX > MOVE_TOLERANCE || deltaY > MOVE_TOLERANCE) {
      clearLongPress();
    }
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!longPressTriggeredRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    longPressTriggeredRef.current = false;
  }

  return (
    <div
      className={className}
      style={style}
      itemScope={itemScope}
      itemType={itemType}
      title="Right-click or long-press to download this card"
      aria-busy={downloading}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onClickCapture={handleClickCapture}
    >
      {children}
    </div>
  );
}
