import Link from 'next/link';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import type { Memory } from '@/lib/types';

export default function DesktopCard({ memory }: { memory: Memory }) {
  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';

  return (
    <div className="memory-card card-animate" style={{ maxWidth: 480 }}>
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
          To {memory.name}
        </Link>
        <Link href={`/letter/${memory.id}`} className="memory-card__message"
          style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>{memory.message}</span>
        </Link>
      </div>
    </div>
  );
}
