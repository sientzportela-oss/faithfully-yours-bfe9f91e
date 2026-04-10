
-- BUG 5: Add created_at to messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- BUG 2: Make profile-photos bucket public
UPDATE storage.buckets SET public = true WHERE id = 'profile-photos';
