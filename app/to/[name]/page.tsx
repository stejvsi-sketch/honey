import type { Metadata } from 'next';
import { getMemoriesByName } from '@/lib/data';
import NameArchive from '@/components/NameArchive';
import RelatedNames from '@/components/RelatedNames';
import { SITE_URL, NAME_PAGE_SIZE } from '@/lib/constants';
import { formatSubmittedName } from '@/lib/names';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  const { total, displayName: rawDisplayName } = await getMemoriesByName(name, 1, 1);
  const displayName = formatSubmittedName(rawDisplayName);
  const isRealName = displayName.replace(/\s/g, '').length >= 3;
  const shouldIndex = isRealName && total >= 5;
  const canonicalUrl = `${SITE_URL}/to/${name}`;

  return {
    title: `Unsent Letters and Messages to ${displayName}`,
    description: `Read ${total} anonymous unsent letters, messages, and texts to ${displayName}. Unspoken words, love letters and messages never sent, things I never said to ${displayName}, and 25-word secrets.`,
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
      title: `Unsent Letters and Messages to ${displayName}`,
      description: `Read anonymous unsent letters, messages, and texts addressed to ${displayName}. Words that were never said.`,
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
        "description": `An archive of ${total} anonymous unsent letters, messages, and texts addressed to ${displayName}. Love letters and messages never sent, things never said, and unspoken words.`,
        "about": {
          "@type": "Person",
          "name": displayName,
          "url": canonicalUrl
        }
      },
      {
        "@type": "ItemList",
        "numberOfItems": initialMemories.length,
        "itemListElement": initialMemories.map((memory, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "SocialMediaPosting",
            "url": `${SITE_URL}/letter/${memory.id}`,
            "name": `Unsent Letter to ${displayName}`,
            "text": memory.message,
            "datePublished": memory.created_at,
            "author": { "@type": "Person", "name": "Anonymous contributor" },
            "about": { "@type": "Person", "name": displayName, "url": canonicalUrl }
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
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Unsent Letters, Messages, and Texts to {displayName}</h1>
        <p className="page__subtitle" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Explore the archive of {total} anonymous, unsent {total === 1 ? 'letter' : 'letters'}, messages, and texts addressed to {displayName}.
          Love letters never sent, things never said, unspoken words, and 25-word secrets about
          unresolved heartbreak, unspoken gratitude, and late-night longing. What was left unsaid?
        </p>
      </div>
      <NameArchive key={name} nameSlug={name} displayName={displayName} initialTotal={total} initialMemories={initialMemories} />
      <RelatedNames currentName={displayName} currentSlug={name} />
    </div>
  );
}
