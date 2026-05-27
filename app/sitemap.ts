import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { STORIES } from '@/lib/stories';
import { UNSENT_TOTAL_PAGES } from '@/lib/unsent-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '', '/letters', '/write', '/about', '/archive', '/journal',
    '/stories', '/terms', '/privacy', '/cookies', '/disclaimer', '/contact',
    '/faq', '/colors', '/collections', '/unsent',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/letters' ? 'daily' : path === '/archive' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/letters' ? 0.9 : path === '/archive' ? 0.8 : 0.6,
  }));

  // Dynamic colors
  const { COLOR_MEANINGS } = await import('@/lib/color-meanings');
  const colorEntries: MetadataRoute.Sitemap = Object.keys(COLOR_MEANINGS).map(colorId => ({
    url: `${SITE_URL}/colors/${colorId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Dynamic Collections
  const { COLLECTIONS } = await import('@/lib/collections-data');
  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map(c => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
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

      // Individual letters -> /letter/[id] pages (cap at 50K — max per sitemap file)
      const { data: letters } = await supabase
        .from('memories')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(50000);

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

  // Story pages
  const storyEntries: MetadataRoute.Sitemap = [];
  for (const story of STORIES) {
    storyEntries.push({
      url: `${SITE_URL}/stories/${story.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    for (const chapter of story.chapters) {
      storyEntries.push({
        url: `${SITE_URL}/stories/${story.slug}/${chapter.number}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Unsent archive paginated pages
  const unsentEntries: MetadataRoute.Sitemap = [];
  for (let i = 2; i <= UNSENT_TOTAL_PAGES; i++) {
    unsentEntries.push({
      url: `${SITE_URL}/unsent/${i}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return [...staticEntries, ...colorEntries, ...collectionEntries, ...dynamicEntries, ...journalEntries, ...storyEntries, ...unsentEntries];
}
