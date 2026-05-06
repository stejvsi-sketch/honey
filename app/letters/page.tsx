import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import LettersArchive from '@/components/LettersArchive';
import { getArchiveMemories } from '@/lib/data';

export const revalidate = 18000;

export const metadata: Metadata = {
  title: 'Letters — All Unsent Words',
  description: 'Browse through all the unsent letters — anonymous messages from people who never got to say what they felt. Read heartfelt, anonymous unsent messages.',
  alternates: { canonical: `${SITE_URL}/letters` },
};

export default async function LettersPage() {
  // Server-side fetch for initial page data so Googlebot sees content (prevents soft 404)
  const { memories: initialMemories, total: initialTotal } = await getArchiveMemories(1, 10);

  return (
    <div className="page">
      <LettersArchive initialMemories={initialMemories} initialTotal={initialTotal} />
    </div>
  );
}
