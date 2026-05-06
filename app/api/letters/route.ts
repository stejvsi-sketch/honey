import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const search = searchParams.get('search')?.trim() || '';
  const offset = (page - 1) * limit;


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

  // s-maxage = CDN cache (5h), max-age=0 = browser always revalidates with CDN
  // Without max-age=0, mobile browsers aggressively cache the API response locally
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=18000, stale-while-revalidate=18000'
  );

  return response;
}
