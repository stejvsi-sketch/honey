import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import LettersArchive from '@/components/LettersArchive';
import { getArchiveMemories } from '@/lib/data';
import { formatSubmittedName } from '@/lib/names';

const LETTERS_TITLE = 'Letters - All Unsent Words';
const LETTERS_DESCRIPTION = "Browse all unsent letters, messages, and texts. Anonymous love letters never sent, things never said, unspoken words, and heartfelt messages from people who couldn't say what they felt.";

export const revalidate = 18000;

export const metadata: Metadata = {
  title: LETTERS_TITLE,
  description: LETTERS_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/letters` },
};

export default async function LettersPage() {
  // Server-side fetch for initial page data so Googlebot sees content (prevents soft 404)
  const { memories: initialMemories, total: initialTotal } = await getArchiveMemories(1, 10);
  const canonicalUrl = `${SITE_URL}/letters`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: LETTERS_TITLE,
        description: LETTERS_DESCRIPTION,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
        },
        mainEntity: {
          '@id': `${canonicalUrl}#recent-letters`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#recent-letters`,
        name: 'Recent unsent letters',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: initialMemories.length,
        itemListElement: initialMemories.map((memory, index) => {
          const letterUrl = `${SITE_URL}/letter/${memory.id}`;
          return {
            '@type': 'ListItem',
            position: index + 1,
            url: letterUrl,
            item: {
              '@id': `${letterUrl}#letter`,
            },
          };
        }),
      },
      ...initialMemories.map((memory) => {
        const displayName = formatSubmittedName(memory.name);
        const letterUrl = `${SITE_URL}/letter/${memory.id}`;
        const recipientUrl = `${SITE_URL}/to/${memory.slug}`;
        const itemName = `Unsent letter to ${displayName}`;

        return {
          '@type': 'SocialMediaPosting',
          '@id': `${letterUrl}#letter`,
          url: letterUrl,
          name: itemName,
          headline: itemName,
          datePublished: memory.created_at,
          text: memory.message,
          author: {
            '@type': 'Person',
            name: 'Anonymous',
          },
          about: {
            '@type': 'Person',
            name: displayName,
            url: recipientUrl,
          },
          isPartOf: {
            '@id': `${canonicalUrl}#webpage`,
          },
        };
      }),
    ],
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LettersArchive initialMemories={initialMemories} initialTotal={initialTotal} />
    </div>
  );
}
