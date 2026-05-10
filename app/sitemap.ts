import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { JOURNAL_POSTS } from '@/lib/journal-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '', '/letters', '/write', '/about', '/archive', '/journal',
    '/terms', '/privacy', '/cookies', '/disclaimer', '/contact',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/letters' ? 'daily' : path === '/archive' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/letters' ? 0.9 : path === '/archive' ? 0.8 : 0.6,
  }));

  // Dynamic entries from Supabase (name pages + individual letters)
  const dynamicEntries: MetadataRoute.Sitemap = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const { getNameStats } = await import('@/lib/data');
      const supabase = getSupabaseClient();

      // Indexable name pages -> /to/[name] pages. Keep this aligned with app/to/[name]/page.tsx.
      const nameStats = await getNameStats();
      const indexableNameSlugs = nameStats
        .filter(stat => stat.slug.replace(/-/g, '').length >= 3 && stat.count >= 5)
        .map(stat => stat.slug);

      dynamicEntries.push(
        ...indexableNameSlugs.map(slug => ({
          url: `${SITE_URL}/to/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      );

      // Recent individual letters -> /letter/[id] pages (cap at 1000 for sitemap size)
      const { data: letters } = await supabase
        .from('memories')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (letters) {
        dynamicEntries.push(
          ...letters.map(letter => ({
            url: `${SITE_URL}/letter/${letter.id}`,
            lastModified: new Date(letter.created_at),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
          }))
        );
      }
    } catch (e) {
      console.error('Sitemap dynamic entries error:', e);
    }
  }

  // Journal article pages
  const journalEntries: MetadataRoute.Sitemap = JOURNAL_POSTS.map(post => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...dynamicEntries, ...journalEntries];
}
