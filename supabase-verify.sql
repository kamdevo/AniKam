-- ============================================
-- Script de Verificación de Supabase
-- Ejecuta esto después de la configuración inicial
-- ============================================

-- 1. Verificar que la tabla profiles existe
SELECT 
  'Table profiles exists' as status,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as result;

-- 2. Verificar Row Level Security está habilitado
SELECT 
  'RLS is enabled' as status,
  rowsecurity as result
FROM pg_tables
WHERE tablename = 'profiles';

-- 3. Contar políticas de seguridad
SELECT 
  'Number of RLS policies' as status,
  COUNT(*) as result
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Ver las políticas creadas
SELECT 
  'Policy: ' || policyname as status,
  cmd as operation
FROM pg_policies
WHERE tablename = 'profiles';

-- 5. Verificar triggers
SELECT 
  'Trigger: ' || trigger_name as status,
  event_object_table as table_name
FROM information_schema.triggers
WHERE event_object_table IN ('users', 'profiles')
ORDER BY event_object_table;

-- 6. Verificar funciones
SELECT 
  'Function: ' || routine_name as status,
  routine_type as type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('handle_new_user', 'handle_updated_at');

-- 7. Verificar índices
SELECT 
  'Index: ' || indexname as status,
  tablename
FROM pg_indexes
WHERE tablename = 'profiles'
AND schemaname = 'public';

-- 8. Contar usuarios registrados
SELECT 
  'Total registered users' as status,
  COUNT(*) as result
FROM auth.users;

-- 9. Contar perfiles creados
SELECT 
  'Total profiles created' as status,
  COUNT(*) as result
FROM public.profiles;

-- 10. Ver usuarios sin perfil (debería estar vacío)
SELECT 
  'Users without profile' as status,
  COUNT(*) as result
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Si todo está bien, deberías ver:
-- - Table exists: true
-- - RLS enabled: true
-- - 3 RLS policies
-- - 2 triggers (on_auth_user_created, on_profile_updated)
-- - 2 functions (handle_new_user, handle_updated_at)
-- - 2+ indexes
-- - Users = Profiles (mismo número)
-- ============================================
