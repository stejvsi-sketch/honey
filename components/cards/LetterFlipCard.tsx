'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

function FlipIcon() {
  return (
    <svg className="flip-hint__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

interface LetterFlipCardProps {
  hex: string;
  slug: string;
  displayName: string;
  message: string;
  fromName?: string | null;
  wishReply?: string | null;
}

export default function LetterFlipCard({ hex, slug, displayName, message, fromName, wishReply }: LetterFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const hasWishReply = !!wishReply;

  function handleFlip(e: React.MouseEvent) {
    if (!hasWishReply) return;
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;
    setFlipped(f => !f);
  }

  const front = (
    <div className="memory-card card-animate" style={{ margin: '0 auto' }}>
      <div className="memory-card__bg">
        <div className="memory-card__color" style={{ backgroundColor: hex }} />
        <div className="memory-card__texture" />
      </div>
      <div className="memory-card__content">
        <div className="memory-card__header">
          <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
        </div>
        <Link href={`/to/${slug}`} className="memory-card__name">
          To {displayName}
        </Link>
        <div className="memory-card__message"><span>{message}</span></div>
        {fromName && (
          <span className="memory-card__from">— {fromName}</span>
        )}
      </div>
      {hasWishReply && (
        <div className="flip-hint" aria-label="Tap to flip">
          <FlipIcon /> flip
        </div>
      )}
    </div>
  );

  if (!hasWishReply) {
    return front;
  }

  const back = (
    <div className="memory-card card-animate" style={{ margin: '0 auto' }}>
      <div className="memory-card__bg">
        <div className="memory-card__color" style={{ backgroundColor: hex }} />
        <div className="memory-card__texture" />
      </div>
      <div className="memory-card__content">
        <div className="memory-card__header">
          <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
        </div>
        <span className="memory-card__wish-label">if only you&apos;d say...</span>
        <div className="memory-card__message"><span>{wishReply}</span></div>
      </div>
      <div className="flip-hint" aria-label="Tap to flip back">
        <FlipIcon /> flip
      </div>
    </div>
  );

  return (
    <div className="flip-card-container" onClick={handleFlip} role="button" tabIndex={0}
      aria-label={flipped ? 'Showing wish reply, tap to flip back' : 'Tap to see wish reply'}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}>
      <div className={`flip-card-inner${flipped ? ' flip-card-inner--flipped' : ''}`}>
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
}
