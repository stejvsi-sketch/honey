import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Mock data for development
function getMockMemories(offset: number, limit: number, search?: string) {
  const mocks = [
    { name: 'Sarah', message: 'I still think about that rainy Tuesday when you held my hand for the last time', color_id: 'rose-dust' },
    { name: 'James', message: 'You were right about everything and I was too proud to say it', color_id: 'faded-denim' },
    { name: 'Luna', message: 'I wrote you seventeen letters and burned them all', color_id: 'lavender-haze' },
    { name: 'Marcus', message: 'The coffee shop closed down now I have nowhere to pretend to accidentally run into you', color_id: 'honey-gold' },
    { name: 'Emily', message: 'I still set two alarms because you always needed the extra five minutes', color_id: 'blush-coral' },
    { name: 'Alex', message: 'Every song on that playlist still feels like a conversation we never finished', color_id: 'ocean-mist' },
    { name: 'Mia', message: 'I kept the voicemail you left me three years ago just to hear your laugh', color_id: 'dusty-mauve' },
    { name: 'Daniel', message: 'You made ordinary things feel extraordinary and I never thanked you for that', color_id: 'sage-whisper' },
    { name: 'Sofia', message: 'I practice what I would say if I saw you again but the words dissolve', color_id: 'parchment' },
    { name: 'Ethan', message: 'You deserved an apology that I was never brave enough to give', color_id: 'ivory-ash' },
    { name: 'Chloe', message: 'I drive past your old house sometimes just to feel something real', color_id: 'rose-dust' },
    { name: 'Noah', message: 'The worst part is I cannot even be mad because you were right', color_id: 'faded-denim' },
  ];

  let filtered = mocks;
  if (search) {
    const q = search.toLowerCase();
    filtered = mocks.filter(m => m.name.toLowerCase().includes(q));
  }

  const all = filtered.map((m, i) => ({
    id: `mock-${i + 1}`,
    name: m.name,
    message: m.message,
    color_id: m.color_id,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    slug: m.name.toLowerCase().replace(/\s+/g, '-'),
  }));

  return { memories: all.slice(offset, offset + limit), total: all.length };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const search = searchParams.get('search')?.trim() || '';
  const offset = (page - 1) * limit;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const result = getMockMemories(offset, limit, search || undefined);
    return NextResponse.json(result);
  }

  const supabase = getSupabaseClient();

  let query = supabase
    .from('memories')
    .select('id, name, message, color_id, created_at, slug', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ memories: [], total: 0 }, { status: 500 });
  }

  return NextResponse.json({
    memories: data || [],
    total: count || 0,
  });
}
