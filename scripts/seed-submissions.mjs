#!/usr/bin/env node
// =============================================================
// seed-submissions.mjs
// GitHub Actions cron runner — inserts 1-5 fake submissions
// per run into the Supabase submissions table.
//
// 🧹 CLEANUP (after ~4 months / Oct 2026):
//   Delete these files:
//     - scripts/generate-messages.mjs
//     - scripts/seed-messages.json
//     - scripts/seed-submissions.mjs  (this file)
//     - .github/workflows/seed-submissions.yml
//   Also remove GitHub Secrets:
//     - SUPABASE_SERVICE_ROLE_KEY (if not used elsewhere)
// =============================================================

import { createHash, randomUUID } from 'crypto';

const isDryRun = process.argv.includes('--dry-run');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!isDryRun && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}


// ─── CONFIG ──────────────────────────────────────────────────
const TARGET_TOTAL = 10000;
const MIN_BATCH = 1;
const MAX_BATCH = 5;
const MIN_DELAY_MS = 2000;  // 2 seconds
const MAX_DELAY_MS = 15000; // 15 seconds
const SKIP_CHANCE = 0.20;   // 20% chance to skip a run entirely

// Weighted country distribution (top countries for English confessions sites)
const COUNTRIES = [
  { code: 'US', weight: 25 },
  { code: 'IN', weight: 18 },
  { code: 'GB', weight: 10 },
  { code: 'PH', weight: 8 },
  { code: 'CA', weight: 6 },
  { code: 'AU', weight: 5 },
  { code: 'BR', weight: 4 },
  { code: 'NG', weight: 3 },
  { code: 'DE', weight: 3 },
  { code: 'FR', weight: 3 },
  { code: 'PK', weight: 3 },
  { code: 'ID', weight: 2 },
  { code: 'MX', weight: 2 },
  { code: 'KR', weight: 2 },
  { code: 'JP', weight: 1 },
  { code: 'TR', weight: 1 },
  { code: 'ZA', weight: 1 },
  { code: 'AE', weight: 1 },
  { code: 'SG', weight: 1 },
  { code: 'Unknown', weight: 1 },
];

// ─── UTILITIES ───────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * totalWeight;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.code;
  }
  return items[items.length - 1].code;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

// ─── SUPABASE REST API ───────────────────────────────────────
// Use direct REST calls instead of the SDK to avoid needing node_modules in CI.

async function supabaseQuery(method, table, params = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);

  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=minimal' : 'return=representation',
  };

  if (method === 'GET') {
    // Add query params
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    // For HEAD count queries
    if (params._head) {
      headers['Prefer'] = 'count=exact';
      delete params._head;
    }
  }

  const options = {
    method,
    headers,
  };

  if (method === 'POST') {
    options.body = JSON.stringify(params.body);
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${method} ${table} failed (${response.status}): ${text}`);
  }

  if (method === 'HEAD') {
    // Extract count from content-range header
    const range = response.headers.get('content-range');
    if (range) {
      const total = range.split('/')[1];
      return parseInt(total, 10) || 0;
    }
    return 0;
  }

  if (method === 'POST' && headers['Prefer'] === 'return=minimal') {
    return null;
  }

  return response.json();
}

async function countSeededSubmissions() {
  // Count submissions where ip_hash starts with 'seed_'
  const url = new URL(`${SUPABASE_URL}/rest/v1/submissions`);
  url.searchParams.set('ip_hash', 'like.seed_%');
  url.searchParams.set('select', 'id');

  const response = await fetch(url.toString(), {
    method: 'HEAD',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'count=exact',
    },
  });

  const range = response.headers.get('content-range');
  if (range) {
    const total = range.split('/')[1];
    return parseInt(total, 10) || 0;
  }
  return 0;
}

async function insertSubmission(entry) {
  const ipHash = `seed_${await sha256(randomUUID())}`;
  const contentHash = await sha256(`${ipHash}:${entry.name.toLowerCase()}:${entry.message.toLowerCase()}`);
  const userUuid = randomUUID();
  const slug = generateSlug(entry.name);
  const country = weightedRandom(COUNTRIES);

  await supabaseQuery('POST', 'submissions', {
    body: {
      name: entry.name,
      message: entry.message,
      color_id: entry.color_id,
      slug,
      ip_hash: ipHash,
      country,
      user_uuid: userUuid,
      status: 'pending',
      content_hash: contentHash,
    },
  });
}

// ─── MAIN ────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Honey, If Only — Submission Seeder');
  console.log(`   Time: ${new Date().toISOString()}`);

  if (isDryRun) {
    console.log('   Mode: DRY RUN (no database writes)\n');
  }

  // Random skip (~20% of runs do nothing — simulates quiet hours)
  if (!isDryRun && Math.random() < SKIP_CHANCE) {
    console.log('   ⏭ Randomly skipping this run (simulating quiet period).');
    return;
  }

  // Count existing seeded submissions
  let seededCount = 0;
  if (!isDryRun) {
    seededCount = await countSeededSubmissions();
    console.log(`   Seeded so far: ${seededCount} / ${TARGET_TOTAL}`);

    if (seededCount >= TARGET_TOTAL) {
      console.log('   ✅ Target reached! All 10,000 submissions have been seeded.');
      return;
    }
  }

  // Load message pool
  const { readFileSync } = await import('fs');
  const { fileURLToPath } = await import('url');
  const { dirname, join } = await import('path');
  const __filename2 = fileURLToPath(import.meta.url);
  const __dirname2 = dirname(__filename2);
  const allMessages = JSON.parse(readFileSync(join(__dirname2, 'seed-messages.json'), 'utf-8'));

  if (!allMessages || allMessages.length === 0) {
    console.error('❌ seed-messages.json is empty or not found.');
    process.exit(1);
  }

  // Determine batch size
  const remaining = TARGET_TOTAL - seededCount;
  const batchSize = Math.min(randomInt(MIN_BATCH, MAX_BATCH), remaining);
  console.log(`   Batch size: ${batchSize}`);

  // Pick random entries from the pool (we pick randomly, not sequentially,
  // because tracking exact index across runs would require persistent state)
  const shuffled = [...allMessages].sort(() => Math.random() - 0.5);
  const batch = shuffled.slice(0, batchSize);

  for (let i = 0; i < batch.length; i++) {
    const entry = batch[i];

    if (isDryRun) {
      console.log(`   [DRY] Would insert: To: ${entry.name} | "${entry.message.substring(0, 50)}..." | Color: ${entry.color_id}`);
    } else {
      try {
        await insertSubmission(entry);
        console.log(`   ✓ [${i + 1}/${batchSize}] Inserted: To: ${entry.name} | "${entry.message.substring(0, 40)}..."`);
      } catch (err) {
        console.error(`   ✗ [${i + 1}/${batchSize}] Failed: ${err.message}`);
      }
    }

    // Wait between entries (simulates human typing)
    if (i < batch.length - 1) {
      const delay = randomInt(MIN_DELAY_MS, MAX_DELAY_MS);
      console.log(`   ⏳ Waiting ${(delay / 1000).toFixed(1)}s...`);
      if (!isDryRun) {
        await sleep(delay);
      }
    }
  }

  const newTotal = isDryRun ? seededCount : seededCount + batchSize;
  console.log(`\n   📊 Progress: ${newTotal} / ${TARGET_TOTAL} (${((newTotal / TARGET_TOTAL) * 100).toFixed(1)}%)`);
  console.log('   🌱 Done.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
