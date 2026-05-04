import { NextRequest, NextResponse } from 'next/server';

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ total_memories: 0, total_pending: 0, total_rejected: 0, total_banned: 0 });
  }

  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const supabase = getSupabaseAdmin();

  const [memories, pending, rejected, banned] = await Promise.all([
    supabase.from('memories').select('*', { count: 'exact', head: true }),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('banned_users').select('*', { count: 'exact', head: true }),
  ]);

  return NextResponse.json({
    total_memories: memories.count || 0,
    total_pending: pending.count || 0,
    total_rejected: rejected.count || 0,
    total_banned: banned.count || 0,
  });
}
