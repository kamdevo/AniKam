-- Script para actualizar la tabla profiles con los nuevos campos
-- Ejecutar en Supabase SQL Editor

-- Agregar nuevas columnas a la tabla profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS content_filter TEXT DEFAULT 'all' CHECK (content_filter IN ('all', 'safe', 'mature')),
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es';

-- Actualizar registros existentes para que display_name sea igual a username si está vacío
-- Priorizar full_name de los metadatos de OAuth si está disponible
UPDATE profiles 
SET display_name = COALESCE(
  (SELECT (auth.users.raw_user_meta_data->>'full_name') FROM auth.users WHERE auth.users.id = profiles.id),
  username
)
WHERE display_name IS NULL OR display_name = '';

-- Si no hay full_name en metadata, usar username como fallback
UPDATE profiles 
SET display_name = username 
WHERE display_name IS NULL OR display_name = '';

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_content_filter ON profiles(content_filter);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(language);

-- Actualizar la política RLS (Row Level Security) si es necesario
-- Permitir que los usuarios actualicen su propio perfil
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Permitir que los usuarios lean su propio perfil
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Permitir que los usuarios inserten su propio perfil
CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Habilitar RLS en la tabla profiles si no está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar las columnas
COMMENT ON COLUMN profiles.display_name IS 'Nombre para mostrar del usuario (puede ser diferente al username)';
COMMENT ON COLUMN profiles.banner_url IS 'URL del banner de perfil del usuario';
COMMENT ON COLUMN profiles.bio IS 'Biografía o descripción del usuario';
COMMENT ON COLUMN profiles.content_filter IS 'Filtro de contenido: all, safe, mature';
COMMENT ON COLUMN profiles.theme_preference IS 'Preferencia de tema: light, dark, auto';
COMMENT ON COLUMN profiles.language IS 'Idioma preferido del usuario (código ISO)';

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
