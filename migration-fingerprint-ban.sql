-- ============================================
-- Migration: Add browser fingerprint tracking
-- for multi-signal ban enforcement
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add fingerprint_hash to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_submissions_fingerprint ON submissions(fingerprint_hash)
  WHERE fingerprint_hash IS NOT NULL;

-- Add fingerprint_hash to banned_users table
ALTER TABLE banned_users ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_banned_fingerprint ON banned_users(fingerprint_hash)
  WHERE fingerprint_hash IS NOT NULL;

-- Add content_hash to submissions if not already present
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS content_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_submissions_content_hash ON submissions(content_hash);
