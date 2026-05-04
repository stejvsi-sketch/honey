import type { Metadata } from 'next';
import { getArchiveMemories } from '@/lib/data';
import CardRenderer from '@/components/cards/CardRenderer';
import Link from 'next/link';

export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'Letters — All Unsent Words',
  description: 'Browse through all the unsent letters — anonymous messages from people who never got to say what they felt.',
};

export default async function LettersPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const { memories, total } = await getArchiveMemories(page, 24);
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">All Letters</h1>
        <p className="page__subtitle">Every unsent word, every unspoken thought — all gathered here.</p>
      </div>

      <div className="card-grid">
        {memories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} />
        ))}
      </div>

      {memories.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48, fontStyle: 'italic' }}>
          No letters yet. Be the first to <Link href="/write">write one</Link>.
        </p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 && (
            <Link href={`/letters?page=${page - 1}`} className="pagination__btn">← Previous</Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p} href={`/letters?page=${p}`}
                className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
              >
                {p}
              </Link>
            );
          })}
          {totalPages > 7 && <span style={{ color: 'var(--text-light)' }}>...</span>}
          {page < totalPages && (
            <Link href={`/letters?page=${page + 1}`} className="pagination__btn">Next →</Link>
          )}
        </div>
      )}
    </div>
  );
}
