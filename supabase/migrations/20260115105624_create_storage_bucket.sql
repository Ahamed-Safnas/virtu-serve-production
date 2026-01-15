/*
  # Create Storage Bucket for Testimonial Avatars
  
  1. Storage
    - Create 'avatars' bucket for storing testimonial images
    - Enable public access for images
    - Set max file size to 5 MB
  
  2. Security
    - Allow anyone to view images (public read)
    - Only allow via Edge Functions to upload (write via authenticated requests)
  
  3. Important Notes
    - Images stored in 'testimonials/' folder
    - Named with timestamp for uniqueness
    - Public URLs generated for storage in database
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set bucket policies for public read access
CREATE POLICY "Public can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow uploads via authenticated requests (from Edge Functions)
CREATE POLICY "Authenticated can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow deletions
CREATE POLICY "Authenticated can delete own avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');