import type { Metadata } from 'next';
import { getMemoriesByName } from '@/lib/data';
import { SITE_NAME } from '@/lib/constants';
import NameArchive from '@/components/NameArchive';

export const revalidate = 18000;

export async function generateMetadata(props: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await props.params;
  const displayName = decodeURIComponent(name).replace(/-/g, ' ');
  const isRealName = displayName.replace(/\s/g, '').length >= 3;

  return {
    title: `Letters to ${displayName}`,
    description: `Read all unsent letters written to ${displayName} on ${SITE_NAME}.`,
    ...(isRealName ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function NamePage(props: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await props.params;
  const { total, displayName } = await getMemoriesByName(name, 1, 1);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Letters to {displayName}</h1>
        <p className="page__subtitle">{total} unsent {total === 1 ? 'letter' : 'letters'} written to {displayName}</p>
      </div>
      <NameArchive nameSlug={name} displayName={displayName} initialTotal={total} />
    </div>
  );
}
