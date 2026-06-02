import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { SITE_URL } from '@/lib/constants';


export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = JOURNAL_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  const canonicalUrl = `${SITE_URL}/journal/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: post.title, description: post.excerpt, url: canonicalUrl },
  };
}

export async function generateStaticParams() {
  return JOURNAL_POSTS.map(post => ({ slug: post.slug }));
}

export default async function JournalPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = JOURNAL_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  // Convert human date like "May 2026" to ISO "2026-05-01"
  const isoDate = (() => {
    const d = new Date(post.date + ' 1'); // "May 2026 1" → valid Date
    return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
  })();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: 'Honey, If Only',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Honey, If Only',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/android-chrome-512x512.png`,
      },
    },
    datePublished: isoDate,
    dateModified: isoDate,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/android-chrome-512x512.png`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/journal/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page page--narrow">
        <div style={{ marginBottom: '48px' }}>
          <Link href="/journal" style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'none' }}>
            Back to Journal
          </Link>
        </div>

        <article>
          <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-light)', paddingBottom: '32px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '16px' }}>
              {post.date}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--text)' }}>
              {post.title}
            </h1>
          </header>

          <div style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            whiteSpace: 'pre-wrap',
          }}>
            {post.content}
          </div>
        </article>

        <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '16px' }}>What was left unsaid?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Distill your truth into 25 words. Submit it anonymously to the archive and let it go.
          </p>
          <Link href="/write" className="btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px' }}>
            Write a Letter
          </Link>
        </div>
      </div>
    </>
  );
}
