-- ============================================
-- Migration: Add texture_id column
-- Adds paper texture support to memories and submissions.
-- Run this in your Supabase SQL Editor.
-- ============================================

-- 1. Add texture_id to memories table (public, approved letters)
ALTER TABLE memories ADD COLUMN IF NOT EXISTS texture_id TEXT DEFAULT NULL;

-- 2. Add texture_id to submissions table (pending review queue)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS texture_id TEXT DEFAULT NULL;

-- No index needed on texture_id — it's only used for rendering, never queried/filtered.
-- Existing letters with NULL texture_id will render with the default 'rough-paper' texture.
