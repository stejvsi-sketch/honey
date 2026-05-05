import { getSupabaseClient } from './supabase';
import { getCached, setCache } from './redis';
import type { Memory } from './types';

const TOTAL_MOCKS = 13;

function isConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function getHomeMemories(limit: number = 12): Promise<Memory[]> {
  if (!isConfigured()) return getMockMemories(limit);
  const cacheKey = `home:${limit}`;
  if (isRedisConfigured()) {
    const cached = await getCached<Memory[]>(cacheKey);
    if (cached) return cached;
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
    .order('created_at', { ascending: false }).limit(limit);
  if (error) { console.error('Error fetching home memories:', error); return []; }
  const memories = data as Memory[];
  if (isRedisConfigured()) await setCache(cacheKey, memories);
  return memories;
}

export async function getArchiveMemories(page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number }> {
  if (!isConfigured()) return { memories: getMockMemories(limit), total: 100 };
  const cacheKey = `archive:${page}:${limit}`;
  if (isRedisConfigured()) {
    const cached = await getCached<{ memories: Memory[]; total: number }>(cacheKey);
    if (cached) return cached;
  }
  const supabase = getSupabaseClient();
  const from = (page - 1) * limit;
  const [{ data, error }, { count, error: countError }] = await Promise.all([
    supabase.from('memories').select('id, name, message, color_id, created_at, slug, pinned_until')
      .order('created_at', { ascending: false }).range(from, from + limit - 1),
    supabase.from('memories').select('*', { count: 'exact', head: true }),
  ]);
  if (error || countError) return { memories: [], total: 0 };
  const result = { memories: data as Memory[], total: count || 0 };
  if (isRedisConfigured()) await setCache(cacheKey, result);
  return result;
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  if (!isConfigured()) { const m = getMockMemories(TOTAL_MOCKS); return m.find(x => x.id === id) || null; }
  const cacheKey = `memory:${id}`;
  if (isRedisConfigured()) { const c = await getCached<Memory>(cacheKey); if (c) return c; }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('memories')
    .select('id, name, message, color_id, created_at, slug, pinned_until').eq('id', id).single();
  if (error) return null;
  if (isRedisConfigured()) await setCache(cacheKey, data as Memory);
  return data as Memory;
}

export async function getMemoriesByName(nameSlug: string, page: number = 1, limit: number = 24): Promise<{ memories: Memory[]; total: number; displayName: string }> {
  if (!isConfigured()) {
    const allMocks = getMockMemories(13);
    const matching = allMocks.filter(m => m.slug === nameSlug);
    const displayName = matching.length > 0 ? matching[0].name : nameSlug.replace(/-/g, ' ');
    const from = (page - 1) * limit;
    return { memories: matching.slice(from, from + limit), total: matching.length, displayName };
  }
  const cacheKey = `name:${nameSlug}:${page}`;
  if (isRedisConfigured()) {
    const c = await getCached<{ memories: Memory[]; total: number; displayName: string }>(cacheKey);
    if (c) return c;
  }
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
  const result = { memories, total: count || 0, displayName };
  if (isRedisConfigured()) await setCache(cacheKey, result);
  return result;
}

export function getMockMemories(count: number): Memory[] {
  const mocks = [
    { name: 'Olivia', message: 'I remember every single word you said that night under the stars but I was too afraid to tell you that it changed everything inside me forever', color_id: 'dusty-mauve', pinned: true },
    { name: 'Sarah', message: 'I still think about that rainy Tuesday when you held my hand for the last time', color_id: 'rose-dust', pinned: true },
    { name: 'James', message: 'You were right about everything and I was too proud to say it', color_id: 'faded-denim', pinned: false },
    { name: 'Luna', message: 'I wrote you seventeen letters and burned them all', color_id: 'lavender-haze', pinned: false },
    { name: 'Marcus', message: 'The coffee shop closed down now I have nowhere to pretend to accidentally run into you', color_id: 'honey-gold', pinned: false },
    { name: 'Emily', message: 'I still set two alarms because you always needed the extra five minutes', color_id: 'blush-coral', pinned: false },
    { name: 'Alex', message: 'Every song on that playlist still feels like a conversation we never finished', color_id: 'ocean-mist', pinned: false },
    { name: 'Mia', message: 'I kept the voicemail you left me three years ago just to hear your laugh', color_id: 'dusty-mauve', pinned: false },
    { name: 'Daniel', message: 'You made ordinary things feel extraordinary and I never thanked you for that', color_id: 'sage-whisper', pinned: false },
    { name: 'Sofia', message: 'I practice what I would say if I saw you again but the words dissolve', color_id: 'parchment', pinned: false },
    { name: 'Ethan', message: 'You deserved an apology that I was never brave enough to give', color_id: 'ivory-ash', pinned: false },
    { name: 'Chloe', message: 'I drive past your old house sometimes just to feel something real', color_id: 'rose-dust', pinned: false },
    { name: 'Noah', message: 'The worst part is I cannot even be mad because you were right', color_id: 'faded-denim', pinned: false },
  ];
  return mocks.slice(0, count).map((m, i) => ({
    id: `mock-${i + 1}`, name: m.name, message: m.message, color_id: m.color_id,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    slug: m.name.toLowerCase().replace(/\s+/g, '-'),
    pinned_until: m.pinned ? new Date(Date.now() + 86400000).toISOString() : null,
  }));
}

export async function getNameStats(): Promise<{ name: string; slug: string; count: number }[]> {
  if (!isConfigured()) {
    const mocks = getMockMemories(13);
    const stats: Record<string, { name: string; slug: string; count: number }> = {};
    mocks.forEach(m => {
      if (!stats[m.slug]) stats[m.slug] = { name: m.name, slug: m.slug, count: 0 };
      stats[m.slug].count++;
    });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  }
  
  const cacheKey = `name_stats`;
  if (isRedisConfigured()) {
    const c = await getCached<{ name: string; slug: string; count: number }[]>(cacheKey);
    if (c) return c;
  }
  
  const supabase = getSupabaseClient();
  
  // First, try to use the optimized RPC function
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_name_stats');
  
  if (!rpcError && rpcData) {
    const result = rpcData as { name: string; slug: string; count: number }[];
    if (isRedisConfigured()) await setCache(cacheKey, result);
    return result;
  }

  // Fallback: If RPC doesn't exist yet, fetch up to 5000 recent memories
  const { data, error } = await supabase.from('memories')
    .select('name, slug')
    .order('created_at', { ascending: false })
    .limit(5000);
    
  if (error || !data) return [];
  
  const stats: Record<string, { name: string; slug: string; count: number }> = {};
  data.forEach((m: { name: string; slug: string }) => {
    if (!stats[m.slug]) stats[m.slug] = { name: m.name, slug: m.slug, count: 0 };
    stats[m.slug].count++;
  });
  
  const result = Object.values(stats).sort((a, b) => b.count - a.count);
  if (isRedisConfigured()) await setCache(cacheKey, result);
  return result;
}
