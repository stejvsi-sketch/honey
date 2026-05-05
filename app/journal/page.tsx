import { Metadata } from 'next';
import Link from 'next/link';
import { JOURNAL_POSTS } from '@/lib/journal-data';

export const metadata: Metadata = {
  title: 'Journal | Honey, If Only',
  description: 'Explore the psychology of heartbreak and discover why the words we never send carry the heaviest weight. Read the journal.',
};

export default function JournalPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Journal</h1>
        <p className="page__subtitle">Reflections on the words we hold back and the ones we let go.</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '48px' }}>
        {JOURNAL_POSTS.map(post => (
          <article key={post.slug} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '48px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '8px' }}>
              {post.date}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '16px' }}>
              <Link href={`/journal/${post.slug}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {post.excerpt}
            </p>
            <Link href={`/journal/${post.slug}`} style={{ 
              fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', 
              color: 'var(--text)', borderBottom: '1px solid var(--text)' 
            }}>
              Read More
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
