import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { UNSENT_MEMORIES, UNSENT_PER_PAGE, UNSENT_TOTAL_PAGES } from '@/lib/unsent-data';
import UnsentArchive from '@/components/UnsentArchive';

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const params = [];
  for (let i = 2; i <= UNSENT_TOTAL_PAGES; i++) {
    params.push({ page: String(i) });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 2 || pageNum > UNSENT_TOTAL_PAGES) {
    return {};
  }

  const title = `The Unsent Archive — Page ${pageNum} | Formerly If Only I Sent This`;
  const description = `Page ${pageNum} of the unsent messages archive. Browse 1,441 preserved unsent letters and confessions from the "If Only I Sent This" collection, now merged into Honey, If Only.`;

  const links: Record<string, string> = {
    canonical: `${SITE_URL}/unsent/${pageNum}`,
  };

  return {
    title,
    description,
    alternates: links,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/unsent/${pageNum}`,
    },
  };
}

export default async function UnsentPaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 2 || pageNum > UNSENT_TOTAL_PAGES) {
    notFound();
  }

  const start = (pageNum - 1) * UNSENT_PER_PAGE;
  const end = start + UNSENT_PER_PAGE;
  const pageMemories = UNSENT_MEMORIES.slice(start, end);

  return (
    <>
      <UnsentArchive
        memories={pageMemories}
        currentPage={pageNum}
        totalPages={UNSENT_TOTAL_PAGES}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `If Only I Sent This — Page ${pageNum}`,
            url: `${SITE_URL}/unsent/${pageNum}`,
            isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Unsent Archive', item: `${SITE_URL}/unsent` },
                { '@type': 'ListItem', position: 3, name: `Page ${pageNum}`, item: `${SITE_URL}/unsent/${pageNum}` },
              ],
            },
          }),
        }}
      />
    </>
  );
}
