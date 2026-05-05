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
            className="related-tag"
          >
            {stat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
