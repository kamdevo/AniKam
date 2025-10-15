-- CONFIGURACIÓN SIMPLE DE STORAGE PARA ANIKAM
-- Ejecutar paso a paso en Supabase SQL Editor

-- PASO 1: Crear buckets (ejecutar primero)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- PASO 2: Verificar que se crearon los buckets
SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'banners');

-- PASO 3: Crear políticas básicas para avatars
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can update own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can delete own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- PASO 4: Crear políticas básicas para banners
CREATE POLICY IF NOT EXISTS "Public Access Banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can update own banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Users can delete own banners" ON storage.objects FOR DELETE USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- PASO 5: Verificar políticas
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
