import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { SITE_NAME, SITE_URL, EDITOR_NAME } from '@/lib/constants';
import JournalContent from '@/components/JournalContent';
import RelatedPosts from '@/components/RelatedPosts';

const MONTHS: Record<string, string> = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

/** Convert a human date like "May 2026" to ISO "2026-05-01". */
function journalDateToISO(date: string): string {
  const [month, year] = date.split(' ');
  const mm = MONTHS[month];
  if (!mm || !year) return date;
  return `${year}-${mm}-01`;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = JOURNAL_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  const canonicalUrl = `${SITE_URL}/journal/${post.slug}`;
  const isoDate = journalDateToISO(post.date);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    ...(post.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      publishedTime: isoDate,
      modifiedTime: isoDate,
      authors: [EDITOR_NAME],
    },
  };
}

export async function generateStaticParams() {
  return JOURNAL_POSTS.map(post => ({ slug: post.slug }));
}

export default async function JournalPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = JOURNAL_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const isoDate = journalDateToISO(post.date);
  const canonicalUrl = `${SITE_URL}/journal/${post.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: EDITOR_NAME,
        url: `${SITE_URL}/about`,
        jobTitle: 'Founder & Editor',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
      },
      datePublished: isoDate,
      dateModified: isoDate,
      image: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/journal` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
      ],
    },
  ];

  if (post.faq && post.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

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
            <div style={{ marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              By <Link href="/about" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '2px', textDecorationColor: 'var(--border-light)' }}>{EDITOR_NAME}</Link> · {SITE_NAME} Editorial
            </div>
          </header>

          <div style={{
            marginBottom: '40px', padding: '16px 20px', background: 'rgba(255,255,255,0.35)',
            borderRadius: 'var(--radius)', borderLeft: '3px solid var(--border-light)',
            fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic',
          }}>
            This article reflects the editorial perspective of the {SITE_NAME} team. Where we reference research or external sources, we link to them where available.
          </div>

          <JournalContent content={post.content} slug={post.slug} />
        </article>

        {post.faq && post.faq.length > 0 && (
          <section style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '28px', color: 'var(--text)' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {post.faq.map((item, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text)' }}>
                    {item.question}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontSize: '0.98rem' }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <RelatedPosts slug={post.slug} />

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
