import Link from 'next/link';
import { getNameStats } from '@/lib/data';
import { formatSubmittedName } from '@/lib/names';

export default async function TrendingNames({ limit = 8 }: { limit?: number }) {
  const stats = await getNameStats();

  // Sort by count descending to get the most popular names.
  const trending = stats.slice(0, limit);

  // Always render the container to prevent CLS; show an empty placeholder if no data.
  return (
    <div className="trending-widget" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-light)', minHeight: '140px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, fontWeight: 400 }}>Trending Names</h2>
        <Link href="/archive" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--text-muted)' }}>
          View Full Archive
        </Link>
      </div>
      {trending.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {trending.map(stat => (
            <Link
              key={stat.slug}
              href={`/to/${stat.slug}`}
              className="trending-tag"
            >
              {formatSubmittedName(stat.name)} <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginLeft: '4px' }}>{stat.count}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.9rem' }}>No trending names yet.</p>
      )}
    </div>
  );
}
