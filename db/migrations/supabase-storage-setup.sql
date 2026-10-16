-- Supabase Storage Setup for Resume Photos
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fwresumebuilder',
  'fwresumebuilder',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to fwresumebuilder" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from fwresumebuilder" ON storage.objects;

-- 3. Allow public read access to all files in the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'fwresumebuilder');

-- 4. Allow anyone to upload (we'll verify userId server-side)
CREATE POLICY "Anyone can upload to fwresumebuilder"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'fwresumebuilder');

-- 5. Allow anyone to delete from fwresumebuilder (we'll verify ownership server-side)
CREATE POLICY "Anyone can delete from fwresumebuilder"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'fwresumebuilder');

-- 6. Allow anyone to update (upsert)
CREATE POLICY "Anyone can update fwresumebuilder"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'fwresumebuilder')
WITH CHECK (bucket_id = 'fwresumebuilder');

-- Verify the setup
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'fwresumebuilder';

-- View policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%fwresumebuilder%';

