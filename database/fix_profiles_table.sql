-- ARREGLAR TABLA PROFILES - Agregar columnas faltantes
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Agregar columnas faltantes (solo si no existen)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS content_filter TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Agregar restricciones si no existen
DO $$
BEGIN
    -- Agregar check constraint para content_filter
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_content_filter_check'
    ) THEN
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_content_filter_check 
        CHECK (content_filter IN ('all', 'safe', 'mature'));
    END IF;
    
    -- Agregar check constraint para theme_preference
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_theme_preference_check'
    ) THEN
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_theme_preference_check 
        CHECK (theme_preference IN ('light', 'dark', 'auto'));
    END IF;
END $$;

-- 4. Actualizar registros existentes
-- Establecer display_name desde full_name de OAuth si está disponible
UPDATE profiles 
SET display_name = COALESCE(
    (SELECT (auth.users.raw_user_meta_data->>'full_name') 
     FROM auth.users 
     WHERE auth.users.id = profiles.id),
    username
)
WHERE display_name IS NULL OR display_name = '';

-- 5. Crear índices faltantes
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_content_filter ON profiles(content_filter);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(language);

-- 6. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Habilitar RLS si no está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 9. Crear políticas RLS (solo si no existen)
DO $$
BEGIN
    -- Política para SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;
    
    -- Política para INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Política para UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- 10. Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 11. Verificar políticas RLS
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Mensaje de confirmación
SELECT 'Tabla profiles actualizada correctamente' as status;
