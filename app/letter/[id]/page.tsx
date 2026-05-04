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

  return (
    <div className="letter-single">
      <div className="letter-single__card">
        <div className="memory-card card-animate" style={{ maxWidth: 420, margin: '0 auto' }}>
          <div className="memory-card__bg">
            <div className="memory-card__color" style={{ backgroundColor: hex }} />
            <div className="memory-card__texture" />
          </div>
          <div className="memory-card__content">
            <Link href={`/to/${memory.slug}`} className="memory-card__name">
              To {memory.name}
            </Link>
            <div className="memory-card__message"><span>{memory.message}</span></div>
            <div className="memory-card__footer">
              <span className="memory-card__brand">{SITE_NAME.toLowerCase()}</span>
            </div>
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
