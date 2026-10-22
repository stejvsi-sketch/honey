import type { Metadata } from 'next';
import Link from 'next/link';
import { getMemoriesByName } from '@/lib/data';
import NameArchive from '@/components/NameArchive';
import RelatedNames from '@/components/RelatedNames';
import { SITE_URL, NAME_PAGE_SIZE } from '@/lib/constants';
import { formatSubmittedName, isIndexableName } from '@/lib/names';
import { COLLECTIONS } from '@/lib/collections-data';


export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  const { total, displayName: rawDisplayName } = await getMemoriesByName(name, 1, 1);
  const displayName = formatSubmittedName(rawDisplayName);
  const shouldIndex = isIndexableName(displayName, total);
  const canonicalUrl = `${SITE_URL}/to/${name}`;

  return {
    title: `Unsent Letters, Messages, and Texts to ${displayName}`,
    description: `Read ${total} public unsent letters, messages, and texts to ${displayName}—love notes, goodbyes, and words left unsent.`,
    keywords: [
      `unsent letters to ${displayName}`,
      `unsent message to ${displayName}`,
      `unsent messages to ${displayName}`,
      `unsent text to ${displayName}`,
      `letter to ${displayName} I never sent`,
      `letter to ${displayName} never sent`,
      `love letter to ${displayName}`,
      `things I never said to ${displayName}`,
      `message to ${displayName}`,
      `unspoken words to ${displayName}`,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Unsent Letters, Messages, and Texts to ${displayName}`,
      description: `Browse public unsent letters, messages, and texts addressed to ${displayName}.`,
      url: canonicalUrl,
    },
    ...(shouldIndex ? { robots: { index: true, follow: true } } : { robots: { index: false, follow: true } }),
  };
}

export default async function NamePage(props: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;
  const { memories: initialMemories, total, displayName: rawDisplayName } = await getMemoriesByName(name, 1, NAME_PAGE_SIZE);
  const displayName = formatSubmittedName(rawDisplayName);
  const canonicalUrl = `${SITE_URL}/to/${name}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": `Unsent Letters, Messages, and Texts to ${displayName}`,
        "url": canonicalUrl,
        "description": `A public archive of ${total} unsent letters, messages, and texts addressed to ${displayName}.`,
      },
      {
        "@type": "ItemList",
        "numberOfItems": initialMemories.length,
        "itemListElement": initialMemories.map((memory, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "CreativeWork",
            "url": `${SITE_URL}/letter/${memory.id}`,
            "name": `Unsent Letter to ${displayName}`,
            "text": memory.message,
            "genre": "unsent letter",
            "inLanguage": "en",
            "datePublished": memory.created_at,
          }
        }))
      }
    ]
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Name Archive', item: `${SITE_URL}/archive` },
      { '@type': 'ListItem', position: 3, name: displayName, item: canonicalUrl },
    ],
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <p style={{ margin: '0 auto 24px', maxWidth: '860px' }}>
        <Link href="/archive" style={{ color: 'var(--text-light)', fontSize: '0.85rem', textUnderlineOffset: '3px' }}>
          ← Browse all recipient names
        </Link>
      </p>
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Unsent Letters, Messages, and Texts to {displayName}</h1>
        <p className="page__subtitle" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Browse {total} public, user-submitted unsent letters, messages, and texts to {displayName}. You’ll find love notes, goodbyes, and words someone couldn’t quite bring themselves to say. Some writers choose to sign their notes.
        </p>
      </div>
      <NameArchive key={name} nameSlug={name} displayName={displayName} initialTotal={total} initialMemories={initialMemories} />



      <RelatedNames currentName={displayName} currentSlug={name} />

      {/* Internal links to related collections — SEO cross-linking */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Explore Collections</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {COLLECTIONS.slice(0, 12).map(collection => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
            >
              {collection.shortTitle}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
