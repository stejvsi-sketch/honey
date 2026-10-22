import type { Metadata } from 'next';
import Link from 'next/link';
import { getHomeMemories } from '@/lib/data';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import HomeCardGrid from '@/components/cards/HomeCardGrid';
import TrendingNames from '@/components/TrendingNames';


export const revalidate = 18000;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} - Unsent Letters and Messages` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} - Unsent Letters and Messages`,
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
          <h1 className="page__title" style={{ fontSize: '1.5rem' }}>Recent Unsent Letters and Messages</h1>
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
        <h2 className="hero__title">Some words are easier to write.</h2>
        <p className="hero__subtitle">
          Read unsent letters and messages people have shared, or write one of your own.
        </p>
        <div className="hero__cta">
          <Link href="/write" className="btn">Write a letter</Link>
          <Link href="/letters" className="btn btn--outline">Read letters</Link>
        </div>
      </section>

      <section className="page page--narrow home-context" aria-labelledby="unsent-letter-context-title">
        <div className="home-context__heading">
          <h2 id="unsent-letter-context-title" className="page__title">
            What is an unsent letter?
          </h2>
          <p className="home-context__intro">
            A note you write without needing to send. It can put an apology, gratitude, grief, or a boundary into words,
            but it cannot guarantee closure.
          </p>
        </div>

        <p className="home-context__note">
          <strong>Before you share:</strong> This is a public archive, not a private notebook. New submissions are reviewed
          before publication and may remain public. Writers choose the name they’re writing to, and some sign their note.
          Older entries may have a different publication history.
        </p>

        <nav className="home-context__links" aria-label="Learn more about the archive">
          <Link href="/journal/what-to-write-for-closure">Writing an unsent letter <span>→</span></Link>
          <Link href="/journal/navigating-the-unsent-messages-archive">Search the archive <span>→</span></Link>
          <Link href="/about">How the archive works <span>→</span></Link>
          <Link href="/privacy">Privacy before sharing <span>→</span></Link>
        </nav>
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
                description: 'A public archive of unsent letters, messages, and unspoken words.',
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
