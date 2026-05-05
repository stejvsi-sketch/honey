import Link from 'next/link';
import { getNameStats } from '@/lib/data';

export default async function TrendingNames({ limit = 8 }: { limit?: number }) {
  const stats = await getNameStats();
  
  // Sort by count descending to get the most "trending" or popular names
  const trending = stats.slice(0, limit);

  if (trending.length === 0) return null;

  return (
    <div className="trending-widget" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0 }}>Trending Names</h3>
        <Link href="/archive" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--text-muted)' }}>
          View Full Archive
        </Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {trending.map(stat => (
          <Link 
            key={stat.slug} 
            href={`/to/${stat.slug}`}
            style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.03)',
              borderRadius: '20px',
              color: 'var(--text)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
          >
            {stat.name} <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '4px' }}>{stat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
