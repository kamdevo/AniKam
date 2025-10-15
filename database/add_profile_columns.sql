-- Script SQL para agregar columnas de personalización de perfil
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar nuevas columnas a la tabla profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS content_filter TEXT DEFAULT 'all' CHECK (content_filter IN ('all', 'safe', 'mature')),
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es';

-- 2. Actualizar registros existentes
-- Establecer display_name desde full_name de OAuth metadata si está disponible
UPDATE profiles 
SET display_name = COALESCE(
  (SELECT (auth.users.raw_user_meta_data->>'full_name') 
   FROM auth.users 
   WHERE auth.users.id = profiles.id),
  username
)
WHERE display_name IS NULL OR display_name = '';

-- Fallback: usar username si no hay full_name
UPDATE profiles 
SET display_name = username 
WHERE display_name IS NULL OR display_name = '';

-- 3. Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_content_filter ON profiles(content_filter);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(language);
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON profiles(theme_preference);

-- 4. Actualizar políticas RLS (Row Level Security)
-- Permitir que usuarios lean su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Permitir que usuarios actualicen su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Permitir que usuarios inserten su propio perfil
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Habilitar RLS en la tabla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Agregar comentarios para documentación
COMMENT ON COLUMN profiles.display_name IS 'Nombre para mostrar (puede ser diferente al username)';
COMMENT ON COLUMN profiles.banner_url IS 'URL del banner de perfil del usuario';
COMMENT ON COLUMN profiles.bio IS 'Biografía o descripción del usuario';
COMMENT ON COLUMN profiles.content_filter IS 'Filtro de contenido: all (todo), safe (seguro), mature (maduro)';
COMMENT ON COLUMN profiles.theme_preference IS 'Preferencia de tema: light (claro), dark (oscuro), auto (automático)';
COMMENT ON COLUMN profiles.language IS 'Idioma preferido del usuario (código ISO: es, en, ja)';

-- 9. Verificar la estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 10. Verificar políticas RLS
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
WHERE tablename = 'profiles';

-- 11. Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- Mensaje de confirmación
SELECT 'Tabla profiles actualizada correctamente con columnas de personalización' as status;
