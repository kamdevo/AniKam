# 🎯 Supabase - Guía de Referencia Rápida

## 📝 Checklist de Configuración

```
□ 1. Crear proyecto en supabase.com
□ 2. Copiar credenciales (URL y anon key)
□ 3. Crear archivo .env con las credenciales
□ 4. Ejecutar supabase-setup-simple.sql en SQL Editor
□ 5. Desactivar "Confirm email" en Authentication > Providers > Email
□ 6. Ejecutar npm run dev
□ 7. Probar registro de usuario
□ 8. Verificar en Table Editor > profiles
```

## 🔑 Variables de Entorno

Archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...tu-clave-completa
```

## 📊 Estructura de la Base de Datos

### Tabla: `profiles`

| Columna      | Tipo        | Descripción                    |
|--------------|-------------|--------------------------------|
| `id`         | UUID (PK)   | ID del usuario (FK auth.users) |
| `username`   | TEXT        | Nombre de usuario (único)      |
| `email`      | TEXT        | Email (único)                  |
| `avatar_url` | TEXT        | URL del avatar (opcional)      |
| `created_at` | TIMESTAMP   | Fecha de creación              |
| `updated_at` | TIMESTAMP   | Última actualización           |

## 🔒 Políticas de Seguridad (RLS)

```sql
-- Ver perfil propio
"Users can view their own profile"
SELECT WHERE auth.uid() = id

-- Actualizar perfil propio  
"Users can update their own profile"
UPDATE WHERE auth.uid() = id

-- Insertar perfil propio
"Users can insert their own profile"
INSERT WHERE auth.uid() = id
```

## 🔧 Funciones Automáticas

### `handle_new_user()`
- **Trigger**: Después de INSERT en `auth.users`
- **Acción**: Crea automáticamente un perfil en `public.profiles`
- **Datos**: Extrae username del email si no se proporciona

### `handle_updated_at()`
- **Trigger**: Antes de UPDATE en `public.profiles`
- **Acción**: Actualiza el campo `updated_at` con timestamp actual

## 📡 API del Cliente (Frontend)

### Registro
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { username: 'myusername' }
  }
});
```

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Logout
```typescript
await supabase.auth.signOut();
```

### Obtener Usuario Actual
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Obtener Perfil
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

### Actualizar Perfil
```typescript
const { error } = await supabase
  .from('profiles')
  .update({ username: 'newusername' })
  .eq('id', user.id);
```

## 🐛 Debugging

### Ver logs de autenticación
```
Dashboard > Logs > Auth Logs
```

### Ver logs de base de datos
```
Dashboard > Logs > Postgres Logs
```

### Ver usuarios registrados
```
Dashboard > Authentication > Users
```

### Ver perfiles en la tabla
```
Dashboard > Table Editor > profiles
```

## 📝 Consultas SQL Útiles

### Ver todos los usuarios con perfiles
```sql
SELECT 
  u.email,
  p.username,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY p.created_at DESC;
```

### Contar usuarios
```sql
SELECT COUNT(*) FROM auth.users;
```

### Buscar usuario por email
```sql
SELECT * FROM profiles WHERE email = 'user@example.com';
```

### Eliminar usuario (y su perfil)
```sql
DELETE FROM auth.users WHERE email = 'user@example.com';
-- El perfil se elimina automáticamente (CASCADE)
```

### Actualizar avatar
```sql
UPDATE profiles 
SET avatar_url = 'https://example.com/avatar.jpg'
WHERE email = 'user@example.com';
```

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Invalid API key" | Clave incorrecta en .env | Verifica VITE_SUPABASE_ANON_KEY |
| "User already registered" | Email ya existe | Usa otro email o elimina el usuario |
| "Email not confirmed" | Confirmación activada | Desactiva en Auth > Providers > Email |
| "Cannot read properties of null" | Sesión no cargada | Limpia localStorage y recarga |
| "Violates row level security policy" | RLS mal configurado | Ejecuta de nuevo el SQL setup |

## 🔄 Flujo de Autenticación

```
┌─────────────┐
│  Registro   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ supabase.auth.signUp()  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Usuario creado en       │
│ auth.users              │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Trigger ejecuta         │
│ handle_new_user()       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Perfil creado en        │
│ public.profiles         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Usuario autenticado     │
│ automáticamente         │
└─────────────────────────┘
```

## 📚 Archivos de Referencia

| Archivo | Propósito |
|---------|-----------|
| `SUPABASE_SETUP_SIMPLE.md` | Guía completa paso a paso |
| `supabase-setup-simple.sql` | Script SQL a ejecutar |
| `supabase-verify.sql` | Verificar configuración |
| `SUPABASE_INTEGRATION.md` | Documentación técnica |
| `SUPABASE_QUICK_REFERENCE.md` | Este archivo |
| `.env.example` | Plantilla de variables |

## 🎯 Próximos Pasos

Después de configurar la autenticación básica:

1. **Biblioteca personal**: Crear tabla `user_library` para guardar anime/manga
2. **Sincronización**: Datos del usuario accesibles desde cualquier dispositivo
3. **Perfil avanzado**: Avatares, biografía, estadísticas
4. **Social auth**: Login con Google, GitHub, Discord
5. **Recuperación**: Reset password con email

## 💡 Tips

- ✅ Usa `anon` key, NO `service_role` key
- ✅ Guarda .env en .gitignore
- ✅ Reinicia el servidor después de cambiar .env
- ✅ Revisa los logs en Supabase para debugging
- ✅ El usuario demo funciona sin Supabase
- ✅ RLS protege los datos automáticamente
- ✅ Los triggers crean perfiles automáticamente

---

**¿Problemas?** → Ver `SUPABASE_SETUP_SIMPLE.md` sección "Solución de Problemas"
