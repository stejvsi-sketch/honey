-- ============================================
-- MIGRATION: Add from_name column
-- Run this in your Supabase SQL Editor
-- ============================================
-- Adds an optional "from" field to letters.
-- Writers can optionally sign their letter with a first name.

ALTER TABLE submissions ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT NULL;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS from_name TEXT DEFAULT NULL;
