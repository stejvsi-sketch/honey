import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { STORIES } from '@/lib/stories';
import { COLLECTIONS } from '@/lib/collections-data';
import { isIndexableName } from '@/lib/names';

// Keep the prior metadata for the two comparison pages intact.
const protectedComparisonSlugs = new Set([
  'unsent-project-alternative',
  'websites-similar-to-the-unsent-project',
]);

function parseMonthDate(dateStr: string): Date | undefined {
  const parsed = Date.parse(dateStr + ' 1');
  return isNaN(parsed) ? undefined : new Date(parsed);
}

const SITE_LAUNCH = new Date('2026-05-15');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only include pages that are indexed by Google.
  // Noindex utility views and individual user-submitted letters are excluded.
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/letters', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/write', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/journal', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/journal/topics', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/stories', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/cookies', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/disclaimer', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/methodology', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/moderation', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/burn', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/author', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/collections', changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
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
        .filter(stat => isIndexableName(stat.name, stat.count))
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

  // The source data only stores month-level publication dates and no verified
  // modification dates. Omit lastModified rather than publishing false dates.
  const journalEntries: MetadataRoute.Sitemap = JOURNAL_POSTS.map(post => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    ...(protectedComparisonSlugs.has(post.slug)
      ? { lastModified: parseMonthDate(post.date) || SITE_LAUNCH }
      : {}),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  // Story data also stores month-level dates only.
  const storyEntries: MetadataRoute.Sitemap = [];
  for (const story of STORIES) {
    storyEntries.push({
      url: `${SITE_URL}/stories/${story.slug}`,
      changeFrequency: 'yearly',
      priority: 0.8,
    });
    for (const chapter of story.chapters) {
      storyEntries.push({
        url: `${SITE_URL}/stories/${story.slug}/${chapter.number}`,
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }
  }

  // Collection pages — keyword-based curated archives
  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map(collection => ({
    url: `${SITE_URL}/collections/${collection.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...dynamicEntries, ...journalEntries, ...storyEntries, ...collectionEntries];
}
