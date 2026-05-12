import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { COLLECTIONS } from '@/lib/collections-data';

export const metadata: Metadata = {
  title: `Unsent Message Collections | ${SITE_NAME}`,
  description: 'Explore curated collections of anonymous unsent messages, including heartbreak letters, crush confessions, and apologies.',
  alternates: {
    canonical: `${SITE_URL}/collections`,
  },
};

export default function CollectionsIndexPage() {
  return (
    <div className="page__container">
      <div className="page__header">
        <h1 className="page__title">Message Collections</h1>
        <p className="page__subtitle">
          Explore curated archives of unspoken words.
        </p>
      </div>

      <div className="prose" style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <p>
          Whether you are looking for apologies never sent, secret crush confessions, or the final words 
          someone wished they had said to an ex, these collections gather the most profound 
          emotions from our archive into dedicated spaces.
        </p>
      </div>

      <div className="color-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '24px', padding: '0 16px' }}>
        {COLLECTIONS.map((collection) => (
          <Link href={`/collections/${collection.slug}`} key={collection.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="color-card" style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border-color)',
              padding: '32px 24px', 
              borderRadius: '16px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                {collection.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
                {collection.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
