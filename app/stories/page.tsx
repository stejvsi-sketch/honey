import { Metadata } from 'next';
import Link from 'next/link';
import { STORIES } from '@/lib/stories';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Original fiction from Honey, If Only. Stories about love, loss, and the things we carry with us long after the road ends.',
  alternates: { canonical: `${SITE_URL}/stories` },
  openGraph: {
    title: 'Stories | Honey, If Only',
    description: 'Original fiction about love, loss, and the things we carry.',
    url: `${SITE_URL}/stories`,
  },
};

export default function StoriesPage() {
  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1 className="page__title">Stories</h1>
        <p className="page__subtitle">
          Fiction born from the same silence that fills unsent letters. Long reads for quiet nights.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '48px' }}>
        {STORIES.map(story => (
          <article
            key={story.slug}
            style={{
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '48px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-light)',
                fontStyle: 'italic',
              }}>
                {story.date}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-light)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.04)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                {story.chapters.length} chapters
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              <Link
                href={`/stories/${story.slug}`}
                style={{ color: 'var(--text)', textDecoration: 'none' }}
              >
                {story.title}
              </Link>
            </h2>

            <p style={{
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '24px',
              fontSize: '1.05rem',
            }}>
              {story.synopsis}
            </p>

            <Link
              href={`/stories/${story.slug}`}
              style={{
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                borderBottom: '1px solid var(--text)',
              }}
            >
              Start Reading
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
