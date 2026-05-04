import type { Metadata } from 'next';
import Link from 'next/link';
import { CACHE_REVALIDATE } from '@/lib/constants';

export const revalidate = CACHE_REVALIDATE;

export const metadata: Metadata = {
  title: 'Journal — Thoughts on Love, Loss & Letters',
  description: 'Essays and reflections on unsent letters, unspoken words, love, loss, and the art of letting go.',
};

// Placeholder journal entries (will come from Supabase later)
const PLACEHOLDER_POSTS = [
  {
    slug: 'why-we-dont-say-it',
    title: 'Why We Don\'t Say It',
    excerpt: 'The psychology behind the words we swallow — and why the hardest things to say are often the most important.',
    date: 'May 2026',
  },
  {
    slug: 'the-weight-of-unsent-letters',
    title: 'The Weight of Unsent Letters',
    excerpt: 'Every unspoken word carries weight. Some people carry entire libraries of things they never said.',
    date: 'May 2026',
  },
];

export default function JournalPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Journal</h1>
        <p className="page__subtitle">Reflections on the words we hold back and the ones we let go.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {PLACEHOLDER_POSTS.map(post => (
          <article key={post.slug} style={{
            padding: '28px 0',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 8, fontStyle: 'italic' }}>
              {post.date}
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: 8 }}>
              <Link href={`/journal/${post.slug}`} style={{ color: 'var(--text)' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
          </article>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: 48, color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>
        More reflections coming soon.
      </p>
    </div>
  );
}
