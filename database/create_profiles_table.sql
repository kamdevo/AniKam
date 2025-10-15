-- CREAR TABLA PROFILES COMPLETA PARA ANIKAM
-- Ejecutar en Supabase SQL Editor

-- 1. Crear la tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    content_filter TEXT DEFAULT 'all' CHECK (content_filter IN ('all', 'safe', 'mature')),
    theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    language TEXT DEFAULT 'es',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_content_filter ON profiles(content_filter);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(language);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de seguridad
-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'picture', NEW.raw_user_meta_data->>'avatar_url')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 8. Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Comentarios para documentación
COMMENT ON TABLE profiles IS 'Perfiles de usuario extendidos para AniKam';
COMMENT ON COLUMN profiles.id IS 'ID del usuario (referencia a auth.users)';
COMMENT ON COLUMN profiles.username IS 'Nombre de usuario único';
COMMENT ON COLUMN profiles.display_name IS 'Nombre para mostrar (puede ser diferente al username)';
COMMENT ON COLUMN profiles.email IS 'Email del usuario';
COMMENT ON COLUMN profiles.avatar_url IS 'URL del avatar (imagen de perfil)';
COMMENT ON COLUMN profiles.banner_url IS 'URL del banner de perfil';
COMMENT ON COLUMN profiles.bio IS 'Biografía del usuario';
COMMENT ON COLUMN profiles.content_filter IS 'Filtro de contenido: all, safe, mature';
COMMENT ON COLUMN profiles.theme_preference IS 'Preferencia de tema: light, dark, auto';
COMMENT ON COLUMN profiles.language IS 'Idioma preferido (es, en, ja)';

-- 10. Verificar que todo se creó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Mensaje de confirmación
SELECT 'Tabla profiles creada correctamente para AniKam' as status;
