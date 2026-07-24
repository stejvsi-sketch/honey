-- ============================================
-- MIGRATION: Add wish_reply column for Flip Cards
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add wish_reply to submissions table (pending queue)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS wish_reply TEXT DEFAULT NULL;

-- Add wish_reply to memories table (approved letters)
ALTER TABLE memories ADD COLUMN IF NOT EXISTS wish_reply TEXT DEFAULT NULL;
