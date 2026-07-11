import type { Metadata } from 'next';
import { getNameStats } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';
import ArchiveSearch from '@/components/ArchiveSearch';


export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'Name Archive',
  description: 'Browse the complete A-Z directory of all anonymous unsent letters by name. Find the letters addressed to someone you know.',
  alternates: { canonical: `${SITE_URL}/archive` },
  openGraph: {
    title: 'Name Archive',
    description: 'Browse the complete A-Z directory of anonymous unsent letters by name.',
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
      {/* Monetag In-Page Push */}
      <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11272070',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
    </div>
  );
}
