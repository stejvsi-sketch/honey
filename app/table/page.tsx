import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { getTableMemories } from '@/lib/data';
import TableView from '@/components/TableView';

export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'The Table - Letters Laid Bare',
  description: 'Fifty recent unsent letters scattered across a table. Pick one up and read the words someone never got to say.',
  alternates: { canonical: `${SITE_URL}/table` },
  openGraph: {
    title: 'The Table',
    description: 'Fifty unsent letters scattered across a table, waiting to be read.',
    url: `${SITE_URL}/table`,
  },
};

export default async function TablePage() {
  const memories = await getTableMemories(50);

  return <TableView memories={memories} />;
}
