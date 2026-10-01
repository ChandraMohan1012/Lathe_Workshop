-- ========================================================
-- 5. SUPABASE STORAGE BUCKET & IMAGE UPLOAD POLICIES
-- ========================================================
-- Description: Creates 'project-images' public bucket for project photos and drawings.
-- Run this in Supabase SQL Editor.

-- Create public storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop old storage policies if they exist
DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload project images" ON storage.objects;

-- Allow anyone to view / download uploaded project images
CREATE POLICY "Public read project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

-- Allow authenticated admins to upload and manage project images
CREATE POLICY "Authenticated upload project images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');
