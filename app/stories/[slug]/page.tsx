import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { STORIES } from '@/lib/stories';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const story = STORIES.find(s => s.slug === slug);
  if (!story) return { title: 'Story Not Found' };
  const canonicalUrl = `${SITE_URL}/stories/${story.slug}`;

  return {
    title: story.title,
    description: story.synopsis,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: story.title,
      description: story.synopsis,
      url: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  return STORIES.map(story => ({ slug: story.slug }));
}

export default async function StoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const story = STORIES.find(s => s.slug === slug);
  if (!story) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Stories', item: `${SITE_URL}/stories` },
      { '@type': 'ListItem', position: 3, name: story.title, item: `${SITE_URL}/stories/${story.slug}` },
    ],
  };

  return (
    <div className="page page--narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div style={{ marginBottom: '48px' }}>
        <Link href="/stories" style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'none' }}>
          Back to Stories
        </Link>
      </div>

      <header style={{ marginBottom: '64px', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-light)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          {story.author} &middot; {story.date}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '3rem',
          lineHeight: 1.15,
          color: 'var(--text)',
          marginBottom: '24px',
        }}>
          {story.title}
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          maxWidth: '520px',
          margin: '0 auto 40px',
          fontStyle: 'italic',
        }}>
          {story.synopsis}
        </p>
        <Link
          href={`/stories/${story.slug}/1`}
          className="btn"
          style={{ display: 'inline-block', width: 'auto', padding: '14px 40px' }}
        >
          Start Reading
        </Link>
      </header>

      <div style={{
        borderTop: '1px solid var(--border-light)',
        paddingTop: '48px',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.3rem',
          marginBottom: '32px',
          color: 'var(--text)',
        }}>
          Chapters
        </h2>

        <ol style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {story.chapters.map((chapter, i) => (
            <li key={chapter.number}>
              <Link
                href={`/stories/${story.slug}/${chapter.number}`}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '16px',
                  padding: '20px 0',
                  borderBottom: i < story.chapters.length - 1 ? '1px solid var(--border-light)' : 'none',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: '24px',
                }}>
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                }}>
                  {chapter.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
