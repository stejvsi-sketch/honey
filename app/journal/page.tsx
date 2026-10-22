import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { SITE_URL, EDITOR_NAME, EDITOR_BYLINE } from '@/lib/constants';

const protectedComparisonSlugs = new Set([
  'unsent-project-alternative',
  'websites-similar-to-the-unsent-project',
]);

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Explore the psychology of heartbreak and discover why the words we never send carry the heaviest weight. Read the journal.',
  alternates: { canonical: `${SITE_URL}/journal` },
};

export default function JournalPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Journal</h1>
        <p className="page__subtitle">Reflections on the words we hold back and the ones we let go.</p>
        <p style={{ marginTop: '16px' }}>
          <Link href="/journal/topics" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Browse journal articles by topic
          </Link>
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '48px' }}>
        {JOURNAL_POSTS.map((post, _i) => (
          <React.Fragment key={post.slug}>
            <article style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '48px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '8px' }}>
                {post.date} · By {post.author || (protectedComparisonSlugs.has(post.slug) ? EDITOR_NAME : EDITOR_BYLINE)}
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
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: '64px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', padding: '32px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '12px' }}>Read Our Stories</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
            Original fiction about love, loss, and the things we carry with us long after the road ends.
          </p>
          <Link href="/stories" style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>
            Stories
          </Link>
        </div>
        <div style={{ flex: '1 1 280px', padding: '32px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '12px' }}>Write a Letter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
            Write a short letter. Approved submissions are public, and an optional sender name may appear.
          </p>
          <Link href="/write" style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text)', borderBottom: '1px solid var(--text)' }}>
            Write
          </Link>
        </div>
      </div>


    </div>
  );
}
