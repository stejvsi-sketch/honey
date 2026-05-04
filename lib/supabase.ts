import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton instances to avoid re-creating clients on every call
let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

// Public client (uses anon key, respects RLS)
export function getSupabaseClient(): SupabaseClient {
  if (!publicClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables');
    }
    publicClient = createClient(url, key);
  }
  return publicClient;
}

// Admin client (uses service role key, bypasses RLS) — server-only
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase admin environment variables');
    }
    adminClient = createClient(url, key);
  }
  return adminClient;
}
