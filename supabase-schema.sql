-- ============================================
-- Honey, If Only — Supabase Schema with RLS
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. MEMORIES TABLE (approved, public letters)
-- ============================================
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  color_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_memories_slug ON memories(slug);
CREATE INDEX idx_memories_created_at ON memories(created_at DESC);

-- RLS: Anyone can read, nobody can write (service role only)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON memories FOR SELECT USING (true);

-- ============================================
-- 2. SUBMISSIONS TABLE (pending review queue)
-- ============================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  color_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_hash TEXT NOT NULL,
  country TEXT DEFAULT 'Unknown',
  user_uuid TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_ip_hash ON submissions(ip_hash);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- RLS: No public access (service role only)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. BANNED USERS TABLE
-- ============================================
CREATE TABLE banned_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_hash TEXT UNIQUE NOT NULL,
  user_uuid TEXT,
  country TEXT DEFAULT 'Unknown',
  reason TEXT DEFAULT 'Banned by admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_banned_ip_hash ON banned_users(ip_hash);

-- RLS: No public access
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. JOURNAL POSTS TABLE (for SEO blog)
-- ============================================
CREATE TABLE journal_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_slug ON journal_posts(slug);
CREATE INDEX idx_journal_published ON journal_posts(published);

-- RLS: Public can read published posts only
ALTER TABLE journal_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON journal_posts FOR SELECT USING (published = true);
