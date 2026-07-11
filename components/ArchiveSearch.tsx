'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatSubmittedName } from '@/lib/names';

type NameStat = { name: string; slug: string; count: number };

export default function ArchiveSearch({ stats }: { stats: NameStat[] }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? stats.filter(s => s.name.toLowerCase().includes(query.toLowerCase().trim()))
    : stats;

  // Group names by first letter
  const grouped: Record<string, NameStat[]> = {};
  filtered.forEach(stat => {
    const firstLetter = stat.name.charAt(0).toUpperCase();
    const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(stat);
  });

  const letters = Object.keys(grouped).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  letters.forEach(letter => {
    grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a name..."
          className="form__input"
          style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
          autoComplete="off"
        />
        {query.trim() && (
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
            {filtered.length} name{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}
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

      {filtered.length === 0 && query.trim() && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px 0', fontStyle: 'italic' }}>
          No names found matching &quot;{query.trim()}&quot;
        </p>
      )}
    </>
  );
}
