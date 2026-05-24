import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { UNSENT_MEMORIES, UNSENT_PER_PAGE, UNSENT_TOTAL_PAGES } from '@/lib/unsent-data';
import UnsentArchive from '@/components/UnsentArchive';

const PAGE_TITLE = `The Unsent Archive | Formerly If Only I Sent This`;
const PAGE_DESCRIPTION =
  '1,486 unsent messages preserved from the "If Only I Sent This" archive, now merged into Honey, If Only. Raw confessions, unspoken words, and letters that were never delivered.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/unsent` },
  openGraph: {
    title: `The Unsent Archive | Formerly If Only I Sent This — ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/unsent`,
  },
};

export default function UnsentPage() {
  const pageMemories = UNSENT_MEMORIES.slice(0, UNSENT_PER_PAGE);

  return (
    <>
      <UnsentArchive
        memories={pageMemories}
        currentPage={1}
        totalPages={UNSENT_TOTAL_PAGES}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            url: `${SITE_URL}/unsent`,
            isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
            numberOfItems: UNSENT_MEMORIES.length,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'The Unsent Archive', item: `${SITE_URL}/unsent` },
              ],
            },
          }),
        }}
      />
    </>
  );
}
