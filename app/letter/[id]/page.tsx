import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMemoryById } from '@/lib/data';
import { CARD_COLORS, SITE_NAME } from '@/lib/constants';
import Link from 'next/link';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) return { title: 'Letter Not Found' };
  return {
    title: `A letter to ${memory.name}`,
    description: `"${memory.message.slice(0, 120)}..." — An unsent letter on ${SITE_NAME}`,
    openGraph: { title: `A letter to ${memory.name}`, description: memory.message.slice(0, 160) },
  };
}

export default async function LetterPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const memory = await getMemoryById(id);
  if (!memory) notFound();

  const color = CARD_COLORS.find(c => c.id === memory.color_id);
  const hex = color?.hex || '#f5e6d0';
  const date = new Date(memory.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const pinned = memory.pinned_until && new Date(memory.pinned_until) > new Date();

  return (
    <div className="letter-single">
      <div className="letter-single__card">
        <div className="memory-card card-animate" style={{ margin: '0 auto' }}>
          {pinned && (
            <div className="memory-card__pin" aria-label="Pinned letter">
              <svg width="26" height="38" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <Link href={`/to/${memory.slug}`} className="memory-card__name">
              To {memory.name}
            </Link>
            <div className="memory-card__message"><span>{memory.message}</span></div>
          </div>
        </div>
      </div>
      <div className="letter-single__meta">
        <p>{formattedDate} at {formattedTime}</p>
      </div>
      <div style={{ marginTop: 32 }}>
        <Link href="/letters" className="btn btn--outline" style={{ width: 'auto', display: 'inline-flex' }}>
          ← Back to Letters
        </Link>
      </div>
    </div>
  );
}
