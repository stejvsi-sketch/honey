import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { JOURNAL_POSTS } from '@/lib/journal-data';
import { STORIES } from '@/lib/stories';
import { UNSENT_TOTAL_PAGES } from '@/lib/unsent-data';

// Helper: parse a "Month YYYY" date string into a Date (1st of the month)
function parseMonthDate(dateStr: string): Date | undefined {
  const parsed = Date.parse(dateStr + ' 1');
  return isNaN(parsed) ? undefined : new Date(parsed);
}

// Site launch date — used as the "last modified" for static pages
// that haven't changed since deployment
const SITE_LAUNCH = new Date('2026-05-15');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/letters', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/write', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/archive', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/journal', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/stories', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/cookies', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/disclaimer', changeFrequency: 'monthly' as const, priority: 0.3 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/colors', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/collections', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/unsent', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/table', changeFrequency: 'daily' as const, priority: 0.6 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: SITE_LAUNCH,
    changeFrequency,
    priority,
  }));

  // Dynamic colors — static content, use site launch date
  const { COLOR_MEANINGS } = await import('@/lib/color-meanings');
  const colorEntries: MetadataRoute.Sitemap = Object.keys(COLOR_MEANINGS).map(colorId => ({
    url: `${SITE_URL}/colors/${colorId}`,
    lastModified: SITE_LAUNCH,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dynamic Collections — static content, use site launch date
  const { COLLECTIONS } = await import('@/lib/collections-data');
  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map(c => ({
    url: `${SITE_URL}/collections/${c.slug}`,
    lastModified: SITE_LAUNCH,
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
          // Name pages grow over time; omit lastModified since we can't
          // efficiently determine the latest letter date per name at build time
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      );

      // Build set of slugs that have an indexed aggregation page (/to/{slug})
      const indexableSlugs = new Set(
        indexableNameSlugs
      );

      // Individual letters -> /letter/[id] pages
      // Only include letters for names that DON'T have an indexed aggregation page.
      // Letters for names with ≥5 count already have canonical → /to/{slug},
      // so including them in the sitemap would be redundant.
      const { data: letters } = await supabase
        .from('memories')
        .select('id, created_at, slug')
        .order('created_at', { ascending: false })
        .limit(50000);

      if (letters) {
        dynamicEntries.push(
          ...letters
            .filter(letter => !indexableSlugs.has(letter.slug))
            .map(letter => ({
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

  // Journal article pages — use post date (exclude noindexed posts)
  const journalEntries: MetadataRoute.Sitemap = JOURNAL_POSTS
    .filter(post => !post.noindex)
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

  // Unsent archive paginated pages — static imported content
  const unsentEntries: MetadataRoute.Sitemap = [];
  for (let i = 2; i <= UNSENT_TOTAL_PAGES; i++) {
    unsentEntries.push({
      url: `${SITE_URL}/unsent/${i}`,
      lastModified: SITE_LAUNCH,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return [...staticEntries, ...colorEntries, ...collectionEntries, ...dynamicEntries, ...journalEntries, ...storyEntries, ...unsentEntries];
}
