'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';
import type { Memory } from '@/lib/types';

function isPinned(memory: Memory): boolean {
  if (!memory.pinned_until) return false;
  return new Date(memory.pinned_until) > new Date();
}

function FlipIcon() {
  return (
    <svg className="flip-hint__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M12 1H3a1 1 0 00-1 1v12a1 1 0 001 1h7l4-4V2a1 1 0 00-1-1z" />
      <path d="M10 14v-4h4" />
    </svg>
  );
}

export default function CardRenderer({
  memory,
  animate = true,
}: {
  memory: Memory;
  animate?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const pinned = isPinned(memory);
  const displayName = formatSubmittedName(memory.name);
  const hasWishReply = !!memory.wish_reply;

  function handleFlip(e: React.MouseEvent) {
    if (!hasWishReply) return;
    // Don't flip when clicking links
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;
    e.stopPropagation();
    setFlipped(f => !f);
  }

  const cardContent = (
    <>
      {pinned && (
        <div className="memory-card__pin" aria-label="Pinned letter">
          <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="11" cy="8" rx="7" ry="7" fill="#c4a67a" stroke="#a8895c" strokeWidth="1.2" />
            <ellipse cx="11" cy="8" rx="3.5" ry="3.5" fill="#dcc9a3" />
            <rect x="9.5" y="14" width="3" height="14" rx="1.5" fill="#b89b6a" stroke="#a8895c" strokeWidth="0.8" />
            <ellipse cx="11" cy="28" rx="1.5" ry="1" fill="#a8895c" />
          </svg>
        </div>
      )}
      <div className="memory-card__bg">
        <div className="memory-card__color" style={{ backgroundColor: hex }} />
        <div className="memory-card__texture" />
      </div>
      <div className="memory-card__content">
        <div className="memory-card__header">
          <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
        </div>
        <Link href={`/to/${memory.slug}`} className="memory-card__name"
          onClick={(e) => e.stopPropagation()}>
          To {displayName}
        </Link>
        <Link href={`/letter/${memory.id}`} className="memory-card__message"
          style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>{memory.message}</span>
        </Link>
        {memory.from_name && (
          <span className="memory-card__from">— {memory.from_name}</span>
        )}
      </div>
      {hasWishReply && (
        <div className="flip-hint" aria-label="Tap to flip">
          <FlipIcon /> turn over
        </div>
      )}
    </>
  );

  const backContent = hasWishReply ? (
    <>
      <div className="memory-card__bg">
        <div className="memory-card__color" style={{ backgroundColor: hex }} />
        <div className="memory-card__texture" />
      </div>
      <div className="memory-card__content">
        <div className="memory-card__header">
          <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
        </div>
        <span className="memory-card__wish-label">if only you&apos;d say...</span>
        <div className="memory-card__message" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>{memory.wish_reply}</span>
        </div>
      </div>
      <div className="flip-hint" aria-label="Tap to flip back">
        <FlipIcon /> turn over
      </div>
    </>
  ) : null;

  if (!hasWishReply) {
    return (
      <div className={`memory-card${animate ? ' card-animate' : ''}`}>
        {cardContent}
      </div>
    );
  }

  return (
    <div className="flip-card-container" onClick={handleFlip} role="button" tabIndex={0}
      aria-label={flipped ? 'Showing wish reply, tap to flip back' : 'Tap to see wish reply'}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}>
      <div className={`flip-card-inner${flipped ? ' flip-card-inner--flipped' : ''}`}>
        <div className="flip-card-front">
          <div className={`memory-card${animate ? ' card-animate' : ''}`}>
            {cardContent}
          </div>
        </div>
        <div className="flip-card-back">
          <div className={`memory-card${animate ? ' card-animate' : ''}`}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
