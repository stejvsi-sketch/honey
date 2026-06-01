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
      // Remove from submissions queue (no need to keep — banning happens from pending only)
      await supabase.from('submissions').delete().eq('id', id);
      break;
    }
    case 'reject': {
      await supabase.from('submissions').delete().eq('id', id);
      break;
    }
    case 'ban': {
      // Add to banned_users with BOTH ip_hash and fingerprint_hash
      const banData: Record<string, string> = {
        ip_hash: submission.ip_hash,
        country: submission.country || 'Unknown',
        reason: 'Banned by admin',
      };

      // Include fingerprint if available on the submission
      if (submission.fingerprint_hash) {
        banData.fingerprint_hash = submission.fingerprint_hash;
      }
      if (submission.user_uuid) {
        banData.user_uuid = submission.user_uuid;
      }

      await supabase.from('banned_users').upsert(banData, { onConflict: 'ip_hash' });

      // ── Bulk-reject: delete ALL pending submissions from the same person ──
      // Strategy: use fingerprint as primary identifier (per-browser, safe for
      // shared networks like dorms/offices). Only fall back to IP-based bulk
      // delete when no fingerprint is available.
      if (submission.fingerprint_hash) {
        // Fingerprint available — delete by fingerprint (catches across IPs)
        await supabase
          .from('submissions')
          .delete()
          .eq('status', 'pending')
          .eq('fingerprint_hash', submission.fingerprint_hash);
      } else {
        // No fingerprint (old submission or JS blocked) — fall back to IP only
        // This is less safe on shared networks, but it's the only signal we have
        await supabase
          .from('submissions')
          .delete()
          .eq('status', 'pending')
          .eq('ip_hash', submission.ip_hash);
      }

      break;
    }
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
