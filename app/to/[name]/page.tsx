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
    description: `Read ${total} anonymous unsent letters and messages to ${displayName}. A digital archive of unspoken love, lingering grief, apologies, and 25-word secrets.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Unsent Letters and Messages to ${displayName}`,
      description: `Read anonymous unsent letters and messages addressed to ${displayName}.`,
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
    "name": `Unsent Letters and Messages to ${displayName}`,
    "url": canonicalUrl,
    "description": `An archive of ${total} anonymous, unsent letters and messages addressed to ${displayName}.`,
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
        <h1 className="page__title">Unsent Letters and Messages to {displayName}</h1>
        <p className="page__subtitle" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Explore the archive of {total} anonymous, unsent {total === 1 ? 'letter' : 'letters'} and messages addressed to {displayName}.
          Within these pages, contributors have left 25-word fragments detailing unresolved heartbreak, 
          unspoken gratitude, and late-night longing. What was left unsaid?
        </p>
      </div>
      <NameArchive nameSlug={name} displayName={displayName} initialTotal={total} />
      <RelatedNames currentName={displayName} currentSlug={name} />
    </div>
  );
}
