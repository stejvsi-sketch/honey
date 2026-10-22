import type { Metadata } from 'next';
import { getNameStats } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import ArchiveSearch from '@/components/ArchiveSearch';


export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'Name Archive',
  description: 'Browse the A–Z directory of recipient names in the public unsent-letter archive. A matching name does not identify a particular person.',
  alternates: { canonical: `${SITE_URL}/archive` },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Name Archive',
    description: 'Browse recipient names in the public unsent-letter archive.',
    url: `${SITE_URL}/archive`,
  },
};

export default async function ArchiveDirectoryPage() {
  const stats = await getNameStats();

  return (
    <div className="page page--narrow">
      <div className="page__header" style={{ marginBottom: '48px' }}>
        <h1 className="page__title">Name Archive</h1>
        <p className="page__subtitle">Browse the complete A-Z directory of unsent letters.</p>
      </div>

      <ArchiveSearch stats={stats} />

    </div>
  );
}
