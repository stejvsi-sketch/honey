import type { Metadata } from 'next';
import { getMemoriesByName } from '@/lib/data';
import NameArchive from '@/components/NameArchive';
import RelatedNames from '@/components/RelatedNames';
import { SITE_URL } from '@/lib/constants';
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
    description: `Read ${total} anonymous unsent letters, messages, and texts to ${displayName}. Unspoken words, love letters never sent, things I never said to ${displayName}, and 25-word secrets.`,
    keywords: [
      `unsent letters to ${displayName}`,
      `unsent letter to ${displayName}`,
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
  const { total, displayName: rawDisplayName } = await getMemoriesByName(name, 1, 1);
  const displayName = formatSubmittedName(rawDisplayName);
  const canonicalUrl = `${SITE_URL}/to/${name}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Unsent Letters, Messages, and Texts to ${displayName}`,
    "url": canonicalUrl,
    "description": `An archive of ${total} anonymous unsent letters, messages, and texts addressed to ${displayName}. Love letters never sent, things never said, and unspoken words.`,
    "keywords": `unsent letters to ${displayName}, unsent letter to ${displayName}, unsent messages to ${displayName}, unsent message to ${displayName}, unsent text to ${displayName}, letter to ${displayName} never sent, love letter to ${displayName}`,
    "about": {
      "@type": "Person",
      "name": displayName,
      "url": canonicalUrl
    }
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Unsent Letters, Messages, and Texts to {displayName}</h1>
        <p className="page__subtitle" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Explore the archive of {total} anonymous unsent {total === 1 ? 'letter' : 'letters'} to {displayName}.
          Whether you are looking for an unsent letter to {displayName}, unspoken words, 25-word secrets, or unsent messages to {displayName}, you will find them here.
          Discover love letters never sent, unspoken gratitude, and late-night longing. What was left unsaid?
        </p>
      </div>
      <NameArchive nameSlug={name} displayName={displayName} initialTotal={total} />
      <RelatedNames currentName={displayName} currentSlug={name} />
    </div>
  );
}
