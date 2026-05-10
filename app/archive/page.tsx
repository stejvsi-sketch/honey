import type { Metadata } from 'next';
import Link from 'next/link';
import { getNameStats } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';

export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'Name Archive',
  description: 'Browse the complete A-Z directory of all anonymous unsent letters by name. Find the letters addressed to someone you know.',
  alternates: { canonical: `${SITE_URL}/archive` },
  openGraph: {
    title: 'Name Archive',
    description: 'Browse the complete A-Z directory of anonymous unsent letters by name.',
    url: `${SITE_URL}/archive`,
  },
};

export default async function ArchiveDirectoryPage() {
  const stats = await getNameStats();

  // Group names by first letter
  const grouped: Record<string, typeof stats> = {};
  stats.forEach(stat => {
    const firstLetter = stat.name.charAt(0).toUpperCase();
    const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(stat);
  });

  // Sort alphabetically
  const letters = Object.keys(grouped).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  // Sort names within each letter alphabetically
  letters.forEach(letter => {
    grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <div className="page page--narrow">
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Name Archive</h1>
        <p className="page__subtitle">Browse the complete A-Z directory of unsent letters.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px', justifyContent: 'center' }}>
        {letters.map(letter => (
          <a key={letter} href={`#letter-${letter}`} className="btn btn--outline" style={{ padding: '8px 12px', minWidth: '40px' }}>
            {letter}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} style={{ scrollMarginTop: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '24px' }}>
              {letter}
            </h2>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', listStyle: 'none', padding: 0 }}>
              {grouped[letter].map(stat => (
                <li key={stat.slug}>
                  <Link href={`/to/${stat.slug}`} className="archive-link">
                    <span style={{ fontWeight: 500 }}>{formatSubmittedName(stat.name)}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>
                      {stat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
