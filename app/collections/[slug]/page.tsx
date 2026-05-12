import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
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
    title: `${collection.title} | ${SITE_NAME}`,
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

  // Pre-fetch the first page to pass down as initial total
  const { total } = await getMemoriesByCollection(slug, 1, 10);

  return (
    <div className="page">
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

      <CollectionArchive themeSlug={slug} themeName={collection.title} initialTotal={total} />
    </div>
  );
}
