import Link from 'next/link';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';
import type { Memory } from '@/lib/types';

function isPinned(memory: Memory): boolean {
  if (!memory.pinned_until) return false;
  return new Date(memory.pinned_until) > new Date();
}

export default function CardRenderer({
  memory,
  animate = true,
}: {
  memory: Memory;
  animate?: boolean;
}) {
  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const pinned = isPinned(memory);
  const displayName = formatSubmittedName(memory.name);

  return (
    <div className={`memory-card${animate ? ' card-animate' : ''}`}>
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
      </div>
    </div>
  );
}
