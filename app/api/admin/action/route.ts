import { NextRequest, NextResponse } from 'next/server';


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
  const { id, action, ip_hash, hours } = body;

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

  // Pin action — sets pinned_until on a memory
  if (action === 'pin') {
    if (!id || !hours) {
      return NextResponse.json({ error: 'Missing id or hours for pin' }, { status: 400 });
    }
    const pinnedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const { error: pinErr } = await supabase
      .from('memories')
      .update({ pinned_until: pinnedUntil })
      .eq('id', id);
    if (pinErr) return NextResponse.json({ error: pinErr.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Unpin action
  if (action === 'unpin') {
    if (!id) {
      return NextResponse.json({ error: 'Missing id for unpin' }, { status: 400 });
    }
    const { error: unpinErr } = await supabase
      .from('memories')
      .update({ pinned_until: null })
      .eq('id', id);
    if (unpinErr) return NextResponse.json({ error: unpinErr.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Delete action — works on BOTH memories and submissions tables
  // This allows deleting from the Approved tab (memories) as well as Pending tab (submissions)
  if (action === 'delete') {
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    // Try deleting from both tables — one will match, the other is a no-op
    await supabase.from('memories').delete().eq('id', id);
    await supabase.from('submissions').delete().eq('id', id);
    return NextResponse.json({ success: true });
  }

  // All remaining actions (approve, reject, ban) require a submission lookup
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

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
      break;
    }
    case 'reject': {
      await supabase.from('submissions').delete().eq('id', id);
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
      // Delete the submission
      await supabase.from('submissions').delete().eq('id', id);
      break;
    }
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
