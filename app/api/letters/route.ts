import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import type { Memory } from '@/lib/types';

function sortPinnedFirst(memories: Memory[]): Memory[] {
  const now = new Date();
  const pinned = memories.filter(m => m.pinned_until && new Date(m.pinned_until) > now);
  const rest = memories.filter(m => !m.pinned_until || new Date(m.pinned_until) <= now);
  return [...pinned, ...rest];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const search = searchParams.get('search')?.trim() || '';
  const color = searchParams.get('color')?.trim() || '';
  const themeSlug = searchParams.get('theme')?.trim() || '';
  const offset = (page - 1) * limit;

  const supabase = getSupabaseClient();

  let query = supabase
    .from('memories')
    .select('id, name, message, color_id, created_at, slug, pinned_until', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (color) {
    query = query.eq('color_id', color);
  }
  if (themeSlug) {
    const { COLLECTIONS } = await import('@/lib/collections-data');
    const collection = COLLECTIONS.find(c => c.slug === themeSlug);
    if (collection && collection.searchTerms.length > 0) {
      const orQuery = collection.searchTerms.map(term => `message.ilike.%${term}%`).join(',');
      query = query.or(orQuery);
    }
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ memories: [], total: 0 }, { status: 500 });
  }

  const response = NextResponse.json({
    memories: sortPinnedFirst((data || []) as Memory[]),
    total: count || 0,
  });

  // max-age=18000: browser caches for exactly 5h, then MUST revalidate
  // s-maxage=18000: CDN (Vercel) caches for 5h independently
  // must-revalidate: after 5h, browser cannot serve stale — must check with CDN
  response.headers.set(
    'Cache-Control',
    'public, max-age=18000, s-maxage=18000, stale-while-revalidate=18000, must-revalidate'
  );

  return response;
}
