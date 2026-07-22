import { MetadataRoute } from 'next';
import { SITE_URL, NAME_INDEX_THRESHOLD } from '@/lib/constants';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { STORIES } from '@/lib/stories';

// Helper: parse a "Month YYYY" date string into a Date (1st of the month)
function parseMonthDate(dateStr: string): Date | undefined {
  const parsed = Date.parse(dateStr + ' 1');
  return isNaN(parsed) ? undefined : new Date(parsed);
}

// Site launch date — used as the "last modified" for static pages
// that haven't changed since deployment
const SITE_LAUNCH = new Date('2026-05-15');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only include pages that are indexed by Google.
  // Pages with noindex,follow (letters, archive, unsent, colors, collections)
  // are intentionally excluded — they are kept for visitors but not for search.
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/write', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/journal', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/stories', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/cookies', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/disclaimer', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/methodology', changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: SITE_LAUNCH,
    changeFrequency,
    priority,
  }));

  // Dynamic entries from Supabase (name pages only — /to/[name])
  const dynamicEntries: MetadataRoute.Sitemap = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { getNameStats } = await import('@/lib/data');

      // Indexable name pages -> /to/[name] pages. Keep this aligned with app/to/[name]/page.tsx.
      const nameStats = await getNameStats();
      const indexableNameSlugs = nameStats
        .filter(stat => stat.slug.replace(/-/g, '').length >= 3 && stat.count >= NAME_INDEX_THRESHOLD)
        .map(stat => stat.slug);

      dynamicEntries.push(
        ...indexableNameSlugs.map(slug => ({
          url: `${SITE_URL}/to/${slug}`,
          // Name pages grow over time; omit lastModified since we can't
          // efficiently determine the latest letter date per name at build time
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      );
    } catch (e) {
      console.error('Sitemap dynamic entries error:', e);
    }
  }

  // Journal article pages — use post date
  const journalEntries: MetadataRoute.Sitemap = JOURNAL_POSTS
    .map(post => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: parseMonthDate(post.date) || SITE_LAUNCH,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }));

  // Story pages — use story date
  const storyEntries: MetadataRoute.Sitemap = [];
  for (const story of STORIES) {
    const storyDate = parseMonthDate(story.date) || SITE_LAUNCH;
    storyEntries.push({
      url: `${SITE_URL}/stories/${story.slug}`,
      lastModified: storyDate,
      changeFrequency: 'yearly',
      priority: 0.8,
    });
    for (const chapter of story.chapters) {
      storyEntries.push({
        url: `${SITE_URL}/stories/${story.slug}/${chapter.number}`,
        lastModified: storyDate,
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...dynamicEntries, ...journalEntries, ...storyEntries];
}
