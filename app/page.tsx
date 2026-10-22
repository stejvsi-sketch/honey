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
          <h1 className="page__title" style={{ fontSize: '1.5rem' }}>Recent Unsent Letters</h1>
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
          Read short letters from a public archive, or write one of your own.
        </p>
        <div className="hero__cta">
          <Link href="/write" className="btn">Write an Unsent Letter</Link>
          <Link href="/letters" className="btn btn--outline">Read Letters</Link>
        </div>
      </section>

      <section className="page page--narrow" aria-labelledby="unsent-letter-context-title">
        <div className="page__header">
          <h2 id="unsent-letter-context-title" className="page__title" style={{ fontSize: '1.5rem' }}>
            What is an unsent letter?
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          An unsent letter is a note you write without needing to deliver it. It can hold an apology, gratitude, grief,
          or a boundary; writing one does not guarantee closure. This site is a public archive, not a private notebook.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          New submissions through the current form are reviewed before publication. Approved letters may remain public,
          and an optional sender name may be shown. A recipient name is a search label, not proof that a message refers
          to a particular person. Older archive entries may have a different publication history.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Need help getting started? Read our{' '}
          <Link href="/journal/what-to-write-for-closure" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            practical guide to writing an unsent letter
          </Link>
          , follow our{' '}
          <Link href="/journal/navigating-the-unsent-messages-archive" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            guide to searching and browsing the message archive
          </Link>
          , learn <Link href="/about" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>how the archive works</Link>,
          or review the <Link href="/privacy" style={{ color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Privacy Policy</Link> before sharing.
        </p>
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
