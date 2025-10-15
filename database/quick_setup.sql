-- SCRIPT RÁPIDO PARA SUPABASE - Ejecutar paso a paso
-- Copia y pega cada sección por separado en Supabase SQL Editor

-- ========================================
-- PASO 1: Agregar columnas nuevas
-- ========================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS content_filter TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es';

-- ========================================
-- PASO 2: Actualizar datos existentes
-- ========================================
UPDATE profiles 
SET display_name = username 
WHERE display_name IS NULL OR display_name = '';

-- ========================================
-- PASO 3: Crear índices
-- ========================================
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_content_filter ON profiles(content_filter);

-- ========================================
-- PASO 4: Habilitar RLS y políticas
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para leer perfil propio
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política para actualizar perfil propio
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política para insertar perfil propio
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- PASO 5: Verificar que todo esté bien
-- ========================================
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('display_name', 'banner_url', 'bio', 'content_filter', 'theme_preference', 'language')
ORDER BY column_name;
