import Link from 'next/link';
import { getHomeMemories } from '@/lib/data';
import { SITE_NAME } from '@/lib/constants';
import HomeCardGrid from '@/components/cards/HomeCardGrid';

export const revalidate = 18000;

export default async function HomePage() {
  const memories = await getHomeMemories(12);

  return (
    <>
      <section className="page">
        <div className="page__header">
          <h1 className="page__title" style={{ fontSize: '1.5rem' }}>Recent Letters</h1>
          <p className="page__subtitle">Fragments of love, regret, and everything left unsaid</p>
        </div>
        <HomeCardGrid memories={memories} />
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/letters" className="btn btn--outline" style={{ width: 'auto', display: 'inline-flex' }}>
            See All Letters →
          </Link>
        </div>
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

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: 'https://honeyifonly.com',
            description: 'A place for unsent letters and unspoken words.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://honeyifonly.com/to/{search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}
