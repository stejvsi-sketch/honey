import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/constants';
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

  return {
    title: collection.title,
    description: collection.description,
    keywords: collection.keywords.join(', '),
    alternates: {
      canonical: `${SITE_URL}/collections/${slug}`,
    },
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      { '@type': 'ListItem', position: 3, name: collection.title, item: `${SITE_URL}/collections/${slug}` },
    ],
  };

  return (
    <div className="page">
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
    </div>
  );
}
