import type { Metadata } from 'next';
import { getMemoriesByName } from '@/lib/data';
import NameArchive from '@/components/NameArchive';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  const { total, displayName } = await getMemoriesByName(name, 1, 1);
  const isRealName = displayName.replace(/\s/g, '').length >= 3;
  const shouldIndex = isRealName && total >= 5;

  return {
    title: `Unsent Letters to ${displayName} | Honey, If Only`,
    description: `Read ${total} anonymous, unsent letters addressed to ${displayName}. A digital archive of unspoken love, lingering grief, and 25-word secrets. What was left unsaid?`,
    ...(shouldIndex ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function NamePage(props: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;
  const { total, displayName } = await getMemoriesByName(name, 1, 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Unsent Letters to ${displayName}`,
    "description": `An archive of ${total} anonymous, unsent letters addressed to ${displayName}.`,
    "about": {
      "@type": "Person",
      "name": displayName
    }
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Unsent Letters to {displayName}</h1>
        <p className="page__subtitle" style={{ maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Explore the archive of {total} anonymous, unsent {total === 1 ? 'letter' : 'letters'} addressed to {displayName}. 
          Within these pages, contributors have left 25-word fragments detailing unresolved heartbreak, 
          unspoken gratitude, and late-night longing. What was left unsaid?
        </p>
      </div>
      <NameArchive nameSlug={name} displayName={displayName} initialTotal={total} />
    </div>
  );
}
