import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { COLLECTIONS } from '@/lib/collections-data';
import { getMemoriesByCollection } from '@/lib/data';
import CollectionArchive from '@/components/CollectionArchive';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS.find(c => c.slug === slug);

  if (!collection) return { title: 'Not Found' };

  const canonicalUrl = `${SITE_URL}/collections/${slug}`;

  return {
    title: collection.title,
    description: collection.description,
    keywords: collection.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${collection.title} — ${SITE_NAME}`,
      description: collection.description,
      url: canonicalUrl,
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = COLLECTIONS.find(c => c.slug === slug);

  if (!collection) {
    notFound();
  }

  // Pre-fetch the first page for SSR content
  const { memories: initialMemories, total } = await getMemoriesByCollection(slug, 1, 10);

  const canonicalUrl = `${SITE_URL}/collections/${slug}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    url: canonicalUrl,
    description: collection.description,
    numberOfItems: total,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: initialMemories.length,
      itemListElement: initialMemories.map((memory, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          url: `${SITE_URL}/letter/${memory.id}`,
          name: `Anonymous Unsent Letter`,
          text: memory.message,
          genre: 'unsent letter',
          inLanguage: 'en',
          datePublished: memory.created_at,
          author: { '@type': 'Person', name: 'Anonymous' },
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      { '@type': 'ListItem', position: 3, name: collection.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="page__header" style={{ marginBottom: '24px' }}>
        <h1 className="page__title" style={{ margin: 0 }}>{collection.title}</h1>
      </div>

      <div className="prose" style={{ marginBottom: '48px', textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          {collection.description}
        </p>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
          Browsing {total} {total === 1 ? 'letter' : 'letters'}
        </p>
      </div>

      <CollectionArchive themeSlug={slug} themeName={collection.title} initialTotal={total} initialMemories={initialMemories} />

      {/* Internal links to name pages — SEO cross-linking */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Browse by Name</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Explore unsent letters addressed to specific names.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {['alex', 'sarah', 'david', 'emily', 'michael', 'jessica', 'james', 'ashley', 'daniel', 'samantha'].map(name => (
            <Link
              key={name}
              href={`/to/${name}`}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
              }}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Cross-links to other collections */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>More Collections</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {COLLECTIONS.filter(c => c.slug !== slug).slice(0, 10).map(c => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
              }}
            >
              {c.shortTitle}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
