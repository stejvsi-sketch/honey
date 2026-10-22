-- Store a submitter's chosen paper design without changing existing letters.
-- Existing rows stay NULL and continue to use the original rough-paper design.
ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS paper_id TEXT;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS paper_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'memories_paper_id_check'
      AND conrelid = 'public.memories'::regclass
  ) THEN
    ALTER TABLE public.memories
      ADD CONSTRAINT memories_paper_id_check
      CHECK (paper_id IS NULL OR paper_id IN (
        'rough-paper', 'aged-torn-stack', 'distressed-lined', 'vintage-torn-pieces',
        'rough-rice-paper', 'rough-vintage-frame', 'torn-green-rough',
        'vintage-scrapbook', 'worn-aged-paring'
      )) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'submissions_paper_id_check'
      AND conrelid = 'public.submissions'::regclass
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_paper_id_check
      CHECK (paper_id IS NULL OR paper_id IN (
        'rough-paper', 'aged-torn-stack', 'distressed-lined', 'vintage-torn-pieces',
        'rough-rice-paper', 'rough-vintage-frame', 'torn-green-rough',
        'vintage-scrapbook', 'worn-aged-paring'
      )) NOT VALID;
  END IF;
END $$;
