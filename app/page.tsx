import type { Metadata } from 'next';
import Link from 'next/link';
import { getHomeMemories } from '@/lib/data';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import HomeCardGrid from '@/components/cards/HomeCardGrid';
import TrendingNames from '@/components/TrendingNames';


export const revalidate = 18000;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} - Unsent Letters` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default async function HomePage() {
  const memories = await getHomeMemories(12);

  return (
    <>
      <section className="page">
        <div className="page__header">
          <h1 className="page__title" style={{ fontSize: '1.5rem' }}>Recent Letters</h1>
        </div>
        <HomeCardGrid memories={memories} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/letters" className="home__link">
            See all letters →
          </Link>
        </div>
        <TrendingNames />
      </section>

      <section className="hero">
        <h2 className="hero__title">The words you couldn&apos;t say.</h2>
        <p className="hero__subtitle">
          An archive for all the things left unspoken.
        </p>
        <div className="hero__cta">
          <Link href="/write" className="btn">Write a Letter</Link>
          <Link href="/letters" className="btn btn--outline">Read Letters</Link>
        </div>
      </section>

      {/* Explore — contextual internal links for SEO and discovery */}
      <section style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Explore</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/collections" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Collections</Link>
          <Link href="/journal" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Journal</Link>
          <Link href="/stories" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Stories</Link>
          <Link href="/burn" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Write & Burn</Link>
          <Link href="/archive" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Name Archive</Link>
          <Link href="/colors" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Colors</Link>
          <Link href="/about" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>How It Works</Link>
          <Link href="/faq" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>FAQ</Link>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/android-chrome-512x512.png`,
                  width: 512,
                  height: 512,
                },
              },
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: SITE_NAME,
                url: SITE_URL,
                description: 'A place for unsent letters and unspoken words.',
                publisher: { '@id': `${SITE_URL}/#organization` },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${SITE_URL}/letters?search={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
            ],
          }),
        }}
      />

    </>
  );
}
