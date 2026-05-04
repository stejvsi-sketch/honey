import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '', '/letters', '/write', '/about', '/journal',
    '/terms', '/privacy', '/disclaimer', '/contact',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/letters' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/letters' ? 0.9 : 0.6,
  }));

  // Dynamic entries from Supabase (name pages + individual letters)
  let dynamicEntries: MetadataRoute.Sitemap = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();

      // All unique name slugs → /to/[name] pages
      const { data: names } = await supabase
        .from('memories')
        .select('slug')
        .order('created_at', { ascending: false });

      if (names) {
        const uniqueSlugs = [...new Set(names.map(n => n.slug))];
        dynamicEntries.push(
          ...uniqueSlugs.map(slug => ({
            url: `${SITE_URL}/to/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }))
        );
      }

      // Recent individual letters → /letter/[id] pages (cap at 1000 for sitemap size)
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

  return [...staticEntries, ...dynamicEntries];
}
