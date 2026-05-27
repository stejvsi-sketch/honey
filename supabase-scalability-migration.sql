-- ============================================
-- Honey, If Only — Scalability Migration
-- Run this in your Supabase SQL Editor
-- Prepares database for 1M+ rows
-- ============================================

-- 1. Index on color_id for color filter pages
-- Without this, filtering by color scans the entire table
CREATE INDEX IF NOT EXISTS idx_memories_color_id
  ON memories(color_id);

-- 2. Composite index for collection search (ILIKE on message)
-- GIN trigram index enables fast ILIKE/pattern matching on message text
CREATE INDEX IF NOT EXISTS idx_memories_message_trgm
  ON memories USING gin (message gin_trgm_ops);

-- 3. Composite index for submissions status + created_at
-- Speeds up admin panel queries that filter by status and sort by date
CREATE INDEX IF NOT EXISTS idx_submissions_status_created
  ON submissions(status, created_at DESC);

-- 4. Verify pg_trgm extension is enabled (needed for trigram indexes)
-- This should already exist from initial schema, but just in case
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
