import { NextRequest, NextResponse } from 'next/server';
import { submitMemorySchema, sanitizeText, hashIP, generateNameSlug, generateUUID } from '@/lib/validation';
import { checkProfanity } from '@/lib/profanity';
import { getRatelimit } from '@/lib/redis';

export const runtime = 'edge';

// Generate a content fingerprint for dedup: hash of (ip_hash + name + message)
async function generateContentHash(ipHash: string, name: string, message: string): Promise<string> {
  const raw = `${ipHash}:${name.toLowerCase().trim()}:${message.toLowerCase().trim()}`;
  const data = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();

    // Validate with Zod
    const parsed = submitMemorySchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, message, color_id } = parsed.data;

    // Sanitize inputs
    const cleanName = sanitizeText(name);
    const cleanMessage = sanitizeText(message);

    // Profanity check
    const nameCheck = checkProfanity(cleanName);
    if (!nameCheck.passed) {
      return NextResponse.json({ error: nameCheck.reason }, { status: 400 });
    }
    const messageCheck = checkProfanity(cleanMessage);
    if (!messageCheck.passed) {
      return NextResponse.json({ error: messageCheck.reason }, { status: 400 });
    }

    // Get IP and rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('cf-connecting-ip')
      || 'unknown';

    const ipHash = await hashIP(ip);

    // Rate limiting (if Redis configured)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const rl = getRatelimit();
        const { success } = await rl.limit(ipHash);
        if (!success) {
          return NextResponse.json(
            { error: 'You have reached your daily limit of 6 letters. Come back tomorrow.' },
            { status: 429 }
          );
        }
      } catch (err) {
        // If Redis is down, we silently bypass rate limiting to ensure the app stays up
        console.error('Redis ratelimit error:', err);
      }
    }

    // Get country from Cloudflare header
    const country = request.headers.get('cf-ipcountry') || 'Unknown';

    // Generate UUID for tracking
    const userUUID = generateUUID();
    const slug = generateNameSlug(cleanName);

    // Generate content hash for dedup
    const contentHash = await generateContentHash(ipHash, cleanName, cleanMessage);

    // Insert into Supabase submissions table (pending review)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { getSupabaseAdmin } = await import('@/lib/supabase');
      const supabase = getSupabaseAdmin();

      // Check if user is banned
      const { data: banned } = await supabase
        .from('banned_users')
        .select('id')
        .eq('ip_hash', ipHash)
        .maybeSingle();

      if (banned) {
        return NextResponse.json({ error: 'You are not allowed to submit.' }, { status: 403 });
      }

      // Deduplication: check for identical content from same IP within last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: duplicate } = await supabase
        .from('submissions')
        .select('id')
        .eq('content_hash', contentHash)
        .gte('created_at', fiveMinutesAgo)
        .maybeSingle();

      if (duplicate) {
        // Silently accept — user already sees success, no need to insert again
        return NextResponse.json({ success: true, message: 'Your letter has been received and will be reviewed shortly.' });
      }

      const { error } = await supabase.from('submissions').insert({
        name: cleanName,
        message: cleanMessage,
        color_id,
        slug,
        ip_hash: ipHash,
        country,
        user_uuid: userUUID,
        status: 'pending',
        content_hash: contentHash,
      });

      if (error) {
        console.error('Submission insert error:', error);
        return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Your letter has been received and will be reviewed shortly.' });
  } catch (err) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
