import type { Metadata } from 'next';
import { getMemoriesByName } from '@/lib/data';
import { CACHE_REVALIDATE, SITE_NAME } from '@/lib/constants';
import CardRenderer from '@/components/cards/CardRenderer';
import Link from 'next/link';

export const revalidate = CACHE_REVALIDATE;

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  const displayName = decodeURIComponent(name).replace(/-/g, ' ');
  return {
    title: `Letters to ${displayName}`,
    description: `Read all unsent letters written to ${displayName} on ${SITE_NAME}.`,
  };
}

export default async function NamePage(props: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { name } = await props.params;
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const { memories, total, displayName } = await getMemoriesByName(name, page, 24);
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Letters to {displayName}</h1>
        <p className="page__subtitle">{total} unsent {total === 1 ? 'letter' : 'letters'} written to {displayName}</p>
      </div>
      <div className="card-grid">
        {memories.map(memory => (
          <CardRenderer key={memory.id} memory={memory} />
        ))}
      </div>
      {memories.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 48, fontStyle: 'italic' }}>
          No letters to {displayName} yet. <Link href="/write">Write the first one</Link>.
        </p>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 && <Link href={`/to/${name}?page=${page - 1}`} className="pagination__btn">← Previous</Link>}
          {page < totalPages && <Link href={`/to/${name}?page=${page + 1}`} className="pagination__btn">Next →</Link>}
        </div>
      )}
    </div>
  );
}
