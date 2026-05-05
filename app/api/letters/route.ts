import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { getMockMemories } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const search = searchParams.get('search')?.trim() || '';
  const offset = (page - 1) * limit;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const allMocks = getMockMemories(100);
    let filtered = allMocks;
    if (search) {
      filtered = allMocks.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    const result = { memories: filtered.slice(offset, offset + limit), total: filtered.length };
    return NextResponse.json(result);
  }

  const supabase = getSupabaseClient();

  let query = supabase
    .from('memories')
    .select('id, name, message, color_id, created_at, slug, pinned_until', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ memories: [], total: 0 }, { status: 500 });
  }

  const response = NextResponse.json({
    memories: data || [],
    total: count || 0,
  });

  // Cache on Vercel CDN for 5h per unique URL (page+search combo)
  // Matches the 5h ISR TTL used across all public pages
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=18000, stale-while-revalidate=18000'
  );

  return response;
}
