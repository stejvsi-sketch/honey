import Link from 'next/link';
import { getNameStats } from '@/lib/data';

export default async function RelatedNames({ currentName, currentSlug, limit = 8 }: { currentName: string; currentSlug: string; limit?: number }) {
  const stats = await getNameStats();
  
  // Find names starting with the same letter, excluding the current name
  const firstLetter = currentName.charAt(0).toLowerCase();
  
  let related = stats.filter(stat => stat.slug !== currentSlug && stat.slug.startsWith(firstLetter));
  
  // If not enough related names, backfill with random popular names
  if (related.length < limit) {
    const others = stats.filter(stat => stat.slug !== currentSlug && !stat.slug.startsWith(firstLetter));
    related = [...related, ...others].slice(0, limit);
  } else {
    related = related.slice(0, limit);
  }

  if (related.length === 0) return null;

  return (
    <div className="related-widget" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '24px' }}>Related Names</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {related.map(stat => (
          <Link 
            key={stat.slug} 
            href={`/to/${stat.slug}`}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {stat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
