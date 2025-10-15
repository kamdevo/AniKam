-- CONFIGURAR SUPABASE STORAGE PARA ANIKAM
-- Ejecutar en Supabase SQL Editor

-- 1. Crear bucket para avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Crear bucket para banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Políticas RLS para avatars
-- Permitir que usuarios autenticados suban avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    (storage.foldername(name))[2] = 'user-avatars'
  );

-- Permitir que usuarios autenticados actualicen sus avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que usuarios autenticados eliminen sus avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que todos vean los avatars (son públicos)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- 4. Políticas RLS para banners
-- Permitir que usuarios autenticados suban banners
CREATE POLICY "Users can upload their own banners" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners' AND 
    auth.uid()::text = (storage.foldername(name))[1] AND
    (storage.foldername(name))[2] = 'user-banners'
  );

-- Permitir que usuarios autenticados actualicen sus banners
CREATE POLICY "Users can update their own banners" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'banners' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que usuarios autenticados eliminen sus banners
CREATE POLICY "Users can delete their own banners" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Permitir que todos vean los banners (son públicos)
CREATE POLICY "Anyone can view banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

-- 5. Verificar que los buckets se crearon correctamente
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('avatars', 'banners');

-- 6. Verificar políticas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatar%' OR policyname LIKE '%banner%';

-- Mensaje de confirmación
SELECT 'Storage configurado correctamente para AniKam' as status;
