import { getSupabaseClient } from './supabase';
import type { Memory } from './types';
import { unstable_cache } from 'next/cache';

type NameStat = { name: string; slug: string; count: number };
type RawNameStat = { name: string; slug: string; count: number | string | bigint };

/** Moves actively-pinned memories to the front, preserving order within each group */
function sortPinnedFirst(memories: Memory[]): Memory[] {
  const now = new Date();
  const pinned = memories.filter(m => m.pinned_until && new Date(m.pinned_until) > now);
  const rest = memories.filter(m => !m.pinned_until || new Date(m.pinned_until) <= now);
  return [...pinned, ...rest];
}

function normalizeNameStats(rows: RawNameStat[]): NameStat[] {
  const stats = new Map<string, NameStat>();

  for (const row of rows) {
    if (!row.slug) continue;

    const count = Number(row.count) || 0;
    const existing = stats.get(row.slug);

    if (existing) {
      const previousCount = existing.count;
      existing.count += count;
      if (count > previousCount || row.name.length < existing.name.length) {
        existing.name = row.name;
      }
    } else {
      stats.set(row.slug, { name: row.name, slug: row.slug, count });
    }
  }

  return [...stats.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const getCachedHomeMemories = unstable_cache(
  async (limit: number) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
      .order('created_at', { ascending: false }).limit(limit);
    if (error) { console.error('Error fetching home memories:', error); return []; }
    return sortPinnedFirst(data as Memory[]);
  },
  ['home-memories'],
  { revalidate: 18000 }
);

export async function getHomeMemories(limit: number = 12): Promise<Memory[]> {
  return getCachedHomeMemories(limit);
}

const getCachedTableMemories = unstable_cache(
  async (limit: number) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
      .order('created_at', { ascending: false }).limit(limit);
    if (error) { console.error('Error fetching table memories:', error); return []; }
    return sortPinnedFirst(data as Memory[]);
  },
  ['table-memories'],
  { revalidate: 18000 }
);

export async function getTableMemories(limit: number = 50): Promise<Memory[]> {
  return getCachedTableMemories(limit);
}

const getCachedArchiveMemories = unstable_cache(
  async (page: number, limit: number) => {
    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    const [{ data, error }, { count, error: countError }] = await Promise.all([
      supabase.from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
        .order('created_at', { ascending: false }).range(from, from + limit - 1),
      supabase.from('memories').select('*', { count: 'exact', head: true }),
    ]);
    if (error || countError) return { memories: [], total: 0 };
    return { memories: sortPinnedFirst(data as Memory[]), total: count || 0 };
  },
  ['archive-memories'],
  { revalidate: 18000 }
);

export async function getArchiveMemories(page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number }> {
  return getCachedArchiveMemories(page, limit);
}

const getCachedMemoryById = unstable_cache(
  async (id: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('memories')
      .select('id, name, message, color_id, created_at, slug, pinned_until').eq('id', id).single();
    if (error) return null;
    return data as Memory;
  },
  ['memory-by-id'],
  { revalidate: 18000 }
);

export async function getMemoryById(id: string): Promise<Memory | null> {
  return getCachedMemoryById(id);
}

const getCachedMemoriesByName = unstable_cache(
  async (nameSlug: string, page: number, limit: number) => {
    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    const [{ data, error }, { count }] = await Promise.all([
      supabase.from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
        .eq('slug', nameSlug).order('created_at', { ascending: false }).range(from, from + limit - 1),
      supabase.from('memories').select('*', { count: 'exact', head: true }).eq('slug', nameSlug),
    ]);
    if (error) return { memories: [], total: 0, displayName: nameSlug.replace(/-/g, ' ') };
    const memories = data as Memory[];
    const displayName = memories.length > 0 ? memories[0].name : nameSlug.replace(/-/g, ' ');
    return { memories, total: count || 0, displayName };
  },
  ['memories-by-name'],
  { revalidate: 18000 }
);

export async function getMemoriesByName(nameSlug: string, page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number; displayName: string }> {
  return getCachedMemoriesByName(nameSlug, page, limit);
}

const getCachedNameStats = unstable_cache(
  async () => {
    const supabase = getSupabaseClient();
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_name_stats');
    if (!rpcError && rpcData) {
      return normalizeNameStats(rpcData as RawNameStat[]);
    }
    const { data, error } = await supabase.from('memories')
      .select('name, slug')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    const stats: Record<string, NameStat> = {};
    data.forEach((m: { name: string; slug: string }) => {
      if (!stats[m.slug]) stats[m.slug] = { name: m.name, slug: m.slug, count: 0 };
      stats[m.slug].count++;
    });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  },
  ['name-stats'],
  { revalidate: 18000 }
);

export async function getNameStats(): Promise<NameStat[]> {
  return getCachedNameStats();
}

const getCachedMemoriesByColor = unstable_cache(
  async (colorId: string, page: number, limit: number) => {
    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    const [{ data, error }, { count }] = await Promise.all([
      supabase.from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
        .eq('color_id', colorId).order('created_at', { ascending: false }).range(from, from + limit - 1),
      supabase.from('memories').select('*', { count: 'exact', head: true }).eq('color_id', colorId),
    ]);
    if (error) return { memories: [], total: 0 };
    return { memories: data as Memory[], total: count || 0 };
  },
  ['memories-by-color'],
  { revalidate: 18000 }
);

export async function getMemoriesByColor(colorId: string, page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number }> {
  return getCachedMemoriesByColor(colorId, page, limit);
}

const getCachedMemoriesByCollection = unstable_cache(
  async (themeSlug: string, page: number, limit: number) => {
    const { COLLECTIONS } = await import('@/lib/collections-data');
    const collection = COLLECTIONS.find(c => c.slug === themeSlug);
    if (!collection) return { memories: [], total: 0 };

    const supabase = getSupabaseClient();
    const from = (page - 1) * limit;
    
    let baseQuery = supabase.from('memories').select('id, name, message, color_id, created_at, slug, pinned_until');
    let countQuery = supabase.from('memories').select('*', { count: 'exact', head: true });

    if (collection.searchTerms.length > 0) {
      const orQuery = collection.searchTerms.map(term => `message.ilike.%${term}%`).join(',');
      baseQuery = baseQuery.or(orQuery);
      countQuery = countQuery.or(orQuery);
    }

    const [{ data, error }, { count }] = await Promise.all([
      baseQuery.order('created_at', { ascending: false }).range(from, from + limit - 1),
      countQuery,
    ]);

    if (error) return { memories: [], total: 0 };
    return { memories: data as Memory[], total: count || 0 };
  },
  ['memories-by-collection'],
  { revalidate: 18000 }
);

export async function getMemoriesByCollection(themeSlug: string, page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number }> {
  return getCachedMemoriesByCollection(themeSlug, page, limit);
}

const getCachedNameCountForSlug = unstable_cache(
  async (slug: string) => {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from('memories')
      .select('*', { count: 'exact', head: true })
      .eq('slug', slug);
    if (error) return 0;
    return count || 0;
  },
  ['name-count-for-slug'],
  { revalidate: 18000 }
);

export async function getNameCountForSlug(slug: string): Promise<number> {
  return getCachedNameCountForSlug(slug);
}
