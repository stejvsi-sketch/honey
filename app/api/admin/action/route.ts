import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/redis';

function verifyAdmin(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret');
  return !!process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id, action, ip_hash } = body;

  if (!action) {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  }

  const { getSupabaseAdmin } = await import('@/lib/supabase');
  const supabase = getSupabaseAdmin();

  // Unban action uses ip_hash directly, no submission lookup needed
  if (action === 'unban') {
    if (!ip_hash) {
      return NextResponse.json({ error: 'Missing ip_hash for unban' }, { status: 400 });
    }
    await supabase.from('banned_users').delete().eq('ip_hash', ip_hash);
    return NextResponse.json({ success: true });
  }

  // All other actions require a submission id
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // Get the submission first
  const { data: submission } = await supabase
    .from('submissions').select('*').eq('id', id).single();

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  switch (action) {
    case 'approve': {
      // Move to memories table
      const { error: insertErr } = await supabase.from('memories').insert({
        name: submission.name,
        message: submission.message,
        color_id: submission.color_id,
        slug: submission.slug,
        created_at: submission.created_at,
      });
      if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
      // Update submission status
      await supabase.from('submissions').update({ status: 'approved' }).eq('id', id);
      // Invalidate caches
      if (process.env.UPSTASH_REDIS_REST_URL) await invalidateCache('*');
      break;
    }
    case 'reject': {
      await supabase.from('submissions').update({ status: 'rejected' }).eq('id', id);
      break;
    }
    case 'delete': {
      await supabase.from('submissions').delete().eq('id', id);
      // Also delete from memories if it was approved
      await supabase.from('memories').delete().eq('id', id);
      if (process.env.UPSTASH_REDIS_REST_URL) await invalidateCache('*');
      break;
    }
    case 'ban': {
      // Add to banned_users
      await supabase.from('banned_users').upsert({
        ip_hash: submission.ip_hash,
        user_uuid: submission.user_uuid,
        country: submission.country,
        reason: 'Banned by admin',
      }, { onConflict: 'ip_hash' });
      // Reject the submission
      await supabase.from('submissions').update({ status: 'rejected' }).eq('id', id);
      break;
    }
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
