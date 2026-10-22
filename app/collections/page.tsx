import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { COLLECTIONS } from '@/lib/collections-data';

export const metadata: Metadata = {
  title: 'Unsent Message Collections',
  description: 'Explore public collections of unsent messages, including heartbreak letters, crush confessions, and apologies. Optional sender names may appear.',
  alternates: {
    canonical: `${SITE_URL}/collections`,
  },
  robots: { index: true, follow: true },
};

export default function CollectionsIndexPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Message Collections</h1>
        <p className="page__subtitle">
          Explore curated archives of unspoken words.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <p>
          Whether you are looking for apologies never sent, secret crush confessions, or the final words
          someone wished they had said to an ex, these collections group public user-submitted letters by topic.
        </p>
        <p>
          Approved submissions are public, and optional sender names may appear. Older archive entries may include names or handles and may have a different publication history.
        </p>
      </div>

      <div className="hub-grid">
        {COLLECTIONS.map((collection) => (
          <Link href={`/collections/${collection.slug}`} key={collection.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="hub-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ color: 'var(--text-primary)' }}>
                {collection.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                {collection.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
